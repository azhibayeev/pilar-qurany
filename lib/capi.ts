// Meta Conversions API (серверная атрибуция; iOS без неё разваливается).
// event_id общий с браузерным Pixel → Meta дедуплицирует. No-op, если нет env.

import crypto from "crypto";

function sha256(s: string): string {
  return crypto.createHash("sha256").update(s.trim().toLowerCase()).digest("hex");
}

export interface CapiEvent {
  name: string;
  eventId: string;
  wa?: string; // 628xxxxxxxxx
  nama?: string;
  fbclid?: string;
  custom?: Record<string, unknown>;
  clientIp?: string;
  userAgent?: string;
  sourceUrl?: string;
}

export async function sendMetaCapi(e: CapiEvent): Promise<void> {
  const token = process.env.META_CAPI_TOKEN;
  const dataset = process.env.META_DATASET_ID;
  if (!token || !dataset) return; // не настроено — тихо выходим

  const user_data: Record<string, unknown> = {};
  if (e.wa) user_data.ph = [sha256(e.wa)];
  if (e.nama) user_data.fn = [sha256(e.nama)];
  if (e.fbclid) user_data.fbc = `fb.1.${Date.now()}.${e.fbclid}`;
  if (e.clientIp) user_data.client_ip_address = e.clientIp;
  if (e.userAgent) user_data.client_user_agent = e.userAgent;

  const payload = {
    data: [
      {
        event_name: e.name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: e.eventId,
        action_source: "website",
        ...(e.sourceUrl ? { event_source_url: e.sourceUrl } : {}),
        user_data,
        custom_data: e.custom || {},
      },
    ],
  };

  try {
    await fetch(`https://graph.facebook.com/v21.0/${dataset}/events?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[capi] failed", err);
  }
}
