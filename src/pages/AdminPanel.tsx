import React, { useEffect, useMemo, useState } from 'react';
import { Users, Building2, Inbox, CreditCard, FileText, HelpCircle, Settings as SettingsIcon, LogOut, ExternalLink, Trash2, Plus, Download, Upload, RefreshCw, LayoutDashboard, ShieldCheck, CalendarCheck, Image as ImageIcon, Landmark, ScrollText, ClipboardList, KeyRound, Menu, X, ChevronRight, CalendarClock, Search } from 'lucide-react';
import type { Enquiry, PaymentRecord, BlogPost, FAQItem, SystemSettings } from '../types';
import { input, btn, btnPrimary, btnGhost, card, fmtDate, csvCell, phoneKey, STAGES, stageOf, STATUS_COLORS, useList, Toolbar, Field, type Api, type TabProps } from './admin/ui';
import { CrmTab } from './admin/Crm';
import { SearchPalette } from './admin/Search';
import { OpportunitiesTab } from './admin/Opportunities';
import { ConsultationsTab } from './admin/Consultations';
import { enquiryCategory, categoryInfo } from '../data/enquiry';

const enquiryLabel = (e: Enquiry) => categoryInfo(enquiryCategory(e.type, e.fields));
import { OverviewTab } from './admin/portal/Overview';
import { TeamTab } from './admin/portal/Team';
import { StaffTab } from './admin/portal/Staff';
import { PhotosTab } from './admin/portal/Photos';
import { FranchiseTab } from './admin/portal/Franchise';
import { AuditTab } from './admin/portal/Audit';
import { LeadDeskTab } from './admin/portal/LeadDesk';
import { AccountModal } from './admin/portal/Account';
import { ROLE_STYLE, type Me, type Perm } from './admin/portal/common';

interface AdminPanelProps {
  adminToken: string;
  onLogout: () => void;
  onVisitSite: () => void;
  settings: SystemSettings | null;
  onUpdateSettings: (s: SystemSettings) => void;
}

type Tab = 'overview' | 'crm' | 'leaddesk' | 'enquiries' | 'consultations' | 'payments' | 'staff' | 'photos' | 'franchise' | 'opportunities' | 'blogs' | 'faqs' | 'settings' | 'team' | 'audit';

// `need`: the section is shown (and its data served) only to roles holding at least one of these permissions
export interface Module { id: Tab; label: string; description: string; group: string; icon: React.ElementType; need: Perm[] }
const TABS: Module[] = [
  { id: 'overview', label: 'Dashboard', description: 'Key numbers across leads, payments, staff and branches', group: 'Overview', icon: LayoutDashboard, need: ['reports'] },
  { id: 'crm', label: 'Leads & pipeline', description: 'Every lead, its stage, follow-ups, students and parents', group: 'Sales', icon: Users, need: ['leads'] },
  { id: 'leaddesk', label: 'Lead desk', description: 'Assign leads and work through today\'s follow-ups', group: 'Sales', icon: ClipboardList, need: ['leads', 'leads_branch'] },
  { id: 'enquiries', label: 'All enquiries', description: 'Website forms, brochure downloads and newsletter sign-ups', group: 'Sales', icon: Inbox, need: ['leads'] },
  { id: 'consultations', label: 'Consultations', description: '₹99 one-to-one bookings and their payment status', group: 'Sales', icon: CalendarCheck, need: ['leads'] },
  { id: 'payments', label: 'Payments', description: 'Verify UPI payments and send course access', group: 'Finance', icon: CreditCard, need: ['payments'] },
  { id: 'franchise', label: 'Branch payments', description: 'Franchise and branch ledger', group: 'Finance', icon: Landmark, need: ['finance'] },
  { id: 'staff', label: 'Staff & payroll', description: 'Attendance, salaries and payslips', group: 'Operations', icon: CalendarClock, need: ['attendance', 'salary'] },
  { id: 'photos', label: 'Gallery photos', description: 'Upload and approve photos for the website gallery', group: 'Operations', icon: ImageIcon, need: ['gallery'] },
  { id: 'opportunities', label: 'Opportunities', description: 'Joint-venture and investment listings', group: 'Operations', icon: Building2, need: ['opportunities'] },
  { id: 'blogs', label: 'Blog posts', description: 'Write, edit and publish blog posts', group: 'Website', icon: FileText, need: ['website'] },
  { id: 'faqs', label: 'FAQs', description: 'Questions shown on the website', group: 'Website', icon: HelpCircle, need: ['website'] },
  { id: 'settings', label: 'Settings', description: 'Contact details, website content, SEO and CRM branding', group: 'Website', icon: SettingsIcon, need: ['website'] },
  { id: 'team', label: 'Team & access', description: 'Staff accounts, roles, permissions and branches', group: 'Administration', icon: ShieldCheck, need: ['users'] },
  { id: 'audit', label: 'Activity log', description: 'Who did what, and when', group: 'Administration', icon: ScrollText, need: ['audit'] },
];
const TAB_KEY = 'kips_crm_tab';

