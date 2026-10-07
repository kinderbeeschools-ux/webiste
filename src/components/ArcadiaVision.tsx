import React, { useEffect, useRef, useState } from 'react';
import {
  motion, useScroll, useTransform, useMotionValue, useSpring, useMotionValueEvent, useReducedMotion, type MotionValue,
} from 'motion/react';
import { EASE } from './Motion';

// "A glimpse into the university of the future": the ARCADIA – Global University section of the Degree College page.
// Content (eyebrow, heading, description, programme names, disclaimer) is unchanged; only the presentation is new.
const GREEN = '#073D37';
const GOLD = '#B48735';
const IMG = '/arcadia';
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

type Category = 'BUSINESS' | 'TECHNOLOGY' | 'DATA' | 'SCIENCE' | 'INNOVATION';

// Existing programmes, grouped into the five discipline areas (no new programme names)
const PROGRAMMES: { name: string; cat: Category }[] = [
  { name: 'Business & Management', cat: 'BUSINESS' },
  { name: 'Economics', cat: 'BUSINESS' },
  { name: 'Accounting & Finance', cat: 'BUSINESS' },
  { name: 'Entrepreneurship & Innovation', cat: 'INNOVATION' },
  { name: 'Game Design & Interactive Tech', cat: 'INNOVATION' },
  { name: 'Biomedical Sciences', cat: 'SCIENCE' },
  { name: 'Data Science', cat: 'DATA' },
  { name: 'Artificial Intelligence', cat: 'DATA' },
  { name: 'Software Engineering', cat: 'TECHNOLOGY' },
  { name: 'Cybersecurity', cat: 'TECHNOLOGY' },
];
const CATEGORIES: Category[] = ['BUSINESS', 'INNOVATION', 'SCIENCE', 'DATA', 'TECHNOLOGY'];
const CAT_IMAGE: Record<Category, string> = {
  BUSINESS: `${IMG}/facility_boardroom.jpg`,
  INNOVATION: `${IMG}/facility_campus.jpg`,
  SCIENCE: `${IMG}/facility_auditorium.jpg`,
  DATA: `${IMG}/facility_auditorium.jpg`,
  TECHNOLOGY: `${IMG}/arcadia_hero.jpg`,
};

// Node positions on an ellipse around the centre (percent of the stage); programmes of a category sit together
const NODES = PROGRAMMES.map((p, i) => {
  const angle = -90 + (i * 360) / PROGRAMMES.length + 18;
  const rad = (angle * Math.PI) / 180;
  return { ...p, x: 50 + Math.cos(rad) * 39, y: 50 + Math.sin(rad) * 38, angle };
});
const catLabelPos = (cat: Category) => {
  const nodes = NODES.filter(n => n.cat === cat);
  const a = (nodes.reduce((s, n) => s + n.angle, 0) / nodes.length) * (Math.PI / 180);
  return { x: 50 + Math.cos(a) * 49, y: 50 + Math.sin(a) * 49 };
};

