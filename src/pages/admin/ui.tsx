import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import type { LeadStage } from '../../types';

// Shared styles and helpers for the admin panel tabs.
// One design system for every CRM screen: neutral slate surfaces, a single brand accent (--crm-accent,
// set from Settings → CRM branding), 8px radii, hairline borders and soft shadows.

export const input = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:border-[var(--crm-accent)] focus:outline-none focus:ring-3 focus:ring-[var(--crm-accent)]/15';
export const btn = 'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--crm-accent)]/25 disabled:pointer-events-none disabled:opacity-50 cursor-pointer';
export const btnPrimary = `${btn} bg-[var(--crm-accent)] text-white shadow-xs hover:brightness-95`;
export const btnGhost = `${btn} border border-slate-300 bg-white text-slate-700 shadow-xs hover:bg-slate-50`;
export const card = 'rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5';

export const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '');
export const fmtDay = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
export const csvCell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
export const rupees = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
// Today as YYYY-MM-DD in the browser's timezone
export const todayISO = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

// Contact key shared by enquiries and payments: last 10 digits of the mobile number (same rule as the server)
export const phoneKey = (p?: string) => String(p || '').replace(/\D/g, '').slice(-10);

// CRM pipeline, in funnel order. Stored in the enquiry's `status`.
export const STAGES: { id: LeadStage; label: string; color: string; dot: string }[] = [
  { id: 'new', label: 'New', color: 'bg-amber-100 text-amber-800', dot: 'bg-amber-400' },
  { id: 'contacted', label: 'Contacted', color: 'bg-sky-100 text-sky-800', dot: 'bg-sky-500' },
  { id: 'interested', label: 'Interested', color: 'bg-cyan-100 text-cyan-800', dot: 'bg-cyan-500' },
  { id: 'counselling', label: 'Counselling', color: 'bg-indigo-100 text-indigo-800', dot: 'bg-indigo-500' },
  { id: 'visit', label: 'Centre visit', color: 'bg-violet-100 text-violet-800', dot: 'bg-violet-500' },
  { id: 'application', label: 'Application', color: 'bg-fuchsia-100 text-fuchsia-800', dot: 'bg-fuchsia-500' },
  { id: 'admission', label: 'Admission', color: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
  { id: 'lost', label: 'Lost', color: 'bg-slate-200 text-slate-600', dot: 'bg-slate-400' },
];
export const stageOf = (id?: string) => STAGES.find(s => s.id === id) || STAGES[0];
export const stageIndex = (id?: string) => STAGES.findIndex(s => s.id === id);
export const isOpenStage = (id?: string) => id !== 'admission' && id !== 'lost';

export const LOST_REASONS = ['Not interested', 'Fee issue', 'Location issue', 'Joined competitor', 'No response', 'Admission postponed', 'Other'];
export const LEAD_SOURCES = ['Website', 'Instagram', 'Facebook', 'Google', 'WhatsApp', 'Phone', 'Referral', 'Walk-in', 'Franchise enquiry', 'School partnership'];
export const FOLLOW_UP_TYPES = ['Call', 'WhatsApp', 'Email', 'Centre visit', 'Counselling', 'Demo class', 'Fee discussion'];
export const PROGRAMMES = ['Playgroup', 'Nursery', 'Junior KG', 'Senior KG', 'Daycare', 'Teacher Training (FinnishWay)', 'Franchise', 'School partnership', 'Other'];

// Lead scoring (Kinderbee rules). 0-30 Cold, 31-60 Warm, 61+ Hot.
export type Temperature = 'Hot' | 'Warm' | 'Cold';
export function leadScore(e: { status?: string; fields?: any; notes?: string; touchCount?: number }): { score: number; temp: Temperature } {
  const source = String(e.fields?.source || 'Website');
  let score = source === 'WhatsApp' || source === 'Referral' ? 15 : 10;
  if (/\b(fee|fees|cost|price|charges?)\b/i.test(`${e.fields?.message || ''} ${e.notes || ''}`)) score += 20;
  const i = stageIndex(e.status);
  if (i >= stageIndex('visit')) score += 30;
  if (i >= stageIndex('application')) score += 40;
  if ((e.touchCount || 0) >= 2) score += 10;
  score = Math.min(100, score);
  const temp: Temperature = e.status === 'admission' ? 'Hot' : score > 60 ? 'Hot' : score > 30 ? 'Warm' : 'Cold';
  return { score, temp };
}
export const TEMP_STYLE: Record<Temperature, string> = {
  Hot: 'bg-red-100 text-red-700',
  Warm: 'bg-orange-100 text-orange-700',
  Cold: 'bg-sky-100 text-sky-700',
};

// WhatsApp message templates; {name} and {child} are filled in from the lead
export const WHATSAPP_TEMPLATES: { id: string; label: string; text: string }[] = [
  { id: 'new', label: 'New enquiry', text: 'Hi {name} 👋\nThank you for your interest in Kinderbee International Preschool. Our admission counsellor will contact you shortly.' },
  { id: 'visit', label: 'Centre visit confirmation', text: 'Hi {name}, your centre visit at Kinderbee is confirmed. We look forward to meeting you{childWith}! Reply here if you need directions.' },
  { id: 'reminder', label: 'Appointment reminder', text: 'Hi {name}, a friendly reminder about your appointment with Kinderbee today. See you soon!' },
  { id: 'admission', label: 'Admission confirmation', text: 'Hi {name}, congratulations! The admission{ofChild} at Kinderbee is confirmed. Welcome to the Kinderbee family 🐝' },
  { id: 'fee', label: 'Fee reminder', text: 'Hi {name}, this is a gentle reminder about the pending fee at Kinderbee. Please reach out if you have any questions.' },
  { id: 'followup', label: 'Follow-up check-in', text: 'Hi {name}, just checking in regarding {childOr} admission at Kinderbee. Would you like to schedule a centre visit this week?' },
];
export const fillTemplate = (text: string, name?: string, child?: string) =>
  text
    .replace(/\{name\}/g, (name || '').split(' ')[0] || 'there')
    .replace(/\{childWith\}/g, child ? ` and ${child}` : '')
    .replace(/\{ofChild\}/g, child ? ` of ${child}` : '')
    .replace(/\{childOr\}/g, child ? `${child}'s` : 'your child\'s');

export const STATUS_COLORS: Record<string, string> = {
  ...Object.fromEntries(STAGES.map(s => [s.id, s.color])),
  pending_verification: 'bg-amber-100 text-amber-800',
  verified: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export type Api = (url: string, options?: RequestInit) => Promise<any>;
export interface TabProps { api: Api; flash: (msg: string) => void }

// Loads a list from the API and reloads on demand
export function useList<T>(api: Api, url: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const reload = () => {
    setLoading(true);
    api(url).then(d => setItems(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(reload, [url]);
  return { items, setItems, loading, reload };
}

// Section heading row: title, record count and the section's actions
export const Toolbar: React.FC<{ title: string; count: number; onReload: () => void; children?: React.ReactNode }> = ({ title, count, onReload, children }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900">
      {title}
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium tabular-nums text-slate-600">{count}</span>
    </h2>
    <div className="flex flex-wrap gap-2">
      {children}
      <button onClick={onReload} className={btnGhost} aria-label={`Refresh ${title}`}><RefreshCw className="h-4 w-4" /> <span className="hidden sm:inline">Refresh</span></button>
    </div>
  </div>
);

export const Field: React.FC<{ label: string; full?: boolean; children: React.ReactNode }> = ({ label, full, children }) => (
  <label className={`block space-y-1.5 ${full ? 'sm:col-span-2' : ''}`}>
    <span className="text-xs font-medium text-slate-600">{label}</span>
    {children}
  </label>
);
