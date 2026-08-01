import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Реальное число выданных Карт (лиды со статусом complete). Кэш 15 мин, чтобы не дёргать БД.
// Без Supabase возвращает 0 → счётчик на клиенте скрыт (порог N≥200).
let cache: { n: number; at: number } | null = null;
const TTL = 15 * 60 * 1000;

export async function GET() {
  if (cache && Date.now() - cache.at < TTL) {
    return NextResponse.json({ count: cache.n });
  }
  let n = 0;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/leads?status=eq.complete&select=id`, {
        headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact", Range: "0-0" },
        cache: "no-store",
      });
      const cr = res.headers.get("content-range"); // "0-0/1234"
      n = cr ? parseInt(cr.split("/")[1] || "0", 10) || 0 : 0;
    } catch {
      n = 0;
    }
  }
  cache = { n, at: Date.now() };
  return NextResponse.json({ count: n });
}
