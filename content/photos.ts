// Реестр фотографий вариантов ответов. Ключ = "<qN>.<optionId>".
// Пока все со статусом "placeholder" (сплошной цвет + иконка). Реальные фото — только
// предметные/средние планы, индонезийский контекст, единый профиль, WebP+AVIF, срсет 144/288.
// НЕ подставлять случайные стоки — с ними квиз уйдёт в прод. Заменяя, ставь status:"licensed"
// и заполняй source/license.

export type PhotoStatus = "placeholder" | "licensed";

export interface PhotoEntry {
  /** 144×144 (1x) и 288×288 (2x). Для placeholder оба указывают на общий SVG. */
  src1x: string;
  src2x: string;
  alt: string; // осмысленный alt на bahasa
  source?: string;
  license?: string;
  status: PhotoStatus;
}

const PLACEHOLDER = "/photos/placeholder.svg";
const ph = (alt: string): PhotoEntry => ({ src1x: PLACEHOLDER, src2x: PLACEHOLDER, alt, status: "placeholder" });

export const PHOTOS: Record<string, PhotoEntry> = {
  // Q1 · Три дела
  "q1.jariyah": ph(`Sumur atau saluran air yang mengalir`), // TODO: колодец / водопровод
  "q1.ilmu": ph(`Buku terbuka dan tangan yang memegangnya`), // TODO: раскрытая книга, руки
  "q1.anak": ph(`Tangan anak menengadah berdoa`), // TODO: детские ладони в дуа
  // Q4 · 30 лет
  "q4.usaha": ph(`Gudang atau tempat produksi yang berjalan`), // TODO: производство/склад
  "q4.anak": ph(`Tangan yang tua menggenggam tangan yang muda`), // TODO: руки старшего и младшего
  "q4.lembaga": ph(`Ruang kelas pondok`), // TODO: класс пондока
  // Q6 · Часть работы
  "q6.aplikasi": ph(`Ponsel dengan mushaf terbuka`), // TODO: телефон с открытым мусхафом
  "q6.pendidikan": ph(`Guru bersama murid-murid di kelas`), // TODO: учитель с учениками
  "q6.infrastruktur": ph(`Gedung yang sedang dibangun`), // TODO: строящееся здание
};

export function getPhoto(key: string | undefined): PhotoEntry | null {
  if (!key) return null;
  return PHOTOS[key] ?? null;
}
