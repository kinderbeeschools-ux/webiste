import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Phone, MessageCircle, Copy, History, UserPlus, FileSpreadsheet, RefreshCw, Upload, Search, PhoneCall, CalendarClock, Flame, Users } from 'lucide-react';
import type { Enquiry } from '../types';
import { stageOf, STATUS_COLORS, isOpenStage, todayISO, phoneKey, fmtDate, type Api } from './admin/ui';
import type { Me } from './admin/portal/common';
import { CALL_OUTCOMES, outcomeOf, type Outcome } from '../data/telesales';

// Call desk for the telesales team: Meta-ads leads (from a Google Sheet) in, one-tap call outcomes out.
// Same API and login as the rest of /desk; a call is saved through POST /api/crm/call.

const field = 'w-full rounded-xl border border-white/80 bg-white/70 backdrop-blur-md px-3.5 py-2.5 text-sm text-[#191919] placeholder:text-stone-400 transition focus:border-[#E90078] focus:outline-none focus:ring-4 focus:ring-[#E90078]/10';
const pill = (on: boolean) => `inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${on ? 'bg-[#191919] text-white shadow-sm' : 'bg-white/60 backdrop-blur-md text-stone-600 ring-1 ring-white/80 shadow-sm hover:text-[#E90078]'}`;
const btn = 'inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition cursor-pointer active:scale-[0.97] disabled:opacity-50';
const ghost = `${btn} bg-white/65 text-stone-700 ring-1 ring-black/[0.06] shadow-sm hover:bg-white`;
const card = 'desk-glass desk-sheen rounded-2xl';

const addDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
const defaultDay: Record<string, number> = { interested: 2, visit: 1, callback: 1, no_answer: 1 };
const ago = (iso?: string) => { const m = Math.floor((Date.now() - new Date(iso || 0).getTime()) / 6e4); return m < 60 ? `${Math.max(m, 1)}m ago` : m < 1440 ? `${Math.floor(m / 60)}h ago` : `${Math.floor(m / 1440)}d ago`; };
type Queue = 'queue' | 'due' | 'pool' | 'mine' | 'all' | 'done';
interface SheetCfg { url?: string; autoAssign?: boolean; lastSync?: string; lastResult?: string }

interface Props { items: Enquiry[]; setItems: React.Dispatch<React.SetStateAction<Enquiry[]>>; api: Api; flash: (m: string) => void; me: Me; reload: () => void }

