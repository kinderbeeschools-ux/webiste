import React from 'react';
import { motion } from 'motion/react';
import {
  BadgeCheck, Ruler, BookMarked, BookOpen, UserSearch, GraduationCap, Globe2, Megaphone, CalendarHeart,
  MonitorSmartphone, ClipboardCheck, Handshake, Puzzle, ScrollText, TreePine, FlaskConical, HeartHandshake,
  Hand, BookA, Sparkles, ArrowRight, Home, Trees, Building2,
} from 'lucide-react';
import { EASE, useStagger } from './Motion';
import { Rainbow, Star, Heart, Bee } from './Doodles';

// Original item names are kept exactly; the one-line descriptions explain each one.
const BENEFIT_GROUPS = [
  {
    step: '01', title: 'Launch & Brand', tint: 'from-pink-50 to-white', accent: 'bg-[#E1007A] text-white', ring: 'hover:border-pink-200',
    items: [
      { icon: BadgeCheck, name: 'Official Brand License', desc: 'Open under the trusted Kinderbee name and identity.' },
      { icon: Ruler, name: 'School Design Blueprint', desc: 'Child-safe classroom and play-area layouts for your space.' },
      { icon: BookMarked, name: 'Franchise Operations Manual', desc: 'Step-by-step processes for running every part of the school.' },
    ],
  },
  {
    step: '02', title: 'Curriculum & Team', tint: 'from-yellow-50 to-white', accent: 'bg-[#FFD400] text-stone-900', ring: 'hover:border-yellow-300',
    items: [
      { icon: BookOpen, name: 'Custom Local Curriculum', desc: 'Nordic-inspired learning adapted to your city and community.' },
      { icon: UserSearch, name: 'Staff Recruitment Guides', desc: 'Know whom to hire and how to choose the right teachers.' },
      { icon: GraduationCap, name: 'Comprehensive Training', desc: 'Training for teachers and staff before and after launch.' },
    ],
  },
  {
    step: '03', title: 'Admissions & Marketing', tint: 'from-sky-50 to-white', accent: 'bg-sky-500 text-white', ring: 'hover:border-sky-200',
    items: [
      { icon: Globe2, name: 'SEO-Optimized Micro-Websites', desc: 'A local website that helps parents find you online.' },
      { icon: Megaphone, name: 'Admissions Playbooks', desc: 'Proven steps that turn enquiries into admissions.' },
      { icon: CalendarHeart, name: 'Monthly Marketing Campaigns', desc: 'Ready-made campaigns to keep your school visible.' },
    ],
  },
  {
    step: '04', title: 'Operations & Support', tint: 'from-violet-50 to-white', accent: 'bg-violet-500 text-white', ring: 'hover:border-violet-200',
    items: [
      { icon: MonitorSmartphone, name: 'School Management ERP', desc: 'Attendance, fees and records managed in one place.' },
      { icon: ClipboardCheck, name: 'Continuous Quality Audits', desc: 'Regular reviews that keep standards consistent.' },
      { icon: Handshake, name: 'Mentorship Advisory Support', desc: 'An experienced advisor to guide you at every stage.' },
    ],
  },
];

const PILLARS = [
  { icon: Puzzle, name: 'Play-Based & Experiential Learning', desc: 'Children learn by doing, exploring and playing.', c: 'bg-pink-100 text-[#E1007A]' },
  { icon: ScrollText, name: 'NEP 2020 Early Childhood Care & Education', desc: "Aligned with India's national early-years framework.", c: 'bg-amber-100 text-amber-700' },
  { icon: TreePine, name: 'Finnish-Inspired Child-Centric Pedagogy', desc: 'Every child learns at their own pace, led by curiosity.', c: 'bg-emerald-100 text-emerald-700' },
  { icon: FlaskConical, name: 'STEM & Activity-Based Exploration', desc: 'Early science, numbers and problem-solving, hands-on.', c: 'bg-sky-100 text-sky-700' },
  { icon: HeartHandshake, name: 'Social & Emotional Intelligence Skills', desc: 'Sharing, empathy and confidence, built every day.', c: 'bg-violet-100 text-violet-700' },
  { icon: Hand, name: 'Fine & Gross Motor Development', desc: 'Activities that build skilful hands and active bodies.', c: 'bg-orange-100 text-orange-700' },
  { icon: BookA, name: 'Phonics & Early Literacy Modules', desc: 'Sounds, letters and stories for confident early readers.', c: 'bg-rose-100 text-rose-700' },
];

