import React from 'react';
import { openBrochureDownload } from '../BrochureDownload';
import { motion } from 'motion/react';
import {
  Wallet, BadgePercent, Building2, GraduationCap, Users, Megaphone, ShieldCheck, Scale,
  Phone, MessageCircle, Download, ArrowRight, Sparkles, BadgeCheck,
  PhoneCall, MapPin, FileSignature, PencilRuler, Rocket, MonitorCheck, Award,
} from 'lucide-react';
import { SystemSettings } from '../../types';
import { Accordion, Eyebrow, Palette, ReadinessCheck, SERIF, inView, rise, stagger } from './kit';
import { FloorPlanVisual, KeepAllVisual, PhotoStrip, RangeVisual, VisualTimeline } from './visuals';

// New section for the Preschool Franchise page: written from the point of view of a serious buyer.
// Every figure below is already published elsewhere on the page; nothing here promises a return.

const P: Palette = {
  bg: '#17050F',
  ink: '#FFF7FB',
  muted: '#D9C3CF',
  accent: '#F2C14E',
  accentSoft: '#F6D78B',
  card: 'rgba(255,255,255,0.05)',
  line: 'rgba(255,255,255,0.13)',
  dark: true,
};

const QUESTIONS = [
  {
    icon: Wallet, q: 'How much do I need to invest?', tag: 'Published range',
    a: 'The estimated capital investment is ₹15 – ₹30 Lakhs. It covers interior setup, safety flooring, furniture, activity kits and your marketing launch. Ask us for a city-specific cost break-up when we speak.',
  },
  {
    icon: BadgePercent, q: 'Will I pay royalty every month?', tag: 'Zero royalty',
    a: 'No. Kinderbee is a zero-royalty model: ₹0 per month, and you keep 100% of your tuition revenue, in line with the terms of your partnership agreement.',
  },
  {
    icon: Building2, q: 'What kind of space do I need?', tag: 'Published range',
    a: 'A ground-floor residential villa or commercial property of about 1,500 – 3,500 sq. ft., with outdoor play space for the children.',
  },
  {
    icon: GraduationCap, q: 'Do I have to figure out running a school alone?', tag: 'In your partner kit',
    a: 'No. You receive a Franchise Operations Manual, staff recruitment guides, training for teachers and staff, and a mentor who advises you at each stage.',
  },
  {
    icon: Users, q: 'What will the children actually learn?', tag: 'In your partner kit',
    a: 'A Finnish-inspired, child-centred curriculum aligned with NEP 2020, adapted to your city, so every Kinderbee classroom delivers it the same way.',
  },
  {
    icon: Megaphone, q: 'How will I get admissions?', tag: 'In your partner kit',
    a: 'An SEO-optimized micro-website so parents can find you, admissions playbooks that turn enquiries into enrolments, and ready-made monthly marketing campaigns.',
  },
  {
    icon: ShieldCheck, q: 'How is quality kept consistent?', tag: 'In your partner kit',
    a: 'Continuous quality audits, a school management ERP for attendance, fees and records, and ongoing mentorship advisory support.',
  },
  {
    icon: Scale, q: 'What returns can I expect?', tag: 'Ask us for the assumptions',
    a: 'Returns depend on your city, location, fees, enrolment and running costs, and no return is guaranteed. Ask to see the assumptions behind any projection before you decide.',
  },
];

const JOURNEY = [
  { icon: PhoneCall, t: 'Enquiry & discovery call', d: 'Share your city, budget and plans. We explain the model and answer every question.' },
  { icon: MapPin, t: 'Location & space review', d: 'Check your property against the ground-floor, 1,500 – 3,500 sq. ft. guideline with outdoor play space.' },
  { icon: FileSignature, t: 'Partnership agreement', d: 'Terms are set out in a written agreement. Read it closely and take independent advice.' },
  { icon: PencilRuler, t: 'Design & set-up', d: 'School design blueprint, interiors, safety flooring, furniture and activity kits.' },
  { icon: Users, t: 'Team & training', d: 'Staff recruitment guides and training for your teachers and staff before launch.' },
  { icon: Rocket, t: 'Launch & admissions', d: 'Micro-website, admissions playbook and your first marketing campaign.' },
  { icon: MonitorCheck, t: 'Run it on the ERP', d: 'Attendance, fees and records managed in one place.' },
  { icon: Award, t: 'Audits & mentorship', d: 'Regular quality reviews and an advisor alongside you as you grow.' },
];

