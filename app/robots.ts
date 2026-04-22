import type { MetadataRoute } from 'next';
import { getAbsoluteUrl, getPublicSiteUrl } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  const publicSiteUrl = getPublicSiteUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    host: publicSiteUrl?.origin,
    sitemap: getAbsoluteUrl('/sitemap.xml'),
  };
}
