import { describe, expect, it } from 'vitest';
import {
  buildLocalizedUserGuidePath,
  getAllUserGuidePaths,
  getUserGuidePageFromSlug,
  resolveUserGuideHref,
} from '../user-guide-content';

describe('user guide content', () => {
  it('generates localized API guide pages with API source docs', () => {
    expect(getAllUserGuidePaths()).toContain('/en/user-guide/api');
    expect(getAllUserGuidePaths()).toContain('/zh-CN/user-guide/api');
    expect(getAllUserGuidePaths()).toContain('/zh-TW/user-guide/api');
    expect(getAllUserGuidePaths()).toContain('/ja/user-guide/api');
    expect(getAllUserGuidePaths()).toContain('/ko/user-guide/api');

    const englishPage = getUserGuidePageFromSlug('en', ['api']);
    const chinesePage = getUserGuidePageFromSlug('zh-CN', ['api']);
    const taiwanPage = getUserGuidePageFromSlug('zh-TW', ['api']);
    const japanesePage = getUserGuidePageFromSlug('ja', ['api']);
    const koreanPage = getUserGuidePageFromSlug('ko', ['api']);

    expect(englishPage?.id).toBe('api-guide');
    expect(englishPage?.sourceHref).toBe(
      'https://github.com/AirSodaz/sona/blob/master/docs/api.md',
    );
    expect(chinesePage?.id).toBe('api-guide');
    expect(chinesePage?.sourceHref).toBe(
      'https://github.com/AirSodaz/sona/blob/master/docs/api.zh-CN.md',
    );
    expect(taiwanPage?.id).toBe('api-guide');
    expect(taiwanPage?.sourceHref).toBe(
      'https://github.com/AirSodaz/sona/blob/master/docs/api.md',
    );
    expect(japanesePage?.id).toBe('api-guide');
    expect(japanesePage?.sourceHref).toBe(
      'https://github.com/AirSodaz/sona/blob/master/docs/api.md',
    );
    expect(koreanPage?.id).toBe('api-guide');
    expect(koreanPage?.sourceHref).toBe(
      'https://github.com/AirSodaz/sona/blob/master/docs/api.md',
    );
  });

  it('builds public guide paths with locale prefixes for SEO surfaces', () => {
    expect(buildLocalizedUserGuidePath('en', 'api-guide')).toBe(
      '/en/user-guide/api',
    );
    expect(buildLocalizedUserGuidePath('zh-CN', 'api-guide')).toBe(
      '/zh-CN/user-guide/api',
    );
    expect(buildLocalizedUserGuidePath('zh-TW', 'api-guide')).toBe(
      '/zh-TW/user-guide/api',
    );
    expect(buildLocalizedUserGuidePath('ja', 'api-guide')).toBe(
      '/ja/user-guide/api',
    );
    expect(buildLocalizedUserGuidePath('ko', 'api-guide')).toBe(
      '/ko/user-guide/api',
    );
  });

  it('resolves legacy API doc links to the in-site API guide', () => {
    expect(resolveUserGuideHref('en', 'api.md')).toEqual({
      external: false,
      href: '/user-guide/api',
    });
    expect(resolveUserGuideHref('zh-CN', 'api.zh-CN.md')).toEqual({
      external: false,
      href: '/user-guide/api',
    });
    expect(resolveUserGuideHref('zh-TW', 'api.zh-TW.md')).toEqual({
      external: false,
      href: '/user-guide/api',
    });
    expect(resolveUserGuideHref('ja', 'api.ja.md')).toEqual({
      external: false,
      href: '/user-guide/api',
    });
    expect(resolveUserGuideHref('ja', 'cli.ja.md')).toEqual({
      external: false,
      href: '/user-guide/cli',
    });
    expect(resolveUserGuideHref('ja', 'user-guide.ja.md')).toEqual({
      external: false,
      href: '/user-guide',
    });
    expect(resolveUserGuideHref('ko', 'api.ko.md')).toEqual({
      external: false,
      href: '/user-guide/api',
    });
    expect(resolveUserGuideHref('ko', 'cli.ko.md')).toEqual({
      external: false,
      href: '/user-guide/cli',
    });
    expect(resolveUserGuideHref('ko', 'user-guide.ko.md')).toEqual({
      external: false,
      href: '/user-guide',
    });
    expect(resolveUserGuideHref('ja', '../README.ja.md')).toEqual({
      external: true,
      href: 'https://github.com/AirSodaz/sona/blob/master/README.md',
    });
    expect(resolveUserGuideHref('ko', '../README.ko.md')).toEqual({
      external: true,
      href: 'https://github.com/AirSodaz/sona/blob/master/README.md',
    });
  });

  it('falls back removed Traditional Chinese, Japanese, and Korean source docs to English repo docs', () => {
    const taiwanOverview = getUserGuidePageFromSlug('zh-TW', []);
    const japaneseOverview = getUserGuidePageFromSlug('ja', []);
    const koreanOverview = getUserGuidePageFromSlug('ko', []);
    const taiwanCli = getUserGuidePageFromSlug('zh-TW', ['cli']);
    const japaneseCli = getUserGuidePageFromSlug('ja', ['cli']);
    const koreanCli = getUserGuidePageFromSlug('ko', ['cli']);

    expect(taiwanOverview?.sourceHref).toBe(
      'https://github.com/AirSodaz/sona/blob/master/docs/user-guide.md',
    );
    expect(japaneseOverview?.sourceHref).toBe(
      'https://github.com/AirSodaz/sona/blob/master/docs/user-guide.md',
    );
    expect(koreanOverview?.sourceHref).toBe(
      'https://github.com/AirSodaz/sona/blob/master/docs/user-guide.md',
    );
    expect(taiwanCli?.sourceHref).toBe(
      'https://github.com/AirSodaz/sona/blob/master/docs/cli.md',
    );
    expect(japaneseCli?.sourceHref).toBe(
      'https://github.com/AirSodaz/sona/blob/master/docs/cli.md',
    );
    expect(koreanCli?.sourceHref).toBe(
      'https://github.com/AirSodaz/sona/blob/master/docs/cli.md',
    );
  });
});
