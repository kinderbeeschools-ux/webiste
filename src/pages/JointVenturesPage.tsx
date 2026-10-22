import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, animate, useReducedMotion, useInView, MotionConfig } from 'motion/react';
import {
  MapPin, Building2, Ruler, IndianRupee, Handshake, TrendingUp, CalendarClock, ArrowRight, X, ChevronLeft, ChevronRight,
  Compass, Users, Layers, Search, Send, ClipboardCheck, FileSignature, Rocket, CheckCircle2, MessageCircle, FileText,
  ShieldCheck, Maximize2, Sparkles, Phone, Download,
} from 'lucide-react';
import type { Opportunity, SystemSettings } from '../types';
import { SEOHead } from '../components/SEOHead';
import { EASE } from '../components/Motion';
import { SEED_OPPORTUNITIES } from '../data/opportunities';
import { JvDiligence } from '../components/premium/JvDiligence';
import { JvExplainer } from '../components/premium/JvExplainer';
import { PillarArt, ContourBackdrop } from '../components/premium/JvVisuals';
import { InvestorLens, DiligenceBadge } from '../components/premium/InvestorLens';
import { trackLead } from '../utils/analytics';

// Joint Ventures: premium investment-opportunity platform. Listings are managed in Admin → Opportunities.
const GREEN = '#073D37';
const GOLD = '#B48735';
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

const INVESTOR_TYPES = ['Individual Investor', 'Company', 'Investment Group', 'Developer', 'Strategic Partner'];
const INVESTMENT_RANGES = ['₹10L – ₹25L', '₹25L – ₹50L', '₹50L – ₹1Cr', '₹1Cr+', 'Prefer to discuss'];

const STEPS = [
  { icon: Search, title: 'Discover', text: 'Explore the available opportunity.' },
  { icon: Send, title: 'Connect', text: 'Submit your investor/partner enquiry.' },
  { icon: ClipboardCheck, title: 'Evaluate', text: 'KIPS and relevant stakeholders discuss the opportunity, requirements and feasibility.' },
  { icon: FileSignature, title: 'Structure', text: 'Agree on the appropriate investment/JV structure.' },
  { icon: Rocket, title: 'Execute', text: 'Move forward with documentation, development and execution.' },
];

const PILLARS = [
  { word: 'Opportunities', title: 'Strategic Opportunities', text: 'Identify land, development and education-related opportunities with potential for structured partnerships.', icon: Compass, art: 'map' as const },
  { word: 'Capital', title: 'Investor Partnerships', text: 'Connect suitable opportunities with investors and strategic partners.', icon: Users, art: 'capital' as const },
  { word: 'Execution', title: 'Collaborative Development', text: 'Create mutually beneficial structures around investment, development and execution.', icon: Layers, art: 'build' as const },
];

const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

// Number that counts up the first time it is visible (e.g. "22,000")
const Counter: React.FC<{ to: number; suffix?: string }> = ({ to, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setVal(to); return; }
    const controls = animate(0, to, { duration: 1.6, ease: EASE, onUpdate: setVal });
    return () => { controls.stop(); setVal(to); };
  }, [inView, to, reduce]);
  return <span ref={ref} className="whitespace-nowrap">{Math.round(val).toLocaleString('en-IN')}{suffix && <span className="text-[0.55em] tracking-normal opacity-80">{suffix}</span>}</span>;
};

const firstNumber = (s?: string) => {
  const m = (s || '').match(/[\d,]+(\.\d+)?/);
  return m ? Number(m[0].replace(/,/g, '')) : 0;
};

const Eyebrow: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <div className="mb-4 flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.28em]" style={{ color: light ? '#e2c478' : GOLD }}>
    <motion.span className="h-px w-9 origin-left bg-current" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
    {children}
  </div>
);

// A site photo with the page's editorial colour grade
const Photo: React.FC<{ src: string; alt?: string; className?: string; eager?: boolean; fit?: 'contain' }> = ({ src, alt = '', className = '', eager, fit }) => (
  <>
    <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} className={`jv-photo h-full w-full ${fit === 'contain' ? 'object-contain bg-[#F7F3EA]' : 'object-cover'} ${className}`} />
    <span aria-hidden="true" className="jv-tint" />
  </>
);

const fadeUp = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };

