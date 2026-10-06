import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import {
  LayoutDashboard, Ruler, Palette, Users, GraduationCap, BookOpen, Settings2, CheckCircle2, Sparkles, Bell,
} from 'lucide-react';
import { EASE } from './Motion';
import { Bee, Star } from './Doodles';

// Tabs map 1:1 onto the "What You Receive As a KIPS Preschool Partner" list on this page.
type TabId = 'setup' | 'branding' | 'admissions' | 'training' | 'curriculum' | 'operations';

const TABS: {
  id: TabId;
  label: string;
  icon: React.ElementType;
  pill: string;
  title: string;
  text: string;
  includes: string[];
  toast: { title: string; lines: string[] };
}[] = [
  {
    id: 'setup', label: 'Setup', icon: Ruler, pill: 'bg-violet-100 text-violet-700',
    title: 'From empty space to a ready campus',
    text: 'A complete school design blueprint, your official brand licence and a step-by-step operations manual, so launch day is planned from day one.',
    includes: ['Official Brand License', 'School Design Blueprint', 'Franchise Operations Manual'],
    toast: { title: 'Setup assistant', lines: ['Classroom & play-area layout shared', 'Safety flooring checklist ready'] },
  },
  {
    id: 'branding', label: 'Branding', icon: Palette, pill: 'bg-sky-100 text-sky-700',
    title: 'A brand parents already trust',
    text: 'Launch with the Kinderbee identity, your own SEO-optimised micro-website and ready-made monthly marketing campaigns.',
    includes: ['SEO-Optimized Micro-Websites', 'Monthly Marketing Campaigns'],
    toast: { title: 'Brand assistant', lines: ["This month's campaign is ready", 'Micro-website updated for your city'] },
  },
  {
    id: 'admissions', label: 'Admissions', icon: Users, pill: 'bg-pink-100 text-[#E1007A]',
    title: 'Fill classrooms with a proven playbook',
    text: 'Follow tested admissions playbooks that take every parent enquiry from first call to campus visit to confirmed admission.',
    includes: ['Admissions Playbooks'],
    toast: { title: 'Admissions', lines: ['New parent enquiry received', 'Campus visit booked for Saturday'] },
  },
  {
    id: 'training', label: 'Training', icon: GraduationCap, pill: 'bg-amber-100 text-amber-700',
    title: 'Teachers trained the Finnish way',
    text: 'Recruit with our staff guides, then build a confident team through comprehensive, Nordic-inspired teacher training.',
    includes: ['Staff Recruitment Guides', 'Comprehensive Training'],
    toast: { title: 'Training', lines: ['Play-Based Teaching module completed', 'Certificates ready for your team'] },
  },
  {
    id: 'curriculum', label: 'Curriculum', icon: BookOpen, pill: 'bg-emerald-100 text-emerald-700',
    title: 'Play-based learning, planned for you',
    text: 'A custom local curriculum built on NEP 2020 and Finnish-inspired, child-centric pedagogy, with every week mapped out.',
    includes: ['Custom Local Curriculum'],
    toast: { title: 'Curriculum', lines: ["Next week's theme plan is ready", 'Phonics & STEM activity kits listed'] },
  },
  {
    id: 'operations', label: 'Operations', icon: Settings2, pill: 'bg-orange-100 text-orange-700',
    title: 'Run the school, not the paperwork',
    text: 'A school management ERP, continuous quality audits and ongoing mentorship keep your preschool running smoothly.',
    includes: ['School Management ERP', 'Continuous Quality Audits', 'Mentorship Advisory Support'],
    toast: { title: 'Operations', lines: ['Quality audit report is ready', 'Mentor check-in scheduled'] },
  },
];

const ROTATE_MS = 6000;

