import type { ReactNode } from 'react';
import '../globals.css';
import { SiteShell } from '@/components/site-shell';

export default function ChineseLayout({ children }: { children: ReactNode }) {
  return <SiteShell lang="zh-CN">{children}</SiteShell>;
}
