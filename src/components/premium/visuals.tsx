import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { EASE } from '../Motion';
import { Bee } from '../Doodles';

// Visual building blocks for the buyer-guide sections: photos, timelines and small infographics.
// Photos are Kinderbee's own (compressed copies in /public/visuals). Reveals are driven by a parent
// in-view trigger, because an element hidden by its own clip-path never registers as "in view".

export type Img = { src: string; alt: string };

const reveal = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  show: (i = 0) => ({ clipPath: 'inset(0 0 0% 0)', transition: { duration: 1.1, delay: i * 0.12, ease: EASE } }),
};
const pop = {
  hidden: { opacity: 0, y: 16, scale: 0.92 },
  show: (i = 0) => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, delay: 0.5 + i * 0.15, ease: EASE } }),
};
const view = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 } } as const;

const Photo: React.FC<Img & { i?: number; className?: string; children?: React.ReactNode }> = ({ src, alt, i = 0, className = '', children }) => (
  <motion.div custom={i} variants={reveal} className={`group relative overflow-hidden rounded-2xl ${className}`}>
    <img src={src} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
    {children}
  </motion.div>
);

// ---------------------------------------------------------------------------
// One large photo and two smaller ones, with floating fact chips
// ---------------------------------------------------------------------------
export const PhotoMosaic: React.FC<{
  main: Img; side: [Img, Img]; chips?: { icon: LucideIcon; label: string }[]; accent: string; className?: string;
}> = ({ main, side, chips = [], accent, className = '' }) => (
  <motion.div {...view} className={`relative grid h-[300px] grid-cols-3 grid-rows-2 gap-2.5 sm:h-[440px] sm:gap-3 ${className}`}>
    <Photo {...main} className="col-span-2 row-span-2" />
    <Photo {...side[0]} i={1} />
    <Photo {...side[1]} i={2} />
    {chips.map(({ icon: Icon, label }, i) => (
      <motion.span
        key={label} custom={i} variants={pop}
        className={`absolute z-10 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-[11px] font-bold text-stone-900 shadow-xl backdrop-blur sm:px-4 sm:text-xs ${
          ['left-3 bottom-4 sm:left-5 sm:bottom-6', 'right-3 top-3 sm:right-[36%] sm:top-5', 'left-3 top-3 sm:left-5 sm:top-5'][i % 3]
        }`}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full text-white" style={{ background: accent }}><Icon className="h-3.5 w-3.5" /></span>
        {label}
      </motion.span>
    ))}
  </motion.div>
);

// ---------------------------------------------------------------------------
// Row of captioned photos
// ---------------------------------------------------------------------------
export const PhotoStrip: React.FC<{ items: (Img & { caption: string })[] }> = ({ items }) => (
  <motion.div {...view} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
    {items.map((it, i) => (
      <Photo key={it.src} {...it} i={i} className="aspect-[4/5]">
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-3 pt-10 sm:p-4 sm:pt-14">
          <span className="text-sm font-bold text-white sm:text-base">{it.caption}</span>
        </div>
      </Photo>
    ))}
  </motion.div>
);

