'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';

interface Asset {
  name: string;
  size: number;
  url: string;
}

type PlatformInfo = {
  os: 'windows' | 'macos' | 'linux' | 'unknown';
  arch: 'arm64' | 'x64' | 'unknown';
};

interface ReleaseInfo {
  version: string;
  size: string;
  url: string;
  os: PlatformInfo['os'];
  arch: PlatformInfo['arch'];
}

const FALLBACK_RELEASE_URL = 'https://github.com/AirSodaz/sona/releases';

function detectPlatform(): PlatformInfo {
  if (typeof window === 'undefined') {
    return { os: 'unknown', arch: 'unknown' };
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform.toLowerCase();

  let os: PlatformInfo['os'] = 'unknown';
  if (userAgent.includes('win')) {
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

  let arch: PlatformInfo['arch'] = 'unknown';
  if (hasArmHint) {
    arch = 'arm64';
  } else if (hasX64Hint) {
    arch = 'x64';
  }

  return { os, arch };
}

function findBestAsset(assets: Asset[], platform: PlatformInfo): Asset | null {
  if (!assets.length || platform.os === 'unknown' || platform.arch === 'unknown') {
    return null;
  }

  let candidates: Asset[] = [];
  const { os, arch } = platform;

  if (os === 'windows') {
    if (arch === 'arm64') {
      candidates = assets.filter(
        (asset) =>
          asset.name.toLowerCase().includes('arm64') &&
          (asset.name.toLowerCase().endsWith('.exe') ||
            asset.name.toLowerCase().endsWith('.msi')),
      );
    }

    if (arch === 'x64' && candidates.length === 0) {
      candidates = assets.filter(
        (asset) =>
          asset.name.toLowerCase().includes('x64') &&
          (asset.name.toLowerCase().endsWith('.exe') ||
            asset.name.toLowerCase().endsWith('.msi')),
      );
    }
  } else if (os === 'macos') {
    if (arch === 'arm64') {
      candidates = assets.filter(
        (asset) =>
          (asset.name.toLowerCase().includes('aarch64') ||
            asset.name.toLowerCase().includes('arm64')) &&
          (asset.name.toLowerCase().endsWith('.dmg') ||
            asset.name.toLowerCase().endsWith('.app.tar.gz')),
      );
    }

    if (arch === 'x64' && candidates.length === 0) {
      candidates = assets.filter(
        (asset) =>
          (asset.name.toLowerCase().includes('x64') ||
            asset.name.toLowerCase().includes('x86_64')) &&
          (asset.name.toLowerCase().endsWith('.dmg') ||
            asset.name.toLowerCase().endsWith('.app.tar.gz')),
      );
    }
  } else if (os === 'linux') {
    if (arch === 'x64') {
      candidates = assets.filter(
        (asset) =>
          asset.name.toLowerCase().includes('amd64') &&
          (asset.name.toLowerCase().endsWith('.appimage') ||
            asset.name.toLowerCase().endsWith('.deb') ||
            asset.name.toLowerCase().endsWith('.rpm')),
      );
    } else if (arch === 'arm64') {
      candidates = assets.filter(
        (asset) =>
          (asset.name.toLowerCase().includes('arm64') ||
            asset.name.toLowerCase().includes('aarch64')) &&
          (asset.name.toLowerCase().endsWith('.appimage') ||
            asset.name.toLowerCase().endsWith('.deb') ||
            asset.name.toLowerCase().endsWith('.rpm')),
      );
    }
  }

  if (!candidates.length) {
    return null;
  }

  return candidates.reduce((previous, current) =>
    previous.size > current.size ? previous : current,
  );
}

export function DownloadButton({ text }: { text: string }) {
  const [release, setRelease] = useState<ReleaseInfo | null>(null);

  useEffect(() => {
    fetch('/api/github-release')
      .then((response) => {
        if (!response.ok) {
          return null;
        }

        return response.json();
      })
      .then((data) => {
        if (!data?.version) {
          return;
        }

        const platform = detectPlatform();
        const bestAsset = findBestAsset(data.assets ?? [], platform);

        let downloadUrl = FALLBACK_RELEASE_URL;
        let size = '';

        if (bestAsset) {
          downloadUrl = bestAsset.url;
          size = `${(bestAsset.size / (1024 * 1024)).toFixed(1)} MB`;
        } else if (data.url) {
          downloadUrl = data.url;
        }

        setRelease({
          version: data.version,
          size,
          url: downloadUrl,
          os: platform.os,
          arch: platform.arch,
        });
      })
      .catch(() => {
        // Silently ignore network errors to prevent console spam.
      });
  }, []);

  let buttonText = text;
  if (release?.os === 'windows') {
    buttonText =
      release.arch === 'arm64' ? `${text} (Windows ARM)` : `${text} (Windows)`;
  } else if (release?.os === 'macos') {
    buttonText =
      release.arch === 'arm64'
        ? `${text} (macOS Apple Silicon)`
        : `${text} (macOS Intel)`;
  } else if (release?.os === 'linux') {
    buttonText = `${text} (Linux)`;
  }

  const releaseMeta = release
    ? `${release.version}${release.size ? ` · ~${release.size}` : ''}`
    : null;

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-2 sm:w-auto sm:max-w-none">
      <Link
        href={release?.url || FALLBACK_RELEASE_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-stone-800 px-6 py-3 text-center text-sm font-medium leading-tight text-white shadow-lg shadow-stone-200 transition-colors hover:bg-stone-700 dark:bg-stone-200 dark:text-stone-900 dark:shadow-none dark:hover:bg-white sm:min-w-[18rem] sm:w-auto sm:px-8 sm:whitespace-nowrap"
      >
        <span className="whitespace-normal sm:whitespace-nowrap">{buttonText}</span>
        <Download size={16} />
      </Link>

      <div className="flex min-h-5 items-center justify-center px-2">
        {releaseMeta ? (
          <span className="text-center font-mono text-[11px] tracking-[0.16em] text-stone-400 dark:text-stone-500">
            {releaseMeta}
          </span>
        ) : null}
      </div>
    </div>
  );
}
