import type { GenerateContentResponse } from '@google/genai';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { HomeLocale } from '@/lib/homepage-content';
import {
  applyUserGuideSessionCookies,
  clearUserGuideChallengeFailures,
  getUserGuideRemoteIp,
  getUserGuideRequestGuard,
  getUserGuideSessionFingerprint,
  isUserGuideThrottled,
  promoteUserGuideSessionVerification,
  readUserGuideSession,
  registerUserGuideAttempt,
  registerUserGuideChallengeFailure,
  shouldUserGuideChallenge,
  verifyUserGuideTurnstileToken,
} from '@/lib/user-guide-abuse';
import {
  buildUserGuideSystemInstruction,
  buildUserGuideUserPrompt,
  getUserGuideAiContext,
  getUserGuideChatModel,
  isUserGuideAiEnabled,
} from '@/lib/user-guide-ai';
import {
  getGeminiClient,
  getGeminiTransportDiagnostics,
} from '@/lib/user-guide-gemini';
import {
  getUserGuidePageById,
  isUserGuidePageId,
  type UserGuidePageId,
} from '@/lib/user-guide-content';

export const runtime = 'nodejs';

const MAX_QUESTION_LENGTH = 1200;
const MAX_HISTORY_MESSAGES = 6;
const MAX_HISTORY_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_TOTAL_LENGTH = 4000;
const MAX_TURNSTILE_TOKEN_LENGTH = 2048;
const MAX_ANSWER_LENGTH = 4000;
const MAX_SOURCE_LINKS = 3;
const MAX_NEXT_LINKS = 2;
const GEMINI_TIMEOUT_MS = 12000;
const VERIFIED_WINDOW_MS = 30 * 60 * 1000;

type ChatRole = 'assistant' | 'user';
type RouteErrorCode =
  | 'challenge_required'
  | 'disabled'
  | 'empty_response'
  | 'forbidden_origin'
  | 'invalid_request'
  | 'network_unreachable'
  | 'throttled'
  | 'upstream_error';

type ChatHistoryItem = {
  content: string;
  role: ChatRole;
};

type GuideAssistantPageLink = {
  id: UserGuidePageId;
  path: string;
  title: string;
};

type StructuredGuideAssistantAnswer = {
  answer: string;
  nextPageIds: UserGuidePageId[];
  sourcePageIds: UserGuidePageId[];
};

class EmptyGeminiResponseError extends Error {
  constructor() {
    super('Gemini replied without usable answer text.');
    this.name = 'EmptyGeminiResponseError';
  }
}

function isHomeLocale(value: unknown): value is HomeLocale {
  return value === 'en' || value === 'zh-CN';
}

