import React, { useId, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { EASE } from '../Motion';

// Shared building blocks for the buyer-guide sections added to the Franchise, NTT, CBSE,
// Degree College and Joint Ventures pages. Everything here is new; nothing existing is touched.

export const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 } } as const;

export const stagger = (gap = 0.09) => ({ show: { transition: { staggerChildren: gap } } });

export const SERIF: React.CSSProperties = { fontFamily: "Georgia, 'Times New Roman', serif" };

export interface Palette {
  /** Section background */
  bg: string;
  /** Primary text */
  ink: string;
  /** Muted text */
  muted: string;
  /** Accent (gold / pink) */
  accent: string;
  /** Lighter accent for text on dark */
  accentSoft: string;
  /** Card surface */
  card: string;
  /** Card border */
  line: string;
  dark: boolean;
}

// ---------------------------------------------------------------------------
// Eyebrow label with a hairline that draws in
// ---------------------------------------------------------------------------
export const Eyebrow: React.FC<{ children: React.ReactNode; color: string; center?: boolean }> = ({ children, color, center }) => (
  <div className={`mb-4 flex items-center gap-3 text-[12px] font-extrabold uppercase tracking-[0.22em] ${center ? 'justify-center' : ''}`} style={{ color }}>
    <motion.span className="h-px w-8" style={{ background: 'currentColor' }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
    {children}
    {center && <motion.span className="h-px w-8" style={{ background: 'currentColor' }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} />}
  </div>
);

// ---------------------------------------------------------------------------
// Accordion used for FAQs
// ---------------------------------------------------------------------------
export const Accordion: React.FC<{ items: { q: string; a: React.ReactNode }[]; p: Palette }> = ({ items, p }) => {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <div className="space-y-3">
      {items.map((it, i) => {
        const isOpen = open === i;
        const btnId = `${base}-b${i}`;
        const panelId = `${base}-p${i}`;
        return (
          <div
            key={it.q}
            className="overflow-hidden rounded-2xl border transition-colors duration-300"
            style={{ background: p.card, borderColor: isOpen ? p.accent : p.line }}
          >
            <h3>
              <button
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
              >
                <span className="text-[15px] font-bold leading-snug sm:text-base" style={{ color: p.ink }}>{it.q}</span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="shrink-0" style={{ color: p.accent }}>
                  <ChevronDown className="h-5 w-5" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <div className="px-5 pb-5 text-sm leading-relaxed sm:px-6" style={{ color: p.muted }}>{it.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Interactive readiness checklist with a progress ring. Runs entirely in the browser.
// ---------------------------------------------------------------------------
export const ReadinessCheck: React.FC<{
  title: string;
  intro: string;
  items: string[];
  p: Palette;
  doneLabel: string;
  onAction?: () => void;
  actionLabel?: string;
}> = ({ title, intro, items, p, doneLabel, onAction, actionLabel }) => {
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  const count = checked.filter(Boolean).length;
  const pct = items.length ? count / items.length : 0;
  const R = 42;
  const C = 2 * Math.PI * R;

  return (
    <div className="grid gap-8 rounded-[1.75rem] border p-6 sm:p-9 lg:grid-cols-[0.8fr_1.2fr]" style={{ background: p.card, borderColor: p.line }}>
      <div className="flex flex-col items-center justify-center text-center lg:items-start lg:text-left">
        <div className="relative h-36 w-36">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r={R} fill="none" stroke={p.line} strokeWidth="7" />
            <motion.circle
              cx="50" cy="50" r={R} fill="none" stroke={p.accent} strokeWidth="7" strokeLinecap="round"
              strokeDasharray={C}
              animate={{ strokeDashoffset: C * (1 - pct) }}
              transition={{ duration: 0.7, ease: EASE }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold" style={{ color: p.ink }}>{count}<span className="text-lg" style={{ color: p.muted }}>/{items.length}</span></span>
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: p.muted }}>ready</span>
          </div>
        </div>
        <h3 style={SERIF} className="mt-5 text-2xl leading-tight sm:text-[1.7rem]"><span style={{ color: p.ink }}>{title}</span></h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: p.muted }}>{intro}</p>
        <div className="mt-4 min-h-[1.5rem] text-sm font-bold" style={{ color: p.accent }} aria-live="polite">
          {count === items.length ? doneLabel : ''}
        </div>
        {onAction && actionLabel && (
          <button
            onClick={onAction}
            className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: p.accent, color: p.dark ? p.bg : '#fff' }}
          >
            {actionLabel}
          </button>
        )}
      </div>

      <ul className="space-y-2.5">
        {items.map((label, i) => (
          <li key={label}>
            <label
              className="flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-colors duration-300 hover:brightness-95"
              style={{ borderColor: checked[i] ? p.accent : p.line, background: checked[i] ? `${p.accent}14` : 'transparent', color: p.ink }}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked[i]}
                onChange={() => setChecked(prev => prev.map((v, j) => (j === i ? !v : v)))}
              />
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-300"
                style={{ borderColor: p.accent, background: checked[i] ? p.accent : 'transparent', color: p.dark ? p.bg : '#fff' }}
              >
                {checked[i] && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              </span>
              <span className="leading-relaxed">{label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
