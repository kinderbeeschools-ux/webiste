import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, Sparkles, TrendingUp, Headphones, Globe, ArrowRight, CheckCircle2, Award, BookOpen, 
  Users, Building, Star, Download, ChevronDown, HelpCircle, 
  GraduationCap, School, Camera, Heart, Sun, Smile, Clock, 
  MapPin, Phone, Mail, Send, Calendar, Check, Play, Pause, UserCheck,
  Quote, ChevronLeft, ChevronRight, Volume2, VolumeX, Video
} from 'lucide-react';
import { FAQItem, SystemSettings } from '../types';
import { SEOHead } from '../components/SEOHead';
import { SmartImage } from '../components/SmartImage';
import { motion, MotionConfig, useInView } from 'motion/react';
import { Reveal, EASE } from '../components/Motion';
import { openConsultationBooking, ConsultationOffer } from '../components/ConsultationBooking';
import { openBrochureDownload } from '../components/BrochureDownload';
import { FranchiseBuyerGuide } from '../components/premium/FranchiseBuyerGuide';
import { JumpLinks, WhyChooseSection, FranchiseModelsSection, CurriculumSection, IndiaOpportunitySection, HowToStartSection, FranchiseFaqSection, FRANCHISE_FAQS, WhatsAppEnquiry } from '../components/FranchiseSeoSections';
import { TrustStrip } from '../components/TrustStrip';
import { KinderOsSection } from '../components/KinderOsSection';
import { FranchiseDetails } from '../components/FranchiseDetails';
import { trackLead } from '../utils/analytics';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  onOpenConsultation: (type?: string) => void;
  faqs: FAQItem[];
  settings?: SystemSettings | null;
}

const FRANCHISE_SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "KinderBee Preschool Franchise",
  "serviceType": "Preschool franchise",
  "description": "A zero-royalty preschool franchise with a Finnish-inspired, NEP 2020 aligned curriculum, teacher training, branding, admissions support and the KinderOS school-management platform.",
  "provider": { "@type": "EducationalOrganization", "name": "Kinderbee International Preschool", "url": "https://www.kinderbeeschools.com" },
  "areaServed": { "@type": "Country", "name": "India" },
  "url": "https://www.kinderbeeschools.com/"
};

