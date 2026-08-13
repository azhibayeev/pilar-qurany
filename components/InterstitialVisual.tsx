"use client";

import { motion } from "motion/react";

// Отдельное фото под каждый интерстишл (природа/предметы, без людей и текста).
// amal → колодец (садака, что течёт) · progress → библиотека (илм) ·
// steps → камни-ступени (langkah, bukan lompatan) · peta → тропа к рассвету (arah).
const MAP: Record<string, { src: string; alt: string }> = {
  amal: { src: "/interstitial-a.webp", alt: "Sumur tua dengan air yang terus mengalir" },
  progress: { src: "/interstitial-b.webp", alt: "Rak buku — ilmu yang tersimpan dan diteruskan" },
  steps: { src: "/interstitial-c.webp", alt: "Batu pijakan — langkah demi langkah" },
  peta: { src: "/interstitial-d.webp", alt: "Jalan setapak menuju cahaya pagi" },
};

export default function InterstitialVisual({ variant }: { variant: string }) {
  const it = MAP[variant] ?? MAP.amal;
  return (
    <div className="relative mx-auto mt-7 w-full max-w-[330px] overflow-hidden rounded-2xl border border-line shadow-soft">
      <motion.img
        src={it.src}
        alt={it.alt}
        width={1000}
        height={667}
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
        className="aspect-[3/2] w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
    </div>
  );
}
