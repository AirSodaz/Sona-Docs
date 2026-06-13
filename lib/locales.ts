import type { HomeLocale } from '@/lib/homepage-content';

export interface LocaleMetadata {
  code: HomeLocale;
  isCjk: boolean;
  label: string;
  openGraphLocale: string;
  shortLabel: string;
}

export const localeMetadata = {
  en: {
    code: 'en',
    isCjk: false,
    label: 'English',
    openGraphLocale: 'en_US',
    shortLabel: 'EN',
  },
  'zh-CN': {
    code: 'zh-CN',
    isCjk: true,
    label: '简体中文',
    openGraphLocale: 'zh_CN',
    shortLabel: '中',
  },
  'zh-TW': {
    code: 'zh-TW',
    isCjk: true,
    label: '繁體中文',
    openGraphLocale: 'zh_TW',
    shortLabel: '繁',
  },
  ja: {
    code: 'ja',
    isCjk: true,
    label: '日本語',
    openGraphLocale: 'ja_JP',
    shortLabel: '日',
  },
  ko: {
    code: 'ko',
    isCjk: true,
    label: '한국어',
    openGraphLocale: 'ko_KR',
    shortLabel: '한',
  },
} satisfies Record<HomeLocale, LocaleMetadata>;

export const supportedLocales = [
  'en',
  'zh-CN',
  'zh-TW',
  'ja',
  'ko',
] as const satisfies readonly HomeLocale[];

export function isHomeLocale(value: unknown): value is HomeLocale {
  return (
    typeof value === 'string' &&
    supportedLocales.includes(value as HomeLocale)
  );
}

export function getLocaleMetadata(locale: HomeLocale) {
  return localeMetadata[locale];
}