function useIsDesktop() {
  const [desk, setDesk] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => setDesk(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return desk;
}

// ---------------------------------------------------------------------------
// 1. Cinematic opening
// ---------------------------------------------------------------------------
const HEADING_LINES = ['A future-focused', 'academic vision for', "India's next generation."];

const CinematicOpening: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.55], reduce ? [1, 1] : [1.05, 1]);
  const shade = useTransform(scrollYProgress, [0.08, 0.45], reduce ? [1, 1] : [0.15, 1]);

  return (
    <div ref={ref} className="relative flex min-h-[86vh] items-end overflow-hidden sm:min-h-[92vh]">
      <motion.img src={`${IMG}/arcadia_hero.jpg`} alt="ARCADIA Global University campus concept" style={{ scale }}
        className="absolute inset-0 h-full w-full object-cover object-[50%_40%] will-change-transform" />
      <motion.div aria-hidden="true" style={{ opacity: shade }}
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,61,55,0)_0%,rgba(7,61,55,.35)_40%,rgba(7,61,55,.92)_82%,#073D37_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_100%,rgba(180,135,53,.28),transparent_55%)]" />

      <div className="relative mx-auto w-full max-w-[1180px] px-5 pb-14 pt-40 text-white sm:pb-20">
        <motion.div className="mb-5 inline-flex items-center gap-3 rounded-full bg-[#073D37]/70 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.28em] text-[#e2c478] backdrop-blur-md"
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.8, ease: EASE }}>
          <span className="h-px w-10 bg-current" />ARCADIA – Global University
        </motion.div>
        {/* The heading watches the viewport; each line slides up out of its own mask */}
        <motion.h2 style={serif} className="max-w-5xl text-[2.6rem] font-normal leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[5.6rem]"
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
          variants={{ show: { transition: { staggerChildren: 0.16, delayChildren: 0.25 } } }}>
          {HEADING_LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-1">
              <motion.span className="block" variants={{ hidden: { y: '105%' }, show: { y: 0, transition: { duration: 1.1, ease: EASE } } }}>
                {line}{i < HEADING_LINES.length - 1 ? ' ' : ''}
              </motion.span>
            </span>
          ))}
        </motion.h2>
        <motion.p className="mt-7 max-w-2xl text-lg leading-relaxed text-[#d8e3df] sm:text-xl"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.9, delay: 0.85, ease: EASE }}>
          ARCADIA is envisioned as KIPS's flagship higher-education initiative: multidisciplinary, technology-enabled and connected to the skills, industries and enterprises shaping the future.
        </motion.p>
        {/* Programme names begin drifting into view */}
        <motion.div className="no-scrollbar -mx-5 mt-10 flex gap-6 overflow-x-auto px-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.2, duration: 1 }}>
          {PROGRAMMES.map((p, i) => (
            <motion.span key={p.name} className="shrink-0" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: 1.3 + i * 0.07, duration: 0.7, ease: EASE }}>
              <span className="mr-6 text-[#e2c478]">◆</span>{p.name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 2. Floating, overlapping image collage with parallax, masked reveals and tilt
// ---------------------------------------------------------------------------
const TiltImage: React.FC<{
  src: string; alt: string; className: string; style?: React.CSSProperties; y?: MotionValue<number>; rotate: number;
  reveal: { hidden: any; show: any }; imgClass?: string;
}> = ({ src, alt, className, style, y, rotate, reveal, imgClass = '' }) => {
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 150, damping: 15 });
  const ry = useSpring(0, { stiffness: 150, damping: 15 });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  return (
    <motion.div className={`absolute ${className}`} style={{ ...style, y, rotate, perspective: 900 }}
      initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
      <motion.div className="group h-full w-full" style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        onMouseMove={onMove} onMouseLeave={() => { rx.set(0); ry.set(0); }}>
        <motion.div className={`relative h-full w-full overflow-hidden shadow-[0_30px_60px_-20px_rgba(7,61,55,.45)] ${imgClass}`}
          variants={reveal}>
          <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const FLOATING_LABELS: { text: string; className: string; delay: number }[] = [
  { text: 'Global University', className: 'left-[2%] top-[4%]', delay: 0.2 },
  { text: 'Future-focused', className: 'right-[3%] top-[54%]', delay: 0.5 },
  { text: 'Multidisciplinary', className: 'left-[44%] top-[1%]', delay: 0.8 },
  { text: 'Technology-enabled', className: 'left-[4%] bottom-[2%]', delay: 1.1 },
];

const Collage: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const speed = (px: number) => useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [px, -px]); // eslint-disable-line react-hooks/rules-of-hooks
  const yA = speed(30), yB = speed(90), yC = speed(-50), yD = speed(60);
  const ease = { duration: 1.3, ease: EASE };

  return (
    <div ref={ref} className="relative mx-auto h-[520px] w-full max-w-[1180px] sm:h-[640px] lg:h-[720px]">
      {/* Large campus image: vertical curtain reveal */}
      <TiltImage src={`${IMG}/arcadia_hero.jpg`} alt="ARCADIA Global University campus concept" y={yA} rotate={-1.5}
        className="left-[4%] top-[12%] h-[56%] w-[80%] sm:left-[10%] sm:w-[62%] sm:h-[60%]" imgClass="rounded-[28px]"
        reveal={{ hidden: { clipPath: 'inset(0 0 100% 0)' }, show: { clipPath: 'inset(0 0 0% 0)', transition: ease } }} />
      {/* Arch image floating partly outside: circular expansion */}
      <TiltImage src={`${IMG}/facility_campus.jpg`} alt="ARCADIA campus concept" y={yB} rotate={3}
        className="right-[2%] top-[2%] h-[44%] w-[40%] sm:right-[6%] sm:w-[28%] sm:h-[52%]" imgClass="rounded-t-full rounded-b-2xl"
        reveal={{ hidden: { clipPath: 'circle(0% at 50% 50%)' }, show: { clipPath: 'circle(75% at 50% 50%)', transition: { ...ease, delay: 0.2 } } }} />
      {/* Lecture facility: diagonal reveal, overlapping the bottom edge */}
      <TiltImage src={`${IMG}/facility_auditorium.jpg`} alt="ARCADIA lecture facility concept" y={yC} rotate={2}
        className="bottom-[4%] left-[26%] h-[34%] w-[60%] sm:left-[34%] sm:w-[40%] sm:h-[36%]" imgClass="rounded-2xl"
        reveal={{ hidden: { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }, show: { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', transition: { ...ease, delay: 0.35 } } }} />
      {/* Meeting space: circle, blur to sharp */}
      <TiltImage src={`${IMG}/facility_boardroom.jpg`} alt="ARCADIA academic meeting space concept" y={yD} rotate={-4}
        className="bottom-[14%] left-[1%] aspect-square w-[34%] sm:left-[3%] sm:w-[20%]" imgClass="rounded-full ring-8 ring-[#F7F3EA]"
        reveal={{ hidden: { filter: 'blur(14px)', opacity: 0, scale: 0.85 }, show: { filter: 'blur(0px)', opacity: 1, scale: 1, transition: { ...ease, delay: 0.5 } } }} />

      {/* Gold orbit line behind the composition */}
      <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 -z-10 h-full w-full">
        <motion.ellipse cx="50" cy="50" rx="46" ry="42" fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.25" strokeDasharray="0.6 1.2"
          vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.2, ease: 'easeInOut' }} />
      </svg>

      {/* Floating editorial labels (words from the existing description) */}
      {FLOATING_LABELS.map(l => (
        <motion.span key={l.text} className={`absolute z-10 hidden sm:block ${l.className}`}
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: l.delay, duration: 0.8 }}>
          <span className="kb-float flex items-center gap-2 rounded-full border border-[#B48735]/40 bg-[#FBF9F4]/90 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#073D37] shadow-sm backdrop-blur"
            style={{ animationDelay: `${-l.delay * 2}s` }}>
            <span className="h-1.5 w-1.5 rotate-45" style={{ background: GOLD }} />{l.text}
          </span>
        </motion.span>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// 3. Interactive Academic Constellation (desktop: sticky scroll story; tablet: static)
// ---------------------------------------------------------------------------
const MagneticNode: React.FC<{
  node: typeof NODES[number]; dim: boolean; active: boolean; appear: MotionValue<number>;
  onEnter: () => void; onLeave: () => void;
}> = ({ node, dim, active, appear, onEnter, onLeave }) => {
  const mx = useSpring(0, { stiffness: 200, damping: 14 });
  const my = useSpring(0, { stiffness: 200, damping: 14 });
  const scale = useTransform(appear, [0, 1], [0.6, 1]);
  return (
    <motion.button
      type="button"
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 outline-none"
      style={{ left: `${node.x}%`, top: `${node.y}%`, opacity: appear, scale }}
      onMouseEnter={onEnter} onFocus={onEnter} onMouseLeave={() => { mx.set(0); my.set(0); onLeave(); }} onBlur={onLeave}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left - r.width / 2) * 0.25);
        my.set((e.clientY - r.top - r.height / 2) * 0.25);
      }}
    >
      <motion.span style={{ x: mx, y: my }} animate={{ scale: active ? 1.12 : 1, opacity: dim ? 0.3 : 1 }} transition={{ duration: 0.35 }}
        className={`flex items-center gap-2.5 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold backdrop-blur transition-colors duration-300 ${
          active ? 'border-[#e2c478] bg-[#e2c478] text-[#073D37] shadow-[0_0_40px_rgba(226,196,120,.45)]' : 'border-white/20 bg-white/[0.06] text-white'}`}>
        <span className={`h-2 w-2 rounded-full ${active ? 'bg-[#073D37]' : 'bg-[#e2c478]'}`} />
        {node.name}
      </motion.span>
    </motion.button>
  );
};

