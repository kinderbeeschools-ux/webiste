import React, { useEffect, useState } from 'react';
import { UserPlus, Copy, MessageCircle, RefreshCw, KeyRound, UserX, UserCheck, Wand2 } from 'lucide-react';
import type { Api } from './admin/ui';
import { fmtDate } from './admin/ui';

// CEO only: create a login for a caller / team member and get a ready-to-share message.
// Uses the existing /api/portal/users endpoints (passwords are stored hashed, so they can only be shown once).

const field = 'w-full rounded-xl border border-white/80 bg-white/70 backdrop-blur-md px-3.5 py-2.5 text-sm text-[#191919] placeholder:text-stone-400 transition focus:border-[#E90078] focus:outline-none focus:ring-4 focus:ring-[#E90078]/10';
const btn = 'inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition cursor-pointer active:scale-[0.97] disabled:opacity-50';
const ghost = `${btn} bg-white/65 text-stone-700 ring-1 ring-black/[0.06] shadow-sm hover:bg-white`;
const card = 'desk-glass desk-sheen rounded-2xl';

interface U { id: string; name: string; username: string; phone?: string; role: string; active: boolean; lastLogin?: string }
interface Meta { roles: Record<string, string> }
interface Creds { name: string; username: string; password: string; role: string }

const genPassword = () => {
  const a = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no look-alikes (0/O, 1/l/I)
  const r = crypto.getRandomValues(new Uint32Array(10));
  return Array.from(r, n => a[n % a.length]).join('');
};
// Usernames allow letters, numbers, dot, dash. "sharmi@kinderbee.com" becomes "sharmi".
const userOf = (s: string) => s.toLowerCase().split('@')[0].replace(/[^a-z0-9._-]+/g, '.').replace(/^\.+|\.+$/g, '');
const slug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '');

