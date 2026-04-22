import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import type { HomeLocale } from '@/lib/homepage-content';

const GITHUB_REPO_URL = 'https://github.com/AirSodaz/sona';
const GITHUB_BLOB_ROOT = `${GITHUB_REPO_URL}/blob/master`;
const USER_GUIDE_CONTENT_DIR = path.join(process.cwd(), 'content', 'user-guide');
const USER_GUIDE_PAGE_ORDER = [
  'overview',
  'getting-started',
  'live-record',
  'batch-import',
  'edit-and-playback',
  'ai-polish-and-translate',
  'export-history-and-settings',
  'faq',
] as const;

type UserGuideNavGroupId = 'start' | 'workflow' | 'reference';

export type UserGuidePageId = (typeof USER_GUIDE_PAGE_ORDER)[number];

interface UserGuideLocalizedPageCopy {
  title: string;
  navLabel: string;
  description: string;
  contentFile: string;
}

interface UserGuidePageDefinition {
  id: UserGuidePageId;
  slug: string[];
  group: UserGuideNavGroupId;
  localizations: Record<HomeLocale, UserGuideLocalizedPageCopy>;
}

interface UserGuideUiCopy {
  guideLabel: string;
  homeLabel: string;
  alternateLanguageLabel: string;
  sourceLabel: string;
  mobileNavLabel: string;
  sidebarTitle: string;
  previousLabel: string;
  nextLabel: string;
  groupLabels: Record<UserGuideNavGroupId, string>;
  overview: {
    cardsEyebrow: string;
    cardsTitle: string;
    cardsDescription: string;
    browseEyebrow: string;
    browseTitle: string;
    browseDescription: string;
  };
}

export interface UserGuideNavItem {
  id: UserGuidePageId;
  title: string;
  description: string;
  path: string;
  active: boolean;
}

export interface UserGuideNavGroup {
  id: UserGuideNavGroupId;
  label: string;
  items: UserGuideNavItem[];
}

export interface UserGuidePageModel {
  id: UserGuidePageId;
  locale: HomeLocale;
  title: string;
  navLabel: string;
  description: string;
  contentFile: string;
  path: string;
  alternatePath: string;
  homeHref: string;
  homeLabel: string;
  alternateLanguageLabel: string;
  sourceHref: string;
  sourceLabel: string;
  guideLabel: string;
  sidebarTitle: string;
  mobileNavLabel: string;
  previousLabel: string;
  nextLabel: string;
  groupId: UserGuideNavGroupId;
  groupLabel: string;
  previousPage: UserGuideNavItem | null;
  nextPage: UserGuideNavItem | null;
}

const GUIDE_PREFIXES: Record<HomeLocale, string> = {
  en: '/user-guide',
  'zh-CN': '/zh/user-guide',
};

const userGuideUiContent: Record<HomeLocale, UserGuideUiCopy> = {
  en: {
    guideLabel: 'User Guide',
    homeLabel: 'Back Home',
    alternateLanguageLabel: '简体中文',
    sourceLabel: 'Source Guide',
    mobileNavLabel: 'Guide pages',
    sidebarTitle: 'Browse the guide',
    previousLabel: 'Previous',
    nextLabel: 'Next',
    groupLabels: {
      start: 'Start Here',
      workflow: 'Core Workflows',
      reference: 'Reference & Help',
    },
    overview: {
      cardsEyebrow: 'Start Here',
      cardsTitle: 'Pick the shortest path to your first useful result.',
      cardsDescription:
        'Most people only need one or two pages to get moving. Start with the path that matches what you are doing right now.',
      browseEyebrow: 'Everything Inside',
      browseTitle: 'The full docs set, organized by the actual Sona workflow.',
      browseDescription:
        'Use the overview when you are new, then move into setup, transcript creation, editing, optional AI steps, export, and troubleshooting.',
    },
  },
  'zh-CN': {
    guideLabel: '用户指南',
    homeLabel: '返回首页',
    alternateLanguageLabel: 'English',
    sourceLabel: '源文档',
    mobileNavLabel: '指南页面',
    sidebarTitle: '浏览指南',
    previousLabel: '上一页',
    nextLabel: '下一页',
    groupLabels: {
      start: '开始使用',
      workflow: '核心流程',
      reference: '参考与帮助',
    },
    overview: {
      cardsEyebrow: '从这里开始',
      cardsTitle: '先选最接近你当前任务的那条路径。',
      cardsDescription:
        '大多数用户并不需要一次看完整份文档。先进入最短上手路径，再按需要继续查看后续页面。',
      browseEyebrow: '完整内容',
      browseTitle: '整套指南按照 Sona 的真实使用流程组织。',
      browseDescription:
        '建议先看总览，再按“首次设置 -> 创建转录 -> 编辑整理 -> 可选 AI 处理 -> 导出与排障”的顺序继续。',
    },
  },
};

