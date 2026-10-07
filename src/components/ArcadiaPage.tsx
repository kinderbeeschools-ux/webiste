import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Landmark, Building2, Compass, Award, Search, ClipboardCheck, Layers, PenTool, Network, Rocket, MapPin, ShieldCheck } from 'lucide-react';
import { EASE } from './Motion';
import { ArcadiaVision } from './ArcadiaVision';

// Degree College page: KIPS–ARCADIA Global Education Investment Initiative.
// Copy and legal text come verbatim from the client's developer package (KIPS_ARCADIA_Webpage_Developer).
const GREEN = '#073D37';
const GOLD = '#B48735';
const IMG = '/arcadia';
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

const up = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 } } as const;
const stagger = (gap = 0.1) => ({ show: { transition: { staggerChildren: gap } } });

const Eyebrow: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <div className="mb-4 flex items-center gap-3 text-[12px] font-extrabold uppercase tracking-[0.22em]" style={{ color: light ? '#e2c478' : GOLD }}>
    <motion.span className="h-px w-8" style={{ background: 'currentColor' }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
    {children}
  </div>
);

// Line-art university facade in gold that draws itself
const Facade: React.FC<{ className?: string; stroke?: string; delay?: number }> = ({ className = '', stroke = GOLD, delay = 0 }) => (
  <svg viewBox="0 0 320 220" fill="none" aria-hidden="true" className={`pointer-events-none ${className}`}>
    {[
      'M20 200 H300', 'M30 190 H290', 'M40 90 L160 30 L280 90 Z', 'M50 100 H270',
      'M70 100 V180', 'M100 100 V180', 'M130 100 V180', 'M190 100 V180', 'M220 100 V180', 'M250 100 V180',
      'M145 180 V135 A15 15 0 0 1 175 135 V180', 'M60 180 H260',
      'M160 52 L150 70 H170 Z',
    ].map((d, i) => (
      <motion.path key={i} d={d} stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }}
        transition={{ duration: 1.4, delay: delay + i * 0.08, ease: 'easeInOut' }} />
    ))}
  </svg>
);

const STRIP = [
  ['Access', 'Curated education assets'],
  ['Develop', 'ARCADIA opportunities'],
  ['Build', 'Campus infrastructure'],
  ['Endow', 'Research & scholarships'],
  ['Impact', 'India & the Global South'],
];

const PATHWAYS = [
  { icon: Building2, title: 'Acquire an education asset', text: 'Explore operating K–12 schools, institutional campuses and strategic education real estate sourced through the KIPS network.' },
  { icon: Landmark, title: 'Co-create an ARCADIA opportunity', text: 'Evaluate greenfield higher-education development in a suitable Indian State under the applicable statutory framework.' },
  { icon: Compass, title: 'Build-to-suit campuses', text: 'Develop phased teaching, research, technology and student infrastructure around a defined academic and investment plan.' },
  { icon: Award, title: 'Create an education legacy', text: 'Support named schools, centres, laboratories, scholarships, innovation hubs and other purpose-led educational initiatives.' },
];

const LEGACY = [
  { title: 'Named Academic Schools', text: 'The [Family Name] School of Artificial Intelligence, Business, Finance or another approved discipline.' },
  { title: 'Centres of Excellence', text: 'Innovation, entrepreneurship, cybersecurity, biomedical or applied-research centres aligned with industry needs.' },
  { title: 'Scholarship Endowments', text: 'Long-horizon support for talented learners, including first-generation and economically disadvantaged students.' },
  { title: 'Labs & Learning Infrastructure', text: 'Technology laboratories, digital libraries, incubation spaces and research facilities built for enduring use.' },
];

