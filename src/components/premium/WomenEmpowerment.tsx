import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, ArrowRight, Phone, MessageCircle, Flower2, Compass, RotateCcw, TrendingUp, School, Store, PenTool,
  BookOpen, Award, CheckCircle2, CreditCard,
} from 'lucide-react';
import { SystemSettings } from '../../types';
import { EASE } from '../Motion';
import { Accordion, Eyebrow, Palette, SERIF, inView, rise, stagger } from './kit';

// New section for the NTT / Teacher Training page, written to welcome women who want to build a
// career in early childhood education. Fees, hours and eligibility are the ones already on the page.

const P: Palette = {
  bg: '#FFF7F2',
  ink: '#3A0A26',
  muted: '#755463',
  accent: '#E1007A',
  accentSoft: '#F7A8CF',
  card: 'rgba(255,255,255,0.85)',
  line: 'rgba(90,15,58,0.14)',
  dark: false,
};
const GOLD = '#C9A24A';

const WHO = [
  { icon: Compass, t: 'Starting your career', d: 'Aspiring teachers who want a clear, recognised first step into early-years teaching.' },
  { icon: RotateCcw, t: 'Returning to work', d: 'Women restarting after a career break or years at home, who want practical skills and fresh confidence before stepping into a classroom.' },
  { icon: TrendingUp, t: 'Moving up', d: 'Working teachers who want an advanced credential and modern, play-based methods for their classroom.' },
];

const PATHS = [
  { icon: School, t: 'Teach in a preschool', d: 'Bring play-based, child-centred teaching to your own classroom.' },
  { icon: PenTool, t: 'Design learning', d: 'Plan activities and curriculum for the foundational years, the skill behind every great classroom.' },
  { icon: Store, t: 'Own your preschool', d: 'Some teachers go on to open their own school. Kinderbee offers a zero-royalty preschool partnership.', action: true },
  { icon: BookOpen, t: 'Keep growing', d: 'Add a diploma or certificate as your experience grows, and move into larger roles at your pace.' },
];

const HOURS = [
  { label: 'Interactive masterclasses', h: 60, c: '#E1007A' },
  { label: 'Simulation labs', h: 40, c: GOLD },
  { label: 'Capstone project', h: 20, c: '#7209B7' },
];

const COMPARE: { name: string; fee: string; note: string; who?: string; feature?: boolean }[] = [
  { name: 'Advanced Diploma in Early Childhood Care & Education', fee: '₹4,999', note: 'Limited-period fee · 120 hours over 12 weeks', who: 'Aspiring & working teachers', feature: true },
  { name: 'Certificate in Nordic inspired Preschool Teaching', fee: '₹8,500', note: 'Child-centred global teaching methods' },
  { name: 'Foundational Stage Curriculum Design', fee: '₹9,500', note: 'NEP 2020 & NCF-FS aligned curriculum' },
  { name: 'Diploma in Play school Teacher Training', fee: '₹12,000', note: 'Play-based classroom activity planning', who: 'Preschool educators' },
];

const FAQ = [
  {
    q: 'I have been away from work for years. Can I still do this?',
    a: 'Aspiring and working teachers are both welcome. The Advanced Diploma includes 40 hours of simulation labs and a 20-hour capstone project, so you practise before you teach. Tell us about your background and we will suggest the programme that suits you.',
  },
  { q: 'Will I receive a certificate?', a: 'Yes. You receive a Certificate of Course Completion from Finnishway Academy. You can view a sample on this page.' },
  { q: 'How much does it cost?', a: 'The Advanced Diploma is ₹4,999 as a limited-period fee. The other programmes are ₹8,500, ₹9,500 and ₹12,000, as listed above. Ask us if you would like help choosing.' },
  { q: 'Can I turn this into my own business one day?', a: 'Many educators dream of a school of their own. Kinderbee also offers a zero-royalty preschool partnership, so ask us how teacher training and school ownership can fit together for you.' },
  { q: 'Is a job guaranteed after the course?', a: 'No. Opportunities depend on your location, experience and the roles available. We will guide you honestly on what to expect.' },
];

