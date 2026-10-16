import React from 'react';
import { motion } from 'motion/react';
import { Landmark, Coins, School, Compass, Layers, Building, KeyRound, Percent, Briefcase, Puzzle, Scale, Info } from 'lucide-react';
import { Eyebrow, Palette, SERIF, inView, rise, stagger } from './kit';
import { JvDiagram } from './JvVisuals';

// Joint Ventures page: what a JV is, who does what, common structures and how KIPS works.
// General information only; the structures match those offered in the listings.

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

const BASICS = [
  { icon: Puzzle, t: 'Shared contribution', d: 'Each party brings something the project needs: land or premises, capital, construction capability, an operator or education expertise.' },
  { icon: Scale, t: 'Shared responsibility', d: 'Roles, decision rights, costs and timelines are agreed up front, so everyone knows who does what and when.' },
  { icon: Percent, t: 'Shared outcome', d: 'Rent, revenue or returns are divided on terms the parties negotiate and record in a written agreement.' },
];

const ROLES = [
  { icon: Landmark, t: 'Landowner or property owner', d: 'Contributes land or premises, by lease, development rights or a share in the project, and confirms title, ownership and permissions.' },
  { icon: Coins, t: 'Investor or developer', d: 'Provides capital and/or construction capability, and agrees how that capital is recovered and how returns are shared.' },
  { icon: School, t: 'Operator or occupier', d: 'Runs the facility, such as a preschool, school, college or business premises, or takes it on a long-term lease.' },
];

const KIPS_DOES = [
  'Sources and screens land, premises and education-related opportunities',
  'Presents the information available today, clearly marked as preliminary',
  'Connects landowners, investors, developers and operators',
  'Coordinates enquiries, site visits and discussions',
  'Brings education expertise: preschool, CBSE school and degree college setup, curriculum and teacher training',
  'Supports the parties as they structure and document the deal with their own advisors',
];

const STRUCTURES = [
  { icon: Layers, t: 'Development JV', d: 'Landowner and developer combine land and capital to build, then share the project on agreed terms.' },
  { icon: Building, t: 'Build-to-Suit', d: 'A facility is built to an occupier’s specification and leased to them on agreed terms.' },
  { icon: KeyRound, t: 'Long-term lease or rental', d: 'Premises are leased for a defined term, use and rent, as with a preschool taking a building.' },
  { icon: Percent, t: 'Revenue share', d: 'Instead of fixed rent alone, income from the facility is shared in an agreed ratio.' },
  { icon: Briefcase, t: 'SPV', d: 'A separate company is formed for one project, with clear shareholding, governance and exit terms.' },
];

export const JvExplainer: React.FC = () => (
  <section className="relative overflow-hidden px-5 py-20 sm:py-28" style={{ background: P.bg }} aria-labelledby="jv-explainer-title">
    <div className="relative mx-auto max-w-[1180px]">
      {/* What is a joint venture */}
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
        <motion.div variants={stagger(0.12)} {...inView}>
          <motion.div variants={rise}><Eyebrow color={P.accent}>Understanding joint ventures</Eyebrow></motion.div>
          <motion.h2 id="jv-explainer-title" variants={rise} style={SERIF} className="text-4xl leading-[1.06] sm:text-[3.3rem]">
            <span style={{ color: GREEN }}>What is a joint venture?</span>
          </motion.h2>
          <motion.p variants={rise} className="mt-5 text-lg leading-relaxed" style={{ color: P.muted }}>
            A joint venture (JV) is an arrangement in which two or more parties combine what they each have, such as land, capital, construction capability or operating expertise, to deliver a specific project together. Each party stays independent, while contributions, responsibilities and returns are agreed in writing.
          </motion.p>
          <motion.p variants={rise} className="mt-4 leading-relaxed" style={{ color: P.muted }}>
            In education, a JV often brings a landowner, an investor and a school operator together to create a preschool, school or college that none of them would build alone.
          </motion.p>
        </motion.div>
        <JvDiagram />
      </div>

      <motion.div className="mt-12 grid gap-5 md:grid-cols-3" variants={stagger(0.1)} {...inView}>
        {BASICS.map(({ icon: Icon, t, d }) => (
          <motion.article key={t} variants={rise} className="rounded-xl border bg-white p-6" style={{ borderColor: P.line }}>
            <Icon className="h-6 w-6" style={{ color: P.accent }} />
            <h3 style={SERIF} className="mt-3 text-xl"><span style={{ color: GREEN }}>{t}</span></h3>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: P.muted }}>{d}</p>
          </motion.article>
        ))}
      </motion.div>

      {/* Who does what */}
      <motion.div className="mt-20 text-center" variants={rise} {...inView}>
        <Eyebrow color={P.accent} center>Who does what</Eyebrow>
        <h3 style={SERIF} className="text-3xl sm:text-[2.6rem]"><span style={{ color: GREEN }}>The parties in a joint venture</span></h3>
      </motion.div>
      <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1fr_1fr_1.35fr]">
        {ROLES.map(({ icon: Icon, t, d }, i) => (
          <motion.article key={t} className="rounded-xl border bg-white p-6" style={{ borderColor: P.line }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 text-[#073D37]" style={{ borderColor: P.accent }}><Icon className="h-5 w-5" /></span>
            <h4 style={SERIF} className="mt-4 text-xl leading-snug"><span style={{ color: GREEN }}>{t}</span></h4>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: P.muted }}>{d}</p>
          </motion.article>
        ))}
        <motion.article className="rounded-xl p-6 text-white" style={{ background: `linear-gradient(135deg, ${GREEN}, #0A2F2B)` }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.24 }}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#e2c478] text-[#e2c478]"><Compass className="h-5 w-5" /></span>
          <h4 style={SERIF} className="mt-4 text-xl">KIPS, the facilitator</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            {KIPS_DOES.map(x => (
              <li key={x} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e2c478]" />{x}</li>
            ))}
          </ul>
        </motion.article>
      </div>

      {/* Common structures */}
      <motion.div className="mt-20 text-center" variants={rise} {...inView}>
        <Eyebrow color={P.accent} center>Common structures</Eyebrow>
        <h3 style={SERIF} className="text-3xl sm:text-[2.6rem]"><span style={{ color: GREEN }}>Ways a partnership can be set up</span></h3>
        <p className="mx-auto mt-3 max-w-2xl" style={{ color: P.muted }}>The right structure depends on the site, the parties and what each wants to contribute. Each listing states the options open for it.</p>
      </motion.div>
      <motion.div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" variants={stagger(0.08)} {...inView}>
        {STRUCTURES.map(({ icon: Icon, t, d }) => (
          <motion.article key={t} variants={rise} className="rounded-xl border bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#B48735] hover:shadow-lg" style={{ borderColor: P.line }}>
            <Icon className="h-5 w-5" style={{ color: P.accent }} />
            <h4 style={SERIF} className="mt-3 text-lg"><span style={{ color: GREEN }}>{t}</span></h4>
            <p className="mt-1 text-[13px] leading-relaxed" style={{ color: P.muted }}>{d}</p>
          </motion.article>
        ))}
      </motion.div>

      <p className="mx-auto mt-10 flex max-w-3xl items-start justify-center gap-2 text-center text-xs leading-relaxed" style={{ color: P.muted }}>
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        General information only, not legal, tax or financial advice. Each party should take independent advice before entering any agreement.
      </p>
    </div>
  </section>
);
