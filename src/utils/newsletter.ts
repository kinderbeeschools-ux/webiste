import { trackLead } from './analytics';
// Blog newsletter sign-up: saved as a CRM lead (General Enquiry, form "Newsletter Subscription").
// Resolves to an error message, or null once saved.
export async function subscribeNewsletter(email: string, page: string): Promise<string | null> {
  try {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'Newsletter Subscription', fields: { email: email.trim(), message: `Newsletter sign-up from ${page}` } }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) trackLead('newsletter', 'Newsletter signup');
    return res.ok ? null : data.error || 'Could not subscribe right now. Please try again.';
  } catch {
    return 'Network error. Check your connection and try again.';
  }
}
