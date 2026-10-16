import React from 'react';
import { motion } from 'motion/react';
import { Landmark, Coins, School, Building2, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';

// Illustrations drawn for the Joint Ventures page (no photographs borrowed from other pages).

const GOLD = '#e2c478';
const GOLD_DEEP = '#B48735';
const GREEN = '#073D37';
const loop = (duration: number, delay = 0) => ({ duration, delay, repeat: Infinity, ease: 'easeInOut' as const });

// ---------------------------------------------------------------------------
// Pillar artwork for "Why partner with KIPS" (sits behind the card text)
// ---------------------------------------------------------------------------
export const PillarArt: React.FC<{ kind: 'map' | 'capital' | 'build' }> = ({ kind }) => (
  <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <pattern id={`pg-${kind}`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#fff" strokeOpacity=".06" /></pattern>
    </defs>
    <rect width="400" height="300" fill={`url(#pg-${kind})`} />
    {kind === 'map' && (
      <g>
        {/* Sites across a region, linked by routes */}
        {[[70, 210], [150, 120], [250, 170], [320, 80], [340, 230]].map(([x, y], i, a) => (
          <g key={i}>
            {i > 0 && <motion.path d={`M${a[i - 1][0]} ${a[i - 1][1]} Q ${(a[i - 1][0] + x) / 2} ${Math.min(a[i - 1][1], y) - 50} ${x} ${y}`} fill="none" stroke={GOLD} strokeOpacity=".55" strokeWidth="1.5" strokeDasharray="5 7"
              animate={{ strokeDashoffset: [0, -48] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />}
            <motion.circle cx={x} cy={y} r="18" fill={GOLD} fillOpacity=".12" animate={{ r: [10, 26, 10], opacity: [0.6, 0, 0.6] }} transition={loop(3, i * 0.5)} />
            <path d={`M${x} ${y + 2} c-9 -12 -14 -18 -14 -25 a14 14 0 0 1 28 0 c0 7 -5 13 -14 25z`} fill={GOLD} />
            <circle cx={x} cy={y - 23} r="5" fill={GREEN} />
          </g>
        ))}
      </g>
    )}
    {kind === 'capital' && (
      <g>
        {[60, 95, 130, 165, 200].map((h, i) => (
          <motion.rect key={i} x={70 + i * 56} width="34" rx="4" fill={GOLD} fillOpacity={0.25 + i * 0.13}
            initial={{ y: 260, height: 0 }} whileInView={{ y: 260 - h, height: h }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.12, duration: 0.9 }} />
        ))}
        <motion.path d="M60 205 L126 170 L182 182 L238 120 L294 98 L350 52" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="2.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 1.4 }} />
        {[0, 1, 2].map(i => (
          <motion.g key={i} animate={{ y: [0, -8, 0] }} transition={loop(3 + i, i * 0.4)}>
            <ellipse cx={330 - i * 22} cy={150 + i * 14} rx="16" ry="6" fill={GOLD} />
            <ellipse cx={330 - i * 22} cy={146 + i * 14} rx="16" ry="6" fill="#f3dfa6" />
          </motion.g>
        ))}
      </g>
    )}
    {kind === 'build' && (
      <g>
        {/* Isometric blocks stacking into a building */}
        {[[200, 230, 0], [160, 207, 1], [240, 207, 2], [200, 184, 3], [200, 138, 4], [160, 161, 5], [240, 161, 6]].map(([x, y, i]) => (
          <motion.g key={i} initial={{ opacity: 0, y: -40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 * i, duration: 0.6 }}>
            <path d={`M${x} ${y - 23} l40 23 l-40 23 l-40 -23z`} fill="#f3dfa6" />
            <path d={`M${x - 40} ${y} l40 23 v24 l-40 -23z`} fill={GOLD_DEEP} />
            <path d={`M${x + 40} ${y} l-40 23 v24 l40 -23z`} fill={GOLD} />
          </motion.g>
        ))}
        <motion.line x1="320" y1="60" x2="320" y2="230" stroke="#fff" strokeOpacity=".5" strokeWidth="2" />
        <motion.line x1="320" y1="62" x2="250" y2="62" stroke="#fff" strokeOpacity=".5" strokeWidth="2" />
        <motion.line x1="262" y1="62" x2="262" y2="100" stroke={GOLD} strokeWidth="1.5" animate={{ y2: [92, 112, 92] }} transition={loop(3)} />
      </g>
    )}
  </svg>
);

// ---------------------------------------------------------------------------
// How a JV comes together: three parties flow into one project, KIPS facilitates
// ---------------------------------------------------------------------------
const PARTIES = [
  { icon: Landmark, t: 'Landowner', s: 'Land or premises', x: 15 },
  { icon: Coins, t: 'Investor / developer', s: 'Capital & construction', x: 50 },
  { icon: School, t: 'Operator', s: 'Runs the facility', x: 85 },
];

export const JvDiagram: React.FC = () => (
  <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8" style={{ background: `linear-gradient(140deg, ${GREEN}, #04211e)` }} role="img" aria-label="Diagram: a landowner, an investor or developer and an operator combine into one joint-venture project, facilitated by KIPS">
    <div aria-hidden="true" className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:32px_32px]" />
    <div className="relative grid grid-cols-3 gap-2 sm:gap-4">
      {PARTIES.map(({ icon: Icon, t, s }, i) => (
        <motion.div key={t} className="rounded-2xl border border-white/15 bg-white/[0.06] p-3 text-center text-white backdrop-blur sm:p-4"
          initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}>
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#B48735] sm:h-12 sm:w-12"><Icon className="h-5 w-5" /></span>
          <div className="mt-2 text-xs font-bold leading-tight sm:text-sm">{t}</div>
          <div className="mt-0.5 hidden text-[11px] text-white/60 sm:block">{s}</div>
        </motion.div>
      ))}
    </div>
    {/* Flow lines */}
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="relative h-16 w-full sm:h-20" aria-hidden="true">
      {PARTIES.map(p => (
        <motion.path key={p.x} d={`M${p.x} 0 C ${p.x} 22, 50 18, 50 40`} fill="none" stroke={GOLD} strokeWidth="0.6" strokeDasharray="1.5 2" vectorEffect="non-scaling-stroke"
          animate={{ strokeDashoffset: [0, -14] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }} />
      ))}
    </svg>
    <motion.div className="relative mx-auto flex max-w-xs items-center gap-3 rounded-2xl bg-[#e2c478] p-4 text-[#073D37] shadow-[0_0_60px_rgba(226,196,120,.35)]"
      initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6 }}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#073D37] text-[#e2c478]"><Building2 className="h-5 w-5" /></span>
      <div>
        <div className="text-sm font-extrabold">Joint-venture project</div>
        <div className="text-xs">Contributions, roles and returns agreed in writing</div>
      </div>
    </motion.div>
    <div className="relative mt-5 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#e2c478]">
      <motion.span className="h-2 w-2 rounded-full bg-[#e2c478]" animate={{ opacity: [1, 0.3, 1] }} transition={loop(1.6)} />
      KIPS sources, connects and coordinates
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Document review: files moving through checks
// ---------------------------------------------------------------------------
const DOCS = ['Title & ownership', 'Khata & tax receipts', 'Permissions & use', 'Survey & boundaries', 'Written commercial terms'];

