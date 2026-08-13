// ЕДИНСТВЕННЫЙ источник текстов, баллов, фото-ключей и правил контента (bahasa Indonesia).
// Тексты — дословно из спеки v2. Менять текст/баллы = менять этот файл, JSX не трогать.
// Кавычки — прямые "..." (индонезийский текст). ﷺ пишется словами.

import type { Insight, LandingVariant, Question, Tier } from "@/lib/quiz/types";

export const CONFIG = {
  PROMISE_ABOVE_H1: false, // позиция карточки обещания относительно H1
  SOCIAL_PROOF_MIN: 200, // счётчик показываем только при N ≥ этого значения
};

// ── Лендинг ─────────────────────────────────────────────────────────────────────
export const LANDING: {
  variants: Record<LandingVariant, { h1: string; sub: string }>;
  promise: { heading: string; bullets: string[] };
  button: string;
  disclaimer: string;
  subnote: string;
} = {
  variants: {
    a: {
      h1: `Apa dari yang Bapak/Ibu kerjakan yang akan tetap bekerja setelah Bapak/Ibu tiada?`,
      sub: `7 pertanyaan. Di akhir Bapak/Ibu menerima Peta Amal Jariyah — satu halaman tentang amal mana yang sudah ada pada Bapak/Ibu dan mana yang belum.`,
    },
    b: {
      h1: `Bapak/Ibu bersedekah. Bapak/Ibu tahu apa yang terjadi setelahnya?`,
      sub: `7 pertanyaan tentang cara Bapak/Ibu memberi — dan kenapa jejaknya biasanya tidak tertinggal. Di akhir: Peta Amal Jariyah, satu halaman.`,
    },
    c: {
      h1: `Tiga amal tidak terputus setelah kematian. Periksa yang mana sudah Bapak/Ibu miliki.`,
      sub: `Hadis — Muslim, 1631. 7 pertanyaan, dan Peta Amal Jariyah di akhir.`,
    },
  },
  promise: {
    heading: `Yang Bapak/Ibu terima:`,
    bullets: [
      `Peta Amal Jariyah, 1 halaman, dikirim langsung`,
      `Dalil untuk setiap poin, dengan rujukan yang bisa diperiksa`,
      `Contoh laporan bulanan kami, apa adanya`,
    ],
  },
  button: `Mulai`,
  disclaimer: `Gratis. Tidak ada permintaan dana — kami hanya mengirim analisisnya.`,
  subnote: `7 pertanyaan, sekitar 3 menit.`,
};

