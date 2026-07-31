import { describe, expect, it } from "vitest";
import { computeScore } from "./scoring";
import type { QuizAnswers } from "./types";

describe("computeScore", () => {
  it("граница 21 → тир C, Q8 не показывается", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah"], // 4
      jejak: "perantara", // 3
      nama: "sembunyi", // 2
      warisan: "usaha", // 3
      hambatan: "laporan", // 4
      minat: "aplikasi", // 2
      keputusan: "keluarga", // 3
    }; // = 21
    const r = computeScore(a);
    expect(r.intermediateScore).toBe(21);
    expect(r.showQ8).toBe(false);
    expect(r.score).toBe(21);
    expect(r.tier).toBe("C");
  });

  it("граница 22 → тир B, Q8 показывается", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah"], // 4
      jejak: "lihat", // 4
      nama: "sembunyi", // 2
      warisan: "usaha", // 3
      hambatan: "laporan", // 4
      minat: "aplikasi", // 2
      keputusan: "keluarga", // 3
    }; // = 22
    const r = computeScore(a);
    expect(r.intermediateScore).toBe(22);
    expect(r.showQ8).toBe(true);
    expect(r.score).toBe(22);
    expect(r.tier).toBe("B");
  });

  it("граница 37 (с квалифиц. kapasitas) → тир B", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah", "ilmu"], // 8
      jejak: "lihat", // 4
      nama: "sembunyi", // 2
      warisan: "lembaga", // 8
      hambatan: "percaya", // 2
      minat: "semua", // 0
      keputusan: "keluarga", // 3  → intermediate 27
      kapasitas: "75-150", // +10 → 37
    };
    const r = computeScore(a);
    expect(r.intermediateScore).toBe(27);
    expect(r.score).toBe(37);
    expect(r.tier).toBe("B"); // 37 < 38
  });

  it("граница 38 (с квалифиц. kapasitas) → тир A", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah", "ilmu"], // 8
      jejak: "lihat", // 4
      nama: "sembunyi", // 2
      warisan: "anak", // 5
      hambatan: "laporan", // 4
      minat: "aplikasi", // 2
      keputusan: "keluarga", // 3  → intermediate 28
      kapasitas: "75-150", // +10 → 38
    };
    const r = computeScore(a);
    expect(r.intermediateScore).toBe(28);
    expect(r.score).toBe(38);
    expect(r.tier).toBe("A");
  });

  it("чистый A: высокий балл + kapasitas 75-150", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah", "ilmu"], // 8
      jejak: "ganggu", // 6
      nama: "sembunyi", // 2
      warisan: "lembaga", // 8
      hambatan: "rutin", // 6
      minat: "aplikasi", // 2
      keputusan: "sendiri", // 6  → intermediate 38
      kapasitas: "75-150", // +10 → 48
    };
    const r = computeScore(a);
    expect(r.score).toBe(48);
    expect(r.tier).toBe("A");
    expect(r.flags.anonim).toBe(true); // nama = sembunyi
  });

  it("тот же высокий балл, но kapasitas <20 → потолок B", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah", "ilmu"],
      jejak: "ganggu",
      nama: "sembunyi",
      warisan: "lembaga",
      hambatan: "rutin",
      minat: "aplikasi",
      keputusan: "sendiri", // intermediate 38
      kapasitas: "<20", // +0 → 38, но не проходит гейт A
    };
    const r = computeScore(a);
    expect(r.score).toBe(38);
    expect(r.tier).toBe("B");
    expect(r.flags.cappedB).toBe(true);
  });

  it("hambatan=pendapatan → потолок B, даже если балл тянет на A", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah", "ilmu"], // 8
      jejak: "ganggu", // 6
      nama: "sembunyi", // 2
      warisan: "lembaga", // 8
      hambatan: "pendapatan", // 0
      minat: "aplikasi", // 2
      keputusan: "sendiri", // 6  → intermediate 32
      kapasitas: ">150", // +14 → 46 (в норме A)
    };
    const r = computeScore(a);
    expect(r.score).toBe(46);
    expect(r.tier).toBe("B"); // потолок из-за pendapatan
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
      keputusan: "sendiri", // 6  → intermediate 24
    };
    const r = computeScore(a);
    expect(r.intermediateScore).toBe(24);
    expect(r.flags.forcedC).toBe(true);
    expect(r.showQ8).toBe(false);
    expect(r.tier).toBe("C");
  });

  it("Q1: «belum» эксклюзивен — обнуляет остальные выбранные", () => {
    const a: QuizAnswers = {
      amal_jariyah: ["jariyah", "ilmu", "belum"], // → только belum, 0
      jejak: "lihat", // 4
      nama: "belum", // 0
      warisan: "belum", // 0 (jejak≠tidak_ganggu → не форс C)
      hambatan: "pendapatan", // 0
      minat: "semua", // 0
      keputusan: "keluarga", // 3
    };
    const r = computeScore(a);
    expect(r.intermediateScore).toBe(7); // 0 + 4 + 0 + 0 + 0 + 0 + 3
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
});
