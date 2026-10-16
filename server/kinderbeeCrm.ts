// Copies each website lead into the KinderBee CRM (the separate CRM app's Supabase project) through its
// submit_lead() function. That function can only insert a lead, and the anon key below is public by design:
// the CRM app ships the same key to every browser. Override both with KB_CRM_SUPABASE_URL / KB_CRM_ANON_KEY.
const CRM_URL = process.env.KB_CRM_SUPABASE_URL || "https://gihcunqqahehlgrggpyr.supabase.co";
const CRM_KEY = process.env.KB_CRM_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpaGN1bnFxYWhlaGxncmdncHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwMjU1NzYsImV4cCI6MjEwNzYwMTU3Nn0.VEtmnQUvdgucUPIAQjtGnh2zws_8PObQBlkDKdCZQDE";

// Website category -> CRM lead category (the CRM accepts ntt, consultation, franchise, cbse, degree, jv)
const CRM_CATEGORY: Record<string, string> = {
  admission: "consultation", franchise: "franchise", ntt: "ntt", cbse: "cbse", degree: "degree", investor: "jv", other: "consultation",
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
    category: CRM_CATEGORY[category] || "consultation", name, phone, email: f.email, city: f.city, message: f.message,
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
