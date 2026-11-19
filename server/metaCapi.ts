import { createHash } from "node:crypto";

// Sends CRM lead-stage events to Meta's Conversions API (CRM integration, dataset = the Meta pixel).
// Needs META_CAPI_TOKEN (Events Manager > dataset > Settings > Conversions API > Generate access token).
// Without it this does nothing. Set META_CAPI_TEST_CODE to route events to the "Test events" tab instead of production.
const DATASET_ID = process.env.META_DATASET_ID || "1403253398552035";
const API_VERSION = process.env.META_API_VERSION || "v21.0";

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

// Meta wants lowercase trimmed email and digits-only phone with country code, SHA-256 hashed
const hashEmail = (e?: unknown) => {
  const v = String(e ?? "").trim().toLowerCase();
  return v.includes("@") ? sha256(v) : null;
};
const hashPhone = (p?: unknown) => {
  let d = String(p ?? "").replace(/\D/g, "").replace(/^0+/, "");
  if (d.length === 10) d = "91" + d; // Indian mobile without country code
  return d.length >= 10 ? sha256(d) : null;
};

export type MetaStage = "Lead" | "Contact" | "Purchase";

export async function sendMetaEvent(
  stage: MetaStage,
  who: { email?: unknown; phone?: unknown; name?: unknown; city?: unknown },
  opts: { value?: number; eventId?: string; time?: number } = {},
): Promise<void> {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return;
  const em = hashEmail(who.email);
  const ph = hashPhone(who.phone);
  if (!em && !ph) return; // nothing for Meta to match on
  const user_data: Record<string, unknown> = { country: [sha256("in")] };
  if (em) user_data.em = [em];
  if (ph) user_data.ph = [ph];
  const event: Record<string, unknown> = {
    event_name: stage,
    event_time: opts.time ?? Math.floor(Date.now() / 1000),
    action_source: "system_generated",
    custom_data: {
      event_source: "crm",
      lead_event_source: "KinderBee CRM",
      ...(opts.value != null ? { value: opts.value, currency: "INR" } : {}),
    },
    user_data,
  };
  if (opts.eventId) event.event_id = opts.eventId;
  const body: Record<string, unknown> = { data: [event] };
  if (process.env.META_CAPI_TEST_CODE) body.test_event_code = process.env.META_CAPI_TEST_CODE;
  try {
    const r = await fetch(`https://graph.facebook.com/${API_VERSION}/${DATASET_ID}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(4000),
    });
    if (!r.ok) console.warn("Meta CAPI: event not accepted", r.status, (await r.text()).slice(0, 200));
  } catch (err) {
    console.warn("Meta CAPI: send failed", err);
  }
}
