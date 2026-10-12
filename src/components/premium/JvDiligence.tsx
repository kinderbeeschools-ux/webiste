import React from 'react';
import { motion } from 'motion/react';
import { Hammer, Building, Handshake, ArrowRight, ShieldCheck, FileSignature, Ban } from 'lucide-react';
import { Accordion, Eyebrow, Palette, SERIF, inView, rise, stagger } from './kit';

// New section for the Joint Ventures page. The partner types and cautions restate what the listings
// already say (eligibility, partnership options and the preliminary, non-binding disclaimer).

const GREEN = '#073D37';

const P: Palette = {
  bg: '#FBF9F4',
  ink: '#0F2B27',
  muted: '#52615E',
  accent: '#B48735',
  accentSoft: '#E2C478',
  card: '#FFFFFF',
  line: '#E5DCCB',
  dark: false,
};

const PARTNERS = [
  {
    icon: Hammer, t: 'Developer',
    d: 'Propose a development concept for the site. Explore a Development JV, developer-funded development with an agreed capital recovery, or a mutually agreed SPV.',
  },
  {
    icon: Building, t: 'Corporate occupier',
    d: 'Looking for premises for your own operations? Consider an occupier-led Build-to-Suit facility or a long-term lease with clear use, tenure and handover conditions.',
  },
  {
    icon: Handshake, t: 'Investment partner',
    d: 'Bring capital into a structured project with defined governance, contributions and exit terms agreed up front.',
  },
];

const VERIFY = [
  ['Title & ownership', 'Confirm who owns the property, that every owner is authorised to take part, and that records are in order.'],
  ['Permissions & permitted use', 'Check what may legally be built or operated, including permissible built-up area, road access and safety requirements.'],
  ['Site condition', 'Inspect boundaries, existing structures and the clearance and development scope on the ground.'],
  ['Commercial terms in writing', 'Confirm rate basis, chargeable area, deposit, escalation, lock-in and what is included, before you rely on any figure.'],
  ['Structure, governance & exit', 'Agree contributions, decision rights, recovery mechanism and how each party can exit.'],
  ['Documents', 'Ask for khata, tax receipts, title and allotment records and have your advisors review them.'],
];

const PLEDGES = [
  { icon: ShieldCheck, t: 'Preliminary and non-binding', d: 'Listings are early information to start a conversation. They are not offers and bind no one.' },
  { icon: Ban, t: 'No assured returns', d: 'We do not represent assured returns, approved development capacity or tenant commitments.' },
  { icon: FileSignature, t: 'Definitive agreements only', d: 'Final terms apply only through definitive agreements executed by the parties involved.' },
];

const FAQ = [
  { q: 'Are the listing details independently verified?', a: 'Not unless a listing says so. Property particulars are supplied by the owner or source and need independent verification of title, boundaries, permissions and site condition before you rely on them.' },
  { q: 'Is a quoted rate a final price?', a: 'No. Quoted rates and terms are preliminary and negotiable. Ask for a written commercial quotation that states the billing basis, chargeable area and included scope.' },
  { q: 'How do I express interest?', a: 'Use the Investor Interest Form below. Tell us who you are, the structure you prefer and the capital or premises you have in mind, and we will come back with the next step.' },
  { q: 'Can I bring my own opportunity?', a: 'Yes. If you hold land, an asset or a project that suits a joint venture, you can submit it for consideration through the same form.' },
];

