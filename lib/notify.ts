// Уведомления команде о заявках. Основной канал — Telegram (каждая завершённая заявка).
// Сообщение — на русском, читаемое менеджеру (коды ответов → человеческий текст).
// notifyTierA (Slack {text}) оставлен опционально, если задан NOTIFY_WEBHOOK_URL.

import { investorLevel } from "./quiz/investor";
import type { LeadInput } from "./quiz/types";

function esc(s: unknown): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── Словари: код ответа → читаемый русский текст ────────────────────────────────
const D_AMAL: Record<string, string> = {
  jariyah: "садака-джария",
  ilmu: "полезное знание",
  anak: "праведный ребёнок",
  belum: "пока ни одного",
};
const D_JEJAK: Record<string, string> = {
  lihat: "видел результат сам",
  tidak_ganggu: "не видит, и это не тревожит",
  ganggu: "не видит, и это тревожит",
  perantara: "через посредника, результат не знает",
};
const D_NAMA: Record<string, string> = {
  sembunyi: "скрывать имя",
  sebut: "называть открыто",
  tergantung: "зависит от амаля",
  belum: "ещё не решил(а)",
};
const D_WARISAN: Record<string, string> = {
  usaha: "дело, работающее без него",
  anak: "дети, хранящие религию",
  lembaga: "учреждение (школа/мечеть/фонд)",
  belum: "не думал(а) на 30 лет вперёд",
};
const D_HAMBATAN: Record<string, string> = {
  percaya: "не доверяет сборщикам средств",
  laporan: "нет отчёта, куда идут деньги",
  prioritas: "не знает, где нужнее",
  pendapatan: "нестабильный доход",
  rutin: "уже даёт регулярно",
};
const D_MINAT: Record<string, string> = {
  aplikasi: "приложение (Коран бесплатно)",
  pendidikan: "образование (учителя, классы)",
  infrastruktur: "инфраструктура (здания, оборудование)",
  semua: "всё сразу, на усмотрение",
};
const D_KEPUTUSAN: Record<string, string> = {
  sendiri: "сам, быстро",
  ustadz: "сам, посоветовавшись с устазом",
  keluarga: "вместе с семьёй",
  mitra: "вместе с партнёром/советом",
};
// Бюджет Q8 — в млн рупий (IDR). Команда в Казахстане, поэтому показываем IDR + ≈ в тенге.
// Курс — живой (open.er-api.com), с фолбэком на случай недоступности API.
const IDR_TO_KZT_FALLBACK = 0.0264; // 1 IDR ≈ 0,0264 ₸ (2026-08); обновится живым курсом

async function fetchIdrToKzt(): Promise<number> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/IDR", { signal: AbortSignal.timeout(3000) });
    const j = (await res.json()) as { rates?: { KZT?: number } };
    const r = j?.rates?.KZT;
    return typeof r === "number" && r > 0 ? r : IDR_TO_KZT_FALLBACK;
  } catch {
    return IDR_TO_KZT_FALLBACK;
  }
}

// juta = млн IDR → компактная строка в тенге.
function kzt(juta: number, rate: number): string {
  const v = juta * 1_000_000 * rate;
  if (v >= 1_000_000) return `${(v / 1_000_000).toLocaleString("ru-RU", { maximumFractionDigits: 1 })} млн ₸`;
  return `${Math.round(v / 1000).toLocaleString("ru-RU")} тыс ₸`;
}

// Границы бакетов Q8 в млн IDR ([низ, верх], null = открытая граница).
const KAP_BUCKETS: Record<string, [number | null, number | null]> = {
  "<20": [null, 20],
  "20-30": [20, 30],
  "30-75": [30, 75],
  "75-150": [75, 150],
  ">150": [150, null],
};

function formatBudget(id: string | undefined, rate: number): string {
  if (!id) return "не указан";
  if (id === "langsung") return "лучше обсудить напрямую";
  const b = KAP_BUCKETS[id];
  if (!b) return id;
  const [lo, hi] = b;
  const idr = lo == null ? `&lt; ${hi} млн IDR` : hi == null ? `&gt; ${lo} млн IDR` : `${lo}–${hi} млн IDR`;
  const kz =
    lo == null ? `&lt; ${kzt(hi!, rate)}` : hi == null ? `&gt; ${kzt(lo, rate)}` : `${kzt(lo, rate)} – ${kzt(hi, rate)}`;
  return `${idr} (≈ ${kz})`;
}

// Модель по тиру — вторичный контекст (не действие).
const TIER_MODEL: Record<string, string> = {
  A: "Amal jariyah kelembagaan",
  B: "Sahabat Qurany",
  C: "Pengamat",
};

