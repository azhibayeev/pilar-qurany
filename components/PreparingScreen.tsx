"use client";

import { useEffect, useState } from "react";
import { PREPARING } from "@/content/quiz";

function Check() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7.5l2.8 2.8L11 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Честный прогресс: три строки появляются последовательно; финальная «Selesai» — только когда
// реальный запрос к API завершён (done) И прошло минимум времени, чтобы не мигало. Без псевдо-процентов.
export default function PreparingScreen({ done, onFinish }: { done: boolean; onFinish: () => void }) {
  const steps = PREPARING.lines.slice(0, 3);
  const finalLine = PREPARING.lines[PREPARING.lines.length - 1];
  const [visible, setVisible] = useState(1);
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setVisible((v) => Math.min(v + 1, steps.length)), 900);
    const m = setTimeout(() => setMinElapsed(true), 2600);
    return () => {
      clearInterval(t);
      clearTimeout(m);
    };
  }, [steps.length]);

  const ready = done && minElapsed && visible >= steps.length;
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(onFinish, 700);
    return () => clearTimeout(t);
  }, [ready, onFinish]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6 py-16">
      <ul className="flex flex-col gap-4">
        {steps.map((line, i) => {
          const shown = i < visible;
          const complete = i < visible - 1 || ready;
          return (
            <li
              key={i}
              className={`flex items-center gap-3 transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-30"}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                  complete ? "border-accent bg-accent text-white" : "border-line"
                }`}
                aria-hidden="true"
              >
                {complete && <Check />}
              </span>
              <span className={complete ? "text-fg" : "text-muted"}>{line}</span>
            </li>
          );
        })}
        <li className={`flex items-center gap-3 transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-30"}`}>
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full border ${
              ready ? "border-accent bg-accent text-white" : "border-line"
            }`}
            aria-hidden="true"
          >
            {ready && <Check />}
          </span>
          <span className={`font-medium ${ready ? "text-fg" : "text-muted"}`}>{finalLine}</span>
        </li>
      </ul>
    </div>
  );
}
