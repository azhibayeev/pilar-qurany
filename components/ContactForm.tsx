"use client";

import { useState } from "react";
import { CONTACT } from "@/content/quiz";
import { isValidWa } from "@/lib/wa";

interface Props {
  onSubmit: (nama: string, waRaw: string) => void;
  onBack: () => void;
  submitting: boolean;
  serverError?: string | null;
}

export default function ContactForm({ onSubmit, onBack, submitting, serverError }: Props) {
  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState(false);

  const namaOk = nama.trim().length >= 2;
  const waOk = isValidWa(wa);
  const valid = namaOk && waOk && consent;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!valid || submitting) return;
    onSubmit(nama.trim(), wa.trim());
  }

  return (
    <div className="mx-auto max-w-xl px-6 pb-16 pt-6">
      <button
        onClick={onBack}
        className="mb-6 text-sm text-muted underline-offset-4 hover:underline"
        aria-label="Kembali"
      >
        ← Kembali
      </button>

      <h2 className="text-xl font-semibold leading-snug tracking-tight">{CONTACT.heading}</h2>
      <p className="mt-3 text-muted">{CONTACT.subheading}</p>

      <form onSubmit={submit} className="mt-7 flex flex-col gap-5" noValidate>
        <div>
          <label htmlFor="nama" className="mb-2 block text-sm text-muted">
            {CONTACT.nama}
          </label>
          <input
            id="nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="min-h-14 w-full rounded-xl border border-line bg-white px-4 text-base outline-none focus:border-accent"
            autoComplete="name"
          />
          {touched && !namaOk && <p className="mt-1 text-sm text-accent">Mohon isi nama.</p>}
        </div>

        <div>
          <label htmlFor="wa" className="mb-2 block text-sm text-muted">
            {CONTACT.wa}
          </label>
          <input
            id="wa"
            type="tel"
            inputMode="tel"
            value={wa}
            onChange={(e) => setWa(e.target.value)}
            placeholder="08xxxxxxxxxx"
            className="min-h-14 w-full rounded-xl border border-line bg-white px-4 text-base outline-none focus:border-accent"
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

        {serverError && <p className="text-sm text-accent">{serverError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 min-h-14 w-full rounded-xl bg-accent px-6 text-lg font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-40"
        >
          {submitting ? "…" : CONTACT.submit}
        </button>
      </form>
    </div>
  );
}
