import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Building2, GraduationCap, School, BookOpen, TrendingUp, Headphones, ShieldCheck, Globe } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SmartImage } from '../components/SmartImage';
import { SystemSettings } from '../types';
import { FranchiseShowcase } from '../components/FranchiseShowcase';
import { FranchiseDetails } from '../components/FranchiseDetails';
import { SchoolSetup } from '../components/SchoolSetup';
import { ArcadiaPage } from '../components/ArcadiaPage';

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
      {resolvedTab === 'degree' && <ArcadiaPage onRequestBrief={() => onOpenConsultation('degree')} />}
    </div>
  );
};
