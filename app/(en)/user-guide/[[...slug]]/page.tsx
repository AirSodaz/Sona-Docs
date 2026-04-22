import { UserGuidePage } from '@/components/user-guide-page';
import { getUserGuideStaticParams } from '@/lib/user-guide-content';
import { createGuidePageMetadata } from '@/lib/site-metadata';

type GuideRouteProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export function generateStaticParams() {
  return getUserGuideStaticParams();
}

export async function generateMetadata({ params }: GuideRouteProps) {
  const { slug } = await params;

  return createGuidePageMetadata('en', slug);
}

export default async function EnglishUserGuidePage({
  params,
}: GuideRouteProps) {
  const { slug } = await params;

  return <UserGuidePage locale="en" slug={slug} />;
}
