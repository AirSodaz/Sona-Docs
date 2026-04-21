import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import '../globals.css';
import { SiteShell } from '@/components/site-shell';
import { getSiteUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
};

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <SiteShell lang="en">{children}</SiteShell>;
}
