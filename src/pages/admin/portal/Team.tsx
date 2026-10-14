import React, { useEffect, useState } from 'react';
import { Plus, KeyRound, ShieldCheck, Building2, X, UserCheck, UserX } from 'lucide-react';
import { input, btnPrimary, btnGhost, card, Toolbar, Field, fmtDate, useList, type TabProps } from '../ui';
import { type Meta, type Branch, type Perm, ROLE_STYLE } from './common';

// CEO only: create accounts, choose a role, grant or remove individual permissions, and manage branches.
interface U {
  id: string; name: string; username: string; email?: string; phone?: string; role: keyof typeof ROLE_STYLE; branchIds?: string[]; perms?: Perm[];
  active: boolean; lastLogin?: string; effectivePerms: Perm[];
}

const blank = { name: '', username: '', email: '', phone: '', role: 'sales', password: '', branchIds: [] as string[], perms: undefined as Perm[] | undefined, active: true };

export const TeamTab: React.FC<TabProps> = ({ api, flash }) => {
  const { items, loading, reload } = useList<U>(api, '/api/portal/users');
  const [meta, setMeta] = useState<Meta | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [editing, setEditing] = useState<(typeof blank & { id?: string }) | null>(null);
  const [branchForm, setBranchForm] = useState({ name: '', city: '', partner: '' });

  const loadBranches = () => api('/api/portal/branches').then(setBranches).catch(() => {});
  useEffect(() => { api('/api/portal/meta').then(setMeta).catch(() => {}); loadBranches(); }, []);

  const roleDefault = (role: string): Perm[] => meta?.roleDefaults[role] || [];

  const save = async () => {
    if (!editing) return;
    const { id, ...body } = editing;
    const payload: any = { ...body };
    if (!payload.password) delete payload.password;
    // Only send a custom list when it differs from the role defaults
    const base = roleDefault(editing.role);
    const same = editing.perms && editing.perms.length === base.length && editing.perms.every(p => base.includes(p));
    payload.perms = editing.perms && !same ? editing.perms : [];
    await api(id ? `/api/portal/users/${id}` : '/api/portal/users', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
    flash(id ? 'Account updated' : 'Account created');
    setEditing(null);
    reload();
  };

  const toggle = async (u: U) => {
    await api(`/api/portal/users/${u.id}`, { method: 'PUT', body: JSON.stringify({ active: !u.active }) });
    flash(u.active ? 'Access removed' : 'Access restored');
    reload();
  };

  const addBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    await api('/api/portal/branches', { method: 'POST', body: JSON.stringify(branchForm) });
    setBranchForm({ name: '', city: '', partner: '' });
    flash('Branch added');
    loadBranches();
  };

  const branchNames = (ids?: string[]) => (ids || []).map(id => branches.find(b => b.id === id)?.name || '—').join(', ');

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <Toolbar title="Team & access" count={items.length} onReload={reload}>
          <button className={btnPrimary} onClick={() => setEditing({ ...blank })}><Plus className="h-4 w-4" /> Add account</button>
        </Toolbar>
        <p className="flex items-start gap-2 rounded-xl border border-[#C9A24A]/40 bg-[#C9A24A]/10 px-4 py-3 text-sm text-slate-700">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#8a6a1f]" />
          You decide who sees what. Permissions are checked on the server for every request, so a hidden menu item is never the only protection. Removing access takes effect immediately.
        </p>

        {editing ? (
          <div className={`${card} space-y-4`}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing.id ? 'Edit account' : 'New account'}</h2>
              <button onClick={() => setEditing(null)} className={btnGhost} aria-label="Close"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Full name"><input className={input} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></Field>
              <Field label="Username (used to sign in)"><input className={input} value={editing.username} onChange={e => setEditing({ ...editing, username: e.target.value })} autoComplete="off" /></Field>
              <Field label="Email"><input className={input} value={editing.email || ''} onChange={e => setEditing({ ...editing, email: e.target.value })} /></Field>
              <Field label="Phone"><input className={input} value={editing.phone || ''} onChange={e => setEditing({ ...editing, phone: e.target.value })} /></Field>
              <Field label="Role">
                <select className={input} value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value, perms: undefined })}>
                  {meta && Object.entries(meta.roles).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </Field>
              <Field label={editing.id ? 'New password (leave empty to keep)' : 'First password (8+ characters)'}>
                <input className={input} type="password" value={editing.password} onChange={e => setEditing({ ...editing, password: e.target.value })} autoComplete="new-password" />
              </Field>
              <Field label={editing.role === 'franchise' ? 'Branches this partner may access (required)' : 'Limit to branches (optional, empty = all)'} full>
                <div className="flex flex-wrap gap-2">
                  {branches.map(b => {
                    const on = (editing.branchIds || []).includes(b.id);
                    return (
                      <button type="button" key={b.id} onClick={() => setEditing({ ...editing, branchIds: on ? editing.branchIds.filter(x => x !== b.id) : [...(editing.branchIds || []), b.id] })}
                        className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${on ? 'border-[var(--crm-accent)] bg-[var(--crm-accent)]/10 text-[var(--crm-accent)]' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}>{b.name}</button>
                    );
                  })}
                  {!branches.length && <span className="text-sm text-slate-400">Add a branch below first.</span>}
                </div>
              </Field>
            </div>

            {editing.role !== 'ceo' && meta && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Access to private areas</span>
                  <button type="button" className="text-xs font-semibold text-[var(--crm-accent)] hover:underline" onClick={() => setEditing({ ...editing, perms: undefined })}>Reset to role defaults</button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(Object.keys(meta.perms) as Perm[]).filter(p => !meta.ceoOnly.includes(p)).map(p => {
                    const current = editing.perms ?? roleDefault(editing.role);
                    const on = current.includes(p);
                    return (
                      <label key={p} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${on ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                        <input type="checkbox" className="h-4 w-4 accent-[var(--crm-accent)]" checked={on} onChange={() => setEditing({ ...editing, perms: on ? current.filter(x => x !== p) : [...current, p] })} />
                        <span className="font-medium text-slate-800">{meta.perms[p]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
            {editing.role === 'ceo' && <p className="text-sm text-slate-500">A CEO account has access to everything, including users and the activity log.</p>}
            <div className="flex gap-2"><button className={btnPrimary} onClick={save}>Save account</button><button className={btnGhost} onClick={() => setEditing(null)}>Cancel</button></div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Person</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Branches</th><th className="px-4 py-3">Last sign-in</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(u => (
                  <tr key={u.id} className={u.active ? '' : 'bg-slate-50 text-slate-400'}>
                    <td className="px-4 py-3"><div className="font-semibold text-slate-900">{u.name}</div><div className="text-xs text-slate-500">@{u.username}</div></td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${ROLE_STYLE[u.role]}`}>{meta?.roles[u.role] || u.role}</span>{u.perms?.length ? <span className="ml-2 text-xs text-slate-500">custom access</span> : null}</td>
                    <td className="px-4 py-3 text-slate-600">{branchNames(u.branchIds) || 'All'}</td>
                    <td className="px-4 py-3 text-slate-500">{u.lastLogin ? fmtDate(u.lastLogin) : 'Never'}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button className={btnGhost} onClick={() => setEditing({ ...blank, ...u, password: '', branchIds: u.branchIds || [], perms: u.perms?.length ? u.perms : undefined })}><KeyRound className="h-4 w-4" /> Edit</button>
                        <button className={btnGhost} onClick={() => toggle(u)}>{u.active ? <><UserX className="h-4 w-4" /> Remove access</> : <><UserCheck className="h-4 w-4" /> Restore</>}</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && !loading && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No accounts yet. The CEO password gives you full access; add your team here.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={`${card} space-y-4`}>
        <h2 className="flex items-center gap-2 text-lg font-semibold"><Building2 className="h-5 w-5 text-[var(--crm-accent)]" /> Branches & franchise partners</h2>
        <form onSubmit={addBranch} className="grid gap-3 sm:grid-cols-4">
          <input required className={input} placeholder="Branch name" value={branchForm.name} onChange={e => setBranchForm({ ...branchForm, name: e.target.value })} />
          <input className={input} placeholder="City" value={branchForm.city} onChange={e => setBranchForm({ ...branchForm, city: e.target.value })} />
          <input className={input} placeholder="Franchise partner" value={branchForm.partner} onChange={e => setBranchForm({ ...branchForm, partner: e.target.value })} />
          <button className={btnPrimary}><Plus className="h-4 w-4" /> Add branch</button>
        </form>
        <ul className="divide-y divide-slate-100">
          {branches.map(b => (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
              <span><b>{b.name}</b> <span className="text-slate-500">{[b.city, b.partner].filter(Boolean).join(' · ')}</span></span>
              <button className={btnGhost} onClick={async () => { await api(`/api/portal/branches/${b.id}`, { method: 'PUT', body: JSON.stringify({ active: !b.active }) }); loadBranches(); }}>{b.active ? 'Deactivate' : 'Activate'}</button>
            </li>
          ))}
          {!branches.length && <li className="py-2 text-sm text-slate-400">No branches yet.</li>}
        </ul>
      </section>
    </div>
  );
};