export const TelesalesDesk: React.FC<Props> = ({ items, setItems, api, flash, me, reload }) => {
  const [queue, setQueue] = useState<Queue>('queue');
  const [q, setQ] = useState('');
  const [openImport, setOpenImport] = useState(false);
  const today = todayISO();
  const manager = me.role === 'ceo' || me.role === 'admin';
  const A = (e: Enquiry) => (e.fields as any)?.assignedTo as string | undefined;
  const mine = (e: Enquiry) => A(e) === me.id;
  const due = (e: Enquiry) => !!e.nextFollowUp && e.nextFollowUp <= today;

  const lists = useMemo(() => {
    const open = items.filter(e => isOpenStage(e.status));
    const fresh = (e: Enquiry) => !(e.touchCount || 0);
    const byDue = (a: Enquiry, b: Enquiry) => (a.nextFollowUp || '9') < (b.nextFollowUp || '9') ? -1 : (a.nextFollowUp || '9') > (b.nextFollowUp || '9') ? 1 : +new Date(b.createdAt) - +new Date(a.createdAt);
    const l: Record<Queue, Enquiry[]> = {
      queue: open.filter(e => mine(e) && (due(e) || fresh(e))).sort(byDue),
      due: open.filter(e => mine(e) && due(e)).sort(byDue),
      pool: open.filter(e => !A(e) && fresh(e)),
      mine: open.filter(mine).sort(byDue),
      all: open,
      done: items.filter(e => !isOpenStage(e.status) && mine(e)),
    };
    return l;
  }, [items, me.id, today]);

  const stat = useMemo(() => {
    const day = (iso?: string) => (iso || '').slice(0, 10);
    const todays = items.filter(e => (e.fields as any)?.lastCallById === me.id && day((e.fields as any)?.lastCallAt) === today);
    const connected = todays.filter(e => outcomeOf((e.fields as any)?.lastOutcome)?.connected);
    return { calls: todays.length, connected: connected.length, hot: items.filter(e => mine(e) && ['interested', 'visit'].includes(e.status)).length };
  }, [items, me.id, today]);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return lists[queue].filter(e => !s || [e.fields?.name, e.fields?.phone, e.fields?.city, (e.fields as any)?.campaign].some(v => String(v || '').toLowerCase().includes(s)));
  }, [lists, queue, q]);

  const patchLocal = (id: string, p: Partial<Omit<Enquiry, 'fields'>> & { fields?: any }) => setItems(l => l.map(x => (x.id === id ? { ...x, ...p, fields: { ...x.fields, ...(p.fields || {}) } } : x)));
  const take = async (e: Enquiry) => {
    const patch = { assignedTo: me.id, assignedToName: me.name };
    await api(`/api/enquiries/${e.id}`, { method: 'PUT', body: JSON.stringify({ fields: patch }) });
    patchLocal(e.id, { fields: patch }); flash(`${e.fields?.name} is on your list`);
  };

  const chips: { id: Queue; text: string; n: number; hide?: boolean }[] = [
    { id: 'queue', text: 'My call queue', n: lists.queue.length },
    { id: 'due', text: 'Follow-ups due', n: lists.due.length },
    { id: 'pool', text: 'Unassigned', n: lists.pool.length },
    { id: 'mine', text: 'All mine', n: lists.mine.length },
    { id: 'all', text: 'Everyone’s open', n: lists.all.length },
    { id: 'done', text: 'Closed', n: lists.done.length },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { t: 'To call now', v: lists.queue.length, s: `${lists.due.length} follow-ups due`, icon: PhoneCall, c: '#E90078' },
          { t: 'Calls today', v: stat.calls, s: 'by you', icon: Phone, c: '#7800B9' },
          { t: 'Connected today', v: stat.connected, s: stat.calls ? `${Math.round((stat.connected / stat.calls) * 100)}% pick-up` : 'no calls yet', icon: CalendarClock, c: '#059669' },
          { t: 'Hot leads', v: stat.hot, s: 'interested or visit booked', icon: Flame, c: '#C9A000' },
        ].map(x => (
          <div key={x.t} className={`${card} p-4`}>
            <div className="flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">{x.t}</p><x.icon className="h-4 w-4" style={{ color: x.c }} /></div>
            <p className="mt-2 text-3xl font-extrabold tabular-nums" style={{ color: x.c }}>{x.v}</p>
            <p className="text-xs text-stone-500">{x.s}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {chips.map(c => (
          <button key={c.id} className={pill(queue === c.id)} onClick={() => setQueue(c.id)}>
            {c.text}<span className={`rounded-full px-1.5 text-[11px] tabular-nums ${queue === c.id ? 'bg-white/20' : 'bg-black/5'}`}>{c.n}</span>
          </button>
        ))}
        <div className="relative ml-auto min-w-[12rem] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input className={`${field} pl-9`} placeholder="Search name, phone, city, campaign…" value={q} onChange={e => setQ(e.target.value)} aria-label="Search leads" />
        </div>
        <button className={ghost} onClick={() => setOpenImport(o => !o)}><FileSpreadsheet className="h-4 w-4" />Import leads</button>
      </div>

      {openImport && <ImportPanel api={api} flash={flash} manager={manager} onDone={reload} />}
      {!openImport && <AutoSync api={api} onDone={reload} />}

      <div className="space-y-3">
        {rows.slice(0, 100).map(e => <LeadCard key={e.id} e={e} me={me} api={api} flash={flash} today={today} onTake={() => take(e)} onSaved={p => patchLocal(e.id, p)} canCall={queue !== 'done'} />)}
        {!rows.length && (
          <div className={`${card} p-10 text-center text-sm text-stone-500`}>
            {queue === 'queue' ? 'Your queue is clear. Check “Unassigned” for new leads, or import the latest sheet.' : 'Nothing here.'}
          </div>
        )}
        {rows.length > 100 && <p className="text-center text-xs text-stone-500">Showing the first 100 of {rows.length}. Use search to narrow down.</p>}
      </div>

      {manager && <TeamTable items={items} today={today} />}
    </div>
  );
};

