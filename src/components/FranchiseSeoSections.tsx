import React from 'react';
import { motion } from 'motion/react';
import {
  Award, Puzzle, Smartphone, Handshake, Building2, RefreshCw, Sun, MapPin,
  PhoneCall, ClipboardList, GraduationCap, Rocket, ArrowRight, MessageCircle, ChevronDown,
} from 'lucide-react';
import { EASE } from './Motion';
import { CdmRadar, ModelArt } from './FranchiseVisuals';

// Only facts already published on kinderbeeschools.com or in the Kinderbee Franchise & CRM booklet.
// Blog links point to articles that exist (ids in src/data/journalBlogs.ts).
const BLOG = '/blog/journal-';
const link = 'font-semibold text-[#E1007A] underline decoration-pink-300 underline-offset-4 hover:decoration-[#E1007A]';

const rise = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, delay: i * 0.08, ease: EASE },
});

const Head: React.FC<{ badge?: string; title: React.ReactNode; answer: React.ReactNode }> = ({ badge, title, answer }) => (
  <div className="mx-auto max-w-3xl space-y-3 text-center">
    {badge && <div className="inline-flex rounded-full border border-pink-200 bg-pink-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#E1007A]">{badge}</div>}
    <h2 className="text-3xl font-display font-extrabold tracking-tight text-[#1C1917] [text-wrap:balance] sm:text-4xl lg:text-5xl">{title}</h2>
    <p className="text-base leading-relaxed text-stone-600 sm:text-lg">{answer}</p>
  </div>
);

const Card: React.FC<{ icon: React.ElementType; h: string; i?: number; art?: React.ReactNode; children: React.ReactNode }> = ({ icon: Icon, h, i = 0, art, children }) => (
  <motion.div {...rise(i)} whileHover={{ y: -4 }} className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-pink-200/40">
    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#E1007A] via-[#ff7ab8] to-[#FFD400]" />
    <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-pink-50 transition-transform duration-500 group-hover:scale-125" />
    {art}
    <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E1007A] to-[#ff5aa5] text-white shadow-lg shadow-pink-300/50"><Icon className="h-6 w-6" /></span>
    <h3 className="relative mt-4 text-lg font-extrabold text-stone-900">{h}</h3>
    <p className="relative mt-2 text-sm leading-relaxed text-stone-600">{children}</p>
  </motion.div>
);

/* ---------- Why choose ---------- */
export const WhyChooseSection: React.FC = () => (
  <section id="why-kinderbee" className="scroll-mt-28 mx-auto max-w-7xl px-4 sm:px-8">
    <Head
      title="Why Choose KinderBee Preschool Franchise?"
      answer="KinderBee is a preschool franchise in India built on a zero-royalty model, a Finnish-inspired play-based curriculum and a free school-management platform, KinderOS. Partners keep 100% of tuition fees and receive curriculum, teacher training, branding and admissions support from a Bengaluru-based education brand with about 26 years of experience."
    />
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <Card i={0} icon={Award} h="Zero royalty, 100% of tuition">
        ₹0 monthly royalty, with partners keeping all recurring tuition fees under the partnership agreement. <a className={link} href={`${BLOG}zero-royalty-preschool-franchise-india`}>See what zero royalty changes</a>.
      </Card>
      <Card i={1} icon={Puzzle} h="Finnish-inspired, NEP 2020 aligned">
        A child-centred curriculum delivered the same way in every classroom. <a className={link} href={`${BLOG}nordic-inspired-play-based-preschool-india`}>How Nordic-inspired learning works</a>.
      </Card>
      <Card i={2} icon={Smartphone} h="Free KinderOS CRM and ERP">
        Admissions, fees, attendance, staff and parent communication in one platform, included with the franchise.
      </Card>
      <Card i={3} icon={Handshake} h="Complete partner support">
        Setup guidance, branding, teacher training and mentorship. <a className={link} href={`${BLOG}kips-360-preschool-franchise-support`}>What 360° support should look like</a>.
      </Card>
    </div>
  </section>
);

