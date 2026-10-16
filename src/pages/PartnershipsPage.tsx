import React, { useState, useEffect } from 'react';
import { openBrochureDownload } from '../components/BrochureDownload';
import { Sparkles, CheckCircle2, ArrowRight, Building2, GraduationCap, School, BookOpen, TrendingUp, Headphones, ShieldCheck, Globe } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SmartImage } from '../components/SmartImage';
import { SystemSettings } from '../types';
import { FranchiseShowcase } from '../components/FranchiseShowcase';
import { FranchiseDetails } from '../components/FranchiseDetails';
import { SchoolSetup } from '../components/SchoolSetup';
import { ArcadiaPage } from '../components/ArcadiaPage';
import { ConsultationOffer, openConsultationBooking } from '../components/ConsultationBooking';
import { FranchiseBuyerGuide } from '../components/premium/FranchiseBuyerGuide';
import { SchoolPromoterGuide } from '../components/premium/SchoolPromoterGuide';
import { DegreeCollegeDiligence } from '../components/premium/DegreeCollegeDiligence';

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
          resolvedTab === 'preschool' ? "Best Preschool Franchise in India – No Royalty | Kinderbee" :
          resolvedTab === 'cbse' ? "CBSE & IB School Setup & Consultancy" :
          "Degree College Setup & Consultancy"
        }
        description={resolvedTab === 'preschool'
          ? "Start India's best preschool franchise with NO royalty. Finnish curriculum, lesson plans, teacher training and full setup support. Enquire today."
          : "Explore Kinderbee's tailored franchisee partnership models: Preschool Franchises, CBSE & IB World School Setup, and Degree College Consultancy."}
        keywords={resolvedTab === 'preschool'
          ? "best preschool franchise in India with no royalty, preschool franchise with zero royalty, no royalty preschool franchise, preschool with no royalty fee, India's #1 preschool franchise, best preschool franchise India, best international preschool franchise"
          : "preschool franchise india, zero royalty play school, CBSE school setup, IB school setup, degree college setup, CBSE and IB consultancy"}
        settings={settings}
      />

      {resolvedTab === 'preschool' && (
        <div className="space-y-16 animate-fadeIn">
          {/* Hero Banner matching Reference Design */}
          <section className="relative overflow-hidden bg-[#FFF6F9] border-b border-pink-100/80 lg:min-h-[640px] flex items-center">
            {/* Background Image on Right with Seamless Fade - Full Building Clearly Visible */}
            <div className="hidden lg:block absolute top-0 right-0 bottom-0 lg:w-1/2 pointer-events-none overflow-hidden select-none">
              <img 
                src="/franchise/preschool-hero.webp"
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
                  <img src="/franchise/preschool-hero.webp" alt="Kinderbee Preschool campus with children playing outside" className="w-full aspect-[4/3] sm:aspect-[16/10] object-cover object-[50%_40%]" fetchPriority="high" />
                </div>

                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 bg-pink-50/95 border border-pink-200/90 text-[#E1007A] text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#E1007A]" />
                  <span>ZERO ROYALTY PRESCHOOL FRANCHISE</span>
                </div>
                
                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] font-display font-extrabold tracking-tight text-[#1C1917] leading-[1.12]">
                  India’s Best <span className="text-[#E1007A]">Preschool Franchise</span> with Zero Royalty
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
                <button
                  type="button"
                  onClick={() => openConsultationBooking('Preschool Partnership / Franchise')}
                  className="text-sm font-semibold text-stone-600 hover:text-[#E1007A] underline decoration-pink-300 underline-offset-4 transition cursor-pointer"
                >
                  Prefer a detailed one-to-one session? Book a 1:1 consultation for ₹99
                </button>

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

          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <ConsultationOffer category="Preschool Partnership / Franchise" />
          </div>

          {/* Illustrated partner ecosystem showcase */}
          <FranchiseShowcase />

          <FranchiseDetails onOpenConsultation={() => onOpenConsultation('preschool')} />

          {/* Buyer's guide: questions, journey, readiness check and FAQ */}
          <FranchiseBuyerGuide onOpenConsultation={() => onOpenConsultation('preschool')} settings={settings} />
        </div>
      )}

      {/* PAGE 2: CBSE & IB SCHOOL SETUP (COMBINED) */}
      {resolvedTab === 'cbse' && (
        <>
          <SchoolSetup onConsult={() => onOpenConsultation('cbse')} />
          <div className="mt-16">
            <SchoolPromoterGuide onConsult={() => onOpenConsultation('cbse')} settings={settings} />
          </div>
        </>
      )}

      {/* PAGE 3: DEGREE COLLEGE SETUP */}
      {resolvedTab === 'degree' && (
        <ArcadiaPage
          onRequestBrief={() => onOpenConsultation('degree')}
          extra={<DegreeCollegeDiligence onRequestBrief={() => onOpenConsultation('degree')} />}
        />
      )}
    </div>
  );
};
