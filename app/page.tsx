import Link from "next/link";
import Brand from "@/components/Brand";
import PromiseCard from "@/components/PromiseCard";
import SocialProof from "@/components/SocialProof";
import { CONFIG, LANDING } from "@/content/quiz";
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
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6 py-16">
      <Brand wordmark className="mb-8" />

      {CONFIG.PROMISE_ABOVE_H1 && (
        <div className="mb-8">
          <PromiseCard />
        </div>
      )}

      <h1 className="text-[1.75rem] font-semibold leading-snug tracking-tight">{h1}</h1>
      <p className="mt-5 text-muted">{sub}</p>

      {!CONFIG.PROMISE_ABOVE_H1 && (
        <div className="mt-8">
          <PromiseCard />
        </div>
      )}

      <Link
        href={`/kuis?${qs.toString()}`}
        className="mt-8 inline-flex min-h-14 items-center justify-center rounded-xl bg-accent px-6 text-lg font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
      >
        {LANDING.button}
      </Link>
      <p className="mt-3 text-sm text-muted">{LANDING.disclaimer}</p>
      <p className="mt-2 text-xs text-muted">{LANDING.subnote}</p>

      <div className="mt-5">
        <SocialProof />
      </div>
    </main>
  );
}
