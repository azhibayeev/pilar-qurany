import { describe, expect, it } from "vitest";
import { buildPeta } from "./peta";
import { computeScore } from "./scoring";
import type { QuizAnswers } from "./types";

describe("computeScore v2", () => {
  it("граница 21 → C, Q8 скрыт", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah"], // 4
      jejak: "perantara", // 3
      nama: "sembunyi", // 2
      warisan: "usaha", // 3
      hambatan: "laporan", // 4
      minat: "aplikasi", // 2
      keputusan: "keluarga", // 3
    }; // 21
    const r = computeScore(a);
    expect(r.intermediateScore).toBe(21);
    expect(r.showQ8).toBe(false);
    expect(r.tier).toBe("C");
  });

  it("граница 22 → B, Q8 виден", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah"], // 4
      jejak: "lihat", // 4
      nama: "sembunyi", // 2
      warisan: "usaha", // 3
      hambatan: "laporan", // 4
      minat: "aplikasi", // 2
      keputusan: "keluarga", // 3
    }; // 22
    const r = computeScore(a);
    expect(r.intermediateScore).toBe(22);
    expect(r.showQ8).toBe(true);
    expect(r.tier).toBe("B");
  });

  it("граница 37 (kapasitas 75-150) → B", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah", "ilmu"], // 8
      jejak: "lihat", // 4
      nama: "sembunyi", // 2
      warisan: "lembaga", // 8
      hambatan: "percaya", // 2
      minat: "semua", // 0
      keputusan: "keluarga", // 3  → 27
      kapasitas: "75-150", // +10 → 37
    };
    const r = computeScore(a);
    expect(r.score).toBe(37);
    expect(r.tier).toBe("B");
  });

  it("граница 38 (kapasitas 75-150) → A", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah", "ilmu"], // 8
      jejak: "lihat", // 4
      nama: "sembunyi", // 2
      warisan: "anak", // 5
      hambatan: "laporan", // 4
      minat: "aplikasi", // 2
      keputusan: "keluarga", // 3  → 28
      kapasitas: "75-150", // +10 → 38
    };
    const r = computeScore(a);
    expect(r.score).toBe(38);
    expect(r.tier).toBe("A");
  });

  it("тир A — оба условия: балл≥38 И kapasitas∈{75-150,>150,langsung}", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah", "ilmu"], // 8
      jejak: "ganggu", // 6
      nama: "sembunyi", // 2
      warisan: "lembaga", // 8
      hambatan: "rutin", // 6
      minat: "aplikasi", // 2
      keputusan: "sendiri", // 6  → 38
      kapasitas: "75-150", // +10 → 48
    };
    const r = computeScore(a);
    expect(r.score).toBe(48);
    expect(r.tier).toBe("A");
    expect(r.flags.anonim).toBe(true);
  });

  it("балл≥38, но kapasitas=30-75 (не в гейте A) → B [новая полоса +6]", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah", "ilmu"],
      jejak: "ganggu",
      nama: "sembunyi",
      warisan: "lembaga",
      hambatan: "rutin",
      minat: "aplikasi",
      keputusan: "sendiri", // 38
      kapasitas: "30-75", // +6 → 44, но полоса не в KAP_A
    };
    const r = computeScore(a);
    expect(r.score).toBe(44);
    expect(r.tier).toBe("B");
  });

  it("высокий балл + kapasitas=<20 → потолок B", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah", "ilmu"],
      jejak: "ganggu",
      nama: "sembunyi",
      warisan: "lembaga",
      hambatan: "rutin",
      minat: "aplikasi",
      keputusan: "sendiri", // 38
      kapasitas: "<20", // +0 → 38
    };
    const r = computeScore(a);
    expect(r.score).toBe(38);
    expect(r.tier).toBe("B");
    expect(r.flags.cappedB).toBe(true);
  });

  it("hambatan=pendapatan → потолок B, даже при балле на A", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah", "ilmu"], // 8
      jejak: "ganggu", // 6
      nama: "sembunyi", // 2
      warisan: "lembaga", // 8
      hambatan: "pendapatan", // 0
      minat: "aplikasi", // 2
      keputusan: "sendiri", // 6 → 32
      kapasitas: ">150", // +14 → 46
    };
    const r = computeScore(a);
    expect(r.score).toBe(46);
    expect(r.tier).toBe("B");
    expect(r.flags.cappedB).toBe(true);
  });

  it("jejak=tidak_ganggu & warisan=belum → форс C, Q8 скрыт", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah", "ilmu"], // 8
      jejak: "tidak_ganggu", // 0
      nama: "sembunyi", // 2
      warisan: "belum", // 0
      hambatan: "rutin", // 6
      minat: "aplikasi", // 2
      keputusan: "sendiri", // 6 → 24
    };
    const r = computeScore(a);
    expect(r.intermediateScore).toBe(24);
    expect(r.flags.forcedC).toBe(true);
    expect(r.showQ8).toBe(false);
    expect(r.tier).toBe("C");
  });

  it("Q1 «belum» эксклюзивен — обнуляет остальные", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah", "ilmu", "belum"], // → 0
      jejak: "lihat", // 4
      nama: "belum", // 0
      warisan: "belum", // 0 (jejak≠tidak_ganggu → не форс C)
      hambatan: "pendapatan", // 0
      minat: "semua", // 0
      keputusan: "keluarga", // 3
    };
    const r = computeScore(a);
    expect(r.intermediateScore).toBe(7);
    expect(r.tier).toBe("C");
  });

  it("флаги: family (keluarga), docsFirst (percaya), anonim=false (sebut)", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah"],
      jejak: "lihat",
      nama: "sebut",
      warisan: "usaha",
      hambatan: "percaya",
      minat: "aplikasi",
      keputusan: "keluarga",
    };
    const r = computeScore(a);
    expect(r.flags.ctaVariant).toBe("family");
    expect(r.flags.docsFirst).toBe(true);
    expect(r.flags.anonim).toBe(false);
  });

  it("новая полоса Q8 = 20-30 даёт +2", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah"], // 4
      jejak: "lihat", // 4
      nama: "sembunyi", // 2
      warisan: "usaha", // 3
      hambatan: "laporan", // 4
      minat: "aplikasi", // 2
      keputusan: "keluarga", // 3 → 22
      kapasitas: "20-30", // +2 → 24
    };
    const r = computeScore(a);
    expect(r.score).toBe(24);
    expect(r.tier).toBe("B");
  });

  it("новая полоса Q8 = 30-75 даёт +6, балл 40 но гейт A не пройден → B", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah", "ilmu"], // 8
      jejak: "ganggu", // 6
      nama: "sembunyi", // 2
      warisan: "lembaga", // 8
      hambatan: "percaya", // 2
      minat: "aplikasi", // 2
      keputusan: "sendiri", // 6 → 34
      kapasitas: "30-75", // +6 → 40
    };
    const r = computeScore(a);
    expect(r.score).toBe(40);
    expect(r.tier).toBe("B");
  });
});

describe("buildPeta", () => {
  it("делит три амаль на sudah/belum и уважает анонимность", () => {
    const p = buildPeta({ amal_jariyah: ["jariyah"], nama: "sembunyi", minat: "aplikasi" });
    expect(p.sudah).toEqual(["Sedekah jariyah"]);
    expect(p.belum.map((b) => b.name)).toEqual(["Ilmu yang bermanfaat", "Anak saleh yang mendoakan"]);
    expect(p.anonim).toBe(true);
    expect(p.bagian).toBeTruthy();
  });

  it("«belum» в Q1 → нет ни одного sudah", () => {
    const p = buildPeta({ amal_jariyah: ["belum"], nama: "sebut" });
    expect(p.sudah).toEqual([]);
    expect(p.belum.length).toBe(3);
    expect(p.anonim).toBe(false);
  });
});
