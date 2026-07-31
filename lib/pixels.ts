// Клиентские хелперы событий Meta Pixel и TikTok Pixel.
// События: QuizStart, QuizStep{n}, Lead, QuizComplete, TierA/TierB/TierC.

type Params = Record<string, unknown>;

interface PixelWindow {
  fbq?: (...args: unknown[]) => void;
  ttq?: { track?: (event: string, params?: Params) => void };
}

export function pixelTrack(event: string, params?: Params, eventId?: string): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as PixelWindow;
  if (typeof w.fbq === "function") {
    const opts = eventId ? { eventID: eventId } : undefined;
    if (event === "Lead") w.fbq("track", "Lead", params || {}, opts);
    else w.fbq("trackCustom", event, params || {}, opts);
  }
  w.ttq?.track?.(event, params);
}

/** Уникальный id события — общий для Pixel и Conversions API (дедуп на стороне Meta). */
export function newEventId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now()) + Math.round(Math.random() * 1e9);
}
