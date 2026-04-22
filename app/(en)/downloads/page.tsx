import { DownloadsPage } from '@/components/downloads-page';
import { createDownloadsPageMetadata } from '@/lib/site-metadata';

export const metadata = createDownloadsPageMetadata('en');

export default function EnglishDownloadsPage() {
  return <DownloadsPage locale="en" />;
}
