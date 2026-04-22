import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Github,
  Home,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/theme-toggle';
import {
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
        className="text-[2.3rem] leading-[0.98] text-stone-900 dark:text-stone-100 sm:text-[3rem]"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className="mt-12 scroll-mt-24 border-t border-stone-200 pt-8 text-[1.7rem] leading-tight text-stone-900 dark:border-stone-800 dark:text-stone-100 sm:text-[2rem]"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-lg font-semibold tracking-[0.02em] text-stone-900 dark:text-stone-100 sm:text-xl">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-base leading-8 text-stone-600 dark:text-stone-300 sm:text-[1.02rem]">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="space-y-3 pl-6 text-base leading-8 text-stone-600 marker:text-stone-400 dark:text-stone-300 dark:marker:text-stone-500 sm:text-[1.02rem]">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="space-y-3 pl-6 text-base leading-8 text-stone-600 marker:font-medium marker:text-stone-500 dark:text-stone-300 dark:marker:text-stone-400 sm:text-[1.02rem]">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="pl-1">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-stone-700 dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-200">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => {
      const resolved = resolveUserGuideHref(locale, href);
      const className =
        'font-medium text-stone-900 underline decoration-stone-300 decoration-2 underline-offset-4 transition-colors hover:text-stone-600 hover:decoration-stone-500 dark:text-stone-100 dark:decoration-stone-600 dark:hover:text-stone-300';

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
      <code className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[0.95em] text-stone-800 dark:bg-stone-800 dark:text-stone-100">
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
    'inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-200 dark:hover:border-stone-600 dark:hover:bg-stone-900';

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
    <aside className="hidden lg:block">
      <div className="sticky top-8 rounded-[28px] border border-stone-200/80 bg-white/88 p-5 shadow-[0_24px_90px_-56px_rgba(87,83,78,0.55)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-[#171717]/88">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
          {title}
        </p>
        <div className="mt-5 space-y-6">
          {groups.map((group) => (
            <div key={group.id}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                {group.label}
              </p>
              <div className="space-y-1.5">
                {group.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`block rounded-2xl px-3 py-3 transition-colors ${
                      item.active
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                        : 'text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-900'
                    }`}
                  >
                    <p className="text-sm font-medium">{item.title}</p>
                    <p
                      className={`mt-1 text-xs leading-5 ${
                        item.active
                          ? 'text-stone-200 dark:text-stone-700'
                          : 'text-stone-500 dark:text-stone-400'
                      }`}
                    >
                      {item.description}
                    </p>
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
    <section className="rounded-[24px] border border-stone-200/80 bg-white/88 p-4 shadow-[0_24px_90px_-56px_rgba(87,83,78,0.55)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-[#171717]/88 lg:hidden">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
        {label}
      </p>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.path}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              item.active
                ? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900'
                : 'border-stone-300 text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-900'
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
      <ArrowLeft size={16} />
    ) : (
      <ArrowRight size={16} />
    );

  return (
    <Link
      href={item.path}
      className="flex h-full min-h-[148px] flex-col justify-between rounded-[24px] border border-stone-200/80 bg-white/88 p-5 shadow-[0_24px_90px_-56px_rgba(87,83,78,0.55)] transition-colors hover:border-stone-300 hover:bg-white dark:border-stone-800/80 dark:bg-[#171717]/88 dark:hover:border-stone-700 dark:hover:bg-[#1a1a1a]"
    >
      <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
        {direction === 'previous' && icon}
        {label}
        {direction === 'next' && icon}
      </span>
      <div className="mt-4">
        <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          {item.title}
        </p>
        <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-stone-400">
          {item.description}
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

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 sm:py-8 md:px-16">
      <div className="absolute right-0 top-0 h-[300px] w-[300px] translate-x-1/3 -translate-y-1/3 rounded-full bg-stone-200/70 blur-[90px] dark:bg-stone-800/40 sm:h-[480px] sm:w-[480px] sm:blur-[110px]" />
      <div className="absolute bottom-0 left-0 h-[340px] w-[340px] -translate-x-1/4 translate-y-1/4 rounded-full bg-stone-200/70 blur-[100px] dark:bg-stone-800/30 sm:h-[560px] sm:w-[560px] sm:blur-[120px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8">
        <header className="flex flex-col gap-5 rounded-[28px] border border-stone-200/80 bg-white/78 px-5 py-5 shadow-[0_32px_110px_-58px_rgba(87,83,78,0.55)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-[#171717]/78 sm:px-7 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <Link
                href={page.homeHref}
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
                    {page.guideLabel}
                  </p>
                </div>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <ThemeToggle />
              <HeaderLink href={page.homeHref}>
                <span className="inline-flex items-center gap-2">
                  <Home size={16} />
                  {page.homeLabel}
                </span>
              </HeaderLink>
              <HeaderLink href={page.alternatePath}>
                {page.alternateLanguageLabel}
              </HeaderLink>
              <HeaderLink href={page.sourceHref} external>
                <span className="inline-flex items-center gap-2">
                  <Github size={16} />
                  {page.sourceLabel}
                </span>
              </HeaderLink>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
          <SidebarNavigation groups={navigation} title={page.sidebarTitle} />

          <div className="min-w-0 space-y-6">
            <MobileNavigation groups={navigation} label={page.mobileNavLabel} />

            <section className="rounded-[28px] border border-stone-200/80 bg-white/88 px-5 py-6 shadow-[0_32px_110px_-58px_rgba(87,83,78,0.55)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-[#171717]/86 sm:px-8 sm:py-8">
              <nav className="flex flex-wrap items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                <Link href={page.homeHref} className="transition-colors hover:text-stone-800 dark:hover:text-stone-200">
                  Sona
                </Link>
                <ChevronRight size={14} />
                <Link href={page.locale === 'en' ? '/user-guide' : '/zh/user-guide'} className="transition-colors hover:text-stone-800 dark:hover:text-stone-200">
                  {page.guideLabel}
                </Link>
                {page.id !== 'overview' ? (
                  <>
                    <ChevronRight size={14} />
                    <span>{page.navLabel}</span>
                  </>
                ) : null}
              </nav>

              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
                {page.groupLabel}
              </p>
              <h1
                className="mt-3 text-[2.5rem] leading-[0.96] text-stone-900 dark:text-stone-100 sm:text-[3.3rem]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {page.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-stone-600 dark:text-stone-300 sm:text-lg">
                {page.description}
              </p>
            </section>

            {page.id === 'overview' ? (
              <>
                <section className="rounded-[28px] border border-stone-200/80 bg-white/88 px-5 py-6 shadow-[0_32px_110px_-58px_rgba(87,83,78,0.55)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-[#171717]/86 sm:px-8 sm:py-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
                    {ui.overview.cardsEyebrow}
                  </p>
                  <h2
                    className="mt-3 text-[1.9rem] leading-tight text-stone-900 dark:text-stone-100 sm:text-[2.2rem]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {ui.overview.cardsTitle}
                  </h2>
                  <p className="mt-3 max-w-3xl text-base leading-8 text-stone-600 dark:text-stone-300">
                    {ui.overview.cardsDescription}
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {overviewCards.map((item) => (
                      <Link
                        key={item.id}
                        href={item.path}
                        className="rounded-[24px] border border-stone-200 bg-stone-50 p-5 transition-colors hover:border-stone-300 hover:bg-white dark:border-stone-800 dark:bg-stone-900/60 dark:hover:border-stone-700 dark:hover:bg-stone-900"
                      >
                        <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-stone-400">
                          {item.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="rounded-[28px] border border-stone-200/80 bg-white/88 px-5 py-6 shadow-[0_32px_110px_-58px_rgba(87,83,78,0.55)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-[#171717]/86 sm:px-8 sm:py-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
                    {ui.overview.browseEyebrow}
                  </p>
                  <h2
                    className="mt-3 text-[1.9rem] leading-tight text-stone-900 dark:text-stone-100 sm:text-[2.2rem]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {ui.overview.browseTitle}
                  </h2>
                  <p className="mt-3 max-w-3xl text-base leading-8 text-stone-600 dark:text-stone-300">
                    {ui.overview.browseDescription}
                  </p>

                  <div className="mt-6 grid gap-4 xl:grid-cols-3">
                    {navigation.map((group) => (
                      <div
                        key={group.id}
                        className="rounded-[24px] border border-stone-200 bg-stone-50 p-5 dark:border-stone-800 dark:bg-stone-900/60"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                          {group.label}
                        </p>
                        <div className="mt-4 space-y-3">
                          {group.items.map((item) => (
                            <Link
                              key={item.id}
                              href={item.path}
                              className="block rounded-2xl px-3 py-3 transition-colors hover:bg-white dark:hover:bg-stone-950"
                            >
                              <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                                {item.title}
                              </p>
                              <p className="mt-1 text-sm leading-6 text-stone-500 dark:text-stone-400">
                                {item.description}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            ) : null}

            <section className="rounded-[28px] border border-stone-200/80 bg-white/88 px-5 py-6 shadow-[0_32px_110px_-58px_rgba(87,83,78,0.55)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-[#171717]/86 sm:px-8 sm:py-8">
              <article className="space-y-6">
                <ReactMarkdown components={markdownComponents}>
                  {markdown}
                </ReactMarkdown>
              </article>
            </section>

            {page.previousPage || page.nextPage ? (
              <section className="grid gap-4 md:grid-cols-2">
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
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
