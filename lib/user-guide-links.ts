import type { HomeLocale } from '@/lib/homepage-content';
import {
  buildUserGuidePath,
  isUserGuidePageId,
  type UserGuidePageId,
} from '@/lib/user-guide-content';

const GITHUB_REPO_URL = 'https://github.com/AirSodaz/sona';
const GITHUB_BLOB_ROOT = `${GITHUB_REPO_URL}/blob/master`;

const sourceDocLocaleMap = {
  en: 'en',
  'zh-CN': 'zh-CN',
  'zh-TW': 'en',
  ja: 'en',
  ko: 'en',
} satisfies Record<HomeLocale, 'en' | 'zh-CN'>;

const legacyRelativeLinkOverrides: Record<string, string> = {
  'user-guide.md': 'guide:overview',
  'user-guide.zh-CN.md': 'guide:overview',
  'user-guide.zh-TW.md': 'guide:overview',
  'user-guide.ja.md': 'guide:overview',
  'user-guide.ko.md': 'guide:overview',
  cli: 'guide:cli-guide',
  'cli.md': 'guide:cli-guide',
  'cli.zh-CN.md': 'guide:cli-guide',
  'cli.zh-TW.md': 'guide:cli-guide',
  'cli.ja.md': 'guide:cli-guide',
  'cli.ko.md': 'guide:cli-guide',
  api: 'guide:api-guide',
  'api.md': 'guide:api-guide',
  'api.zh-CN.md': 'guide:api-guide',
  'api.zh-TW.md': 'guide:api-guide',
  'api.ja.md': 'guide:api-guide',
  'api.ko.md': 'guide:api-guide',
  '../README.md': 'readme',
  '../README.zh-CN.md': 'readme',
  '../README.zh-TW.md': 'readme',
  '../README.ja.md': 'readme',
  '../README.ko.md': 'readme',
};

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://');
}

function normalizeUserGuideHrefToken(href: string) {
  const normalizedHref = href.replace(/^\.\//, '');

  return (
    legacyRelativeLinkOverrides[href] ??
    legacyRelativeLinkOverrides[normalizedHref] ??
    normalizedHref
  );
}

function getReadmeHref(locale: HomeLocale) {
  return sourceDocLocaleMap[locale] === 'zh-CN'
    ? `${GITHUB_BLOB_ROOT}/README.zh-CN.md`
    : `${GITHUB_BLOB_ROOT}/README.md`;
}

export function getUserGuidePageIdFromHrefToken(
  href: string | undefined,
): UserGuidePageId | null {
  if (!href) {
    return null;
  }

  const token = normalizeUserGuideHrefToken(href);

  if (!token.startsWith('guide:')) {
    return null;
  }

  const pageId = token.replace('guide:', '');

  return isUserGuidePageId(pageId) ? pageId : null;
}

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
  const token = normalizeUserGuideHrefToken(href);
  const pageId = getUserGuidePageIdFromHrefToken(href);

  if (pageId) {
    return {
      href: buildUserGuidePath(locale, pageId),
      external: false,
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