/* ---------- Franchise models ---------- */
export const FranchiseModelsSection: React.FC<{ onEnquire: () => void }> = ({ onEnquire }) => (
  <section id="franchise-opportunities" className="scroll-mt-28 mx-auto max-w-7xl px-4 sm:px-8">
    <Head
      title="Explore Our Preschool Franchise Opportunities"
      answer="KinderBee offers three ways to start: open a new preschool, convert an existing preschool to the KinderBee brand, or add daycare to a preschool for an extended-day model. The curriculum covers playgroup, nursery, LKG and UKG, so one franchise serves the playgroup, nursery and kindergarten stages. The right model depends on your space, city and budget."
    />
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      <Card i={0} icon={Building2} h="New preschool setup" art={<div className="relative mb-4"><ModelArt kind="new" /></div>}>
        For first-time owners: setup guidance, brand identity, curriculum and toolkit, and teacher training, so you open with a tested model behind you.
      </Card>
      <Card i={1} icon={RefreshCw} h="Rebrand an existing preschool" art={<div className="relative mb-4"><ModelArt kind="rebrand" /></div>}>
        For running schools: a new KinderBee identity, curriculum integration, the free KinderOS CRM and ongoing support.
      </Card>
      <Card i={2} icon={Sun} h="Preschool plus daycare" art={<div className="relative mb-4"><ModelArt kind="daycare" /></div>}>
        A combined model that adds extended-day care. <a className={link} href={`${BLOG}preschool-daycare-combo-business-model-india`}>When a combined early-years model makes sense</a>.
      </Card>
    </div>
    <div className="mt-8 text-center">
      <button onClick={onEnquire} className="inline-flex items-center gap-2 rounded-full bg-[#E1007A] px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#c90070] cursor-pointer">
        Find the right model for my city <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  </section>
);

/* ---------- Curriculum ---------- */
export const CurriculumSection: React.FC = () => (
  <section id="curriculum" className="scroll-mt-28 mx-auto max-w-7xl px-4 sm:px-8">
    <Head
      title="Our International Preschool Curriculum"
      answer="KinderBee's curriculum is Finnish-inspired and play-based, developed by Finnishway Educare and aligned with NEP 2020 and NCF-FS. It combines ten multi-intelligence modules, detailed daily lesson plans and turnkey classroom toolkits, with AI-assisted lesson planning built in."
    />
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      <Card i={0} icon={Puzzle} h="Modules, lesson plans and toolkits">
        Ten multi-intelligence modules, daily lesson plans ready for every class, and learning kits and classroom materials supplied at setup.
      </Card>
      <Card i={1} icon={GraduationCap} h="Foundational stage alignment">
        Built around NEP 2020 and NCF-FS. <a className={link} href={`${BLOG}nep-2020-preschool-franchise-foundational-stage`}>What operators should understand about the foundational stage</a>.
      </Card>
      <Card i={2} icon={ClipboardList} h="Developmental assessment">
        The Cognitive Developmental Matrix is a structured assessment for 5 to 6 year-olds across six development areas, rated 1 to 5, with a summary teachers can share with parents.
      </Card>
    </div>
      <motion.div {...rise(0)} className="mt-8 grid items-center gap-8 overflow-hidden rounded-3xl border border-pink-100 bg-gradient-to-br from-[#FFF6F9] to-white p-6 sm:p-10 lg:grid-cols-2">
      <div className="space-y-4">
        <h3 className="text-2xl font-display font-extrabold tracking-tight text-stone-900 sm:text-3xl">See every child grow, across six areas</h3>
        <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
          The Cognitive Developmental Matrix rates each child from 1 to 5 in play, socio-emotional growth, wellness, language, literacy and cognitive development, with space for the teacher&rsquo;s observations. The summary can be printed, downloaded or shared with parents, and is shared across branches in KinderOS.
        </p>
        <ul className="grid grid-cols-2 gap-2 text-sm font-semibold text-stone-700">
          {['Play', 'Socio-emotional', 'Wellness', 'Language', 'Literacy', 'Cognitive'].map(x => (
            <li key={x} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#E1007A]" />{x}</li>
          ))}
        </ul>
      </div>
      <CdmRadar />
    </motion.div>
  </section>
);

/* ---------- India-wide opportunities ---------- */
const REGIONS = [
  { r: 'South India', c: 'Bengaluru, Hyderabad, Chennai, Coimbatore and across Tamil Nadu' },
  { r: 'West India', c: 'Mumbai, Pune and Ahmedabad' },
  { r: 'North India', c: 'Delhi NCR, Jaipur and Lucknow' },
  { r: 'East India', c: 'Kolkata and neighbouring cities' },
];

