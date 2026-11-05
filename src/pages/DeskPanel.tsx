import React, { useEffect, useMemo, useState } from 'react';
import { Inbox, CreditCard, LogOut, ExternalLink, Download, RefreshCw, Phone, MessageCircle, Mail, Trash2, Search, Check, X, Undo2, Clock3 } from 'lucide-react';
import type { Enquiry, PaymentRecord, SystemSettings } from '../types';
import { STAGES, stageOf, fmtDate, csvCell, phoneKey, rupees, type Api } from './admin/ui';
import { ENQUIRY_CATEGORIES, enquiryCategory, categoryInfo } from '../data/enquiry';
import type { Me } from './admin/portal/common';
import type { Consultation } from '../data/consultation';

// Focused desk for the two daily jobs: answering enquiries and verifying UPI payments.
// Same login, token and API as /admin; styled with the website's own brand colours.

const PINK = '#E1007A', YELLOW = '#FFD400', PURPLE = '#7209B7';
const field = 'w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#E1007A] focus:outline-none focus:ring-4 focus:ring-[#E1007A]/10';
const pill = (on: boolean) => `rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${on ? 'bg-[#1C1917] text-white' : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-[#E1007A]/40'}`;
const act = 'inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition cursor-pointer disabled:opacity-50';
const actGhost = `${act} bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50`;
const label = 'text-[11px] font-bold uppercase tracking-wider text-stone-400';

const PAY_STYLE: Record<PaymentRecord['status'], { text: string; cls: string }> = {
  pending_verification: { text: 'Pending', cls: 'bg-[#FFD400]/30 text-[#7a5f00]' },
  verified: { text: 'Verified', cls: 'bg-emerald-100 text-emerald-800' },
  rejected: { text: 'Rejected', cls: 'bg-red-100 text-red-700' },
};
const STAGE_DOT = (s?: string) => stageOf(s).color;
const SINCE = (iso?: string) => { const d = Math.floor((Date.now() - new Date(iso || 0).getTime()) / 864e5); return d <= 0 ? 'today' : d === 1 ? 'yesterday' : `${d}d ago`; };
const download = (name: string, head: string[], rows: unknown[][]) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([[head, ...rows].map(r => r.map(csvCell).join(',')).join('\n')], { type: 'text/csv' }));
  a.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
};

interface Props { adminToken: string; onLogout: () => void; onVisitSite: () => void; settings: SystemSettings | null }
type View = 'enquiries' | 'payments';

