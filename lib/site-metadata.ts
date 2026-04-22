import type { Metadata } from 'next';
import { homePageContent, type HomeLocale } from '@/lib/homepage-content';
import { getSiteUrl } from '@/lib/site-url';
import { userGuidePageContent } from '@/lib/user-guide-content';

const localePaths: Record<HomeLocale, string> = {
  en: '/',
  'zh-CN': '/zh',
};

const guideLocalePaths: Record<HomeLocale, string> = {
  en: '/user-guide',
  'zh-CN': '/zh/user-guide',
};

const openGraphLocales: Record<HomeLocale, string> = {
  en: 'en_US',
  'zh-CN': 'zh_CN',
};

export function createHomePageMetadata(locale: HomeLocale): Metadata {
  const content = homePageContent[locale];
  const currentPath = localePaths[locale];

  return {
    metadataBase: getSiteUrl(),
    title: content.metadata.title,
    description: content.metadata.description,
    icons: {
      icon: '/icon.svg',
    },
    alternates: {
      canonical: currentPath,
      languages: {
        en: localePaths.en,
        'zh-CN': localePaths['zh-CN'],
        'x-default': localePaths.en,
      },
    },
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      url: currentPath,
      locale: openGraphLocales[locale],
      alternateLocale: Object.values(openGraphLocales).filter(
        (value) => value !== openGraphLocales[locale],
      ),
      siteName: 'Sona',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metadata.title,
      description: content.metadata.description,
    },
  };
}

export function createGuidePageMetadata(locale: HomeLocale): Metadata {
  const content = userGuidePageContent[locale];
  const currentPath = guideLocalePaths[locale];

  return {
    metadataBase: getSiteUrl(),
    title: content.metadata.title,
    description: content.metadata.description,
    icons: {
      icon: '/icon.svg',
    },
    alternates: {
      canonical: currentPath,
      languages: {
        en: guideLocalePaths.en,
        'zh-CN': guideLocalePaths['zh-CN'],
        'x-default': guideLocalePaths.en,
      },
    },
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      url: currentPath,
      locale: openGraphLocales[locale],
      alternateLocale: Object.values(openGraphLocales).filter(
        (value) => value !== openGraphLocales[locale],
      ),
      siteName: 'Sona',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metadata.title,
      description: content.metadata.description,
    },
  };
}
