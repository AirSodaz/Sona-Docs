import { NextResponse } from 'next/server';
import type {
  DownloadArch,
  DownloadFormat,
  DownloadOs,
  PublicAsset,
  RecommendedDownloads,
  ReleaseResponseBody,
  StructuredDownload,
  StructuredDownloads,
} from '@/lib/release-downloads';
import { createRequestLogger } from '@/lib/server-logger';

const GITHUB_RELEASE_URL =
  'https://api.github.com/repos/AirSodaz/sona/releases/latest';
const SUCCESS_CACHE_SECONDS = 60 * 60;
const FAILURE_CACHE_SECONDS = 60 * 5;
const STALE_WHILE_REVALIDATE_SECONDS = 60 * 60 * 24;
const REQUEST_TIMEOUT_MS = 8000;

type RequestLogger = ReturnType<typeof createRequestLogger>;

interface GitHubReleaseAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name?: string;
  html_url?: string;
  assets?: GitHubReleaseAsset[];
}

const WINDOWS_FORMAT_PRIORITY: DownloadFormat[] = ['exe', 'msi'];
const MACOS_FORMAT_PRIORITY: DownloadFormat[] = ['dmg', 'app-tar-gz'];
const LINUX_FORMAT_PRIORITY: DownloadFormat[] = ['appimage', 'deb', 'rpm'];

function buildCacheControl(maxAge: number) {
  return `public, max-age=0, s-maxage=${maxAge}, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`;
}

function jsonResponse(body: null | ReleaseResponseBody, cacheSeconds: number) {
  return NextResponse.json(body, {
    headers: {
      'Cache-Control': buildCacheControl(cacheSeconds),
    },
  });
}

function finalizeResponse(
  logger: RequestLogger,
  body: null | ReleaseResponseBody,
  cacheSeconds: number,
) {
  const response = logger.withRequestId(jsonResponse(body, cacheSeconds));
  logger.logSlowRequest(response.status);

  return response;
}

function logGitHubReleaseEvent({
  code,
  error,
  host,
  logger,
  status,
}: {
  code: 'invalid_payload' | 'upstream_error' | 'upstream_status';
  error?: string;
  host: null | string;
  logger: RequestLogger;
  status: number;
}) {
  logger.warn('github_release_route_event', {
    code,
    error,
    host,
    status,
  });
}

