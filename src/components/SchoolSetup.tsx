import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, CheckCircle2, ArrowRight, Landmark, Ruler, GraduationCap, Laptop, Presentation, FlaskConical, Calculator, Bot,
  Library, Palette, Trophy, Theater, Users, BookOpenCheck, HeartPulse, Cctv, ChartLine, Compass, FileCheck2, UserCheck,
  Megaphone, MapPinned, Building2, Globe2, Award,
} from 'lucide-react';
import { EASE, Reveal, useStagger } from './Motion';

// CBSE & IB School Setup page. All copy is unchanged from the original page; this adds visuals and motion.
const GOLD = '#C9A24A';

const PROCESS = [
  { icon: Landmark, label: 'School Planning & Affiliation' },
  { icon: Ruler, label: 'Infrastructure Design' },
  { icon: GraduationCap, label: 'Teacher Training' },
  { icon: Laptop, label: 'Digital Admissions Support' },
];

const FACILITIES = [
  { icon: Presentation, label: 'Spacious Smart Classrooms' },
  { icon: FlaskConical, label: 'Science & Computer Laboratories' },
  { icon: Calculator, label: 'Mathematics & Innovation Labs' },
  { icon: Bot, label: 'STEM / Robotics Maker-Labs' },
  { icon: Library, label: 'International Standard Library' },
  { icon: Palette, label: 'Art & Performing Arts Studios' },
  { icon: Trophy, label: 'Indoor & Outdoor Sports Complex' },
  { icon: Theater, label: 'Multipurpose Activity Auditorium' },
  { icon: Users, label: 'Collaborative Learning Pods' },
  { icon: BookOpenCheck, label: 'Teacher Resource Centre' },
  { icon: HeartPulse, label: 'Student Wellness & First-Aid Infirmary' },
  { icon: Cctv, label: 'Safe Washrooms & CCTV Surveillance' },
];

const LIFECYCLE = [
  { icon: ChartLine, title: 'Feasibility & Project Report', text: 'Demographic analysis, catchment survey, financial modeling & 10-year P&L.' },
  { icon: Compass, title: 'Campus Architecture & Interiors', text: 'Spatial masterplans, smart classrooms, laboratories, and sports grounds.' },
  { icon: FileCheck2, title: 'Affiliation & Statutory Approvals', text: 'State NOC, society bye-laws, CBSE SARAS filing, and IB Candidacy support.' },
  { icon: UserCheck, title: 'Faculty Hiring & Certified Training', text: 'Principal onboarding, teacher recruitment, and pedagogical workshops.' },
  { icon: Laptop, title: 'EdTech & School ERP Deployment', text: 'Interactive digital boards, student management ERP, and RFID/CCTV systems.' },
  { icon: Megaphone, title: 'Admissions Campaign & Launch', text: 'Digital marketing, parent orientations, and community enrollment drives.' },
];

