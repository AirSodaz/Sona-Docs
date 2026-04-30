import { TrustPrivacyPage } from '@/components/trust-privacy-page';
import { createTrustPrivacyPageMetadata } from '@/lib/site-metadata';
import { getTrustPrivacyPageContent } from '@/lib/trust-privacy-content';

export const metadata = createTrustPrivacyPageMetadata('zh-CN', 'privacy');

export default function ChinesePrivacyPage() {
  return (
    <TrustPrivacyPage content={getTrustPrivacyPageContent('zh-CN', 'privacy')} />
  );
}