export const FranchiseShowcase: React.FC = () => {
  const [active, setActive] = useState<TabId>('setup');
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });
  const reduce = useReducedMotion();
  const tab = TABS.find(t => t.id === active)!;

  // Cycle through the tabs while the section is on screen, until the visitor picks one
  const cycling = auto && inView && !paused && !reduce;
  useEffect(() => {
    if (!cycling) return;
    const t = setTimeout(() => {
      const i = TABS.findIndex(x => x.id === active);
      setActive(TABS[(i + 1) % TABS.length].id);
    }, ROTATE_MS);
    return () => clearTimeout(t);
  }, [cycling, active]);

  const pick = (id: TabId) => {
    setAuto(false);
    setActive(id);
  };

  return (
    <section ref={rootRef} className="relative max-w-7xl mx-auto px-4 sm:px-8 overflow-x-clip">
      {/* Heading */}
      <motion.div
        className="relative text-center max-w-3xl mx-auto space-y-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <Star className="hidden sm:block absolute -top-4 left-6 w-9 kb-spin-slow" />
        <Star color="#E1007A" className="hidden sm:block absolute top-6 right-4 w-6 kb-wiggle" />
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-[#1C1917]">
          Preschools grow with <span className="text-[#E1007A]">Kinderbee</span>
        </h2>
        <p className="text-stone-500 text-base sm:text-lg leading-relaxed">
          One partner ecosystem for setup, branding, admissions, training and operations, so you spend your time with children, not paperwork.
        </p>
      </motion.div>

      {/* Tab pills */}
      <div role="tablist" aria-label="What Kinderbee partners get" className="no-scrollbar mt-8 flex gap-2.5 overflow-x-auto sm:flex-wrap sm:justify-center pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {TABS.map(t => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={on}
              onClick={() => pick(t.id)}
              className={`relative shrink-0 overflow-hidden px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                on ? 'bg-[#E1007A] text-white shadow-lg shadow-pink-500/30 scale-105' : `${t.pill} hover:scale-105`
              }`}
            >
              {t.label}
              {/* Progress bar while auto-cycling */}
              {on && cycling && (
                <motion.span
                  key={`${t.id}-progress`}
                  aria-hidden="true"
                  className="absolute left-0 bottom-0 h-0.5 bg-[#FFD400]"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: ROTATE_MS / 1000, ease: 'linear' }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Illustrated portal window */}
      <motion.div
        className="relative mt-10 sm:mt-12 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 60, rotateX: 12 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: EASE }}
        style={{ transformPerspective: 1200 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Offset brand backdrop */}
        <div aria-hidden="true" className="absolute -left-3 sm:-left-6 top-8 sm:top-10 -bottom-4 sm:-bottom-6 right-6 sm:right-16 rounded-[28px] bg-gradient-to-br from-pink-100 via-pink-50 to-[#FFD400]/20" />
        <Bee className="hidden md:block absolute -top-12 -left-10 w-28 z-30 kb-fly" />

        <div className="relative rounded-2xl sm:rounded-3xl bg-white border border-stone-200 shadow-2xl shadow-stone-300/40 overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-stone-100 bg-stone-50/80">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E1007A]/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD400]" />
            <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
            <div className="ml-3 flex-1 max-w-xs h-6 rounded-md bg-white border border-stone-200 text-[10px] text-stone-400 flex items-center px-2.5">
              kinderbee partner portal
            </div>
            <span className="ml-auto text-[10px] font-semibold text-stone-400 hidden sm:inline">Illustrative preview</span>
          </div>

          <div className="flex min-h-[380px] sm:min-h-[420px]">
            {/* Sidebar */}
            <aside className="hidden md:flex w-48 shrink-0 flex-col gap-1 border-r border-stone-100 bg-stone-50/60 p-3">
              <div className="flex items-center gap-2 px-2 pb-3 mb-1 border-b border-stone-100">
                <div className="w-7 h-7 rounded-lg bg-[#E1007A] text-white flex items-center justify-center text-xs font-black">K</div>
                <div className="text-xs font-bold text-stone-800">Kinderbee</div>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-stone-400">
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </div>
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => pick(t.id)}
                  className={`relative flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                    t.id === active ? 'text-[#E1007A]' : 'text-stone-500 hover:bg-stone-100'
                  }`}
                >
                  {t.id === active && (
                    <motion.span layoutId="kb-side-active" className="absolute inset-0 rounded-lg bg-pink-50 border border-pink-100" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                  )}
                  <t.icon className="relative w-3.5 h-3.5" />
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </aside>

            {/* Scene */}
            <div className="relative flex-1 p-4 sm:p-6 bg-gradient-to-br from-white to-stone-50/70">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 text-[#E1007A] flex items-center justify-center">
                      <tab.icon className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-bold text-stone-800">{tab.label}</div>
                  </div>
                  <Scene id={active} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Floating assistant card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`toast-${active}`}
            className="absolute z-20 -top-5 right-2 sm:-right-6 w-60 sm:w-64 rounded-2xl bg-gradient-to-br from-[#E1007A] to-pink-700 text-white p-4 shadow-2xl shadow-pink-900/30"
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.25 }}
          >
            <div className="flex items-center gap-2 text-sm font-bold">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-[#FFD400] animate-ping" />
                <span className="relative w-2 h-2 rounded-full bg-[#FFD400]" />
              </span>
              {tab.toast.title}
            </div>
            <ul className="mt-2 space-y-1 text-[12px] text-pink-50">
              {tab.toast.lines.map(l => <li key={l}>{l}</li>)}
            </ul>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Caption for the active tab */}
      <div className="max-w-3xl mx-auto mt-12 sm:mt-14 text-center min-h-[150px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`cap-${active}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="space-y-3"
          >
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[#1C1917]">{tab.title}</h3>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">{tab.text}</p>
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {tab.includes.map(item => (
                <span key={item} className="inline-flex items-center gap-1.5 bg-white border border-stone-200 text-stone-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E1007A]" /> {item}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

// ---------- Scenes: small animated illustrations for each tab ----------

const card = 'rounded-xl bg-white border border-stone-200/80 shadow-xs';
const rise = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: 0.1 + i * 0.08, ease: EASE },
});

const Scene: React.FC<{ id: TabId }> = ({ id }) => {
  switch (id) {
    case 'setup': return <SetupScene />;
    case 'branding': return <BrandingScene />;
    case 'admissions': return <AdmissionsScene />;
    case 'training': return <TrainingScene />;
    case 'curriculum': return <CurriculumScene />;
    case 'operations': return <OperationsScene />;
  }
};

const SetupScene = () => (
  <div className="grid sm:grid-cols-5 gap-4">
    {/* Floor plan that draws itself */}
    <motion.div {...rise(0)} className={`${card} sm:col-span-3 p-3`}>
      <div className="text-[11px] font-bold text-stone-500 mb-2">School design blueprint</div>
      <svg viewBox="0 0 300 180" className="w-full h-auto" aria-hidden="true">
        <motion.rect x="6" y="6" width="288" height="168" rx="8" fill="#FFF7FB" stroke="#E1007A" strokeWidth="2.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeInOut' }} />
        {[
          { x: 6, y: 6, w: 120, h: 90, label: 'Classroom', fill: '#FFE4F1' },
          { x: 126, y: 6, w: 168, h: 90, label: 'Play area', fill: '#FFF6C2' },
          { x: 6, y: 96, w: 90, h: 78, label: 'Reception', fill: '#E0F2FE' },
          { x: 96, y: 96, w: 110, h: 78, label: 'Sensory corner', fill: '#DCFCE7' },
          { x: 206, y: 96, w: 88, h: 78, label: 'Library', fill: '#EDE9FE' },
        ].map((r, i) => (
          <motion.g key={r.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.15 }}>
            <rect x={r.x + 4} y={r.y + 4} width={r.w - 8} height={r.h - 8} rx="6" fill={r.fill} stroke="#1C1917" strokeOpacity="0.15" strokeDasharray="4 3" />
            <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1C1917" opacity="0.7">{r.label}</text>
          </motion.g>
        ))}
      </svg>
    </motion.div>
    <div className="sm:col-span-2 space-y-2.5">
      {['Brand licence issued', 'Blueprint approved', 'Operations manual shared', 'Launch checklist'].map((t, i) => (
        <motion.div key={t} {...rise(i + 1)} className={`${card} flex items-center gap-2.5 px-3 py-2.5`}>
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.2, type: 'spring' }}>
            <CheckCircle2 className={`w-4 h-4 ${i < 3 ? 'text-[#E1007A]' : 'text-stone-300'}`} />
          </motion.span>
          <span className="text-xs font-semibold text-stone-700">{t}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

const BrandingScene = () => (
  <div className="grid sm:grid-cols-5 gap-4">
    {/* Mini website */}
    <motion.div {...rise(0)} className={`${card} sm:col-span-3 overflow-hidden`}>
      <div className="h-24 bg-gradient-to-br from-[#E1007A] to-pink-500 p-3 text-white relative overflow-hidden">
        <div className="text-[10px] font-bold opacity-80">yourcity.kinderbee</div>
        <div className="mt-2 text-sm font-extrabold leading-tight">Kinderbee Preschool<br />Admissions open</div>
        <motion.div className="absolute -right-4 -bottom-6 w-20 h-20 rounded-full bg-[#FFD400]/60" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity }} />
      </div>
      <div className="p-3 grid grid-cols-3 gap-2">
        {['Programmes', 'Gallery', 'Enquire'].map((t, i) => (
          <motion.div key={t} {...rise(i + 1)} className="rounded-lg bg-stone-50 border border-stone-100 p-2 text-[10px] font-semibold text-stone-600 text-center">{t}</motion.div>
        ))}
      </div>
    </motion.div>
    {/* Campaign posts */}
    <div className="sm:col-span-2 space-y-2.5">
      <div className="text-[11px] font-bold text-stone-500">Monthly campaign</div>
      <div className="grid grid-cols-3 gap-2">
        {['from-pink-200 to-pink-100', 'from-amber-200 to-yellow-100', 'from-sky-200 to-sky-100'].map((g, i) => (
          <motion.div key={g} initial={{ opacity: 0, rotate: -8, y: 10 }} animate={{ opacity: 1, rotate: 0, y: 0 }} transition={{ delay: 0.3 + i * 0.12, type: 'spring' }}
            className={`aspect-square rounded-lg bg-gradient-to-br ${g} border border-white shadow-xs flex items-end p-1.5`}>
            <div className="h-1.5 w-3/4 rounded bg-white/80" />
          </motion.div>
        ))}
      </div>
      {['Open day post', 'Parent testimonial', 'Admissions reminder'].map((t, i) => (
        <motion.div key={t} {...rise(i + 2)} className={`${card} flex items-center justify-between px-3 py-2`}>
          <span className="text-[11px] font-semibold text-stone-700">{t}</span>
          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Ready</span>
        </motion.div>
      ))}
    </div>
  </div>
);

