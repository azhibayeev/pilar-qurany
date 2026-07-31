// Чистая функция скоринга: одна и та же на клиенте (мгновенный результат)
// и на сервере (значение, которое пишется в базу). Балл/тир пользователю не показываются.

import { QUESTIONS } from "./content";
import type { QuizAnswers, ScoreResult, Tier } from "./types";

// points[questionId][optionId] = баллы
const POINTS: Record<string, Record<string, number>> = {};
for (const q of QUESTIONS) {
  POINTS[q.id] = {};
  for (const o of q.options) POINTS[q.id][o.id] = o.points;
}

function pts(qid: string, oid: string | undefined): number {
  if (!oid) return 0;
  return POINTS[qid]?.[oid] ?? 0;
}

const KAP_A = new Set(["75-150", ">150", "langsung"]); // гейт тира A по капасити

/**
 * Считает балл, тир и флаги по ответам.
 *
 * Правила (в порядке применения):
 *  1) intermediateScore = Q1..Q7. Q8 показывается только если intermediateScore ≥ 22 и НЕ forcedC.
 *  2) score = intermediateScore + баллы Q8 (если показан и отвечен).
 *  3) Базовый тир: A = score≥38 И kapasitas∈{75-150,>150,langsung}; C = score≤21; иначе B.
 *  4) forcedC: jejak=tidak_ganggu И warisan=belum → тир C, Q8 не показывать.
 *  5) Потолок B: hambatan=pendapatan ИЛИ kapasitas=<20 → если базовый A, опустить до B.
 */
export function computeScore(answers: QuizAnswers): ScoreResult {
  const a = answers;

  // Q1 multi: сумма выбранных. «belum» эксклюзивен (UI это гарантирует; здесь — на всякий случай).
  const q1 = a.amal_jariyah ?? [];
  const q1selected = q1.includes("belum") ? ["belum"] : q1;
  const q1score = q1selected.reduce((s, id) => s + pts("amal_jariyah", id), 0);

  const intermediateScore =
    q1score +
    pts("jejak", a.jejak) +
    pts("nama", a.nama) +
    pts("warisan", a.warisan) +
    pts("hambatan", a.hambatan) +
    pts("minat", a.minat) +
    pts("keputusan", a.keputusan);

  const forcedC = a.jejak === "tidak_ganggu" && a.warisan === "belum";
  const showQ8 = intermediateScore >= 22 && !forcedC;

  const q8score = showQ8 ? pts("kapasitas", a.kapasitas) : 0;
  const score = intermediateScore + q8score;

  const kapasitas = showQ8 ? a.kapasitas : undefined;

  // базовый тир
  let tier: Tier;
  if (score >= 38 && kapasitas != null && KAP_A.has(kapasitas)) tier = "A";
  else if (score <= 21) tier = "C";
  else tier = "B";

  // форс C
  if (forcedC) tier = "C";

  // потолок B
  const cappedB = a.hambatan === "pendapatan" || kapasitas === "<20";
  if (cappedB && tier === "A") tier = "B";

  return {
    score,
    intermediateScore,
    showQ8,
    tier,
    flags: {
      anonim: a.nama === "sembunyi",
      ctaVariant: a.keputusan === "keluarga" || a.keputusan === "mitra" ? "family" : "default",
      docsFirst: a.hambatan === "percaya",
      forcedC,
      cappedB,
    },
  };
}
