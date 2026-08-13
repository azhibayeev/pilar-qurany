"use client";

import { motion } from "motion/react";

// Декоративное превью «Peta Amal Jariyah» — тематический аналог продуктового мокапа Finelo.
// Показывает, ЧТО человек получит в конце (документ на 1 страницу), без изображения живых существ.
// Лёгкая парящая анимация + мягкое зелёное свечение под брендом.
export default function PetaPreview() {
  return (
    <div className="relative mx-auto mt-7 w-full max-w-[280px]">
      {/* мягкое свечение под карточкой */}
      <div
        aria-hidden="true"
        className="absolute inset-x-6 bottom-2 top-8 rounded-3xl bg-accent/20 blur-2xl"
      />
      <motion.div
        aria-hidden="true"
        initial={{ y: 8, opacity: 0, rotate: -1.5 }}
        animate={{ y: [0, -6, 0], opacity: 1, rotate: -1.5 }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.5 },
        }}
        className="relative rounded-2xl border border-line bg-white p-5 shadow-soft"
      >
        {/* шапка документа */}
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" width={22} height={22} className="h-[22px] w-[22px] rounded-md" />
          <div className="h-2.5 w-24 rounded-full bg-accent/80" />
        </div>

        {/* секция «sudah» */}
        <div className="mt-5">
          <div className="h-2 w-16 rounded-full bg-accent/30" />
          <div className="mt-2.5 space-y-2">
            {[100, 78].map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-accent/70" />
                <div className="h-2 rounded-full bg-line" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </div>

        {/* секция «belum» */}
        <div className="mt-5 border-t border-line pt-4">
          <div className="h-2 w-20 rounded-full bg-accent/30" />
          <div className="mt-2.5 space-y-2">
            {[92, 64, 80].map((w, i) => (
              <div key={i} className="h-2 rounded-full bg-line" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
