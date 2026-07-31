// ВЕСЬ пользовательский текст квиза (bahasa Indonesia) + баллы опций.
// Тексты — дословно из спеки, НЕ переписывать. Менять баллы = менять points здесь.

import type { LandingVariant, Question, Tier } from "./types";

export const LANDING: Record<LandingVariant, { h1: string; sub: string }> = {
  a: {
    h1: "Apa dari yang Bapak/Ibu kerjakan yang akan tetap bekerja setelah Bapak/Ibu tiada?",
    sub: "7 pertanyaan. Di akhir — analisis model amal Bapak/Ibu dan cara memeriksanya lewat dokumen.",
  },
  b: {
    h1: "Bapak/Ibu bersedekah. Bapak/Ibu tahu apa yang terjadi setelahnya?",
    sub: "7 pertanyaan tentang cara Bapak/Ibu memberi — dan kenapa jejaknya biasanya tidak tertinggal.",
  },
  c: {
    h1: "Tiga amal tidak terputus setelah kematian. Periksa yang mana sudah Bapak/Ibu miliki.",
    sub: "Hadis — Muslim, 1631. 7 pertanyaan, analisis di akhir.",
  },
};

export const START_BUTTON = "Mulai";
export const START_DISCLAIMER = "Tidak ada permintaan dana. Kami hanya mengirim hasil analisis.";

// Порядок Q1–Q7 фиксированный; Q8 условный (см. flow.ts / scoring.ts).
export const QUESTIONS: Question[] = [
  {
    id: "amal_jariyah",
    kind: "multi",
    intro:
      "Rasulullah ﷺ bersabda: «Apabila manusia meninggal, terputuslah amalnya kecuali tiga: sedekah jariyah, ilmu yang bermanfaat, dan anak saleh yang mendoakannya» (Muslim, 1631).",
    prompt: "Yang mana dari ketiganya sudah Bapak/Ibu miliki?",
    options: [
      { id: "jariyah", label: "Sedekah jariyah — ada sesuatu yang berjalan tanpa saya", points: 4 },
      { id: "ilmu", label: "Ilmu — saya mengajar, membiayai pendidikan, atau menerbitkan", points: 4 },
      { id: "anak", label: "Anak saleh yang mendoakan", points: 0 },
      {
        id: "belum",
        label: "Belum satu pun — dan saya belum pernah melihatnya seperti ini",
        points: 0,
        exclusive: true,
      },
    ],
  },
  {
    id: "jejak",
    kind: "single",
    prompt: "Ingat sedekah besar terakhir Bapak/Ibu. Apakah Bapak/Ibu tahu apa yang terjadi setelahnya?",
    options: [
      { id: "lihat", label: "Ya, saya melihat hasilnya sendiri", points: 4 },
      { id: "tidak_ganggu", label: "Tidak, dan itu tidak mengganggu saya — yang penting niat", points: 0 },
      { id: "ganggu", label: "Tidak, dan itu mengganggu saya", points: 6 },
      { id: "perantara", label: "Lewat perantara, dan sampai sekarang saya tidak tahu", points: 3 },
    ],
  },
  {
    id: "nama",
    kind: "single",
    prompt: "Nama pemberi sebaiknya disebut atau disembunyikan?",
    options: [
      {
        id: "sembunyi",
        label:
          "Disembunyikan. «Jika kamu menyembunyikannya dan memberikannya kepada orang fakir, itu lebih baik bagimu» (QS 2:271)",
        points: 2,
      },
      {
        id: "sebut",
        label: "Disebut. Utsman membeli sumur Rumah, dan itu tercatat atas namanya (Tirmidzi, 3703)",
        points: 2,
      },
      {
        id: "tergantung",
        label: "Tergantung amalnya: satu diam-diam, satu terbuka (QS 2:274 menyebut keduanya)",
        points: 2,
      },
      { id: "belum", label: "Belum memutuskan — saya ingin memahaminya", points: 0 },
    ],
  },
  {
    id: "warisan",
    kind: "single",
    prompt: "Apa yang harus tetap ada 30 tahun setelah Bapak/Ibu?",
    options: [
      { id: "usaha", label: "Usaha yang berjalan tanpa saya", points: 3 },
      { id: "anak", label: "Anak-anak yang tetap menjaga agamanya", points: 5 },
      { id: "lembaga", label: "Lembaga — sekolah, masjid, yayasan — yang saya ikut bangun", points: 8 },
      { id: "belum", label: "Jujur saja: saya belum berpikir sejauh 30 tahun", points: 0 },
    ],
  },
  {
    id: "hambatan",
    kind: "single",
    prompt: "Apa yang paling sering menghambat Bapak/Ibu memberi secara rutin, bukan sesekali?",
    options: [
      { id: "percaya", label: "Saya tidak percaya pada pengelola penggalangan dana", points: 2 },
      { id: "laporan", label: "Tidak ada laporan — saya tidak tahu dananya ke mana", points: 4 },
      { id: "prioritas", label: "Saya tidak tahu di mana yang paling dibutuhkan sekarang", points: 4 },
      { id: "pendapatan", label: "Pendapatan tidak tetap, berat berkomitmen setahun", points: 0 },
      { id: "rutin", label: "Tidak ada — saya sudah memberi secara rutin", points: 6 },
    ],
  },
  {
    id: "minat",
    kind: "single",
    prompt: "Bagian mana yang paling dekat dengan Bapak/Ibu?",
    options: [
      { id: "aplikasi", label: "Aplikasi — agar siapa pun bisa membuka Al-Qur'an tanpa membayar", points: 2 },
      { id: "pendidikan", label: "Pendidikan — guru, kelas, program bagi yang sudah bisa membaca", points: 2 },
      { id: "infrastruktur", label: "Infrastruktur — gedung, ruang kelas, perangkat", points: 2 },
      { id: "semua", label: "Semuanya — silakan Anda yang mengatur", points: 0 },
    ],
  },
  {
    id: "keputusan",
    kind: "single",
    prompt: "Bagaimana biasanya Bapak/Ibu memutuskan hal yang menyangkut jumlah besar?",
    options: [
      { id: "sendiri", label: "Sendiri, cepat", points: 6 },
      { id: "ustadz", label: "Sendiri, setelah bertanya kepada ustadz atau kyai", points: 6 },
      { id: "keluarga", label: "Bersama keluarga", points: 3 },
      { id: "mitra", label: "Bersama mitra atau dewan", points: 3 },
    ],
  },
  {
    id: "kapasitas",
    kind: "single",
    intro:
      "Satu pertanyaan terakhir, dan kami jelaskan alasannya. Kami menanyakan ini agar tidak membuang waktu Bapak/Ibu untuk pembicaraan dengan skala yang tidak sesuai.",
    prompt: "Berapa kira-kira yang Bapak/Ibu salurkan untuk dakwah dan sosial per bulan saat ini?",
    options: [
      { id: "<20", label: "Di bawah 20 juta", points: 0 },
      { id: "20-75", label: "20–75 juta", points: 3 },
      { id: "75-150", label: "75–150 juta", points: 10 },
      { id: ">150", label: "Di atas 150 juta", points: 14 },
      { id: "langsung", label: "Lebih baik dibicarakan langsung", points: 8 },
    ],
  },
];

