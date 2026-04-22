import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Github,
  Globe,
  Home,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserGuideAssistant } from '@/components/user-guide-assistant';
import { AnimatedContainer, AnimatedItem } from '@/components/animated-wrapper';
import { isUserGuideAiEnabled } from '@/lib/user-guide-ai';
import {
  getUserGuideAssistantCopy,
  getUserGuideMarkdown,
  getUserGuideNavigation,
  getUserGuideOverviewCards,
  getUserGuidePageFromSlug,
  getUserGuideUiCopy,
  resolveUserGuideHref,
  type UserGuideNavGroup,
  type UserGuideNavItem,
} from '@/lib/user-guide-content';
import type { HomeLocale } from '@/lib/homepage-content';

function createMarkdownComponents(locale: HomeLocale): Components {
  return {
    h1: ({ children }) => (
      <h1
        className="text-[clamp(2.5rem,8vw,3.5rem)] leading-[1] font-serif italic text-[#2D2D2D] transition-colors duration-300 dark:text-[#E0E0E0]"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className="mt-16 scroll-mt-24 border-t border-stone-200/50 pt-10 text-[1.8rem] leading-tight font-serif italic text-[#2D2D2D] dark:border-stone-800/50 dark:text-[#E0E0E0] sm:text-[2.2rem]"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-12 text-xl font-medium tracking-tight text-[#2D2D2D] dark:text-[#E0E0E0] sm:text-2xl">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mt-6 text-[1rem] font-light leading-[1.8] text-stone-600 dark:text-stone-300 sm:text-lg">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="mt-6 space-y-3 pl-6 text-[1rem] font-light leading-[1.8] text-stone-600 marker:text-stone-400 dark:text-stone-300 dark:marker:text-stone-500 sm:text-lg">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mt-6 space-y-3 pl-6 text-[1rem] font-light leading-[1.8] text-stone-600 marker:font-medium marker:text-stone-500 dark:text-stone-300 dark:marker:text-stone-400 sm:text-lg">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="pl-1">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="mt-8 rounded-2xl border-l-4 border-stone-300 bg-stone-100/50 px-6 py-5 text-stone-700 dark:border-stone-600 dark:bg-stone-800/30 dark:text-stone-200">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => {
      const resolved = resolveUserGuideHref(locale, href);
      const className =
        'font-medium text-[#2D2D2D] underline decoration-stone-300 decoration-2 underline-offset-4 transition-colors hover:text-stone-600 hover:decoration-stone-500 dark:text-[#E0E0E0] dark:decoration-stone-600 dark:hover:text-stone-300';

      if (resolved.external) {
        return (
          <a
            href={resolved.href}
            target="_blank"
            rel="noreferrer"
            className={className}
          >
            {children}
          </a>
        );
      }

      return (
        <Link href={resolved.href} className={className}>
          {children}
        </Link>
      );
    },
    code: ({ children }) => (
      <code className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[0.95em] font-mono text-stone-800 dark:bg-stone-800 dark:text-stone-200">
        {children}
      </code>
    ),
  };
}

function HeaderLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    'inline-flex items-center justify-center transition-colors hover:text-stone-800 dark:hover:text-stone-200';

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function SidebarNavigation({
  groups,
  title,
}: {
  groups: UserGuideNavGroup[];
  title: string;
}) {
  return (
    <aside className="hidden lg:block w-[280px] shrink-0">
      <div className="sticky top-12 flex flex-col gap-8 pr-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
          {title}
        </p>
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.id}>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400/80 dark:text-stone-500/80">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`group block rounded-xl px-3 py-2 transition-all ${
                      item.active
                        ? 'bg-stone-200/50 text-[#2D2D2D] dark:bg-stone-800/50 dark:text-[#E0E0E0]'
                        : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-900/50 dark:hover:text-stone-200'
                    }`}
                  >
                    <p className={`text-sm ${item.active ? 'font-medium' : 'font-normal'}`}>{item.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function MobileNavigation({
  groups,
  label,
}: {
  groups: UserGuideNavGroup[];
  label: string;
}) {
  const items = groups.flatMap((group) => group.items);

  return (
    <section className="mb-8 lg:hidden">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
        {label}
      </p>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 scrollbar-hide">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.path}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
              item.active
                ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900 font-medium'
                : 'bg-white/50 text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50 dark:bg-stone-900/30 dark:text-stone-300 dark:ring-stone-800 dark:hover:bg-stone-800/50'
            }`}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

