// Реестр фотографий вариантов ответов. Ключ = "<qN>.<optionId>".
// Изображения: AI-генерация (Higgsfield · recraft_v4.1), СТРОГО предметы/среда — без людей,
// без частей тела, без лиц, без арабской вязи / священного текста (мусульманский проект).
// Единый приглушённый профиль под цвет логотипа #1a5336 (пост-грейд sharp). WebP+AVIF, срсет 144/288.
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

// AI-изображение (Higgsfield · recraft_v4.1). src1x/src2x = webp 144/288; avif выводится заменой расширения.
const ai = (key: string, alt: string): PhotoEntry => ({
  src1x: `/photos/${key}-144.webp`,
  src2x: `/photos/${key}-288.webp`,
  alt,
  source: "Higgsfield (recraft_v4.1)",
  license: "AI-generated",
  status: "licensed",
});

export const PHOTOS: Record<string, PhotoEntry> = {
  // Q1 · Три дела
  "q1.jariyah": ai("q1.jariyah", `Sumur dan saluran air mengalir di desa`),
  "q1.ilmu": ai("q1.ilmu", `Tumpukan buku tua di atas meja kayu`),
  "q1.anak": ai("q1.anak", `Sajadah terlipat di dekat jendela`),
  // Q4 · 30 лет
  "q4.usaha": ai("q4.usaha", `Rak-rak gudang dengan barang tersusun`),
  "q4.anak": ai("q4.anak", `Sandal dewasa dan sandal anak berjejer di ambang pintu`),
  "q4.lembaga": ai("q4.lembaga", `Ruang kelas pesantren dengan bangku kayu`),
  // Q6 · Часть работы
  "q6.aplikasi": ai("q6.aplikasi", `Ponsel di atas meja kayu`),
  "q6.pendidikan": ai("q6.pendidikan", `Meja guru dan papan tulis kosong`),
  "q6.infrastruktur": ai("q6.infrastruktur", `Gedung yang sedang dibangun`),
};

export function getPhoto(key: string | undefined): PhotoEntry | null {
  if (!key) return null;
  return PHOTOS[key] ?? null;
}
