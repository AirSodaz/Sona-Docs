'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github, Globe } from 'lucide-react';
import { motion } from 'motion/react';
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
    <main className="relative min-h-[100svh] overflow-hidden bg-[#F7F5F2] text-[#2D2D2D] transition-colors duration-300 dark:bg-[#121212] dark:text-[#E0E0E0] px-4 py-5 sm:px-6 sm:py-7 md:px-16 md:py-8">
      <div className="absolute top-0 right-0 h-[280px] w-[280px] translate-x-1/3 -translate-y-1/3 rounded-full bg-stone-200 opacity-30 blur-[90px] transition-colors duration-300 dark:bg-stone-800 dark:opacity-20 -z-10 sm:h-[500px] sm:w-[500px] sm:blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-[320px] w-[320px] -translate-x-1/4 translate-y-1/4 rounded-full bg-stone-200 opacity-30 blur-[100px] transition-colors duration-300 dark:bg-stone-800 dark:opacity-20 -z-10 sm:h-[600px] sm:w-[600px] sm:blur-[120px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-12 sm:gap-16">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={content.page.homeHref}
            className="group flex items-center transition-colors focus:outline-none"
          >
            <div className="flex items-center transition-transform duration-300 group-hover:scale-105 origin-left will-change-transform">
              <Logo className="h-7 w-7 rounded-lg sm:h-8 sm:w-8" />
              <span
                className="-ml-1 mt-0.5 text-[1.55rem] font-serif italic tracking-tighter text-[#5c4d43] dark:text-[#E0E0E0] sm:text-[1.7rem]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                ona
              </span>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-[13px] font-medium text-stone-500 dark:text-stone-400 sm:gap-6 sm:text-sm md:gap-8">
            <ThemeToggle />
            <HeaderLink href={content.page.homeHref}>
              <span className="inline-flex items-center gap-1.5">
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">{content.page.homeLabel}</span>
              </span>
            </HeaderLink>
            <Link
              href={content.page.alternateHref}
              className="flex items-center gap-1.5 cursor-pointer transition-colors hover:text-stone-800 focus:outline-none dark:hover:text-stone-200"
            >
              <Globe size={16} />
              <span className="hidden sm:inline">{content.page.alternateLanguageLabel}</span>
              <span className="sm:hidden">{content.page.alternateLanguageLabel === '中文' ? '中' : 'En'}</span>
            </Link>
            <HeaderLink href={githubHref} external>
              <span className="inline-flex items-center gap-1.5">
                <Github size={16} />
                <span className="hidden sm:inline">{content.page.githubLabel}</span>
              </span>
            </HeaderLink>
          </div>
        </header>

        <motion.div
          className="mx-auto flex w-full max-w-4xl flex-col gap-12 pb-16"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <motion.section
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-stone-200/50 pb-8 dark:border-stone-800/50"
          >
            <div className="max-w-2xl">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400 transition-colors duration-300 dark:text-stone-500 sm:mb-6 sm:text-xs sm:tracking-[0.28em]">
                {content.page.updatedLabel}
              </p>
              <h1
                className="text-[clamp(2.5rem,8vw,3.5rem)] leading-[1] font-serif italic text-[#2D2D2D] transition-colors duration-300 dark:text-[#E0E0E0]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {content.page.title}
              </h1>
              <p className="mt-4 text-[1rem] font-light leading-[1.75] text-stone-500 transition-colors duration-300 dark:text-stone-400 sm:mt-6 sm:text-lg sm:leading-[1.8]">
                {content.page.description}
              </p>
            </div>

            {readyRelease ? (
              <div className="mt-6 inline-flex w-fit items-center rounded-full border border-stone-200 bg-white/50 px-4 py-2 text-sm text-stone-600 transition-colors dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-300 lg:mt-0">
                <span className="font-medium text-[#2D2D2D] dark:text-[#E0E0E0]">
                  {content.page.releaseLabel}
                </span>
                <span className="mx-2 text-stone-300 dark:text-stone-600">/</span>
                <span>{readyRelease.version}</span>
              </div>
            ) : null}
          </motion.section>

          {release.status === 'loading' ? (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <StatusPanel>{content.page.loadingLabel}</StatusPanel>
            </motion.div>
          ) : null}

          {release.status === 'error' ? (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <StatusPanel>
                <p className="text-lg font-medium text-[#2D2D2D] dark:text-[#E0E0E0]">
                  {content.page.unavailableTitle}
                </p>
                <p className="mt-3 text-base font-light leading-[1.8] text-stone-500 dark:text-stone-400">
                  {content.page.unavailableDescription}
                </p>
                <HeaderLink href={githubHref} external className="mt-6">
                  <span className="inline-flex items-center gap-2">
                    <ExternalLink size={16} />
                    {content.page.githubLabel}
                  </span>
                </HeaderLink>
              </StatusPanel>
            </motion.div>
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
                  <motion.section
                    key={section.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                    }}
                    className="flex flex-col gap-6"
                  >
                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
                      {content.platformGroups[section.id]}
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      {items.map((item) => (
                        <div
                          key={item.key}
                          className="flex flex-col gap-4 rounded-2xl bg-white/40 p-6 ring-1 ring-stone-200/50 transition-colors dark:bg-stone-900/30 dark:ring-stone-800/50"
                        >
                          <h3 className="text-sm font-medium text-[#2D2D2D] dark:text-[#E0E0E0]">
                            {content.platforms[item.key]}
                          </h3>
                          <div className="flex flex-col gap-3">
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
                  </motion.section>
                );
              })
            : null}

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="pt-8 text-center"
          >
            <HeaderLink href={githubHref} external>
              <span className="inline-flex items-center gap-2">
                <Github size={16} />
                {content.page.githubLabel}
              </span>
            </HeaderLink>
          </motion.div>
        </motion.div>
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
      className="group flex items-center justify-between rounded-xl bg-white/60 px-5 py-4 text-sm ring-1 ring-stone-200 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-sm dark:bg-stone-900/50 dark:ring-stone-800 dark:hover:bg-stone-800"
    >
      <span className="font-medium text-[#2D2D2D] transition-colors group-hover:text-stone-900 dark:text-[#E0E0E0] dark:group-hover:text-white">
        {label}
      </span>
      <span className="text-xs font-mono tracking-widest text-stone-400 dark:text-stone-500">
        {formatAssetSize(download.size)}
      </span>
    </Link>
  );
}

function StatusPanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/40 p-8 ring-1 ring-stone-200/50 transition-colors dark:bg-stone-900/30 dark:ring-stone-800/50">
      <div className="text-[1rem] font-light leading-[1.75] text-stone-500 dark:text-stone-400">
        {children}
      </div>
    </div>
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
    `inline-flex items-center justify-center transition-colors hover:text-stone-800 dark:hover:text-stone-200 ${className}`.trim();

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