// ============================================================================
export const JointVenturesPage: React.FC<{ settings?: SystemSettings | null }> = ({ settings }) => {
  const [opps, setOpps] = useState<Opportunity[]>(SEED_OPPORTUNITIES.filter(o => o.published));
  const [openId, setOpenId] = useState<string | null>(null);
  const [startPhoto, setStartPhoto] = useState(0);
  const [formOpportunity, setFormOpportunity] = useState('');
  const [formMode, setFormMode] = useState<'invest' | 'submit'>('invest');

  useEffect(() => {
    fetch('/api/opportunities').then(r => (r.ok ? r.json() : null)).then(d => { if (Array.isArray(d)) setOpps(d); }).catch(() => {});
  }, []);

  // Shareable link to an opportunity: #opportunity/<id>
  useEffect(() => {
    const sync = () => {
      const m = window.location.hash.match(/^#opportunity\/(.+)$/);
      setOpenId(m ? decodeURIComponent(m[1]) : null);
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  const openOpp = (id: string, photo = 0) => { setStartPhoto(photo); window.location.hash = `opportunity/${encodeURIComponent(id)}`; };
  const closeOpp = () => {
    history.replaceState(null, '', window.location.pathname + window.location.search);
    setOpenId(null);
  };

  const open = opps.find(o => o.id === openId) || null;

  const enquire = (mode: 'invest' | 'submit', opportunityTitle = '') => {
    setFormMode(mode);
    setFormOpportunity(opportunityTitle);
    closeOpp();
    setTimeout(() => scrollToId('investor-form'), 50);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="overflow-x-clip bg-[#FBF9F4] text-[#0D2D2B]">
        <SEOHead title="Joint Ventures & Investment Opportunities" description="KIPS brings together strategic investors and high-potential opportunities through carefully structured joint ventures and development partnerships." settings={settings || null} noIndex />

        <Hero opps={opps} onExplore={() => scrollToId('opportunities')} onInvest={() => enquire('invest')} />
        <WhyKips />
        <JvExplainer />
        <HowItWorks />
        <OpportunityGrid opps={opps} onOpen={openOpp} onSubmit={() => enquire('submit')} />
        <ProjectGallery opps={opps} onOpen={openOpp} />
        <InvestorLens onInvest={() => enquire('invest')} />
        <JvDiligence onInvest={() => enquire('invest')} onSubmit={() => enquire('submit')} />
        <InvestorCta onInvest={() => enquire('invest')} onSubmit={() => enquire('submit')} />
        <InvestorForm opps={opps} mode={formMode} setMode={setFormMode} opportunity={formOpportunity} setOpportunity={setFormOpportunity} />

        <AnimatePresence>
          {open && <OpportunityDetail key={open.id} opp={open} startPhoto={startPhoto} onClose={closeOpp} onEnquire={() => enquire('invest', open.title)} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
};

// ============================================================================
// 1. HERO
// ============================================================================
// City from a listing location, e.g. "EPIP Zone / Whitefield, Bengaluru – 560048" -> "Bengaluru"
const cityOf = (loc: string) => loc.replace(/\(.*?\)/g, '').replace(/[–-]\s*\d{6}/, '').split(',').pop()!.trim();

const HUB_NODES = [
  { label: 'Land', icon: Compass, angle: -90, r: 205 },
  { label: 'Investors', icon: Users, angle: -30, r: 150 },
  { label: 'Premises', icon: Building2, angle: 30, r: 205 },
  { label: 'Operators', icon: Handshake, angle: 90, r: 150 },
  { label: 'Campuses', icon: Layers, angle: 150, r: 205 },
  { label: 'Developers', icon: TrendingUp, angle: 210, r: 150 },
];

// Animated network: KIPS at the centre, connecting land, capital and operators (no site photos)
const HeroVisual: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 hidden h-[560px] w-[560px] -translate-y-1/2 xl:block 2xl:right-[4%]">
    <svg viewBox="-280 -280 560 560" className="absolute inset-0 h-full w-full overflow-visible">
      <defs>
        <radialGradient id="jvGlow"><stop offset="0%" stopColor="#e2c478" stopOpacity=".35" /><stop offset="100%" stopColor="#e2c478" stopOpacity="0" /></radialGradient>
      </defs>
      <circle r="250" fill="url(#jvGlow)" />
      {[90, 150, 205, 255].map((r, i) => (
        <motion.circle key={r} r={r} fill="none" stroke={i % 2 ? '#e2c478' : '#ffffff'} strokeOpacity={i % 2 ? 0.35 : 0.14} strokeWidth="1" strokeDasharray={i % 2 ? '2 8' : '1 0'}
          animate={{ rotate: i % 2 ? 360 : -360 }} transition={{ duration: 60 + i * 20, repeat: Infinity, ease: 'linear' }} />
      ))}
      {HUB_NODES.map((n, i) => {
        const a = (n.angle * Math.PI) / 180;
        return (
          <motion.line key={n.label} x1="0" y1="0" x2={Math.cos(a) * n.r} y2={Math.sin(a) * n.r} stroke="#e2c478" strokeOpacity=".45" strokeWidth="1.2" strokeDasharray="4 6"
            animate={{ strokeDashoffset: [0, -40] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: i * 0.2 }} />
        );
      })}
      {[0, 1, 2].map(i => (
        <motion.circle key={i} r="70" fill="none" stroke="#e2c478" strokeWidth="1.5"
          initial={{ scale: 0.6, opacity: 0.6 }} animate={{ scale: 3.4, opacity: 0 }} transition={{ duration: 4.5, repeat: Infinity, delay: i * 1.5, ease: 'easeOut' }} />
      ))}
    </svg>
    {/* Centre hub */}
    <div className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#e2c478]/60 bg-[#073D37]/90 text-center shadow-[0_0_80px_rgba(226,196,120,.35)] backdrop-blur">
      <span style={serif} className="text-3xl tracking-wide text-[#e2c478]">KIPS</span>
      <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-white/70">Joint ventures</span>
    </div>
    {/* Orbiting nodes */}
    {HUB_NODES.map((n, i) => {
      const a = (n.angle * Math.PI) / 180;
      const Icon = n.icon;
      return (
        <motion.div key={n.label} className="absolute left-1/2 top-1/2" style={{ x: Math.cos(a) * n.r, y: Math.sin(a) * n.r }}
          initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.12, duration: 0.7, ease: EASE }}>
          <motion.div className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/25 bg-white/10 py-1.5 pl-1.5 pr-3.5 text-xs font-semibold text-white backdrop-blur-md"
            animate={{ y: [0, -6, 0] }} transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B48735] text-white"><Icon className="h-3.5 w-3.5" /></span>
            {n.label}
          </motion.div>
        </motion.div>
      );
    })}
  </div>
);

const Hero: React.FC<{ opps: Opportunity[]; onExplore: () => void; onInvest: () => void }> = ({ opps, onExplore, onInvest }) => {
  const cities = new Set(opps.map(o => cityOf(o.location)).filter(Boolean)).size;
  const categories = new Set(opps.map(o => o.category).filter(Boolean)).size;

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden text-white" style={{ background: `radial-gradient(ellipse at 75% 45%, #0b5a50 0%, ${GREEN} 45%, #04211e 100%)` }}>
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px]" />
      <div aria-hidden="true" className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-[#B48735]/25 blur-3xl kb-drift" />
      <HeroVisual />

      <div className="relative mx-auto w-full max-w-[1180px] px-5 pb-12 pt-36 sm:pb-16">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } } }} className="max-w-2xl">
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e2c478]/50 bg-[#073D37]/60 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#e2c478] backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Joint ventures across India
          </motion.div>
          <h1 style={serif} className="text-[2.8rem] font-normal leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[4.6rem]">
            {['Invest in Opportunities.', 'Build What’s Next.'].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span className={`block ${i === 1 ? 'text-[#e2c478]' : ''}`} variants={{ hidden: { y: '105%' }, show: { y: 0, transition: { duration: 1.1, ease: EASE } } }}>{line}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-[#d8e3df] sm:text-xl">
            KIPS lists land, premises and education projects across India, and brings landowners, investors, developers and operators together through carefully structured joint ventures.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={onExplore} className="group inline-flex items-center justify-center gap-2 rounded-md bg-[#B48735] px-7 py-4 font-bold text-white shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#a37a2f]">
              Explore Listings <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button onClick={onInvest} className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/20">
              Become an Investor
            </button>
          </motion.div>
        </motion.div>

        {/* Animated statistics (from all listings) */}
        <motion.div className="mt-12 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 backdrop-blur-md sm:grid-cols-4"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9, ease: EASE }}>
          {[
            { k: 'Open listings', v: <Counter to={opps.length} /> },
            { k: cities === 1 ? 'City' : 'Cities', v: <Counter to={cities} /> },
            { k: 'Categories', v: <Counter to={categories} /> },
            { k: 'JV structures', v: <Counter to={5} /> },
          ].map(s => (
            <div key={s.k} className="bg-[#073D37]/55 px-5 py-4">
              <div style={serif} className="text-2xl text-white sm:text-3xl">{s.v}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e2c478]">{s.k}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// 2. WHY PARTNER WITH KIPS
// ============================================================================
const WhyKips: React.FC = () => (
  <section className="relative overflow-hidden px-5 py-20 text-white sm:py-28" style={{ background: GREEN }}>
    <div aria-hidden="true" className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
    <div className="relative mx-auto max-w-[1180px]">
      <div className="mb-12 text-center">
        <Eyebrow light><span className="mx-auto">Why partner with KIPS?</span></Eyebrow>
        <motion.div style={serif} className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-3xl sm:text-5xl lg:text-6xl"
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.18 } } }}>
          {PILLARS.flatMap((p, i) => [
            <motion.span key={p.word} variants={fadeUp}>{p.word.toUpperCase()}</motion.span>,
            i < PILLARS.length - 1 ? <motion.span key={`x${i}`} variants={fadeUp} className="text-[#e2c478]">×</motion.span> : null,
          ])}
        </motion.div>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {PILLARS.map((p, i) => (
          <motion.div key={p.title} className="group relative h-[380px] overflow-hidden rounded-[24px] border border-[#e2c478]/25 sm:h-[440px]"
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: i * 0.15, duration: 0.9, ease: EASE }}>
            <div className="absolute inset-0 transition-transform duration-[1.2s] group-hover:scale-105"><PillarArt kind={p.art} /></div>
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,46,42,.2),rgba(6,46,42,.95)_70%)]" />
            <div className="relative flex h-full flex-col justify-between p-7">
              <div className="flex items-center justify-between">
                <span style={serif} className="text-sm italic text-[#e2c478]">0{i + 1}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e2c478]/50 text-[#e2c478] transition-colors group-hover:bg-[#e2c478] group-hover:text-[#073D37]"><p.icon className="h-5 w-5" /></span>
              </div>
              <div>
                <h3 style={serif} className="text-3xl">{p.title}</h3>
                <span className="my-4 block h-px w-12 bg-[#e2c478] transition-all duration-500 group-hover:w-24" />
                <p className="text-[#d8e3df]">{p.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================================================
// 4. PROJECTS & LISTINGS
// ============================================================================
// Card image that cycles through the listing's photos while hovered
const CardPhotos: React.FC<{ images: Opportunity['images']; title: string }> = ({ images, title }) => {
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (!hover || images.length < 2) return;
    const t = setInterval(() => setI(x => (x + 1) % images.length), 1100);
    return () => clearInterval(t);
  }, [hover, images.length]);
  if (!images.length) return <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(140deg, ${GREEN}, #04211e)` }}><Building2 className="h-12 w-12 text-[#e2c478]/70" /></div>;
  const list = images;
  return (
    <div className="absolute inset-0" onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setI(0); }}>
      <AnimatePresence initial={false}>
        <motion.div key={list[i].url} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <Photo src={list[i].url} alt={list[i].caption || title} fit={list[i].fit} />
        </motion.div>
      </AnimatePresence>
      {list.length > 1 && (
        <div className="absolute bottom-3 right-4 z-[3] flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {list.slice(0, 9).map((_, j) => <span key={j} className={`h-1 rounded-full transition-all ${j === i ? 'w-4 bg-[#e2c478]' : 'w-1.5 bg-white/60'}`} />)}
        </div>
      )}
    </div>
  );
};

