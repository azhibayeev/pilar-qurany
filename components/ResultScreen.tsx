"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Brand from "@/components/Brand";
import PetaMap from "@/components/PetaMap";
import { PETA, RESULTS, RESULT_PATRON } from "@/content/quiz";
import { buildPeta } from "@/lib/quiz/peta";
import { investorLevel } from "@/lib/quiz/investor";
import type { QuizAnswers, ScoreResult } from "@/lib/quiz/types";

const rise = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.45, ease: [0.22, 0.61, 0.36, 1] as const },
  }),
};

// Балл и тир пользователю НЕ показываются — только текст модели, CTA и Peta.
export default function ResultScreen({
  result,
  answers,
}: {
  result: ScoreResult;
  answers: QuizAnswers;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const r = RESULTS[result.tier];
  const peta = buildPeta(answers);

  // Сильный лид (высокий/средний инвест-потенциал) → разговор о поддержке Qurany,
  // а не «ежемесячный отчёт». Слабый → прежний мягкий финал.
  const patron = investorLevel(answers, result.tier) !== "low";
  const family = result.flags.ctaVariant === "family";
  const body = patron ? RESULT_PATRON.body : r.body;
  const cta = patron
    ? family
      ? RESULT_PATRON.ctaFamily
      : RESULT_PATRON.cta
    : family && r.ctaFamily
      ? r.ctaFamily
      : r.cta;
  const confirmText = patron
    ? RESULT_PATRON.confirm
    : "Baik. Kami akan menghubungi Bapak/Ibu lewat WhatsApp satu kali.";

  return (
    <div className="relative min-h-dvh">
      {/* Фоновый герой сверху — мягко растворяется в фоне, чтобы текст читался. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-80 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero.webp" alt="" className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/75 to-bg" />
      </div>

      <div className="relative mx-auto max-w-xl px-6 pb-20 pt-10">
        <h1 className="sr-only">Hasil analisis</h1>
      <motion.div custom={0} variants={rise} initial="hidden" animate="show">
        <Brand wordmark className="mb-8" />
      </motion.div>

      {result.flags.docsFirst && (
        <motion.p
          custom={1}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mb-6 border-l-2 border-accent pl-4 font-medium leading-snug"
        >
          {/* TODO(review): формулировку блока документов уточнит копирайтер */}
          Mulai dari yang bisa diperiksa — dokumen, bukan janji.
        </motion.p>
      )}

      <motion.div
        custom={2}
        variants={rise}
        initial="hidden"
        animate="show"
        className="whitespace-pre-line text-[1.05rem] leading-relaxed"
      >
        {body}
      </motion.div>

      <motion.div custom={3} variants={rise} initial="hidden" animate="show">
        {!confirmed ? (
          <motion.button
            onClick={() => setConfirmed(true)}
            whileTap={{ scale: 0.98 }}
            className="mt-9 min-h-14 w-full rounded-xl bg-accent px-6 text-lg font-medium text-white shadow-btn transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            {cta}
          </motion.button>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-9 rounded-xl border border-line bg-white px-5 py-4 leading-relaxed shadow-soft"
          >
            {confirmText}
          </motion.p>
        )}
      </motion.div>

      <motion.div custom={4} variants={rise} initial="hidden" animate="show">
        <PetaMap peta={peta} />
      </motion.div>

      <motion.button
        custom={5}
        variants={rise}
        initial="hidden"
        animate="show"
        onClick={() => window.print()}
        whileTap={{ scale: 0.98 }}
        className="mt-6 min-h-12 w-full rounded-xl border border-accent px-6 font-medium text-accent transition-colors hover:bg-accent/5"
      >
        {PETA.downloadPdf}
      </motion.button>
      <p className="mt-3 text-sm text-muted">Dokumen yang sama kami kirim ke WhatsApp.</p>
      </div>
    </div>
  );
}