export const IndiaOpportunitySection: React.FC<{ onEnquire: () => void }> = ({ onEnquire }) => (
  <section id="franchise-india" className="scroll-mt-28 mx-auto max-w-7xl px-4 sm:px-8">
    <Head
      title="Preschool Franchise Opportunities Across India"
      answer="KinderBee welcomes preschool franchise enquiries from across India, from metro cities to Tier-2 towns. The parent preschool is in Ramamurthy Nagar, Bengaluru. Whether a territory is available is confirmed by the KinderBee team after you share your city and plan."
    />
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {REGIONS.map((x, i) => (
        <motion.div key={x.r} {...rise(i)} className="rounded-3xl border border-stone-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-base font-extrabold text-stone-900"><MapPin className="h-4 w-4 text-[#E1007A]" />{x.r}</h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{x.c}</p>
        </motion.div>
      ))}
    </div>
    <p className="mt-5 text-center text-xs text-stone-500">Listing a city does not mean a territory is open. Availability is confirmed during consultation.</p>
    <div className="mt-6 text-center">
      <button onClick={onEnquire} className="inline-flex items-center gap-2 rounded-full border border-[#E1007A] px-7 py-3 text-sm font-bold text-[#E1007A] hover:bg-pink-50 cursor-pointer">
        Check my city <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  </section>
);

/* ---------- How to start ---------- */
const STEPS = [
  { icon: PhoneCall, t: 'Book a consultation', d: 'Start with a free consultation, or a detailed one-to-one session for ₹99. Share your city, budget and plans.' },
  { icon: ClipboardList, t: 'Plan your model', d: 'Choose a new preschool, a rebrand or a preschool-plus-daycare model, mapped to your location.' },
  { icon: GraduationCap, t: 'Setup and training', d: 'Curriculum, KinderOS CRM and Cognitive Developmental Matrix onboarding, with teacher and staff training.' },
  { icon: Rocket, t: 'Launch and admissions', d: 'Open your doors with admissions playbooks, marketing support and ongoing mentorship.' },
];

