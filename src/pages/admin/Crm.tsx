import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, animate, useReducedMotion } from 'motion/react';
import { Bee, Star, Cloud, Heart, Squiggle } from '../../components/Doodles';
import {
  Phone, MessageCircle, Mail, X, CalendarClock, AlertCircle, UserPlus, IndianRupee, GraduationCap, StickyNote,
  ArrowRightLeft, CreditCard, Sparkles, Flame, Users, Building2, Plus, Pencil, Baby, Home, TrendingUp, Clock,
} from 'lucide-react';
import type { Enquiry, PaymentRecord, LeadActivity, LeadStage, Student } from '../../types';
import {
  input, btnPrimary, btnGhost, card, fmtDate, fmtDay, rupees, todayISO, phoneKey, STAGES, stageOf, stageIndex, isOpenStage,
  STATUS_COLORS, LOST_REASONS, LEAD_SOURCES, FOLLOW_UP_TYPES, PROGRAMMES, WHATSAPP_TEMPLATES, fillTemplate, leadScore,
  TEMP_STYLE, useList, Toolbar, Field, type Api, type TabProps, type Temperature,
} from './ui';

// ============================================================================
// Data model: a Contact is one family, built by grouping enquiries, payments
// and students on the parent's mobile number (or email when there is none).
// ============================================================================
interface Contact {
  key: string;
  name: string;
  phone: string;
  email: string;
  enquiries: Enquiry[];
  payments: PaymentRecord[];
  students: Student[];
  lead?: Enquiry; // most recent enquiry: holds stage, follow-up and score
}

const contactKey = (phone?: string, email?: string) => phoneKey(phone) || String(email || '').toLowerCase();

function buildContacts(enquiries: Enquiry[], payments: PaymentRecord[], students: Student[]): Contact[] {
  const map = new Map<string, Contact>();
  const get = (key: string, name: string, phone: string, email: string) => {
    if (!map.has(key)) map.set(key, { key, name, phone, email, enquiries: [], payments: [], students: [] });
    return map.get(key)!;
  };
  enquiries.forEach(e => { // newest first, so the first one is the current lead
    const key = contactKey(e.fields?.phone, e.fields?.email);
    if (!key) return;
    const c = get(key, e.fields?.name || '', e.fields?.phone || '', e.fields?.email || '');
    c.enquiries.push(e);
    if (!c.lead) c.lead = e;
  });
  payments.forEach(p => {
    const key = contactKey(p.payerPhone, p.payerEmail);
    if (key) get(key, p.applicantName, p.payerPhone, p.payerEmail).payments.push(p);
  });
  students.forEach(s => {
    const key = contactKey(s.parentPhone, s.parentEmail);
    if (key) get(key, s.parentName, s.parentPhone, s.parentEmail || '').students.push(s);
  });
  return [...map.values()];
}

const verifiedTotal = (c: Contact) => c.payments.filter(p => p.status === 'verified').reduce((s, p) => s + Number(p.amount || 0), 0);
const scoreOf = (c: Contact) => (c.lead ? leadScore(c.lead) : { score: 0, temp: 'Cold' as Temperature });
const sourceOf = (e?: Enquiry) => String(e?.fields?.source || 'Website');
const branchOf = (e?: Enquiry) => String(e?.fields?.branch || '');
const programOf = (e?: Enquiry) => String(e?.fields?.program || e?.fields?.courseOfInterest || e?.fields?.partnershipModel || e?.type || '');
const isFranchise = (e: Enquiry) => /franchise|partner/i.test(`${e.type} ${programOf(e)} ${sourceOf(e)}`);

type View = 'dashboard' | 'pipeline' | 'leads' | 'followups' | 'students' | 'parents';
const VIEWS: [View, string, React.ElementType][] = [
  ['dashboard', 'Dashboard', TrendingUp],
  ['pipeline', 'Pipeline', ArrowRightLeft],
  ['leads', 'Leads', Users],
  ['followups', 'Follow-ups', CalendarClock],
  ['students', 'Students', Baby],
  ['parents', 'Parents', Home],
];

type LeadPatch = { status?: LeadStage; nextFollowUp?: string; followUpType?: string; lostReason?: string; notes?: string; fields?: Record<string, string> };

export const CrmTab: React.FC<TabProps> = ({ api, flash }) => {
  const enq = useList<Enquiry>(api, '/api/enquiries');
  const pay = useList<PaymentRecord>(api, '/api/payments');
  const stu = useList<Student>(api, '/api/crm/students');
  const [view, setView] = useState<View>('dashboard');
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [lostPrompt, setLostPrompt] = useState(false);
  const [adding, setAdding] = useState(false);

  const contacts = useMemo(() => buildContacts(enq.items, pay.items, stu.items), [enq.items, pay.items, stu.items]);
  const open = contacts.find(c => c.key === openKey) || null;
  const reload = () => { enq.reload(); pay.reload(); stu.reload(); };

  const saveLead = async (lead: Enquiry, patch: LeadPatch) => {
    await api(`/api/enquiries/${lead.id}`, { method: 'PUT', body: JSON.stringify(patch) });
    enq.setItems(list => list.map(e => (e.id === lead.id ? {
      ...e, ...patch,
      fields: patch.fields ? { ...e.fields, ...patch.fields } : e.fields,
      lostReason: patch.status ? (patch.status === 'lost' ? patch.lostReason : '') : e.lostReason,
    } as Enquiry : e)));
  };

  const openContact = (key: string, askLost = false) => { setLostPrompt(askLost); setOpenKey(key); };

  return (
    <section className="space-y-4">
      <Toolbar title="CRM" count={contacts.length} onReload={reload}>
        <button className={btnPrimary} onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> New lead</button>
      </Toolbar>

      <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4">
        {VIEWS.map(([id, label, Icon]) => (
          <button key={id} onClick={() => setView(id)}
            className={`relative flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${view === id ? 'text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'}`}>
            {view === id && <motion.span layoutId="crm-view-pill" className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E1007A] to-pink-500 shadow-md shadow-pink-500/30" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <Icon className="relative h-4 w-4" /> <span className="relative">{label}</span>
          </button>
        ))}
      </div>

      {enq.loading || pay.loading ? <CrmLoader /> : (
        <AnimatePresence mode="wait">
        <motion.div key={view} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
          {view === 'dashboard' && <DashboardView contacts={contacts} enquiries={enq.items} payments={pay.items} students={stu.items} onOpen={k => openContact(k)} />}
          {view === 'pipeline' && <PipelineView contacts={contacts} onOpen={k => openContact(k)} onMove={async (c, stage) => {
            if (stage === 'lost') return openContact(c.key, true); // a reason is required
            await saveLead(c.lead!, { status: stage });
            flash(`${c.name} → ${stageOf(stage).label}`);
          }} />}
          {view === 'leads' && <LeadsView contacts={contacts} onOpen={k => openContact(k)} />}
          {view === 'followups' && <FollowUpsView contacts={contacts} onOpen={k => openContact(k)} />}
          {view === 'students' && <StudentsView students={stu.items} api={api} flash={flash} onSaved={stu.reload} />}
          {view === 'parents' && <ParentsView contacts={contacts} onOpen={k => openContact(k)} />}
        </motion.div>
        </AnimatePresence>
      )}

      {adding && <NewLeadModal api={api} onClose={() => setAdding(false)} onCreated={() => { setAdding(false); flash('Lead added'); enq.reload(); }} />}

      {open && (
        <ContactDrawer
          key={open.key}
          contact={open}
          api={api}
          flash={flash}
          askLost={lostPrompt}
          onClose={() => setOpenKey(null)}
          onSave={async (patch) => { await saveLead(open.lead!, patch); flash('Saved'); }}
          onAdmitted={() => { stu.reload(); enq.reload(); }}
        />
      )}
    </section>
  );
};

