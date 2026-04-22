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

  return createGuidePageMetadata('zh-CN', slug);
}

export default async function ChineseUserGuidePage({
  params,
}: GuideRouteProps) {
  const { slug } = await params;

  return <UserGuidePage locale="zh-CN" slug={slug} />;
}