const userGuidePageDefinitions: UserGuidePageDefinition[] = [
  {
    id: 'overview',
    slug: [],
    group: 'start',
    localizations: {
      en: {
        title: 'Sona User Guide',
        navLabel: 'Overview',
        description:
          'A product-shaped entry point to the Sona docs, with the shortest paths for setup, live capture, file import, editing, AI polish, export, and help.',
        contentFile: 'en/overview.md',
      },
      'zh-CN': {
        title: 'Sona 用户指南',
        navLabel: '总览',
        description:
          '站内文档入口页，先帮你找到最短上手路径，再进入首次设置、录音转录、文件导入、编辑整理、AI 处理、导出与排障。',
        contentFile: 'zh-CN/overview.md',
      },
    },
  },
  {
    id: 'getting-started',
    slug: ['getting-started'],
    group: 'start',
    localizations: {
      en: {
        title: 'Getting Started',
        navLabel: 'Getting Started',
        description:
          'Install Sona, complete First Run Setup, download the recommended offline model pack, and reach your first usable local transcription flow.',
        contentFile: 'en/getting-started.md',
      },
      'zh-CN': {
        title: '快速开始',
        navLabel: '快速开始',
        description:
          '完成安装、首次运行设置与推荐离线模型下载，让 Sona 进入第一个可用的本地转录状态。',
        contentFile: 'zh-CN/getting-started.md',
      },
    },
  },
  {
    id: 'live-record',
    slug: ['live-record'],
    group: 'workflow',
    localizations: {
      en: {
        title: 'Live Record',
        navLabel: 'Live Record',
        description:
          'Capture live audio, keep timestamps attached, and understand the controls around input source, subtitles, shortcuts, and recording flow.',
        contentFile: 'en/live-record.md',
      },
      'zh-CN': {
        title: '实时录音',
        navLabel: '实时录音',
        description:
          '了解实时录音的适用场景、输入源、字幕设置、快捷键，以及录音结束后转录内容如何继续留在编辑器中。',
        contentFile: 'zh-CN/live-record.md',
      },
    },
  },
  {
    id: 'batch-import',
    slug: ['batch-import'],
    group: 'workflow',
    localizations: {
      en: {
        title: 'Batch Import',
        navLabel: 'Batch Import',
        description:
          'Queue existing audio or video files, monitor progress, and bring finished transcripts back into the same editor for review and export.',
        contentFile: 'en/batch-import.md',
      },
      'zh-CN': {
        title: '批量转录',
        navLabel: '批量转录',
        description:
          '把已有音频或视频文件排进同一条处理队列，再回到主编辑器继续检查、翻译与导出。',
        contentFile: 'zh-CN/batch-import.md',
      },
    },
  },
  {
    id: 'edit-and-playback',
    slug: ['edit-and-playback'],
    group: 'workflow',
    localizations: {
      en: {
        title: 'Edit and Playback',
        navLabel: 'Edit & Playback',
        description:
          'Review transcript segments, keep timestamps aligned to playback, search the transcript, and use the editor tools without leaving the main workspace.',
        contentFile: 'en/edit-and-playback.md',
      },
      'zh-CN': {
        title: '编辑与播放',
        navLabel: '编辑与播放',
        description:
          '围绕时间戳、分段编辑、搜索与播放器，了解 Sona 的主编辑区应该如何配合使用。',
        contentFile: 'zh-CN/edit-and-playback.md',
      },
    },
  },
  {
    id: 'ai-polish-and-translate',
    slug: ['ai-polish-and-translate'],
    group: 'workflow',
    localizations: {
      en: {
        title: 'AI Polish and Translate',
        navLabel: 'AI Polish & Translate',
        description:
          'Configure providers in Settings > LLM Service, run polish or translation only when needed, and understand what stays optional versus required.',
        contentFile: 'en/ai-polish-and-translate.md',
      },
      'zh-CN': {
        title: 'AI 润色与翻译',
        navLabel: 'AI 润色与翻译',
        description:
          '在设置中绑定 provider 与功能模型，再按需使用润色或翻译，而不把离线转录本身和 LLM 功能混在一起。',
        contentFile: 'zh-CN/ai-polish-and-translate.md',
      },
    },
  },
  {
    id: 'export-history-and-settings',
    slug: ['export-history-and-settings'],
    group: 'workflow',
    localizations: {
      en: {
        title: 'Export, History, and Settings',
        navLabel: 'Export / History / Settings',
        description:
          'Export finished work, reopen saved sessions from History, and focus on the settings areas that matter most for everyday use.',
        contentFile: 'en/export-history-and-settings.md',
      },
      'zh-CN': {
        title: '导出、历史记录与设置',
        navLabel: '导出 / 历史记录 / 设置',
        description:
          '完成导出、重新打开历史条目，并快速理解哪些设置项最值得优先了解。',
        contentFile: 'zh-CN/export-history-and-settings.md',
      },
    },
  },
  {
    id: 'faq',
    slug: ['faq'],
    group: 'reference',
    localizations: {
      en: {
        title: 'FAQ and Troubleshooting',
        navLabel: 'FAQ',
        description:
          'Find the common blockers around setup reminders, missing models, recording, import, translation, voice typing, playback, and source builds.',
        contentFile: 'en/faq.md',
      },
      'zh-CN': {
        title: '常见问题与排障',
        navLabel: 'FAQ',
        description:
          '汇总首次设置、模型缺失、录音、导入、翻译、语音输入法、播放器与源码构建等常见问题。',
        contentFile: 'zh-CN/faq.md',
      },
    },
  },
];

