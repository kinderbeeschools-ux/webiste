import React from 'react';
import {
  ShieldCheck, BookOpen, Globe, ArrowRight, ArrowUpRight, CheckCircle2, Download, PiggyBank, Baby,
  MonitorSmartphone, Handshake, Network, Smartphone, LibraryBig, Brain
} from 'lucide-react';
import { FAQItem, SystemSettings } from '../types';
import { SEOHead } from '../components/SEOHead';
import { MotionConfig } from 'motion/react';
import { openConsultationBooking } from '../components/ConsultationBooking';
import { openBrochureDownload } from '../components/BrochureDownload';
import { FRANCHISE_FAQS, WhatsAppEnquiry } from '../components/FranchiseSeoSections';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  onOpenConsultation: (type?: string) => void;
  faqs: FAQItem[];
  settings?: SystemSettings | null;
}

const FRANCHISE_SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Kinderbee Preschool Franchise",
  "serviceType": "Preschool franchise",
  "description": "A zero-royalty preschool franchise with a Finnish-inspired, NEP 2020 aligned curriculum, teacher training, branding, admissions support and the KinderOS school-management platform.",
  "provider": { "@type": "EducationalOrganization", "name": "Kinderbee International Preschool", "url": "https://www.kinderbeeschools.com" },
  "areaServed": { "@type": "Country", "name": "India" },
  "url": "https://www.kinderbeeschools.com/"
};

const ECOSYSTEM = [
  { icon: PiggyBank, t: 'Zero Royalty Model', d: 'Retain 100% of your school tuition fees with zero ongoing monthly royalty charges.', tag: '100% Fee Retention', bg: 'bg-[#FFECF0]', tagC: 'text-[#B8006C]' },
  { icon: BookOpen, t: 'Finnish Pedagogy', d: 'Play-based, discovery-led learning across 10 multi-intelligence modules aligned with NEP 2020.', tag: 'NEP 2020 & NCF-FS', bg: 'bg-[#FFF7CC]', tagC: 'text-[#252323]' },
  { icon: MonitorSmartphone, t: 'Free KinderOS ERP', d: 'Manage admissions, fees, attendance, staff, and parent updates in one smart operating system.', tag: '10 Integrated Modules', bg: 'bg-[#FFEDEA]', tagC: 'text-[#B02D29]' },
  { icon: Handshake, t: 'Partner Support', d: 'End-to-end campus blueprint, teacher training, admissions playbooks, and ongoing mentorship.', tag: 'Launch to Mentorship', bg: 'bg-[#FFEDE5]', tagC: 'text-[#252323]' },
];

const PILLARS = [
  { icon: LibraryBig, t: 'Pillar 1: Curriculum & Toolkit', a: ['10 multi-intelligence modules', 'Daily lesson plans', 'AI-assisted lesson planning', 'Classroom toolkits'] },
  { icon: Network, t: 'Pillar 2: KinderOS Digital CRM', a: ['Admissions & Enquiries', 'Fees & Invoicing', 'Attendance & Staff', 'Parent Communication'], hot: true },
  { icon: Brain, t: 'Pillar 3: Cognitive Developmental Matrix', a: ['Six development areas', 'Structured child assessment', 'Teacher observations', 'Parent-friendly reports'] },
];

const MODELS = [
  { tag: 'Flagship Launch', t: 'New Preschool Setup', d: 'Build a modern Finnish-inspired campus from the ground up with architectural blueprints, classroom kits, and launch marketing.', img: '/visuals/kips-campus.webp', alt: 'New Kinderbee preschool campus with colourful entrance and playground' },
  { tag: 'Campus Upgrade', t: 'Rebrand Existing School', d: "Upgrade your current preschool with Kinderbee's international brand identity, KinderOS software, and AI-assisted curriculum.", img: '/visuals/kips-partner-school.webp', alt: 'Existing preschool rebranded as a Kinderbee partner school' },
];

const label = 'text-[11px] font-bold uppercase tracking-wider';

