export type DownloadOs = 'windows' | 'macos' | 'linux';
export type ClientPlatformOs = DownloadOs | 'android' | 'ios' | 'unknown';
export type DownloadArch = 'arm64' | 'universal' | 'x64';
export type DownloadFormat =
  | 'app-tar-gz'
  | 'appimage'
  | 'deb'
  | 'dmg'
  | 'exe'
  | 'msi'
  | 'rpm';
export type DownloadPlatformKey =
  | 'windows-x64'
  | 'windows-arm64'
  | 'macos-arm64'
  | 'macos-x64'
  | 'macos-universal'
  | 'linux-x64';

export interface PublicAsset {
  name: string;
  size: number;
  url: string;
}

export interface StructuredDownload extends PublicAsset {
  arch: DownloadArch;
  format: DownloadFormat;
  os: DownloadOs;
}

export interface StructuredDownloads {
  linux: {
    x64?: StructuredDownload[];
  };
  macos: {
    arm64?: StructuredDownload[];
    universal?: StructuredDownload[];
    x64?: StructuredDownload[];
  };
  windows: {
    arm64?: StructuredDownload[];
    x64?: StructuredDownload[];
  };
}

export interface RecommendedDownloads {
  linux: {
    x64?: StructuredDownload;
  };
  macos: {
    arm64?: StructuredDownload;
    universal?: StructuredDownload;
    x64?: StructuredDownload;
  };
  windows: {
    arm64?: StructuredDownload;
    x64?: StructuredDownload;
  };
}

export interface ReleaseResponseBody {
  assets: PublicAsset[];
  downloads: StructuredDownloads;
  recommended: RecommendedDownloads;
  url: string;
  version: string;
}

export interface ClientPlatformInfo {
  arch: 'arm64' | 'x64' | 'unknown';
  os: ClientPlatformOs;
}

export interface PlatformGroup {
  downloads: StructuredDownload[];
  key: DownloadPlatformKey;
  recommended?: StructuredDownload;
}

export const FALLBACK_RELEASE_URL = 'https://github.com/AirSodaz/sona/releases';

export const PLATFORM_ORDER: DownloadPlatformKey[] = [
  'windows-x64',
  'windows-arm64',
  'macos-arm64',
  'macos-x64',
  'macos-universal',
  'linux-x64',
];

export function detectClientPlatform(): ClientPlatformInfo {
  if (typeof window === 'undefined') {
    return { os: 'unknown', arch: 'unknown' };
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform.toLowerCase();
  const isIpadLike =
    platform.includes('mac') && window.navigator.maxTouchPoints > 1;

  let os: ClientPlatformOs = 'unknown';
  if (userAgent.includes('android')) {
    os = 'android';
  } else if (
    userAgent.includes('iphone') ||
    userAgent.includes('ipad') ||
    userAgent.includes('ipod') ||
    isIpadLike
  ) {
    os = 'ios';
  } else if (userAgent.includes('win')) {
    os = 'windows';
  } else if (userAgent.includes('mac')) {
    os = 'macos';
  } else if (userAgent.includes('linux')) {
    os = 'linux';
  }

  const armHints = ['arm64', 'aarch64'];
  const x64Hints = ['x64', 'x86_64', 'win64', 'amd64', 'intel'];

  const hasArmHint = armHints.some(
    (hint) => userAgent.includes(hint) || platform.includes(hint),
  );
  const hasX64Hint = x64Hints.some(
    (hint) => userAgent.includes(hint) || platform.includes(hint),
  );

  let arch: ClientPlatformInfo['arch'] = 'unknown';
  if (hasArmHint) {
    arch = 'arm64';
  } else if (hasX64Hint) {
    arch = 'x64';
  }

  return { os, arch };
}

export function getPlatformKeyFromClientPlatform(
  platform: ClientPlatformInfo,
): DownloadPlatformKey | null {
  if (platform.os === 'windows' && platform.arch === 'x64') {
    return 'windows-x64';
  }

  if (platform.os === 'windows' && platform.arch === 'arm64') {
    return 'windows-arm64';
  }

  if (platform.os === 'macos' && platform.arch === 'arm64') {
    return 'macos-arm64';
  }

  if (platform.os === 'macos' && platform.arch === 'x64') {
    return 'macos-x64';
  }

  if (platform.os === 'linux' && platform.arch === 'x64') {
    return 'linux-x64';
  }

  return null;
}

export function formatAssetSize(size: number) {
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function getDownloadsForKey(
  release: ReleaseResponseBody,
  key: DownloadPlatformKey,
): StructuredDownload[] {
  switch (key) {
    case 'windows-x64':
      return release.downloads.windows.x64 ?? [];
    case 'windows-arm64':
      return release.downloads.windows.arm64 ?? [];
    case 'macos-arm64':
      return release.downloads.macos.arm64 ?? [];
    case 'macos-x64':
      return release.downloads.macos.x64 ?? [];
    case 'macos-universal':
      return release.downloads.macos.universal ?? [];
    case 'linux-x64':
      return release.downloads.linux.x64 ?? [];
  }
}

export function getRecommendedForKey(
  release: ReleaseResponseBody,
  key: DownloadPlatformKey,
): StructuredDownload | undefined {
  switch (key) {
    case 'windows-x64':
      return release.recommended.windows.x64;
    case 'windows-arm64':
      return release.recommended.windows.arm64;
    case 'macos-arm64':
      return release.recommended.macos.arm64;
    case 'macos-x64':
      return release.recommended.macos.x64;
    case 'macos-universal':
      return release.recommended.macos.universal;
    case 'linux-x64':
      return release.recommended.linux.x64;
  }
}

export function buildPlatformGroups(
  release: ReleaseResponseBody,
): PlatformGroup[] {
  return PLATFORM_ORDER.map((key) => ({
    downloads: getDownloadsForKey(release, key),
    key,
    recommended: getRecommendedForKey(release, key),
  })).filter((group) => group.downloads.length > 0);
}
