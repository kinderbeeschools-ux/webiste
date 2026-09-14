import React, { useState } from 'react';
import { 
  ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Award, BookOpen, 
  Users, Building, Star, Download, ChevronDown, HelpCircle, 
  GraduationCap, School, Camera, Heart, Sun, Smile, Clock, 
  MapPin, Phone, Mail, Send, Calendar, Check, Play, UserCheck
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

export const HomePage: React.FC<HomePageProps> = ({ 
  setCurrentTab, 
  onOpenConsultation, 
  blogs, 
  faqs, 
  onSelectBlog,
  settings 
}) => {
  const [activeFaq, setActiveFaq] = useState<string | null>('faq-1');
  const displayFaqs = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;

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
          SECTION 1: HERO SECTION
          ========================================================================= */}
      <section className="relative overflow-hidden bg-stone-950 text-white pt-16 pb-24 sm:pb-32 px-4 sm:px-8 min-h-[75vh] flex items-center justify-center text-center">
        {/* Background Video & Warm Brand Color Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-60 scale-105"
            src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Video/banner%20Video.mp4"
          >
            Your browser does not support the video tag.
          </video>
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/60 to-stone-950/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,0,122,0.18),transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,212,0,0.12),transparent_50%)]"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10 space-y-6 sm:space-y-8 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 bg-stone-900/80 border border-[#E1007A]/40 text-pink-200 text-xs font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-lg backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#FFD400]" />
            <span>KINDERBEE INTERNATIONAL PRESCHOOL</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.12] text-white">
            Nurturing Joyful <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] via-pink-300 to-[#E1007A]">
              Learners for Life
            </span>
          </h1>

          <p className="text-stone-200 text-base sm:text-xl max-w-3xl font-normal leading-relaxed mx-auto">
            At Kinderbee International Preschool, children learn through play, exploration and meaningful everyday experiences in a warm, safe and child-centred environment.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={scrollToPreschool}
              className="bg-gradient-to-r from-[#E1007A] to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-pink-900/30 hover:shadow-pink-900/50 hover:scale-[1.02] transition duration-300 text-base flex items-center gap-3 group cursor-pointer"
            >
              <span>Explore Our Programmes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onOpenConsultation('admissions')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl border border-white/25 hover:border-pink-300/60 transition duration-300 text-base flex items-center gap-2 backdrop-blur-md shadow-xl cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#FFD400]" />
              <span>Book a School Visit</span>
            </button>
          </div>

          {/* Quick Pillars Pill */}
          <div className="pt-6 flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-stone-300 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Nordic Play-Based Framework
            </span>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              1:8 Teacher-Child Ratio
            </span>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              NEP 2020 Aligned
            </span>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: PRESCHOOL PROGRAMMES SECTION
          ========================================================================= */}
      <section id="preschool-programmes" className="max-w-7xl mx-auto px-4 sm:px-8 scroll-mt-24">
        <div className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E1007A] bg-pink-50 border border-pink-200 px-4 py-1.5 rounded-full">
              <School className="w-3.5 h-3.5 text-[#E1007A]" />
              <span>FOUNDATIONAL AGE-APPROPRIATE LEARNING</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
              Preschool Programmes
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Designed to nurture natural curiosity, emotional security, foundational literacy, numeracy and social skills through joyous, guided exploration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* 1. Playgroup */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative h-52 overflow-hidden bg-stone-100">
                  <img 
                    src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/About%20us/Gallery/kids%20(1).jpeg"
                    alt="Playgroup at Kinderbee"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Age 1.5 – 2.5 Years
                  </div>
                </div>
                <div className="p-6 sm:p-7 space-y-3">
                  <h3 className="text-2xl font-display font-bold text-stone-900">Playgroup</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    First step into social learning. Sensory discovery, music, gentle circle routines, and motor coordination in a secure environment.
                  </p>
                  <ul className="text-xs text-stone-600 space-y-1.5 pt-2 border-t border-stone-100">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Sensory play &amp; motor skill development</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Gentle social integration &amp; language rhythm</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-6 sm:p-7 pt-0">
                <button
                  onClick={() => onOpenConsultation('admissions')}
                  className="w-full bg-[#E1007A] hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Enquire About Admission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Nursery */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative h-52 overflow-hidden bg-stone-100">
                  <img 
                    src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/About%20us/Gallery/kids%20(2).jpeg"
                    alt="Nursery at Kinderbee"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-[#E1007A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Age 2.5 – 3.5 Years
                  </div>
                </div>
                <div className="p-6 sm:p-7 space-y-3">
                  <h3 className="text-2xl font-display font-bold text-stone-900">Nursery</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Expanding vocabulary, phonics curiosity, creative art expressions, storytelling, and early numeracy through tactile manipulatives.
                  </p>
                  <ul className="text-xs text-stone-600 space-y-1.5 pt-2 border-t border-stone-100">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Storytelling, phonemic awareness &amp; music</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Hands-on numeracy &amp; spatial puzzles</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-6 sm:p-7 pt-0">
                <button
                  onClick={() => onOpenConsultation('admissions')}
                  className="w-full bg-[#E1007A] hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Enquire About Admission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3. LKG (Kindergarten 1) */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative h-52 overflow-hidden bg-stone-100">
                  <img 
                    src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/About%20us/Gallery/kids%20(3).jpeg"
                    alt="LKG at Kinderbee"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Age 3.5 – 4.5 Years
                  </div>
                </div>
                <div className="p-6 sm:p-7 space-y-3">
                  <h3 className="text-2xl font-display font-bold text-stone-900">LKG (Kindergarten 1)</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Structured inquiry and problem solving. Blending phonics, writing strokes, mathematical reasoning, and scientific wonder.
                  </p>
                  <ul className="text-xs text-stone-600 space-y-1.5 pt-2 border-t border-stone-100">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Reading foundations, emergent writing &amp; math</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Collaborative project-based learning</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-6 sm:p-7 pt-0">
                <button
                  onClick={() => onOpenConsultation('admissions')}
                  className="w-full bg-[#E1007A] hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Enquire About Admission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4. UKG (Kindergarten 2) */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative h-52 overflow-hidden bg-stone-100">
                  <img 
                    src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/About%20us/Gallery/kids%20(4).jpeg"
                    alt="UKG at Kinderbee"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Age 4.5 – 5.5 Years
                  </div>
                </div>
                <div className="p-6 sm:p-7 space-y-3">
                  <h3 className="text-2xl font-display font-bold text-stone-900">UKG (Kindergarten 2)</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Primary school readiness. Fluent reading, conversational English, critical thinking, environmental science and logical math.
                  </p>
                  <ul className="text-xs text-stone-600 space-y-1.5 pt-2 border-t border-stone-100">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Full primary school transition preparation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Confidence, public presentation &amp; STEM experiments</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-6 sm:p-7 pt-0">
                <button
                  onClick={() => onOpenConsultation('admissions')}
                  className="w-full bg-[#E1007A] hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Enquire About Admission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 5. Daycare & Extended Care */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group md:col-span-2 lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-52 md:h-full overflow-hidden bg-stone-100">
                  <img 
                    src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Kinderbeeschools%20(10).jpeg"
                    alt="Daycare & Extended Care"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-[#70162A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Age 1.5 – 8 Years
                  </div>
                </div>
                <div className="p-6 sm:p-7 space-y-3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-stone-900">Daycare &amp; Extended Care</h3>
                    <p className="text-stone-600 text-sm leading-relaxed mt-1">
                      A home away from home with nutritious meal support, structured rest routines, afternoon play circles, and homework assistance.
                    </p>
                    <ul className="text-xs text-stone-600 space-y-1.5 pt-3 border-t border-stone-100 mt-3">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Extended hours (8:30 AM to 6:30 PM) with CCTV access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Warm caretakers &amp; hygienic sleep / activity spaces</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={() => onOpenConsultation('admissions')}
                      className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Enquire About Daycare</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: WHY PARENTS CHOOSE KINDERBEE
          ========================================================================= */}
      <section className="bg-stone-50 py-16 sm:py-20 px-4 sm:px-8 border-y border-stone-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E1007A] bg-pink-100/60 border border-pink-200 px-4 py-1.5 rounded-full">
              <Heart className="w-3.5 h-3.5 text-[#E1007A]" />
              <span>THE KINDERBEE ADVANTAGE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
              Why Parents Choose Kinderbee
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              We combine world-renowned Nordic educational principles with deep cultural roots to give every child a confident, joyful head start.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-xs hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#E1007A] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-stone-900">Play-Based Experiential Learning</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Children learn best by doing. Our curriculum replaces rote drills with open-ended play, sensory stations, science experiments, and creative arts.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-xs hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-stone-900">Warm &amp; Nurturing Educators</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Certified through Finnish-way Academy in early childhood psychology, positive discipline, and individualized care for every learner.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-xs hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-stone-900">Safe, Joyful &amp; Child-Friendly Campus</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                CCTV-monitored, sanitized facilities designed with rounded wooden furniture, non-toxic materials, and age-appropriate sensory outdoor grounds.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-xs hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-stone-900">Strong Foundation for Primary School</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Graduates transition smoothly into CBSE, ICSE, and IB World Schools with strong phonics, math confidence, and social maturity.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-xs hover:shadow-md transition space-y-4 md:col-span-2 lg:col-span-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-stone-900">NEP 2020 &amp; NCF-FS Aligned</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Strictly structured around the National Education Policy (NEP 2020) and the National Curriculum Framework for Foundational Stage (NCF-FS) to guarantee national standards and modern pedagogical excellence.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: LEARNING APPROACH
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-br from-amber-50/70 via-pink-50/50 to-white rounded-3xl border border-amber-200/80 p-8 sm:p-14 shadow-sm space-y-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100/80 px-4 py-1.5 rounded-full">
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>PEDAGOGICAL PHILOSOPHY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
              Our Holistic Learning Approach
            </h2>
            <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
              We empower children to become curious thinkers, resilient problem-solvers, and empathetic friends through three guiding pillars:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
              <div className="text-3xl font-display font-black text-[#E1007A]">01</div>
              <h3 className="text-xl font-bold text-stone-900">Play-Based Learning</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Hands-on tactile activities where play is the engine of discovery, sparking intrinsic motivation and joyful focus.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
              <div className="text-3xl font-display font-black text-amber-500">02</div>
              <h3 className="text-xl font-bold text-stone-900">Active Inquiry</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Children ask questions, test ideas, build with blocks, and discover scientific concepts through guided observation.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
              <div className="text-3xl font-display font-black text-emerald-600">03</div>
              <h3 className="text-xl font-bold text-stone-900">Creative Exploration</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Music, roleplay drama, clay modeling, and storytelling nurture rich self-expression and emotional intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: SCHOOL ENVIRONMENT / CAMPUS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full">
              <Building className="w-3.5 h-3.5 text-emerald-600" />
              <span>SAFE &amp; INSPIRING SPACES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
              Our Campus &amp; School Environment
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Every corner of a Kinderbee preschool is purposefully designed to encourage movement, collaborative play, tactile investigation, and total safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs space-y-4">
              <div className="h-44 bg-stone-100 overflow-hidden">
                <img 
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/About%20us/Gallery/kids%20(5).jpeg" 
                  alt="Child-Safe Infrastructure" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 pt-0 space-y-2">
                <h3 className="font-bold text-stone-900 text-base">Child-Safe Infrastructure</h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  Child-height fixtures, finger-pinch guards on doors, rounded edge tables, and non-slip safety floors.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs space-y-4">
              <div className="h-44 bg-stone-100 overflow-hidden">
                <img 
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/About%20us/Gallery/kids%20(6).jpeg" 
                  alt="Natural Wooden Toys" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 pt-0 space-y-2">
                <h3 className="font-bold text-stone-900 text-base">Natural Wooden Materials</h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  Open-ended sustainable wooden blocks, puzzles, and sensory items that invite imaginative problem-solving.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs space-y-4">
              <div className="h-44 bg-stone-100 overflow-hidden">
                <img 
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/About%20us/Gallery/kids%20(7).jpeg" 
                  alt="Outdoor Play Area" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 pt-0 space-y-2">
                <h3 className="font-bold text-stone-900 text-base">Outdoor &amp; Sensory Zones</h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  Sand pit, water play, herb planters, and mini obstacle courses to build robust physical motor confidence.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs space-y-4">
              <div className="h-44 bg-stone-100 overflow-hidden">
                <img 
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/About%20us/Gallery/kids%20(8).jpeg" 
                  alt="Sanitized & CCTV-Monitored" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 pt-0 space-y-2">
                <h3 className="font-bold text-stone-900 text-base">Sanitized &amp; CCTV Campus</h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  Daily deep sanitation, temperature checks, secure perimeter access, and 24/7 CCTV safety surveillance.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: PARENT TESTIMONIALS
          ========================================================================= */}
      <section className="bg-stone-900 text-white py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFD400] bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-xs">
              <Star className="w-3.5 h-3.5 text-[#FFD400]" />
              <span>TESTIMONIALS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              What Parents Say About Kinderbee
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Hear from our family community about the care, communication, and joyful transformation they experience every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-stone-800/90 border border-stone-700/80 p-8 rounded-3xl space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-[#FFD400] gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-stone-200 text-sm sm:text-base leading-relaxed italic">
                  &ldquo;Sending Aarav to Kinderbee was the best decision we made. He went from being shy to eagerly waking up every morning excited for school! The teachers are extraordinarily attentive and loving.&rdquo;
                </p>
              </div>
              <div className="border-t border-stone-700 pt-4">
                <div className="font-bold text-white text-sm">Pooja &amp; Rohit Sharma</div>
                <div className="text-xs text-stone-400">Parents of Aarav (Nursery)</div>
              </div>
            </div>

            <div className="bg-stone-800/90 border border-stone-700/80 p-8 rounded-3xl space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-[#FFD400] gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-stone-200 text-sm sm:text-base leading-relaxed italic">
                  &ldquo;The Nordic play-based method really works! My daughter Ananya speaks with remarkable vocabulary and solves puzzles with genuine patience. The campus safety and CCTV transparency gives us total peace of mind.&rdquo;
                </p>
              </div>
              <div className="border-t border-stone-700 pt-4">
                <div className="font-bold text-white text-sm">Dr. Sneha Kulkarni</div>
                <div className="text-xs text-stone-400">Mother of Ananya (LKG)</div>
              </div>
            </div>

            <div className="bg-stone-800/90 border border-stone-700/80 p-8 rounded-3xl space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-[#FFD400] gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-stone-200 text-sm sm:text-base leading-relaxed italic">
                  &ldquo;The daycare facility is spotless and heartwarming. As working parents, knowing our child is eating healthy warm meals and doing creative art projects in the afternoon is invaluable.&rdquo;
                </p>
              </div>
              <div className="border-t border-stone-700 pt-4">
                <div className="font-bold text-white text-sm">Karthik &amp; Meera Iyer</div>
                <div className="text-xs text-stone-400">Parents of Vihaan (Daycare &amp; UKG)</div>
              </div>
            </div>

          </div>
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
                Advanced Diploma in Early Childhood Care &amp; Education (ECCE)
              </h2>

              <p className="text-stone-200 text-sm sm:text-base leading-relaxed max-w-2xl">
                Elevate your career with globally accredited, Nordic-inspired teacher training. Master play-based pedagogy, child psychology, classroom leadership, and NEP 2020 frameworks.
              </p>

              {/* Course Highlights Pill Box */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-xs text-stone-300 font-semibold uppercase">Duration</div>
                  <div className="text-lg sm:text-xl font-bold text-[#FFD400]">3 Months</div>
                </div>
                <div className="border-l border-white/15">
                  <div className="text-xs text-stone-300 font-semibold uppercase">Course Hours</div>
                  <div className="text-lg sm:text-xl font-bold text-white">120 Hours</div>
                </div>
                <div className="border-l border-white/15">
                  <div className="text-xs text-stone-300 font-semibold uppercase">Special Fee</div>
                  <div className="text-lg sm:text-xl font-bold text-emerald-400">₹4,999 Only</div>
                  <div className="text-[10px] text-pink-300 line-through">₹49,999 (90% Off)</div>
                </div>
                <div className="border-l border-white/15">
                  <div className="text-xs text-stone-300 font-semibold uppercase">Offer Valid Until</div>
                  <div className="text-sm sm:text-base font-bold text-[#FFD400]">5 October 2026</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center sm:items-end justify-center space-y-4">
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

              <button
                onClick={() => onOpenConsultation('fwa_course')}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 transition text-xs sm:text-sm cursor-pointer"
              >
                Enrol for ₹4,999 Special Batch
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
                      src={blog.imageUrl || "https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Home%20Page%20Images/Kinderbee.jpeg"} 
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
