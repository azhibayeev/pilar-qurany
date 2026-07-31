import Link from "next/link";
import { LANDING, START_BUTTON, START_DISCLAIMER } from "@/lib/quiz/content";
import type { LandingVariant } from "@/lib/quiz/types";

// Лендинг — серверный компонент (ноль JS для героя, быстрый LCP).
// A/B через ?v=a|b|c (по умолчанию a). UTM/click-id проносим в /kuis.
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const vRaw = (Array.isArray(sp.v) ? sp.v[0] : sp.v) || "a";
  const v: LandingVariant = (["a", "b", "c"].includes(vRaw) ? vRaw : "a") as LandingVariant;
  const { h1, sub } = LANDING[v];

  const qs = new URLSearchParams();
  for (const [k, val] of Object.entries(sp)) {
    if (typeof val === "string") qs.set(k, val);
  }
  qs.set("v", v);

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6 py-16">
      <h1 className="text-[1.75rem] font-semibold leading-snug tracking-tight">{h1}</h1>
      <p className="mt-5 text-muted">{sub}</p>
      <Link
        href={`/kuis?${qs.toString()}`}
        className="mt-10 inline-flex min-h-14 items-center justify-center rounded-xl bg-accent px-6 text-lg font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
      >
        {START_BUTTON}
      </Link>
      <p className="mt-3 text-sm text-muted">{START_DISCLAIMER}</p>
    </main>
  );
}
