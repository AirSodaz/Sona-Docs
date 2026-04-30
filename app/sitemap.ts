import type { MetadataRoute } from 'next';
import { getAbsoluteUrl } from '@/lib/site-url';
import { getAllTrustPrivacyPaths } from '@/lib/trust-privacy-content';
import { getAllUserGuidePaths } from '@/lib/user-guide-content';

const routes = [
  '/',
  '/zh',
  '/downloads',
  '/zh/downloads',
  ...getAllTrustPrivacyPaths(),
  ...getAllUserGuidePaths(),
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: getAbsoluteUrl(route),
    changeFrequency: 'weekly',
    priority:
      route === '/'
        ? 1
        : route === '/downloads' || route === '/zh/downloads'
          ? 0.92
        : route === '/user-guide' || route === '/zh/user-guide'
          ? 0.95
          : route === '/trust' ||
              route === '/zh/trust' ||
              route === '/privacy' ||
              route === '/zh/privacy'
            ? 0.88
          : 0.9,
  }));
}
