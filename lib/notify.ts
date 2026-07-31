// Мгновенное уведомление команде при тире A. Формат {text} — совместим со Slack
// Incoming Webhook. Для Telegram используйте relay, принимающий {text} (см. README).

import type { LeadInput } from "./quiz/types";

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
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch (e) {
    console.error("[notify] failed", e);
  }
}
