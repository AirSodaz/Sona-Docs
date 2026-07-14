import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { supportedLocales } from '@/lib/locales';

describe('sitemap', () => {
  it('publishes a daily Nightly downloads route for every locale', () => {
    const entries = sitemap();
    const nightlyEntries = entries.filter((entry) =>
      entry.url.endsWith('/downloads/nightly'),
    );

    expect(nightlyEntries).toHaveLength(supportedLocales.length);
    for (const locale of supportedLocales) {
      expect(nightlyEntries).toContainEqual(
        expect.objectContaining({
          changeFrequency: 'daily',
          priority: 0.84,
          url: `http://localhost:3000/${locale}/downloads/nightly`,
        }),
      );
    }
  });
});
