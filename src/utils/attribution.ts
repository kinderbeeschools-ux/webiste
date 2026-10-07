// Records where a visitor came from (UTM tags / referrer) in a first-party cookie.
// The server reads it when an enquiry is submitted, so every lead keeps its source
// without changing any of the enquiry forms.
const COOKIE = 'kb_attr';
const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const hasUtm = KEYS.some(k => params.get(k));
    const existing = document.cookie.split('; ').find(c => c.startsWith(`${COOKIE}=`));
    const referrer = document.referrer && !document.referrer.includes(window.location.host) ? document.referrer : '';
    // Keep the first touch unless this visit arrives with new campaign tags
    if (existing && !hasUtm) return;

    const data: Record<string, string> = { landing: window.location.pathname, at: new Date().toISOString() };
    KEYS.forEach(k => { const v = params.get(k); if (v) data[k] = v.slice(0, 100); });
    if (referrer) data.referrer = referrer.slice(0, 200);

    const maxAge = 90 * 24 * 60 * 60;
    document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(data))}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  } catch {
    // Attribution is best-effort; never break the page over it
  }
}
