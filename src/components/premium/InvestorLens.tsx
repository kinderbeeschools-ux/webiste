import React from 'react';
import { motion } from 'motion/react';
import {
  MapPin, ScrollText, Landmark, Ruler, IndianRupee, GitBranch, Users, AlertTriangle, BadgeCheck, Building2, Phone, Mail, Clock,
  ArrowRight, Eye, Footprints, FolderOpen, MessagesSquare,
} from 'lucide-react';
import { Eyebrow, SERIF, inView, rise, stagger } from './kit';
import type { Opportunity } from '../../types';

// Joint Ventures page: the questions an investor asks, what each KIPS listing answers, and who stands behind it.
// Company identifiers match the Company & Legal block on the degree college page.

const GREEN = '#073D37';
const GOLD = '#B48735';
const MUTED = '#52615E';
const LINE = '#E5DCCB';

type Status = NonNullable<Opportunity['diligence']>[number]['status'];

export const DILIGENCE_STATUS: Record<Status, { label: string; cls: string; dot: string }> = {
  reported: { label: 'Reported by owner', cls: 'bg-[#F7F3EA] text-[#073D37] border-[#e4dac8]', dot: '#B48735' },
  verify: { label: 'To be verified', cls: 'bg-amber-50 text-amber-800 border-amber-200', dot: '#d97706' },
  'on-request': { label: 'Shared on enquiry', cls: 'bg-sky-50 text-sky-800 border-sky-200', dot: '#0284c7' },
  'not-established': { label: 'Not yet established', cls: 'bg-stone-100 text-stone-700 border-stone-300', dot: '#78716c' },
};

export const DiligenceBadge: React.FC<{ status: Status }> = ({ status }) => {
  const s = DILIGENCE_STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold ${s.cls}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />{s.label}
    </span>
  );
};

const QUESTIONS = [
  { icon: MapPin, q: 'Where exactly is it, and how is it reached?', t: 'Location & access', a: 'City and locality on every listing, a map pin where the owner permits, and photographs of the approach.' },
  { icon: ScrollText, q: 'Who owns it, and can they sign?', t: 'Title & ownership', a: 'Ownership as reported, the number of owners and exactly what still needs verifying.' },
  { icon: Landmark, q: 'What can legally be built or run here?', t: 'Approvals & permitted use', a: 'What is established and what is not. We never imply an approval that does not exist.' },
  { icon: Ruler, q: 'Do the numbers add up?', t: 'Size & measurements', a: 'Area and dimensions as stated, with any mismatch flagged openly so a survey can settle it.' },
  { icon: IndianRupee, q: 'What does it cost, and what is included?', t: 'Commercial terms', a: 'Rent, rate, deposit, escalation and lock-in, marked as quoted terms rather than final prices.' },
  { icon: GitBranch, q: 'How is the deal set up, and how do I exit?', t: 'Structure & exit', a: 'The partnership options open for each listing. Governance and exit are agreed in writing.' },
  { icon: Users, q: 'Who will use it?', t: 'Demand & end use', a: 'Possible uses with their conditions. No tenant commitment or occupier is implied.' },
  { icon: AlertTriangle, q: 'What could go wrong?', t: 'Risks & unknowns', a: 'A diligence snapshot on each listing: what is reported, what to verify and what is not yet established.' },
];

const STANDARDS = [
  { icon: Eye, t: 'Particulars labelled by source', d: 'Every fact says whether it is reported by the owner, shared on enquiry or still to be verified.' },
  { icon: AlertTriangle, t: 'Unknowns shown, not hidden', d: 'Gaps such as permitted use or area mismatches are listed on the page, not left for you to discover.' },
  { icon: Footprints, t: 'Site visit before any commitment', d: 'We arrange a visit so you can see the property and its surroundings yourself.' },
  { icon: FolderOpen, t: 'Documents for your advisors', d: 'Available records are shared for your own legal, technical and financial review.' },
  { icon: MessagesSquare, t: 'One point of contact', d: 'The KIPS team stays with you from first enquiry through to the definitive agreement.' },
];

