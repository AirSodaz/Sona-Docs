import type { ReactNode } from 'react';
import '../globals.css';
import { SiteShell } from '@/components/site-shell';

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <SiteShell lang="en">{children}</SiteShell>;
}
