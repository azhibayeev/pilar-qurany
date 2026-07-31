export default function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = total > 0 ? Math.round((step / total) * 100) : 0;
  return (
    <div
      className="h-1 w-full bg-line"
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Langkah ${step} dari ${total}`}
    >
      <div className="h-full bg-accent transition-all duration-300" style={{ width: `${pct}%` }} />
    </div>
  );
}
