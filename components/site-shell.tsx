import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';

export function SiteShell({
  children,
}: {
  children: ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
