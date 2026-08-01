"use client";

import { useState } from "react";
import Brand from "@/components/Brand";
import PetaMap from "@/components/PetaMap";
import { PETA, RESULTS } from "@/content/quiz";
import { buildPeta } from "@/lib/quiz/peta";
import type { QuizAnswers, ScoreResult } from "@/lib/quiz/types";

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
  const cta = result.flags.ctaVariant === "family" && r.ctaFamily ? r.ctaFamily : r.cta;
  const peta = buildPeta(answers);

  return (
    <div className="mx-auto max-w-xl px-6 pb-20 pt-10">
      <h1 className="sr-only">Hasil analisis</h1>
      <Brand wordmark className="mb-8" />

      {result.flags.docsFirst && (
        <p className="mb-6 border-l-2 border-accent pl-4 font-medium leading-snug">
          {/* TODO(review): формулировку блока документов уточнит копирайтер */}
          Mulai dari yang bisa diperiksa — dokumen, bukan janji.
        </p>
      )}

      <div className="whitespace-pre-line text-[1.05rem] leading-relaxed">{r.body}</div>

      {!confirmed ? (
        <button
          onClick={() => setConfirmed(true)}
          className="mt-9 min-h-14 w-full rounded-xl bg-accent px-6 text-lg font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
        >
          {cta}
        </button>
      ) : (
        <p className="mt-9 rounded-xl border border-line bg-white px-5 py-4 leading-relaxed">
          Baik. Kami akan menghubungi Bapak/Ibu lewat WhatsApp satu kali.
        </p>
      )}

      <PetaMap peta={peta} />

      <button
        onClick={() => window.print()}
        className="mt-6 min-h-12 w-full rounded-xl border border-accent px-6 font-medium text-accent transition-colors hover:bg-accent/5"
      >
        {PETA.downloadPdf}
      </button>
      <p className="mt-3 text-sm text-muted">Dokumen yang sama kami kirim ke WhatsApp.</p>
    </div>
  );
}
