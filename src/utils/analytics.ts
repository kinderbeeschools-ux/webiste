// GA4 events (the Google tag is in index.html). Mark "generate_lead" as a key event in GA4
// (Admin → Events) to count enquiries as conversions. Never pass names, phones or emails here.

type Params = Record<string, string | number | undefined>;

export function trackEvent(name: string, params: Params = {}) {
  const gtag = (window as any).gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', name, { page_path: window.location.pathname, ...params });
}

// One event for every lead: enquiry forms, consultation bookings, brochure downloads, investor forms, course payments
export function trackLead(leadType: string, formName: string, extra: Params = {}) {
  trackEvent('generate_lead', { lead_type: leadType, form_name: formName, currency: 'INR', ...extra });
}
