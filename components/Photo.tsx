import { getPhoto } from "@/content/photos";

// Фото в карточке ответа. Placeholder → сплошной SVG. Licensed → <picture> AVIF+WebP, srcset 144/288.
export default function Photo({ photoKey, eager }: { photoKey?: string; eager?: boolean }) {
  const p = getPhoto(photoKey);
  if (!p) return null;

  const imgClass = "h-[72px] w-[72px] shrink-0 rounded-lg bg-line object-cover";
  const loading = eager ? "eager" : "lazy";

  if (p.status === "placeholder") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={p.src1x} alt={p.alt} width={72} height={72} loading={loading} decoding="async" className={imgClass} />;
  }

  const avif1 = p.src1x.replace(/\.webp$/, ".avif");
  const avif2 = p.src2x.replace(/\.webp$/, ".avif");
  return (
    <picture>
      <source type="image/avif" srcSet={`${avif1} 1x, ${avif2} 2x`} />
      <source type="image/webp" srcSet={`${p.src1x} 1x, ${p.src2x} 2x`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.src1x} alt={p.alt} width={72} height={72} loading={loading} decoding="async" className={imgClass} />
    </picture>
  );
}