const COMPANY = [
  { icon: Building2, k: 'Company', v: 'Finnish-Way Educare Private Limited' },
  { icon: BadgeCheck, k: 'CIN', v: 'U85500TN2024PTC169138' },
  { icon: BadgeCheck, k: 'GSTIN', v: '33AAFCF8851Q1ZZ' },
  { icon: MapPin, k: 'Office', v: 'No. 1, Old UCO Bank Road, Rajarajeshwari Layout, Ramamurthy Nagar, Bengaluru – 560016' },
  { icon: Phone, k: 'Phone / WhatsApp', v: '+91 93449 06393' },
  { icon: Mail, k: 'Email', v: 'kinderbeeschools@gmail.com' },
  { icon: Clock, k: 'Office hours', v: 'Mon–Fri 10am–5pm · Sat 10am–1pm' },
];

export const InvestorLens: React.FC<{ onInvest: () => void }> = ({ onInvest }) => (
  <section className="relative overflow-hidden bg-[#FBF9F4] px-5 py-20 sm:py-28" aria-labelledby="investor-lens-title">
    <div className="relative mx-auto max-w-[1180px]">
      <motion.div className="mx-auto max-w-3xl text-center" variants={stagger(0.12)} {...inView}>
        <motion.div variants={rise}><Eyebrow color={GOLD} center>Through an investor’s eyes</Eyebrow></motion.div>
        <motion.h2 id="investor-lens-title" variants={rise} style={SERIF} className="text-4xl leading-[1.06] sm:text-[3.3rem]">
          <span style={{ color: GREEN }}>The questions investors ask, answered up front</span>
        </motion.h2>
        <motion.p variants={rise} className="mt-5 text-lg" style={{ color: MUTED }}>
          Before committing capital, a serious investor checks the same eight things. Here is what each KIPS listing tells you about each one.
        </motion.p>
      </motion.div>

      <motion.div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" variants={stagger(0.06)} {...inView}>
        {QUESTIONS.map(({ icon: Icon, q, t, a }, i) => (
          <motion.article key={t} variants={rise} className="group relative flex flex-col rounded-2xl border bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#B48735] hover:shadow-xl" style={{ borderColor: LINE }}>
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl text-[#e2c478] transition-colors group-hover:bg-[#B48735] group-hover:text-white" style={{ background: GREEN }}><Icon className="h-5 w-5" /></span>
              <span style={SERIF} className="text-2xl italic text-[#B48735]/40">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>{t}</div>
            <h3 style={SERIF} className="mt-1 text-lg leading-snug"><span style={{ color: GREEN }}>“{q}”</span></h3>
            <p className="mt-2 flex-1 text-[13px] leading-relaxed" style={{ color: MUTED }}>{a}</p>
          </motion.article>
        ))}
      </motion.div>

      {/* Status legend used on every listing */}
      <motion.div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border bg-white p-5 sm:flex-row sm:justify-center sm:gap-5" style={{ borderColor: LINE }} variants={rise} {...inView}>
        <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: GREEN }}>Diligence snapshot key</span>
        <div className="flex flex-wrap justify-center gap-2">
          {(Object.keys(DILIGENCE_STATUS) as Status[]).map(k => <DiligenceBadge key={k} status={k} />)}
        </div>
      </motion.div>

      {/* Trust: who stands behind the listings */}
      <div className="mt-20 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div className="rounded-3xl border bg-white p-7 sm:p-9" style={{ borderColor: LINE }} variants={rise} {...inView}>
          <Eyebrow color={GOLD}>Our standards</Eyebrow>
          <h3 style={SERIF} className="text-3xl"><span style={{ color: GREEN }}>How we list a property</span></h3>
          <ul className="mt-6 space-y-5">
            {STANDARDS.map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-[#073D37]" style={{ borderColor: GOLD }}><Icon className="h-4 w-4" /></span>
                <div>
                  <div className="font-bold" style={{ color: GREEN }}>{t}</div>
                  <p className="mt-0.5 text-sm leading-relaxed" style={{ color: MUTED }}>{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div className="relative overflow-hidden rounded-3xl p-7 text-white sm:p-9" style={{ background: `linear-gradient(140deg, ${GREEN}, #04211e)` }} variants={rise} {...inView}>
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="relative">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#e2c478]">Who you are dealing with</div>
            <h3 style={SERIF} className="mt-3 text-3xl">A registered company, reachable directly</h3>
            <dl className="mt-6 space-y-3.5">
              {COMPANY.map(({ icon: Icon, k, v }) => (
                <div key={k} className="flex gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#e2c478]" />
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">{k}</dt>
                    <dd className="text-sm text-white/90">{v}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <button onClick={onInvest} className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#B48735] px-6 py-3.5 font-bold transition hover:bg-[#a37a2f]">
              Speak to the KIPS team <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
