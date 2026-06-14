import { Children, isValidElement, type ReactNode } from 'react';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Github,
} from 'lucide-react';
import ReactMarkdown, {
  defaultUrlTransform,
  type Components,
  type UrlTransform,
} from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { UserGuideCodeBlock } from '@/components/user-guide-code-block';
import { UserGuideAssistant, type AssistantCopy } from '@/components/user-guide-assistant';
import { UserGuideSearch } from '@/components/user-guide-search';
import { UserGuideLayout } from '@/components/user-guide-layout';
import { AnimatedContainer, AnimatedItem } from '@/components/animated-wrapper';
import {
  getDisplayTypography,
  getEyebrowTypography,
} from '@/lib/locale-typography';
import {
  getUserGuideTurnstileSiteKey,
  isUserGuideAiEnabled,
} from '@/lib/user-guide-ai';
import {
  getUserGuideMarkdown,
  getUserGuideNavigation,
  getUserGuideOverviewCards,
  getUserGuidePageIdFromHrefToken,
  getUserGuidePageFromSlug,
  getUserGuideUiCopy,
  resolveUserGuideHref,
  type UserGuideNavGroup,
  type UserGuideNavItem,
  type UserGuidePageModel,
} from '@/lib/user-guide-content';
import type { UserGuideSearchCopy } from '@/lib/user-guide-search';
import type { HomeLocale } from '@/lib/homepage-content';

const preserveUserGuideInternalLinks: UrlTransform = (url) => {
  if (getUserGuidePageIdFromHrefToken(url)) {
    return url;
  }

  return defaultUrlTransform(url);
};

function getUserGuideSearchCopyFromMessages(
  t: Awaited<ReturnType<typeof getTranslations>>,
): UserGuideSearchCopy {
  return t.raw('search') as UserGuideSearchCopy;
}

function getUserGuideAssistantCopyFromMessages(
  t: Awaited<ReturnType<typeof getTranslations>>,
  pageTitle: string,
): AssistantCopy {
  return {
    title: t('assistant.title'),
    summary: t('assistant.summary'),
    expandLabel: t('assistant.expandLabel'),
    collapseLabel: t('assistant.collapseLabel'),
    examplesLabel: t('assistant.examplesLabel'),
    examples: [
      t('assistant.examples.pagePurpose', { pageTitle }),
      t('assistant.examples.nextStep', { pageTitle }),
      t('assistant.examples.featureSetup'),
    ],
    inputPlaceholder: t('assistant.inputPlaceholder'),
    submitLabel: t('assistant.submitLabel'),
    submittingLabel: t('assistant.submittingLabel'),
    youLabel: t('assistant.youLabel'),
    assistantLabel: t('assistant.assistantLabel'),
    detailsLabel: t('assistant.detailsLabel'),
    sourcesLabel: t('assistant.sourcesLabel'),
    nextPagesLabel: t('assistant.nextPagesLabel'),
    disabledInline: t('assistant.disabledInline'),
    genericError: t('assistant.genericError'),
    networkError: t('assistant.networkError'),
    upstreamError: t('assistant.upstreamError'),
    emptyResponseError: t('assistant.emptyResponseError'),
    unavailableError: t('assistant.unavailableError'),
    emptyQuestionError: t('assistant.emptyQuestionError'),
    forbiddenOriginError: t('assistant.forbiddenOriginError'),
    challengeError: t('assistant.challengeError'),
    challengeExpiredError: t('assistant.challengeExpiredError'),
    challengePrompt: t('assistant.challengePrompt'),
    challengeVerifyingLabel: t('assistant.challengeVerifyingLabel'),
    challengeLoadingError: t('assistant.challengeLoadingError'),
    rateLimitUnavailableError: t('assistant.rateLimitUnavailableError'),
    rateLimitedError: t('assistant.rateLimitedError'),
    throttledError: t('assistant.throttledError'),
    tooLongError: t('assistant.tooLongError'),
  };
}

function extractTextContent(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return String(child);
      }

      if (isValidElement<{ children?: ReactNode }>(child)) {
        return extractTextContent(child.props.children);
      }

      return '';
    })
    .join('');
}