export const HowToStartSection: React.FC = () => (
  <section id="how-to-start" className="scroll-mt-28 mx-auto max-w-7xl px-4 sm:px-8">
    <Head
      title="How to Start Your KinderBee Preschool Franchise"
      answer="Starting a KinderBee preschool franchise takes four steps: a consultation, planning your model, setup and training, and launch with admissions support."
    />
    <ol className="relative mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <span aria-hidden="true" className="pointer-events-none absolute left-[12%] right-[12%] top-0 hidden h-0.5 -translate-y-[9px] bg-gradient-to-r from-[#E1007A]/10 via-[#E1007A]/50 to-[#FFD400] lg:block" />
      {STEPS.map(({ icon: Icon, t, d }, i) => (
        <motion.li key={t} {...rise(i)} className="relative rounded-3xl border border-pink-100 bg-[#FFF6F9] p-6">
          <span className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#E1007A] text-sm font-extrabold text-white ring-4 ring-white shadow-md">{i + 1}</span>
          <Icon className="h-6 w-6 text-[#E1007A]" aria-hidden="true" />
          <h3 className="mt-3 text-base font-extrabold text-stone-900">{t}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{d}</p>
        </motion.li>
      ))}
    </ol>
    <p className="mt-6 text-center text-sm text-stone-600">
      Read more: <a className={link} href={`${BLOG}how-to-start-a-preschool-in-india`}>how to start a preschool in India</a>,{' '}
      <a className={link} href={`${BLOG}preschool-franchise-cost-india`}>preschool franchise cost</a> and{' '}
      <a className={link} href={`${BLOG}questions-before-buying-preschool-franchise`}>7 questions to ask before choosing a franchise</a>.
    </p>
  </section>
);

/* ---------- FAQ (visible; the same list feeds FAQPage markup) ---------- */
export const FRANCHISE_FAQS: { q: string; a: string }[] = [
  {
    q: 'What documents and details are needed for a preschool franchise?',
    a: 'You typically need your preferred city, details of the premises with ownership or lease papers, your investment plan, and valid identity and business details. KinderBee shares the exact checklist during consultation, because requirements vary by city, premises and local norms. Start by sharing your city, budget and plans on the first call.',
  },
  {
    q: 'How much profit does a preschool and daycare franchise make?',
    a: 'No profit is guaranteed. Earnings from a preschool and daycare franchise depend on your city, location, fees, enrolment, staffing and running costs. KinderBee is zero royalty, so partners keep 100% of tuition fees, and daycare can add extended-day income. Ask the team for the assumptions behind any projection before you decide.',
  },
  {
    q: 'What is the difference between a preschool franchise and an independent preschool?',
    a: 'A franchise gives you an established brand, a tested curriculum, training and systems from day one, while an independent preschool means building each of these yourself. The trade-off is that a franchise operates under a partnership agreement. With KinderBee there is no monthly royalty, so you keep 100% of tuition fees.',
  },
  {
    q: 'Which cities offer preschool franchise opportunities in India?',
    a: 'KinderBee welcomes enquiries from across India, including Bengaluru, Hyderabad, Chennai, Coimbatore, Pune, Mumbai, Ahmedabad, Delhi NCR, Jaipur, Lucknow and Kolkata. Availability depends on the territory, so the team confirms whether your city is open after you share your location and plan.',
  },
  {
    q: 'What support does KinderBee provide to franchise partners?',
    a: 'Partners receive setup guidance and a school design blueprint, brand identity, a franchise operations manual, curriculum and lesson plans, teacher and staff training, admissions playbooks, marketing campaigns, the KinderOS CRM and ERP, quality audits and a mentor. Support continues after launch through ongoing mentorship advisory.',
  },
  {
    q: 'How do I start a KinderBee preschool franchise?',
    a: 'Book a free consultation, or a detailed one-to-one session for ₹99. Then plan your model (new preschool, rebrand or preschool plus daycare), complete setup and training, and launch with admissions support. The consultation covers the franchise model, the curriculum, KinderOS and your business plans.',
  },
  {
    q: 'What are the requirements to open a preschool franchise?',
    a: 'Requirements are confirmed by the KinderBee team for your city and plan. The current indicative figures are an estimated capital investment of ₹15 to ₹30 Lakhs, covering interiors, safety flooring, furniture, activity kits and launch marketing, and a ground-floor villa or commercial property of about 1,500 to 3,500 sq. ft. with outdoor play space. These figures are subject to confirmation.',
  },
  {
    q: 'Does KinderBee provide teacher training and curriculum support?',
    a: 'Yes. Partners receive the Finnish-inspired curriculum with ten multi-intelligence modules, daily lesson plans and toolkits, plus training for teachers and staff and staff recruitment guides. Teachers can also take KinderBee teacher training programmes, and a mentor advises you at each stage.',
  },
];

export const FranchiseFaqSection: React.FC = () => (
  <section id="franchise-faq" className="scroll-mt-28 mx-auto max-w-4xl px-4 sm:px-8">
    <h2 className="text-center text-3xl font-display font-extrabold tracking-tight text-[#1C1917] sm:text-4xl">Frequently Asked Questions</h2>
    <p className="mt-2 text-center text-sm text-stone-600">Straight answers about the KinderBee preschool franchise in India. Tap a question to open it.</p>
    {/* Native <details>: every answer stays in the page HTML and is the same text used for the FAQPage markup */}
    <div className="mt-8 space-y-3">
      {FRANCHISE_FAQS.map((f, i) => (
        <details key={f.q} open={i === 0} className="group overflow-hidden rounded-2xl border border-stone-200 bg-white open:shadow-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 hover:bg-stone-50 sm:p-5 [&::-webkit-details-marker]:hidden">
            <h3 className="text-sm font-bold text-stone-900 sm:text-base">{f.q}</h3>
            <ChevronDown className="h-4 w-4 shrink-0 text-stone-400 transition-transform group-open:rotate-180 group-open:text-[#E1007A]" />
          </summary>
          <p className="border-t border-stone-100 bg-stone-50/60 p-4 text-sm leading-relaxed text-stone-600 sm:p-5 sm:text-base">{f.a}</p>
        </details>
      ))}
    </div>
  </section>
);

/* ---------- Jump links ---------- */
const JUMPS = [
  ['#why-kinderbee', 'Why KinderBee'], ['#franchise-opportunities', 'Franchise models'], ['#kinderos', 'KIPS & KinderOS'],
  ['#curriculum', 'Curriculum'], ['#franchise-support', 'Partner support'], ['#franchise-investment', 'Investment'],
  ['#franchise-india', 'Across India'], ['#how-to-start', 'How to start'], ['#franchise-faq', 'FAQs'],
];
export const JumpLinks: React.FC = () => (
  <nav aria-label="On this page" className="mx-auto max-w-7xl px-4 sm:px-8">
    <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
      {JUMPS.map(([href, label]) => (
        <li key={href} className="shrink-0">
          <a href={href} className="inline-block rounded-full border border-stone-200 bg-white px-4 py-3 text-xs sm:py-2 font-semibold text-stone-700 transition hover:border-[#E1007A] hover:text-[#E1007A] sm:text-sm">{label}</a>
        </li>
      ))}
    </ul>
  </nav>
);

export const WA_MESSAGE = 'Hi, I would like details about the KinderBee preschool franchise.';

export const WhatsAppEnquiry: React.FC<{ phone?: string; className?: string }> = ({ phone = '919344906393', className = '' }) => (
  <a
    href={`https://wa.me/${phone}?text=${encodeURIComponent(WA_MESSAGE)}`}
    target="_blank" rel="noopener noreferrer"
    className={`inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-bold hover:bg-white/10 ${className}`}
  >
    <MessageCircle className="h-4 w-4" /> WhatsApp us
  </a>
);
