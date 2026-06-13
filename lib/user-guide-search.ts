import 'server-only';

import { cache } from 'react';
import type { HomeLocale } from '@/lib/homepage-content';
import {
  getAllUserGuidePages,
  getUserGuideMarkdown,
} from '@/lib/user-guide-content';
import type { UserGuideSearchEntry } from '@/lib/user-guide-search-core';

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