// ── Вопросы Q1–Q8 ───────────────────────────────────────────────────────────────
export const QUESTIONS: Question[] = [
  {
    id: "amal_jariyah",
    select: "multi",
    withPhotos: true,
    intro: `Rasulullah shallallahu 'alaihi wasallam bersabda: "Apabila manusia meninggal, terputuslah amalnya kecuali tiga: sedekah jariyah, ilmu yang bermanfaat, dan anak saleh yang mendoakannya" (HR. Muslim, 1631).`,
    prompt: `Yang mana dari ketiganya sudah Bapak/Ibu miliki?`,
    hint: `Bisa pilih lebih dari satu.`,
    options: [
      { id: "jariyah", label: `Sedekah jariyah — ada sesuatu yang berjalan tanpa saya`, points: 4, photo: "q1.jariyah" },
      { id: "ilmu", label: `Ilmu — saya mengajar, membiayai pendidikan, atau menerbitkan`, points: 4, photo: "q1.ilmu" },
      { id: "anak", label: `Anak saleh yang mendoakan`, points: 0, photo: "q1.anak" },
      { id: "belum", label: `Belum satu pun — dan saya belum pernah melihatnya seperti ini`, points: 0, exclusive: true },
    ],
  },
  {
    id: "jejak",
    select: "single",
    withPhotos: false,
    prompt: `Ingat sedekah besar terakhir Bapak/Ibu. Apakah Bapak/Ibu tahu apa yang terjadi setelahnya?`,
    footnote: `Tidak ada jawaban yang salah di sini. Kami tidak menilai.`,
    options: [
      { id: "lihat", label: `Ya, saya melihat hasilnya sendiri`, points: 4 },
      { id: "tidak_ganggu", label: `Tidak, dan itu tidak mengganggu saya — yang penting niat`, points: 0 },
      { id: "ganggu", label: `Tidak, dan itu mengganggu saya`, points: 6 },
      { id: "perantara", label: `Lewat perantara, dan sampai sekarang saya tidak tahu`, points: 3 },
    ],
  },
  {
    id: "nama",
    select: "single",
    withPhotos: false,
    prompt: `Nama pemberi sebaiknya disebut atau disembunyikan?`,
    hint: `Keduanya punya dasar. Kami tanyakan supaya tahu cara memperlakukan nama Bapak/Ibu.`,
    footnote: `Apa pun pilihan Bapak/Ibu, kami mengikutinya — dan itu dicatat dalam perjanjian, bukan hanya diucapkan.`,
    options: [
      {
        id: "sembunyi",
        label: `Disembunyikan. "Jika kamu menyembunyikannya dan memberikannya kepada orang fakir, itu lebih baik bagimu"`,
        citation: `QS Al-Baqarah: 271`,
        points: 2,
      },
      {
        id: "sebut",
        label: `Disebut. Utsman membeli sumur Rumah, dan itu tercatat atas namanya`,
        citation: `HR. Tirmidzi, 3703`,
        points: 2,
      },
      {
        id: "tergantung",
        label: `Tergantung amalnya: satu diam-diam, satu terbuka`,
        citation: `QS Al-Baqarah: 274 menyebut keduanya`,
        points: 2,
      },
      { id: "belum", label: `Belum memutuskan — saya ingin memahaminya`, points: 0 },
    ],
  },
  {
    id: "warisan",
    select: "single",
    withPhotos: true,
    prompt: `Apa yang harus tetap ada 30 tahun setelah Bapak/Ibu?`,
    footnote: `Pilih satu yang paling utama, bukan semua yang benar.`,
    options: [
      { id: "usaha", label: `Usaha yang berjalan tanpa saya`, points: 3, photo: "q4.usaha" },
      { id: "anak", label: `Anak-anak yang tetap menjaga agamanya`, points: 5, photo: "q4.anak" },
      { id: "lembaga", label: `Lembaga — sekolah, masjid, yayasan — yang saya ikut bangun`, points: 8, photo: "q4.lembaga" },
      { id: "belum", label: `Jujur saja: saya belum berpikir sejauh 30 tahun`, points: 0 },
    ],
  },
  {
    id: "hambatan",
    select: "single",
    withPhotos: false,
    prompt: `Apa yang paling sering menghambat Bapak/Ibu memberi secara rutin, bukan sesekali?`,
    options: [
      { id: "percaya", label: `Saya tidak percaya pada pengelola penggalangan dana`, points: 2 },
      { id: "laporan", label: `Tidak ada laporan — saya tidak tahu dananya ke mana`, points: 4 },
      { id: "prioritas", label: `Saya tidak tahu di mana yang paling dibutuhkan sekarang`, points: 4 },
      { id: "pendapatan", label: `Pendapatan tidak tetap, berat berkomitmen setahun`, points: 0 },
      { id: "rutin", label: `Tidak ada — saya sudah memberi secara rutin`, points: 6 },
    ],
  },
  {
    id: "minat",
    select: "single",
    withPhotos: true,
    prompt: `Bagian mana yang paling dekat dengan Bapak/Ibu?`,
    options: [
      { id: "aplikasi", label: `Aplikasi — agar siapa pun bisa membuka Al-Qur'an tanpa membayar`, points: 2, photo: "q6.aplikasi" },
      { id: "pendidikan", label: `Pendidikan — guru, kelas, program bagi yang sudah bisa membaca`, points: 2, photo: "q6.pendidikan" },
      { id: "infrastruktur", label: `Infrastruktur — gedung, ruang kelas, perangkat`, points: 2, photo: "q6.infrastruktur" },
      { id: "semua", label: `Semuanya — silakan Anda yang mengatur`, points: 0 },
    ],
  },
  {
    id: "keputusan",
    select: "single",
    withPhotos: false,
    prompt: `Bagaimana biasanya Bapak/Ibu memutuskan hal yang menyangkut jumlah besar?`,
    options: [
      { id: "sendiri", label: `Sendiri, cepat`, points: 6 },
      { id: "ustadz", label: `Sendiri, setelah bertanya kepada ustadz atau kyai`, points: 6 },
      { id: "keluarga", label: `Bersama keluarga`, points: 3 },
      { id: "mitra", label: `Bersama mitra atau dewan`, points: 3 },
    ],
  },
  {
    id: "kapasitas",
    select: "single",
    withPhotos: false,
    intro: `Satu pertanyaan terakhir, dan kami jelaskan alasannya. Kami menanyakan ini agar tidak membuang waktu Bapak/Ibu untuk pembicaraan dengan skala yang tidak sesuai.`,
    prompt: `Berapa kira-kira yang Bapak/Ibu salurkan untuk dakwah dan sosial per bulan saat ini?`,
    options: [
      { id: "<20", label: `Di bawah Rp 20 juta`, points: 0 },
      { id: "20-30", label: `Rp 20–30 juta`, points: 2 },
      { id: "30-75", label: `Rp 30–75 juta`, points: 6 },
      { id: "75-150", label: `Rp 75–150 juta`, points: 10 },
      { id: ">150", label: `Di atas Rp 150 juta`, points: 14 },
      { id: "langsung", label: `Lebih baik dibicarakan langsung`, points: 8 },
    ],
  },
];