// Цель воронки — найти потенциальных МЕЦЕНАТОВ/вакифов в приложение Qurany.
// Уровень считает общий модуль investorLevel (тот же, что и на экране результата).
const INVESTOR_UI: Record<string, { emoji: string; label: string; note: string }> = {
  high: { emoji: "🔥", label: "ВЫСОКИЙ", note: "вести на личный разговор о поддержке Qurany" },
  medium: { emoji: "🟡", label: "средний", note: "прогреть, прощупать интерес к проекту" },
  low: { emoji: "⚪", label: "низкий", note: "не приоритет" },
};

function tr(dict: Record<string, string>, id?: string): string {
  if (!id) return "—";
  return dict[id] ?? id; // неизвестный код — показываем как есть, ничего не теряем
}

const jakarta = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Asia/Jakarta",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

// Каждая завершённая заявка → сообщение в Telegram (Bot API sendMessage).
// Нужны env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (+ опц. TELEGRAM_THREAD_ID для темы форума).
export async function notifyLeadTelegram(lead: LeadInput & { id?: string }): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;
  const thread = process.env.TELEGRAM_THREAD_ID;
  const a = lead.answers;
  const wa = lead.wa_normalized;

  const inv = INVESTOR_UI[investorLevel(lead.answers, lead.tier)];
  const model = lead.tier ? TIER_MODEL[lead.tier] : undefined;
  const budget = formatBudget(a.kapasitas, await fetchIdrToKzt());
  const amal = (a.amal_jariyah || []).map((id) => D_AMAL[id] ?? id).join(", ") || "—";
  const keputusan =
    tr(D_KEPUTUSAN, a.keputusan) +
    (a.keputusan === "ustadz" ? ` — имя: <b>${esc(lead.ustadz_nama || "не указано")}</b>` : "");

  const lines = [
    `🆕 <b>Новая заявка · Pilar Qurany</b>`,
    `${inv.emoji} <b>Потенциал инвестора: ${inv.label}</b> — ${inv.note}`,
    `💰 Бюджет/мес: <b>${budget}</b>${model ? ` · тир ${lead.tier} (${model})` : ""}`,
    ``,
    `👤 <b>${esc(lead.nama)}</b>${lead.anonim ? " · 🔒 аноним" : ""}`,
    wa ? `📱 <a href="https://wa.me/${wa}">+${wa}</a> → написать в WhatsApp` : "",
    ``,
    `<b>Ответы:</b>`,
    `• Уже есть амали: ${amal}`,
    `• Видит результат садаки: ${tr(D_JEJAK, a.jejak)}`,
    `• Имя: ${tr(D_NAMA, a.nama)}`,
    `• Что должно остаться: ${tr(D_WARISAN, a.warisan)}`,
    `• Что мешает давать регулярно: ${tr(D_HAMBATAN, a.hambatan)}`,
    `• Ближе всего: ${tr(D_MINAT, a.minat)}`,
    `• Решает о крупных суммах: ${keputusan}`,
    ``,
    lead.utm_source || lead.utm_medium
      ? `📊 Источник: ${esc(lead.utm_source || "—")}${lead.utm_medium ? ` · ${esc(lead.utm_medium)}` : ""}`
      : "",
    lead.utm_campaign ? `📢 Кампания: ${esc(lead.utm_campaign)}` : "",
    lead.utm_content ? `🅰️ Объявление: ${esc(lead.utm_content)}` : "",
    `🕐 ${jakarta.format(new Date())} (WIB)${lead.landing_variant ? ` · лендинг ${esc(lead.landing_variant)}` : ""}`,
  ].filter(Boolean);

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chat,
        ...(thread ? { message_thread_id: Number(thread) } : {}),
        text: lines.join("\n"),
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
      }),
    });
  } catch (e) {
    console.error("[notify:telegram] failed", e);
  }
}

// Опциональный Slack-вебхук при тире A (если задан NOTIFY_WEBHOOK_URL).
export async function notifyTierA(lead: LeadInput & { id?: string }): Promise<void> {
  const url = process.env.NOTIFY_WEBHOOK_URL;
  if (!url) return;
  const text =
    `🅰️ Lead baru — Tier A\n` +
    `Nama: ${lead.anonim ? "(anonim)" : lead.nama}\n` +
    `WA: ${lead.wa_normalized}\n` +
    `Score: ${lead.score}\n` +
    (lead.ustadz_nama ? `Ustadz: ${lead.ustadz_nama}\n` : "") +
    `Jawaban: ${JSON.stringify(lead.answers)}`;
  try {
    await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
  } catch (e) {
    console.error("[notify] failed", e);
  }
}
