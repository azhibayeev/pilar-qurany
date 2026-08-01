// Уведомления команде о заявках. Основной канал — Telegram (каждая завершённая заявка).
// notifyTierA (Slack {text}) оставлен опционально, если задан NOTIFY_WEBHOOK_URL.

import type { LeadInput } from "./quiz/types";

function esc(s: unknown): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Каждая завершённая заявка → сообщение в Telegram (Bot API sendMessage).
// Нужны env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (+ опц. TELEGRAM_THREAD_ID для темы форума).
export async function notifyLeadTelegram(lead: LeadInput & { id?: string }): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;
  const thread = process.env.TELEGRAM_THREAD_ID;
  const a = lead.answers;
  const wa = lead.wa_normalized;

  const lines = [
    `🆕 <b>Заявка Pilar Qurany</b>`,
    `Тир: <b>${lead.tier ?? "—"}</b> · балл ${lead.score ?? "—"}`,
    `Имя: <b>${esc(lead.nama)}</b>${lead.anonim ? " · 🔒 anonim" : ""}`,
    wa ? `WA: <a href="https://wa.me/${wa}">+${wa}</a>` : "",
    lead.ustadz_nama ? `Ustadz: ${esc(lead.ustadz_nama)}` : "",
    ``,
    `<b>Ответы:</b>`,
    `• Amal: ${esc((a.amal_jariyah || []).join(", ") || "—")}`,
    `• Jejak: ${esc(a.jejak || "—")} · Nama: ${esc(a.nama || "—")} · Warisan: ${esc(a.warisan || "—")}`,
    `• Hambatan: ${esc(a.hambatan || "—")} · Minat: ${esc(a.minat || "—")} · Keputusan: ${esc(a.keputusan || "—")}`,
    `• Kapasitas: ${esc(a.kapasitas || "—")}`,
    lead.landing_variant ? `Лендинг: ${esc(lead.landing_variant)}` : "",
    lead.utm_source || lead.utm_content
      ? `UTM: ${esc(lead.utm_source || "")}/${esc(lead.utm_medium || "")}/${esc(lead.utm_content || "")}`
      : "",
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
