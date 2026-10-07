import React, { useEffect, useMemo, useState } from 'react';
import { Users, Inbox, CreditCard, FileText, HelpCircle, Settings as SettingsIcon, LogOut, ExternalLink, Trash2, Plus, Download, Upload, RefreshCw } from 'lucide-react';
import type { Enquiry, PaymentRecord, BlogPost, FAQItem, SystemSettings } from '../types';
import { input, btn, btnPrimary, btnGhost, card, fmtDate, csvCell, phoneKey, STAGES, stageOf, STATUS_COLORS, useList, Toolbar, Field, type Api, type TabProps } from './admin/ui';
import { CrmTab } from './admin/Crm';

interface AdminPanelProps {
  adminToken: string;
  onLogout: () => void;
  onVisitSite: () => void;
  settings: SystemSettings | null;
  onUpdateSettings: (s: SystemSettings) => void;
}

type Tab = 'crm' | 'enquiries' | 'payments' | 'blogs' | 'faqs' | 'settings';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'crm', label: 'CRM', icon: Users },
  { id: 'enquiries', label: 'Enquiries', icon: Inbox },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'blogs', label: 'Blogs', icon: FileText },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ adminToken, onLogout, onVisitSite, settings, onUpdateSettings }) => {
  const [tab, setTab] = useState<Tab>('crm');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

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

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="font-display text-lg font-bold">
            Kinderbee <span className="text-[#E1007A]">Admin</span>
          </div>
          <div className="flex gap-2">
            <button onClick={onVisitSite} className={btnGhost}><ExternalLink className="h-4 w-4" /> <span className="hidden sm:inline">View site</span></button>
            <button onClick={onLogout} className={btnGhost}><LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Log out</span></button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-semibold transition ${tab === t.id ? 'border-[#E1007A] text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className={`mx-auto space-y-4 px-4 py-6 ${tab === 'crm' ? 'max-w-7xl' : 'max-w-6xl'}`}>
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {notice && <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{notice}</div>}

        {tab === 'crm' && <CrmTab api={api} flash={flash} />}
        {tab === 'enquiries' && <EnquiriesTab api={api} flash={flash} />}
        {tab === 'payments' && <PaymentsTab api={api} flash={flash} />}
        {tab === 'blogs' && <BlogsTab api={api} flash={flash} adminToken={adminToken} />}
        {tab === 'faqs' && <FaqsTab api={api} flash={flash} />}
        {tab === 'settings' && <SettingsTab api={api} flash={flash} settings={settings} onUpdateSettings={onUpdateSettings} />}
      </main>
    </div>
  );
};

