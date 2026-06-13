import { describe, expect, it } from 'vitest';
import enMessages from '@/messages/en.json';
import jaMessages from '@/messages/ja.json';
import koMessages from '@/messages/ko.json';
import zhCnMessages from '@/messages/zh-CN.json';
import zhTwMessages from '@/messages/zh-TW.json';
import {
  isHomeLocale,
  localeMetadata,
  supportedLocales,
} from '../locales';

const guideMessages = {
  en: enMessages.UserGuidePage,
  'zh-CN': zhCnMessages.UserGuidePage,
  'zh-TW': zhTwMessages.UserGuidePage,
  ja: jaMessages.UserGuidePage,
  ko: koMessages.UserGuidePage,
};

describe('locale metadata', () => {
  it('covers every routed locale and drives locale validation', () => {
    expect(Object.keys(localeMetadata).sort()).toEqual(
      [...supportedLocales].sort(),
    );

    for (const locale of supportedLocales) {
      expect(isHomeLocale(locale)).toBe(true);
      expect(localeMetadata[locale].code).toBe(locale);
    }

    expect(isHomeLocale('zh')).toBe(false);
    expect(isHomeLocale('fr')).toBe(false);
  });

  it('keeps CJK and Open Graph metadata locale-specific', () => {
    expect(localeMetadata.en.isCjk).toBe(false);
    expect(localeMetadata['zh-CN'].isCjk).toBe(true);
    expect(localeMetadata['zh-TW'].isCjk).toBe(true);
    expect(localeMetadata.ja.openGraphLocale).toBe('ja_JP');
    expect(localeMetadata.ko.openGraphLocale).toBe('ko_KR');
  });
});

describe('user guide message copy', () => {
  it('stores search and assistant copy in every locale message file', () => {
    for (const locale of supportedLocales) {
      const namespace = guideMessages[locale];

      expect(namespace.search.inputLabel).toBeTruthy();
      expect(namespace.search.resultsLabel).toBeTruthy();
      expect(namespace.assistant.title).toBeTruthy();
      expect(namespace.assistant.examples.pagePurpose).toContain(
        '{pageTitle}',
      );
    }
  });

  it('does not fall back zh-TW, Japanese, or Korean assistant copy to Simplified Chinese', () => {
    expect(guideMessages['zh-TW'].assistant.inputPlaceholder).toContain(
      '這頁內容',
    );
    expect(guideMessages.ja.assistant.inputPlaceholder).toContain(
      'このページ',
    );
    expect(guideMessages.ko.assistant.inputPlaceholder).toContain(
      '이 페이지',
    );
    expect(guideMessages['zh-TW'].assistant.inputPlaceholder).not.toContain(
      '这页内容',
    );
    expect(guideMessages.ko.assistant.title).not.toBe('向 AI 提问');
  });
});
