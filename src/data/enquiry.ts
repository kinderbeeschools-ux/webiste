// Enquiry categories: one per line of business, so every lead lands in the right CRM bucket.
// Used by the enquiry form, the server (tags each enquiry) and the CRM (filters / counts).

export type EnquiryCategory = 'admission' | 'franchise' | 'ntt' | 'cbse' | 'degree' | 'investor' | 'other';

export const ENQUIRY_CATEGORIES: { id: EnquiryCategory; label: string; short: string; color: string }[] = [
  { id: 'admission', label: 'Preschool Admission', short: 'Admission', color: 'bg-amber-100 text-amber-800' },
  { id: 'franchise', label: 'Preschool Franchise', short: 'Franchise', color: 'bg-fuchsia-100 text-fuchsia-800' },
  { id: 'ntt', label: 'Teacher Training (NTT)', short: 'NTT', color: 'bg-sky-100 text-sky-800' },
  { id: 'cbse', label: 'CBSE / IB School Setup', short: 'CBSE School', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'degree', label: 'Degree College Setup', short: 'Degree College', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'investor', label: 'Investor / Joint Venture', short: 'Investor', color: 'bg-stone-200 text-stone-700' },
  { id: 'other', label: 'General Enquiry', short: 'General', color: 'bg-stone-100 text-stone-600' },
];

export const categoryInfo = (id: string) => ENQUIRY_CATEGORIES.find(c => c.id === id) || ENQUIRY_CATEGORIES[ENQUIRY_CATEGORIES.length - 1];

// The CRM can re-categorise a lead (fields.category); otherwise works for new enquiries (type is already a category id) and older ones ("ptt", "Investor Enquiry", contact-form programmes…)
export function enquiryCategory(type?: string, fields?: Record<string, any>): EnquiryCategory {
  const valid = (v?: string) => ENQUIRY_CATEGORIES.some(c => c.id === v);
  if (valid(fields?.category)) return fields!.category;
  if (valid(type)) return type as EnquiryCategory;
  const text = `${type || ''} ${fields?.consultationCategory || ''} ${fields?.interest || ''} ${fields?.program || ''} ${fields?.partnershipModel || ''} ${fields?.courseOfInterest || ''}`.toLowerCase();
  if (/investor|joint venture|opportunity/.test(text)) return 'investor';
  if (/degree|college/.test(text)) return 'degree';
  if (/cbse|icse|\bib\b|k-12|school setup/.test(text)) return 'cbse';
  if (/ptt|ntt|fwa|teacher|training|ecce|diploma|course/.test(text)) return 'ntt';
  if (/franchise|partner|kips|royalty/.test(text)) return 'franchise';
  if (/admission|daycare|campus|playgroup|nursery|lkg|ukg|child/.test(text)) return 'admission';
  return 'other';
}