function withGeminiTimeout<T>(promise: Promise<T>) {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Gemini request timed out after ${GEMINI_TIMEOUT_MS}ms.`));
    }, GEMINI_TIMEOUT_MS);

    promise
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
) {
  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'no-store',
    },
    status,
  });
}

function jsonError(status: number, code: RouteErrorCode, error: string) {
  return jsonResponse({ code, error }, status);
}

function sanitizeText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLength);
}

function sanitizeHistory(value: unknown): ChatHistoryItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const normalized = value
    .flatMap((item) => {
      if (!item || typeof item !== 'object') {
        return [];
      }

      const role = 'role' in item ? item.role : null;
      const content =
        'content' in item
          ? sanitizeText(item.content, MAX_HISTORY_MESSAGE_LENGTH)
          : null;

      if ((role !== 'user' && role !== 'assistant') || !content) {
        return [];
      }

      return [{ content, role }];
    })
    .slice(-MAX_HISTORY_MESSAGES);

  let totalLength = 0;
  const limited: ChatHistoryItem[] = [];

  for (let index = normalized.length - 1; index >= 0; index -= 1) {
    const item = normalized[index];
    const remaining = MAX_HISTORY_TOTAL_LENGTH - totalLength;

    if (remaining <= 0) {
      break;
    }

    if (item.content.length > remaining) {
      limited.unshift({
        ...item,
        content: item.content.slice(item.content.length - remaining),
      });
      break;
    }

    limited.unshift(item);
    totalLength += item.content.length;
  }

  return limited;
}

function sanitizeTurnstileToken(value: unknown) {
  return sanitizeText(value, MAX_TURNSTILE_TOKEN_LENGTH);
}

function buildHistoryContents(history: ChatHistoryItem[]) {
  return history.map((item) => ({
    parts: [{ text: item.content }],
    role: item.role === 'assistant' ? 'model' : 'user',
  }));
}

function extractResponseText(response: GenerateContentResponse) {
  const directText = response.text?.trim();

  if (directText) {
    return directText;
  }

  const candidateText = response.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .flatMap((part) =>
      typeof part.text === 'string' ? [part.text.trim()] : [],
    )
    .filter(Boolean)
    .join('\n\n');

  if (candidateText) {
    return candidateText;
  }

  throw new EmptyGeminiResponseError();
}

function stripJsonCodeFence(text: string) {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);

  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

function normalizePageIds({
  exclude,
  max,
  value,
}: {
  exclude?: Set<UserGuidePageId>;
  max: number;
  value: unknown;
}) {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<UserGuidePageId>();
  const ids: UserGuidePageId[] = [];

  for (const item of value) {
    if (typeof item !== 'string' || !isUserGuidePageId(item)) {
      continue;
    }

    if (exclude?.has(item) || seen.has(item)) {
      continue;
    }

    seen.add(item);
    ids.push(item);

    if (ids.length >= max) {
      break;
    }
  }

  return ids;
}

function parseStructuredGuideAssistantAnswer(
  response: GenerateContentResponse,
): StructuredGuideAssistantAnswer {
  const responseText = extractResponseText(response);
  const jsonText = stripJsonCodeFence(responseText);

  try {
    const parsed = JSON.parse(jsonText) as Record<string, unknown>;
    const answer = sanitizeText(parsed.answer, MAX_ANSWER_LENGTH);

    if (!answer) {
      throw new EmptyGeminiResponseError();
    }

    return {
      answer,
      nextPageIds: normalizePageIds({
        max: MAX_NEXT_LINKS,
        value: parsed.nextPageIds,
      }),
      sourcePageIds: normalizePageIds({
        max: MAX_SOURCE_LINKS,
        value: parsed.sourcePageIds,
      }),
    };
  } catch (error) {
    if (error instanceof EmptyGeminiResponseError) {
      throw error;
    }

    return {
      answer: responseText,
      nextPageIds: [],
      sourcePageIds: [],
    };
  }
}

function getAssistantPageLink(
  locale: HomeLocale,
  pageId: UserGuidePageId,
): GuideAssistantPageLink {
  const page = getUserGuidePageById(locale, pageId);

  return {
    id: page.id,
    path: page.path,
    title: page.title,
  };
}

function getFallbackNextPageIds(locale: HomeLocale, pageId: UserGuidePageId) {
  const page = getUserGuidePageById(locale, pageId);

  return page.nextPage ? [page.nextPage.id] : [];
}

function buildGuideAssistantSuccessBody({
  locale,
  pageId,
  response,
}: {
  locale: HomeLocale;
  pageId: UserGuidePageId;
  response: GenerateContentResponse;
}) {
  const parsed = parseStructuredGuideAssistantAnswer(response);
  const sourcePageIds =
    parsed.sourcePageIds.length > 0 ? parsed.sourcePageIds : [pageId];
  const parsedNextPageIds = normalizePageIds({
    exclude: new Set([pageId]),
    max: MAX_NEXT_LINKS,
    value: parsed.nextPageIds,
  });
  const nextPageIds =
    parsedNextPageIds.length > 0
      ? parsedNextPageIds
      : getFallbackNextPageIds(locale, pageId);

  return {
    answer: parsed.answer,
    nextPages: nextPageIds.map((nextPageId) =>
      getAssistantPageLink(locale, nextPageId),
    ),
    sources: sourcePageIds.map((sourcePageId) =>
      getAssistantPageLink(locale, sourcePageId),
    ),
  };
}

function collectErrorDiagnostics(error: unknown) {
  const queue = [error];
  const seen = new Set<unknown>();
  const details: Array<{
    code?: string;
    message?: string;
    name?: string;
  }> = [];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current || seen.has(current)) {
      continue;
    }

    seen.add(current);

    if (current instanceof Error) {
      const errorWithCode = current as Error & { code?: unknown; cause?: unknown };

      details.push({
        code: typeof errorWithCode.code === 'string' ? errorWithCode.code : undefined,
        message: current.message,
        name: current.name,
      });

      if ('cause' in errorWithCode) {
        queue.push(errorWithCode.cause);
      }

      continue;
    }

    if (typeof current === 'object') {
      const objectWithErrorFields = current as {
        cause?: unknown;
        code?: unknown;
        message?: unknown;
        name?: unknown;
      };

      details.push({
        code:
          typeof objectWithErrorFields.code === 'string'
            ? objectWithErrorFields.code
            : undefined,
        message:
          typeof objectWithErrorFields.message === 'string'
            ? objectWithErrorFields.message
            : undefined,
        name:
          typeof objectWithErrorFields.name === 'string'
            ? objectWithErrorFields.name
            : undefined,
      });

      if ('cause' in objectWithErrorFields) {
        queue.push(objectWithErrorFields.cause);
      }
    }
  }

  return details;
}

function isNetworkError(error: unknown) {
  const diagnostics = collectErrorDiagnostics(error);
  const networkCodes = new Set([
    'ECONNREFUSED',
    'ECONNRESET',
    'EHOSTUNREACH',
    'ENETUNREACH',
    'ENOTFOUND',
    'ETIMEDOUT',
    'UND_ERR_CONNECT_TIMEOUT',
  ]);

  return diagnostics.some((detail) => {
    const diagnosticText = [detail.code, detail.message, detail.name]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return (
      (detail.code ? networkCodes.has(detail.code) : false) ||
      diagnosticText.includes('fetch failed') ||
      diagnosticText.includes('connect timeout') ||
      diagnosticText.includes('network socket disconnected') ||
      diagnosticText.includes('tls connection') ||
      diagnosticText.includes('timed out')
    );
  });
}

function getErrorResponse(error: unknown) {
  if (error instanceof EmptyGeminiResponseError) {
    return {
      code: 'empty_response' as const,
      message: 'Gemini replied without usable answer text.',
      status: 502,
    };
  }

  if (isNetworkError(error)) {
    return {
      code: 'network_unreachable' as const,
      message: 'The server could not reach Gemini.',
      status: 503,
    };
  }

  return {
    code: 'upstream_error' as const,
    message: 'The guide assistant encountered an upstream Gemini error.',
    status: 502,
  };
}

function isJsonContentType(value: null | string) {
  return Boolean(value && value.toLowerCase().startsWith('application/json'));
}

function getForbiddenOriginMessage(
  reason:
    | 'cross_site'
    | 'host_not_allowed'
    | 'invalid_host'
    | 'missing_origin'
    | 'origin_mismatch',
) {
  if (reason === 'host_not_allowed') {
    return 'This host is not allowed to use the protected AI route.';
  }

  if (reason === 'cross_site') {
    return 'Cross-site requests are not allowed for this route.';
  }

  if (reason === 'origin_mismatch') {
    return 'The request origin does not match the allowed public host.';
  }

  if (reason === 'invalid_host') {
    return 'The request host could not be validated.';
  }

  return 'The request is missing an allowed same-site origin signal.';
}

function logGuideChatSecurityEvent({
  code,
  challenged = false,
  error,
  host,
  originHost,
  path,
  reason,
  referrerHost,
  secFetchSite,
  sessionFingerprint,
  status,
  turnstileValidated = false,
  verifiedSession = false,
}: {
  challenged?: boolean;
  code: RouteErrorCode;
  error?: string;
  host: null | string;
  originHost: null | string;
  path: string;
  reason?: null | string;
  referrerHost: null | string;
  secFetchSite: null | string;
  sessionFingerprint?: null | string;
  status: number;
  turnstileValidated?: boolean;
  verifiedSession?: boolean;
}) {
  console.warn('Guide chat security event:', {
    challenged,
    code,
    error,
    host,
    originHost,
    path,
    reason,
    referrerHost,
    secFetchSite,
    session: sessionFingerprint,
    status,
    turnstileValidated,
    verifiedSession,
  });
}

function logGuideChatError({
  code,
  error,
  host,
  model,
  sessionFingerprint,
  status,
  turnstileValidated,
  verifiedSession,
}: {
  code: RouteErrorCode;
  error: unknown;
  host: string;
  model: string;
  sessionFingerprint: string;
  status: number;
  turnstileValidated: boolean;
  verifiedSession: boolean;
}) {
  const diagnostics = collectErrorDiagnostics(error);
  const primary = diagnostics[0];
  const cause = diagnostics[1];
  const transport = getGeminiTransportDiagnostics();

  console.error('Error in /api/user-guide-chat:', {
    causeCode: cause?.code,
    causeMessage: cause?.message,
    code,
    errorCode: primary?.code,
    errorMessage: primary?.message,
    errorName: primary?.name,
    hasProxy: transport.hasProxy,
    host,
    model,
    session: sessionFingerprint,
    status,
    turnstileValidated,
    verifiedSession,
  });
}

export async function POST(request: NextRequest) {
  const requestPath = request.nextUrl.pathname;
  const contentType = request.headers.get('content-type');

  if (!isJsonContentType(contentType)) {
    return jsonError(
      400,
      'invalid_request',
      'Request body must use application/json.',
    );
  }

  const requestGuard = getUserGuideRequestGuard(request);

  if (!requestGuard.ok) {
    const response = jsonError(
      403,
      'forbidden_origin',
      getForbiddenOriginMessage(requestGuard.reason),
    );

    logGuideChatSecurityEvent({
      code: 'forbidden_origin',
      error: getForbiddenOriginMessage(requestGuard.reason),
      host: requestGuard.host,
      originHost: requestGuard.originHost,
      path: requestPath,
      reason: requestGuard.reason,
      referrerHost: requestGuard.referrerHost,
      secFetchSite: requestGuard.secFetchSite,
      status: 403,
    });

    return response;
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError(400, 'invalid_request', 'Request body must be valid JSON.');
  }

  const locale = body.locale;
  const pageId = body.pageId;
  const question = sanitizeText(body.question, MAX_QUESTION_LENGTH + 1);
  const turnstileToken = sanitizeTurnstileToken(body.turnstileToken);

  if (
    !isHomeLocale(locale) ||
    typeof pageId !== 'string' ||
    !isUserGuidePageId(pageId)
  ) {
    return jsonError(400, 'invalid_request', 'Invalid locale or page id.');
  }

  if (!question) {
    return jsonError(400, 'invalid_request', 'Question is required.');
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    return jsonError(400, 'invalid_request', 'Question is too long.');
  }

  if (!isUserGuideAiEnabled()) {
    return jsonError(503, 'disabled', 'AI questions are not enabled.');
  }

  const abuseState = readUserGuideSession(request);

  if (!abuseState) {
    return jsonError(503, 'disabled', 'AI questions are not enabled.');
  }

  const sessionFingerprint = getUserGuideSessionFingerprint(abuseState.session.id);
  const history = sanitizeHistory(body.history);
  const page = getUserGuidePageById(locale, pageId);
  const model = getUserGuideChatModel();
  const ai = getGeminiClient();
  const hadExpiredVerifiedCookie =
    Boolean(abuseState.verifiedRecord) && !abuseState.verified;

  if (!ai) {
    const response = jsonError(503, 'disabled', 'AI questions are not enabled.');
    return applyUserGuideSessionCookies({
      clearVerifiedCookie: hadExpiredVerifiedCookie,
      response,
      session: abuseState.session,
    });
  }

  let verifiedSession = abuseState.verified;
  let turnstileValidated = false;
  let verifiedUntil: number | undefined;

  if (
    shouldUserGuideChallenge({
      session: abuseState.session,
      verified: verifiedSession,
    })
  ) {
    if (!turnstileToken) {
      const response = jsonError(
        403,
        'challenge_required',
        'Please complete verification to keep asking guide questions.',
      );

      logGuideChatSecurityEvent({
        challenged: true,
        code: 'challenge_required',
        error: 'Missing Turnstile token after challenge threshold.',
        host: requestGuard.host,
        originHost: requestGuard.originHost,
        path: requestPath,
        referrerHost: requestGuard.referrerHost,
        secFetchSite: requestGuard.secFetchSite,
        sessionFingerprint,
        status: 403,
        verifiedSession,
      });

      return applyUserGuideSessionCookies({
        clearVerifiedCookie: hadExpiredVerifiedCookie,
        response,
        session: abuseState.session,
      });
    }

    const turnstileResult = await verifyUserGuideTurnstileToken({
      remoteIp: getUserGuideRemoteIp(request),
      requestHost: requestGuard.host,
      token: turnstileToken,
    });

    if (!turnstileResult.ok) {
      registerUserGuideChallengeFailure(abuseState.session, abuseState.now);
      const code = isUserGuideThrottled(abuseState.session)
        ? 'throttled'
        : 'challenge_required';
      const status = code === 'throttled' ? 429 : 403;
      const message =
        code === 'throttled'
          ? 'Too many failed verification attempts. Please wait and try again later.'
          : 'Verification did not complete. Please try the challenge again.';
      const response = jsonError(status, code, message);

      logGuideChatSecurityEvent({
        challenged: true,
        code,
        error: turnstileResult.reason,
        host: requestGuard.host,
        originHost: requestGuard.originHost,
        path: requestPath,
        reason: turnstileResult.errorCodes.join(',') || turnstileResult.reason,
        referrerHost: requestGuard.referrerHost,
        secFetchSite: requestGuard.secFetchSite,
        sessionFingerprint,
        status,
        turnstileValidated: false,
        verifiedSession,
      });

      return applyUserGuideSessionCookies({
        clearVerifiedCookie: hadExpiredVerifiedCookie,
        response,
        session: abuseState.session,
      });
    }

    turnstileValidated = true;
    verifiedSession = true;
    verifiedUntil = abuseState.now + VERIFIED_WINDOW_MS;
    promoteUserGuideSessionVerification(abuseState.session, abuseState.now);
  } else {
    clearUserGuideChallengeFailures(abuseState.session, abuseState.now);
  }

  registerUserGuideAttempt({
    session: abuseState.session,
    verified: verifiedSession,
  });

  try {
    const context = await getUserGuideAiContext(locale, pageId);
    const response = await withGeminiTimeout(
      ai.models.generateContent({
        config: {
          maxOutputTokens: 700,
          responseMimeType: 'application/json',
          systemInstruction: buildUserGuideSystemInstruction({
            context,
            currentPageTitle: page.title,
            locale,
          }),
          temperature: 0.2,
          thinkingConfig: {
            thinkingBudget: 0,
          },
          topP: 0.8,
        },
        contents: [
          ...buildHistoryContents(history),
          {
            parts: [
              {
                text: buildUserGuideUserPrompt({
                  pageDescription: page.description,
                  pageTitle: page.title,
                  question,
                }),
              },
            ],
            role: 'user',
          },
        ],
        model,
      }),
    );

    const successResponse = jsonResponse({
      ...buildGuideAssistantSuccessBody({
        locale,
        pageId,
        response,
      }),
    });

    return applyUserGuideSessionCookies({
      clearVerifiedCookie: hadExpiredVerifiedCookie && !verifiedUntil,
      response: successResponse,
      session: abuseState.session,
      verifiedUntil,
    });
  } catch (error) {
    const errorResponse = getErrorResponse(error);

    logGuideChatError({
      code: errorResponse.code,
      error,
      host: requestGuard.host,
      model,
      sessionFingerprint,
      status: errorResponse.status,
      turnstileValidated,
      verifiedSession,
    });

    const response = jsonError(
      errorResponse.status,
      errorResponse.code,
      errorResponse.message,
    );

    return applyUserGuideSessionCookies({
      clearVerifiedCookie: hadExpiredVerifiedCookie && !verifiedUntil,
      response,
      session: abuseState.session,
      verifiedUntil,
    });
  }
}
