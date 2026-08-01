// Реестр фотографий вариантов ответов. Ключ = "<qN>.<optionId>".
// Реальные фото: предметные/средние планы, лица вне кадра, единый приглушённый профиль,
// WebP+AVIF, срсет 144/288. НЕ подставлять случайные стоки. Источник — Pexels (лицензия Pexels,
// коммерческое использование без атрибуции). Обработаны sharp (saturation 0.72 для единого профиля).
// src1x/src2x указывают на .webp; компонент Photo сам подставит .avif как первый <source>.

export type PhotoStatus = "placeholder" | "licensed";

export interface PhotoEntry {
  src1x: string; // 144×144 .webp
  src2x: string; // 288×288 .webp
  alt: string; // осмысленный alt на bahasa
  source?: string;
  license?: string;
  status: PhotoStatus;
}

const PLACEHOLDER = "/photos/placeholder.svg";
const ph = (alt: string): PhotoEntry => ({ src1x: PLACEHOLDER, src2x: PLACEHOLDER, alt, status: "placeholder" });

// Лицензионное фото (Pexels). src1x/src2x = webp 144/288; avif выводится заменой расширения.
const px = (key: string, alt: string): PhotoEntry => ({
  src1x: `/photos/${key}-144.webp`,
  src2x: `/photos/${key}-288.webp`,
  alt,
  source: "Pexels",
  license: "Pexels License",
  status: "licensed",
});

export const PHOTOS: Record<string, PhotoEntry> = {
  // Q1 · Три дела
  "q1.jariyah": px("q1.jariyah", `Saluran air mengalir di antara ladang`),
  "q1.ilmu": px("q1.ilmu", `Buku tua terbuka dengan tulisan Arab`),
  "q1.anak": ph(`Tangan anak menengadah berdoa`), // плейсхолдер: нет чистого фото без лица/дубля
  // Q4 · 30 лет
  "q4.usaha": px("q4.usaha", `Bagian dalam gudang dengan rak-rak`),
  "q4.anak": px("q4.anak", `Tangan dewasa menggenggam tangan anak kecil`),
  "q4.lembaga": px("q4.lembaga", `Ruang kelas dengan kursi kayu`),
  // Q6 · Часть работы
  "q6.aplikasi": px("q6.aplikasi", `Tangan memegang ponsel`),
  "q6.pendidikan": px("q6.pendidikan", `Tangan mengangkat setumpuk buku`),
  "q6.infrastruktur": px("q6.infrastruktur", `Gedung yang sedang dibangun`),
};

export function getPhoto(key: string | undefined): PhotoEntry | null {
  if (!key) return null;
  return PHOTOS[key] ?? null;
}
