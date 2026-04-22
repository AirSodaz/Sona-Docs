import type { GenerateContentResponse } from '@google/genai';
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
  getGeminiClient,
  getGeminiTransportDiagnostics,
} from '@/lib/user-guide-gemini';
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
type RouteErrorCode =
  | 'disabled'
  | 'empty_response'
  | 'invalid_request'
  | 'network_unreachable'
  | 'upstream_error';

type ChatHistoryItem = {
  content: string;
  role: ChatRole;
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

function jsonError(status: number, code: RouteErrorCode, error: string) {
  return NextResponse.json(
    { code, error },
    { status },
  );
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

function buildHistoryContents(history: ChatHistoryItem[]) {
  return history.map((item) => ({
    parts: [{ text: item.content }],
    role: item.role === 'assistant' ? 'model' : 'user',
  }));
}

function extractAnswer(response: GenerateContentResponse) {
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
    const diagnosticText = [
      detail.code,
      detail.message,
      detail.name,
    ]
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

function logGuideChatError({
  code,
  error,
  model,
  status,
}: {
  code: RouteErrorCode;
  error: unknown;
  model: string;
  status: number;
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
    model,
    status,
  });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError(400, 'invalid_request', 'Request body must be valid JSON.');
  }

  const locale = body.locale;
  const pageId = body.pageId;
  const question = sanitizeText(body.question, MAX_QUESTION_LENGTH + 1);

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

  const history = sanitizeHistory(body.history);
  const page = getUserGuidePageById(locale, pageId);
  const model = getUserGuideChatModel();
  const ai = getGeminiClient();

  if (!ai) {
    return jsonError(503, 'disabled', 'AI questions are not enabled.');
  }

  try {
    const context = await getUserGuideAiContext(locale, pageId);
    const response = await ai.models.generateContent({
      config: {
        maxOutputTokens: 700,
        responseMimeType: 'text/plain',
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
    });

    return NextResponse.json({ answer: extractAnswer(response) });
  } catch (error) {
    const errorResponse = getErrorResponse(error);

    logGuideChatError({
      code: errorResponse.code,
      error,
      model,
      status: errorResponse.status,
    });

    return jsonError(
      errorResponse.status,
      errorResponse.code,
      errorResponse.message,
    );
  }
}
