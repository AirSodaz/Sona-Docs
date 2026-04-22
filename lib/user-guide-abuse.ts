import 'server-only';

import {
  createHash,
  createHmac,
  randomUUID,
  timingSafeEqual,
} from 'node:crypto';
import type { NextRequest, NextResponse } from 'next/server';
import { getPublicSiteUrl } from '@/lib/site-url';

const SESSION_COOKIE_NAME = 'sona_guide_session';
const VERIFIED_COOKIE_NAME = 'sona_guide_verified';
const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const VERIFIED_COOKIE_MAX_AGE_SECONDS = 60 * 30;
const ANON_LIMIT = 3;
const ANON_WINDOW_MS = 10 * 60 * 1000;
const VERIFIED_LIMIT = 10;
const VERIFIED_WINDOW_MS = 30 * 60 * 1000;
const CHALLENGE_FAILURE_LIMIT = 3;
const CHALLENGE_FAILURE_WINDOW_MS = 10 * 60 * 1000;
const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TURNSTILE_VERIFY_TIMEOUT_MS = 5000;
export const USER_GUIDE_TURNSTILE_ACTION = 'user_guide_chat';

type SignedVerifiedRecord = {
  exp: number;
  sid: string;
  v: 1;
};

export type UserGuideAbuseSession = {
  basicCount: number;
  basicWindowStart: number;
  challengeFailureCount: number;
  challengeFailureWindowStart: number;
  id: string;
  issuedAt: number;
  v: 1;
  verifiedCount: number;
  verifiedWindowStart: number;
};

export type UserGuideRequestGuardResult =
  | {
      host: string;
      ok: true;
      originHost: string | null;
      referrerHost: string | null;
      secFetchSite: string | null;
    }
  | {
      host: string | null;
      ok: false;
      originHost: string | null;
      reason:
        | 'cross_site'
        | 'host_not_allowed'
        | 'invalid_host'
        | 'missing_origin'
        | 'origin_mismatch';
      referrerHost: string | null;
      secFetchSite: string | null;
    };

type TurnstileSiteVerifyResponse = {
  action?: string;
  'error-codes'?: string[];
  hostname?: string;
  success?: boolean;
};

type TurnstileValidationResult =
  | {
      hostname: string | null;
      ok: true;
    }
  | {
      errorCodes: string[];
      hostname: string | null;
      ok: false;
      reason:
        | 'action_mismatch'
        | 'hostname_mismatch'
        | 'invalid'
        | 'network_error'
        | 'verification_failed';
    };

function getApiAbuseSecret() {
  const configuredSecret = process.env.API_ABUSE_SECRET?.trim();

  if (configuredSecret) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'sona-docs-dev-only-api-abuse-secret';
  }

  return null;
}

