import React from 'react';
import { motion } from 'motion/react';
import { Users, Landmark, ScrollText, MapPin, Globe2, BookOpenCheck, Layers, FileSearch, CheckCircle2, Scale, ArrowRight } from 'lucide-react';
import { Accordion, Eyebrow, Palette, SERIF, inView, rise, stagger } from './kit';
import { PhotoMosaic } from './visuals';

// New section for the Degree College (KIPS–ARCADIA) page. Every point restates a caution that the
// page's existing legal text already makes; nothing here promises approval, structure or return.

const GREEN = '#073D37';

const P: Palette = {
  bg: '#F7F3EA',
  ink: '#0F2B27',
  muted: '#52615E',
  accent: '#B48735',
  accentSoft: '#E2C478',
  card: '#FFFFFF',
  line: '#E5DCCB',
  dark: false,
};

const CHECKS = [
  { icon: Users, t: 'Sponsoring-body eligibility', d: 'Who may establish a university or college depends on the applicable framework and an eligible sponsoring structure.' },
  { icon: Landmark, t: 'State or UT framework', d: 'University establishment follows the law of the State or Union Territory in which the institution is proposed.' },
  { icon: ScrollText, t: 'UGC and regulator approvals', d: 'Degree-awarding authority and programme recognition are subject to UGC and professional-regulator requirements and statutory approvals.' },
  { icon: MapPin, t: 'Land and title', d: 'Land norms, title, land use and development rights need independent legal review for every site.' },
  { icon: Globe2, t: 'Foreign participation', d: 'Participation by foreign investors or institutions depends on applicable law and is reviewed project by project.' },
  { icon: BookOpenCheck, t: 'Programme delivery', d: 'Programmes, faculty and academic delivery must meet regulator requirements before admissions can begin.' },
  { icon: Layers, t: 'Investment structure', d: 'Legal, tax and financial structure is specific to each project and needs professional review.' },
  { icon: FileSearch, t: 'Asset verification', d: 'Illustrative pipeline information comes from third-party indications and must be verified independently before you rely on it.' },
];

const KIPS_HELPS = [
  'Originating assets and sites',
  'Evaluating market, title and feasibility',
  'Structuring the project and funding pathway',
  'Planning the academic and campus master plan',
  'Coordinating regulatory and execution workstreams',
  'Preparing brand, recruitment and launch readiness',
];

const YOUR_ADVISORS = [
  'Legal opinion on title, land use and eligibility',
  'Tax and structuring advice',
  'Independent financial due diligence and valuation',
  'Regulatory counsel on approvals and degree-awarding authority',
  'Verification of every asset detail you intend to rely on',
];

const FAQ = [
  {
    q: 'Is this a securities offering?',
    a: 'No. The page is an invitation to explore proposed education-development opportunities. KIPS acts as an education-development and investment-facilitation platform.',
  },
  { q: 'Are approvals or returns assured?', a: 'No. No regulatory approval or financial return is assured. Every project depends on the applicable law, statutory approvals and project-specific review.' },
  { q: 'Can foreign investors take part?', a: 'Foreign participation is subject to applicable Central and State law, and it is reviewed project by project with your own legal advisors.' },
  { q: 'What should I share to begin?', a: 'Your preferred geography, indicative capital commitment, education interests and the role you wish to play. KIPS can then prepare a focused opportunity brief and define the next stage of diligence.' },
];