function PaginationCard({
  item,
  label,
  direction,
}: {
  item: UserGuideNavItem;
  label: string;
  direction: 'previous' | 'next';
}) {
  const icon =
    direction === 'previous' ? (
      <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
    ) : (
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
    );

  return (
    <Link
      href={item.path}
      className={`group flex h-full min-h-[120px] flex-col justify-between rounded-2xl bg-white/40 p-6 ring-1 ring-stone-200/50 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-sm dark:bg-stone-900/30 dark:ring-stone-800/50 dark:hover:bg-stone-900 ${
        direction === 'next' ? 'items-end text-right' : 'items-start text-left'
      }`}
    >
      <span className={`inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-400 transition-colors group-hover:text-stone-600 dark:text-stone-500 dark:group-hover:text-stone-300 ${
        direction === 'next' ? 'flex-row-reverse' : 'flex-row'
      }`}>
        {icon}
        {label}
      </span>
      <div className="mt-4">
        <p className="text-lg font-medium text-[#2D2D2D] dark:text-[#E0E0E0]">
          {item.title}
        </p>
      </div>
    </Link>
  );
}

export async function UserGuidePage({
  locale,
  slug,
}: {
  locale: HomeLocale;
  slug?: string[];
}) {
  const page = getUserGuidePageFromSlug(locale, slug);

  if (!page) {
    notFound();
  }

  const ui = getUserGuideUiCopy(locale);
  const navigation = getUserGuideNavigation(locale, page.id);
  const overviewCards = getUserGuideOverviewCards(locale);
  const markdown = await getUserGuideMarkdown(locale, page.id);
  const markdownComponents = createMarkdownComponents(locale);
  const assistantCopy = getUserGuideAssistantCopy(locale, page.navLabel);
  const aiEnabled = isUserGuideAiEnabled();

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#F7F5F2] text-[#2D2D2D] transition-colors duration-300 dark:bg-[#121212] dark:text-[#E0E0E0] px-4 py-5 sm:px-6 sm:py-7 md:px-16 md:py-8">
      <div className="absolute top-0 right-0 h-[280px] w-[280px] translate-x-1/3 -translate-y-1/3 rounded-full bg-stone-200 opacity-30 blur-[90px] transition-colors duration-300 dark:bg-stone-800 dark:opacity-20 -z-10 sm:h-[500px] sm:w-[500px] sm:blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-[320px] w-[320px] -translate-x-1/4 translate-y-1/4 rounded-full bg-stone-200 opacity-30 blur-[100px] transition-colors duration-300 dark:bg-stone-800 dark:opacity-20 -z-10 sm:h-[600px] sm:w-[600px] sm:blur-[120px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-12 sm:gap-16">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={page.homeHref}
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
            <HeaderLink href={page.homeHref}>
              <span className="inline-flex items-center gap-1.5">
                <Home size={16} />
                <span className="hidden sm:inline">{page.homeLabel}</span>
              </span>
            </HeaderLink>
            <Link
              href={page.alternatePath}
              className="flex items-center gap-1.5 cursor-pointer transition-colors hover:text-stone-800 focus:outline-none dark:hover:text-stone-200"
            >
              <Globe size={16} />
              <span className="hidden sm:inline">{page.alternateLanguageLabel}</span>
              <span className="sm:hidden">{page.alternateLanguageLabel === '中文' ? '中' : 'En'}</span>
            </Link>
            <HeaderLink href={page.sourceHref} external>
              <span className="inline-flex items-center gap-1.5">
                <Github size={16} />
                <span className="hidden sm:inline">{page.sourceLabel}</span>
              </span>
            </HeaderLink>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16 pb-20">
          <SidebarNavigation groups={navigation} title={page.sidebarTitle} />

          <AnimatedContainer className="flex-1 min-w-0 max-w-4xl">
            <MobileNavigation groups={navigation} label={page.mobileNavLabel} />

            <AnimatedItem>
              <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                <Link href={page.homeHref} className="transition-colors hover:text-stone-800 dark:hover:text-stone-200">
                  Sona
                </Link>
                <ChevronRight size={14} className="opacity-50" />
                <Link href={page.locale === 'en' ? '/user-guide' : '/zh/user-guide'} className="transition-colors hover:text-stone-800 dark:hover:text-stone-200">
                  {page.guideLabel}
                </Link>
                {page.id !== 'overview' ? (
                  <>
                    <ChevronRight size={14} className="opacity-50" />
                    <span className="text-stone-800 dark:text-stone-200">{page.navLabel}</span>
                  </>
                ) : null}
              </nav>

              <div className="mb-12 border-b border-stone-200/50 pb-8 dark:border-stone-800/50">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
                  {page.groupLabel}
                </p>
                <h1
                  className="text-[clamp(2.5rem,8vw,3.5rem)] leading-[1] font-serif italic text-[#2D2D2D] transition-colors duration-300 dark:text-[#E0E0E0]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {page.title}
                </h1>
                <p className="mt-6 text-[1rem] font-light leading-[1.75] text-stone-500 transition-colors duration-300 dark:text-stone-400 sm:text-lg sm:leading-[1.8]">
                  {page.description}
                </p>
              </div>
            </AnimatedItem>

            <AnimatedItem>
              <UserGuideAssistant
                copy={assistantCopy}
                enabled={aiEnabled}
                locale={locale}
                pageId={page.id}
              />
            </AnimatedItem>

            {page.id === 'overview' ? (
              <AnimatedItem className="mb-16 space-y-16">
                <section>
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
                    {ui.overview.cardsEyebrow}
                  </p>
                  <h2
                    className="mb-6 text-[2rem] leading-tight font-serif italic text-[#2D2D2D] dark:text-[#E0E0E0] sm:text-[2.5rem]"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {ui.overview.cardsTitle}
                  </h2>
                  <p className="mb-8 text-[1rem] font-light leading-[1.75] text-stone-500 dark:text-stone-400 sm:text-lg sm:leading-[1.8]">
                    {ui.overview.cardsDescription}
                  </p>

                  <div className="grid gap-4 md:grid-cols-3">
                    {overviewCards.map((item) => (
                      <Link
                        key={item.id}
                        href={item.path}
                        className="group flex flex-col rounded-2xl bg-white/40 p-6 ring-1 ring-stone-200/50 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-sm dark:bg-stone-900/30 dark:ring-stone-800/50 dark:hover:bg-stone-900"
                      >
                        <p className="text-lg font-medium text-[#2D2D2D] dark:text-[#E0E0E0]">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm font-light leading-[1.6] text-stone-500 dark:text-stone-400">
                          {item.description}
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-stone-400 transition-colors group-hover:text-stone-800 dark:text-stone-500 dark:group-hover:text-stone-200">
                          <span>Read more</span>
                          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>

                <section>
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
                    {ui.overview.browseEyebrow}
                  </p>
                  <h2
                    className="mb-6 text-[2rem] leading-tight font-serif italic text-[#2D2D2D] dark:text-[#E0E0E0] sm:text-[2.5rem]"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {ui.overview.browseTitle}
                  </h2>
                  <p className="mb-8 text-[1rem] font-light leading-[1.75] text-stone-500 dark:text-stone-400 sm:text-lg sm:leading-[1.8]">
                    {ui.overview.browseDescription}
                  </p>

                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {navigation.map((group) => (
                      <div
                        key={group.id}
                        className="flex flex-col gap-4 rounded-2xl bg-white/30 p-6 ring-1 ring-stone-200/40 dark:bg-stone-900/20 dark:ring-stone-800/40"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                          {group.label}
                        </p>
                        <div className="flex flex-col gap-2">
                          {group.items.map((item) => (
                            <Link
                              key={item.id}
                              href={item.path}
                              className="group block rounded-xl px-3 py-2.5 transition-colors hover:bg-white dark:hover:bg-stone-900/80"
                            >
                              <p className="text-sm font-medium text-[#2D2D2D] transition-colors group-hover:text-stone-900 dark:text-[#E0E0E0] dark:group-hover:text-white">
                                {item.title}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </AnimatedItem>
            ) : null}

            <AnimatedItem as="article" className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-medium prose-a:font-medium">
              <ReactMarkdown components={markdownComponents}>
                {markdown}
              </ReactMarkdown>
            </AnimatedItem>

            {page.previousPage || page.nextPage ? (
              <AnimatedItem as="section" className="mt-16 grid gap-4 border-t border-stone-200/50 pt-8 dark:border-stone-800/50 md:grid-cols-2">
                {page.previousPage ? (
                  <PaginationCard
                    item={page.previousPage}
                    label={page.previousLabel}
                    direction="previous"
                  />
                ) : (
                  <div className="hidden md:block" />
                )}
                {page.nextPage ? (
                  <PaginationCard
                    item={page.nextPage}
                    label={page.nextLabel}
                    direction="next"
                  />
                ) : null}
              </AnimatedItem>
            ) : null}
          </AnimatedContainer>
        </div>
      </div>
    </main>
  );
}