function normalizeWindow(start: number, now: number, windowMs: number) {
  return now - start >= windowMs ? now : start;
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signValue(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function encodeSignedCookie(payload: object, secret: string) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signValue(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

function decodeSignedCookie<T>(value: string | undefined, secret: string) {
  if (!value) {
    return null;
  }

  const dotIndex = value.lastIndexOf('.');
  if (dotIndex <= 0) {
    return null;
  }

  const encodedPayload = value.slice(0, dotIndex);
  const signature = value.slice(dotIndex + 1);
  const expectedSignature = signValue(encodedPayload, secret);
  const signatureBuffer = Buffer.from(signature, 'utf8');
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    return JSON.parse(base64UrlDecode(encodedPayload)) as T;
  } catch {
    return null;
  }
}

function isLocalHostname(hostname: string) {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '::1'
  );
}

function normalizeHost(value: null | string | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return new URL(
      trimmed.startsWith('http://') || trimmed.startsWith('https://')
        ? trimmed
        : `https://${trimmed}`,
    ).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function getConfiguredAllowedHosts() {
  const hosts = new Set<string>();
  const configuredHosts = process.env.ALLOWED_PUBLIC_HOSTS?.split(',') ?? [];

  for (const host of configuredHosts) {
    const normalized = normalizeHost(host);
    if (normalized) {
      hosts.add(normalized);
    }
  }

  const publicSiteUrl = getPublicSiteUrl();
  if (publicSiteUrl) {
    hosts.add(publicSiteUrl.hostname.toLowerCase());
  }

  if (process.env.NODE_ENV !== 'production') {
    hosts.add('localhost');
    hosts.add('127.0.0.1');
    hosts.add('0.0.0.0');
    hosts.add('::1');
  }

  return hosts;
}

function createSession(now: number): UserGuideAbuseSession {
  return {
    basicCount: 0,
    basicWindowStart: now,
    challengeFailureCount: 0,
    challengeFailureWindowStart: now,
    id: randomUUID(),
    issuedAt: now,
    v: 1,
    verifiedCount: 0,
    verifiedWindowStart: now,
  };
}

function normalizeSession(
  session: UserGuideAbuseSession,
  now: number,
): UserGuideAbuseSession {
  const nextSession = { ...session };

  if (normalizeWindow(nextSession.basicWindowStart, now, ANON_WINDOW_MS) === now) {
    nextSession.basicWindowStart = now;
    nextSession.basicCount = 0;
  }

  if (
    normalizeWindow(nextSession.verifiedWindowStart, now, VERIFIED_WINDOW_MS) === now
  ) {
    nextSession.verifiedWindowStart = now;
    nextSession.verifiedCount = 0;
  }

  if (
    normalizeWindow(
      nextSession.challengeFailureWindowStart,
      now,
      CHALLENGE_FAILURE_WINDOW_MS,
    ) === now
  ) {
    nextSession.challengeFailureWindowStart = now;
    nextSession.challengeFailureCount = 0;
  }

  return nextSession;
}

function isUserGuideSession(value: unknown): value is UserGuideAbuseSession {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const session = value as Record<string, unknown>;

  return (
    session.v === 1 &&
    typeof session.id === 'string' &&
    typeof session.issuedAt === 'number' &&
    typeof session.basicWindowStart === 'number' &&
    typeof session.basicCount === 'number' &&
    typeof session.verifiedWindowStart === 'number' &&
    typeof session.verifiedCount === 'number' &&
    typeof session.challengeFailureWindowStart === 'number' &&
    typeof session.challengeFailureCount === 'number'
  );
}

function isVerifiedRecord(value: unknown): value is SignedVerifiedRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    record.v === 1 &&
    typeof record.sid === 'string' &&
    typeof record.exp === 'number'
  );
}

export function getUserGuideTurnstileSiteKey() {
  const siteKey = process.env.TURNSTILE_SITE_KEY?.trim();

  return siteKey || null;
}

export function isUserGuideAbuseProtectionConfigured() {
  return Boolean(
    getApiAbuseSecret() &&
      process.env.TURNSTILE_SECRET_KEY?.trim() &&
      getUserGuideTurnstileSiteKey(),
  );
}

export function readUserGuideSession(request: NextRequest) {
  const now = Date.now();
  const secret = getApiAbuseSecret();

  if (!secret) {
    return null;
  }

  const decodedSession = decodeSignedCookie<UserGuideAbuseSession>(
    request.cookies.get(SESSION_COOKIE_NAME)?.value,
    secret,
  );
  const session = isUserGuideSession(decodedSession)
    ? normalizeSession(decodedSession, now)
    : createSession(now);
  const decodedVerifiedRecord = decodeSignedCookie<SignedVerifiedRecord>(
    request.cookies.get(VERIFIED_COOKIE_NAME)?.value,
    secret,
  );
  const verifiedRecord = isVerifiedRecord(decodedVerifiedRecord)
    ? decodedVerifiedRecord
    : null;
  const verified =
    Boolean(verifiedRecord) &&
    verifiedRecord!.sid === session.id &&
    verifiedRecord!.exp > now;

  return {
    now,
    secret,
    session,
    verified,
    verifiedRecord,
  };
}

