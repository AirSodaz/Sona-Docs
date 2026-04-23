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
  CheckCircle2,
  Clock3,
  Download,
  Languages,
  Mic,
  Pause,
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
const finishThreshold = 0.88;
const waveformSeeds = Array.from({ length: 28 }, (_, index) =>
  0.24 + (((Math.sin(index * 1.7) + 1) / 2) * 0.72),
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

export function TranscriptDemo({ demo }: { demo: DemoContent }) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const demoCardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeAction, setActiveAction] = useState<DemoAction>('recorded');
  const [rawScrollProgress, setRawScrollProgress] = useState(0);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const [desktopRunwayHeight, setDesktopRunwayHeight] = useState<number | null>(
    null,
  );

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start 65%', 'end end'],
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
  // Leave a short click window before the sticky card releases.
  const effectiveRecordingProgress = prefersReducedMotion
    ? 1
    : clamp(effectiveRawScrollProgress / finishThreshold, 0, 1);
  const isFinished =
    prefersReducedMotion || effectiveRawScrollProgress >= finishThreshold;
  const displayedAction = isFinished ? activeAction : 'recorded';
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
            className="relative mx-auto max-w-6xl overflow-hidden rounded-[30px] border border-stone-200/80 bg-white/82 shadow-[0_36px_120px_-62px_rgba(87,83,78,0.6)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-stone-900/82 dark:shadow-[0_32px_110px_-58px_rgba(0,0,0,0.78)] sm:rounded-[34px]"
          >
            <div className="pointer-events-none absolute inset-x-10 top-0 h-20 bg-gradient-to-r from-transparent via-stone-200/70 to-transparent blur-3xl dark:via-stone-700/35" />
            <div className="pointer-events-none absolute -right-16 top-20 h-36 w-36 rounded-full bg-stone-200/60 blur-3xl dark:bg-stone-700/20" />

            <div className="border-b border-stone-200/80 px-4 py-4 dark:border-stone-800/80 sm:px-6 sm:py-5">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,260px)_minmax(0,1fr)_auto] xl:items-center">
                <div className="flex items-start gap-3">
                  <div className="hidden items-center gap-1.5 pt-1.5 sm:flex">
                    <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-stone-200 dark:bg-stone-800" />
                    <span className="h-2.5 w-2.5 rounded-full bg-stone-200 dark:bg-stone-800" />
                  </div>

                  <div className="min-w-0 text-left">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500 sm:tracking-[0.28em]">
                      {demo.appLabel}
                    </p>
                    <p className="mt-1 break-words text-[0.96rem] font-medium text-stone-800 dark:text-stone-100 sm:text-lg">
                      {demo.fileName}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 xl:justify-center">
                  <TopTab label={demo.tabs.live} active />
                  <TopTab label={demo.tabs.batch} />
                  <TopTab label={demo.tabs.history} />
                </div>

                <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                  {actionOrder.map((action) => {
                    const Icon = actionIcons[action];

                    return (
                      <ActionButton
                        key={action}
                        icon={<Icon size={15} />}
                        label={demo.actions[action]}
                        active={displayedAction === action}
                        disabled={!isFinished}
                        onClick={() => setActiveAction(action)}
                      />
                    );
                  })}

                  <StaticAction label={demo.actions.export} active={isFinished}>
                    <Download size={15} />
                  </StaticAction>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatusPill
                  icon={<CheckCircle2 size={14} />}
                  label={headerStatus}
                />
                <StatusPill icon={<Clock3 size={14} />} label={timerLabel} />
                <StatusPill
                  icon={<Shield size={14} />}
                  label={demo.labels.localBadge}
                />
              </div>
            </div>

            <div className="grid gap-4 p-3 sm:gap-6 sm:p-6 xl:grid-cols-[320px_minmax(0,1fr)]">
              <div className="rounded-[24px] border border-stone-200/80 bg-stone-50/85 p-4 dark:border-stone-800/80 dark:bg-[#171717] sm:rounded-[28px] sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500 sm:text-xs sm:tracking-[0.28em]">
                      {demo.labels.recorderPanel}
                    </p>
                    <p className="mt-2 text-[1.25rem] font-medium text-stone-800 dark:text-stone-100">
                      {isFinished
                        ? demo.labels.finished
                        : demo.labels.recording}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                      isFinished
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/35 dark:text-red-300'
                    }`}
                  >
                    {headerStatus}
                  </span>
                </div>

                <div className="mt-5 rounded-[22px] border border-stone-200/80 bg-white/80 p-4 dark:border-stone-800/80 dark:bg-stone-950/55">
                  <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                    <span>{demo.labels.waveform}</span>
                    <span className="font-mono text-stone-500 dark:text-stone-300">
                      {timerLabel}
                    </span>
                  </div>

                  <div className="mt-4 flex h-28 items-end gap-1.5 overflow-hidden rounded-[18px] border border-stone-200/80 bg-stone-50/90 px-3 py-4 dark:border-stone-800/80 dark:bg-stone-900/70">
                    {waveformSeeds.map((seed, index) => {
                      const amplitude = isFinished
                        ? 0.68
                        : 0.36 +
                          effectiveRecordingProgress * 0.74 +
                          Math.abs(
                            Math.sin(
                              effectiveRecordingProgress * 7.2 + index * 0.52,
                            ),
                          ) *
                            0.12;
                      const height = Math.round(
                        14 + seed * 52 * amplitude + seed * 12,
                      );

                      return (
                        <div
                          key={index}
                          className={`w-1.5 rounded-full transition-[height,opacity] duration-150 ${
                            isFinished
                              ? 'bg-stone-400/90 dark:bg-stone-500/80'
                              : 'bg-gradient-to-t from-red-500 via-red-400 to-red-300 dark:from-red-500 dark:via-red-400 dark:to-red-200'
                          }`}
                          style={{
                            height,
                            opacity: isFinished
                              ? 0.72
                              : 0.42 + seed * 0.58,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm dark:border-stone-800 dark:bg-stone-950/70 dark:text-stone-300">
                    <Pause size={18} />
                  </div>
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full shadow-[0_12px_32px_-18px_rgba(239,68,68,0.85)] ${
                      isFinished
                        ? 'bg-emerald-500 text-white dark:bg-emerald-500'
                        : 'bg-red-500 text-white dark:bg-red-500'
                    }`}
                  >
                    {isFinished ? (
                      <CheckCircle2 size={26} />
                    ) : (
                      <Square size={22} fill="currentColor" />
                    )}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <InfoRow
                    label={demo.labels.source}
                    value={demo.recording.inputSource}
                    icon={<Mic size={14} />}
                  />
                  <InfoRow
                    label={demo.labels.language}
                    value={demo.recording.languageValue}
                  />
                  <InfoRow
                    label={demo.labels.liveCaption}
                    value={
                      isFinished
                        ? demo.labels.finished
                        : demo.labels.recording
                    }
                  />
                </div>
              </div>

              <div className="rounded-[24px] border border-stone-200/80 bg-white/85 p-4 dark:border-stone-800/80 dark:bg-[#151515] sm:rounded-[28px] sm:p-5">
                <div className="flex flex-col gap-3 border-b border-stone-200/80 pb-4 dark:border-stone-800/80 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0 text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500 sm:text-xs sm:tracking-[0.28em]">
                      {demo.labels.editorPanel}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-stone-500 dark:text-stone-400 sm:text-[0.95rem]">
                      {helperText}
                    </p>
                  </div>

                  <div className="inline-flex shrink-0 items-center rounded-full border border-stone-200/80 bg-stone-50/85 px-3 py-1.5 text-[11px] font-medium tracking-[0.08em] text-stone-500 dark:border-stone-800/80 dark:bg-stone-950/55 dark:text-stone-300">
                    {displayedCount}/{totalSegments} {demo.labels.segments}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {demo.segments.map((segment, index) => {
                    const isResolved = isFinished || index < completedSegments;
                    const isTyping =
                      index === activeSegmentIndex && shouldRenderTypingRow;

                    if (!isResolved && !isTyping) {
                      return (
                        <PlaceholderSegment
                          key={segment.time}
                          time={segment.time}
                        />
                      );
                    }

                    const primaryText = isTyping
                      ? getTypedText(segment.raw, activeFraction)
                      : getPrimaryText(segment, displayedAction);

                    return (
                      <SegmentRow
                        key={segment.time}
                        time={segment.time}
                        text={primaryText}
                        translation={
                          isFinished && displayedAction === 'translated'
                            ? segment.translated
                            : undefined
                        }
                        active={isTyping}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-stone-200/80 px-4 py-3 dark:border-stone-800/80 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                  {isFinished ? demo.labels.finished : demo.labels.recording}
                </span>
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
                  <motion.div
                    className={`absolute inset-y-0 left-0 rounded-full ${
                      isFinished ? 'bg-emerald-500' : 'bg-stone-800 dark:bg-stone-100'
                    }`}
                    style={{
                      width: `${effectiveRecordingProgress * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TopTab({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-medium tracking-[0.08em] ${
        active
          ? 'border-stone-800 bg-stone-800 text-white dark:border-stone-200 dark:bg-stone-200 dark:text-stone-900'
          : 'border-stone-200 bg-stone-50/80 text-stone-500 dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-300'
      }`}
    >
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
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-stone-500/60 dark:focus-visible:ring-offset-stone-900 ${
        active
          ? 'border-stone-800 bg-stone-800 text-white dark:border-stone-200 dark:bg-stone-200 dark:text-stone-900'
          : 'border-stone-200 bg-stone-50/80 text-stone-600 dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-300'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white dark:hover:border-stone-700 dark:hover:bg-stone-900'}`}
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
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm ${
        active
          ? 'border-stone-200 bg-stone-50/80 text-stone-600 dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-300'
          : 'border-stone-200 bg-stone-50/70 text-stone-400 dark:border-stone-800 dark:bg-stone-900/40 dark:text-stone-500'
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
    <div className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-white/85 px-2.5 py-1.5 text-[11px] text-stone-500 dark:border-stone-800/80 dark:bg-stone-950/55 dark:text-stone-300 sm:gap-2 sm:px-3 sm:text-xs">
      <span className="text-stone-400 dark:text-stone-500">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[18px] border border-stone-200/80 bg-white/80 px-3.5 py-3 dark:border-stone-800/80 dark:bg-stone-950/55">
      <div className="flex min-w-0 items-center gap-2">
        {icon ? (
          <span className="text-stone-400 dark:text-stone-500">{icon}</span>
        ) : null}
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
          {label}
        </span>
      </div>
      <span className="text-sm text-stone-700 dark:text-stone-200">{value}</span>
    </div>
  );
}

function SegmentRow({
  time,
  text,
  translation,
  active,
}: {
  time: string;
  text: string;
  translation?: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-[22px] border px-3.5 py-3.5 transition-all duration-200 sm:px-4 ${
        active
          ? 'border-stone-800 bg-stone-50 shadow-[0_18px_40px_-28px_rgba(41,37,36,0.55)] dark:border-stone-300 dark:bg-stone-900'
          : 'border-stone-200/80 bg-stone-50/80 dark:border-stone-800/80 dark:bg-stone-900/60'
      }`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
        <span className="w-fit shrink-0 rounded-full border border-stone-200 bg-white/90 px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] text-stone-500 dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-300 sm:text-[11px] sm:tracking-[0.18em]">
          {time}
        </span>

        <div className="min-w-0 flex-1 text-left">
          <p className="text-[0.96rem] leading-7 text-stone-700 dark:text-stone-200 sm:text-[0.95rem]">
            {text}
            {active ? (
              <span className="ml-1 inline-block animate-pulse text-stone-400 dark:text-stone-500">
                |
              </span>
            ) : null}
          </p>

          {translation ? (
            <p className="mt-2 border-l border-stone-200 pl-3 text-[0.94rem] leading-7 text-stone-500 dark:border-stone-700 dark:text-stone-300">
              {translation}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PlaceholderSegment({ time }: { time: string }) {
  return (
    <div className="rounded-[22px] border border-dashed border-stone-200/80 bg-stone-50/45 px-3.5 py-3.5 dark:border-stone-800/80 dark:bg-stone-900/35 sm:px-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
        <span className="w-fit shrink-0 rounded-full border border-stone-200/70 bg-white/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] text-stone-300 dark:border-stone-800 dark:bg-stone-950/50 dark:text-stone-600 sm:text-[11px] sm:tracking-[0.18em]">
          {time}
        </span>

        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 rounded-full bg-stone-200/80 dark:bg-stone-800/90" />
          <div className="h-3 w-4/5 rounded-full bg-stone-200/65 dark:bg-stone-800/65" />
        </div>
      </div>
    </div>
  );
}
