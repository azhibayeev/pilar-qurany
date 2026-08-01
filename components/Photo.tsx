import { getPhoto } from "@/content/photos";

// Фото в карточке ответа. Placeholder → сплошной SVG. Реальное фото (status:licensed) →
// TODO: заменить на <picture> с <source type="image/avif"> + webp и srcset 144/288.
export default function Photo({ photoKey, eager }: { photoKey?: string; eager?: boolean }) {
  const p = getPhoto(photoKey);
  if (!p) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={p.src1x}
      srcSet={p.status === "licensed" ? `${p.src1x} 1x, ${p.src2x} 2x` : undefined}
      alt={p.alt}
      width={72}
      height={72}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className="h-[72px] w-[72px] shrink-0 rounded-lg bg-line object-cover"
    />
  );
}