export function getUserGuideSessionFingerprint(sessionId: string) {
  const secret = getApiAbuseSecret();
  const hash = createHash('sha256');

  hash.update(secret ?? 'missing-secret');
  hash.update(':');
  hash.update(sessionId);

  return hash.digest('hex').slice(0, 16);
}

export function registerUserGuideAttempt({
  session,
  verified,
}: {
  session: UserGuideAbuseSession;
  verified: boolean;
}) {
  if (verified) {
    session.verifiedCount += 1;
    return;
  }

  session.basicCount += 1;
}

export function registerUserGuideChallengeFailure(
  session: UserGuideAbuseSession,
  now: number,
) {
  session.challengeFailureWindowStart = normalizeWindow(
    session.challengeFailureWindowStart,
    now,
    CHALLENGE_FAILURE_WINDOW_MS,
  );

  if (session.challengeFailureWindowStart === now) {
    session.challengeFailureCount = 0;
  }

  session.challengeFailureCount += 1;
}

export function clearUserGuideChallengeFailures(
  session: UserGuideAbuseSession,
  now: number,
) {
  session.challengeFailureWindowStart = now;
  session.challengeFailureCount = 0;
}

export function promoteUserGuideSessionVerification(
  session: UserGuideAbuseSession,
  now: number,
) {
  session.verifiedWindowStart = now;
  session.verifiedCount = 0;
  clearUserGuideChallengeFailures(session, now);
}

export function shouldUserGuideChallenge({
  session,
  verified,
}: {
  session: UserGuideAbuseSession;
  verified: boolean;
}) {
  return verified
    ? session.verifiedCount >= VERIFIED_LIMIT
    : session.basicCount >= ANON_LIMIT;
}

export function isUserGuideThrottled(session: UserGuideAbuseSession) {
  return session.challengeFailureCount >= CHALLENGE_FAILURE_LIMIT;
}

export function applyUserGuideSessionCookies({
  clearVerifiedCookie = false,
  response,
  session,
  verifiedUntil,
}: {
  clearVerifiedCookie?: boolean;
  response: NextResponse;
  session: UserGuideAbuseSession;
  verifiedUntil?: number;
}) {
  const secret = getApiAbuseSecret();
  if (!secret) {
    return response;
  }

  response.cookies.set({
    httpOnly: true,
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
    name: SESSION_COOKIE_NAME,
    path: '/api/user-guide-chat',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    value: encodeSignedCookie(session, secret),
  });

  if (verifiedUntil) {
    response.cookies.set({
      httpOnly: true,
      maxAge: VERIFIED_COOKIE_MAX_AGE_SECONDS,
      name: VERIFIED_COOKIE_NAME,
      path: '/api/user-guide-chat',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      value: encodeSignedCookie(
        {
          exp: verifiedUntil,
          sid: session.id,
          v: 1,
        } satisfies SignedVerifiedRecord,
        secret,
      ),
    });
  } else if (clearVerifiedCookie) {
    response.cookies.set({
      httpOnly: true,
      maxAge: 0,
      name: VERIFIED_COOKIE_NAME,
      path: '/api/user-guide-chat',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      value: '',
    });
  }

  return response;
}

