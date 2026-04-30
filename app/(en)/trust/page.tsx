import { TrustPrivacyPage } from '@/components/trust-privacy-page';
import { createTrustPrivacyPageMetadata } from '@/lib/site-metadata';
import { getTrustPrivacyPageContent } from '@/lib/trust-privacy-content';

export const metadata = createTrustPrivacyPageMetadata('en', 'trust');

export default function EnglishTrustPage() {
  return <TrustPrivacyPage content={getTrustPrivacyPageContent('en', 'trust')} />;
}