// ---------- One lead ----------
const LeadCard: React.FC<{ e: Enquiry; me: Me; api: Api; flash: (m: string) => void; today: string; onTake: () => void; onSaved: (p: any) => void; canCall: boolean }> =
  ({ e, me, api, flash, today, onTake, onSaved, canCall }) => {
    const f: any = e.fields || {};
    const ph = phoneKey(f.phone);
    const [pick, setPick] = useState<Outcome | null>(null);
    const [note, setNote] = useState('');
    const [day, setDay] = useState('');
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState('');
    const [hist, setHist] = useState<any[] | null>(null);
    const overdue = !!e.nextFollowUp && e.nextFollowUp < today;
    const owner = f.assignedTo ? (f.assignedTo === me.id ? 'You' : f.assignedToName || 'Assigned') : '';

    const choose = (o: Outcome) => { setPick(o); setErr(''); setDay(o.needsDate ? addDays(defaultDay[o.id] ?? 1) : ''); };
    const save = async () => {
      if (!pick) return;
      setBusy(true); setErr('');
      try {
        const r = await api('/api/crm/call', { method: 'POST', body: JSON.stringify({ id: e.id, outcome: pick.id, note, nextFollowUp: pick.needsDate ? day : '' }) });
        onSaved({ status: r.status, touchCount: r.touchCount, nextFollowUp: r.nextFollowUp, fields: r.fields });
        setPick(null); setNote(''); setHist(null);
        flash(`${pick.label} saved for ${f.name}`);
      } catch (x: any) { setErr(x.message || 'Could not save'); }
      setBusy(false);
    };
    const showHist = async () => {
      if (hist) return setHist(null);
      setHist(await api(`/api/crm/activity?key=${ph}`).catch(() => []));
    };

    return (
      <article className={`${card} p-4 sm:p-5`}>
        <div className="flex flex-wrap items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-extrabold">{f.name}</h3>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${STATUS_COLORS[e.status] || ''}`}>{stageOf(e.status).label}</span>
              {f.source && <span className="rounded-full bg-[#7800B9]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#7800B9]">{f.source}</span>}
              {e.nextFollowUp && <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${overdue ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}`}>{overdue ? 'Overdue · ' : 'Call · '}{e.nextFollowUp}</span>}
              {(e.touchCount || 0) > 0 && <span className="text-[11px] text-stone-500">{e.touchCount} call{e.touchCount === 1 ? '' : 's'}{f.lastOutcome ? ` · last: ${outcomeOf(f.lastOutcome)?.label}` : ''}</span>}
            </div>
            <p className="mt-0.5 text-xs text-stone-500">
              {[f.city, f.campaign, `came in ${ago(e.createdAt)}`, owner && `owner: ${owner}`].filter(Boolean).join(' · ')}
            </p>
            {f.message && <p className="mt-2 line-clamp-3 whitespace-pre-line text-xs text-stone-600">{f.message}</p>}
            {e.notes && <p className="mt-1 text-xs italic text-stone-500">Note: {e.notes}</p>}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <a href={`tel:+91${ph}`} className={`${btn} bg-[#E90078] text-white shadow-sm shadow-[#E90078]/30 hover:bg-[#c8006a]`} aria-label={`Call ${f.name}`}><Phone className="h-4 w-4" />{ph}</a>
            <a href={`https://wa.me/91${ph}?text=${encodeURIComponent(`Hi ${String(f.name).split(' ')[0]}, this is Kinderbee following up on your enquiry.`)}`} target="_blank" rel="noreferrer" className={`${btn} bg-emerald-600 text-white hover:bg-emerald-700`} aria-label={`WhatsApp ${f.name}`}><MessageCircle className="h-4 w-4" /></a>
            <button className={ghost} onClick={() => navigator.clipboard?.writeText(ph).then(() => flash('Number copied'))} aria-label="Copy number"><Copy className="h-4 w-4" /></button>
          </div>
        </div>

        {canCall && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {!f.assignedTo && <button className={`${btn} bg-[#191919] text-white`} onClick={onTake}><UserPlus className="h-4 w-4" />Take this lead</button>}
            {f.assignedTo && CALL_OUTCOMES.map(o => (
              <button key={o.id} onClick={() => choose(o)} className={`${btn} ${pick?.id === o.id ? `${o.tone} ring-2 ring-offset-1 ring-black/20` : 'bg-white/65 text-stone-700 ring-1 ring-black/[0.06] hover:bg-white'}`}>{o.label}</button>
            ))}
            <button className={`${ghost} ml-auto`} onClick={showHist}><History className="h-4 w-4" />History</button>
          </div>
        )}

        {pick && (
          <div className="mt-3 grid gap-2 rounded-xl bg-white/50 p-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
            <label className="text-xs font-bold text-stone-500">Note (optional)
              <input className={`${field} mt-1`} value={note} maxLength={500} onChange={x => setNote(x.target.value)} placeholder="What did they say? Child age, fee concern, preferred centre…" autoFocus />
            </label>
            {pick.needsDate && (
              <label className="text-xs font-bold text-stone-500">{pick.id === 'visit' ? 'Visit day' : 'Next call'}
                <input type="date" min={today} className={`${field} mt-1`} value={day} onChange={x => setDay(x.target.value)} />
              </label>
            )}
            <div className="flex gap-2"><button className={`${btn} ${pick.tone}`} disabled={busy || (!!pick.needsDate && !day && ['callback', 'visit'].includes(pick.id))} onClick={save}>{busy ? 'Saving…' : `Save · ${pick.label}`}</button><button className={ghost} onClick={() => setPick(null)}>Cancel</button></div>
            {err && <p className="text-xs font-semibold text-red-600 sm:col-span-3">{err}</p>}
          </div>
        )}

        {hist && (
          <ul className="mt-3 space-y-1 rounded-xl bg-white/50 p-3 text-xs text-stone-600">
            {hist.length ? hist.slice(0, 15).map(h => <li key={h.id}><span className="font-bold text-stone-400">{fmtDate(h.createdAt)}</span> · {h.detail}</li>) : <li>No history yet.</li>}
          </ul>
        )}
      </article>
    );
  };

