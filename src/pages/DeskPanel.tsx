import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Inbox, CreditCard, LogOut, ExternalLink, Download, RefreshCw, Phone, MessageCircle, Mail, Trash2, Search, Check, X, Undo2,
  Clock3, Sparkles, Users, Hourglass, IndianRupee, CircleCheck, CircleX, Copy, ChevronDown, ChevronRight, CalendarDays,
  MapPin, TriangleAlert, ReceiptText, type LucideIcon,
} from 'lucide-react';
import type { Enquiry, PaymentRecord, SystemSettings } from '../types';
import { STAGES, stageOf, fmtDate, csvCell, phoneKey, rupees, type Api } from './admin/ui';
import { ENQUIRY_CATEGORIES, enquiryCategory, categoryInfo } from '../data/enquiry';
import type { Me } from './admin/portal/common';
import type { Consultation } from '../data/consultation';

// Focused desk for the two daily jobs: answering enquiries and verifying UPI payments.
// Same login, token and API as /admin; only the presentation lives here.

const PINK = '#E90078', PURPLE = '#7800B9', YELLOW = '#FFD000', INK = '#191919';
const field = 'w-full rounded-xl border border-black/[0.08] bg-white px-3.5 py-2.5 text-sm text-[#191919] placeholder:text-stone-400 transition focus:border-[#E90078] focus:outline-none focus:ring-4 focus:ring-[#E90078]/10';
const pill = (on: boolean) => `inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${on ? 'bg-[#191919] text-white shadow-sm' : 'bg-white text-stone-600 ring-1 ring-black/[0.08] hover:text-[#E90078] hover:ring-[#E90078]/40'}`;
const act = 'inline-flex shrink-0 items-center whitespace-nowrap justify-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition cursor-pointer active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50';
const actGhost = `${act} bg-white text-stone-700 ring-1 ring-black/[0.08] hover:bg-stone-50 hover:ring-black/15`;
const actDark = `${act} bg-[#191919] text-white hover:bg-black`;
const actGreen = `${act} bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700`;
const label = 'text-[11px] font-bold uppercase tracking-wider text-stone-400';
const card = 'rounded-2xl bg-white ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(25,25,25,0.04),0_4px_16px_-8px_rgba(25,25,25,0.08)]';

const PAY_STYLE: Record<PaymentRecord['status'], { text: string; cls: string; bar: string; icon: LucideIcon }> = {
  pending_verification: { text: 'Pending', cls: 'bg-[#FFD000]/25 text-[#6b5400] ring-[#FFD000]/50', bar: YELLOW, icon: Hourglass },
  verified: { text: 'Verified', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200', bar: '#059669', icon: CircleCheck },
  rejected: { text: 'Rejected', cls: 'bg-red-50 text-red-700 ring-red-200', bar: '#dc2626', icon: CircleX },
};
const SINCE = (iso?: string) => { const d = Math.floor((Date.now() - new Date(iso || 0).getTime()) / 864e5); return d <= 0 ? 'today' : d === 1 ? 'yesterday' : `${d}d ago`; };
const initials = (n?: string) => (n || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const download = (name: string, head: string[], rows: unknown[][]) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([[head, ...rows].map(r => r.map(csvCell).join(',')).join('\n')], { type: 'text/csv' }));
  a.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
};

