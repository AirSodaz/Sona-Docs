import type { HomeLocale } from '@/lib/homepage-content';
import type {
  DownloadFormat,
  DownloadPlatformKey,
} from '@/lib/release-downloads';

interface DownloadButtonCopy {
  allBuildsHref: string;
  allBuildsLabel: string;
  currentPlatformLabel: string;
  menuAriaLabel: string;
  viewAllLabel: string;
}

interface DownloadPageCopy {
  alternateHref: string;
  alternateLanguageLabel: string;
  decisionDescription: string;
  decisionTitle: string;
  description: string;
  desktopOnlyNote: string;
  emptyBuildsDescription: string;
  emptyBuildsTitle: string;
  firstRunHref: string;
  firstRunLabel: string;
  formatChoiceLabel: string;
  githubLabel: string;
  homeHref: string;
  homeLabel: string;
  installSafetyNote: string;
  loadingLabel: string;
  platformChoiceLabel: string;
  recommendedLabel: string;
  releaseLabel: string;
  title: string;
  unavailableDescription: string;
  unavailableTitle: string;
  updatedLabel: string;
}

export interface DownloadContent {
  button: DownloadButtonCopy;
  formats: Record<DownloadFormat, string>;
  formatDescriptions: Record<DownloadFormat, string>;
  metadata: {
    description: string;
    title: string;
  };
  page: DownloadPageCopy;
  platformGroups: {
    linux: string;
    macos: string;
    windows: string;
  };
  platformDescriptions: Record<DownloadPlatformKey, string>;
  platforms: Record<DownloadPlatformKey, string>;
}

interface DownloadMessagesReader {
  (key: 'metadata.description' | 'metadata.title'): string;
  raw(key: string): unknown;
}

export function buildDownloadContentFromMessages(
  t: DownloadMessagesReader,
): DownloadContent {
  return {
    metadata: {
      title: t('metadata.title'),
      description: t('metadata.description'),
    },
    button: {
      ...(t.raw('button') as Omit<DownloadButtonCopy, 'allBuildsHref'>),
      allBuildsHref: '/downloads',
    },
    page: {
      ...(t.raw('page') as Omit<
        DownloadPageCopy,
        'firstRunHref' | 'homeHref'
      >),
      homeHref: '/',
      firstRunHref: '/user-guide/getting-started',
    },
    platformGroups: t.raw('platformGroups') as DownloadContent['platformGroups'],
    formats: t.raw('formats') as DownloadContent['formats'],
    formatDescriptions: t.raw(
      'formatDescriptions',
    ) as DownloadContent['formatDescriptions'],
    platforms: t.raw('platforms') as DownloadContent['platforms'],
    platformDescriptions: t.raw(
      'platformDescriptions',
    ) as DownloadContent['platformDescriptions'],
  };
}

