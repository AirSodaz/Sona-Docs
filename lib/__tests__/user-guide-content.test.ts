import { describe, expect, it } from 'vitest';
import {
  getAllUserGuidePaths,
  getUserGuidePageFromSlug,
  resolveUserGuideHref,
} from '../user-guide-content';

describe('user guide content', () => {
  it('generates localized API guide pages with API source docs', () => {
    expect(getAllUserGuidePaths()).toContain('/user-guide/api');
    expect(getAllUserGuidePaths()).toContain('/zh/user-guide/api');

    const englishPage = getUserGuidePageFromSlug('en', ['api']);
    const chinesePage = getUserGuidePageFromSlug('zh-CN', ['api']);

    expect(englishPage?.id).toBe('api-guide');
    expect(englishPage?.sourceHref).toBe(
      'https://github.com/AirSodaz/sona/blob/master/docs/api.md',
    );
    expect(chinesePage?.id).toBe('api-guide');
    expect(chinesePage?.sourceHref).toBe(
      'https://github.com/AirSodaz/sona/blob/master/docs/api.zh-CN.md',
    );
  });

  it('resolves legacy API doc links to the in-site API guide', () => {
    expect(resolveUserGuideHref('en', 'api.md')).toEqual({
      external: false,
      href: '/user-guide/api',
    });
    expect(resolveUserGuideHref('zh-CN', 'api.zh-CN.md')).toEqual({
      external: false,
      href: '/zh/user-guide/api',
    });
  });
});
