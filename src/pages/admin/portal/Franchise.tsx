import React, { useState } from 'react';
import { Plus, Trash2, ExternalLink, Megaphone } from 'lucide-react';
import { input, btnPrimary, btnGhost, card, Toolbar, Field, fmtDay, useList, type TabProps } from '../ui';
import { type Me, can, todayIST, useBranches, inr } from './common';

// Branch payment history and receipts, plus notices from the head office. Franchise partners see only their own branches.
interface Entry { id: string; branchId: string; date: string; amount: number; kind: string; reference?: string; status: 'received' | 'pending'; receiptUrl?: string; note?: string }
interface Notice { id: string; title: string; body?: string; branchId?: string; at: string; by: string }

export const FranchiseTab: React.FC<TabProps & { me: Me }> = ({ api, flash, me }) => {
  const ledger = useList<Entry>(api, '/api/portal/ledger');
  const notices = useList<Notice>(api, '/api/portal/notices');
  const { branches, nameOf } = useBranches(api);
  const head = me.scope === null;
  const [e, setE] = useState({ branchId: '', amount: '', kind: 'Payment', reference: '', receiptUrl: '', date: todayIST(), status: 'received' });
  const [n, setN] = useState({ title: '', body: '', branchId: '' });

  const addEntry = async (ev: React.FormEvent) => {
    ev.preventDefault();
    await api('/api/portal/ledger', { method: 'POST', body: JSON.stringify(e) });
    setE({ ...e, amount: '', reference: '', receiptUrl: '' });
    flash('Entry recorded');
    ledger.reload();
  };
  const addNotice = async (ev: React.FormEvent) => {
    ev.preventDefault();
    await api('/api/portal/notices', { method: 'POST', body: JSON.stringify(n) });
    setN({ title: '', body: '', branchId: '' });
    flash('Notice published');
    notices.reload();
  };
  const received = ledger.items.filter(l => l.status === 'received').reduce((s, l) => s + l.amount, 0);

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <Toolbar title={head ? 'Branch payments & receipts' : 'Payment history'} count={ledger.items.length} onReload={ledger.reload} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className={card}><div className="text-xs font-semibold uppercase text-slate-500">Received</div><div className="text-lg tracking-tight font-semibold text-emerald-700">{inr(received)}</div></div>
          <div className={card}><div className="text-xs font-semibold uppercase text-slate-500">Pending</div><div className="text-lg tracking-tight font-semibold text-amber-700">{inr(ledger.items.filter(l => l.status === 'pending').reduce((s, l) => s + l.amount, 0))}</div></div>
        </div>
        {head && can(me, 'finance') && (
          <form onSubmit={addEntry} className={`${card} grid gap-3 sm:grid-cols-3`}>
            <Field label="Branch"><select required className={input} value={e.branchId} onChange={x => setE({ ...e, branchId: x.target.value })}><option value="">Select…</option>{branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></Field>
            <Field label="Amount (₹)"><input required type="number" min="1" className={input} value={e.amount} onChange={x => setE({ ...e, amount: x.target.value })} /></Field>
            <Field label="Type"><input className={input} value={e.kind} onChange={x => setE({ ...e, kind: x.target.value })} placeholder="Franchise fee, kit, supplies…" /></Field>
            <Field label="Reference / UTR"><input className={input} value={e.reference} onChange={x => setE({ ...e, reference: x.target.value })} /></Field>
            <Field label="Date"><input type="date" className={input} value={e.date} onChange={x => setE({ ...e, date: x.target.value })} /></Field>
            <Field label="Receipt link (https)"><input className={input} value={e.receiptUrl} onChange={x => setE({ ...e, receiptUrl: x.target.value })} placeholder="https://…" /></Field>
            <Field label="Status"><select className={input} value={e.status} onChange={x => setE({ ...e, status: x.target.value })}><option value="received">Received</option><option value="pending">Pending</option></select></Field>
            <div className="flex items-end sm:col-span-2"><button className={btnPrimary}><Plus className="h-4 w-4" /> Record entry</button></div>
          </form>
        )}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-2">Date</th><th className="px-4 py-2">Branch</th><th className="px-4 py-2">Type</th><th className="px-4 py-2">Reference</th><th className="px-4 py-2">Amount</th><th className="px-4 py-2">Receipt</th>{head && <th />}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {ledger.items.map(l => (
                <tr key={l.id}>
                  <td className="px-4 py-2">{fmtDay(l.date)}</td><td className="px-4 py-2">{nameOf(l.branchId)}</td><td className="px-4 py-2">{l.kind}</td><td className="px-4 py-2 text-slate-500">{l.reference || '—'}</td>
                  <td className="px-4 py-2 font-semibold">{inr(l.amount)} <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${l.status === 'received' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{l.status}</span></td>
                  <td className="px-4 py-2">{l.receiptUrl ? <a href={l.receiptUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-[var(--crm-accent)] hover:underline">Open <ExternalLink className="h-3.5 w-3.5" /></a> : '—'}</td>
                  {head && <td className="px-2"><button className="p-1 text-slate-400 hover:text-red-600" aria-label="Delete entry" onClick={async () => { if (confirm('Delete this entry?')) { await api(`/api/portal/ledger/${l.id}`, { method: 'DELETE' }); ledger.reload(); } }}><Trash2 className="h-4 w-4" /></button></td>}
                </tr>
              ))}
              {!ledger.items.length && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No payments recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-xl font-semibold"><Megaphone className="h-5 w-5 text-[var(--crm-accent)]" /> Notices from head office</h2>
        {head && can(me, 'notices') && (
          <form onSubmit={addNotice} className={`${card} grid gap-3 sm:grid-cols-3`}>
            <input required className={input} placeholder="Title" value={n.title} onChange={x => setN({ ...n, title: x.target.value })} />
            <select className={input} value={n.branchId} onChange={x => setN({ ...n, branchId: x.target.value })}><option value="">All branches</option>{branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
            <button className={btnPrimary}>Publish notice</button>
            <textarea className={`${input} sm:col-span-3`} rows={2} placeholder="Details (optional)" value={n.body} onChange={x => setN({ ...n, body: x.target.value })} />
          </form>
        )}
        <ul className="space-y-2">
          {notices.items.map(x => (
            <li key={x.id} className={`${card} flex items-start justify-between gap-3`}>
              <div><b className="text-slate-900">{x.title}</b><span className="ml-2 text-xs text-slate-500">{x.branchId ? nameOf(x.branchId) : 'All branches'} · {fmtDay(x.at)} · {x.by}</span>{x.body && <p className="mt-1 text-sm text-slate-600">{x.body}</p>}</div>
              {head && can(me, 'notices') && <button className={btnGhost} aria-label="Delete notice" onClick={async () => { await api(`/api/portal/notices/${x.id}`, { method: 'DELETE' }); notices.reload(); }}><Trash2 className="h-4 w-4" /></button>}
            </li>
          ))}
          {!notices.items.length && <li className="text-sm text-slate-400">No notices.</li>}
        </ul>
      </section>
    </div>
  );
};