// ---------- Confirmation dialog: `await ask({...})` resolves true on confirm ----------
type Ask = { title: string; body: string; ok: string; tone: 'danger' | 'success' };
type AskFn = (a: Ask) => Promise<boolean>;
function useConfirm(): [AskFn, React.ReactNode] {
  const [st, setSt] = useState<(Ask & { resolve: (v: boolean) => void }) | null>(null);
  const close = (v: boolean) => { st?.resolve(v); setSt(null); };
  useEffect(() => {
    if (!st) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && close(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [st]);
  const ui = (
    <AnimatePresence>
      {st && (
        <motion.div className="fixed inset-0 z-[60] grid place-items-center bg-[#191919]/40 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => close(false)}>
          <motion.div role="alertdialog" aria-modal="true" aria-labelledby="desk-confirm-title" onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <span className={`grid h-11 w-11 place-items-center rounded-2xl ${st.tone === 'danger' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {st.tone === 'danger' ? <TriangleAlert className="h-5 w-5" /> : <CircleCheck className="h-5 w-5" />}
            </span>
            <h2 id="desk-confirm-title" className="mt-4 text-lg font-extrabold">{st.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{st.body}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button autoFocus className={actGhost} onClick={() => close(false)}>Cancel</button>
              <button className={st.tone === 'danger' ? `${act} bg-red-600 text-white hover:bg-red-700` : actGreen} onClick={() => close(true)}>{st.ok}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  return [a => new Promise<boolean>(resolve => setSt({ ...a, resolve })), ui];
}

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
  const [ask, confirmUi] = useConfirm();

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
      verified: verified.length,
      revenue: verified.reduce((s, p) => s + (Number(p.amount) || 0), 0),
    };
  }, [enquiries, payments]);

  if (!me) return (
    <div className="desk-ui flex min-h-screen flex-col items-center justify-center gap-3 bg-[#FAF9F7] text-sm text-stone-500">
      {error ? <TriangleAlert className="h-6 w-6 text-red-500" /> : <RefreshCw className="h-6 w-6 animate-spin text-[#E90078]" />}
      {error || 'Opening your desk…'}
    </div>
  );

  const showEnq = can('leads') || can('leads_branch'), showPay = can('payments');
  const brand = settings?.logoText || 'Kinderbee';
  const who = me.name === me.roleLabel || me.roleLabel.startsWith(me.name) ? { name: me.roleLabel, role: '' } : { name: me.name, role: me.roleLabel };
  const tiles = [
    { t: 'New enquiries', v: stats.fresh, s: `${stats.today} received today`, icon: Sparkles, color: PINK, go: 'enquiries' as View },
    { t: 'Total enquiries', v: enquiries.length, s: 'all time', icon: Users, color: PURPLE, go: 'enquiries' as View },
    { t: 'Payments to verify', v: stats.pending, s: stats.pending ? 'check each UTR' : 'all caught up', icon: Hourglass, color: '#C9A000', go: 'payments' as View, hot: stats.pending > 0 },
    { t: 'Verified revenue', v: rupees(stats.revenue), s: `${stats.verified} payment${stats.verified === 1 ? '' : 's'}`, icon: IndianRupee, color: INK, go: 'payments' as View, dark: true },
  ].filter((_, i) => (i < 2 ? showEnq : showPay));
  const tabs = [
    showEnq && { id: 'enquiries' as View, text: 'Enquiries', icon: Inbox, count: stats.fresh },
    showPay && { id: 'payments' as View, text: 'Payments', icon: CreditCard, count: stats.pending + bookings.length },
  ].filter(Boolean) as { id: View; text: string; icon: LucideIcon; count: number }[];

  const TabBar = ({ className = '' }: { className?: string }) => (
    <nav className={`flex rounded-2xl bg-stone-100 p-1 ${className}`} aria-label="Desk sections">
      {tabs.map(t => (
        <button key={t.id} onClick={() => setView(t.id)} aria-current={view === t.id ? 'page' : undefined}
          className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition cursor-pointer ${view === t.id ? 'text-[#191919]' : 'text-stone-500 hover:text-[#191919]'}`}>
          {view === t.id && <motion.span layoutId="desk-tab" className="absolute inset-0 rounded-xl bg-white shadow-sm ring-1 ring-black/5" transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }} />}
          <t.icon className={`relative h-4 w-4 ${view === t.id ? 'text-[#E90078]' : ''}`} />
          <span className="relative">{t.text}</span>
          {t.count > 0 && <span className="relative min-w-5 rounded-full bg-[#E90078] px-1.5 py-0.5 text-[11px] leading-none text-white tabular-nums">{t.count}</span>}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="desk-ui min-h-screen bg-[#FAF9F7] text-[#191919]">
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/85 backdrop-blur-xl">
        <div className="h-1 bg-[linear-gradient(90deg,#E90078,#7800B9_55%,#FFD000)]" />
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6">
          <img src={settings?.logoUrl || 'https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Logo.png'} alt={brand} className="hidden h-9 w-auto rounded-lg sm:block" />
          <div className="leading-tight">
            <div className="whitespace-nowrap text-[17px] font-extrabold tracking-tight">{brand} <span className="text-[#E90078]">Desk</span></div>
            <div className="hidden text-xs font-medium text-stone-500 sm:block">Enquiries &amp; payments</div>
          </div>
          {tabs.length > 1 && <TabBar className="mx-auto hidden w-80 lg:flex" />}
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <button onClick={() => load()} className={`${actGhost} px-2.5`} aria-label="Refresh" title="Refresh"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button>
            <button onClick={onVisitSite} className={actGhost} title="Open website"><ExternalLink className="h-4 w-4" /><span className="hidden lg:inline">Website</span></button>
            <div className="hidden items-center gap-2.5 rounded-xl py-1 pl-1 pr-3 ring-1 ring-black/[0.08] md:flex">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#E90078] text-xs font-extrabold text-white">{initials(who.name)}</span>
              <span className="leading-tight">
                <span className="block max-w-36 truncate text-xs font-extrabold">{who.name}</span>
                {who.role && <span className="block max-w-36 truncate text-[11px] text-stone-500">{who.role}</span>}
              </span>
            </div>
            <button onClick={onLogout} className={actDark} title="Sign out"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Sign out</span></button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}</h1>
          <p className="mt-1 text-sm text-stone-500">Here is what needs your attention today.</p>
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-200">
            <TriangleAlert className="h-4 w-4 shrink-0" /> {error}
            <button className="ml-auto rounded-lg p-1 hover:bg-red-100" onClick={() => setError('')} aria-label="Dismiss"><X className="h-4 w-4" /></button>
          </div>
        )}

        <div className={`grid gap-3 sm:gap-4 ${tiles.length > 2 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2'}`}>
          {tiles.map((t, i) => (
            <motion.button key={t.t} onClick={() => setView(t.go)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`group relative overflow-hidden p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg cursor-pointer sm:p-5 ${t.dark ? 'rounded-2xl bg-[#191919] text-white shadow-lg shadow-black/10' : card}`}>
              <div className="flex items-start justify-between gap-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${t.dark ? 'text-white/60' : 'text-stone-500'}`}>{t.t}</span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl transition group-hover:scale-110" style={t.dark ? { background: YELLOW, color: INK } : { background: `${t.color}14`, color: t.color }}>
                  <t.icon className="h-[18px] w-[18px]" />
                </span>
              </div>
              {loading ? <div className={`mt-2 h-9 w-20 animate-pulse rounded-lg ${t.dark ? 'bg-white/10' : 'bg-stone-100'}`} />
                : <div className="mt-1 text-3xl font-extrabold tabular-nums tracking-tight sm:text-[34px]" style={t.dark ? undefined : { color: t.color === '#C9A000' ? INK : t.color }}>{t.v}</div>}
              <div className={`mt-1 flex items-center gap-1.5 text-xs font-medium ${t.dark ? 'text-white/60' : 'text-stone-500'}`}>
                {t.hot && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E90078]" />}{t.s}
              </div>
              <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform group-hover:scale-x-100" style={{ background: t.dark ? YELLOW : t.color }} />
            </motion.button>
          ))}
        </div>

        {tabs.length > 1 && <TabBar className="lg:hidden" />}

        <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {view === 'enquiries' && showEnq ? <Enquiries items={enquiries} setItems={setEnquiries} api={api} flash={flash} ask={ask} loading={loading} canDelete={can('leads_delete')} />
              : showPay ? <Payments items={payments} setItems={setPayments} leads={enquiries} bookings={bookings} reload={() => load()} api={api} flash={flash} ask={ask} loading={loading} />
              : <Empty icon={Inbox} title="Nothing to show" text="Your role has no enquiries or payments access." />}
        </motion.div>
      </main>

      <AnimatePresence>
        {notice && (
          <motion.div role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-[#191919] px-4 py-3 text-sm font-bold text-white shadow-2xl">
            <CircleCheck className="h-4 w-4 text-emerald-400" /> {notice}
          </motion.div>
        )}
      </AnimatePresence>
      {confirmUi}
    </div>
  );
};

