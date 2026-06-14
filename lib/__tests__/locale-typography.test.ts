import { describe, expect, it } from 'vitest';
import { supportedLocales } from '@/lib/locales';
import {
  getDisplayTypography,
  getEyebrowTypography,
  type DisplayTypographyVariant,
} from '../locale-typography';

const variants: DisplayTypographyVariant[] = [
  'hero',
  'page',
  'section',
  'guideSection',
];

describe('locale display typography', () => {
  it('keeps English on the current serif display treatment', () => {
    expect(getDisplayTypography('en', 'hero')).toMatchObject({
      className: expect.stringContaining('font-serif italic'),
      isCjk: false,
      style: {
        fontFamily: 'Georgia, serif',
        fontStyle: 'italic',
      },
    });

    expect(getDisplayTypography('en', 'section')).toMatchObject({
      isCjk: false,
      style: {
        fontFamily: 'var(--font-serif)',
        fontStyle: 'normal',
      },
    });
  });

  it('uses CJK editorial serif typography without italic styling', () => {
    for (const locale of supportedLocales.filter((locale) => locale !== 'en')) {
      for (const variant of variants) {
        const typography = getDisplayTypography(locale, variant);

        expect(typography.isCjk).toBe(true);
        expect(typography.className).toContain('font-normal');
        expect(typography.className).toContain('leading-[');
        expect(typography.className).not.toContain('italic');
        expect(typography.style.fontFamily).toContain('serif');
        expect(typography.style.fontFamily).not.toContain('Georgia');
        expect(typography.style.fontStyle).toBe('normal');
        expect(typography.style.letterSpacing).toBe('0.01em');
      }
    }
  });

  it('uses locale-specific CJK editorial font fallbacks', () => {
    expect(getDisplayTypography('zh-CN', 'hero').style.fontFamily).toContain(
      'Songti SC',
    );
    expect(getDisplayTypography('zh-TW', 'hero').style.fontFamily).toContain(
      'Songti TC',
    );
    expect(getDisplayTypography('ja', 'hero').style.fontFamily).toContain(
      'Yu Mincho',
    );
    expect(getDisplayTypography('ko', 'hero').style.fontFamily).toContain(
      'Batang',
    );
  });

  it('keeps English eyebrow tracking while reducing CJK tracking', () => {
    expect(getEyebrowTypography('en', 'tracking-[0.32em]')).toMatchObject({
      className: 'tracking-[0.32em]',
      isCjk: false,
    });
    expect(getEyebrowTypography('ja', 'tracking-[0.32em]')).toMatchObject({
      className: 'tracking-[0.12em]',
      isCjk: true,
    });
  });
});