export const JvDiligence: React.FC<{ onInvest: () => void; onSubmit: () => void }> = ({ onInvest, onSubmit }) => (
  <section className="relative overflow-hidden px-5 py-20 sm:py-28" style={{ background: P.bg }} aria-labelledby="jv-diligence-title">
    <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-24 h-96 w-96 rounded-full blur-3xl" style={{ background: `${P.accent}1f` }} />
    <div className="relative mx-auto max-w-[1180px]">
      <motion.div className="mx-auto max-w-3xl text-center" variants={stagger(0.12)} {...inView}>
        <motion.div variants={rise}><Eyebrow color={P.accent} center>For serious partners</Eyebrow></motion.div>
        <motion.h2 id="jv-diligence-title" variants={rise} style={SERIF} className="text-4xl leading-[1.06] sm:text-[3.3rem]">
          <span style={{ color: GREEN }}>Diligence first. Partnership second.</span>
        </motion.h2>
        <motion.p variants={rise} className="mt-5 text-lg" style={{ color: P.muted }}>
          A good joint venture starts with candid questions. Here is who we work with, what to verify and how we keep expectations honest.
        </motion.p>
      </motion.div>

      {/* Which partner are you */}
      <motion.div className="mt-14 grid gap-5 md:grid-cols-3" variants={stagger(0.1)} {...inView}>
        {PARTNERS.map(({ icon: Icon, t, d }) => (
          <motion.article key={t} variants={rise} className="group relative flex flex-col overflow-hidden rounded-xl border bg-white p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl" style={{ borderColor: P.line }}>
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${GREEN}, ${P.accent})` }} />
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 text-[#073D37] transition-colors duration-300 group-hover:bg-[#073D37] group-hover:text-[#e2c478]" style={{ borderColor: P.accent }}><Icon className="h-5 w-5" /></span>
            <div style={SERIF} className="mt-4 text-sm italic" ><span style={{ color: P.accent }}>You are a</span></div>
            <h3 style={SERIF} className="text-2xl"><span style={{ color: GREEN }}>{t}</span></h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: P.muted }}>{d}</p>
            <button onClick={onInvest} className="mt-5 inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm font-bold underline-offset-4 hover:underline" style={{ color: GREEN }}>
              Express interest <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.article>
        ))}
      </motion.div>

      {/* What to verify */}
      <div className="mt-20 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div variants={rise} {...inView} className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow color={P.accent}>Before you commit</Eyebrow>
          <h3 style={SERIF} className="text-3xl leading-tight sm:text-[2.4rem]"><span style={{ color: GREEN }}>Six things to verify, every time.</span></h3>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: P.muted }}>
            We encourage every partner to confirm these independently with their own legal, technical and financial advisors.
          </p>
        </motion.div>
        <motion.ol className="space-y-3" variants={stagger(0.08)} {...inView}>
          {VERIFY.map(([t, d], i) => (
            <motion.li key={t} variants={rise} className="flex gap-4 rounded-xl border bg-white p-5 transition duration-300 hover:border-[#B48735] hover:shadow-md" style={{ borderColor: P.line }}>
              <span style={SERIF} className="w-10 shrink-0 text-3xl italic leading-none"><span style={{ color: P.accent }}>{String(i + 1).padStart(2, '0')}</span></span>
              <div>
                <h4 style={SERIF} className="text-lg"><span style={{ color: GREEN }}>{t}</span></h4>
                <p className="mt-1 text-[13px] leading-relaxed" style={{ color: P.muted }}>{d}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>

      {/* Pledges */}
      <motion.div className="mt-20 overflow-hidden rounded-2xl p-7 sm:p-12" style={{ background: `linear-gradient(135deg, ${GREEN}, #0A2F2B)` }} variants={rise} {...inView}>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow color={P.accentSoft} center>How we keep it honest</Eyebrow>
          <h3 style={SERIF} className="text-3xl leading-tight text-white sm:text-4xl">Clear on what we are, and what we are not.</h3>
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {PLEDGES.map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-xl border border-white/15 bg-white/5 p-6">
              <Icon className="h-6 w-6" style={{ color: P.accentSoft }} />
              <h4 style={SERIF} className="mt-3 text-xl text-white">{t}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-[#d8e1df]">{d}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* FAQ */}
      <div className="mt-20 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.div variants={rise} {...inView}>
          <Eyebrow color={P.accent}>Straight answers</Eyebrow>
          <h3 style={SERIF} className="text-3xl leading-tight sm:text-[2.3rem]"><span style={{ color: GREEN }}>What partners ask us first.</span></h3>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
            <button onClick={onInvest} className="group inline-flex w-fit cursor-pointer items-center gap-2 rounded-md px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-xl" style={{ background: GREEN }}>
              Investor Interest Form <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button onClick={onSubmit} className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border px-6 py-3.5 text-sm font-bold transition hover:bg-white" style={{ borderColor: P.accent, color: GREEN }}>
              Submit an Opportunity
            </button>
          </div>
        </motion.div>
        <motion.div variants={rise} {...inView}><Accordion items={FAQ} p={P} /></motion.div>
      </div>
    </div>
  </section>
);
