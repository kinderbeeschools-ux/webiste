import React from 'react';
import { motion } from 'motion/react';
import { MapPinned, Wallet, FileCheck2, UserCheck, Laptop, Megaphone, ShieldAlert, ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { SystemSettings } from '../../types';
import { Accordion, Eyebrow, Palette, ReadinessCheck, SERIF, inView, rise, stagger } from './kit';
import { OrbitVisual } from './visuals';
import { waUrl } from '../../utils/contact';

// New section for the CBSE & IB School Setup page: how a promoter should weigh the decision.
// Outlay ranges, approvals and services are the ones already published on the page.

const P: Palette = {
  bg: '#14110F',
  ink: '#FBF7F0',
  muted: '#CDC3B6',
  accent: '#C9A24A',
  accentSoft: '#E6CD8D',
  card: 'rgba(255,255,255,0.05)',
  line: 'rgba(255,255,255,0.13)',
  dark: true,
};

const PILLARS = [
  { icon: MapPinned, t: 'Land & catchment', d: 'Your site and the families around it decide everything that follows. A feasibility and project report covers demographic analysis, a catchment survey and financial modelling, including a 10-year P&L.' },
  { icon: Wallet, t: 'Capital', d: 'Plan for ₹2 Cr – ₹5 Cr+ for a CBSE campus and ₹5 Cr – ₹15 Cr+ for an IB campus. The figure moves with land ownership, scale and facilities.' },
  { icon: FileCheck2, t: 'Approvals', d: 'State NOC, society bye-laws, CBSE SARAS filing and IB candidacy support. Authorities and boards decide the outcome. We prepare and support the documentation.' },
  { icon: UserCheck, t: 'Leadership & faculty', d: 'Principal onboarding, teacher recruitment and pedagogical workshops, so the team is ready before the first bell.' },
  { icon: Laptop, t: 'Technology & safety', d: 'Interactive digital boards, a student management ERP, RFID and CCTV systems, planned together with the campus.' },
  { icon: Megaphone, t: 'Admissions & launch', d: 'Digital marketing, parent orientations and community enrolment drives that build your first batch.' },
];

const READINESS = [
  'I have identified land, or I am ready to explore sites in my target catchment',
  'I have chosen between the CBSE and IB pathways, or I want advice on choosing',
  'I have planned capital for land, campus development and set-up (₹2 Cr – ₹5 Cr+ for CBSE, ₹5 Cr – ₹15 Cr+ for IB)',
  'I have, or can form, the trust or society that will run the school',
  'I understand that approvals and affiliation are decided by the authorities and the board',
  'I have a principal and leadership team in mind, or want help finding one',
  'I am ready to run an admissions and community campaign before opening',
];

const FAQ = [
  {
    q: 'Can you guarantee CBSE affiliation or IB authorisation?',
    a: 'No. Affiliation and authorisation are decided by CBSE and the IB, and State authorities issue the NOC. We prepare and support the documentation, including SARAS filing, society bye-laws and IB candidacy roadmaps, but no approval or outcome can be guaranteed.',
  },
  {
    q: 'What does the feasibility and project report include?',
    a: 'Demographic analysis, a catchment survey and financial modelling, including a 10-year P&L. It is where a partner sees the numbers before committing to land or construction.',
  },
  {
    q: 'Do you only advise, or do you help carry it through?',
    a: 'Our consultancy runs from land sanctioning to campus inauguration: planning and affiliation, infrastructure design, teacher training and digital admissions support.',
  },
  {
    q: 'How do I begin?',
    a: 'Request the detailed school setup dossier and speak to the school planning team. Share your location, board preference and timeline, and we will take it from there.',
  },
];

export const SchoolPromoterGuide: React.FC<{ onConsult: () => void; settings?: SystemSettings | null }> = ({ onConsult, settings }) => {
  const waLinkUrl = waUrl(settings?.whatsappNumber || settings?.phone, 'Hello Kinderbee, I would like to discuss setting up a CBSE / IB school.');

  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-8" aria-labelledby="promoter-guide-title">
      <div className="relative overflow-hidden rounded-[2rem] p-5 shadow-2xl sm:p-10 lg:p-14" style={{ background: `linear-gradient(160deg, #1F1A16 0%, ${P.bg} 60%, #0C0A08 100%)` }}>
        <div aria-hidden="true" className="kb-drift pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#C9A24A]/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#E1007A]/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]" />

        <motion.div className="relative mx-auto max-w-3xl text-center" variants={stagger(0.12)} {...inView}>
          <motion.div variants={rise}><Eyebrow color={P.accent} center>The partner&rsquo;s guide</Eyebrow></motion.div>
          <motion.h2 id="promoter-guide-title" variants={rise} style={SERIF} className="text-4xl leading-[1.08] text-white sm:text-5xl">
            Six things to weigh <span style={{ color: P.accent }}>before you build a school.</span>
          </motion.h2>
          <motion.p variants={rise} className="mt-5 text-base leading-relaxed sm:text-lg" style={{ color: P.muted }}>
            A school is a decision for decades. This is how we would evaluate it, and where our team stands beside you.
          </motion.p>
        </motion.div>

        {/* The six pillars around your campus, and what planning looks like */}
        <div className="relative mt-12 grid items-center gap-8 md:grid-cols-2">
          <OrbitVisual center={{ src: '/visuals/kips-campus.webp', alt: '' }} items={PILLARS.map(({ icon, t }) => ({ icon, t }))} accent={P.accent} ink="#fff" />
          <motion.figure variants={rise} {...inView} className="group relative overflow-hidden rounded-[1.75rem] border shadow-2xl" style={{ borderColor: P.line }}>
            <img src="/visuals/cbse-planning.webp" alt="KIPS school planning: affiliation guidance, infrastructure design, teacher training and admissions support" loading="lazy" decoding="async" className="aspect-[4/3.4] w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 pt-16 sm:p-6 sm:pt-20">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: P.accent }}>End-to-end support</span>
              <span className="mt-1 block text-lg font-bold text-white sm:text-xl">Planning, design, affiliation guidance, teachers and admissions, together.</span>
            </figcaption>
          </motion.figure>
        </div>

        <motion.div className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" variants={stagger(0.08)} {...inView}>
          {PILLARS.map(({ icon: Icon, t, d }, i) => (
            <motion.article key={t} variants={rise}
              className="group relative overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#C9A24A]/60 hover:bg-white/[0.08]"
              style={{ background: P.card, borderColor: P.line }}>
              <span aria-hidden="true" style={SERIF} className="absolute right-4 top-2 text-6xl italic text-white/[0.06]">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl text-[#14110F] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${P.accentSoft}, ${P.accent})` }}><Icon className="h-5 w-5" /></span>
              <h3 className="mt-4 text-lg font-bold text-white">{t}</h3>
              <p className="mt-2 text-[13px] leading-relaxed" style={{ color: P.muted }}>{d}</p>
            </motion.article>
          ))}
        </motion.div>

        {/* Honest risk note */}
        <motion.div className="relative mt-8 flex items-start gap-4 rounded-2xl border p-5 sm:p-6" style={{ borderColor: `${P.accent}55`, background: `${P.accent}12` }} variants={rise} {...inView}>
          <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0" style={{ color: P.accent }} />
          <div>
            <h3 className="text-base font-bold text-white">What no consultant controls</h3>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: P.muted }}>
              Board decisions, State approvals, timelines and first-year enrolment all depend on factors outside any advisor&rsquo;s hands. We help you prepare thoroughly and plan with open eyes, and we will never promise an outcome we cannot control.
            </p>
          </div>
        </motion.div>

        <motion.div className="relative mt-16" variants={rise} {...inView}>
          <ReadinessCheck
            p={P}
            title="Partner readiness check"
            intro="Tick what is already in place. It shows how ready you are and what to prepare before the first meeting."
            items={READINESS}
            doneLabel="You are ready to plan in detail."
            actionLabel="Request the School Setup Dossier"
            onAction={onConsult}
          />
        </motion.div>

        <div className="relative mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div variants={rise} {...inView}>
            <Eyebrow color={P.accent}>Straight answers</Eyebrow>
            <h3 style={SERIF} className="text-3xl leading-tight text-white sm:text-[2.3rem]">What partners ask before they commit</h3>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: P.muted }}>Have a different question? Our school planning team is happy to talk it through.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <button onClick={onConsult} className="group inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-[#14110F] transition hover:-translate-y-0.5 hover:shadow-xl" style={{ background: `linear-gradient(135deg, ${P.accentSoft}, ${P.accent})` }}>
                <Sparkles className="h-4 w-4" /> Consult Our Planning Team <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a href={waLinkUrl} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </motion.div>
          <motion.div variants={rise} {...inView}><Accordion items={FAQ} p={P} /></motion.div>
        </div>
      </div>
    </section>
  );
};
