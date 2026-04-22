import type { Metadata } from 'next';
import { downloadContent } from '@/lib/download-content';
import { homePageContent, type HomeLocale } from '@/lib/homepage-content';
import { getSiteUrl } from '@/lib/site-url';
import { getUserGuidePageFromSlug } from '@/lib/user-guide-content';

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
      canonical: page.path,
      languages: {
        en:
          page.locale === 'en'
            ? page.path
            : page.alternatePath,
        'zh-CN':
          page.locale === 'zh-CN'
            ? page.path
            : page.alternatePath,
        'x-default':
          page.locale === 'en'
            ? page.path
            : page.alternatePath,
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

export function createDownloadsPageMetadata(locale: HomeLocale): Metadata {
  const content = downloadContent[locale];
  const currentPath = locale === 'en' ? '/downloads' : '/zh/downloads';

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
        en: '/downloads',
        'zh-CN': '/zh/downloads',
        'x-default': '/downloads',
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
