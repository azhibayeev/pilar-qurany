// Kebijakan privasi по UU No. 27/2022 (Pelindungan Data Pribadi).
// Структура полная; тексты — заглушки с TODO для юриста.

export const metadata = { title: "Kebijakan Privasi — Pilar Qurany" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2 text-muted">{children}</div>
    </section>
  );
}

export default function PrivasiPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="text-2xl font-semibold tracking-tight">Kebijakan Privasi</h1>
      <p className="mt-3 text-muted">
        {/* TODO(legal): tanggal berlaku & nama badan hukum */}
        Berlaku sejak: —. Dokumen ini menjelaskan pemrosesan data pribadi sesuai UU No. 27 Tahun 2022
        tentang Pelindungan Data Pribadi.
      </p>

      <Section title="1. Data yang kami kumpulkan">
        Nama, nomor WhatsApp, jawaban kuis, dan data teknis (sumber kunjungan, perangkat).
        {/* TODO(legal): lengkapi daftar kategori data */}
      </Section>
      <Section title="2. Tujuan pemrosesan">
        Menghubungi Bapak/Ibu satu kali lewat WhatsApp dan mengirim hasil analisis serta dokumen.
        {/* TODO(legal): dasar hukum pemrosesan (persetujuan) */}
      </Section>
      <Section title="3. Dasar persetujuan">
        Data diproses atas persetujuan yang Bapak/Ibu berikan pada formulir.
      </Section>
      <Section title="4. Jangka waktu penyimpanan">
        {/* TODO(legal): tentukan retensi */} —.
      </Section>
      <Section title="5. Pihak yang mengakses data">
        {/* TODO(legal): sub-prosesor (mis. penyedia basis data), tanpa penjualan data */} —.
      </Section>
      <Section title="6. Hak Bapak/Ibu">
        Menarik persetujuan, meminta akses, perbaikan, atau penghapusan data kapan saja.
      </Section>
      <Section title="7. Cara menarik persetujuan / menghapus data">
        {/* TODO(legal): kanal kontak resmi */} Hubungi kami di: —.
      </Section>
      <Section title="8. Kontak pengendali data">
        {/* TODO(legal): nama badan hukum, alamat, email/telepon */} —.
      </Section>
    </main>
  );
}
