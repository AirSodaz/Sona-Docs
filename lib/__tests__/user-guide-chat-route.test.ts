import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/user-guide-chat/route';

const geminiMocks = vi.hoisted(() => ({
  generateContent: vi.fn(),
  generateContentStream: vi.fn(),
}));

vi.mock('@/lib/user-guide-gemini', () => ({
  getGeminiClient: () => ({
    models: geminiMocks,
  }),
  getGeminiTransportDiagnostics: () => ({
    hasProxy: false,
    proxyUrl: null,
  }),
}));

const ORIGINAL_ENV = { ...process.env };

function createGuideChatRequest({
  accept = 'application/json',
  trustedIp = '203.0.113.10',
}: {
  accept?: string;
  trustedIp?: string;
} = {}) {
  return new NextRequest('https://sona.example.com/api/user-guide-chat', {
    body: JSON.stringify({
      history: [],
      locale: 'en',
      pageId: 'overview',
      question: 'Where should I start?',
    }),
    headers: {
      accept,
      'content-type': 'application/json',
      host: 'sona.example.com',
      origin: 'https://sona.example.com',
      ...(trustedIp ? { 'x-vercel-forwarded-for': trustedIp } : {}),
    },
    method: 'POST',
  });
}

function mockSharedRateLimit({
  counts = [1, 1],
  status = 200,
}: {
  counts?: [number, number];
  status?: number;
} = {}) {
  const [minuteCount, tenMinuteCount] = counts;

  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      return new Response(
        JSON.stringify([
          { result: minuteCount },
          { result: 1 },
          { result: tenMinuteCount },
          { result: 1 },
        ]),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          status,
        },
      );
    }),
  );
}

async function* createGeminiStream(chunks: string[]) {
  for (const text of chunks) {
    yield {
      text,
    };
  }
}

describe('/api/user-guide-chat streaming contract', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    geminiMocks.generateContent.mockReset();
    geminiMocks.generateContentStream.mockReset();
    process.env = {
      ...ORIGINAL_ENV,
      ALLOWED_PUBLIC_HOSTS: 'sona.example.com',
      API_ABUSE_SECRET: 'test-abuse-secret',
      GEMINI_API_KEY: 'test-gemini-key',
      TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
      TURNSTILE_SITE_KEY: 'test-turnstile-site-key',
      UPSTASH_REDIS_REST_TOKEN: 'test-upstash-token',
      UPSTASH_REDIS_REST_URL: 'https://upstash.example.com',
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    process.env = { ...ORIGINAL_ENV };
  });

  it('keeps the JSON response path when streaming is not requested', async () => {
    mockSharedRateLimit();
    geminiMocks.generateContent.mockResolvedValue({
      text: JSON.stringify({
        answer: 'Start with the overview.',
        nextPageIds: ['live-record'],
        sourcePageIds: ['overview'],
      }),
    });

    const response = await POST(createGuideChatRequest());
    const payload = await response.json();

    expect(response.headers.get('content-type')).toContain('application/json');
    expect(payload).toMatchObject({
      answer: 'Start with the overview.',
      nextPages: [
        expect.objectContaining({
          id: 'live-record',
        }),
      ],
      sources: [
        expect.objectContaining({
          id: 'overview',
        }),
      ],
    });
    expect(geminiMocks.generateContent).toHaveBeenCalledTimes(1);
    expect(geminiMocks.generateContentStream).not.toHaveBeenCalled();
  });

  it('streams answer deltas and final guide links when requested', async () => {
    mockSharedRateLimit();
    geminiMocks.generateContentStream.mockResolvedValue(
      createGeminiStream([
        '{"answer":"Start',
        ' with Live Record.","sourcePageIds":["overview"],"nextPageIds":["live-record"]}',
      ]),
    );

    const response = await POST(
      createGuideChatRequest({
        accept: 'text/event-stream',
      }),
    );
    const text = await response.text();

    expect(response.headers.get('content-type')).toContain('text/event-stream');
    expect(text).toContain('event: delta');
    expect(text).toContain('data: {"text":"Start"}');
    expect(text).toContain('data: {"text":" with Live Record."}');
    expect(text).toContain('event: done');
    expect(text).toContain('"answer":"Start with Live Record."');
    expect(text).toContain('"id":"live-record"');
    expect(geminiMocks.generateContent).not.toHaveBeenCalled();
    expect(geminiMocks.generateContentStream).toHaveBeenCalledTimes(1);
  });

  it('returns 429 before Gemini when the shared rate limit is exceeded', async () => {
    mockSharedRateLimit({
      counts: [11, 1],
    });

    const response = await POST(createGuideChatRequest());
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBeTruthy();
    expect(payload).toMatchObject({
      code: 'rate_limited',
      retryAfterSeconds: expect.any(Number),
    });
    expect(geminiMocks.generateContent).not.toHaveBeenCalled();
    expect(geminiMocks.generateContentStream).not.toHaveBeenCalled();
  });

  it('fails closed before Gemini when shared rate limiting cannot run', async () => {
    process.env.UPSTASH_REDIS_REST_URL = '';

    const response = await POST(createGuideChatRequest());
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toMatchObject({
      code: 'rate_limit_unavailable',
    });
    expect(geminiMocks.generateContent).not.toHaveBeenCalled();
    expect(geminiMocks.generateContentStream).not.toHaveBeenCalled();
  });

  it('fails closed before Gemini when the trusted IP header is missing', async () => {
    const response = await POST(
      createGuideChatRequest({
        trustedIp: '',
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toMatchObject({
      code: 'rate_limit_unavailable',
    });
    expect(geminiMocks.generateContent).not.toHaveBeenCalled();
    expect(geminiMocks.generateContentStream).not.toHaveBeenCalled();
  });
});