// ============================================================================
// Small building blocks
// ============================================================================
// Number that counts up from 0 when it first appears
const CountUp: React.FC<{ value: number; format?: (n: number) => string }> = ({ value, format = n => String(Math.round(n)) }) => {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);
  useEffect(() => {
    if (reduce) { setShown(value); return; }
    const controls = animate(0, value, { duration: 1.1, ease: [0.22, 1, 0.36, 1], onUpdate: setShown });
    return () => controls.stop();
  }, [value, reduce]);
  return <>{format(shown)}</>;
};

const Kpi: React.FC<{ label: string; value: number; format?: (n: number) => string; icon: React.ElementType; tone: string; hint?: string; index?: number }> = ({ label, value, format, icon: Icon, tone, hint, index = 0 }) => (
  <motion.div
    className={`${card} group relative flex items-center gap-3 overflow-hidden !p-4 transition-shadow hover:shadow-lg`}
    initial={{ opacity: 0, y: 18, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    whileHover={{ y: -3 }}
    transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
  >
    <span aria-hidden="true" className={`absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-40 blur-xl ${tone}`} />
    <span className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${tone}`}><Icon className="h-5 w-5" /></span>
    <div className="relative min-w-0">
      <div className="truncate text-xl font-extrabold leading-none text-stone-900 sm:text-2xl"><CountUp value={value} format={format} /></div>
      <div className="mt-1 text-[11px] font-semibold leading-tight text-stone-500 sm:text-xs">{label}</div>
      {hint && <div className="text-[10px] text-stone-400">{hint}</div>}
    </div>
  </motion.div>
);

// Friendly empty state with a small illustration
const EmptyState: React.FC<{ text: string; art?: 'cloud' | 'star' | 'heart' }> = ({ text, art = 'cloud' }) => (
  <div className="flex flex-col items-center gap-2 py-6 text-center">
    {art === 'cloud' && <Cloud className="w-20 kb-float" />}
    {art === 'star' && <Star className="w-10 kb-spin-slow" />}
    {art === 'heart' && <Heart className="w-10 kb-wiggle" />}
    <p className="max-w-xs text-sm text-stone-500">{text}</p>
  </div>
);

const CrmLoader = () => (
  <div className="flex flex-col items-center gap-3 py-16">
    <Bee className="w-24 kb-fly" />
    <p className="text-sm font-semibold text-stone-500">Gathering your leads…</p>
  </div>
);

const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };

// Illustrated welcome banner at the top of the dashboard
const WelcomeBanner: React.FC<{ due: number; hot: number; fresh: number; pendingPay: number }> = ({ due, hot, fresh, pendingPay }) => (
  <motion.div
    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#70162A] via-[#9b1f3d] to-[#E1007A] p-5 text-white shadow-xl shadow-pink-900/20 sm:p-7"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  >
    <div aria-hidden="true" className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]" />
    <div aria-hidden="true" className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#FFD400]/25 blur-3xl kb-drift" />
    <Bee className="absolute right-4 top-3 hidden w-28 sm:block kb-fly" />
    <Star className="absolute bottom-4 right-28 hidden w-7 sm:block kb-spin-slow" />
    <Star color="#FFD400" className="absolute right-44 top-6 hidden w-5 md:block kb-wiggle" />
    <div className="relative max-w-xl space-y-2">
      <div className="text-xs font-semibold uppercase tracking-widest text-pink-100/80">
        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
      <h2 className="font-display text-2xl font-extrabold sm:text-3xl">{greeting()} 👋</h2>
      <Squiggle color="#FFD400" className="h-4 w-24" />
      <p className="text-sm text-pink-50/90 sm:text-base">
        {due + hot + fresh + pendingPay === 0
          ? 'All caught up. A great day to bring in new families!'
          : 'Here is what needs your attention today.'}
      </p>
      <div className="flex flex-wrap gap-2 pt-1">
        {[
          [due, 'follow-ups due'],
          [hot, 'hot leads'],
          [fresh, 'new leads to call'],
          [pendingPay, 'payments to verify'],
        ].filter(([n]) => (n as number) > 0).map(([n, t], i) => (
          <motion.span key={t as string} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.08, type: 'spring' }}>
            <strong className="text-[#FFD400]">{n as number}</strong> {t as string}
          </motion.span>
        ))}
      </div>
    </div>
  </motion.div>
);

const TempChip: React.FC<{ c: Contact }> = ({ c }) => {
  if (!c.lead || !isOpenStage(c.lead.status)) return null;
  const { score, temp } = scoreOf(c);
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${TEMP_STYLE[temp]}`} title={`Lead score ${score}/100`}>{temp} · {score}</span>;
};

const Avatar: React.FC<{ name: string; size?: string }> = ({ name, size = 'h-9 w-9 text-sm' }) => (
  <span className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-amber-100 font-bold text-[#E1007A] ${size}`}>
    {(name || '?').charAt(0).toUpperCase()}
  </span>
);

const ContactRow: React.FC<{ c: Contact; onOpen: (k: string) => void; right?: React.ReactNode; sub?: string }> = ({ c, onOpen, right, sub }) => (
  <button onClick={() => onOpen(c.key)} className="flex w-full items-center gap-3 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-left transition hover:border-pink-200 hover:bg-pink-50/40">
    <Avatar name={c.name} />
    <span className="min-w-0 flex-1">
      <span className="block truncate text-sm font-semibold text-stone-800">{c.name || c.phone}</span>
      <span className="block truncate text-xs text-stone-500">{sub ?? `${programOf(c.lead) || 'Payment only'} · ${c.phone}`}</span>
    </span>
    {right}
  </button>
);

const Bars: React.FC<{ rows: { label: string; value: number; display?: string }[]; tone?: string }> = ({ rows, tone = 'from-[#E1007A] to-pink-400' }) => {
  const max = Math.max(1, ...rows.map(r => r.value));
  if (!rows.length) return <EmptyState text="No data yet. It fills in as leads arrive." art="star" />;
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={r.label} className="grid grid-cols-[7rem_1fr_auto] items-center gap-2 text-xs">
          <span className="truncate font-semibold text-stone-600" title={r.label}>{r.label}</span>
          <span className="h-3 overflow-hidden rounded-full bg-stone-100">
            <motion.span className={`block h-full rounded-full bg-gradient-to-r ${tone}`} initial={{ width: 0 }} animate={{ width: `${(r.value / max) * 100}%` }} transition={{ duration: 0.9, delay: 0.15 + i * 0.05, ease: [0.22, 1, 0.36, 1] }} />
          </span>
          <span className="w-16 text-right font-bold text-stone-800">{r.display ?? r.value}</span>
        </div>
      ))}
    </div>
  );
};

