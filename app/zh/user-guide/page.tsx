import { UserGuidePage } from '@/components/user-guide-page';
import { createGuidePageMetadata } from '@/lib/site-metadata';

export const metadata = createGuidePageMetadata('zh-CN');

export default function ChineseUserGuidePage() {
  return <UserGuidePage locale="zh-CN" />;
}