export const DeskPanel: React.FC<Props> = ({ adminToken, onLogout, onVisitSite, settings }) => {
  const [me, setMe] = useState<Me | null>(null);
  const [view, setView] = useState<View>('enquiries');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [bookings, setBookings] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const api: Api = async (url, options = {}) => {
    const res = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}`, ...(options.headers || {}) } });
    if (res.status === 403) { onLogout(); throw new Error('Session expired. Please sign in again.'); }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { const m = data.error || `Request failed (${res.status})`; setError(m); throw new Error(m); }
    setError('');
    return data;
  };
  const flash = (m: string) => { setNotice(m); setTimeout(() => setNotice(''), 2500); };
  const can = (p: string) => !!me?.perms.includes(p as any);

  const load = async (who = me) => {
    if (!who) return;
    setLoading(true);
    const list = (r: PromiseSettledResult<any>) => (r.status === 'fulfilled' && Array.isArray(r.value) ? r.value : []);
    const [e, p, b] = await Promise.allSettled([
      who.perms.includes('leads') || who.perms.includes('leads_branch') ? api('/api/enquiries') : Promise.resolve([]),
      who.perms.includes('payments') ? api('/api/payments') : Promise.resolve([]),
      who.perms.includes('payments') && who.perms.includes('leads') ? api('/api/consultations') : Promise.resolve([]),
    ]);
    setEnquiries(list(e)); setPayments(list(p)); setBookings(list(b).filter((c: Consultation) => c.status === 'pending_payment')); setLoading(false);
  };

  useEffect(() => {
    api('/api/auth/me').then((m: Me) => {
      setMe(m);
      if (!m.perms.includes('leads') && !m.perms.includes('leads_branch') && m.perms.includes('payments')) setView('payments');
      load(m);
    }).catch(() => {});
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const verified = payments.filter(p => p.status === 'verified');
    return {
      fresh: enquiries.filter(e => e.status === 'new').length,
      today: enquiries.filter(e => new Date(e.createdAt).toDateString() === today).length,
      pending: payments.filter(p => p.status === 'pending_verification').length,
      revenue: verified.reduce((s, p) => s + (Number(p.amount) || 0), 0),
    };
  }, [enquiries, payments]);

  if (!me) return <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] text-sm text-stone-500">{error || 'Opening your desk…'}</div>;

  const showEnq = can('leads') || can('leads_branch'), showPay = can('payments');
  const brand = settings?.logoText || 'Kinderbee';
  const tiles = [
    { t: 'New enquiries', v: stats.fresh, s: `${stats.today} received today`, bg: PINK, fg: '#fff' },
    { t: 'Total enquiries', v: enquiries.length, s: 'all time', bg: PURPLE, fg: '#fff' },
    { t: 'Payments to verify', v: stats.pending, s: stats.pending ? 'check each UTR' : 'all caught up', bg: YELLOW, fg: '#1C1917' },
    { t: 'Verified revenue', v: rupees(stats.revenue), s: `${payments.filter(p => p.status === 'verified').length} payments`, bg: '#1C1917', fg: '#fff' },
  ].filter((_, i) => (i < 2 ? showEnq : showPay));

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1917]">
      <header className="sticky top-0 z-30 border-b-4 border-[#FFD400] bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <img src={settings?.logoUrl || 'https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Logo.png'} alt={brand} className="h-9 w-auto" />
          <div className="leading-tight">
            <div className="font-display text-lg font-extrabold">{brand} <span className="text-[#E1007A]">Desk</span></div>
            <div className="hidden text-xs text-stone-500 sm:block">Enquiries &amp; payments</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-sm text-stone-500 md:block">{me.name === me.roleLabel || me.roleLabel.startsWith(me.name) ? me.roleLabel : `${me.name} · ${me.roleLabel}`}</span>
            <button onClick={() => load()} className={actGhost} aria-label="Refresh"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button>
            <button onClick={onVisitSite} className={actGhost}><ExternalLink className="h-4 w-4" /><span className="hidden sm:inline">Website</span></button>
            <button onClick={onLogout} className={`${act} bg-[#1C1917] text-white hover:bg-black`}><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Sign out</span></button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {(error || notice) && (
          <div role="status" className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}>{error || notice}</div>
        )}

        <div className={`grid gap-3 ${tiles.length > 2 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2'}`}>
          {tiles.map(t => (
            <div key={t.t} className="rounded-2xl p-4 shadow-sm sm:p-5" style={{ background: t.bg, color: t.fg }}>
              <div className="text-xs font-bold uppercase tracking-wider opacity-80">{t.t}</div>
              <div className="font-display mt-1 text-3xl font-extrabold tabular-nums">{t.v}</div>
              <div className="mt-0.5 text-xs opacity-80">{t.s}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 border-b border-stone-200">
          {showEnq && <TabBtn on={view === 'enquiries'} onClick={() => setView('enquiries')} icon={Inbox} text="Enquiries" count={stats.fresh} />}
          {showPay && <TabBtn on={view === 'payments'} onClick={() => setView('payments')} icon={CreditCard} text="Payments" count={stats.pending + bookings.length} />}
        </div>

        {loading ? <p className="text-sm text-stone-500">Loading…</p>
          : view === 'enquiries' && showEnq ? <Enquiries items={enquiries} setItems={setEnquiries} api={api} flash={flash} canDelete={can('leads_delete')} />
          : showPay ? <Payments items={payments} setItems={setPayments} leads={enquiries} bookings={bookings} reload={() => load()} api={api} flash={flash} />
          : <p className="text-sm text-stone-500">Your role has no enquiries or payments access.</p>}
      </main>
    </div>
  );
};

const TabBtn: React.FC<{ on: boolean; onClick: () => void; icon: React.ElementType; text: string; count: number }> = ({ on, onClick, icon: Icon, text, count }) => (
  <button onClick={onClick} aria-current={on ? 'page' : undefined}
    className={`-mb-px flex items-center gap-2 border-b-4 px-4 py-2.5 text-sm font-extrabold transition cursor-pointer ${on ? 'border-[#E1007A] text-[#E1007A]' : 'border-transparent text-stone-500 hover:text-stone-900'}`}>
    <Icon className="h-4 w-4" /> {text}
    {count > 0 && <span className="rounded-full bg-[#E1007A] px-2 py-0.5 text-[11px] text-white tabular-nums">{count}</span>}
  </button>
);

interface ListProps<T> { items: T[]; setItems: React.Dispatch<React.SetStateAction<T[]>>; api: Api; flash: (m: string) => void }

// ---------------- Enquiries ----------------
const Enquiries: React.FC<ListProps<Enquiry> & { canDelete: boolean }> = ({ items, setItems, api, flash, canDelete }) => {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [stage, setStage] = useState('all');
  const [open, setOpen] = useState<string | null>(null);

  const shown = useMemo(() => {
    const s = q.toLowerCase();
    return items.filter(e =>
      (cat === 'all' || enquiryCategory(e.type, e.fields) === cat) &&
      (stage === 'all' || e.status === stage) &&
      (!s || [e.fields?.name, e.fields?.email, e.fields?.phone, e.fields?.city, e.fields?.message].some(v => String(v || '').toLowerCase().includes(s))));
  }, [items, q, cat, stage]);

  const update = async (id: string, patch: Partial<Enquiry>) => {
    await api(`/api/enquiries/${id}`, { method: 'PUT', body: JSON.stringify(patch) });
    setItems(l => l.map(e => (e.id === id ? { ...e, ...patch } : e)));
    flash('Saved');
  };
  const remove = async (e: Enquiry) => {
    if (!confirm(`Delete the enquiry from ${e.fields?.name}? This cannot be undone.`)) return;
    await api(`/api/enquiries/${e.id}`, { method: 'DELETE' });
    setItems(l => l.filter(x => x.id !== e.id));
    flash('Deleted');
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input className={`${field} pl-10`} placeholder="Search name, phone, email, city…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <select className={`${field} sm:w-48`} value={stage} onChange={e => setStage(e.target.value)} aria-label="Status">
          <option value="all">All statuses</option>
          {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <button className={actGhost} disabled={!shown.length} onClick={() => download('kinderbee-enquiries', ['Date', 'Type', 'Name', 'Email', 'Phone', 'City', 'Message', 'Status', 'Notes'],
          shown.map(e => [fmtDate(e.createdAt), categoryInfo(enquiryCategory(e.type, e.fields)).short, e.fields?.name, e.fields?.email, e.fields?.phone, e.fields?.city, e.fields?.message, stageOf(e.status).label, e.notes]))}>
          <Download className="h-4 w-4" /> CSV
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className={pill(cat === 'all')} onClick={() => setCat('all')}>All ({items.length})</button>
        {ENQUIRY_CATEGORIES.map(c => {
          const n = items.filter(e => enquiryCategory(e.type, e.fields) === c.id).length;
          return n ? <button key={c.id} className={pill(cat === c.id)} onClick={() => setCat(c.id)}>{c.short} ({n})</button> : null;
        })}
      </div>

      {!shown.length ? <Empty text="No enquiries match." /> : (
        <ul className="space-y-2.5">
          {shown.map(e => {
            const info = categoryInfo(enquiryCategory(e.type, e.fields));
            const isOpen = open === e.id;
            const phone = phoneKey(e.fields?.phone);
            return (
              <li key={e.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
                <button className="flex w-full flex-wrap items-center gap-x-4 gap-y-1.5 p-4 text-left cursor-pointer hover:bg-stone-50" onClick={() => setOpen(isOpen ? null : e.id)} aria-expanded={isOpen}>
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${e.status === 'new' ? 'bg-[#E1007A]' : 'bg-stone-300'}`} title={e.status === 'new' ? 'New' : ''} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-base font-extrabold">{e.fields?.name || 'Unnamed'}</div>
                    <div className="truncate text-sm text-stone-500">{[e.fields?.phone, e.fields?.city].filter(Boolean).join(' · ')}</div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${info.color}`}>{info.short}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STAGE_DOT(e.status)}`}>{stageOf(e.status).label}</span>
                  <span className="flex items-center gap-1 text-xs text-stone-400"><Clock3 className="h-3.5 w-3.5" />{SINCE(e.createdAt)}</span>
                </button>

                {isOpen && (
                  <div className="space-y-4 border-t border-stone-100 bg-[#FAF9F6] p-4">
                    {e.fields?.message && <p className="rounded-xl bg-white p-3.5 text-sm leading-relaxed ring-1 ring-stone-200">{e.fields.message}</p>}
                    {e.aiSummary && <p className="rounded-xl bg-[#FFD400]/20 p-3.5 text-sm text-stone-700"><b>AI summary:</b> {e.aiSummary}</p>}
                    <dl className="grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(e.fields || {}).filter(([k, v]) => k !== 'message' && v !== '' && v != null).map(([k, v]) => (
                        <div key={k}><dt className={label}>{k}</dt><dd className="break-words">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</dd></div>
                      ))}
                      <div><dt className={label}>Received</dt><dd>{fmtDate(e.createdAt)}</dd></div>
                    </dl>
                    <div className="grid gap-2 sm:grid-cols-[13rem_1fr]">
                      <select className={field} value={e.status} onChange={ev => update(e.id, { status: ev.target.value as Enquiry['status'] })} aria-label="Status">
                        {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                      <textarea className={field} rows={2} placeholder="Notes — saved when you click away" defaultValue={e.notes}
                        onBlur={ev => ev.target.value !== (e.notes || '') && update(e.id, { notes: ev.target.value })} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {phone && <a className={`${act} bg-[#E1007A] text-white hover:brightness-95`} href={`tel:+91${phone}`}><Phone className="h-4 w-4" /> Call</a>}
                      {phone && <a className={`${act} bg-emerald-600 text-white hover:bg-emerald-700`} href={`https://wa.me/91${phone}`} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> WhatsApp</a>}
                      {e.fields?.email && <a className={actGhost} href={`mailto:${e.fields.email}`}><Mail className="h-4 w-4" /> Email</a>}
                      {canDelete && <button className={`${actGhost} ml-auto text-red-600`} onClick={() => remove(e)}><Trash2 className="h-4 w-4" /> Delete</button>}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

// ---------------- Payments ----------------
const FILTERS: { id: PaymentRecord['status'] | 'all'; text: string }[] = [
  { id: 'pending_verification', text: 'To verify' }, { id: 'verified', text: 'Verified' }, { id: 'rejected', text: 'Rejected' }, { id: 'all', text: 'All' },
];

const Payments: React.FC<ListProps<PaymentRecord> & { leads: Enquiry[]; bookings: Consultation[]; reload: () => void }> = ({ items, setItems, leads, bookings, reload, api, flash }) => {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('pending_verification');
  const [q, setQ] = useState('');
  const [accessNote, setAccessNote] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState('');

  const leadFor = useMemo(() => {
    const byPhone = new Map(leads.filter(l => l.fields?.phone).map(l => [phoneKey(l.fields.phone), l]));
    const byMail = new Map(leads.filter(l => l.fields?.email).map(l => [String(l.fields.email).toLowerCase(), l]));
    return (p: PaymentRecord) => byPhone.get(phoneKey(p.payerPhone)) || byMail.get(String(p.payerEmail || '').toLowerCase());
  }, [leads]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    items.forEach(p => { c[p.status] = (c[p.status] || 0) + 1; });
    return c;
  }, [items]);

  const shown = useMemo(() => {
    const s = q.toLowerCase();
    return items.filter(p => (filter === 'all' || p.status === filter) &&
      (!s || [p.applicantName, p.payerPhone, p.payerEmail, p.upiRefNumber, p.programme].some(v => String(v || '').toLowerCase().includes(s))));
  }, [items, filter, q]);

  const setStatus = async (p: PaymentRecord, status: PaymentRecord['status']) => {
    if (status === 'rejected' && !confirm(`Reject ${rupees(Number(p.amount))} (UTR ${p.upiRefNumber}) from ${p.applicantName}?`)) return;
    setBusy(p.id);
    try {
      const r = await api(`/api/payments/${p.id}`, { method: 'PUT', body: JSON.stringify({ status }) });
      if (r.access) setAccessNote(n => ({ ...n, [p.id]: r.access }));
      setItems(l => l.map(x => (x.id === p.id ? { ...x, status, verifiedAt: status === 'pending_verification' ? '' : new Date().toISOString() } : x)));
      flash(status === 'verified' ? 'Payment verified' : status === 'rejected' ? 'Payment rejected' : 'Moved back to pending');
    } finally { setBusy(''); }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input className={`${field} pl-10`} placeholder="Search name, mobile, UTR, programme…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <button className={actGhost} disabled={!shown.length} onClick={() => download('kinderbee-payments', ['Submitted', 'Paid on', 'Name', 'Mobile', 'Email', 'Programme', 'Amount', 'UTR', 'Status', 'Verified at'],
          shown.map(p => [fmtDate(p.createdAt), p.paymentDate, p.applicantName, p.payerPhone, p.payerEmail, p.programme, p.amount, p.upiRefNumber, PAY_STYLE[p.status].text, fmtDate(p.verifiedAt)]))}>
          <Download className="h-4 w-4" /> CSV
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => <button key={f.id} className={pill(filter === f.id)} onClick={() => setFilter(f.id)}>{f.text} ({counts[f.id] || 0})</button>)}
      </div>
      <p className="rounded-xl bg-[#FFD400]/20 px-4 py-2.5 text-xs text-stone-700">
        Match each UTR and amount against your bank / UPI statement before you verify. Verifying a course payment emails the student their access automatically.
      </p>

      {!!bookings.length && (filter === 'pending_verification' || filter === 'all') && !q && (
        <div className="space-y-2.5 rounded-2xl border-2 border-dashed border-[#E1007A]/30 bg-[#E1007A]/5 p-4">
          <div>
            <h3 className="font-display text-base font-extrabold text-[#E1007A]">Booked, no payment proof yet ({bookings.length})</h3>
            <p className="text-xs text-stone-600">These people booked a ₹99 consultation but have not submitted their UTR, so nothing is in Payments. If they have paid, check your UPI statement and record the payment.</p>
          </div>
          {bookings.map(b => <Booking key={b.ref} b={b} api={api} flash={flash} onDone={reload} />)}
        </div>
      )}

      {!shown.length ? <Empty text={filter === 'pending_verification' ? 'Nothing waiting to be verified.' : 'No payments here.'} /> : (
        <ul className="space-y-2.5">
          {shown.map(p => {
            const lead = leadFor(p), st = PAY_STYLE[p.status], note = accessNote[p.id];
            return (
              <li key={p.id} className="space-y-3.5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-display text-base font-extrabold">{p.applicantName}</div>
                    <div className="text-sm text-stone-500">{p.programme}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-extrabold tabular-nums text-[#E1007A]">{rupees(Number(p.amount) || 0)}</div>
                    <span className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-bold ${st.cls}`}>{st.text}</span>
                  </div>
                </div>
                <dl className="grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div><dt className={label}>UTR</dt><dd className="select-all font-mono font-semibold">{p.upiRefNumber}</dd></div>
                  <div><dt className={label}>Paid on</dt><dd>{p.paymentDate || '—'}</dd></div>
                  <div><dt className={label}>Mobile</dt><dd><a className="font-semibold text-[#E1007A]" href={`tel:+91${phoneKey(p.payerPhone)}`}>{p.payerPhone}</a></dd></div>
                  <div><dt className={label}>Submitted</dt><dd>{fmtDate(p.createdAt)}</dd></div>
                  <div className="sm:col-span-2"><dt className={label}>Email</dt><dd className="break-all">{p.payerEmail || '—'}</dd></div>
                  {p.admissionNumber && <div><dt className={label}>Admission no.</dt><dd>{p.admissionNumber}</dd></div>}
                </dl>
                {p.notes && <p className="rounded-xl bg-stone-50 px-3.5 py-2 text-xs text-stone-600">Payer note: {p.notes}</p>}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {lead
                    ? <span className="rounded-full bg-purple-50 px-2.5 py-1 font-bold text-[#7209B7]">Enquiry: {categoryInfo(enquiryCategory(lead.type, lead.fields)).short} · {stageOf(lead.status).label}</span>
                    : <span className="rounded-full bg-stone-100 px-2.5 py-1 font-bold text-stone-500">No matching enquiry</span>}
                  {p.verifiedAt && p.status !== 'pending_verification' && <span className="text-stone-400">{st.text} {fmtDate(p.verifiedAt)}</span>}
                </div>
                {note && <p className={`rounded-xl px-3.5 py-2 text-xs font-bold ${/^Access email sent/.test(note) ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>{note}</p>}
                <div className="flex flex-wrap gap-2">
                  {p.status !== 'verified' && <button disabled={busy === p.id} className={`${act} bg-emerald-600 text-white hover:bg-emerald-700`} onClick={() => setStatus(p, 'verified')}><Check className="h-4 w-4" /> Verify</button>}
                  {p.status !== 'rejected' && <button disabled={busy === p.id} className={`${actGhost} text-red-600`} onClick={() => setStatus(p, 'rejected')}><X className="h-4 w-4" /> Reject</button>}
                  {p.status !== 'pending_verification' && <button disabled={busy === p.id} className={actGhost} onClick={() => setStatus(p, 'pending_verification')}><Undo2 className="h-4 w-4" /> Back to pending</button>}
                  <a className={`${actGhost} ml-auto`} href={`https://wa.me/91${phoneKey(p.payerPhone)}`} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

const Empty: React.FC<{ text: string }> = ({ text }) => (
  <div className="rounded-2xl border-2 border-dashed border-stone-200 py-12 text-center text-sm font-semibold text-stone-400">{text}</div>
);

const Booking: React.FC<{ b: Consultation; api: Api; flash: (m: string) => void; onDone: () => void }> = ({ b, api, flash, onDone }) => {
  const [open, setOpen] = useState(false);
  const [utr, setUtr] = useState('');
  const [busy, setBusy] = useState(false);
  const phone = phoneKey(b.phone);
  const save = async () => {
    setBusy(true);
    try {
      await api(`/api/consultations/${b.ref}/record-payment`, { method: 'POST', body: JSON.stringify({ utr }) });
      flash('Payment recorded. Verify it under To verify.');
      onDone();
    } catch { /* the error banner shows the reason */ } finally { setBusy(false); }
  };
  return (
    <div className="space-y-3 rounded-xl bg-white p-3.5 ring-1 ring-stone-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="font-display font-extrabold">{b.name} <span className="font-mono text-xs font-semibold text-stone-400">{b.ref}</span></div>
          <div className="text-xs text-stone-500">{b.category} · {b.preferredDate}, {b.timeSlot} · booked {SINCE(b.createdAt)}</div>
        </div>
        <div className="flex gap-2">
          <a className={actGhost} href={`tel:+91${phone}`}><Phone className="h-4 w-4" /> {b.phone}</a>
          <a className={actGhost} href={`https://wa.me/91${phone}`} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /></a>
          <button className={`${act} bg-[#1C1917] text-white`} onClick={() => setOpen(o => !o)}>Record payment</button>
        </div>
      </div>
      {open && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <input className={`${field} font-mono`} inputMode="numeric" maxLength={14} placeholder="12-digit UTR from your UPI statement" value={utr} onChange={e => setUtr(e.target.value.replace(/[^\d\s]/g, ''))} />
          <button className={`${act} bg-emerald-600 text-white hover:bg-emerald-700`} disabled={busy || utr.replace(/\s/g, '').length !== 12} onClick={save}><Check className="h-4 w-4" /> Save</button>
        </div>
      )}
    </div>
  );
};
