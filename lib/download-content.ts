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

interface DownloadChannelCopy {
  navigationAriaLabel: string;
  nightlyHref: string;
  nightlyLabel: string;
  nightlyLinkLabel: string;
  nightlyWarningDescription: string;
  nightlyWarningTitle: string;
  stableHref: string;
  stableLabel: string;
}

interface AndroidDownloadCopy {
  description: string;
  href: string;
  statusLabel: string;
  title: string;
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
  nightlyReleaseLabel: string;
  title: string;
  unavailableDescription: string;
  unavailableTitle: string;
  updatedLabel: string;
}

export interface DownloadContent {
  android: AndroidDownloadCopy;
  button: DownloadButtonCopy;
  channels: DownloadChannelCopy;
  formats: Record<DownloadFormat, string>;
  formatDescriptions: Record<DownloadFormat, string>;
  metadata: {
    description: string;
    nightlyDescription: string;
    nightlyTitle: string;
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
  (
    key:
      | 'metadata.description'
      | 'metadata.nightlyDescription'
      | 'metadata.nightlyTitle'
      | 'metadata.title',
  ): string;
  raw(key: string): unknown;
}

export function buildDownloadContentFromMessages(
  t: DownloadMessagesReader,
): DownloadContent {
  return {
    metadata: {
      title: t('metadata.title'),
      description: t('metadata.description'),
      nightlyTitle: t('metadata.nightlyTitle'),
      nightlyDescription: t('metadata.nightlyDescription'),
    },
    android: {
      ...(t.raw('android') as Omit<AndroidDownloadCopy, 'href'>),
      href: '/downloads#android',
    },
    button: {
      ...(t.raw('button') as Omit<DownloadButtonCopy, 'allBuildsHref'>),
      allBuildsHref: '/downloads',
    },
    channels: {
      ...(t.raw('channels') as Omit<
        DownloadChannelCopy,
        'nightlyHref' | 'stableHref'
      >),
      nightlyHref: '/downloads/nightly',
      stableHref: '/downloads',
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

