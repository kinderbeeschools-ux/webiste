import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Building2, GraduationCap, School, BookOpen } from 'lucide-react';
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

  const handleTabChange = (tab: FranchiseType) => {
    setInternalSubTab(tab);
    if (onSelectSubTab) {
      onSelectSubTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs: { id: FranchiseType; label: string; icon: React.ReactNode; badge: string }[] = [
    { id: 'preschool', label: 'Franchise Preschool', icon: <School className="w-4 h-4" />, badge: 'Zero Royalty' },
    { id: 'cbse', label: 'CBSE School Setup', icon: <BookOpen className="w-4 h-4" />, badge: 'K-12 Model' },
    { id: 'ib', label: 'IB School Setup', icon: <Building2 className="w-4 h-4" />, badge: 'International' },
    { id: 'degree', label: 'Degree College Setup', icon: <GraduationCap className="w-4 h-4" />, badge: 'Higher Ed' },
  ];

  return (
    <div className="space-y-12 pb-20 bg-[#FAF9F6]">
      <SEOHead 
        title={
          activeTab === 'preschool' ? "Zero Royalty Preschool Franchise" :
          activeTab === 'cbse' ? "CBSE K-12 School Setup & Consultancy" :
          activeTab === 'ib' ? "IB World School Setup & Partnership" :
          "Degree College Setup & Consultancy"
        }
        description="Explore Kinderbee's tailored franchisee partnership models: Preschool Franchises, CBSE School Setup, IB World School Setup, and Degree College Consultancy."
        keywords="preschool franchise india, zero royalty play school, CBSE school setup, IB school setup, degree college setup"
        settings={settings}
      />

      {/* Franchise Sub-Navigation Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-[65px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto py-3 no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition duration-200 whitespace-nowrap cursor-pointer shrink-0 border ${
                    isActive
                      ? 'bg-[#E1007A] text-white border-[#E1007A] shadow-md'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-pink-100 text-[#E1007A]'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PAGE 1: PRESCHOOL FRANCHISE */}
      {activeTab === 'preschool' && (
        <div className="space-y-16 animate-fadeIn">
          {/* Hero Banner */}
          <section className="relative overflow-hidden bg-white pt-8 pb-12 px-4 sm:px-8 border-b border-stone-200">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2 space-y-5">
                <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 text-[#E1007A] text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-[#E1007A]" />
                  <span>ZERO ROYALTY PRESCHOOL FRANCHISE</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-[#1C1917] leading-tight">
                  Build a Thriving <br/>
                  <span className="text-[#E1007A]">Preschool Franchise</span>
                </h1>
                <p className="text-stone-600 text-base leading-relaxed">
                  Join India’s premier zero-royalty preschool franchise ecosystem. Combine Nordic early childhood standards with NEP 2020 frameworks to build a high-profit, child-centered school.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 border border-stone-200 rounded-xl bg-stone-50 text-center">
                    <div className="font-extrabold text-[#E1007A] text-base">₹0</div>
                    <div className="text-[11px] text-stone-600 font-medium">Royalty Fee</div>
                  </div>
                  <div className="p-3 border border-stone-200 rounded-xl bg-stone-50 text-center">
                    <div className="font-extrabold text-[#E1007A] text-base">100%</div>
                    <div className="text-[11px] text-stone-600 font-medium">Profit Retention</div>
                  </div>
                  <div className="p-3 border border-stone-200 rounded-xl bg-stone-50 text-center">
                    <div className="font-extrabold text-[#E1007A] text-base">Finnish</div>
                    <div className="text-[11px] text-stone-600 font-medium">Pedagogy</div>
                  </div>
                  <div className="p-3 border border-stone-200 rounded-xl bg-stone-50 text-center">
                    <div className="font-extrabold text-[#E1007A] text-base">Full</div>
                    <div className="text-[11px] text-stone-600 font-medium">Setup Support</div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => onOpenConsultation('preschool')}
                    className="bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-md transition text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>Book Free Consultation for Preschool Franchise &rarr;</span>
                  </button>
                </div>
              </div>

              <div className="md:w-1/2 relative flex justify-center">
                <SmartImage 
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Kinderbeeschools%20(6).jpeg" 
                  altContext={{ page: 'partnerships', section: 'preschool', type: 'mascot' }} 
                  className="w-full max-w-md object-cover rounded-3xl shadow-xl border-4 border-white" 
                />
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

      {/* PAGE 2: CBSE SCHOOL SETUP */}
      {activeTab === 'cbse' && (
        <div className="space-y-16 animate-fadeIn">
          {/* Hero Banner */}
          <section className="relative overflow-hidden bg-white pt-8 pb-12 px-4 sm:px-8 border-b border-stone-200">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2 space-y-5">
                <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>FLAGSHIP K-12 SCHOOL PARTNERSHIP</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-[#1C1917] leading-tight">
                  CBSE School Setup <br/>
                  <span className="text-[#E1007A]">& Consultancy</span>
                </h1>
                <p className="text-stone-600 text-base leading-relaxed">
                  Establish a high-quality CBSE school in India with comprehensive support for school planning, affiliation guidance, infrastructure design, teacher training, and digital admissions growth.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => onOpenConsultation('cbse')}
                    className="bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-md transition text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>Book Free Consultation for CBSE Setup &rarr;</span>
                  </button>
                </div>
              </div>

              <div className="md:w-1/2 relative flex justify-center">
                <SmartImage 
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Kinderbeeschools%20(3).jpeg" 
                  altContext={{ page: 'partnerships', section: 'cbse', type: 'school' }} 
                  className="w-full max-w-lg h-72 sm:h-96 object-cover rounded-3xl shadow-xl border-4 border-white" 
                />
              </div>
            </div>
          </section>

          {/* Core Focus & Financial Specifications */}
          <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-stone-200 space-y-6">
                <h3 className="text-2xl font-bold text-stone-900">Core CBSE School Focus</h3>
                <ul className="space-y-3 text-stone-700 text-sm">
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> CBSE-Aligned Curriculum & Syllabi</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> NEP 2020 Framework Integration</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> Student-Centric & Experiential Learning</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> STEM & Technology-Enabled Classrooms</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> Academic & Administrative Excellence</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> Complete Affiliation Documentation Support</li>
                </ul>

                <div className="pt-4 border-t border-stone-100">
                  <h4 className="font-bold text-stone-900 text-base mb-2">Suitable for:</h4>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Entrepreneurs, education investors, existing school owners, educational trusts and institutions planning to establish or upgrade a CBSE school.
                  </p>
                </div>
              </div>

              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 space-y-4">
                <h3 className="text-lg font-bold text-stone-900">Financial & Infrastructure Specifications</h3>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-xl border border-stone-200">
                    <div className="text-xs font-bold text-stone-500 uppercase">Estimated Investment</div>
                    <div className="text-xl text-[#E1007A] font-bold">₹2 Crore – ₹5 Crore+</div>
                    <div className="text-xs text-stone-500 mt-1">Investment varies depending on location, land ownership, construction, infrastructure, facilities and project scale.</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-stone-200">
                    <div className="text-xs font-bold text-stone-500 uppercase">Land Requirements</div>
                    <div className="text-sm font-semibold text-stone-800">As per CBSE affiliation & applicable local norms</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-stone-200">
                    <div className="text-xs font-bold text-stone-500 uppercase">Campus Development</div>
                    <div className="text-sm font-semibold text-stone-800">Designed according to CBSE infrastructure and safety requirements</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
              <h3 className="text-xl font-bold mb-4">Recommended CBSE School Facilities</h3>
              <ul className="space-y-2.5 text-sm text-stone-300">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Spacious Smart Classrooms</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Science & Computer Laboratories</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Mathematics Laboratory</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Library & Reading Centre</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> STEM / Innovation Lab</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Indoor & Outdoor Sports Facilities</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Multipurpose Activity Hall</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Principal & Administrative Offices</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Teacher Resource Centre</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Safe & Child-Friendly Washrooms</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> CCTV & Campus Security</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Medical / First-Aid Facility</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Parent Interaction Area</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Digital Smart-Class Infrastructure</li>
              </ul>
              <div className="pt-4 border-t border-stone-800">
                <button
                  onClick={() => onOpenConsultation('cbse')}
                  className="w-full bg-[#E1007A] hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl transition text-sm cursor-pointer"
                >
                  Consult Our CBSE Planning Team
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* PAGE 3: IB SCHOOL SETUP */}
      {activeTab === 'ib' && (
        <div className="space-y-16 animate-fadeIn">
          {/* Hero Banner */}
          <section className="relative overflow-hidden bg-white pt-8 pb-12 px-4 sm:px-8 border-b border-stone-200">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2 space-y-5">
                <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>INTERNATIONAL SCHOOL PARTNERSHIP</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-[#1C1917] leading-tight">
                  IB World School <br/>
                  <span className="text-[#E1007A]">Setup & Partnership</span>
                </h1>
                <p className="text-stone-600 text-base leading-relaxed">
                  Establish a premium IB World School in India with strategic support for international curriculum development, school planning, academic systems, teacher development, and global accreditation.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => onOpenConsultation('ib')}
                    className="bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-md transition text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>Book Free Consultation for IB Setup &rarr;</span>
                  </button>
                </div>
              </div>

              <div className="md:w-1/2 relative flex justify-center">
                <SmartImage 
                  src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800" 
                  altContext={{ page: 'partnerships', section: 'ib', type: 'school' }} 
                  className="w-full max-w-lg h-72 object-cover rounded-3xl shadow-xl border-4 border-white" 
                />
              </div>
            </div>
          </section>

          {/* Core IB Focus & Specifications */}
          <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-stone-200 space-y-6">
                <h3 className="text-2xl font-bold text-stone-900">Core IB School Focus</h3>
                <ul className="space-y-3 text-stone-700 text-sm">
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> International Baccalaureate (IB) Curriculum</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> Inquiry-Based & Project-Based Learning</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> Student-Centred Global Education</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> Critical Thinking & Problem Solving</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> International Mindedness & Multilingualism</li>
                </ul>

                <div className="pt-4 border-t border-stone-100">
                  <h4 className="font-bold text-stone-900 text-base mb-2">Suitable for:</h4>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Education entrepreneurs, investors, educational trusts, existing school owners and institutions planning to establish or transform into an international school.
                  </p>
                </div>
              </div>

              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 space-y-4">
                <h3 className="text-lg font-bold text-stone-900">Financial & Infrastructure Specifications</h3>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-xl border border-stone-200">
                    <div className="text-xs font-bold text-stone-500 uppercase">Estimated Investment</div>
                    <div className="text-xl text-[#E1007A] font-bold">₹5 Crore – ₹15 Crore+</div>
                    <div className="text-xs text-stone-500 mt-1">Investment varies based on location, land, campus scale, infrastructure, facilities and selected IB programme.</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-stone-200">
                    <div className="text-xs font-bold text-stone-500 uppercase">Land Requirements</div>
                    <div className="text-sm font-semibold text-stone-800">Based on campus plan & applicable local regulations</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-stone-200">
                    <div className="text-xs font-bold text-stone-500 uppercase">Campus Development</div>
                    <div className="text-sm font-semibold text-stone-800">Designed for international-standard learning environments</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold mb-4 text-[#1C1917]">Recommended IB School Facilities</h3>
              <ul className="space-y-3 text-sm text-stone-700">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Modern Smart Classrooms</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Science & Computer Laboratories</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Innovation & STEM Labs</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> International Standard Library</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Art & Performing Arts Studios</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Indoor & Outdoor Sports Facilities</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Multipurpose Activity Centre</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Collaborative Learning Spaces</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Language Learning Rooms</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Student Wellness & Counselling Centre</li>
              </ul>
              <div className="pt-4 border-t border-stone-100">
                <button
                  onClick={() => onOpenConsultation('ib')}
                  className="w-full bg-[#E1007A] hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl transition text-sm cursor-pointer"
                >
                  Consult Our IB Advisory Board
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* PAGE 4: DEGREE COLLEGE SETUP */}
      {activeTab === 'degree' && (
        <div className="space-y-16 animate-fadeIn">
          {/* Hero Banner */}
          <section className="relative overflow-hidden bg-white pt-8 pb-12 px-4 sm:px-8 border-b border-stone-200">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2 space-y-5">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>HIGHER EDUCATION PARTNERSHIP</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-[#1C1917] leading-tight">
                  Degree College Setup <br/>
                  <span className="text-[#E1007A]">& Consultancy</span>
                </h1>
                <p className="text-stone-600 text-base leading-relaxed">
                  Establish or transform a degree college in India with comprehensive support for higher education planning, university affiliation, academic development, infrastructure, compliance, faculty training, student admissions, and digital transformation.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => onOpenConsultation('degree')}
                    className="bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-md transition text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>Book Free Consultation for College Setup &rarr;</span>
                  </button>
                </div>
              </div>

              <div className="md:w-1/2 relative flex justify-center">
                <SmartImage 
                  src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800" 
                  altContext={{ page: 'partnerships', section: 'degree', type: 'college' }} 
                  className="w-full max-w-lg h-72 object-cover rounded-3xl shadow-xl border-4 border-white" 
                />
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
