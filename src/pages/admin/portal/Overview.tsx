import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, IndianRupee, CalendarCheck, Wallet, Image as ImageIcon, BellRing, UserX, ArrowUpRight, Building2, Loader2, UserPlus, CreditCard, PenSquare, Upload } from 'lucide-react';
import { TrendArea, Donut, Funnel } from '../charts';
import { card } from '../ui';
import type { TabProps } from '../ui';
import { type Me, inr } from './common';

// Management dashboard. Each block arrives from the server only if the signed-in role may see it.
interface Overview {
  leads?: { total: number; last30: number; open: number; admitted: number; conversionPct: number; followUpsDue: number; unassigned: number; byStage: Record<string, number>; byCategory: Record<string, number>; bySource: Record<string, number>; trend: { date: string; count: number }[] };
  payments?: { verifiedCount: number; verifiedTotal: number; pendingCount: number; last30Total: number };
  staff?: { total: number; present: number; absent: number; onLeave: number; unmarked: number };
  salary?: { month: string; monthlyBill: number; paid: number; slipsPending: number };
  approvals?: { photos: number };
  branches?: number;
  recent?: { id: string; at: string; name: string; role: string; action: string; detail: string }[];
}

// The CRM sections this user can open (from AdminPanel), listed on the dashboard
export interface ModuleLink { id: string; label: string; description: string; group: string; icon: React.ElementType }

const STAGE_ORDER = ['new', 'contacted', 'interested', 'counselling', 'visit', 'application', 'admission', 'lost'];
const STAGE_LABEL: Record<string, string> = { new: 'New', contacted: 'Contacted', interested: 'Interested', counselling: 'Counselling', visit: 'Centre visit', application: 'Application', admission: 'Admission', lost: 'Lost' };

const Kpi: React.FC<{ icon: React.ElementType; label: string; value: React.ReactNode; hint?: string; onClick?: () => void; i: number }> = ({ icon: Icon, label, value, hint, onClick, i }) => (
  <motion.button type="button" onClick={onClick} disabled={!onClick} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.3 }}
    className={`group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-xs transition ${onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-sm' : 'cursor-default'}`}>
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--crm-accent)]/10 text-[var(--crm-accent)]"><Icon className="h-4 w-4" /></span>
    </div>
    <div className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-slate-900">{value}</div>
    {hint && <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">{hint}{onClick && <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />}</div>}
  </motion.button>
);

const Bars: React.FC<{ data: [string, number][] }> = ({ data }) => {
  const top = Math.max(1, ...data.map(d => d[1]));
  return (
    <ul className="space-y-2.5">
      {data.map(([k, v]) => (
        <li key={k} className="grid grid-cols-[120px_1fr_36px] items-center gap-3 text-sm">
          <span className="truncate text-slate-600">{k}</span>
          <span className="h-2 overflow-hidden rounded-full bg-slate-100"><motion.span className="block h-full rounded-full bg-[var(--crm-accent)]" initial={{ width: 0 }} animate={{ width: `${(v / top) * 100}%` }} transition={{ duration: 0.6 }} /></span>
          <span className="text-right font-medium tabular-nums text-slate-900">{v}</span>
        </li>
      ))}
      {!data.length && <li className="text-sm text-slate-400">No data yet.</li>}
    </ul>
  );
};