export const WomenEmpowerment: React.FC<{
  onOpenConsultation: (type?: string) => void;
  onNavigateToPayment?: (programme?: string, amount?: string) => void;
  settings?: SystemSettings | null;
}> = ({ onOpenConsultation, onNavigateToPayment, settings }) => {
  const phone = settings?.phone || '81223 44040';
  const wa = (settings?.whatsappNumber || '918122344040').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${wa}?text=${encodeURIComponent('Hello Kinderbee, I would like to know more about the teacher training programmes.')}`;

  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-8" aria-labelledby="women-title">
      <div className="relative overflow-hidden rounded-[2rem] border p-5 shadow-xl sm:p-10 lg:p-14" style={{ background: 'linear-gradient(135deg,#FFF1F7 0%,#FFF8EF 50%,#FDECF3 100%)', borderColor: '#F6D3E2' }}>
        <div aria-hidden="true" className="kb-drift pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#E1007A]/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[#C9A24A]/15 blur-3xl" />

        {/* ---------- Feature panel ---------- */}
        <div className="relative grid overflow-hidden rounded-[1.75rem] text-white lg:grid-cols-[1.15fr_0.85fr]" style={{ background: 'linear-gradient(135deg,#4A0E33 0%,#2A0620 100%)' }}>
          <Flower2 aria-hidden="true" className="kb-spin-slow pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 text-white/[0.05]" />
          <motion.div className="relative p-7 sm:p-12" variants={stagger(0.12)} {...inView}>
            <motion.div variants={rise}><Eyebrow color={GOLD}>For women in early education</Eyebrow></motion.div>
            <motion.h2 id="women-title" variants={rise} style={SERIF} className="text-4xl leading-[1.08] sm:text-5xl">
              Teach with confidence. <span style={{ color: '#F3D68B' }}>Lead with purpose.</span>
            </motion.h2>
            <motion.p variants={rise} className="mt-5 max-w-xl text-base leading-relaxed text-pink-100/90 sm:text-lg">
              Early childhood teaching is a respected, rewarding career, and it can begin with one 12-week course. The Advanced Diploma welcomes aspiring and working teachers, and is designed with women who are starting, returning or moving up in mind.
            </motion.p>
            <motion.div variants={rise} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {onNavigateToPayment && (
                <button
                  onClick={() => onNavigateToPayment('Advanced Diploma in Early Childhood Care & Education (ECCE)', '4999')}
                  className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-[#2A0620] transition hover:-translate-y-0.5 hover:shadow-xl"
                  style={{ background: 'linear-gradient(135deg,#F6E3A8,#D9B25A)' }}
                >
                  <CreditCard className="h-4 w-4" /> Enrol in the Advanced Diploma · ₹4,999
                </button>
              )}
              <button onClick={() => onOpenConsultation('fwa_course')} className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">
                Talk to our team <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </motion.div>

          {/* The 120 hours, drawn */}
          <motion.div className="relative border-t border-white/10 bg-white/[0.04] p-7 sm:p-10 lg:border-l lg:border-t-0" variants={rise} {...inView}>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>Your 12 weeks</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span style={SERIF} className="text-6xl leading-none">120</span>
              <span className="text-sm text-pink-100/80">hours of learning</span>
            </div>
            <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-white/10" role="img" aria-label="60 hours masterclasses, 40 hours simulation labs, 20 hours capstone">
              {HOURS.map((x, i) => (
                <motion.span key={x.label} className="h-full" style={{ background: x.c }}
                  initial={{ width: 0 }} whileInView={{ width: `${(x.h / 120) * 100}%` }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 1.1, delay: 0.2 + i * 0.25, ease: EASE }} />
              ))}
            </div>
            <ul className="mt-5 space-y-3">
              {HOURS.map(x => (
                <li key={x.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2.5 text-pink-50"><span className="h-2.5 w-2.5 rounded-full" style={{ background: x.c }} />{x.label}</span>
                  <span className="font-bold text-white">{x.h} hrs</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3.5 text-[13px] leading-relaxed text-pink-100/90">
              <Award className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#F3D68B' }} />
              You finish with a Certificate of Course Completion from Finnishway Academy.
            </div>
          </motion.div>
        </div>

        {/* ---------- Who it is for ---------- */}
        <div className="relative mt-16">
          <motion.div className="mx-auto max-w-2xl text-center" variants={stagger(0.1)} {...inView}>
            <motion.div variants={rise}><Eyebrow color={P.accent} center>Who it is for</Eyebrow></motion.div>
            <motion.h2 variants={rise} style={SERIF} className="text-3xl leading-tight sm:text-[2.6rem]"><span style={{ color: P.ink }}>Wherever you are, there is a place for you here.</span></motion.h2>
          </motion.div>
          <motion.div className="mt-10 grid gap-4 md:grid-cols-3" variants={stagger(0.1)} {...inView}>
            {WHO.map(({ icon: Icon, t, d }) => (
              <motion.div key={t} variants={rise} className="group rounded-2xl border p-6 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl" style={{ background: P.card, borderColor: P.line }}>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" style={{ background: 'linear-gradient(135deg,#E1007A,#B80065)' }}><Icon className="h-5 w-5" /></span>
                <h3 className="mt-4 text-lg font-bold" style={{ color: P.ink }}>{t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: P.muted }}>{d}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ---------- Where it can lead ---------- */}
        <div className="relative mt-16">
          <motion.div className="mx-auto max-w-2xl text-center" variants={stagger(0.1)} {...inView}>
            <motion.div variants={rise}><Eyebrow color={P.accent} center>Where it can lead</Eyebrow></motion.div>
            <motion.h2 variants={rise} style={SERIF} className="text-3xl leading-tight sm:text-[2.6rem]"><span style={{ color: P.ink }}>One course. Many ways to grow.</span></motion.h2>
          </motion.div>
          <motion.div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" variants={stagger(0.08)} {...inView}>
            {PATHS.map(({ icon: Icon, t, d, action }) => (
              <motion.div key={t} variants={rise} className="flex flex-col rounded-2xl border p-5" style={{ background: P.card, borderColor: P.line }}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${GOLD}26`, color: '#8A6A1E' }}><Icon className="h-5 w-5" /></span>
                <h3 className="mt-3 text-base font-bold" style={{ color: P.ink }}>{t}</h3>
                <p className="mt-1.5 flex-1 text-[13px] leading-relaxed" style={{ color: P.muted }}>{d}</p>
                {action && (
                  <button onClick={() => onOpenConsultation('preschool')} className="mt-3 inline-flex w-fit cursor-pointer items-center gap-1.5 text-[13px] font-bold underline-offset-4 hover:underline" style={{ color: P.accent }}>
                    Explore the partnership <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
          <p className="mx-auto mt-5 max-w-2xl text-center text-xs" style={{ color: P.muted }}>Opportunities depend on your location, experience and the roles available. Placement is not guaranteed.</p>
        </div>

        {/* ---------- Compare programmes ---------- */}
        <div className="relative mt-16">
          <motion.div className="mx-auto max-w-2xl text-center" variants={stagger(0.1)} {...inView}>
            <motion.div variants={rise}><Eyebrow color={P.accent} center>Choose your programme</Eyebrow></motion.div>
            <motion.h2 variants={rise} style={SERIF} className="text-3xl leading-tight sm:text-[2.6rem]"><span style={{ color: P.ink }}>Four programmes, one clear starting point.</span></motion.h2>
          </motion.div>
          <motion.ul className="mt-10 space-y-3" variants={stagger(0.08)} {...inView}>
            {COMPARE.map(c => (
              <motion.li key={c.name} variants={rise}
                className="flex flex-col gap-3 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                style={{ background: c.feature ? 'linear-gradient(135deg,#FFFFFF,#FFF0F7)' : P.card, borderColor: c.feature ? P.accent : P.line, boxShadow: c.feature ? '0 12px 32px -16px rgba(225,0,122,0.45)' : undefined }}>
                <div className="min-w-0">
                  {c.feature && <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-[#E1007A] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"><Sparkles className="h-3 w-3" /> Best place to start</span>}
                  <h3 className="text-base font-bold leading-snug sm:text-lg" style={{ color: P.ink }}>{c.name}</h3>
                  <p className="mt-0.5 text-[13px]" style={{ color: P.muted }}>{c.note}</p>
                  {c.who && <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold" style={{ color: P.muted }}><CheckCircle2 className="h-3.5 w-3.5" style={{ color: P.accent }} /> Eligible: {c.who}</p>}
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <div style={SERIF} className="text-3xl leading-none"><span style={{ color: P.ink }}>{c.fee}</span></div>
                  <button onClick={() => onOpenConsultation('fwa_course')} className="mt-2 cursor-pointer text-[13px] font-bold underline-offset-4 hover:underline" style={{ color: P.accent }}>Enquire →</button>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* ---------- FAQ ---------- */}
        <div className="relative mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div variants={rise} {...inView}>
            <Eyebrow color={P.accent}>Questions women ask us</Eyebrow>
            <h2 style={SERIF} className="text-3xl leading-tight sm:text-[2.3rem]"><span style={{ color: P.ink }}>Honest answers, before you decide.</span></h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: P.muted }}>Not sure which programme fits your life? Speak to a real person. We will listen first.</p>
            <div className="mt-6 flex flex-col gap-2.5 text-sm font-bold">
              <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="inline-flex w-fit items-center gap-2 hover:underline" style={{ color: P.ink }}><Phone className="h-4 w-4" style={{ color: P.accent }} /> {phone}</a>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-2 hover:underline" style={{ color: P.ink }}><MessageCircle className="h-4 w-4" style={{ color: P.accent }} /> Chat on WhatsApp</a>
            </div>
          </motion.div>
          <motion.div variants={rise} {...inView}><Accordion items={FAQ} p={P} /></motion.div>
        </div>
      </div>
    </section>
  );
};