const OPPS = [
  {
    tag: 'Illustrative pipeline • Tamil Nadu', title: 'Metropolitan K–12 Asset',
    text: 'Established urban school with a sizeable enrolled student base, developed campus and operating revenue history.',
    facts: [['Scale', '1,400+ students'], ['Campus', '3+ acres'], ['Built-up', '100,000+ sq.ft'], ['Route', 'Acquisition review']],
    fine: 'Third-party sourced indication; identity, availability, mandate and financials require verification.',
  },
  {
    tag: 'Illustrative pipeline • Tamil Nadu', title: 'Large Institutional Campus',
    text: 'Multi-board education operation with extensive land and built infrastructure suited to institutional expansion review.',
    facts: [['Scale', '4,000+ students'], ['Campus', '10+ acres'], ['Built-up', '250,000+ sq.ft'], ['Route', 'Institutional DD']],
    fine: 'Potential future use is subject to title, land-use, educational and regulatory due diligence.',
  },
  {
    tag: 'Pan-India origination', title: 'University-Scale & Build-to-Suit',
    text: 'KIPS seeks suitable land parcels, institutional developments and education-sector partners across Indian States.',
    facts: [['Model', 'Greenfield'], ['Geography', 'Across India'], ['Academic', 'Future-focused'], ['Structure', 'State-specific']],
    fine: 'University establishment depends on the applicable State/UT framework, eligible sponsoring structure and statutory approvals.',
  },
];

