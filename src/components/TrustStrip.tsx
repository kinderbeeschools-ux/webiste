import React, { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';

// Figures from the Kinderbee Franchise & CRM booklet
const STATS = [
  { n: 26, suffix: '+', label: 'Years of educational service' },
  { n: 10, suffix: '+', label: 'Franchise support team' },
  { n: 10, suffix: '', label: 'KinderOS CRM modules, free' },
  { n: 0, suffix: '%', label: 'Royalty on your fees' },
];

const Count: React.FC<{ to: number; suffix: string }> = ({ to, suffix }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (reduce) { setV(to); return; }
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: x => setV(Math.round(x)) });
    const done = setTimeout(() => setV(to), 2000); // frames can be paused (background tab): always land on the real figure
    return () => { c.stop(); clearTimeout(done); };
  }, [inView, to, reduce]);
  return <><span className="sr-only">{to}{suffix}</span><span ref={ref} aria-hidden="true">{v}{suffix}</span></>;
};

export const TrustStrip: React.FC = () => (
  <section aria-label="Kinderbee at a glance" className="max-w-6xl mx-auto px-4 sm:px-8">
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-pink-100 bg-pink-100 shadow-sm md:grid-cols-4">
      {STATS.map(s => (
        <div key={s.label} className="bg-white px-5 py-6 text-center">
          <dt className="sr-only">{s.label}</dt>
          <dd className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-[#E1007A]"><Count to={s.n} suffix={s.suffix} /></dd>
          <p aria-hidden="true" className="mt-1 text-xs sm:text-sm font-medium text-stone-600">{s.label}</p>
        </div>
      ))}
    </dl>
  </section>
);