// ---------------------------------------------------------------------------
// Vertical timeline: alternating sides on desktop, a line that fills as you scroll
// ---------------------------------------------------------------------------
export const VisualTimeline: React.FC<{
  steps: { t: string; d: string; icon: LucideIcon }[];
  accent: string; ink: string; muted: string; line: string; card: string; dark?: boolean;
}> = ({ steps, accent, ink, muted, line, card, dark }) => {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  return (
    <ol ref={ref} className="relative space-y-6 lg:space-y-4">
      <span aria-hidden="true" className="absolute bottom-6 left-6 top-6 w-0.5 -translate-x-1/2 lg:left-1/2" style={{ background: line }} />
      <motion.span aria-hidden="true" className="absolute bottom-6 left-6 top-6 w-0.5 origin-top -translate-x-1/2 lg:left-1/2" style={{ scaleY: fill, background: `linear-gradient(${accent}, ${accent}aa)` }} />
      {steps.map(({ t, d, icon: Icon }, i) => {
        const right = i % 2 === 1;
        return (
          <motion.li key={t} className="relative pl-16 lg:grid lg:grid-cols-2 lg:gap-20 lg:pl-0" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
            <motion.span
              variants={{ hidden: { scale: 0.4, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: EASE } } }}
              className="absolute left-6 top-1 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full shadow-lg ring-4 lg:left-1/2"
              style={{ background: accent, color: dark ? '#17050F' : '#fff', ['--tw-ring-color' as any]: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)' }}
            >
              <Icon className="h-5 w-5" />
            </motion.span>
            <motion.div
              variants={{ hidden: { opacity: 0, x: right ? 40 : -40 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } } }}
              className={`rounded-2xl border p-5 ${right ? 'lg:col-start-2' : 'lg:col-start-1 lg:text-right'}`}
              style={{ background: card, borderColor: line }}
            >
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: accent }}>Step {String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-1 text-base font-bold sm:text-lg" style={{ color: ink }}>{t}</h3>
              <p className="mt-1 text-[13px] leading-relaxed sm:text-sm" style={{ color: muted }}>{d}</p>
            </motion.div>
          </motion.li>
        );
      })}
    </ol>
  );
};

// ---------------------------------------------------------------------------
// Small infographics
// ---------------------------------------------------------------------------
const Panel: React.FC<{ title: string; caption: string; ink: string; muted: string; card: string; line: string; children: React.ReactNode }> = ({ title, caption, ink, muted, card, line, children }) => (
  <motion.figure {...view} variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
    className="flex flex-col rounded-2xl border p-5 sm:p-6" style={{ background: card, borderColor: line }}>
    <div className="flex flex-1 items-center justify-center py-2">{children}</div>
    <figcaption className="mt-4">
      <div className="text-base font-bold" style={{ color: ink }}>{title}</div>
      <div className="mt-0.5 text-[13px] leading-relaxed" style={{ color: muted }}>{caption}</div>
    </figcaption>
  </motion.figure>
);

type Tone = { accent: string; ink: string; muted: string; card: string; line: string };

/** A price range drawn on a track (only the published minimum and maximum, nothing in between) */
export const RangeVisual: React.FC<Tone & { min: string; max: string; title: string; caption: string }> = ({ min, max, title, caption, ...t }) => (
  <Panel title={title} caption={caption} {...t}>
    <div className="w-full">
      <div className="mb-3 flex justify-between font-serif text-2xl font-bold sm:text-3xl" style={{ color: t.ink, fontFamily: 'Georgia, serif' }}>
        <span>{min}</span><span>{max}</span>
      </div>
      <div className="relative h-4 rounded-full" style={{ background: t.line }}>
        <motion.div className="absolute inset-y-0 left-[6%] right-[6%] origin-left rounded-full" style={{ background: `linear-gradient(90deg, ${t.accent}99, ${t.accent})` }}
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 1.2, ease: EASE }} />
        {['left-[6%]', 'right-[6%]'].map(pos => (
          <span key={pos} className={`absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-4 bg-white shadow ${pos} ${pos.startsWith('left') ? '-translate-x-1/2' : 'translate-x-1/2'}`} style={{ borderColor: t.accent }} />
        ))}
      </div>
      <div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-wider" style={{ color: t.muted }}><span>From</span><span>Up to</span></div>
    </div>
  </Panel>
);