// Условное поле под ответом «ustadz» в Q7.
export const USTADZ_FIELD_LABEL = `Kalau berkenan, sebutkan nama beliau — kami akan menghubungi lewat beliau, bukan mendahului.`;

// ── Инсайты между вопросами ─────────────────────────────────────────────────────
export const INSIGHTS: Record<"A" | "B" | "C" | "D", Insight> = {
  A: {
    id: "A",
    heading: `Yang paling sering hilang bukan niatnya.`,
    body: `Dari ketiga amal itu, dua bergantung pada struktur: sedekah jariyah butuh objek yang berjalan tanpa kita, dan ilmu butuh tempat ia disimpan dan diteruskan.

Niat sudah ada pada banyak orang. Yang jarang ada adalah bentuknya.`,
    button: `Lanjutkan`,
  },
  B: {
    id: "B",
    heading: `Empat pertanyaan lagi, dan Peta-nya siap.`,
    body: `Sampai di sini Bapak/Ibu sudah menentukan dua hal: amal mana yang sudah berjalan, dan bagaimana nama Bapak/Ibu diperlakukan.

Sisanya tentang arah — apa yang harus tetap ada, dan di bagian mana Bapak/Ibu ingin berada.`,
    button: `Lanjutkan`,
  },
  C: {
    id: "C",
    heading: `Hambatan itu wajar — dan hampir selalu soal bentuk.`,
    body: `Banyak orang berhenti bukan karena kurang niat, tapi karena belum tahu bentuk yang aman dan bisa diperiksa.

Justru di titik inilah Peta membantu: memperjelas langkah berikutnya, bukan menuntut lompatan.`,
    button: `Lanjutkan`,
  },
  D: {
    id: "D",
    heading: `Arahnya mulai kelihatan.`,
    body: `Dari yang Bapak/Ibu pilih, kami sudah bisa menyusun bagian mana yang paling dekat dengan niat Bapak/Ibu.

Satu-dua hal lagi, dan Peta Amal Jariyah-nya lengkap.`,
    button: `Lanjutkan`,
  },
};

