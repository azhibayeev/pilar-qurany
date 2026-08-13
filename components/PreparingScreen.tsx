"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion } from "motion/react";
import { PREPARING } from "@/content/quiz";

function Check() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7.5l2.8 2.8L11 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Кольцевой лоадер (паттерн Finelo) + ЧЕСТНОЕ завершение: кольцо доходит до ~92% за минимум
// времени, до 100% — только когда реальный запрос завершён (done). Строки чек-листа зажигаются
// последовательно. Никаких псевдо-процентов, вводящих в заблуждение.
export default function PreparingScreen({ done, onFinish }: { done: boolean; onFinish: () => void }) {
  const steps = PREPARING.lines.slice(0, 3);
  const [pct, setPct] = useState(0);
  const pctRef = useRef(0);
  const [visible, setVisible] = useState(1);
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const controls = animate(0, 92, {
      duration: 2.6,
      ease: "easeOut",
      onUpdate: (v) => {
        pctRef.current = v;
        setPct(Math.round(v));
      },
    });
    const t = setInterval(() => setVisible((v) => Math.min(v + 1, steps.length)), 850);
    const m = setTimeout(() => setMinElapsed(true), 2600);
    return () => {
      controls.stop();
      clearInterval(t);
      clearTimeout(m);
    };
  }, [steps.length]);

  const ready = done && minElapsed && visible >= steps.length;
  useEffect(() => {
    if (!ready) return;
    const controls = animate(pctRef.current, 100, {
      duration: 0.5,
      ease: "easeOut",
      onUpdate: (v) => {
        pctRef.current = v;
        setPct(Math.round(v));
      },
    });
    const t = setTimeout(onFinish, 700);
    return () => {
      controls.stop();
      clearTimeout(t);
    };
  }, [ready, onFinish]);

  const R = 52;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - pct / 100);

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-6 py-16">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={R} fill="none" stroke="var(--color-line)" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-semibold tabular-nums tracking-tight">{pct}%</span>
        </div>
      </div>

      <p className="mt-7 text-center text-lg font-medium leading-snug text-fg">{PREPARING.title}</p>

      <ul className="mt-8 flex w-full max-w-xs flex-col gap-3.5">
        {steps.map((line, i) => {
          const shown = i < visible;
          const complete = i < visible - 1 || ready;
          return (
            <motion.li
              key={i}
              animate={{ opacity: shown ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                  complete ? "border-accent bg-accent text-white" : "border-line"
                }`}
                aria-hidden="true"
              >
                {complete && <Check />}
              </span>
              <span className={`text-[0.95rem] ${complete ? "text-fg" : "text-muted"}`}>{line}</span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
