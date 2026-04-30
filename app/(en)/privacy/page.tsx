import { TrustPrivacyPage } from '@/components/trust-privacy-page';
import { createTrustPrivacyPageMetadata } from '@/lib/site-metadata';
import { getTrustPrivacyPageContent } from '@/lib/trust-privacy-content';

export const metadata = createTrustPrivacyPageMetadata('en', 'privacy');

export default function EnglishPrivacyPage() {
  return (
    <TrustPrivacyPage content={getTrustPrivacyPageContent('en', 'privacy')} />
  );
}
