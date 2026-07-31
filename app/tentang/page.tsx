// Tentang kami — юрлицо, dewan syariah, ссылка на отчёт. Заглушки с TODO.

export const metadata = { title: "Tentang Kami — Pilar Qurany" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2 text-muted">{children}</div>
    </section>
  );
}

export default function TentangPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="text-2xl font-semibold tracking-tight">Tentang Kami</h1>

      <Section title="Siapa kami">
        {/* TODO: deskripsi singkat program Pilar Qurany */} —.
      </Section>
      <Section title="Badan hukum">
        {/* TODO: nama yayasan/PT, nomor akta, domisili */} —.
      </Section>
      <Section title="Dewan Syariah">
        {/* TODO: susunan dewan syariah */} —.
      </Section>
      <Section title="Laporan">
        {/* TODO: tautan ke laporan periode terakhir */} —.
      </Section>
    </main>
  );
}