const userGuidePageDefinitionById = Object.fromEntries(
  userGuidePageDefinitions.map((definition) => [definition.id, definition]),
) as Record<UserGuidePageId, UserGuidePageDefinition>;

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://');
}

function arraysEqual(left: string[], right: string[]) {
  return (
    left.length === right.length &&
    left.every((segment, index) => segment === right[index])
  );
}

function getOtherLocale(locale: HomeLocale): HomeLocale {
  return locale === 'en' ? 'zh-CN' : 'en';
}

function getLocaleHomeHref(locale: HomeLocale) {
  return locale === 'en' ? '/' : '/zh';
}

function getGuideSourceHref(locale: HomeLocale) {
  return locale === 'en'
    ? `${GITHUB_BLOB_ROOT}/docs/user-guide.md`
    : `${GITHUB_BLOB_ROOT}/docs/user-guide.zh-CN.md`;
}

function getCliGuideHref(locale: HomeLocale) {
  return locale === 'en'
    ? `${GITHUB_BLOB_ROOT}/docs/cli.md`
    : `${GITHUB_BLOB_ROOT}/docs/cli.zh-CN.md`;
}

function getReadmeHref(locale: HomeLocale) {
  return locale === 'en'
    ? `${GITHUB_BLOB_ROOT}/README.md`
    : `${GITHUB_BLOB_ROOT}/README.zh-CN.md`;
}

export function buildUserGuidePath(
  locale: HomeLocale,
  pageId: UserGuidePageId,
) {
  const prefix = GUIDE_PREFIXES[locale];
  const slug = userGuidePageDefinitionById[pageId].slug;

  return slug.length > 0 ? `${prefix}/${slug.join('/')}` : prefix;
}

function buildUserGuideNavItem(
  locale: HomeLocale,
  pageId: UserGuidePageId,
  active: boolean,
): UserGuideNavItem {
  const definition = userGuidePageDefinitionById[pageId];
  const localized = definition.localizations[locale];

  return {
    id: pageId,
    title: localized.navLabel,
    description: localized.description,
    path: buildUserGuidePath(locale, pageId),
    active,
  };
}

export function getUserGuidePageById(
  locale: HomeLocale,
  pageId: UserGuidePageId,
): UserGuidePageModel {
  const definition = userGuidePageDefinitionById[pageId];
  const localized = definition.localizations[locale];
  const ui = userGuideUiContent[locale];
  const currentIndex = USER_GUIDE_PAGE_ORDER.indexOf(pageId);
  const previousId =
    currentIndex > 0 ? USER_GUIDE_PAGE_ORDER[currentIndex - 1] : null;
  const nextId =
    currentIndex < USER_GUIDE_PAGE_ORDER.length - 1
      ? USER_GUIDE_PAGE_ORDER[currentIndex + 1]
      : null;

  return {
    id: pageId,
    locale,
    title: localized.title,
    navLabel: localized.navLabel,
    description: localized.description,
    contentFile: localized.contentFile,
    path: buildUserGuidePath(locale, pageId),
    alternatePath: buildUserGuidePath(getOtherLocale(locale), pageId),
    homeHref: getLocaleHomeHref(locale),
    homeLabel: ui.homeLabel,
    alternateLanguageLabel: ui.alternateLanguageLabel,
    sourceHref: getGuideSourceHref(locale),
    sourceLabel: ui.sourceLabel,
    guideLabel: ui.guideLabel,
    sidebarTitle: ui.sidebarTitle,
    mobileNavLabel: ui.mobileNavLabel,
    previousLabel: ui.previousLabel,
    nextLabel: ui.nextLabel,
    groupId: definition.group,
    groupLabel: ui.groupLabels[definition.group],
    previousPage: previousId
      ? buildUserGuideNavItem(locale, previousId, false)
      : null,
    nextPage: nextId ? buildUserGuideNavItem(locale, nextId, false) : null,
  };
}

