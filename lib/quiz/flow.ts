// Последовательность экранов v2. Форма — между Q4 и Q5. Инсайты A/B и подготовка не считаются в прогрессе.

import { computeScore } from "./scoring";
import type { QuestionId, QuizAnswers, ScreenId } from "./types";

export const QUESTION_ORDER: QuestionId[] = [
  "amal_jariyah", // Q1
  "jejak", // Q2
  "nama", // Q3
  "warisan", // Q4
  "hambatan", // Q5
  "minat", // Q6
  "keputusan", // Q7
  "kapasitas", // Q8 (условный)
];

/** Полная последовательность экранов с учётом условного Q8. */
export function quizScreens(answers: QuizAnswers): ScreenId[] {
  const { showQ8 } = computeScore(answers);
  return [
    "landing",
    "amal_jariyah",
    "insightA",
    "jejak",
    "nama",
    "insightB",
    "warisan",
    "contact",
    "hambatan",
    "minat",
    "keputusan",
    ...(showQ8 ? (["kapasitas"] as ScreenId[]) : []),
    "preparing",
    "result",
  ];
}

/**
 * Прогресс — только по вопросам. Знаменатель фиксирован (8), чтобы бар не прыгал
 * назад, когда после Q7 решается показ Q8. Инсайты/форма/подготовка не в счёте.
 */
export function questionProgress(current: QuestionId): { step: number; total: number } {
  const idx = QUESTION_ORDER.indexOf(current);
  return { step: idx + 1, total: QUESTION_ORDER.length };
}