const AdmissionsScene = () => (
  <div className="grid grid-cols-3 gap-2 sm:gap-3">
    {[
      { col: 'Enquiry', tint: 'bg-sky-50 text-sky-700', items: ['Playgroup', 'Nursery', 'Junior KG'] },
      { col: 'Campus visit', tint: 'bg-amber-50 text-amber-700', items: ['Nursery', 'Senior KG'] },
      { col: 'Admitted', tint: 'bg-pink-50 text-[#E1007A]', items: ['Playgroup', 'Daycare'] },
    ].map((c, ci) => (
      <div key={c.col} className="rounded-xl bg-stone-50 border border-stone-100 p-2 sm:p-2.5 space-y-2">
        <div className={`text-[10px] sm:text-[11px] font-bold px-2 py-1 rounded-md ${c.tint}`}>{c.col}</div>
        {c.items.map((it, i) => (
          <motion.div key={it + i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + ci * 0.25 + i * 0.1, ease: EASE, duration: 0.45 }}
            className={`${card} p-2`}>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-300 to-[#FFD400] shrink-0" />
              <div className="h-1.5 flex-1 rounded bg-stone-200" />
            </div>
            <div className="mt-1.5 text-[9px] sm:text-[10px] font-semibold text-stone-500">{it}</div>
          </motion.div>
        ))}
      </div>
    ))}
  </div>
);

