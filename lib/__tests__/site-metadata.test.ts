import { describe, expect, it } from 'vitest';
import { createGuidePageMetadata } from '../site-metadata';

describe('site metadata', () => {
  it('uses locale-prefixed public guide paths for Korean SEO metadata', () => {
    const metadata = createGuidePageMetadata('ko', ['api']);

    expect(metadata.alternates?.canonical).toBe('/ko/user-guide/api');
    expect(metadata.alternates?.languages).toMatchObject({
      en: '/en/user-guide/api',
      ko: '/ko/user-guide/api',
      'x-default': '/en/user-guide/api',
    });
    expect(metadata.openGraph).toMatchObject({
      url: '/ko/user-guide/api',
    });
  });
});
