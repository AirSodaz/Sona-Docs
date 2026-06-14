'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'motion/react';
import {
  Bell,
  Bold,
  BookOpen,
  BookOpenText,
  CornerDownLeft,
  Download,
  FileText,
  Folder,
  History,
  Italic,
  Languages,
  Merge,
  Mic,
  Pause,
  Pencil,
  Play,
  Redo2,
  Settings,
  Sparkles,
  Square,
  Trash2,
  Type,
  Underline,
  Undo2,
  Users,
  Volume2,
  X,
} from 'lucide-react';
import type {
  DemoContent,
  DemoSegment,
  DemoStageId,
  HomeLocale,
} from '@/lib/homepage-content';
import {
  getDisplayTypography,
  getEyebrowTypography,
} from '@/lib/locale-typography';
import { Logo } from '@/components/Logo';

const stageTransition = {
  duration: 0.48,
  ease: [0.22, 1, 0.36, 1] as const,
};
const AUTO_ADVANCE_DELAY_MS = 2200;

function getLivePreview(text: string) {
  const previewLength = Math.max(18, Math.floor(text.length * 0.7));

  return `${text.slice(0, previewLength).trimEnd()}...`;
}

export function TranscriptDemo({
  demo,
  locale,
}: {
  demo: DemoContent;
  locale: HomeLocale;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;

  const liveStage = demo.stages.find((stage) => stage.id === 'live') ?? demo.stages[0];
  const refinedStage =
    demo.stages.find((stage) => stage.id === 'refined') ?? demo.stages[demo.stages.length - 1];
  const [activeStage, setActiveStage] = useState<DemoStageId>(() =>
    prefersReducedMotion ? refinedStage.id : liveStage.id,
  );
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [hasManualSelection, setHasManualSelection] = useState(false);
  const displayedStage = prefersReducedMotion && !hasManualSelection ? refinedStage.id : activeStage;
  const currentStage =
    demo.stages.find((stage) => stage.id === displayedStage) ?? demo.stages[0];
  const activeDuration =
    displayedStage === 'live' ? demo.recording.liveDuration : demo.recording.finalDuration;
  const activeCurrentTime =
    displayedStage === 'live'
      ? demo.recording.liveCurrentTime
      : demo.recording.finalCurrentTime;
  const progressWidth =
    displayedStage === 'live' ? `${demo.recording?.liveProgress ?? 0}%` : '100%';
  const isRefined = displayedStage === 'refined';
  const titleTypography = getDisplayTypography(locale, 'section');
  const eyebrowTypography = getEyebrowTypography(locale);
  const stageEyebrowTypography = getEyebrowTypography(
    locale,
    'tracking-[0.32em]',
  );

  useEffect(() => {
    if (prefersReducedMotion || hasManualSelection || !hasEnteredViewport) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveStage(refinedStage.id);
    }, AUTO_ADVANCE_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    hasEnteredViewport,
    hasManualSelection,
    liveStage.id,
    prefersReducedMotion,
    refinedStage.id,
  ]);

  return (
    <motion.section
      ref={sectionRef}
      className="relative w-full"
      onViewportEnter={() => setHasEnteredViewport(true)}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-end lg:gap-10 xl:gap-14">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className={`text-[11px] font-semibold uppercase text-[#787774] dark:text-[#9b9a97] sm:text-xs ${eyebrowTypography.className}`}>
            {demo.eyebrow}
          </p>
          <h2
            className={`mt-4 text-[#37352f] dark:text-[#f1f1ef] ${titleTypography.className}`}
            style={titleTypography.style}
          >
            {demo.title}
          </h2>
          <p className="mt-5 max-w-xl text-[1rem] font-light leading-[1.85] text-[#787774] dark:text-[#b8b8b2] sm:text-lg">
            {demo.desc}
          </p>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 border-y border-black/8 py-5 dark:border-white/10">
            {demo.workflowSteps.map((step, index) => (
              <span
                key={step}
                className="inline-flex items-center gap-2 text-sm leading-6 text-[#37352f] dark:text-[#efe8df]"
              >
                <span className="font-mono text-[10px] tracking-[0.22em] text-[#9b9a97]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {step}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="lg:justify-self-end"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        >
          <StageTabs
            demo={demo}
            currentStage={currentStage}
            eyebrowClassName={stageEyebrowTypography.className}
            activeStage={displayedStage}
            setActiveStage={(stage) => {
              setHasManualSelection(true);
              setActiveStage(stage);
            }}
          />
        </motion.div>
      </div>

      <motion.div
        className="relative mt-10 sm:mt-12 lg:mt-14"
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.24 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        <div className="pointer-events-none absolute inset-x-5 -bottom-8 h-16 bg-black/45 blur-3xl" />
        <div className="relative overflow-hidden rounded-[18px] border border-black/12 bg-[#fbfbfa] text-[#37352f] shadow-[0_42px_140px_-74px_rgba(0,0,0,0.92)] sm:rounded-[20px]">
          <SonaAppHeader demo={demo} />

          <div className="grid h-[820px] min-h-0 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] bg-[#fbfbfa] lg:h-[720px] lg:grid-cols-[350px_minmax(0,1fr)] lg:grid-rows-none">
            <InputPanel demo={demo} isRefined={isRefined} activeDuration={activeDuration} />

            <main className="flex min-h-0 min-w-0 flex-col border-l-0 border-black/8 bg-[#fbfbfa] lg:border-l">
              <WorkbenchHeader demo={demo} isRefined={isRefined} />

              <div className="relative min-h-0 flex-1 overflow-hidden bg-[#fbfbfa]">
                <AnimatePresence initial={false}>
                  {isRefined ? (
                    <EditorToolbarMock demo={demo} prefersReducedMotion={prefersReducedMotion} />
                  ) : null}
                </AnimatePresence>

                <div className="h-full overflow-hidden px-2 pb-14 pt-14 sm:px-4 lg:px-6">
                  <div className="mx-auto max-w-[900px] space-y-1">
                    <SpeakerBadge demo={demo} />
                    {demo.segments.map((segment, index) => (
                      <TranscriptRow
                        key={segment.time}
                        segment={segment}
                        isActiveCapture={
                          displayedStage === 'live' && index === demo.segments.length - 1
                        }
                        isActive={index === 1}
                        isRefined={isRefined}
                        translationLabel={demo.translationLabel}
                        segmentActions={demo.segmentActions}
                        prefersReducedMotion={prefersReducedMotion}
                      />
                    ))}
                  </div>
                </div>

                <div className="pointer-events-none absolute bottom-4 right-5 rounded-full border border-black/8 bg-white px-2.5 py-1 font-mono text-[11px] font-medium text-[#787774] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  {demo.shell.editor.wordCount}
                </div>
              </div>

              <AudioPlayerMock
                demo={demo}
                progressWidth={progressWidth}
                currentTime={activeCurrentTime}
                activeDuration={activeDuration}
                prefersReducedMotion={prefersReducedMotion}
              />
            </main>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

function SonaAppHeader({ demo }: { demo: DemoContent }) {
  const modeItems = [
    { label: demo.shell.modes.live, icon: <Mic size={15} />, active: true },
    { label: demo.shell.modes.batch, icon: <Folder size={15} />, active: false },
    { label: demo.shell.modes.projects, icon: <BookOpen size={15} />, active: false },
  ];

  return (
    <header className="grid min-h-14 grid-cols-1 gap-3 border-b border-black/8 bg-[#f3f3f2] px-3 py-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:px-5">
      <div className="flex min-w-0 items-center gap-2 justify-self-start">
        <div className="flex items-center">
          <Logo className="h-5 w-5 rounded-md sm:h-6 sm:w-6" forceLight />
          <span
            className="-ml-1 mt-0.5 text-[1.2rem] font-serif italic tracking-tighter text-[#5c4d43] sm:text-[1.35rem]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            ona
          </span>
        </div>
      </div>

      <div
        role="tablist"
        aria-label={demo.stageLabel}
        className="inline-flex min-w-0 rounded-[12px] bg-[#e5e5e5] p-1 justify-self-start sm:justify-self-center"
      >
        {modeItems.map((item) => (
          <button
            key={item.label}
            type="button"
            role="tab"
            aria-selected={item.active}
            className={`inline-flex h-8 min-w-0 items-center justify-center gap-2 rounded-[10px] px-3 text-[13px] font-medium transition-colors sm:min-w-[112px] ${
              item.active
                ? 'bg-white text-[#37352f] shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                : 'text-[#787774]'
            }`}
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5 justify-self-start sm:justify-self-end">
        <IconButton label={demo.shell.headerActions.notifications}>
          <Bell size={15} />
        </IconButton>
        <IconButton label={demo.shell.headerActions.settings}>
          <Settings size={15} />
        </IconButton>
      </div>
    </header>
  );
}

function EditorToolbarMock({
  demo,
  prefersReducedMotion,
}: {
  demo: DemoContent;
  prefersReducedMotion: boolean;
}) {
  return (
    <motion.div
      className="absolute left-1/2 top-4 z-20 flex max-w-[calc(100%-3rem)] -translate-x-1/2 items-center gap-1.5 rounded-[16px] border border-black/8 bg-white px-2 py-1.5 shadow-[0_8px_16px_rgba(0,0,0,0.06)]"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
      transition={prefersReducedMotion ? { duration: 0 } : stageTransition}
    >
      <IconButton label={demo.shell.editor.toolbarUndo}>
        <Undo2 size={14} />
      </IconButton>
      <IconButton label={demo.shell.editor.toolbarRedo}>
        <Redo2 size={14} />
      </IconButton>
      <span className="mx-1 h-5 w-px bg-black/8" aria-hidden="true" />
      <IconButton label={demo.shell.editor.toolbarBold}>
        <Bold size={14} />
      </IconButton>
      <IconButton label={demo.shell.editor.toolbarItalic}>
        <Italic size={14} />
      </IconButton>
      <IconButton label={demo.shell.editor.toolbarUnderline}>
        <Underline size={14} />
      </IconButton>
      <span className="mx-1 h-5 w-px bg-black/8" aria-hidden="true" />
      <IconButton label={demo.shell.editor.toolbarSplit}>
        <CornerDownLeft size={14} />
      </IconButton>
    </motion.div>
  );
}

function SpeakerBadge({ demo }: { demo: DemoContent }) {
  return (
    <div className="mb-2 ml-[74px] hidden sm:block">
      <button
        type="button"
        className="inline-flex items-center rounded-full bg-[#f3f3f2] px-2.5 py-1 text-xs font-semibold text-[#787774] transition-colors hover:bg-[#e5e5e5] hover:text-[#37352f]"
      >
        {demo.shell.editor.speaker}
      </button>
    </div>
  );
}

function StageTabs({
  demo,
  currentStage,
  eyebrowClassName,
  activeStage,
  setActiveStage,
}: {
  demo: DemoContent;
  currentStage: DemoContent['stages'][number];
  eyebrowClassName: string;
  activeStage: DemoStageId;
  setActiveStage: (stage: DemoStageId) => void;
}) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = Math.max(
    0,
    demo.stages.findIndex((stage) => stage.id === activeStage),
  );
  const focusStageAt = (index: number) => {
    const nextIndex = (index + demo.stages.length) % demo.stages.length;
    const nextStage = demo.stages[nextIndex];

    if (!nextStage) {
      return;
    }

    setActiveStage(nextStage.id);
    window.requestAnimationFrame(() => {
      tabRefs.current[nextIndex]?.focus();
    });
  };

  return (
    <div className="w-full max-w-xl lg:max-w-[420px]">
      <p className={`text-[10px] font-semibold uppercase text-[#787774] dark:text-[#9b9a97] ${eyebrowClassName}`}>
        {demo.stageLabel}
      </p>
      <div
        role="tablist"
        aria-label={demo.stageLabel}
        className="mt-3 inline-flex w-full rounded-full border border-black/8 bg-white/60 p-1 shadow-[0_20px_60px_-48px_rgba(55,53,47,0.38)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.055]"
      >
        {demo.stages.map((stage, index) => {
          const isActive = stage.id === activeStage;
          const tabId = `homepage-demo-tab-${stage.id}`;

          return (
            <button
              key={stage.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="homepage-demo-stage-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveStage(stage.id)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') {
                  event.preventDefault();
                  focusStageAt(selectedIndex + 1);
                } else if (event.key === 'ArrowLeft') {
                  event.preventDefault();
                  focusStageAt(selectedIndex - 1);
                } else if (event.key === 'Home') {
                  event.preventDefault();
                  focusStageAt(0);
                } else if (event.key === 'End') {
                  event.preventDefault();
                  focusStageAt(demo.stages.length - 1);
                }
              }}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium leading-tight transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#37352f]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#ece8df] dark:focus-visible:ring-white/60 dark:focus-visible:ring-offset-[#171717] ${
                isActive
                  ? 'bg-[#37352f] text-white shadow-[0_16px_40px_-26px_rgba(55,53,47,0.58)] dark:bg-[#f1eadf] dark:text-[#201913]'
                  : 'text-[#787774] hover:bg-white/70 hover:text-[#37352f] dark:text-[#c6beb2] dark:hover:bg-white/[0.06] dark:hover:text-white'
              }`}
            >
              {stage.button}
            </button>
          );
        })}
      </div>
      <div
        id="homepage-demo-stage-panel"
        role="tabpanel"
        aria-labelledby={`homepage-demo-tab-${currentStage.id}`}
        className="mt-4 min-h-[4.5rem] border-t border-black/8 pt-4 dark:border-white/10"
      >
        <p className="text-sm leading-7 text-[#787774] dark:text-[#c9c0b4]">{currentStage.desc}</p>
      </div>
    </div>
  );
}

function InputPanel({
  demo,
  isRefined,
  activeDuration,
}: {
  demo: DemoContent;
  isRefined: boolean;
  activeDuration: string;
}) {
  return (
    <aside className="bg-[#f3f3f2] lg:flex lg:flex-col">
      <div className="flex min-h-[68px] items-center justify-between px-5 py-4">
        <h4 className="text-xs font-semibold uppercase tracking-[0.06em] text-[#787774]">
          {demo.inputTitle}
        </h4>
        <IconButton label={demo.shell.live.inputSource}>
          <Type size={15} />
        </IconButton>
      </div>

      <div className="flex flex-1 flex-col gap-5 px-4 pb-6">
        <div className="h-[120px] overflow-hidden rounded-[16px] border border-black/8 bg-[#f3f3f2] px-4 py-5">
          <Waveform isLive={!isRefined} />
        </div>

        <div className="flex flex-col items-center gap-5">
          <div className={`font-mono text-2xl ${isRefined ? 'text-[#4ea067]' : 'text-[#e03e3e]'}`}>
            {isRefined ? activeDuration : demo.shell.live.timer}
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              aria-label={demo.shell.live.pause}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-black/8 bg-[#f3f3f2] text-[#37352f] transition-colors hover:bg-[#ebebeb]"
            >
              <Pause size={22} fill="currentColor" />
            </button>
            <button
              type="button"
              aria-label={demo.shell.live.stop}
              className={`inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#e03e3e] text-white shadow-[0_4px_12px_rgba(224,62,62,0.2)] ${
                !isRefined ? 'animate-pulse' : ''
              }`}
            >
              <Square size={26} fill="currentColor" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#787774]">
            <Mic size={16} />
            <span>{demo.shell.live.microphone}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function WorkbenchHeader({ demo, isRefined }: { demo: DemoContent; isRefined: boolean }) {
  return (
    <div className="border-b border-black/8 bg-[linear-gradient(180deg,#fbfbfa_0%,#f7f7f5_100%)] px-3 py-2.5 sm:px-5">
      <div className="grid min-h-10 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:gap-3">
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#f3f3f2] text-[#787774]">
            <FileText size={16} />
          </span>
          <h3 className="min-w-0 truncate text-sm font-semibold text-[#37352f] sm:text-base">
            {demo.fileName}
          </h3>
          <IconButton label={demo.actions.rename}>
            <Pencil size={14} />
          </IconButton>
          <IconButton label={demo.actions.summary}>
            <BookOpenText size={14} />
          </IconButton>
          <IconButton label={demo.actions.speakerReview}>
            <Users size={14} />
          </IconButton>
          <IconButton label={demo.actions.versions}>
            <History size={14} />
          </IconButton>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <IconButton label={demo.actions.polish} active={isRefined}>
            <Sparkles size={15} />
          </IconButton>
          <IconButton label={demo.actions.translate} active={isRefined}>
            <Languages size={15} />
          </IconButton>
          <IconButton label={demo.actions.export} active={isRefined}>
            <Download size={15} />
          </IconButton>
          <IconButton label={demo.actions.close}>
            <X size={15} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function TranscriptRow({
  segment,
  isActiveCapture,
  isActive,
  isRefined,
  translationLabel,
  segmentActions,
  prefersReducedMotion,
}: {
  segment: DemoSegment;
  isActiveCapture: boolean;
  isActive: boolean;
  isRefined: boolean;
  translationLabel: string;
  segmentActions: DemoContent['segmentActions'];
  prefersReducedMotion: boolean;
}) {
  const primaryText = isRefined
    ? segment.refined
    : isActiveCapture
      ? getLivePreview(segment.live)
      : segment.live;

  return (
    <div className="group px-1 py-1.5 sm:px-3">
      <div className="grid gap-3 sm:grid-cols-[58px_minmax(0,1fr)_auto] sm:items-baseline sm:gap-4">
        <button
          type="button"
          className={`w-max rounded-md px-1.5 py-1 text-right font-mono text-[11px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#37352f]/20 sm:justify-self-end ${
            isActive ? 'font-medium text-[#37352f]' : 'text-[#9b9a97] sm:opacity-0 sm:group-hover:opacity-100'
          }`}
        >
          {segment.time}
        </button>

        <div className="min-w-0">
          <p
            className={`leading-[1.78] text-[#26211c] ${
              isActiveCapture
                ? 'font-sans text-[1rem] italic text-[#7a7168]'
                : 'text-[1.08rem] sm:text-[1.14rem]'
            }`}
            style={isActiveCapture ? undefined : { fontFamily: 'var(--font-serif)' }}
          >
            {primaryText}
            {isActiveCapture ? (
              <span
                className={`ml-1 inline-block text-[#c95743] ${
                  prefersReducedMotion ? '' : 'animate-pulse'
                }`}
              >
                |
              </span>
            ) : null}
          </p>

          <AnimatePresence initial={false}>
            {isRefined && segment.translation ? (
              <motion.div
                className="mt-2 border-l border-[#14784f]/25 pl-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={prefersReducedMotion ? { duration: 0 } : stageTransition}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#348264]">
                  {translationLabel}
                </p>
                <p className="mt-1 text-[0.94rem] leading-6 text-[#6d6258]">
                  {segment.translation}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="hidden items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:flex">
          <IconButton label={segmentActions.edit}>
            <Pencil size={13} />
          </IconButton>
          <IconButton label={segmentActions.merge}>
            <Merge size={13} />
          </IconButton>
          <IconButton label={segmentActions.delete}>
            <Trash2 size={13} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function AudioPlayerMock({
  demo,
  progressWidth,
  currentTime,
  activeDuration,
  prefersReducedMotion,
}: {
  demo: DemoContent;
  progressWidth: string;
  currentTime: string;
  activeDuration: string;
  prefersReducedMotion: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-black/8 bg-[#f3f3f2] px-3 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[#787774] transition-colors hover:bg-[#ebebeb] hover:text-[#37352f]"
          aria-label={demo.player.play}
        >
          <Play size={15} fill="currentColor" />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="w-[50px] shrink-0 font-mono text-xs text-[#9b9a97]">{currentTime}</span>
        <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#e5e5e5]">
          <motion.div
            className="h-full rounded-full bg-[#37352f]"
            animate={{ width: progressWidth }}
            initial={false}
            transition={prefersReducedMotion ? { duration: 0 } : stageTransition}
          />
        </div>
        <span className="w-[50px] shrink-0 text-right font-mono text-xs text-[#9b9a97]">
          {activeDuration}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs font-medium text-[#787774]">
        <button
          type="button"
          className="rounded-[10px] px-2.5 py-1.5 transition-colors hover:bg-[#ebebeb] hover:text-[#37352f]"
          aria-label={demo.player.speed}
        >
          1.0x
        </button>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] transition-colors hover:bg-[#ebebeb] hover:text-[#37352f]"
          aria-label={demo.player.volume}
        >
          <Volume2 size={14} />
        </button>
        <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-[#e5e5e5] sm:block">
          <div className="h-full w-[64%] rounded-full bg-[#37352f]" />
        </div>
      </div>
    </div>
  );
}

function IconButton({
  label,
  active = false,
  children,
}: {
  label: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] transition-colors hover:bg-[#ebebeb] hover:text-[#37352f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#37352f]/20 ${
        active ? 'bg-[#e5e5e5] text-[#37352f]' : 'text-[#787774]'
      }`}
    >
      {children}
    </button>
  );
}

function Waveform({ isLive }: { isLive: boolean }) {
  const bars = [18, 30, 22, 42, 26, 36, 50, 24, 44, 32, 54, 38, 28, 46, 34, 52, 40, 30];

  return (
    <div className="flex h-full items-end gap-1.5">
      {bars.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className={`w-1 flex-1 rounded-full ${
            isLive && index > bars.length - 5 ? 'bg-[#c95743]' : 'bg-[#b8b0a6]'
          }`}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}
