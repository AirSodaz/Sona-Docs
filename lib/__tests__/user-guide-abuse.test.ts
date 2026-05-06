import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  USER_GUIDE_TURNSTILE_ACTION,
  verifyUserGuideTurnstileToken,
} from '../user-guide-abuse';

const ORIGINAL_ENV = { ...process.env };

describe('user guide abuse protection', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = {
      ...ORIGINAL_ENV,
      TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    process.env = { ...ORIGINAL_ENV };
  });

  it('does not forward caller-provided or spoofable header-derived IPs to Turnstile', async () => {
    const fetchMock = vi.fn(async () => {
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
});
