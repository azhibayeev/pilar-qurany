"use client";

import { motion } from "motion/react";
import InterstitialVisual from "@/components/InterstitialVisual";
import { INTERSTITIAL } from "@/content/quiz";
import type { Insight } from "@/lib/quiz/types";

// Промежуточный (interstitial) экран между вопросами — приём удержания:
// разбивает поток вопросов, повышает ценность результата и вовлечённость.
// Показывает превью «Peta Amal Jariyah», которую человек получит в конце.
const fade = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.4, ease: [0.22, 0.61, 0.36, 1] as const },
  }),
};

export default function InsightScreen({
  insight,
  onNext,
}: {
  insight: Insight;
  onNext: () => void;
  onBack: () => void;
}) {
  const extra = INTERSTITIAL[insight.id as "A" | "B" | "C" | "D"] ?? INTERSTITIAL.A;

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.75rem)] max-w-xl flex-col px-6 pb-24 pt-8">
      <motion.span
        custom={0}
        variants={fade}
        initial="hidden"
        animate="show"
        className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {extra.eyebrow}
      </motion.span>

      <motion.h2
        custom={1}
        variants={fade}
        initial="hidden"
        animate="show"
        className="mt-4 text-2xl font-semibold leading-snug tracking-tight"
      >
        {insight.heading}
      </motion.h2>

      <motion.div
        custom={2}
        variants={fade}
        initial="hidden"
        animate="show"
        className="mt-4 whitespace-pre-line leading-relaxed text-quote"
      >
        {insight.body}
      </motion.div>

      <motion.div custom={3} variants={fade} initial="hidden" animate="show">
        <InterstitialVisual variant={extra.visual} />
      </motion.div>

      <motion.p
        custom={4}
        variants={fade}
        initial="hidden"
        animate="show"
        className="mt-5 text-center text-sm text-muted"
      >
        {extra.note}
      </motion.p>

      <div className="flex-1" />

      <motion.button
        custom={5}
        variants={fade}
        initial="hidden"
        animate="show"
        onClick={onNext}
        whileTap={{ scale: 0.98 }}
        className="mt-8 min-h-14 w-full rounded-xl bg-accent px-6 text-lg font-medium text-white shadow-btn transition-colors hover:bg-[var(--color-accent-hover)]"
      >
        {insight.button}
      </motion.button>
    </div>
  );
}