// Kinderbee's own photographs (the spaces shown on the home page)
const SPACES = [
  { src: '/images/campus/kinderbee-campus-bengaluru.jpg', alt: 'Kinderbee preschool campus in Ramamurthy Nagar, Bengaluru', caption: 'Kinderbee campus' },
  { src: '/images/campus/kinderbee-number-worksheet-activity.jpg', alt: 'Kinderbee children tracing numbers on worksheets', caption: 'Early numeracy' },
  { src: '/images/campus/kinderbee-classroom-learning.jpg', alt: 'Kinderbee children learning in a small group', caption: 'Small-group classroom' },
  { src: '/images/campus/kinderbee-puppet-storytelling.jpg', alt: 'Kinderbee teachers presenting a puppet show', caption: 'Puppet storytelling' },
];

const READINESS = [
  'I have a ground-floor villa or commercial property of about 1,500 – 3,500 sq. ft. in mind',
  'The property has space for outdoor play',
  'I have planned capital of ₹15 – ₹30 Lakhs for the set-up',
  'I have shortlisted the city or catchment area I want to serve',
  'I can give time to local admissions and parent conversations',
  'I am comfortable following one standard curriculum and operations manual',
  'I have an accountant or lawyer who can review the partnership agreement with me',
];

const FAQ = [
  {
    q: 'Is the zero-royalty promise really unconditional?',
    a: 'Zero royalty is the model: ₹0 per month, with partners keeping 100% of recurring tuition fees. As with any franchise, it applies under the specific partnership agreement and standard terms, so ask to read the agreement before you commit.',
  },
  {
    q: 'Who owns the brand, curriculum and lesson plans?',
    a: 'The Kinderbee name, the KIPS logo and mascot, and the Nordic-inspired lesson plans and pedagogical frameworks are the intellectual property of Finnish-way Educare Pvt Ltd. Partners use them under the brand licence.',
  },
  {
    q: 'What do I get that I could not build on my own?',
    a: 'A tested way of running a preschool: the operations manual, curriculum, training, admissions playbooks, ERP and quality audits come together in one partner kit, with a mentor to guide you.',
  },
  {
    q: 'How do I learn more before I decide?',
    a: 'Download the franchise brochure, book a free consultation, or speak to the team by phone or WhatsApp. Take your time. A good decision beats a quick one.',
  },
];

