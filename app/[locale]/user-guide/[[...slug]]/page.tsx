import { UserGuidePage } from '@/components/user-guide-page';
import { getUserGuideStaticParams } from '@/lib/user-guide-content';
import { createGuidePageMetadata } from '@/lib/site-metadata';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';

type GuideRouteProps = {
  params: Promise<{
    locale: string;
    slug?: string[];
  }>;
};

export function generateStaticParams() {
  const guideParams = getUserGuideStaticParams();

  return routing.locales.flatMap((locale) =>
    guideParams.map((param) => ({
      locale,
      slug: param.slug,
    }))
  );
}

export async function generateMetadata({ params }: GuideRouteProps) {
  const { locale, slug } = await params;

  return createGuidePageMetadata(locale as any, slug);
}

export default async function UserGuidePageRoute({ params }: GuideRouteProps) {
  const { locale, slug } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <UserGuidePage locale={locale as any} slug={slug} />;
}
