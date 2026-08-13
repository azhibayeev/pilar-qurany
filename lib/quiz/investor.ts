// Цель воронки — найти потенциальных МЕЦЕНАТОВ/вакифов, финансирующих развитие приложения
// Qurany как непрерывающуюся садаку. Уровень считаем из ответов (общий для уведомления и
// экрана результата), чтобы сильным лидам показывать разговор о поддержке, а не «отчёт».

import type { QuizAnswers, Tier } from "./types";

export type InvestorLevel = "high" | "medium" | "low";

export function investorLevel(a: QuizAnswers, tier?: Tier): InvestorLevel {
  const highBudget = a.kapasitas === "75-150" || a.kapasitas === ">150" || a.kapasitas === "langsung";
  const midBudget = a.kapasitas === "30-75";
  const institutional = a.warisan === "lembaga";
  const autonomous = a.keputusan === "sendiri" || a.keputusan === "mitra" || a.keputusan === "ustadz";

  if (highBudget || (tier === "A" && institutional)) return "high";
  if (midBudget || (institutional && autonomous) || tier === "B") return "medium";
  return "low";
}
