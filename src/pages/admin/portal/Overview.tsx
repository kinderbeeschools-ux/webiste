import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, IndianRupee, CalendarCheck, Wallet, Image as ImageIcon, BellRing, UserX, ArrowUpRight, Building2 } from 'lucide-react';
import { card } from '../ui';
import type { TabProps } from '../ui';
import { type Me, inr } from './common';

// Management overview. Each block arrives from the server only if the signed-in role may see it.
interface Overview {
  leads?: { total: number; last30: number; open: number; admitted: number; conversionPct: number; followUpsDue: number; unassigned: number; byStage: Record<string, number>; byCategory: Record<string, number>; bySource: Record<string, number>; trend: { date: string; count: number }[] };
  payments?: { verifiedCount: number; verifiedTotal: number; pendingCount: number; last30Total: number };
  staff?: { total: number; present: number; absent: number; onLeave: number; unmarked: number };
  salary?: { month: string; monthlyBill: number; paid: number; slipsPending: number };
  approvals?: { photos: number };
  branches?: number;
  recent?: { id: string; at: string; name: string; role: string; action: string; detail: string }[];
}

const STAGE_ORDER = ['new', 'contacted', 'interested', 'counselling', 'visit', 'application', 'admission', 'lost'];
const STAGE_LABEL: Record<string, string> = { new: 'New', contacted: 'Contacted', interested: 'Interested', counselling: 'Counselling', visit: 'Centre visit', application: 'Application', admission: 'Admission', lost: 'Lost' };

const Kpi: React.FC<{ icon: React.ElementType; label: string; value: React.ReactNode; hint?: string; tone?: 'gold' | 'rose' | 'green' | 'sky'; onClick?: () => void; i: number }> = ({ icon: Icon, label, value, hint, tone = 'gold', onClick, i }) => {
  const tones = { gold: 'bg-[#C9A24A]/15 text-[#8a6a1f]', rose: 'bg-[#E1007A]/10 text-[#E1007A]', green: 'bg-emerald-100 text-emerald-700', sky: 'bg-sky-100 text-sky-700' };
  return (
    <motion.button type="button" onClick={onClick} disabled={!onClick} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
      className={`group rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm transition ${onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md' : 'cursor-default'}`}>
      <div className="flex items-center justify-between">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-4.5 w-4.5" /></span>
        {onClick && <ArrowUpRight className="h-4 w-4 text-stone-300 transition group-hover:text-stone-600" />}
      </div>
      <div className="mt-3 font-display text-2xl font-bold text-stone-900">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</div>
      {hint && <div className="mt-1 text-xs text-stone-500">{hint}</div>}
    </motion.button>
  );
};

const Bars: React.FC<{ data: [string, number][]; max?: number; color?: string }> = ({ data, color = '#E1007A' }) => {
  const top = Math.max(1, ...data.map(d => d[1]));
  return (
    <ul className="space-y-2">
      {data.map(([k, v]) => (
        <li key={k} className="grid grid-cols-[110px_1fr_36px] items-center gap-2 text-sm">
          <span className="truncate text-stone-600">{k}</span>
          <span className="h-2.5 overflow-hidden rounded-full bg-stone-100"><motion.span className="block h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${(v / top) * 100}%` }} transition={{ duration: 0.7 }} /></span>
          <span className="text-right font-semibold text-stone-800">{v}</span>
        </li>
      ))}
      {!data.length && <li className="text-sm text-stone-400">No data yet.</li>}
    </ul>
  );
};

