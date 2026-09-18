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

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  onOpenConsultation: (type?: string) => void;
  blogs: BlogPost[];
  faqs: FAQItem[];
  onSelectBlog: (blog: BlogPost) => void;
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
    quote: 'Partnering with KinderBee has been an incredible journey. The structured curriculum, continuous guidance, and strong operational support have helped us build a nurturing preschool. We are proud to be part of a brand that truly values children’s holistic development.',
    author: 'Siraj (Kanpur)',
    role: 'KinderBee Preschool Franchise Partner',
    category: 'franchise',
    categoryLabel: 'Franchise Partner',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    rating: 5
  },
  {
    id: 'test-2',
    title: 'A Transformative Learning Experience',
    quote: 'The KinderBee Teacher Training Programme completely changed my approach to teaching. I learned how to create engaging classroom experiences, understand children’s needs, and make learning more joyful through play-based methods.',
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
    quote: 'KinderBee gave us the confidence and resources to turn our vision of a quality preschool into reality. The FinnishWay-inspired learning approach, professional support, and focus on child development make this partnership truly special.',
    author: 'Soman',
    role: 'KinderBee Preschool Franchise Partner',
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

export const HomePage: React.FC<HomePageProps> = ({ 
  setCurrentTab, 
  onOpenConsultation, 
  blogs, 
  faqs, 
  onSelectBlog,
  settings 
}) => {
  const [activeFaq, setActiveFaq] = useState<string | null>('faq-1');
  const [testimonialFilter, setTestimonialFilter] = useState<'all' | 'franchise' | 'teacher' | 'parent'>('all');
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const testimonialScrollRef = useRef<HTMLDivElement>(null);
  const displayFaqs = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;

  // Hero Video Background State
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  const toggleVideoPlay = () => {
    if (heroVideoRef.current) {
      if (isVideoPlaying) {
        heroVideoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        heroVideoRef.current.play().catch(() => {});
        setIsVideoPlaying(true);
      }
    }
  };

  const toggleVideoMute = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = !isVideoMuted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

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
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* Dynamic SEO Meta via React Helmet */}
      <SEOHead 
        title="Kinderbee International Preschool | Nurturing Joyful Learners for Life"
        description="At Kinderbee International Preschool, children learn through play, exploration and meaningful everyday experiences in a warm, safe and child-centred environment."
        settings={settings} 
      />

      {/* =========================================================================
          SECTION 1: HERO BANNER (VIDEO BACKGROUND)
          ========================================================================= */}
      <section className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-stone-950 text-white pt-14 pb-16 sm:pb-24 border-b border-stone-800">
        {/* Background Video with AutoPlay, Loop, Muted, PlaysInline */}
        <video
          ref={heroVideoRef}
          autoPlay
          loop
          muted={isVideoMuted}
          playsInline
          poster="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Home%20Page%20Images/Kinderbee.jpeg"
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.02] transition-opacity duration-700 pointer-events-none"
        >
          <source src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Video/banner%20Video.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Translucent Dark Overlay for High Contrast Legibility */}
        <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-black/40 to-stone-950/70 z-10 pointer-events-none" />

        {/* Video Interactive Control Pill (Play/Pause, Sound Toggle) */}
        <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs text-white shadow-lg">
          <button
            onClick={toggleVideoPlay}
            className="hover:text-[#FFD400] transition flex items-center gap-1 cursor-pointer font-medium"
            title={isVideoPlaying ? "Pause Video" : "Play Video"}
          >
            {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{isVideoPlaying ? "Pause" : "Play"}</span>
          </button>
          <span className="text-white/30">•</span>
          <button
            onClick={toggleVideoMute}
            className="hover:text-[#FFD400] transition flex items-center gap-1 cursor-pointer font-medium"
            title={isVideoMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{isVideoMuted ? "Sound On" : "Mute"}</span>
          </button>
        </div>

        {/* Foreground Content: Centered to match exact design in screenshot */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 relative z-20 w-full text-center space-y-6 sm:space-y-8 my-auto">
          {/* Top Pill Badge: THE FUTURE OF EDUCATION STARTS HERE */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#FFD400] bg-black/60 px-5 py-2 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
              <Sparkles className="w-4 h-4 text-[#FFD400]" />
              <span>THE FUTURE OF EDUCATION STARTS HERE</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-serif-title font-medium tracking-tight text-white leading-[1.12] drop-shadow-md">
              Reimagine Education.
              <span className="block font-serif-title italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] via-pink-400 to-[#E1007A] pt-1">
                Transform Tomorrow.
              </span>
            </h1>
            <p className="text-stone-200 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto pt-2 drop-shadow-sm">
              A future-ready education ecosystem empowering schools, educators and young minds through innovation, excellence and transformative learning.
            </p>
          </div>

          {/* Call-to-Action: Explore KIPS → */}
          <div className="flex justify-center pt-2">
            <button
              onClick={scrollToPreschool}
              className="bg-[#E1007A] hover:bg-pink-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-xl shadow-pink-900/40 hover:scale-105 transition-all duration-300 flex items-center gap-2 text-base cursor-pointer"
            >
              <span>Explore KIPS</span>
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      </section>

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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
              Our Preschool Programmes
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Age-aligned developmental stages thoughtfully designed to ignite innate curiosity, nurture emotional confidence, and cultivate foundational literacy and numeracy.
            </p>
          </div>

          {/* 5 Distinct Cards with High-Resolution Image Boxes & Uniform Proportions */}
          <div className="flex flex-wrap justify-center gap-6">
            {/* 1. Playgroup */}
            <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm lg:max-w-none bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                {/* Image Box */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-stone-100 group/img border border-stone-100 shadow-2xs">
                  <img
                    src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Kinderbeeschools%20(4).jpeg"
                    alt="Playgroup Toddler Explorers at Kinderbee"
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
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
                    Playgroup (Toddler Explorers)
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
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-stone-100 group/img border border-stone-100 shadow-2xs">
                  <img
                    src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Gallery%20Images/Kids%20%20(1).jpeg"
                    alt="Nursery Curious Discoverers at Kinderbee"
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
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
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-stone-100 group/img border border-stone-100 shadow-2xs">
                  <img
                    src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Kinderbeeschools%20(10).jpeg"
                    alt="Junior KG Young Thinkers at Kinderbee"
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
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
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-stone-100 group/img border border-stone-100 shadow-2xs">
                  <img
                    src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Gallery%20Images/Kids%20%20(3).jpeg"
                    alt="Senior KG Future Achievers at Kinderbee"
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
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
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-stone-100 group/img border border-stone-100 shadow-2xs">
                  <img
                    src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Kinderbeeschools%20(13).jpeg"
                    alt="Daycare and Extended Care at Kinderbee"
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
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

      {/* =========================================================================
          SECTION 3: WHY PARENTS CHOOSE KINDERBEE
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 sm:p-12 lg:p-16 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E1007A] bg-pink-50 border border-pink-200 px-4 py-1.5 rounded-full">
                <Award className="w-3.5 h-3.5 text-[#E1007A]" />
                <span>THE KINDERBEE DIFFERENCE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
                Why Parents Choose Kinderbee
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                We combine global early learning benchmarks with authentic care, creating a joyful second home where every child thrives naturally.
              </p>
            </div>
            <button
              onClick={() => onOpenConsultation('campus')}
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition cursor-pointer self-start md:self-end"
            >
              <span>Schedule a Campus Walkthrough</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#E1007A] flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-stone-900">
                Nordic Play Pedagogy
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Children explore through structured inquiry and hands-on discovery rather than passive rote memorization, building deep critical thinking.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-stone-900">
                Uncompromising Safety
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Child-safe rounded wooden furniture, 24/7 CCTV streaming for parents, biometric campus security, and vetted certified staff.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-stone-900">
                FWA-Trained Educators
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Every teacher undergoes intensive certification from FinnishWay Academy in child psychology, observational assessments, and positive guidance.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-stone-900">
                Active Parent Partnership
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Daily digital logs, developmental portfolios, weekend workshops, and open-door educator discussions ensure parents are genuine partners.
              </p>
            </div>
          </div>
        </div>
      </section>

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
              Every day at Kinderbee integrates cognitive, language, social-emotional, and physical growth through balanced, playful exploration.
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
                  Safe, Inspiring &amp; Child-Centred Spaces
                </h2>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                  Conceived as the &ldquo;Third Teacher&rdquo;—every corner of a Kinderbee campus promotes active discovery, unhurried focus, and uncompromised child safety.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 group shadow-xs">
                <img
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Kinderbeeschools%20(1).jpeg"
                  alt="Modern Child-Centred Campus"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <div className="text-xs font-bold">Nordic Classrooms</div>
                    <div className="text-[11px] text-stone-300">Natural wood &amp; ergonomic seating</div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 group shadow-xs">
                <img
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Gallery%20Images/Kids%20%20(1).jpeg"
                  alt="Expressive Art & Sensory Zone"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <div className="text-xs font-bold">Sensory &amp; Art Studio</div>
                    <div className="text-[11px] text-stone-300">Tactile colors &amp; clay creation</div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 group shadow-xs">
                <img
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Gallery%20Images/Kids%20%20(2).jpeg"
                  alt="Curiosity Discovery Labs"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <div className="text-xs font-bold">Discovery Labs</div>
                    <div className="text-[11px] text-stone-300">STEM puzzles &amp; natural inquiry</div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 group shadow-xs">
                <img
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Gallery%20Images/Kids%20%20(3).jpeg"
                  alt="Reading Nook & Montessori Corner"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <div className="text-xs font-bold">Reading Nook</div>
                    <div className="text-[11px] text-stone-300">Storybook magic &amp; cozy cushions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                What Our Community Says About KinderBee
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Real reflections from our preschool franchise partners, teacher-training educators, and parent community.
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
                Elevate your career with globally accredited, Nordic-inspired teacher training. Master play-based pedagogy, child psychology, classroom leadership, and NEP 2020 frameworks.
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
        </div>
      </section>

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
                Partner With Kinderbee
              </h2>

              <h3 className="text-xl font-bold text-stone-700">
                Zero-Royalty Preschool Partnership with 360-Degree Institutional Support
              </h3>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Empowering edupreneurs and school owners to establish world-class preschools. Retain 100% of your student tuition fees while benefiting from our complete academic syllabus, teacher enablement, campus architecture, and admission marketing engines.
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
                  <span>Learn About Partnership</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenConsultation('franchise')}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold px-6 py-3.5 rounded-xl transition text-sm cursor-pointer"
                >
                  Book Franchise Consultation
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-200">
                <img 
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Preschool/Preschool.jpeg" 
                  alt="Kinderbee Preschool Franchise" 
                  className="w-full aspect-video object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs && blogs.slice(0, 3).map((blog) => (
              <div 
                key={blog.id} 
                onClick={() => onSelectBlog(blog)}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    <img 
                      src={blog.image || (blog as any).imageUrl || "https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Home%20Page%20Images/Kinderbee.jpeg"} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                  <span className="text-stone-300">No. 1, Old UCO Bank Road, Opp. Vijay Bakery, Rajarajeshwari Layout, Ramamurthy Nagar, Bengaluru – 560016</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#E1007A] shrink-0" />
                  <a href="tel:8122344040" className="text-white hover:text-[#FFD400] font-bold text-base transition">81223 44040</a>
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
                        placeholder="e.g. 81223 44040"
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

    </div>
  );
};
