import { TrustPrivacyPage } from '@/components/trust-privacy-page';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { TrustPrivacyPageCopy } from '@/lib/trust-privacy-content';
import { isHomeLocale } from '@/lib/locales';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TrustPrivacyPage' });

  return {
    title: t('privacy.metadata.title'),
    description: t('privacy.metadata.description'),
  };
}

export default async function PrivacyPageRoute({ params }: Props) {
  const { locale } = await params;

  if (!isHomeLocale(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'TrustPrivacyPage' });

  // Dynamically build content prop using next-intl
  const content: TrustPrivacyPageCopy = {
    id: 'privacy',
    locale,
    metadata: {
      title: t('privacy.metadata.title'),
      description: t('privacy.metadata.description'),
    },
    nav: {
      githubLabel: t('nav.githubLabel'),
      homeHref: '/',
      homeLabel: t('nav.homeLabel'),
    },
    hero: {
      eyebrow: t('privacy.hero.eyebrow'),
      title: t('privacy.hero.title'),
      description: t('privacy.hero.description'),
      updatedLabel: t('privacy.hero.updatedLabel'),
    },
    facts: t.raw('privacy.facts') as TrustPrivacyPageCopy['facts'],
    dataFlow: t.raw('privacy.dataFlow') as TrustPrivacyPageCopy['dataFlow'],
    sections: t.raw('privacy.sections') as TrustPrivacyPageCopy['sections'],
    closing: {
      title: t('privacy.closing.title'),
      description: t('privacy.closing.description'),
      primaryHref: '/trust',
      primaryLabel: t('privacy.closing.primaryLabel'),
      secondaryHref: '/user-guide',
      secondaryLabel: t('privacy.closing.secondaryLabel'),
    },
    footer: {
      license: t('footer.license'),
      privacyHref: '/privacy',
      privacyLabel: t('footer.privacyLabel'),
      trustHref: '/trust',
      trustLabel: t('footer.trustLabel'),
    },
    path: `/privacy`,
  };

  return <TrustPrivacyPage content={content} />;
}
