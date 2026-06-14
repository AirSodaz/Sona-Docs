import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import '../globals.css';
import { SiteShell } from '@/components/site-shell';
import { cormorantGaramond, inter } from '@/lib/fonts';
import { isHomeLocale } from '@/lib/locales';
import { getSiteUrl } from '@/lib/site-url';
import { THEME_INIT_SCRIPT } from '@/lib/theme-init-script';

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the incoming locale is valid
  if (!isHomeLocale(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Load all messages for the current locale
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${cormorantGaramond.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-sans bg-[#F7F5F2] text-[#2D2D2D] dark:bg-[#121212] dark:text-[#E0E0E0] antialiased"
        suppressHydrationWarning
      >
        <Script
          id="sona-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
        <SiteShell>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </SiteShell>
      </body>
    </html>
  );
}
