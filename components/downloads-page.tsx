'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Github,
  Smartphone,
  TriangleAlert,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { SiteHeader } from '@/components/site-header';
import { buildDownloadContentFromMessages } from '@/lib/download-content';
import {
  getDisplayTypography,
  getEyebrowTypography,
} from '@/lib/locale-typography';
import type { HomeLocale } from '@/lib/homepage-content';
import {
  FALLBACK_RELEASE_URL,
  formatAssetSize,
  getDownloadsForKey,
  getRecommendedForKey,
  NIGHTLY_RELEASE_URL,
  type DownloadPlatformKey,
  type ReleaseChannel,
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
  channel: ReleaseChannel;
  data: ReleaseResponseBody | null;
  status: 'error' | 'loading' | 'ready';
}

export function DownloadsPage({
  channel,
  locale,
}: {
  channel: ReleaseChannel;
  locale: HomeLocale;
}) {
  const t = useTranslations('DownloadsPage');
  const pathname = usePathname();

  const content = buildDownloadContentFromMessages(t);
  const pageTitleTypography = getDisplayTypography(locale, 'page');
  const pageEyebrowTypography = getEyebrowTypography(
    locale,
    'tracking-[0.22em] sm:tracking-[0.28em]',
  );

  const [release, setRelease] = useState<ReleaseState>({
    channel,
    data: null,
    status: 'loading',
  });

  useEffect(() => {
    const controller = new AbortController();
    const releaseUrl =
      channel === 'nightly'
        ? '/api/github-release?channel=nightly'
        : '/api/github-release';

    fetch(releaseUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${channel} release`);
        }

        return response.json() as Promise<ReleaseResponseBody>;
      })
      .then((data) => {
        if (!data?.version) {
          throw new Error('Missing release metadata');
        }

        setRelease({
          channel,
          data,
          status: 'ready',
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setRelease({
          channel,
          data: null,
          status: 'error',
        });
      });

    return () => controller.abort();
  }, [channel]);

  const activeRelease: ReleaseState =
    release.channel === channel
      ? release
      : { channel, data: null, status: 'loading' };

  const githubHref =
    activeRelease.data?.url ??
    (channel === 'nightly' ? NIGHTLY_RELEASE_URL : FALLBACK_RELEASE_URL);
  const readyRelease =
    activeRelease.status === 'ready' ? activeRelease.data : null;
  const downloadSections = readyRelease
    ? PAGE_SECTIONS.map((section) => ({
        ...section,
        items: section.keys
          .map((key) => ({
            downloads: getDownloadsForKey(readyRelease, key),
            key,
            recommended: getRecommendedForKey(readyRelease, key),
          }))
          .filter((item) => item.downloads.length > 0),
      })).filter((section) => section.items.length > 0)
    : [];
  const hasDesktopBuilds = downloadSections.length > 0;

  return (
    <main className="relative min-h-[100svh] bg-[#F7F5F2] text-[#2D2D2D] transition-colors duration-300 dark:bg-[#121212] dark:text-[#E0E0E0]">
      {/* Background Blobs Wrapper to prevent horizontal overflow without blocking sticky child elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 h-[280px] w-[280px] translate-x-1/3 -translate-y-1/3 rounded-full bg-stone-200 opacity-30 blur-[90px] transition-colors duration-300 dark:bg-stone-800 dark:opacity-20 sm:h-[500px] sm:w-[500px] sm:blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[320px] w-[320px] -translate-x-1/4 translate-y-1/4 rounded-full bg-stone-200 opacity-30 blur-[100px] transition-colors duration-300 dark:bg-stone-800 dark:opacity-20 sm:h-[600px] sm:w-[600px] sm:blur-[120px]" />
      </div>

      <SiteHeader>
        <div className="flex items-center justify-between">
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
            <LanguageSwitcher />
            <HeaderLink href={githubHref} external>
              <span className="inline-flex items-center gap-1.5">
                <Github size={16} />
                <span className="hidden sm:inline">{content.page.githubLabel}</span>
              </span>
            </HeaderLink>
          </div>
        </div>
      </SiteHeader>

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-12 sm:gap-16 px-4 py-8 sm:px-6 sm:py-10 md:px-16">

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
              <p className={`mb-4 text-[11px] font-semibold uppercase text-stone-400 transition-colors duration-300 dark:text-stone-500 sm:mb-6 sm:text-xs ${pageEyebrowTypography.className}`}>
                {content.page.updatedLabel}
              </p>
              <h1
                className={`text-[#2D2D2D] transition-colors duration-300 dark:text-[#E0E0E0] ${pageTitleTypography.className}`}
                style={pageTitleTypography.style}
              >
                {content.page.title}
              </h1>
              <p className="mt-4 text-[1rem] font-light leading-[1.75] text-stone-500 transition-colors duration-300 dark:text-stone-400 sm:mt-6 sm:text-lg sm:leading-[1.8]">
                {content.page.description}
              </p>
            </div>

            {readyRelease ? (
              <div className="mt-6 inline-flex w-fit items-center rounded-full border border-stone-200 bg-white/50 px-4 py-2 text-sm text-stone-600 transition-colors dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-300 lg:mt-0">
                <span className="whitespace-nowrap font-medium text-[#2D2D2D] dark:text-[#E0E0E0]">
                  {channel === 'nightly'
                    ? content.page.nightlyReleaseLabel
                    : content.page.releaseLabel}
                </span>
                <span className="mx-2 text-stone-300 dark:text-stone-600">/</span>
                <span className="whitespace-nowrap">
                  {channel === 'nightly'
                    ? readyRelease.releaseName.replace(/^Nightly\s+/u, '')
                    : readyRelease.version}
                </span>
              </div>
            ) : null}
          </motion.section>

          <motion.nav
            aria-label={content.channels.navigationAriaLabel}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="grid min-h-11 w-full max-w-sm grid-cols-2 gap-1 rounded-lg bg-stone-200/70 p-1 dark:bg-stone-800/70"
          >
            <ChannelLink
              active={channel === 'stable'}
              href={content.channels.stableHref}
            >
              {content.channels.stableLabel}
            </ChannelLink>
            <ChannelLink
              active={channel === 'nightly'}
              href={content.channels.nightlyHref}
            >
              {content.channels.nightlyLabel}
            </ChannelLink>
          </motion.nav>

          {channel === 'nightly' ? (
            <motion.section
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="flex gap-4 border-l-2 border-amber-500/70 py-1 pl-4"
            >
              <TriangleAlert
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
                size={19}
              />
              <div>
                <h2 className="text-sm font-medium text-stone-800 dark:text-stone-100">
                  {content.channels.nightlyWarningTitle}
                </h2>
                <p className="mt-1 text-sm font-light leading-7 text-stone-500 dark:text-stone-400">
                  {content.channels.nightlyWarningDescription}
                </p>
              </div>
            </motion.section>
          ) : null}



          {activeRelease.status === 'loading' ? (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <StatusPanel>{content.page.loadingLabel}</StatusPanel>
            </motion.div>
          ) : null}

          {activeRelease.status === 'error' ? (
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

          {readyRelease && !hasDesktopBuilds ? (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <StatusPanel>
                <p className="text-lg font-medium text-[#2D2D2D] dark:text-[#E0E0E0]">
                  {content.page.emptyBuildsTitle}
                </p>
                <p className="mt-3 text-base font-light leading-[1.8] text-stone-500 dark:text-stone-400">
                  {content.page.emptyBuildsDescription}
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

          {readyRelease && hasDesktopBuilds
            ? downloadSections.map((section) => (
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
                    {section.items.map((item) => (
                      <div
                        key={item.key}
                        className="flex flex-col gap-4 rounded-2xl bg-white/40 p-6 ring-1 ring-stone-200/50 transition-colors dark:bg-stone-900/30 dark:ring-stone-800/50"
                      >
                        <div>
                          <h3 className="text-sm font-medium text-[#2D2D2D] dark:text-[#E0E0E0]">
                            {content.platforms[item.key]}
                          </h3>
                          <p className="mt-2 text-sm font-light leading-[1.7] text-stone-500 dark:text-stone-400">
                            {content.platformDescriptions[item.key]}
                          </p>
                        </div>
                        <div className="flex flex-col gap-3">
                          {item.downloads.map((download) => (
                            <DownloadRow
                              key={download.url}
                              download={download}
                              guidance={content.formatDescriptions[download.format]}
                              label={content.formats[download.format]}
                              recommended={item.recommended?.url === download.url}
                              recommendedLabel={content.page.recommendedLabel}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              ))
            : null}

          <motion.section
            id="android"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="scroll-mt-24 border-y border-stone-200/70 py-8 dark:border-stone-800/70"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-stone-200/70 text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                  <Smartphone aria-hidden="true" size={21} />
                </span>
                <div>
                  <h2 className="text-base font-medium text-[#2D2D2D] dark:text-[#E0E0E0]">
                    {content.android.title}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm font-light leading-7 text-stone-500 dark:text-stone-400">
                    {content.android.description}
                  </p>
                </div>
              </div>
              <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                {content.android.statusLabel}
              </span>
            </div>
          </motion.section>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="flex flex-col items-center gap-4 pt-8 text-center sm:flex-row sm:justify-center"
          >
            <Link
              href={content.page.firstRunHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-stone-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-white"
            >
              {content.page.firstRunLabel}
              <ArrowRight size={16} />
            </Link>
            <HeaderLink href={githubHref} external>
              <span className="inline-flex items-center gap-2">
                <Github size={16} />
                {content.page.githubLabel}
              </span>
            </HeaderLink>
          </motion.div>

          <motion.section
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="border-t border-stone-200/50 pt-8 text-xs leading-[1.7] text-stone-500 dark:border-stone-800/50 dark:text-stone-400"
          >
            <p>{content.page.desktopOnlyNote}</p>
            <p className="mt-3">{content.page.installSafetyNote}</p>
          </motion.section>
        </motion.div>
      </div>
    </main>
  );
}

function ChannelLink({
  active,
  children,
  href,
}: {
  active: boolean;
  children: ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`inline-flex min-h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500/60 ${
        active
          ? 'bg-white text-stone-900 shadow-sm dark:bg-stone-950 dark:text-stone-100'
          : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
      }`}
    >
      {children}
    </Link>
  );
}


function DownloadRow({
  download,
  guidance,
  label,
  recommended,
  recommendedLabel,
}: {
  download: StructuredDownload;
  guidance: string;
  label: string;
  recommended: boolean;
  recommendedLabel: string;
}) {
  return (
    <Link
      href={download.url}
      target="_blank"
      rel="noreferrer"
      className="group grid gap-3 rounded-xl bg-white/60 px-5 py-4 text-sm ring-1 ring-stone-200 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-sm dark:bg-stone-900/50 dark:ring-stone-800 dark:hover:bg-stone-800 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
    >
      <span>
        <span className="block font-medium text-[#2D2D2D] transition-colors group-hover:text-stone-900 dark:text-[#E0E0E0] dark:group-hover:text-white">
          {label}
        </span>
        <span className="mt-1 block text-xs leading-[1.55] text-stone-500 dark:text-stone-400">
          {guidance}
        </span>
      </span>
      <span className="flex flex-wrap items-center gap-2 sm:justify-end">
        {recommended ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-800 px-2.5 py-1 text-[11px] font-medium text-white dark:bg-stone-200 dark:text-stone-900">
            <CheckCircle2 size={13} />
            {recommendedLabel}
          </span>
        ) : null}
        <span className="text-xs font-mono tracking-widest text-stone-400 dark:text-stone-500">
          {formatAssetSize(download.size)}
        </span>
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
