import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createRequestLogger,
  getServerLogConfig,
} from '../server-logger';

const ORIGINAL_ENV = { ...process.env };

function parseConsoleLine(spy: ReturnType<typeof vi.spyOn>) {
  const [line] = spy.mock.calls.at(-1) ?? [];

  if (typeof line !== 'string') {
    throw new Error('Expected logger to write one JSON string argument.');
  }

  return JSON.parse(line) as Record<string, unknown>;
}

describe('server logger', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = { ...ORIGINAL_ENV };
  });

  it('writes structured JSON log lines with stable request metadata', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const request = new Request('https://sona.example.com/api/github-release', {
      headers: {
        'x-request-id': 'req_123',
      },
    });
    const logger = createRequestLogger(request, {
      method: 'GET',
      route: '/api/github-release',
    });

    logger.warn('github_release_upstream_status', {
      host: 'sona.example.com',
      status: 502,
    });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    const payload = parseConsoleLine(warnSpy);
    expect(payload).toMatchObject({
      event: 'github_release_upstream_status',
      host: 'sona.example.com',
      level: 'warn',
      method: 'GET',
      requestId: 'req_123',
      route: '/api/github-release',
      status: 502,
    });
    expect(payload.timestamp).toEqual(expect.any(String));
    expect(payload.durationMs).toEqual(expect.any(Number));
  });

  it('filters logs by SERVER_LOG_LEVEL including silent mode', () => {
    process.env.SERVER_LOG_LEVEL = 'error';
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logger = createRequestLogger(new Request('https://sona.example.com/api/test'), {
      method: 'POST',
      route: '/api/test',
    });

    logger.warn('warning_event', { status: 403 });
    logger.error('error_event', { status: 500 });

    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledTimes(1);

    process.env.SERVER_LOG_LEVEL = 'silent';
    logger.error('silent_error', { status: 500 });
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('uses a configurable slow request threshold with a 3000ms default', () => {
    expect(getServerLogConfig()).toMatchObject({
      level: 'info',
      slowRequestMs: 3000,
    });

    process.env.SERVER_LOG_SLOW_MS = '0';
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const logger = createRequestLogger(new Request('https://sona.example.com/api/test'), {
      method: 'POST',
      route: '/api/test',
    });

    logger.logSlowRequest(200);

    expect(infoSpy).toHaveBeenCalledTimes(1);
    const payload = parseConsoleLine(infoSpy);
    expect(payload).toMatchObject({
      event: 'api_slow_request',
      level: 'info',
      status: 200,
    });

    process.env.SERVER_LOG_SLOW_MS = 'not-a-number';
    expect(getServerLogConfig()).toMatchObject({
      slowRequestMs: 3000,
    });
  });

  it('recursively redacts secrets, user prompts, and proxy details', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logger = createRequestLogger(new Request('https://sona.example.com/api/test'), {
      method: 'POST',
      route: '/api/test',
    });

    logger.error('redaction_probe', {
      authorization: 'Bearer secret-token',
      cookie: 'session=secret-cookie',
      errorMessage: 'safe diagnostic',
      history: [{ content: 'previous private question' }],
      nested: {
        apiKey: 'gemini-secret',
        proxyUrl: 'https://proxy.example.com/secret',
        safe: 'kept',
      },
      question: 'private user question',
      remoteIp: '203.0.113.10',
      turnstileToken: 'turnstile-secret',
    });

    const payload = parseConsoleLine(errorSpy);
    const serialized = JSON.stringify(payload);
    expect(serialized).not.toContain('secret-token');
    expect(serialized).not.toContain('secret-cookie');
    expect(serialized).not.toContain('previous private question');
    expect(serialized).not.toContain('private user question');
    expect(serialized).not.toContain('proxy.example.com');
    expect(serialized).not.toContain('203.0.113.10');
    expect(payload).toMatchObject({
      authorization: '[redacted]',
      cookie: '[redacted]',
      errorMessage: 'safe diagnostic',
      history: '[redacted]',
      nested: {
        apiKey: '[redacted]',
        proxyUrl: '[redacted]',
        safe: 'kept',
      },
      question: '[redacted]',
      remoteIp: '[redacted]',
      turnstileToken: '[redacted]',
    });
  });

  it('generates request ids and can attach them to responses', () => {
    const logger = createRequestLogger(new Request('https://sona.example.com/api/test'), {
      method: 'GET',
      route: '/api/test',
    });

    expect(logger.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );

    const response = logger.withRequestId(new Response(null, { status: 204 }));
    expect(response.headers.get('X-Request-Id')).toBe(logger.requestId);
  });
});
