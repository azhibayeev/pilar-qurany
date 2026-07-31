// Нормализация индонезийского номера WhatsApp в формат 628xxxxxxxxx.
// Принимает 08xx, +628xx, 628xx, 8xx.

export function normalizeWa(raw: string): string | null {
  let d = (raw || "").replace(/\D/g, ""); // только цифры (убирает + и пробелы)
  if (d.startsWith("0")) d = "62" + d.slice(1);
  else if (d.startsWith("62")) {
    /* уже с кодом страны */
  } else if (d.startsWith("8")) d = "62" + d;
  else return null;

  // 62 + мобильный префикс 8 + 7..12 цифр
  if (!/^628\d{7,12}$/.test(d)) return null;
  return d;
}

export function isValidWa(raw: string): boolean {
  return normalizeWa(raw) !== null;
}