const PROCESS = [
  { icon: Search, step: '01 • Originate', text: 'Asset and site sourcing' },
  { icon: ClipboardCheck, step: '02 • Evaluate', text: 'Market, title and feasibility' },
  { icon: Layers, step: '03 • Structure', text: 'Project and funding pathway' },
  { icon: PenTool, step: '04 • Plan', text: 'Academic + campus master plan' },
  { icon: Network, step: '05 • Coordinate', text: 'Regulatory and execution workstreams' },
  { icon: Rocket, step: '06 • Launch', text: 'Brand, recruitment and readiness' },
];

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export const ArcadiaPage: React.FC<{ onRequestBrief: () => void }> = ({ onRequestBrief }) => (
  <div className="overflow-x-clip bg-[#FBF9F4] text-[#0D2D2B] animate-fadeIn">
    {/* ================= HERO ================= */}
    <section className="relative grid grid-cols-1 border-b border-[#e5dccb] lg:grid-cols-[1.02fr_1.25fr] lg:min-h-[650px]">
      <Facade className="absolute bottom-6 left-4 hidden w-56 opacity-25 xl:block" />
      <motion.div className="relative flex flex-col justify-center px-6 py-14 sm:px-10 lg:py-20 lg:pl-[max(2rem,calc((100vw-1180px)/2))]"
        initial="hidden" animate="show" variants={stagger(0.13)}>
        <motion.img variants={up} src={`${IMG}/arcadia_logo.png`} alt="ARCADIA Global University, a KIPS initiative" className="mb-8 w-64 max-w-[70vw]" />
        <motion.div variants={up}><Eyebrow>KIPS–ARCADIA Global Education Investment Initiative</Eyebrow></motion.div>
        <motion.h1 variants={up} style={serif} className="text-[2.9rem] font-normal leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-[5rem]">
          Build a legacy through education in India.
        </motion.h1>
        <motion.p variants={up} style={serif} className="my-7 max-w-[620px] text-lg text-[#374744] sm:text-[21px]">
          For global family offices, entrepreneurs, philanthropists, foundations and impact investors seeking purposeful participation in India's education future.
        </motion.p>
        <motion.div variants={up} className="flex flex-wrap gap-3">
          <button onClick={() => scrollTo('arcadia-pipeline')} className="group inline-flex items-center gap-2 rounded-md px-6 py-3.5 font-bold tracking-wide text-white transition hover:-translate-y-0.5 hover:shadow-xl" style={{ background: GREEN }}>
            Explore Opportunities <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button onClick={() => scrollTo('arcadia-vision')} className="rounded-md border px-6 py-3.5 font-bold tracking-wide transition hover:-translate-y-0.5 hover:bg-white" style={{ borderColor: GOLD }}>
            Discover ARCADIA
          </button>
        </motion.div>
      </motion.div>

      {/* Campus visual with slow reveal and drift */}
      <div className="relative min-h-[420px] overflow-hidden bg-white sm:min-h-[520px]">
        <motion.img src={`${IMG}/arcadia_hero.jpg`} alt="ARCADIA Global University campus concept"
          className="absolute inset-0 h-full w-full object-cover kb-kenburns"
          initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 1.4, ease: EASE, delay: 0.2 }} />
        <motion.div className="absolute bottom-6 left-6 right-6 max-w-[420px] border-l-4 p-5 text-white sm:right-auto" style={{ background: 'rgba(7,61,55,.91)', borderColor: GOLD }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8, ease: EASE }}>
          <strong className="mb-1 block text-xs uppercase tracking-[0.08em] text-[#f1d69a]">Pan-India Education Opportunity Platform</strong>
          Curated education assets • university-scale sites • build-to-suit campuses • greenfield higher-education opportunities.
        </motion.div>
      </div>
    </section>

    {/* ================= STRIP ================= */}
    <div style={{ background: GREEN }} className="text-white">
      <motion.div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-px bg-white/20 min-[480px]:grid-cols-2 lg:grid-cols-5" {...inView} variants={stagger(0.08)}>
        {STRIP.map(([k, v]) => (
          <motion.div key={k} variants={up} className="group px-5 py-6 transition-colors hover:bg-[#0B5148]" style={{ background: GREEN }}>
            <span className="mb-1 block text-[11px] uppercase tracking-[0.14em] text-[#e1c58b]">{k}</span>
            <span style={serif} className="text-[17px]">{v}</span>
            <span className="mt-3 block h-px w-0 bg-[#e1c58b] transition-all duration-500 group-hover:w-12" />
          </motion.div>
        ))}
      </motion.div>
    </div>

    {/* ================= PATHWAYS ================= */}
    <section id="arcadia-pathways" className="px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-[1180px]">
        <motion.div className="mb-12 grid items-end gap-6 lg:grid-cols-[.7fr_1.3fr] lg:gap-12" {...inView} variants={stagger()}>
          <motion.div variants={up}>
            <Eyebrow>Four ways to participate</Eyebrow>
            <h2 style={serif} className="text-4xl leading-[1.05] sm:text-[3.4rem]">Purposeful capital. Multiple pathways.</h2>
          </motion.div>
          <motion.p variants={up} className="max-w-[720px] text-lg text-[#52615e]">
            KIPS brings opportunity origination, education strategy and project coordination together so each investor can enter at the level that best matches capital, risk appetite and legacy goals.
          </motion.p>
        </motion.div>
        <motion.div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" {...inView} variants={stagger(0.12)}>
          {PATHWAYS.map((p, i) => (
            <motion.div key={p.title} variants={up} whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-[10px] border border-[#e8dfcf] bg-white p-7 shadow-[0_8px_26px_rgba(18,52,48,.04)] transition-shadow hover:shadow-[0_18px_40px_rgba(18,52,48,.12)]">
              <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ background: GOLD }} />
              <div className="mb-7 flex items-center justify-between">
                <span style={{ ...serif, color: GOLD }} className="text-3xl">0{i + 1}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 group-hover:text-white" style={{ borderColor: `${GOLD}66`, color: GREEN }}>
                  <p.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </span>
              </div>
              <h3 style={serif} className="mb-3 text-[25px] leading-tight">{p.title}</h3>
              <p className="text-[#68726f]">{p.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ================= VISION: immersive ARCADIA experience ================= */}
    <ArcadiaVision />

    {/* ================= LEGACY ================= */}
    <section id="arcadia-legacy" className="relative overflow-hidden px-5 py-20 text-white sm:py-24" style={{ background: GREEN }}>
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:40px_40px]" />
      <Facade stroke="#e2c478" className="absolute -right-10 top-10 hidden w-96 opacity-20 lg:block" />
      <div className="relative mx-auto max-w-[1180px]">
        <motion.div className="mb-12 grid items-end gap-6 lg:grid-cols-[.7fr_1.3fr] lg:gap-12" {...inView} variants={stagger()}>
          <motion.div variants={up}>
            <Eyebrow light>Build your legacy</Eyebrow>
            <h2 style={serif} className="text-4xl leading-[1.05] sm:text-[3.4rem]">Capital can build more than buildings.</h2>
          </motion.div>
          <motion.p variants={up} className="max-w-[720px] text-lg text-[#d8e3df]">
            For investors who want their participation to carry meaning across generations, ARCADIA can explore legacy-led structures around access, research, innovation and student opportunity.
          </motion.p>
        </motion.div>
        <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" {...inView} variants={stagger(0.12)}>
          {LEGACY.map(l => (
            <motion.div key={l.title} variants={up} whileHover={{ y: -6 }}
              className="group relative min-h-[180px] overflow-hidden rounded-lg border bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.07]" style={{ borderColor: 'rgba(214,180,109,.45)' }}>
              <span aria-hidden="true" className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#e2c478]/0 blur-2xl transition-all duration-500 group-hover:bg-[#e2c478]/20" />
              <strong style={serif} className="relative mb-3.5 block text-[23px] text-[#f0d497]">{l.title}</strong>
              <span className="relative text-[#d8e3df]">{l.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ================= PIPELINE ================= */}
    <section id="arcadia-pipeline" className="scroll-mt-24 bg-white px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-[1180px]">
        <motion.div className="mb-12 grid items-end gap-6 lg:grid-cols-[.7fr_1.3fr] lg:gap-12" {...inView} variants={stagger()}>
          <motion.div variants={up}>
            <Eyebrow>KIPS Confidential Education Asset Desk</Eyebrow>
            <h2 style={serif} className="text-4xl leading-[1.05] sm:text-[3.4rem]">Access curated opportunities across India.</h2>
          </motion.div>
          <motion.p variants={up} className="max-w-[720px] text-lg text-[#52615e]">
            Current sourcing includes operating school assets and institutional campuses in Tamil Nadu, with the platform designed to expand across India. Detailed information is released only after opportunity verification, investor qualification and, where appropriate, NDA.
          </motion.p>
        </motion.div>
        <motion.div className="grid grid-cols-1 gap-5 lg:grid-cols-3" {...inView} variants={stagger(0.15)}>
          {OPPS.map(o => (
            <motion.div key={o.title} variants={up} whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-[10px] border border-[#e4dac8] bg-[#FBF9F4] transition-shadow hover:shadow-[0_18px_40px_rgba(18,52,48,.12)]">
              <div className="relative overflow-hidden px-6 py-5 text-white" style={{ background: GREEN }}>
                <span aria-hidden="true" className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/10 transition-all duration-700 group-hover:left-[120%]" />
                <small className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-[#e5c986]"><MapPin className="h-3 w-3" />{o.tag}</small>
                <h3 style={serif} className="mt-1 text-2xl">{o.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-[#374744]">{o.text}</p>
                <div className="my-5 grid grid-cols-2 gap-3">
                  {o.facts.map(([k, v]) => (
                    <div key={k} className="border-t border-[#ded5c6] pt-2.5">
                      <span className="text-xs text-[#7a817f]">{k}</span>
                      <b className="block text-base">{v}</b>
                    </div>
                  ))}
                </div>
                <p className="flex items-start gap-1.5 text-xs text-[#7a817f]"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: GOLD }} />{o.fine}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ================= PROCESS ================= */}
    <section className="px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-[1180px]">
        <motion.div className="mb-10 grid items-end gap-6 lg:grid-cols-[.7fr_1.3fr] lg:gap-12" {...inView} variants={stagger()}>
          <motion.div variants={up}>
            <Eyebrow>KIPS 360° Education Development</Eyebrow>
            <h2 style={serif} className="text-4xl leading-[1.05] sm:text-[3.4rem]">From opportunity to institution.</h2>
          </motion.div>
          <motion.p variants={up} className="max-w-[720px] text-lg text-[#52615e]">
            KIPS proposes a single coordinating platform that brings together the specialists required to move from initial opportunity screening to launch readiness.
          </motion.p>
        </motion.div>
        <div className="relative">
          {/* Gold line that draws across the six steps */}
          <motion.span aria-hidden="true" className="absolute left-0 right-0 top-[27px] hidden h-0.5 origin-left lg:block" style={{ background: `linear-gradient(90deg, ${GREEN}, ${GOLD})` }}
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1.6, ease: 'easeInOut' }} />
          <motion.div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-6" {...inView} variants={stagger(0.15)}>
            {PROCESS.map(p => (
              <motion.div key={p.step} variants={up} className="group relative">
                <span className="relative z-10 mx-auto mb-3 hidden h-14 w-14 items-center justify-center rounded-full border-2 bg-[#FBF9F4] transition-colors duration-300 group-hover:text-white lg:flex" style={{ borderColor: GOLD, color: GREEN }}>
                  <span className="absolute inset-0 scale-0 rounded-full transition-transform duration-300 group-hover:scale-100" style={{ background: GREEN }} />
                  <p.icon className="relative h-5 w-5" />
                </span>
                <div className="min-h-[130px] border-t-[3px] bg-white px-3.5 py-5 transition-shadow group-hover:shadow-lg" style={{ borderColor: GOLD }}>
                  <b className="mb-2 block">{p.step}</b>{p.text}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    {/* ================= CTA ================= */}
    <section id="arcadia-contact" className="px-5 pb-20">
      <motion.div className="mx-auto grid max-w-[1180px] overflow-hidden rounded-[14px] text-white lg:grid-cols-[1.5fr_.7fr]" style={{ background: `linear-gradient(135deg, ${GREEN}, #082f2b)` }}
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease: EASE }}>
        <div className="p-8 sm:p-14">
          <Eyebrow light>KIPS–ARCADIA Investor Relations</Eyebrow>
          <h2 style={serif} className="text-4xl leading-[1.05] sm:text-5xl">Let your capital leave a legacy.</h2>
          <p className="my-5 max-w-[670px] text-lg text-[#d8e1df]">
            Share your preferred geography, indicative capital commitment, education interests and desired role. KIPS can then prepare a focused opportunity brief and define the next-stage diligence process.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={onRequestBrief} className="group inline-flex items-center gap-2 rounded-md px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:shadow-xl" style={{ background: GOLD }}>
              Request Investor Brief <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button onClick={() => scrollTo('arcadia-pipeline')} className="rounded-md border px-6 py-3.5 font-bold text-white transition hover:bg-white/10" style={{ borderColor: '#d8bc7d' }}>
              View Opportunity Desk
            </button>
          </div>
        </div>
        <div className="relative flex items-center justify-center overflow-hidden p-8 text-center"
          style={{ background: `linear-gradient(rgba(180,135,53,.93),rgba(180,135,53,.93)), url(${IMG}/facility_campus.jpg) center/cover` }}>
          <Facade stroke="#fff" className="absolute inset-x-6 bottom-4 opacity-20" delay={0.4} />
          <strong style={serif} className="relative text-[29px] leading-snug">
            {['You envision.', 'KIPS enables.', 'ARCADIA educates.'].map((line, i) => (
              <motion.span key={line} className="block" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.25, duration: 0.6 }}>
                {line}
              </motion.span>
            ))}
          </strong>
        </div>
      </motion.div>
    </section>

    {/* ================= COMPANY & LEGAL (retain unless reviewed by legal counsel) ================= */}
    <section className="px-5 py-12 text-[#d8e1df]" style={{ background: '#062e2a' }}>
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <img src={`${IMG}/kips_logo.png`} alt="KIPS logo" className="mb-4 w-44 rounded-lg bg-white p-2" loading="lazy" />
            <p><b className="text-white">Finnish-Way Educare Private Limited</b><br />BS 06, VIKRAM, B Block, Visthara Apartments, Vilangudi, Madurai – 625018, Tamil Nadu, India</p>
          </div>
          <p>
            <b className="text-white">CIN</b> U85500TN2024PTC169138<br />
            <b className="text-white">Registration No.</b> 169138<br />
            <b className="text-white">GSTIN</b> 33AAFCF8851Q1ZZ<br />
            <b className="text-white">Web</b> www.kinderbeeschools.com
          </p>
        </div>
        <div className="mt-7 border-t border-white/15 pt-5 text-[11px] leading-relaxed text-[#aab9b5]">
          This page is an invitation to explore proposed education-development opportunities and is not a securities offering. KIPS / Finnish-Way Educare Private Limited acts as an education-development and investment-facilitation platform. University status, sponsoring-body eligibility, land norms, degree-awarding authority, foreign participation, programme delivery and investment structure remain subject to applicable Central/State/UT law, UGC and professional-regulator requirements, statutory approvals and project-specific legal, tax and financial review. No regulatory approval or financial return is assured. Illustrative asset information is sourced from third-party indications and must be independently verified before reliance or transaction.
        </div>
      </div>
    </section>
  </div>
);