/** ₹0 royalty with a full "100% stays with you" ring */
export const KeepAllVisual: React.FC<Tone & { title: string; caption: string }> = ({ title, caption, ...t }) => {
  const R = 52, C = 2 * Math.PI * R;
  return (
    <Panel title={title} caption={caption} {...t}>
      <div className="flex items-center gap-5">
        <div className="relative h-32 w-32">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r={R} fill="none" stroke={t.line} strokeWidth="10" />
            <motion.circle cx="60" cy="60" r={R} fill="none" stroke={t.accent} strokeWidth="10" strokeLinecap="round" strokeDasharray={C}
              initial={{ strokeDashoffset: C }} whileInView={{ strokeDashoffset: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 1.4, ease: EASE }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold" style={{ color: t.ink }}>100%</span>
            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: t.muted }}>tuition</span>
          </div>
        </div>
        <div className="text-center">
          <motion.div className="kb-float flex h-16 w-16 items-center justify-center rounded-full text-xl font-extrabold shadow-lg"
            style={{ background: `radial-gradient(circle at 35% 30%, #fff6c9, ${t.accent})`, color: '#3b2410' }}>₹0</motion.div>
          <div className="mt-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: t.muted }}>royalty / month</div>
        </div>
      </div>
    </Panel>
  );
};

/** Illustrative preschool floor plan that draws itself in */
export const FloorPlanVisual: React.FC<Tone & { title: string; caption: string; area: string }> = ({ title, caption, area, ...t }) => {
  const draw = { hidden: { pathLength: 0, opacity: 0 }, show: (i = 0) => ({ pathLength: 1, opacity: 1, transition: { duration: 1, delay: i * 0.12, ease: EASE } }) };
  const rooms: [number, number, number, number, string][] = [
    [10, 10, 90, 70, 'Classroom'], [100, 10, 90, 70, 'Classroom'], [10, 80, 70, 50, 'Activity'], [80, 80, 60, 50, 'Reading'], [140, 80, 50, 50, 'Office'],
  ];
  return (
    <Panel title={title} caption={caption} {...t}>
      <motion.svg {...view} viewBox="0 0 300 145" className="w-full" role="img" aria-label={`Illustrative preschool layout, ${area}`}>
        {rooms.map(([x, y, w, h, label], i) => (
          <g key={i}>
            <motion.rect custom={i} variants={draw} x={x} y={y} width={w} height={h} rx="3" fill={`${t.accent}12`} stroke={t.ink} strokeOpacity="0.55" strokeWidth="1.5" />
            <motion.text custom={i} variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.6 + i * 0.1 } } }} x={x + w / 2} y={y + h / 2 + 3} textAnchor="middle" fontSize="9" fontWeight="700" fill={t.muted}>{label}</motion.text>
          </g>
        ))}
        {/* outdoor play */}
        <motion.rect custom={6} variants={draw} x="200" y="10" width="92" height="120" rx="10" fill="#22c55e1f" stroke="#16a34a" strokeDasharray="4 4" strokeWidth="1.5" />
        {[[222, 40], [268, 34], [246, 98]].map(([cx, cy], i) => (
          <motion.circle key={i} variants={{ hidden: { scale: 0 }, show: { scale: 1, transition: { delay: 0.9 + i * 0.1, type: 'spring' } } }} cx={cx} cy={cy} r="9" fill="#22c55e" fillOpacity="0.55" />
        ))}
        <motion.text variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 1.1 } } }} x="246" y="72" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4ade80">Outdoor play</motion.text>
        <text x="150" y="143" textAnchor="middle" fontSize="9" fontWeight="800" fill={t.accent}>{area}</text>
      </motion.svg>
    </Panel>
  );
};

/** A tilted sample certificate with a light sweep */
export const CertificateVisual: React.FC<{ src: string; label: string; accent: string }> = ({ src, label, accent }) => (
  <motion.figure {...view} variants={{ hidden: { opacity: 0, rotate: -6, y: 30 }, show: { opacity: 1, rotate: -2.5, y: 0, transition: { duration: 0.9, ease: EASE } } }}
    className="group relative mx-auto w-full max-w-sm">
    <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-3 rounded-xl" style={{ background: `${accent}33` }} />
    <div className="relative overflow-hidden rounded-xl border border-white bg-white p-2 shadow-2xl transition-transform duration-500 group-hover:rotate-0 group-hover:scale-[1.02]">
      <img src={src} alt="Sample Finnishway Academy certificate of course completion" loading="lazy" decoding="async" className="w-full rounded-md" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent transition-[left] duration-1000 group-hover:left-[130%]" />
    </div>
    <figcaption className="mt-4 text-center text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>{label}</figcaption>
  </motion.figure>
);