const ConnectionLine: React.FC<{ node: typeof NODES[number]; draw: MotionValue<number>; bright: boolean; dim: boolean }> = ({ node, draw, bright, dim }) => (
  <motion.line x1="50" y1="50" x2={node.x} y2={node.y} vectorEffect="non-scaling-stroke"
    stroke={bright ? '#e2c478' : '#ffffff'} strokeWidth={bright ? 2 : 1} strokeLinecap="round"
    style={{ pathLength: draw }} animate={{ strokeOpacity: bright ? 0.95 : dim ? 0.08 : 0.25 }} transition={{ duration: 0.35 }} />
);

const Constellation: React.FC<{ sticky: boolean }> = ({ sticky }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const [autoCat, setAutoCat] = useState<Category | null>(null);
  const [complete, setComplete] = useState(!sticky || !!reduce);
  const { scrollYProgress } = useScroll({ target: ref, offset: sticky ? ['start start', 'end end'] : ['start 85%', 'center center'] });

  // Stage 3: lines and nodes build up one by one
  const draws = NODES.map((_, i) => useTransform(scrollYProgress, sticky ? [0.04 + i * 0.025, 0.2 + i * 0.025] : [0, 0.6 + i * 0.04], [0, 1])); // eslint-disable-line react-hooks/rules-of-hooks
  const appears = NODES.map((_, i) => useTransform(scrollYProgress, sticky ? [0.06 + i * 0.025, 0.18 + i * 0.025] : [0.1, 0.5 + i * 0.04], [0, 1])); // eslint-disable-line react-hooks/rules-of-hooks
  const coreScale = useTransform(scrollYProgress, sticky ? [0, 0.12, 0.85, 1] : [0, 1], sticky ? [0.7, 1, 1, 1.08] : [0.8, 1]);

  // Stage 4: disciplines highlight in turn; Stage 5: the full identity comes together
  useMotionValueEvent(scrollYProgress, 'change', p => {
    if (!sticky) return;
    if (p > 0.42 && p < 0.84) setAutoCat(CATEGORIES[Math.min(4, Math.floor(((p - 0.42) / 0.42) * 5))]);
    else setAutoCat(null);
    setComplete(p >= 0.84);
  });

  const activeCat: Category | null = hover !== null ? NODES[hover].cat : autoCat;
  const isActive = (i: number) => (hover !== null ? hover === i : activeCat !== null && NODES[i].cat === activeCat);
  const isDim = (i: number) => (hover !== null || activeCat !== null) && !isActive(i);
  const focus = hover !== null ? NODES[hover] : null;

  const stage = (
    <div className="relative mx-auto aspect-[16/11] w-full max-w-[1100px]">
      {/* Glow that follows the selected node */}
      <motion.div aria-hidden="true" className="pointer-events-none absolute h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e2c478]/20 blur-3xl"
        animate={{ left: `${focus ? focus.x : 50}%`, top: `${focus ? focus.y : 50}%`, opacity: focus || complete ? 1 : 0.5 }} transition={{ type: 'spring', stiffness: 80, damping: 18 }} />

      <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <ellipse cx="50" cy="50" rx="39" ry="38" fill="none" stroke="#ffffff" strokeOpacity="0.07" vectorEffect="non-scaling-stroke" strokeDasharray="2 6" />
        <ellipse cx="50" cy="50" rx="20" ry="19" fill="none" stroke="#e2c478" strokeOpacity="0.15" vectorEffect="non-scaling-stroke" />
        {NODES.map((n, i) => <ConnectionLine key={n.name} node={n} draw={draws[i]} bright={isActive(i)} dim={isDim(i)} />)}
      </svg>

      {/* Discipline labels */}
      {CATEGORIES.map(c => {
        const p = catLabelPos(c);
        const on = activeCat === c;
        return (
          <motion.span key={c} className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] font-extrabold uppercase tracking-[0.32em]"
            style={{ left: `${p.x}%`, top: `${p.y}%` }} animate={{ color: on ? '#e2c478' : 'rgba(255,255,255,.35)', scale: on ? 1.15 : 1 }} transition={{ duration: 0.4 }}>
            {c}
          </motion.span>
        );
      })}

      {/* Core: ARCADIA, with a contextual image while a programme is selected */}
      <motion.div className="absolute left-1/2 top-1/2 z-10 flex h-[30%] w-auto aspect-square -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-[#e2c478]/50 bg-[#062e2a] shadow-[0_0_80px_rgba(180,135,53,.25)]"
        style={{ scale: coreScale }}>
        {CATEGORIES.map(c => (
          <motion.img key={c} src={CAT_IMAGE[c]} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover"
            animate={{ opacity: activeCat === c ? 0.45 : 0, scale: activeCat === c ? 1 : 1.15 }} transition={{ duration: 0.6 }} />
        ))}
        <div className="relative text-center">
          <div style={serif} className="text-2xl tracking-[0.12em] text-white xl:text-3xl">ARCADIA</div>
          <motion.div key={focus?.name || activeCat || 'idle'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="mt-1 px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#e2c478]">
            {focus ? focus.cat : activeCat || 'Global University'}
          </motion.div>
        </div>
      </motion.div>

      {NODES.map((n, i) => (
        <MagneticNode key={n.name} node={n} active={isActive(i)} dim={isDim(i)} appear={appears[i]}
          onEnter={() => setHover(i)} onLeave={() => setHover(h => (h === i ? null : h))} />
      ))}

      {/* Selected programme, shown prominently */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-4 text-center">
        <motion.div key={focus?.name || 'none'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: focus ? 1 : 0, y: 0 }} style={serif}
          className="text-3xl text-white">{focus?.name || ' '}</motion.div>
      </div>
    </div>
  );

  if (!sticky) return <div ref={ref} className="px-5 py-16">{stage}</div>;
  return (
    <div ref={ref} className="relative h-[260vh]">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] items-center px-5">
        {stage}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 3b. Mobile: the ecosystem as an editorial, image-led swipe carousel
const CAT_TITLE: Record<Category, string> = { BUSINESS: 'Business', INNOVATION: 'Innovation', SCIENCE: 'Science', DATA: 'Data', TECHNOLOGY: 'Technology' };

const MobileEcosystem: React.FC = () => {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    const step = card.offsetWidth + 14;
    setActive(Math.max(0, Math.min(CATEGORIES.length - 1, Math.round(el.scrollLeft / step))));
  };
  const goTo = (i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: 'smooth' });
  };

  return (
    <div className="relative pb-6 pt-12">
      {/* Wordmark between gold hairlines */}
      <motion.div className="mb-9 flex items-center justify-center gap-4 px-5" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }}>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#e2c478]/70" />
        <div className="text-center">
          <div style={serif} className="text-[2.6rem] leading-none tracking-[0.14em] text-white">ARCADIA</div>
          <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.34em] text-[#e2c478]">Global University</div>
        </div>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#e2c478]/70" />
      </motion.div>

      {/* Swipe track */}
      <div ref={track} onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-[14px] overflow-x-auto px-[9vw] pb-2"
        style={{ scrollPaddingInline: '9vw' }}>
        {CATEGORIES.map((c, i) => {
          const on = active === i;
          const list = PROGRAMMES.filter(p => p.cat === c);
          return (
            <motion.article key={c}
              className="relative h-[460px] w-[82vw] max-w-[360px] shrink-0 snap-center overflow-hidden rounded-[26px] border border-[#e2c478]/25 shadow-[0_30px_60px_-25px_rgba(0,0,0,.6)]"
              animate={{ scale: on ? 1 : 0.93, opacity: on ? 1 : 0.55 }} transition={{ duration: 0.45, ease: EASE }}
              initial={false}>
              <img src={CAT_IMAGE[c]} alt="" aria-hidden="true" loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[2.2s] ease-out ${on ? 'scale-110' : 'scale-100'}`} />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,46,42,.25)_0%,rgba(6,46,42,.55)_40%,rgba(6,46,42,.96)_72%,#062e2a_100%)]" />
              <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(226,196,120,.25),transparent_55%)]" />

              <div className="relative flex h-full flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                  <span style={serif} className="text-sm italic text-[#e2c478]">{String(i + 1).padStart(2, '0')} <span className="text-white/40">/ {String(CATEGORIES.length).padStart(2, '0')}</span></span>
                  <span className="rounded-full border border-white/25 bg-black/20 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.3em] text-white/80 backdrop-blur">
                    {list.length} {list.length > 1 ? 'Programmes' : 'Programme'}
                  </span>
                </div>

                <div>
                  <h3 style={serif} className="text-[2.6rem] leading-none text-white">{CAT_TITLE[c]}</h3>
                  <motion.span aria-hidden="true" className="mt-4 block h-px origin-left bg-gradient-to-r from-[#e2c478] to-transparent"
                    animate={{ scaleX: on ? 1 : 0.2 }} transition={{ duration: 0.8, ease: EASE }} />
                  <ul className="mt-2">
                    {list.map((p, j) => (
                      <motion.li key={p.name} style={serif}
                        className="flex items-center justify-between border-b border-white/10 py-3 text-[17px] text-white last:border-0"
                        animate={{ opacity: on ? 1 : 0.4, x: on ? 0 : -8 }} transition={{ duration: 0.5, delay: on ? 0.15 + j * 0.08 : 0 }}>
                        {p.name}
                        <span className="ml-3 h-1.5 w-1.5 shrink-0 rotate-45 bg-[#e2c478]" />
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Gold progress + discipline jump links */}
      <div className="mt-6 px-[9vw]">
        <div className="relative h-px w-full bg-white/15">
          <motion.span className="absolute inset-y-0 left-0 bg-[#e2c478]" animate={{ width: `${((active + 1) / CATEGORIES.length) * 100}%` }} transition={{ duration: 0.5, ease: EASE }} />
        </div>
        <div className="mt-4 flex justify-between">
          {CATEGORIES.map((c, i) => (
            <button key={c} type="button" onClick={() => goTo(i)}
              className={`text-[9px] font-bold uppercase tracking-[0.18em] transition-colors ${active === i ? 'text-[#e2c478]' : 'text-white/40'}`}>
              {CAT_TITLE[c]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------
export const ArcadiaVision: React.FC = () => {
  const desktop = useIsDesktop();
  const reduce = useReducedMotion();
  // Soft cursor-following glow on the ecosystem panel
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glow = useTransform([gx, gy], ([x, y]) => `radial-gradient(600px circle at ${x}% ${y}%, rgba(180,135,53,.14), transparent 60%)`);

  return (
    <section id="arcadia-vision" className="scroll-mt-24 bg-[#073D37] text-white">
      <CinematicOpening />

      {/* Collage on ivory, introducing the campus */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#F7F3EA] to-[#FBF9F4] px-5 py-16 text-[#0D2D2B] sm:py-24">
        <Collage />
      </div>

      {/* Academic ecosystem */}
      <div className="relative overflow-clip"
        onMouseMove={e => {
          if (reduce) return;
          const r = e.currentTarget.getBoundingClientRect();
          gx.set(((e.clientX - r.left) / r.width) * 100);
          gy.set(((e.clientY - r.top) / r.height) * 100);
        }}>
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: glow }} />
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto hidden max-w-[1180px] px-5 pt-16 text-center sm:pt-20 md:block">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#e2c478]">ARCADIA – Global University</div>
        </div>
        <div className="relative">
          {desktop ? <Constellation sticky={!reduce} /> : (
            <>
              <div className="hidden md:block"><Constellation sticky={false} /></div>
              <div className="md:hidden"><MobileEcosystem /></div>
            </>
          )}
        </div>
        <p className="relative mx-auto max-w-3xl px-5 pb-16 text-center text-xs leading-relaxed text-white/55 sm:pb-20">
          Proposed disciplines are indicative. Final programmes, nomenclature and delivery remain subject to applicable UGC, State and professional-regulator requirements.
        </p>
      </div>
    </section>
  );
};
