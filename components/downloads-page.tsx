'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { downloadContent } from '@/lib/download-content';
import type { HomeLocale } from '@/lib/homepage-content';
import {
  FALLBACK_RELEASE_URL,
  formatAssetSize,
  getDownloadsForKey,
  type DownloadPlatformKey,
  type ReleaseResponseBody,
  type StructuredDownload,
} from '@/lib/release-downloads';

const PAGE_SECTIONS: Array<{
  id: 'linux' | 'macos' | 'windows';
  keys: DownloadPlatformKey[];
}> = [
  {
    id: 'windows',
    keys: ['windows-x64', 'windows-arm64'],
  },
  {
    id: 'macos',
    keys: ['macos-arm64', 'macos-x64', 'macos-universal'],
  },
  {
    id: 'linux',
    keys: ['linux-x64'],
  },
];

interface ReleaseState {
  data: ReleaseResponseBody | null;
  status: 'error' | 'loading' | 'ready';
}

export function DownloadsPage({ locale }: { locale: HomeLocale }) {
  const content = downloadContent[locale];
  const [release, setRelease] = useState<ReleaseState>({
    data: null,
    status: 'loading',
  });

  useEffect(() => {
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
          status: 'ready',
        });
      })
      .catch(() => {
        setRelease({
          data: null,
          status: 'error',
        });
      });
  }, []);

  const githubHref = release.data?.url ?? FALLBACK_RELEASE_URL;
  const readyRelease = release.status === 'ready' ? release.data : null;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 sm:py-8 md:px-16">
      <div className="absolute right-0 top-0 h-[300px] w-[300px] translate-x-1/3 -translate-y-1/3 rounded-full bg-stone-200/70 blur-[90px] dark:bg-stone-800/40 sm:h-[480px] sm:w-[480px] sm:blur-[110px]" />
      <div className="absolute bottom-0 left-0 h-[340px] w-[340px] -translate-x-1/4 translate-y-1/4 rounded-full bg-stone-200/70 blur-[100px] dark:bg-stone-800/30 sm:h-[560px] sm:w-[560px] sm:blur-[120px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8">
        <header className="rounded-[28px] border border-stone-200/80 bg-white/78 px-5 py-5 shadow-[0_32px_110px_-58px_rgba(87,83,78,0.55)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-[#171717]/78 sm:px-7 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <Link
              href={content.page.homeHref}
              className="inline-flex items-center gap-3 text-stone-900 transition-colors hover:text-stone-600 dark:text-stone-100 dark:hover:text-stone-300"
            >
              <Logo className="h-10 w-10 rounded-xl" />
              <div>
                <p
                  className="text-[1.8rem] italic leading-none"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Sona
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
                  {content.page.releaseLabel}
                </p>
              </div>
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <ThemeToggle />
              <HeaderLink href={content.page.homeHref}>
                <span className="inline-flex items-center gap-2">
                  <ArrowLeft size={16} />
                  {content.page.homeLabel}
                </span>
              </HeaderLink>
              <HeaderLink href={content.page.alternateHref}>
                {content.page.alternateLanguageLabel}
              </HeaderLink>
              <HeaderLink href={githubHref} external>
                <span className="inline-flex items-center gap-2">
                  <Github size={16} />
                  {content.page.githubLabel}
                </span>
              </HeaderLink>
            </div>
          </div>
        </header>

        <section className="rounded-[28px] border border-stone-200/80 bg-white/88 px-5 py-6 shadow-[0_32px_110px_-58px_rgba(87,83,78,0.55)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-[#171717]/86 sm:px-8 sm:py-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
            {content.page.updatedLabel}
          </p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1
                className="text-[2.6rem] leading-[0.96] text-stone-900 dark:text-stone-100 sm:text-[3.4rem]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {content.page.title}
              </h1>
              <p className="mt-4 text-base leading-8 text-stone-600 dark:text-stone-300 sm:text-lg">
                {content.page.description}
              </p>
            </div>

            {readyRelease ? (
              <div className="inline-flex w-fit rounded-full border border-stone-200/80 bg-stone-50/90 px-4 py-2 text-sm text-stone-600 dark:border-stone-800/80 dark:bg-stone-900/70 dark:text-stone-300">
                <span className="font-medium text-stone-900 dark:text-stone-100">
                  {content.page.releaseLabel}
                </span>
                <span className="mx-2 text-stone-300 dark:text-stone-600">
                  /
                </span>
                <span>{readyRelease.version}</span>
              </div>
            ) : null}
          </div>
        </section>

        {release.status === 'loading' ? (
          <StatusPanel>{content.page.loadingLabel}</StatusPanel>
        ) : null}

        {release.status === 'error' ? (
          <StatusPanel>
            <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              {content.page.unavailableTitle}
            </p>
            <p className="mt-3 text-base leading-8 text-stone-600 dark:text-stone-300">
              {content.page.unavailableDescription}
            </p>
            <HeaderLink href={githubHref} external className="mt-5">
              <span className="inline-flex items-center gap-2">
                <ExternalLink size={16} />
                {content.page.githubLabel}
              </span>
            </HeaderLink>
          </StatusPanel>
        ) : null}

        {readyRelease
          ? PAGE_SECTIONS.map((section) => {
              const items = section.keys
                .map((key) => ({
                  downloads: getDownloadsForKey(readyRelease, key),
                  key,
                }))
                .filter((item) => item.downloads.length > 0);

              if (!items.length) {
                return null;
              }

              return (
                <section
                  key={section.id}
                  className="rounded-[28px] border border-stone-200/80 bg-white/88 px-5 py-6 shadow-[0_32px_110px_-58px_rgba(87,83,78,0.55)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-[#171717]/86 sm:px-8 sm:py-8"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
                    {content.platformGroups[section.id]}
                  </p>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    {items.map((item) => (
                      <div
                        key={item.key}
                        className="rounded-[24px] border border-stone-200 bg-stone-50/90 p-5 dark:border-stone-800 dark:bg-stone-900/60"
                      >
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                          {content.platforms[item.key]}
                        </p>
                        <div className="mt-4 space-y-2">
                          {item.downloads.map((download) => (
                            <DownloadRow
                              key={download.url}
                              download={download}
                              label={content.formats[download.format]}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })
          : null}

        <div className="pb-4">
          <HeaderLink href={githubHref} external>
            <span className="inline-flex items-center gap-2">
              <Github size={16} />
              {content.page.githubLabel}
            </span>
          </HeaderLink>
        </div>
      </div>
    </main>
  );
}

function DownloadRow({
  download,
  label,
}: {
  download: StructuredDownload;
  label: string;
}) {
  return (
    <Link
      href={download.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-[18px] border border-stone-200/80 bg-white px-4 py-3 text-sm transition-colors hover:border-stone-300 hover:bg-stone-50 dark:border-stone-800/80 dark:bg-stone-950/45 dark:hover:border-stone-700 dark:hover:bg-stone-950"
    >
      <span className="font-medium text-stone-700 dark:text-stone-200">
        {label}
      </span>
      <span className="text-stone-400 dark:text-stone-500">
        {formatAssetSize(download.size)}
      </span>
    </Link>
  );
}

function StatusPanel({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-[28px] border border-stone-200/80 bg-white/88 px-5 py-6 shadow-[0_32px_110px_-58px_rgba(87,83,78,0.55)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-[#171717]/86 sm:px-8 sm:py-8">
      <div className="max-w-3xl text-base leading-8 text-stone-600 dark:text-stone-300">
        {children}
      </div>
    </section>
  );
}

function HeaderLink({
  children,
  className = '',
  external = false,
  href,
}: {
  children: ReactNode;
  className?: string;
  external?: boolean;
  href: string;
}) {
  const classes =
    `inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-200 dark:hover:border-stone-600 dark:hover:bg-stone-900 ${className}`.trim();

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