// ---------------- ENQUIRIES ----------------
const EnquiriesTab: React.FC<TabProps> = ({ api, flash }) => {
  const { items, setItems, loading, reload } = useList<Enquiry>(api, '/api/enquiries');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(e =>
      (status === 'all' || e.status === status) &&
      (!q || [e.fields?.name, e.fields?.email, e.fields?.phone, e.fields?.city, e.type].some(v => String(v || '').toLowerCase().includes(q)))
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
    const rows = filtered.map(e => [fmtDate(e.createdAt), e.type, e.fields?.name, e.fields?.email, e.fields?.phone, e.fields?.city, e.fields?.state, e.fields?.budget, e.fields?.partnershipModel || e.fields?.courseOfInterest, e.fields?.message, e.status, e.notes]);
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

      {loading ? <p className="text-sm text-stone-500">Loading…</p> : !filtered.length ? <p className="text-sm text-stone-500">No enquiries yet.</p> : (
        <div className="space-y-2">
          {filtered.map(e => (
            <div key={e.id} className={card}>
              <button className="flex w-full flex-wrap items-start justify-between gap-2 text-left" onClick={() => setOpen(open === e.id ? null : e.id)}>
                <div>
                  <div className="font-semibold">{e.fields?.name}</div>
                  <div className="text-sm text-stone-500">{e.fields?.phone} · {e.fields?.email}</div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-stone-100 px-2 py-1 text-stone-600">{e.type}</span>
                  <span className={`rounded-full px-2 py-1 font-semibold ${STATUS_COLORS[e.status] || ''}`}>{stageOf(e.status).label}</span>
                  <span className="text-stone-400">{fmtDate(e.createdAt)}</span>
                </div>
              </button>

              {open === e.id && (
                <div className="mt-4 space-y-3 border-t border-stone-100 pt-4">
                  <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                    {Object.entries(e.fields || {}).filter(([, v]) => v !== '' && v != null).map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs uppercase tracking-wide text-stone-400">{k}</dt>
                        <dd className="break-words">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</dd>
                      </div>
                    ))}
                  </dl>
                  {e.aiSummary && <p className="rounded-lg bg-[#FFD400]/15 p-3 text-sm text-stone-700">{e.aiSummary}</p>}
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

const PaymentsTab: React.FC<TabProps> = ({ api, flash }) => {
  const { items, setItems, loading, reload } = useList<PaymentRecord>(api, '/api/payments');
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
    await api(`/api/payments/${p.id}`, { method: 'PUT', body: JSON.stringify({ status }) });
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
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${filter === f.id ? 'bg-[#E1007A] text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'}`}
          >
            {f.label} <span className="opacity-70">({counts[f.id] || 0})</span>
          </button>
        ))}
      </div>
      <input className={input} placeholder="Search name, mobile, email, UTR, programme…" value={query} onChange={e => setQuery(e.target.value)} />

      <p className="text-xs text-stone-500">
        Check each UTR against the bank / UPI statement for the same amount before marking it verified.
      </p>

      {loading ? <p className="text-sm text-stone-500">Loading…</p> : !shown.length ? <p className="text-sm text-stone-500">No payments here.</p> : (
        <div className="space-y-2">
          {shown.map(p => {
            const lead = leadFor(p);
            return (
              <div key={p.id} className={`${card} space-y-3`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-base font-semibold">{p.applicantName} <span className="font-normal text-stone-500">· ₹{Number(p.amount).toLocaleString('en-IN')}</span></div>
                    <div className="text-sm text-stone-600">{p.programme}</div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[p.status] || ''}`}>
                    {p.status === 'pending_verification' ? 'pending' : p.status}
                  </span>
                </div>

                <dl className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <div><dt className="text-[11px] uppercase tracking-wide text-stone-400">UTR</dt><dd className="font-mono text-stone-900 select-all">{p.upiRefNumber}</dd></div>
                  <div><dt className="text-[11px] uppercase tracking-wide text-stone-400">Paid on</dt><dd>{p.paymentDate || '—'}</dd></div>
                  <div><dt className="text-[11px] uppercase tracking-wide text-stone-400">Submitted</dt><dd>{fmtDate(p.createdAt)}</dd></div>
                  <div><dt className="text-[11px] uppercase tracking-wide text-stone-400">Mobile</dt><dd><a className="text-[#E1007A]" href={`tel:${p.payerPhone}`}>{p.payerPhone}</a></dd></div>
                  <div><dt className="text-[11px] uppercase tracking-wide text-stone-400">Email</dt><dd className="break-all">{p.payerEmail || '—'}</dd></div>
                  {p.admissionNumber && <div><dt className="text-[11px] uppercase tracking-wide text-stone-400">Admission no.</dt><dd>{p.admissionNumber}</dd></div>}
                </dl>

                {p.notes && <p className="rounded-lg bg-stone-50 px-3 py-2 text-xs text-stone-600">Payer note: {p.notes}</p>}

                <div className="text-xs">
                  {lead ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 font-semibold text-sky-700">
                      Lead: {lead.fields?.name} · {lead.type} · {lead.status}
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-1 font-semibold text-stone-500">No matching enquiry</span>
                  )}
                  {p.verifiedAt && p.status !== 'pending_verification' && <span className="ml-2 text-stone-400">{p.status === 'verified' ? 'Verified' : 'Rejected'} {fmtDate(p.verifiedAt)}</span>}
                </div>

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
        <h1 className="font-display text-2xl font-bold">{editing.id ? 'Edit blog' : 'New blog'}</h1>
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
      {loading ? <p className="text-sm text-stone-500">Loading…</p> : (
        <div className="space-y-2">
          {items.map(b => (
            <div key={b.id} className={`${card} flex items-center gap-4`}>
              {b.image && <img src={b.image} alt="" className="hidden h-16 w-24 shrink-0 rounded-lg object-cover sm:block" />}
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{b.title}</div>
                <div className="text-sm text-stone-500">{b.category} · {b.date} · {b.views || 0} views {b.status && b.status !== 'Published' && <span className="ml-1 rounded bg-stone-100 px-1.5 text-xs">{b.status}</span>}</div>
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
        <div className={`${card} space-y-3 border-[#E1007A]/40`}>
          <Field label="Question"><input className={input} value={editing.question || ''} onChange={e => setEditing({ ...editing, question: e.target.value })} /></Field>
          <Field label="Answer"><textarea className={input} rows={4} value={editing.answer || ''} onChange={e => setEditing({ ...editing, answer: e.target.value })} /></Field>
          <div className="flex gap-2">
            <button className={btnPrimary} onClick={save}>Save FAQ</button>
            <button className={btnGhost} onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-sm text-stone-500">Loading…</p> : (
        <div className="space-y-2">
          {items.map(f => (
            <div key={f.id} className={`${card} flex items-start gap-3`}>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{f.question}</div>
                <p className="mt-1 line-clamp-2 text-sm text-stone-600">{f.answer}</p>
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
type SettingField = [keyof SystemSettings, string, ('text' | 'textarea' | 'checkbox' | 'number')?];

const SETTING_GROUPS: { title: string; fields: SettingField[] }[] = [
  { title: 'Contact details', fields: [['phone', 'Phone'], ['whatsappNumber', 'WhatsApp number'], ['email', 'Email'], ['workingHours', 'Working hours'], ['officeAddress', 'Office address', 'textarea']] },
  { title: 'Social links', fields: [['facebookUrl', 'Facebook URL'], ['instagramUrl', 'Instagram URL'], ['linkedinUrl', 'LinkedIn URL']] },
  { title: 'Logo & footer', fields: [['logoUrl', 'Logo image URL'], ['logoText', 'Logo text'], ['logoSubtext', 'Logo subtext'], ['footerCopyright', 'Footer copyright'], ['footerTagline', 'Footer tagline', 'textarea']] },
  { title: 'Enquiry popup', fields: [['popupEnabled', 'Show popup', 'checkbox'], ['popupDelay', 'Delay (seconds)', 'number'], ['popupTag', 'Small tag'], ['popupTitle', 'Title'], ['popupSubtitle', 'Subtitle', 'textarea'], ['popupImageUrl', 'Image URL']] },
  { title: 'Page headings', fields: [['homeHeroH1', 'Home heading'], ['homeHeroH2', 'Home subheading'], ['homeHeroSubtitle', 'Home intro', 'textarea'], ['aboutHeroH1', 'About heading'], ['aboutHeroSubtitle', 'About intro', 'textarea'], ['franchiseHeroH1', 'Franchise heading'], ['franchiseHeroSubtitle', 'Franchise intro', 'textarea'], ['fwaHeroH1', 'FWA heading'], ['fwaHeroSubtitle', 'FWA intro', 'textarea'], ['blogsHeroH1', 'Blogs heading'], ['blogsHeroSubtitle', 'Blogs intro', 'textarea'], ['contactHeroH1', 'Contact heading'], ['contactHeroSubtitle', 'Contact intro', 'textarea']] },
  { title: 'SEO', fields: [['metaTitle', 'Site title'], ['metaDescription', 'Site description', 'textarea'], ['metaKeywords', 'Keywords'], ['googleAnalyticsId', 'Google Analytics ID']] },
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
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <button className={btnPrimary} onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</button>
      </div>
      {SETTING_GROUPS.map(g => (
        <div key={g.title} className={card}>
          <h2 className="mb-3 font-semibold">{g.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {g.fields.map(([key, label, type = 'text']) => (
              <Field key={key} label={label} full={type === 'textarea'}>
                {type === 'textarea' ? (
                  <textarea className={input} rows={2} value={String(form[key] ?? '')} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                ) : type === 'checkbox' ? (
                  <input type="checkbox" className="h-5 w-5 accent-[#E1007A]" checked={!!form[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })} />
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
