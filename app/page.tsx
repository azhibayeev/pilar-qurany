import Link from "next/link";
import Brand from "@/components/Brand";
import PromiseCard from "@/components/PromiseCard";
import SocialProof from "@/components/SocialProof";
import { LANDING } from "@/content/quiz";
import type { LandingVariant } from "@/lib/quiz/types";

// Лендинг — серверный компонент (быстрый LCP). A/B через ?v=a|b|c. UTM/click-id проносим в /kuis.
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const vRaw = (Array.isArray(sp.v) ? sp.v[0] : sp.v) || "a";
  const v: LandingVariant = (["a", "b", "c"].includes(vRaw) ? vRaw : "a") as LandingVariant;
  const { h1, sub } = LANDING.variants[v];

  const qs = new URLSearchParams();
  for (const [k, val] of Object.entries(sp)) {
    if (typeof val === "string") qs.set(k, val);
  }
  qs.set("v", v);

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6 py-14">
      <div className="reveal" style={{ animationDelay: "0ms" }}>
        <Brand wordmark className="mb-6" />
      </div>

      {/* Герой-фото: символ amal jariyah (дерево у ручья), в брендовой зелёной гамме. */}
      <div
        className="reveal relative mb-7 overflow-hidden rounded-2xl border border-line shadow-soft"
        style={{ animationDelay: "80ms" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero.webp"
          alt="Aliran yang terus mengalir — perumpamaan amal jariyah"
          width={1024}
          height={683}
          className="aspect-[3/2] w-full origin-center object-cover [animation:heroZoom_1.2s_cubic-bezier(0.22,0.61,0.36,1)_both]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>

      <h1 className="reveal text-[1.75rem] font-semibold leading-snug tracking-tight" style={{ animationDelay: "160ms" }}>
        {h1}
      </h1>
      <p className="reveal mt-4 text-muted" style={{ animationDelay: "240ms" }}>
        {sub}
      </p>

      <div className="reveal mt-7" style={{ animationDelay: "320ms" }}>
        <PromiseCard />
      </div>

      <Link
        href={`/kuis?${qs.toString()}`}
        className="reveal mt-7 inline-flex min-h-14 items-center justify-center rounded-xl bg-accent px-6 text-lg font-medium text-white shadow-btn transition-all hover:bg-[var(--color-accent-hover)] active:translate-y-px"
        style={{ animationDelay: "400ms" }}
      >
        {LANDING.button}
      </Link>
      <p className="reveal mt-3 text-sm text-muted" style={{ animationDelay: "460ms" }}>
        {LANDING.disclaimer}
      </p>
      <p className="reveal mt-2 text-xs text-muted" style={{ animationDelay: "500ms" }}>
        {LANDING.subnote}
      </p>

      <div className="reveal mt-5" style={{ animationDelay: "560ms" }}>
        <SocialProof />
      </div>
    </main>
  );
}