const Panel: React.FC<{ title: string; action?: React.ReactNode; className?: string; children: React.ReactNode }> = ({ title, action, className = '', children }) => (
  <section className={`${card} ${className}`}>
    <div className="mb-4 flex items-center justify-between gap-2">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

export const OverviewTab: React.FC<TabProps & { me: Me; go: (tab: string) => void; modules?: ModuleLink[]; badges?: Record<string, number | undefined> }> = ({ api, me, go, modules = [], badges = {} }) => {
  const [o, setO] = useState<Overview | null>(null);
  useEffect(() => { api('/api/portal/overview').then(setO).catch(() => {}); }, []);

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const trendTotal = (o?.leads?.trend || []).reduce((n, t) => n + t.count, 0);
  const groups = [...new Set(modules.map(m => m.group))];
  let i = 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">{greet}, {me.name.split(' ')[0]}</h2>
          <p className="text-sm text-slate-500">{me.role === 'ceo' ? 'Leads, payments, staff and branches across the business.' : 'Your workspace, showing only what your role can see.'}</p>
        </div>
        {o?.leads && o.leads.followUpsDue > 0 && (
          <button onClick={() => go('leaddesk')} className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100 cursor-pointer">
            <BellRing className="h-4 w-4" /> {o.leads.followUpsDue} follow-up{o.leads.followUpsDue > 1 ? 's' : ''} due today
          </button>
        )}
      </div>

      {/* Quick actions: the jobs people do most, one click away */}
      {(() => {
        const can = (id: string) => modules.some(m => m.id === id);
        const actions = [
          can('crm') && { id: 'crm:new', icon: UserPlus, label: 'Add a lead', hint: 'Walk-in, call or WhatsApp' },
          can('leaddesk') && { id: 'leaddesk', icon: BellRing, label: "Today's follow-ups", hint: o?.leads ? `${o.leads.followUpsDue} due` : 'Calls to make', count: badges['leaddesk'] },
          can('payments') && { id: 'payments', icon: CreditCard, label: 'Verify payments', hint: o?.payments ? `${o.payments.pendingCount} waiting` : 'UPI payments', count: badges['payments'] },
          can('photos') && { id: 'photos', icon: Upload, label: 'Upload photos', hint: 'Website gallery', count: badges['photos'] },
          can('blogs') && { id: 'blogs', icon: PenSquare, label: 'Write a blog post', hint: 'Publish to the website' },
        ].filter(Boolean) as { id: string; icon: React.ElementType; label: string; hint: string; count?: number }[];
        if (!actions.length) return null;
        return (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {actions.map(a => (
              <button key={a.id} onClick={() => go(a.id)} className="group flex flex-col items-start gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left sm:flex-row sm:items-center sm:gap-3 shadow-xs transition hover:border-[var(--crm-accent)]/40 hover:shadow-sm cursor-pointer">
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--crm-accent)] text-white">
                  <a.icon className="h-4 w-4" />
                  {!!a.count && <span className="absolute -right-1.5 -top-1.5 rounded-full bg-slate-900 px-1.5 text-[10px] font-semibold tabular-nums text-white ring-2 ring-white">{a.count}</span>}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-snug text-slate-900 sm:truncate">{a.label}</span>
                  <span className="block truncate text-xs text-slate-500">{a.hint}</span>
                </span>
              </button>
            ))}
          </div>
        );
      })()}

      {!o && <div className={`${card} flex items-center gap-2 text-sm text-slate-500`}><Loader2 className="h-4 w-4 animate-spin" /> Loading the dashboard…</div>}

      {o && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {o.leads && <Kpi i={i++} icon={Users} label="Open leads" value={o.leads.open} hint={`${o.leads.last30} new in 30 days`} onClick={() => go('crm')} />}
            {o.leads && <Kpi i={i++} icon={TrendingUp} label="Conversion" value={`${o.leads.conversionPct}%`} hint={`${o.leads.admitted} admitted of ${o.leads.total}`} onClick={() => go('crm')} />}
            {o.leads && <Kpi i={i++} icon={BellRing} label="Follow-ups due" value={o.leads.followUpsDue} hint={`${o.leads.unassigned} open leads unassigned`} onClick={() => go('leaddesk')} />}
            {o.payments && <Kpi i={i++} icon={IndianRupee} label="Verified payments" value={inr(o.payments.verifiedTotal)} hint={`${o.payments.pendingCount} waiting for verification`} onClick={() => go('payments')} />}
            {o.staff && <Kpi i={i++} icon={CalendarCheck} label="Staff present today" value={`${o.staff.present}/${o.staff.total}`} hint={o.staff.unmarked ? `${o.staff.unmarked} not marked yet` : 'Attendance complete'} onClick={() => go('staff')} />}
            {o.salary && <Kpi i={i++} icon={Wallet} label="Salary paid this month" value={inr(o.salary.paid)} hint={`of ${inr(o.salary.monthlyBill)} monthly bill`} onClick={() => go('staff')} />}
            {o.approvals && <Kpi i={i++} icon={ImageIcon} label="Photos to approve" value={o.approvals.photos} hint="Gallery photos" onClick={() => go('photos')} />}
            {o.branches !== undefined && <Kpi i={i++} icon={Building2} label="Active branches" value={o.branches} hint="Head office and partners" onClick={me.perms.includes('users') ? () => go('team') : undefined} />}
          </div>

          {o.leads && (
            <div className="grid gap-4 lg:grid-cols-3">
              <Panel title="Enquiries, last 14 days" className="lg:col-span-2" action={<span className="text-xs text-slate-500">{trendTotal} total</span>}>
                <TrendArea data={o.leads.trend} />
              </Panel>
              <Panel title="Leads by business line">
                <Donut data={(Object.entries(o.leads.byCategory) as [string, number][]).sort((a, b) => b[1] - a[1])} centerLabel="leads" />
              </Panel>
              <Panel title="Lead funnel" action={<button onClick={() => go('crm')} className="text-xs font-medium text-[var(--crm-accent)] hover:underline cursor-pointer">Open pipeline</button>}>
                {(() => {
                  // How many leads reached each stage (a lead at "Visit" has also been contacted, interested…)
                  const open = STAGE_ORDER.filter(s => s !== 'lost');
                  const stages = open.map((s, i) => ({ label: STAGE_LABEL[s], value: open.slice(i).reduce((n, k) => n + (o.leads!.byStage[k] || 0), 0) }));
                  const lost = o.leads!.byStage.lost || 0;
                  return (
                    <>
                      <Funnel stages={stages} total={o.leads!.total} onClick={() => go('crm')} />
                      {lost > 0 && <p className="mt-3 text-xs text-slate-500">{lost} lead{lost > 1 ? 's' : ''} marked lost</p>}
                    </>
                  );
                })()}
              </Panel>
              <Panel title="Lead sources">
                <Bars data={(Object.entries(o.leads.bySource) as [string, number][]).sort((a, b) => b[1] - a[1])} />
              </Panel>
              {o.staff && (
                <Panel title="Attendance today">
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    {([['Present', o.staff.present, 'text-emerald-700'], ['Absent', o.staff.absent, 'text-red-600'], ['On leave', o.staff.onLeave, 'text-amber-700'], ['Not marked', o.staff.unmarked, 'text-slate-500']] as const).map(([k, v, c]) => (
                      <div key={k} className="rounded-lg border border-slate-100 bg-slate-50 p-3"><dt className="text-xs text-slate-500">{k}</dt><dd className={`text-xl font-semibold tabular-nums ${c}`}>{v}</dd></div>
                    ))}
                  </dl>
                </Panel>
              )}
            </div>
          )}

          {!o.leads && o.staff && (
            <Panel title="Attendance today">
              <p className="text-sm text-slate-600">{o.staff.present} present · {o.staff.absent} absent · {o.staff.onLeave} on leave · {o.staff.unmarked} not marked</p>
            </Panel>
          )}

          {o.recent && (
            <Panel title="Recent activity" action={<button onClick={() => go('audit')} className="text-xs font-medium text-[var(--crm-accent)] hover:underline cursor-pointer">View full log</button>}>
              <ul className="-my-2 divide-y divide-slate-100">
                {o.recent.map(r => (
                  <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                    <span className="min-w-0"><span className="font-medium text-slate-900">{r.name}</span> <span className="text-slate-600">· {r.action}{r.detail ? ` — ${r.detail}` : ''}</span></span>
                    <time className="text-xs tabular-nums text-slate-400">{new Date(r.at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</time>
                  </li>
                ))}
                {!o.recent.length && <li className="py-2 text-sm text-slate-400">Nothing recorded yet.</li>}
              </ul>
            </Panel>
          )}

          {o.staff === undefined && o.leads === undefined && (
            <div className={`${card} flex items-center gap-3 text-sm text-slate-500`}><UserX className="h-5 w-5" /> Nothing to summarise for your role yet.</div>
          )}
        </>
      )}

      {/* Every section this user can open, in one place */}
      {modules.length > 0 && (
        <section aria-labelledby="modules-title" className="space-y-4 pt-2">
          <div>
            <h2 id="modules-title" className="text-sm font-semibold text-slate-900">All modules</h2>
            <p className="text-sm text-slate-500">Everything in your workspace. Numbers show items waiting for you.</p>
          </div>
          {groups.map(g => (
            <div key={g}>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{g}</div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {modules.filter(m => m.group === g).map(m => (
                  <button key={m.id} onClick={() => go(m.id)} className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-xs transition hover:border-slate-300 hover:shadow-sm cursor-pointer">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-[var(--crm-accent)]/10 group-hover:text-[var(--crm-accent)]"><m.icon className="h-4 w-4" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        {m.label}
                        {!!badges[m.id] && <span className="rounded-full bg-[var(--crm-accent)] px-1.5 py-px text-[10px] font-semibold tabular-nums text-white">{badges[m.id]}</span>}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{m.description}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-600" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
