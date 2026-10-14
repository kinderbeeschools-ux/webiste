import React, { useEffect, useRef, useState } from 'react';
import { X, Download, Loader2, CheckCircle2, FileText } from 'lucide-react';

// Brochures behind a short form: the visitor's details are saved as a CRM lead (in the brochure's category),
// then the PDF downloads. A visitor who already filled it in on this device downloads straight away.
const BROCHURES = {
  franchise: {
    url: '/files/kinderbee-franchise-brochure-2026.pdf', file: 'Kinderbee-Franchise-Brochure-2026.pdf',
    title: 'Kinderbee Franchise Brochure 2026', subtitle: '10-page PDF · zero-royalty model, support and setup',
    leadType: 'franchise', formType: 'Franchise Brochure Download', program: 'Preschool franchise brochure',
    followUp: 'Our franchise team will contact you to answer your questions.', privacy: 'to follow up on your franchise enquiry',
  },
  courses: {
    url: '/files/finnishway-academy-teacher-training-brochure-2026-27.pdf', file: 'Finnishway-Academy-Teacher-Training-Brochure-2026-27.pdf',
    title: 'Finnishway Academy Admissions Guide 2026-27', subtitle: '4-page PDF · all teacher-training courses, fees and duration',
    leadType: 'ntt', formType: 'Course Brochure Download', program: 'Teacher training courses',
    followUp: 'Our admissions team will contact you about the course and the next batch.', privacy: 'to follow up on your course enquiry',
  },
} as const;
export type BrochureKind = keyof typeof BROCHURES;
export const BROCHURE_URL = BROCHURES.franchise.url;
const OPEN_EVENT = 'kb:brochure';
const doneKey = (kind: BrochureKind) => (kind === 'franchise' ? 'kb_brochure_lead' : `kb_brochure_lead_${kind}`);

// course: the course the visitor was looking at, kept on the CRM lead
export const openBrochureDownload = (from = 'Website', kind: BrochureKind = 'franchise', course = '') =>
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { from, kind, course } }));

export const downloadBrochure = (kind: BrochureKind = 'franchise') => {
  const a = document.createElement('a');
  a.href = BROCHURES[kind].url;
  a.download = BROCHURES[kind].file;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

const toPhone = (v: string) => v.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
const inputCls = 'w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E1007A]/25 focus:border-[#E1007A] transition';
const labelCls = 'block text-xs font-bold text-stone-700 mb-1';

export const BrochureDownload: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [req, setReq] = useState<{ from: string; kind: BrochureKind; course: string }>({ from: 'Website', kind: 'franchise', course: '' });
  const b = BROCHURES[req.kind];
  const [f, setF] = useState({ name: '', phone: '', email: '', city: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ from: string; kind: BrochureKind; course: string }>).detail;
      let already = false;
      try { already = !!localStorage.getItem(doneKey(detail.kind)); } catch { /* private mode */ }
      if (already) return downloadBrochure(detail.kind);
      setReq(detail);
      setError('');
      setDone(false);
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; };
  }, [open]);

  if (!open) return null;

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (f.name.trim().length < 2) return setError('Enter your full name.');
    if (!/^[6-9]\d{9}$/.test(toPhone(f.phone))) return setError('Enter a valid 10-digit mobile number.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return setError('Enter a valid email address.');
    if (f.city.trim().length < 2) return setError('Enter your city.');
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: b.leadType,
          fields: {
            name: f.name.trim(), phone: toPhone(f.phone), email: f.email.trim(), city: f.city.trim(),
            formType: b.formType, program: req.course || b.program,
            ...(req.kind === 'courses' ? { courseOfInterest: req.course || b.program } : {}),
            message: `Downloaded the ${b.title}${req.course ? ` (interested in ${req.course})` : ''}, from ${req.from}`,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not send your details. Please try again.');
      try { localStorage.setItem(doneKey(req.kind), '1'); } catch { /* private mode */ }
      setDone(true);
      downloadBrochure(req.kind);
    } catch (err: any) {
      setError(err.message === 'Failed to fetch' ? 'Network error. Check your connection and try again.' : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn" onMouseDown={e => e.target === e.currentTarget && setOpen(false)}>
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="bd-title"
        className="relative w-full sm:max-w-md max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl focus:outline-none">
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 px-5 sm:px-7 pt-5 pb-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-[#E1007A]"><FileText className="h-5 w-5" /></span>
            <div>
              <h2 id="bd-title" className="font-display text-lg font-extrabold text-stone-900 leading-snug">{b.title}</h2>
              <p className="text-xs text-stone-500">{b.subtitle}</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition cursor-pointer" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>

        <div className="px-5 sm:px-7 py-5">
          {done ? (
            <div className="space-y-4 text-center py-4">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
              <p className="font-display text-lg font-extrabold text-stone-900">Your download has started</p>
              <p className="text-sm text-stone-600">{b.followUp}</p>
              <button onClick={() => downloadBrochure(req.kind)} className="inline-flex items-center gap-2 rounded-xl bg-[#E1007A] px-5 py-3 text-sm font-bold text-white hover:bg-pink-700 transition cursor-pointer">
                <Download className="h-4 w-4" /> Download again
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-3.5">
              <p className="text-sm text-stone-600">Tell us who you are and the brochure downloads straight away.</p>
              {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700">{error}</div>}
              <div>
                <label htmlFor="bd-name" className={labelCls}>Full name *</label>
                <input id="bd-name" className={inputCls} value={f.name} onChange={set('name')} autoComplete="name" maxLength={80} placeholder="Your full name" />
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label htmlFor="bd-phone" className={labelCls}>Mobile number *</label>
                  <input id="bd-phone" className={inputCls} value={f.phone} onChange={set('phone')} type="tel" inputMode="numeric" autoComplete="tel" maxLength={16} placeholder="10-digit mobile" />
                </div>
                <div>
                  <label htmlFor="bd-city" className={labelCls}>City *</label>
                  <input id="bd-city" className={inputCls} value={f.city} onChange={set('city')} autoComplete="address-level2" maxLength={60} placeholder="e.g. Chennai" />
                </div>
              </div>
              <div>
                <label htmlFor="bd-email" className={labelCls}>Email address *</label>
                <input id="bd-email" className={inputCls} value={f.email} onChange={set('email')} type="email" autoComplete="email" maxLength={120} placeholder="you@example.com" />
              </div>
              <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#E1007A] px-5 py-3.5 text-sm font-bold text-white hover:bg-pink-700 transition cursor-pointer disabled:opacity-60">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {busy ? 'Sending…' : 'Get the brochure'}
              </button>
              <p className="text-[11px] text-stone-500 text-center">We use these details only {b.privacy}.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
