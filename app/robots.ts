import type { MetadataRoute } from 'next';
import { getAbsoluteUrl, getSiteUrl } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    host: getSiteUrl().origin,
    sitemap: getAbsoluteUrl('/sitemap.xml'),
  };
}
