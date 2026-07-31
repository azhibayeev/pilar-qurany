"use client";

import { useState } from "react";
import { minatLine, RESULTS } from "@/lib/quiz/content";
import type { ScoreResult } from "@/lib/quiz/types";

// Балл/тир пользователю НЕ показываются — только текст модели и CTA.
export default function ResultScreen({
  result,
  minatId,
}: {
  result: ScoreResult;
  minatId?: string;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const r = RESULTS[result.tier];
  const cta = result.flags.ctaVariant === "family" && r.ctaFamily ? r.ctaFamily : r.cta;
  const line = minatLine(minatId);

  // hambatan=percaya → экран начинается с блока «сначала документы».
  const docsFirst = result.flags.docsFirst;

  return (
    <div className="mx-auto max-w-xl px-6 pb-20 pt-10">
      <h1 className="sr-only">Hasil analisis</h1>
      {docsFirst && (
        <p className="mb-6 border-l-2 border-accent pl-4 font-medium leading-snug">
          {/* TODO: копирайтер может уточнить формулировку блока документов */}
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

      {line && <p className="mt-5 text-[0.95rem] text-muted">{line}</p>}
    </div>
  );
}