export const TeamDesk: React.FC<{ api: Api; flash: (m: string) => void }> = ({ api, flash }) => {
  const [users, setUsers] = useState<U[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [form, setForm] = useState({ name: '', username: '', phone: '', role: 'sales', password: genPassword() });
  const [touchedUser, setTouchedUser] = useState(false);
  const [creds, setCreds] = useState<Creds | null>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [passkey, setPasskey] = useState(''); // sign-in also asks for the site passkey; kept only on this screen, never stored
  const load = () => api('/api/portal/users').then(setUsers).catch(() => {});
  useEffect(() => { load(); api('/api/portal/meta').then(setMeta).catch(() => {}); }, []);

  const roles = Object.entries(meta?.roles || { sales: 'Sales & Marketing' }).filter(([k]) => k !== 'ceo' && k !== 'franchise');
  const roleName = (r: string) => meta?.roles[r] || r;

  const create = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('');
    const username = userOf(form.username || form.name); // an email or a blank box still gives a valid username
    try {
      await api('/api/portal/users', { method: 'POST', body: JSON.stringify({ ...form, username, perms: [] }) });
      setCreds({ name: form.name, username, password: form.password, role: form.role });
      setForm({ name: '', username: '', phone: '', role: form.role, password: genPassword() }); setTouchedUser(false);
      flash('Account created'); load();
    } catch (x: any) { setErr(x.message || 'Could not create the account'); }
    setBusy(false);
  };
  const reset = async (u: U) => {
    const password = genPassword();
    try {
      await api(`/api/portal/users/${u.id}`, { method: 'PUT', body: JSON.stringify({ password }) });
      setCreds({ name: u.name, username: u.username, password, role: u.role }); flash('New password set. Old sign-ins are logged out.');
    } catch (x: any) { setErr(x.message || 'Could not reset the password'); }
  };
  const toggle = async (u: U) => {
    await api(`/api/portal/users/${u.id}`, { method: 'PUT', body: JSON.stringify({ active: !u.active }) }).catch(() => {});
    flash(u.active ? 'Access removed' : 'Access restored'); load();
  };

  const message = (c: Creds) => `Hi ${c.name.split(' ')[0]}, your Kinderbee Desk login:\nLink: ${location.origin}/desk\nChoose the "Staff / partner" tab\nPasskey: ${passkey.trim() || '(the owner will tell you)'}\nUsername: ${c.username}\nPassword: ${c.password}\nPlease keep it private.`;

  return (
    <div className="space-y-5">
      {creds && (
        <section className="desk-glass rounded-2xl border border-emerald-300/60 p-4 sm:p-5" role="status">
          <h3 className="text-sm font-extrabold text-emerald-700">Login ready for {creds.name}: share it now</h3>
          <p className="mt-1 text-xs text-stone-500">The password is shown only here, once. If it is lost, use “New password” on their row.</p>
          <label className="mt-3 block text-xs font-bold text-stone-500">Site passkey to include (sign-in asks for it; leave blank to tell them yourself)
            <input className={`${field} mt-1 max-w-xs`} type="password" autoComplete="off" value={passkey} onChange={e => setPasskey(e.target.value)} />
          </label>
          <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-white/70 p-3 text-sm">{message(creds)}</pre>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className={`${btn} bg-[#191919] text-white`} onClick={() => navigator.clipboard?.writeText(message(creds)).then(() => flash('Copied. Paste it into WhatsApp or SMS.'))}><Copy className="h-4 w-4" />Copy message</button>
            <a className={`${btn} bg-emerald-600 text-white`} target="_blank" rel="noreferrer" href={`https://wa.me/?text=${encodeURIComponent(message(creds))}`}><MessageCircle className="h-4 w-4" />Share on WhatsApp</a>
            <button className={ghost} onClick={() => setCreds(null)}>Done</button>
          </div>
        </section>
      )}

      <form onSubmit={create} className={`${card} grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3`}>
        <h3 className="flex items-center gap-2 text-sm font-extrabold sm:col-span-2 lg:col-span-3"><UserPlus className="h-4 w-4 text-[#E90078]" />Create a login</h3>
        <label className="text-xs font-bold text-stone-500">Full name
          <input className={`${field} mt-1`} value={form.name} required onChange={e => setForm({ ...form, name: e.target.value, username: touchedUser ? form.username : slug(e.target.value) })} placeholder="e.g. Priya Nair" />
        </label>
        <label className="text-xs font-bold text-stone-500">Username (they sign in with this; no @)
          <input className={`${field} mt-1`} value={form.username} autoComplete="off" onChange={e => { setTouchedUser(true); setForm({ ...form, username: e.target.value.toLowerCase() }); }} onBlur={() => setForm(f => ({ ...f, username: userOf(f.username) }))} placeholder="priya.nair" />
        </label>
        <label className="text-xs font-bold text-stone-500">Phone (optional)
          <input className={`${field} mt-1`} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} inputMode="tel" />
        </label>
        <label className="text-xs font-bold text-stone-500">Role
          <select className={`${field} mt-1`} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            {roles.map(([k, v]) => <option key={k} value={k}>{k === 'sales' ? 'Telesales caller (Sales & Marketing)' : v}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold text-stone-500">Password
          <div className="mt-1 flex gap-2">
            <input className={`${field} font-mono`} value={form.password} minLength={8} required onChange={e => setForm({ ...form, password: e.target.value })} />
            <button type="button" className={ghost} onClick={() => setForm({ ...form, password: genPassword() })} aria-label="Generate a new password"><Wand2 className="h-4 w-4" /></button>
          </div>
        </label>
        <div className="flex items-end"><button className={`${btn} w-full bg-[#E90078] text-white`} disabled={busy}>{busy ? 'Creating…' : 'Create login'}</button></div>
        {err && <p className="text-xs font-semibold text-red-600 sm:col-span-2 lg:col-span-3">{err}</p>}
      </form>

      <section className={`${card} overflow-x-auto`}>
        <h3 className="px-4 pt-4 text-sm font-extrabold">Accounts ({users.length})</h3>
        <table className="mt-2 w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-stone-500"><tr>{['Name', 'Username', 'Role', 'Last sign-in', ''].map(h => <th key={h} className="px-4 py-2">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-black/5">
            {users.map(u => (
              <tr key={u.id} className={u.active ? '' : 'opacity-50'}>
                <td className="px-4 py-2 font-bold">{u.name}{!u.active && <span className="ml-2 text-xs font-normal">(no access)</span>}</td>
                <td className="px-4 py-2 font-mono text-xs">{u.username}</td>
                <td className="px-4 py-2">{roleName(u.role)}</td>
                <td className="px-4 py-2 text-xs text-stone-500">{u.lastLogin ? fmtDate(u.lastLogin) : 'never'}</td>
                <td className="flex justify-end gap-2 px-4 py-2">
                  <button className={ghost} onClick={() => reset(u)}><RefreshCw className="h-3.5 w-3.5" /><KeyRound className="h-3.5 w-3.5" />New password</button>
                  <button className={ghost} onClick={() => toggle(u)}>{u.active ? <><UserX className="h-3.5 w-3.5" />Remove access</> : <><UserCheck className="h-3.5 w-3.5" />Restore</>}</button>
                </td>
              </tr>
            ))}
            {!users.length && <tr><td colSpan={5} className="px-4 py-8 text-center text-stone-400">No accounts yet. Create the first one above.</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
};
