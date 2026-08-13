import { LANDING } from "@/content/quiz";

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="mt-1 shrink-0" aria-hidden="true">
      <path d="M3.5 9.5l3.5 3.5 7.5-8" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PromiseCard() {
  const { heading, bullets } = LANDING.promise;
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
      <p className="font-semibold">{heading}</p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2.5 text-[0.95rem] leading-snug">
            <Check />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
