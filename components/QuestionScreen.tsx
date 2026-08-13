"use client";

import { motion } from "motion/react";
import Photo from "@/components/Photo";
import QuoteBlock from "@/components/QuoteBlock";
import { USTADZ_FIELD_LABEL } from "@/content/quiz";
import type { Question, QuizAnswers } from "@/lib/quiz/types";

interface Props {
  question: Question;
  answers: QuizAnswers;
  onPatch: (patch: Partial<QuizAnswers>) => void;
  onAnswerAndAdvance: (patch: Partial<QuizAnswers>) => void;
  onAdvance: () => void;
  onBack: () => void;
  canBack: boolean;
  progress: { step: number; total: number };
}

// Карточки появляются каскадом; знак множественного/единичного выбора рисуется пружиной.
const listVar = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};
const itemVar = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: [0.22, 0.61, 0.36, 1] as const } },
};

export default function QuestionScreen({
  question,
  answers,
  onPatch,
  onAnswerAndAdvance,
  onAdvance,
}: Props) {
  const isMulti = question.select === "multi";
  const multiSelected = (answers.amal_jariyah ?? []) as string[];
  const singleSelected = answers[question.id as keyof QuizAnswers] as string | undefined;

  function toggleMulti(optId: string, exclusive?: boolean) {
    let next: string[];
    if (exclusive) {
      next = multiSelected.includes(optId) ? [] : [optId];
    } else {
      const withoutExclusive = multiSelected.filter(
        (id) => !question.options.find((o) => o.id === id)?.exclusive
      );
      next = withoutExclusive.includes(optId)
        ? withoutExclusive.filter((id) => id !== optId)
        : [...withoutExclusive, optId];
    }
    onPatch({ amal_jariyah: next });
  }

  function chooseSingle(optId: string) {
    if (question.id === "keputusan") {
      if (optId === "ustadz") {
        onPatch({ keputusan: "ustadz" });
        return;
      }
      onAnswerAndAdvance({ keputusan: optId, ustadz_nama: undefined });
      return;
    }
    onAnswerAndAdvance({ [question.id]: optId } as Partial<QuizAnswers>);
  }

  const showUstadzField = question.id === "keputusan" && singleSelected === "ustadz";
  const canContinue = isMulti ? multiSelected.length > 0 : Boolean(singleSelected);

  return (
    <div className="mx-auto max-w-xl px-6 pb-16 pt-6">
      {question.intro && (
        <div className="mb-6">
          <QuoteBlock>{question.intro}</QuoteBlock>
        </div>
      )}

      <h2 className="text-xl font-semibold leading-snug tracking-tight">{question.prompt}</h2>
      {question.hint && <p className="mt-2 text-[0.95rem] text-muted">{question.hint}</p>}

      <motion.div
        variants={listVar}
        initial="hidden"
        animate="show"
        className="mt-6 flex flex-col gap-3"
      >
        {question.options.map((o) => {
          const selected = isMulti ? multiSelected.includes(o.id) : singleSelected === o.id;
          return (
            <motion.button
              key={o.id}
              variants={itemVar}
              onClick={() => (isMulti ? toggleMulti(o.id, o.exclusive) : chooseSingle(o.id))}
              aria-pressed={selected}
              whileTap={{ scale: 0.985 }}
              className={[
                "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left leading-snug shadow-soft transition-colors duration-200",
                question.withPhotos ? "min-h-[92px]" : "min-h-14",
                selected
                  ? "border-accent bg-accent/[0.07] ring-1 ring-accent"
                  : "border-line bg-white hover:border-accent/40",
              ].join(" ")}
            >
              {question.withPhotos && o.photo && (
                <Photo photoKey={o.photo} eager={question.id === "amal_jariyah"} />
              )}
              <span className="flex-1">
                <span className="block">{o.label}</span>
                {o.citation && <span className="mt-1 block text-xs text-muted">{o.citation}</span>}
              </span>
              {/* Индикатор: квадрат для multi, круг для single. Пружинный «поп» + рисование при выборе. */}
              <span
                aria-hidden="true"
                className={[
                  "flex h-6 w-6 shrink-0 items-center justify-center border transition-colors",
                  isMulti ? "rounded-md" : "rounded-full",
                  selected ? "border-accent bg-accent" : "border-line",
                ].join(" ")}
              >
                {selected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="flex items-center justify-center"
                  >
                    {isMulti ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <motion.path
                          d="M3 7.5l2.8 2.8L11 4.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                        />
                      </svg>
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    )}
                  </motion.span>
                )}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {question.footnote && <p className="mt-4 text-[0.95rem] text-muted">{question.footnote}</p>}

      {showUstadzField && (
        <div className="mt-5">
          <label className="mb-2 block text-sm text-muted">{USTADZ_FIELD_LABEL}</label>
          <input
            type="text"
            value={answers.ustadz_nama ?? ""}
            onChange={(e) => onPatch({ ustadz_nama: e.target.value })}
            className="min-h-14 w-full rounded-xl border border-line bg-white px-4 text-base outline-none focus:border-accent"
            placeholder="Nama ustadz / kyai"
          />
        </div>
      )}

      {(isMulti || showUstadzField) && (
        <motion.button
          onClick={onAdvance}
          disabled={!canContinue}
          whileTap={{ scale: 0.98 }}
          className="mt-8 min-h-14 w-full rounded-xl bg-accent px-6 text-lg font-medium text-white shadow-btn transition-all hover:bg-[var(--color-accent-hover)] disabled:opacity-40 disabled:shadow-none"
        >
          Lanjutkan
        </motion.button>
      )}
    </div>
  );
}
