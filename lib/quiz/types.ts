// Типы квиза и лида. Зеркалят таблицу `leads` и структуру ответов.

export type Tier = "A" | "B" | "C";
export type LandingVariant = "a" | "b" | "c";

export type QuestionId =
  | "amal_jariyah" // Q1 multi
  | "jejak" // Q2
  | "nama" // Q3
  | "warisan" // Q4
  | "hambatan" // Q5
  | "minat" // Q6
  | "keputusan" // Q7
  | "kapasitas"; // Q8 (условный)

export interface QuizOption {
  id: string;
  label: string;
  points: number;
  /** Q1: «belum» — эксклюзивный, снимает остальные. */
  exclusive?: boolean;
}

export interface Question {
  id: QuestionId;
  kind: "single" | "multi";
  /** Врезка над вопросом (аят/хадис). */
  intro?: string;
  prompt: string;
  options: QuizOption[];
}

/** Ответы пользователя. Q1 — массив; остальные — id опции. */
export interface QuizAnswers {
  amal_jariyah?: string[];
  jejak?: string;
  nama?: string;
  warisan?: string;
  hambatan?: string;
  minat?: string;
  keputusan?: string;
  ustadz_nama?: string;
  kapasitas?: string;
}

export interface ScoreFlags {
  anonim: boolean; // nama = sembunyi
  ctaVariant: "default" | "family"; // keputusan ∈ {keluarga, mitra}
  docsFirst: boolean; // hambatan = percaya
  forcedC: boolean; // jejak=tidak_ganggu & warisan=belum
  cappedB: boolean; // hambatan=pendapatan | kapasitas=<20
}

export interface ScoreResult {
  score: number; // полный балл (с Q8, если показан и отвечен)
  intermediateScore: number; // Q1–Q7 (по нему решается показ Q8)
  showQ8: boolean;
  tier: Tier;
  flags: ScoreFlags;
}

export interface LeadInput {
  nama: string;
  wa_raw: string;
  wa_normalized: string;
  status: "partial" | "complete";
  score?: number;
  tier?: Tier;
  anonim?: boolean;
  ustadz_nama?: string | null;
  answers: QuizAnswers;
  landing_variant?: LandingVariant;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  fbclid?: string;
  ttclid?: string;
  referrer?: string;
  user_agent?: string;
  locale?: string;
}
