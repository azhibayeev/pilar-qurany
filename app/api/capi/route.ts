import { NextResponse } from "next/server";
import { sendMetaCapi, type CapiEvent } from "@/lib/capi";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Partial<CapiEvent>;
  try {
    body = (await req.json()) as Partial<CapiEvent>;
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  if (!body.name || !body.eventId) {
    return NextResponse.json({ error: "name and eventId required" }, { status: 400 });
  }
  await sendMetaCapi({
    name: body.name,
    eventId: body.eventId,
    wa: body.wa,
    nama: body.nama,
    fbclid: body.fbclid,
    custom: body.custom,
    clientIp: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
    userAgent: req.headers.get("user-agent") || undefined,
    sourceUrl: req.headers.get("referer") || undefined,
  });
  return NextResponse.json({ ok: true });
}
