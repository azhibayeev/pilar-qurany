// Бренд-локап: иконка Qurany (+ опц. словесная марка). Логотип — зелёный чип с белой Q.
export default function Brand({ wordmark, className }: { wordmark?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Qurany" width={40} height={40} className="h-10 w-10 rounded-xl" />
      {wordmark && <span className="text-lg font-semibold tracking-tight">Qurany</span>}
    </div>
  );
}
