import type { Metadata } from 'next';
import { homePageContent, type HomeLocale } from '@/lib/homepage-content';
import { getSiteUrl } from '@/lib/site-url';

const localePaths: Record<HomeLocale, string> = {
  en: '/',
  'zh-CN': '/zh',
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