// ── Форма контакта ──────────────────────────────────────────────────────────────
export const CONTACT = {
  heading: `Tinggal tiga pertanyaan. Ke mana kami kirim Peta Amal Jariyah?`,
  subheading: `Kami menulis di WhatsApp satu kali. Kalau tidak dibalas, kami tidak menulis lagi.`,
  nama: `Nama`,
  wa: `Nomor WhatsApp`,
  consent: `Saya setuju data saya disimpan dan dihubungi lewat WhatsApp.`,
  consentLink: `Kebijakan privasi`,
  submit: `Lanjutkan`,
};

// ── Экран подготовки результата ─────────────────────────────────────────────────
export const PREPARING = {
  title: `Menyusun Peta Amal Jariyah Bapak/Ibu…`,
  lines: [`Memeriksa jawaban Bapak/Ibu`, `Menyusun Peta Amal Jariyah`, `Menyiapkan dalil dan rujukannya`, `Selesai`],
};

// ── Доп. копирайт для «сочных» экранов (интерстишлы, форма, лоадер) ───────────────
// Интерстишлы = промежуточные экраны между вопросами (приём удержания, как у Finelo):
// разбивают монотонность, повышают ценность результата, создают вовлечённость.
// visual — разный мотив на каждом интерстишле, чтобы они не были похожи:
// amal (3 амаль) · progress (пройденные шаги) · steps (лестница) · peta (превью документа).
export const INTERSTITIAL = {
  A: { eyebrow: `Wawasan`, visual: `amal`, note: `Tiga amal yang tidak terputus` },
  B: { eyebrow: `Hampir selesai`, visual: `progress`, note: `Peta Amal Jariyah · 1 halaman · dikirim ke WhatsApp` },
  C: { eyebrow: `Wawasan`, visual: `steps`, note: `Langkah, bukan lompatan` },
  D: { eyebrow: `Hampir selesai`, visual: `peta`, note: `Peta Amal Jariyah · 1 halaman · dikirim ke WhatsApp` },
};

export const CONTACT_EXTRA = {
  value: `Untuk mengirim Peta Amal Jariyah Bapak/Ibu`,
  trust: `Data Bapak/Ibu aman. Kami hubungi lewat WhatsApp satu kali saja.`,
};

// ── Экраны результата по тирам ──────────────────────────────────────────────────
export const RESULTS: Record<Tier, { body: string; cta: string; ctaFamily?: string }> = {
  A: {
    body: `Model Bapak/Ibu: "Amal jariyah kelembagaan".

Bapak/Ibu sudah memberi, dan berpikir lebih panjang dari satu umur. Yang kurang bukan niat — melainkan strukturnya: badan hukum, laporan, dan objek yang bisa ditunjukkan kepada anak-anak.

Ini yang kami punya, dalam dokumen, bukan dalam kata-kata: akta yayasan mitra, perjanjian, susunan dewan syariah, laporan periode lalu.`,
    cta: `Terima dokumen dan atur pertemuan 30 menit`,
    ctaFamily: `Terima dokumen dan atur pertemuan bersama keluarga`,
  },
  B: {
    body: `Model Bapak/Ibu: "Sahabat Qurany".

Bapak/Ibu memberi, tapi belum melihat jejaknya. Mulai dari yang bisa diperiksa: laporan bulanan satu halaman, dan Bapak/Ibu melihat sendiri apakah kami menepatinya.`,
    cta: `Terima laporan bulanan`,
  },
  C: {
    body: `Model Bapak/Ibu: "Pengamat".

Jujur: saat ini kami tidak meminta apa pun dari Bapak/Ibu, dan tidak akan meminta. Yang masuk akal: satu halaman sebulan sekali tentang apa yang terjadi. Kalau nanti menarik, Bapak/Ibu yang menghubungi kami.`,
    cta: `Terima laporan bulanan`,
  },
};