interface ListProps<T> { items: T[]; setItems: React.Dispatch<React.SetStateAction<T[]>>; api: Api; flash: (m: string) => void; ask: AskFn; loading: boolean }

const Toolbar: React.FC<{ q: string; setQ: (v: string) => void; placeholder: string; children?: React.ReactNode }> = ({ q, setQ, placeholder, children }) => (
  <div className={`${card} flex flex-col gap-2 p-2 sm:flex-row`}>
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      <input className={`${field} border-transparent bg-stone-50 pl-10 focus:bg-white`} placeholder={placeholder} value={q} onChange={e => setQ(e.target.value)} aria-label="Search" />
      {q && <button className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-700" onClick={() => setQ('')} aria-label="Clear search"><X className="h-3.5 w-3.5" /></button>}
    </div>
    {children}
  </div>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = '', children, ...p }) => (
  <div className={`relative ${className}`}>
    <select {...p} className={`${field} appearance-none pr-9 font-semibold cursor-pointer`}>{children}</select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
  </div>
);

const Skeleton = () => (
  <ul className="space-y-3" aria-label="Loading">
    {[0, 1, 2].map(i => (
      <li key={i} className={`${card} flex animate-pulse items-center gap-4 p-4`}>
        <span className="h-11 w-11 rounded-xl bg-stone-100" />
        <span className="flex-1 space-y-2"><span className="block h-3.5 w-1/3 rounded bg-stone-100" /><span className="block h-3 w-1/2 rounded bg-stone-100" /></span>
        <span className="hidden h-6 w-20 rounded-full bg-stone-100 sm:block" />
      </li>
    ))}
  </ul>
);

