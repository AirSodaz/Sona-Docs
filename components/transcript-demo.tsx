'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react';
import {
  AudioLines,
  CheckCircle2,
  Clock3,
  Download,
  FolderOpen,
  Languages,
  Mic,
  Play,
  Search,
  Shield,
  Sparkles,
  Square,
} from 'lucide-react';
import type { DemoAction, DemoContent, DemoSegment } from '@/lib/homepage-content';

const actionOrder: DemoAction[] = ['recorded', 'polished', 'translated'];
const actionIcons = {
  recorded: Mic,
  polished: Sparkles,
  translated: Languages,
} as const;
type DemoScrollOffsetPair = ['start 65%', 'end end'] | ['start 82%', 'end 18%'];
const finishThreshold = 0.88;
const desktopScrollOffsets: DemoScrollOffsetPair = ['start 65%', 'end end'];
const compactViewportScrollOffsets: DemoScrollOffsetPair = ['start 82%', 'end 18%'];
const waveformSeeds = Array.from({ length: 30 }, (_, index) =>
  0.24 + (((Math.sin(index * 1.55) + 1) / 2) * 0.78),
);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${seconds}`;
}

function countWords(text: string) {
  const matches = text.match(
    /[\p{sc=Han}\p{sc=Hiragana}\p{sc=Katakana}\p{sc=Hangul}]|[\p{L}\d]+/gu,
  );

  return matches ? matches.length : 0;
}

function getPrimaryText(segment: DemoSegment, action: DemoAction) {
  if (action === 'polished') {
    return segment.polished;
  }

  return segment.raw;
}

function getTypedText(text: string, progress: number) {
  const normalized = clamp(progress, 0, 1);
  const visibleLength = Math.floor(text.length * normalized);

  return text.slice(0, visibleLength);
}

type RenderedSegment =
  | {
      kind: 'placeholder';
      index: number;
      segment: DemoSegment;
    }
  | {
      kind: 'content';
      index: number;
      segment: DemoSegment;
      text: string;
      translation?: string;
      active: boolean;
    };

export function TranscriptDemo({ demo }: { demo: DemoContent }) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const demoCardRef = useRef<HTMLDivElement>(null);
  const workspaceScrollRef = useRef<HTMLDivElement>(null);
  const editorScrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeAction, setActiveAction] = useState<DemoAction>('recorded');
  const [rawScrollProgress, setRawScrollProgress] = useState(0);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const [desktopRunwayHeight, setDesktopRunwayHeight] = useState<number | null>(
    null,
  );
  const scrollOffsets = isDesktopViewport
    ? desktopScrollOffsets
    : compactViewportScrollOffsets;

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: scrollOffsets,
  });
  const smoothedScrollProgress = useSpring(scrollYProgress, {
    stiffness: 170,
    damping: 28,
    mass: 0.22,
  });

  useMotionValueEvent(smoothedScrollProgress, 'change', (latest) => {
    if (prefersReducedMotion) {
      return;
    }

    setRawScrollProgress(clamp(latest, 0, 1));
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const syncViewport = () => setIsDesktopViewport(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener('change', syncViewport);

    return () => {
      mediaQuery.removeEventListener('change', syncViewport);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !isDesktopViewport) {
      return;
    }

    const demoCard = demoCardRef.current;

    if (!demoCard) {
      return;
    }

    const updateRunwayHeight = () => {
      setDesktopRunwayHeight(Math.ceil(demoCard.getBoundingClientRect().height + 128));
    };

    updateRunwayHeight();

    const observer = new ResizeObserver(() => {
      updateRunwayHeight();
    });

    observer.observe(demoCard);
    window.addEventListener('resize', updateRunwayHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateRunwayHeight);
    };
  }, [isDesktopViewport, prefersReducedMotion]);

  const effectiveRawScrollProgress = prefersReducedMotion ? 1 : rawScrollProgress;
  const effectiveRecordingProgress = prefersReducedMotion
    ? 1
    : clamp(effectiveRawScrollProgress / finishThreshold, 0, 1);
  const isFinished =
    prefersReducedMotion || effectiveRawScrollProgress >= finishThreshold;
  const displayedAction = isFinished ? activeAction : 'recorded';

  useEffect(() => {
    if (isFinished) {
      return;
    }

    workspaceScrollRef.current?.scrollTo({ top: 0, left: 0 });
    editorScrollRef.current?.scrollTo({ top: 0, left: 0 });
  }, [isFinished]);

  const totalSegments = demo.segments.length;
  const segmentTimeline = isFinished
    ? totalSegments
    : effectiveRecordingProgress * totalSegments;
  const completedSegments = isFinished
    ? totalSegments
    : Math.min(totalSegments, Math.floor(segmentTimeline));
  const activeSegmentIndex =
    !isFinished && completedSegments < totalSegments ? completedSegments : -1;
  const activeFraction =
    !isFinished && activeSegmentIndex !== -1
      ? segmentTimeline - completedSegments
      : 1;
  const shouldRenderTypingRow =
    !isFinished && activeSegmentIndex !== -1 && activeFraction > 0.06;
  const displayedCount = isFinished
    ? totalSegments
    : completedSegments + (shouldRenderTypingRow ? 1 : 0);
  const timerLabel = isFinished
    ? demo.recording.finishedDuration
    : formatDuration(
        Math.round(demo.recording.totalSeconds * effectiveRecordingProgress),
      );
  const headerStatus = isFinished
    ? demo.labels.windowStatusFinished
    : demo.labels.windowStatusRecording;
  const helperText = isFinished
    ? demo.labels.helperReady
    : demo.labels.helperLocked;
  const summaryText =
    displayedAction === 'polished'
      ? demo.labels.summaryPolished
      : displayedAction === 'translated'
        ? demo.labels.summaryTranslated
        : demo.labels.summaryRecorded;

  const renderedSegments: RenderedSegment[] = demo.segments.map((segment, index) => {
    const isResolved = isFinished || index < completedSegments;
    const isTyping = index === activeSegmentIndex && shouldRenderTypingRow;

    if (!isResolved && !isTyping) {
      return {
        kind: 'placeholder',
        index,
        segment,
      };
    }

    return {
      kind: 'content',
      index,
      segment,
      text: isTyping
        ? getTypedText(segment.raw, activeFraction)
        : getPrimaryText(segment, displayedAction),
      translation:
        isFinished && displayedAction === 'translated'
          ? segment.translated
          : undefined,
      active: isTyping,
    };
  });

  const displayedWordCount = renderedSegments.reduce((count, segment) => {
    if (segment.kind !== 'content') {
      return count;
    }

    return (
      count +
      countWords(segment.text) +
      (segment.translation ? countWords(segment.translation) : 0)
    );
  }, 0);

  const activeMonitorSegment = renderedSegments.find(
    (segment): segment is Extract<RenderedSegment, { kind: 'content' }> =>
      segment.kind === 'content' && segment.active,
  );
  const lastVisibleSegment = [...renderedSegments]
    .reverse()
    .find(
      (segment): segment is Extract<RenderedSegment, { kind: 'content' }> =>
        segment.kind === 'content',
    );
  const liveMonitorText =
    activeMonitorSegment?.text ||
    lastVisibleSegment?.text ||
    getTypedText(demo.segments[0]?.raw ?? '', Math.max(effectiveRecordingProgress, 0.16));
  const railMetaItems = [
    {
      icon: <Mic size={14} />,
      label: demo.labels.source,
      value: demo.recording.inputSource,
    },
    {
      icon: <Languages size={14} />,
      label: demo.labels.language,
      value: demo.recording.languageValue,
    },
  ];

  return (
    <section className="w-full">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500 sm:text-xs sm:tracking-[0.32em]">
          {demo.eyebrow}
        </p>
        <h2
          className="mt-4 text-[clamp(2.45rem,10vw,3.3rem)] leading-[1.04] text-[#2D2D2D] dark:text-[#E0E0E0] sm:text-4xl md:text-[2.85rem]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {demo.title}
        </h2>
        <p className="mt-4 text-[1rem] font-light leading-[1.8] text-stone-500 dark:text-stone-400 sm:text-lg sm:leading-relaxed">
          {demo.desc}
        </p>
      </div>

      <div
        ref={runwayRef}
        className="relative mt-10"
        style={
          !prefersReducedMotion && isDesktopViewport && desktopRunwayHeight
            ? { minHeight: `${desktopRunwayHeight}px` }
            : undefined
        }
      >
        <div className={prefersReducedMotion ? '' : 'lg:sticky lg:top-6'}>
          <div
            ref={demoCardRef}
            className="relative mx-auto flex aspect-[16/10] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-[#d9d0c4] bg-[#f3ede3] shadow-[0_34px_95px_-58px_rgba(86,72,52,0.34)] dark:border-stone-800/90 dark:bg-[#151313] dark:shadow-[0_28px_95px_-60px_rgba(0,0,0,0.82)] sm:rounded-[32px]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.46),rgba(255,255,255,0))] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />
            <div className="pointer-events-none absolute right-8 top-8 h-28 w-28 rounded-full bg-white/35 blur-3xl dark:bg-stone-700/20" />

            <div className="shrink-0 border-b border-[#ddd3c6] bg-[#f6f1e8] px-2.5 py-2 dark:border-stone-800/90 dark:bg-[#1b1817] sm:px-4 sm:py-3">
              <div className="grid gap-2 xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)_auto] xl:items-center">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="hidden items-center gap-1.5 pt-2 sm:flex">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#d8c9ba] dark:bg-stone-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#e6ddd3] dark:bg-stone-800" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#e6ddd3] dark:bg-stone-800" />
                  </div>

                  <div className="min-w-0 text-left">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
                      {demo.appLabel}
                    </p>
                    <p className="mt-1 truncate text-[0.98rem] font-medium text-stone-800 dark:text-stone-100 sm:text-[1.05rem]">
                      {demo.fileName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto xl:justify-center">
                  <TopTab label={demo.tabs.live} icon={<Mic size={14} />} active />
                  <TopTab label={demo.tabs.batch} icon={<AudioLines size={14} />} />
                  <TopTab label={demo.tabs.workspace} icon={<FolderOpen size={14} />} />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto xl:justify-end">
                  {actionOrder.map((action) => {
                    const Icon = actionIcons[action];

                    return (
                      <ActionButton
                        key={action}
                        icon={<Icon size={14} />}
                        label={demo.actions[action]}
                        active={displayedAction === action}
                        disabled={!isFinished}
                        onClick={() => setActiveAction(action)}
                      />
                    );
                  })}

                  <StaticAction label={demo.actions.export} active={isFinished}>
                    <Download size={14} />
                  </StaticAction>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-b border-[#e3d9cc] bg-[#eee6da] px-2.5 py-1.5 text-left dark:border-stone-800/90 dark:bg-[#181514] sm:px-4 sm:py-2">
              <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
                  <ContextChip
                    label={demo.labels.workspaceLabel}
                    value={demo.labels.workspaceValue}
                  />
                  <ContextChip
                    label={demo.labels.projectLabel}
                    value={demo.labels.projectValue}
                  />
                  <ContextChip
                    label={demo.labels.sessionLabel}
                    value={demo.labels.sessionValue}
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto lg:justify-end">
                  <StatusPill icon={<Shield size={13} />} label={demo.labels.localBadge} />
                  <StatusPill icon={<Clock3 size={13} />} label={timerLabel} />
                  <StatusPill
                    icon={<CheckCircle2 size={13} />}
                    label={headerStatus}
                  />
                </div>
              </div>
            </div>

            <div
              ref={workspaceScrollRef}
              className={`grid min-h-0 flex-1 gap-2 bg-[#f7f3ea] p-2 dark:bg-[#141211] sm:gap-3 sm:p-3 lg:grid-cols-[232px_minmax(0,1fr)] ${
                isFinished
                  ? 'overflow-y-auto overscroll-contain lg:overflow-hidden'
                  : 'overflow-hidden'
              }`}
            >
              <div className="flex min-h-0 flex-col rounded-[20px] border border-[#d8cfc3] bg-[#f4eee5] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-stone-800/90 dark:bg-[#1a1716]">
                <div className="shrink-0 border-b border-[#ddd3c6] px-3 py-3 dark:border-stone-800/90 sm:px-4 sm:py-4">
                  <p className="text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
                    {demo.labels.recorderPanel}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isFinished
                          ? 'bg-emerald-500'
                          : 'animate-pulse bg-red-500'
                      }`}
                    />
                    <p className="text-[1.05rem] font-medium text-stone-800 dark:text-stone-100">
                      {isFinished ? demo.labels.finished : demo.labels.recording}
                    </p>
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:p-4">
                  <div className="flex min-h-[190px] flex-col rounded-[18px] border border-[#d7cdc0] bg-[#fbf7f0] p-3 dark:border-stone-800/90 dark:bg-[#121111] sm:min-h-[208px] sm:p-4 lg:flex-1">
                    <div className="text-left">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                        {demo.labels.waveform}
                      </p>
                    </div>

                    <div className="mt-3 flex h-18 items-end gap-1 overflow-hidden rounded-[14px] border border-[#d8cec2] bg-[#f1e8db] px-3 py-3 dark:border-stone-800/90 dark:bg-[#181514] sm:h-20 sm:py-4">
                      {waveformSeeds.map((seed, index) => {
                        const amplitude = isFinished
                          ? 0.68
                          : 0.34 +
                            effectiveRecordingProgress * 0.78 +
                            Math.abs(
                              Math.sin(
                                effectiveRecordingProgress * 7.1 + index * 0.5,
                              ),
                            ) *
                              0.12;
                        const height = Math.round(
                          12 + seed * 44 * amplitude + seed * 10,
                        );

                        return (
                          <div
                            key={index}
                            className={`w-1.5 rounded-full transition-[height,opacity] duration-150 ${
                              isFinished
                                ? 'bg-stone-400/90 dark:bg-stone-500/85'
                                : 'bg-gradient-to-t from-[#af3328] via-[#d64b3d] to-[#ef968a] dark:from-red-500 dark:via-red-400 dark:to-red-200'
                            }`}
                            style={{
                              height,
                              opacity: isFinished ? 0.76 : 0.44 + seed * 0.54,
                            }}
                          />
                        );
                      })}
                    </div>

                    <div className="mt-3 flex flex-1 flex-col">
                      <p className="line-clamp-3 text-left text-sm leading-6 text-stone-600 dark:text-stone-300">
                        {liveMonitorText || helperText}
                      </p>

                      <div className="mt-auto flex justify-end pt-3">
                        <button
                          type="button"
                          className={`flex h-12 w-12 items-center justify-center rounded-full shadow-[0_16px_32px_-20px_rgba(175,51,40,0.7)] transition-colors sm:h-14 sm:w-14 ${
                            isFinished
                              ? 'bg-emerald-500 text-white'
                              : 'bg-[#b53f31] text-white'
                          }`}
                          aria-label={headerStatus}
                        >
                          {isFinished ? (
                            <CheckCircle2 size={22} />
                          ) : (
                            <Square size={18} fill="currentColor" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 rounded-[18px] border border-[#d9d0c4] bg-[#f8f3ea] px-3 py-1.5 dark:border-stone-800/90 dark:bg-[#171514]">
                    {railMetaItems.map((item, index) => (
                      <RailMetaRow
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        value={item.value}
                        bordered={index < railMetaItems.length - 1}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex min-h-0 flex-col rounded-[20px] border border-[#d8cfc3] bg-[#fcfaf6] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] dark:border-stone-800/90 dark:bg-[#171514]">
                <div className="shrink-0 border-b border-[#ddd3c6] px-3 py-2.5 dark:border-stone-800/90 sm:px-4 sm:py-3">
                  <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
                    <div className="min-w-0 text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
                          {demo.labels.editorPanel}
                        </p>
                        <span className="inline-flex items-center rounded-full border border-[#d6ccc0] bg-[#f5efe5] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500 dark:border-stone-800/90 dark:bg-[#100f0f] dark:text-stone-300">
                          {demo.actions[displayedAction]}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-stone-500 dark:text-stone-400">
                        {helperText}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <MetaBadge
                        icon={<Search size={13} />}
                        label={demo.labels.search}
                      />
                      <MetaBadge
                        label={`${displayedWordCount} ${demo.labels.words}`}
                      />
                      <MetaBadge
                        label={`${displayedCount}/${totalSegments} ${demo.labels.segments}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:gap-3 sm:p-4">
                  <div className="shrink-0 rounded-[16px] border border-[#d7cdc0] bg-[#f6f0e4] px-3 py-2.5 dark:border-stone-800/90 dark:bg-[#121111] sm:px-4 sm:py-3">
                    <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
                      <div className="min-w-0 text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                            {demo.labels.summary}
                          </p>
                          <span className="inline-flex items-center rounded-full border border-[#d7cdc0] bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500 dark:border-stone-800/90 dark:bg-[#181615] dark:text-stone-300">
                            {demo.actions[displayedAction]}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-stone-700 dark:text-stone-200">
                          {summaryText}
                        </p>
                      </div>

                      <MetaBadge
                        icon={<CheckCircle2 size={13} />}
                        label={`${demo.labels.autosave}: ${demo.labels.autosaveState}`}
                      />
                    </div>
                  </div>

                  <div
                    ref={editorScrollRef}
                    className={`min-h-0 flex-1 ${
                      isFinished
                        ? 'overflow-visible lg:overflow-y-auto lg:overscroll-contain lg:pr-0.5'
                        : 'overflow-hidden'
                    }`}
                  >
                    <div className="space-y-2">
                      {renderedSegments.map((segment) => {
                        if (segment.kind === 'placeholder') {
                          return (
                            <PlaceholderSegment
                              key={segment.segment.time}
                              index={segment.index}
                              time={segment.segment.time}
                              label={demo.labels.segmentLabel}
                            />
                          );
                        }

                        return (
                          <SegmentRow
                            key={segment.segment.time}
                            index={segment.index}
                            time={segment.segment.time}
                            label={demo.labels.segmentLabel}
                            text={segment.text}
                            translation={segment.translation}
                            translationLabel={demo.labels.translationLabel}
                            activeLabel={demo.labels.recording}
                            active={segment.active}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-[#ddd3c6] bg-[#efe6da] px-2.5 py-2 dark:border-stone-800/90 dark:bg-[#171514] sm:px-4 sm:py-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                      isFinished
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/35 dark:text-emerald-300'
                        : 'border-[#d6cbbb] bg-[#faf5ed] text-stone-700 dark:border-stone-800/90 dark:bg-[#121111] dark:text-stone-200'
                    }`}
                  >
                    {isFinished ? <Play size={17} /> : <AudioLines size={17} />}
                  </div>

                  <div className="min-w-0 text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                      {demo.labels.player}
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-stone-800 dark:text-stone-100">
                      {demo.fileName}
                    </p>
                  </div>

                  <span className="inline-flex items-center rounded-full border border-[#d7cdc0] bg-white/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500 dark:border-stone-800/90 dark:bg-[#121111] dark:text-stone-300">
                    {isFinished
                      ? demo.labels.playerStateFinished
                      : demo.labels.playerStateRecording}
                  </span>
                </div>

                <div className="flex w-full items-center gap-3 lg:max-w-[420px]">
                  <span className="font-mono text-xs text-stone-500 dark:text-stone-400">
                    {timerLabel}
                  </span>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[#dccfbe] dark:bg-stone-800">
                    <motion.div
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        isFinished ? 'bg-emerald-500' : 'bg-[#7d6951] dark:bg-stone-100'
                      }`}
                      style={{
                        width: `${effectiveRecordingProgress * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-mono text-xs text-stone-500 dark:text-stone-400">
                    {demo.recording.finishedDuration}
                  </span>
                </div>

                <p className="hidden text-left text-[11px] leading-5 text-stone-500 dark:text-stone-400 xl:block xl:max-w-[220px] xl:text-right">
                  {demo.labels.playerHint}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TopTab({
  icon,
  label,
  active = false,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium tracking-[0.08em] sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[11px] ${
        active
          ? 'border-stone-800 bg-stone-800 text-white dark:border-stone-200 dark:bg-stone-200 dark:text-stone-900'
          : 'border-[#d8cec2] bg-[#faf6ef] text-stone-500 dark:border-stone-800/90 dark:bg-[#121111] dark:text-stone-300'
      }`}
    >
      {icon}
      {label}
    </span>
  );
}

function ActionButton({
  icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1e8] sm:min-h-9 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-[13px] dark:focus-visible:ring-stone-500/60 dark:focus-visible:ring-offset-[#1b1817] ${
        active
          ? 'border-stone-800 bg-stone-800 text-white dark:border-stone-200 dark:bg-stone-200 dark:text-stone-900'
          : 'border-[#d8cec2] bg-[#faf6ef] text-stone-600 dark:border-stone-800/90 dark:bg-[#121111] dark:text-stone-300'
      } ${
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'hover:-translate-y-0.5 hover:border-[#cfc2b2] hover:bg-white dark:hover:border-stone-700 dark:hover:bg-[#171515]'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StaticAction({
  children,
  label,
  active,
}: {
  children: ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] sm:min-h-9 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-[13px] ${
        active
          ? 'border-[#d8cec2] bg-[#faf6ef] text-stone-600 dark:border-stone-800/90 dark:bg-[#121111] dark:text-stone-300'
          : 'border-[#e0d7cc] bg-[#f7f1e7] text-stone-400 dark:border-stone-800/70 dark:bg-[#121111] dark:text-stone-500'
      }`}
    >
      {children}
      {label}
    </div>
  );
}

function StatusPill({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#d8cec2] bg-white/80 px-2 py-1 text-[10px] text-stone-500 sm:px-2.5 sm:py-1.5 sm:text-[11px] dark:border-stone-800/90 dark:bg-[#121111] dark:text-stone-300">
      <span className="text-stone-400 dark:text-stone-500">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function ContextChip({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#d8cec2] bg-white/75 px-2 py-1 text-[10px] sm:px-2.5 sm:py-1.5 sm:text-[11px] dark:border-stone-800/90 dark:bg-[#121111]">
      <span className="uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
        {label}
      </span>
      <span className="text-stone-600 dark:text-stone-200">{value}</span>
    </div>
  );
}

function RailMetaRow({
  icon,
  label,
  value,
  bordered = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  bordered?: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 py-2.5 ${
        bordered ? 'border-b border-[#e1d8cc] dark:border-stone-800/90' : ''
      }`}
    >
      <div className="flex min-w-0 items-center gap-2 text-stone-400 dark:text-stone-500">
        <span className="shrink-0">{icon}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>
      <p className="text-right text-sm text-stone-700 dark:text-stone-200">{value}</p>
    </div>
  );
}

function MetaBadge({
  icon,
  label,
}: {
  icon?: ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#d8cec2] bg-[#faf6ef] px-2.5 py-1 text-[10px] text-stone-500 sm:gap-1.5 sm:text-[11px] dark:border-stone-800/90 dark:bg-[#121111] dark:text-stone-300">
      {icon ? <span className="text-stone-400 dark:text-stone-500">{icon}</span> : null}
      {label}
    </span>
  );
}

function SegmentRow({
  index,
  time,
  label,
  text,
  translation,
  translationLabel,
  activeLabel,
  active,
}: {
  index: number;
  time: string;
  label: string;
  text: string;
  translation?: string;
  translationLabel: string;
  activeLabel: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-[16px] border px-3 py-3 transition-all duration-200 sm:px-3.5 ${
        active
          ? 'border-stone-800 bg-[#f7f1e7] shadow-[0_18px_38px_-28px_rgba(56,44,30,0.45)] dark:border-stone-300 dark:bg-[#100f0f]'
          : 'border-[#ddd2c6] bg-[#faf7f1] dark:border-stone-800/90 dark:bg-[#121111]'
      }`}
    >
      <div className="grid gap-2.5 md:grid-cols-[78px_minmax(0,1fr)]">
        <div className="space-y-1.5 text-left">
          <span className="inline-flex w-fit items-center rounded-full border border-[#d7cdc0] bg-white/85 px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] text-stone-500 dark:border-stone-800/90 dark:bg-[#181615] dark:text-stone-300 sm:text-[11px]">
            {time}
          </span>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
            {label} {String(index + 1).padStart(2, '0')}
          </p>
          {active ? (
            <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-600 dark:border-red-900/70 dark:bg-red-950/35 dark:text-red-300">
              {activeLabel}
            </span>
          ) : null}
        </div>

        <div className="min-w-0 text-left">
          <p className="text-[0.93rem] leading-6 text-stone-700 dark:text-stone-200">
            {text}
            {active ? (
              <span className="ml-1 inline-block animate-pulse text-stone-400 dark:text-stone-500">
                |
              </span>
            ) : null}
          </p>

          {translation ? (
            <div className="mt-2.5 border-l border-[#dad0c4] pl-2.5 dark:border-stone-700">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                {translationLabel}
              </p>
              <p className="mt-1 text-[0.92rem] leading-6 text-stone-500 dark:text-stone-300">
                {translation}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PlaceholderSegment({
  index,
  time,
  label,
}: {
  index: number;
  time: string;
  label: string;
}) {
  return (
    <div className="rounded-[16px] border border-dashed border-[#ddd3c6] bg-[#f7f2ea] px-3 py-3 dark:border-stone-800/90 dark:bg-[#11100f] sm:px-3.5">
      <div className="grid gap-2.5 md:grid-cols-[78px_minmax(0,1fr)]">
        <div className="space-y-1.5 text-left">
          <span className="inline-flex w-fit items-center rounded-full border border-[#e2d8cc] bg-white/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] text-stone-300 dark:border-stone-800/90 dark:bg-[#171515] dark:text-stone-600 sm:text-[11px]">
            {time}
          </span>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-300 dark:text-stone-600">
            {label} {String(index + 1).padStart(2, '0')}
          </p>
        </div>

        <div className="space-y-2 pt-0.5">
          <div className="h-3 rounded-full bg-[#e4dbcf] dark:bg-stone-800/90" />
          <div className="h-3 w-4/5 rounded-full bg-[#e9e0d5] dark:bg-stone-800/70" />
        </div>
      </div>
    </div>
  );
}
