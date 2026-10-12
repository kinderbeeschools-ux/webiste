import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { input, btnPrimary, btnGhost, card, Toolbar, Field, useList, type TabProps } from '../ui';
import { type Me, can, todayIST, monthIST, useBranches, inr } from './common';

// Staff records, daily attendance and payslips. Salary figures are only sent to users holding the salary permission.
interface Staff { id: string; name: string; designation?: string; branchId?: string; phone?: string; active: boolean; monthlySalary?: number }
interface Mark { id: string; date: string; staffId: string; status: string; note?: string }
interface Slip { id: string; staffId: string; staffName: string; month: string; basic: number; allowances: number; deductions: number; net: number; status: string; paidOn?: string; note?: string }

const STATUS = [
  { id: 'present', label: 'Present', on: 'bg-emerald-600 text-white border-emerald-600' },
  { id: 'half', label: 'Half day', on: 'bg-lime-600 text-white border-lime-600' },
  { id: 'leave', label: 'Leave', on: 'bg-amber-500 text-white border-amber-500' },
  { id: 'absent', label: 'Absent', on: 'bg-red-600 text-white border-red-600' },
];

export const StaffTab: React.FC<TabProps & { me: Me }> = ({ api, flash, me }) => {
  const [view, setView] = useState<'attendance' | 'staff' | 'payslips'>(can(me, 'attendance') ? 'attendance' : 'payslips');
  const staff = useList<Staff>(api, '/api/portal/staff');
  const { branches, nameOf } = useBranches(api);
  const views = [can(me, 'attendance') && ['attendance', 'Daily attendance'], can(me, 'attendance', 'salary') && ['staff', 'Staff records'], can(me, 'salary') && ['payslips', 'Salary & payslips']].filter(Boolean) as [string, string][];

  return (
    <div className="space-y-4">
      <Toolbar title="Staff & payroll" count={staff.items.length} onReload={staff.reload} />
      <div className="flex gap-1 rounded-xl bg-stone-100 p-1">
        {views.map(([id, label]) => (
          <button key={id} onClick={() => setView(id as any)} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${view === id ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-800'}`}>{label}</button>
        ))}
      </div>
      {view === 'attendance' && <Attendance api={api} flash={flash} staff={staff.items.filter(s => s.active)} branchName={nameOf} />}
      {view === 'staff' && <StaffList api={api} flash={flash} me={me} staff={staff.items} reload={staff.reload} branches={branches} branchName={nameOf} />}
      {view === 'payslips' && <Payslips api={api} flash={flash} staff={staff.items.filter(s => s.active)} branchName={nameOf} />}
    </div>
  );
};

const Attendance: React.FC<TabProps & { staff: Staff[]; branchName: (id?: string) => string }> = ({ api, flash, staff, branchName }) => {
  const [date, setDate] = useState(todayIST());
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [month, setMonth] = useState<Mark[]>([]);
  const load = () => api(`/api/portal/attendance?month=${date.slice(0, 7)}`).then((rows: Mark[]) => {
    setMonth(rows);
    setMarks(Object.fromEntries(rows.filter(r => r.date === date).map(r => [r.staffId, r.status])));
  }).catch(() => {});
  useEffect(() => { load(); }, [date]);

  const save = async () => {
    const entries = Object.entries(marks).map(([staffId, status]) => ({ staffId, status }));
    const r = await api('/api/portal/attendance', { method: 'PUT', body: JSON.stringify({ date, entries }) });
    flash(`Attendance saved for ${r.saved} staff`);
    load();
  };
  const summary = useMemo(() => staff.map(s => {
    const rows = month.filter(m => m.staffId === s.id);
    const n = (st: string) => rows.filter(r => r.status === st).length;
    return { s, present: n('present') + n('half') * 0.5, leave: n('leave'), absent: n('absent') };
  }), [staff, month]);

  return (
    <div className="space-y-4">
      <div className={`${card} space-y-4`}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <Field label="Date"><input type="date" className={input} max={todayIST()} value={date} onChange={e => setDate(e.target.value)} /></Field>
          <div className="flex gap-2">
            <button className={btnGhost} onClick={() => setMarks(Object.fromEntries(staff.map(s => [s.id, 'present'])))}><Check className="h-4 w-4" /> Everyone present</button>
            <button className={btnPrimary} onClick={save} disabled={!Object.keys(marks).length}>Save attendance</button>
          </div>
        </div>
        <ul className="divide-y divide-stone-100">
          {staff.map(s => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
              <div><div className="font-semibold text-stone-900">{s.name}</div><div className="text-xs text-stone-500">{[s.designation, branchName(s.branchId)].filter(Boolean).join(' · ')}</div></div>
              <div className="flex gap-1" role="group" aria-label={`Attendance for ${s.name}`}>
                {STATUS.map(st => (
                  <button key={st.id} aria-pressed={marks[s.id] === st.id} onClick={() => setMarks({ ...marks, [s.id]: st.id })}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold transition ${marks[s.id] === st.id ? st.on : 'border-stone-300 text-stone-600 hover:bg-stone-100'}`}>{st.label}</button>
                ))}
              </div>
            </li>
          ))}
          {!staff.length && <li className="py-6 text-center text-sm text-stone-400">Add staff under “Staff records” first.</li>}
        </ul>
      </div>
      {!!staff.length && (
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <div className="border-b border-stone-100 px-4 py-3 font-display font-bold">Monthly summary · {date.slice(0, 7)}</div>
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500"><tr><th className="px-4 py-2">Staff</th><th className="px-4 py-2">Days present</th><th className="px-4 py-2">Leave</th><th className="px-4 py-2">Absent</th></tr></thead>
            <tbody className="divide-y divide-stone-100">{summary.map(({ s, present, leave, absent }) => <tr key={s.id}><td className="px-4 py-2 font-medium">{s.name}</td><td className="px-4 py-2">{present}</td><td className="px-4 py-2">{leave}</td><td className="px-4 py-2">{absent}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const StaffList: React.FC<TabProps & { me: Me; staff: Staff[]; reload: () => void; branches: { id: string; name: string }[]; branchName: (id?: string) => string }> = ({ api, flash, me, staff, reload, branches, branchName }) => {
  const [f, setF] = useState({ name: '', designation: '', phone: '', branchId: me.scope?.[0] || '', monthlySalary: '' });
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    await api('/api/portal/staff', { method: 'POST', body: JSON.stringify(f) });
    setF({ ...f, name: '', designation: '', phone: '', monthlySalary: '' });
    flash('Staff added');
    reload();
  };
  return (
    <div className="space-y-4">
      {can(me, 'attendance') && (
        <form onSubmit={add} className={`${card} grid gap-3 sm:grid-cols-3`}>
          <input required className={input} placeholder="Full name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
          <input className={input} placeholder="Designation" value={f.designation} onChange={e => setF({ ...f, designation: e.target.value })} />
          <input className={input} placeholder="Phone" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} />
          <select className={input} value={f.branchId} onChange={e => setF({ ...f, branchId: e.target.value })}>
            {me.scope === null && <option value="">Head office</option>}
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          {can(me, 'salary') && <input type="number" min="0" className={input} placeholder="Monthly salary (₹)" value={f.monthlySalary} onChange={e => setF({ ...f, monthlySalary: e.target.value })} />}
          <button className={btnPrimary}><Plus className="h-4 w-4" /> Add staff</button>
        </form>
      )}
      <ul className={`${card} divide-y divide-stone-100`}>
        {staff.map(s => (
          <li key={s.id} className={`flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm ${s.active ? '' : 'text-stone-400'}`}>
            <span><b className="text-stone-900">{s.name}</b> <span className="text-stone-500">{[s.designation, branchName(s.branchId), s.phone].filter(Boolean).join(' · ')}</span></span>
            <span className="flex items-center gap-3">
              {s.monthlySalary !== undefined && <span className="font-semibold text-stone-700">{inr(s.monthlySalary)}/mo</span>}
              {can(me, 'attendance') && <button className={btnGhost} onClick={async () => { await api(`/api/portal/staff/${s.id}`, { method: 'PUT', body: JSON.stringify({ active: !s.active }) }); reload(); }}>{s.active ? 'Mark left' : 'Reinstate'}</button>}
            </span>
          </li>
        ))}
        {!staff.length && <li className="py-4 text-sm text-stone-400">No staff yet.</li>}
      </ul>
    </div>
  );
};

const Payslips: React.FC<TabProps & { staff: Staff[]; branchName: (id?: string) => string }> = ({ api, flash, staff, branchName }) => {
  const [month, setMonth] = useState(monthIST());
  const { items, reload } = useList<Slip>(api, `/api/portal/payslips?month=${month}`);
  const [f, setF] = useState({ staffId: '', allowances: '', deductions: '', note: '' });
  const person = staff.find(s => s.id === f.staffId);
  const save = async (status: 'pending' | 'paid') => {
    await api('/api/portal/payslips', { method: 'POST', body: JSON.stringify({ ...f, month, status }) });
    flash(status === 'paid' ? 'Marked as paid' : 'Payslip saved');
    setF({ staffId: '', allowances: '', deductions: '', note: '' });
    reload();
  };
  const total = items.reduce((s, p) => s + p.net, 0);
  return (
    <div className="space-y-4">
      <div className={`${card} space-y-3`}>
        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Month"><input type="month" className={input} value={month} onChange={e => setMonth(e.target.value)} /></Field>
          <Field label="Staff member">
            <select className={input} value={f.staffId} onChange={e => setF({ ...f, staffId: e.target.value })}>
              <option value="">Select…</option>
              {staff.map(s => <option key={s.id} value={s.id}>{s.name} · {branchName(s.branchId)}</option>)}
            </select>
          </Field>
          <Field label="Allowances (₹)"><input type="number" min="0" className={input} value={f.allowances} onChange={e => setF({ ...f, allowances: e.target.value })} /></Field>
          <Field label="Deductions (₹)"><input type="number" min="0" className={input} value={f.deductions} onChange={e => setF({ ...f, deductions: e.target.value })} /></Field>
        </div>
        <input className={input} placeholder="Note (optional)" value={f.note} onChange={e => setF({ ...f, note: e.target.value })} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-stone-600">{person ? `Net pay: ${inr(Math.max(0, (person.monthlySalary || 0) + Number(f.allowances || 0) - Number(f.deductions || 0)))}` : 'Choose a staff member to prepare their slip.'}</span>
          <div className="flex gap-2"><button className={btnGhost} disabled={!f.staffId} onClick={() => save('pending')}>Save as pending</button><button className={btnPrimary} disabled={!f.staffId} onClick={() => save('paid')}>Mark as paid</button></div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500"><tr><th className="px-4 py-2">Staff</th><th className="px-4 py-2">Basic</th><th className="px-4 py-2">+ / −</th><th className="px-4 py-2">Net</th><th className="px-4 py-2">Status</th></tr></thead>
          <tbody className="divide-y divide-stone-100">
            {items.map(p => (
              <tr key={p.id}><td className="px-4 py-2 font-medium">{p.staffName}</td><td className="px-4 py-2">{inr(p.basic)}</td><td className="px-4 py-2 text-stone-500">+{inr(p.allowances)} / −{inr(p.deductions)}</td><td className="px-4 py-2 font-semibold">{inr(p.net)}</td>
                <td className="px-4 py-2"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{p.status === 'paid' ? `Paid ${p.paidOn || ''}` : 'Pending'}</span></td></tr>
            ))}
            {!items.length && <tr><td colSpan={5} className="px-4 py-6 text-center text-stone-400">No payslips for this month yet.</td></tr>}
          </tbody>
          {!!items.length && <tfoot><tr className="bg-stone-50 font-semibold"><td className="px-4 py-2" colSpan={3}>Total for the month</td><td className="px-4 py-2" colSpan={2}>{inr(total)}</td></tr></tfoot>}
        </table>
      </div>
    </div>
  );
};
