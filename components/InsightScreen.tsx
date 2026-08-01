"use client";

import type { Insight } from "@/lib/quiz/types";

export default function InsightScreen({
  insight,
  onNext,
  onBack,
}: {
  insight: Insight;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl animate-[fadeIn_.4s_ease] px-6 pb-16 pt-6">
      <button
        onClick={onBack}
        className="mb-6 text-sm text-muted underline-offset-4 hover:underline"
        aria-label="Kembali"
      >
        ← Kembali
      </button>
      <h2 className="text-xl font-semibold leading-snug tracking-tight">{insight.heading}</h2>
      <div className="mt-4 whitespace-pre-line leading-relaxed">{insight.body}</div>
      <button
        onClick={onNext}
        className="mt-8 min-h-14 w-full rounded-xl bg-accent px-6 text-lg font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
      >
        {insight.button}
      </button>
    </div>
  );
}
