import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Award, BookOpen, 
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


export const HomePage: React.FC<HomePageProps> = ({ setCurrentTab, onOpenConsultation, faqs, settings }) => {
  const [activeFaq, setActiveFaq] = useState<string | null>('faq-1');
  const [testimonialFilter, setTestimonialFilter] = useState<'all' | 'franchise' | 'teacher' | 'parent'>('all');
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const testimonialScrollRef = useRef<HTMLDivElement>(null);
  const displayFaqs = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;

  return (
    <MotionConfig reducedMotion="user"><div className="space-y-16 sm:space-y-24 pb-12">
      <SEOHead
        title="Kinderbee Preschool Franchise in India | Zero Royalty, Nordic-Inspired Playschool"
        description="Start a Kinderbee preschool franchise with zero royalty: NEP 2020 aligned, Nordic-inspired play-based curriculum, teacher training, branding, admissions support and a school ERP. Book a free consultation."
        keywords="KinderBee franchise, preschool franchise India, best preschool franchise in India, no royalty preschool franchise, low investment preschool franchise, play school franchise, Nordic preschool franchise"
        settings={settings}
      />

      {/* HERO */}
      <section aria-labelledby="hero-title" className="relative isolate flex min-h-[560px] items-center justify-center overflow-hidden bg-stone-950 py-16 text-white sm:min-h-[620px] lg:min-h-[680px]">
        {settings?.homeHeroImage ? (
          <img src={settings.homeHeroImage} alt="Kinderbee preschool franchise: children learning through play" fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-center kb-kenburns pointer-events-none" />
        ) : (
        <video autoPlay loop muted playsInline preload="metadata" aria-hidden="true"
          poster="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Home%20Page%20Images/Kinderbee.jpeg"
          className="absolute inset-0 h-full w-full object-cover object-center kb-kenburns pointer-events-none">
          <source src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Video/banner%20Video.mp4" type="video/mp4" />
        </video>
        )}

        {/* Layered scrim: deep at the edges for legibility, a soft brand glow behind the headline */}
        <div className="absolute inset-0 z-10 bg-stone-950/75 pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(60%_50%_at_50%_42%,rgba(225,0,122,0.22),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-[#FAF9F6]/10 to-transparent pointer-events-none" />

        <div className="relative z-20 mx-auto w-full max-w-4xl px-5 text-center sm:px-8">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full border border-[#FFD400]/40 bg-white/5 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#FFD400] backdrop-blur-md sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400] shadow-[0_0_10px_#FFD400]" />
            Preschool franchise · Zero royalty
          </motion.p>

          <motion.h1 id="hero-title" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="mt-7 font-serif-title text-[2.5rem] font-medium leading-[1.08] tracking-tight text-white [text-wrap:balance] sm:text-6xl lg:text-7xl">
            Kinderbee Preschool Franchise
            <span className="mt-3 block font-sans text-[0.3em] font-semibold uppercase tracking-[0.3em] text-[#FFD400] sm:text-[0.26em]">
              Pan-India · 360° partner support
            </span>
          </motion.h1>

          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            className="mx-auto mt-7 h-px w-24 bg-gradient-to-r from-transparent via-[#FFD400] to-transparent" />

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
            className="mt-6 font-serif-title text-2xl italic leading-snug text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] via-pink-300 to-[#ff4fa8] [text-wrap:balance] sm:text-4xl">
            Own a Nordic-inspired preschool. Keep 100% of your fees.
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-stone-200 [text-wrap:balance] sm:text-lg">
            Start a Kinderbee preschool with a NEP 2020 aligned, play-based curriculum, teacher training, branding, admissions support and a school management ERP, with no royalty on your tuition.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <button onClick={() => onOpenConsultation('preschool')}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E1007A] px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_32px_-8px_rgba(225,0,122,0.7)] transition hover:-translate-y-0.5 hover:bg-[#c90070] sm:w-auto sm:text-base cursor-pointer">
              Book Free Consultation <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
            <button onClick={() => { setCurrentTab('franchise'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex w-full items-center justify-center rounded-full border border-white/30 bg-white/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/15 sm:w-auto sm:text-base cursor-pointer">
              See Franchise Details
            </button>
          </motion.div>

          <motion.ul initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.8, ease: EASE }}
            className="mx-auto mt-12 grid max-w-3xl grid-cols-2 divide-white/15 rounded-2xl border border-white/15 bg-white/5 py-4 text-left backdrop-blur-md sm:grid-cols-4 sm:divide-x">
            {[
              { icon: Award, k: 'Zero royalty', v: 'Keep 100% of fees' },
              { icon: GraduationCap, k: 'Teacher training', v: 'Nordic-inspired method' },
              { icon: ShieldCheck, k: 'NEP 2020', v: 'Aligned curriculum' },
              { icon: Building, k: 'Full setup', v: 'Brand to ERP' },
            ].map(({ icon: Icon, k, v }) => (
              <li key={k} className="flex items-center gap-3 px-4 py-2">
                <Icon className="h-5 w-5 shrink-0 text-[#FFD400]" aria-hidden="true" />
                <span className="leading-tight"><span className="block text-sm font-bold text-white">{k}</span><span className="block text-xs text-stone-300">{v}</span></span>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      <FranchiseShowcase />

      <FranchiseDetails onOpenConsultation={() => onOpenConsultation('preschool')} />

      <Reveal>
      {/* =========================================================================
          SECTION 8: PRESCHOOL PARTNERSHIP (KIPS)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E1007A] bg-pink-50 border border-pink-200 px-4 py-1.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E1007A]" />
                <span>KIPS • ZERO ROYALTY MODEL</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
                Partner with Kinderbee
              </h2>

              <h3 className="text-xl font-bold text-stone-700">
                No Royalty Preschool Franchise in India with 360-Degree Support
              </h3>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Start a Kinderbee preschool franchise with zero royalty and keep 100% of your student tuition fees while benefiting from our complete academic syllabus, teacher enablement, campus architecture, and admission marketing engines.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>0% Recurring Royalty on Tuition</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Turnkey Setup &amp; Toy Kits</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Continuous Teacher Development</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Local Lead Generation Assistance</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    setCurrentTab('partnerships');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer text-sm"
                >
                  <span>FREE CRM</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => openConsultationBooking('Preschool Partnership / Franchise')}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold px-6 py-3.5 rounded-xl transition text-sm cursor-pointer"
                >
                  Book Franchise Consultation · ₹99
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 px-4 py-4">
              <div className="kb-stack kb-float rounded-2xl">
              <div className="kb-frame rounded-2xl overflow-hidden shadow-lg border border-stone-200">
                <img 
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Home%20Image/Partner/Partner%20With%20Kinderbee.jpeg" 
                  alt="Kinderbee no royalty preschool franchise in India" 
                  className="w-full aspect-video object-cover"
                />
              </div>
              </div>
            </div>
          </div>
        </div>
        <ConsultationOffer className="mt-6" />
      </section>
      </Reveal>

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

    </div></MotionConfig>
  );
};