export const AdminPanel: React.FC<AdminPanelProps> = ({ adminToken, onLogout, onVisitSite, settings, onUpdateSettings }) => {
  const [tab, setTabState] = useState<Tab>('overview');
  const [me, setMe] = useState<Me | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // One-off instructions for the section being opened (quick action "Add a lead", a lead picked in search)
  const [intent, setIntent] = useState<{ crmNew?: number; enqQuery?: string }>({});
  const [badges, setBadges] = useState<Partial<Record<Tab, number>>>({});
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // White-label branding (Settings → CRM branding)
  const brand = settings?.crmName || `${settings?.logoText || 'Kinderbee'} CRM`;
  const accent = /^#[0-9a-f]{3,8}$/i.test(settings?.crmAccent || '') ? settings!.crmAccent! : '#E1007A';

  // Every admin call goes through here: adds the token, logs out on a stale token, surfaces errors
  const api = async (url: string, options: RequestInit = {}) => {
    setError('');
    const res = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}`, ...(options.headers || {}) },
    });
    if (res.status === 403) {
      onLogout();
      throw new Error('Session expired. Please log in again.');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data.error || `Request failed (${res.status})`;
      setError(msg);
      throw new Error(msg);
    }
    return data;
  };

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 2500);
  };

  const setTab = (t: Tab) => {
    setIntent({});
    setTabState(t);
    setMenuOpen(false);
    try { localStorage.setItem(TAB_KEY, t); } catch { /* private mode */ }
    window.scrollTo({ top: 0 });
  };

  // "crm:new" opens the New lead form; "enquiries:<text>" opens All enquiries filtered to that text
  const goTo = (target: string) => {
    const [t, arg] = target.split(/:(.*)/s);
    setTab(t as Tab);
    if (t === 'crm' && arg === 'new') setIntent({ crmNew: Date.now() });
    if (t === 'enquiries' && arg) setIntent({ enqQuery: arg });
  };

  // Ctrl/⌘+K opens search from anywhere in the CRM
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Who is signed in decides which sections exist. The server enforces the same rules on every request.
  useEffect(() => {
    api('/api/auth/me').then((m: Me) => {
      setMe(m);
      const allowed = TABS.filter(t => t.need.some(p => m.perms.includes(p)));
      let saved = '';
      try { saved = localStorage.getItem(TAB_KEY) || ''; } catch { /* private mode */ }
      const start = allowed.find(t => t.id === saved) || allowed[0];
      if (start) setTabState(start.id);
    }).catch(() => {});
  }, [adminToken]);

  // Sidebar counts of work waiting (only for roles that can see the dashboard numbers)
  useEffect(() => {
    if (!me?.perms.includes('reports')) return;
    api('/api/portal/overview').then((o: any) => setBadges({
      leaddesk: o.leads?.followUpsDue || 0,
      payments: o.payments?.pendingCount || 0,
      photos: o.approvals?.photos || 0,
    })).catch(() => {});
  }, [me, tab]);

  const tabs = me ? TABS.filter(t => t.need.some(p => me.perms.includes(p))) : [];
  const current = TABS.find(t => t.id === tab) || TABS[0];
  const groups = [...new Set(tabs.map(t => t.group))];

  if (!me) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">{error || 'Opening your workspace…'}</div>;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-slate-200 px-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--crm-accent)] text-sm font-bold text-white">{brand.charAt(0).toUpperCase()}</span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">{brand}</div>
          <div className="truncate text-xs text-slate-500">{me.role === 'ceo' ? 'Head office' : me.roleLabel}</div>
        </div>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="CRM sections">
        {groups.map(g => (
          <div key={g}>
            <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{g}</div>
            <ul className="space-y-0.5">
              {tabs.filter(t => t.group === g).map(t => {
                const on = t.id === tab;
                const count = badges[t.id];
                return (
                  <li key={t.id}>
                    <button onClick={() => setTab(t.id)} aria-current={on ? 'page' : undefined}
                      className={`group flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition cursor-pointer ${on ? 'bg-[var(--crm-accent)]/10 font-semibold text-slate-900' : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                      <t.icon className={`h-4 w-4 shrink-0 ${on ? 'text-[var(--crm-accent)]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span className="flex-1 truncate text-left">{t.label}</span>
                      {!!count && <span className="rounded-full bg-[var(--crm-accent)] px-1.5 py-px text-[10px] font-semibold tabular-nums text-white">{count}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="shrink-0 border-t border-slate-200 p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">{me.name.charAt(0).toUpperCase()}</span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-slate-900">{me.name}</div>
            <span className={`inline-block rounded px-1.5 py-px text-[10px] font-semibold ${ROLE_STYLE[me.role]}`}>{me.roleLabel}</span>
          </div>
        </div>
        <div className="mt-1 grid gap-0.5">
          {!me.legacy && <button onClick={() => setAccountOpen(true)} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"><KeyRound className="h-4 w-4 text-slate-400" /> Account & password</button>}
          <button onClick={onVisitSite} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"><ExternalLink className="h-4 w-4 text-slate-400" /> View website</button>
          <button onClick={onLogout} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"><LogOut className="h-4 w-4 text-slate-400" /> Log out</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased" style={{ ['--crm-accent' as string]: accent }}>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="CRM menu">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white shadow-xl">
            <button onClick={() => setMenuOpen(false)} className="absolute right-3 top-4 rounded-md p-1.5 text-slate-500 hover:bg-slate-100 cursor-pointer" aria-label="Close menu"><X className="h-5 w-5" /></button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button onClick={() => setMenuOpen(true)} className="-ml-1 rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer" aria-label="Open menu"><Menu className="h-5 w-5" /></button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500"><span>{current.group}</span><ChevronRight className="h-3 w-3" /><span className="truncate">{current.label}</span></div>
              <h1 className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">{current.label}</h1>
            </div>
            <button onClick={() => setSearchOpen(true)} aria-label="Search (Ctrl K)"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-500 transition hover:border-slate-300 hover:bg-white sm:w-64 sm:px-3 cursor-pointer">
              <Search className="h-4 w-4 shrink-0" />
              <span className="hidden flex-1 text-left sm:inline">Search leads or sections…</span>
              <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 text-[10px] font-medium text-slate-400 sm:inline">Ctrl K</kbd>
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
          {tab !== 'overview' && <p className="-mt-1 text-sm text-slate-500">{current.description}</p>}
          {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {notice && <div role="status" className="fixed bottom-5 right-5 z-50 rounded-lg border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">{notice}</div>}

          {tab === 'overview' && <OverviewTab api={api} flash={flash} me={me} go={goTo} modules={tabs.filter(t => t.id !== 'overview')} badges={badges} />}
          {tab === 'leaddesk' && <LeadDeskTab api={api} flash={flash} me={me} />}
          {tab === 'staff' && <StaffTab api={api} flash={flash} me={me} />}
          {tab === 'photos' && <PhotosTab api={api} flash={flash} me={me} />}
          {tab === 'franchise' && <FranchiseTab api={api} flash={flash} me={me} />}
          {tab === 'team' && <TeamTab api={api} flash={flash} />}
          {tab === 'audit' && <AuditTab api={api} flash={flash} />}
          {tab === 'crm' && <CrmTab key={intent.crmNew || 0} api={api} flash={flash} startAdding={!!intent.crmNew} />}
          {tab === 'enquiries' && <EnquiriesTab key={intent.enqQuery || ''} api={api} flash={flash} initialQuery={intent.enqQuery} />}
          {tab === 'consultations' && <ConsultationsTab api={api} flash={flash} />}
          {tab === 'payments' && <PaymentsTab api={api} flash={flash} />}
          {tab === 'opportunities' && <OpportunitiesTab api={api} flash={flash} />}
          {tab === 'blogs' && <BlogsTab api={api} flash={flash} adminToken={adminToken} />}
          {tab === 'faqs' && <FaqsTab api={api} flash={flash} />}
          {tab === 'settings' && <SettingsTab api={api} flash={flash} settings={settings} onUpdateSettings={onUpdateSettings} />}
        </main>
      </div>
      {searchOpen && <SearchPalette api={api} sections={tabs} canSearchLeads={me.perms.includes('leads')} onGo={goTo} onClose={() => setSearchOpen(false)} />}
      {accountOpen && <AccountModal api={api} onClose={() => setAccountOpen(false)} onNewToken={t => { localStorage.setItem('kips_admin_token', t); window.location.reload(); }} />}
    </div>
  );
};

// ---------------- ENQUIRIES ----------------
const EnquiriesTab: React.FC<TabProps & { initialQuery?: string }> = ({ api, flash, initialQuery = '' }) => {
  const { items, setItems, loading, reload } = useList<Enquiry>(api, '/api/enquiries');
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState('all');
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(e =>
      (status === 'all' || e.status === status) &&
      (!q || [e.fields?.name, e.fields?.email, e.fields?.phone, e.fields?.city, e.type, enquiryLabel(e).label].some(v => String(v || '').toLowerCase().includes(q)))
    );
  }, [items, query, status]);

  const update = async (id: string, patch: Partial<Enquiry>) => {
    await api(`/api/enquiries/${id}`, { method: 'PUT', body: JSON.stringify(patch) });
    setItems(list => list.map(e => (e.id === id ? { ...e, ...patch } : e)));
    flash('Saved');
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this enquiry permanently?')) return;
    await api(`/api/enquiries/${id}`, { method: 'DELETE' });
    setItems(list => list.filter(e => e.id !== id));
    flash('Deleted');
  };

  const exportCsv = () => {
    const head = ['Date', 'Type', 'Name', 'Email', 'Phone', 'City', 'State', 'Budget', 'Programme', 'Message', 'Status', 'Notes'];
    const rows = filtered.map(e => [fmtDate(e.createdAt), enquiryLabel(e).label, e.fields?.name, e.fields?.email, e.fields?.phone, e.fields?.city, e.fields?.state, e.fields?.budget, e.fields?.partnershipModel || e.fields?.courseOfInterest, e.fields?.message, e.status, e.notes]);
    const csv = [head, ...rows].map(r => r.map(csvCell).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `kinderbee-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <section className="space-y-4">
      <Toolbar title="Enquiries" count={filtered.length} onReload={reload}>
        <button onClick={exportCsv} className={btnGhost} disabled={!filtered.length}><Download className="h-4 w-4" /> CSV</button>
      </Toolbar>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input className={input} placeholder="Search name, email, phone, city…" value={query} onChange={e => setQuery(e.target.value)} />
        <select className={`${input} sm:w-48`} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      {loading ? <p className="text-sm text-slate-500">Loading…</p> : !filtered.length ? <p className="text-sm text-slate-500">No enquiries yet.</p> : (
        <div className="space-y-2">
          {filtered.map(e => (
            <div key={e.id} className={card}>
              <button className="flex w-full flex-wrap items-start justify-between gap-2 text-left" onClick={() => setOpen(open === e.id ? null : e.id)}>
                <div>
                  <div className="font-semibold">{e.fields?.name}</div>
                  <div className="text-sm text-slate-500">{e.fields?.phone} · {e.fields?.email}</div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`rounded-full px-2 py-1 font-semibold ${enquiryLabel(e).color}`}>{enquiryLabel(e).label}</span>
                  <span className={`rounded-full px-2 py-1 font-semibold ${STATUS_COLORS[e.status] || ''}`}>{stageOf(e.status).label}</span>
                  <span className="text-slate-400">{fmtDate(e.createdAt)}</span>
                </div>
              </button>

              {open === e.id && (
                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                  <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                    {Object.entries(e.fields || {}).filter(([, v]) => v !== '' && v != null).map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs uppercase tracking-wide text-slate-400">{k}</dt>
                        <dd className="break-words">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</dd>
                      </div>
                    ))}
                  </dl>
                  {e.aiSummary && <p className="rounded-lg bg-[#FFD400]/15 p-3 text-sm text-slate-700">{e.aiSummary}</p>}
                  <div className="grid gap-2 sm:grid-cols-[12rem_1fr]">
                    <select className={input} value={e.status} onChange={ev => update(e.id, { status: ev.target.value as Enquiry['status'] })}>
                      {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                    <textarea
                      className={input}
                      rows={2}
                      placeholder="Notes (saved when you click outside)"
                      defaultValue={e.notes}
                      onBlur={ev => ev.target.value !== (e.notes || '') && update(e.id, { notes: ev.target.value })}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a className={btnGhost} href={`tel:${e.fields?.phone}`}>Call</a>
                    <a className={btnGhost} href={`https://wa.me/${String(e.fields?.phone || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp</a>
                    <a className={btnGhost} href={`mailto:${e.fields?.email}`}>Email</a>
                    <button className={`${btnGhost} ml-auto text-red-600`} onClick={() => remove(e.id)}><Trash2 className="h-4 w-4" /> Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// ---------------- PAYMENTS ----------------
type PayFilter = PaymentRecord['status'] | 'all';
const PAY_FILTERS: { id: PayFilter; label: string }[] = [
  { id: 'pending_verification', label: 'Pending' },
  { id: 'verified', label: 'Verified' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'all', label: 'All' },
];

// Courses sold through the website's "Proceed to Payment" buttons (names must match FwaPage)
const ACCESS_COURSES = [
  'Advanced Diploma in Early Childhood Care & Education (ECCE)',
  'Diploma in Play school Teacher Training',
  'Certificate in Nordic inspired Preschool Teaching',
  'Foundational Stage Curriculum Design',
];

// Message emailed automatically when a course payment is verified (class link, login, WhatsApp group…)
const CourseAccessEditor: React.FC<TabProps> = ({ api, flash }) => {
  const [msgs, setMsgs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  useEffect(() => { api('/api/course-access').then(m => setMsgs(m || {})).catch(() => {}); }, []);
  const save = async () => {
    setBusy(true);
    try { await api('/api/course-access', { method: 'PUT', body: JSON.stringify(msgs) }); flash('Access messages saved'); } finally { setBusy(false); }
  };
  const missing = ACCESS_COURSES.filter(c => !msgs[c] && !msgs.default).length;
  return (
    <details className={card} open={missing > 0 || undefined}>
      <summary className="cursor-pointer select-none font-semibold">
        Course access emails {missing > 0 ? <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">{missing} course(s) not set</span> : <span className="ml-1 text-xs font-normal text-slate-500">sent automatically when you verify a payment</span>}
      </summary>
      <div className="mt-3 space-y-3">
        <p className="text-xs text-slate-500">When you click <strong>Verify</strong>, the student is emailed a payment confirmation plus the message below for their course: a class link, login details, WhatsApp group link or joining instructions. Links become clickable. Only admins can see these.</p>
        {[...ACCESS_COURSES, 'default'].map(c => (
          <Field key={c} label={c === 'default' ? 'Default (any other course)' : c}>
            <textarea className={input} rows={2} value={msgs[c] || ''} onChange={e => setMsgs(m => ({ ...m, [c]: e.target.value }))}
              placeholder={c === 'default' ? 'Used when a course has no message of its own' : 'e.g. Join your batch WhatsApp group: https://chat.whatsapp.com/… Classes start every Monday 7 PM.'} />
          </Field>
        ))}
        <button onClick={save} disabled={busy} className={btnPrimary}>{busy ? 'Saving…' : 'Save access messages'}</button>
      </div>
    </details>
  );
};

const PaymentsTab: React.FC<TabProps> = ({ api, flash }) => {
  const { items, setItems, loading, reload } = useList<PaymentRecord>(api, '/api/payments');
  // What happened to the access email after each verification, shown on the payment card
  const [accessNote, setAccessNote] = useState<Record<string, string>>({});
  // Enquiries are loaded too so each payment can be matched to its lead (CRM groundwork)
  const { items: leads } = useList<Enquiry>(api, '/api/enquiries');
  const [filter, setFilter] = useState<PayFilter>('pending_verification');
  const [query, setQuery] = useState('');

  const leadFor = useMemo(() => {
    const byPhone = new Map<string, Enquiry>();
    const byEmail = new Map<string, Enquiry>();
    leads.forEach(l => {
      if (l.fields?.phone) byPhone.set(phoneKey(l.fields.phone), l);
      if (l.fields?.email) byEmail.set(String(l.fields.email).toLowerCase(), l);
    });
    return (p: PaymentRecord) => byPhone.get(phoneKey(p.payerPhone)) || byEmail.get(String(p.payerEmail || '').toLowerCase());
  }, [leads]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    items.forEach(p => { c[p.status] = (c[p.status] || 0) + 1; });
    return c;
  }, [items]);

  const shown = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(p =>
      (filter === 'all' || p.status === filter) &&
      (!q || [p.applicantName, p.payerPhone, p.payerEmail, p.upiRefNumber, p.programme].some(v => String(v || '').toLowerCase().includes(q)))
    );
  }, [items, filter, query]);

  const setStatus = async (p: PaymentRecord, status: PaymentRecord['status']) => {
    if (status === 'rejected' && !confirm(`Reject payment ${p.upiRefNumber} from ${p.applicantName}?`)) return;
    const r = await api(`/api/payments/${p.id}`, { method: 'PUT', body: JSON.stringify({ status }) });
    if (r.access) setAccessNote(n => ({ ...n, [p.id]: r.access }));
    setItems(list => list.map(x => (x.id === p.id ? { ...x, status, verifiedAt: status === 'pending_verification' ? '' : new Date().toISOString() } : x)));
    flash(status === 'verified' ? 'Payment verified' : status === 'rejected' ? 'Payment rejected' : 'Moved back to pending');
  };

  const exportCsv = () => {
    const head = ['Submitted', 'Payment date', 'Name', 'Mobile', 'Email', 'Programme', 'Amount', 'UTR', 'Status', 'Verified at', 'Matched lead'];
    const rows = shown.map(p => [fmtDate(p.createdAt), p.paymentDate, p.applicantName, p.payerPhone, p.payerEmail, p.programme, p.amount, p.upiRefNumber, p.status, fmtDate(p.verifiedAt), leadFor(p)?.fields?.name || '']);
    const csv = [head, ...rows].map(r => r.map(csvCell).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `kinderbee-payments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <section className="space-y-4">
      <Toolbar title="Payments" count={shown.length} onReload={reload}>
        <button onClick={exportCsv} className={btnGhost} disabled={!shown.length}><Download className="h-4 w-4" /> CSV</button>
      </Toolbar>

      <div className="flex flex-wrap gap-2">
        {PAY_FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${filter === f.id ? 'bg-[var(--crm-accent)] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
          >
            {f.label} <span className="opacity-70">({counts[f.id] || 0})</span>
          </button>
        ))}
      </div>
      <input className={input} placeholder="Search name, mobile, email, UTR, programme…" value={query} onChange={e => setQuery(e.target.value)} />

      <CourseAccessEditor api={api} flash={flash} />

      <p className="text-xs text-slate-500">
        Check each UTR against the bank / UPI statement for the same amount before marking it verified. Verifying a course payment emails the student their access automatically.
      </p>

      {loading ? <p className="text-sm text-slate-500">Loading…</p> : !shown.length ? <p className="text-sm text-slate-500">No payments here.</p> : (
        <div className="space-y-2">
          {shown.map(p => {
            const lead = leadFor(p);
            return (
              <div key={p.id} className={`${card} space-y-3`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-base font-semibold">{p.applicantName} <span className="font-normal text-slate-500">· ₹{Number(p.amount).toLocaleString('en-IN')}</span></div>
                    <div className="text-sm text-slate-600">{p.programme}</div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[p.status] || ''}`}>
                    {p.status === 'pending_verification' ? 'pending' : p.status}
                  </span>
                </div>

                <dl className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">UTR</dt><dd className="font-mono text-slate-900 select-all">{p.upiRefNumber}</dd></div>
                  <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Paid on</dt><dd>{p.paymentDate || '—'}</dd></div>
                  <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Submitted</dt><dd>{fmtDate(p.createdAt)}</dd></div>
                  <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Mobile</dt><dd><a className="text-[var(--crm-accent)]" href={`tel:${p.payerPhone}`}>{p.payerPhone}</a></dd></div>
                  <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Email</dt><dd className="break-all">{p.payerEmail || '—'}</dd></div>
                  {p.admissionNumber && <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Admission no.</dt><dd>{p.admissionNumber}</dd></div>}
                </dl>

                {p.notes && <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">Payer note: {p.notes}</p>}

                <div className="text-xs">
                  {lead ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 font-semibold text-sky-700">
                      Lead: {lead.fields?.name} · {lead.type} · {lead.status}
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-500">No matching enquiry</span>
                  )}
                  {p.verifiedAt && p.status !== 'pending_verification' && <span className="ml-2 text-slate-400">{p.status === 'verified' ? 'Verified' : 'Rejected'} {fmtDate(p.verifiedAt)}</span>}
                </div>

                {accessNote[p.id] && (
                  <p className={`rounded-lg px-3 py-2 text-xs font-semibold ${/^Access email sent/.test(accessNote[p.id]) ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>{accessNote[p.id]}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  {p.status !== 'verified' && (
                    <button className={`${btn} bg-emerald-600 text-white hover:bg-emerald-700`} onClick={() => setStatus(p, 'verified')}>Verify</button>
                  )}
                  {p.status !== 'rejected' && (
                    <button className={`${btnGhost} text-red-600`} onClick={() => setStatus(p, 'rejected')}>Reject</button>
                  )}
                  {p.status !== 'pending_verification' && (
                    <button className={btnGhost} onClick={() => setStatus(p, 'pending_verification')}>Back to pending</button>
                  )}
                  <a className={`${btnGhost} ml-auto`} href={`https://wa.me/91${phoneKey(p.payerPhone)}`} target="_blank" rel="noreferrer">WhatsApp</a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

// ---------------- BLOGS ----------------
const EMPTY_BLOG: Partial<BlogPost> = { title: '', slug: '', category: '', status: 'Published', excerpt: '', content: '', image: '', author: 'Kinderbee Team', readTime: '5 min read', metaTitle: '', metaDescription: '' };

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result).split(',')[1]);
  r.onerror = reject;
  r.readAsDataURL(file);
});

const BlogsTab: React.FC<TabProps & { adminToken: string }> = ({ api, flash }) => {
  const { items, loading, reload } = useList<BlogPost>(api, '/api/blogs');
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (k: keyof BlogPost, v: any) => setEditing(b => ({ ...b, [k]: v }));

  const save = async () => {
    if (!editing?.title) return alert('Title is required');
    setBusy(true);
    try {
      const body = { ...editing, slug: editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') };
      await api(editing.id ? `/api/blogs/${editing.id}` : '/api/blogs', { method: editing.id ? 'PUT' : 'POST', body: JSON.stringify(body) });
      setEditing(null);
      reload();
      flash('Blog saved');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (b: BlogPost) => {
    if (!confirm(`Delete "${b.title}"?`)) return;
    await api(`/api/blogs/${b.id}`, { method: 'DELETE' });
    reload();
    flash('Blog deleted');
  };

  const upload = async (file?: File) => {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) return alert('Please use an image under 3 MB.');
    setBusy(true);
    try {
      const { url } = await api('/api/upload', { method: 'POST', body: JSON.stringify({ name: file.name, contentType: file.type, dataBase64: await toBase64(file) }) });
      set('image', url);
    } finally {
      setBusy(false);
    }
  };

  if (editing) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">{editing.id ? 'Edit blog' : 'New blog'}</h2>
        <div className={`${card} grid gap-4 sm:grid-cols-2`}>
          <Field label="Title" full><input className={input} value={editing.title || ''} onChange={e => set('title', e.target.value)} /></Field>
          <Field label="Category"><input className={input} value={editing.category || ''} onChange={e => set('category', e.target.value)} /></Field>
          <Field label="Status">
            <select className={input} value={editing.status || 'Published'} onChange={e => set('status', e.target.value)}>
              <option>Published</option><option>Draft</option>
            </select>
          </Field>
          <Field label="Author"><input className={input} value={editing.author || ''} onChange={e => set('author', e.target.value)} /></Field>
          <Field label="Read time"><input className={input} value={editing.readTime || ''} onChange={e => set('readTime', e.target.value)} /></Field>
          <Field label="Featured image" full>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input className={input} placeholder="Image URL" value={editing.image || ''} onChange={e => set('image', e.target.value)} />
              <label className={`${btnGhost} shrink-0 cursor-pointer`}>
                <Upload className="h-4 w-4" /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={e => upload(e.target.files?.[0])} />
              </label>
            </div>
            {editing.image && <img src={editing.image} alt="" className="mt-2 h-32 rounded-lg object-cover" />}
          </Field>
          <Field label="Short summary (shown on blog cards)" full><textarea className={input} rows={2} value={editing.excerpt || ''} onChange={e => set('excerpt', e.target.value)} /></Field>
          <Field label="Content (Markdown: ## heading, **bold**, - list)" full><textarea className={`${input} font-mono`} rows={16} value={editing.content || ''} onChange={e => set('content', e.target.value)} /></Field>
          <Field label="SEO title"><input className={input} value={editing.metaTitle || ''} onChange={e => set('metaTitle', e.target.value)} /></Field>
          <Field label="URL slug"><input className={input} placeholder="auto from title" value={editing.slug || ''} onChange={e => set('slug', e.target.value)} /></Field>
          <Field label="SEO description" full><textarea className={input} rows={2} value={editing.metaDescription || ''} onChange={e => set('metaDescription', e.target.value)} /></Field>
        </div>
        <div className="flex gap-2">
          <button className={btnPrimary} onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save blog'}</button>
          <button className={btnGhost} onClick={() => setEditing(null)} disabled={busy}>Cancel</button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <Toolbar title="Blogs" count={items.length} onReload={reload}>
        <button className={btnPrimary} onClick={() => setEditing({ ...EMPTY_BLOG })}><Plus className="h-4 w-4" /> New blog</button>
      </Toolbar>
      {loading ? <p className="text-sm text-slate-500">Loading…</p> : (
        <div className="space-y-2">
          {items.map(b => (
            <div key={b.id} className={`${card} flex items-center gap-4`}>
              {b.image && <img src={b.image} alt="" className="hidden h-16 w-24 shrink-0 rounded-lg object-cover sm:block" />}
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{b.title}</div>
                <div className="text-sm text-slate-500">{b.category} · {b.date} · {b.views || 0} views {b.status && b.status !== 'Published' && <span className="ml-1 rounded bg-slate-100 px-1.5 text-xs">{b.status}</span>}</div>
              </div>
              <button className={btnGhost} onClick={() => setEditing(b)}>Edit</button>
              <button className={`${btnGhost} text-red-600`} onClick={() => remove(b)} aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// ---------------- FAQS ----------------
const FaqsTab: React.FC<TabProps> = ({ api, flash }) => {
  const { items, loading, reload } = useList<FAQItem>(api, '/api/faqs');
  const [editing, setEditing] = useState<Partial<FAQItem> | null>(null);

  const save = async () => {
    if (!editing?.question || !editing.answer) return alert('Question and answer are required');
    const body = { ...editing, section: editing.section || 'home' };
    await api(editing.id ? `/api/faqs/${editing.id}` : '/api/faqs', { method: editing.id ? 'PUT' : 'POST', body: JSON.stringify(body) });
    setEditing(null);
    reload();
    flash('FAQ saved');
  };

  const remove = async (f: FAQItem) => {
    if (!confirm('Delete this FAQ?')) return;
    await api(`/api/faqs/${f.id}`, { method: 'DELETE' });
    reload();
    flash('FAQ deleted');
  };

  return (
    <section className="space-y-4">
      <Toolbar title="FAQs" count={items.length} onReload={reload}>
        <button className={btnPrimary} onClick={() => setEditing({ question: '', answer: '', section: 'home' })}><Plus className="h-4 w-4" /> New FAQ</button>
      </Toolbar>

      {editing && (
        <div className={`${card} space-y-3 border-[var(--crm-accent)]/40`}>
          <Field label="Question"><input className={input} value={editing.question || ''} onChange={e => setEditing({ ...editing, question: e.target.value })} /></Field>
          <Field label="Answer"><textarea className={input} rows={4} value={editing.answer || ''} onChange={e => setEditing({ ...editing, answer: e.target.value })} /></Field>
          <div className="flex gap-2">
            <button className={btnPrimary} onClick={save}>Save FAQ</button>
            <button className={btnGhost} onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-sm text-slate-500">Loading…</p> : (
        <div className="space-y-2">
          {items.map(f => (
            <div key={f.id} className={`${card} flex items-start gap-3`}>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{f.question}</div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{f.answer}</p>
              </div>
              <button className={btnGhost} onClick={() => setEditing(f)}>Edit</button>
              <button className={`${btnGhost} text-red-600`} onClick={() => remove(f)} aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// ---------------- SETTINGS ----------------
type SettingField = [keyof SystemSettings, string, ('text' | 'textarea' | 'checkbox' | 'number' | 'color')?];

const SETTING_GROUPS: { title: string; fields: SettingField[] }[] = [
  { title: 'CRM branding', fields: [['crmName', 'CRM name (shown in the sidebar)'], ['crmAccent', 'Brand colour', 'color']] },
  { title: 'Contact details', fields: [['phone', 'Phone'], ['whatsappNumber', 'WhatsApp number'], ['email', 'Email'], ['workingHours', 'Working hours'], ['officeAddress', 'Office address', 'textarea']] },
  { title: 'Social links', fields: [['facebookUrl', 'Facebook URL'], ['instagramUrl', 'Instagram URL'], ['linkedinUrl', 'LinkedIn URL']] },
  { title: 'Logo & footer', fields: [['logoUrl', 'Logo image URL'], ['logoText', 'Logo text'], ['logoSubtext', 'Logo subtext'], ['footerCopyright', 'Footer copyright'], ['footerTagline', 'Footer tagline', 'textarea']] },
  { title: 'Enquiry popup', fields: [['popupEnabled', 'Show popup', 'checkbox'], ['popupDelay', 'Delay (seconds)', 'number'], ['popupTag', 'Small tag'], ['popupTitle', 'Title'], ['popupSubtitle', 'Subtitle', 'textarea'], ['popupImageUrl', 'Image URL']] },
  { title: 'Page headings', fields: [['homeHeroH1', 'Home heading'], ['homeHeroH2', 'Home subheading'], ['homeHeroSubtitle', 'Home intro', 'textarea'], ['aboutHeroH1', 'About heading'], ['aboutHeroSubtitle', 'About intro', 'textarea'], ['franchiseHeroH1', 'Franchise heading'], ['franchiseHeroSubtitle', 'Franchise intro', 'textarea'], ['fwaHeroH1', 'FWA heading'], ['fwaHeroSubtitle', 'FWA intro', 'textarea'], ['blogsHeroH1', 'Blogs heading'], ['blogsHeroSubtitle', 'Blogs intro', 'textarea'], ['contactHeroH1', 'Contact heading'], ['contactHeroSubtitle', 'Contact intro', 'textarea']] },
  { title: 'SEO', fields: [['metaTitle', 'Site title'], ['metaDescription', 'Site description', 'textarea'], ['metaKeywords', 'Keywords']] },
];

const SettingsTab: React.FC<TabProps & { settings: SystemSettings | null; onUpdateSettings: (s: SystemSettings) => void }> = ({ api, flash, settings, onUpdateSettings }) => {
  const [form, setForm] = useState<Partial<SystemSettings>>(settings || {});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('/api/settings').then(s => setForm(s || {})).catch(() => {});
  }, []);

  const save = async () => {
    setBusy(true);
    try {
      const { settings: saved } = await api('/api/settings', { method: 'PUT', body: JSON.stringify(form) });
      onUpdateSettings(saved);
      flash('Settings saved');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">Changes apply to the website and the CRM once saved.</p>
        <button className={`${btnPrimary} shrink-0 whitespace-nowrap`} onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</button>
      </div>
      {SETTING_GROUPS.map(g => (
        <div key={g.title} className={card}>
          <h2 className="mb-3 font-semibold">{g.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {g.fields.map(([key, label, type = 'text']) => (
              <Field key={key} label={label} full={type === 'textarea'}>
                {type === 'textarea' ? (
                  <textarea className={input} rows={2} value={String(form[key] ?? '')} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                ) : type === 'color' ? (
                  <span className="flex items-center gap-2">
                    <input type="color" aria-label={label} className="h-9 w-12 cursor-pointer rounded-md border border-slate-300 bg-white p-1" value={String(form[key] || '#E1007A')} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                    <input className={input} value={String(form[key] ?? '')} placeholder="#E1007A" onChange={e => setForm({ ...form, [key]: e.target.value })} />
                  </span>
                ) : type === 'checkbox' ? (
                  <input type="checkbox" className="h-5 w-5 accent-[var(--crm-accent)]" checked={!!form[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })} />
                ) : (
                  <input className={input} type={type} value={String(form[key] ?? '')} onChange={e => setForm({ ...form, [key]: type === 'number' ? Number(e.target.value) : e.target.value })} />
                )}
              </Field>
            ))}
          </div>
        </div>
      ))}
      <button className={btnPrimary} onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</button>
    </section>
  );
};