const COVERS = ['Interior setup', 'Safety flooring', 'Furniture', 'Activity kits', 'Marketing launch'];

const SectionHeading: React.FC<{ badge: string; title: React.ReactNode; sub: string; dark?: boolean }> = ({ badge, title, sub, dark }) => (
  <motion.div
    className="text-center max-w-2xl mx-auto space-y-3"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.7, ease: EASE }}
  >
    <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full ${dark ? 'bg-white/10 text-[#FFD400] border border-white/15' : 'bg-pink-50 text-[#E1007A] border border-pink-200'}`}>
      <Sparkles className="w-3.5 h-3.5" /> {badge}
    </div>
    <h2 className={`text-2xl sm:text-4xl font-display font-extrabold tracking-tight ${dark ? 'text-white' : 'text-[#1C1917]'}`}>{title}</h2>
    <p className={`text-sm sm:text-base leading-relaxed ${dark ? 'text-stone-300' : 'text-stone-600'}`}>{sub}</p>
  </motion.div>
);

export const FranchiseDetails: React.FC<{ onOpenConsultation: () => void }> = ({ onOpenConsultation }) => {
  const [groupsRef, groupsCls] = useStagger(0.1);
  const [pillarsRef, pillarsCls] = useStagger(0.1);
  const [specsRef, specsCls] = useStagger(0.15);

  return (
    <>
      {/* ---------- What you receive: 12 items in 4 journey stages ---------- */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <Star className="hidden md:block absolute top-0 left-10 w-9 kb-spin-slow" />
        <Heart className="hidden md:block absolute top-10 right-12 w-9 kb-wiggle" />
        <SectionHeading
          badge="Your complete partner kit"
          title={<>What You Receive As a <span className="text-[#E1007A]">KIPS Preschool Partner</span></>}
          sub="Twelve essentials, organised into the four stages of opening and growing your preschool."
        />

        <div ref={groupsRef} className={`grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 ${groupsCls}`}>
          {BENEFIT_GROUPS.map(g => (
            <div key={g.step} className={`relative rounded-3xl border border-stone-200 bg-gradient-to-br ${g.tint} p-5 sm:p-6 shadow-xs transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-xl ${g.ring}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`w-10 h-10 rounded-2xl ${g.accent} flex items-center justify-center text-sm font-extrabold shadow-md`}>{g.step}</span>
                <h3 className="text-lg sm:text-xl font-display font-extrabold text-[#1C1917]">{g.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {g.items.map(it => (
                  <li key={it.name} className="group flex items-start gap-3 rounded-2xl bg-white/80 border border-stone-100 p-3 transition-colors duration-300 hover:bg-white">
                    <span className="shrink-0 w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-[#E1007A] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                      <it.icon className="w-5 h-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-stone-800">{it.name}</span>
                      <span className="block text-xs text-stone-500 leading-relaxed mt-0.5">{it.desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Curriculum & learning pillars ---------- */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-5 sm:p-10 space-y-8">
          <Rainbow className="hidden sm:block absolute -top-2 right-8 w-28 opacity-90 kb-float" />
          <div aria-hidden="true" className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#FFD400]/15 blur-3xl" />
          <SectionHeading
            badge="What children learn"
            title="Preschool Curriculum & Learning Pillars"
            sub="Seven pillars that shape every day in a Kinderbee classroom."
          />
          <div ref={pillarsRef} className={`relative grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 ${pillarsCls}`}>
            {PILLARS.map(p => (
              <div key={p.name} className="group rounded-2xl border border-stone-200 bg-stone-50/60 p-4 sm:p-5 transition-[translate,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg">
                <span className={`inline-flex w-11 h-11 rounded-2xl ${p.c} items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                  <p.icon className="w-5 h-5" />
                </span>
                <h3 className="mt-3 text-sm font-bold text-stone-900 leading-snug">{p.name}</h3>
                <p className="mt-1 text-xs text-stone-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
            {/* Closing tile */}
            <div className="rounded-2xl bg-gradient-to-br from-[#E1007A] to-pink-600 p-4 sm:p-5 text-white flex flex-col justify-between min-h-[150px]">
              <Sparkles className="w-6 h-6 text-[#FFD400]" />
              <div>
                <div className="text-sm font-bold leading-snug">Finnish pedagogy meets NEP 2020</div>
                <div className="text-xs text-pink-100 mt-1">One curriculum, delivered the same way in every Kinderbee preschool.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Investment & space specifications ---------- */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-[#1C1917] to-stone-950 p-5 sm:p-10 shadow-2xl space-y-8">
          <div aria-hidden="true" className="absolute -top-24 right-10 w-80 h-80 rounded-full bg-[#E1007A]/20 blur-3xl kb-drift" />
          <Bee className="hidden md:block absolute top-6 left-8 w-24 kb-fly" />
          <SectionHeading
            dark
            badge="The numbers"
            title="Investment & Space Specifications"
            sub="A clear picture of what it takes to open your Kinderbee preschool."
          />

          <div ref={specsRef} className={`relative grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 ${specsCls}`}>
            {/* Investment range */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
              <div className="text-xs uppercase tracking-widest text-pink-400 font-bold">Estimated Capital Investment</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">₹15 Lakhs – ₹30 Lakhs</div>
              <div>
                <div className="relative h-3 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-[37.5%] rounded-full bg-gradient-to-r from-[#E1007A] to-[#FFD400]"
                    initial={{ width: 0 }}
                    whileInView={{ width: '37.5%' }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
                  />
                </div>
                {/* Scale: ₹0 to ₹40 L, so ₹15 L sits at 37.5% and ₹30 L at 75% */}
                <div className="relative mt-1.5 h-4 text-[10px] font-semibold text-stone-400">
                  <span className="absolute left-0">₹0</span>
                  <span className="absolute left-[37.5%] -translate-x-1/2 text-pink-300">₹15 L</span>
                  <span className="absolute left-[75%] -translate-x-1/2 text-[#FFD400]">₹30 L</span>
                  <span className="absolute right-0">₹40 L</span>
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-stone-400 mb-2">Covers</div>
                <div className="flex flex-wrap gap-1.5">
                  {COVERS.map(c => (
                    <span key={c} className="text-[11px] font-semibold text-stone-200 bg-white/10 border border-white/10 px-2.5 py-1 rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Zero royalty ring */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col">
              <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Royalty Fee Structure</div>
              <div className="flex items-center gap-4 mt-4">
                <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 -rotate-90" aria-hidden="true">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                  <motion.circle
                    cx="50" cy="50" r="42" fill="none" stroke="#34d399" strokeWidth="10" strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
                  />
                  <text x="50" y="50" transform="rotate(90 50 50)" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="20" fontWeight="800">100%</text>
                </svg>
                <div>
                  <div className="text-xl font-bold text-emerald-300 leading-tight">₹0 / Month</div>
                  <div className="text-sm font-semibold text-white">(100% Zero Royalty)</div>
                </div>
              </div>
              <div className="text-xs text-stone-400 mt-4">Keep 100% of your tuition revenues and profits forever.</div>
            </div>

            {/* Space diagram */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col">
              <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">Space / Built-up Area</div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-2">1,500 – 3,500 Sq. Ft.</div>
              <div className="relative mt-4 h-28 rounded-xl border-2 border-dashed border-[#FFD400]/50 p-2">
                <span className="absolute top-1 right-2 text-[10px] font-semibold text-[#FFD400]/80">3,500 sq ft</span>
                <motion.div
                  className="h-full rounded-lg bg-[#FFD400]/15 border border-[#FFD400]/60 flex items-end p-1.5"
                  initial={{ width: '20%' }}
                  whileInView={{ width: '43%' }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
                >
                  <span className="text-[10px] font-semibold text-[#FFD400] whitespace-nowrap">1,500 sq ft</span>
                </motion.div>
              </div>
              <div className="text-xs text-stone-400 mt-3">Ground floor residential villa or commercial property with outdoor play space.</div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {[{ i: Home, t: 'Ground floor' }, { i: Building2, t: 'Villa or commercial' }, { i: Trees, t: 'Outdoor play' }].map(x => (
                  <span key={x.t} className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-200 bg-white/10 border border-white/10 px-2.5 py-1 rounded-full">
                    <x.i className="w-3 h-3 text-[#FFD400]" /> {x.t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenConsultation}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#E1007A] to-pink-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-pink-900/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <a
              href="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Files/_FRANCHISE.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="Kinderbee_Franchise_Brochure.pdf"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 transition"
            >
              Download Franchise PDF
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
