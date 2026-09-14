import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ArrowRight, ChevronLeft, ChevronRight, BookOpen, GraduationCap, 
  FileText, Award, Star, Globe, Eye, X, Clock, Calendar, Tag, Phone, Mail, Copy, Check, Flame, CreditCard
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SmartImage } from '../components/SmartImage';
import { SystemSettings } from '../types';

interface FwaPageProps {
  onOpenConsultation: (type?: string) => void;
  onNavigateToPayment?: (programme?: string, amount?: string) => void;
  settings?: SystemSettings | null;
}

const programSliders = [
  {
    title: "Advanced Diploma in Early Childhood Care & Education",
    image: "https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/Sliders/Advanced%20Diploma%20in%20Early%20Childhood%20Care%20and%20Education.jpeg",
    subtitle: "Advanced Pedagogy & Practical Training"
  },
  {
    title: "Certificate in Nordic inspired Preschool Teaching",
    image: "https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/Sliders/Certificate%20in%20Nordic%20inspired%20Preschool%20Teaching.jpeg",
    subtitle: "Child-Centred Global Teaching Methods"
  },
  {
    title: "Diploma in Play school Teacher Training",
    image: "https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/Sliders/Diploma%20in%20Play%20school%20Teacher%20Training.jpeg",
    subtitle: "Play-Based Classroom Activity Planning"
  },
  {
    title: "Foundational Stage Curriculum Design",
    image: "https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/Sliders/Foundational%20Stage%20Curriculum%20Design.jpeg",
    subtitle: "NEP 2020 & NCF-FS Aligned Curriculum"
  }
];

