'use client';

import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  Clock3,
  Languages,
  Mic,
  Shield,
  Sparkles,
} from 'lucide-react';
import type {
  DemoAction,
  DemoContent,
  DemoPanelContent,
} from '@/lib/homepage-content';

const actionOrder: DemoAction[] = ['recorded', 'polished', 'translated'];

const actionIcons = {
  recorded: Mic,
  polished: Sparkles,
  translated: Languages,
} as const;

export function TranscriptDemo({ demo }: { demo: DemoContent }) {
  const [activeAction, setActiveAction] = useState<DemoAction>('recorded');
  const activePanel = demo.panels[activeAction];

  return (
    <section className="w-full max-w-6xl mx-auto">
      <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500 sm:text-xs sm:tracking-[0.32em]">
          {demo.eyebrow}
        </p>
        <h2
          className="mt-4 text-[clamp(2.45rem,10vw,3.2rem)] leading-[1.04] text-[#2D2D2D] dark:text-[#E0E0E0] sm:text-4xl md:text-[2.8rem]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {demo.title}
        </h2>
        <p className="mt-4 text-[1rem] font-light leading-[1.8] text-stone-500 dark:text-stone-400 sm:text-lg sm:leading-relaxed">
          {demo.desc}
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-stone-200/80 bg-white/75 shadow-[0_32px_110px_-58px_rgba(87,83,78,0.55)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-stone-900/75 dark:shadow-[0_28px_90px_-52px_rgba(0,0,0,0.72)] sm:rounded-[32px]">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-20 bg-gradient-to-r from-transparent via-stone-200/70 to-transparent blur-3xl dark:via-stone-700/40 sm:inset-x-12 sm:h-24" />
        <div className="pointer-events-none absolute -right-12 top-14 h-32 w-32 rounded-full bg-stone-200/70 blur-3xl dark:bg-stone-700/30 sm:-right-16 sm:top-16 sm:h-40 sm:w-40" />

        <div className="border-b border-stone-200/80 px-4 py-4 dark:border-stone-800/80 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-1.5 pt-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-stone-200 dark:bg-stone-800" />
                <span className="h-2.5 w-2.5 rounded-full bg-stone-200 dark:bg-stone-800" />
              </div>

              <div className="min-w-0 space-y-1 text-left">
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500 sm:tracking-[0.28em]">
                  {demo.appLabel}
                </p>
                <p className="break-words text-[0.95rem] font-medium text-stone-800 dark:text-stone-100 sm:text-lg">
                  {demo.fileName}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusPill
                icon={<CheckCircle2 size={14} />}
                label={demo.status}
              />
              <StatusPill icon={<Clock3 size={14} />} label={demo.duration} />
              <StatusPill icon={<Shield size={14} />} label={demo.localBadge} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-3 sm:gap-6 sm:p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.88fr)]">
          <div className="rounded-[24px] border border-stone-200/80 bg-stone-50/75 p-3.5 dark:border-stone-800/80 dark:bg-[#171717] sm:rounded-[28px] sm:p-5">
            <div className="border-b border-stone-200/70 pb-4 dark:border-stone-800/70">
              <div className="text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500 sm:text-xs sm:tracking-[0.28em]">
                  {demo.transcriptLabel}
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-500 dark:text-stone-400">
                  {demo.transcriptHint}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 sm:space-y-3">
              {demo.segments.map((segment, index) => (
                <motion.div
                  key={`${segment.time}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, delay: index * 0.04 }}
                  className="flex flex-col gap-2 rounded-[20px] border border-stone-200/80 bg-white/80 px-3 py-3 dark:border-stone-800/80 dark:bg-stone-900/70 sm:flex-row sm:items-start sm:gap-3 sm:rounded-[22px] sm:px-4 sm:py-3.5"
                >
                  <span className="w-fit shrink-0 rounded-full border border-stone-200 bg-stone-100/80 px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] text-stone-500 dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-300 sm:text-[11px] sm:tracking-[0.18em]">
                    {segment.time}
                  </span>
                  <p className="text-[0.96rem] leading-7 text-stone-700 dark:text-stone-200 sm:text-[0.95rem]">
                    {segment.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-stone-200/80 bg-white/80 p-3.5 dark:border-stone-800/80 dark:bg-[#151515] sm:rounded-[28px] sm:p-5">
            <div className="flex flex-wrap gap-2">
              {actionOrder.map((action) => {
                const Icon = actionIcons[action];
                const isActive = activeAction === action;

                return (
                  <button
                    key={action}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveAction(action)}
                    className={`inline-flex min-h-11 grow items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-stone-500/60 dark:focus-visible:ring-offset-[#151515] sm:min-h-0 sm:grow-0 ${
                      isActive
                        ? 'border-stone-800 bg-stone-800 text-white dark:border-stone-200 dark:bg-stone-200 dark:text-stone-900'
                        : 'border-stone-200 bg-stone-50/80 text-stone-600 hover:border-stone-300 hover:bg-white dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-300 dark:hover:border-stone-700 dark:hover:bg-stone-900'
                    }`}
                  >
                    <Icon size={15} />
                    {demo.controls[action]}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 min-h-[280px] rounded-[22px] border border-stone-200/80 bg-stone-50/70 p-4 dark:border-stone-800/80 dark:bg-stone-900/50 sm:min-h-[340px] sm:rounded-[24px] sm:p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAction}
                  initial={{ opacity: 0, x: 12, y: 6 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: -12, y: -6 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="h-full"
                >
                  <PanelContent panel={activePanel} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PanelContent({ panel }: { panel: DemoPanelContent }) {
  return (
    <div className="flex h-full flex-col text-left">
      <span className="inline-flex w-fit items-center rounded-full border border-stone-200/80 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400 dark:border-stone-800/80 dark:bg-stone-950/60 dark:text-stone-500 sm:tracking-[0.24em]">
        {panel.badge}
      </span>

      <h3
        className="mt-4 text-[2rem] leading-tight text-stone-800 dark:text-stone-100 sm:text-2xl"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {panel.title}
      </h3>

      <div className="mt-4 space-y-4">
        {panel.paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="text-[0.96rem] leading-7 text-stone-600 dark:text-stone-300 sm:text-[0.95rem]"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        {panel.highlights.map((highlight) => (
          <div
            key={highlight}
            className="rounded-[18px] border border-stone-200/80 dark:border-stone-800/80 bg-white/85 dark:bg-stone-950/55 px-3 py-3 text-sm text-stone-600 dark:text-stone-300"
          >
            {highlight}
          </div>
        ))}
      </div>

      <p className="mt-auto pt-6 text-sm leading-7 text-stone-500 dark:text-stone-400">
        {panel.note}
      </p>
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