export const FranchiseBuyerGuide: React.FC<{ onOpenConsultation: () => void; settings?: SystemSettings | null }> = ({ onOpenConsultation, settings }) => {
  const phone = settings?.phone || '81223 44040';
  const wa = (settings?.whatsappNumber || '918122344040').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${wa}?text=${encodeURIComponent('Hello Kinderbee, I would like to know more about the preschool franchise.')}`;

  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-8" aria-labelledby="buyer-guide-title">
      <div className="relative overflow-hidden rounded-[2rem] p-5 shadow-2xl sm:p-10 lg:p-14" style={{ background: `linear-gradient(160deg, #240A19 0%, ${P.bg} 55%, #0F0309 100%)` }}>
        {/* Atmosphere */}
        <div aria-hidden="true" className="kb-drift pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#E1007A]/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#F2C14E]/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:26px_26px]" />

        {/* ---------- Heading ---------- */}
        <motion.div className="relative mx-auto max-w-3xl text-center" variants={stagger(0.12)} {...inView}>
          <motion.div variants={rise}><Eyebrow color={P.accent} center>The buyer&rsquo;s lens</Eyebrow></motion.div>
          <motion.h2 id="buyer-guide-title" variants={rise} style={SERIF} className="text-4xl leading-[1.08] text-white sm:text-5xl">
            Every question a serious buyer asks, <span style={{ color: P.accent }}>answered up front.</span>
          </motion.h2>
          <motion.p variants={rise} className="mt-5 text-base leading-relaxed sm:text-lg" style={{ color: P.muted }}>
            We wrote this the way we would research a franchise ourselves: the money, the space, the support, the risks and what happens after launch.
          </motion.p>
        </motion.div>

        {/* ---------- The three big questions, drawn ---------- */}
        <div className="relative mt-12 grid gap-4 md:grid-cols-3">
          <RangeVisual accent={P.accent} ink="#fff" muted={P.muted} card={P.card} line={P.line} min="₹15L" max="₹30L"
            title="Estimated capital investment" caption="Interiors, safety flooring, furniture, activity kits and your launch marketing." />
          <KeepAllVisual accent={P.accent} ink="#fff" muted={P.muted} card={P.card} line={P.line}
            title="Zero royalty" caption="₹0 per month. You keep 100% of your tuition revenue, as set out in your agreement." />
          <FloorPlanVisual accent={P.accent} ink="#fff" muted={P.muted} card={P.card} line={P.line} area="1,500 – 3,500 sq ft"
            title="The space you need" caption="Ground-floor villa or commercial property with outdoor play. Illustrative layout." />
        </div>

        {/* ---------- Eight questions ---------- */}
        <motion.div className="relative mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" variants={stagger(0.07)} {...inView}>
          {QUESTIONS.map(({ icon: Icon, q, a, tag }) => (
            <motion.article
              key={q}
              variants={rise}
              className="group flex flex-col rounded-2xl border p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#F2C14E]/60 hover:bg-white/[0.08]"
              style={{ background: P.card, borderColor: P.line }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl text-[#17050F] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${P.accentSoft}, ${P.accent})` }}>
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold leading-snug text-white">{q}</h3>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed" style={{ color: P.muted }}>{a}</p>
              <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ borderColor: `${P.accent}66`, color: P.accentSoft }}>
                <BadgeCheck className="h-3 w-3" /> {tag}
              </span>
            </motion.article>
          ))}
        </motion.div>

        {/* ---------- What you are building ---------- */}
        <div className="relative mt-20">
          <motion.div className="mx-auto mb-8 max-w-2xl text-center" variants={stagger(0.1)} {...inView}>
            <motion.div variants={rise}><Eyebrow color={P.accent} center>Inside a Kinderbee preschool</Eyebrow></motion.div>
            <motion.h2 variants={rise} style={SERIF} className="text-3xl leading-tight text-white sm:text-[2.6rem]">Spaces parents remember.</motion.h2>
          </motion.div>
          <PhotoStrip items={SPACES} />
        </div>

        {/* ---------- Journey ---------- */}
        <div className="relative mt-20">
          <motion.div className="mx-auto max-w-2xl text-center" variants={stagger(0.1)} {...inView}>
            <motion.div variants={rise}><Eyebrow color={P.accent} center>The journey</Eyebrow></motion.div>
            <motion.h2 variants={rise} style={SERIF} className="text-3xl leading-tight text-white sm:text-[2.6rem]">From first call to first admission.</motion.h2>
            <motion.p variants={rise} className="mt-3 text-sm sm:text-base" style={{ color: P.muted }}>Eight clear steps, so you always know what comes next.</motion.p>
          </motion.div>

          <div className="relative mt-10">
            <VisualTimeline steps={JOURNEY} accent={P.accent} ink="#fff" muted={P.muted} line={P.line} card="rgba(255,255,255,0.06)" dark />
          </div>
        </div>

        {/* ---------- Readiness check ---------- */}
        <motion.div className="relative mt-20" variants={rise} {...inView}>
          <ReadinessCheck
            p={P}
            title="Franchise readiness check"
            intro="Tick what is already true for you. It takes a minute, and it shows what to prepare before we speak."
            items={READINESS}
            doneLabel="You are ready for a conversation."
            actionLabel="Book Free Consultation"
            onAction={onOpenConsultation}
          />
        </motion.div>

        {/* ---------- Verify + FAQ ---------- */}
        <div className="relative mt-20 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div variants={rise} {...inView} className="rounded-[1.75rem] border p-6 sm:p-8" style={{ background: P.card, borderColor: P.line }}>
            <Eyebrow color={P.accent}>Verify us before you invest</Eyebrow>
            <h3 style={SERIF} className="text-2xl leading-tight text-white sm:text-[1.9rem]">Check who you are partnering with</h3>
            <dl className="mt-6 space-y-4 text-sm">
              {[
                ['Legal entity', 'Finnish-Way Educare Private Limited'],
                ['CIN', 'U85500TN2024PTC169138'],
                ['GSTIN', '33AAFCF8851Q1ZZ'],
                ['Office', 'No. 1, Old UCO Bank Road, Rajarajeshwari Layout, Ramamurthy Nagar, Bengaluru – 560016, Karnataka'],
                ['Website', 'www.kinderbeeschools.com'],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5 border-b pb-3 last:border-0 last:pb-0 sm:flex-row sm:gap-4" style={{ borderColor: P.line }}>
                  <dt className="w-36 shrink-0 text-[11px] font-bold uppercase tracking-wider" style={{ color: P.accentSoft }}>{k}</dt>
                  <dd className="text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs leading-relaxed" style={{ color: P.muted }}>
              Please check these details on the public company register and ask for the agreement in writing before you pay anything.
            </p>
          </motion.div>

          <motion.div variants={rise} {...inView}>
            <Eyebrow color={P.accent}>Good to know</Eyebrow>
            <h3 style={SERIF} className="mb-6 text-2xl leading-tight text-white sm:text-[1.9rem]">Straight answers to the hard questions</h3>
            <Accordion items={FAQ} p={P} />
          </motion.div>
        </div>

        {/* ---------- Closing CTA ---------- */}
        <motion.div
          className="relative mt-20 overflow-hidden rounded-[1.75rem] p-5 text-center sm:p-10 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-10 lg:text-left"
          style={{ background: `linear-gradient(135deg, ${P.accent}, #D9A53A)` }}
          variants={rise} {...inView}
        >
          <Sparkles aria-hidden="true" className="kb-spin-slow absolute right-6 top-6 h-8 w-8 text-[#17050F]/25" />
          <div className="mb-7 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/40 lg:mb-0">
            <img src="/visuals/kips-partner-school.webp" alt="Children playing outside a Kinderbee partner preschool" loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover transition-transform duration-[1.4s] hover:scale-105" />
          </div>
          <div>
          <h2 style={SERIF} className="mx-auto max-w-2xl text-3xl leading-tight text-[#17050F] sm:text-4xl lg:mx-0">Ready to see if Kinderbee is right for you?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[#3b2410] sm:text-base lg:mx-0">Talk to the team, ask the hard questions, and take the brochure home. No pressure, just clarity.</p>
          <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-start">
            <button onClick={onOpenConsultation} className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#17050F] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-xl">
              Book Free Consultation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button type="button" onClick={() => openBrochureDownload('Franchise buyer guide')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#17050F]/30 bg-white/40 px-6 py-3.5 text-sm font-bold text-[#17050F] transition hover:bg-white/60"
            >
              <Download className="h-4 w-4" /> Download Franchise PDF
            </button>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#17050F]/30 bg-white/40 px-6 py-3.5 text-sm font-bold text-[#17050F] transition hover:bg-white/60">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
          <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#17050F] underline-offset-4 hover:underline">
            <Phone className="h-4 w-4" /> {phone}
          </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
