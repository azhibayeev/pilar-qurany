"use client";

import { useEffect, useState } from "react";
import { CONFIG, SOCIAL_PROOF_TEMPLATE } from "@/content/quiz";

// Единственный счётчик. Значение — реальное из БД (/api/social-proof). Показываем ТОЛЬКО при N ≥ порога;
// маленькое число работает против нас. Никаких выдуманных цифр.
export default function SocialProof() {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/social-proof")
      .then((r) => r.json())
      .then((d) => setN(typeof d.count === "number" ? d.count : 0))
      .catch(() => setN(0));
  }, []);
  if (n === null || n < CONFIG.SOCIAL_PROOF_MIN) return null;
  const text = SOCIAL_PROOF_TEMPLATE.replace("{N}", new Intl.NumberFormat("id-ID").format(n));
  return <p className="text-sm text-muted">{text}</p>;
}
