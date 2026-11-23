import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Award, BookOpen, 
  Users, Building, Star, Download, ChevronDown, HelpCircle, 
  GraduationCap, School, Camera, Heart, Sun, Smile, Clock, 
  MapPin, Phone, Mail, Send, Calendar, Check, Play, Pause, UserCheck,
  Quote, ChevronLeft, ChevronRight, Volume2, VolumeX, Video
} from 'lucide-react';
import { BlogPost, FAQItem, SystemSettings } from '../types';
import { SEOHead } from '../components/SEOHead';
import { SmartImage } from '../components/SmartImage';
import { motion, MotionConfig, useInView } from 'motion/react';
import { Reveal, EASE } from '../components/Motion';
import { openConsultationBooking, ConsultationOffer } from '../components/ConsultationBooking';
import { AiCurriculum } from '../components/AiCurriculum';
import { trackLead } from '../utils/analytics';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  onOpenConsultation: (type?: string) => void;
  blogs: BlogPost[];
  onSelectBlog: (blog: BlogPost) => void;
  settings?: SystemSettings | null;
}

const NTT_IMG = 'https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/Our%20Programs/';
const FWA_COURSES = [
  {
    title: 'Advanced Diploma in Early Childhood Care & Education',
    subtitle: 'Advanced Pedagogy & Practical Training',
    badge: 'Advanced Credential',
    image: `${NTT_IMG}Advanced%20Diploma%20in%20Early%20Childhood%20Care%20%26%20Education.png`,
    modules: ['Child Development & Psychology', 'Play-Based Teaching', 'Curriculum & Activity Planning', 'Practical Classroom Training', 'AI-Assisted Curriculum'],
    note: 'Eligible: Aspiring & Working Teachers',
  },
  {
    title: 'Diploma in Play school Teacher Training',
    subtitle: 'Play-Based Classroom Activity Planning',
    badge: 'Professional Diploma',
    image: `${NTT_IMG}Diploma%20in%20Play%20school%20Teacher%20Training.png`,
    modules: ['Child Development Basics', 'Play-Based Teaching Methods', 'Classroom Activity Planning', 'Practical Teaching Training', 'AI-Assisted Curriculum'],
    note: 'Eligible: Preschool Educators',
  },
  {
    title: 'Certificate in Nordic inspired Preschool Teaching',
    subtitle: 'Child-Centred Global Teaching Methods',
    badge: 'Specialized Certificate',
    image: `${NTT_IMG}Certificate%20in%20Nordic%20inspired%20Preschool%20Teaching.png`,
    modules: ['Nordic-Inspired Teaching Methods', 'Play-Based Learning', 'Child-Centred Education', 'Creative Classroom Activities', 'AI-Assisted Curriculum'],
    note: 'Global Standards Certification',
  },
  {
    title: 'Foundational Stage Curriculum Design',
    subtitle: 'NEP 2020 & NCF-FS Aligned Curriculum',
    badge: 'Curriculum Mastery',
    image: `${NTT_IMG}Foundational%20Stage%20Curriculum%20Design.png`,
    modules: ['NEP & NCF-FS Aligned', 'Play-Based Learning Design', 'Learning Outcomes & Activities', 'Child-Centred Curriculum Planning', 'AI-Assisted Curriculum'],
    note: 'NEP 2020 & NCF Compliant',
  },
];

