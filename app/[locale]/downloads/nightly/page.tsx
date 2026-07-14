import { DownloadsPage } from '@/components/downloads-page';
import { isHomeLocale } from '@/lib/locales';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'DownloadsPage.metadata' });

  return {
    title: t('nightlyTitle'),
    description: t('nightlyDescription'),
  };
}

export default async function NightlyDownloadsPageRoute({ params }: Props) {
  const { locale } = await params;

  if (!isHomeLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return <DownloadsPage channel="nightly" locale={locale} />;
}