export const OverviewTab: React.FC<TabProps & { me: Me; go: (tab: string) => void }> = ({ api, me, go }) => {
  const [o, setO] = useState<Overview | null>(null);
  useEffect(() => { api('/api/portal/overview').then(setO).catch(() => {}); }, []);

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const trendMax = Math.max(1, ...(o?.leads?.trend.map(t => t.count) || [1]));
  let i = 0;

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lg sm:p-8" style={{ background: 'linear-gradient(135deg,#1F1A16 0%,#14110F 55%,#2a0f20 100%)' }}>
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#C9A24A]/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-[#E1007A]/15 blur-3xl" />
        <div className="relative">
          <div className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#E6CD8D]">{me.roleLabel}</div>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{greet}, {me.name.split(' ')[0]}.</h1>
          <p className="mt-2 max-w-xl text-sm text-stone-300">
            {me.role === 'ceo' ? 'Everything across leads, payments, staff and branches, in one place. Only you decide who sees what.' : 'Your workspace, showing only what your role is permitted to see.'}
          </p>
        </div>
      </div>

      {!o && <div className={`${card} text-sm text-stone-500`}>Loading the overview…</div>}

      {o && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {o.leads && <Kpi i={i++} icon={Users} label="Open leads" value={o.leads.open} hint={`${o.leads.last30} new in 30 days`} tone="rose" onClick={() => go('crm')} />}
            {o.leads && <Kpi i={i++} icon={TrendingUp} label="Conversion" value={`${o.leads.conversionPct}%`} hint={`${o.leads.admitted} admitted of ${o.leads.total}`} tone="green" onClick={() => go('crm')} />}
            {o.leads && <Kpi i={i++} icon={BellRing} label="Follow-ups due" value={o.leads.followUpsDue} hint={`${o.leads.unassigned} open leads unassigned`} tone="gold" onClick={() => go('leaddesk')} />}
            {o.payments && <Kpi i={i++} icon={IndianRupee} label="Verified payments" value={inr(o.payments.verifiedTotal)} hint={`${o.payments.pendingCount} waiting for verification`} tone="green" onClick={() => go('payments')} />}
            {o.staff && <Kpi i={i++} icon={CalendarCheck} label="Staff present today" value={`${o.staff.present}/${o.staff.total}`} hint={o.staff.unmarked ? `${o.staff.unmarked} not marked yet` : 'Attendance complete'} tone="sky" onClick={() => go('staff')} />}
            {o.salary && <Kpi i={i++} icon={Wallet} label="Salary paid this month" value={inr(o.salary.paid)} hint={`of ${inr(o.salary.monthlyBill)} monthly bill`} tone="gold" onClick={() => go('staff')} />}
            {o.approvals && <Kpi i={i++} icon={ImageIcon} label="Photos to approve" value={o.approvals.photos} hint="Event photographs" tone="rose" onClick={() => go('photos')} />}
            {o.branches !== undefined && <Kpi i={i++} icon={Building2} label="Active branches" value={o.branches} tone="sky" onClick={me.perms.includes('users') ? () => go('team') : undefined} />}
          </div>

          {o.leads && (
            <div className="grid gap-4 lg:grid-cols-3">
              <section className={`${card} lg:col-span-2`}>
                <h2 className="font-display text-lg font-bold">Enquiries, last 14 days</h2>
                <div className="mt-4 flex h-36 items-end gap-1.5" role="img" aria-label="Enquiries per day for the last 14 days">
                  {o.leads.trend.map(t => (
                    <div key={t.date} className="group relative flex flex-1 flex-col items-center justify-end">
                      <span className="mb-1 text-[10px] font-semibold text-stone-500 opacity-0 transition group-hover:opacity-100">{t.count}</span>
                      <motion.span className={`w-full rounded-t-md ${t.count ? 'bg-gradient-to-t from-[#E1007A] to-[#ff6fb5]' : 'bg-stone-200'}`} initial={{ height: 0 }} animate={{ height: t.count ? Math.max(8, (t.count / trendMax) * 96) : 4 }} transition={{ duration: 0.6 }} />
                      <span className="mt-1 text-[9px] text-stone-400">{t.date.slice(8)}</span>
                    </div>
                  ))}
                </div>
              </section>
              <section className={card}>
                <h2 className="font-display text-lg font-bold">By business line</h2>
                <div className="mt-3"><Bars data={(Object.entries(o.leads.byCategory) as [string, number][]).sort((a, b) => b[1] - a[1])} color="#C9A24A" /></div>
              </section>
              <section className={card}>
                <h2 className="font-display text-lg font-bold">Pipeline</h2>
                <div className="mt-3"><Bars data={STAGE_ORDER.filter(s => o.leads!.byStage[s]).map(s => [STAGE_LABEL[s], o.leads!.byStage[s]] as [string, number])} /></div>
              </section>
              <section className={card}>
                <h2 className="font-display text-lg font-bold">Lead sources</h2>
                <div className="mt-3"><Bars data={(Object.entries(o.leads.bySource) as [string, number][]).sort((a, b) => b[1] - a[1])} color="#0F766E" /></div>
              </section>
              {o.staff && (
                <section className={card}>
                  <h2 className="font-display text-lg font-bold">Attendance today</h2>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    {([['Present', o.staff.present, 'text-emerald-700'], ['Absent', o.staff.absent, 'text-red-600'], ['On leave', o.staff.onLeave, 'text-amber-700'], ['Not marked', o.staff.unmarked, 'text-stone-500']] as const).map(([k, v, c]) => (
                      <div key={k} className="rounded-xl bg-stone-50 p-3"><dt className="text-xs text-stone-500">{k}</dt><dd className={`font-display text-xl font-bold ${c}`}>{v}</dd></div>
                    ))}
                  </dl>
                </section>
              )}
            </div>
          )}

          {!o.leads && o.staff && (
            <section className={card}>
              <h2 className="font-display text-lg font-bold">Attendance today</h2>
              <p className="mt-2 text-sm text-stone-600">{o.staff.present} present · {o.staff.absent} absent · {o.staff.onLeave} on leave · {o.staff.unmarked} not marked</p>
            </section>
          )}

          {o.recent && (
            <section className={card}>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold">Recent activity</h2>
                <button onClick={() => go('audit')} className="text-sm font-semibold text-[#E1007A] hover:underline">View full log</button>
              </div>
              <ul className="mt-3 divide-y divide-stone-100">
                {o.recent.map(r => (
                  <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                    <span><b className="text-stone-800">{r.name}</b> <span className="text-stone-600">· {r.action}{r.detail ? ` — ${r.detail}` : ''}</span></span>
                    <time className="text-xs text-stone-400">{new Date(r.at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</time>
                  </li>
                ))}
                {!o.recent.length && <li className="py-2 text-sm text-stone-400">Nothing recorded yet.</li>}
              </ul>
            </section>
          )}

          {o.staff === undefined && o.leads === undefined && (
            <div className={`${card} flex items-center gap-3 text-sm text-stone-500`}><UserX className="h-5 w-5" /> Nothing to summarise for your role yet.</div>
          )}
        </>
      )}
    </div>
  );
};
