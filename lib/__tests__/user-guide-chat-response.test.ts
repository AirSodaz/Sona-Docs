import { describe, expect, it } from 'vitest';
import {
  buildGuideAssistantSuccessBodyFromText,
  extractStreamingAnswerDelta,
  parseStructuredGuideAssistantText,
} from '../user-guide-chat-response';
import { parseUserGuideChatStreamEvents } from '../user-guide-chat-stream';

describe('user guide chat response helpers', () => {
  it('builds the same answer and safe guide links from structured JSON text', () => {
    const body = buildGuideAssistantSuccessBodyFromText({
      locale: 'en',
      pageId: 'overview',
      text: JSON.stringify({
        answer: 'Use the guide overview first.',
        nextPageIds: ['live-record', 'unknown-page', 'overview'],
        sourcePageIds: ['overview', 'live-record', 'unknown-page'],
      }),
    });

    expect(body.answer).toBe('Use the guide overview first.');
    expect(body.sources.map((source) => source.id)).toEqual([
      'overview',
      'live-record',
    ]);
    expect(body.nextPages.map((page) => page.id)).toEqual(['live-record']);
  });

  it('falls back to plain answer text when Gemini does not return JSON', () => {
    const parsed = parseStructuredGuideAssistantText(
      'The current user guide does not cover that topic.',
    );

    expect(parsed).toEqual({
      answer: 'The current user guide does not cover that topic.',
      nextPageIds: [],
      sourcePageIds: [],
    });
  });

  it('extracts only new answer text from partial structured JSON', () => {
    const first = extractStreamingAnswerDelta({
      previousAnswer: '',
      text: '{"answer":"Hello',
    });
    const second = extractStreamingAnswerDelta({
      previousAnswer: first,
      text: '{"answer":"Hello world\\nNext',
    });

    expect(first).toBe('Hello');
    expect(second).toBe(' world\nNext');
  });

  it('parses server-sent guide chat events across chunk boundaries', () => {
    const first = parseUserGuideChatStreamEvents(
      'event: delta\ndata: {"text":"Hel',
    );
    const second = parseUserGuideChatStreamEvents(
      `${first.remaining}lo"}\n\nevent: done\ndata: {"answer":"Hello"}\n\n`,
    );

    expect(first.events).toEqual([]);
    expect(second.events).toEqual([
      {
        data: {
          text: 'Hello',
        },
        event: 'delta',
      },
      {
        data: {
          answer: 'Hello',
        },
        event: 'done',
      },
    ]);
  });
});
