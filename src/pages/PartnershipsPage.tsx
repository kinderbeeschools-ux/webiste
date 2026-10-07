import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Building2, GraduationCap, School, BookOpen, TrendingUp, Headphones, ShieldCheck, Globe } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SmartImage } from '../components/SmartImage';
import { SystemSettings } from '../types';
import { FranchiseShowcase } from '../components/FranchiseShowcase';
import { FranchiseDetails } from '../components/FranchiseDetails';
import { SchoolSetup } from '../components/SchoolSetup';

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

      {resolvedTab === 'preschool' && (
        <div className="space-y-16 animate-fadeIn">
          {/* Hero Banner matching Reference Design */}
          <section className="relative overflow-hidden bg-[#FFF6F9] border-b border-pink-100/80 min-h-[580px] lg:min-h-[640px] flex items-center">
            {/* Background Image on Right with Seamless Fade - Full Building Clearly Visible */}
            <div className="absolute top-0 right-0 bottom-0 w-full md:w-[55%] lg:w-[60%] xl:w-[62%] pointer-events-none overflow-hidden select-none">
              <img 
                src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Franchise/Franchaise%20Banner.jfif"
                alt="KinderBee Preschool Franchise Banner"
                className="w-full h-full object-cover object-right"
                referrerPolicy="no-referrer"
              />
              {/* Smooth gradient feather on the left edge only, keeping the entire building 100% visible */}
              <div className="absolute inset-y-0 left-0 w-16 sm:w-24 md:w-32 lg:w-44 bg-gradient-to-r from-[#FFF6F9] to-transparent pointer-events-none"></div>
              {/* Soft mobile contrast adjustment (hidden on md and desktop) */}
              <div className="absolute inset-0 bg-[#FFF6F9]/50 md:hidden pointer-events-none"></div>
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

          {/* Illustrated partner ecosystem showcase */}
          <FranchiseShowcase />

          <FranchiseDetails onOpenConsultation={() => onOpenConsultation('preschool')} />
        </div>
      )}

      {/* PAGE 2: CBSE & IB SCHOOL SETUP (COMBINED) */}
      {resolvedTab === 'cbse' && <SchoolSetup onConsult={() => onOpenConsultation('cbse')} />}

      {/* PAGE 3: DEGREE COLLEGE SETUP */}
      {resolvedTab === 'degree' && (
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
                  <span>HIGHER EDUCATION PARTNERSHIP</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-display font-extrabold tracking-tight text-[#1C1917] leading-[1.14]">
                  Degree College Setup <br className="hidden sm:inline" />
                  <span className="text-[#E1007A]">&amp; Consultancy</span>
                </h1>

                {/* Subtitle */}
                <p className="text-stone-600 text-sm sm:text-base md:text-[17px] leading-relaxed max-w-xl font-normal">
                  Establish or transform a degree college in India with comprehensive support for higher education planning, university affiliation, academic development, infrastructure, compliance, faculty training, student admissions, and digital transformation.
                </p>

                {/* 4 Feature / Process Icons in a Row matching Reference Design */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 max-w-xl pt-2 pb-1">
                  {/* 1. College Planning & Affiliation */}
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
                      College Planning &amp; Affiliation
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

                  {/* 3. Faculty Training */}
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
                      Faculty Training
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
                    onClick={() => onOpenConsultation('degree')}
                    className="bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-md hover:shadow-lg transition text-sm sm:text-base flex items-center gap-2 cursor-pointer group"
                  >
                    <span>Book Free Consultation for College Setup</span>
                    <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Golden Framed Hero Image matching Reference Design */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full relative max-w-xl lg:max-w-none">
                  <div className="relative w-full rounded-3xl sm:rounded-[2.25rem] border-[3.5px] border-[#FBBF24] overflow-hidden shadow-xl bg-white aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3]">
                    <img 
                      src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Preschool/Degree%20College%20Setup%20&%20Consultancy.jpeg"
                      alt="Degree College Setup & Consultancy"
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
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
