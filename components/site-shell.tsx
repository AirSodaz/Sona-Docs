import type { ReactNode } from 'react';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
});

export function SiteShell({
  children,
  lang,
}: {
  children: ReactNode;
  lang: string;
}) {
  return (
    <html
      lang={lang}
      className={`${inter.variable} ${cormorantGaramond.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-sans bg-[#F7F5F2] text-[#2D2D2D] dark:bg-[#121212] dark:text-[#E0E0E0] antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