const Empty: React.FC<{ icon: LucideIcon; title: string; text: string }> = ({ icon: Icon, title, text }) => (
  <div className="rounded-2xl border-2 border-dashed border-black/[0.08] bg-white/50 px-6 py-14 text-center">
    <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#E90078]/10 text-[#E90078]"><Icon className="h-6 w-6" /></span>
    <p className="mt-3 font-extrabold">{title}</p>
    <p className="mt-1 text-sm text-stone-500">{text}</p>
  </div>
);

// ---------------- Enquiries ----------------
const Enquiries: React.FC<ListProps<Enquiry> & { canDelete: boolean }> = ({ items, setItems, api, flash, ask, loading, canDelete }) => {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [stage, setStage] = useState('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const open = items.find(e => e.id === openId) || null;

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
    if (!await ask({ title: 'Delete this enquiry?', body: `The enquiry from ${e.fields?.name || 'this person'} will be removed permanently. This cannot be undone.`, ok: 'Delete', tone: 'danger' })) return;
    await api(`/api/enquiries/${e.id}`, { method: 'DELETE' });
    setItems(l => l.filter(x => x.id !== e.id));
    setOpenId(null);
    flash('Enquiry deleted');
  };

  return (
    <section className="space-y-4">
      <Toolbar q={q} setQ={setQ} placeholder="Search name, phone, email, city…">
        <Select className="sm:w-48" value={stage} onChange={e => setStage(e.target.value)} aria-label="Filter by status">
          <option value="all">All statuses</option>
          {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </Select>
        <button className={actGhost} disabled={!shown.length} onClick={() => download('kinderbee-enquiries', ['Date', 'Type', 'Name', 'Email', 'Phone', 'City', 'Message', 'Status', 'Notes'],
          shown.map(e => [fmtDate(e.createdAt), categoryInfo(enquiryCategory(e.type, e.fields)).short, e.fields?.name, e.fields?.email, e.fields?.phone, e.fields?.city, e.fields?.message, stageOf(e.status).label, e.notes]))}>
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </Toolbar>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <button className={`${pill(cat === 'all')} shrink-0`} onClick={() => setCat('all')}>All <span className="opacity-60">{items.length}</span></button>
        {ENQUIRY_CATEGORIES.map(c => {
          const n = items.filter(e => enquiryCategory(e.type, e.fields) === c.id).length;
          return n ? <button key={c.id} className={`${pill(cat === c.id)} shrink-0`} onClick={() => setCat(c.id)}>{c.short} <span className="opacity-60">{n}</span></button> : null;
        })}
      </div>
      {!loading && (q || cat !== 'all' || stage !== 'all') && (
        <p className="text-xs font-semibold text-stone-500">Showing {shown.length} of {items.length} · <button className="text-[#E90078] hover:underline" onClick={() => { setQ(''); setCat('all'); setStage('all'); }}>Clear filters</button></p>
      )}

      {loading ? <Skeleton /> : !shown.length ? <Empty icon={Inbox} title="No enquiries match" text={items.length ? 'Try a different search or filter.' : 'New website enquiries will appear here.'} /> : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {shown.map((e, i) => {
            const info = categoryInfo(enquiryCategory(e.type, e.fields));
            const st = stageOf(e.status);
            const phone = phoneKey(e.fields?.phone);
            const isNew = e.status === 'new';
            return (
              <motion.li key={e.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 10) * 0.025 }}
                className={`${card} group relative flex flex-col p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-[#E90078]/25`}>
                <button className="absolute inset-0 rounded-2xl cursor-pointer" onClick={() => setOpenId(e.id)} aria-label={`View details for ${e.fields?.name || 'enquiry'}`} />
                <div className="flex items-start gap-3">
                  <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-extrabold text-white" style={{ background: isNew ? PINK : PURPLE }}>
                    {initials(e.fields?.name)}
                    {isNew && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#FFD000]" title="New" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-[15px] font-extrabold">{e.fields?.name || 'Unnamed'}</h3>
                      <span className="ml-auto flex shrink-0 items-center gap-1 text-[11px] font-semibold text-stone-400" title={fmtDate(e.createdAt)}><Clock3 className="h-3.5 w-3.5" />{SINCE(e.createdAt)}</span>
                    </div>
                    <div className="mt-0.5 space-y-0.5 text-[13px] text-stone-500">
                      {e.fields?.phone && <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{e.fields.phone}{e.fields?.city && <><MapPin className="ml-2 h-3.5 w-3.5" />{e.fields.city}</>}</p>}
                      {e.fields?.email && <p className="flex min-w-0 items-center gap-1.5"><Mail className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{e.fields.email}</span></p>}
                    </div>
                  </div>
                </div>
                {e.fields?.message && <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-stone-600">{e.fields.message}</p>}
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${info.color}`}>{info.short}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${st.color}`}>{st.label}</span>
                  <span className="relative ml-auto flex gap-1.5">
                    {phone && <a className={`${actGhost} px-2.5 py-1.5`} href={`tel:+91${phone}`} aria-label="Call" title="Call"><Phone className="h-4 w-4" /></a>}
                    {phone && <a className={`${actGhost} px-2.5 py-1.5 text-emerald-600`} href={`https://wa.me/91${phone}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" title="WhatsApp"><MessageCircle className="h-4 w-4" /></a>}
                    <button className={`${act} bg-[#E90078]/10 px-3 py-1.5 text-[#E90078] hover:bg-[#E90078] hover:text-white`} onClick={() => setOpenId(e.id)}>View <ChevronRight className="h-4 w-4" /></button>
                  </span>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}

      <AnimatePresence>
        {open && <EnquiryDrawer key={open.id} e={open} onClose={() => setOpenId(null)} update={update} remove={canDelete ? remove : undefined} />}
      </AnimatePresence>
    </section>
  );
};

const EnquiryDrawer: React.FC<{ e: Enquiry; onClose: () => void; update: (id: string, p: Partial<Enquiry>) => Promise<void>; remove?: (e: Enquiry) => void }> = ({ e, onClose, update, remove }) => {
  const info = categoryInfo(enquiryCategory(e.type, e.fields));
  const phone = phoneKey(e.fields?.phone);
  useEffect(() => {
    const k = (ev: KeyboardEvent) => ev.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <motion.div className="fixed inset-0 z-50 flex justify-end bg-[#191919]/30 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.aside role="dialog" aria-modal="true" aria-label={`Enquiry from ${e.fields?.name || 'unknown'}`} onClick={ev => ev.stopPropagation()}
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
        className="flex h-full w-full max-w-lg flex-col bg-[#FAF9F7] shadow-2xl">
        <div className="flex items-start gap-3 border-b border-black/[0.06] bg-white p-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#E90078] text-base font-extrabold text-white">{initials(e.fields?.name)}</span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-extrabold">{e.fields?.name || 'Unnamed'}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${info.color}`}>{info.label}</span>
              <span className="flex items-center gap-1 text-xs text-stone-500"><CalendarDays className="h-3.5 w-3.5" />{fmtDate(e.createdAt)}</span>
            </div>
          </div>
          <button className="rounded-xl p-2 text-stone-500 hover:bg-stone-100" onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div className="grid grid-cols-3 gap-2">
            {phone ? <a className={`${act} flex-col bg-[#E90078] py-3 text-white hover:brightness-95`} href={`tel:+91${phone}`}><Phone className="h-4 w-4" />Call</a> : <span />}
            {phone ? <a className={`${act} flex-col bg-emerald-600 py-3 text-white hover:bg-emerald-700`} href={`https://wa.me/91${phone}`} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" />WhatsApp</a> : <span />}
            {e.fields?.email ? <a className={`${actGhost} flex-col py-3`} href={`mailto:${e.fields.email}`}><Mail className="h-4 w-4" />Email</a> : <span />}
          </div>
          <div className={`${card} grid gap-3 p-4 sm:grid-cols-[1fr_1.4fr]`}>
            <label className="space-y-1.5"><span className={label}>Status</span>
              <Select value={e.status} onChange={ev => update(e.id, { status: ev.target.value as Enquiry['status'] })}>
                {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </Select>
            </label>
            <label className="space-y-1.5"><span className={label}>Notes</span>
              <textarea className={field} rows={2} placeholder="Saved when you click away" defaultValue={e.notes}
                onBlur={ev => ev.target.value !== (e.notes || '') && update(e.id, { notes: ev.target.value })} />
            </label>
          </div>
          {e.fields?.message && <div><p className={label}>Message</p><p className={`${card} mt-1.5 whitespace-pre-line p-4 text-sm leading-relaxed`}>{e.fields.message}</p></div>}
          {e.aiSummary && <p className="flex gap-2 rounded-2xl bg-[#FFD000]/20 p-4 text-sm text-stone-700 ring-1 ring-[#FFD000]/40"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#7800B9]" /><span><b>AI summary:</b> {e.aiSummary}</span></p>}
          <div>
            <p className={label}>Details</p>
            <dl className={`${card} mt-1.5 divide-y divide-black/[0.05] text-sm`}>
              {Object.entries(e.fields || {}).filter(([k, v]) => k !== 'message' && v !== '' && v != null).map(([k, v]) => (
                <div key={k} className="flex gap-4 px-4 py-2.5"><dt className="w-32 shrink-0 capitalize text-stone-500">{k.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ')}</dt><dd className="min-w-0 break-words font-semibold">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</dd></div>
              ))}
              <div className="flex gap-4 px-4 py-2.5"><dt className="w-32 shrink-0 text-stone-500">Received</dt><dd className="font-semibold">{fmtDate(e.createdAt)}</dd></div>
            </dl>
          </div>
        </div>
        {remove && (
          <div className="border-t border-black/[0.06] bg-white p-4">
            <button className={`${actGhost} w-full text-red-600 hover:bg-red-50`} onClick={() => remove(e)}><Trash2 className="h-4 w-4" /> Delete enquiry</button>
          </div>
        )}
      </motion.aside>
    </motion.div>
  );
};

// ---------------- Payments ----------------
const FILTERS: { id: PaymentRecord['status'] | 'all'; text: string; icon: LucideIcon }[] = [
  { id: 'pending_verification', text: 'To verify', icon: Hourglass }, { id: 'verified', text: 'Verified', icon: CircleCheck },
  { id: 'rejected', text: 'Rejected', icon: CircleX }, { id: 'all', text: 'All', icon: ReceiptText },
];

const Payments: React.FC<ListProps<PaymentRecord> & { leads: Enquiry[]; bookings: Consultation[]; reload: () => void }> = ({ items, setItems, leads, bookings, reload, api, flash, ask, loading }) => {
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
    const amt = rupees(Number(p.amount) || 0);
    const sure = status === 'verified'
      ? await ask({ title: `Verify ${amt}?`, body: `Confirm UTR ${p.upiRefNumber} from ${p.applicantName} appears in your bank / UPI statement for ${amt}. Course payments email the student their access.`, ok: 'Yes, verify', tone: 'success' })
      : status === 'rejected'
        ? await ask({ title: `Reject ${amt}?`, body: `The payment from ${p.applicantName} (UTR ${p.upiRefNumber}) will be marked rejected.`, ok: 'Reject payment', tone: 'danger' })
        : true;
    if (!sure) return;
    setBusy(p.id);
    try {
      const r = await api(`/api/payments/${p.id}`, { method: 'PUT', body: JSON.stringify({ status }) });
      if (r.access) setAccessNote(n => ({ ...n, [p.id]: r.access }));
      setItems(l => l.map(x => (x.id === p.id ? { ...x, status, verifiedAt: status === 'pending_verification' ? '' : new Date().toISOString() } : x)));
      flash(status === 'verified' ? 'Payment verified' : status === 'rejected' ? 'Payment rejected' : 'Moved back to pending');
    } catch { /* the error banner shows the reason */ } finally { setBusy(''); }
  };
  const copy = (t: string) => navigator.clipboard?.writeText(t).then(() => flash('UTR copied'), () => {});

  return (
    <section className="space-y-4">
      <Toolbar q={q} setQ={setQ} placeholder="Search name, mobile, UTR, programme…">
        <button className={actGhost} disabled={!shown.length} onClick={() => download('kinderbee-payments', ['Submitted', 'Paid on', 'Name', 'Mobile', 'Email', 'Programme', 'Amount', 'UTR', 'Status', 'Verified at'],
          shown.map(p => [fmtDate(p.createdAt), p.paymentDate, p.applicantName, p.payerPhone, p.payerEmail, p.programme, p.amount, p.upiRefNumber, PAY_STYLE[p.status].text, fmtDate(p.verifiedAt)]))}>
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </Toolbar>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {FILTERS.map(f => (
          <button key={f.id} className={`${pill(filter === f.id)} shrink-0`} onClick={() => setFilter(f.id)}>
            <f.icon className="h-3.5 w-3.5" />{f.text} <span className="opacity-60">{counts[f.id] || 0}</span>
          </button>
        ))}
      </div>
      <p className="flex items-start gap-2 rounded-xl bg-[#FFD000]/15 px-4 py-2.5 text-xs leading-relaxed text-stone-700 ring-1 ring-[#FFD000]/40">
        <TriangleAlert className="mt-px h-4 w-4 shrink-0 text-[#a08000]" />
        Match each UTR and amount against your bank / UPI statement before you verify. Verifying a course payment emails the student their access automatically.
      </p>

      {!loading && !!bookings.length && (filter === 'pending_verification' || filter === 'all') && !q && (
        <div className="space-y-3 rounded-2xl bg-[#E90078]/[0.04] p-4 ring-1 ring-[#E90078]/20 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#E90078]/10 text-[#E90078]"><CalendarDays className="h-[18px] w-[18px]" /></span>
            <div>
              <h3 className="font-extrabold text-[#E90078]">Booked, no payment proof yet <span className="ml-1 rounded-full bg-[#E90078] px-2 py-0.5 text-[11px] text-white">{bookings.length}</span></h3>
              <p className="mt-0.5 text-xs text-stone-600">These people booked a ₹99 consultation but have not submitted their UTR. If they have paid, find it in your UPI statement and record it.</p>
            </div>
          </div>
          {bookings.map(b => <Booking key={b.ref} b={b} api={api} flash={flash} onDone={reload} />)}
        </div>
      )}

      {loading ? <Skeleton /> : !shown.length ? (
        <Empty icon={filter === 'pending_verification' ? CircleCheck : ReceiptText} title={filter === 'pending_verification' ? 'All caught up' : 'No payments here'}
          text={q ? 'Try a different search.' : filter === 'pending_verification' ? 'Nothing waiting to be verified.' : 'Payments will appear here once submitted.'} />
      ) : (
        <ul className="space-y-3">
          {shown.map((p, i) => {
            const lead = leadFor(p), st = PAY_STYLE[p.status], note = accessNote[p.id], phone = phoneKey(p.payerPhone);
            return (
              <motion.li key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 10) * 0.025 }}
                className={`${card} relative overflow-hidden transition hover:shadow-lg`}>
                <span className="absolute inset-y-0 left-0 w-1" style={{ background: st.bar }} />
                <div className="space-y-4 p-4 pl-5 sm:p-5 sm:pl-6">
                  <div className="flex flex-wrap items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#7800B9] text-sm font-extrabold text-white">{initials(p.applicantName)}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[15px] font-extrabold">{p.applicantName}</h3>
                      <p className="truncate text-[13px] text-stone-500">{p.programme}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold tabular-nums tracking-tight">{rupees(Number(p.amount) || 0)}</div>
                      <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${st.cls}`}><st.icon className="h-3.5 w-3.5" />{st.text}</span>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-stone-50 px-3.5 py-2.5 sm:col-span-2 lg:col-span-1">
                      <dt className={label}>Transaction ID (UTR)</dt>
                      <dd className="mt-0.5 flex items-center gap-1.5"><span className="select-all font-mono text-sm font-bold">{p.upiRefNumber}</span>
                        <button className="rounded-md p-1 text-stone-400 hover:bg-white hover:text-[#E90078]" onClick={() => copy(p.upiRefNumber)} aria-label="Copy UTR" title="Copy UTR"><Copy className="h-3.5 w-3.5" /></button></dd>
                    </div>
                    <div className="rounded-xl bg-stone-50 px-3.5 py-2.5"><dt className={label}>Paid on</dt><dd className="mt-0.5 text-sm font-semibold">{p.paymentDate || '—'}</dd></div>
                    <div className="rounded-xl bg-stone-50 px-3.5 py-2.5"><dt className={label}>Submitted</dt><dd className="mt-0.5 text-sm font-semibold">{fmtDate(p.createdAt)}</dd></div>
                    <div className="rounded-xl bg-stone-50 px-3.5 py-2.5"><dt className={label}>Mobile</dt><dd className="mt-0.5 text-sm"><a className="font-bold text-[#E90078] hover:underline" href={`tel:+91${phone}`}>{p.payerPhone}</a></dd></div>
                    <div className="rounded-xl bg-stone-50 px-3.5 py-2.5 sm:col-span-2"><dt className={label}>Email</dt><dd className="mt-0.5 break-all text-sm font-semibold">{p.payerEmail || '—'}</dd></div>
                    {p.admissionNumber && <div className="rounded-xl bg-stone-50 px-3.5 py-2.5"><dt className={label}>Admission no.</dt><dd className="mt-0.5 text-sm font-semibold">{p.admissionNumber}</dd></div>}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 font-bold text-stone-600"><ReceiptText className="h-3.5 w-3.5" />Proof: UPI reference {p.upiRefNumber}</span>
                    {lead
                      ? <span className="rounded-full bg-[#7800B9]/[0.08] px-2.5 py-1 font-bold text-[#7800B9]">Enquiry: {categoryInfo(enquiryCategory(lead.type, lead.fields)).short} · {stageOf(lead.status).label}</span>
                      : <span className="rounded-full bg-stone-100 px-2.5 py-1 font-bold text-stone-500">No matching enquiry</span>}
                    {p.verifiedAt && p.status !== 'pending_verification' && <span className="text-stone-400">{st.text} {fmtDate(p.verifiedAt)}</span>}
                  </div>
                  {p.notes && <p className="rounded-xl bg-stone-50 px-3.5 py-2 text-xs text-stone-600"><b>Payer note:</b> {p.notes}</p>}
                  {note && <p className={`rounded-xl px-3.5 py-2 text-xs font-bold ${/^Access email sent/.test(note) ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>{note}</p>}

                  <div className="flex flex-wrap gap-2 border-t border-black/[0.05] pt-4">
                    {p.status !== 'verified' && <button disabled={busy === p.id} className={actGreen} onClick={() => setStatus(p, 'verified')}><Check className="h-4 w-4" /> Verify</button>}
                    {p.status !== 'rejected' && <button disabled={busy === p.id} className={`${actGhost} text-red-600 hover:bg-red-50`} onClick={() => setStatus(p, 'rejected')}><X className="h-4 w-4" /> Reject</button>}
                    {p.status !== 'pending_verification' && <button disabled={busy === p.id} className={actGhost} onClick={() => setStatus(p, 'pending_verification')}><Undo2 className="h-4 w-4" /> Back to pending</button>}
                    <span className="ml-auto flex gap-2">
                      <a className={`${actGhost} px-2.5`} href={`tel:+91${phone}`} aria-label="Call" title="Call"><Phone className="h-4 w-4" /></a>
                      <a className={`${actGhost} text-emerald-600`} href={`https://wa.me/91${phone}`} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /><span className="hidden sm:inline">WhatsApp</span></a>
                    </span>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

const Booking: React.FC<{ b: Consultation; api: Api; flash: (m: string) => void; onDone: () => void }> = ({ b, api, flash, onDone }) => {
  const [open, setOpen] = useState(false);
  const [utr, setUtr] = useState('');
  const [busy, setBusy] = useState(false);
  const phone = phoneKey(b.phone);
  const digits = utr.replace(/\s/g, '').length;
  const save = async () => {
    setBusy(true);
    try {
      await api(`/api/consultations/${b.ref}/record-payment`, { method: 'POST', body: JSON.stringify({ utr }) });
      flash('Payment recorded. Verify it under To verify.');
      onDone();
    } catch { /* the error banner shows the reason */ } finally { setBusy(false); }
  };
  return (
    <div className={`${card} space-y-3 p-3.5 sm:p-4`}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E90078]/10 text-xs font-extrabold text-[#E90078]">{initials(b.name)}</span>
        <div className="min-w-0 flex-1">
          <div className="font-extrabold">{b.name} <span className="ml-1 rounded-md bg-stone-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-stone-500">{b.ref}</span></div>
          <div className="mt-0.5 text-xs text-stone-500">{b.category} · {b.preferredDate}, {b.timeSlot} · booked {SINCE(b.createdAt)}</div>
        </div>
        <div className="flex gap-2">
          <a className={actGhost} href={`tel:+91${phone}`}><Phone className="h-4 w-4" /><span className="hidden sm:inline">{b.phone}</span></a>
          <a className={`${actGhost} px-2.5 text-emerald-600`} href={`https://wa.me/91${phone}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle className="h-4 w-4" /></a>
          <button className={open ? actGhost : actDark} onClick={() => setOpen(o => !o)} aria-expanded={open}>{open ? 'Cancel' : 'Record payment'}</button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="flex flex-col gap-2 pt-1 sm:flex-row">
              <div className="relative flex-1">
                <input autoFocus className={`${field} font-mono`} inputMode="numeric" maxLength={14} placeholder="12-digit UTR from your UPI statement" value={utr} onChange={e => setUtr(e.target.value.replace(/[^\d\s]/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && digits === 12 && !busy && save()} aria-label="UTR number" />
                <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold tabular-nums ${digits === 12 ? 'text-emerald-600' : 'text-stone-400'}`}>{digits}/12</span>
              </div>
              <button className={actGreen} disabled={busy || digits !== 12} onClick={save}><Check className="h-4 w-4" /> {busy ? 'Saving…' : 'Save payment'}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
