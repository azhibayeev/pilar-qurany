"use client";

import { motion } from "motion/react";

// Липкая шапка квиза (паттерн Finelo, адаптирован под бренд Qurany):
// стрелка назад слева · лого по центру · счётчик «N/8» справа · анимированный прогресс-бар.
// Остаётся видимой на всех экранах квиза — в т.ч. когда пользователь вводит номер.
export default function QuizHeader({
  pct,
  counter,
  canBack,
  onBack,
}: {
  pct: number;
  counter: { step: number; total: number } | null;
  canBack: boolean;
  onBack: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-xl items-center justify-between px-4">
        <div className="flex w-16 justify-start">
          {canBack ? (
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="-ml-1 flex h-9 w-9 items-center justify-center rounded-full text-fg transition-colors hover:bg-fg/5 active:bg-fg/10"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Qurany" width={28} height={28} className="h-7 w-7 rounded-lg" />
          <span className="text-[0.95rem] font-semibold tracking-tight">Qurany</span>
        </div>

        <div className="flex w-16 justify-end">
          {counter && (
            <span className="text-sm font-medium tabular-nums text-muted">
              <span className="text-accent">{counter.step}</span>/{counter.total}
            </span>
          )}
        </div>
      </div>

      <div className="h-1 w-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <motion.div
          className="h-full rounded-r-full bg-accent"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
        />
      </div>
    </header>
  );
}
