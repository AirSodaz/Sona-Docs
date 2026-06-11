import type { MetadataRoute } from 'next';
import { getAbsoluteUrl } from '@/lib/site-url';
import { getAllUserGuidePaths } from '@/lib/user-guide-content';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales;

  // Base pages for each locale
  const basePaths = locales.flatMap((locale) => [
    `/${locale}`,
    `/${locale}/downloads`,
    `/${locale}/trust`,
    `/${locale}/privacy`,
  ]);

  // User guide pages (already includes all locales)
  const userGuidePaths = getAllUserGuidePaths();

  const allPaths = [...basePaths, ...userGuidePaths];

  return allPaths.map((route) => {
    let priority = 0.9;
    
    // Home pages
    if (locales.some(l => route === `/${l}`)) {
      priority = 1;
    } 
    // High value pages
    else if (route.endsWith('/downloads')) {
      priority = 0.92;
    } else if (route.includes('/user-guide')) {
      priority = 0.95;
    } 
    // Legal/Trust pages
    else if (route.endsWith('/trust') || route.endsWith('/privacy')) {
      priority = 0.88;
    }

    return {
      url: getAbsoluteUrl(route),
      changeFrequency: 'weekly',
      priority,
    };
  });
}