export const FwaPage: React.FC<FwaPageProps> = ({ onOpenConsultation, onNavigateToPayment, settings }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  const instagramCaption = `🎉 TEACHERS’ DAY MEGA OFFER! 🎉\nEnrol in the Advanced Diploma in Early Childhood Care & Education and receive an incredible 90% discount!\n🔥 Now only ₹4,999\n⏱️ 3 Months | 120 Hours\n📅 Offer valid until 5 October 2026\nUpgrade your skills and begin a rewarding career in early childhood education.\nHurry—limited-period offer!\n📞 81223 44040\n📧 kinderbeeschools@gmail.com\nFinnish-way Academy\nA KIPS Initiative by Kinderbee`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(instagramCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % programSliders.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + programSliders.length) % programSliders.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % programSliders.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      handleNextSlide();
    } else if (diff < -50) {
      handlePrevSlide();
    }
    setTouchStart(null);
  };

  return (
    <div className="space-y-20 pb-20 bg-[#FAF9F6]">
      <SEOHead 
        title="Academics & Programs"
        description="Explore Kinderbee's Advanced Diplomas, Teacher Training programs, and Foundational Curriculum certifications."
        keywords="preschool programs, toddler, pre-k, kindergarten, NTT teacher training, early childhood education, teacher certification"
        settings={settings}
      />
      
      {/* Hero Section: Smooth Horizontal Left Slider */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#200213] via-[#12010B] to-[#1F0214] text-white py-10 sm:py-16 px-4 sm:px-8 border-b border-pink-950/40">
        {/* Glow & Atmospheric Brand Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#E1007A_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-15"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,0,122,0.28),transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,212,0,0.14),transparent_50%)]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10 space-y-6">
          {/* Header Title Bar */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-stone-900/80 border border-[#E1007A]/50 text-pink-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD400]" />
              <span>TEACHER TRAINING & PEDAGOGY CERTIFICATIONS</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
              Early Childhood & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] via-pink-300 to-[#E1007A]">Teacher Training Programs</span>
            </h1>
            <p className="text-sm sm:text-base text-pink-100/75 max-w-2xl mx-auto">
              Empowering future preschool educators with world-class curriculum frameworks and recognized credentials.
            </p>
          </div>

          {/* Smooth Slider Carousel Container */}
          <div 
            className="relative max-w-5xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white/20 bg-stone-950 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Sliding Track (Translates left smoothly on every slide change) */}
            <div 
              className="flex w-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {programSliders.map((slide, idx) => (
                <div 
                  key={idx} 
                  className="w-full flex-shrink-0 relative aspect-[1200/628] bg-stone-950 flex items-center justify-center cursor-pointer"
                  onClick={() => onOpenConsultation('fwa_course')}
                  title={`Click to inquire about ${slide.title}`}
                >
                  <img 
                    src={slide.image} 
                    alt={slide.title}
                    className="w-full h-full object-cover sm:object-contain block"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevSlide}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-2.5 sm:p-3.5 rounded-full backdrop-blur-md border border-white/20 opacity-80 group-hover:opacity-100 transition duration-300 cursor-pointer shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-2.5 sm:p-3.5 rounded-full backdrop-blur-md border border-white/20 opacity-80 group-hover:opacity-100 transition duration-300 cursor-pointer shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Bottom Indicators & Current Slide Status */}
            <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
              {programSliders.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeSlide 
                      ? 'bg-[#FFD400] w-6 sm:w-8 h-2 sm:h-2.5' 
                      : 'bg-white/40 hover:bg-white/70 w-2 sm:w-2.5 h-2 sm:h-2.5'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Quick Select Buttons & Action Bar Below Slider */}
          <div className="max-w-5xl mx-auto space-y-4">
            {/* Slide Quick Navigation Pills */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {programSliders.map((prog, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`text-left p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                    idx === activeSlide
                      ? 'bg-[#E1007A]/25 border-[#E1007A] text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-pink-100/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#FFD400]">Program {idx + 1}</p>
                  <p className="text-xs sm:text-sm font-semibold truncate mt-0.5">{prog.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section id="programs" className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest text-[#E1007A] uppercase bg-pink-50 px-4 py-1.5 rounded-full inline-block mb-3">Professional Pedagogical Excellence</span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917]">Our Programs</h2>
          <p className="text-stone-500 mt-2 max-w-2xl mx-auto text-sm sm:text-base">Upgrade your skills with our highly specialized nursery teacher training, early childhood, and foundational stage curriculum design courses.</p>
        </div>

        {/* Teachers' Day Mega Offer Showcase Banner */}
        <div className="mb-12 bg-gradient-to-br from-stone-900 via-[#1F0214] to-stone-950 rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-2xl border-2 border-[#E1007A]/40 relative overflow-hidden">
          {/* Glowing Accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#E1007A]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFD400]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#E1007A] text-white text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-md">
                <Flame className="w-3.5 h-3.5 fill-white" />
                <span>TEACHERS’ DAY MEGA OFFER • 90% DISCOUNT</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white leading-tight">
                Advanced Diploma in Early Childhood Care &amp; Education
              </h3>

              <p className="text-pink-100/90 text-sm sm:text-base leading-relaxed">
                Enrol in our premier ECCE diploma and unlock a life-transforming career in modern Nordic-inspired early education.
              </p>

              {/* Offer Key Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <div className="text-[11px] uppercase tracking-wider text-[#FFD400] font-bold flex items-center gap-1 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Duration</span>
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold text-white">3 Months</div>
                  <div className="text-[10px] text-white/70">12 Weeks Intensive</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <div className="text-[11px] uppercase tracking-wider text-[#FFD400] font-bold flex items-center gap-1 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Course Hours</span>
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold text-white">120 Hours</div>
                  <div className="text-[10px] text-white/70">~10 hrs/week calculated</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1 mb-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Special Fee</span>
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold text-[#FFD400]">₹4,999 only</div>
                  <div className="text-[10px] text-white/70">90% off (was ₹49,990)</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <div className="text-[11px] uppercase tracking-wider text-pink-300 font-bold flex items-center gap-1 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Valid Until</span>
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-white">5 Oct 2026</div>
                  <div className="text-[10px] text-pink-200/80">Limited seats</div>
                </div>
              </div>

              {/* Hours calculation breakdown explainer */}
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 text-xs text-white/80 border border-white/10 space-y-1">
                <span className="font-bold text-[#FFD400] block">⏱️ 120 Course Hours Calculated Breakdown:</span>
                <p className="leading-relaxed">
                  <strong>60 Hours</strong> of Live Interactive Pedagogical Masterclasses (5 hrs/week) + <strong>40 Hours</strong> of Hands-on Practical Teaching Simulation Labs (3.3 hrs/week) + <strong>20 Hours</strong> of Capstone Action-Research &amp; Portfolio Assessment (1.7 hrs/week).
                </p>
              </div>

              {/* Direct Contacts */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-pink-100/90 pt-1">
                <a href="tel:8122344040" className="flex items-center gap-1.5 hover:text-white font-semibold transition">
                  <Phone className="w-3.5 h-3.5 text-[#FFD400]" />
                  <span>Call: 81223 44040</span>
                </a>
                <span>•</span>
                <a href="mailto:kinderbeeschools@gmail.com" className="flex items-center gap-1.5 hover:text-white font-semibold transition">
                  <Mail className="w-3.5 h-3.5 text-[#FFD400]" />
                  <span>kinderbeeschools@gmail.com</span>
                </a>
                <span>•</span>
                <span className="text-white/60">Finnish-way Academy — A KIPS Initiative by Kinderbee</span>
              </div>
            </div>

            {/* Right Action & Caption Box */}
            <div className="w-full lg:w-80 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex flex-col justify-between space-y-4 shrink-0">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#FFD400] font-bold block mb-1">
                  Instagram Caption
                </span>
                <div className="bg-black/60 rounded-xl p-3 text-[11px] font-mono text-pink-100/90 max-h-36 overflow-y-auto leading-relaxed border border-white/10">
                  🎉 TEACHERS’ DAY MEGA OFFER! 🎉<br />
                  Enrol in the Advanced Diploma in Early Childhood Care &amp; Education and receive an incredible 90% discount!<br />
                  🔥 Now only ₹4,999<br />
                  ⏱️ 3 Months | 120 Hours<br />
                  📅 Offer valid until 5 October 2026<br />
                  Upgrade your skills and begin a rewarding career in early childhood education.<br />
                  Hurry—limited-period offer!<br />
                  📞 81223 44040<br />
                  📧 kinderbeeschools@gmail.com<br />
                  Finnish-way Academy<br />
                  A KIPS Initiative by Kinderbee
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={handleCopyCaption}
                  className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                >
                  {copiedCaption ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300 font-bold">Caption Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#FFD400]" />
                      <span>Copy Instagram Caption</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onOpenConsultation('fwa_course')}
                  className="w-full bg-[#E1007A] hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply / Enrol for ₹4,999</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onNavigateToPayment && (
                  <button
                    onClick={() => onNavigateToPayment('Advanced Diploma in Early Childhood Care & Education (ECCE)', '4999')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Proceed to Fee Payment (₹4,999) &rarr;</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Program 1 */}
          <div className="bg-white rounded-3xl border-2 border-[#E1007A]/40 shadow-md overflow-hidden flex flex-col hover:shadow-xl transition duration-300 relative">
            {/* Top Ribbon */}
            <div className="bg-gradient-to-r from-[#A3001D] to-[#E1007A] text-white px-5 py-2 flex items-center justify-between text-xs font-bold tracking-wide">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
                TEACHERS' DAY MEGA OFFER • 90% OFF
              </span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold">
                ₹4,999 Only
              </span>
            </div>

            <div className="w-full overflow-hidden border-b border-stone-100 bg-stone-50 relative">
              <SmartImage 
                src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/Our%20Programs/Advanced%20Diploma%20in%20Early%20Childhood%20Care%20&%20Education.jpeg" 
                altContext={{ page: 'academics', section: 'Our Programs', type: 'advanced-diploma' }}
                className="w-full h-auto block"
              />
            </div>
            <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#E1007A] flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#E1007A] uppercase tracking-wider block mb-1">Advanced Credential • Limited Period</span>
                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-[#1C1917] leading-tight">Advanced Diploma in Early Childhood Care &amp; Education</h3>
                  </div>
                </div>

                {/* Offer Metrics Bar */}
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 mb-4 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-stone-500 font-medium block">Duration &amp; Hours:</span>
                    <strong className="text-stone-900 font-bold text-sm">3 Months | 120 Hours</strong>
                    <span className="text-[10px] text-stone-600 block mt-0.5">(Calculated: ~10 hrs/week)</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium block">Special Fee:</span>
                    <div className="flex items-baseline gap-1.5">
                      <strong className="text-[#A3001D] font-extrabold text-base">₹4,999</strong>
                      <span className="line-through text-stone-400 text-xs">₹49,990</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 block mt-0.5">Offer valid until 5 Oct 2026</span>
                  </div>
                </div>

                {/* Calculation summary */}
                <div className="bg-stone-50 rounded-xl p-2.5 text-[11px] text-stone-600 border border-stone-200/80 mb-4 leading-relaxed">
                  <strong>Course Hours Calculation:</strong> 120 Hours across 12 Weeks (60 hrs interactive masterclasses + 40 hrs simulation labs + 20 hrs capstone project).
                </div>
                
                <div className="border-t border-stone-100 pt-4 mt-4">
                  <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-3">Key Training Modules:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-stone-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-pink-50 text-[#E1007A] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">1</span>
                      <span>Child Development &amp; Psychology</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-pink-50 text-[#E1007A] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">2</span>
                      <span>Play-Based Teaching</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-pink-50 text-[#E1007A] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">3</span>
                      <span>Curriculum &amp; Activity Planning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-pink-50 text-[#E1007A] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">4</span>
                      <span>Practical Classroom Training</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-stone-500 font-medium block">Eligible: Aspiring &amp; Working Teachers</span>
                  <span className="text-[11px] text-stone-700 font-semibold">📞 81223 44040</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopyCaption}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold p-2.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                    title="Copy Instagram Caption"
                  >
                    {copiedCaption ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => onOpenConsultation('fwa_course')}
                    className="bg-[#A3001D] hover:bg-[#850017] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
                  >
                    <span>Apply / Enrol</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {onNavigateToPayment && (
                    <button
                      onClick={() => onNavigateToPayment('Advanced Diploma in Early Childhood Care & Education (ECCE)', '4999')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Proceed to Payment</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Program 2 */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition duration-300">
            <div className="w-full overflow-hidden border-b border-stone-100 bg-stone-50">
              <SmartImage 
                src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/Our%20Programs/Diploma%20in%20Play%20school%20Teacher%20Training.jpeg" 
                altContext={{ page: 'academics', section: 'Our Programs', type: 'diploma-play-school' }}
                className="w-full h-auto block"
              />
            </div>
            <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">Professional Diploma</span>
                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-[#1C1917] leading-tight">Diploma in Play school Teacher Training</h3>
                  </div>
                </div>
                
                <div className="border-t border-stone-100 pt-4 mt-4">
                  <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-3">Key Training Modules:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-stone-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">1</span>
                      <span>Child Development Basics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">2</span>
                      <span>Play-Based Teaching Methods</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">3</span>
                      <span>Classroom Activity Planning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">4</span>
                      <span>Practical Teaching Training</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-stone-500 font-medium">Eligible: Preschool Educators</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onOpenConsultation('fwa_course')}
                    className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Apply / Enrol</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {onNavigateToPayment && (
                    <button
                      onClick={() => onNavigateToPayment('Diploma in Play school Teacher Training', '12000')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Proceed to Payment</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Program 3 */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition duration-300">
            <div className="w-full overflow-hidden border-b border-stone-100 bg-stone-50">
              <SmartImage 
                src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/Our%20Programs/Certificate%20in%20Nordic%20inspired%20Preschool%20Teaching.jpeg" 
                altContext={{ page: 'academics', section: 'Our Programs', type: 'nordic-inspired' }}
                className="w-full h-auto block"
              />
            </div>
            <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Specialized Certificate</span>
                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-[#1C1917] leading-tight">Certificate in Nordic inspired Preschool Teaching</h3>
                  </div>
                </div>
                
                <div className="border-t border-stone-100 pt-4 mt-4">
                  <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-3">Key Training Modules:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-stone-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">1</span>
                      <span>Nordic-Inspired Teaching Methods</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">2</span>
                      <span>Play-Based Learning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">3</span>
                      <span>Child-Centred Education</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">4</span>
                      <span>Creative Classroom Activities</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-stone-500 font-medium">Global Standards Certification</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onOpenConsultation('fwa_course')}
                    className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Apply / Enrol</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {onNavigateToPayment && (
                    <button
                      onClick={() => onNavigateToPayment('Certificate in Nordic inspired Preschool Teaching', '8500')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Proceed to Payment</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Program 4 */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition duration-300">
            <div className="w-full overflow-hidden border-b border-stone-100 bg-stone-50">
              <SmartImage 
                src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/Our%20Programs/Foundational%20Stage%20Curriculum%20Design.jpeg" 
                altContext={{ page: 'academics', section: 'Our Programs', type: 'foundational-design' }}
                className="w-full h-auto block"
              />
            </div>
            <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-1">Curriculum Mastery</span>
                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-[#1C1917] leading-tight">Foundational Stage Curriculum Design</h3>
                  </div>
                </div>
                
                <div className="border-t border-stone-100 pt-4 mt-4">
                  <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-3">Key Training Modules:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-stone-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">1</span>
                      <span>NEP & NCF-FS Aligned</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">2</span>
                      <span>Play-Based Learning Design</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">3</span>
                      <span>Learning Outcomes & Activities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">4</span>
                      <span>Child-Centred Curriculum Planning</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-stone-500 font-medium">NEP 2020 & NCF Compliant</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onOpenConsultation('fwa_course')}
                    className="bg-[#E1007A] hover:bg-pink-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Apply / Enrol</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {onNavigateToPayment && (
                    <button
                      onClick={() => onNavigateToPayment('Foundational Stage Curriculum Design', '9500')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Proceed to Payment</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Certificate Showcase Section (Matching Reference Design) */}
      <section className="bg-[#FAF8F5] py-16 sm:py-20 px-4 sm:px-8 border-t border-stone-200/80">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Title & Key Features */}
            <div className="lg:col-span-5 space-y-6">
              {/* Badge */}
              <div className="inline-block bg-[#FCECE5] text-[#70162A] text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-xs">
                YOUR ACHIEVEMENT, OUR PROMISE
              </div>

              {/* Main Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-display font-extrabold text-[#1C1917] tracking-tight leading-[1.18]">
                Earn a Certificate That Opens New Opportunities
              </h2>

              {/* Subheading */}
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Stand out in your early childhood education career with globally inspired, industry-recognized certification.
              </p>

              {/* 4 Feature Points with Icons */}
              <div className="space-y-4 pt-2">
                {/* Feature 1 */}
                <div className="flex items-start gap-4 pb-4 border-b border-stone-200/60">
                  <div className="w-11 h-11 rounded-full bg-[#70162A] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base">Industry-Recognized</h3>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5 leading-snug">
                      Certified by Finnishway Academy, trusted by education professionals.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start gap-4 pb-4 border-b border-stone-200/60">
                  <div className="w-11 h-11 rounded-full bg-[#70162A] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base">Career-Focused</h3>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5 leading-snug">
                      Boost your teaching skills and career opportunities in early childhood education.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start gap-4 pb-4 border-b border-stone-200/60">
                  <div className="w-11 h-11 rounded-full bg-[#70162A] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base">Premium Certification</h3>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5 leading-snug">
                      Receive a beautifully designed certificate that adds value to your profile.
                    </p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#70162A] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base">Globally Inspired</h3>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5 leading-snug">
                      Nordic teaching philosophy integrated with NEP & NCF-FS for holistic learning.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Framed Certificate Showcase */}
            <div className="lg:col-span-7 flex flex-col items-center">
              {/* Framed Certificate Container */}
              <div 
                onClick={() => setIsCertModalOpen(true)}
                className="relative w-full rounded-2xl sm:rounded-3xl border-[8px] sm:border-[14px] border-[#70162A] bg-white shadow-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-pink-950/20"
                title="Click to view certificate sample in high resolution"
              >
                {/* Gold corner ribbon accent - Top Right */}
                <div className="absolute top-0 right-0 w-20 sm:w-28 h-20 sm:h-28 pointer-events-none z-10 overflow-hidden">
                  <div className="absolute transform rotate-45 bg-gradient-to-r from-[#C99738] via-[#FDE49E] to-[#A27318] text-stone-900 font-bold text-[9px] py-1.5 right-[-40px] top-[22px] sm:top-[28px] w-[150px] text-center shadow-md border-y border-[#C99738]/50">
                  </div>
                </div>

                {/* Gold corner ribbon accent - Bottom Left */}
                <div className="absolute bottom-0 left-0 w-20 sm:w-28 h-20 sm:h-28 pointer-events-none z-10 overflow-hidden">
                  <div className="absolute transform rotate-45 bg-gradient-to-r from-[#C99738] via-[#FDE49E] to-[#A27318] text-stone-900 font-bold text-[9px] py-1.5 left-[-40px] bottom-[22px] sm:bottom-[28px] w-[150px] text-center shadow-md border-y border-[#C99738]/50">
                  </div>
                </div>

                {/* Certificate Image */}
                <img 
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/Certificate.jpeg"
                  alt="Certificate of Course Completion - Finnishway Academy"
                  className="w-full h-auto block object-contain"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-stone-950/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="bg-white text-stone-900 text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-sm border border-stone-200">
                    <Eye className="w-4 h-4 text-[#70162A]" />
                    Click to View Sample
                  </span>
                </div>
              </div>

              {/* View Certificate Sample Pill Button */}
              <button
                onClick={() => setIsCertModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 hover:border-stone-400 font-semibold px-6 py-2.5 rounded-full text-xs sm:text-sm shadow-xs hover:shadow transition-all duration-200 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#70162A]" />
                <span>View Certificate Sample</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* High-Resolution Certificate Sample Lightbox Modal */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh]">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#70162A]" />
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">Certificate Sample & Accreditation Preview</h3>
              </div>
              <button
                onClick={() => setIsCertModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 overflow-auto bg-[#FAF8F5] flex items-center justify-center">
              <div className="border-[8px] sm:border-[12px] border-[#70162A] rounded-xl shadow-xl overflow-hidden bg-white max-w-full">
                <img 
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/NTT%20-%20Teacher%20Training/Certificate.jpeg" 
                  alt="Full Certificate of Course Completion"
                  className="w-full h-auto object-contain max-h-[68vh] block"
                />
              </div>
            </div>

            <div className="p-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 bg-white">
              <span className="text-xs text-stone-500 font-medium">Certified by Finnishway Academy in partnership with Kinderbee</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCertModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsCertModalOpen(false);
                    onOpenConsultation('fwa_course');
                  }}
                  className="bg-[#E1007A] hover:bg-pink-700 text-white text-xs font-bold px-5 py-2 rounded-lg shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Inquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="bg-stone-50 py-16 px-4 sm:px-8 border-y border-stone-200">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-display font-extrabold text-[#1C1917]">
            Ready to shape the future with us?
          </h2>
          <p className="text-stone-600 text-lg">
            Whether you want to enroll your child or upgrade your teaching career, Kinderbee provides the platform for exceptional growth.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => onOpenConsultation('admissions')}
              className="bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition"
            >
              Admissions Inquiry
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