const ListingCard: React.FC<{ o: Opportunity; n: number; onOpen: (id: string) => void }> = ({ o, n, onOpen }) => (
  <motion.button layout type="button" onClick={() => onOpen(o.id)}
    className="group overflow-hidden rounded-[22px] border border-[#e4dac8] bg-white text-left shadow-[0_10px_30px_-20px_rgba(7,61,55,.35)] transition-shadow hover:shadow-[0_30px_60px_-25px_rgba(7,61,55,.45)]"
    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.5, ease: EASE }}
    whileHover={{ y: -8 }}>
    <div className="relative h-60 overflow-hidden">
      <CardPhotos images={o.images} title={o.title} />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#073D37]/70 to-transparent" />
      <span className="absolute left-4 top-4 rounded-full bg-[#073D37]/85 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.25em] text-[#e2c478] backdrop-blur">{/rent/i.test(o.category) ? 'For rent' : 'Investment opportunity'}</span>
      <span style={serif} className="absolute bottom-3 left-4 text-4xl text-white/90">{String(n).padStart(2, '0')}</span>
    </div>
    <div className="space-y-3 p-6">
      <h3 style={serif} className="text-2xl leading-tight text-[#0D2D2B]">{o.title}</h3>
      <div className="flex items-start gap-1.5 text-sm text-[#52615e]"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#B48735]" />{o.location}</div>
      {o.area && <div className="flex items-start gap-1.5 text-sm text-[#52615e]"><Ruler className="mt-0.5 h-4 w-4 shrink-0 text-[#B48735]" />{o.area}</div>}
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-[#F7F3EA] px-3 py-1 text-xs font-semibold text-[#073D37]">{o.category}</span>
        <span className="rounded-full border border-[#B48735]/40 px-3 py-1 text-xs font-semibold text-[#8a6726]">{o.status}</span>
      </div>
      {!!o.diligence?.length && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#52615e]">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#B48735]" />
          Diligence snapshot · {o.diligence.filter(d => d.status === 'verify').length} to verify, {o.diligence.filter(d => d.status === 'not-established').length} not yet established
        </div>
      )}
      <div className="flex items-center gap-2 pt-2 text-sm font-bold text-[#073D37]">
        View details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
        <span className="ml-auto h-px flex-1 origin-left scale-x-0 bg-[#B48735] transition-transform duration-500 group-hover:scale-x-100" />
      </div>
    </div>
  </motion.button>
);

