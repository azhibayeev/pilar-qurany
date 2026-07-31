// Порядок экранов воронки. Форма контакта — между Q6 (minat) и Q7 (keputusan).
// Q8 (kapasitas) показывается только если showQ8 (см. computeScore).

import { computeScore } from "./scoring";
import type { QuestionId, QuizAnswers } from "./types";

export type ScreenId = "landing" | QuestionId | "contact" | "result";

export const BEFORE_CONTACT: QuestionId[] = [
  "amal_jariyah",
  "jejak",
  "nama",
  "warisan",
  "hambatan",
  "minat",
];

export const AFTER_CONTACT: QuestionId[] = ["keputusan"]; // + kapasitas условно

/** Полная последовательность экранов с учётом условного Q8. */
export function quizScreens(answers: QuizAnswers): ScreenId[] {
  const { showQ8 } = computeScore(answers);
  return [
    "landing",
    ...BEFORE_CONTACT,
    "contact",
    ...AFTER_CONTACT,
    ...(showQ8 ? (["kapasitas"] as QuestionId[]) : []),
    "result",
  ];
}

/** Индекс шага и общее число шагов-вопросов для прогресс-бара (лендинг/результат не считаем). */
export function progress(current: QuestionId | "contact", answers: QuizAnswers): { step: number; total: number } {
  const screens = quizScreens(answers).filter(
    (s) => s !== "landing" && s !== "result"
  );
  const idx = screens.indexOf(current);
  return { step: idx + 1, total: screens.length };
}
