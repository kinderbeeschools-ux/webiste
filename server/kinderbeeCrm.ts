import type { PaymentRecord } from "../src/types";

// Copies each website lead into the KinderBee CRM (the separate CRM app's Supabase project) through its
// submit_lead() function. That function can only insert a lead, and the anon key below is public by design:
// the CRM app ships the same key to every browser. Override both with KB_CRM_SUPABASE_URL / KB_CRM_ANON_KEY.
const CRM_URL = process.env.KB_CRM_SUPABASE_URL || "https://gihcunqqahehlgrggpyr.supabase.co";
const CRM_KEY = process.env.KB_CRM_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpaGN1bnFxYWhlaGxncmdncHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwMjU1NzYsImV4cCI6MjEwNzYwMTU3Nn0.VEtmnQUvdgucUPIAQjtGnh2zws_8PObQBlkDKdCZQDE";

// Website category -> CRM lead category (the CRM accepts admission, ntt, consultation, franchise, cbse, degree, jv, general)
const CRM_CATEGORY: Record<string, string> = {
  admission: "admission", franchise: "franchise", ntt: "ntt", cbse: "cbse", degree: "degree", investor: "jv", other: "general",
};

export async function sendLeadToCrm(category: string, f: Record<string, any>): Promise<void> {
  const name = String(f.name || "").trim();
  const phone = String(f.phone || "").trim();
  if (!name || !phone) return; // e.g. newsletter sign-ups, which have no phone number
  const extra: Record<string, unknown> = {
    website_category: category, form: f.formType, programme: f.program || f.partnershipModel || f.courseOfInterest,
    budget: f.budget, state: f.state, utm_source: f.utm_source, utm_medium: f.utm_medium, utm_campaign: f.utm_campaign,
    landing_page: f.landing, opportunity: f.opportunity, investor_type: f.investorType, investment_range: f.investmentRange,
  };
  const p: Record<string, unknown> = {
    category: CRM_CATEGORY[category] || "general", name, phone, email: f.email, city: f.city, message: f.message,
    source: String(f.source || "Website").slice(0, 40), ...extra,
  };
  // submit_lead treats a "website" key as a bot honeypot, and stores blanks as text, so drop both
  for (const k of Object.keys(p)) if (k === "website" || p[k] == null || p[k] === "") delete p[k];
  try {
    const r = await fetch(`${CRM_URL}/rest/v1/rpc/submit_lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: CRM_KEY, Authorization: `Bearer ${CRM_KEY}` },
      body: JSON.stringify({ p }),
      signal: AbortSignal.timeout(4000),
    });
    if (!r.ok) console.warn("KinderBee CRM: lead not saved", r.status, (await r.text()).slice(0, 200));
  } catch (err) {
    console.warn("KinderBee CRM: lead forward failed", err);
  }
}

// Copies each payment a visitor confirms (UTR submitted) into the CRM's Website → Payment verification queue
// through its insert-only submit_payment(), which ignores a repeat of the same website payment id.
export async function sendPaymentToCrm(p: PaymentRecord): Promise<void> {
  try {
    const r = await fetch(`${CRM_URL}/rest/v1/rpc/submit_payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: CRM_KEY, Authorization: `Bearer ${CRM_KEY}` },
      body: JSON.stringify({ p: {
        website_payment_id: p.id, payer_name: p.applicantName, phone: p.payerPhone, email: p.payerEmail || null,
        amount: p.amount, reference: p.upiRefNumber, paid_on: p.paymentDate, programme: p.programme,
        booking: p.admissionNumber || null, notes: p.notes || null,
      } }),
      signal: AbortSignal.timeout(4000),
    });
    if (!r.ok) console.warn("Kinderbee CRM: payment not saved", r.status, (await r.text()).slice(0, 200));
  } catch (err) {
    console.warn("Kinderbee CRM: payment forward failed", err);
  }
}

// CRM staff managing website images: a CRM sign-in token (Supabase JWT) is accepted by the website's content APIs
// when the CRM confirms the account is active and is the CEO or has the "website" module. Checked against the CRM,
// then cached for a minute per token so deactivating someone in the CRM takes effect within a minute.
// Someone allowed to verify payments in the CRM may also mark website payments verified / rejected ("payments").
type CrmUser = { id: string; name: string; perms: string[] };
const crmUsers = new Map<string, { user: CrmUser | null; until: number; why: string }>();
// Why the last check of a CRM token failed, for the "Access denied" message the CRM shows
export const crmWhy = (token: string) => crmUsers.get(token)?.why || "";

export async function crmWebsiteUser(token: string): Promise<CrmUser | null> {
  const hit = crmUsers.get(token);
  if (hit && hit.until > Date.now()) return hit.user;
  let user: CrmUser | null = null;
  let why = "";
  try {
    const headers = { apikey: CRM_KEY, Authorization: `Bearer ${token}` };
    const me = await fetch(`${CRM_URL}/auth/v1/user`, { headers, signal: AbortSignal.timeout(4000) });
    if (!me.ok) why = `CRM sign-in check returned ${me.status}: ${(await me.text()).slice(0, 120)}`;
    else {
      const u: any = await me.json();
      const rpc = (fn: string, body: object) => fetch(`${CRM_URL}/rest/v1/rpc/${fn}`, {
        method: "POST", headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(body), signal: AbortSignal.timeout(4000),
      }).then(async r => r.ok && (await r.json()) === true);
      const [website, verify] = await Promise.all([rpc("has_module", { m: "website" }), rpc("can_verify_payments", {})]);
      const perms = [...(website ? ["website", "gallery", "opportunities"] : []), ...(verify ? ["payments"] : [])];
      if (!perms.length) why = "this CRM account has no Website Content or payment verification access";
      else user = { id: `crm-${u.id}`, name: `${String(u.email || "").split("@")[0]} (CRM)`, perms };
    }
  } catch (err) {
    console.warn("KinderBee CRM: sign-in check failed", err);
    why = `CRM sign-in check failed (${(err as Error).message})`;
    crmUsers.set(token, { user: null, until: 0, why }); // not cached: the next request checks again
    return null;
  }
  if (crmUsers.size > 500) crmUsers.clear();
  crmUsers.set(token, { user, until: Date.now() + 60_000, why });
  return user;
}

// Decisions (Verified / Rejected) the CRM has made on website payments, read through its website_payment_decisions()
// function. The website pulls these itself, so a verification reaches it even when the CRM's browser push didn't.
export type CrmDecision = { website_payment_id: string; status: string; reject_reason: string | null };
export async function crmPaymentDecisions(ids: string[]): Promise<CrmDecision[]> {
  if (!ids.length) return [];
  try {
    const r = await fetch(`${CRM_URL}/rest/v1/rpc/website_payment_decisions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: CRM_KEY, Authorization: `Bearer ${CRM_KEY}` },
      body: JSON.stringify({ p_ids: ids }),
      signal: AbortSignal.timeout(4000),
    });
    if (!r.ok) { console.warn("Kinderbee CRM: decisions not read", r.status, (await r.text()).slice(0, 200)); return []; }
    return await r.json();
  } catch (err) {
    console.warn("Kinderbee CRM: decisions read failed", err);
    return [];
  }
}
