import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Building2, GraduationCap, School, BookOpen, TrendingUp, Headphones, ShieldCheck, Globe } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SmartImage } from '../components/SmartImage';
import { SystemSettings } from '../types';

export type FranchiseType = 'preschool' | 'cbse' | 'ib' | 'degree';

interface PartnershipsPageProps {
  subTab?: FranchiseType;
  onSelectSubTab?: (subTab: FranchiseType) => void;
  onOpenConsultation: (type?: string) => void;
  settings?: SystemSettings | null;
}

export const PartnershipsPage: React.FC<PartnershipsPageProps> = ({ 
  subTab: externalSubTab, 
  onSelectSubTab, 
  onOpenConsultation, 
  settings 
}) => {
  const [internalSubTab, setInternalSubTab] = useState<FranchiseType>('preschool');

  useEffect(() => {
    if (externalSubTab) {
      setInternalSubTab(externalSubTab);
    }
  }, [externalSubTab]);

  const activeTab = externalSubTab || internalSubTab;
  const resolvedTab = (activeTab === 'ib' ? 'cbse' : activeTab);

  const handleTabChange = (tab: FranchiseType) => {
    const targetTab = tab === 'ib' ? 'cbse' : tab;
    setInternalSubTab(targetTab);
    if (onSelectSubTab) {
      onSelectSubTab(targetTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs: { id: FranchiseType; label: string; icon: React.ReactNode; badge: string }[] = [
    { id: 'preschool', label: 'Franchise Preschool', icon: <School className="w-4 h-4" />, badge: 'Zero Royalty' },
    { id: 'cbse', label: 'CBSE & IB School Setup', icon: <BookOpen className="w-4 h-4" />, badge: 'K-12 & IB' },
    { id: 'degree', label: 'Degree College Setup', icon: <GraduationCap className="w-4 h-4" />, badge: 'Higher Ed' },
  ];

  return (
    <div className="space-y-12 pb-20 bg-[#FAF9F6]">
      <SEOHead 
        title={
          resolvedTab === 'preschool' ? "Zero Royalty Preschool Franchise" :
          resolvedTab === 'cbse' ? "CBSE & IB School Setup & Consultancy" :
          "Degree College Setup & Consultancy"
        }
        description="Explore Kinderbee's tailored franchisee partnership models: Preschool Franchises, CBSE & IB World School Setup, and Degree College Consultancy."
        keywords="preschool franchise india, zero royalty play school, CBSE school setup, IB school setup, degree college setup, CBSE and IB consultancy"
        settings={settings}
      />



      {/* PAGE 1: PRESCHOOL FRANCHISE */}
      {resolvedTab === 'preschool' && (
        <div className="space-y-16 animate-fadeIn">
          {/* Hero Banner matching Reference Design */}
          <section className="relative overflow-hidden bg-[#FFF6F9] border-b border-pink-100/80 min-h-[580px] lg:min-h-[640px] flex items-center">
            {/* Background Image on Right with Seamless Fade */}
            <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[58%] xl:w-[56%] pointer-events-none overflow-hidden select-none">
              <img 
                src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Preschool/Preschool.jpeg"
                alt="KinderBee Preschool & FinnishWay Academy Campus"
                className="w-full h-full object-cover object-[center_right] lg:object-left"
                referrerPolicy="no-referrer"
              />
              {/* Desktop smooth gradient blend towards left content */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFF6F9] via-[#FFF6F9]/85 via-15% lg:via-25% to-transparent"></div>
              {/* Mobile overlay to ensure text contrast */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#FFF6F9]/92 via-[#FFF6F9]/80 to-[#FFF6F9]/95 lg:hidden"></div>
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
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-12 lg:py-16 relative z-10">
              <div className="max-w-xl xl:max-w-2xl space-y-5 sm:space-y-6">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 bg-pink-50/95 border border-pink-200/90 text-[#E1007A] text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#E1007A]" />
                  <span>ZERO ROYALTY PRESCHOOL FRANCHISE</span>
                </div>
                
                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-display font-extrabold tracking-tight text-[#1C1917] leading-[1.12]">
                  Build a Thriving <br className="hidden sm:inline" />
                  <span className="text-[#E1007A]">Preschool Franchise</span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-stone-600 text-sm sm:text-base md:text-[17px] leading-relaxed max-w-xl font-normal">
                  Join India’s premier zero-royalty preschool franchise ecosystem. Combine Nordic early childhood standards with NEP 2020 frameworks to build a high-profit, child-centered school.
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
                <div className="pt-2 flex flex-wrap items-center gap-3.5">
                  <button
                    onClick={() => onOpenConsultation('preschool')}
                    className="bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-6 sm:px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>Book Free Consultation</span>
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                  <a
                    href="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Files/_FRANCHISE.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Kinderbee_Franchise_Brochure.pdf"
                    className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 hover:border-stone-400 font-bold px-5 sm:px-6 py-3.5 rounded-xl shadow-xs transition text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>Download Franchise PDF</span>
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>

                {/* Bottom Feature Pill Strip */}
                <div className="pt-2">
                  <div className="inline-flex flex-wrap sm:flex-nowrap items-center bg-white/95 backdrop-blur-xs border border-pink-100/90 rounded-2xl p-2.5 sm:p-3 shadow-xs gap-3 sm:gap-4 max-w-xl">
                    <div className="flex items-center gap-2.5 px-2">
                      <ShieldCheck className="w-5 h-5 text-[#E1007A] shrink-0 stroke-[2.2]" />
                      <div className="text-left">
                        <div className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">NEP 2020</div>
                        <div className="text-[11px] text-stone-500 font-medium">Aligned</div>
                      </div>
                    </div>

                    <div className="hidden sm:block w-px h-7 bg-stone-200"></div>

                    <div className="flex items-center gap-2.5 px-2">
                      <BookOpen className="w-5 h-5 text-[#E1007A] shrink-0 stroke-[2.2]" />
                      <div className="text-left">
                        <div className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">Child-Centric</div>
                        <div className="text-[11px] text-stone-500 font-medium">Education</div>
                      </div>
                    </div>

                    <div className="hidden sm:block w-px h-7 bg-stone-200"></div>

                    <div className="flex items-center gap-2.5 px-2">
                      <Globe className="w-5 h-5 text-[#E1007A] shrink-0 stroke-[2.2]" />
                      <div className="text-left">
                        <div className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">Global Standards</div>
                        <div className="text-[11px] text-stone-500 font-medium">Local Relevance</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What You Receive As a KIPS Partner */}
          <section className="max-w-5xl mx-auto px-4 sm:px-8">
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xs border border-stone-200 space-y-6">
              <h2 className="text-2xl font-display font-extrabold text-[#E1007A]">What You Receive As a KIPS Preschool Partner:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-xl border border-stone-100"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span className="text-sm font-semibold text-stone-700">Official Brand License</span></div>
                <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-xl border border-stone-100"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span className="text-sm font-semibold text-stone-700">Custom Local Curriculum</span></div>
                <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-xl border border-stone-100"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span className="text-sm font-semibold text-stone-700">Staff Recruitment Guides</span></div>
                <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-xl border border-stone-100"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span className="text-sm font-semibold text-stone-700">Comprehensive Training</span></div>
                <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-xl border border-stone-100"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span className="text-sm font-semibold text-stone-700">School Design Blueprint</span></div>
                <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-xl border border-stone-100"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span className="text-sm font-semibold text-stone-700">SEO-Optimized Micro-Websites</span></div>
                <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-xl border border-stone-100"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span className="text-sm font-semibold text-stone-700">Admissions Playbooks</span></div>
                <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-xl border border-stone-100"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span className="text-sm font-semibold text-stone-700">School Management ERP</span></div>
                <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-xl border border-stone-100"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span className="text-sm font-semibold text-stone-700">Continuous Quality Audits</span></div>
                <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-xl border border-stone-100"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span className="text-sm font-semibold text-stone-700">Franchise Operations Manual</span></div>
                <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-xl border border-stone-100"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span className="text-sm font-semibold text-stone-700">Monthly Marketing Campaigns</span></div>
                <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-xl border border-stone-100"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span className="text-sm font-semibold text-stone-700">Mentorship Advisory Support</span></div>
              </div>
            </div>
          </section>

          {/* Core Preschool Pedagogy & Financial Specs */}
          <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-stone-200 space-y-6">
              <h3 className="text-2xl font-display font-bold text-[#1C1917]">Preschool Curriculum & Learning Pillars</h3>
              <ul className="space-y-3 text-stone-700 font-medium text-sm">
                <li className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#E1007A]"></span> Play-Based & Experiential Learning</li>
                <li className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#E1007A]"></span> NEP 2020 Early Childhood Care & Education</li>
                <li className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#E1007A]"></span> Finnish-Inspired Child-Centric Pedagogy</li>
                <li className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#E1007A]"></span> STEM & Activity-Based Exploration</li>
                <li className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#E1007A]"></span> Social & Emotional Intelligence Skills</li>
                <li className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#E1007A]"></span> Fine & Gross Motor Development</li>
                <li className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#E1007A]"></span> Phonics & Early Literacy Modules</li>
              </ul>
            </div>

            <div className="bg-stone-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
              <h3 className="text-2xl font-display font-bold text-white">Investment & Space Specifications</h3>
              <div className="space-y-4">
                <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
                  <div className="text-xs uppercase tracking-widest text-pink-400 font-bold">Estimated Capital Investment</div>
                  <div className="text-2xl font-extrabold text-white mt-1">₹15 Lakhs – ₹30 Lakhs</div>
                  <div className="text-xs text-stone-400 mt-1">Covers interior setup, safety flooring, furniture, activity kits, and marketing launch.</div>
                </div>
                <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
                  <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Royalty Fee Structure</div>
                  <div className="text-xl font-bold text-emerald-300 mt-1">₹0 / Month (100% Zero Royalty)</div>
                  <div className="text-xs text-stone-400 mt-1">Keep 100% of your tuition revenues and profits forever.</div>
                </div>
                <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
                  <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">Space / Built-up Area</div>
                  <div className="text-lg font-bold text-white mt-1">1,500 – 3,500 Sq. Ft.</div>
                  <div className="text-xs text-stone-400 mt-1">Ground floor residential villa or commercial property with outdoor play space.</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* PAGE 2: CBSE & IB SCHOOL SETUP (COMBINED) */}
      {resolvedTab === 'cbse' && (
        <div className="space-y-16 animate-fadeIn">
          {/* Hero Banner matching Reference Design */}
          <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFDF9] via-[#FFF9F6] to-[#FFF5F8] pt-10 pb-12 lg:pt-14 lg:pb-16 px-4 sm:px-8 border-b border-stone-200/80">
            {/* Soft decorative ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
              <div className="absolute -top-20 left-1/4 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl"></div>
              <div className="absolute top-10 right-1/4 w-80 h-80 bg-pink-100/50 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              {/* Left Column: Pill, Title, Subtitle, 4 Process Icons, CTA Button */}
              <div className="lg:col-span-6 space-y-6 text-left">
                {/* Amber Pill Badge */}
                <div className="inline-flex items-center gap-2 bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>FLAGSHIP K-12 SCHOOL PARTNERSHIP</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-display font-extrabold tracking-tight text-[#1C1917] leading-[1.14]">
                  CBSE &amp; IB School Setup <br className="hidden sm:inline" />
                  <span className="text-[#E1007A]">&amp; Consultancy</span>
                </h1>

                {/* Subtitle */}
                <p className="text-stone-600 text-sm sm:text-base md:text-[17px] leading-relaxed max-w-xl font-normal">
                  Establish a high-quality CBSE school or IB World School in India with comprehensive support for school planning, affiliation guidance, infrastructure design, teacher training, and digital admissions growth.
                </p>

                {/* 4 Feature / Process Icons in a Row matching Reference Design */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 max-w-xl pt-2 pb-1">
                  {/* 1. School Planning & Affiliation */}
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 text-[#E1007A] transition group-hover:scale-105">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-[#E1007A]">
                        <path d="M12 3v3" />
                        <path d="M12 3l3 1.5-3 1.5" />
                        <path d="M4 10l8-4 8 4" />
                        <path d="M6 10v10" />
                        <path d="M10 10v10" />
                        <path d="M14 10v10" />
                        <path d="M18 10v10" />
                        <path d="M2 20h20" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-[13px] font-bold text-stone-800 leading-snug">
                      School Planning &amp; Affiliation
                    </span>
                  </div>

                  {/* 2. Infrastructure Design */}
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 text-[#E1007A] transition group-hover:scale-105">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-[#E1007A]">
                        <path d="M21 21L3 3" />
                        <path d="M21 21H3V3" />
                        <path d="M7 17l4-4" />
                        <path d="M11 17l4-4" />
                        <path d="M15 17l4-4" />
                        <path d="M7 13l2-2" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-[13px] font-bold text-stone-800 leading-snug">
                      Infrastructure Design
                    </span>
                  </div>

                  {/* 3. Teacher Training */}
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 text-[#E1007A] transition group-hover:scale-105">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-[#E1007A]">
                        <path d="M2 3h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2" />
                        <path d="M10 17v4" />
                        <path d="M6 21h8" />
                        <circle cx="20" cy="8" r="2" />
                        <path d="M18 14a3 3 0 0 1 4 0" />
                        <path d="M6 8h6" />
                        <path d="M6 12h4" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-[13px] font-bold text-stone-800 leading-snug">
                      Teacher Training
                    </span>
                  </div>

                  {/* 4. Digital Admissions Support */}
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 text-[#E1007A] transition group-hover:scale-105">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-[#E1007A]">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <path d="M8 21h8" />
                        <path d="M12 17v4" />
                        <circle cx="12" cy="9" r="2.5" />
                        <path d="M8.5 14a3.5 3.5 0 0 1 7 0" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-[13px] font-bold text-stone-800 leading-snug">
                      Digital Admissions Support
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <button
                    onClick={() => onOpenConsultation('cbse')}
                    className="bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-md hover:shadow-lg transition text-sm sm:text-base flex items-center gap-2 cursor-pointer group"
                  >
                    <span>Book Free Consultation for CBSE &amp; IB Setup</span>
                    <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Golden Framed Hero Image matching Reference Design */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full relative max-w-xl lg:max-w-none">
                  <div className="relative w-full rounded-3xl sm:rounded-[2.25rem] border-[3.5px] border-[#FBBF24] overflow-hidden shadow-xl bg-white aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3]">
                    <img 
                      src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Preschool/CBSE%20School.jpeg"
                      alt="CBSE & IB World School Campus Setup"
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Dual Curriculum Pathways Overview (CBSE vs IB World School) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#E1007A] bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                <Sparkles className="w-3 h-3 text-[#E1007A]" />
                <span>Dual K-12 Pathways</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-stone-900 tracking-tight">
                Choose the Ideal Framework for Your Campus
              </h2>
              <p className="text-stone-600 text-sm sm:text-base">
                Whether you plan to launch India's most trusted national board or an elite global IB World School, KinderBee provides 360-degree turnkey consultancy from land sanctioning to campus inauguration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Option A: CBSE School Setup */}
              <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs hover:shadow-md transition space-y-6 relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200">
                      National K-12 Standard
                    </span>
                    <span className="text-xs font-bold text-stone-500">NEP 2020 Aligned</span>
                  </div>

                  <h3 className="text-2xl font-display font-extrabold text-stone-900">
                    CBSE School Setup &amp; Affiliation
                  </h3>

                  <p className="text-stone-600 text-sm leading-relaxed">
                    India's most sought-after national curriculum framework with unmatched parental recognition, comprehensive NCERT integration, and nationwide board examinations.
                  </p>

                  <div className="space-y-2.5 pt-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-800">Core Focus Areas:</h4>
                    <ul className="space-y-2 text-sm text-stone-700">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> CBSE-Aligned Curriculum &amp; Syllabi</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> NEP 2020 Pedagogical Framework Integration</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Student-Centric &amp; Experiential Learning</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> STEM &amp; Technology-Enabled Smart Classrooms</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Complete SARAS Affiliation Documentation Support</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-500 font-semibold block uppercase">Estimated Outlay</span>
                    <span className="text-lg sm:text-xl font-bold text-[#E1007A]">₹2 Crore – ₹5 Crore+</span>
                  </div>
                  <button
                    onClick={() => onOpenConsultation('cbse')}
                    className="bg-stone-900 hover:bg-[#E1007A] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    CBSE Blueprint &rarr;
                  </button>
                </div>
              </div>

              {/* Option B: IB World School Setup */}
              <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs hover:shadow-md transition space-y-6 relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100/80 px-3 py-1 rounded-full border border-purple-200">
                      International Standard
                    </span>
                    <span className="text-xs font-bold text-stone-500">PYP &bull; MYP &bull; DP</span>
                  </div>

                  <h3 className="text-2xl font-display font-extrabold text-stone-900">
                    IB World School Setup &amp; Accreditation
                  </h3>

                  <p className="text-stone-600 text-sm leading-relaxed">
                    World-recognized international continuum education fostering critical thinking, research skills, inquiry-based transdisciplinary projects, and global university admissions.
                  </p>

                  <div className="space-y-2.5 pt-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-800">Core Focus Areas:</h4>
                    <ul className="space-y-2 text-sm text-stone-700">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> International Baccalaureate (IB) Curriculum</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Inquiry-Based &amp; Project-Based Learning</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Critical Thinking &amp; Global Problem Solving</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> International Mindedness &amp; Multilingualism</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> IB Candidacy &amp; Authorization Roadmaps</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-500 font-semibold block uppercase">Estimated Outlay</span>
                    <span className="text-lg sm:text-xl font-bold text-[#E1007A]">₹5 Crore – ₹15 Crore+</span>
                  </div>
                  <button
                    onClick={() => onOpenConsultation('cbse')}
                    className="bg-stone-900 hover:bg-[#E1007A] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    IB Advisory &rarr;
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Financial & Infrastructure Specifications */}
          <section className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="bg-stone-50 border border-stone-200/90 rounded-3xl p-6 sm:p-10 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-display font-extrabold text-stone-900">
                    Financial &amp; Infrastructure Specifications
                  </h3>
                  <p className="text-stone-600 text-sm mt-1">
                    Clear transparent guidance for both CBSE Affiliated and IB World School models.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-white text-stone-700 px-3 py-1.5 rounded-full border border-stone-200">
                    Tier 1, Tier 2 &amp; Tier 3 Ready
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Estimated Investment</div>
                  <div className="text-xl sm:text-2xl text-[#E1007A] font-extrabold">₹2 Cr – ₹15 Cr+</div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    ₹2 Cr – ₹5 Cr+ for standard CBSE K-12 campus; ₹5 Cr – ₹15 Cr+ for comprehensive international IB campus. Investment varies with land ownership, scale, and facilities.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Land Requirements</div>
                  <div className="text-base sm:text-lg font-bold text-stone-900">As per Board Bye-Laws</div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    CBSE requires land adherence per Affiliation Bye-Laws (typically 1.5 to 2+ acres depending on municipal/urban limits). IB mandates adequate space for international sports and learning hubs.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Campus Development</div>
                  <div className="text-base sm:text-lg font-bold text-stone-900">Architectural Masterplan</div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Compliant with national building codes, child safety protocols, fire NOC specifications, barrier-free access, and digital smart-class acoustic standards.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200">
                <h4 className="font-bold text-stone-900 text-sm mb-2 uppercase tracking-wide">Suitable for:</h4>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Entrepreneurs, educational investors, existing school owners seeking upgrade or dual-curriculum expansion, educational trusts, and charitable societies aiming to establish landmark K-12 or international schools.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Recommended Campus Facilities Checklist */}
          <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Facilities List */}
            <div className="lg:col-span-7 bg-stone-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/80 mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Turnkey Campus Facilities</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold">
                    Recommended CBSE &amp; IB Facilities
                  </h3>
                  <p className="text-stone-400 text-sm mt-1">
                    Every blueprint we design fulfills board affiliation prerequisites while inspiring 21st-century learners.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-stone-300">
                  <div className="flex gap-2.5 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Spacious Smart Classrooms</div>
                  <div className="flex gap-2.5 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Science &amp; Computer Laboratories</div>
                  <div className="flex gap-2.5 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Mathematics &amp; Innovation Labs</div>
                  <div className="flex gap-2.5 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> STEM / Robotics Maker-Labs</div>
                  <div className="flex gap-2.5 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> International Standard Library</div>
                  <div className="flex gap-2.5 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Art &amp; Performing Arts Studios</div>
                  <div className="flex gap-2.5 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Indoor &amp; Outdoor Sports Complex</div>
                  <div className="flex gap-2.5 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Multipurpose Activity Auditorium</div>
                  <div className="flex gap-2.5 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Collaborative Learning Pods</div>
                  <div className="flex gap-2.5 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Teacher Resource Centre</div>
                  <div className="flex gap-2.5 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Student Wellness &amp; First-Aid Infirmary</div>
                  <div className="flex gap-2.5 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Safe Washrooms &amp; CCTV Surveillance</div>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-800">
                <button
                  onClick={() => onOpenConsultation('cbse')}
                  className="w-full bg-[#E1007A] hover:bg-pink-700 text-white font-bold py-4 rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Consult Our School Planning Team</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>

            {/* Right: Turnkey Consultancy Pillars */}
            <div className="lg:col-span-5 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#E1007A] bg-pink-50 px-3 py-1 rounded-full border border-pink-100 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-[#E1007A]" />
                    <span>Turnkey Consulting</span>
                  </div>
                  <h3 className="text-2xl font-display font-extrabold text-stone-900">
                    6-Step Advisory Lifecycle
                  </h3>
                  <p className="text-stone-600 text-sm mt-1">
                    From your first vision meeting to full student admissions, we guide every milestone.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3.5 items-start">
                    <div className="w-7 h-7 rounded-full bg-pink-100 text-[#E1007A] font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">Feasibility &amp; Project Report</h4>
                      <p className="text-xs text-stone-600">Demographic analysis, catchment survey, financial modeling &amp; 10-year P&amp;L.</p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-7 h-7 rounded-full bg-pink-100 text-[#E1007A] font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">Campus Architecture &amp; Interiors</h4>
                      <p className="text-xs text-stone-600">Spatial masterplans, smart classrooms, laboratories, and sports grounds.</p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-7 h-7 rounded-full bg-pink-100 text-[#E1007A] font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">Affiliation &amp; Statutory Approvals</h4>
                      <p className="text-xs text-stone-600">State NOC, society bye-laws, CBSE SARAS filing, and IB Candidacy support.</p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-7 h-7 rounded-full bg-pink-100 text-[#E1007A] font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">4</div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">Faculty Hiring &amp; Certified Training</h4>
                      <p className="text-xs text-stone-600">Principal onboarding, teacher recruitment, and pedagogical workshops.</p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-7 h-7 rounded-full bg-pink-100 text-[#E1007A] font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">5</div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">EdTech &amp; School ERP Deployment</h4>
                      <p className="text-xs text-stone-600">Interactive digital boards, student management ERP, and RFID/CCTV systems.</p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-7 h-7 rounded-full bg-pink-100 text-[#E1007A] font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">6</div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">Admissions Campaign &amp; Launch</h4>
                      <p className="text-xs text-stone-600">Digital marketing, parent orientations, and community enrollment drives.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <button
                  onClick={() => onOpenConsultation('cbse')}
                  className="w-full bg-stone-900 hover:bg-[#E1007A] text-white font-bold py-3.5 rounded-xl transition text-sm cursor-pointer text-center"
                >
                  Request Detailed School Setup Dossier &rarr;
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* PAGE 3: DEGREE COLLEGE SETUP */}
      {resolvedTab === 'degree' && (
        <div className="space-y-16 animate-fadeIn">
          {/* Hero Banner */}
          <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-amber-50/30 pt-10 pb-12 px-4 sm:px-8 border-b border-pink-100">
            {/* Soft decorative background glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
              <div className="absolute -top-20 left-1/4 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl"></div>
              <div className="absolute top-10 right-1/4 w-80 h-80 bg-amber-100/50 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>HIGHER EDUCATION PARTNERSHIP</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-[#1C1917] leading-tight">
                Degree College Setup <span className="text-[#E1007A]">& Consultancy</span>
              </h1>
              
              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
                Establish or transform a degree college in India with comprehensive support for higher education planning, university affiliation, academic development, infrastructure, compliance, faculty training, student admissions, and digital transformation.
              </p>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => onOpenConsultation('degree')}
                  className="bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition text-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Book Free Consultation for College Setup &rarr;</span>
                </button>
              </div>
            </div>
          </section>

          {/* Core Focus & Specifications */}
          <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-stone-200 space-y-6">
                <h3 className="text-2xl font-bold text-stone-900">Core Degree College Focus</h3>
                <ul className="space-y-3 text-stone-700 text-sm">
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> UG & PG Degree Programs</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> University Affiliation Support</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> Higher Education Compliance</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> Industry-Oriented Programs & Placements</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> Digital & Technology-Enabled Learning</li>
                </ul>

                <div className="pt-4 border-t border-stone-100">
                  <h4 className="font-bold text-stone-900 text-base mb-2">Suitable for:</h4>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Education entrepreneurs, investors, educational trusts, existing institutions and organizations planning to establish or expand a degree college or higher education institution.
                  </p>
                </div>
              </div>

              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 space-y-4">
                <h3 className="text-lg font-bold text-stone-900">Financial & Infrastructure Specifications</h3>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-xl border border-stone-200">
                    <div className="text-xs font-bold text-stone-500 uppercase">Estimated Investment</div>
                    <div className="text-xl text-[#E1007A] font-bold">₹5 Crore – ₹15 Crore+</div>
                    <div className="text-xs text-stone-500 mt-1">Investment varies based on location, land, campus size, infrastructure, courses offered and applicable regulatory requirements.</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-stone-200">
                    <div className="text-xs font-bold text-stone-500 uppercase">Land & Campus Requirements</div>
                    <div className="text-sm font-semibold text-stone-800">Based on university, regulatory and local requirements</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1C1917] text-white p-8 rounded-3xl shadow-xl space-y-6">
              <h3 className="text-xl font-bold mb-4">Recommended Degree College Facilities</h3>
              <ul className="space-y-2.5 text-sm text-stone-300">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Smart Classrooms</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Computer & Advanced Laboratories</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Central Library & Digital Library</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Seminar & Conference Hall</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Department Offices</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Faculty Development Centre</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Innovation & Entrepreneurship Centre</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Placement & Career Development Cell</li>
              </ul>
              <div className="pt-4 border-t border-stone-800">
                <button
                  onClick={() => onOpenConsultation('degree')}
                  className="w-full bg-[#FFD400] hover:bg-amber-400 text-stone-900 font-bold py-3.5 rounded-xl transition text-sm cursor-pointer shadow-md"
                >
                  Begin Your College Partnership Registration
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