// Финал для СИЛЬНЫХ лидов (высокий/средний инвест-потенциал) — вместо «ежемесячного отчёта».
// Меценат/вакиф финансирует развитие приложения Qurany как непрерывающуюся садаку.
// ЧЕРНОВИК копирайта — до утверждения владельцем (TODO review).
export const RESULT_PATRON: { body: string; cta: string; ctaFamily: string; confirm: string } = {
  body: `Dari jawaban Bapak/Ibu, amal jariyah yang paling sesuai bukan memberi sekali — tapi menghidupi sesuatu yang terus bekerja setelah kita: aplikasi Qurany, agar siapa pun bisa membuka Al-Qur'an tanpa membayar, bertahun-tahun ke depan.

Kami ingin membicarakannya langsung: bagaimana Bapak/Ibu bisa ikut menopang, apa yang sudah berjalan, dan bagaimana nama Bapak/Ibu diperlakukan — semuanya dalam dokumen, bukan sekadar kata.`,
  cta: `Atur pembicaraan dengan tim Qurany`,
  ctaFamily: `Atur pembicaraan bersama keluarga`,
  confirm: `Baik. Tim kami menghubungi Bapak/Ibu lewat WhatsApp untuk mengatur waktu.`,
};

// ── Peta Amal Jariyah ───────────────────────────────────────────────────────────
// Три амаль: имя для карты + (TODO-РЕВЬЮ) строка о формах и далиль для секции «Yang belum».
// Тексты форм/далиль ЧЕРНОВИК — не в проде без утверждения владельца.
export const AMAL: Record<"jariyah" | "ilmu" | "anak", { name: string; forms: string; dalil: string }> = {
  jariyah: {
    name: `Sedekah jariyah`,
    forms: `Bentuk yang biasa dipakai: wakaf produktif, sumur atau instalasi air, dan objek yang terus dipakai orang.`, // TODO(review)
    dalil: `HR. Muslim, 1631`,
  },
  ilmu: {
    name: `Ilmu yang bermanfaat`,
    forms: `Bentuknya: membiayai guru dan kelas, mencetak atau menerbitkan bahan ajar, atau mendanai program yang terus mengajar setelah kita.`, // TODO(review)
    dalil: `HR. Muslim, 1631`,
  },
  anak: {
    name: `Anak saleh yang mendoakan`,
    forms: `Bentuknya: pendidikan agama anak dan lingkungan yang menjaganya tetap mendoakan.`, // TODO(review)
    dalil: `HR. Muslim, 1631`,
  },
};

export const PETA = {
  title: `Peta Amal Jariyah Bapak/Ibu`,
  sections: {
    sudah: `Yang sudah ada`,
    belum: `Yang belum`,
    bagian: `Bagian yang Bapak/Ibu pilih`,
    nama: `Cara nama Bapak/Ibu diperlakukan`,
  },
  downloadPdf: `Unduh PDF`,
  // Секция 3 — короткие названия части из Q6.
  bagianLabel: {
    aplikasi: `Aplikasi — agar siapa pun bisa membuka Al-Qur'an tanpa membayar`,
    pendidikan: `Pendidikan — guru, kelas, dan program`,
    infrastruktur: `Infrastruktur — gedung, ruang kelas, perangkat`,
    semua: `Semua bagian — Bapak/Ibu mempercayakan pengaturannya kepada kami`,
  } as Record<string, string>,
  // Секция 4 — как обращаться с именем (по Q3). При sembunyi — про анонимность.
  namaTreatment: {
    sembunyi: `Nama Bapak/Ibu disembunyikan. Kami tidak menyebutnya di mana pun.`,
    sebut: `Nama Bapak/Ibu boleh disebut dan dicatat atas nama Bapak/Ibu.`,
    tergantung: `Sebagian amal diam-diam, sebagian terbuka — sesuai amalnya.`,
    belum: `Belum diputuskan — kami bahas nanti bersama Bapak/Ibu.`,
  } as Record<string, string>,
};

// ── Соц-доказательство (единственный счётчик, только при N ≥ SOCIAL_PROOF_MIN) ──
export const SOCIAL_PROOF_TEMPLATE = `{N} orang sudah menerima Peta Amal Jariyah`;
