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
}: {
  accept?: string;
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
    },
    method: 'POST',
  });
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
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = { ...ORIGINAL_ENV };
  });

  it('keeps the JSON response path when streaming is not requested', async () => {
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
});
