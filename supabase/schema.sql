-- Таблица лидов квиз-воронки Pilar Qurany.
-- Запуск: Supabase → SQL Editor → выполнить.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  nama            text not null,
  wa_normalized   text not null,          -- 628xxxxxxxxx
  wa_raw          text not null,
  status          text not null check (status in ('partial','complete')),
  score           int,
  tier            text check (tier in ('A','B','C')),
  anonim          boolean not null default false,
  ustadz_nama     text,
  answers         jsonb not null default '{}'::jsonb,
  landing_variant text,                   -- a|b|c
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  utm_content     text,
  fbclid          text,
  ttclid          text,
  referrer        text,
  user_agent      text,
  locale          text
);

create index if not exists leads_wa_idx on public.leads (wa_normalized);
create index if not exists leads_tier_idx on public.leads (tier);
create index if not exists leads_created_idx on public.leads (created_at desc);

-- RLS: доступ только у сервера (service role обходит RLS). Анонимному клиенту — запрещено.
alter table public.leads enable row level security;
-- Политик для anon/authenticated НЕ создаём — значит прямой доступ закрыт.
