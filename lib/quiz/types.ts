// Типы квиза v2 и лида. Зеркалят таблицу `leads` и структуру ответов.

export type Tier = "A" | "B" | "C";
export type LandingVariant = "a" | "b" | "c";

export type QuestionId =
  | "amal_jariyah" // Q1 multi (фото)
  | "jejak" // Q2
  | "nama" // Q3
  | "warisan" // Q4 (фото)
  | "hambatan" // Q5
  | "minat" // Q6 (фото)
  | "keputusan" // Q7
  | "kapasitas"; // Q8 (условный)

// ── Модель контента (рендерится компонентами из content/quiz.ts) ────────────────
export interface QuizOption {
  id: string;
  label: string;
  /** Ссылка на аят/хадис — отдельной серой строкой, не в теле варианта. */
  citation?: string;
  points: number;
  /** Q1: «belum» — эксклюзивный, снимает остальные. */
  exclusive?: boolean;
  /** Ключ фото в реестре content/photos.ts (только для вопросов с фото). */
  photo?: string;
}

export interface Question {
  id: QuestionId;
  select: "single" | "multi";
  withPhotos: boolean;
  intro?: string; // врезка-цитата над вопросом
  prompt: string;
  hint?: string; // подсказка под вопросом
  footnote?: string; // строка под вариантами
  options: QuizOption[];
}

export type InsightId = "A" | "B" | "C" | "D";

export interface Insight {
  id: InsightId;
  heading: string;
  body: string;
  button: string;
}

// Экран потока (для оркестратора и прогресса).
export type ScreenId =
  | "landing"
  | QuestionId
  | "insightA"
  | "insightB"
  | "insightC"
  | "insightD"
  | "contact"
  | "preparing"
  | "result";

// ── Ответы пользователя ─────────────────────────────────────────────────────────
export interface QuizAnswers {
  amal_jariyah?: string[]; // multi
  jejak?: string;
  nama?: string;
  warisan?: string;
  hambatan?: string;
  minat?: string;
  keputusan?: string;
  ustadz_nama?: string;
  kapasitas?: string; // <20 | 20-30 | 30-75 | 75-150 | >150 | langsung
}

export interface ScoreFlags {
  anonim: boolean; // nama = sembunyi
  ctaVariant: "default" | "family"; // keputusan ∈ {keluarga, mitra}
  docsFirst: boolean; // hambatan = percaya
  forcedC: boolean; // jejak=tidak_ganggu & warisan=belum
  cappedB: boolean; // hambatan=pendapatan | kapasitas=<20
}

export interface ScoreResult {
  score: number;
  intermediateScore: number; // Q1–Q7
  showQ8: boolean;
  tier: Tier;
  flags: ScoreFlags;
}

// ── Peta Amal Jariyah (собирается из ответов) ───────────────────────────────────
export interface PetaData {
  sudah: string[]; // названия амаль из Q1, что уже есть
  belum: { name: string; forms: string; dalil: string }[]; // недостающие из трёх
  bagian?: string; // выбранная часть (Q6)
  nama: string; // как обращаться с именем (из Q3), либо про анонимность
  anonim: boolean;
}

// ── Лид ─────────────────────────────────────────────────────────────────────────
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