async function fetchGitHubRelease(headers: Record<string, string>) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(GITHUB_RELEASE_URL, {
      headers,
      next: { revalidate: SUCCESS_CACHE_SECONDS },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeAssets(assets: GitHubReleaseAsset[]): PublicAsset[] {
  return assets.map((asset) => ({
    name: asset.name,
    size: asset.size,
    url: asset.browser_download_url,
  }));
}

function detectFormat(name: string): DownloadFormat | null {
  const lowerName = name.toLowerCase();

  if (lowerName.endsWith('.app.tar.gz')) {
    return 'app-tar-gz';
  }

  if (lowerName.endsWith('.appimage')) {
    return 'appimage';
  }

  if (lowerName.endsWith('.deb')) {
    return 'deb';
  }

  if (lowerName.endsWith('.dmg')) {
    return 'dmg';
  }

  if (lowerName.endsWith('.exe')) {
    return 'exe';
  }

  if (lowerName.endsWith('.msi')) {
    return 'msi';
  }

  if (lowerName.endsWith('.rpm')) {
    return 'rpm';
  }

  return null;
}

function detectWindowsArch(name: string): DownloadArch | null {
  if (name.includes('arm64')) {
    return 'arm64';
  }

  if (name.includes('x64')) {
    return 'x64';
  }

  return null;
}

function detectMacosArch(name: string): DownloadArch | null {
  if (name.includes('universal')) {
    return 'universal';
  }

  if (name.includes('aarch64') || name.includes('arm64')) {
    return 'arm64';
  }

  if (name.includes('x64') || name.includes('x86_64')) {
    return 'x64';
  }

  return null;
}

function detectLinuxArch(name: string): DownloadArch | null {
  if (name.includes('amd64') || name.includes('x86_64')) {
    return 'x64';
  }

  return null;
}

function parseStructuredDownload(asset: PublicAsset): StructuredDownload | null {
  const lowerName = asset.name.toLowerCase();

  if (lowerName.endsWith('.sig') || lowerName === 'updater.json') {
    return null;
  }

  const format = detectFormat(lowerName);
  if (!format) {
    return null;
  }

  if (format === 'exe' || format === 'msi') {
    const arch = detectWindowsArch(lowerName);
    if (!arch || arch === 'universal') {
      return null;
    }

    return {
      ...asset,
      arch,
      format,
      os: 'windows',
    };
  }

  if (format === 'dmg' || format === 'app-tar-gz') {
    const arch = detectMacosArch(lowerName);
    if (!arch) {
      return null;
    }

    return {
      ...asset,
      arch,
      format,
      os: 'macos',
    };
  }

  const arch = detectLinuxArch(lowerName);
  if (!arch) {
    return null;
  }

  return {
    ...asset,
    arch,
    format,
    os: 'linux',
  };
}

function getFormatPriority(os: DownloadOs, format: DownloadFormat) {
  const order =
    os === 'windows'
      ? WINDOWS_FORMAT_PRIORITY
      : os === 'macos'
        ? MACOS_FORMAT_PRIORITY
        : LINUX_FORMAT_PRIORITY;

  const rank = order.indexOf(format);
  return rank === -1 ? Number.MAX_SAFE_INTEGER : rank;
}

function sortDownloads(downloads: StructuredDownload[]) {
  return [...downloads].sort((left, right) => {
    const formatDelta =
      getFormatPriority(left.os, left.format) -
      getFormatPriority(right.os, right.format);

    if (formatDelta !== 0) {
      return formatDelta;
    }

    return left.name.localeCompare(right.name);
  });
}

function buildStructuredDownloads(downloads: StructuredDownload[]) {
  const grouped: StructuredDownloads = {
    linux: {},
    macos: {},
    windows: {},
  };

  for (const download of downloads) {
    if (download.os === 'windows') {
      if (download.arch === 'arm64' || download.arch === 'x64') {
        const bucket = grouped.windows[download.arch];
        grouped.windows[download.arch] = bucket
          ? [...bucket, download]
          : [download];
      }
      continue;
    }

    if (download.os === 'macos') {
      const bucket = grouped.macos[download.arch];
      grouped.macos[download.arch] = bucket
        ? [...bucket, download]
        : [download];
      continue;
    }

    if (download.arch === 'x64') {
      const bucket = grouped.linux.x64;
      grouped.linux.x64 = bucket ? [...bucket, download] : [download];
    }
  }

  if (grouped.windows.x64) {
    grouped.windows.x64 = sortDownloads(grouped.windows.x64);
  }

  if (grouped.windows.arm64) {
    grouped.windows.arm64 = sortDownloads(grouped.windows.arm64);
  }

  if (grouped.macos.arm64) {
    grouped.macos.arm64 = sortDownloads(grouped.macos.arm64);
  }

  if (grouped.macos.x64) {
    grouped.macos.x64 = sortDownloads(grouped.macos.x64);
  }

  if (grouped.macos.universal) {
    grouped.macos.universal = sortDownloads(grouped.macos.universal);
  }

  if (grouped.linux.x64) {
    grouped.linux.x64 = sortDownloads(grouped.linux.x64);
  }

  const recommended: RecommendedDownloads = {
    linux: {},
    macos: {},
    windows: {},
  };

  recommended.windows.x64 = grouped.windows.x64?.[0];
  recommended.windows.arm64 = grouped.windows.arm64?.[0];
  recommended.macos.arm64 = grouped.macos.arm64?.[0];
  recommended.macos.x64 = grouped.macos.x64?.[0];
  recommended.macos.universal = grouped.macos.universal?.[0];
  recommended.linux.x64 = grouped.linux.x64?.[0];

  return { downloads: grouped, recommended };
}

export async function GET(request: Request) {
  const requestHost = request.headers.get('host');
  const logger = createRequestLogger(request, {
    method: 'GET',
    route: '/api/github-release',
  });

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Sona-Docs-App',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetchGitHubRelease(headers);

    if (!response.ok) {
      logGitHubReleaseEvent({
        code: 'upstream_status',
        error: `GitHub returned ${response.status}.`,
        host: requestHost,
        logger,
        status: response.status,
      });
      return finalizeResponse(logger, null, FAILURE_CACHE_SECONDS);
    }

    const data = (await response.json()) as GitHubRelease;

    if (!data.tag_name || !data.html_url) {
      logGitHubReleaseEvent({
        code: 'invalid_payload',
        error: 'Missing tag_name or html_url in GitHub release payload.',
        host: requestHost,
        logger,
        status: 502,
      });
      return finalizeResponse(logger, null, FAILURE_CACHE_SECONDS);
    }

    const assets = normalizeAssets(data.assets ?? []);
    const structuredDownloads = assets
      .map((asset) => parseStructuredDownload(asset))
      .filter((asset): asset is StructuredDownload => asset !== null);
    const { downloads, recommended } = buildStructuredDownloads(
      structuredDownloads,
    );

    return finalizeResponse(
      logger,
      {
        assets,
        downloads,
        recommended,
        url: data.html_url,
        version: data.tag_name,
      },
      SUCCESS_CACHE_SECONDS,
    );
  } catch (error) {
    logGitHubReleaseEvent({
      code: 'upstream_error',
      error: error instanceof Error ? error.message : 'Unknown error',
      host: requestHost,
      logger,
      status: 502,
    });
    return finalizeResponse(logger, null, FAILURE_CACHE_SECONDS);
  }
}
