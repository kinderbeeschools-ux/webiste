import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, Sparkles, TrendingUp, Headphones, Globe, ArrowRight, CheckCircle2, Award, BookOpen, 
  Users, Building, Star, Download, ChevronDown, HelpCircle, 
  GraduationCap, School, Camera, Heart, Sun, Smile, Clock, 
  MapPin, Phone, Mail, Send, Calendar, Check, Play, Pause, UserCheck,
  Quote, ChevronLeft, ChevronRight, Volume2, VolumeX, Video
} from 'lucide-react';
import { FAQItem, SystemSettings } from '../types';
import { SEOHead } from '../components/SEOHead';
import { SmartImage } from '../components/SmartImage';
import { motion, MotionConfig, useInView } from 'motion/react';
import { Reveal, EASE } from '../components/Motion';
import { openConsultationBooking, ConsultationOffer } from '../components/ConsultationBooking';
import { openBrochureDownload } from '../components/BrochureDownload';
import { FranchiseBuyerGuide, FAQ_SCHEMA } from '../components/premium/FranchiseBuyerGuide';
import { KinderOsSection } from '../components/KinderOsSection';
import { FranchiseShowcase } from '../components/FranchiseShowcase';
import { FranchiseDetails } from '../components/FranchiseDetails';
import { trackLead } from '../utils/analytics';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  onOpenConsultation: (type?: string) => void;
  faqs: FAQItem[];
  settings?: SystemSettings | null;
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "1. What is the Kinderbee Integrated Partnership System (KIPS)?",
    answer: "KIPS is a globally oriented educational partnership system that provides schools with comprehensive academic, operational, branding, and teacher-training support.",
    section: "home"
  },
  {
    id: "faq-2",
    question: "2. Why choose the Kinderbee Preschool Franchise?",
    answer: "The Kinderbee Preschool Franchise offers a well-tested, pilot-run model featuring a Nordic-inspired, play-based curriculum, comprehensive teacher training, 360-degree institutional support, and a no-royalty partnership model—enabling partners to establish and manage a high-quality, child-centred preschool.",
    section: "home"
  },
  {
    id: "faq-3",
    question: "3. What is the process for starting a Kinderbee Preschool?",
    answer: "Begin by submitting a partnership enquiry. The Kinderbee team will then guide you through the initial consultation, location and infrastructure assessment, partnership formalities, preschool setup, curriculum implementation, teacher training, branding, and operational launch.",
    section: "home"
  },
  {
    id: "faq-4",
    question: "4. Who can become a Kinderbee Preschool Partner?",
    answer: "Educators, entrepreneurs, existing school owners, educational institutions, and investors with a commitment to quality early-childhood education can become Kinderbee partners. Prior experience in preschool management is an advantage but not essential, as Kinderbee provides comprehensive training and ongoing institutional support.",
    section: "home"
  },
  {
    id: "faq-5",
    question: "5. What makes the Kinderbee curriculum distinctive?",
    answer: "The Kinderbee curriculum is a Nordic-inspired, play-based learning framework that nurtures the whole child through joyful exploration, creativity, collaboration, and real-world experiences. It combines global educational practices with age-appropriate, child-centred learning.",
    section: "home"
  },
  {
    id: "faq-6",
    question: "6. What ongoing support does Kinderbee provide to its partners?",
    answer: "Kinderbee provides continuous support in curriculum implementation, academic planning, teacher training, branding, marketing, admissions, preschool operations, quality assurance, and institutional development, helping partners maintain consistent educational and service standards.",
    section: "home"
  },
  {
    id: "faq-7",
    question: "7. How does the Kinderbee curriculum align with NEP 2020?",
    answer: "The Kinderbee curriculum reflects the core principles of NEP 2020 through play-based and experiential learning, foundational literacy and numeracy, age-appropriate activities, multilingual exposure, and holistic child development.",
    section: "home"
  },
  {
    id: "faq-8",
    question: "8. What is FinnishWay Academy?",
    answer: "FinnishWay Academy is the professional teacher-training and development wing of the Kinderbee ecosystem. It equips educators with practical expertise in Nordic-inspired, play-based learning, early-childhood education, classroom management, curriculum implementation, and modern pedagogical perspectives and practices.",
    section: "home"
  },
  {
    id: "faq-9",
    question: "9. Is prior experience in education required to become a Kinderbee partner?",
    answer: "No. Prior experience in education is helpful but not mandatory. Kinderbee provides the training, curriculum, operational guidance, and ongoing support required to help committed entrepreneurs establish and manage a quality preschool.",
    section: "home"
  },
  {
    id: "faq-10",
    question: "10. Can I rebrand my existing preschool with Kinderbee?",
    answer: "Yes. Existing preschools can transition to the Kinderbee brand and benefit from its proven partnership model, distinctive curriculum, teacher training, academic systems, branding, marketing, and operational guidance—helping them improve quality, strengthen parent confidence, and accelerate institutional growth.",
    section: "home"
  }
];