// Product-style catalogue: every listing, filterable by category and city
const OpportunityGrid: React.FC<{ opps: Opportunity[]; onOpen: (id: string) => void; onSubmit: () => void }> = ({ opps, onOpen, onSubmit }) => {
  const [cat, setCat] = useState('All');
  const [city, setCity] = useState('All cities');
  const cats = useMemo(() => ['All', ...new Set(opps.map(o => o.category).filter(Boolean))], [opps]);
  const cityList = useMemo(() => ['All cities', ...new Set(opps.map(o => cityOf(o.location)).filter(Boolean))], [opps]);
  const shown = opps.filter(o => (cat === 'All' || o.category === cat) && (city === 'All cities' || cityOf(o.location) === city));
  const chip = (on: boolean) => `rounded-full border px-4 py-2 text-sm font-semibold transition ${on ? 'border-[#073D37] bg-[#073D37] text-white' : 'border-[#e4dac8] bg-white text-[#073D37] hover:border-[#B48735]'}`;

  return (
    <section id="opportunities" className="scroll-mt-20 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <Eyebrow>Projects & listings</Eyebrow>
            <h2 style={serif} className="text-4xl leading-[1.05] sm:text-[3.3rem]">Properties Open for Partnership</h2>
          </div>
          <p className="text-lg text-[#52615e] lg:text-right">Land, premises and education projects across India. Each listing shows the information available today; particulars are verified during due diligence.</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-[#e4dac8] bg-[#F7F3EA]/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {cats.map(c => (
              <button key={c} type="button" onClick={() => setCat(c)} aria-pressed={cat === c} className={chip(cat === c)}>
                {c} <span className="ml-1 opacity-60">{c === 'All' ? opps.length : opps.filter(o => o.category === c).length}</span>
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#073D37]">
            <MapPin className="h-4 w-4 text-[#B48735]" />
            <span className="sr-only">Filter by city</span>
            <select value={city} onChange={e => setCity(e.target.value)} className="rounded-lg border border-[#e4dac8] bg-white px-3 py-2 text-sm font-semibold text-[#073D37] outline-none focus:border-[#B48735]">
              {cityList.map(c => <option key={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <p className="mb-6 text-sm text-[#52615e]" aria-live="polite">Showing {shown.length} of {opps.length} listing{opps.length === 1 ? '' : 's'}</p>

        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((o, i) => <ListingCard key={o.id} o={o} n={i + 1} onOpen={onOpen} />)}
          </AnimatePresence>

          {/* Invitation card: landowners and developers can add the next listing */}
          <motion.button layout type="button" onClick={onSubmit}
            className="group flex min-h-[420px] flex-col items-start justify-between rounded-[22px] border-2 border-dashed border-[#B48735]/40 bg-[#F7F3EA]/60 p-7 text-left transition hover:border-[#B48735] hover:bg-[#F7F3EA]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#B48735]/50 text-[#B48735] transition-transform group-hover:rotate-90"><span className="text-2xl leading-none">+</span></span>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B48735]">More listings coming across India</div>
              <h3 style={serif} className="mt-2 text-2xl text-[#0D2D2B]">Have land or a project for partnership?</h3>
              <p className="mt-2 text-sm text-[#52615e]">Landowners and developers can share an opportunity with KIPS for evaluation and listing.</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#073D37]">Submit an Opportunity <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" /></span>
            </div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// 5. PROJECT GALLERY (photos from every listing, interleaved)
// ============================================================================
const ProjectGallery: React.FC<{ opps: Opportunity[]; onOpen: (id: string, photo: number) => void }> = ({ opps, onOpen }) => {
  const [all, setAll] = useState(false);
  // Round-robin across listings so no single property fills the gallery; example photos of other premises are left out
  const tiles = useMemo(() => {
    const per = opps.map(o => o.images.map((im, idx) => ({ o, im, idx })).filter(t => !/not this property/i.test(t.im.caption)));
    const out: { o: Opportunity; im: Opportunity['images'][number]; idx: number }[] = [];
    for (let r = 0; per.some(l => l[r]); r++) per.forEach(l => l[r] && out.push(l[r]));
    return out;
  }, [opps]);
  if (!tiles.length) return null;
  const visible = all ? tiles : tiles.slice(0, 9);

  return (
    <section className="px-5 py-20 sm:py-28" style={{ background: GREEN }}>
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 text-center text-white">
          <Eyebrow light><span className="mx-auto">Gallery</span></Eyebrow>
          <h2 style={serif} className="text-4xl sm:text-[3.3rem]">Project Gallery</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[#d8e3df]">Photographs and visuals from the projects we list. Tap any image to open its listing.</p>
        </div>
        <div className="columns-2 gap-3 sm:gap-4 md:columns-3">
          {visible.map(({ o, im, idx }, i) => (
            <motion.button key={o.id + im.url} type="button" onClick={() => onOpen(o.id, idx)}
              className="group relative mb-3 block w-full overflow-hidden rounded-2xl bg-[#062e2a] text-left [break-inside:avoid] sm:mb-4"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: (i % 3) * 0.08, duration: 0.6, ease: EASE }}>
              <img src={im.url} alt={im.caption || o.title} loading="lazy" className="block w-full transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#062e2a]/95 via-[#062e2a]/50 to-transparent p-4 pt-10">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#e2c478]">{o.title}</span>
                <span className="mt-1 block text-xs text-white/85">{im.caption}</span>
              </span>
            </motion.button>
          ))}
        </div>
        {tiles.length > 9 && (
          <div className="mt-8 text-center">
            <button type="button" onClick={() => setAll(v => !v)} className="rounded-md border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">
              {all ? 'Show fewer' : `Show all ${tiles.length} images`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// ============================================================================
// 6. HOW THE JOINT VENTURE WORKS
// ============================================================================
const HowItWorks: React.FC = () => (
  <section className="bg-[#F7F3EA] px-5 py-20 sm:py-28">
    <div className="mx-auto max-w-[1180px]">
      <div className="mb-14 text-center">
        <Eyebrow><span className="mx-auto">The process</span></Eyebrow>
        <h2 style={serif} className="text-4xl sm:text-[3.3rem]">How the Joint Venture Works</h2>
      </div>
      <div className="relative">
        <motion.span aria-hidden="true" className="absolute left-[10%] right-[10%] top-8 hidden h-0.5 origin-left lg:block" style={{ background: `linear-gradient(90deg, ${GREEN}, ${GOLD})` }}
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1.8, ease: 'easeInOut' }} />
        <motion.span aria-hidden="true" className="absolute bottom-8 left-8 top-8 w-0.5 origin-top lg:hidden" style={{ background: `linear-gradient(180deg, ${GREEN}, ${GOLD})` }}
          initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.8, ease: 'easeInOut' }} />
        <ol className="grid gap-6 lg:grid-cols-5 lg:gap-4">
          {STEPS.map((s, i) => (
            <motion.li key={s.title} className="group relative flex gap-5 lg:flex-col lg:items-center lg:gap-4 lg:text-center"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: i * 0.18, duration: 0.7, ease: EASE }}>
              <span className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 bg-[#FBF9F4] text-[#073D37] transition-colors duration-300 group-hover:bg-[#073D37] group-hover:text-[#e2c478]" style={{ borderColor: GOLD }}>
                <s.icon className="h-6 w-6" />
              </span>
              <div>
                <div style={serif} className="text-sm italic text-[#B48735]">{String(i + 1).padStart(2, '0')}</div>
                <h3 style={serif} className="text-2xl">{s.title}</h3>
                <p className="mt-1 text-sm text-[#52615e]">{s.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

// ============================================================================
// 7. INVESTOR CTA
// ============================================================================
const InvestorCta: React.FC<{ onInvest: () => void; onSubmit: () => void }> = ({ onInvest, onSubmit }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  return (
    <section ref={ref} className="relative overflow-hidden px-5 py-28 text-center text-white sm:py-40">
      <ContourBackdrop />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,61,55,.82),rgba(6,46,42,.97))]" />
      <motion.div className="relative mx-auto max-w-3xl" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={{ show: { transition: { staggerChildren: 0.15 } } }}>
        <motion.h2 variants={fadeUp} style={serif} className="text-4xl leading-[1.05] sm:text-6xl">
          Have Capital. Have Vision. <span className="text-[#e2c478]">Let's Build Together.</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-lg text-[#d8e3df]">
          We are looking for investors, strategic partners and development collaborators interested in participating in carefully selected opportunities.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={onInvest} className="group inline-flex items-center justify-center gap-2 rounded-md bg-[#B48735] px-7 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#a37a2f]">
            Become an Investor <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button onClick={onSubmit} className="rounded-md border border-white/40 px-7 py-4 font-bold text-white transition hover:bg-white/10">Submit an Opportunity</button>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ============================================================================
// INVESTOR INTEREST FORM (feeds the CRM as an enquiry)
// ============================================================================
const field = 'w-full rounded-lg border border-[#ddd2bd] bg-white px-4 py-3 text-[15px] text-[#0D2D2B] outline-none transition focus:border-[#B48735] focus:ring-2 focus:ring-[#B48735]/20';

const InvestorForm: React.FC<{
  opps: Opportunity[]; mode: 'invest' | 'submit'; setMode: (m: 'invest' | 'submit') => void; opportunity: string; setOpportunity: (s: string) => void;
}> = ({ opps, mode, setMode, opportunity, setOpportunity }) => {
  const [f, setF] = useState({ name: '', phone: '', email: '', company: '', investorType: '', investmentRange: '', message: '' });
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof f, v: string) => setF(x => ({ ...x, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (f.name.trim().length < 2) errs.push('Enter your name.');
    if (!/^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, '').slice(-10))) errs.push('Enter a valid 10-digit phone number.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) errs.push('Enter a valid email address.');
    if (!f.investorType) errs.push(mode === 'invest' ? 'Choose an investor type.' : 'Choose who you are.');
    if (mode === 'invest' && !f.investmentRange) errs.push('Choose an investment range.');
    setErrors(errs);
    if (errs.length) return;
    setBusy(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: mode === 'invest' ? 'Investor Enquiry' : 'Opportunity Submission',
          fields: { ...f, opportunity: opportunity || 'General', program: opportunity || (mode === 'invest' ? 'Investor enquiry' : 'Opportunity submission') },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not submit');
      setDone(true);
      trackLead(mode === 'invest' ? 'investor' : 'opportunity_submission', 'Joint Ventures form', { opportunity: opportunity || 'General' });
    } catch {
      setErrors(['Something went wrong. Please try again or call 93449 06393.']);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="investor-form" className="scroll-mt-20 px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <Eyebrow>Investor relations</Eyebrow>
          <h2 style={serif} className="text-4xl leading-[1.05] sm:text-5xl">{mode === 'invest' ? 'Investor Interest Form' : 'Submit an Opportunity'}</h2>
          <p className="mt-4 text-lg text-[#52615e]">
            {mode === 'invest'
              ? 'Share your investment interests and the KIPS team will get in touch to discuss suitable opportunities.'
              : 'Landowners and developers can share an opportunity with KIPS for evaluation.'}
          </p>
          <div className="mt-8 space-y-4">
            {['Your enquiry goes directly to the KIPS team', 'Details are shared after verification and, where appropriate, an NDA', 'No obligation at enquiry stage'].map((t, i) => (
              <motion.div key={t} className="flex items-center gap-3 text-[15px]" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <ShieldCheck className="h-5 w-5 shrink-0 text-[#B48735]" />{t}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div className="rounded-[24px] border border-[#e4dac8] bg-white p-6 shadow-[0_30px_70px_-35px_rgba(7,61,55,.45)] sm:p-9"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.9, ease: EASE }}>
          {done ? (
            <motion.div className="py-12 text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#073D37] text-[#e2c478]">
                <CheckCircle2 className="h-8 w-8" />
              </motion.div>
              <h3 style={serif} className="mt-5 text-3xl">Thank you, {f.name.split(' ')[0]}.</h3>
              <p className="mt-2 text-[#52615e]">Your enquiry has been received. The KIPS team will contact you shortly.</p>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="space-y-4" noValidate>
              <div className="flex rounded-lg bg-[#F7F3EA] p-1">
                {([['invest', 'I want to invest'], ['submit', 'I have an opportunity']] as const).map(([id, label]) => (
                  <button key={id} type="button" onClick={() => { setMode(id); setErrors([]); }}
                    className={`relative flex-1 rounded-md px-3 py-2.5 text-sm font-bold transition-colors ${mode === id ? 'text-white' : 'text-[#073D37]'}`}>
                    {mode === id && <motion.span layoutId="jv-mode" className="absolute inset-0 rounded-md bg-[#073D37]" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                    <span className="relative">{label}</span>
                  </button>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input className={field} placeholder="Name *" value={f.name} onChange={e => set('name', e.target.value)} autoComplete="name" />
                <input className={field} placeholder="Phone Number *" inputMode="tel" value={f.phone} onChange={e => set('phone', e.target.value)} autoComplete="tel" />
                <input className={field} placeholder="Email *" type="email" value={f.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
                <input className={field} placeholder="Company / Organization" value={f.company} onChange={e => set('company', e.target.value)} autoComplete="organization" />
                <select className={field} value={f.investorType} onChange={e => set('investorType', e.target.value)}>
                  <option value="">{mode === 'invest' ? 'Investor Type *' : 'You are a… *'}</option>
                  {(mode === 'invest' ? INVESTOR_TYPES : ['Landowner', 'Developer', 'Company', 'Strategic Partner']).map(t => <option key={t}>{t}</option>)}
                </select>
                {mode === 'invest' ? (
                  <select className={field} value={f.investmentRange} onChange={e => set('investmentRange', e.target.value)}>
                    <option value="">Investment Range *</option>
                    {INVESTMENT_RANGES.map(t => <option key={t}>{t}</option>)}
                  </select>
                ) : <div className="hidden sm:block" />}
              </div>
              {mode === 'invest' && (
                <select className={field} value={opportunity} onChange={e => setOpportunity(e.target.value)}>
                  <option value="">Interested Opportunity (optional)</option>
                  {opps.map(o => <option key={o.id} value={o.title}>{o.title}</option>)}
                </select>
              )}
              <textarea className={field} rows={4} placeholder={mode === 'invest' ? 'Message / Investment Intent' : 'Describe the opportunity: location, size and what you are looking for'} value={f.message} onChange={e => set('message', e.target.value)} />
              {errors.length > 0 && <div role="alert" className="space-y-1 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errors.map(er => <div key={er}>• {er}</div>)}</div>}
              <button type="submit" disabled={busy} className="group inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60" style={{ background: GREEN }}>
                {busy ? 'Submitting…' : mode === 'invest' ? 'Submit Investor Enquiry' : 'Submit Opportunity'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// 5. OPPORTUNITY DETAIL (full-screen overlay, shareable via #opportunity/<id>)
// ============================================================================
const RowsTable: React.FC<{ rows: { label: string; value: string }[] }> = ({ rows }) => (
  <dl className="divide-y divide-[#e4dac8] overflow-hidden rounded-2xl border border-[#e4dac8] bg-white">
    {rows.map((r, i) => (
      <motion.div key={r.label} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[13rem_1fr] sm:gap-6"
        initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(i, 8) * 0.04 }}>
        <dt className="text-xs font-bold uppercase tracking-[0.15em] text-[#B48735]">{r.label}</dt>
        <dd className="text-[15px] text-[#0D2D2B]">{r.value}</dd>
      </motion.div>
    ))}
  </dl>
);

const DetailBlock: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
  <motion.section className="space-y-4" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7, ease: EASE }}>
    <h3 style={serif} className="flex items-center gap-3 text-3xl"><Icon className="h-6 w-6 text-[#B48735]" />{title}</h3>
    {children}
  </motion.section>
);

const OpportunityDetail: React.FC<{ opp: Opportunity; startPhoto?: number; onClose: () => void; onEnquire: () => void }> = ({ opp, startPhoto = 0, onClose, onEnquire }) => {
  const [idx, setIdx] = useState(Math.min(startPhoto, Math.max(0, opp.images.length - 1)));
  const [lightbox, setLightbox] = useState(false);
  const imgs = opp.images;
  const go = (d: number) => setIdx(i => (i + d + imgs.length) % imgs.length);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') (lightbox ? setLightbox(false) : onClose());
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', k);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', k); };
  }, [lightbox, onClose]);

  // Rental premises read as a property listing rather than an investment opportunity
  const rental = /rent/i.test(opp.category);
  const cta = rental ? 'Request Property Details' : 'Submit Investor Enquiry';
  const phone = opp.contactPhone ? opp.contactPhone.replace(/\D/g, '').slice(-10) : '';
  const wa = opp.contactPhone ? `https://wa.me/91${opp.contactPhone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hello, I am interested in the ${opp.title} (${opp.location}). Please share further details.`)}` : '';

  return (
    <motion.div className="fixed inset-0 z-[70] overflow-y-auto bg-[#FBF9F4]" role="dialog" aria-modal="true" aria-label={opp.title}
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.5, ease: EASE }}>
      {/* Top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#e4dac8] bg-[#FBF9F4]/90 px-5 py-3 backdrop-blur">
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B48735]">{opp.status}</div>
          <div style={serif} className="truncate text-lg">{opp.title}</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onEnquire} className="hidden rounded-md px-4 py-2 text-sm font-bold text-white sm:block" style={{ background: GREEN }}>{cta}</button>
          <button onClick={onClose} className="rounded-full p-2 text-[#073D37] hover:bg-[#F7F3EA]" aria-label="Close"><X className="h-6 w-6" /></button>
        </div>
      </div>

      {/* Gallery */}
      {imgs.length > 0 && (
        <div className="relative h-[52vh] min-h-[320px] overflow-hidden bg-[#062e2a] sm:h-[68vh]">
          <AnimatePresence mode="wait">
            <motion.img key={imgs[idx].url} src={imgs[idx].url} alt={imgs[idx].caption} className={`absolute inset-0 h-full w-full cursor-zoom-in ${imgs[idx].fit === 'contain' ? 'object-contain py-4' : 'object-cover'}`}
              initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} onClick={() => setLightbox(true)} />
          </AnimatePresence>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#062e2a]/90 via-transparent to-transparent" />
          {imgs.length > 1 && (
            <>
              <button onClick={() => go(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-3 text-[#073D37] shadow-lg backdrop-blur hover:bg-white" aria-label="Previous photo"><ChevronLeft className="h-5 w-5" /></button>
              <button onClick={() => go(1)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-3 text-[#073D37] shadow-lg backdrop-blur hover:bg-white" aria-label="Next photo"><ChevronRight className="h-5 w-5" /></button>
            </>
          )}
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1180px] px-5 pb-5 text-white">
            <div className="mb-3 text-sm text-white/85">{imgs[idx].caption} <span className="text-white/50">· {idx + 1} / {imgs.length}</span></div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {imgs.map((im, i) => (
                <button key={im.url + i} onClick={() => setIdx(i)} aria-label={`Photo ${i + 1}`}
                  className={`h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition ${i === idx ? 'border-[#e2c478] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={im.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[1180px] gap-12 px-5 py-12 lg:grid-cols-[1fr_340px]">
        <div className="space-y-14">
          <div>
            <Eyebrow>{opp.category}</Eyebrow>
            <h2 style={serif} className="text-4xl leading-[1.05] sm:text-5xl">{opp.headline}</h2>
            <p className="mt-3 flex items-center gap-2 text-lg text-[#52615e]"><MapPin className="h-5 w-5 text-[#B48735]" />{opp.location}</p>
            {opp.summary && <p className="mt-2 text-[#52615e]">{opp.summary}</p>}
          </div>

          {opp.overview.length > 0 && (
            <DetailBlock title={rental ? 'About the property' : 'The opportunity'} icon={Sparkles}>
              {opp.overview.map(p => <p key={p.slice(0, 40)} className="text-[16px] leading-relaxed text-[#374744]">{p}</p>)}
            </DetailBlock>
          )}
          {imgs.length > 2 && (
            <DetailBlock title={rental ? 'Images' : 'All photographs'} icon={Maximize2}>
              <div className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:grid-cols-4">
                {imgs.map((im, i) => (
                  <motion.button key={im.url + i} type="button" onClick={() => { setIdx(i); setLightbox(true); }}
                    className={`kb-frame group relative overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 row-span-2' : i === 3 ? 'sm:col-span-2' : ''}`}
                    initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: (i % 4) * 0.08, duration: 0.6, ease: EASE }}>
                    <Photo src={im.url} alt={im.caption} fit={im.fit} />
                    <span className="absolute inset-x-0 bottom-0 z-[3] translate-y-full bg-gradient-to-t from-[#062e2a]/90 to-transparent p-3 text-left text-xs font-semibold text-white transition-transform duration-300 group-hover:translate-y-0">{im.caption}</span>
                  </motion.button>
                ))}
              </div>
            </DetailBlock>
          )}
          {opp.details.length > 0 && (
            <DetailBlock title={rental ? 'Property at a glance' : 'Land & property details'} icon={Ruler}>
              <RowsTable rows={opp.details} />
              {opp.detailsNote && <p className="text-xs leading-relaxed text-[#7a817f]">{opp.detailsNote}</p>}
            </DetailBlock>
          )}
          {!!opp.diligence?.length && (
            <DetailBlock title="Diligence snapshot" icon={ShieldCheck}>
              <p className="text-[15px] text-[#52615e]">What is reported, what still needs verifying and what is not yet established. Use it to plan your own checks with your advisors.</p>
              <div className="divide-y divide-[#e4dac8] overflow-hidden rounded-2xl border border-[#e4dac8] bg-white">
                {opp.diligence.map(d => (
                  <div key={d.item} className="grid gap-2 px-5 py-3.5 sm:grid-cols-[12rem_10.5rem_1fr] sm:items-center sm:gap-4">
                    <div className="text-sm font-bold text-[#073D37]">{d.item}</div>
                    <div><DiligenceBadge status={d.status} /></div>
                    <p className="text-sm leading-relaxed text-[#52615e]">{d.note}</p>
                  </div>
                ))}
              </div>
            </DetailBlock>
          )}
          {opp.terms.length > 0 && (
            <DetailBlock title={rental ? 'Rent & deposit' : 'Indicative commercial terms'} icon={IndianRupee}>
              <RowsTable rows={opp.terms} />
              {opp.termsNote && <p className="text-xs leading-relaxed text-[#7a817f]">{opp.termsNote}</p>}
            </DetailBlock>
          )}
          {opp.development.length > 0 && (
            <DetailBlock title={rental ? 'Preschool suitability' : 'Development potential'} icon={TrendingUp}>
              {opp.development.map(p => <p key={p.slice(0, 40)} className="text-[16px] leading-relaxed text-[#374744]">{p}</p>)}
            </DetailBlock>
          )}
          {opp.partnershipOptions.length > 0 && (
            <DetailBlock title={rental ? 'Next steps' : 'Partnership model'} icon={Handshake}>
              <div className="grid gap-3 sm:grid-cols-2">
                {opp.partnershipOptions.map((p, i) => (
                  <motion.div key={p.label} className="group rounded-2xl border border-[#e4dac8] bg-white p-5 transition hover:-translate-y-1 hover:border-[#B48735] hover:shadow-lg"
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                    <div style={serif} className="text-xl text-[#073D37]">{p.label}</div>
                    <p className="mt-1 text-sm text-[#52615e]">{p.value}</p>
                  </motion.div>
                ))}
              </div>
            </DetailBlock>
          )}
          {opp.disclaimer && <p className="rounded-2xl bg-[#F7F3EA] p-5 text-xs leading-relaxed text-[#6C716E]">{opp.disclaimer}</p>}
        </div>

        {/* Sticky side panel */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl p-6 text-white" style={{ background: GREEN }}>
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#e2c478]">{rental ? 'Interested in this property?' : 'Interested in this opportunity?'}</div>
            <div style={serif} className="mt-2 text-2xl">{rental ? 'Arrange a site visit' : 'Submit an investor enquiry'}</div>
            <button onClick={onEnquire} className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#B48735] px-5 py-3.5 font-bold transition hover:bg-[#a37a2f]">
              {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/30 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10">
                <MessageCircle className="h-4 w-4" /> {rental ? 'Enquire on WhatsApp' : 'Prefer WhatsApp?'}
              </a>
            )}
            {rental && phone && (
              <a href={`tel:+91${phone}`} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/30 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10">
                <Phone className="h-4 w-4" /> Call {phone.replace(/(\d{5})(\d{5})/, '$1 $2')}
              </a>
            )}
            {opp.posterUrl && (
              <a href={opp.posterUrl} download className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/30 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10">
                <Download className="h-4 w-4" /> Download poster
              </a>
            )}
          </div>
          <div className="space-y-3 rounded-2xl border border-[#e4dac8] bg-white p-5 text-sm">
            {[
              [MapPin, 'Location', opp.location],
              [Ruler, rental ? 'Area' : 'Land area', opp.area],
              ...(rental ? [[IndianRupee, 'Rent & deposit', opp.investmentRequirement], [Sparkles, 'Proposed use', opp.potential]] : []),
              [Building2, rental ? 'Availability' : 'Project status', rental ? opp.timeline || opp.status : opp.status],
              [FileText, rental ? 'Shared on enquiry' : 'Available documentation', opp.documents],
              [Users, rental ? 'Suitable for' : 'Investor eligibility', opp.eligibility],
            ].filter(([, , v]) => v).map(([Icon, k, v]) => {
              const I = Icon as React.ElementType;
              return (
                <div key={k as string} className="flex gap-3">
                  <I className="mt-0.5 h-4 w-4 shrink-0 text-[#B48735]" />
                  <div><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a817f]">{k as string}</div><div className="text-[#0D2D2B]">{v as string}</div></div>
                </div>
              );
            })}
            {opp.mapUrl && (
              <a href={opp.mapUrl} target="_blank" rel="noopener noreferrer" className="group mt-2 flex items-center justify-between rounded-xl bg-[#F7F3EA] px-4 py-3 font-semibold text-[#073D37] transition hover:bg-[#efe7d6]">
                <span className="flex items-center gap-2"><span className="relative flex h-2.5 w-2.5"><span className="absolute inset-0 animate-ping rounded-full bg-[#B48735]" /><span className="relative h-2.5 w-2.5 rounded-full bg-[#B48735]" /></span>View location on Google Maps</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile enquiry bar */}
      <div className="sticky bottom-0 z-20 border-t border-[#e4dac8] bg-white/95 p-3 backdrop-blur sm:hidden">
        <button onClick={onEnquire} className="w-full rounded-md py-3.5 font-bold text-white" style={{ background: GREEN }}>{cta}</button>
      </div>

      <AnimatePresence>
        {lightbox && imgs[idx] && (
          <motion.div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-4" onClick={() => setLightbox(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <img src={imgs[idx].url} alt={imgs[idx].caption} className="max-h-full max-w-full rounded-lg object-contain" />
            <button className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white" aria-label="Close photo"><X className="h-6 w-6" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
