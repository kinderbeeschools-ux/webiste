import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Smartphone, ShieldCheck, Loader2, CheckCircle2, ArrowRight, Copy, Check, MessageCircle, Mail } from 'lucide-react';
import type { SystemSettings } from '../types';
import { UPI_ID, UPI_NAME } from '../data/consultation';
import { waLink } from './ConsultationBooking';
import { trackLead } from '../utils/analytics';

// Simple course payment: 1) details  2) pay by UPI + UTR  3) done. The team verifies in Admin → Payments,
// which emails the access details automatically.
const OPEN_EVENT = 'kb:course-payment';
export const openCoursePayment = (programme: string, amount: string) =>
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { programme, amount } }));

const toPhone = (v: string) => v.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
const today = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
const inputCls = 'w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 transition';
const labelCls = 'block text-xs font-bold text-stone-700 mb-1';

export const CoursePayment: React.FC<{ settings: SystemSettings | null }> = ({ settings }) => {
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState({ programme: '', amount: '' });
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [utr, setUtr] = useState('');
  const [payerUpi, setPayerUpi] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [qr, setQr] = useState('');
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const upi = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${course.amount}&cu=INR&tn=${encodeURIComponent(`${course.programme.slice(0, 30)} ${name.slice(0, 20)}`.trim())}`;

  useEffect(() => {
    const onOpen = (e: Event) => {
      setCourse((e as CustomEvent).detail);
      setStep(1);
      setUtr('');
      setError('');
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

  useEffect(() => {
    if (step === 2) QRCode.toDataURL(upi, { width: 280, margin: 1, errorCorrectionLevel: 'M' }).then(setQr).catch(() => setQr(''));
  }, [step, upi]);

  if (!open) return null;

  const toStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError('Enter your full name.');
    if (!/^[6-9]\d{9}$/.test(toPhone(phone))) return setError('Enter a valid 10-digit mobile number.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Enter a valid email address. Your course access is sent here.');
    setError('');
    setStep(2);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const clean = utr.replace(/\s/g, '');
    if (!/^\d{12}$/.test(clean)) return setError('Enter the 12-digit UPI transaction ID (UTR) from your payment app.');
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName: name.trim(), payerPhone: toPhone(phone), payerEmail: email.trim(), programme: course.programme,
          amount: course.amount, upiRefNumber: clean, payerUpi, paymentDate: today(), notes: 'Course payment (website)',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not submit your payment. Please try again.');
      setStep(3);
      trackLead('course_payment', 'Course payment', { program: course.programme, value: Number(course.amount) || undefined });
    } catch (err: any) {
      setError(err.message === 'Failed to fetch' ? 'Network error. Check your connection and try again.' : err.message);
    } finally {
      setBusy(false);
    }
  };

  const amountLabel = `₹${Number(course.amount).toLocaleString('en-IN')}`;
  const steps = ['Your details', 'Pay', 'Done'];

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn" onMouseDown={e => e.target === e.currentTarget && setOpen(false)}>
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="cp-title"
        className="relative w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto overscroll-contain rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl focus:outline-none">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-stone-100 px-5 sm:px-7 pt-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Course fee · {amountLabel}</p>
              <h2 id="cp-title" className="font-display text-lg font-extrabold text-stone-900 leading-snug">{course.programme}</h2>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition cursor-pointer" aria-label="Close"><X className="h-5 w-5" /></button>
          </div>
          {/* Progress */}
          <ol className="mt-3 grid grid-cols-3 gap-2" aria-label="Payment steps">
            {steps.map((s, i) => (
              <li key={s} className="space-y-1" aria-current={step === i + 1 ? 'step' : undefined}>
                <div className={`h-1.5 rounded-full transition-colors ${step > i ? 'bg-emerald-500' : 'bg-stone-200'}`} />
                <span className={`text-[11px] font-semibold ${step > i ? 'text-emerald-700' : 'text-stone-400'}`}>{i + 1}. {s}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="px-5 sm:px-7 py-5 space-y-4">
          {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700">{error}</div>}

          {step === 1 && (
            <form onSubmit={toStep2} noValidate className="space-y-3.5">
              <div>
                <label htmlFor="cp-name" className={labelCls}>Full name *</label>
                <input id="cp-name" className={inputCls} value={name} onChange={e => setName(e.target.value)} autoComplete="name" maxLength={80} placeholder="As it should appear on your certificate" />
              </div>
              <div>
                <label htmlFor="cp-phone" className={labelCls}>Mobile number *</label>
                <input id="cp-phone" className={inputCls} value={phone} onChange={e => setPhone(e.target.value)} type="tel" inputMode="numeric" autoComplete="tel" maxLength={16} placeholder="10-digit mobile" />
              </div>
              <div>
                <label htmlFor="cp-email" className={labelCls}>Email address *</label>
                <input id="cp-email" className={inputCls} value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" maxLength={120} placeholder="Course access will be sent here" />
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 text-sm shadow-md transition cursor-pointer">
                Continue to pay {amountLabel} <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 items-center">
                <div className="mx-auto rounded-2xl border border-stone-200 bg-white p-2.5 shadow-sm">
                  {qr ? <img src={qr} alt={`UPI QR code to pay ${amountLabel}`} className="h-40 w-40" /> : <div className="h-40 w-40 animate-pulse rounded-xl bg-stone-100" />}
                </div>
                <div className="space-y-2 text-sm text-stone-700">
                  <p className="font-semibold text-stone-900">Pay {amountLabel} with any UPI app</p>
                  <p className="text-xs text-stone-500">Scan the QR, or tap the button below on your phone. Google Pay, PhonePe and Paytm all work.</p>
                  <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5">
                    <span className="font-mono text-xs font-bold text-stone-800 truncate">{UPI_ID}</span>
                    <button type="button" aria-label="Copy UPI ID" className="ml-auto shrink-0 rounded-md p-1 text-stone-500 hover:bg-stone-200 cursor-pointer"
                      onClick={() => navigator.clipboard?.writeText(UPI_ID).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }).catch(() => {})}>
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
              <a href={upi} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 text-sm transition">
                <Smartphone className="h-4 w-4" /> Pay {amountLabel} now
              </a>

              <form onSubmit={submit} noValidate className="space-y-2.5 border-t border-stone-100 pt-4">
                <label htmlFor="cp-utr" className={labelCls}>After paying, enter the 12-digit UTR / UPI reference *</label>
                <input id="cp-utr" value={utr} onChange={e => setUtr(e.target.value.replace(/[^\d\s]/g, ''))} inputMode="numeric" maxLength={14}
                  placeholder="e.g. 412345678901" className={`${inputCls} font-mono tracking-wider`} />
                <label htmlFor="cp-upi" className={labelCls}>UPI ID you paid from <span className="font-normal text-stone-400">(optional, helps us match faster)</span></label>
                <input id="cp-upi" value={payerUpi} onChange={e => setPayerUpi(e.target.value.trim())} autoComplete="off" maxLength={60}
                  placeholder="e.g. yourname@okhdfcbank" className={inputCls} />
                <p className="text-xs text-stone-600">Paying as <strong>{name}</strong> · {toPhone(phone)}</p>
                <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3.5 text-sm shadow-md transition cursor-pointer">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {busy ? 'Submitting…' : 'I have paid. Submit'}
                </button>
                <p className="text-[11px] text-stone-500">
                  The UTR is on your payment receipt in the UPI app. By paying you agree to the{' '}
                  <a href="#cancellation-refund" target="_blank" rel="noopener noreferrer" className="underline">Cancellation & No-Refund Policy</a>.
                </p>
              </form>
              <button type="button" onClick={() => { setError(''); setStep(1); }} className="w-full text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer">← Edit my details</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 className="h-9 w-9" /></div>
              <div className="space-y-1.5">
                <h3 className="font-display text-xl font-extrabold text-stone-900">Payment submitted!</h3>
                <p className="text-sm text-stone-600">Thank you, {name.split(' ')[0]}. We'll verify your payment of {amountLabel} and send your course access to:</p>
                <p className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-800"><Mail className="h-4 w-4" /> {email}</p>
                <p className="text-xs text-stone-500">Usually within one working day. Please check your spam folder too.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a href={waLink(settings, `Hi Kinderbee Team, I have paid ${amountLabel} for ${course.programme}. UTR: ${utr.replace(/\s/g, '')}. Name: ${name}.`)} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20be5b] py-3 text-sm font-bold text-white transition">
                  <MessageCircle className="h-4 w-4" /> WhatsApp us
                </a>
                <button onClick={() => setOpen(false)} className="rounded-xl border border-stone-200 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition cursor-pointer">Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

