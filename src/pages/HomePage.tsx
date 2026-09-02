import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Award, TrendingUp, BookOpen, Users, Building, Play, Star, Download, ChevronDown, HelpCircle } from 'lucide-react';
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
    question: "1. What is KinderBee Integrated Partnership System (KIPS)?",
    answer: "KIPS is an **integrated education partnership system** offering **academic**, **operational**, **branding**, and **teacher training support** to schools and preschools.",
    section: "home"
  },
  {
    id: "faq-2",
    question: "2. What is the KinderBee preschool franchise?",
    answer: "The **KinderBee preschool franchise** provides **curriculum**, **teacher training**, **branding**, and **operational support** to help partners establish and manage a quality preschool.",
    section: "home"
  },
  {
    id: "faq-3",
    question: "3. How can I start a preschool with KinderBee?",
    answer: "You can start by **submitting an enquiry**. KinderBee provides guidance on **preschool setup**, **curriculum**, **training**, **infrastructure**, and **operations**.",
    section: "home"
  },
  {
    id: "faq-4",
    question: "4. Does KinderBee offer a preschool franchise in India?",
    answer: "Yes. KinderBee offers **preschool partnership opportunities in India** with **structured academic and operational support**.",
    section: "home"
  },
  {
    id: "faq-5",
    question: "5. What support does KinderBee provide?",
    answer: "KinderBee provides **curriculum support**, **teacher training**, **branding**, **marketing**, **academic planning**, and **operational guidance**.",
    section: "home"
  },
  {
    id: "faq-6",
    question: "6. What is the KinderBee curriculum?",
    answer: "The KinderBee curriculum focuses on **child-centred**, **activity-based**, and **holistic early childhood education**.",
    section: "home"
  },
  {
    id: "faq-7",
    question: "7. Is KinderBee aligned with NEP 2020?",
    answer: "Yes. KinderBee's approach follows key principles of **NEP 2020**, including **foundational learning**, **experiential learning**, and **holistic child development**.",
    section: "home"
  },
  {
    id: "faq-8",
    question: "8. What is FinnishWay Academy?",
    answer: "**FinnishWay Academy** provides **professional teacher training** and early childhood education programmes based on **modern educational practices**.",
    section: "home"
  },
  {
    id: "faq-9",
    question: "9. Who can become a KinderBee partner?",
    answer: "**Preschool owners**, **educators**, **education entrepreneurs**, **institutions**, and individuals interested in early childhood education can explore **KinderBee partnerships**.",
    section: "home"
  },
  {
    id: "faq-10",
    question: "10. Can existing schools partner with KinderBee?",
    answer: "Yes. Existing schools can partner with KinderBee for **academic development**, **teacher training**, **curriculum support**, **branding**, and **institutional growth**.",
    section: "home"
  },
  {
    id: "faq-11",
    question: "11. What makes KinderBee different?",
    answer: "KinderBee combines **preschool education**, **teacher training**, **curriculum development**, **branding**, and **operational support** into one **integrated education ecosystem**.",
    section: "home"
  },
  {
    id: "faq-12",
    question: "12. How can I become a KinderBee partner?",
    answer: "**Submit an enquiry** through the website to learn about **KinderBee partnership**, **preschool franchise opportunities**, **eligibility**, and the next steps.",
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

  return (
    <div className="space-y-10 pb-12">
      {/* Dynamic SEO Meta via React Helmet */}
      <SEOHead settings={settings} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-950 text-white pt-16 pb-20 px-4 sm:px-8 min-h-[70vh] flex items-center justify-center text-center">
        {/* Background Video with Brand Color Grading */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-70 scale-105"
            src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Video/banner%20Video.mp4"
          >
            Your browser does not support the video tag.
          </video>
          {/* Brand Tint Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/60 to-stone-950/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,0,122,0.18),transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,212,0,0.10),transparent_50%)]"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10 space-y-6 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 bg-stone-900/80 border border-[#E1007A]/40 text-pink-200 text-xs font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-lg backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#FFD400]" />
            <span>THE FUTURE OF EDUCATION STARTS HERE</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-serif-title font-normal tracking-tight leading-[1.15] text-white">
            Reimagine Education.<br />
            <span className="italic font-serif-title text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] via-pink-400 to-[#E1007A] font-medium">Transform Tomorrow.</span>
          </h1>

          <p className="text-stone-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed mx-auto">
            A future-ready education ecosystem empowering schools, educators and young minds through innovation, excellence and transformative learning.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenConsultation('franchise')}
              className="bg-gradient-to-r from-[#E1007A] to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-pink-900/30 hover:shadow-pink-900/50 hover:scale-[1.02] transition duration-300 text-base flex items-center gap-3 group cursor-pointer"
            >
              <span>Explore KIPS &rarr;</span>
            </button>

            <button
              onClick={() => onOpenConsultation('franchise')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl border border-white/25 hover:border-pink-300/60 transition duration-300 text-base flex items-center gap-2 backdrop-blur-md shadow-xl cursor-pointer"
            >
              <span>Talk to Our Experts</span>
            </button>
          </div>

        </div>
      </section>

      {/* KIPS Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-block text-[#E1007A] font-bold text-[10px] sm:text-xs uppercase tracking-widest bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-full shadow-sm">
              ZERO ROYALTY. GLOBAL STANDARDS. COMPLETE SUPPORT.
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-stone-900 leading-tight">
              Build the Future of Education with KIPS
            </h1>
            
            <h3 className="text-xl sm:text-2xl font-bold text-stone-700">
              Transform Schools. Empower Educators.
            </h3>
            
            <p className="text-base text-stone-600 leading-relaxed max-w-lg">
              The Kinderbee Integrated Partnership System (KIPS) empowers entrepreneurs and educational institutions to build, launch and grow future-ready schools with proven academic systems, expert support and innovative learning solutions.
            </p>
            
            <div className="py-2">
              <p className="text-sm font-bold text-stone-800 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <ShieldCheck className="w-4 h-4 text-[#E1007A]" />
                  <span>Zero-Royalty Partnership</span>
                </span>
                <span className="text-stone-300 hidden sm:inline">•</span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <Building className="w-4 h-4 text-[#E1007A]" />
                  <span>End-to-End School Support</span>
                </span>
                <span className="text-stone-300 hidden sm:inline">•</span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="w-4 h-4 text-[#FFD400]" />
                  <span>Finnish-Inspired Learning</span>
                </span>
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onOpenConsultation('franchise')}
                className="bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-pink-900/20 transition duration-300 text-sm flex items-center gap-2"
              >
                <span>Book a Free Consultation &rarr;</span>
              </button>
              
              <button
                onClick={() => setCurrentTab('partnerships')}
                className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 font-bold px-8 py-4 rounded-xl shadow-sm transition duration-300 text-sm flex items-center"
              >
                Explore KIPS
              </button>
            </div>
          </div>
          
          <div className="relative mt-8 lg:mt-0">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-stone-200 relative">
              <img 
                src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Home%20Page%20Images/Kinderbee.jpeg" 
                alt="Kinderbee Schools - Build the Future of Education with KIPS"
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent pointer-events-none"></div>
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -bottom-10 left-0 right-0 flex justify-center px-4">
              <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-4 sm:p-5 flex gap-4 sm:gap-8 divide-x divide-stone-100">
                <div className="pl-0 sm:pl-2 flex flex-col items-center justify-center space-y-1">
                  <div className="text-2xl sm:text-3xl font-display font-black text-[#E1007A]">0%</div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-stone-500 uppercase tracking-wider text-center max-w-[80px]">ROYALTY FEES</div>
                </div>
                <div className="pl-4 sm:pl-8 flex flex-col items-center justify-center space-y-1">
                  <div className="text-2xl sm:text-3xl font-display font-black text-amber-500">30+</div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-stone-500 uppercase tracking-wider text-center max-w-[80px]">YEARS OF LEGACY</div>
                </div>
                <div className="pl-4 sm:pl-8 flex flex-col items-center justify-center space-y-1 pr-0 sm:pr-2">
                  <div className="text-2xl sm:text-3xl font-display font-black text-emerald-600">100%</div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-stone-500 uppercase tracking-wider text-center max-w-[100px]">PARTNERSHIP SUPPORT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden flex flex-col relative">
          <div className="absolute top-0 right-0 bg-[#E1007A]/90 text-white text-xs font-bold px-4 py-2 rounded-bl-3xl z-10 backdrop-blur-sm shadow-md">
            100% PARTNERSHIP SUPPORT
          </div>
          
          <div className="w-full">
            <SmartImage 
              src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Home%20Page%20Images/Our%20Philosophy.jpeg" 
              altContext={{ page: 'home', section: 'Our Philosophy', type: 'banner' }}
              className="w-full h-[300px] sm:h-[450px] object-cover rounded-[30px] p-2.5 m-0"
            />
          </div>

          <div className="space-y-6 max-w-4xl mx-auto text-center p-8 sm:p-12 pt-10">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917]">
              Our Philosophy
            </h2>
            <div className="space-y-4 text-stone-600 text-base leading-relaxed text-left">
              <p>
                The <strong>Kinderbee Integrated Partnership System (KIPS)</strong> is a trusted <strong>school education</strong> and <strong>preschool development partner</strong>, dedicated to building high-quality, future-ready learning environments across India. With expertise in <strong>early childhood education</strong>, <strong>preschool management</strong>, <strong>curriculum development</strong>, and <strong>teacher training</strong>, we help educational entrepreneurs create successful and sustainable schools.
              </p>
              <p>
                Our <strong>NTT (Nursery Teacher Training) Program</strong> equips aspiring and working educators with practical skills, modern teaching methodologies, and child-centric approaches for effective early years education. From <strong>preschool teacher training</strong> and <strong>curriculum support</strong> to <strong>school development</strong> and <strong>academic guidance</strong>, Kinderbee provides an <strong>integrated ecosystem</strong> designed to empower educators and transform learning.
              </p>
            </div>
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setCurrentTab('fwa')}
                className="bg-[#E1007A] hover:bg-pink-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition text-sm flex items-center gap-2"
              >
                <span>Explore Our Programs &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* One Ecosystem Section */}
      <section className="bg-stone-50 py-20 px-4 sm:px-8 border-y border-stone-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917]">
              One Ecosystem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 01 - Preschool Franchise */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between">
              <div className="w-full h-56 border-b border-stone-100">
                <SmartImage 
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Kinderbeeschools%20(10).jpeg" 
                  altContext={{ page: 'home', section: 'One Ecosystem', type: 'preschool' }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-[#E1007A] font-bold text-xl">01 — Preschool Franchise</div>
                  <h3 className="text-xl font-display font-bold text-[#1C1917]">Start a Preschool Franchise in India</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Launch a <strong>zero-royalty preschool franchise</strong> with a <strong>NEP 2020-aligned</strong>, <strong>play-based curriculum</strong>, comprehensive <strong>school setup support</strong> and modern <strong>early childhood education</strong> solutions.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('partnerships')}
                  className="w-full bg-[#1C1917] hover:bg-stone-800 text-white font-medium py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <span>Explore Franchisee &rarr;</span>
                </button>
              </div>
            </div>

            {/* 02 - FinnishWay Academy */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between">
              <div className="w-full h-56 border-b border-stone-100">
                <SmartImage 
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Home%20Page%20Images/NTT%20Teacher%20Training.jpeg" 
                  altContext={{ page: 'home', section: 'One Ecosystem', type: 'fwa' }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-amber-500 font-bold text-xl">02 — FinnishWay Academy</div>
                  <h3 className="text-xl font-display font-bold text-[#1C1917]">NTT & Preschool Teacher Training</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Advance your career with professional <strong>NTT (Nursery Teacher Training)</strong>, <strong>ECCE</strong> and <strong>preschool teacher training programs</strong> designed around modern, child-centric and <strong>Finnish-inspired teaching methodologies</strong>.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('fwa')}
                  className="w-full bg-[#1C1917] hover:bg-stone-800 text-white font-medium py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <span>Explore NTT Teacher Training &rarr;</span>
                </button>
              </div>
            </div>

            {/* 03 - Investor Opportunities */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between">
              <div className="w-full h-56 border-b border-stone-100">
                <SmartImage 
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Home%20Page%20Images/Investor.jpeg" 
                  altContext={{ page: 'home', section: 'One Ecosystem', type: 'investor' }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-emerald-600 font-bold text-xl">03 — Investor Opportunities</div>
                  <h3 className="text-xl font-display font-bold text-[#1C1917]">Invest in Education</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Explore <strong>strategic investment opportunities</strong> in the <strong>education sector</strong> with <strong>Kinderbee</strong>. Partner with a <strong>growing education ecosystem</strong> offering scalable <strong>preschool, CBSE/IB school development</strong>, <strong>teacher training</strong>, and <strong>education business models</strong>, backed by structured systems and long-term support.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('investors')}
                  className="w-full bg-[#1C1917] hover:bg-stone-800 text-white font-medium py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <span>Explore Investment Opportunity &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to start your journey section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="bg-gradient-to-br from-pink-50 via-amber-50 to-purple-50 text-stone-900 p-10 sm:p-14 rounded-3xl shadow-xl border border-pink-200 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E1007A_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-block bg-pink-100 text-[#E1007A] font-bold text-xs uppercase px-3 py-1 rounded-full border border-pink-200">
                Start Your Journey
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-stone-900">Ready to start your journey.</h2>
              <p className="text-stone-700 text-sm leading-relaxed">
                Connect with Kinderbee, India’s trusted education and school development partner. Explore zero-royalty preschool franchise opportunities, CBSE school setup, NTT teacher training programs, preschool teacher training, and complete school education solutions designed for long-term growth and success.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onOpenConsultation('franchise')}
                  className="bg-[#E1007A] hover:bg-pink-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
                >
                  <span>Book a Free Consultation &rarr;</span>
                </button>

                <a
                  href="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Home%20Page%20Images/BROUCHRE/4_FSCD_Programme_Brochure_2026-27.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Kinderbee_NTT_Brochure.pdf"
                  className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-semibold px-7 py-3.5 rounded-xl transition text-sm flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#E1007A]" />
                  <span>NTT Brochure &rarr;</span>
                </a>
              </div>
            </div>
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <SmartImage 
                src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Kinderbeeschools.png" 
                altContext={{ page: 'home', section: 'Campus & Early Childhood Learning Hub', type: 'classroom' }}
                className="w-full max-w-sm object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-stone-50 py-20 px-4 sm:px-8 border-t border-stone-200 scroll-mt-24">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-[#E1007A] font-bold text-xs uppercase tracking-widest bg-pink-100/70 border border-pink-200 px-4 py-1.5 rounded-full shadow-xs">
              <HelpCircle className="w-3.5 h-3.5 text-[#E1007A]" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917]">
              Questions About <strong className="text-[#E1007A] font-extrabold">KinderBee Partnerships</strong>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto">
              Everything you need to know about <strong className="text-stone-900 font-bold">KinderBee</strong>, our <strong className="text-stone-900 font-bold">Integrated Partnership System (KIPS)</strong>, preschool franchise opportunities, curriculum, and teacher training.
            </p>
          </div>

          <div className="space-y-3.5">
            {displayFaqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 sm:p-6 font-display font-bold text-stone-900 flex justify-between items-center gap-4 hover:bg-stone-50/50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E1007A]"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg leading-snug text-[#1C1917]">{faq.question}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#E1007A] text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base text-stone-600 leading-relaxed border-t border-stone-100 pt-4 bg-stone-50/50 animate-fadeIn">
                      {renderFormattedAnswer(faq.answer)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Help Footer Strip */}
          <div className="mt-8 bg-gradient-to-r from-amber-50 via-pink-50/50 to-amber-50/40 rounded-2xl p-5 sm:p-6 border border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="font-bold text-[#1C1917] text-sm sm:text-base">Have more questions about our partnerships?</h4>
              <p className="text-stone-600 text-xs sm:text-sm mt-0.5">Our leadership and admissions team is ready to guide you step-by-step.</p>
            </div>
            <button
              onClick={() => onOpenConsultation && onOpenConsultation('franchise')}
              className="bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm hover:shadow transition text-xs sm:text-sm whitespace-nowrap cursor-pointer shrink-0"
            >
              Submit Enquiry &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