export const SchoolContent: React.FC<HomePageProps> = ({
  setCurrentTab, 
  onOpenConsultation, 
  blogs, 
  onSelectBlog,
  settings 
}) => {

  // Card grids that stagger their children in (see .stagger in index.css)
  const programmesRef = useRef<HTMLDivElement>(null);
  const campusRef = useRef<HTMLDivElement>(null);
  const blogsRef = useRef<HTMLDivElement>(null);
  const programmesIn = useInView(programmesRef, { once: true, amount: 0.1 });
  const campusIn = useInView(campusRef, { once: true, amount: 0.2 });
  const blogsIn = useInView(blogsRef, { once: true, amount: 0.2 });
  const coursesRef = useRef<HTMLDivElement>(null);
  const coursesIn = useInView(coursesRef, { once: true, amount: 0.15 });

  // Contact Form State
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryType, setEnquiryType] = useState('Preschool Admission');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquiryPolicyAgreed, setEnquiryPolicyAgreed] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryPolicyAgreed) {
      alert('Please agree to the terms and cancellation/refund policy.');
      return;
    }
    setEnquiryLoading(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: enquiryType,
          fields: {
            name: enquiryName,
            phone: enquiryPhone,
            email: enquiryEmail,
            message: enquiryMessage,
            interest: enquiryType
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setEnquirySuccess(true);
        trackLead(enquiryType, 'Homepage enquiry');
        setEnquiryName('');
        setEnquiryPhone('');
        setEnquiryEmail('');
        setEnquiryMessage('');
      } else {
        alert(data.error || 'Failed to submit enquiry.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while submitting enquiry.');
    } finally {
      setEnquiryLoading(false);
    }
  };

  const scrollToPreschool = () => {
    const el = document.getElementById('preschool-programmes');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <MotionConfig reducedMotion="user"><div className="space-y-16 sm:space-y-24 pb-12">
      {/* =========================================================================
          SECTION 1: HERO BANNER (VIDEO BACKGROUND)
          ========================================================================= */}
      <section aria-labelledby="hero-title" className="relative isolate flex min-h-[560px] items-center justify-center overflow-hidden bg-stone-950 py-16 text-white sm:min-h-[620px] lg:min-h-[680px]">
        {settings?.homeHeroImage ? (
          <img src={settings.homeHeroImage} alt="Children learning through play at Kinderbee International Preschool, Ramamurthy Nagar, Bengaluru" fetchPriority="high"
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
            Admissions open · Playgroup to UKG
          </motion.p>

          <motion.h1 id="hero-title" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="mt-7 font-serif-title text-[2.5rem] font-medium leading-[1.08] tracking-tight text-white [text-wrap:balance] sm:text-6xl lg:text-7xl">
            Kinderbee International Preschool
            <span className="mt-3 block font-sans text-[0.3em] font-semibold uppercase tracking-[0.3em] text-[#FFD400] sm:text-[0.26em]">
              Ramamurthy Nagar · Bengaluru
            </span>
          </motion.h1>

          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            className="mx-auto mt-7 h-px w-24 bg-gradient-to-r from-transparent via-[#FFD400] to-transparent" />

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
            className="mt-6 font-serif-title text-2xl italic leading-snug text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] via-pink-300 to-[#ff4fa8] [text-wrap:balance] sm:text-4xl">
            Where Nordic-inspired play becomes learning
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-stone-200 [text-wrap:balance] sm:text-lg">
            Playgroup, Nursery, LKG, UKG and daycare, taught by trained teachers in safe, CCTV-monitored classrooms. A play-based curriculum that builds confidence, language and early numeracy.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <button onClick={() => { setCurrentTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E1007A] px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_32px_-8px_rgba(225,0,122,0.7)] transition hover:-translate-y-0.5 hover:bg-[#c90070] sm:w-auto sm:text-base cursor-pointer">
              Book a School Visit <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
            <button onClick={scrollToPreschool}
              className="inline-flex w-full items-center justify-center rounded-full border border-white/30 bg-white/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/15 sm:w-auto sm:text-base cursor-pointer">
              Explore Programs
            </button>
          </motion.div>

          <motion.ul initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.8, ease: EASE }}
            className="mx-auto mt-12 grid max-w-3xl grid-cols-2 divide-white/15 rounded-2xl border border-white/15 bg-white/5 py-4 text-left backdrop-blur-md sm:grid-cols-4 sm:divide-x">
            {[
              { icon: Smile, k: 'Ages 1.5 – 8', v: 'Playgroup to UKG' },
              { icon: GraduationCap, k: 'Trained teachers', v: 'Nordic-inspired method' },
              { icon: ShieldCheck, k: 'CCTV-safe', v: 'Monitored classrooms' },
              { icon: Clock, k: 'Daycare', v: 'For working parents' },
            ].map(({ icon: Icon, k, v }) => (
              <li key={k} className="flex items-center gap-3 px-4 py-2">
                <Icon className="h-5 w-5 shrink-0 text-[#FFD400]" aria-hidden="true" />
                <span className="leading-tight"><span className="block text-sm font-bold text-white">{k}</span><span className="block text-xs text-stone-300">{v}</span></span>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      <Reveal>
      {/* =========================================================================
          SECTION 2: PRESCHOOL PROGRAMMES (WITH IMAGE BOXES)
          ========================================================================= */}
      <section id="preschool-programmes" className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
        <div className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E1007A] bg-pink-50 border border-pink-200 px-4 py-1.5 rounded-full">
              <GraduationCap className="w-3.5 h-3.5 text-[#E1007A]" />
              <span>EARLY CHILDHOOD DEVELOPMENT PATHWAYS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight [text-wrap:balance]">
              Our Preschool <span className="font-serif-title italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#E1007A] to-[#FF8A00]">Programs</span> in Bengaluru
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              From playgroup admission to LKG and UKG, Kinderbee follows a Nordic-inspired curriculum and playful pedagogy that builds curiosity, confidence, literacy and numeracy.
            </p>
          </div>

          {/* 5 Distinct Cards with High-Resolution Image Boxes & Uniform Proportions */}
          <div ref={programmesRef} className={`stagger flex flex-wrap justify-center gap-6 ${programmesIn ? "is-in" : ""}`}>
            {/* 1. Playgroup */}
            <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm lg:max-w-none bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                {/* Image Box */}
                <div className="kb-frame relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-stone-100 border border-stone-100 shadow-2xs">
                  <img
                    src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Home%20Image/Our%20Preschool%20Programmes/Playgroup.png"
                    alt="Playgroup Smart Explorers at Kinderbee"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-[#FFD400] text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    Ages 1.5 – 2.5 Years
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-amber-700 flex items-center justify-center shadow-xs">
                    <Sun className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-stone-900 group-hover:text-[#E1007A] transition-colors">
                    Playgroup (Smart Explorers)
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    A gentle, joyful transition from home to school. Focuses on sensory play, gross motor coordination, emotional bonding, and rhythm circles.
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Sensory sandbox &amp; water play exploration</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Warm settling-in &amp; emotional comfort routines</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Musical rhymes, language sounds &amp; story time</span>
                  </div>
                </div>
              </div>
              <div className="pt-5">
                <button
                  onClick={() => onOpenConsultation('admission')}
                  className="w-full bg-stone-50 hover:bg-[#E1007A] hover:text-white text-stone-800 font-semibold py-2.5 rounded-xl text-xs transition border border-stone-200 hover:border-transparent flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Enquire for Playgroup</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2. Nursery */}
            <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm lg:max-w-none bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                {/* Image Box */}
                <div className="kb-frame relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-stone-100 border border-stone-100 shadow-2xs">
                  <img
                    src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Home%20Image/Our%20Preschool%20Programmes/Nursery.png"
                    alt="Nursery Curious Discoverers at Kinderbee"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-pink-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    Ages 2.5 – 3.5 Years
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-[#E1007A] flex items-center justify-center shadow-xs">
                    <Smile className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-stone-900 group-hover:text-[#E1007A] transition-colors">
                    Nursery (Curious Discoverers)
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    Expanding conversational language, phonetic awareness, tactile creativity, and independence in everyday self-care routines.
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Expressive art, finger painting &amp; clay modelling</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Early phonics, vocabulary expansion &amp; songs</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Collaborative peer play and sharing habits</span>
                  </div>
                </div>
              </div>
              <div className="pt-5">
                <button
                  onClick={() => onOpenConsultation('admission')}
                  className="w-full bg-stone-50 hover:bg-[#E1007A] hover:text-white text-stone-800 font-semibold py-2.5 rounded-xl text-xs transition border border-stone-200 hover:border-transparent flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Enquire for Nursery</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3. Junior KG (LKG) */}
            <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm lg:max-w-none bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                {/* Image Box */}
                <div className="kb-frame relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-stone-100 border border-stone-100 shadow-2xs">
                  <img
                    src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Home%20Image/Our%20Preschool%20Programmes/Junior%20Kg.png"
                    alt="Junior KG Young Thinkers at Kinderbee"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-blue-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    Ages 3.5 – 4.5 Years
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-blue-700 flex items-center justify-center shadow-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-stone-900 group-hover:text-[#E1007A] transition-colors">
                    Junior KG / LKG (Young Thinkers)
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    Building foundational reading, numerical understanding, logical sequencing, and structured social interactions.
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Systematic Jolly-phonics &amp; pre-writing readiness</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Hands-on numeracy, sorting, patterns &amp; counting</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Curiosity science questions &amp; nature observations</span>
                  </div>
                </div>
              </div>
              <div className="pt-5">
                <button
                  onClick={() => onOpenConsultation('admission')}
                  className="w-full bg-stone-50 hover:bg-[#E1007A] hover:text-white text-stone-800 font-semibold py-2.5 rounded-xl text-xs transition border border-stone-200 hover:border-transparent flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Enquire for Junior KG</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4. Senior KG (UKG) */}
            <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm lg:max-w-none bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                {/* Image Box */}
                <div className="kb-frame relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-stone-100 border border-stone-100 shadow-2xs">
                  <img
                    src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Home%20Image/Our%20Preschool%20Programmes/Senior%20Kg.png"
                    alt="Senior KG Future Achievers at Kinderbee"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    Ages 4.5 – 5.5 Years
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-emerald-700 flex items-center justify-center shadow-xs">
                    <School className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-stone-900 group-hover:text-[#E1007A] transition-colors">
                    Senior KG / UKG (Future Achievers)
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    Preparing confident, articulate young learners for Grade 1 entrance with comprehensive literacy, scientific inquiry, and problem-solving.
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Independent reading fluency &amp; sentence building</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Early addition/subtraction &amp; logical reasoning</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>NEP 2020 seamless primary school transition</span>
                  </div>
                </div>
              </div>
              <div className="pt-5">
                <button
                  onClick={() => onOpenConsultation('admission')}
                  className="w-full bg-stone-50 hover:bg-[#E1007A] hover:text-white text-stone-800 font-semibold py-2.5 rounded-xl text-xs transition border border-stone-200 hover:border-transparent flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Enquire for Senior KG</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 5. Daycare & Extended Care - Uniform Proportion & Clean Symmetry */}
            <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm lg:max-w-none bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                {/* Image Box */}
                <div className="kb-frame relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-stone-100 border border-stone-100 shadow-2xs">
                  <img
                    src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Home%20Image/Our%20Preschool%20Programmes/Day%20care%20%20.png"
                    alt="Daycare and Extended Care at Kinderbee"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-purple-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    Ages 1.5 – 8 Years
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-purple-700 flex items-center justify-center shadow-xs">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-stone-900 group-hover:text-[#E1007A] transition-colors">
                    Daycare &amp; Extended Care
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    A loving, secure home-away-from-home for working parents. Afternoon nap pods, nutritious meals, curated hobby stations, and care.
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Nutritious meals, dining &amp; CCTV nap pods</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Evening creative crafts &amp; hobby stations</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Trained early childhood loving caregivers</span>
                  </div>
                </div>
              </div>
              <div className="pt-5">
                <button
                  onClick={() => onOpenConsultation('daycare')}
                  className="w-full bg-stone-50 hover:bg-[#E1007A] hover:text-white text-stone-800 font-semibold py-2.5 rounded-xl text-xs transition border border-stone-200 hover:border-transparent flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Enquire for Daycare</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {/* =========================================================================
          SECTION 3: WHY PARENTS CHOOSE KINDERBEE
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-[#FFD400]/10 p-8 sm:p-12 lg:p-16 space-y-12">
            {/* Floating brand-colour glows */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#E1007A]/15 blur-3xl"
              animate={{ y: [0, 24, 0], x: [0, -16, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-[#FFD400]/20 blur-3xl"
              animate={{ y: [0, -20, 0], x: [0, 18, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
              className="relative flex flex-col md:flex-row md:items-end justify-between gap-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E1007A] bg-white/80 border border-pink-200 px-4 py-1.5 rounded-full shadow-xs">
                  <Award className="w-3.5 h-3.5 text-[#E1007A]" />
                  <span>THE KINDERBEE DIFFERENCE</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
                  Why Parents Choose <span className="text-[#E1007A]">Kinderbee</span>
                </h2>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                  Parents searching for the best preschool near me choose Kinderbee for its Nordic-inspired curriculum, trained teachers and warm, safe classrooms that feel like a second home.
                </p>
              </div>
              <button
                onClick={() => onOpenConsultation('campus')}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#E1007A] to-pink-600 hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-all duration-300 cursor-pointer self-start md:self-end"
              >
                <span>Schedule a Campus Walkthrough</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>

            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Sparkles,
                  title: 'Nordic-inspired Pedagogy',
                  text: 'Children explore through structured inquiry and hands-on discovery rather than passive rote memorization, building deep critical thinking.',
                  tile: 'from-[#E1007A] to-pink-500 text-white',
                },
                {
                  icon: ShieldCheck,
                  title: 'Uncompromising Safety',
                  text: 'Child-safe rounded wooden furniture, 24/7 CCTV streaming for parents, biometric campus security, and vetted certified staff.',
                  tile: 'from-[#FFD400] to-amber-400 text-stone-900',
                },
                {
                  icon: GraduationCap,
                  title: 'FWA-Trained Educators',
                  text: 'Every teacher undergoes intensive certification from FinnishWay Academy in child psychology, observational assessments, and positive guidance.',
                  tile: 'from-stone-900 to-stone-700 text-[#FFD400]',
                },
                {
                  icon: Users,
                  title: 'Active Parent Partnership',
                  text: 'Daily digital logs, developmental portfolios, weekend workshops, and open-door educator discussions ensure parents are genuine partners.',
                  tile: 'from-pink-500 to-[#FFD400] text-white',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-3 overflow-hidden transition-[box-shadow,border-color] duration-300 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-500/10"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
                >
                  {/* Brand accent bar that grows on hover */}
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#E1007A] to-[#FFD400] transition-transform duration-500 group-hover:scale-x-100" />
                  <span aria-hidden="true" className="absolute top-4 right-5 text-3xl font-display font-extrabold text-stone-100 transition-colors duration-300 group-hover:text-pink-100">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${item.tile} flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="relative text-lg font-display font-bold text-stone-900 transition-colors duration-300 group-hover:text-[#E1007A]">
                    {item.title}
                  </h3>
                  <p className="relative text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
      </section>

      <Reveal>
      {/* =========================================================================
          SECTION 7: TEACHER-TRAINING (FINNISH-WAY ACADEMY)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-br from-[#70162A] to-[#4a0d1b] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#FCECE5] text-[#70162A] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                <Award className="w-3.5 h-3.5 text-[#70162A]" />
                <span>FINNISH-WAY ACADEMY • TEACHER DEVELOPMENT</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
                Advanced Diploma in Early Childhood Care &amp; Education (NTT)
              </h2>

              <p className="text-stone-200 text-sm sm:text-base leading-relaxed max-w-2xl">
                Join the Kinderbee NTT course in Bengaluru: an early childhood care and education diploma with Nordic-inspired playful pedagogy. Master play-based teaching, child psychology, classroom leadership, and NEP 2020 frameworks.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center sm:items-end justify-center">
              <button
                onClick={() => {
                  setCurrentTab('fwa');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
              >
                <span>Explore Teacher Training</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Course cards (same details as the Teacher Training page) */}
          <div ref={coursesRef} className={`stagger relative z-10 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 ${coursesIn ? 'is-in' : ''}`}>
            {FWA_COURSES.map((course, i) => (
              <button
                key={course.title}
                type="button"
                onClick={() => {
                  setCurrentTab('fwa');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group text-left rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm p-3 flex flex-col transition-[background-color,border-color,box-shadow,translate] duration-500 hover:-translate-y-2 hover:bg-white/[0.11] hover:border-[#FFD400]/40 hover:shadow-2xl hover:shadow-black/40 cursor-pointer"
              >
                <div className="kb-frame relative aspect-[3/2] rounded-xl overflow-hidden bg-white/10">
                  <img src={course.image} alt={course.title} loading="lazy" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col px-1.5 pt-4 pb-1.5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-[#FFD400] text-stone-900 text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-full">
                      {course.badge}
                    </span>
                    <span className="font-display text-2xl font-extrabold text-white/20 leading-none transition-colors duration-300 group-hover:text-[#FFD400]/60">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base leading-snug text-white group-hover:text-[#FFD400] transition-colors duration-300">
                      {course.title}
                    </h3>
                    <p className="text-xs text-pink-200/80 mt-1">{course.subtitle}</p>
                  </div>

                  <ul className="space-y-1.5 flex-1">
                    {course.modules.map((m, j) => (
                      <li key={m} className="flex items-start gap-2 text-xs text-stone-200">
                        <span className="shrink-0 w-4 h-4 rounded-full bg-[#E1007A] text-white text-[9px] font-bold flex items-center justify-center mt-px transition-transform duration-300 group-hover:scale-110" style={{ transitionDelay: `${j * 50}ms` }}>
                          {j + 1}
                        </span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
                    <span className="text-[11px] font-semibold text-stone-300">{course.note}</span>
                    <ArrowRight className="w-4 h-4 text-[#FFD400] shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          <AiCurriculum tone="dark" className="relative z-10 mt-6" />
        </div>
      </section>
      </Reveal>

      <Reveal>
      {/* =========================================================================
          SECTION 4: OUR HOLISTIC LEARNING APPROACH
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E1007A] bg-pink-50 border border-pink-200 px-4 py-1.5 rounded-full">
              <Heart className="w-3.5 h-3.5 text-[#E1007A]" />
              <span>WHOLE-CHILD PEDAGOGY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
              Our Holistic Learning Approach
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Every day at Kinderbee, our Nordic-inspired curriculum preschool integrates cognitive, language, social-emotional and physical growth through balanced, playful exploration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-[#E1007A]/50 transition-colors shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E1007A] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-stone-900 text-base">Cognitive &amp; STEM</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pattern matching, block engineering, sensory science experiments, and mathematical reasoning.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-[#E1007A]/50 transition-colors shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-stone-900 text-base">Language &amp; Phonics</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Phonetic awareness, story immersion circles, multilingual vocabulary, and active listening skills.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-[#E1007A]/50 transition-colors shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Smile className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-stone-900 text-base">Social &amp; Emotional</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Self-regulation, empathy, conflict resolution, collaborative teamwork, and positive communication.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-[#E1007A]/50 transition-colors shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-stone-900 text-base">Physical Agility</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Fine motor precision (puzzles, scissors, threading) and gross motor agility (climbing, balance beams).
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-[#E1007A]/50 transition-colors shadow-xs space-y-3 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-stone-900 text-base">Creative Arts &amp; Music</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Sensory painting, dramatic puppet role-play, rhythmic instruments, and free imaginative expression.
              </p>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      <Reveal>
      {/* =========================================================================
          SECTION 5: CAMPUS & INSPIRING SPACES
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl">
          <div className="p-8 sm:p-12 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E1007A] bg-pink-50 border border-pink-200 px-4 py-1.5 rounded-full">
                  <School className="w-3.5 h-3.5 text-[#E1007A]" />
                  <span>CAMPUS &amp; LEARNING ARCHITECTURE</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
                  Safe, Inspiring &amp; Child-Centred Space
                </h2>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                  Conceived as the &ldquo;Third Teacher&rdquo;—every corner of the Kinderbee international preschool in Bengaluru promotes active discovery, unhurried focus, and uncompromised child safety.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onOpenConsultation('campus')}
                  className="bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-xl shadow-xs transition text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Book Campus Tour</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold px-5 py-3 rounded-xl transition text-xs sm:text-sm cursor-pointer"
                >
                  Explore Campus Gallery
                </button>
              </div>
            </div>

            {/* Photo Grid */}
            <div ref={campusRef} className={`stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[190px] gap-4 ${campusIn ? "is-in" : ""}`}>
              <div className="kb-frame relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:col-span-2 lg:row-span-2 bg-stone-100 group shadow-xs">
                <img
                  src="/images/campus/kinderbee-campus-bengaluru.jpg"
                  alt="Kinderbee international preschool campus in Ramamurthy Nagar, Bengaluru"
                  className="w-full h-full object-cover"
                />
                <div className="kb-caption absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <div className="text-xs font-bold">Kinderbee Campus, Bengaluru</div>
                    <div className="text-[11px] text-stone-300">Bright, safe &amp; child-centred</div>
                  </div>
                </div>
              </div>

              <div className="kb-frame relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:col-span-2 bg-stone-100 group shadow-xs">
                <img
                  src="/images/campus/kinderbee-number-worksheet-activity.jpg"
                  alt="Kinderbee preschoolers tracing numbers on activity worksheets"
                  className="w-full h-full object-cover"
                />
                <div className="kb-caption absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <div className="text-xs font-bold">Early Numeracy</div>
                    <div className="text-[11px] text-stone-300">Hands-on number activities</div>
                  </div>
                </div>
              </div>

              <div className="kb-frame relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto bg-stone-100 group shadow-xs">
                <img
                  src="/images/campus/kinderbee-classroom-learning.jpg"
                  alt="Kinderbee children learning together in a classroom"
                  className="w-full h-full object-cover"
                />
                <div className="kb-caption absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <div className="text-xs font-bold">Nordic Classrooms</div>
                    <div className="text-[11px] text-stone-300">Small groups &amp; ergonomic seating</div>
                  </div>
                </div>
              </div>

              <div className="kb-frame relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto bg-stone-100 group shadow-xs">
                <img
                  src="/images/campus/kinderbee-puppet-storytelling.jpg"
                  alt="Kinderbee teachers presenting a puppet storytelling show"
                  className="w-full h-full object-cover"
                />
                <div className="kb-caption absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <div className="text-xs font-bold">Storytelling &amp; Puppetry</div>
                    <div className="text-[11px] text-stone-300">Language through play</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      <Reveal>
      {/* =========================================================================
          SECTION 9: LATEST BLOGS / SCHOOL ACTIVITIES
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E1007A] bg-pink-50 border border-pink-200 px-3.5 py-1 rounded-full">
                <BookOpen className="w-3.5 h-3.5 text-[#E1007A]" />
                <span>DEVELOPMENTAL GUIDES &amp; NEWS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-stone-900 tracking-tight">
                Latest Articles &amp; School Activities
              </h2>
            </div>
            
            <button
              onClick={() => {
                setCurrentTab('blogs');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#E1007A] hover:text-pink-700 transition cursor-pointer"
            >
              <span>View All Articles &rarr;</span>
            </button>
          </div>

          <div ref={blogsRef} className={`stagger grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-8 ${blogsIn ? "is-in" : ""}`}>
            {blogs && blogs.slice(0, 2).map((blog) => (
              <div 
                key={blog.id} 
                onClick={() => onSelectBlog(blog)}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="kb-frame relative h-48 overflow-hidden bg-stone-100">
                    <img 
                      src={blog.image || (blog as any).imageUrl || "https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Home%20Page%20Images/Kinderbee.jpeg"} 
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-stone-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {blog.category || 'Preschool Education'}
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="text-xs text-stone-400 font-medium">{blog.date}</div>
                    <h3 className="text-lg font-display font-bold text-stone-900 group-hover:text-[#E1007A] transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {blog.excerpt || blog.content}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <span className="text-xs font-bold text-[#E1007A] inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    Read Full Article &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </Reveal>

      <Reveal>
      {/* =========================================================================
          SECTION 10: CONTACT / ENQUIRY SECTION
          ========================================================================= */}
      <section id="contact-enquiry" className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-stone-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFD400] bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD400]" />
                <span>GET IN TOUCH</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
                Send an Enquiry
              </h2>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Whether you are exploring preschool admission for your child, enrolling in teacher training, or planning a preschool partnership—we are here to assist you.
              </p>

              <div className="space-y-4 pt-4 border-t border-stone-800 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#E1007A] shrink-0 mt-0.5" />
                  <span className="text-stone-300">No. 1, Old UCO Bank Road, Rajarajeshwari Layout, Ramamurthy Nagar, Bengaluru – 560016</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#E1007A] shrink-0" />
                  <a href="tel:+919344906393" className="text-white hover:text-[#FFD400] font-bold text-base transition">93449 06393</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#E1007A] shrink-0" />
                  <a href="mailto:kinderbeeschools@gmail.com" className="text-stone-300 hover:text-white transition">kinderbeeschools@gmail.com</a>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7 bg-stone-950/80 p-6 sm:p-8 rounded-2xl border border-stone-800">
              {enquirySuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Thank You!</h3>
                  <p className="text-stone-300 text-sm max-w-md mx-auto">
                    Your enquiry has been received. Our advisory team will contact you shortly.
                  </p>
                  <button
                    onClick={() => setEnquirySuccess(false)}
                    className="mt-4 bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Your Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={enquiryName}
                        onChange={e => setEnquiryName(e.target.value)}
                        placeholder="e.g. Anjali Sharma"
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#E1007A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        value={enquiryPhone}
                        onChange={e => setEnquiryPhone(e.target.value)}
                        placeholder="e.g. 93449 06393"
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#E1007A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        value={enquiryEmail}
                        onChange={e => setEnquiryEmail(e.target.value)}
                        placeholder="e.g. anjali@example.com"
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#E1007A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Enquiry For *</label>
                      <select
                        value={enquiryType}
                        onChange={e => setEnquiryType(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E1007A]"
                      >
                        <option value="Preschool Admission">Preschool Admission (Playgroup - UKG)</option>
                        <option value="Daycare Enquiry">Daycare &amp; Extended Care</option>
                        <option value="Teacher Training (FWA)">Teacher Training (Advanced Diploma ECCE ₹4,999)</option>
                        <option value="Preschool Partnership (KIPS)">Preschool Partnership (Zero Royalty)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Message / Questions (Optional)</label>
                    <textarea
                      rows={3}
                      value={enquiryMessage}
                      onChange={e => setEnquiryMessage(e.target.value)}
                      placeholder="Tell us about child's age or your location..."
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#E1007A]"
                    ></textarea>
                  </div>

                  {/* Compulsory agreement checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2 text-xs text-stone-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={enquiryPolicyAgreed}
                        onChange={e => setEnquiryPolicyAgreed(e.target.checked)}
                        required
                        className="mt-0.5 w-4 h-4 rounded text-[#E1007A] focus:ring-[#E1007A] border-stone-700 accent-[#E1007A]"
                      />
                      <span>
                        I have reviewed the details and agree to the{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentTab('cancellation-refund');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-[#FFD400] underline font-semibold hover:text-yellow-300 inline cursor-pointer"
                        >
                          Cancellation and No-Refund Policy
                        </button>
                        ,{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentTab('terms-and-conditions');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-[#FFD400] underline font-semibold hover:text-yellow-300 inline cursor-pointer"
                        >
                          Terms and Conditions
                        </button>
                        , and{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentTab('privacy-policy');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-[#FFD400] underline font-semibold hover:text-yellow-300 inline cursor-pointer"
                        >
                          Privacy Policy
                        </button>
                        .
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={enquiryLoading || !enquiryPolicyAgreed}
                    className="w-full bg-[#E1007A] hover:bg-pink-600 text-white font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm shadow-md"
                  >
                    {enquiryLoading ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send an Enquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
      </Reveal>

    </div></MotionConfig>
  );
};
