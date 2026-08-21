import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Award, TrendingUp, BookOpen, Users, Building, Play, Star } from 'lucide-react';
import { BlogPost, FAQItem } from '../types';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  onOpenConsultation: (type?: string) => void;
  blogs: BlogPost[];
  faqs: FAQItem[];
  onSelectBlog: (blog: BlogPost) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentTab, onOpenConsultation, blogs, faqs, onSelectBlog }) => {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  return (
    <div className="space-y-10 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-950 text-white pt-16 pb-20 px-4 sm:px-8 min-h-[70vh] flex items-center justify-center text-center">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-75 scale-105"
            src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Video/banner%20Video.mp4"
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-stone-950/50 backdrop-brightness-75"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10 space-y-6 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 bg-stone-900/80 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-lg backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>THE FUTURE OF EDUCATION STARTS HERE</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-serif-title font-normal tracking-tight leading-[1.15] text-white">
            Reimagine Education.<br />
            <span className="italic font-serif-title text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 font-medium">Transform Tomorrow.</span>
          </h1>

          <p className="text-stone-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed mx-auto">
            A future-ready education ecosystem empowering schools, educators and young minds through innovation, excellence and transformative learning.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenConsultation('franchise')}
              className="bg-white hover:bg-stone-100 text-stone-900 font-semibold px-8 py-4 rounded-full shadow-2xl transition duration-300 text-base flex items-center gap-3 group"
            >
              <span>Explore KIPS &rarr;</span>
            </button>

            <button
              onClick={() => onOpenConsultation('franchise')}
              className="bg-stone-900/70 hover:bg-stone-900 text-stone-200 font-semibold px-8 py-4 rounded-full border border-stone-600 transition duration-300 text-base flex items-center gap-2 backdrop-blur-md shadow-xl"
            >
              <span>Talk to Our Experts</span>
            </button>
          </div>

        </div>
      </section>

      {/* Why Choose KIPS (Zero Royalty Advantage) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-block text-[#E1007A] font-bold text-xs uppercase tracking-widest bg-[#E1007A]/10 px-3 py-1 rounded-full">
            The KIPS Economic Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917]">
            Why Traditional Franchises Fail Partners — And How KIPS Succeeds
          </h2>
          <p className="text-stone-600 text-base">
            Most preschool networks drain 15% to 25% of your monthly fee revenues in recurring royalties. KinderBee operates on a transparent, 100% Zero Royalty structure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-xl transition duration-300 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 text-[#E1007A] flex items-center justify-center font-bold text-xl">
              0%
            </div>
            <h3 className="font-display font-bold text-xl text-[#1C1917]">100% Zero Royalty Retention</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Every rupee of tuition fee you collect stays with your school. Reinvest earnings into your faculty, facility upgrades, and local marketing for explosive growth.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-stone-700 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Keep all monthly fee collections</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Faster capital break-even (18 mos)</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-xl transition duration-300 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
              🇫🇮
            </div>
            <h3 className="font-display font-bold text-xl text-[#1C1917]">Finnish Way Academy Pedagogy</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              World-renowned Nordic early childhood framework. Active play, emotional self-regulation, and holistic inquiry-based modules that outperform rote memorization.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-stone-700 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Certified teacher training diplomas</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Complete bilingual curriculum toolkits</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-xl transition duration-300 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
              🏛️
            </div>
            <h3 className="font-display font-bold text-xl text-[#1C1917]">End-to-End School Setup</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              From site feasibility and architectural floor planning to teacher recruitment and digital marketing admission campaigns, our central team guides every step.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-stone-700 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> CBSE / K-12 setup consultancy</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Complete operational manuals</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Partnership Model Highlights */}
      <section className="bg-stone-100 py-20 px-4 sm:px-8 border-y border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-2">
              <div className="text-[#E1007A] font-bold text-xs uppercase tracking-widest bg-pink-100/60 px-3 py-1 rounded-full inline-block">
                Tailored Pathways
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917]">
                Choose Your Educational Partnership Model
              </h2>
            </div>
            <button
              onClick={() => setCurrentTab('partnerships')}
              className="text-[#E1007A] hover:text-pink-700 font-semibold text-sm flex items-center gap-2"
            >
              <span>View All Detailed Specifications</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-[#E1007A]/10 text-[#E1007A] flex items-center justify-center font-bold">
                    01
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-2xl font-display font-bold text-[#1C1917]">KinderBee Preschool Franchise</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Ideal for entrepreneurs and women educators looking to launch a premium preschool in a 2,000–3,500 sq ft residential property. Zero ongoing royalties.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-medium text-stone-700">
                  <div className="bg-stone-50 p-3 rounded-xl">
                    <span className="text-stone-400 block mb-0.5">Investment</span>
                    <span className="font-bold text-stone-900">₹15L - ₹30L</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl">
                    <span className="text-stone-400 block mb-0.5">Space Required</span>
                    <span className="font-bold text-stone-900">2,000+ sq.ft</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onOpenConsultation('franchise')}
                className="w-full bg-[#1C1917] hover:bg-stone-800 text-white font-medium py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                <span>Inquire About Preschool Franchise</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                    02
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                    Trusts & Investors
                  </span>
                </div>
                <h3 className="text-2xl font-display font-bold text-[#1C1917]">CBSE / K-12 School Setup</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Comprehensive consultancy for trusts and landowners building full-scale K-12 campuses. Land approvals, curriculum mapping, and staff recruitment.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-medium text-stone-700">
                  <div className="bg-stone-50 p-3 rounded-xl">
                    <span className="text-stone-400 block mb-0.5">Investment</span>
                    <span className="font-bold text-stone-900">₹1 Crore+</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl">
                    <span className="text-stone-400 block mb-0.5">Space Required</span>
                    <span className="font-bold text-stone-900">1+ Acre Campus</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onOpenConsultation('investor')}
                className="w-full bg-[#1C1917] hover:bg-stone-800 text-white font-medium py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                <span>Inquire About CBSE School Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Latest Insights & Blogs */}
      {blogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-2">
              <div className="text-[#E1007A] font-bold text-xs uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block">
                Educational Leadership
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917]">
                Latest Insights & Nordic Pedagogy Guides
              </h2>
            </div>
            <button
              onClick={() => setCurrentTab('blogs')}
              className="text-[#E1007A] hover:text-pink-700 font-semibold text-sm flex items-center gap-2"
            >
              <span>View All Articles ({blogs.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.slice(0, 3).map((blog) => (
              <div 
                key={blog.id} 
                onClick={() => onSelectBlog(blog)}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition duration-300 cursor-pointer flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#1C1917] font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow">
                    {blog.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs text-stone-400 font-medium">{blog.date} &bull; {blog.readTime}</div>
                    <h3 className="font-display font-bold text-lg text-[#1C1917] line-clamp-2 hover:text-[#E1007A] transition">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
                    <span>By {blog.author}</span>
                    <span className="text-[#E1007A] font-semibold flex items-center gap-1">Read Article &rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-white p-2">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
                  alt="KinderBee Campus" 
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
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
              Everything You Need to Know About KIPS Partnership
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
