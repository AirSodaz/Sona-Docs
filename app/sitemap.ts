import type { MetadataRoute } from 'next';
import { getAbsoluteUrl } from '@/lib/site-url';
import { getAllUserGuidePaths } from '@/lib/user-guide-content';

const routes = ['/', '/zh', ...getAllUserGuidePaths()] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: getAbsoluteUrl(route),
    changeFrequency: 'weekly',
    priority:
      route === '/'
        ? 1
        : route === '/user-guide' || route === '/zh/user-guide'
          ? 0.95
          : 0.9,
  }));
}
