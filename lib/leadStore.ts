// Абстракция хранилища лидов. Две реализации: Supabase (REST, без доп. зависимостей)
// и console-заглушка. Выбор через env LEAD_STORE=supabase|console
// (или авто: supabase, если заданы ключи, иначе console).

import type { LeadInput } from "./quiz/types";

export type LeadPatch = Partial<
  Pick<LeadInput, "status" | "score" | "tier" | "anonim" | "ustadz_nama" | "answers">
>;

export interface LeadStore {
  create(input: LeadInput): Promise<{ id: string }>;
  update(id: string, patch: LeadPatch): Promise<void>;
}

function useSupabase(): boolean {
  const mode = (process.env.LEAD_STORE || "").toLowerCase();
  if (mode === "supabase") return true;
  if (mode === "console") return false;
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// ── Supabase через REST (server-side, service role) ────────────────────────────
async function sbFetch(path: string, init: RequestInit): Promise<Response> {
  const url = `${process.env.SUPABASE_URL}/rest/v1/${path}`;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  return fetch(url, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
}

const supabaseStore: LeadStore = {
  async create(input) {
    const res = await sbFetch("leads", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`supabase create failed (${res.status}): ${await res.text()}`);
    const rows = (await res.json()) as Array<{ id: string }>;
    return { id: rows[0].id };
  },
  async update(id, patch) {
    const res = await sbFetch(`leads?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error(`supabase update failed (${res.status}): ${await res.text()}`);
  },
};

// ── Console-заглушка ───────────────────────────────────────────────────────────
const consoleStore: LeadStore = {
  async create(input) {
    const id = crypto.randomUUID();
    console.log("[leadStore:console] create", { id, ...input });
    return { id };
  },
  async update(id, patch) {
    console.log("[leadStore:console] update", { id, ...patch });
  },
};

export const leadStore: LeadStore = useSupabase() ? supabaseStore : consoleStore;
