import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Award, TrendingUp, BookOpen, Users, Building, Play, Star } from 'lucide-react';
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

export const HomePage: React.FC<HomePageProps> = ({ 
  setCurrentTab, 
  onOpenConsultation, 
  blogs, 
  faqs, 
  onSelectBlog,
  settings 
}) => {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

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
              Transform Schools. Empower Educators. Shape Futures.
            </h3>
            
            <p className="text-base text-stone-600 leading-relaxed max-w-lg">
              The KinderBee Integrated Partnership System (KIPS) empowers entrepreneurs and educational institutions to build, launch and grow future-ready schools with proven academic systems, expert support and innovative learning solutions.
            </p>
            
            <div className="py-2">
              <p className="text-sm font-bold text-stone-800 flex flex-wrap items-center gap-2">
                <span className="text-lg">🛡</span> Zero-Royalty Partnership <span className="text-stone-300 px-1">•</span> End-to-End School Support <span className="text-stone-300 px-1">•</span> Finnish-Inspired Learning
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
              <SmartImage 
                src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Kinderbeeschools%20(12).jpeg" 
                altContext={{ page: 'home', section: 'KIPS Future', type: 'school' }}
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
              src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Our%20Philosophy.png" 
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
                The Kinderbee Integrated Partnership System (KIPS) is a trusted school education and preschool development partner, dedicated to building high-quality, future-ready learning environments across India. With expertise in early childhood education, preschool management, curriculum development, and teacher training, we help educational entrepreneurs create successful and sustainable schools.
              </p>
              <p>
                Our NTT (Nursery Teacher Training) Program equips aspiring and working educators with practical skills, modern teaching methodologies, and child-centric approaches for effective early years education. From preschool teacher training and curriculum support to school development and academic guidance, Kinderbee provides an integrated ecosystem designed to empower educators and transform learning.
              </p>
            </div>
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setCurrentTab('fwa')}
                className="bg-[#E1007A] hover:bg-pink-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition text-sm flex items-center gap-2"
              >
                <span>Explore Our Programs &rarr; NTT Teacher training</span>
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
              One Ecosystem Section
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
                    Launch a zero-royalty preschool franchise with a NEP 2020-aligned, play-based curriculum, comprehensive school setup support and modern early childhood education solutions.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('partnerships')}
                  className="w-full bg-[#1C1917] hover:bg-stone-800 text-white font-medium py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <span>Explore Franchise &rarr; Franchise</span>
                </button>
              </div>
            </div>

            {/* 02 - FinnishWay Academy */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between">
              <div className="w-full h-56 border-b border-stone-100">
                <SmartImage 
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Kinderbeeschools%20(6).jpeg" 
                  altContext={{ page: 'home', section: 'One Ecosystem', type: 'fwa' }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-amber-500 font-bold text-xl">02 — FinnishWay Academy</div>
                  <h3 className="text-xl font-display font-bold text-[#1C1917]">NTT & Preschool Teacher Training</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Advance your career with professional NTT (Nursery Teacher Training), ECCE and preschool teacher training programs designed around modern, child-centric and Finnish-inspired teaching methodologies.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('fwa')}
                  className="w-full bg-[#1C1917] hover:bg-stone-800 text-white font-medium py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <span>Explore NTT Teacher Training &rarr; NTT Teacher Training</span>
                </button>
              </div>
            </div>

            {/* 03 - Investor Opportunities */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between">
              <div className="w-full h-56 border-b border-stone-100">
                <SmartImage 
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Kinderbeeschools%20(8).jpeg" 
                  altContext={{ page: 'home', section: 'One Ecosystem', type: 'investor' }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-emerald-600 font-bold text-xl">03 — Investor Opportunities</div>
                  <h3 className="text-xl font-display font-bold text-[#1C1917]">Invest in Education</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Explore strategic investment opportunities in the education sector with Kinderbee. Partner with a growing education ecosystem offering scalable preschool, Cbse/IB school development, teacher training, and education business models, backed by structured systems and long-term support.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('investors')}
                  className="w-full bg-[#1C1917] hover:bg-stone-800 text-white font-medium py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <span>Explore Investment Opportunities &rarr; Investors</span>
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
                Connect with KinderBee, India’s trusted education and school development partner. Explore zero-royalty preschool franchise opportunities, CBSE school setup, NTT teacher training programs, preschool teacher training, and complete school education solutions designed for long-term growth and success.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onOpenConsultation('franchise')}
                  className="bg-[#E1007A] hover:bg-pink-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
                >
                  <span>Book a Free Consultation &rarr;</span>
                </button>

                <button
                  onClick={() => {
                    alert('Downloading NTT Teacher Training Brochure...');
                  }}
                  className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-semibold px-7 py-3.5 rounded-xl transition text-sm flex items-center gap-2 shadow-xs"
                >
                  <span>Download NTT Teacher Training Brochure &rarr;</span>
                </button>
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
      <section className="bg-stone-50 py-20 px-4 sm:px-8 border-t border-stone-200">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="text-[#E1007A] font-bold text-xs uppercase tracking-widest bg-pink-100/60 px-3 py-1 rounded-full inline-block">
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917]">
              Hbcu
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full text-left px-6 py-4 font-display font-bold text-stone-900 flex justify-between items-center gap-4 hover:bg-stone-50/50"
                  >
                    <span>{faq.question}</span>
                    <span className={`w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 transition transform ${isOpen ? 'rotate-180 bg-[#E1007A] text-white' : ''}`}>
                      &darr;
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3 animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
