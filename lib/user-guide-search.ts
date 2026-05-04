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

export function getUserGuideSearchCopy(locale: HomeLocale): UserGuideSearchCopy {
  if (locale === 'en') {
    return {
      clearLabel: 'Clear search',
      currentPageLabel: 'Current page',
      inputLabel: 'Search the user guide',
      noResultsLabel: 'No guide pages found',
      openResultLabel: 'Open result',
      placeholder: 'Search the guide...',
      resultsLabel: 'Search results',
    };
  }

  return {
    clearLabel: '清空搜索',
    currentPageLabel: '当前页',
    inputLabel: '搜索用户指南',
    noResultsLabel: '没有找到匹配的指南页',
    openResultLabel: '打开结果',
    placeholder: '搜索本指南...',
    resultsLabel: '搜索结果',
  };
}
