import { UserGuidePage } from '@/components/user-guide-page';
import { getUserGuideStaticParams } from '@/lib/user-guide-content';
import { createGuidePageMetadata } from '@/lib/site-metadata';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import { isHomeLocale } from '@/lib/locales';
import { notFound } from 'next/navigation';

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

  if (!isHomeLocale(locale)) {
    return {};
  }

  return createGuidePageMetadata(locale, slug);
}

export default async function UserGuidePageRoute({ params }: GuideRouteProps) {
  const { locale, slug } = await params;

  if (!isHomeLocale(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return <UserGuidePage locale={locale} slug={slug} />;
}