function createMarkdownComponents(
  locale: HomeLocale,
  ui: ReturnType<typeof getUserGuideUiCopy>,
): Components {
  const pageTitleTypography = getDisplayTypography(locale, 'page');
  const guideSectionTypography = getDisplayTypography(locale, 'guideSection');
  const h3ClassName = guideSectionTypography.isCjk
    ? 'mt-12 text-xl font-medium tracking-normal text-[#2D2D2D] dark:text-[#E0E0E0] sm:text-2xl'
    : 'mt-12 text-xl font-medium tracking-tight text-[#2D2D2D] dark:text-[#E0E0E0] sm:text-2xl';

  return {
    h1: ({ children }) => (
      <h1
        className={`text-[#2D2D2D] transition-colors duration-300 dark:text-[#E0E0E0] ${pageTitleTypography.className}`}
        style={pageTitleTypography.style}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className={`mt-16 scroll-mt-24 border-t border-stone-200/50 pt-10 text-[#2D2D2D] dark:border-stone-800/50 dark:text-[#E0E0E0] ${guideSectionTypography.className}`}
        style={guideSectionTypography.style}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className={h3ClassName}>
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
    table: ({ children, ...props }) => (
      <div className="-mx-1 mt-8 overflow-x-auto rounded-xl border border-stone-200/70 bg-white/45 shadow-sm shadow-stone-200/30 dark:border-stone-800/70 dark:bg-stone-950/25 dark:shadow-none">
        <table
          {...props}
          className="m-0 min-w-[720px] w-full border-collapse text-left text-[0.92rem] text-stone-600 dark:text-stone-300"
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead
        {...props}
        className="border-b border-stone-200/80 bg-stone-100/70 text-stone-800 dark:border-stone-800/80 dark:bg-stone-900/80 dark:text-stone-100"
      >
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody
        {...props}
        className="divide-y divide-stone-200/70 dark:divide-stone-800/70"
      >
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }) => (
      <tr
        {...props}
        className="transition-colors hover:bg-stone-50/80 dark:hover:bg-stone-900/55"
      >
        {children}
      </tr>
    ),
    th: ({ children, ...props }) => (
      <th
        {...props}
        className="px-4 py-3 text-left align-top text-[0.78rem] font-semibold uppercase leading-[1.45] tracking-[0.08em] text-stone-600 dark:text-stone-300"
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td
        {...props}
        className="px-4 py-3.5 align-top text-[0.92rem] font-light leading-[1.65] text-stone-600 first:font-normal first:text-stone-800 dark:text-stone-300 dark:first:text-stone-100"
      >
        {children}
      </td>
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
    pre: ({ children }) => (
      <UserGuideCodeBlock
        code={extractTextContent(children).replace(/\n$/, '')}
        copyLabel={ui.codeBlock.copyLabel}
        copiedLabel={ui.codeBlock.copiedLabel}
      />
    ),
    code: ({ children, className }) => (
      <code
        className={
          className
            ? className
            : 'rounded-md border border-stone-200/80 bg-stone-100/90 px-1.5 py-0.5 font-mono text-[0.92em] font-medium text-stone-800 transition-colors dark:border-stone-700/80 dark:bg-stone-900/80 dark:text-stone-100'
        }
      >
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
    'inline-flex items-center justify-center shrink-0 transition-colors hover:text-stone-800 dark:hover:text-stone-200';

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

function HeaderActions({
  className = '',
  page,
  slug,
}: {
  className?: string;
  page: UserGuidePageModel;
  slug?: string[];
}) {
  return (
    <div
      className={`flex items-center justify-end gap-3 text-[13px] font-medium text-stone-500 dark:text-stone-400 sm:gap-4 sm:text-sm md:gap-6 whitespace-nowrap ${className}`}
    >
      <ThemeToggle />
      <HeaderLink href={page.homeHref}>
        <span className="inline-flex items-center gap-1.5">
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">{page.homeLabel}</span>
        </span>
      </HeaderLink>
      <LanguageSwitcher />
      <HeaderLink href={page.sourceHref} external>
        <span className="inline-flex items-center gap-1.5">
          <Github size={16} />
          <span className="hidden sm:inline">{page.sourceLabel}</span>
        </span>
      </HeaderLink>
    </div>
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

  const t = await getTranslations({ locale, namespace: 'UserGuidePage' });
  const ui = getUserGuideUiCopy(locale);
  const navigation = getUserGuideNavigation(locale, page.id);
  const overviewCards = getUserGuideOverviewCards(locale);
  const searchCopy = getUserGuideSearchCopyFromMessages(t);
  const markdown = await getUserGuideMarkdown(locale, page.id);
  const markdownComponents = createMarkdownComponents(locale, ui);
  const assistantCopy = getUserGuideAssistantCopyFromMessages(t, page.navLabel);
  const aiEnabled = isUserGuideAiEnabled();
  const turnstileSiteKey = getUserGuideTurnstileSiteKey();
  const pageTitleTypography = getDisplayTypography(locale, 'page');
  const overviewTitleTypography = getDisplayTypography(locale, 'guideSection');
  const pageEyebrowTypography = getEyebrowTypography(
    locale,
    'tracking-[0.24em]',
  );
  const articleClassName = [
    'prose prose-stone dark:prose-invert max-w-none prose-a:font-medium prose-code:before:content-none prose-code:after:content-none prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0 prose-pre:text-inherit prose-pre:shadow-none',
    pageTitleTypography.isCjk
      ? 'prose-headings:font-medium'
      : 'prose-headings:font-serif prose-headings:font-medium',
  ].join(' ');

  return (
    <UserGuideLayout
      page={page}
      navigation={navigation}
      searchBar={
        <UserGuideSearch
          key="user-guide-search"
          copy={searchCopy}
          currentPageId={page.id}
          locale={locale}
        />
      }
      headerActionsMobile={<HeaderActions key="header-actions-mobile" className="lg:hidden" page={page} slug={slug} />}
      headerActionsDesktop={<HeaderActions key="header-actions-desktop" className="hidden lg:flex" page={page} slug={slug} />}
    >
      <AnimatedContainer className="flex-1 min-w-0">
        <AnimatedItem>
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
            <Link href={page.homeHref} className="transition-colors hover:text-stone-800 dark:hover:text-stone-200">
              Sona
            </Link>
            <ChevronRight size={14} className="opacity-50" />
            <Link href="/user-guide" className="transition-colors hover:text-stone-800 dark:hover:text-stone-200">
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
            <p className={`mb-4 text-[11px] font-semibold uppercase text-stone-400 dark:text-stone-500 ${pageEyebrowTypography.className}`}>
              {page.groupLabel}
            </p>
            <h1
              className={`text-[#2D2D2D] transition-colors duration-300 dark:text-[#E0E0E0] ${pageTitleTypography.className}`}
              style={pageTitleTypography.style}
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
            turnstileSiteKey={turnstileSiteKey}
          />
        </AnimatedItem>

        {page.id === 'overview' ? (
          <AnimatedItem className="mb-16 space-y-16">
            <section>
              <p className={`mb-4 text-[11px] font-semibold uppercase text-stone-400 dark:text-stone-500 ${pageEyebrowTypography.className}`}>
                {ui.overview.cardsEyebrow}
              </p>
              <h2
                className={`mb-6 text-[#2D2D2D] dark:text-[#E0E0E0] ${
                  overviewTitleTypography.isCjk
                    ? overviewTitleTypography.className
                    : 'text-[2rem] leading-tight font-serif italic sm:text-[2.5rem]'
                }`}
                style={
                  overviewTitleTypography.isCjk
                    ? overviewTitleTypography.style
                    : { fontFamily: 'Georgia, serif' }
                }
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
              <p className={`mb-4 text-[11px] font-semibold uppercase text-stone-400 dark:text-stone-500 ${pageEyebrowTypography.className}`}>
                {ui.overview.browseEyebrow}
              </p>
              <h2
                className={`mb-6 text-[#2D2D2D] dark:text-[#E0E0E0] ${
                  overviewTitleTypography.isCjk
                    ? overviewTitleTypography.className
                    : 'text-[2rem] leading-tight font-serif italic sm:text-[2.5rem]'
                }`}
                style={
                  overviewTitleTypography.isCjk
                    ? overviewTitleTypography.style
                    : { fontFamily: 'Georgia, serif' }
                }
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

        <AnimatedItem as="article" className={articleClassName}>
          <ReactMarkdown
            components={markdownComponents}
            remarkPlugins={[remarkGfm]}
            urlTransform={preserveUserGuideInternalLinks}
          >
            {markdown}
          </ReactMarkdown>
        </AnimatedItem>

        {page.previousPage || page.nextPage ? (
          <AnimatedItem as="section" className="mt-16 grid gap-4 border-t border-stone-200/50 pt-8 dark:border-stone-800/50 md:grid-cols-2">
            {page.previousPage ? (
              <PaginationCard
                key="prev-page"
                item={page.previousPage}
                label={page.previousLabel}
                direction="previous"
              />
            ) : (
              <div key="prev-placeholder" className="hidden md:block" />
            )}
            {page.nextPage ? (
              <PaginationCard
                key="next-page"
                item={page.nextPage}
                label={page.nextLabel}
                direction="next"
              />
            ) : null}
          </AnimatedItem>
        ) : null}
      </AnimatedContainer>
    </UserGuideLayout>
  );
}
