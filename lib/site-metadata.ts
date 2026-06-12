import type { Metadata } from 'next';
import { type HomeLocale } from '@/lib/homepage-content';
import { getSiteUrl } from '@/lib/site-url';
import { getUserGuidePageFromSlug, buildUserGuidePath } from '@/lib/user-guide-content';

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
      canonical: buildUserGuidePath(locale, page.id),
      languages: {
        en: buildUserGuidePath('en', page.id),
        'zh-CN': buildUserGuidePath('zh-CN', page.id),
        'zh-TW': buildUserGuidePath('zh-TW', page.id),
        ja: buildUserGuidePath('ja', page.id),
        ko: buildUserGuidePath('ko', page.id),
        'x-default': buildUserGuidePath('en', page.id),
      },
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.path,
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