export const DocReviewVisual: React.FC = () => (
  <div className="relative grid gap-6 overflow-hidden rounded-3xl p-6 sm:grid-cols-[1fr_1.1fr] sm:p-10" style={{ background: `linear-gradient(140deg, ${GREEN}, #04211e)` }} role="img" aria-label="Illustration: property documents being reviewed and checked one by one">
    <div aria-hidden="true" className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:32px_32px]" />
    {/* Stacked files */}
    <div className="relative mx-auto h-56 w-48 sm:h-64 sm:w-56" aria-hidden="true">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute inset-0 rounded-2xl border border-white/20 bg-white p-5 shadow-2xl"
          style={{ rotate: (i - 1) * 6, zIndex: i }}
          initial={{ y: 30, opacity: 0 }} whileInView={{ y: i * -6, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}>
          <FileText className="h-6 w-6 text-[#B48735]" />
          {[70, 90, 60, 80, 50].map((w, j) => <div key={j} className="mt-3 h-2 rounded-full bg-[#073D37]/10" style={{ width: `${w}%` }} />)}
          {i === 2 && (
            <motion.div className="absolute bottom-4 right-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#B48735] text-[#B48735]"
              initial={{ scale: 2, opacity: 0, rotate: -20 }} whileInView={{ scale: 1, opacity: 1, rotate: -12 }} viewport={{ once: true }} transition={{ delay: 0.9, type: 'spring', stiffness: 220 }}>
              <ShieldCheck className="h-7 w-7" />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
    {/* Checks ticking off */}
    <ul className="relative space-y-3 self-center">
      {DOCS.map((d, i) => (
        <motion.li key={d} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white"
          initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.15 }}>
          <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 + i * 0.15, type: 'spring' }}>
            <CheckCircle2 className="h-5 w-5 text-[#e2c478]" />
          </motion.span>
          {d}
        </motion.li>
      ))}
    </ul>
  </div>
);

// ---------------------------------------------------------------------------
// Animated contour backdrop (for dark call-to-action sections)
// ---------------------------------------------------------------------------
export const ContourBackdrop: React.FC = () => (
  <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
    <rect width="1200" height="600" fill={GREEN} />
    {Array.from({ length: 14 }, (_, i) => (
      <motion.path key={i} fill="none" stroke={i % 3 === 0 ? GOLD : '#ffffff'} strokeOpacity={i % 3 === 0 ? 0.28 : 0.08} strokeWidth="1.2"
        d={`M-50 ${120 + i * 30} C 250 ${40 + i * 30}, 450 ${220 + i * 30}, 700 ${110 + i * 30} S 1100 ${60 + i * 30}, 1260 ${150 + i * 30}`}
        animate={{ x: [0, i % 2 ? 30 : -30, 0] }} transition={loop(12 + i)} />
    ))}
    <radialGradient id="cta-glow"><stop offset="0%" stopColor={GOLD} stopOpacity=".25" /><stop offset="100%" stopColor={GOLD} stopOpacity="0" /></radialGradient>
    <circle cx="600" cy="300" r="380" fill="url(#cta-glow)" />
  </svg>
);
