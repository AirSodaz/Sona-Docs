'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Download } from 'lucide-react';
import type { DownloadContent } from '@/lib/download-content';
import {
  detectClientPlatform,
  formatAssetSize,
  getPlatformKeyFromClientPlatform,
  type ClientPlatformInfo,
  type ReleaseResponseBody,
} from '@/lib/release-downloads';

interface ReleaseState {
  data: ReleaseResponseBody | null;
  platform: ClientPlatformInfo | null;
  status: 'error' | 'loading' | 'ready';
}

export function DownloadButton({
  content,
  text,
}: {
  content: DownloadContent;
  text: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [release, setRelease] = useState<ReleaseState>({
    data: null,
    platform: null,
    status: 'loading',
  });
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const platform = detectClientPlatform();

    fetch('/api/github-release')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load latest release');
        }

        return response.json() as Promise<ReleaseResponseBody>;
      })
      .then((data) => {
        if (!data?.version) {
          throw new Error('Missing release metadata');
        }

        setRelease({
          data,
          platform,
          status: 'ready',
        });
      })
      .catch(() => {
        setRelease({
          data: null,
          platform,
          status: 'error',
        });
      });
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const platformKey =
    release.platform ? getPlatformKeyFromClientPlatform(release.platform) : null;
  const currentGroup =
    release.status === 'ready' && release.data && platformKey
      ? findCurrentPlatformGroup(release.data, platformKey)
      : undefined;
  const canShowMenu = Boolean(currentGroup);
  const menuGroup = canShowMenu ? currentGroup : null;
  const primaryUrl = currentGroup?.recommended?.url
    ?? content.button.allBuildsHref;
  const metaText =
    release.status === 'ready' && release.data
      ? currentGroup?.recommended
        ? `${content.platforms[currentGroup.key]} · ${release.data.version} · ~${formatAssetSize(currentGroup.recommended.size)}`
        : `${release.data.version}`
      : null;

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-2 sm:w-auto sm:max-w-none sm:items-start">
      <div ref={menuRef} className="relative w-full sm:w-auto">
        {canShowMenu ? (
          <div className="inline-flex w-full items-stretch rounded-full shadow-lg shadow-stone-200 dark:shadow-none sm:w-auto">
            <Link
              href={primaryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-l-full bg-stone-800 px-6 py-3 text-center text-sm font-medium leading-tight text-white transition-colors hover:bg-stone-700 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-white sm:min-w-[18rem] sm:px-8"
            >
              <span className="whitespace-normal sm:whitespace-nowrap">
                {text}
              </span>
              <Download size={16} />
            </Link>

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label={content.button.menuAriaLabel}
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex min-h-12 w-12 items-center justify-center rounded-r-full border-l border-white/15 bg-stone-800 text-white transition-colors hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F5F2] dark:border-stone-500/30 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-white dark:focus-visible:ring-stone-500/60 dark:focus-visible:ring-offset-[#121212]"
            >
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  menuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        ) : (
          <Link
            href={primaryUrl}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-stone-800 px-6 py-3 text-center text-sm font-medium leading-tight text-white shadow-lg shadow-stone-200 transition-colors hover:bg-stone-700 dark:bg-stone-200 dark:text-stone-900 dark:shadow-none dark:hover:bg-white sm:min-w-[18rem] sm:w-auto sm:px-8"
          >
            <span className="whitespace-normal sm:whitespace-nowrap">{text}</span>
            <Download size={16} />
          </Link>
        )}

        {menuGroup && menuOpen ? (
          <div
            role="menu"
            className="absolute left-0 top-[calc(100%+0.75rem)] z-20 w-full min-w-[18rem] rounded-[26px] border border-stone-200/85 bg-white/96 p-4 shadow-[0_28px_90px_-52px_rgba(87,83,78,0.55)] backdrop-blur-xl dark:border-stone-800/85 dark:bg-[#171717]/96 sm:w-[22rem]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-400 dark:text-stone-500">
              {content.button.currentPlatformLabel}
            </p>
            <p className="mt-2 text-sm font-medium text-stone-700 dark:text-stone-200">
              {content.platforms[menuGroup.key]}
            </p>

            <div className="mt-3 space-y-1.5">
              {menuGroup.downloads.map((download) => (
                <Link
                  key={download.url}
                  href={download.url}
                  target="_blank"
                  rel="noreferrer"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-[18px] px-3 py-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-stone-100"
                >
                  <span>{content.formats[download.format]}</span>
                  <span className="text-xs text-stone-400 dark:text-stone-500">
                    {formatAssetSize(download.size)}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-3 border-t border-stone-200/80 pt-3 dark:border-stone-800/80">
              <Link
                href={content.button.allBuildsHref}
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="inline-flex text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100"
              >
                {content.button.viewAllLabel}
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex min-h-5 items-center justify-center px-2 sm:justify-start sm:px-0">
        {metaText ? (
          <span className="text-center font-mono text-[11px] tracking-[0.16em] text-stone-400 dark:text-stone-500 sm:text-left">
            {metaText}
          </span>
        ) : null}
      </div>

      {release.status === 'ready' ? null : (
        <Link
          href={content.button.allBuildsHref}
          className="inline-flex text-xs font-medium text-stone-500 transition-colors hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
        >
          {content.button.allBuildsLabel}
        </Link>
      )}
    </div>
  );
}

function findCurrentPlatformGroup(
  release: ReleaseResponseBody,
  platformKey: NonNullable<ReturnType<typeof getPlatformKeyFromClientPlatform>>,
) {
  const downloads =
    platformKey === 'windows-x64'
      ? release.downloads.windows.x64 ?? []
      : platformKey === 'windows-arm64'
        ? release.downloads.windows.arm64 ?? []
        : platformKey === 'macos-arm64'
          ? release.downloads.macos.arm64 ?? []
          : platformKey === 'macos-x64'
            ? release.downloads.macos.x64 ?? []
            : platformKey === 'macos-universal'
              ? release.downloads.macos.universal ?? []
              : release.downloads.linux.x64 ?? [];

  const recommended =
    platformKey === 'windows-x64'
      ? release.recommended.windows.x64
      : platformKey === 'windows-arm64'
        ? release.recommended.windows.arm64
        : platformKey === 'macos-arm64'
          ? release.recommended.macos.arm64
          : platformKey === 'macos-x64'
            ? release.recommended.macos.x64
            : platformKey === 'macos-universal'
              ? release.recommended.macos.universal
              : release.recommended.linux.x64;

  return downloads.length
    ? {
        downloads,
        key: platformKey,
        recommended,
      }
    : undefined;
}
