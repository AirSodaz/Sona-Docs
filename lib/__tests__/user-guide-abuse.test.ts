import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  checkUserGuideSharedRateLimit,
  USER_GUIDE_TURNSTILE_ACTION,
  verifyUserGuideTurnstileToken,
} from '../user-guide-abuse';

const ORIGINAL_ENV = { ...process.env };

describe('user guide abuse protection', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = {
      ...ORIGINAL_ENV,
      API_ABUSE_SECRET: 'test-abuse-secret',
      UPSTASH_REDIS_REST_TOKEN: 'test-upstash-token',
      UPSTASH_REDIS_REST_URL: 'https://upstash.example.com',
      TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    process.env = { ...ORIGINAL_ENV };
  });

  it('does not forward caller-provided or spoofable header-derived IPs to Turnstile', async () => {
    const fetchMock = vi.fn(async (_url: string | URL, _init?: RequestInit) => {
      return new Response(
        JSON.stringify({
          action: USER_GUIDE_TURNSTILE_ACTION,
          hostname: 'sona.example.com',
          success: true,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 200,
        },
      );
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await verifyUserGuideTurnstileToken({
      remoteIp: '203.0.113.10',
      requestHost: 'sona.example.com',
      token: 'test-turnstile-token',
    } as Parameters<typeof verifyUserGuideTurnstileToken>[0] & {
      remoteIp: string;
    });

    expect(result).toEqual({
      hostname: 'sona.example.com',
      ok: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, init] = fetchMock.mock.calls[0] ?? [];
    const body = JSON.parse(String((init as RequestInit).body)) as Record<
      string,
      unknown
    >;

    expect(body).toMatchObject({
      response: 'test-turnstile-token',
      secret: 'test-turnstile-secret',
    });
    expect(body).not.toHaveProperty('remoteip');
  });

  it('uses the trusted proxy IP to create raw-IP-free Upstash rate-limit keys', async () => {
    const fetchMock = vi.fn(async (_url: string | URL, _init?: RequestInit) => {
      return new Response(
        JSON.stringify([
          { result: 1 },
          { result: 1 },
          { result: 1 },
          { result: 1 },
        ]),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 200,
        },
      );
    });
    vi.stubGlobal('fetch', fetchMock);

    const request = new NextRequest(
      'https://sona.example.com/api/user-guide-chat',
      {
        headers: {
          'x-vercel-forwarded-for': '203.0.113.10',
        },
        method: 'POST',
      },
    );

    const result = await checkUserGuideSharedRateLimit({
      now: 1_800_000,
      request,
    });

    expect(result).toMatchObject({
      ok: true,
      windows: [
        {
          count: 1,
          limit: 10,
          name: '1m',
        },
        {
          count: 1,
          limit: 30,
          name: '10m',
        },
      ],
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(String(url)).toBe('https://upstash.example.com/pipeline');
    expect((init as RequestInit).headers).toMatchObject({
      Authorization: 'Bearer test-upstash-token',
      'Content-Type': 'application/json',
    });

    const bodyText = String((init as RequestInit).body);
    const body = JSON.parse(bodyText) as unknown[][];

    expect(bodyText).not.toContain('203.0.113.10');
    expect(body).toHaveLength(4);
    expect(body[0][0]).toBe('INCR');
    expect(body[1][0]).toBe('EXPIRE');
    expect(body[2][0]).toBe('INCR');
    expect(body[3][0]).toBe('EXPIRE');
    expect(String(body[0][1])).toContain('sona:guide:rate:v1:1m:30:');
    expect(String(body[2][1])).toContain('sona:guide:rate:v1:10m:3:');
  });

  it('rejects requests when shared rate-limit config is missing', async () => {
    process.env.UPSTASH_REDIS_REST_URL = '';
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const request = new NextRequest(
      'https://sona.example.com/api/user-guide-chat',
      {
        headers: {
          'x-vercel-forwarded-for': '203.0.113.10',
        },
        method: 'POST',
      },
    );

    const result = await checkUserGuideSharedRateLimit({ request });

    expect(result).toEqual({
      ok: false,
      reason: 'missing_config',
      status: 'unavailable',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects requests when the trusted client IP header is missing or invalid', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await checkUserGuideSharedRateLimit({
      request: new NextRequest('https://sona.example.com/api/user-guide-chat', {
        headers: {
          'x-vercel-forwarded-for': 'not-an-ip',
        },
        method: 'POST',
      }),
    });

    expect(result).toEqual({
      ok: false,
      reason: 'missing_trusted_ip',
      status: 'unavailable',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports the longest exceeded shared rate-limit window', async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(
        JSON.stringify([
          { result: 11 },
          { result: 1 },
          { result: 31 },
          { result: 1 },
        ]),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 200,
        },
      );
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await checkUserGuideSharedRateLimit({
      now: 1_800_000,
      request: new NextRequest('https://sona.example.com/api/user-guide-chat', {
        headers: {
          'x-vercel-forwarded-for': '203.0.113.10',
        },
        method: 'POST',
      }),
    });

    expect(result).toMatchObject({
      ok: false,
      reason: 'rate_limited',
      retryAfterSeconds: 600,
      status: 'limited',
      window: {
        count: 31,
        limit: 30,
        name: '10m',
        retryAfterSeconds: 600,
      },
    });
  });

  it('fails closed when Upstash returns an error or malformed pipeline response', async () => {
    const request = new NextRequest(
      'https://sona.example.com/api/user-guide-chat',
      {
        headers: {
          'x-vercel-forwarded-for': '203.0.113.10',
        },
        method: 'POST',
      },
    );
    const fetchMock = vi.fn(async () => {
      return new Response(JSON.stringify([{ result: 1 }]), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      checkUserGuideSharedRateLimit({ request }),
    ).resolves.toMatchObject({
      ok: false,
      reason: 'invalid_response',
      status: 'unavailable',
    });

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'nope' }), {
        status: 500,
      }),
    );

    await expect(
      checkUserGuideSharedRateLimit({ request }),
    ).resolves.toMatchObject({
      ok: false,
      reason: 'upstash_error',
      status: 'unavailable',
    });
  });
});