/** Six pillars orbiting a campus photo (desktop); the detailed cards stay below it */
export const OrbitVisual: React.FC<{ center: Img; items: { icon: LucideIcon; t: string }[]; accent: string; ink: string }> = ({ center, items, accent, ink }) => (
  <motion.div {...view} className="relative mx-auto hidden aspect-square w-full max-w-[520px] md:block" aria-hidden="true">
    <div className="kb-spin-slow absolute inset-[12%] rounded-full border-2 border-dashed" style={{ borderColor: `${accent}66` }} />
    <motion.div variants={{ hidden: { scale: 0.6, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { duration: 0.9, ease: EASE } } }}
      className="absolute inset-[30%] overflow-hidden rounded-full border-4 shadow-2xl" style={{ borderColor: accent }}>
      <img src={center.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
    </motion.div>
    {items.map(({ icon: Icon, t }, i) => {
      const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
      return (
        <motion.div key={t} custom={i} variants={pop}
          className="absolute flex w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 text-center"
          style={{ left: `${50 + Math.cos(a) * 38}%`, top: `${50 + Math.sin(a) * 38}%` }}>
          <span className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg" style={{ background: accent, color: '#14110F' }}><Icon className="h-5 w-5" /></span>
          <span className="text-xs font-bold leading-tight" style={{ color: ink }}>{t}</span>
        </motion.div>
      );
    })}
  </motion.div>
);

/** Clipboard whose checklist ticks itself, used next to "what to verify" lists */
export const ChecklistVisual: React.FC<{ count: number; accent: string; ink: string; label: string }> = ({ count, accent, ink, label }) => (
  <motion.svg {...view} viewBox="0 0 200 240" className="mx-auto w-40 sm:w-48" role="img" aria-label={label}>
    <rect x="20" y="24" width="160" height="206" rx="14" fill="#fff" stroke={ink} strokeOpacity="0.15" strokeWidth="2" />
    <rect x="70" y="12" width="60" height="26" rx="8" fill={accent} />
    {Array.from({ length: count }).map((_, i) => {
      const y = 62 + i * (150 / count);
      return (
        <g key={i}>
          <rect x="40" y={y - 9} width="18" height="18" rx="4" fill="none" stroke={accent} strokeWidth="2" />
          <motion.path d={`M44 ${y} l4 4 l8 -9`} fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { delay: 0.3 + i * 0.25, duration: 0.35 } } }} />
          <rect x="68" y={y - 4} width={90 - (i % 3) * 14} height="8" rx="4" fill={ink} fillOpacity="0.12" />
        </g>
      );
    })}
  </motion.svg>
);

/** Dashed path with a bee flying along it, shown above a row of steps (desktop only) */
export const FlightPath: React.FC<{ color: string }> = ({ color }) => (
  <motion.div {...view} aria-hidden="true" className="pointer-events-none relative mx-auto mb-4 hidden h-10 w-[84%] lg:block">
    <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="h-full w-full">
      <motion.path d="M0 20 C 160 0, 340 40, 500 20 S 840 0, 1000 20" fill="none" stroke={color} strokeWidth="2" strokeDasharray="6 8"
        variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 1.6, ease: EASE } } }} />
    </svg>
    <motion.div className="absolute -top-6 w-14" variants={{ hidden: { left: '0%', opacity: 0 }, show: { left: '92%', opacity: 1, transition: { duration: 2.4, ease: 'easeInOut' } } }}>
      <Bee className="w-14" />
    </motion.div>
  </motion.div>
);
