import type { Metadata } from 'next';
import { type HomeLocale } from '@/lib/homepage-content';
import { getLocaleMetadata, localeMetadata } from '@/lib/locales';
import { getSiteUrl } from '@/lib/site-url';
import {
  buildLocalizedUserGuidePath,
  getUserGuidePageFromSlug,
} from '@/lib/user-guide-content';

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
      locale: getLocaleMetadata(locale).openGraphLocale,
      alternateLocale: Object.values(localeMetadata).map(
        (metadata) => metadata.openGraphLocale,
      ).filter(
        (value) => value !== getLocaleMetadata(locale).openGraphLocale,
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
