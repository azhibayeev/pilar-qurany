# Pilar Qurany — квиз-воронка

Одностраничная квиз-воронка (bahasa Indonesia): квалифицирует посетителя, относит к тиру A/B/C и собирает контакт в WhatsApp.

> **Юридический инвариант.** Нигде нет просьбы о деньгах, сумм, реквизитов, QRIS или платёжных форм (UU No. 9/1961). Все CTA — только «получить документы / назначить разговор / получать отчёт». Не добавлять платёжные блоки.

## Стек

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Supabase (опционально) · Vercel. Системный шрифт, без Google Fonts.

## Локальный запуск

```bash
npm install
cp .env.example .env.local   # заполнить при необходимости
npm run dev                  # http://localhost:3000
npm test                     # юнит-тесты скоринга
npm run build                # прод-сборка
```

Без ключей Supabase лиды пишутся в консоль (`LEAD_STORE=console`).

## Деплой на Vercel

1. Запушить репозиторий, импортировать в Vercel.
2. Задать env-переменные из `.env.example` (Production).
3. Для реального хранилища: создать проект Supabase, выполнить `supabase/schema.sql`, задать `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`, `LEAD_STORE=supabase`.
4. Пиксели/CAPI/уведомления включаются добавлением соответствующих env (иначе — no-op).

## Как поменять тексты

Весь пользовательский текст (лендинг, вопросы, ответы, форма, экраны результата) — в одном файле:

```
lib/quiz/content.ts
```

Меняешь строки там — больше нигде трогать не нужно.

## Как поменять баллы

Там же, в `lib/quiz/content.ts`, у каждой опции поле `points`. Пороги тиров и правила ветвления — в `lib/quiz/scoring.ts` (константы `KAP_A`, условия `forcedC`/`cappedB`, пороги 38/21). После изменений прогони `npm test`.

## A/B лендинга

`/?v=a` (по умолчанию), `/?v=b`, `/?v=c`. UTM и `fbclid`/`ttclid` автоматически проносятся в квиз и в запись лида.

## Структура

```
app/
  page.tsx            # лендинг (server, A/B)
  kuis/page.tsx       # движок квиза (client)
  privasi, tentang    # юр-страницы (заглушки с TODO)
  api/lead            # серверный скоринг + запись лида
  api/capi            # Meta Conversions API
lib/quiz/             # content, types, scoring (+ тесты), flow
lib/                  # leadStore, wa, tracking, pixels, notify, capi
components/           # экраны и элементы UI
supabase/schema.sql   # DDL таблицы leads
```

## Уведомления тира A

`NOTIFY_WEBHOOK_URL` получает `POST {text}` (формат Slack Incoming Webhook). Для Telegram поставьте relay, принимающий `{text}` и пересылающий в чат.