export function getUserGuideRequestGuard(
  request: NextRequest,
): UserGuideRequestGuardResult {
  const allowedHosts = getConfiguredAllowedHosts();
  const requestHost = normalizeHost(
    request.headers.get('x-forwarded-host') ??
      request.headers.get('host') ??
      request.nextUrl.hostname,
  );
  const originHost = normalizeHost(request.headers.get('origin'));
  const referrerHost = normalizeHost(request.headers.get('referer'));
  const secFetchSite = request.headers.get('sec-fetch-site')?.toLowerCase() ?? null;

  if (!requestHost) {
    return {
      host: null,
      ok: false,
      originHost,
      reason: 'invalid_host',
      referrerHost,
      secFetchSite,
    };
  }

  if (!allowedHosts.has(requestHost)) {
    return {
      host: requestHost,
      ok: false,
      originHost,
      reason: 'host_not_allowed',
      referrerHost,
      secFetchSite,
    };
  }

  if (
    secFetchSite &&
    secFetchSite !== 'same-origin' &&
    secFetchSite !== 'same-site' &&
    secFetchSite !== 'none'
  ) {
    return {
      host: requestHost,
      ok: false,
      originHost,
      reason: 'cross_site',
      referrerHost,
      secFetchSite,
    };
  }

  if (originHost) {
    return originHost === requestHost
      ? {
          host: requestHost,
          ok: true,
          originHost,
          referrerHost,
          secFetchSite,
        }
      : {
          host: requestHost,
          ok: false,
          originHost,
          reason: 'origin_mismatch',
          referrerHost,
          secFetchSite,
        };
  }

  if (referrerHost) {
    return referrerHost === requestHost
      ? {
          host: requestHost,
          ok: true,
          originHost,
          referrerHost,
          secFetchSite,
        }
      : {
          host: requestHost,
          ok: false,
          originHost,
          reason: 'origin_mismatch',
          referrerHost,
          secFetchSite,
        };
  }

  if (
    process.env.NODE_ENV !== 'production' &&
    isLocalHostname(requestHost)
  ) {
    return {
      host: requestHost,
      ok: true,
      originHost,
      referrerHost,
      secFetchSite,
    };
  }

  if (secFetchSite === 'same-origin' || secFetchSite === 'same-site') {
    return {
      host: requestHost,
      ok: true,
      originHost,
      referrerHost,
      secFetchSite,
    };
  }

  return {
    host: requestHost,
    ok: false,
    originHost,
    reason: 'missing_origin',
    referrerHost,
    secFetchSite,
  };
}

export function getUserGuideRemoteIp(request: NextRequest) {
  const cfConnectingIp = request.headers.get('cf-connecting-ip')?.trim();
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  if (!forwardedFor) {
    return null;
  }

  const first = forwardedFor
    .split(',')
    .map((value) => value.trim())
    .find(Boolean);

  return first ?? null;
}

export async function verifyUserGuideTurnstileToken({
  remoteIp,
  requestHost,
  token,
}: {
  remoteIp: null | string;
  requestHost: string;
  token: string;
}): Promise<TurnstileValidationResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    return {
      errorCodes: ['missing-secret'],
      hostname: null,
      ok: false,
      reason: 'verification_failed',
    };
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      body: JSON.stringify({
        idempotency_key: randomUUID(),
        remoteip: remoteIp ?? undefined,
        response: token,
        secret,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      signal: AbortSignal.timeout(TURNSTILE_VERIFY_TIMEOUT_MS),
    });

    if (!response.ok) {
      return {
        errorCodes: [`http-${response.status}`],
        hostname: null,
        ok: false,
        reason: 'verification_failed',
      };
    }

    const payload = (await response.json()) as TurnstileSiteVerifyResponse;
    const hostname = payload.hostname?.toLowerCase() ?? null;
    const errorCodes = payload['error-codes'] ?? [];

    if (!payload.success) {
      return {
        errorCodes,
        hostname,
        ok: false,
        reason: 'invalid',
      };
    }

    if (payload.action && payload.action !== USER_GUIDE_TURNSTILE_ACTION) {
      return {
        errorCodes: errorCodes.length > 0 ? errorCodes : ['action-mismatch'],
        hostname,
        ok: false,
        reason: 'action_mismatch',
      };
    }

    if (hostname && hostname !== requestHost) {
      return {
        errorCodes: errorCodes.length > 0 ? errorCodes : ['hostname-mismatch'],
        hostname,
        ok: false,
        reason: 'hostname_mismatch',
      };
    }

    return {
      hostname,
      ok: true,
    };
  } catch {
    return {
      errorCodes: ['network-error'],
      hostname: null,
      ok: false,
      reason: 'network_error',
    };
  }
}
