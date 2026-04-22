import { UserGuidePage } from '@/components/user-guide-page';
import { createGuidePageMetadata } from '@/lib/site-metadata';

export const metadata = createGuidePageMetadata('en');

export default function EnglishUserGuidePage() {
  return <UserGuidePage locale="en" />;
}
