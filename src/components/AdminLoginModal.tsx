import React, { useState } from 'react';
import { X, ShieldCheck, Lock } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
  /** Full-page sign-in (the /admin address) instead of a pop-up over the website */
  asPage?: boolean;
}

const field = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-3 focus:ring-slate-900/10';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess, asPage = false }) => {
  const [password, setPassword] = useState('');
  const [staff, setStaff] = useState(false); // false = owner (CEO) password, true = staff / partner account
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(staff ? '/api/auth/user-login' : '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staff ? { username, password } : { password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        onLoginSuccess(data.token);
        setPassword('');
        if (!asPage) onClose(); // the page version just turns into the CRM
      } else {
        setError(data.error || (staff ? 'Incorrect username or password.' : 'Incorrect password.'));
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={asPage ? "flex min-h-screen items-center justify-center bg-slate-50 p-4" : "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-fadeIn"} role={asPage ? "main" : "dialog"} aria-modal={asPage ? undefined : true} aria-labelledby="login-title">
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
        {asPage ? (
          <button onClick={onClose} className="absolute right-4 top-4 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 cursor-pointer">Back to website</button>
        ) : (
          <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="mb-6 space-y-1.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white"><ShieldCheck className="h-5 w-5" /></span>
          <h3 id="login-title" className="pt-2 text-lg font-semibold tracking-tight text-slate-900">Sign in to your workspace</h3>
          <p className="text-sm text-slate-500">Manage leads, payments, staff and website content.</p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 text-sm font-medium" role="tablist" aria-label="Sign-in type">
          <button type="button" role="tab" aria-selected={!staff} onClick={() => { setStaff(false); setError(''); }} className={`rounded-md py-1.5 transition cursor-pointer ${!staff ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}>Owner</button>
          <button type="button" role="tab" aria-selected={staff} onClick={() => { setStaff(true); setError(''); }} className={`rounded-md py-1.5 transition cursor-pointer ${staff ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}>Staff / partner</button>
        </div>

        {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          {staff && (
            <div className="space-y-1.5">
              <label htmlFor="login-username" className="block text-xs font-medium text-slate-600">Username</label>
              <input id="login-username" required autoFocus autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} className={field} />
            </div>
          )}
          <div className="space-y-1.5">
            <label htmlFor="login-password" className="block text-xs font-medium text-slate-600">{staff ? 'Password' : 'Owner password'}</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input id="login-password" type="password" required autoFocus={!staff} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className={`${field} pl-9`} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-slate-800 disabled:opacity-60 cursor-pointer">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};
