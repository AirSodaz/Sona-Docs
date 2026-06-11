import { DownloadsPage } from '@/components/downloads-page';
import { setRequestLocale, getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'DownloadsPage.metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function DownloadsPageRoute({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <DownloadsPage locale={locale as any} />;
}
