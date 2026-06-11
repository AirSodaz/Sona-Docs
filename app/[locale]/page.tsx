import { HomePage } from '@/components/home-page';
import { setRequestLocale, getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage.metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function HomePageRoute({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <HomePage locale={locale as any} />;
}
