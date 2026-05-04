'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search, X } from 'lucide-react';
import {
  searchUserGuideEntries,
  type UserGuideSearchEntry,
  type UserGuideSearchHighlight,
  type UserGuideSearchResult,
} from '@/lib/user-guide-search-core';
import type { UserGuideSearchCopy } from '@/lib/user-guide-search';

function HighlightedExcerpt({
  excerpt,
  highlights,
}: {
  excerpt: string;
  highlights: UserGuideSearchHighlight[];
}) {
  if (highlights.length === 0) {
    return <>{excerpt}</>;
  }

  const [highlight] = highlights;
  const before = excerpt.slice(0, highlight.start);
  const match = excerpt.slice(highlight.start, highlight.end);
  const after = excerpt.slice(highlight.end);

  return (
    <>
      {before}
      <mark className="rounded bg-stone-200 px-0.5 text-stone-900 dark:bg-stone-700 dark:text-stone-50">
        {match}
      </mark>
      {after}
    </>
  );
}

function SearchResultLink({
  active,
  copy,
  current,
  result,
  resultId,
  onOpen,
}: {
  active: boolean;
  copy: UserGuideSearchCopy;
  current: boolean;
  result: UserGuideSearchResult;
  resultId: string;
  onOpen: () => void;
}) {
  return (
    <Link
      id={resultId}
      href={result.path}
      role="option"
      aria-label={`${copy.openResultLabel}: ${result.title}`}
      aria-selected={active}
      onClick={onOpen}
      className={`group block rounded-[18px] px-3 py-3 text-left transition-colors focus:outline-none ${
        active
          ? 'bg-stone-100 text-stone-900 dark:bg-stone-800/80 dark:text-white'
          : 'text-stone-700 hover:bg-stone-50 dark:text-stone-200 dark:hover:bg-stone-900'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-stone-900 dark:text-stone-50">
              {result.title}
            </p>
            {current ? (
              <span className="rounded-full border border-stone-200 px-2 py-0.5 text-[10px] font-medium text-stone-500 dark:border-stone-700 dark:text-stone-400">
                {copy.currentPageLabel}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
            {result.groupLabel}
          </p>
        </div>
        <ArrowRight
          size={15}
          className="mt-1 shrink-0 text-stone-300 transition-transform group-hover:translate-x-0.5 group-hover:text-stone-500 dark:text-stone-600 dark:group-hover:text-stone-300"
        />
      </div>

      <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500 dark:text-stone-400">
        <HighlightedExcerpt
          excerpt={result.excerpt}
          highlights={result.highlights}
        />
      </p>
    </Link>
  );
}

export function UserGuideSearch({
  copy,
  currentPageId,
  entries,
}: {
  copy: UserGuideSearchCopy;
  currentPageId: string;
  entries: UserGuideSearchEntry[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(
    () =>
      searchUserGuideEntries(entries, deferredQuery, {
        currentPageId,
      }),
    [currentPageId, deferredQuery, entries],
  );
  const trimmedQuery = query.trim();
  const showResults = open && trimmedQuery.length > 0;
  const activeResult = results[activeIndex] ?? results[0];
  const activeResultId = activeResult
    ? `user-guide-search-result-${activeResult.id}`
    : undefined;

  function closeResults() {
    setOpen(false);
    setActiveIndex(0);
  }

  function openResult(result: UserGuideSearchResult | undefined) {
    if (!result) {
      return;
    }

    closeResults();
    setQuery('');
    router.push(result.path);
  }

  return (
    <div
      className="relative w-full"
      onBlur={(event) => {
        const nextTarget = event.relatedTarget;

        if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
          return;
        }

        closeResults();
      }}
    >
      <label htmlFor="user-guide-search" className="sr-only">
        {copy.inputLabel}
      </label>
      <div className="flex h-11 items-center gap-2 rounded-full border border-stone-200/80 bg-white/70 px-3 shadow-[0_18px_54px_-44px_rgba(87,83,78,0.5)] backdrop-blur-md transition-colors focus-within:border-stone-400/80 focus-within:bg-white/90 dark:border-stone-800/80 dark:bg-stone-900/50 dark:shadow-[0_18px_54px_-44px_rgba(0,0,0,0.72)] dark:focus-within:border-stone-600 dark:focus-within:bg-stone-950/70">
        <Search size={16} className="shrink-0 text-stone-400 dark:text-stone-500" />
        <input
          id="user-guide-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => {
            if (trimmedQuery) {
              setOpen(true);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' && results.length > 0) {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((index) => (index + 1) % results.length);
            }

            if (event.key === 'ArrowUp' && results.length > 0) {
              event.preventDefault();
              setOpen(true);
              setActiveIndex(
                (index) => (index - 1 + results.length) % results.length,
              );
            }

            if (event.key === 'Enter' && showResults) {
              event.preventDefault();
              openResult(activeResult);
            }

            if (event.key === 'Escape') {
              event.preventDefault();

              if (open) {
                closeResults();
              } else {
                setQuery('');
              }
            }
          }}
          role="combobox"
          aria-autocomplete="list"
          aria-controls="user-guide-search-results"
          aria-expanded={showResults}
          aria-activedescendant={showResults ? activeResultId : undefined}
          placeholder={copy.placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400 dark:text-stone-100 dark:placeholder:text-stone-500"
        />
        {trimmedQuery ? (
          <button
            type="button"
            aria-label={copy.clearLabel}
            onClick={() => {
              setQuery('');
              closeResults();
            }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 dark:text-stone-500 dark:hover:bg-stone-800 dark:hover:text-stone-200 dark:focus-visible:ring-stone-500/60"
          >
            <X size={14} />
          </button>
        ) : null}
      </div>

      {showResults ? (
        <div
          id="user-guide-search-results"
          role="listbox"
          aria-label={copy.resultsLabel}
          className="absolute inset-x-0 top-[calc(100%+0.6rem)] z-30 overflow-hidden rounded-[24px] border border-stone-200/85 bg-white/95 p-2 shadow-[0_28px_90px_-50px_rgba(87,83,78,0.55)] backdrop-blur-xl dark:border-stone-800/85 dark:bg-[#171717]/95 dark:shadow-[0_28px_90px_-50px_rgba(0,0,0,0.78)]"
        >
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
            {results.length > 0 ? copy.resultsLabel : copy.noResultsLabel}
          </p>
          <div className="max-h-[24rem] overflow-y-auto">
            {results.map((result) => (
              <SearchResultLink
                key={result.id}
                active={result.id === activeResult?.id}
                copy={copy}
                current={result.id === currentPageId}
                result={result}
                resultId={`user-guide-search-result-${result.id}`}
                onOpen={closeResults}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
