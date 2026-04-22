import type { MetadataRoute } from 'next';
import { getAbsoluteUrl } from '@/lib/site-url';

const routes = ['/', '/zh'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: getAbsoluteUrl(route),
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.9,
  }));
}
