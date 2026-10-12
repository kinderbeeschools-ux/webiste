import React, { useState } from 'react';
import { X } from 'lucide-react';
import { input, btnPrimary, btnGhost, Field, type Api } from '../ui';

// Lets staff and partners change their own password. Signing back in is not needed: a fresh token is issued.
export const AccountModal: React.FC<{ api: Api; onClose: () => void; onNewToken: (t: string) => void }> = ({ api, onClose, onNewToken }) => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [msg, setMsg] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await api('/api/auth/change-password', { method: 'POST', body: JSON.stringify({ current, next }) });
      onNewToken(r.token);
    } catch (err: any) { setMsg(err.message); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Change password">
      <form onSubmit={submit} className="relative w-full max-w-sm space-y-4 rounded-3xl bg-white p-6 shadow-2xl">
        <button type="button" onClick={onClose} className={`${btnGhost} absolute right-4 top-4`} aria-label="Close"><X className="h-4 w-4" /></button>
        <h3 className="font-display text-xl font-bold">Change password</h3>
        <Field label="Current password"><input required type="password" autoComplete="current-password" className={input} value={current} onChange={e => setCurrent(e.target.value)} /></Field>
        <Field label="New password (8+ characters)"><input required type="password" autoComplete="new-password" minLength={8} className={input} value={next} onChange={e => setNext(e.target.value)} /></Field>
        {msg && <p className="text-sm text-red-600">{msg}</p>}
        <button className={`${btnPrimary} w-full justify-center`}>Update password</button>
      </form>
    </div>
  );
};
