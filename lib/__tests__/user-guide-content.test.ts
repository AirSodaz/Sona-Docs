import { describe, expect, it } from 'vitest';
import {
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

    const englishPage = getUserGuidePageFromSlug('en', ['api']);
    const chinesePage = getUserGuidePageFromSlug('zh-CN', ['api']);
    const taiwanPage = getUserGuidePageFromSlug('zh-TW', ['api']);
    const japanesePage = getUserGuidePageFromSlug('ja', ['api']);

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
      'https://github.com/AirSodaz/sona/blob/master/docs/api.zh-TW.md',
    );
    expect(japanesePage?.id).toBe('api-guide');
    expect(japanesePage?.sourceHref).toBe(
      'https://github.com/AirSodaz/sona/blob/master/docs/api.ja.md',
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
    expect(resolveUserGuideHref('ja', '../README.ja.md')).toEqual({
      external: true,
      href: 'https://github.com/AirSodaz/sona/blob/master/README.ja.md',
    });
  });
});