export const HomePage: React.FC<HomePageProps> = ({ onOpenConsultation, settings }) => {
  const consult = () => onOpenConsultation('preschool');
  const phone = (settings?.phone || '93449 06393').replace(/\D/g, '').replace(/^(\d{10})$/, '91$1');
  const heroImg = settings?.franchiseHeroImage || '/franchise/preschool-hero.webp?v=4';

  return (
    <MotionConfig reducedMotion="user"><div>
      <SEOHead
        title="Preschool Franchise in India – Zero Royalty | Kinderbee"
        description="Start a Kinderbee preschool franchise in India: zero royalty, Finnish-style curriculum, free KinderOS CRM and full setup support. Book a free consultation."
        keywords="preschool franchise, preschool franchise in India, preschool franchise opportunities, preschool franchise business, nursery franchise, kindergarten franchise, playgroup franchise, preschool franchise in Tamil Nadu, zero royalty preschool franchise, KinderOS"
        ogImage="https://www.kinderbeeschools.com/franchise/preschool-hero.webp?v=4"
        settings={settings}
        faq={FRANCHISE_FAQS}
        extraSchema={FRANCHISE_SERVICE_SCHEMA}
      />

      {/* 1 · HERO */}
      <section className="bg-[#FFF8F7] border-b border-pink-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-14 lg:py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div className="kb-hero-in space-y-6">
            <span className={`inline-flex items-center gap-2 rounded-full bg-[#FFECF0] border border-pink-200/80 px-3.5 py-1.5 text-[#3E0021] ${label}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#B8006C]" /> AI-Powered · Zero Royalty Preschool Franchise
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-display font-extrabold tracking-tight text-[#252323] leading-[1.08]">
              <span className="text-[#B8006C]">AI-Powered</span> Preschool Franchise in India with{' '}
              <span className="rounded-lg bg-[#FFE34D] px-2 [box-decoration-break:clone]">Zero Royalty</span>
            </h1>
            <p className="text-[#615E5D] text-base sm:text-[17px] leading-relaxed max-w-xl">
              Start a Kinderbee preschool franchise with a free ERP and KinderOS, a Finnish-style curriculum, lesson plans, teacher training and full setup support. Zero royalty, and you keep 100% of your fees.
            </p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 max-w-md text-sm font-semibold text-[#252323]">
              {['Free ERP', 'Zero Royalty', 'KinderOS Operating System', 'Finnish-style Curriculum'].map(t => (
                <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-[#B8006C]" />{t}</li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={consult} className="kb-cta inline-flex items-center justify-center gap-2 rounded-lg bg-[#B8006C] hover:bg-[#9c005a] px-6 py-3.5 text-sm font-bold text-white transition cursor-pointer">
                Book Free Consultation <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => openBrochureDownload('Home hero')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E7E1E1] bg-white hover:bg-stone-50 px-6 py-3.5 text-sm font-bold text-[#252323] transition cursor-pointer">
                Download Franchise PDF <Download className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-[#E7E1E1] pt-5 text-xs font-semibold text-[#615E5D]">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#B8006C]" />NEP 2020 Aligned</span>
              <span className="inline-flex items-center gap-1.5"><Baby className="h-4 w-4 text-[#B8006C]" />Child-Centric Education</span>
              <span className="inline-flex items-center gap-1.5"><Globe className="h-4 w-4 text-[#B8006C]" />Global Standards / Local Relevance</span>
            </div>
          </div>
          <img src={heroImg} alt="Kinderbee Preschool campus with children playing outside" width={1031} height={850} data-no-reveal fetchPriority="high"
            className="w-full aspect-[4/3] lg:aspect-[5/4] object-cover rounded-[28px] border border-[#E7E1E1] shadow-xl shadow-pink-900/10" />
        </div>
      </section>

      {/* 2 · ECOSYSTEM */}
      <section className="bg-[#FFF4E5] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-[#252323] leading-tight">More Than a Preschool Franchise. A Complete Education Ecosystem.</h2>
            <p className="mt-3 text-[#615E5D] text-base">Built for school founders who want international pedagogy, institutional software, and complete financial ownership.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ECOSYSTEM.map(({ icon: Icon, t, d, tag, bg, tagC }) => (
              <div key={t} className={`${bg} rounded-2xl border border-black/5 p-6 flex flex-col gap-3 transition hover:-translate-y-1 hover:shadow-lg`}>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-xs"><Icon className="h-5 w-5 text-[#B8006C]" /></span>
                  <ArrowUpRight className="h-4 w-4 text-[#615E5D]" />
                </div>
                <h3 className="text-lg font-display font-bold text-[#252323] mt-2">{t}</h3>
                <p className="text-sm text-[#615E5D] leading-relaxed flex-1">{d}</p>
                <span className={`${label} ${tagC}`}>{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · BUSINESS MODELS */}
      <section className="bg-[#FFF8F7] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-[#252323] leading-tight max-w-md">Choose the Right Preschool Business Model</h2>
            <p className="text-sm text-[#615E5D] max-w-sm">Flexible partnership formats tailored for new founders, existing preschools, and integrated daycare campuses.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            {MODELS.map(m => (
              <article key={m.t} className="overflow-hidden rounded-2xl border border-[#E7E1E1] bg-white flex flex-col transition hover:shadow-lg">
                <img src={m.img} alt={m.alt} loading="lazy" className="w-full aspect-[16/10] object-cover" />
                <div className="p-6 flex flex-col gap-2 flex-1">
                  <span className={`${label} text-[#B8006C]`}>{m.tag}</span>
                  <h3 className="text-xl font-display font-bold text-[#252323]">{m.t}</h3>
                  <p className="text-sm text-[#615E5D] leading-relaxed flex-1">{m.d}</p>
                  <button onClick={consult} className="mt-3 pt-4 border-t border-[#E7E1E1] inline-flex items-center gap-1.5 text-sm font-bold text-[#B8006C] cursor-pointer">Learn More <ArrowRight className="h-4 w-4" /></button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · KIPS ARCHITECTURE */}
      <section className="bg-white py-14 sm:py-20 border-y border-[#E7E1E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <span className={`${label} text-[#B8006C]`}>KIPS Architecture</span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-[#252323] leading-tight">One Integrated System. Everything Your Preschool Needs.</h2>
            </div>
            <div className="space-y-3">
              {PILLARS.map(({ icon: Icon, t, a, hot }) => (
                <div key={t} className={`rounded-xl border border-pink-100 p-4 ${hot ? 'bg-[#FFECF0]' : 'bg-[#FFF8F7]'}`}>
                  <div className="flex items-center gap-2 text-sm font-bold text-[#252323]"><Icon className="h-4 w-4 text-[#B8006C]" />{t}</div>
                  <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#615E5D]">
                    {a.map(x => <li key={x}>• {x}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-pink-100 bg-[#FFF8F7] p-4 sm:p-5 shadow-xl shadow-pink-900/5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E7E1E1]">
              <div className="flex items-center gap-3">
                <span className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#FF665C]" /><i className="h-2.5 w-2.5 rounded-full bg-[#FFE34D]" /><i className="h-2.5 w-2.5 rounded-full bg-[#15803D]" /></span>
                <span className="font-mono text-[11px] text-[#615E5D]">kinderos.kinderbeeschools.com</span>
              </div>
              <span className="rounded-full bg-[#FFECF0] px-2 py-0.5 text-[10px] font-bold text-[#B8006C]">Sample View</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-lg border border-[#E7E1E1] bg-white p-3">
                <div className="text-[10px] font-semibold text-[#615E5D]">Cognitive Matrix</div>
                <div className="mt-1 text-lg font-display font-extrabold text-[#252323] leading-tight">6 Domains</div>
                <div className="mt-2 h-1 rounded-full bg-[#FFECF0]"><div className="h-full w-4/5 rounded-full bg-[#B8006C]" /></div>
                <div className="mt-1 h-1 rounded-full bg-[#FFEDE5]"><div className="h-full w-3/5 rounded-full bg-[#FF914D]" /></div>
              </div>
              <div className="rounded-lg border border-[#E7E1E1] bg-white p-3">
                <div className="text-[10px] font-semibold text-[#615E5D]">Lesson Plans</div>
                <div className="mt-1 text-lg font-display font-extrabold text-[#252323] leading-tight">AI-Assisted</div>
                <p className="mt-1 text-[10px] text-[#615E5D] leading-snug">Daily sensory &amp; literacy prompts ready for teachers.</p>
              </div>
              <div className="rounded-lg border border-[#E7E1E1] bg-white p-3">
                <div className="text-[10px] font-semibold text-[#615E5D]">Parent Updates</div>
                <div className="mt-1 text-lg font-display font-extrabold text-[#B8006C] leading-tight">Live Sync</div>
                <p className="mt-1 text-[10px] text-[#615E5D] leading-snug">Instant attendance &amp; milestone sharing.</p>
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-3 rounded-lg border border-[#E7E1E1] bg-white p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#B8006C]"><Smartphone className="h-4 w-4 text-white" /></span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[#252323]">KinderOS Parent &amp; Teacher Companion</div>
                <p className="text-[11px] text-[#615E5D] leading-snug">Mobile check-ins, fee receipts, and observation logs synced in real time.</p>
              </div>
              <span className="hidden sm:inline rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[10px] font-bold text-[#14532D] shrink-0">Included Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5 · CTA */}
      <section className="relative isolate overflow-hidden bg-stone-900 text-white">
        <img src="/images/campus/kinderbee-campus-bengaluru.jpg" alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-stone-950/85 to-stone-950/40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-20 grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div className="space-y-5">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight leading-tight">Ready to Build a Preschool That Makes a Difference?</h2>
            <p className="text-stone-200 max-w-lg">Talk to our partnership team, explore the model and discover whether Kinderbee is right for your city.</p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <button onClick={consult} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#B8006C] hover:bg-[#9c005a] px-6 py-3.5 text-sm font-bold cursor-pointer">Book Free Consultation <ArrowRight className="h-4 w-4" /></button>
              <button onClick={() => openBrochureDownload('Home closing CTA')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-[#252323] hover:bg-stone-100 cursor-pointer">Download Franchise PDF <Download className="h-4 w-4" /></button>
              <WhatsAppEnquiry phone={phone} className="text-white" />
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 text-[#252323] shadow-2xl">
            <span className="inline-block rounded-full bg-[#FFF1B8] px-3 py-1 text-[11px] font-bold text-[#6D5E00]">Optional Add-On</span>
            <h3 className="mt-3 text-xl font-display font-extrabold">Detailed 1-on-1 Feasibility Review — ₹99</h3>
            <p className="mt-2 text-sm text-[#615E5D] leading-relaxed">Separate from our free introductory call: book a dedicated ₹99 deep-dive session covering your property layout, local catchment, and setup roadmap.</p>
            <button onClick={() => openConsultationBooking('Preschool Partnership / Franchise')} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#B8006C] cursor-pointer">Schedule ₹99 Detailed Consultation <ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      </section>
    </div></MotionConfig>
  );
};