const TrainingScene = () => (
  <div className="grid sm:grid-cols-5 gap-4">
    <div className="sm:col-span-3 space-y-3">
      {[
        { m: 'Child Development & Psychology', p: 100 },
        { m: 'Play-Based Teaching', p: 85 },
        { m: 'Curriculum & Activity Planning', p: 60 },
        { m: 'Practical Classroom Training', p: 35 },
      ].map((r, i) => (
        <motion.div key={r.m} {...rise(i)} className={`${card} p-3`}>
          <div className="flex justify-between text-[11px] font-semibold text-stone-700">
            <span>{r.m}</span><span className="text-stone-400">{r.p}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-stone-100 overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-[#E1007A] to-[#FFD400]" initial={{ width: 0 }} animate={{ width: `${r.p}%` }} transition={{ delay: 0.3 + i * 0.15, duration: 0.9, ease: EASE }} />
          </div>
        </motion.div>
      ))}
    </div>
    <motion.div {...rise(2)} className={`${card} sm:col-span-2 p-4 flex flex-col items-center justify-center text-center`}>
      <motion.div initial={{ rotate: -20, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD400] to-amber-400 flex items-center justify-center shadow-lg">
        <GraduationCap className="w-8 h-8 text-stone-900" />
      </motion.div>
      <div className="mt-3 text-xs font-bold text-stone-800">FinnishWay Academy</div>
      <div className="text-[10px] text-stone-500">Teacher certification</div>
      <div className="mt-3 flex -space-x-2">
        {['from-pink-300 to-pink-400', 'from-amber-200 to-amber-300', 'from-sky-200 to-sky-300', 'from-emerald-200 to-emerald-300'].map((g, i) => (
          <motion.div key={g} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 + i * 0.1, type: 'spring' }} className={`w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br ${g}`} />
        ))}
      </div>
    </motion.div>
  </div>
);

