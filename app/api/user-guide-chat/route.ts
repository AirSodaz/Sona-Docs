import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import type { HomeLocale } from '@/lib/homepage-content';
import {
  buildUserGuideSystemInstruction,
  buildUserGuideUserPrompt,
  getUserGuideAiContext,
  getUserGuideChatModel,
  isUserGuideAiEnabled,
} from '@/lib/user-guide-ai';
import {
  getUserGuidePageById,
  isUserGuidePageId,
} from '@/lib/user-guide-content';

export const runtime = 'nodejs';

const MAX_QUESTION_LENGTH = 1200;
const MAX_HISTORY_MESSAGES = 6;
const MAX_HISTORY_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_TOTAL_LENGTH = 4000;

type ChatRole = 'assistant' | 'user';
type ChatHistoryItem = {
  role: ChatRole;
  content: string;
};

function isHomeLocale(value: unknown): value is HomeLocale {
  return value === 'en' || value === 'zh-CN';
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
      const content = 'content' in item
        ? sanitizeText(item.content, MAX_HISTORY_MESSAGE_LENGTH)
        : null;

      if ((role !== 'user' && role !== 'assistant') || !content) {
        return [];
      }

      return [{ role, content }];
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

function buildHistoryContents(history: ChatHistoryItem[]) {
  return history.map((item) => ({
    role: item.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: item.content }],
  }));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const locale = body.locale;
    const pageId = body.pageId;
    const question = sanitizeText(body.question, MAX_QUESTION_LENGTH + 1);

    if (!isHomeLocale(locale) || typeof pageId !== 'string' || !isUserGuidePageId(pageId)) {
      return NextResponse.json(
        { error: 'Invalid locale or page id.' },
        { status: 400 },
      );
    }

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required.' },
        { status: 400 },
      );
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      return NextResponse.json(
        { error: 'Question is too long.' },
        { status: 400 },
      );
    }

    if (!isUserGuideAiEnabled()) {
      return NextResponse.json(
        { error: 'AI questions are not enabled.' },
        { status: 503 },
      );
    }

    const history = sanitizeHistory(body.history);
    const page = getUserGuidePageById(locale, pageId);
    const context = await getUserGuideAiContext(locale, pageId);
    const apiKey = process.env.GEMINI_API_KEY!.trim();
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: getUserGuideChatModel(),
      contents: [
        ...buildHistoryContents(history),
        {
          role: 'user',
          parts: [
            {
              text: buildUserGuideUserPrompt({
                pageDescription: page.description,
                pageTitle: page.title,
                question,
              }),
            },
          ],
        },
      ],
      config: {
        maxOutputTokens: 700,
        responseMimeType: 'text/plain',
        systemInstruction: buildUserGuideSystemInstruction({
          context,
          currentPageTitle: page.title,
          locale,
        }),
        temperature: 0.2,
        topP: 0.8,
      },
    });

    const answer = response.text?.trim();

    if (!answer) {
      throw new Error('Gemini returned an empty answer.');
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error in /api/user-guide-chat:', error);

    return NextResponse.json(
      { error: 'The guide assistant is temporarily unavailable.' },
      { status: 500 },
    );
  }
}
