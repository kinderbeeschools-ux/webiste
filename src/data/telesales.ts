// Telesales: Meta-ads leads from a Google Sheet, and the call outcomes a caller can log.
// Shared by the server (import, sheet sync, call logging) and the desk UI, so both agree on the rules.

export interface SheetLead {
  name: string; phone: string; email: string; city: string; source: string;
  campaign: string; adset: string; ad: string; form: string; leadId: string; createdAt: string; message: string;
}

/** CSV or tab-separated text (pasting a range from Google Sheets gives tabs) into rows of cells. */
export function parseTable(text: string): string[][] {
  const src = text.replace(/^﻿/, '');
  const tab = (src.split('\n', 1)[0] || '').includes('\t');
  const sep = tab ? '\t' : ',';
  const rows: string[][] = [];
  let row: string[] = [], cell = '', q = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (q) {
      if (c === '"') { if (src[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c;
    } else if (c === '"' && !cell) q = true;
    else if (c === sep) { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some(x => x.trim())) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some(x => x.trim())) rows.push(row);
  return rows;
}

const norm = (h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, '');
const ALIASES: Record<keyof Omit<SheetLead, 'message'>, string[]> = {
  name: ['fullname', 'name', 'parentname', 'parentsname', 'leadname', 'customername'],
  phone: ['phonenumber', 'phone', 'mobile', 'mobilenumber', 'whatsappnumber', 'whatsapp', 'contactnumber', 'contact', 'mobileno', 'phoneno'],
  email: ['email', 'emailaddress', 'emailid'],
  city: ['city', 'location', 'town', 'area'],
  source: ['platform', 'source', 'leadsource'],
  campaign: ['campaignname', 'campaign'],
  adset: ['adsetname', 'adset'],
  ad: ['adname', 'ad'],
  form: ['formname', 'form'],
  leadId: ['id', 'leadid', 'leadgenid'],
  createdAt: ['createdtime', 'createdat', 'created', 'date', 'timestamp', 'time'],
};
const USED = new Set(Object.values(ALIASES).flat().concat(['firstname', 'lastname', 'isorganic', 'adid', 'adsetid', 'campaignid', 'formid']));

export const phone10 = (p?: string) => String(p || '').replace(/\D/g, '').slice(-10);

/** First row = headers. Unrecognised columns (the form's own questions) are kept in `message`. */
export function sheetToLeads(table: string[][]): { leads: SheetLead[]; invalid: number } {
  if (table.length < 2) return { leads: [], invalid: 0 };
  const heads = table[0].map(norm);
  const at = (names: string[]) => heads.findIndex(h => names.includes(h));
  const idx = Object.fromEntries(Object.entries(ALIASES).map(([k, v]) => [k, at(v)])) as Record<string, number>;
  const first = heads.indexOf('firstname'), last = heads.indexOf('lastname');
  const leads: SheetLead[] = [];
  let invalid = 0;
  for (const r of table.slice(1)) {
    const get = (k: string) => (idx[k] >= 0 ? (r[idx[k]] || '').trim() : '');
    const name = get('name') || [r[first], r[last]].filter(Boolean).join(' ').trim();
    const phone = phone10(get('phone'));
    if (name.length < 2 || phone.length < 10) { invalid++; continue; }
    const extra = table[0].map((h, i) => (!USED.has(heads[i]) && (r[i] || '').trim() ? `${h.replace(/_/g, ' ')}: ${r[i].trim()}` : '')).filter(Boolean);
    leads.push({
      name, phone, email: get('email'), city: get('city'), source: sourceOf(get('source')), campaign: get('campaign'), adset: get('adset'),
      ad: get('ad'), form: get('form'), leadId: get('leadId'), createdAt: get('createdAt'), message: extra.join('\n'),
    });
  }
  return { leads, invalid };
}

const sourceOf = (s: string) => (/^ig$|instagram/i.test(s) ? 'Instagram' : /^fb$|facebook/i.test(s) ? 'Facebook' : s || 'Meta Ads');

/** A Google Sheets share/edit link into its CSV export link. Returns null for anything that is not a Google Sheet. */
export function sheetCsvUrl(link: string): string | null {
  let u: URL;
  try { u = new URL(link.trim()); } catch { return null; }
  if (u.protocol !== 'https:' || u.hostname !== 'docs.google.com') return null;
  const id = u.pathname.match(/\/spreadsheets\/d\/(?:e\/)?([\w-]+)/)?.[1];
  if (!id) return null;
  if (u.pathname.includes('/pub')) return u.toString(); // "Publish to web" link, already CSV when output=csv
  const gid = (u.hash.match(/gid=(\d+)/) || u.search.match(/gid=(\d+)/))?.[1] || '0';
  return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
}

// What a caller can log after a call. `stage` moves the lead; `needsDate` asks for a call-back day.
export interface Outcome { id: string; label: string; stage?: string; lostReason?: string; needsDate?: boolean; connected: boolean; tone: string }
export const CALL_OUTCOMES: Outcome[] = [
  { id: 'interested', label: 'Interested', stage: 'interested', needsDate: true, connected: true, tone: 'bg-emerald-600 text-white' },
  { id: 'visit', label: 'Visit booked', stage: 'visit', needsDate: true, connected: true, tone: 'bg-violet-600 text-white' },
  { id: 'callback', label: 'Call back later', stage: 'contacted', needsDate: true, connected: true, tone: 'bg-sky-600 text-white' },
  { id: 'no_answer', label: 'No answer', needsDate: true, connected: false, tone: 'bg-amber-500 text-white' },
  { id: 'not_interested', label: 'Not interested', stage: 'lost', lostReason: 'Not interested', connected: true, tone: 'bg-stone-600 text-white' },
  { id: 'wrong_number', label: 'Wrong number', stage: 'lost', lostReason: 'Other', connected: false, tone: 'bg-red-600 text-white' },
];
export const outcomeOf = (id?: string) => CALL_OUTCOMES.find(o => o.id === id);
