"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { CONTACT, CONTACT_EXTRA } from "@/content/quiz";
import { isValidWa } from "@/lib/wa";

interface Props {
  onSubmit: (nama: string, waRaw: string) => void;
  onBack: () => void;
  submitting: boolean;
  serverError?: string | null;
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 16c0-3 2.5-4.5 5.5-4.5S15.5 13 15.5 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function WaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2.5a7.5 7.5 0 00-6.4 11.4L2.5 17.5l3.7-1.1A7.5 7.5 0 1010 2.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M7.4 6.6c.2-.1.6-.1.8.3l.5 1c.1.2.1.4-.1.6l-.3.4c-.1.1-.1.3 0 .4.3.6 1 1.3 1.6 1.6.1.1.3.1.4 0l.4-.4c.2-.2.4-.2.6-.1l1 .5c.4.2.4.6.3.8-.3.7-1.1 1-1.8.9-1.8-.3-3.6-2.1-3.9-3.9-.1-.7.2-1.5.9-1.7z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ContactForm({ onSubmit, submitting, serverError }: Props) {
  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState(false);
  const namaRef = useRef<HTMLInputElement>(null);

  // Автофокус на имя — клавиатура открывается сразу, вписывать удобно (паттерн Finelo).
  useEffect(() => {
    const t = setTimeout(() => namaRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  const namaOk = nama.trim().length >= 2;
  const waOk = isValidWa(wa);
  const valid = namaOk && waOk && consent;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!valid || submitting) return;
    onSubmit(nama.trim(), wa.trim());
  }

  const fieldWrap = "relative";
  const leadIcon =
    "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted";
  const inputCls =
    "min-h-14 w-full rounded-xl border border-line bg-white pl-11 pr-4 text-base outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent";

  return (
    <form onSubmit={submit} className="mx-auto flex min-h-[calc(100dvh-3.75rem)] max-w-xl flex-col px-6 pb-6 pt-8" noValidate>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"
      >
        {CONTACT_EXTRA.value}
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="mt-4 text-2xl font-semibold leading-snug tracking-tight"
      >
        {CONTACT.heading}
      </motion.h2>
      <p className="mt-3 text-muted">{CONTACT.subheading}</p>

      <div className="mt-7 flex flex-col gap-4">
        <div className={fieldWrap}>
          <label htmlFor="nama" className="mb-2 block text-sm text-muted">
            {CONTACT.nama}
          </label>
          <span className={leadIcon} style={{ top: "calc(50% + 0.75rem)" }}>
            <UserIcon />
          </span>
          <input
            id="nama"
            ref={namaRef}
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className={inputCls}
            autoComplete="name"
          />
          {touched && !namaOk && <p className="mt-1 text-sm text-accent">Mohon isi nama.</p>}
        </div>

        <div className={fieldWrap}>
          <label htmlFor="wa" className="mb-2 block text-sm text-muted">
            {CONTACT.wa}
          </label>
          <span className={leadIcon} style={{ top: "calc(50% + 0.75rem)" }}>
            <WaIcon />
          </span>
          <input
            id="wa"
            type="tel"
            inputMode="tel"
            value={wa}
            onChange={(e) => setWa(e.target.value)}
            placeholder="08xxxxxxxxxx"
            className={inputCls}
            autoComplete="tel"
          />
          {touched && !waOk && <p className="mt-1 text-sm text-accent">Nomor WhatsApp tidak valid.</p>}
        </div>

        <label className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-muted">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-accent)]"
          />
          <span>
            {CONTACT.consent}{" "}
            <a href="/privasi" target="_blank" className="text-accent underline underline-offset-2">
              {CONTACT.consentLink}
            </a>
          </span>
        </label>
        {touched && !consent && <p className="-mt-2 text-sm text-accent">Mohon centang persetujuan.</p>}
      </div>

      {/* строка доверия с замком */}
      <div className="mt-5 flex items-start gap-2 text-sm text-muted">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0" aria-hidden="true">
          <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span>{CONTACT_EXTRA.trust}</span>
      </div>

      {serverError && <p className="mt-4 text-sm text-accent">{serverError}</p>}

      <div className="flex-1" />

      {/* прибитая снизу кнопка — как «CONTINUE» у Finelo */}
      <div className="sticky bottom-0 -mx-6 mt-8 border-t border-line/70 bg-bg/90 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-md">
        <motion.button
          type="submit"
          disabled={submitting}
          whileTap={{ scale: 0.98 }}
          className="min-h-14 w-full rounded-xl bg-accent px-6 text-lg font-medium text-white shadow-btn transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-40"
        >
          {submitting ? "…" : CONTACT.submit}
        </motion.button>
      </div>
    </form>
  );
}