const PATHWAYS = [
  {
    from: -40,
    badge: 'National K-12 Standard', tag: 'NEP 2020 Aligned', icon: Landmark,
    title: 'CBSE School Setup & Affiliation',
    text: "India's most sought-after national curriculum framework with unmatched parental recognition, comprehensive NCERT integration, and nationwide board examinations.",
    focus: ['CBSE-Aligned Curriculum & Syllabi', 'NEP 2020 Pedagogical Framework Integration', 'Student-Centric & Experiential Learning', 'STEM & Technology-Enabled Smart Classrooms', 'Complete SARAS Affiliation Documentation Support'],
    outlay: '₹2 Crore – ₹5 Crore+', cta: 'CBSE Blueprint',
    accent: 'from-[#E1007A] to-pink-500', soft: 'bg-pink-50 text-[#E1007A]', ring: 'hover:border-pink-300',
  },
  {
    from: 40,
    badge: 'International Standard', tag: 'PYP • MYP • DP', icon: Globe2,
    title: 'IB World School Setup & Accreditation',
    text: 'World-recognized international continuum education fostering critical thinking, research skills, inquiry-based transdisciplinary projects, and global university admissions.',
    focus: ['International Baccalaureate (IB) Curriculum', 'Inquiry-Based & Project-Based Learning', 'Critical Thinking & Global Problem Solving', 'International Mindedness & Multilingualism', 'IB Candidacy & Authorization Roadmaps'],
    outlay: '₹5 Crore – ₹15 Crore+', cta: 'IB Advisory',
    accent: 'from-[#70162A] to-[#9b1f3d]', soft: 'bg-amber-50 text-amber-800', ring: 'hover:border-amber-300',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// Architectural line drawing that draws itself behind the hero
const Blueprint: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 600 400" fill="none" aria-hidden="true" className={`pointer-events-none ${className}`}>
    <defs>
      <pattern id="kb-grid" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M24 0H0V24" stroke="#E1007A" strokeOpacity="0.08" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="600" height="400" fill="url(#kb-grid)" />
    {[
      'M60 330 H540',
      'M100 330 V190 H500 V330',
      'M80 190 L300 90 L520 190',
      'M260 330 V250 H340 V330',
      'M140 220 H200 V270 H140 Z',
      'M400 220 H460 V270 H400 Z',
      'M300 90 V60 M300 60 L330 70 L300 80',
      'M60 360 H540 M60 352 V368 M540 352 V368',
    ].map((d, i) => (
      <motion.path key={i} d={d} stroke={i === 7 ? GOLD : '#E1007A'} strokeOpacity={i === 7 ? 0.7 : 0.35} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, delay: 0.2 + i * 0.18, ease: 'easeInOut' }} />
    ))}
  </svg>
);

