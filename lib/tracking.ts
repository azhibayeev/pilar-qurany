// Захват атрибуции (UTM / click-id / referrer / UA / locale) на клиенте.

export interface Tracking {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  fbclid?: string;
  ttclid?: string;
  referrer?: string;
  user_agent?: string;
  locale?: string;
}

export function captureTracking(): Tracking {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const get = (k: string) => p.get(k) || undefined;
  return {
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_content: get("utm_content"),
    fbclid: get("fbclid"),
    ttclid: get("ttclid"),
    referrer: document.referrer || undefined,
    user_agent: navigator.userAgent,
    locale: navigator.language,
  };
}
