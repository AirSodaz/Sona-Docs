'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import type { DemoContent, DemoSegment, DemoStageId } from '@/lib/homepage-content';

const stageTransition = {
  duration: 0.48,
  ease: [0.22, 1, 0.36, 1] as const,
};
const AUTO_ADVANCE_DELAY_MS = 2200;

function getLivePreview(text: string) {
  const previewLength = Math.max(18, Math.floor(text.length * 0.7));

  return `${text.slice(0, previewLength).trimEnd()}…`;
}

export function TranscriptDemo({ demo }: { demo: DemoContent }) {
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
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const planeY = useTransform(scrollYProgress, [0, 0.5, 1], [52, 0, -24]);
  const planeScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.968, 1, 1.012]);
  const ambientY = useTransform(scrollYProgress, [0, 1], [34, -28]);
  const currentStage =
    demo.stages.find((stage) => stage.id === activeStage) ?? demo.stages[0];
  const activeDuration =
    activeStage === 'live' ? demo.recording.liveDuration : demo.recording.finalDuration;
  const progressWidth =
    activeStage === 'live' ? `${demo.recording.liveProgress}%` : '100%';

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
      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-400/90 dark:text-stone-500 sm:text-xs">
          {demo.eyebrow}
        </p>
        <h2
          className="mt-4 text-[clamp(2.6rem,9vw,4.1rem)] leading-[0.95] text-[#f7f3ee] dark:text-white"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {demo.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[1rem] font-light leading-[1.85] text-stone-300 sm:text-lg">
          {demo.desc}
        </p>
      </motion.div>

      <div className="relative mt-12 sm:mt-14">
        <motion.div
          className="pointer-events-none absolute inset-x-[12%] top-6 h-36 rounded-full bg-[radial-gradient(circle,rgba(214,163,126,0.26),rgba(214,163,126,0))] blur-3xl dark:bg-[radial-gradient(circle,rgba(214,163,126,0.12),rgba(214,163,126,0))]"
          style={prefersReducedMotion ? undefined : { y: ambientY }}
        />

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end xl:gap-10">
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            style={prefersReducedMotion ? undefined : { y: planeY, scale: planeScale }}
          >
            <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#e9e2d8] shadow-[0_45px_130px_-72px_rgba(0,0,0,0.85)] dark:border-white/8 dark:bg-[#14110f]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),rgba(255,255,255,0)_48%)] opacity-70 dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),rgba(255,255,255,0)_45%)] dark:opacity-100" />
              <div className="pointer-events-none absolute left-[8%] right-[8%] top-0 h-px bg-white/55 dark:bg-white/15" />

              <div className="relative border-b border-black/8 px-4 py-4 dark:border-white/8 sm:px-6 sm:py-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="inline-flex shrink-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#695e54] dark:text-stone-300 sm:text-[11px]">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        activeStage === 'live' ? 'animate-pulse bg-[#b74a37]' : 'bg-[#b74a37]'
                      }`}
                    />
                    {currentStage.status}
                  </span>

                  <div className="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full bg-[#b74a37]"
                      animate={{ width: progressWidth }}
                      initial={false}
                      transition={prefersReducedMotion ? { duration: 0 } : stageTransition}
                    />
                  </div>

                  <span className="shrink-0 font-mono text-[11px] tracking-[0.18em] text-[#74675b] dark:text-stone-400">
                    {activeDuration}
                  </span>
                </div>
              </div>

              <div className="relative px-4 pb-4 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
                <div className="relative overflow-hidden rounded-[30px] border border-black/7 bg-[#f7f2ea] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] dark:border-white/8 dark:bg-[#100f0d]">
                  <div className="border-b border-black/7 px-4 py-4 dark:border-white/8 sm:px-6 sm:py-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div className="min-w-0 text-left">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#847468] dark:text-stone-500">
                          {demo.canvasLabel}
                        </p>
                        <p className="mt-2 truncate text-[1rem] font-medium text-[#1d1814] dark:text-stone-100 sm:text-[1.08rem]">
                          {demo.fileName}
                        </p>
                      </div>

                      <p className="text-left text-[10px] font-semibold uppercase tracking-[0.24em] text-[#847468] dark:text-stone-500 sm:text-right">
                        {demo.transcriptLabel}
                      </p>
                    </div>
                  </div>

                  <div className="relative px-4 py-5 sm:px-6 sm:py-7">
                    <div
                      className={`relative transition-[padding] duration-500 ${
                        activeStage === 'refined' ? 'lg:pr-[20rem]' : ''
                      }`}
                    >
                      <div className="space-y-5">
                        {demo.segments.map((segment, index) => (
                          <SegmentLine
                            key={segment.time}
                            segment={segment}
                            isActiveCapture={
                              activeStage === 'live' && index === demo.segments.length - 1
                            }
                            isRefined={activeStage === 'refined'}
                            translationLabel={demo.translationLabel}
                          />
                        ))}
                      </div>

                      <AnimatePresence initial={false}>
                        {activeStage === 'refined' ? (
                          <motion.aside
                            key="refined-reveal"
                            className="mt-5 rounded-[24px] border border-black/7 bg-[rgba(255,255,255,0.72)] p-4 shadow-[0_24px_70px_-48px_rgba(38,24,14,0.58)] backdrop-blur-xl dark:border-white/8 dark:bg-[rgba(19,17,15,0.88)] dark:shadow-[0_24px_70px_-48px_rgba(0,0,0,0.8)] lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:w-[18rem]"
                            initial={{
                              opacity: 0,
                              x: prefersReducedMotion ? 0 : 16,
                              y: prefersReducedMotion ? 0 : 18,
                            }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            exit={{
                              opacity: 0,
                              x: prefersReducedMotion ? 0 : 16,
                              y: prefersReducedMotion ? 0 : 18,
                            }}
                            transition={prefersReducedMotion ? { duration: 0 } : stageTransition}
                          >
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8b7a6f] dark:text-stone-500">
                              {demo.reveal.eyebrow}
                            </p>
                            <h3
                              className="mt-3 text-[1.7rem] leading-[0.98] text-[#241d17] dark:text-white"
                              style={{ fontFamily: 'var(--font-serif)' }}
                            >
                              {demo.reveal.title}
                            </h3>
                            <p className="mt-4 text-sm leading-7 text-[#5e5147] dark:text-stone-300">
                              {demo.reveal.desc}
                            </p>
                            <p className="mt-4 border-t border-black/8 pt-4 text-sm leading-6 text-[#7a6d62] dark:border-white/8 dark:text-stone-400">
                              {demo.reveal.note}
                            </p>
                          </motion.aside>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mx-auto flex w-full max-w-xl flex-col gap-5 xl:max-w-[320px] xl:pb-8"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1], delay: 0.14 }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-stone-400/85 dark:text-stone-500">
              {demo.stageLabel}
            </p>

            <div
              role="tablist"
              aria-label={demo.stageLabel}
              className="inline-flex w-full rounded-full border border-white/12 bg-white/[0.04] p-1 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.75)] backdrop-blur-xl"
            >
              {demo.stages.map((stage) => {
                const isActive = stage.id === activeStage;
                const tabId = `homepage-demo-tab-${stage.id}`;

                return (
                  <button
                    key={stage.id}
                    id={tabId}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="homepage-demo-stage-panel"
                    onClick={() => {
                      setHasManualSelection(true);
                      setActiveStage(stage.id);
                    }}
                    className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#171312] ${
                      isActive
                        ? 'bg-[#f2ece4] text-[#201913] shadow-[0_16px_40px_-24px_rgba(0,0,0,0.5)]'
                        : 'text-stone-300 hover:bg-white/[0.05] hover:text-white'
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
              className="border-t border-white/10 pt-5"
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentStage.id}
                  initial={{
                    opacity: 0,
                    y: prefersReducedMotion ? 0 : 18,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: prefersReducedMotion ? 0 : 12,
                  }}
                  transition={prefersReducedMotion ? { duration: 0 } : stageTransition}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                    {currentStage.eyebrow}
                  </p>
                  <h3
                    className="mt-3 text-[2rem] leading-[0.98] text-[#f6f2ec] sm:text-[2.2rem]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {currentStage.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-stone-300 sm:text-[0.98rem]">
                    {currentStage.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function SegmentLine({
  segment,
  isActiveCapture,
  isRefined,
  translationLabel,
}: {
  segment: DemoSegment;
  isActiveCapture: boolean;
  isRefined: boolean;
  translationLabel: string;
}) {
  const primaryText = isRefined
    ? segment.refined
    : isActiveCapture
      ? getLivePreview(segment.live)
      : segment.live;

  return (
    <div className="grid gap-3 border-t border-black/7 pt-5 first:border-t-0 first:pt-0 dark:border-white/8 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-6">
      <div className="flex items-center gap-3 sm:block">
        <span className="font-mono text-[11px] tracking-[0.18em] text-[#7d6f63] dark:text-stone-500">
          {segment.time}
        </span>
        {isActiveCapture ? (
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#b74a37] shadow-[0_0_0_6px_rgba(183,74,55,0.14)] sm:mt-3 sm:flex" />
        ) : null}
      </div>

      <div className="min-w-0 text-left">
        <p className="text-[0.98rem] leading-7 text-[#271f18] dark:text-stone-200 sm:text-[1rem]">
          {primaryText}
          {isActiveCapture ? (
            <span className="ml-1 inline-block animate-pulse text-[#b74a37]">|</span>
          ) : null}
        </p>

        <AnimatePresence initial={false}>
          {isRefined && segment.translation ? (
            <motion.div
              className="mt-3 border-l border-black/8 pl-3 dark:border-white/10"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={stageTransition}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a7a6d] dark:text-stone-500">
                {translationLabel}
              </p>
              <p className="mt-1 text-[0.94rem] leading-6 text-[#706258] dark:text-stone-400">
                {segment.translation}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
