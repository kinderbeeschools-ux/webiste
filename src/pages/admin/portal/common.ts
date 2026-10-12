import { useEffect, useState } from 'react';
import type { Api } from '../ui';

// Shared types and helpers for the management-platform screens (CEO overview, team, staff, franchise, activity log).

export type Perm = 'reports' | 'leads' | 'leads_branch' | 'leads_delete' | 'payments' | 'opportunities' | 'website' | 'attendance' | 'salary' | 'gallery' | 'finance' | 'notices' | 'audit' | 'users';

export interface Me {
  id: string;
  name: string;
  role: 'ceo' | 'admin' | 'teacher_admin' | 'sales' | 'franchise';
  roleLabel: string;
  perms: Perm[];
  /** null = all branches */
  scope: string[] | null;
  legacy: boolean;
}

export interface Branch { id: string; name: string; city?: string; partner?: string; active: boolean }
export interface Meta {
  roles: Record<string, string>;
  perms: Record<string, string>;
  roleDefaults: Record<string, Perm[]>;
  ceoOnly: Perm[];
}

export const ROLE_STYLE: Record<Me['role'], string> = {
  ceo: 'bg-[#14110F] text-[#E6CD8D]',
  admin: 'bg-violet-100 text-violet-800',
  teacher_admin: 'bg-emerald-100 text-emerald-800',
  sales: 'bg-sky-100 text-sky-800',
  franchise: 'bg-amber-100 text-amber-800',
};

export const can = (me: Me, ...p: Perm[]) => p.some(x => me.perms.includes(x));
export const todayIST = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);
export const monthIST = () => todayIST().slice(0, 7);
export const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result).split(',')[1]);
  r.onerror = reject;
  r.readAsDataURL(file);
});

export function useBranches(api: Api) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const reload = () => { api('/api/portal/branches').then(d => setBranches(Array.isArray(d) ? d : [])).catch(() => {}); };
  useEffect(reload, []);
  const nameOf = (id?: string) => branches.find(b => b.id === id)?.name || (id ? 'Unknown branch' : 'Head office');
  return { branches, reload, nameOf };
}

export const inr = (n: number) => `₹${Math.round(n || 0).toLocaleString('en-IN')}`;
