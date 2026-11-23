import React from 'react';
import { Check } from 'lucide-react';

// Illustrations and screen mockups for the home page. Pure SVG and CSS (no image files), all decorative:
// the text next to each one says the same thing. Any numbers shown are sample data and labelled as such.

/* ---------- KinderOS: laptop window plus phone ---------- */
const NAV = ['Dashboard', 'Students', 'Admissions', 'Attendance', 'Fees', 'Staff', 'Reports'];
const LEADS = [
  { n: 'A. Sharma', s: 'New', c: 'bg-pink-100 text-pink-700' },
  { n: 'R. Iyer', s: 'Follow-up', c: 'bg-amber-100 text-amber-700' },
  { n: 'S. Khan', s: 'Visit booked', c: 'bg-emerald-100 text-emerald-700' },
];
const BARS = [38, 52, 44, 68, 60, 82, 74];

export const KinderOsMockup: React.FC = () => (
  <figure className="relative mx-auto w-full max-w-xl pb-10 pr-3 sm:pr-6">
    <div aria-hidden="true" className="relative">
      <div className="overflow-hidden rounded-2xl border border-white/20 bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 text-[10px] font-bold text-stone-500">KinderOS</span>
          <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[9px] font-semibold text-stone-400">Sample data</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[104px_1fr]">
          <div className="hidden space-y-0.5 bg-[#FFF6F9] p-2 sm:block">
            {NAV.map((x, i) => (
              <div key={x} className={`rounded-lg px-2 py-1.5 text-[10px] font-semibold ${i === 0 ? 'bg-[#E1007A] text-white' : 'text-stone-500'}`}>{x}</div>
            ))}
          </div>
          <div className="space-y-3 p-3">
            <div className="grid grid-cols-3 gap-2">
              {[['New enquiries', '18'], ['Present today', '92%'], ['Fees due', '7']].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-stone-100 bg-white p-2 shadow-sm">
                  <div className="text-[9px] font-semibold text-stone-400">{k}</div>
                  <div className="font-display text-lg font-extrabold leading-tight text-stone-900">{v}</div>
                  <svg viewBox="0 0 60 14" className="mt-1 h-3 w-full"><polyline fill="none" stroke="#E1007A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" points="0,11 10,8 20,9 30,5 40,6 50,2 60,3" /></svg>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-stone-100 p-2">
              <div className="mb-1 text-[9px] font-semibold text-stone-400">Admissions, last 7 weeks</div>
              <div className="flex h-14 items-end gap-1.5">
                {BARS.map((h, i) => <div key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-t ${i === BARS.length - 1 ? 'bg-[#E1007A]' : 'bg-pink-200'}`} />)}
              </div>
            </div>
            <div className="space-y-1.5">
              {LEADS.map(l => (
                <div key={l.n} className="flex items-center gap-2 rounded-lg bg-stone-50 px-2 py-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-200 text-[9px] font-bold text-stone-600">{l.n[0]}</span>
                  <span className="text-[10px] font-semibold text-stone-700">{l.n}</span>
                  <span className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-bold ${l.c}`}>{l.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* phone */}
      <div className="absolute -bottom-8 -right-1 w-28 rotate-3 rounded-[1.4rem] bg-stone-950 p-1.5 shadow-2xl ring-1 ring-white/20 sm:-right-4 sm:w-36">
        <div className="overflow-hidden rounded-[1.1rem] bg-white">
          <div className="bg-[#E1007A] px-2.5 py-2 text-[9px] font-bold text-white">Today’s attendance</div>
          <div className="space-y-1 p-2">
            {['Aarav', 'Diya', 'Kabir', 'Meera'].map((n, i) => (
              <div key={n} className="flex items-center gap-1.5 rounded-md bg-stone-50 px-1.5 py-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-pink-100 text-[8px] font-bold text-pink-700">{n[0]}</span>
                <span className="text-[9px] font-semibold text-stone-700">{n}</span>
                <span className={`ml-auto flex h-3.5 w-3.5 items-center justify-center rounded-full ${i === 2 ? 'bg-stone-200' : 'bg-emerald-500'}`}>{i !== 2 && <Check className="h-2.5 w-2.5 text-white" />}</span>
              </div>
            ))}
            <div className="mt-1 rounded-md bg-stone-900 py-1 text-center text-[8px] font-bold text-white">Message parents</div>
          </div>
        </div>
      </div>
    </div>
    <figcaption className="mt-10 text-center text-xs text-stone-400">Illustrative KinderOS screens. All names and numbers are sample data.</figcaption>
  </figure>
);

/* ---------- Cognitive Developmental Matrix: radar ---------- */
const AREAS = ['Play', 'Socio-emotional', 'Wellness', 'Language', 'Literacy', 'Cognitive'];
const SAMPLE = [4, 3, 5, 4, 3, 4];
const pt = (i: number, level: number, r = 24) => {
  const a = (-90 + i * 60) * Math.PI / 180;
  return [Math.cos(a) * level * r, Math.sin(a) * level * r] as const;
};
const poly = (levels: number[]) => levels.map((l, i) => pt(i, l).map(n => n.toFixed(1)).join(',')).join(' ');

export const CdmRadar: React.FC = () => (
  <figure className="mx-auto w-full max-w-md">
    <svg role="img" aria-label="Sample radar chart of the six development areas, each rated 1 to 5" viewBox="-210 -152 420 322" className="w-full">
      {[1, 2, 3, 4, 5].map(l => <polygon key={l} points={poly(Array(6).fill(l))} fill={l % 2 ? '#FFF6F9' : '#fff'} stroke="#f3c6dc" strokeWidth="1" />)}
      {AREAS.map((_, i) => { const [x, y] = pt(i, 5); return <line key={i} x1="0" y1="0" x2={x} y2={y} stroke="#f3c6dc" strokeWidth="1" />; })}
      <polygon points={poly(SAMPLE)} fill="rgba(225,0,122,0.22)" stroke="#E1007A" strokeWidth="2.5" strokeLinejoin="round" />
      {SAMPLE.map((l, i) => { const [x, y] = pt(i, l); return <circle key={i} cx={x} cy={y} r="4" fill="#E1007A" stroke="#fff" strokeWidth="1.5" />; })}
      {AREAS.map((a, i) => {
        const [x, y] = pt(i, 5.9);
        const anchor = Math.abs(x) < 4 ? 'middle' : x > 0 ? 'start' : 'end';
        return <text key={a} x={x} y={y + 4} textAnchor={anchor} className="fill-stone-700" style={{ fontSize: 12, fontWeight: 700 }}>{a}</text>;
      })}
    </svg>
    <figcaption className="text-center text-xs text-stone-400">Sample summary, each area rated 1 to 5. Not a real child’s record.</figcaption>
  </figure>
);

/* ---------- Franchise model illustrations ---------- */
const School: React.FC<{ x: number; fill: string; roof: string; door?: string; win?: string; scale?: number }> = ({ x, fill, roof, door = '#E1007A', win = '#8fd0f7', scale = 1 }) => (
  <g transform={`translate(${x} ${96 - 56 * scale}) scale(${scale})`}>
    <rect x="0" y="22" width="76" height="34" rx="3" fill={fill} stroke="rgba(0,0,0,.08)" />
    <path d="M-4 24 L38 4 L80 24 Z" fill={roof} />
    <rect x="31" y="36" width="14" height="20" rx="2" fill={door} />
    <rect x="8" y="32" width="14" height="12" rx="2" fill={win} />
    <rect x="54" y="32" width="14" height="12" rx="2" fill={win} />
    <rect x="8" y="37.5" width="14" height="1.2" fill="#fff" fillOpacity=".7" /><rect x="54" y="37.5" width="14" height="1.2" fill="#fff" fillOpacity=".7" />
  </g>
);

export const ModelArt: React.FC<{ kind: 'new' | 'rebrand' | 'daycare' }> = ({ kind }) => (
  <svg aria-hidden="true" viewBox="0 0 240 110" className="h-28 w-full rounded-2xl">
    <defs>
      <linearGradient id={`sky-${kind}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={kind === 'daycare' ? '#FFF1B8' : kind === 'rebrand' ? '#E4F0FF' : '#FFE0EE'} />
        <stop offset="1" stopColor="#fff" />
      </linearGradient>
    </defs>
    <rect width="240" height="110" fill={`url(#sky-${kind})`} />
    <rect y="94" width="240" height="16" fill={kind === 'daycare' ? '#cfe9c4' : '#d9eccb'} />
    {kind === 'new' && (<>
      <School x={82} fill="#FFF3D6" roof="#E1007A" scale={1.1} />
      <g fill="#FFD400"><path d="M30 26 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" /><path d="M200 18 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" /></g>
      <path d="M52 94 q4 -22 -2 -30 M52 78 q-8 -2 -10 -10 M52 72 q8 -2 10 -10" stroke="#5aa845" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>)}
    {kind === 'rebrand' && (<>
      <School x={22} fill="#e5e7eb" roof="#9ca3af" door="#9ca3af" win="#fff" scale={0.8} />
      <path d="M96 62 h30 m-8 -8 l8 8 -8 8" stroke="#E1007A" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <School x={138} fill="#FFF3D6" roof="#E1007A" scale={1} />
      <g fill="#FFD400"><path d="M208 22 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" /></g>
    </>)}
    {kind === 'daycare' && (<>
      <School x={78} fill="#FFF3D6" roof="#E1007A" scale={1} />
      <circle cx="38" cy="30" r="12" fill="#FFD400" />
      <g stroke="#FFD400" strokeWidth="2.5" strokeLinecap="round">{[0, 45, 90, 135, 180, 225, 270, 315].map(a => { const r = a * Math.PI / 180; return <line key={a} x1={38 + Math.cos(r) * 17} y1={30 + Math.sin(r) * 17} x2={38 + Math.cos(r) * 22} y2={30 + Math.sin(r) * 22} />; })}</g>
      <path d="M202 18 a14 14 0 1 0 12 22 a11 11 0 1 1 -12 -22z" fill="#5b4fb3" />
      <circle cx="176" cy="26" r="2" fill="#5b4fb3" /><circle cx="224" cy="52" r="1.6" fill="#5b4fb3" />
    </>)}
  </svg>
);

/* ---------- WhatsApp: the message that is ready to send ---------- */
export const WhatsAppMockup: React.FC<{ message: string }> = ({ message }) => (
  <figure className="mx-auto w-full max-w-[260px]">
    <div aria-hidden="true" className="rounded-[2.2rem] bg-stone-950 p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/15">
      <div className="overflow-hidden rounded-[1.8rem] bg-[#ECE5DD]">
        <div className="flex items-center gap-2 bg-[#075E54] px-3 py-2.5 text-white">
          <span className="text-sm">‹</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-[#E1007A]">K</span>
          <div className="leading-tight"><div className="text-[11px] font-bold">Kinderbee</div><div className="text-[9px] text-emerald-100">WhatsApp</div></div>
        </div>
        <div className="min-h-[190px] space-y-2 p-3">
          <div className="ml-auto max-w-[88%] rounded-xl rounded-tr-sm bg-[#DCF8C6] px-2.5 py-2 text-[11px] leading-snug text-stone-800 shadow-sm">
            {message}
            <div className="mt-1 text-right text-[8px] text-stone-500">ready to send ✓</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#F0F0F0] px-2 py-2">
          <div className="flex-1 rounded-full bg-white px-3 py-1.5 text-[10px] text-stone-400">Type a message</div>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#128C7E] text-[11px] text-white">➤</span>
        </div>
      </div>
    </div>
    <figcaption className="mt-3 text-center text-xs text-white/60">“WhatsApp us” opens a chat with this message ready.</figcaption>
  </figure>
);
