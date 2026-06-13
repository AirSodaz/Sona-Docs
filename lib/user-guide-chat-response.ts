import type { GenerateContentResponse } from '@google/genai';
import type { HomeLocale } from '@/lib/homepage-content';
import {
  getUserGuidePageById,
  isUserGuidePageId,
  type UserGuidePageId,
} from '@/lib/user-guide-content';

const MAX_ANSWER_LENGTH = 4000;
const MAX_SOURCE_LINKS = 3;
const MAX_NEXT_LINKS = 2;

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

export class EmptyGeminiResponseError extends Error {
  constructor() {
    super('Gemini replied without usable answer text.');
    this.name = 'EmptyGeminiResponseError';
  }
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

export function extractResponseText(response: GenerateContentResponse) {
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

export function stripJsonCodeFence(text: string) {
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

export function parseStructuredGuideAssistantText(
  responseText: string,
): StructuredGuideAssistantAnswer {
  const normalizedText = responseText.trim();

  if (!normalizedText) {
    throw new EmptyGeminiResponseError();
  }

  const jsonText = stripJsonCodeFence(normalizedText);

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
      answer: normalizedText.slice(0, MAX_ANSWER_LENGTH),
      nextPageIds: [],
      sourcePageIds: [],
    };
  }
}

export function parseStructuredGuideAssistantAnswer(
  response: GenerateContentResponse,
): StructuredGuideAssistantAnswer {
  return parseStructuredGuideAssistantText(extractResponseText(response));
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

export function buildGuideAssistantSuccessBody({
  locale,
  pageId,
  response,
}: {
  locale: HomeLocale;
  pageId: UserGuidePageId;
  response: GenerateContentResponse;
}) {
  return buildGuideAssistantSuccessBodyFromText({
    locale,
    pageId,
    text: extractResponseText(response),
  });
}

export function buildGuideAssistantSuccessBodyFromText({
  locale,
  pageId,
  text,
}: {
  locale: HomeLocale;
  pageId: UserGuidePageId;
  text: string;
}) {
  const parsed = parseStructuredGuideAssistantText(text);
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

export function extractStreamingAnswerDelta({
  previousAnswer,
  text,
}: {
  previousAnswer: string;
  text: string;
}) {
  const answerPrefix = '"answer"';
  const jsonText = stripJsonCodeFence(text);
  const answerKeyIndex = jsonText.indexOf(answerPrefix);

  if (answerKeyIndex < 0) {
    return '';
  }

  const colonIndex = jsonText.indexOf(':', answerKeyIndex + answerPrefix.length);
  if (colonIndex < 0) {
    return '';
  }

  let quoteIndex = -1;
  for (let index = colonIndex + 1; index < jsonText.length; index += 1) {
    const char = jsonText[index];
    if (char === '"') {
      quoteIndex = index;
      break;
    }

    if (!/\s/.test(char)) {
      return '';
    }
  }

  if (quoteIndex < 0) {
    return '';
  }

  let rawAnswer = '';
  let escaped = false;

  for (let index = quoteIndex + 1; index < jsonText.length; index += 1) {
    const char = jsonText[index];

    if (escaped) {
      rawAnswer += `\\${char}`;
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === '"') {
      break;
    }

    rawAnswer += char;
  }

  let answer: string;

  try {
    answer = JSON.parse(`"${rawAnswer}"`) as string;
  } catch {
    return '';
  }

  const limitedAnswer = answer.slice(0, MAX_ANSWER_LENGTH);

  if (!limitedAnswer.startsWith(previousAnswer)) {
    return '';
  }

  return limitedAnswer.slice(previousAnswer.length);
}