// ---------- Sheet link, paste / upload ----------
const ImportPanel: React.FC<{ api: Api; flash: (m: string) => void; manager: boolean; onDone: () => void }> = ({ api, flash, manager, onDone }) => {
  const [cfg, setCfg] = useState<SheetCfg>({});
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { api('/api/crm/sheet').then((c: SheetCfg) => { setCfg(c); setUrl(c.url || ''); }).catch(() => {}); }, []);

  const run = async (fn: () => Promise<any>) => {
    setBusy(true); setMsg('');
    try { const r = await fn(); const t = `${r.added} new lead${r.added === 1 ? '' : 's'}, ${r.duplicates} already in the CRM${r.invalid ? `, ${r.invalid} skipped (no name or 10-digit phone)` : ''}`; setMsg(t); flash(t); if (r.cfg) setCfg(r.cfg); onDone(); }
    catch (x: any) { setMsg(x.message || 'Failed'); }
    setBusy(false);
  };
  const sync = (body: object) => run(() => api('/api/crm/sheet/sync', { method: 'POST', body: JSON.stringify(body) }));
  const send = () => run(() => api('/api/crm/leads/import', { method: 'POST', body: JSON.stringify({ text, autoAssign: !!cfg.autoAssign }) }).then(r => { setText(''); return r; }));
  const onFile = (f?: File) => f && f.text().then(setText);

  return (
    <section className="desk-glass rounded-2xl p-4 sm:p-5">
      <h3 className="flex items-center gap-2 text-sm font-extrabold"><FileSpreadsheet className="h-4 w-4 text-[#7800B9]" />Bring in Meta ads leads</h3>
      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Google Sheet (live)</p>
          <input className={field} placeholder="https://docs.google.com/spreadsheets/d/…" value={url} onChange={e => setUrl(e.target.value)} readOnly={!manager} aria-label="Google Sheet link" />
          {manager && (
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-600">
              <input type="checkbox" checked={!!cfg.autoAssign} onChange={e => setCfg({ ...cfg, autoAssign: e.target.checked })} />
              Auto-assign new leads to the Sales callers (fewest open leads first)
            </label>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button className={`${btn} bg-[#191919] text-white`} disabled={busy || !url.trim()} onClick={() => sync(manager ? { url, autoAssign: !!cfg.autoAssign } : {})}><RefreshCw className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} />{manager ? 'Save & sync now' : 'Sync now'}</button>
            {cfg.lastSync && <span className="text-xs text-stone-500">Last sync {ago(cfg.lastSync)}: {cfg.lastResult}</span>}
          </div>
          <p className="text-xs text-stone-500">Share the sheet as “Anyone with the link: Viewer”. Row 1 = headings (full_name, phone_number, email, city, campaign_name, platform… as Meta exports them). Syncs automatically whenever a caller opens this desk, and never adds a phone twice.</p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Or paste / upload</p>
          <textarea className={`${field} h-24 font-mono text-xs`} placeholder="Copy the rows from Google Sheets (with the heading row) and paste here…" value={text} onChange={e => setText(e.target.value)} aria-label="Pasted sheet rows" />
          <div className="flex flex-wrap items-center gap-2">
            <label className={`${ghost} cursor-pointer`}><Upload className="h-4 w-4" />Choose CSV<input type="file" accept=".csv,text/csv,.tsv,.txt" className="sr-only" onChange={e => onFile(e.target.files?.[0])} /></label>
            <button className={`${btn} bg-[#E90078] text-white`} disabled={busy || !text.trim()} onClick={send}>Import</button>
          </div>
        </div>
      </div>
      {msg && <p role="status" className="mt-3 text-sm font-semibold text-[#7800B9]">{msg}</p>}
    </section>
  );
};