const tally = (keys: string[]) => {
  const m: Record<string, number> = {};
  keys.forEach(k => { const key = k || 'Not set'; m[key] = (m[key] || 0) + 1; });
  return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }));
};

const lastMonths = (n: number) => {
  const out: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(`${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`);
  }
  return out;
};
const monthLabel = (ym: string) => new Date(`${ym}-01T00:00:00`).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
const ageOf = (dob?: string) => {
  if (!dob) return '';
  const months = Math.floor((Date.now() - new Date(dob).getTime()) / (30.44 * 864e5));
  return months < 0 ? '' : `${Math.floor(months / 12)}y ${months % 12}m`;
};

// ============================================================================
// DASHBOARD
// ============================================================================
const DashboardView: React.FC<{ contacts: Contact[]; enquiries: Enquiry[]; payments: PaymentRecord[]; students: Student[]; onOpen: (k: string) => void }> = ({ contacts, enquiries, payments, students, onOpen }) => {
  const today = todayISO();
  const month = today.slice(0, 7);
  const leads = contacts.filter(c => c.lead);
  const due = leads.filter(c => c.lead!.nextFollowUp && c.lead!.nextFollowUp <= today && isOpenStage(c.lead!.status));
  const hot = leads.filter(c => isOpenStage(c.lead!.status) && scoreOf(c).temp === 'Hot');
  const admissionsMonth = students.filter(s => (s.admissionDate || s.createdAt).slice(0, 7) === month).length;
  const won = enquiries.filter(e => e.status === 'admission').length;
  const verified = payments.filter(p => p.status === 'verified');
  const collected = verified.reduce((s, p) => s + Number(p.amount || 0), 0);
  const pending = payments.filter(p => p.status === 'pending_verification').reduce((s, p) => s + Number(p.amount || 0), 0);
  const branches = new Set([...students.map(s => s.branch), ...enquiries.map(branchOf)].filter(Boolean));
  const months = lastMonths(6);

  // Funnel: how many leads reached each stage (lost leads count up to where they were lost)
  const reached = (stageId: LeadStage) => enquiries.filter(e => e.status !== 'lost' && stageIndex(e.status) >= stageIndex(stageId)).length;

  const fresh = leads.filter(c => c.lead!.status === 'new' && !c.lead!.nextFollowUp).length;
  const pendingCount = payments.filter(p => p.status === 'pending_verification').length;

  return (
    <div className="space-y-5">
      <WelcomeBanner due={due.length} hot={hot.length} fresh={fresh} pendingPay={pendingCount} />
      {due.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-pink-200 bg-pink-50 p-4">
          <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-[#E1007A]" />
          <div className="min-w-0 text-sm">
            <div className="font-bold text-stone-900">🔔 {due.length} follow-up{due.length > 1 ? 's' : ''} due</div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {due.slice(0, 6).map(c => (
                <button key={c.key} onClick={() => onOpen(c.key)} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-stone-700 border border-pink-200 hover:border-[#E1007A]">
                  {c.name} · {c.lead!.followUpType || 'Follow-up'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        <Kpi index={0} label="Total leads" value={enquiries.length} icon={Users} tone="bg-amber-100 text-amber-700" />
        <Kpi index={1} label="New leads today" value={enquiries.filter(e => e.createdAt.slice(0, 10) === today).length} icon={UserPlus} tone="bg-sky-100 text-sky-700" />
        <Kpi index={2} label="Follow-ups due" value={due.length} icon={CalendarClock} tone="bg-pink-100 text-[#E1007A]" />
        <Kpi index={3} label="Hot leads" value={hot.length} icon={Flame} tone="bg-red-100 text-red-600" />
        <Kpi index={4} label="Admissions this month" value={admissionsMonth} icon={GraduationCap} tone="bg-emerald-100 text-emerald-700" />
        <Kpi index={5} label="Conversion rate" value={enquiries.length ? (won / enquiries.length) * 100 : 0} format={n => `${Math.round(n)}%`} icon={TrendingUp} tone="bg-violet-100 text-violet-700" hint="leads → admission" />
        <Kpi index={6} label="Total students" value={students.length} icon={Baby} tone="bg-cyan-100 text-cyan-700" />
        <Kpi index={7} label="Fees collected" value={collected} format={rupees} icon={IndianRupee} tone="bg-emerald-100 text-emerald-700" hint="verified payments" />
        <Kpi index={8} label="Awaiting verification" value={pending} format={rupees} icon={CreditCard} tone="bg-orange-100 text-orange-700" />
        <Kpi index={9} label="Active branches" value={branches.size} icon={Building2} tone="bg-stone-100 text-stone-700" />
        <Kpi index={10} label="Franchise enquiries" value={enquiries.filter(isFranchise).length} icon={Sparkles} tone="bg-fuchsia-100 text-fuchsia-700" />
      </div>

      <div className="stagger is-in grid gap-5 lg:grid-cols-2">
        <div className={`${card} space-y-3`}>
          <h2 className="font-semibold">Lead funnel</h2>
          <div className="space-y-1.5">
            {STAGES.filter(s => s.id !== 'lost').map((s, i, arr) => {
              const n = reached(s.id);
              const top = Math.max(1, reached('new'));
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <span className="w-24 shrink-0 text-xs font-semibold text-stone-600">{s.label}</span>
                  <span className="relative h-7 flex-1">
                    <motion.span className={`absolute inset-y-0 left-1/2 -translate-x-1/2 rounded-md ${s.dot} opacity-80`} initial={{ width: 0 }} animate={{ width: `${Math.max(6, (n / top) * 100)}%` }} transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }} />
                  </span>
                  <span className="w-14 shrink-0 text-right text-xs font-bold text-stone-800">{n}{i > 0 && reached(arr[i - 1].id) ? <span className="ml-1 font-normal text-stone-400">{Math.round((n / reached(arr[i - 1].id)) * 100)}%</span> : null}</span>
                </div>
              );
            })}
            <div className="pt-1 text-xs text-stone-500">Lost: {enquiries.filter(e => e.status === 'lost').length}</div>
          </div>
        </div>

        <div className={`${card} space-y-3`}>
          <h2 className="font-semibold">Lead sources</h2>
          <Bars rows={tally(enquiries.map(sourceOf))} />
        </div>

        <div className={`${card} space-y-3`}>
          <h2 className="font-semibold">Monthly admissions</h2>
          <Bars tone="from-emerald-500 to-emerald-300" rows={months.map(m => ({ label: monthLabel(m), value: students.filter(s => (s.admissionDate || s.createdAt).slice(0, 7) === m).length }))} />
        </div>

        <div className={`${card} space-y-3`}>
          <h2 className="font-semibold">Leads per month</h2>
          <Bars tone="from-amber-500 to-amber-300" rows={months.map(m => ({ label: monthLabel(m), value: enquiries.filter(e => e.createdAt.slice(0, 7) === m).length }))} />
        </div>

        <div className={`${card} space-y-3`}>
          <h2 className="font-semibold">Admissions by branch</h2>
          <Bars tone="from-sky-500 to-sky-300" rows={tally(students.map(s => s.branch || ''))} />
        </div>

        <div className={`${card} space-y-3`}>
          <h2 className="font-semibold">Admissions by class / programme</h2>
          <Bars tone="from-violet-500 to-violet-300" rows={tally(students.map(s => s.className || ''))} />
        </div>

        <div className={`${card} space-y-3`}>
          <h2 className="font-semibold">Verified fees per month</h2>
          <Bars tone="from-emerald-500 to-emerald-300" rows={months.map(m => {
            const v = verified.filter(p => (p.paymentDate || p.createdAt).slice(0, 7) === m).reduce((s, p) => s + Number(p.amount || 0), 0);
            return { label: monthLabel(m), value: v, display: rupees(v) };
          })} />
        </div>

        <div className={`${card} space-y-3`}>
          <h2 className="font-semibold">Why leads were lost</h2>
          <Bars tone="from-stone-500 to-stone-300" rows={tally(enquiries.filter(e => e.status === 'lost').map(e => e.lostReason || ''))} />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PIPELINE (drag & drop board)
// ============================================================================
const PipelineView: React.FC<{ contacts: Contact[]; onOpen: (k: string) => void; onMove: (c: Contact, s: LeadStage) => Promise<void> | void }> = ({ contacts, onOpen, onMove }) => {
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<LeadStage | null>(null);
  const today = todayISO();
  const leads = contacts.filter(c => c.lead);

  return (
    <div className="space-y-2">
      <p className="text-xs text-stone-500">Drag a card to another column. On a phone, open the card and pick its stage.</p>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-3">
        {STAGES.map(st => {
          const col = leads.filter(c => c.lead!.status === st.id).sort((a, b) => scoreOf(b).score - scoreOf(a).score);
          return (
            <div
              key={st.id}
              onDragOver={e => { e.preventDefault(); setOverStage(st.id); }}
              onDragLeave={() => setOverStage(null)}
              onDrop={e => {
                e.preventDefault();
                setOverStage(null);
                const c = leads.find(x => x.key === dragKey);
                if (c && c.lead!.status !== st.id) onMove(c, st.id);
              }}
              className={`flex w-60 shrink-0 flex-col rounded-2xl border p-2.5 transition-colors ${overStage === st.id ? 'border-[#E1007A] bg-pink-50' : 'border-stone-200 bg-stone-100/70'}`}
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="flex items-center gap-2 text-sm font-bold text-stone-700"><span className={`h-2.5 w-2.5 rounded-full ${st.dot}`} />{st.label}</span>
                <span className="rounded-full bg-white px-2 text-xs font-semibold text-stone-500">{col.length}</span>
              </div>
              <div className="min-h-[120px] space-y-2">
                {col.map(c => {
                  const fu = c.lead!.nextFollowUp;
                  const paid = verifiedTotal(c);
                  return (
                    <div key={c.key} draggable onDragStart={() => setDragKey(c.key)} onDragEnd={() => setDragKey(null)} onClick={() => onOpen(c.key)}
                      className={`cursor-grab rounded-xl border border-stone-200 bg-white p-3 shadow-xs transition-[box-shadow,translate,border-color] duration-200 hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md active:cursor-grabbing ${dragKey === c.key ? 'opacity-40' : ''}`}>
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-stone-800">{c.name}</div>
                          <div className="truncate text-xs text-stone-500">{programOf(c.lead)}</div>
                        </div>
                        <TempChip c={c} />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600">{sourceOf(c.lead)}</span>
                        {fu && isOpenStage(c.lead!.status) && (
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${fu < today ? 'bg-red-100 text-red-700' : fu === today ? 'bg-pink-100 text-[#E1007A]' : 'bg-stone-100 text-stone-600'}`}>
                            {fu < today ? 'Overdue' : fu === today ? 'Today' : fmtDay(fu)}
                          </span>
                        )}
                        {c.lead!.status === 'lost' && c.lead!.lostReason && <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-semibold text-stone-600">{c.lead!.lostReason}</span>}
                        {paid > 0 && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">{rupees(paid)} paid</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// LEADS (searchable list with filters)
// ============================================================================
const LeadsView: React.FC<{ contacts: Contact[]; onOpen: (k: string) => void }> = ({ contacts, onOpen }) => {
  const [q, setQ] = useState('');
  const [stage, setStage] = useState('all');
  const [temp, setTemp] = useState('all');
  const [source, setSource] = useState('all');
  const leads = contacts.filter(c => c.lead);
  const sources = [...new Set(leads.map(c => sourceOf(c.lead)))].sort();
  const shown = leads
    .filter(c =>
      (stage === 'all' || c.lead!.status === stage) &&
      (temp === 'all' || (isOpenStage(c.lead!.status) && scoreOf(c).temp === temp)) &&
      (source === 'all' || sourceOf(c.lead) === source) &&
      (!q || [c.name, c.phone, c.email, programOf(c.lead), branchOf(c.lead), c.lead!.fields?.childName].some(v => String(v || '').toLowerCase().includes(q.toLowerCase())))
    )
    .sort((a, b) => scoreOf(b).score - scoreOf(a).score);

  return (
    <div className="space-y-3">
      <input className={input} placeholder="Search parent, child, mobile, email, programme, branch…" value={q} onChange={e => setQ(e.target.value)} />
      <div className="grid grid-cols-3 gap-2">
        <select className={input} value={stage} onChange={e => setStage(e.target.value)}>
          <option value="all">All stages</option>
          {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select className={input} value={temp} onChange={e => setTemp(e.target.value)}>
          <option value="all">All temperatures</option>
          <option>Hot</option><option>Warm</option><option>Cold</option>
        </select>
        <select className={input} value={source} onChange={e => setSource(e.target.value)}>
          <option value="all">All sources</option>
          {sources.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {shown.map(c => (
          <ContactRow key={c.key} c={c} onOpen={onOpen}
            sub={`${programOf(c.lead)}${c.lead!.fields?.childName ? ` · ${c.lead!.fields.childName}` : ''} · ${sourceOf(c.lead)}`}
            right={
              <span className="flex shrink-0 items-center gap-1.5">
                <TempChip c={c} />
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${stageOf(c.lead!.status).color}`}>{stageOf(c.lead!.status).label}</span>
              </span>
            } />
        ))}
        {!shown.length && <EmptyState text="No leads match these filters." />}
      </div>
    </div>
  );
};

// ============================================================================
// FOLLOW-UPS
// ============================================================================
const FollowUpsView: React.FC<{ contacts: Contact[]; onOpen: (k: string) => void }> = ({ contacts, onOpen }) => {
  const today = todayISO();
  const withFu = contacts.filter(c => c.lead?.nextFollowUp && isOpenStage(c.lead.status))
    .sort((a, b) => (a.lead!.nextFollowUp! < b.lead!.nextFollowUp! ? -1 : 1));
  const groups: [string, Contact[], string][] = [
    ['Overdue', withFu.filter(c => c.lead!.nextFollowUp! < today), 'bg-red-100 text-red-700'],
    ['Today', withFu.filter(c => c.lead!.nextFollowUp === today), 'bg-pink-100 text-[#E1007A]'],
    ['Upcoming', withFu.filter(c => c.lead!.nextFollowUp! > today), 'bg-stone-100 text-stone-600'],
  ];
  const noPlan = contacts.filter(c => c.lead && isOpenStage(c.lead.status) && !c.lead.nextFollowUp);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {groups.map(([title, list, tone]) => (
        <div key={title} className={`${card} space-y-3`}>
          <h2 className="flex items-center justify-between font-semibold">{title} <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${tone}`}>{list.length}</span></h2>
          {!list.length ? <EmptyState text="Nothing here. Nice work!" art="heart" /> : list.map(c => (
            <ContactRow key={c.key} c={c} onOpen={onOpen}
              sub={`${c.lead!.followUpType || 'Follow-up'} · ${programOf(c.lead)}`}
              right={<span className="shrink-0 text-right text-[11px] font-semibold text-stone-500">{fmtDay(c.lead!.nextFollowUp)}<br /><TempChip c={c} /></span>} />
          ))}
        </div>
      ))}
      <div className={`${card} space-y-3`}>
        <h2 className="flex items-center justify-between font-semibold">Open leads with no follow-up <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">{noPlan.length}</span></h2>
        <p className="text-xs text-stone-500">Every open lead should have a next step. Open one to schedule it.</p>
        {noPlan.slice(0, 12).map(c => <ContactRow key={c.key} c={c} onOpen={onOpen} right={<TempChip c={c} />} />)}
      </div>
    </div>
  );
};

// ============================================================================
// STUDENTS
// ============================================================================
const StudentsView: React.FC<{ students: Student[]; api: Api; flash: (m: string) => void; onSaved: () => void }> = ({ students, api, flash, onSaved }) => {
  const [q, setQ] = useState('');
  const [branch, setBranch] = useState('all');
  const [editing, setEditing] = useState<Student | null>(null);
  const branches = [...new Set(students.map(s => s.branch).filter(Boolean))] as string[];
  const shown = students.filter(s =>
    (branch === 'all' || s.branch === branch) &&
    (!q || [s.id, s.childName, s.parentName, s.parentPhone, s.className].some(v => String(v || '').toLowerCase().includes(q.toLowerCase())))
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input className={input} placeholder="Search student ID, child, parent, class…" value={q} onChange={e => setQ(e.target.value)} />
        <select className={`${input} sm:w-56`} value={branch} onChange={e => setBranch(e.target.value)}>
          <option value="all">All branches</option>
          {branches.map(b => <option key={b}>{b}</option>)}
        </select>
      </div>
      <p className="text-xs text-stone-500">Students are created from a lead: open the lead and choose “Admit as student”.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {shown.map(s => (
          <button key={s.id} onClick={() => setEditing(s)} className={`${card} !p-4 text-left transition hover:border-pink-200`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <Avatar name={s.childName} size="h-11 w-11 text-base" />
                <div>
                  <div className="font-semibold text-stone-900">{s.childName}</div>
                  <div className="font-mono text-xs text-[#E1007A]">{s.id}</div>
                </div>
              </div>
              {s.className && <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-bold text-violet-700">{s.className}</span>}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-stone-600">
              <span>Parent: <strong className="text-stone-800">{s.parentName}</strong></span>
              <span>{s.parentPhone}</span>
              {s.branch && <span>Branch: {s.branch}</span>}
              {s.dob && <span>Age: {ageOf(s.dob)}</span>}
              {s.academicYear && <span>Year: {s.academicYear}</span>}
              {s.admissionDate && <span>Admitted {fmtDay(s.admissionDate)}</span>}
            </div>
          </button>
        ))}
        {!shown.length && <div className="md:col-span-2"><EmptyState text="No students yet. Admit one from a lead to see them here." art="star" /></div>}
      </div>
      {editing && <StudentForm api={api} initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); flash('Student updated'); onSaved(); }} />}
    </div>
  );
};

// ============================================================================
// PARENTS (families: one parent, one or more children)
// ============================================================================
const ParentsView: React.FC<{ contacts: Contact[]; onOpen: (k: string) => void }> = ({ contacts, onOpen }) => {
  const [q, setQ] = useState('');
  const families = contacts.filter(c => c.students.length)
    .filter(c => !q || [c.name, c.phone, c.email, ...c.students.map(s => s.childName)].some(v => String(v || '').toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="space-y-3">
      <input className={input} placeholder="Search parent, child, mobile…" value={q} onChange={e => setQ(e.target.value)} />
      <div className="grid gap-3 md:grid-cols-2">
        {families.map(c => (
          <button key={c.key} onClick={() => onOpen(c.key)} className={`${card} !p-4 text-left transition hover:border-pink-200`}>
            <div className="flex items-center gap-3">
              <Avatar name={c.name} size="h-11 w-11 text-base" />
              <div className="min-w-0">
                <div className="truncate font-semibold text-stone-900">{c.name}</div>
                <div className="truncate text-xs text-stone-500">{c.phone}{c.email ? ` · ${c.email}` : ''}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              {c.students.map(s => (
                <div key={s.id} className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-1.5 text-xs">
                  <span className="font-semibold text-stone-700">{s.childName}</span>
                  <span className="text-stone-500">{[s.className, s.branch].filter(Boolean).join(' · ')}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-3 text-[11px] text-stone-500">
              <span>{c.students.length} child{c.students.length > 1 ? 'ren' : ''}</span>
              {verifiedTotal(c) > 0 && <span className="font-semibold text-emerald-700">{rupees(verifiedTotal(c))} paid</span>}
            </div>
          </button>
        ))}
        {!families.length && <div className="md:col-span-2"><EmptyState text="Families appear here once their child is admitted." art="heart" /></div>}
      </div>
    </div>
  );
};

// ============================================================================
// MODALS: new lead, student form
// ============================================================================
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <motion.div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <motion.div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6"
        initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 320, damping: 30 }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">{title}</h2>
          <button onClick={onClose} className="rounded-full p-2 text-stone-500 hover:bg-stone-100" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

const LEAD_FIELDS: [string, string, string?][] = [
  ['name', 'Parent name *'], ['relation', 'Relation (Father / Mother / Guardian)'], ['phone', 'Phone *'], ['whatsapp', 'WhatsApp (if different)'],
  ['email', 'Email'], ['city', 'Location / City'], ['pincode', 'Area / Pincode'], ['childName', 'Child name'], ['childDob', 'Child date of birth', 'date'],
  ['gender', 'Child gender'], ['currentSchool', 'Current school'], ['branch', 'Interested branch'], ['preferredMonth', 'Preferred admission month', 'month'], ['budget', 'Budget'],
];

const LeadDetailsForm: React.FC<{ value: Record<string, string>; onChange: (v: Record<string, string>) => void }> = ({ value, onChange }) => {
  const set = (k: string, v: string) => onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {LEAD_FIELDS.map(([k, label, type]) => (
        <Field key={k} label={label}>
          {k === 'gender' ? (
            <select className={input} value={value[k] || ''} onChange={e => set(k, e.target.value)}>
              <option value="">—</option><option>Girl</option><option>Boy</option>
            </select>
          ) : (
            <input className={input} type={type || 'text'} value={value[k] || ''} onChange={e => set(k, e.target.value)} />
          )}
        </Field>
      ))}
      <Field label="Interested programme">
        <select className={input} value={value.program || ''} onChange={e => set('program', e.target.value)}>
          <option value="">—</option>
          {PROGRAMMES.map(p => <option key={p}>{p}</option>)}
        </select>
      </Field>
      <Field label="Lead source">
        <select className={input} value={value.source || ''} onChange={e => set('source', e.target.value)}>
          <option value="">—</option>
          {LEAD_SOURCES.map(p => <option key={p}>{p}</option>)}
        </select>
      </Field>
      <Field label="Message / requirement" full>
        <textarea className={input} rows={2} value={value.message || ''} onChange={e => set('message', e.target.value)} />
      </Field>
    </div>
  );
};

const NewLeadModal: React.FC<{ api: Api; onClose: () => void; onCreated: () => void }> = ({ api, onClose, onCreated }) => {
  const [fields, setFields] = useState<Record<string, string>>({ source: 'Walk-in' });
  const [nextFollowUp, setNextFollowUp] = useState(todayISO());
  const [followUpType, setFollowUpType] = useState('Call');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const submit = async () => {
    setErr('');
    if ((fields.name || '').trim().length < 2 || (fields.phone || '').replace(/\D/g, '').length < 10) return setErr('Parent name and a 10-digit phone number are required.');
    setBusy(true);
    try {
      await api('/api/crm/leads', { method: 'POST', body: JSON.stringify({ fields, type: fields.program || 'Manual lead', nextFollowUp, followUpType }) });
      onCreated();
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  };
  return (
    <Modal title="New lead" onClose={onClose}>
      <div className="space-y-4">
        <LeadDetailsForm value={fields} onChange={setFields} />
        <div className="grid gap-3 rounded-2xl bg-pink-50/60 p-3 sm:grid-cols-2">
          <Field label="First follow-up"><input type="date" className={input} value={nextFollowUp} onChange={e => setNextFollowUp(e.target.value)} /></Field>
          <Field label="Follow-up type">
            <select className={input} value={followUpType} onChange={e => setFollowUpType(e.target.value)}>{FOLLOW_UP_TYPES.map(t => <option key={t}>{t}</option>)}</select>
          </Field>
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <div className="flex justify-end gap-2">
          <button className={btnGhost} onClick={onClose}>Cancel</button>
          <button className={btnPrimary} disabled={busy} onClick={submit}>{busy ? 'Saving…' : 'Add lead'}</button>
        </div>
      </div>
    </Modal>
  );
};

const CLASSES = ['Playgroup', 'Nursery', 'Junior KG', 'Senior KG', 'Daycare'];
const academicYear = () => { const d = new Date(); const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1; return `${y}-${String(y + 1).slice(2)}`; };

const StudentForm: React.FC<{ api: Api; initial: Partial<Student>; onClose: () => void; onSaved: () => void }> = ({ api, initial, onClose, onSaved }) => {
  const isNew = !initial.id;
  const [s, setS] = useState<Partial<Student>>({ academicYear: academicYear(), admissionDate: todayISO(), ...initial });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: keyof Student, v: string) => setS(x => ({ ...x, [k]: v }));
  const F = (k: keyof Student, label: string, type = 'text') => (
    <Field label={label}><input className={input} type={type} value={String(s[k] || '')} onChange={e => set(k, e.target.value)} /></Field>
  );
  const submit = async () => {
    setErr('');
    if (!s.childName?.trim() || !s.parentName?.trim() || String(s.parentPhone || '').replace(/\D/g, '').length < 10) return setErr('Child name, parent name and a 10-digit parent phone are required.');
    setBusy(true);
    try {
      await api(isNew ? '/api/crm/students' : `/api/crm/students/${s.id}`, { method: isNew ? 'POST' : 'PUT', body: JSON.stringify(s) });
      onSaved();
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  };
  return (
    <Modal title={isNew ? 'Admit as student' : `${s.childName} · ${s.id}`} onClose={onClose}>
      <div className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-wide text-[#E1007A]">Child</div>
        <div className="grid gap-3 sm:grid-cols-2">
          {F('childName', 'Child name *')}
          {F('dob', 'Date of birth', 'date')}
          <Field label="Gender"><select className={input} value={s.gender || ''} onChange={e => set('gender', e.target.value)}><option value="">—</option><option>Girl</option><option>Boy</option></select></Field>
          <Field label="Class"><select className={input} value={s.className || ''} onChange={e => set('className', e.target.value)}><option value="">—</option>{CLASSES.map(c => <option key={c}>{c}</option>)}</select></Field>
          {F('branch', 'Branch')}
          {F('academicYear', 'Academic year')}
          {F('admissionDate', 'Admission date', 'date')}
          {F('previousSchool', 'Previous school')}
        </div>
        <div className="text-xs font-bold uppercase tracking-wide text-[#E1007A]">Parent</div>
        <div className="grid gap-3 sm:grid-cols-2">
          {F('parentName', 'Parent name *')}
          {F('parentRelation', 'Relation')}
          {F('parentPhone', 'Parent phone *', 'tel')}
          {F('parentEmail', 'Parent email', 'email')}
          {F('address', 'Address')}
          {F('emergencyContact', 'Emergency contact')}
        </div>
        <Field label="Medical / emergency information" full>
          <textarea className={input} rows={2} value={s.medicalInfo || ''} onChange={e => set('medicalInfo', e.target.value)} />
        </Field>
        {isNew && <p className="text-xs text-stone-500">A student ID like KB-{new Date().getFullYear()}-00001 is generated automatically, and the lead moves to Admission.</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}
        <div className="flex justify-end gap-2">
          <button className={btnGhost} onClick={onClose}>Cancel</button>
          <button className={btnPrimary} disabled={busy} onClick={submit}>{busy ? 'Saving…' : isNew ? 'Admit student' : 'Save'}</button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================================================
// CONTACT DRAWER: everything about one family + all actions
// ============================================================================
const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  created: UserPlus, stage: ArrowRightLeft, follow_up: CalendarClock, note: StickyNote, call: Phone, whatsapp: MessageCircle, email: Mail, payment: IndianRupee,
};

const ContactDrawer: React.FC<{
  contact: Contact;
  api: Api;
  flash: (m: string) => void;
  askLost: boolean;
  onClose: () => void;
  onSave: (patch: LeadPatch) => Promise<void>;
  onAdmitted: () => void;
}> = ({ contact: c, api, flash, askLost, onClose, onSave, onAdmitted }) => {
  const lead = c.lead;
  const [timeline, setTimeline] = useState<LeadActivity[]>([]);
  const [note, setNote] = useState('');
  const [followUp, setFollowUp] = useState(lead?.nextFollowUp || '');
  const [fuType, setFuType] = useState(lead?.followUpType || 'Call');
  const [lostOpen, setLostOpen] = useState(askLost);
  const [lostReason, setLostReason] = useState(lead?.lostReason || '');
  const [editing, setEditing] = useState(false);
  const [details, setDetails] = useState<Record<string, string>>({});
  const [admitting, setAdmitting] = useState(false);
  const [waOpen, setWaOpen] = useState(false);
  const key = phoneKey(c.phone) || c.email.toLowerCase();
  const { score, temp } = scoreOf(c);
  const child = String(lead?.fields?.childName || '');

  const loadTimeline = () => api(`/api/crm/activity?key=${encodeURIComponent(key)}`).then(setTimeline).catch(() => {});
  useEffect(() => { loadTimeline(); }, [c.key]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && !editing && !admitting && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose, editing, admitting]);

  // Logs a contact attempt without blocking the link it belongs to
  const log = (type: LeadActivity['type'], detail: string) => {
    api('/api/crm/activity', { method: 'POST', body: JSON.stringify({ leadKey: key, enquiryId: lead?.id, type, detail }) }).then(loadTimeline).catch(() => {});
  };
  const save = async (patch: LeadPatch) => { await onSave(patch); loadTimeline(); };

  const addNote = async () => {
    if (!note.trim()) return;
    await api('/api/crm/activity', { method: 'POST', body: JSON.stringify({ leadKey: key, enquiryId: lead?.id, type: 'note', detail: note.trim() }) });
    setNote('');
    loadTimeline();
    flash('Note added');
  };

  const sendWhatsApp = (tplId: string) => {
    const tpl = WHATSAPP_TEMPLATES.find(t => t.id === tplId)!;
    const wa = phoneKey(lead?.fields?.whatsapp || c.phone);
    window.open(`https://wa.me/91${wa}?text=${encodeURIComponent(fillTemplate(tpl.text, c.name, child))}`, '_blank', 'noopener');
    log('whatsapp', `WhatsApp: ${tpl.label}`);
    setWaOpen(false);
  };

  const startEdit = () => {
    const f = lead?.fields || {};
    setDetails(Object.fromEntries([...LEAD_FIELDS.map(([k]) => k), 'program', 'source', 'message'].map(k => [k, String(f[k] ?? (k === 'program' ? programOf(lead) : '') ?? '')])));
    setEditing(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={`Contact ${c.name}`}>
      <motion.div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <motion.div className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-[#FAF9F6] shadow-2xl"
        initial={{ x: '100%' }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 34 }}>
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={c.name} size="h-12 w-12 text-lg" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-lg font-bold text-stone-900">{c.name}</span>
                  {lead && isOpenStage(lead.status) && <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${TEMP_STYLE[temp]}`}>{temp} · {score}</span>}
                </div>
                <div className="truncate text-xs text-stone-500">{c.phone}{c.email ? ` · ${c.email}` : ''}</div>
              </div>
            </div>
            <button onClick={onClose} className="rounded-full p-2 text-stone-500 hover:bg-stone-100" aria-label="Close"><X className="h-5 w-5" /></button>
          </div>
          <div className="relative mt-3 flex flex-wrap gap-2">
            {c.phone && <a className={btnGhost} href={`tel:${c.phone}`} onClick={() => log('call', 'Called')}><Phone className="h-4 w-4" /> Call</a>}
            {c.phone && <button className={btnGhost} onClick={() => setWaOpen(o => !o)}><MessageCircle className="h-4 w-4" /> WhatsApp</button>}
            {c.email && <a className={btnGhost} href={`mailto:${c.email}`} onClick={() => log('email', 'Email opened')}><Mail className="h-4 w-4" /> Email</a>}
            {lead && <button className={btnGhost} onClick={startEdit}><Pencil className="h-4 w-4" /> Edit details</button>}
            {waOpen && (
              <div className="absolute left-0 top-full z-20 mt-2 w-72 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl">
                <div className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wide text-stone-400">Send a template</div>
                {WHATSAPP_TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => sendWhatsApp(t.id)} className="block w-full rounded-lg px-2.5 py-2 text-left text-sm hover:bg-emerald-50">
                    <span className="font-semibold text-stone-800">{t.label}</span>
                    <span className="block truncate text-xs text-stone-500">{fillTemplate(t.text, c.name, child).split('\n')[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 p-5">
          {lead ? (
            <>
              {/* Stage */}
              <div className={`${card} space-y-3`}>
                <div className="text-xs font-bold uppercase tracking-wide text-stone-500">Stage</div>
                <div className="flex flex-wrap gap-1.5">
                  {STAGES.map(s => (
                    <button key={s.id}
                      onClick={() => s.id === 'lost' ? setLostOpen(true) : (s.id !== lead.status && save({ status: s.id }))}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${lead.status === s.id ? `${s.color} ring-2 ring-offset-1 ring-current` : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
                {lead.status === 'lost' && lead.lostReason && !lostOpen && <p className="text-xs text-stone-500">Lost reason: <strong>{lead.lostReason}</strong></p>}
                {lostOpen && (
                  <div className="flex flex-wrap items-end gap-2 rounded-xl bg-stone-100 p-3">
                    <label className="flex-1 space-y-1">
                      <span className="text-xs font-semibold text-stone-600">Why was this lead lost?</span>
                      <select className={input} value={lostReason} onChange={e => setLostReason(e.target.value)}>
                        <option value="">Choose a reason</option>
                        {LOST_REASONS.map(r => <option key={r}>{r}</option>)}
                      </select>
                    </label>
                    <button className={btnPrimary} disabled={!lostReason} onClick={async () => { await save({ status: 'lost', lostReason }); setLostOpen(false); }}>Mark lost</button>
                    <button className={btnGhost} onClick={() => setLostOpen(false)}>Cancel</button>
                  </div>
                )}
                {lead.status !== 'admission' && (
                  <button className={`${btnPrimary} w-full justify-center !bg-emerald-600 hover:!bg-emerald-700`} onClick={() => setAdmitting(true)}>
                    <GraduationCap className="h-4 w-4" /> Admit as student
                  </button>
                )}
              </div>

              {/* Follow-up */}
              {isOpenStage(lead.status) && (
                <div className={`${card} space-y-3`}>
                  <div className="text-xs font-bold uppercase tracking-wide text-stone-500">Next follow-up</div>
                  <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                    <input type="date" className={input} value={followUp} onChange={e => setFollowUp(e.target.value)} />
                    <select className={input} value={fuType} onChange={e => setFuType(e.target.value)}>{FOLLOW_UP_TYPES.map(t => <option key={t}>{t}</option>)}</select>
                    <button className={btnPrimary} disabled={!followUp || (followUp === (lead.nextFollowUp || '') && fuType === (lead.followUpType || 'Call'))}
                      onClick={() => save({ nextFollowUp: followUp, followUpType: fuType })}>Schedule</button>
                  </div>
                  {lead.nextFollowUp && (
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span><Clock className="mr-1 inline h-3.5 w-3.5" />{lead.followUpType || 'Follow-up'} on {fmtDay(lead.nextFollowUp)}</span>
                      <button className="font-semibold text-[#E1007A]" onClick={() => { setFollowUp(''); save({ nextFollowUp: '', followUpType: '' }); }}>Mark done / clear</button>
                    </div>
                  )}
                </div>
              )}

              {/* Lead details */}
              <div className={`${card} space-y-2`}>
                <div className="text-xs font-bold uppercase tracking-wide text-stone-500">Lead details</div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {[
                    ['Programme', programOf(lead)], ['Source', sourceOf(lead)], ['Branch', branchOf(lead)],
                    ['Child', child], ['Child DOB', lead.fields?.childDob ? `${fmtDay(lead.fields.childDob)} (${ageOf(lead.fields.childDob)})` : ''],
                    ['Gender', lead.fields?.gender], ['Current school', lead.fields?.currentSchool], ['Location', [lead.fields?.city, lead.fields?.pincode].filter(Boolean).join(' · ')],
                    ['Admission month', lead.fields?.preferredMonth], ['Budget', lead.fields?.budget], ['Relation', lead.fields?.relation],
                    ['Campaign', [lead.fields?.utm_source, lead.fields?.utm_campaign].filter(Boolean).join(' / ')],
                  ].filter(([, v]) => v).map(([k, v]) => (
                    <div key={k as string}><dt className="text-[11px] uppercase tracking-wide text-stone-400">{k}</dt><dd className="break-words text-stone-800">{v}</dd></div>
                  ))}
                </dl>
                {lead.fields?.message && <p className="rounded-lg bg-stone-50 p-2.5 text-xs text-stone-600">“{lead.fields.message}”</p>}
                {lead.aiSummary && <p className="rounded-lg bg-amber-50 p-2.5 text-xs text-stone-700">{lead.aiSummary}</p>}
              </div>
            </>
          ) : (
            <div className={`${card} flex items-start gap-2 text-sm text-stone-600`}>
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              No enquiry on record for this family, so they are not on the pipeline.
            </div>
          )}

          {/* Children */}
          {c.students.length > 0 && (
            <div className={`${card} space-y-2`}>
              <div className="text-xs font-bold uppercase tracking-wide text-stone-500">Children ({c.students.length})</div>
              {c.students.map(s => (
                <div key={s.id} className="flex items-center justify-between rounded-xl bg-emerald-50/60 px-3 py-2 text-sm">
                  <span><strong>{s.childName}</strong> <span className="font-mono text-xs text-[#E1007A]">{s.id}</span></span>
                  <span className="text-xs text-stone-500">{[s.className, s.branch].filter(Boolean).join(' · ')}</span>
                </div>
              ))}
            </div>
          )}

          {/* Note */}
          <div className={`${card} space-y-2`}>
            <div className="text-xs font-bold uppercase tracking-wide text-stone-500">Add a note</div>
            <textarea className={input} rows={2} placeholder="e.g. Interested in FinnishWay programme, asked about transport" value={note} onChange={e => setNote(e.target.value)} />
            <button className={btnPrimary} disabled={!note.trim()} onClick={addNote}>Add to timeline</button>
          </div>

          {/* Payments */}
          <div className={`${card} space-y-2`}>
            <div className="text-xs font-bold uppercase tracking-wide text-stone-500">Payments ({c.payments.length})</div>
            {!c.payments.length && <p className="text-sm text-stone-500">None yet.</p>}
            {c.payments.map(p => (
              <div key={p.id} className="flex items-center justify-between gap-2 rounded-xl bg-stone-50 p-3 text-sm">
                <div className="min-w-0">
                  <div className="font-semibold text-stone-800">{rupees(Number(p.amount))}</div>
                  <div className="truncate text-xs text-stone-500">{p.programme} · UTR {p.upiRefNumber}</div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS_COLORS[p.status] || ''}`}>{p.status === 'pending_verification' ? 'pending' : p.status}</span>
              </div>
            ))}
          </div>

          {/* Enquiries */}
          {c.enquiries.length > 1 && (
            <div className={`${card} space-y-2`}>
              <div className="text-xs font-bold uppercase tracking-wide text-stone-500">All enquiries ({c.enquiries.length})</div>
              {c.enquiries.map(e => (
                <div key={e.id} className="flex items-center justify-between rounded-xl bg-stone-50 px-3 py-2 text-xs">
                  <span className="font-semibold text-stone-700">{programOf(e)}</span>
                  <span className="text-stone-400">{fmtDay(e.createdAt)} · {stageOf(e.status).label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Timeline */}
          <div className={`${card} space-y-3`}>
            <div className="text-xs font-bold uppercase tracking-wide text-stone-500">Timeline</div>
            {!timeline.length && <EmptyState text="No activity yet. Calls, messages and notes will appear here." />}
            <ol className="relative space-y-3 border-l border-stone-200 pl-5">
              {timeline.map(a => {
                const Icon = ACTIVITY_ICONS[a.type] || StickyNote;
                return (
                  <li key={a.id} className="relative">
                    <span className="absolute -left-[29px] flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 bg-white text-[#E1007A]"><Icon className="h-3 w-3" /></span>
                    <div className="text-sm text-stone-800">{a.detail}</div>
                    <div className="text-[11px] text-stone-400">{fmtDate(a.createdAt)}</div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </motion.div>

      {editing && (
        <Modal title="Edit lead details" onClose={() => setEditing(false)}>
          <div className="space-y-4">
            <LeadDetailsForm value={details} onChange={setDetails} />
            <div className="flex justify-end gap-2">
              <button className={btnGhost} onClick={() => setEditing(false)}>Cancel</button>
              <button className={btnPrimary} onClick={async () => {
                if ((details.name || '').trim().length < 2 || (details.phone || '').replace(/\D/g, '').length < 10) return alert('Parent name and a 10-digit phone number are required.');
                await save({ fields: details });
                setEditing(false);
              }}>Save details</button>
            </div>
          </div>
        </Modal>
      )}

      {admitting && lead && (
        <StudentForm
          api={api}
          initial={{
            childName: child, dob: lead.fields?.childDob || '', gender: lead.fields?.gender || '', branch: branchOf(lead),
            className: CLASSES.find(k => programOf(lead).toLowerCase().includes(k.toLowerCase())) || '',
            parentName: c.name, parentRelation: lead.fields?.relation || '', parentPhone: c.phone, parentEmail: c.email,
            previousSchool: lead.fields?.currentSchool || '', enquiryId: lead.id,
          }}
          onClose={() => setAdmitting(false)}
          onSaved={() => { setAdmitting(false); flash('Student admitted'); onAdmitted(); loadTimeline(); }}
        />
      )}
    </div>
  );
};
