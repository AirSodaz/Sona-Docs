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
    title: t('trust.metadata.title'),
    description: t('trust.metadata.description'),
  };
}

export default async function TrustPageRoute({ params }: Props) {
  const { locale } = await params;

  if (!isHomeLocale(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'TrustPrivacyPage' });

  // Dynamically build content prop using next-intl
  const content: TrustPrivacyPageCopy = {
    id: 'trust',
    locale,
    metadata: {
      title: t('trust.metadata.title'),
      description: t('trust.metadata.description'),
    },
    nav: {
      githubLabel: t('nav.githubLabel'),
      homeHref: '/',
      homeLabel: t('nav.homeLabel'),
    },
    hero: {
      eyebrow: t('trust.hero.eyebrow'),
      title: t('trust.hero.title'),
      description: t('trust.hero.description'),
      updatedLabel: t('trust.hero.updatedLabel'),
    },
    facts: t.raw('trust.facts') as TrustPrivacyPageCopy['facts'],
    sections: t.raw('trust.sections') as TrustPrivacyPageCopy['sections'],
    closing: {
      title: t('trust.closing.title'),
      description: t('trust.closing.description'),
      primaryHref: '/privacy',
      primaryLabel: t('trust.closing.primaryLabel'),
      secondaryHref: '/user-guide',
      secondaryLabel: t('trust.closing.secondaryLabel'),
    },
    footer: {
      license: t('footer.license'),
      privacyHref: '/privacy',
      privacyLabel: t('footer.privacyLabel'),
      trustHref: '/trust',
      trustLabel: t('footer.trustLabel'),
    },
    path: `/trust`,
  };

  return <TrustPrivacyPage content={content} />;
}
