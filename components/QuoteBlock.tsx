// Блок цитаты Корана/хадиса: левая линия, мелкий шрифт.
export default function QuoteBlock({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-2 border-accent pl-4 text-[0.95rem] leading-relaxed text-quote">
      {children}
    </blockquote>
  );
}
