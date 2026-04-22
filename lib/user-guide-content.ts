import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import type { HomeLocale } from '@/lib/homepage-content';

const GITHUB_REPO_URL = 'https://github.com/AirSodaz/sona';
const GITHUB_BLOB_ROOT = `${GITHUB_REPO_URL}/blob/master`;

export interface UserGuidePageContent {
  locale: HomeLocale;
  path: string;
  alternatePath: string;
  alternateLabel: string;
  headerLabel: string;
  headerDescription: string;
  homeHref: string;
  homeLabel: string;
  sourceHref: string;
  sourceLabel: string;
  metadata: {
    title: string;
    description: string;
  };
  contentFile: string;
}

export const userGuidePageContent: Record<HomeLocale, UserGuidePageContent> = {
  en: {
    locale: 'en',
    path: '/user-guide',
    alternatePath: '/zh/user-guide',
    alternateLabel: '简体中文',
    headerLabel: 'Desktop Guide',
    headerDescription:
      'The in-site Sona user guide for setup, local transcription, editing, LLM polish, translation, export, and troubleshooting.',
    homeHref: '/',
    homeLabel: 'Back Home',
    sourceHref: `${GITHUB_BLOB_ROOT}/docs/user-guide.md`,
    sourceLabel: 'Source on GitHub',
    metadata: {
      title: 'Sona User Guide',
      description:
        'Step-by-step guide for installing Sona, finishing offline setup, transcribing audio locally, refining transcripts, and exporting results.',
    },
    contentFile: 'user-guide.en.md',
  },
  'zh-CN': {
    locale: 'zh-CN',
    path: '/zh/user-guide',
    alternatePath: '/user-guide',
    alternateLabel: 'English',
    headerLabel: '站内指南',
    headerDescription:
      '面向 Sona 桌面端用户的站内指南，覆盖首次设置、本地转录、编辑、LLM 润色、翻译、导出与排障。',
    homeHref: '/zh',
    homeLabel: '返回首页',
    sourceHref: `${GITHUB_BLOB_ROOT}/docs/user-guide.zh-CN.md`,
    sourceLabel: 'GitHub 源文档',
    metadata: {
      title: 'Sona 用户指南',
      description:
        '帮助您完成 Sona 安装、离线初始化、本地转录、文本整理、翻译与导出的分步使用指南。',
    },
    contentFile: 'user-guide.zh-CN.md',
  },
};

const USER_GUIDE_CONTENT_DIR = path.join(process.cwd(), 'content');

const linkOverrides: Record<string, string> = {
  'user-guide.md': '/user-guide',
  'user-guide.zh-CN.md': '/zh/user-guide',
  'cli.md': `${GITHUB_BLOB_ROOT}/docs/cli.md`,
  'cli.zh-CN.md': `${GITHUB_BLOB_ROOT}/docs/cli.zh-CN.md`,
  '../README.md': `${GITHUB_BLOB_ROOT}/README.md`,
  '../README.zh-CN.md': `${GITHUB_BLOB_ROOT}/README.zh-CN.md`,
};

function normalizeRelativeHref(href: string) {
  return href.replace(/^\.\//, '');
}

export const getUserGuideMarkdown = cache(async (locale: HomeLocale) => {
  const config = userGuidePageContent[locale];
  const filePath = path.join(USER_GUIDE_CONTENT_DIR, config.contentFile);

  return readFile(filePath, 'utf8');
});

export function resolveUserGuideHref(href: string | undefined) {
  if (!href) {
    return { href: '#', external: false };
  }

  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('#')
  ) {
    return {
      href,
      external: href.startsWith('http://') || href.startsWith('https://'),
    };
  }

  if (href.startsWith('/')) {
    return { href, external: false };
  }

  const normalizedHref = normalizeRelativeHref(href);
  const override = linkOverrides[href] ?? linkOverrides[normalizedHref];

  if (override) {
    return {
      href: override,
      external: override.startsWith('http://') || override.startsWith('https://'),
    };
  }

  return {
    href: `${GITHUB_BLOB_ROOT}/docs/${normalizedHref}`,
    external: true,
  };
}
