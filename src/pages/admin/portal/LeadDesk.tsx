import React, { useEffect, useMemo, useState } from 'react';
import { input, card, Toolbar, fmtDay, stageOf, STATUS_COLORS, isOpenStage, useList, type TabProps } from '../ui';
import type { Enquiry } from '../../../types';
import { type Me, can, useBranches } from './common';

// Hands leads to team members and branches. Assignment is stored on the lead itself (fields.assignedTo / fields.branchId),
// so the existing CRM keeps working and franchise partners only see leads tagged to their branch.
interface Person { id: string; name: string; role: string; active: boolean }

export const LeadDeskTab: React.FC<TabProps & { me: Me }> = ({ api, flash, me }) => {
  const { items, setItems, loading, reload } = useList<Enquiry>(api, '/api/enquiries');
  const { branches, nameOf } = useBranches(api);
  const [people, setPeople] = useState<Person[]>([]);
  const [show, setShow] = useState<'unassigned' | 'mine' | 'all'>('unassigned');
  const [q, setQ] = useState('');
  const manage = can(me, 'leads');
  useEffect(() => { if (me.perms.includes('users')) api('/api/portal/users').then((u: any[]) => setPeople(u.filter(x => x.active && x.perms !== null && ['sales', 'admin', 'ceo'].includes(x.role)))).catch(() => {}); }, []);

  const rows = useMemo(() => items.filter(e => {
    const a = (e.fields as any)?.assignedTo;
    if (show === 'unassigned' && (a || !isOpenStage(e.status))) return false;
    if (show === 'mine' && a !== me.id) return false;
    const s = q.toLowerCase();
    return !s || [e.fields?.name, e.fields?.phone, e.type, e.fields?.city].some(v => String(v || '').toLowerCase().includes(s));
  }), [items, show, q, me.id]);

  const assign = async (e: Enquiry, patch: Record<string, string>) => {
    await api(`/api/enquiries/${e.id}`, { method: 'PUT', body: JSON.stringify({ fields: patch }) });
    setItems(l => l.map(x => (x.id === e.id ? { ...x, fields: { ...x.fields, ...patch } } : x)));
    flash('Assignment saved');
  };

  const assignees = [{ id: me.id, name: 'Me' }, ...people.filter(p => p.id !== me.id)];
  return (
    <div className="space-y-4">
      <Toolbar title="Lead desk" count={rows.length} onReload={reload} />
      <div className="flex flex-wrap gap-2">
        {(['unassigned', 'mine', 'all'] as const).map(k => (
          <button key={k} onClick={() => setShow(k)} className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${show === k ? 'border-[#E1007A] bg-[#E1007A]/10 text-[#E1007A]' : 'border-stone-300 text-stone-600 hover:bg-stone-100'}`}>
            {k === 'unassigned' ? 'Needs an owner' : k === 'mine' ? 'Assigned to me' : 'All leads'}
          </button>
        ))}
        <input className={`${input} max-w-xs`} placeholder="Search name, phone, city…" value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500"><tr><th className="px-4 py-2">Lead</th><th className="px-4 py-2">Enquiry</th><th className="px-4 py-2">Stage</th><th className="px-4 py-2">Owner</th><th className="px-4 py-2">Branch</th></tr></thead>
          <tbody className="divide-y divide-stone-100">
            {rows.slice(0, 200).map(e => {
              const a = (e.fields as any)?.assignedTo || '';
              const b = (e.fields as any)?.branchId || '';
              return (
                <tr key={e.id}>
                  <td className="px-4 py-2"><div className="font-semibold text-stone-900">{e.fields?.name}</div><div className="text-xs text-stone-500">{e.fields?.phone} · {fmtDay(e.createdAt)}</div></td>
                  <td className="px-4 py-2 text-stone-600">{e.type}</td>
                  <td className="px-4 py-2"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLORS[e.status] || ''}`}>{stageOf(e.status).label}</span></td>
                  <td className="px-4 py-2">
                    {manage && assignees.length > 1 ? (
                      <select className={input} value={a} onChange={ev => assign(e, { assignedTo: ev.target.value, assignedToName: assignees.find(p => p.id === ev.target.value)?.name || '' })} aria-label="Owner">
                        <option value="">Unassigned</option>{assignees.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    ) : manage ? (
                      <button className="text-sm font-semibold text-[#E1007A] hover:underline" onClick={() => assign(e, { assignedTo: a === me.id ? '' : me.id, assignedToName: a === me.id ? '' : me.name })}>{a === me.id ? 'Assigned to me · release' : a ? ((e.fields as any).assignedToName || 'Assigned') : 'Take this lead'}</button>
                    ) : <span className="text-stone-500">{(e.fields as any)?.assignedToName || '—'}</span>}
                  </td>
                  <td className="px-4 py-2">
                    {manage && me.scope === null ? (
                      <select className={input} value={b} onChange={ev => assign(e, { branchId: ev.target.value })} aria-label="Branch">
                        <option value="">Head office</option>{branches.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
                      </select>
                    ) : <span className="text-stone-500">{nameOf(b)}</span>}
                  </td>
                </tr>
              );
            })}
            {!rows.length && !loading && <tr><td colSpan={5} className="px-4 py-8 text-center text-stone-400">{show === 'unassigned' ? 'Every open lead has an owner. Well done.' : 'No leads match.'}</td></tr>}
          </tbody>
        </table>
      </div>
      <p className={`${card} text-xs text-stone-500`}>Tag a lead to a branch to let that franchise partner see it. Partners get a read-only view of their own branch leads.</p>
    </div>
  );
};
