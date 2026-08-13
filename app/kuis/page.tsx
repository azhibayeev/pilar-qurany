"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import ContactForm from "@/components/ContactForm";
import InsightScreen from "@/components/InsightScreen";
import PreparingScreen from "@/components/PreparingScreen";
import QuestionScreen from "@/components/QuestionScreen";
import QuizHeader from "@/components/QuizHeader";
import ResultScreen from "@/components/ResultScreen";
import { INSIGHTS, QUESTIONS } from "@/content/quiz";
import { questionProgress, QUESTION_ORDER, quizScreens } from "@/lib/quiz/flow";
import { computeScore } from "@/lib/quiz/scoring";
import type { LandingVariant, Question, QuestionId, QuizAnswers, ScreenId } from "@/lib/quiz/types";
import { newEventId, pixelTrack } from "@/lib/pixels";
import { captureTracking, type Tracking } from "@/lib/tracking";

const Q_BY_ID = new Map<string, Question>(QUESTIONS.map((q) => [q.id, q]));
const isQuestion = (s: ScreenId): s is QuestionId => QUESTION_ORDER.includes(s as QuestionId);

// Переходы между экранами: forward — вправо→влево, back — влево→вправо.
const screenVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 28 : -28 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir >= 0 ? -28 : 28 }),
};

// Последовательность внутри /kuis (без landing).
function seq(answers: QuizAnswers): ScreenId[] {
  return quizScreens(answers).filter((s) => s !== "landing");
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
  const [prepDone, setPrepDone] = useState(false);
  const [dir, setDir] = useState(1); // направление перехода: 1 — вперёд, -1 — назад

  const contact = useRef<{ nama: string; wa: string }>({ nama: "", wa: "" });
  const variant = useRef<LandingVariant>("a");
  const tracking = useRef<Tracking>({});
  const started = useRef(false);
  const completed = useRef(false);
  const insightsFired = useRef<Set<string>>(new Set());

  useEffect(() => {
    try {
      const a = sessionStorage.getItem(SS_ANSWERS);
      const s = sessionStorage.getItem(SS_SCREEN);
      const l = sessionStorage.getItem(SS_LEAD);
      if (a) setAnswers(JSON.parse(a));
      if (s) setScreen(s as ScreenId);
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

  function nextFrom(current: ScreenId, merged: QuizAnswers): ScreenId {
    const s = seq(merged);
    const idx = s.indexOf(current);
    return s[Math.min(idx + 1, s.length - 1)];
  }
  function prevFrom(current: ScreenId): ScreenId {
    const s = seq(answers);
    const idx = s.indexOf(current);
    return s[Math.max(idx - 1, 0)];
  }

  function fireArrivalEvents(next: ScreenId, merged: QuizAnswers) {
    if (isQuestion(next)) {
      const qs = seq(merged).filter(isQuestion);
      const idx = qs.indexOf(next);
      if (idx >= 0) pixelTrack(`QuizStep${idx + 1}`);
    } else if (next.startsWith("insight")) {
      const key = next.slice("insight".length); // A | B | C | D
      if (!insightsFired.current.has(key)) {
        insightsFired.current.add(key);
        pixelTrack(`InsightView${key}`);
      }
    }
  }

  function goTo(next: ScreenId, merged: QuizAnswers) {
    setDir(1);
    setScreen(next);
    fireArrivalEvents(next, merged);
    if (next === "preparing") void onComplete(merged);
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
    setDir(-1);
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

  // Финализация: происходит на экране «подготовки». prepDone управляет честным прогрессом.
  async function onComplete(merged: QuizAnswers) {
    if (completed.current) {
      setPrepDone(true);
      return;
    }
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
    try {
      if (leadId) {
        await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phase: "complete",
            id: leadId,
            nama: contact.current.nama,
            wa_raw: contact.current.wa,
            answers: merged,
            landing_variant: variant.current,
            tracking: tracking.current,
          }),
        });
      }
    } catch {
      /* результат всё равно покажем — скоринг на клиенте */
    }
    setPrepDone(true);
  }

  // ── Рендер ──────────────────────────────────────────────────────────────────
  // Полноэкранные спец-экраны — без общей шапки (свой контекст).
  if (screen === "result") {
    return <ResultScreen result={computeScore(answers)} answers={answers} />;
  }
  if (screen === "preparing") {
    return <PreparingScreen done={prepDone} onFinish={() => setScreen("result")} />;
  }

  // Экраны квиза под общей липкой шапкой (вопросы · интерстишлы · контакт).
  let node: React.ReactNode = null;
  let counter: { step: number; total: number } | null = null;

  if (screen === "contact") {
    node = <ContactForm onSubmit={submitContact} onBack={back} submitting={submitting} serverError={serverError} />;
  } else if (screen.startsWith("insight")) {
    const key = screen.slice("insight".length) as "A" | "B" | "C" | "D";
    node = <InsightScreen insight={INSIGHTS[key]} onNext={advance} onBack={back} />;
  } else {
    const q = Q_BY_ID.get(screen);
    if (!q) return null;
    const prog = questionProgress(screen as QuestionId);
    counter = prog;
    node = (
      <QuestionScreen
        question={q}
        answers={answers}
        onPatch={patch}
        onAnswerAndAdvance={answerAndAdvance}
        onAdvance={advance}
        onBack={back}
        canBack={seq(answers).indexOf(screen) > 0}
        progress={prog}
      />
    );
  }

  const canBack = seq(answers).indexOf(screen) > 0;
  const order = seq(answers).filter((s) => s !== "preparing" && s !== "result");
  const gIdx = order.indexOf(screen);
  const globalPct = gIdx >= 0 && order.length > 1 ? Math.round(((gIdx + 1) / order.length) * 100) : 100;

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-dvh overflow-x-hidden">
        <QuizHeader pct={globalPct} counter={counter} canBack={canBack} onBack={back} />
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={screen}
            custom={dir}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {node}
          </motion.div>
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
