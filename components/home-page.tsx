'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import {
  Bot,
  Github,
  Mic,
  MoonStar,
  Scissors,
  Shield,
  Smartphone,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { DownloadButton } from '@/components/download-button';
import { SiteHeader } from '@/components/site-header';
import { ScrollHint } from '@/components/scroll-hint';
import { UseCasesSection } from '@/components/use-cases-section';
import { TranscriptDemo } from '@/components/transcript-demo';
import { buildDownloadContentFromMessages } from '@/lib/download-content';
import {
  getDisplayTypography,
  getEyebrowTypography,
} from '@/lib/locale-typography';
import type {
  HomeLocale,
  HomePageContent,
  UseCaseId,
  UseCaseItem,
} from '@/lib/homepage-content';
import { motion } from 'motion/react';

type HomeUseCaseMessages = Omit<HomePageContent['useCases'], 'items'> & {
  items: Record<UseCaseId, Omit<UseCaseItem, 'href' | 'id'>>;
};

export function HomePage({
  locale,
}: {
  locale: HomeLocale;
}) {
  const t = useTranslations('HomePage');
  const downloadT = useTranslations('DownloadsPage');
  const pathname = usePathname();

  const useCasesRaw = t.raw('useCases') as HomeUseCaseMessages;
  const hrefMap: Record<UseCaseId, string> = {
    meetings: '/user-guide/live-record',
    lectures: '/user-guide/edit-and-playback',
    'subtitle-export': '/user-guide/batch-import',
    'subtitle-translation': '/user-guide/ai-polish-and-translate',
  };

  const useCasesItemsArray = (
    Object.entries(useCasesRaw.items) as Array<
      [UseCaseId, Omit<UseCaseItem, 'href' | 'id'>]
    >
  ).map(([key, value]) => ({
    id: key,
    href: hrefMap[key],
    title: value.title,
    context: value.context,
    workflow: value.workflow,
    result: value.result,
    tags: value.tags,
  }));

  const heroRaw = t.raw('hero') as Omit<HomePageContent['hero'], 'docsHref'>;
  const finalCtaRaw = t.raw('finalCta') as Omit<HomePageContent['finalCta'], 'secondaryHref'>;
  const footerRaw = t.raw('footer') as Omit<
    HomePageContent['footer'],
    'privacyHref' | 'trustHref'
  >;

  const content: HomePageContent = {
    metadata: {
      title: t('metadata.title'),
      description: t('metadata.description'),
    },
    nav: t.raw('nav') as HomePageContent['nav'],
    hero: {
      ...heroRaw,
      docsHref: '/user-guide',
    },
    useCases: {
      eyebrow: useCasesRaw.eyebrow,
      title: useCasesRaw.title,
      desc: useCasesRaw.desc,
      labels: useCasesRaw.labels,
      note: useCasesRaw.note,
      items: useCasesItemsArray,
    },
    demo: t.raw('demo') as HomePageContent['demo'],
    features: t.raw('features') as HomePageContent['features'],
    finalCta: {
      ...finalCtaRaw,
      secondaryHref: '/user-guide',
    },
    footer: {
      ...footerRaw,
      privacyHref: '/privacy',
      trustHref: '/trust',
    },
  };

  const demoPreviewId = 'homepage-demo-preview';
  const downloads = buildDownloadContentFromMessages(downloadT);
  const heroTitleTypography = getDisplayTypography(locale, 'hero');
  const heroEyebrowTypography = getEyebrowTypography(
    locale,
    'tracking-[0.22em] sm:tracking-[0.28em]',
  );
  const workflowEyebrowTypography = getEyebrowTypography(
    locale,
    'tracking-[0.3em]',
  );

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: 0,
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
    }
  };

  return (
    <div className="relative bg-[#F7F5F2] text-[#2D2D2D] transition-colors duration-300 dark:bg-[#121212] dark:text-[#E0E0E0]">
      {/* Background Blobs Wrapper to prevent horizontal overflow without blocking sticky child elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 h-[280px] w-[280px] translate-x-1/3 -translate-y-1/3 rounded-full bg-stone-200 opacity-30 blur-[90px] transition-colors duration-300 dark:bg-stone-800 dark:opacity-20 sm:h-[500px] sm:w-[500px] sm:blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 h-[320px] w-[320px] -translate-x-1/4 translate-y-1/4 rounded-full bg-stone-200 opacity-30 blur-[100px] transition-colors duration-300 dark:bg-stone-800 dark:opacity-20 sm:h-[600px] sm:w-[600px] sm:blur-[120px]"></div>
      </div>

      <SiteHeader>
        <div className="flex items-center justify-between">
          <button
            onClick={scrollToTop}
            className="group flex items-center transition-colors focus:outline-none cursor-pointer"
            aria-label="Scroll to top"
          >
            <div className="flex items-center transition-transform duration-300 group-hover:scale-105 active:scale-95 origin-left will-change-transform">
              <Logo className="h-7 w-7 rounded-lg sm:h-8 sm:w-8" />
              <span
                className="-ml-1 mt-0.5 text-[1.55rem] font-serif italic tracking-tighter text-[#5c4d43] dark:text-[#E0E0E0] sm:text-[1.7rem]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                ona
              </span>
            </div>
          </button>
          <div className="flex items-center gap-4 text-[13px] font-medium text-stone-500 dark:text-stone-400 sm:gap-6 sm:text-sm md:gap-8">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link
              href="https://github.com/AirSodaz/sona"
              className="flex items-center gap-1.5 transition-colors hover:text-stone-800 dark:hover:text-stone-200 sm:gap-2"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={16} />
              <span className="hidden sm:inline">{content.nav.github}</span>
            </Link>
          </div>
        </div>
      </SiteHeader>

      <section className="relative flex min-h-[calc(100svh-4.5rem)] flex-col">

        <div className="flex flex-1 items-center">
          <div className="mx-auto flex w-full max-w-[1400px] px-4 pb-22 pt-0 sm:px-6 sm:pb-24 sm:pt-3 md:px-16 md:pb-28 md:pt-4">
            <motion.div
              className="mx-auto flex max-w-3xl flex-col items-center justify-center text-center"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
            >
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                }}
                className={`mb-4 text-[11px] font-semibold uppercase text-stone-400 transition-colors duration-300 dark:text-stone-500 sm:mb-6 sm:text-xs ${heroEyebrowTypography.className}`}
              >
                {content.hero.badge}
              </motion.p>

              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                }}
                className={`mb-3 text-[#2D2D2D] transition-colors duration-300 dark:text-[#E0E0E0] sm:mb-4 ${heroTitleTypography.className}`}
                style={heroTitleTypography.style}
              >
                {content.hero.title1} <br />
                <span
                  className={`text-stone-500 transition-colors duration-300 dark:text-stone-400 ${
                    heroTitleTypography.isCjk ? 'font-normal' : 'font-light'
                  }`}
                >
                  {content.hero.title2}
                </span>
              </motion.h1>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="mx-auto mb-6 max-w-2xl text-[1rem] font-light leading-[1.75] text-stone-500 transition-colors duration-300 dark:text-stone-400 sm:mb-8 sm:text-lg sm:leading-[1.8]"
              >
                {content.hero.desc}
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="flex w-full max-w-sm flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-start sm:gap-4"
              >
                <DownloadButton
                  content={downloads}
                  text={content.hero.btnDownload}
                />
                <Link
                  href={content.hero.docsHref}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-stone-300 px-6 py-3 text-center text-sm font-medium text-[#2D2D2D] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:bg-white dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:shadow-white/5 sm:w-auto sm:px-8"
                >
                  {content.hero.btnDocs}
                </Link>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-stone-500 dark:text-stone-400"
              >
                <Link
                  href={downloads.channels.nightlyHref}
                  className="inline-flex min-h-8 items-center gap-1.5 transition-colors hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500/60 dark:hover:text-stone-100"
                >
                  <MoonStar aria-hidden="true" size={14} />
                  {downloads.channels.nightlyLinkLabel}
                </Link>
                <Link
                  href={downloads.android.href}
                  className="inline-flex min-h-8 items-center gap-1.5 transition-colors hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500/60 dark:hover:text-stone-100"
                >
                  <Smartphone aria-hidden="true" size={14} />
                  <span>{downloads.android.title}</span>
                  <span aria-hidden="true">/</span>
                  <span>{downloads.android.statusLabel}</span>
                </Link>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="mt-8 w-full max-w-3xl border-t border-stone-200/80 pt-5 text-left transition-colors duration-300 dark:border-stone-800/80 sm:mt-9 sm:pt-6"
              >
                <p className={`text-center text-[10px] font-semibold uppercase text-stone-400 transition-colors duration-300 dark:text-stone-500 sm:text-[11px] ${workflowEyebrowTypography.className}`}>
                  {content.hero.workflowLabel}
                </p>

                <ol className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 sm:mt-5 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-0">
                  {content.hero.workflowSteps.map((step, index) => (
                    <li
                      key={step}
                      className="flex min-w-0 items-center gap-3 sm:flex-none"
                    >
                      <span className="font-mono text-[10px] tracking-[0.24em] text-stone-400 transition-colors duration-300 dark:text-stone-500 sm:text-[11px]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm leading-6 text-stone-600 transition-colors duration-300 dark:text-stone-300 sm:text-[0.95rem]">
                        {step}
                      </span>
                      {index < content.hero.workflowSteps.length - 1 ? (
                        <span className="hidden h-px w-8 bg-stone-200 transition-colors duration-300 dark:bg-stone-700 sm:block md:w-10" />
                      ) : null}
                    </li>
                  ))}
                </ol>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <ScrollHint label={content.hero.scrollHint} targetId={demoPreviewId} />
      </section>

      <main className="w-full pb-10 pt-6 sm:pb-12 sm:pt-10 md:pt-12">
        <section
          id={demoPreviewId}
          className="w-full scroll-mt-6 sm:scroll-mt-8"
        >
          <div className="relative overflow-hidden bg-[#ece8df] py-16 text-[#37352f] sm:py-20 lg:py-24 dark:bg-[#171717] dark:text-[#d4d4d4]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(55,53,47,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(55,53,47,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-50 dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.035)_1px,transparent_1px)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.62),rgba(255,255,255,0)_42%),linear-gradient(225deg,rgba(230,226,218,0.6),rgba(230,226,218,0)_44%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0)_42%)]" />

            <div className="relative mx-auto w-full max-w-[1520px] px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16">
              <TranscriptDemo demo={content.demo} locale={locale} />
            </div>
          </div>
        </section>

        <div className="px-4 sm:px-6 md:px-16">
          <div className="mt-8 w-full sm:mt-10">
            <UseCasesSection content={content.useCases} locale={locale} />
          </div>

          <div className="mx-auto mt-16 grid w-full max-w-4xl gap-10 text-left sm:mt-20 sm:grid-cols-2 sm:gap-12">
            <FeatureCard
              icon={<Shield size={20} className="text-stone-600 dark:text-stone-400" />}
              locale={locale}
              title={content.features[0].title}
              description={content.features[0].desc}
            />
            <FeatureCard
              icon={<Bot size={20} className="text-stone-600 dark:text-stone-400" />}
              locale={locale}
              title={content.features[1].title}
              description={content.features[1].desc}
            />
            <FeatureCard
              icon={<Mic size={20} className="text-stone-600 dark:text-stone-400" />}
              locale={locale}
              title={content.features[2].title}
              description={content.features[2].desc}
            />
            <FeatureCard
              icon={<Scissors size={20} className="text-stone-600 dark:text-stone-400" />}
              locale={locale}
              title={content.features[3].title}
              description={content.features[3].desc}
            />
          </div>

          <ClosingCtaSection
            content={content.finalCta}
            locale={locale}
            primaryHref={downloads.button.allBuildsHref}
          />
        </div>
      </main>

      <footer className="w-full border-t border-stone-200 bg-white transition-colors duration-300 dark:border-stone-800 dark:bg-[#121212]">
        <div className="container mx-auto flex max-w-[1400px] flex-col items-center gap-5 px-4 py-10 text-center text-sm font-light text-stone-500 dark:text-stone-400 sm:gap-6 sm:px-6 sm:py-12 md:flex-row md:justify-between md:px-16 md:text-left">
          <p className="max-w-[20rem] md:max-w-none">
            © {new Date().getFullYear()} Sona. {content.footer.license}
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 font-medium md:justify-end">
            <Link
              href={content.footer.trustHref}
              className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              {content.footer.trust}
            </Link>
            <Link
              href={content.footer.privacyHref}
              className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              {content.footer.privacy}
            </Link>
            <Link
              href="https://github.com/AirSodaz/sona"
              className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              {content.footer.repo}
            </Link>
            <Link
              href="https://github.com/AirSodaz/sona/issues"
              className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              {content.footer.issue}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ClosingCtaSection({
  content,
  locale,
  primaryHref,
}: {
  content: HomePageContent['finalCta'];
  locale: HomeLocale;
  primaryHref: string;
}) {
  const titleTypography = getDisplayTypography(locale, 'guideSection');
  const eyebrowTypography = getEyebrowTypography(locale);
  const titleClassName = titleTypography.isCjk
    ? titleTypography.className
    : 'text-[2rem] leading-tight sm:text-[2.35rem] md:text-[2.65rem]';

  return (
    <motion.section
      className="mx-auto mt-20 w-full max-w-5xl sm:mt-24"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="relative overflow-hidden rounded-[32px] border border-stone-200/80 bg-white/72 px-6 py-8 text-center shadow-[0_30px_90px_-60px_rgba(87,83,78,0.58)] backdrop-blur-xl transition-colors duration-300 dark:border-stone-800/80 dark:bg-stone-900/72 dark:shadow-[0_28px_90px_-62px_rgba(0,0,0,0.76)] sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <div className="pointer-events-none absolute inset-x-12 top-0 h-24 bg-gradient-to-r from-transparent via-stone-200/70 to-transparent blur-3xl dark:via-stone-700/35" />
        <div className="pointer-events-none absolute left-1/2 top-full h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-200/60 blur-3xl dark:bg-stone-700/25" />

        <div className="relative mx-auto max-w-3xl">
          <p className={`text-[11px] font-semibold uppercase text-stone-400 transition-colors duration-300 dark:text-stone-500 sm:text-xs ${eyebrowTypography.className}`}>
            {content.eyebrow}
          </p>
          <h2
            className={`mt-4 text-stone-800 transition-colors duration-300 dark:text-stone-100 ${titleClassName}`}
            style={
              titleTypography.isCjk
                ? titleTypography.style
                : { fontFamily: 'var(--font-serif)' }
            }
          >
            {content.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 font-light text-stone-600 transition-colors duration-300 dark:text-stone-300 sm:text-lg">
            {content.desc}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:gap-4">
            <Link
              href={primaryHref}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-stone-800 px-6 py-3 text-center text-sm font-medium leading-tight text-white shadow-lg shadow-stone-200 transition-colors hover:bg-stone-700 dark:bg-stone-200 dark:text-stone-900 dark:shadow-none dark:hover:bg-white sm:min-w-[18rem] sm:w-auto sm:px-8"
            >
              {content.primaryLabel}
            </Link>
            <Link
              href={content.secondaryHref}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-stone-300 px-6 py-3 text-center text-sm font-medium text-[#2D2D2D] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:shadow-white/5 sm:w-auto sm:px-8"
            >
              {content.secondaryLabel}
            </Link>
          </div>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-stone-500 transition-colors duration-300 dark:text-stone-400">
            {content.note}
          </p>
        </div>
      </div>
    </motion.section>
  );
}

function FeatureCard({
  icon,
  locale,
  title,
  description,
}: {
  icon: ReactNode;
  locale: HomeLocale;
  title: string;
  description: string;
}) {
  const eyebrowTypography = getEyebrowTypography(
    locale,
    'tracking-[0.22em] sm:tracking-widest',
  );

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 transition-colors duration-300 dark:bg-stone-800/50">
        {icon}
      </div>
      <h3 className={`mb-3 text-xs font-bold uppercase text-stone-400 transition-colors duration-300 dark:text-stone-500 ${eyebrowTypography.className}`}>
        {title}
      </h3>
      <p className="text-sm font-light leading-7 text-stone-600 transition-colors duration-300 dark:text-stone-400">
        {description}
      </p>
    </motion.div>
  );
}