export const SchoolSetup: React.FC<{ onConsult: () => void }> = ({ onConsult }) => {
  const [processRef, processCls] = useStagger(0.3);
  const [facRef, facCls] = useStagger(0.1);

  return (
    <div className="space-y-16 sm:space-y-20 animate-fadeIn overflow-x-clip">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF7FB] via-[#FAF9F6] to-[#FBF3E4] px-4 sm:px-8 pt-10 pb-14 sm:pt-14 sm:pb-20">
        <Blueprint className="absolute -right-24 top-0 hidden h-full w-[60%] opacity-70 lg:block" />
        <div aria-hidden="true" className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#E1007A]/10 blur-3xl kb-drift" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <motion.div className="space-y-6 lg:col-span-6" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-800">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 kb-wiggle" />
              <span>FLAGSHIP K-12 SCHOOL PARTNERSHIP</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-3xl font-display font-extrabold leading-[1.1] tracking-tight text-[#1C1917] sm:text-5xl lg:text-[3.4rem]">
              CBSE &amp; IB School Setup <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E1007A] via-pink-500 to-[#70162A]">&amp; Consultancy</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
              Establish a high-quality CBSE school or IB World School in India with comprehensive support for school planning, affiliation guidance, infrastructure design, teacher training, and digital admissions growth.
            </motion.p>

            <div ref={processRef} className={`grid grid-cols-2 gap-3 sm:grid-cols-4 ${processCls}`}>
              {PROCESS.map(p => (
                <div key={p.label} className="group flex flex-col items-center gap-2 rounded-2xl border border-stone-200 bg-white/80 p-3 text-center backdrop-blur transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-lg">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-pink-50 to-amber-50 text-[#E1007A] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                    <p.icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <span className="text-[11px] font-bold leading-tight text-stone-700 sm:text-xs">{p.label}</span>
                </div>
              ))}
            </div>

            <motion.div variants={fadeUp}>
              <button onClick={onConsult}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E1007A] to-pink-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-pink-500/30 transition-all duration-300 hover:-translate-y-0.5 sm:w-auto sm:text-base">
                <span>Book Free Consultation for CBSE &amp; IB Setup</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>
          </motion.div>

          {/* Hero image in a gold frame with floating credentials */}
          <motion.div className="relative mx-auto w-full max-w-xl lg:col-span-6"
            initial={{ opacity: 0, x: 40, rotate: 1.5 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ duration: 1, delay: 0.2, ease: EASE }}>
            <div aria-hidden="true" className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border-2" style={{ borderColor: `${GOLD}AA` }} />
            <div className="kb-frame relative overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl shadow-stone-400/30">
              <img src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Preschool/CBSE%20School.jpeg" alt="CBSE & IB World School Campus Setup"
                className="aspect-[4/3] w-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <motion.div className="absolute -left-4 top-6 sm:-left-8" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', delay: 1 }}>
              <div className="kb-float flex items-center gap-2.5 rounded-2xl border border-white bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-[#E1007A]"><Landmark className="h-5 w-5" /></span>
                <span><span className="block text-xs font-extrabold text-stone-800">CBSE</span><span className="block text-[10px] text-stone-500">NEP 2020 Aligned</span></span>
              </div>
            </motion.div>
            <motion.div className="absolute -right-3 bottom-8 sm:-right-6" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', delay: 1.25 }}>
              <div className="kb-float flex items-center gap-2.5 rounded-2xl border border-white bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur [animation-delay:-3s]">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${GOLD}, #E8CF8A)` }}><Award className="h-5 w-5" /></span>
                <span><span className="block text-xs font-extrabold text-stone-800">IB World School</span><span className="block text-[10px] text-stone-500">PYP • MYP • DP</span></span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= DUAL PATHWAYS ================= */}
      <section className="mx-auto max-w-7xl space-y-10 px-4 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#E1007A]">
              <Sparkles className="h-3.5 w-3.5" /><span>Dual K-12 Pathways</span>
            </div>
            <h2 className="text-3xl font-display font-extrabold tracking-tight text-stone-900 sm:text-4xl">Choose the Ideal Framework for Your Campus</h2>
            <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
              Whether you plan to launch India's most trusted national board or an elite global IB World School, KinderBee provides 360-degree turnkey consultancy from land sanctioning to campus inauguration.
            </p>
          </div>
        </Reveal>

        <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
          {/* VS badge between the two options */}
          <motion.div aria-hidden="true" className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
            initial={{ scale: 0, rotate: -90 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ type: 'spring', delay: 0.5 }}>
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#FAF9F6] bg-stone-900 font-display text-sm font-extrabold text-[#FFD400] shadow-xl">VS</span>
          </motion.div>

          {PATHWAYS.map(p => (
            <motion.div key={p.title}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-[box-shadow,border-color] duration-300 hover:shadow-2xl ${p.ring}`}
              initial={{ opacity: 0, x: p.from }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.8, ease: EASE }}
              whileHover={{ y: -6 }}>
              <div className={`h-2 bg-gradient-to-r ${p.accent}`} />
              <p.icon aria-hidden="true" className="absolute -right-6 top-6 h-40 w-40 text-stone-100 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110" strokeWidth={1} />
              <div className="relative space-y-5 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${p.soft}`}>{p.badge}</span>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-bold text-stone-600">{p.tag}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${p.accent}`}><p.icon className="h-6 w-6" /></span>
                  <h3 className="text-2xl font-display font-extrabold text-stone-900">{p.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-stone-600">{p.text}</p>
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400">Core Focus Areas:</h4>
                  <ul className="space-y-2">
                    {p.focus.map((f, i) => (
                      <motion.li key={f} className="flex items-start gap-2.5 text-sm font-medium text-stone-700"
                        initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.08 }}>
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E1007A]" /> {f}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 bg-stone-50/70 px-6 py-5 sm:px-8">
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-widest text-stone-400">Estimated Outlay</span>
                  <span className="text-lg font-extrabold text-stone-900">{p.outlay}</span>
                </div>
                <button onClick={onConsult} className={`group/btn inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 ${p.accent}`}>
                  {p.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= FINANCIAL & INFRASTRUCTURE ================= */}
      <Reveal>
      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-[#1C1917] to-stone-950 p-6 text-white shadow-2xl sm:p-10">
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:32px_32px]" />
          <div aria-hidden="true" className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#E1007A]/20 blur-3xl kb-drift" />

          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl font-display font-extrabold sm:text-3xl">Financial &amp; Infrastructure Specifications</h3>
              <p className="mt-1 text-sm text-stone-300">Clear transparent guidance for both CBSE Affiliated and IB World School models.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-[#FFD400]">
              <MapPinned className="h-3.5 w-3.5" /> Tier 1, Tier 2 &amp; Tier 3 Ready
            </span>
          </div>

          <div className="relative mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Investment with an animated range chart */}
            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-pink-400">Estimated Investment</div>
              <div className="text-2xl font-extrabold">₹2 Cr – ₹15 Cr+</div>
              <div className="space-y-2.5">
                {[
                  { k: 'CBSE', from: 2, to: 5, c: 'from-[#E1007A] to-pink-400' },
                  { k: 'IB', from: 5, to: 15, c: 'from-amber-400 to-[#FFD400]' },
                ].map((r, i) => (
                  <div key={r.k} className="grid grid-cols-[2.5rem_1fr] items-center gap-2 text-[11px] font-bold">
                    <span className="text-stone-300">{r.k}</span>
                    <span className="relative h-3 rounded-full bg-white/10">
                      <motion.span className={`absolute inset-y-0 rounded-full bg-gradient-to-r ${r.c}`} style={{ left: `${(r.from / 16) * 100}%` }}
                        initial={{ width: 0 }} whileInView={{ width: `${((r.to - r.from) / 16) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1.1, delay: 0.3 + i * 0.2, ease: EASE }} />
                    </span>
                  </div>
                ))}
                <div className="relative ml-[3.1rem] h-4 text-[10px] text-stone-400">
                  {[0, 5, 10, 15].map(v => <span key={v} className="absolute -translate-x-1/2" style={{ left: `${(v / 16) * 100}%` }}>₹{v}Cr</span>)}
                </div>
              </div>
              <p className="text-xs leading-relaxed text-stone-400">₹2 Cr – ₹5 Cr+ for standard CBSE K-12 campus; ₹5 Cr – ₹15 Cr+ for comprehensive international IB campus. Investment varies with land ownership, scale, and facilities.</p>
            </div>

            {/* Land */}
            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">Land Requirements</div>
              <div className="text-xl font-extrabold">As per Board Bye-Laws</div>
              <svg viewBox="0 0 200 90" className="h-24 w-full" aria-hidden="true">
                <motion.rect x="10" y="10" width="180" height="70" rx="6" fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="6 5"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} />
                <motion.g initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8 }}>
                  <rect x="30" y="34" width="60" height="34" rx="3" fill="#34d399" fillOpacity="0.25" stroke="#34d399" />
                  <rect x="110" y="24" width="64" height="44" rx="22" fill="#34d399" fillOpacity="0.12" stroke="#34d399" strokeDasharray="3 3" />
                  <text x="60" y="56" textAnchor="middle" fontSize="9" fill="#a7f3d0">School block</text>
                  <text x="142" y="50" textAnchor="middle" fontSize="9" fill="#a7f3d0">Sports field</text>
                </motion.g>
                <text x="100" y="88" textAnchor="middle" fontSize="8" fill="#6ee7b7">1.5 – 2+ acres</text>
              </svg>
              <p className="text-xs leading-relaxed text-stone-400">CBSE requires land adherence per Affiliation Bye-Laws (typically 1.5 to 2+ acres depending on municipal/urban limits). IB mandates adequate space for international sports and learning hubs.</p>
            </div>

            {/* Campus development */}
            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-amber-400">Campus Development</div>
              <div className="text-xl font-extrabold">Architectural Masterplan</div>
              <div className="flex flex-wrap gap-1.5">
                {['Building codes', 'Child safety', 'Fire NOC', 'Barrier-free', 'Smart-class acoustics'].map((t, i) => (
                  <motion.span key={t} className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-[11px] font-semibold text-amber-200"
                    initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.08 }}>
                    {t}
                  </motion.span>
                ))}
              </div>
              <p className="text-xs leading-relaxed text-stone-400">Compliant with national building codes, child safety protocols, fire NOC specifications, barrier-free access, and digital smart-class acoustic standards.</p>
            </div>
          </div>

          <div className="relative mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
            <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FFD400]" />
            <div>
              <h4 className="text-sm font-bold">Suitable for:</h4>
              <p className="mt-1 text-sm leading-relaxed text-stone-300">Entrepreneurs, educational investors, existing school owners seeking upgrade or dual-curriculum expansion, educational trusts, and charitable societies aiming to establish landmark K-12 or international schools.</p>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {/* ================= FACILITIES + LIFECYCLE ================= */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-8 lg:grid-cols-2">
        {/* Facilities */}
        <Reveal>
        <div className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /><span>Turnkey Campus Facilities</span>
              </div>
              <h3 className="mt-3 text-2xl font-display font-extrabold text-stone-900 sm:text-3xl">Recommended CBSE &amp; IB Facilities</h3>
              <p className="mt-1 text-sm text-stone-600">Every blueprint we design fulfills board affiliation prerequisites while inspiring 21st-century learners.</p>
            </div>
            <div ref={facRef} className={`grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 ${facCls}`}>
              {FACILITIES.map(f => (
                <div key={f.label} className="group flex items-center gap-2.5 rounded-xl border border-stone-100 bg-stone-50/70 px-3 py-2.5 transition-colors duration-300 hover:border-pink-200 hover:bg-pink-50/50">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#E1007A] shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                    <f.icon className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-semibold text-stone-700 sm:text-sm">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onConsult} className="group inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-stone-800">
            <span>Consult Our School Planning Team</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        </Reveal>

        {/* 6-step lifecycle as a self-drawing timeline */}
        <Reveal>
        <div className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-stone-200 bg-gradient-to-br from-pink-50/60 via-white to-amber-50/50 p-6 shadow-sm sm:p-8">
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#E1007A]">
                <Sparkles className="h-3.5 w-3.5" /><span>Turnkey Consulting</span>
              </div>
              <h3 className="mt-3 text-2xl font-display font-extrabold text-stone-900 sm:text-3xl">6-Step Advisory Lifecycle</h3>
              <p className="mt-1 text-sm text-stone-600">From your first vision meeting to full student admissions, we guide every milestone.</p>
            </div>
            <ol className="relative space-y-4 pl-1">
              <motion.span aria-hidden="true" className="absolute bottom-5 left-[21px] top-5 w-0.5 origin-top bg-gradient-to-b from-[#E1007A] via-pink-400 to-[#FFD400]"
                initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.8, ease: 'easeInOut' }} />
              {LIFECYCLE.map((s, i) => (
                <motion.li key={s.title} className="relative flex items-start gap-4"
                  initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.5, delay: i * 0.12 }}>
                  <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#E1007A] to-pink-500 text-white shadow-md">
                    <s.icon className="h-5 w-5" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FFD400] text-[10px] font-extrabold text-stone-900">{i + 1}</span>
                  </span>
                  <div className="rounded-xl bg-white/80 px-4 py-3 shadow-xs ring-1 ring-stone-100 transition hover:shadow-md">
                    <h4 className="text-sm font-bold text-stone-900">{s.title}</h4>
                    <p className="mt-0.5 text-xs leading-relaxed text-stone-600">{s.text}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
          <button onClick={onConsult} className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E1007A] to-pink-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-500/30 transition hover:-translate-y-0.5">
            Request Detailed School Setup Dossier <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        </Reveal>
      </section>
    </div>
  );
};
