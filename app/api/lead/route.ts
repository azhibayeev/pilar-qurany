import { NextResponse } from "next/server";
import { leadStore } from "@/lib/leadStore";
import { notifyLeadTelegram, notifyTierA } from "@/lib/notify";
import { computeScore } from "@/lib/quiz/scoring";
import type { LandingVariant, LeadInput, QuizAnswers } from "@/lib/quiz/types";
import { normalizeWa } from "@/lib/wa";
import type { Tracking } from "@/lib/tracking";

export const runtime = "nodejs";

interface Body {
  phase: "partial" | "complete";
  id?: string;
  nama?: string;
  wa_raw?: string;
  answers: QuizAnswers;
  landing_variant?: LandingVariant;
  tracking?: Tracking;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const answers = body.answers || {};
  // Скоринг ВСЕГДА пересчитывается на сервере — в базу пишется серверное значение.
  const result = computeScore(answers);

  if (body.phase === "partial") {
    const nama = (body.nama || "").trim();
    const wa = normalizeWa(body.wa_raw || "");
    if (nama.length < 2 || !wa) {
      return NextResponse.json({ error: "invalid nama/wa" }, { status: 400 });
    }
    const input: LeadInput = {
      nama,
      wa_raw: body.wa_raw || "",
      wa_normalized: wa,
      status: "partial",
      score: result.score,
      tier: result.tier,
      anonim: result.flags.anonim,
      ustadz_nama: answers.ustadz_nama || null,
      answers,
      landing_variant: body.landing_variant,
      ...(body.tracking || {}),
    };
    const { id } = await leadStore.create(input);
    return NextResponse.json({ id });
  }

  // phase === "complete"
  if (!body.id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  await leadStore.update(body.id, {
    status: "complete",
    score: result.score,
    tier: result.tier,
    anonim: result.flags.anonim,
    ustadz_nama: answers.ustadz_nama || null,
    answers,
  });

  const lead: LeadInput & { id?: string } = {
    id: body.id,
    nama: (body.nama || "").trim(),
    wa_raw: body.wa_raw || "",
    wa_normalized: normalizeWa(body.wa_raw || "") || "",
    status: "complete",
    score: result.score,
    tier: result.tier,
    anonim: result.flags.anonim,
    ustadz_nama: answers.ustadz_nama || null,
    answers,
    landing_variant: body.landing_variant,
    ...(body.tracking || {}),
  };

  // Каждая завершённая заявка → в Telegram.
  await notifyLeadTelegram(lead);
  // Опциональный Slack-вебхук при тире A.
  if (result.tier === "A") await notifyTierA(lead);

  return NextResponse.json({ tier: result.tier });
}
