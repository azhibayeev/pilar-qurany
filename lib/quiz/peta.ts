// Сборка «Peta Amal Jariyah» из ответов. При nama=sembunyi секция имени говорит об анонимности.

import { AMAL, PETA } from "@/content/quiz";
import type { PetaData, QuizAnswers } from "./types";

const THREE = ["jariyah", "ilmu", "anak"] as const;

export function buildPeta(answers: QuizAnswers): PetaData {
  const selected = new Set((answers.amal_jariyah ?? []).filter((x) => x !== "belum"));
  const sudah = THREE.filter((k) => selected.has(k)).map((k) => AMAL[k].name);
  const belum = THREE.filter((k) => !selected.has(k)).map((k) => ({
    name: AMAL[k].name,
    forms: AMAL[k].forms,
    dalil: AMAL[k].dalil,
  }));
  const anonim = answers.nama === "sembunyi";
  const bagian = answers.minat ? PETA.bagianLabel[answers.minat] : undefined;
  const nama = answers.nama ? PETA.namaTreatment[answers.nama] ?? "" : "";
  return { sudah, belum, bagian, nama, anonim };
}
