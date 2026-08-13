import { PETA } from "@/content/quiz";
import type { PetaData } from "@/lib/quiz/types";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 border-t border-line pt-4 first:mt-4 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

// Карта амаль джарии из ответов. При anonim секция имени говорит об анонимности,
// и нигде больше именование не упоминается. Этот блок — цель печати в PDF (.print-peta).
export default function PetaMap({ peta }: { peta: PetaData }) {
  return (
    <section className="print-peta mt-10 rounded-2xl border border-line bg-white p-6 shadow-soft">
      <h2 className="text-lg font-semibold">{PETA.title}</h2>

      <Block title={PETA.sections.sudah}>
        {peta.sudah.length ? (
          <ul className="flex flex-col gap-1">
            {peta.sudah.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">—</p>
        )}
      </Block>

      <Block title={PETA.sections.belum}>
        {peta.belum.length ? (
          <div className="flex flex-col gap-4">
            {peta.belum.map((b) => (
              <div key={b.name}>
                <p className="font-medium">{b.name}</p>
                <p className="mt-0.5 text-[0.95rem] leading-relaxed">{b.forms}</p>
                <p className="mt-0.5 text-xs text-muted">{b.dalil}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">—</p>
        )}
      </Block>

      {peta.bagian && (
        <Block title={PETA.sections.bagian}>
          <p className="leading-relaxed">{peta.bagian}</p>
        </Block>
      )}

      <Block title={PETA.sections.nama}>
        <p className="leading-relaxed">{peta.nama}</p>
      </Block>
    </section>
  );
}
