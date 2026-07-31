"use client";

import { useEffect, useRef, useState } from "react";
import ContactForm from "@/components/ContactForm";
import ProgressBar from "@/components/ProgressBar";
import QuestionScreen from "@/components/QuestionScreen";
import ResultScreen from "@/components/ResultScreen";
import { QUESTIONS } from "@/lib/quiz/content";
import { AFTER_CONTACT, BEFORE_CONTACT } from "@/lib/quiz/flow";
import { computeScore } from "@/lib/quiz/scoring";
import type { LandingVariant, Question, QuizAnswers } from "@/lib/quiz/types";
import { newEventId, pixelTrack } from "@/lib/pixels";
import { captureTracking, type Tracking } from "@/lib/tracking";

type ScreenId = string; // id вопроса | "contact" | "result"

const Q_BY_ID = new Map<string, Question>(QUESTIONS.map((q) => [q.id, q]));

function sequence(answers: QuizAnswers): ScreenId[] {
  const { showQ8 } = computeScore(answers);
  return [...BEFORE_CONTACT, "contact", ...AFTER_CONTACT, ...(showQ8 ? ["kapasitas"] : []), "result"];
}

const SS_ANSWERS = "pilar_answers";
const SS_SCREEN = "pilar_screen";
const SS_LEAD = "pilar_lead";

export default function KuisPage() {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [screen, setScreen] = useState<ScreenId>("amal_jariyah");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const contact = useRef<{ nama: string; wa: string }>({ nama: "", wa: "" });
  const variant = useRef<LandingVariant>("a");
  const tracking = useRef<Tracking>({});
  const started = useRef(false);
  const completed = useRef(false);

  // Инициализация из URL + sessionStorage (перезагрузка не сбрасывает прогресс).
  useEffect(() => {
    try {
      const a = sessionStorage.getItem(SS_ANSWERS);
      const s = sessionStorage.getItem(SS_SCREEN);
      const l = sessionStorage.getItem(SS_LEAD);
      if (a) setAnswers(JSON.parse(a));
      if (s) setScreen(s);
      if (l) setLeadId(l);
    } catch {
      /* ignore */
    }
    const p = new URLSearchParams(window.location.search);
    const v = p.get("v");
    if (v === "a" || v === "b" || v === "c") variant.current = v;
    tracking.current = captureTracking();
    if (!started.current) {
      started.current = true;
      pixelTrack("QuizStart", { variant: variant.current });
    }
  }, []);

  // Персист (ответы — не PII; PII/номер держим только в памяти).
  useEffect(() => {
    try {
      sessionStorage.setItem(SS_ANSWERS, JSON.stringify(answers));
    } catch {
      /* ignore */
    }
  }, [answers]);
  useEffect(() => {
    try {
      sessionStorage.setItem(SS_SCREEN, screen);
    } catch {
      /* ignore */
    }
  }, [screen]);
  useEffect(() => {
    if (leadId)
      try {
        sessionStorage.setItem(SS_LEAD, leadId);
      } catch {
        /* ignore */
      }
  }, [leadId]);

  const seq = sequence(answers);
  const navScreens = seq.filter((s) => s !== "result");
  const stepIndex = Math.max(0, navScreens.indexOf(screen));

  function nextFrom(current: ScreenId, merged: QuizAnswers): ScreenId {
    const s = sequence(merged);
    const idx = s.indexOf(current);
    return s[Math.min(idx + 1, s.length - 1)];
  }
  function prevFrom(current: ScreenId): ScreenId {
    const s = sequence(answers);
    const idx = s.indexOf(current);
    return s[Math.max(idx - 1, 0)];
  }

  function goTo(next: ScreenId, merged: QuizAnswers) {
    setScreen(next);
    if (next !== "contact" && next !== "result") {
      const idx = sequence(merged).filter((x) => x !== "result").indexOf(next);
      if (idx >= 0) pixelTrack(`QuizStep${idx + 1}`);
    }
    if (next === "result") void onComplete(merged);
  }

  function patch(p: Partial<QuizAnswers>) {
    setAnswers((a) => ({ ...a, ...p }));
  }
  function answerAndAdvance(p: Partial<QuizAnswers>) {
    const merged = { ...answers, ...p };
    setAnswers(merged);
    goTo(nextFrom(screen, merged), merged);
  }
  function advance() {
    goTo(nextFrom(screen, answers), answers);
  }
  function back() {
    setScreen(prevFrom(screen));
  }

  async function submitContact(nama: string, waRaw: string) {
    contact.current = { nama, wa: waRaw };
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: "partial",
          nama,
          wa_raw: waRaw,
          answers,
          landing_variant: variant.current,
          tracking: tracking.current,
        }),
      });
      if (!res.ok) {
        setServerError("Gagal menyimpan. Coba lagi.");
        setSubmitting(false);
        return;
      }
      const j = (await res.json()) as { id: string };
      setLeadId(j.id);

      const eid = newEventId();
      pixelTrack("Lead", {}, eid);
      fetch("/api/capi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Lead", eventId: eid, wa: waRaw, nama, fbclid: tracking.current.fbclid }),
      }).catch(() => {});

      setSubmitting(false);
      goTo(nextFrom("contact", answers), answers);
    } catch {
      setServerError("Gagal menyimpan. Coba lagi.");
      setSubmitting(false);
    }
  }

  async function onComplete(merged: QuizAnswers) {
    if (completed.current) return;
    completed.current = true;
    const r = computeScore(merged);
    pixelTrack("QuizComplete", { tier: r.tier });
    pixelTrack(`Tier${r.tier}`);

    const eid = newEventId();
    fetch("/api/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "QuizComplete",
        eventId: eid,
        wa: contact.current.wa,
        nama: contact.current.nama,
        fbclid: tracking.current.fbclid,
        custom: { tier: r.tier },
      }),
    }).catch(() => {});

    if (leadId) {
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: "complete",
          id: leadId,
          nama: contact.current.nama,
          wa_raw: contact.current.wa,
          answers: merged,
          landing_variant: variant.current,
        }),
      }).catch(() => {});
    }
  }

  if (screen === "result") {
    return <ResultScreen result={computeScore(answers)} minatId={answers.minat} />;
  }

  const q = Q_BY_ID.get(screen);

  return (
    <main className="min-h-dvh">
      <ProgressBar step={stepIndex + 1} total={navScreens.length} />
      {screen === "contact" ? (
        <ContactForm
          onSubmit={submitContact}
          onBack={back}
          submitting={submitting}
          serverError={serverError}
        />
      ) : q ? (
        <QuestionScreen
          question={q}
          answers={answers}
          onPatch={patch}
          onAnswerAndAdvance={answerAndAdvance}
          onAdvance={advance}
          onBack={back}
          canBack={stepIndex > 0}
        />
      ) : null}
    </main>
  );
}
