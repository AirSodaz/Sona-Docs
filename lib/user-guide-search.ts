import 'server-only';

import { cache } from 'react';
import type { HomeLocale } from '@/lib/homepage-content';
import {
  getAllUserGuidePages,
  getUserGuideMarkdown,
  type UserGuidePageId,
} from '@/lib/user-guide-content';
import {
  normalizeGuideSearchText,
  searchUserGuideEntries,
  type UserGuideSearchEntry,
} from '@/lib/user-guide-search-core';

export interface UserGuideSearchCopy {
  clearLabel: string;
  currentPageLabel: string;
  inputLabel: string;
  noResultsLabel: string;
  openResultLabel: string;
  placeholder: string;
  resultsLabel: string;
}

export function stripUserGuideMarkdownForSearch(markdown: string) {
  return markdown
    .replace(/```[\w-]*\n([\s\S]*?)```/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/[*_~]{1,3}/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const getUserGuideSearchEntries = cache(async (locale: HomeLocale) => {
  const pages = getAllUserGuidePages(locale);

  return Promise.all(
    pages.map(async (page): Promise<UserGuideSearchEntry> => {
      const markdown = await getUserGuideMarkdown(locale, page.id);

      return {
        content: stripUserGuideMarkdownForSearch(markdown),
        description: page.description,
        groupLabel: page.groupLabel,
        id: page.id,
        navLabel: page.navLabel,
        path: page.path,
        title: page.title,
      };
    }),
  );
});

export interface UserGuideSearchSnippet {
  content: string;
  description: string;
  id: UserGuidePageId;
  path: string;
  title: string;
}

const REFERENCE_SNIPPET_RADIUS = 700;
const ENGLISH_REFERENCE_QUERY_STOP_WORDS = new Set([
  'and',
  'are',
  'can',
  'does',
  'for',
  'how',
  'the',
  'use',
  'what',
  'when',
  'where',
  'which',
  'who',
  'why',
  'with',
  'you',
  'your',
]);

function getReferenceSearchQuery(query: string) {
  const normalizedQuery = normalizeGuideSearchText(query);
  const meaningfulTokens = normalizedQuery
    .split(' ')
    .filter(
      (token) =>
        token.length > 2 && !ENGLISH_REFERENCE_QUERY_STOP_WORDS.has(token),
    );

  return meaningfulTokens.length > 0
    ? meaningfulTokens.join(' ')
    : normalizedQuery;
}

function createReferenceSnippet(content: string, excerpt: string) {
  const excerptToken = excerpt.replace(/^\.\.\./, '').replace(/\.\.\.$/, '').trim();
  const normalizedContent = content.toLocaleLowerCase();
  const normalizedToken = excerptToken.toLocaleLowerCase();
  const index = normalizedToken
    ? normalizedContent.indexOf(normalizedToken)
    : -1;

  if (index < 0) {
    return content.slice(0, REFERENCE_SNIPPET_RADIUS * 2).trim();
  }

  const start = Math.max(0, index - REFERENCE_SNIPPET_RADIUS);
  const end = Math.min(
    content.length,
    index + excerptToken.length + REFERENCE_SNIPPET_RADIUS,
  );

  return content.slice(start, end).trim();
}

export async function getUserGuideReferenceSnippets({
  currentPageId,
  limit = 3,
  locale,
  query,
}: {
  currentPageId: UserGuidePageId;
  limit?: number;
  locale: HomeLocale;
  query: string;
}): Promise<UserGuideSearchSnippet[]> {
  const entries = await getUserGuideSearchEntries(locale);
  const results = searchUserGuideEntries(entries, getReferenceSearchQuery(query), {
    currentPageId,
    limit: limit + 1,
  }).filter((result) => result.id !== currentPageId);

  return results.slice(0, limit).map((result) => ({
    content: createReferenceSnippet(result.content, result.excerpt),
    description: result.description,
    id: result.id as UserGuidePageId,
    path: result.path,
    title: result.title,
  }));
}