// Pulls new sheet rows quietly when a caller opens the desk, at most every 5 minutes per sheet
const AutoSync: React.FC<{ api: Api; onDone: () => void }> = ({ api, onDone }) => {
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return; ran.current = true;
    api('/api/crm/sheet').then((c: SheetCfg) => {
      if (!c.url || (c.lastSync && Date.now() - +new Date(c.lastSync) < 5 * 60000)) return;
      return api('/api/crm/sheet/sync', { method: 'POST', body: '{}' }).then((r: any) => r.added > 0 && onDone());
    }).catch(() => {});
  }, []);
  return null;
};

// ---------- Team view (CEO / Admin) ----------
const TeamTable: React.FC<{ items: Enquiry[]; today: string }> = ({ items, today }) => {
  const rows = useMemo(() => {
    const g = new Map<string, { name: string; open: number; fresh: number; due: number; calls: number; connected: number; hot: number; won: number }>();
    for (const e of items) {
      const f: any = e.fields || {};
      const k = f.assignedTo || '', r = g.get(k) || { name: f.assignedToName || 'Unassigned', open: 0, fresh: 0, due: 0, calls: 0, connected: 0, hot: 0, won: 0 };
      const open = isOpenStage(e.status);
      if (open) { r.open++; if (!(e.touchCount || 0)) r.fresh++; if (e.nextFollowUp && e.nextFollowUp <= today) r.due++; }
      if (['interested', 'counselling', 'visit', 'application'].includes(e.status)) r.hot++;
      if (e.status === 'admission') r.won++;
      if (String(f.lastCallAt || '').slice(0, 10) === today) { r.calls++; if (outcomeOf(f.lastOutcome)?.connected) r.connected++; }
      g.set(k, r);
    }
    return [...g.values()].sort((a, b) => b.open - a.open);
  }, [items, today]);
  return (
    <section className="desk-glass overflow-x-auto rounded-2xl">
      <h3 className="flex items-center gap-2 px-4 pt-4 text-sm font-extrabold"><Users className="h-4 w-4 text-[#7800B9]" />Team today</h3>
      <table className="mt-2 w-full min-w-[640px] text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-stone-500"><tr>{['Caller', 'Open leads', 'Not yet called', 'Follow-ups due', 'Called today', 'Connected', 'In progress', 'Admissions'].map(h => <th key={h} className="px-4 py-2">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-black/5">
          {rows.map(r => (
            <tr key={r.name}><td className="px-4 py-2 font-bold">{r.name}</td>{[r.open, r.fresh, r.due, r.calls, r.connected, r.hot, r.won].map((v, i) => <td key={i} className="px-4 py-2 tabular-nums">{v}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 pb-3 pt-1 text-xs text-stone-500">“Called today” counts leads whose latest call was today (a second call on the same lead counts once).</p>
    </section>
  );
};