export const DegreeCollegeDiligence: React.FC<{ onRequestBrief: () => void }> = ({ onRequestBrief }) => (
  <section className="relative overflow-hidden px-5 py-20 sm:py-28" style={{ background: P.bg }} aria-labelledby="diligence-title">
    <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full blur-3xl" style={{ background: `${P.accent}22` }} />
    <div className="relative mx-auto max-w-[1180px]">
      <motion.div className="mx-auto max-w-3xl text-center" variants={stagger(0.12)} {...inView}>
        <motion.div variants={rise}><Eyebrow color={P.accent} center>Investor diligence</Eyebrow></motion.div>
        <motion.h2 id="diligence-title" variants={rise} style={SERIF} className="text-4xl leading-[1.06] sm:text-[3.3rem]">
          <span style={{ color: GREEN }}>Questions to settle before capital is committed.</span>
        </motion.h2>
        <motion.p variants={rise} className="mt-5 text-lg" style={{ color: P.muted }}>
          Higher education is regulated, and rightly so. These are the checks we would insist on ourselves, and the ones KIPS can help you structure.
        </motion.p>
      </motion.div>

      <PhotoMosaic
        className="mt-12"
        accent={GREEN}
        main={{ src: '/arcadia/facility_campus.jpg', alt: 'Concept view of the KIPS–ARCADIA higher-education campus' }}
        side={[
          { src: '/arcadia/facility_auditorium.jpg', alt: 'Concept view of a campus auditorium' },
          { src: '/arcadia/facility_boardroom.jpg', alt: 'Concept view of a campus boardroom' },
        ]}
        chips={[{ icon: FileSearch, label: 'Eight checks before capital' }, { icon: Scale, label: 'Your own advisors, always' }]}
      />

      <motion.div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" variants={stagger(0.07)} {...inView}>
        {CHECKS.map(({ icon: Icon, t, d }, i) => (
          <motion.article key={t} variants={rise} className="group relative overflow-hidden rounded-xl border bg-white p-6 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl" style={{ borderColor: P.line }}>
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ background: P.accent }} />
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg text-[#e2c478] transition-colors duration-300 group-hover:bg-[#B48735] group-hover:text-white" style={{ background: GREEN }}><Icon className="h-5 w-5" /></span>
              <span style={SERIF} className="text-2xl italic" ><span style={{ color: P.accent }}>{String(i + 1).padStart(2, '0')}</span></span>
            </div>
            <h3 style={SERIF} className="mt-4 text-xl leading-snug"><span style={{ color: GREEN }}>{t}</span></h3>
            <p className="mt-2 text-[13px] leading-relaxed" style={{ color: P.muted }}>{d}</p>
          </motion.article>
        ))}
      </motion.div>

      {/* Who does what */}
      <motion.div className="mt-14 grid overflow-hidden rounded-2xl border bg-white lg:grid-cols-2" style={{ borderColor: P.line }} variants={rise} {...inView}>
        <div className="p-7 sm:p-10" style={{ background: GREEN }}>
          <Eyebrow color={P.accentSoft}>What KIPS does</Eyebrow>
          <h3 style={SERIF} className="text-2xl leading-tight text-white sm:text-3xl">Your education-development partner</h3>
          <ul className="mt-6 space-y-3">
            {KIPS_HELPS.map(x => (
              <li key={x} className="flex items-start gap-3 text-sm text-[#d8e1df]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: P.accentSoft }} />{x}</li>
            ))}
          </ul>
        </div>
        <div className="p-7 sm:p-10">
          <Eyebrow color={P.accent}>What needs your own advisors</Eyebrow>
          <h3 style={SERIF} className="text-2xl leading-tight sm:text-3xl"><span style={{ color: GREEN }}>Independent eyes, always</span></h3>
          <ul className="mt-6 space-y-3">
            {YOUR_ADVISORS.map(x => (
              <li key={x} className="flex items-start gap-3 text-sm" style={{ color: P.muted }}><Scale className="mt-0.5 h-4 w-4 shrink-0" style={{ color: P.accent }} />{x}</li>
            ))}
          </ul>
        </div>
      </motion.div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.div variants={rise} {...inView}>
          <Eyebrow color={P.accent}>Straight answers</Eyebrow>
          <h3 style={SERIF} className="text-3xl leading-tight sm:text-[2.3rem]"><span style={{ color: GREEN }}>Clarity first. Commitment second</span></h3>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: P.muted }}>The best education partnerships begin with candid questions. Ask us anything.</p>
          <button onClick={onRequestBrief} className="group mt-6 inline-flex cursor-pointer items-center gap-2 rounded-md px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-xl" style={{ background: P.accent }}>
            Request Investor Brief <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
        <motion.div variants={rise} {...inView}><Accordion items={FAQ} p={P} /></motion.div>
      </div>
    </div>
  </section>
);
