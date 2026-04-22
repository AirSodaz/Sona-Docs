import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { cormorantGaramond, inter } from '@/lib/fonts';

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
