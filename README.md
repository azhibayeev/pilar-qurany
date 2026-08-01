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

Весь пользовательский текст (лендинг, карточка обещания, вопросы, ответы, инсайты, экран подготовки, результаты, тексты Peta) — в одном файле:

```
content/quiz.ts
```

Меняешь строки там — JSX не трогаешь. Флаги там же: `CONFIG.PROMISE_ABOVE_H1` (позиция карточки обещания), `CONFIG.SOCIAL_PROOF_MIN` (порог показа счётчика).

## Как поменять баллы и пороги

- **Баллы опций** — `content/quiz.ts`, поле `points` у каждой опции (в т.ч. 6 полос Q8).
- **Пороги тиров и ветвление** — `lib/quiz/scoring.ts`: константы `KAP_A` (гейт A по капасити), `TIER_A_MIN`/`TIER_C_MAX` (38/21), `FORCED_C_THRESHOLD` (порог Q8 = 22), условия `forcedC`/`cappedB`.

После любых изменений прогони `npm test` (15 кейсов, включая границы и ветвления).

## Как поменять фото

Реестр фотографий — `content/photos.ts`: ключ `<qN>.<optionId>` → `{ src1x, src2x, alt, source, license, status }`. Пока все `status:"placeholder"` (сплошной SVG). Реальное фото: положи в `public/photos/`, укажи пути (WebP+AVIF, 144/288), `alt` на бахаса, `status:"licensed"`, заполни `source`/`license`. **Случайные стоки не подставлять.**

## Тексты Peta «Yang belum»

Строки о формах и далиль для недостающих амаль — `content/quiz.ts`, объект `AMAL` (помечены `TODO(review)` как ЧЕРНОВИК). Утвердить/переписать перед продом.

## A/B лендинга

`/?v=a` (по умолчанию), `/?v=b`, `/?v=c`. UTM и `fbclid`/`ttclid` автоматически проносятся в квиз и в запись лида.

## Структура

```
content/
  quiz.ts             # ВЕСЬ текст, баллы, фото-ключи, инсайты, результаты, Peta, флаги
  photos.ts           # реестр фото (плейсхолдеры + статусы лицензий)
app/
  page.tsx            # лендинг (server, A/B, карточка обещания)
  kuis/page.tsx       # движок квиза (client): вопросы, инсайты, форма, подготовка, результат
  privasi, tentang    # юр-страницы (заглушки с TODO)
  api/lead            # серверный скоринг + запись лида
  api/capi            # Meta Conversions API
  api/social-proof    # счётчик выданных Карт (кэш 15 мин, показ при N≥200)
lib/quiz/             # types, scoring (+ тесты), flow, peta
lib/                  # leadStore, wa, tracking, pixels, notify, capi
components/           # экраны и элементы UI (фото-карточки, инсайты, подготовка, Peta)
supabase/schema.sql   # DDL таблицы leads
```

Прогресс-бар — 8 шагов (только вопросы; инсайты/форма/подготовка не в счёте). «Unduh PDF» на экране результата — печать браузера (print CSS показывает только Карту).

## Уведомления тира A

`NOTIFY_WEBHOOK_URL` получает `POST {text}` (формат Slack Incoming Webhook). Для Telegram поставьте relay, принимающий `{text}` и пересылающий в чат.
