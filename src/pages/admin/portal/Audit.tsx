import React, { useMemo, useState } from 'react';
import { input, card, Toolbar, fmtDate, useList, type TabProps } from '../ui';
import { ROLE_STYLE, type Me } from './common';

// Who changed what, and when. Visible to the CEO only.
interface Row { id: string; at: string; userId: string; name: string; role: Me['role']; action: string; detail: string }

export const AuditTab: React.FC<TabProps> = ({ api }) => {
  const { items, loading, reload } = useList<Row>(api, '/api/portal/audit?limit=500');
  const [q, setQ] = useState('');
  const rows = useMemo(() => items.filter(r => !q || `${r.name} ${r.action} ${r.detail}`.toLowerCase().includes(q.toLowerCase())), [items, q]);
  return (
    <div className="space-y-4">
      <Toolbar title="Activity log" count={rows.length} onReload={reload} />
      <input className={input} placeholder="Search by person or action…" value={q} onChange={e => setQ(e.target.value)} aria-label="Search the activity log" />
      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500"><tr><th className="px-4 py-2">When</th><th className="px-4 py-2">Who</th><th className="px-4 py-2">Action</th><th className="px-4 py-2">Detail</th></tr></thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map(r => (
              <tr key={r.id}><td className="whitespace-nowrap px-4 py-2 text-stone-500">{fmtDate(r.at)}</td>
                <td className="px-4 py-2"><span className="font-semibold">{r.name}</span> <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${ROLE_STYLE[r.role]}`}>{r.role.replace('_', ' ')}</span></td>
                <td className="px-4 py-2">{r.action}</td><td className="px-4 py-2 text-stone-500">{r.detail}</td></tr>
            ))}
            {!rows.length && !loading && <tr><td colSpan={4} className="px-4 py-8 text-center text-stone-400">Nothing recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className={`${card} text-xs text-stone-500`}>Changes to leads, payments, attendance, salary, users and website content are recorded automatically. The log keeps the latest 2,000 entries.</p>
    </div>
  );
};
