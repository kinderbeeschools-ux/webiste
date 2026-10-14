import React, { useMemo, useState } from 'react';
import { MessageCircle, Phone, Check, X, Download } from 'lucide-react';
import { CONSULT_STATUS, CONSULT_FEE, type Consultation, type ConsultStatus } from '../../data/consultation';
import { input, btnPrimary, btnGhost, card, fmtDate, csvCell, useList, Toolbar, type TabProps } from './ui';

// Admin: ₹99 one-to-one consultation bookings.
// Paid / Payment Failed come only from verifying or rejecting the linked payment (same rule as the Payments tab).
type Filter = ConsultStatus | 'all';
const FILTERS: Filter[] = ['verification_pending', 'paid', 'scheduled', 'pending_payment', 'payment_failed', 'completed', 'cancelled', 'all'];

const prettyDay = (d: string) => (d ? new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '');
// datetime-local value in the browser's timezone
const toLocalInput = (iso?: string) => (iso ? new Date(new Date(iso).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '');
const wa = (n: string, text: string) => `https://wa.me/91${String(n).replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(text)}`;

export const ConsultationsTab: React.FC<TabProps> = ({ api, flash }) => {
  const { items, setItems, loading, reload } = useList<Consultation>(api, '/api/consultations');
  const [filter, setFilter] = useState<Filter>('verification_pending');
  const [query, setQuery] = useState('');

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    items.forEach(b => { c[b.status] = (c[b.status] || 0) + 1; });
    return c;
  }, [items]);

  const shown = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(b =>
      (filter === 'all' || b.status === filter) &&
      (!q || [b.ref, b.name, b.phone, b.whatsapp, b.email, b.upiRef, b.category].some(v => String(v || '').toLowerCase().includes(q))));
  }, [items, filter, query]);

  const patchLocal = (ref: string, patch: Partial<Consultation>) => setItems(list => list.map(x => (x.ref === ref ? { ...x, ...patch } : x)));

  const verify = async (b: Consultation, ok: boolean) => {
    if (!b.paymentId) return;
    if (!ok && !confirm(`Mark payment ${b.upiRef} from ${b.name} as failed?`)) return;
    await api(`/api/payments/${b.paymentId}`, { method: 'PUT', body: JSON.stringify({ status: ok ? 'verified' : 'rejected' }) });
    patchLocal(b.ref, { status: ok ? 'paid' : 'payment_failed' });
    flash(ok ? 'Payment verified: booking is Paid' : 'Marked Payment Failed');
  };

  const update = async (b: Consultation, patch: { status?: ConsultStatus; scheduledAt?: string; adminNotes?: string }, msg: string) => {
    if (patch.status === 'cancelled' && !confirm(`Cancel booking ${b.ref}?`)) return;
    await api(`/api/consultations/${b.ref}`, { method: 'PUT', body: JSON.stringify(patch) });
    patchLocal(b.ref, { ...patch, scheduledAt: patch.scheduledAt ? new Date(patch.scheduledAt).toISOString() : patch.scheduledAt ?? b.scheduledAt });
    flash(msg);
  };

  const exportCsv = () => {
    const head = ['Booked', 'Reference', 'Status', 'Name', 'Mobile', 'WhatsApp', 'Email', 'Category', 'Preferred date', 'Slot', 'Scheduled', 'UTR', 'Requirement', 'Notes'];
    const rows = shown.map(b => [fmtDate(b.createdAt), b.ref, CONSULT_STATUS[b.status]?.label, b.name, b.phone, b.whatsapp, b.email, b.category, b.preferredDate, b.timeSlot, fmtDate(b.scheduledAt), b.upiRef, b.requirement, b.adminNotes]);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([[head, ...rows].map(r => r.map(csvCell).join(',')).join('\n')], { type: 'text/csv' }));
    a.download = `kinderbee-consultations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <section className="space-y-4">
      <Toolbar title="Consultations" count={shown.length} onReload={reload}>
        <button onClick={exportCsv} className={btnGhost} disabled={!shown.length}><Download className="h-4 w-4" /> CSV</button>
      </Toolbar>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${filter === f ? 'bg-[var(--crm-accent)] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
            {f === 'all' ? 'All' : CONSULT_STATUS[f].label} <span className="opacity-70">({counts[f] || 0})</span>
          </button>
        ))}
      </div>
      <input className={input} placeholder="Search reference, name, mobile, email, UTR…" value={query} onChange={e => setQuery(e.target.value)} />
      <p className="text-xs text-slate-500">
        Check each UTR against the bank / UPI statement for ₹{CONSULT_FEE} before verifying. Verifying here also verifies it in Payments.
      </p>

      {loading ? <p className="text-sm text-slate-500">Loading…</p> : !shown.length ? <p className="text-sm text-slate-500">No bookings here.</p> : (
        <div className="space-y-2">
          {shown.map(b => {
            const st = CONSULT_STATUS[b.status];
            const canSchedule = b.status === 'paid' || b.status === 'scheduled';
            return (
              <div key={b.ref} className={`${card} space-y-3`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-base font-semibold">{b.name} <span className="font-mono text-sm font-normal text-slate-500">· {b.ref}</span></div>
                    <div className="text-sm text-slate-600">{b.category} · prefers {prettyDay(b.preferredDate)}, {b.timeSlot}</div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${st?.color || ''}`}>{st?.label || b.status}</span>
                </div>

                <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">{b.requirement}</p>

                <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600">
                  <a href={`tel:+91${b.phone}`} className="inline-flex items-center gap-1 hover:text-[var(--crm-accent)]"><Phone className="h-3.5 w-3.5" /> {b.phone}</a>
                  <a href={wa(b.whatsapp || b.phone, `Hi ${b.name.split(' ')[0]}, this is the Kinderbee team about your consultation booking ${b.ref}.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-emerald-600">
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp {b.whatsapp && b.whatsapp !== b.phone ? b.whatsapp : ''}
                  </a>
                  {b.email && <a href={`mailto:${b.email}`} className="hover:text-[var(--crm-accent)]">{b.email}</a>}
                  <span>Booked {fmtDate(b.createdAt)}</span>
                  {b.upiRef && <span>UTR <span className="font-mono">{b.upiRef}</span></span>}
                </div>

                {b.status === 'verification_pending' && (
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => verify(b, true)} className={btnPrimary}><Check className="h-4 w-4" /> Verify ₹{b.amount || CONSULT_FEE} payment</button>
                    <button onClick={() => verify(b, false)} className={btnGhost}><X className="h-4 w-4" /> Payment failed</button>
                  </div>
                )}

                {canSchedule && (
                  <div className="flex flex-wrap items-end gap-2">
                    <label className="text-xs font-semibold text-slate-600">
                      Consultation time
                      <input type="datetime-local" className={`${input} mt-1`} defaultValue={toLocalInput(b.scheduledAt)}
                        onBlur={e => e.target.value && e.target.value !== toLocalInput(b.scheduledAt) && update(b, { status: 'scheduled', scheduledAt: new Date(e.target.value).toISOString() }, 'Consultation scheduled')} />
                    </label>
                    {b.status === 'scheduled' && <button onClick={() => update(b, { status: 'completed' }, 'Marked completed')} className={btnGhost}><Check className="h-4 w-4" /> Completed</button>}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <input className={`${input} flex-1 min-w-[12rem]`} placeholder="Internal notes" defaultValue={b.adminNotes || ''}
                    onBlur={e => e.target.value !== (b.adminNotes || '') && update(b, { adminNotes: e.target.value }, 'Notes saved')} />
                  {b.status !== 'cancelled' && b.status !== 'completed' && (
                    <button onClick={() => update(b, { status: 'cancelled' }, 'Booking cancelled')} className={`${btnGhost} text-red-600`}>Cancel booking</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
