import React, { useState } from 'react';
import { X, ShieldCheck, Lock } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [staff, setStaff] = useState(false); // false = CEO password, true = staff / partner account
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
        onClose();
      } else {
        setError(data.error || (staff ? 'Incorrect username or password.' : 'Invalid administrator password.'));
      }
    } catch (err) {
      console.error(err);
      setError('Network error during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-stone-100">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 space-y-2">
          <div className="w-14 h-14 bg-stone-900 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-display font-bold text-stone-900">Admin Portal Access</h3>
          <p className="text-sm text-stone-500">
            Enter the secure administrator password to manage enquiries, blogs, and settings.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl font-medium">
            {error}
          </div>
        )}

        <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-stone-100 p-1 text-sm font-semibold" role="tablist" aria-label="Sign-in type">
          <button type="button" role="tab" aria-selected={!staff} onClick={() => { setStaff(false); setError(''); }} className={`rounded-lg py-2 transition ${!staff ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>CEO</button>
          <button type="button" role="tab" aria-selected={staff} onClick={() => { setStaff(true); setError(''); }} className={`rounded-lg py-2 transition ${staff ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>Staff / Partner</button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {staff && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">Username</label>
              <input required autoFocus autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]" />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">{staff ? 'Password' : 'Administrator Password'}</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              <input
                type="password"
                required
                autoFocus={!staff}
                autoComplete={staff ? 'current-password' : 'off'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Admin password"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1C1917] hover:bg-stone-800 text-white font-medium py-3 rounded-xl shadow-md transition duration-300 text-sm flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin Portal'}
          </button>
        </form>

      </div>
    </div>
  );
};
