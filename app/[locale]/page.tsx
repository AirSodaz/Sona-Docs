import { HomePage } from '@/components/home-page';
import { isHomeLocale } from '@/lib/locales';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

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

  if (!isHomeLocale(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return <HomePage locale={locale} />;
}
