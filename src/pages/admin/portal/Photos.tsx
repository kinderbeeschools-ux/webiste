import React, { useState } from 'react';
import { Upload, Check, X, Trash2 } from 'lucide-react';
import { input, btnPrimary, btnGhost, card, Toolbar, Field, fmtDay, useList, type TabProps } from '../ui';
import { type Me, can, todayIST, toBase64, useBranches } from './common';

// Event photographs. Staff and franchise uploads wait for approval; only approved photos are published by /api/gallery.
interface Photo { id: string; title: string; url: string; date: string; branchId?: string; status: 'pending' | 'approved' | 'rejected'; uploadedBy: string }
const BADGE = { pending: 'bg-amber-100 text-amber-800', approved: 'bg-emerald-100 text-emerald-800', rejected: 'bg-red-100 text-red-700' };

export const PhotosTab: React.FC<TabProps & { me: Me }> = ({ api, flash, me }) => {
  const { items, reload, loading } = useList<Photo>(api, '/api/portal/gallery');
  const { branches, nameOf } = useBranches(api);
  const [f, setF] = useState({ title: '', date: todayIST(), branchId: me.scope?.[0] || '' });
  const [busy, setBusy] = useState(false);
  const approver = can(me, 'website');

  const upload = async (file?: File) => {
    if (!file || f.title.trim().length < 2) { flash('Add a title first'); return; }
    if (file.size > 3 * 1024 * 1024) { flash('Please choose a photo under 3 MB'); return; }
    setBusy(true);
    try {
      const up = await api('/api/upload', { method: 'POST', body: JSON.stringify({ name: file.name, contentType: file.type, dataBase64: await toBase64(file), folder: 'gallery' }) });
      await api('/api/portal/gallery', { method: 'POST', body: JSON.stringify({ ...f, url: up.url }) });
      flash(approver ? 'Uploaded — approve it to publish' : 'Uploaded — waiting for approval');
      setF({ ...f, title: '' });
      reload();
    } finally { setBusy(false); }
  };
  const setStatus = async (p: Photo, status: Photo['status']) => { await api(`/api/portal/gallery/${p.id}`, { method: 'PUT', body: JSON.stringify({ status }) }); reload(); };
  const remove = async (p: Photo) => { if (confirm('Remove this photo?')) { await api(`/api/portal/gallery/${p.id}`, { method: 'DELETE' }); reload(); } };

  return (
    <div className="space-y-4">
      <Toolbar title="Event photographs" count={items.length} onReload={reload} />
      <div className={`${card} grid gap-3 sm:grid-cols-4`}>
        <Field label="Event title"><input className={input} value={f.title} onChange={e => setF({ ...f, title: e.target.value })} placeholder="e.g. Annual Day 2026" /></Field>
        <Field label="Date"><input type="date" className={input} max={todayIST()} value={f.date} onChange={e => setF({ ...f, date: e.target.value })} /></Field>
        <Field label="Branch">
          <select className={input} value={f.branchId} onChange={e => setF({ ...f, branchId: e.target.value })}>
            {me.scope === null && <option value="">Head office</option>}
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </Field>
        <div className="flex items-end">
          <label className={`${btnPrimary} w-full cursor-pointer justify-center ${busy ? 'opacity-60' : ''}`}><Upload className="h-4 w-4" /> {busy ? 'Uploading…' : 'Choose photo'}
            <input type="file" accept="image/*" className="sr-only" disabled={busy} onChange={e => { upload(e.target.files?.[0]); e.target.value = ''; }} /></label>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(p => (
          <figure key={p.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <img src={p.url} alt={p.title} loading="lazy" className="h-44 w-full object-cover" />
            <figcaption className="space-y-2 p-3 text-sm">
              <div className="flex items-start justify-between gap-2"><b className="text-stone-900">{p.title}</b><span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${BADGE[p.status]}`}>{p.status}</span></div>
              <div className="text-xs text-stone-500">{fmtDay(p.date)} · {nameOf(p.branchId)} · by {p.uploadedBy}</div>
              <div className="flex gap-2">
                {approver && p.status !== 'approved' && <button className={btnPrimary} onClick={() => setStatus(p, 'approved')}><Check className="h-4 w-4" /> Approve</button>}
                {approver && p.status === 'pending' && <button className={btnGhost} onClick={() => setStatus(p, 'rejected')}><X className="h-4 w-4" /> Reject</button>}
                {(approver || p.status !== 'approved') && <button className={btnGhost} onClick={() => remove(p)} aria-label="Remove photo"><Trash2 className="h-4 w-4" /></button>}
              </div>
            </figcaption>
          </figure>
        ))}
        {!items.length && !loading && <p className="col-span-full rounded-2xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-400">No photographs yet.</p>}
      </div>
    </div>
  );
};
