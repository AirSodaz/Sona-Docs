import type { Metadata } from 'next';
import { homePageContent, type HomeLocale } from '@/lib/homepage-content';

const FALLBACK_SITE_URL = 'http://localhost:3000';

const localePaths: Record<HomeLocale, string> = {
  en: '/',
  'zh-CN': '/zh',
};

const openGraphLocales: Record<HomeLocale, string> = {
  en: 'en_US',
  'zh-CN': 'zh_CN',
};

function getMetadataBase() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    return new URL(FALLBACK_SITE_URL);
  }

  try {
    return new URL(configuredUrl);
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}

export function createHomePageMetadata(locale: HomeLocale): Metadata {
  const content = homePageContent[locale];
  const currentPath = localePaths[locale];

  return {
    metadataBase: getMetadataBase(),
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
      },
    },
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      url: currentPath,
      locale: openGraphLocales[locale],
      siteName: 'Sona',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: content.metadata.title,
      description: content.metadata.description,
    },
  };
}
