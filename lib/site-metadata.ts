import type { Metadata } from 'next';
import { type HomeLocale } from '@/lib/homepage-content';
import { getSiteUrl } from '@/lib/site-url';
import {
  buildLocalizedUserGuidePath,
  getUserGuidePageFromSlug,
} from '@/lib/user-guide-content';

const openGraphLocales: Record<HomeLocale, string> = {
  en: 'en_US',
  'zh-CN': 'zh_CN',
  'zh-TW': 'zh_TW',
  ja: 'ja_JP',
  ko: 'ko_KR',
};

export function createGuidePageMetadata(
  locale: HomeLocale,
  slug?: string[],
): Metadata {
  const page = getUserGuidePageFromSlug(locale, slug) ?? getUserGuidePageFromSlug(locale, undefined);

  if (!page) {
    return {
      metadataBase: getSiteUrl(),
    };
  }

  return {
    metadataBase: getSiteUrl(),
    title: page.title,
    description: page.description,
    icons: {
      icon: '/icon.svg',
    },
    alternates: {
      canonical: buildLocalizedUserGuidePath(locale, page.id),
      languages: {
        en: buildLocalizedUserGuidePath('en', page.id),
        'zh-CN': buildLocalizedUserGuidePath('zh-CN', page.id),
        'zh-TW': buildLocalizedUserGuidePath('zh-TW', page.id),
        ja: buildLocalizedUserGuidePath('ja', page.id),
        ko: buildLocalizedUserGuidePath('ko', page.id),
        'x-default': buildLocalizedUserGuidePath('en', page.id),
      },
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: buildLocalizedUserGuidePath(locale, page.id),
      locale: openGraphLocales[locale],
      alternateLocale: Object.values(openGraphLocales).filter(
        (value) => value !== openGraphLocales[locale],
      ),
      siteName: 'Sona',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
    },
  };
}
