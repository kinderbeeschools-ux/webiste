import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, CalendarCheck, Copy, Check, ArrowRight, RefreshCw, Smartphone, ShieldCheck, Loader2, MessageCircle } from 'lucide-react';
import type { SystemSettings } from '../types';
import { trackLead, trackEvent } from '../utils/analytics';
import { waUrl } from '../utils/contact';
import {
  CONSULT_FEE, CONSULT_CATEGORIES, CONSULT_SLOTS, CONSULT_MAX_DAYS, CONSULT_STATUS, UPI_ID, upiLink,
  type Consultation,
} from '../data/consultation';

// Open the ₹99 booking flow from anywhere: openConsultationBooking('Teacher Training')
const OPEN_EVENT = 'kb:book-consultation';
export const openConsultationBooking = (category?: string) =>
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: category }));

// The last booking made on this device, so a visitor can come back to pay or check the status
const SAVED_KEY = 'kb_consultation';
const loadSaved = (): { ref: string; phone: string } | null => {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || 'null'); } catch { return null; }
};
const save = (ref: string, phone: string) => {
  try { localStorage.setItem(SAVED_KEY, JSON.stringify({ ref, phone })); } catch { /* private mode */ }
};

const toPhone = (v: string) => v.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
const MOBILE_RE = /^[6-9]\d{9}$/;
const localDay = (offsetDays = 0) => {
  const d = new Date(Date.now() + offsetDays * 864e5);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
const prettyDay = (d: string) => (d ? new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '');

export const waLink = (settings: SystemSettings | null, text: string) => waUrl(settings?.whatsappNumber || settings?.phone, text);

type Form = { name: string; phone: string; whatsapp: string; email: string; category: string; preferredDate: string; timeSlot: string; requirement: string };
const EMPTY: Form = { name: '', phone: '', whatsapp: '', email: '', category: '', preferredDate: '', timeSlot: '', requirement: '' };

function validate(f: Form): Partial<Record<keyof Form, string>> {
  const e: Partial<Record<keyof Form, string>> = {};
  if (f.name.trim().length < 2) e.name = 'Enter your full name.';
  if (!MOBILE_RE.test(toPhone(f.phone))) e.phone = 'Enter a valid 10-digit mobile number.';
  if (f.whatsapp.trim() && !MOBILE_RE.test(toPhone(f.whatsapp))) e.whatsapp = 'Enter a valid 10-digit WhatsApp number, or leave it empty.';
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Enter a valid email address, or leave it empty.';
  if (!f.category) e.category = 'Choose a consultation category.';
  if (!f.preferredDate || f.preferredDate < localDay() || f.preferredDate > localDay(CONSULT_MAX_DAYS)) e.preferredDate = `Choose a date within the next ${CONSULT_MAX_DAYS} days.`;
  if (!f.timeSlot) e.timeSlot = 'Choose a time slot.';
  if (f.requirement.trim().length < 10) e.requirement = 'Tell us a little about what you need (at least 10 characters).';
  return e;
}

const inputCls = 'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E1007A]/25 focus:border-[#E1007A] transition';
const labelCls = 'block text-xs font-bold text-stone-700 mb-1';

const FieldWrap: React.FC<{ id: keyof Form; label: string; error?: string; children: React.ReactNode }> = ({ id, label, error, children }) => (
  <div>
    <label htmlFor={`cb-${id}`} className={labelCls}>{label}</label>
    {children}
    {error && <p id={`cb-${id}-err`} className="mt-1 text-[11px] font-semibold text-red-600">{error}</p>}
  </div>
);

export const ConsultationBooking: React.FC<{ settings: SystemSettings | null }> = ({ settings }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'pay' | 'status'>('form');
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [booking, setBooking] = useState<Consultation | null>(null);
  const [utr, setUtr] = useState('');
  const [payerUpi, setPayerUpi] = useState('');
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState('');
  const [qr, setQr] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState<{ ref: string; phone: string } | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const category = (e as CustomEvent<string | undefined>).detail;
      setForm(f => ({ ...f, category: category && (CONSULT_CATEGORIES as readonly string[]).includes(category) ? category : f.category }));
      setStep('form');
      setErrors({});
      setApiError('');
      setSaved(loadSaved());
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
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  useEffect(() => {
    if (step !== 'pay' || !booking) return;
    QRCode.toDataURL(upiLink(booking.ref), { width: 280, margin: 1, errorCorrectionLevel: 'M' }).then(setQr).catch(() => setQr(''));
  }, [step, booking]);

  if (!open) return null;

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(x => ({ ...x, [k]: undefined }));
  };
  const fieldProps = (k: keyof Form) => ({
    id: `cb-${k}`,
    value: form[k],
    onChange: set(k),
    'aria-invalid': !!errors[k],
    'aria-describedby': errors[k] ? `cb-${k}-err` : undefined,
    className: `${inputCls} ${errors[k] ? 'border-red-400' : 'border-stone-200'}`,
  });

  const call = async (url: string, body?: object) => {
    setBusy(true);
    setApiError('');
    try {
      const res = await fetch(url, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : undefined);
      const data = await res.json().catch(() => ({}));
      if (data.booking) setBooking(data.booking);
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      return data;
    } catch (e: any) {
      setApiError(e.message === 'Failed to fetch' ? 'Network error. Check your connection and try again.' : e.message);
      return null;
    } finally {
      setBusy(false);
    }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`cb-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    const data = await call('/api/consultations', { ...form, phone: toPhone(form.phone), whatsapp: toPhone(form.whatsapp) });
    if (data?.booking) {
      save(data.booking.ref, data.booking.phone);
      trackLead('consultation_booking', 'Consultation booking', { program: form.category || undefined, value: Number(data.booking.amount) || 99 });
      setUtr('');
      setStep('pay');
    }
  };

  const submitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || !booking) return;
    const clean = utr.replace(/\s/g, '');
    if (!/^\d{12}$/.test(clean)) {
      setApiError('Enter the 12-digit UPI transaction ID (UTR) shown in your payment app.');
      return;
    }
    const data = await call(`/api/consultations/${booking.ref}/payment`, { phone: booking.phone, utr: clean, payerUpi, booking });
    if (data?.booking) {
      trackEvent('payment_submitted', { payment_for: 'consultation', value: Number(data.booking.amount) || 99, currency: 'INR' });
      setStep('status');
    }
  };

  const loadStatus = async (ref: string, phone: string) => {
    const data = await call(`/api/consultations/${encodeURIComponent(ref)}?phone=${encodeURIComponent(phone)}`);
    if (data?.booking) setStep('status');
  };

  const copyUpi = () => {
    navigator.clipboard?.writeText(UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  };

  const status = booking ? CONSULT_STATUS[booking.status] : null;
  const whatsappText = booking
    ? `Hi Kinderbee Team, my consultation booking reference is ${booking.ref} (${booking.category}, ${prettyDay(booking.preferredDate)}, ${booking.timeSlot}).`
    : 'Hi Kinderbee Team, I would like to book a 1:1 consultation.';

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn" onMouseDown={e => e.target === e.currentTarget && setOpen(false)}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cb-title"
        className="relative w-full sm:max-w-xl max-h-[92dvh] overflow-y-auto overscroll-contain rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl focus:outline-none"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-stone-100 bg-white/95 backdrop-blur px-5 sm:px-7 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[#E1007A]">
              <CalendarCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 id="cb-title" className="font-display text-lg sm:text-xl font-extrabold text-stone-900 leading-tight">Book a 1:1 Consultation</h2>
              <p className="text-xs text-stone-500">
                {step === 'form' ? 'Step 1 of 2 · Your details' : step === 'pay' ? `Step 2 of 2 · Pay ₹${CONSULT_FEE}` : 'Booking status'}
              </p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition cursor-pointer" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 sm:px-7 py-5 space-y-4">
          {apiError && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700">{apiError}</div>
          )}

          {/* STEP 1: details */}
          {step === 'form' && (
            <form onSubmit={submitForm} noValidate className="space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-pink-50 to-amber-50 border border-pink-100 px-4 py-3">
                <p className="text-xs sm:text-sm text-stone-700 leading-snug">Talk one-to-one with the Kinderbee team about your requirement.</p>
                <span className="shrink-0 font-display text-2xl font-extrabold text-[#E1007A]">₹{CONSULT_FEE}</span>
              </div>

              {saved && (
                <button type="button" onClick={() => loadStatus(saved.ref, saved.phone)} disabled={busy}
                  className="w-full flex items-center justify-between gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition cursor-pointer">
                  <span>Already booked? View booking <span className="font-mono text-[#E1007A]">{saved.ref}</span></span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <FieldWrap id="name" label="Full name *" error={errors.name}>
                  <input {...fieldProps('name')} autoComplete="name" maxLength={80} placeholder="Your full name" />
                </FieldWrap>
                <FieldWrap id="phone" label="Mobile number *" error={errors.phone}>
                  <input {...fieldProps('phone')} type="tel" inputMode="numeric" autoComplete="tel" maxLength={16} placeholder="10-digit mobile" />
                </FieldWrap>
                <FieldWrap id="whatsapp" label="WhatsApp number (if different)" error={errors.whatsapp}>
                  <input {...fieldProps('whatsapp')} type="tel" inputMode="numeric" maxLength={16} placeholder="Optional" />
                </FieldWrap>
                <FieldWrap id="email" label="Email address (optional)" error={errors.email}>
                  <input {...fieldProps('email')} type="email" autoComplete="email" maxLength={120} placeholder="you@example.com" />
                </FieldWrap>
                <div className="sm:col-span-2">
                  <FieldWrap id="category" label="Consultation category *" error={errors.category}>
                    <select {...fieldProps('category')}>
                      <option value="">Select a category</option>
                      {CONSULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </FieldWrap>
                </div>
                <FieldWrap id="preferredDate" label="Preferred date *" error={errors.preferredDate}>
                  <input {...fieldProps('preferredDate')} type="date" min={localDay()} max={localDay(CONSULT_MAX_DAYS)} />
                </FieldWrap>
                <FieldWrap id="timeSlot" label="Preferred time slot *" error={errors.timeSlot}>
                  <select {...fieldProps('timeSlot')}>
                    <option value="">Select a slot</option>
                    {CONSULT_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </FieldWrap>
                <div className="sm:col-span-2">
                  <FieldWrap id="requirement" label="Briefly describe your requirement *" error={errors.requirement}>
                    <textarea {...fieldProps('requirement')} rows={3} maxLength={1000} placeholder="e.g. I want to understand the franchise setup cost for a 2,000 sq ft space in Chennai." />
                  </FieldWrap>
                </div>
              </div>

              <button type="submit" disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#E1007A] hover:bg-[#c8006d] disabled:opacity-60 text-white font-bold py-3.5 text-sm shadow-md transition cursor-pointer">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {busy ? 'Creating your booking…' : `Continue to pay ₹${CONSULT_FEE}`}
              </button>
              <p className="text-[11px] text-stone-500 text-center">Your slot is confirmed after the payment is verified by our team.</p>
            </form>
          )}

          {/* STEP 2: pay by UPI, then submit the UTR */}
          {step === 'pay' && booking && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
                <div className="text-xs text-stone-600">
                  Booking reference
                  <div className="font-mono text-base font-bold text-stone-900">{booking.ref}</div>
                </div>
                <div className="text-right text-xs text-stone-600">
                  Consultation fee
                  <div className="font-display text-2xl font-extrabold text-[#E1007A] leading-none">₹{CONSULT_FEE}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 items-center">
                <div className="mx-auto rounded-2xl border border-stone-200 bg-white p-2.5 shadow-sm">
                  {qr ? <img src={qr} alt={`UPI QR code to pay ₹${CONSULT_FEE}`} className="h-44 w-44" /> : <div className="h-44 w-44 animate-pulse rounded-xl bg-stone-100" />}
                </div>
                <div className="space-y-2.5 text-sm text-stone-700">
                  <p className="font-semibold text-stone-900">Pay with Google Pay, PhonePe, Paytm or any UPI app</p>
                  <ol className="list-decimal pl-4 space-y-1 text-xs text-stone-600">
                    <li>Scan the QR, or tap the button below on your phone.</li>
                    <li>Pay exactly ₹{CONSULT_FEE}.</li>
                    <li>Copy the 12-digit UTR / UPI reference from the payment receipt.</li>
                  </ol>
                  <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5">
                    <span className="font-mono text-xs font-bold text-stone-800 truncate">{UPI_ID}</span>
                    <button type="button" onClick={copyUpi} className="ml-auto shrink-0 rounded-md p-1 text-stone-500 hover:bg-stone-200 transition cursor-pointer" aria-label="Copy UPI ID">
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <a href={upiLink(booking.ref)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 text-sm transition">
                <Smartphone className="h-4 w-4" /> Pay ₹{CONSULT_FEE} with a UPI app
              </a>

              <form onSubmit={submitUtr} noValidate className="space-y-2.5 border-t border-stone-100 pt-4">
                <label htmlFor="cb-utr" className={labelCls}>After paying, enter the UPI transaction ID (UTR) *</label>
                <input id="cb-utr" value={utr} onChange={e => setUtr(e.target.value.replace(/[^\d\s]/g, ''))} inputMode="numeric" maxLength={14}
                  placeholder="12-digit number, e.g. 412345678901" className={`${inputCls} border-stone-200 font-mono tracking-wider`} />
                <label htmlFor="cb-upi" className={labelCls}>UPI ID you paid from <span className="font-normal text-stone-400">(optional, helps us match faster)</span></label>
                <input id="cb-upi" value={payerUpi} onChange={e => setPayerUpi(e.target.value.trim())} autoComplete="off" maxLength={60}
                  placeholder="e.g. yourname@okhdfcbank" className={`${inputCls} border-stone-200`} />
                <p className="text-xs text-stone-600">Paying as <strong>{booking.name}</strong> · {booking.phone}</p>
                <button type="submit" disabled={busy}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#E1007A] hover:bg-[#c8006d] disabled:opacity-60 text-white font-bold py-3.5 text-sm shadow-md transition cursor-pointer">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {busy ? 'Submitting…' : 'Submit payment for verification'}
                </button>
                <p className="text-[11px] text-stone-500">
                  Your booking stays <strong>Pending Payment</strong> until you submit the UTR, and is marked <strong>Paid</strong> only after our team matches it with the bank statement.
                </p>
              </form>
              <button type="button" onClick={() => setStep('status')} className="w-full text-xs font-semibold text-stone-500 hover:text-stone-800 transition cursor-pointer">
                I'll pay later. Show my booking
              </button>
            </div>
          )}

          {/* STATUS */}
          {step === 'status' && booking && status && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-stone-200 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-base font-bold text-stone-900">{booking.ref}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.color}`}>{status.label}</span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed">{status.note}</p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs border-t border-stone-100 pt-3">
                  <dt className="text-stone-500">Name</dt><dd className="font-semibold text-stone-800">{booking.name}</dd>
                  <dt className="text-stone-500">Category</dt><dd className="font-semibold text-stone-800">{booking.category}</dd>
                  <dt className="text-stone-500">Preferred</dt><dd className="font-semibold text-stone-800">{prettyDay(booking.preferredDate)}, {booking.timeSlot}</dd>
                  {booking.scheduledAt && (<><dt className="text-stone-500">Scheduled</dt><dd className="font-semibold text-stone-800">{new Date(booking.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</dd></>)}
                  <dt className="text-stone-500">Fee</dt><dd className="font-semibold text-stone-800">₹{booking.amount || CONSULT_FEE}{booking.upiRef ? ` · UTR ${booking.upiRef}` : ''}</dd>
                </dl>
              </div>

              {(booking.status === 'pending_payment' || booking.status === 'payment_failed') && (
                <button type="button" onClick={() => { setApiError(''); setUtr(''); setStep('pay'); }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#E1007A] hover:bg-[#c8006d] text-white font-bold py-3.5 text-sm shadow-md transition cursor-pointer">
                  <ArrowRight className="h-4 w-4" /> {booking.status === 'payment_failed' ? 'Submit the payment again' : `Pay ₹${CONSULT_FEE} now`}
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button type="button" onClick={() => loadStatus(booking.ref, booking.phone)} disabled={busy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 py-3 text-sm font-semibold text-stone-700 transition cursor-pointer">
                  <RefreshCw className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} /> Refresh status
                </button>
                <a href={waLink(settings, whatsappText)} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20be5b] py-3 text-sm font-bold text-white transition">
                  <MessageCircle className="h-4 w-4" /> WhatsApp the team
                </a>
              </div>

              <div className="rounded-xl bg-stone-50 px-4 py-3 text-xs text-stone-600 leading-relaxed">
                <strong className="text-stone-800">Next steps:</strong> once your payment is verified, the Kinderbee team will call or WhatsApp you on {booking.whatsapp || booking.phone} to confirm the exact consultation time. Keep your booking reference handy.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Offer card shown on pages, styled as a booking ticket; the category pre-selects the form
const OFFER_POINTS = ['One-to-one with the Kinderbee team', 'A date and time that suits you', 'Clear next steps for your plan'];

// Next five weekdays, for the decorative date picker on the ticket
const nextWeekdays = () => {
  const days: Date[] = [];
  for (let d = new Date(); days.length < 5; ) {
    d = new Date(d.getTime() + 864e5);
    if (d.getDay() !== 0) days.push(d);
  }
  return days;
};

export const ConsultationOffer: React.FC<{ category?: string; className?: string }> = ({ category, className = '' }) => {
  const [days] = useState(nextWeekdays);
  const [active, setActive] = useState(1);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setActive(i => (i + 1) % 5), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`group drop-shadow-[0_18px_30px_rgba(120,0,64,0.22)] transition-transform duration-500 hover:-translate-y-1 ${className}`}>
      <div className="kb-ticket relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#E1007A] via-[#c4006b] to-[#6d0a45] text-white flex flex-col md:flex-row">
        {/* Decorative glow, dots and a flying bee */}
        <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-[#FF7A00]/30 blur-3xl kb-drift" />
        <div className="pointer-events-none absolute right-1/3 -bottom-24 h-64 w-64 rounded-full bg-[#FFD400]/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:18px_18px]" />
        <svg aria-hidden="true" viewBox="0 0 64 48" className="kb-fly pointer-events-none absolute right-6 top-5 md:right-[330px] md:top-6 h-9 w-12 opacity-90">
          <path d="M6 30 C 14 18, 24 40, 34 26" stroke="#FFD400" strokeWidth="1.5" strokeDasharray="3 4" fill="none" />
          <ellipse cx="46" cy="18" rx="7" ry="5" fill="white" fillOpacity=".75" />
          <ellipse cx="44" cy="28" rx="10" ry="8" fill="#FFD400" />
          <path d="M41 21v14M46 21v14" stroke="#1c1917" strokeWidth="2.4" />
          <circle cx="52" cy="26" r="1.4" fill="#1c1917" />
        </svg>

        {/* Main part */}
        <div className="relative flex-1 p-6 sm:p-8 space-y-5">
          <div className="space-y-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD400] px-3 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-stone-900">
              <CalendarCheck className="h-3.5 w-3.5" /> 1:1 Consultation
            </span>
            <h3 className="font-display text-[1.65rem] sm:text-3xl font-extrabold leading-tight tracking-tight">
              Talk to us, <span className="text-[#FFD400]">one-to-one</span>
            </h3>
            <p className="text-sm text-pink-50/90 leading-relaxed max-w-xl">
              Discuss your requirement directly with the Kinderbee team: admissions, starting a preschool, teacher training or anything else.
            </p>
          </div>

          <ul className="grid gap-2 sm:grid-cols-3">
            {OFFER_POINTS.map(p => (
              <li key={p} className="flex items-center gap-2 text-xs font-semibold text-white">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20"><Check className="h-3 w-3" /></span>
                {p}
              </li>
            ))}
          </ul>

          {/* Decorative date picker that hints at the booking step */}
          <div aria-hidden="true" className="rounded-2xl bg-white/10 border border-white/15 p-3 backdrop-blur-sm">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {days.map((d, i) => (
                <div key={i} className={`rounded-xl py-2 text-center transition-all duration-500 ${i === active ? 'bg-white text-[#E1007A] shadow-lg scale-105' : 'bg-white/5 text-pink-50/80'}`}>
                  <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</div>
                  <div className="font-display text-base sm:text-lg font-extrabold leading-none mt-0.5">{d.getDate()}</div>
                </div>
              ))}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {['10:00 AM', '12:00 PM', '3:00 PM', '5:00 PM'].map((s, i) => (
                <span key={s} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors duration-500 ${i === active % 4 ? 'bg-[#FFD400] text-stone-900' : 'bg-white/10 text-pink-50/80'}`}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Stub: perforated edge, price and CTA (height matches the notch position in .kb-ticket) */}
        <div className="relative h-[210px] md:h-auto md:w-[300px] shrink-0 flex flex-col items-center justify-center gap-3 px-6 text-center border-t-2 md:border-t-0 md:border-l-2 border-dashed border-white/35 bg-black/10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-pink-100/80">Consultation fee</span>
          <div className="relative">
            <span className="font-display text-6xl font-extrabold leading-none text-[#FFD400] drop-shadow-sm">₹{CONSULT_FEE}</span>
            <span className="absolute -right-9 -top-2 rotate-12 rounded-md bg-white px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-[#E1007A] shadow">only</span>
          </div>
          <button type="button" onClick={() => openConsultationBooking(category)}
            className="relative overflow-hidden inline-flex w-full max-w-[250px] items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-extrabold text-[#E1007A] shadow-lg transition hover:bg-pink-50 active:scale-[0.98] cursor-pointer">
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-pink-200/70 to-transparent transition-[left] duration-700 group-hover:left-[120%]" />
            Book Consultation for ₹{CONSULT_FEE} <ArrowRight className="h-4 w-4" />
          </button>
          <span className="text-[10px] text-pink-100/80">Pay by UPI · Google Pay, PhonePe, Paytm</span>
        </div>
      </div>
    </div>
  );
};