// Условное поле под ответом «ustadz» в Q7.
export const USTADZ_FIELD_LABEL =
  "Kalau berkenan, sebutkan nama beliau — kami akan menghubungi lewat beliau, bukan mendahului.";

// Экран формы контакта (между Q6 и Q7).
export const CONTACT = {
  heading: "Tinggal dua pertanyaan. Ke mana kami kirim hasil analisis dan dokumen?",
  subheading: "Kami menulis di WhatsApp satu kali. Kalau tidak dibalas, kami tidak menulis lagi.",
  nama: "Nama",
  wa: "Nomor WhatsApp",
  consent: "Saya setuju data saya disimpan dan dihubungi lewat WhatsApp.",
  submit: "Lanjutkan",
};

// Экраны результата по тирам. CTA у A имеет вариант «bersama keluarga».
export const RESULTS: Record<
  Tier,
  { body: string; cta: string; ctaFamily?: string }
> = {
  A: {
    body: `Model Bapak/Ibu: «Amal jariyah kelembagaan».

Bapak/Ibu sudah memberi, dan berpikir lebih panjang dari satu umur.
Yang kurang bukan niat — melainkan strukturnya: badan hukum, laporan,
dan objek yang bisa ditunjukkan kepada anak-anak.

Ini yang kami punya, dalam dokumen, bukan dalam kata-kata:
akta yayasan mitra, perjanjian, susunan dewan syariah, laporan periode lalu.`,
    cta: "Terima dokumen dan atur pertemuan 30 menit",
    ctaFamily: "Terima dokumen dan atur pertemuan bersama keluarga",
  },
  B: {
    body: `Model Bapak/Ibu: «Sahabat Qurany».

Bapak/Ibu memberi, tapi belum melihat jejaknya. Mulai dari yang bisa diperiksa:
laporan bulanan satu halaman, dan Bapak/Ibu melihat sendiri apakah kami menepatinya.`,
    cta: "Terima laporan bulanan",
  },
  C: {
    body: `Model Bapak/Ibu: «Pengamat».

Jujur: saat ini kami tidak meminta apa pun dari Bapak/Ibu, dan tidak akan meminta.
Yang masuk akal: satu halaman sebulan sekali tentang apa yang terjadi.
Kalau nanti menarik, Bapak/Ibu yang menghubungi kami.`,
    cta: "Terima laporan bulanan",
  },
};

// Персонализированная строка под CTA по ответу на Q6 (minat).
// «Bagian yang Bapak/Ibu pilih: <текст опции со строчной буквы>.»
export function minatLine(minatOptionId: string | undefined): string | null {
  if (!minatOptionId) return null;
  const q6 = QUESTIONS.find((q) => q.id === "minat")!;
  const opt = q6.options.find((o) => o.id === minatOptionId);
  if (!opt) return null;
  const label = opt.label.charAt(0).toLowerCase() + opt.label.slice(1);
  return `Bagian yang Bapak/Ibu pilih: ${label}.`;
}
