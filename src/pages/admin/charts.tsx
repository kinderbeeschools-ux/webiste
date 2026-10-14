import React, { useEffect, useRef, useState } from 'react';
import { ENQUIRY_CATEGORIES } from '../../data/enquiry';

// Small, dependency-free charts for the CRM dashboard.
// Colour rules: one series = the brand accent; categories = a fixed, colour-blind-checked order that
// follows the entity (Admission is always blue, Franchise always orange…), never its rank.
// Every chart has a hover tooltip and text labels, so nothing is read from colour alone.

// Reference categorical palette, slots 1-7 (validated adjacent-pair order)
const SERIES = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7'];
export const categoryColor = (short: string) => {
  const i = ENQUIRY_CATEGORIES.findIndex(c => c.short === short);
  return SERIES[(i < 0 ? ENQUIRY_CATEGORIES.length - 1 : i) % SERIES.length];
};

const fmtDay = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

// ---------------------------------------------------------------------------
// Area chart with crosshair + tooltip (one series over time)
// ---------------------------------------------------------------------------
export const TrendArea: React.FC<{ data: { date: string; count: number }[]; label?: string; unit?: [string, string] }> = ({ data, label = 'Enquiries', unit = ['enquiry', 'enquiries'] }) => {
  const [hover, setHover] = useState<number | null>(null);
  // Drawn at the real width so text stays 10px on phones and desktops alike
  const wrapRef = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(640);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(240, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = 180, PAD_L = 28, PAD_R = 8, PAD_T = 12, PAD_B = 24;
  const max = Math.max(1, ...data.map(d => d.count));
  const niceMax = max <= 4 ? 4 : Math.ceil(max / 4) * 4;
  const x = (i: number) => PAD_L + (i * (W - PAD_L - PAD_R)) / Math.max(1, data.length - 1);
  const y = (v: number) => PAD_T + (H - PAD_T - PAD_B) * (1 - v / niceMax);
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.count).toFixed(1)}`).join(' ');
  const area = `${line} L${x(data.length - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;
  const ticks = [0, niceMax / 2, niceMax];
  const every = Math.max(1, Math.ceil(data.length / Math.floor((W - PAD_L) / 48))); // about one date label per 48px
  const h = hover !== null ? data[hover] : null;

  return (
    <div ref={wrapRef} className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block max-w-full" role="img" aria-label={`${label} per day, last ${data.length} days`}
        onMouseLeave={() => setHover(null)}
        onMouseMove={e => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round(((px - PAD_L) / (W - PAD_L - PAD_R)) * (data.length - 1));
          setHover(Math.max(0, Math.min(data.length - 1, i)));
        }}>
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--crm-accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--crm-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map(t => (
          <g key={t}>
            <line x1={PAD_L} x2={W - PAD_R} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeDasharray={t ? '3 4' : undefined} />
            <text x={PAD_L - 6} y={y(t) + 3.5} textAnchor="end" className="fill-slate-400 text-[10px] tabular-nums">{t}</text>
          </g>
        ))}
        <path d={area} fill="url(#trend-fill)" />
        <path d={line} fill="none" stroke="var(--crm-accent)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => ((data.length - 1 - i) % every === 0) && (
          <text key={d.date} x={x(i)} y={H - 6} textAnchor={i === data.length - 1 ? 'end' : i === 0 ? 'start' : 'middle'} className="fill-slate-400 text-[10px]">{fmtDay(d.date)}</text>
        ))}
        {h && hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD_T} y2={y(0)} stroke="#94a3b8" strokeDasharray="2 3" />
            <circle cx={x(hover)} cy={y(h.count)} r={5} fill="white" stroke="var(--crm-accent)" strokeWidth={2} />
          </g>
        )}
      </svg>
      {h && hover !== null && (
        <div className="pointer-events-none absolute top-0 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-md"
          style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > data.length / 2 ? '-105%' : '5%'})` }}>
          <div className="font-medium text-slate-500">{fmtDay(h.date)}</div>
          <div className="font-semibold tabular-nums text-slate-900">{h.count} {h.count === 1 ? unit[0] : unit[1]}</div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Donut + legend (share of a whole, few categories)
// ---------------------------------------------------------------------------
export const Donut: React.FC<{ data: [string, number][]; centerLabel: string }> = ({ data, centerLabel }) => {
  const [hover, setHover] = useState<string | null>(null);
  const total = data.reduce((n, [, v]) => n + v, 0);
  if (!total) return <p className="text-sm text-slate-400">No data yet.</p>;
  const R = 52, STROKE = 18, C = 2 * Math.PI * R, GAP = data.length > 1 ? 2 : 0;
  let offset = 0;
  const shown = hover ? data.find(d => d[0] === hover) : null;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <svg viewBox="0 0 140 140" className="h-36 w-36 shrink-0 -rotate-90" role="img" aria-label={`${centerLabel}: ${data.map(([k, v]) => `${k} ${v}`).join(', ')}`}>
        <circle cx="70" cy="70" r={R} fill="none" stroke="#f1f5f9" strokeWidth={STROKE} />
        {data.map(([k, v]) => {
          const len = (v / total) * C;
          const seg = (
            <circle key={k} cx="70" cy="70" r={R} fill="none" stroke={categoryColor(k)} strokeWidth={hover === k ? STROKE + 4 : STROKE}
              strokeDasharray={`${Math.max(0, len - GAP)} ${C}`} strokeDashoffset={-offset}
              className="cursor-pointer transition-[stroke-width]" onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)}>
              <title>{`${k}: ${v} (${Math.round((v / total) * 100)}%)`}</title>
            </circle>
          );
          offset += len;
          return seg;
        })}
        <g className="rotate-90" style={{ transformOrigin: '70px 70px' }}>
          <text x="70" y="68" textAnchor="middle" className="fill-slate-900 text-[22px] font-semibold tabular-nums">{shown ? shown[1] : total}</text>
          <text x="70" y="84" textAnchor="middle" className="fill-slate-500 text-[9px]">{shown ? shown[0] : centerLabel}</text>
        </g>
      </svg>
      <ul className="w-full space-y-1.5 text-sm">
        {data.map(([k, v]) => (
          <li key={k} onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)}
            className={`flex items-center gap-2 rounded-md px-1.5 py-0.5 transition ${hover === k ? 'bg-slate-50' : ''}`}>
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: categoryColor(k) }} />
            <span className="flex-1 truncate text-slate-600">{k}</span>
            <span className="font-medium tabular-nums text-slate-900">{v}</span>
            <span className="w-10 text-right text-xs tabular-nums text-slate-400">{Math.round((v / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Funnel: how far leads have got, stage by stage (count + % of all leads)
// ---------------------------------------------------------------------------
export const Funnel: React.FC<{ stages: { label: string; value: number }[]; total: number; onClick?: () => void }> = ({ stages, total, onClick }) => {
  if (!total) return <p className="text-sm text-slate-400">No leads yet.</p>;
  return (
    <ol className="space-y-1.5">
      {stages.map(s => {
        const pct = Math.round((s.value / total) * 100);
        return (
          <li key={s.label}>
            <button type="button" onClick={onClick} title={`${s.label}: ${s.value} lead${s.value === 1 ? '' : 's'} (${pct}% of all)`}
              className="group grid w-full grid-cols-[96px_1fr_64px] items-center gap-3 rounded-md text-left text-sm cursor-pointer">
              <span className="truncate text-slate-600 group-hover:text-slate-900">{s.label}</span>
              <span className="flex h-6 items-center justify-center rounded bg-slate-50">
                <span className="h-full rounded bg-[var(--crm-accent)] transition-[width] duration-500 group-hover:brightness-95"
                  style={{ width: `${Math.max(s.value ? 4 : 0, pct)}%`, opacity: s.value ? 1 : 0 }} />
              </span>
              <span className="text-right tabular-nums"><span className="font-medium text-slate-900">{s.value}</span> <span className="text-xs text-slate-400">{pct}%</span></span>
            </button>
          </li>
        );
      })}
    </ol>
  );
};
