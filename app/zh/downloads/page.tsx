import { DownloadsPage } from '@/components/downloads-page';
import { createDownloadsPageMetadata } from '@/lib/site-metadata';

export const metadata = createDownloadsPageMetadata('zh-CN');

export default function ChineseDownloadsPage() {
  return <DownloadsPage locale="zh-CN" />;
}