export function getUserGuidePageFromSlug(
  locale: HomeLocale,
  slug: string[] | undefined,
) {
  const normalizedSlug = slug ?? [];
  const definition = userGuidePageDefinitions.find((candidate) =>
    arraysEqual(candidate.slug, normalizedSlug),
  );

  if (!definition) {
    return null;
  }

  return getUserGuidePageById(locale, definition.id);
}

export function getUserGuideNavigation(
  locale: HomeLocale,
  activePageId: UserGuidePageId,
): UserGuideNavGroup[] {
  const ui = userGuideUiContent[locale];

  return (Object.keys(ui.groupLabels) as UserGuideNavGroupId[]).map(
    (groupId) => ({
      id: groupId,
      label: ui.groupLabels[groupId],
      items: USER_GUIDE_PAGE_ORDER.filter(
        (pageId) => userGuidePageDefinitionById[pageId].group === groupId,
      ).map((pageId) =>
        buildUserGuideNavItem(locale, pageId, pageId === activePageId),
      ),
    }),
  );
}

export function getUserGuideOverviewCards(locale: HomeLocale) {
  return (['getting-started', 'live-record', 'batch-import'] as const).map((pageId) =>
    buildUserGuideNavItem(locale, pageId, false),
  );
}

export function getUserGuideStaticParams() {
  return USER_GUIDE_PAGE_ORDER.map((pageId) => ({
    slug: userGuidePageDefinitionById[pageId].slug,
  }));
}

export function getAllUserGuidePaths() {
  return (['en', 'zh-CN'] as HomeLocale[]).flatMap((locale) =>
    USER_GUIDE_PAGE_ORDER.map((pageId) => buildUserGuidePath(locale, pageId)),
  );
}

export function getUserGuideUiCopy(locale: HomeLocale) {
  return userGuideUiContent[locale];
}

export const getUserGuideMarkdown = cache(
  async (locale: HomeLocale, pageId: UserGuidePageId) => {
    const page = getUserGuidePageById(locale, pageId);
    const filePath = path.join(USER_GUIDE_CONTENT_DIR, page.contentFile);

    return readFile(filePath, 'utf8');
  },
);

const legacyRelativeLinkOverrides: Record<string, string> = {
  'user-guide.md': 'guide:overview',
  'user-guide.zh-CN.md': 'guide:overview',
  'cli.md': 'cli',
  'cli.zh-CN.md': 'cli',
  '../README.md': 'readme',
  '../README.zh-CN.md': 'readme',
};

export function resolveUserGuideHref(
  locale: HomeLocale,
  href: string | undefined,
) {
  if (!href) {
    return { href: '#', external: false };
  }

  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('#')
  ) {
    return { href, external: isExternalHref(href) };
  }

  if (href.startsWith('/')) {
    return { href, external: false };
  }

  const normalizedHref = href.replace(/^\.\//, '');
  const token = legacyRelativeLinkOverrides[href] ?? legacyRelativeLinkOverrides[normalizedHref] ?? normalizedHref;

  if (token.startsWith('guide:')) {
    const pageId = token.replace('guide:', '') as UserGuidePageId;

    if (pageId in userGuidePageDefinitionById) {
      return {
        href: buildUserGuidePath(locale, pageId),
        external: false,
      };
    }
  }

  if (token === 'cli') {
    return {
      href: getCliGuideHref(locale),
      external: true,
    };
  }

  if (token === 'readme') {
    return {
      href: getReadmeHref(locale),
      external: true,
    };
  }

  return {
    href: `${GITHUB_BLOB_ROOT}/docs/${normalizedHref}`,
    external: true,
  };
}