export const HomePage: React.FC<HomePageProps> = ({ setCurrentTab, onOpenConsultation, settings }) => {

  return (
    <MotionConfig reducedMotion="user"><div className="space-y-16 sm:space-y-24 pb-12">
      <SEOHead
        title="Preschool Franchise in India – Zero Royalty | KinderBee"
        description="Start a KinderBee preschool franchise in India: zero royalty, Finnish-style curriculum, free KinderOS CRM and full setup support. Book a free consultation."
        keywords="preschool franchise, preschool franchise in India, preschool franchise opportunities, preschool franchise business, nursery franchise, kindergarten franchise, playgroup franchise, preschool franchise in Tamil Nadu, zero royalty preschool franchise, KinderOS"
        ogImage="https://www.kinderbeeschools.com/franchise/preschool-hero.webp?v=2"
        settings={settings}
        faq={FRANCHISE_FAQS}
        extraSchema={FRANCHISE_SERVICE_SCHEMA}
      />

      {/* Franchise hero (moved from the Franchise page) */}
          <section className="relative overflow-hidden bg-[#FFF6F9] border-b border-pink-100/80 lg:min-h-[640px] flex items-center">
            {/* Background Image on Right with Seamless Fade - Full Building Clearly Visible */}
            <div className="hidden lg:block absolute top-0 right-0 bottom-0 lg:w-1/2 pointer-events-none overflow-hidden select-none">
              <img 
                src={settings?.franchiseHeroImage || "/franchise/preschool-hero.webp?v=2"}
                alt="Kinderbee Preschool campus with children playing outside"
                className="w-full h-full object-cover object-[50%_45%] kb-kenburns"
                fetchPriority="high"
              />
              <div className="absolute bottom-10 right-8 kb-float rounded-2xl border border-white/70 bg-white/90 px-4 py-2.5 text-sm font-bold text-stone-900 shadow-xl backdrop-blur">
                <span className="text-[#E1007A]">KinderOS</span> CRM included
              </div>
              <div className="absolute top-14 right-10 kb-float rounded-2xl border border-white/70 bg-white/90 px-4 py-2.5 text-sm font-bold text-stone-900 shadow-xl backdrop-blur" style={{ animationDelay: '1.4s' }}>
                <span className="text-[#E1007A]">Zero</span> royalty
              </div>
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
              <div className="kb-hero-in max-w-2xl lg:max-w-[min(35rem,calc(50vw-5rem))] space-y-5 sm:space-y-6">
                {/* Phone & tablet: the campus photo sits above the text instead of behind it */}
                <div className="lg:hidden overflow-hidden rounded-3xl border-4 border-white shadow-xl shadow-pink-900/10">
                  <img src={settings?.franchiseHeroImage || "/franchise/preschool-hero.webp?v=2"} alt="Kinderbee Preschool campus with children playing outside" className="w-full aspect-[4/3] sm:aspect-[16/10] object-cover object-[50%_72%]" fetchPriority="high" />
                </div>

                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 bg-pink-50/95 border border-pink-200/90 text-[#E1007A] text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#E1007A]" />
                  <span>AI-POWERED · ZERO ROYALTY PRESCHOOL FRANCHISE</span>
                </div>
                
                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] font-display font-extrabold tracking-tight text-[#1C1917] leading-[1.12]">
                  <span className="text-[#E1007A]">AI-Powered Preschool Franchise in India</span> with <span className="rounded-xl bg-[#FFE45C] px-2 text-[#1C1917] [box-decoration-break:clone]">Zero Royalty</span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-stone-600 text-sm sm:text-base md:text-[17px] leading-relaxed max-w-xl font-normal">
                  Start a KinderBee preschool franchise with a free ERP and KinderOS, a Finnish-style curriculum, lesson plans, teacher training and full setup support. Zero royalty, and you keep 100% of your fees.
                </p>
                
                {/* 4 feature cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-xl pt-1">
                  {[
                    { icon: Headphones, k: 'Free', v: 'ERP' },
                    { icon: TrendingUp, k: 'Zero', v: 'Royalty' },
                    { icon: Sparkles, k: 'KinderOS', v: 'Operating System' },
                    { icon: GraduationCap, k: 'Finnish-style', v: 'Curriculum' },
                  ].map(({ icon: Icon, k, v }) => (
                    <div key={k} className="bg-white/95 backdrop-blur-xs rounded-2xl border border-pink-100/90 shadow-xs hover:shadow-sm p-3 sm:p-3.5 text-center flex flex-col items-center justify-center">
                      <Icon className="w-5 h-5 text-[#E1007A] mb-1.5 stroke-[2.2]" />
                      <div className="font-extrabold text-stone-900 text-sm sm:text-base leading-tight">{k}</div>
                      <div className="text-xs text-stone-600 font-medium leading-tight mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-3.5">
                  <button
                    onClick={() => onOpenConsultation('preschool')}
                    className="kb-cta bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-6 sm:px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition text-sm flex items-center justify-center gap-2 cursor-pointer"
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




      <JumpLinks />

      <TrustStrip />

      <WhyChooseSection />

      <FranchiseModelsSection onEnquire={() => onOpenConsultation('preschool')} />

      <KinderOsSection onOpenConsultation={() => onOpenConsultation('preschool')} />

      <CurriculumSection />


      <FranchiseDetails onOpenConsultation={() => onOpenConsultation('preschool')} />



      <IndiaOpportunitySection onEnquire={() => onOpenConsultation('preschool')} />

      <FranchiseBuyerGuide onOpenConsultation={() => onOpenConsultation('preschool')} settings={settings} />

          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <ConsultationOffer category="Preschool Partnership / Franchise" />
          </div>



      <HowToStartSection />

      <FranchiseFaqSection />

      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 p-10 sm:p-14 text-center text-white shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">Ready to own a Kinderbee preschool?</h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">Talk to our partnership team. No obligation, and no royalty if you go ahead.</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={() => onOpenConsultation('preschool')} className="inline-flex items-center gap-2 rounded-full bg-[#E1007A] px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#c90070] cursor-pointer">Book Free Consultation <ArrowRight className="h-4 w-4" /></button>
            <button onClick={() => openBrochureDownload('Home closing CTA')} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/10 cursor-pointer">Download Franchise PDF</button>
            <WhatsAppEnquiry phone={(settings?.phone || '93449 06393').replace(/\D/g, '').replace(/^(\d{10})$/, '91$1')} className="text-white" />
          </div>
        </div>
      </section>


    </div></MotionConfig>
  );
};
