import type { HomeLocale } from '@/lib/homepage-content';

export type TrustPrivacyPageId = 'privacy' | 'trust';

interface FactItem {
  label: string;
  title: string;
  description: string;
}

interface DetailSection {
  eyebrow: string;
  title: string;
  body: string;
  items: string[];
}

interface DataFlowColumns {
  feature: string;
  trigger: string;
  data: string;
  destination: string;
  control: string;
}

interface DataFlowRow {
  feature: string;
  trigger: string;
  data: string;
  destination: string;
  control: string;
}

interface DataFlowSection {
  eyebrow: string;
  title: string;
  description: string;
  columns: DataFlowColumns;
  rows: DataFlowRow[];
}

export interface TrustPrivacyPageCopy {
  id: TrustPrivacyPageId;
  locale: HomeLocale;
  metadata: {
    title: string;
    description: string;
  };
  nav: {
    githubLabel: string;
    homeHref: string;
    homeLabel: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    updatedLabel: string;
  };
  facts: FactItem[];
  dataFlow?: DataFlowSection;
  sections: DetailSection[];
  closing: {
    title: string;
    description: string;
    primaryHref: string;
    primaryLabel: string;
    secondaryHref: string;
    secondaryLabel: string;
  };
  footer: {
    license: string;
    privacyHref: string;
    privacyLabel: string;
    trustHref: string;
    trustLabel: string;
  };
  path: string;
}