const renderFormattedAnswer = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-stone-900 font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

interface Testimonial {
  id: string;
  title: string;
  quote: string;
  author: string;
  role: string;
  category: 'franchise' | 'teacher' | 'parent';
  categoryLabel: string;
  badgeColor: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    title: 'A Wonderful Opportunity to Make a Difference',
    quote: 'Partnering with Kinderbee has been an incredible journey. The structured curriculum, continuous guidance, and strong operational support have helped us build a nurturing preschool. We are proud to be part of a brand that truly values children’s holistic development.',
    author: 'Siraj (Kanpur)',
    role: 'Kinderbee Preschool Franchise Partner',
    category: 'franchise',
    categoryLabel: 'Franchise Partner',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    rating: 5
  },
  {
    id: 'test-2',
    title: 'A Transformative Learning Experience',
    quote: 'The Kinderbee Teacher Training Programme completely changed my approach to teaching. I learned how to create engaging classroom experiences, understand children’s needs, and make learning more joyful through play-based methods.',
    author: 'Nivetha',
    role: 'Teacher Training Programme Participant',
    category: 'teacher',
    categoryLabel: 'Teacher Training',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    rating: 5
  },
  {
    id: 'test-3',
    title: 'Confidence to Teach Creatively',
    quote: 'This programme helped me develop the confidence and practical skills needed to become a better early-years educator. The hands-on activities, modern teaching strategies, and expert guidance were incredibly valuable.',
    author: 'Swetha',
    role: 'Early Childhood Educator',
    category: 'teacher',
    categoryLabel: 'Early Educator',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    rating: 5
  },
  {
    id: 'test-4',
    title: 'Building a Preschool with Purpose',
    quote: 'Kinderbee gave us the confidence and resources to turn our vision of a quality preschool into reality. The FinnishWay-inspired learning approach, professional support, and focus on child development make this partnership truly special.',
    author: 'Soman',
    role: 'Kinderbee Preschool Franchise Partner',
    category: 'franchise',
    categoryLabel: 'Franchise Partner',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    rating: 5
  },
  {
    id: 'test-5',
    title: 'Joyful Awakening Every Morning',
    quote: 'Sending Aarav to Kinderbee was the best decision we made. He went from being shy to eagerly waking up every morning excited for school! The teachers are extraordinarily attentive and loving.',
    author: 'Pooja & Rohit Sharma',
    role: 'Parents of Aarav (Nursery)',
    category: 'parent',
    categoryLabel: 'Preschool Parent',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    rating: 5
  },
  {
    id: 'test-6',
    title: 'Nordic Play-Based Method Really Works',
    quote: 'The Nordic play-based method really works! My daughter Ananya speaks with remarkable vocabulary and solves puzzles with genuine patience. The campus safety and CCTV transparency gives us total peace of mind.',
    author: 'Dr. Sneha Kulkarni',
    role: 'Mother of Ananya (LKG)',
    category: 'parent',
    categoryLabel: 'Preschool Parent',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    rating: 5
  },
  {
    id: 'test-7',
    title: 'Spotless Care & Total Peace of Mind',
    quote: 'The daycare facility is spotless and heartwarming. As working parents, knowing our child is eating healthy warm meals and doing creative art projects in the afternoon is invaluable.',
    author: 'Karthik & Meera Iyer',
    role: 'Parents of Vihaan (Daycare & UKG)',
    category: 'parent',
    categoryLabel: 'Daycare Parent',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    rating: 5
  }
];