const CurriculumScene = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const pillars = [
    { t: 'Play-based', c: 'bg-pink-100 text-[#E1007A]' },
    { t: 'Phonics', c: 'bg-amber-100 text-amber-800' },
    { t: 'STEM', c: 'bg-sky-100 text-sky-700' },
    { t: 'Motor skills', c: 'bg-emerald-100 text-emerald-700' },
    { t: 'Social & emotional', c: 'bg-violet-100 text-violet-700' },
  ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {days.map((d, di) => (
          <div key={d} className="space-y-1.5">
            <div className="text-[10px] font-bold text-stone-400 text-center">{d}</div>
            {[0, 1, 2].map(slot => {
              const p = pillars[(di + slot * 2) % pillars.length];
              return (
                <motion.div key={slot} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + (di * 3 + slot) * 0.04, type: 'spring', stiffness: 300, damping: 20 }}
                  className={`rounded-md px-1 py-2 text-[8px] sm:text-[10px] font-bold text-center leading-tight ${p.c}`}>
                  {p.t}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
      <motion.div {...rise(4)} className={`${card} flex items-center gap-2 px-3 py-2.5`}>
        <Sparkles className="w-4 h-4 text-[#E1007A]" />
        <span className="text-[11px] font-semibold text-stone-700">Aligned with NEP 2020 · Finnish-inspired, child-centric pedagogy</span>
      </motion.div>
    </div>
  );
};

const OperationsScene = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {[
        { k: 'Attendance', v: 'Daily', c: 'text-[#E1007A]' },
        { k: 'Fee records', v: 'In ERP', c: 'text-amber-600' },
        { k: 'Quality audit', v: 'On track', c: 'text-emerald-600' },
      ].map((s, i) => (
        <motion.div key={s.k} {...rise(i)} className={`${card} p-2.5 sm:p-3`}>
          <div className="text-[9px] sm:text-[10px] font-semibold text-stone-400 uppercase tracking-wide">{s.k}</div>
          <div className={`text-sm sm:text-lg font-extrabold ${s.c}`}>{s.v}</div>
        </motion.div>
      ))}
    </div>
    <motion.div {...rise(3)} className={`${card} p-3 sm:p-4`}>
      <div className="flex items-center justify-between text-[11px] font-bold text-stone-500">
        <span>School overview</span>
        <Bell className="w-3.5 h-3.5 text-stone-300" />
      </div>
      <div className="mt-3 flex items-end gap-1.5 sm:gap-2 h-28">
        {[40, 55, 48, 70, 62, 80, 74, 90, 84, 95].map((h, i) => (
          <motion.div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-[#E1007A] to-pink-300"
            initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.35 + i * 0.06, duration: 0.6, ease: EASE }} />
        ))}
      </div>
    </motion.div>
  </div>
);
