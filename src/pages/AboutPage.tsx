import React, { useRef, useState } from 'react';
import { Sparkles, CheckCircle2, Award, Users, Globe, Target, Store, GraduationCap, School, ArrowRight, Volume2, VolumeX, Play, Pause, Quote, HeartHandshake } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SmartImage } from '../components/SmartImage';
import { SystemSettings } from '../types';

interface AboutPageProps {
  onOpenConsultation?: (type?: string) => void;
  settings?: SystemSettings | null;
  setCurrentTab?: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenConsultation, settings, setCurrentTab }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleNavigate = (tab: string) => {
    if (setCurrentTab) {
      setCurrentTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onOpenConsultation) {
      onOpenConsultation(tab);
    }
  };
  return (
    <div className="space-y-20 pb-20">
      {/* Dynamic SEO Meta via React Helmet */}
      <SEOHead 
        title="About Us & Finnish Educational Heritage"
        description="Learn how Kinderbee and FinnishWay Academy are transforming Indian preschool education through zero-royalty partnership models, faculty training, and active play curricula."
        keywords="about kinderbee, finnish education heritage, zero royalty preschool founders, NEP 2020 compliance"
        settings={settings}
      />
      
      
      {/* Story & Philosophy */}
      <section id="story" className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 lg:pt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="text-[#E1007A] font-bold text-xs uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block">
            OUR JOURNEY & CORE MISSION
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917]">
            Nurturing Young Minds. Shaping Bright Futures.
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Kinderbee Preschool is committed to delivering <strong className="text-stone-900 font-bold">high-quality early childhood education</strong> through <strong className="text-stone-900 font-bold">play-based learning</strong>, <strong className="text-stone-900 font-bold">innovative teaching practices</strong>, and a <strong className="text-stone-900 font-bold">child-centric approach</strong>. We empower <strong className="text-stone-900 font-bold">children</strong>, <strong className="text-stone-900 font-bold">educators</strong>, and <strong className="text-stone-900 font-bold">preschool entrepreneurs</strong> to build a strong foundation for lifelong learning.
          </p>
          <p className="text-stone-600 text-base leading-relaxed">
            With a commitment to early childhood education, Kinderbee Preschool creates <strong className="text-stone-900 font-bold">nurturing, engaging and future-ready learning environments</strong> where children can learn, explore and grow. Our approach combines <strong className="text-stone-900 font-bold">play-based learning</strong>, <strong className="text-stone-900 font-bold">child-centric teaching</strong>, <strong className="text-stone-900 font-bold">Finnish-inspired education</strong> and <strong className="text-stone-900 font-bold">NEP 2020-aligned practices</strong> to give every child a strong foundation for <strong className="text-stone-900 font-bold">lifelong learning</strong>.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <div className="text-2xl font-display font-black text-[#E1007A]">0%</div>
              <div className="text-xs text-stone-600 font-semibold uppercase tracking-wider">ROYALTY FEES</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <div className="text-2xl font-display font-black text-amber-500">30+</div>
              <div className="text-xs text-stone-600 font-semibold uppercase tracking-wider">YEARS OF LEGACY</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-br from-[#E1007A] to-amber-500 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-xl bg-white">
            <img
              src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/About%20us/About%20Us.jpeg"
              alt="Kinderbee About Us - Early Childhood Education & Teacher Training"
              className="w-full h-auto object-cover block"
            />
          </div>
        </div>
      </section>

      {/* What Makes Kinderbee Different */}
      <section className="bg-stone-50 py-20 px-4 sm:px-8 border-y border-stone-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-display font-extrabold text-[#1C1917]">
              What Makes Kinderbee Preschool Different?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-stone-900 mb-1">Play-Based Learning</h4>
                <p className="text-stone-600 text-sm">Engaging activities that develop <strong className="text-stone-800 font-semibold">creativity, curiosity and confidence</strong>.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-stone-900 mb-1">Finnish-Inspired Curriculum</h4>
                <p className="text-stone-600 text-sm"><strong className="text-stone-800 font-semibold">Modern early learning practices</strong> focused on <strong className="text-stone-800 font-semibold">holistic child development</strong>.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-stone-900 mb-1">Expert Teacher Training</h4>
                <p className="text-stone-600 text-sm"><strong className="text-stone-800 font-semibold">Professional preschool teacher training</strong> and <strong className="text-stone-800 font-semibold">NTT programs</strong> that empower educators with effective teaching methodologies.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-stone-900 mb-1">Holistic Development</h4>
                <p className="text-stone-600 text-sm">Supporting children's <strong className="text-stone-800 font-semibold">cognitive, social, emotional, physical and language development</strong>.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center items-center gap-4 sm:gap-8 font-bold text-stone-700 text-sm">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> <strong className="text-stone-900 font-bold">NEP 2020 Aligned</strong></span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> <strong className="text-stone-900 font-bold">Finnish-Inspired Learning</strong></span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> <strong className="text-stone-900 font-bold">Child-Centric Education</strong></span>
          </div>
        </div>
      </section>

      {/* 3 Core Services Section (Franchise, NTT Training, CBSE / IB School Setup) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="text-center mb-10">
          <div className="text-[#E1007A] font-bold text-xs uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block mb-3">
            Our Core Pathways
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917]">
            Empowering <strong className="text-[#E1007A] font-extrabold">Early Education</strong> at Every Level
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto mt-2">
            Whether you want to launch a preschool, become a certified educator, or build an international school, we guide your journey.
          </p>
        </div>

        {/* 3 Services Cards Grid */}
        <div className="relative rounded-3xl bg-[#FAF7F2] p-4 sm:p-6 lg:p-8 border border-stone-200/80 shadow-md">
          {/* Decorative Buzzing Bee with Dotted Flight Trail (Top-Right) */}
          <div className="hidden sm:flex items-center absolute -top-4 sm:-top-6 right-4 sm:right-10 pointer-events-none z-20">
            <svg className="w-28 h-16 text-stone-400" viewBox="0 0 120 70" fill="none">
              <path
                d="M 5 55 C 30 70, 45 20, 75 40 C 95 55, 105 15, 115 25"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeDasharray="4 4"
              />
            </svg>
            <div className="relative -ml-3 -mt-6">
              <svg className="w-10 h-10 drop-shadow-sm" viewBox="0 0 64 64" fill="none">
                {/* Wings */}
                <ellipse cx="28" cy="18" rx="10" ry="14" fill="#E0F2FE" fillOpacity="0.8" stroke="#0284C7" strokeWidth="1.5" transform="rotate(-25 28 18)" />
                <ellipse cx="38" cy="18" rx="10" ry="14" fill="#E0F2FE" fillOpacity="0.8" stroke="#0284C7" strokeWidth="1.5" transform="rotate(25 38 18)" />
                {/* Bee Body */}
                <ellipse cx="33" cy="38" rx="15" ry="19" fill="#FBBF24" stroke="#1C1917" strokeWidth="2" />
                {/* Body Stripes */}
                <path d="M 21 34 Q 33 37 45 34" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" />
                <path d="M 20 42 Q 33 45 46 42" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" />
                {/* Face & Antennae */}
                <circle cx="28" cy="27" r="2" fill="#1C1917" />
                <circle cx="38" cy="27" r="2" fill="#1C1917" />
                <path d="M 29 20 Q 25 10 21 12" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 37 20 Q 41 10 45 12" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="21" cy="12" r="1.5" fill="#1C1917" />
                <circle cx="45" cy="12" r="1.5" fill="#1C1917" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Service Card 1: FRANCHISE */}
            <div 
              onClick={() => handleNavigate('partnerships-preschool')}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1.5"
            >
              {/* Top Organic Wave Banner (Gold/Yellow) */}
              <div className="relative h-28 sm:h-32 bg-[#F1AF23] overflow-hidden flex items-end">
                <svg 
                  className="w-full h-12 text-white fill-current" 
                  viewBox="0 0 400 60" 
                  preserveAspectRatio="none"
                >
                  <path d="M0,35 C100,55 180,10 280,35 C340,50 380,25 400,30 L400,60 L0,60 Z" />
                </svg>
              </div>

              {/* Floating Center Badge */}
              <div className="-mt-11 sm:-mt-12 flex justify-center relative z-10">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-white shadow-md border-[3px] border-[#FFF8E7] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#FEF6E4] flex items-center justify-center">
                    <Store className="w-8 h-8 text-[#E29D12]" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col text-center justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="font-display font-extrabold text-lg sm:text-xl tracking-wider text-[#E29D12] uppercase">
                    FRANCHISE
                  </h3>
                  <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                    Partner with us to bring <strong className="text-stone-900 font-bold">world-class preschool education</strong> to your community.
                  </p>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold tracking-wider text-[#E29D12] group-hover:text-amber-700 transition-colors uppercase">
                    <span>EXPLORE FRANCHISE</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                  </span>
                </div>
              </div>
            </div>

            {/* Service Card 2: NTT TEACHER TRAINING */}
            <div 
              onClick={() => handleNavigate('fwa')}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1.5"
            >
              {/* Top Organic Wave Banner (Green) */}
              <div className="relative h-28 sm:h-32 bg-[#3E7445] overflow-hidden flex items-end">
                <svg 
                  className="w-full h-12 text-white fill-current" 
                  viewBox="0 0 400 60" 
                  preserveAspectRatio="none"
                >
                  <path d="M0,25 C80,5 200,55 300,20 C350,5 380,25 400,25 L400,60 L0,60 Z" />
                </svg>
              </div>

              {/* Floating Center Badge */}
              <div className="-mt-11 sm:-mt-12 flex justify-center relative z-10">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-white shadow-md border-[3px] border-[#EBF5ED] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#EBF5ED] flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-[#3E7445]" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col text-center justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="font-display font-extrabold text-lg sm:text-xl tracking-wider text-[#3E7445] uppercase">
                    NTT TEACHER TRAINING
                  </h3>
                  <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                    <strong className="text-stone-900 font-bold">Professional NTT programs</strong> to empower and shape <strong className="text-stone-900 font-bold">inspiring early educators</strong>.
                  </p>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold tracking-wider text-[#3E7445] group-hover:text-emerald-800 transition-colors uppercase">
                    <span>EXPLORE TRAINING</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                  </span>
                </div>
              </div>
            </div>

            {/* Service Card 3: CBSE / IB SCHOOL SETUP */}
            <div 
              onClick={() => handleNavigate('partnerships-cbse')}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1.5 relative"
            >
              {/* Top Organic Wave Banner (Deep Navy Blue) */}
              <div className="relative h-28 sm:h-32 bg-[#1C3A68] overflow-hidden flex items-end">
                <svg 
                  className="w-full h-12 text-white fill-current" 
                  viewBox="0 0 400 60" 
                  preserveAspectRatio="none"
                >
                  <path d="M0,35 C120,60 220,10 320,30 C360,40 380,25 400,30 L400,60 L0,60 Z" />
                </svg>
              </div>

              {/* Floating Center Badge */}
              <div className="-mt-11 sm:-mt-12 flex justify-center relative z-10">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-white shadow-md border-[3px] border-[#EAF0F9] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#EAF0F9] flex items-center justify-center">
                    <School className="w-8 h-8 text-[#1C3A68]" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col text-center justify-between space-y-4 relative">
                <div className="space-y-3">
                  <h3 className="font-display font-extrabold text-lg sm:text-xl tracking-wider text-[#1C3A68] uppercase">
                    CBSE / IB SCHOOL SETUP
                  </h3>
                  <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                    <strong className="text-stone-900 font-bold">End-to-end assistance</strong> in establishing <strong className="text-stone-900 font-bold">future-ready schools</strong> with <strong className="text-stone-900 font-bold">global standards</strong>.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold tracking-wider text-[#1C3A68] group-hover:text-blue-900 transition-colors uppercase mx-auto">
                    <span>EXPLORE SETUP</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                  </span>
                </div>

                {/* Botanical Leaves Accent Motif (Bottom Right) */}
                <div className="absolute bottom-2 right-2 opacity-30 pointer-events-none">
                  <svg className="w-10 h-10 text-[#1C3A68]" viewBox="0 0 48 48" fill="currentColor">
                    <path d="M24 44 C24 30 14 18 4 16 C12 24 16 34 16 44 Z" />
                    <path d="M24 44 C28 32 38 24 44 22 C38 28 32 36 28 44 Z" opacity="0.8" />
                    <path d="M24 44 L24 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <circle cx="24" cy="8" r="3" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Video & Vision Section (9:16 Ratio with Autoplay & Unmute Sound Controls) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
        <div className="bg-gradient-to-br from-stone-900 via-[#1C1917] to-stone-950 rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden border border-stone-800">
          {/* Subtle decorative glow accents */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E1007A]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content (7 columns on lg) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-[#FFD400] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD400]" />
                <span>FOUNDER'S VISION & PURPOSE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-display font-extrabold tracking-tight leading-[1.18] text-white">
                Nurturing Potential. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] via-amber-200 to-pink-300">
                  Inspiring a Lifetime of Learning.
                </span>
              </h2>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                At <strong className="text-white font-bold">Kinderbee Preschool</strong>, we believe early childhood is the <strong className="text-[#FFD400] font-bold">most transformative developmental window</strong> in a human life. True education is not about rote drills or rigid classrooms—it is about creating an environment of <strong className="text-white font-bold">emotional safety, creative discovery, and joyful play</strong>.
              </p>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                In close collaboration with <strong className="text-white font-bold">Finnishway Academy</strong> and fully aligned with the <strong className="text-white font-bold">NEP 2020 & NCF-FS frameworks</strong>, our mission empowers not only young children, but also the <strong className="text-[#FFD400] font-bold">aspiring educators and visionary preschool entrepreneurs</strong> who build the schools of tomorrow.
              </p>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#E1007A]/20 flex items-center justify-center text-[#FFD400] mb-2 font-bold">
                    01
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">Child-Led Play</h4>
                  <p className="text-[11px] text-stone-300 mt-1 leading-snug">Cultivating <strong className="text-white font-semibold">creativity and self-confidence</strong> naturally.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#3E7445]/30 flex items-center justify-center text-emerald-300 mb-2 font-bold">
                    02
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">Educator Growth</h4>
                  <p className="text-[11px] text-stone-300 mt-1 leading-snug"><strong className="text-white font-semibold">Comprehensive NTT certification</strong> & practical mastery.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 mb-2 font-bold">
                    03
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">Global Standards</h4>
                  <p className="text-[11px] text-stone-300 mt-1 leading-snug">World-renowned <strong className="text-white font-semibold">Nordic early learning philosophy</strong>.</p>
                </div>
              </div>

              {/* Founder Quote Card */}
              <div className="bg-gradient-to-r from-white/10 to-white/5 border-l-4 border-[#FFD400] rounded-r-2xl p-4 sm:p-5 relative">
                <Quote className="w-8 h-8 text-[#FFD400]/30 absolute top-3 right-3 pointer-events-none" />
                <p className="text-stone-200 text-xs sm:text-sm italic leading-relaxed">
                  "When we protect a child's natural love for curiosity, we do not merely prepare them for primary school—we prepare them to thrive in an ever-changing world."
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E1007A] text-white flex items-center justify-center text-xs font-bold">
                    KB
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Founder & Managing Director</div>
                    <div className="text-[11px] text-[#FFD400] font-medium">Kinderbee Group of Schools</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onOpenConsultation && onOpenConsultation('franchise')}
                  className="bg-gradient-to-r from-[#E1007A] to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-pink-900/40 hover:scale-[1.02] transition duration-300 text-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Connect With Leadership</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleNavigate('fwa')}
                  className="bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-3 rounded-xl border border-white/20 transition duration-300 text-sm flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-[#FFD400]" />
                  <span>Explore NTT Programs</span>
                </button>
              </div>
            </div>

            {/* Right Column: 9:16 Ratio Video Reel (5 columns on lg) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {/* Smartphone / 9:16 Mockup Frame */}
              <div className="relative w-full max-w-[280px] sm:max-w-[310px] aspect-[9/16] rounded-[32px] overflow-hidden border-[6px] border-stone-800/90 shadow-2xl bg-black group">
                
                {/* Autoplaying 9:16 Video */}
                <video
                  ref={videoRef}
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/About%20us/Founder%20Video/Founder.mp4"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover block cursor-pointer"
                  onClick={togglePlay}
                />

                {/* Top Badge: Founder's Address */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-20">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Founder's Address
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-[#FFD400] text-[10px] font-bold px-2 py-1 rounded-full border border-white/20">
                    9:16 HD
                  </span>
                </div>

                {/* Primary Tap to Unmute / Mute Floating Overlay Pill */}
                <button
                  onClick={toggleMute}
                  className={`absolute top-14 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full text-xs font-bold shadow-xl transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    isMuted
                      ? 'bg-[#E1007A] text-white animate-bounce shadow-pink-900/50 hover:bg-pink-600'
                      : 'bg-black/70 backdrop-blur-md text-white border border-white/25 hover:bg-black/80'
                  }`}
                  title={isMuted ? "Click to unmute sound" : "Click to mute"}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-white animate-pulse" />
                      <span>Tap to Unmute Sound 🔊</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-[#FFD400]" />
                      <span>Sound On (Click to Mute)</span>
                    </>
                  )}
                </button>

                {/* Bottom Video Controls Bar */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between z-20">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition cursor-pointer"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <div className="text-[11px] text-white/90 font-medium truncate max-w-[140px]">
                    Kinderbee Leadership
                  </div>

                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition cursor-pointer"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-[#FFD400]" />}
                  </button>
                </div>
              </div>

              {/* Sub-label under phone frame */}
              <p className="text-stone-400 text-xs mt-3 flex items-center gap-1.5 font-medium">
                <span>Direct message from Kinderbee Leadership</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
        <div className="text-center mb-12">
          <div className="text-[#E1007A] font-bold text-xs uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block mb-3">
            Voices of Success
          </div>
          <h2 className="text-3xl font-display font-extrabold text-[#1C1917]">
            Testimonials
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm relative">
            <div className="text-6xl text-pink-100 font-serif absolute top-4 left-6">"</div>
            <p className="text-stone-700 leading-relaxed relative z-10 italic mb-6">
              I always wanted to start a preschool, but I didn't know where to begin. Kinderbee gave me more than a franchise model—it gave me a <strong className="text-stone-900 font-bold not-italic">roadmap</strong>, a <strong className="text-stone-900 font-bold not-italic">support system</strong> and the <strong className="text-stone-900 font-bold not-italic">confidence</strong> to build something meaningful for children.
            </p>
            <div className="font-bold text-[#1C1917]">— Meera Krishnan</div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm relative">
            <div className="text-6xl text-pink-100 font-serif absolute top-4 left-6">"</div>
            <p className="text-stone-700 leading-relaxed relative z-10 italic mb-6">
              Kinderbee helped us understand that a preschool is not just a building—it is a child's <strong className="text-stone-900 font-bold not-italic">first learning world</strong>. Their approach helped us create a space where children can <strong className="text-stone-900 font-bold not-italic">explore, learn and grow happily</strong>.
            </p>
            <div className="font-bold text-[#1C1917]">— Divya Narayanan</div>
            <div className="text-xs text-stone-500 font-semibold">Kinderbee Franchise Partner | Madurai</div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm relative">
            <div className="text-6xl text-pink-100 font-serif absolute top-4 left-6">"</div>
            <p className="text-stone-700 leading-relaxed relative z-10 italic mb-6">
              The <strong className="text-stone-900 font-bold not-italic">NTT program</strong> helped me understand that teaching young children is not simply about lessons—it is about <strong className="text-stone-900 font-bold not-italic">patience, creativity and understanding every child</strong>. I now feel ready to step into a classroom with <strong className="text-stone-900 font-bold not-italic">confidence</strong>.
            </p>
            <div className="font-bold text-[#1C1917]">— Ananya Suresh</div>
            <div className="text-xs text-stone-500 font-semibold">NTT Graduate | Madurai</div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm relative">
            <div className="text-6xl text-pink-100 font-serif absolute top-4 left-6">"</div>
            <p className="text-stone-700 leading-relaxed relative z-10 italic mb-6">
              The program taught me that <strong className="text-stone-900 font-bold not-italic">every child learns differently</strong>. The training helped me become <strong className="text-stone-900 font-bold not-italic">more patient, creative and intentional</strong> in the way I approach teaching.
            </p>
            <div className="font-bold text-[#1C1917]">— Sneha Mathew</div>
            <div className="text-xs text-stone-500 font-semibold">NTT Graduate | Kochi</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 text-center bg-gradient-to-br from-stone-900 to-stone-950 text-white p-12 sm:p-16 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E1007A_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold">Ready to Join the Kinderbee Network?</h2>
          <p className="text-stone-300 text-base max-w-xl mx-auto">
            Schedule a confidential project scoping call with our <strong className="text-white font-bold">central advisory team</strong> today.
          </p>
          <button
            onClick={onOpenConsultation}
            className="bg-[#E1007A] hover:bg-pink-700 text-white font-medium px-8 py-4 rounded-2xl shadow-lg transition duration-300 text-base cursor-pointer"
          >
            Book Consultation Call
          </button>
        </div>
      </section>

    </div>
  );
};
