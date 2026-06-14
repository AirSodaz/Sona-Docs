import type { CSSProperties } from 'react';
import type { HomeLocale } from '@/lib/homepage-content';
import { getLocaleMetadata } from '@/lib/locales';

export type DisplayTypographyVariant =
  | 'guideSection'
  | 'hero'
  | 'page'
  | 'section';

export interface LocaleTypography {
  className: string;
  isCjk: boolean;
  style: CSSProperties;
}

const cjkDisplayFontFamilies: Record<HomeLocale, string> = {
  en: 'Georgia, serif',
  'zh-CN':
    '"Songti SC", "STSong", "SimSun", "Noto Serif CJK SC", "Source Han Serif SC", serif',
  'zh-TW':
    '"Songti TC", "PMingLiU", "MingLiU", "Noto Serif CJK TC", "Source Han Serif TC", serif',
  ja:
    '"Yu Mincho", "Hiragino Mincho ProN", "Hiragino Mincho Pro", "Noto Serif CJK JP", "Source Han Serif JP", serif',
  ko:
    'Batang, "AppleMyungjo", "Noto Serif CJK KR", "Source Han Serif KR", serif',
};

const englishDisplayClasses: Record<DisplayTypographyVariant, string> = {
  guideSection:
    'text-[1.8rem] leading-tight font-serif italic sm:text-[2.2rem]',
  hero:
    'text-[clamp(2.7rem,12vw,4.5rem)] leading-[0.94] font-serif italic sm:text-6xl md:text-7xl',
  page:
    'text-[clamp(2.5rem,8vw,3.5rem)] leading-[1] font-serif italic',
  section:
    'text-[clamp(2.45rem,7vw,4.45rem)] leading-[0.96]',
};

const cjkDisplayClasses: Record<DisplayTypographyVariant, string> = {
  guideSection:
    'text-[1.85rem] leading-[1.18] font-normal tracking-[0.01em] sm:text-[2.2rem]',
  hero:
    'text-[clamp(2.55rem,10.5vw,4.25rem)] leading-[1.06] font-normal tracking-[0.01em] sm:text-[3.75rem] md:text-[4.25rem]',
  page:
    'text-[clamp(2.35rem,7.2vw,3.35rem)] leading-[1.1] font-normal tracking-[0.01em]',
  section:
    'text-[clamp(2.25rem,6.4vw,3.85rem)] leading-[1.1] font-normal tracking-[0.01em]',
};

const italicDisplayVariants = new Set<DisplayTypographyVariant>([
  'guideSection',
  'hero',
  'page',
]);

export function getDisplayTypography(
  locale: HomeLocale,
  variant: DisplayTypographyVariant,
): LocaleTypography {
  const isCjk = getLocaleMetadata(locale).isCjk;

  if (isCjk) {
    return {
      className: cjkDisplayClasses[variant],
      isCjk,
      style: {
        fontFamily: cjkDisplayFontFamilies[locale],
        fontStyle: 'normal',
        letterSpacing: '0.01em',
      },
    };
  }

  return {
    className: englishDisplayClasses[variant],
    isCjk,
    style: {
      fontFamily:
        variant === 'section' ? 'var(--font-serif)' : 'Georgia, serif',
      fontStyle: italicDisplayVariants.has(variant) ? 'italic' : 'normal',
    },
  };
}

export function getEyebrowTypography(
  locale: HomeLocale,
  englishTrackingClass = 'tracking-[0.28em]',
) {
  const isCjk = getLocaleMetadata(locale).isCjk;

  return {
    className: isCjk ? 'tracking-[0.12em]' : englishTrackingClass,
    isCjk,
  };
}
