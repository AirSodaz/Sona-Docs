import type { Metadata } from 'next';
import { downloadContent } from '@/lib/download-content';
import { homePageContent, type HomeLocale } from '@/lib/homepage-content';
import { getSiteUrl } from '@/lib/site-url';
import {
  getTrustPrivacyPageContent,
  type TrustPrivacyPageId,
} from '@/lib/trust-privacy-content';
import { getUserGuidePageFromSlug, buildUserGuidePath } from '@/lib/user-guide-content';

const localePaths: Record<HomeLocale, string> = {
  en: '/en',
  'zh-CN': '/zh-CN',
  'zh-TW': '/zh-TW',
  ja: '/ja',
};

const openGraphLocales: Record<HomeLocale, string> = {
  en: 'en_US',
  'zh-CN': 'zh_CN',
  'zh-TW': 'zh_TW',
  ja: 'ja_JP',
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
        'zh-TW': localePaths['zh-TW'],
        ja: localePaths.ja,
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
      canonical: buildUserGuidePath(locale, page.id),
      languages: {
        en: buildUserGuidePath('en', page.id),
        'zh-CN': buildUserGuidePath('zh-CN', page.id),
        'zh-TW': buildUserGuidePath('zh-TW', page.id),
        ja: buildUserGuidePath('ja', page.id),
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

export function createDownloadsPageMetadata(locale: HomeLocale): Metadata {
  const content = downloadContent[locale];
  const currentPath = `${localePaths[locale]}/downloads`;

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
        en: `${localePaths.en}/downloads`,
        'zh-CN': `${localePaths['zh-CN']}/downloads`,
        'zh-TW': `${localePaths['zh-TW']}/downloads`,
        ja: `${localePaths.ja}/downloads`,
        'x-default': `${localePaths.en}/downloads`,
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

export function createTrustPrivacyPageMetadata(
  locale: HomeLocale,
  pageId: TrustPrivacyPageId,
): Metadata {
  const content = getTrustPrivacyPageContent(locale, pageId);
  const currentPath = `${localePaths[locale]}/${pageId}`;

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
        en: `${localePaths.en}/${pageId}`,
        'zh-CN': `${localePaths['zh-CN']}/${pageId}`,
        'zh-TW': `${localePaths['zh-TW']}/${pageId}`,
        ja: `${localePaths.ja}/${pageId}`,
        'x-default': `${localePaths.en}/${pageId}`,
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