const FranchiseLeadForm: React.FC = () => {
  const [f, setF] = useState({ name: '', phone: '', city: '' });
  const [agree, setAgree] = useState(false);
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [err, setErr] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!/^[+\d][\d\s-]{8,}$/.test(f.phone.trim())) { setErr('Please enter a valid phone number.'); return; }
    if (!agree) { setErr('Please agree to the terms and privacy policy.'); return; }
    setState('sending');
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'Preschool Franchise', fields: { name: f.name, phone: f.phone, city: f.city, message: `City: ${f.city}`, interest: 'Preschool Franchise' } }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed');
      trackLead('Preschool Franchise', 'Home franchise form');
      setState('done');
    } catch (x: any) { setErr(x.message || 'Network error. Please try again.'); setState('idle'); }
  };
  const input = 'w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm focus:border-[#E1007A] focus:outline-none focus:ring-2 focus:ring-pink-200';
  return (
    <section id="franchise-enquiry" className="max-w-5xl mx-auto px-4 sm:px-8">
      <div className="grid gap-8 rounded-3xl border border-pink-100 bg-[#FFF6F9] p-6 sm:p-10 md:grid-cols-2 md:items-center">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-[#1C1917]">Get the franchise details</h2>
          <p className="text-stone-600">Investment, space needs and support, explained by our partnership team. We call you back within one working day.</p>
          <ul className="space-y-1.5 text-sm font-medium text-stone-700">
            {['Zero royalty, keep 100% of fees', 'Full setup, training and ERP', 'No obligation'].map(x => (
              <li key={x} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#E1007A]" />{x}</li>
            ))}
          </ul>
        </div>
        {state === 'done' ? (
          <div role="status" className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
            <p className="mt-3 text-lg font-bold text-stone-900">Thank you, {f.name.split(' ')[0] || 'we'} will call you soon.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
            <input required aria-label="Your name" placeholder="Your name" className={input} value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
            <input required type="tel" inputMode="tel" aria-label="Phone number" placeholder="Phone / WhatsApp number" className={input} value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} />
            <input required aria-label="City" placeholder="City where you want to open" className={input} value={f.city} onChange={e => setF({ ...f, city: e.target.value })} />
            <label className="flex items-start gap-2 text-xs text-stone-600">
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-0.5" />
              <span>I agree to the terms and conditions and privacy policy.</span>
            </label>
            {err && <p role="alert" className="text-sm font-medium text-red-600">{err}</p>}
            <button disabled={state === 'sending'} className="w-full rounded-xl bg-[#E1007A] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#c90070] disabled:opacity-60 cursor-pointer">
              {state === 'sending' ? 'Sending...' : 'Send me the details'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export const HomePage: React.FC<HomePageProps> = ({ setCurrentTab, onOpenConsultation, faqs, settings }) => {
  const [activeFaq, setActiveFaq] = useState<string | null>('faq-1');
  const [testimonialFilter, setTestimonialFilter] = useState<'all' | 'franchise' | 'teacher' | 'parent'>('all');
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const testimonialScrollRef = useRef<HTMLDivElement>(null);
  const displayFaqs = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;

  return (
    <MotionConfig reducedMotion="user"><div className="space-y-16 sm:space-y-24 pb-12">
      <SEOHead
        title="AI-Powered Preschool Franchise in India | Zero Royalty, Free KinderOS CRM"
        description="Start an AI-powered preschool franchise in India with zero royalty. Nordic-inspired curriculum, AI-assisted lesson planning and KinderOS, the Kinder Operating System: a free CRM for admissions, fees, attendance and staff."
        keywords="AI-powered preschool franchise, AI preschool franchise India, KinderOS, Kinder Operating System, free preschool CRM, best preschool franchise in India with no royalty, preschool franchise with zero royalty, no royalty preschool franchise, preschool with no royalty fee, India's #1 preschool franchise, best preschool franchise India, best international preschool franchise, preschool franchise in India, play school franchise in India, preschool franchise cost in India, preschool franchise investment, preschool franchise opportunities, how to start a preschool in India"
        settings={settings}
        faq={FAQ_SCHEMA()}
      />

      {/* Franchise hero (moved from the Franchise page) */}
          <section className="relative overflow-hidden bg-[#FFF6F9] border-b border-pink-100/80 lg:min-h-[640px] flex items-center">
            {/* Background Image on Right with Seamless Fade - Full Building Clearly Visible */}
            <div className="hidden lg:block absolute top-0 right-0 bottom-0 lg:w-1/2 pointer-events-none overflow-hidden select-none">
              <img 
                src={settings?.franchiseHeroImage || "/franchise/preschool-hero.webp"}
                alt="Kinderbee Preschool campus with children playing outside"
                className="w-full h-full object-cover object-[50%_45%]"
                fetchPriority="high"
              />
              {/* Smooth gradient feather on the left edge only, keeping the entire building 100% visible */}
              <div className="absolute inset-y-0 left-0 w-16 sm:w-24 md:w-32 lg:w-44 bg-gradient-to-r from-[#FFF6F9] to-transparent pointer-events-none"></div>
            </div>

            {/* Soft decorative botanical leaves watermark at top-left corner */}
            <div className="absolute top-0 left-0 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-20 overflow-hidden">
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#E1007A]">
                <path d="M-20 -20 C40 10, 60 70, 40 120 C20 70, -10 40, -20 -20 Z" fill="currentColor" fillOpacity="0.45" />
                <path d="M-10 20 C50 30, 90 90, 70 150 C40 100, 10 70, -10 20 Z" fill="currentColor" fillOpacity="0.35" />
                <path d="M20 -10 C70 40, 110 80, 140 70 C100 100, 50 70, 20 -10 Z" fill="currentColor" fillOpacity="0.3" />
                <path d="M60 -15 C95 25, 125 55, 160 50 C130 75, 85 50, 60 -15 Z" fill="currentColor" fillOpacity="0.25" />
              </svg>
            </div>

            {/* Foreground Content */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 pt-5 pb-10 sm:pt-8 lg:py-16 relative z-10">
              {/* Desktop: text ends 2rem before the photo, which covers the right half (left edge 50vw) */}
              <div className="max-w-2xl lg:max-w-[min(35rem,calc(50vw-5rem))] space-y-5 sm:space-y-6">
                {/* Phone & tablet: the campus photo sits above the text instead of behind it */}
                <div className="lg:hidden overflow-hidden rounded-3xl border-4 border-white shadow-xl shadow-pink-900/10">
                  <img src={settings?.franchiseHeroImage || "/franchise/preschool-hero.webp"} alt="Kinderbee Preschool campus with children playing outside" className="w-full aspect-[4/3] sm:aspect-[16/10] object-cover object-[50%_40%]" fetchPriority="high" />
                </div>

                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 bg-pink-50/95 border border-pink-200/90 text-[#E1007A] text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#E1007A]" />
                  <span>AI-POWERED · ZERO ROYALTY PRESCHOOL FRANCHISE</span>
                </div>
                
                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] font-display font-extrabold tracking-tight text-[#1C1917] leading-[1.12]">
                  India’s <span className="text-[#E1007A]">AI-Powered Preschool Franchise</span> with Zero Royalty
                </h1>
                
                {/* Subtitle */}
                <p className="text-stone-600 text-sm sm:text-base md:text-[17px] leading-relaxed max-w-xl font-normal">
                  Kinderbee is the best preschool franchise in India with no royalty: own an international preschool franchise with a Finnish curriculum, lesson plans, teacher training and full setup support, and keep 100% of your fees.
                </p>
                
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-xl pt-1">
                  {/* Card 1: Royalty Fee */}
                  <div className="bg-white/95 backdrop-blur-xs rounded-2xl border border-pink-100/90 shadow-xs hover:shadow-sm p-3 sm:p-3.5 text-center flex flex-col items-center justify-center min-h-[96px] transition">
                    <div className="w-7 h-7 rounded-full bg-[#E1007A] text-white flex items-center justify-center font-bold text-xs shadow-2xs mb-2">
                      ₹0
                    </div>
                    <div className="text-xs text-stone-600 font-medium leading-tight">Royalty Fee</div>
                  </div>

                  {/* Card 2: Profit Retention */}
                  <div className="bg-white/95 backdrop-blur-xs rounded-2xl border border-pink-100/90 shadow-xs hover:shadow-sm p-3 sm:p-3.5 text-center flex flex-col items-center justify-center min-h-[96px] transition">
                    <TrendingUp className="w-5 h-5 text-[#E1007A] mb-1.5 stroke-[2.2]" />
                    <div className="font-extrabold text-stone-900 text-sm sm:text-base leading-tight">100%</div>
                    <div className="text-xs text-stone-600 font-medium leading-tight mt-0.5">Profit Retention</div>
                  </div>

                  {/* Card 3: Pedagogy */}
                  <div className="bg-white/95 backdrop-blur-xs rounded-2xl border border-pink-100/90 shadow-xs hover:shadow-sm p-3 sm:p-3.5 text-center flex flex-col items-center justify-center min-h-[96px] transition">
                    <GraduationCap className="w-5 h-5 text-[#E1007A] mb-1.5 stroke-[2.2]" />
                    <div className="font-extrabold text-stone-900 text-sm sm:text-base leading-tight">Finnish</div>
                    <div className="text-xs text-stone-600 font-medium leading-tight mt-0.5">Pedagogy</div>
                  </div>

                  {/* Card 4: Setup Support */}
                  <div className="bg-white/95 backdrop-blur-xs rounded-2xl border border-pink-100/90 shadow-xs hover:shadow-sm p-3 sm:p-3.5 text-center flex flex-col items-center justify-center min-h-[96px] transition">
                    <Headphones className="w-5 h-5 text-[#E1007A] mb-1.5 stroke-[2.2]" />
                    <div className="font-extrabold text-stone-900 text-sm sm:text-base leading-tight">Full</div>
                    <div className="text-xs text-stone-600 font-medium leading-tight mt-0.5">Setup Support</div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-3.5">
                  <button
                    onClick={() => onOpenConsultation('preschool')}
                    className="bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-6 sm:px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Book Free Consultation</span>
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                  <button type="button" onClick={() => openBrochureDownload('Franchise page')} className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 hover:border-stone-400 font-bold px-5 sm:px-6 py-3.5 rounded-xl shadow-xs transition text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Download Franchise PDF</span>
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>

                {/* Bottom Feature Pill Strip */}
                <div className="pt-2">
                  <div className="grid grid-cols-3 sm:inline-flex sm:flex-nowrap items-center bg-white/95 backdrop-blur-xs border border-pink-100/90 rounded-2xl p-2.5 sm:p-3 shadow-xs gap-1 sm:gap-4 max-w-xl w-full sm:w-auto">
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2.5 px-1 sm:px-2 text-center sm:text-left">
                      <ShieldCheck className="w-5 h-5 text-[#E1007A] shrink-0 stroke-[2.2]" />
                      <div className="sm:text-left">
                        <div className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">NEP 2020</div>
                        <div className="text-[11px] text-stone-500 font-medium">Aligned</div>
                      </div>
                    </div>

                    <div className="hidden sm:block w-px h-7 bg-stone-200"></div>

                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2.5 px-1 sm:px-2 text-center sm:text-left">
                      <BookOpen className="w-5 h-5 text-[#E1007A] shrink-0 stroke-[2.2]" />
                      <div className="sm:text-left">
                        <div className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">Child-Centric</div>
                        <div className="text-[11px] text-stone-500 font-medium">Education</div>
                      </div>
                    </div>

                    <div className="hidden sm:block w-px h-7 bg-stone-200"></div>

                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2.5 px-1 sm:px-2 text-center sm:text-left">
                      <Globe className="w-5 h-5 text-[#E1007A] shrink-0 stroke-[2.2]" />
                      <div className="sm:text-left">
                        <div className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">Global Standards</div>
                        <div className="text-[11px] text-stone-500 font-medium">Local Relevance</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>


      {/* Parents land here too: one line, straight to the school */}
      <p className="max-w-7xl mx-auto px-4 sm:px-8 text-center text-sm text-stone-600">
        Looking for admission at our Ramamurthy Nagar preschool, Bengaluru?{' '}
        <button type="button" onClick={() => setCurrentTab('about')} className="font-bold text-[#E1007A] underline decoration-pink-300 underline-offset-4 hover:decoration-[#E1007A] cursor-pointer">Visit the school page &rarr;</button>
      </p>


      <FranchiseShowcase />

      <KinderOsSection onOpenConsultation={() => onOpenConsultation('preschool')} />

      <Reveal>
      {/* =========================================================================
          SECTION 6: COMMUNITY & PARENT TESTIMONIALS (SMOOTH LEFT MOVEMENT)
          ========================================================================= */}
      <section className="bg-stone-900 text-white py-16 sm:py-24 overflow-hidden relative">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#E1007A]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FFD400]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFD400] bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-xs">
                <Star className="w-3.5 h-3.5 text-[#FFD400] fill-current" />
                <span>COMMUNITY VOICES &amp; TESTIMONIALS</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
                What Our Community Says About Kinderbee
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Real reflections from our Kinderbee preschool franchise partners, teacher-training educators, and parent community.
              </p>
            </div>

            {/* Controls: Category Filter + Pause/Scroll Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Pills */}
              <div className="inline-flex items-center bg-stone-800/90 p-1 rounded-2xl border border-stone-700/80">
                {[
                  { id: 'all', label: 'All Voices' },
                  { id: 'franchise', label: 'Franchise' },
                  { id: 'teacher', label: 'Teacher Training' },
                  { id: 'parent', label: 'Parents' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTestimonialFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      testimonialFilter === tab.id
                        ? 'bg-[#E1007A] text-white shadow-xs'
                        : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Pause / Play + Arrow Controls */}
              <div className="flex items-center gap-1.5 bg-stone-800/90 p-1 rounded-2xl border border-stone-700/80">
                <button
                  onClick={() => setIsMarqueePaused(!isMarqueePaused)}
                  className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-700/60 transition cursor-pointer text-xs flex items-center gap-1"
                  title={isMarqueePaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
                  aria-label={isMarqueePaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
                >
                  {isMarqueePaused ? (
                    <Play className="w-4 h-4 fill-current text-[#FFD400]" />
                  ) : (
                    <Pause className="w-4 h-4 text-stone-300" />
                  )}
                </button>
                <button
                  onClick={() => {
                    if (testimonialScrollRef.current) {
                      testimonialScrollRef.current.scrollBy({ left: -380, behavior: 'smooth' });
                    }
                  }}
                  className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-700/60 transition cursor-pointer"
                  title="Scroll Left"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (testimonialScrollRef.current) {
                      testimonialScrollRef.current.scrollBy({ left: 380, behavior: 'smooth' });
                    }
                  }}
                  className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-700/60 transition cursor-pointer"
                  title="Scroll Right"
                  aria-label="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Smooth Left Moving Testimonials Rail */}
        <div 
          ref={testimonialScrollRef}
          className="mt-10 overflow-x-auto no-scrollbar relative w-full group select-none"
          onMouseEnter={() => setIsMarqueePaused(true)}
          onMouseLeave={() => setIsMarqueePaused(false)}
          onTouchStart={() => setIsMarqueePaused(true)}
          onTouchEnd={() => setIsMarqueePaused(false)}
        >
          {/* Edge gradient masks for seamless aesthetic */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-stone-900 via-stone-900/80 to-transparent z-20"></div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-stone-900 via-stone-900/80 to-transparent z-20"></div>

          {/* Marquee Track: Dual repeated arrays for continuous infinite left loop */}
          <div 
            className={`flex gap-6 py-2 px-4 ${
              isMarqueePaused ? '' : 'animate-marquee-left'
            }`}
            style={{
              animationPlayState: isMarqueePaused ? 'paused' : 'running'
            }}
          >
            {[
              ...(testimonialFilter === 'all' 
                ? TESTIMONIALS 
                : TESTIMONIALS.filter(t => t.category === testimonialFilter)),
              ...(testimonialFilter === 'all' 
                ? TESTIMONIALS 
                : TESTIMONIALS.filter(t => t.category === testimonialFilter))
            ].map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="w-[340px] sm:w-[410px] md:w-[440px] shrink-0 bg-stone-800/90 border border-stone-700/80 hover:border-[#FFD400]/50 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-5 transition-all duration-300 shadow-xl backdrop-blur-md"
              >
                {/* Card Top: Stars + Category Pill */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex text-[#FFD400] gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                      {item.categoryLabel}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {item.title}
                  </h3>

                  {/* Quote text */}
                  <div className="relative">
                    <Quote className="w-6 h-6 text-stone-600 absolute -top-2 -left-1 opacity-20" />
                    <p className="text-stone-300 text-xs sm:text-sm leading-relaxed italic pl-1">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Author + Role */}
                <div className="border-t border-stone-700/70 pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E1007A] to-[#FFD400] flex items-center justify-center font-bold text-stone-900 text-sm shrink-0 shadow-sm">
                    {item.author.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white text-sm flex items-center gap-1.5 truncate">
                      <span>{item.author}</span>
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </div>
                    <div className="text-xs text-stone-400 truncate">
                      {item.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Helper Hint */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 flex items-center justify-between text-[11px] text-stone-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD400]" />
            <span>Hover or touch any card to pause reading • Continuous smooth left movement</span>
          </span>
          <span className="hidden sm:inline text-stone-400 font-medium">
            7 Verified Reflections
          </span>
        </div>
      </section>
      </Reveal>

      <FranchiseDetails onOpenConsultation={() => onOpenConsultation('preschool')} />

      <FranchiseLeadForm />


      <FranchiseBuyerGuide onOpenConsultation={() => onOpenConsultation('preschool')} settings={settings} />

          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <ConsultationOffer category="Preschool Partnership / Franchise" />
          </div>

      <Reveal>
      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 pt-6">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900">
              Frequently Asked Questions
            </h2>
            <p className="text-stone-600 text-sm">
              Answers to common queries about preschool admission, teacher training and partnership models.
            </p>
          </div>

          <div className="space-y-3">
            {displayFaqs.map((faq) => (
              <div 
                key={faq.id} 
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-stone-800 text-sm sm:text-base flex items-center justify-between gap-4 hover:bg-stone-50 transition cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-200 shrink-0 ${activeFaq === faq.id ? 'rotate-180 text-[#E1007A]' : ''}`} />
                </button>
                {activeFaq === faq.id && (
                  <div className="p-4 sm:p-5 pt-0 text-stone-600 text-xs sm:text-sm leading-relaxed border-t border-stone-100 bg-stone-50/50">
                    {renderFormattedAnswer(faq.answer)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      </Reveal>


      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 p-10 sm:p-14 text-center text-white shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">Ready to own a Kinderbee preschool?</h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">Talk to our partnership team. No obligation, and no royalty if you go ahead.</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={() => onOpenConsultation('preschool')} className="inline-flex items-center gap-2 rounded-full bg-[#E1007A] px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#c90070] cursor-pointer">Book Free Consultation <ArrowRight className="h-4 w-4" /></button>
            <button onClick={() => openBrochureDownload('Home closing CTA')} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/10 cursor-pointer">Download Franchise PDF</button>
          </div>
        </div>
      </section>


    </div></MotionConfig>
  );
};
