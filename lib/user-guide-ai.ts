import 'server-only';

import { cache } from 'react';
import type { HomeLocale } from '@/lib/homepage-content';
import {
  getUserGuidePageById,
  getUserGuideMarkdown,
  type UserGuidePageId,
} from '@/lib/user-guide-content';
import {
  getUserGuideTurnstileSiteKey,
  isUserGuideAbuseProtectionConfigured,
} from '@/lib/user-guide-abuse';
import { getUserGuideReferenceSnippets } from '@/lib/user-guide-search';

export const DEFAULT_USER_GUIDE_CHAT_MODEL = 'gemini-2.5-flash';

function getAnswerLanguage(locale: HomeLocale) {
  switch (locale) {
    case 'en':
      return 'English';
    case 'zh-CN':
      return 'Simplified Chinese';
    case 'zh-TW':
      return 'Traditional Chinese using Taiwan terminology and style';
    case 'ja':
      return 'Japanese';
    case 'ko':
      return 'Korean';
  }
}

function formatGuideSection({
  heading,
  id,
  path,
  description,
  markdown,
}: {
  heading: string;
  id: UserGuidePageId;
  path: string;
  description: string;
  markdown: string;
}) {
  return [
    `## ${heading}`,
    `Page ID: ${id}`,
    `Path: ${path}`,
    `Description: ${description}`,
    'Content:',
    markdown.trim(),
  ].join('\n');
}

const getCurrentGuideDocument = cache(
  async (locale: HomeLocale, pageId: UserGuidePageId) => {
    const page = getUserGuidePageById(locale, pageId);

    return {
      description: page.description,
      id: page.id,
      markdown: await getUserGuideMarkdown(locale, page.id),
      path: page.path,
      title: page.title,
    };
  },
);

export async function getUserGuideAiContext(
  locale: HomeLocale,
  currentPageId: UserGuidePageId,
  question: string,
) {
  const currentPage = await getCurrentGuideDocument(locale, currentPageId);
  const referencePages = question.trim()
    ? await getUserGuideReferenceSnippets({
        currentPageId,
        locale,
        query: question,
      })
    : [];

  return [
    `Guide locale: ${locale}`,
    '',
    formatGuideSection({
      heading: `Current page - ${currentPage.title}`,
      id: currentPage.id,
      path: currentPage.path,
      description: currentPage.description,
      markdown: currentPage.markdown,
    }),
    '',
    '## Relevant reference snippets',
    ...referencePages.map((page) =>
      formatGuideSection({
        heading: page.title,
        id: page.id,
        path: page.path,
        description: page.description,
        markdown: page.content,
      }),
    ),
  ].join('\n\n');
}

export function isUserGuideAiEnabled() {
  return Boolean(
    process.env.GEMINI_API_KEY?.trim() && isUserGuideAbuseProtectionConfigured(),
  );
}

export function getUserGuideChatModel() {
  return process.env.GEMINI_GUIDE_MODEL?.trim() || DEFAULT_USER_GUIDE_CHAT_MODEL;
}

export { getUserGuideTurnstileSiteKey };

export function buildUserGuideSystemInstruction({
  context,
  currentPageTitle,
  locale,
}: {
  context: string;
  currentPageTitle: string;
  locale: HomeLocale;
}) {
  return [
    'You are the Sona user guide assistant.',
    `Answer in ${getAnswerLanguage(locale)}.`,
    `Prioritize the current page (${currentPageTitle}) before using the rest of the guide.`,
    'Only answer with information that is directly stated in, or is a careful synthesis of, the provided user guide context.',
    'Do not invent product behavior, setup steps, UI labels, pricing, release details, or troubleshooting advice that are not covered by the guide.',
    'If the guide does not cover the answer, say that the current user guide does not cover it and suggest the closest guide page when possible.',
    'Keep the answer practical and concise.',
    'Return strict JSON only, with no Markdown fences or extra prose.',
    'Use this exact shape: {"answer":"...","sourcePageIds":["page-id"],"nextPageIds":["page-id"]}.',
    'Use only Page ID values from the provided guide context. Include 1-3 sourcePageIds and 0-2 nextPageIds.',
    'sourcePageIds should identify the pages used for the answer. nextPageIds should identify useful follow-up pages to read after the answer.',
    '',
    'User guide context starts below.',
    context,
  ].join('\n');
}

export function buildUserGuideUserPrompt({
  pageDescription,
  pageTitle,
  question,
}: {
  pageDescription: string;
  pageTitle: string;
  question: string;
}) {
  return [
    `Current page title: ${pageTitle}`,
    `Current page description: ${pageDescription}`,
    '',
    'User question:',
    question,
  ].join('\n');
}
