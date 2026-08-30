import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SmartImage } from '../components/SmartImage';
import { SystemSettings } from '../types';

interface PartnershipsPageProps {
  onOpenConsultation: (type?: string) => void;
  settings?: SystemSettings | null;
}

export const PartnershipsPage: React.FC<PartnershipsPageProps> = ({ onOpenConsultation, settings }) => {
  return (
    <div className="space-y-20 pb-20 bg-[#FAF9F6]">
      <SEOHead 
        title="Partnership Models"
        description="Explore Kinderbee preschool franchise tiers, CBSE, IB, and Degree College institutional consultancy models."
        keywords="preschool franchise india, zero royalty play school, CBSE school setup, IB school, degree college setup"
        settings={settings}
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-10 px-4 sm:px-8 border-b border-stone-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 space-y-5">
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-[#E1007A] leading-tight">
              Our Collaborative <br/><span className="text-[#1C1917]">Education Models</span>
            </h1>
            <p className="text-base text-stone-600 leading-relaxed">
              From high-profit Preschool Franchises to comprehensive CBSE School Setup and existing school upgrades, explore our zero-royalty partnership pathways.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="flex flex-col items-center justify-center p-3 border border-stone-200 rounded-xl bg-white shadow-xs">
                <span className="font-bold text-[#E1007A]">Proven Models</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 border border-stone-200 rounded-xl bg-white shadow-xs">
                <span className="font-bold text-[#E1007A]">High Returns</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 border border-stone-200 rounded-xl bg-white shadow-xs">
                <span className="font-bold text-[#E1007A]">Zero Royalty</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 border border-stone-200 rounded-xl bg-white shadow-xs">
                <span className="font-bold text-[#E1007A]">End-to-End Support</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 relative flex justify-center">
             <SmartImage src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800" altContext={{page:'partnerships',section:'hero',type:'school'}} className="w-full max-w-lg object-contain rounded-3xl" />
             <div className="absolute -bottom-6 right-0 bg-white p-4 rounded-xl shadow-xl border border-stone-100 transform rotate-3">
               <div className="text-center">
                 <div className="font-bold text-[#1C1917] text-lg">ZERO ROYALTY</div>
                 <div className="text-[#E1007A] font-semibold text-xs">STRONG PARTNERSHIP</div>
                 <div className="text-stone-500 text-[10px]">LASTING IMPACT</div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* What You Receive As a KIPS Partner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
          <h2 className="text-xl font-bold text-[#E1007A] mb-6">What You Receive As a KIPS Partner:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span className="text-sm font-semibold text-stone-700">Official Brand License</span></div>
            <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span className="text-sm font-semibold text-stone-700">Custom Local Curriculum</span></div>
            <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span className="text-sm font-semibold text-stone-700">Staff Recruitment Guides</span></div>
            <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span className="text-sm font-semibold text-stone-700">Comprehensive Training</span></div>
            <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span className="text-sm font-semibold text-stone-700">School Design Blueprint</span></div>
            <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span className="text-sm font-semibold text-stone-700">SEO-Optimized Micro-Websites</span></div>
            <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span className="text-sm font-semibold text-stone-700">Admissions Playbooks</span></div>
            <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span className="text-sm font-semibold text-stone-700">School Management ERP</span></div>
            <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span className="text-sm font-semibold text-stone-700">Continuous Quality Audits</span></div>
            <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span className="text-sm font-semibold text-stone-700">Franchise Operations Manual</span></div>
            <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span className="text-sm font-semibold text-stone-700">Monthly Marketing Campaigns</span></div>
            <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span className="text-sm font-semibold text-stone-700">Mentorship Advisory Support</span></div>
          </div>
        </div>
      </section>

      {/* Preschool Education */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-center bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-stone-200">
          <div className="md:w-1/2">
             <SmartImage src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" altContext={{page:'partnerships',section:'preschool',type:'mascot'}} className="w-full object-contain rounded-2xl" />
          </div>
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl font-display font-extrabold text-[#1C1917]">
              Core Preschool Education
            </h2>
            <ul className="space-y-3 text-stone-700 font-medium">
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#E1007A]"></span> Play-Based Learning</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#E1007A]"></span> NEP 2020-Aligned Curriculum</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#E1007A]"></span> Experiential Early Childhood Education</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#E1007A]"></span> Holistic Child Development</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#E1007A]"></span> STEM & Activity-Based Learning</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#E1007A]"></span> Social & Emotional Learning</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#E1007A]"></span> Life Skills Development</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#E1007A]"></span> Finnish-Inspired Early Learning</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CBSE School Setup */}
      <section className="bg-white py-16 px-4 sm:px-8 border-y border-stone-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="text-[#E1007A] font-bold text-xs uppercase tracking-widest">FLAGSHIP SCHOOL PARTNERSHIP MODEL</div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917]">CBSE School Setup & Partnership</h2>
            <p className="text-stone-600 max-w-3xl mx-auto">
              Establish a high-quality CBSE school in India with comprehensive support for school planning, curriculum development, infrastructure, compliance, teacher training and digital growth.
            </p>
          </div>
          <div className="flex justify-center mb-10">
            <SmartImage src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" altContext={{page:'partnerships',section:'cbse',type:'school'}} className="w-full max-w-4xl h-80 object-cover rounded-3xl shadow-lg" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-stone-900">Core CBSE School Focus</h3>
              <ul className="space-y-2 text-stone-700">
                <li>• CBSE-Aligned Curriculum</li>
                <li>• NEP 2020-Based Education</li>
                <li>• Student-Centric Learning</li>
                <li>• Experiential & Activity-Based Learning</li>
                <li>• STEM & Technology Integration</li>
                <li>• Holistic Student Development</li>
                <li>• Academic & Administrative Excellence</li>
              </ul>
              
              <h3 className="text-xl font-bold text-stone-900 mt-6 pt-4 border-t border-stone-100">Suitable for:</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Entrepreneurs, education investors, existing school owners, educational trusts and institutions planning to establish or upgrade a CBSE school.
              </p>
              
              <h3 className="text-xl font-bold text-stone-900 mt-6 pt-4 border-t border-stone-100">Financial & Infrastructure Specifications</h3>
              <div className="space-y-3">
                <div className="bg-stone-50 p-4 rounded-xl">
                  <div className="text-sm font-bold text-stone-900">ESTIMATED INVESTMENT</div>
                  <div className="text-lg text-[#E1007A] font-bold">₹2 Crore – ₹5 Crore+</div>
                  <div className="text-xs text-stone-500 mt-1">Investment varies depending on location, land ownership, construction, infrastructure, facilities and project scale.</div>
                </div>
                <div className="bg-stone-50 p-4 rounded-xl">
                  <div className="text-sm font-bold text-stone-900">LAND REQUIREMENTS</div>
                  <div className="text-sm text-stone-600">As per CBSE affiliation & applicable local norms</div>
                </div>
                <div className="bg-stone-50 p-4 rounded-xl">
                  <div className="text-sm font-bold text-stone-900">CAMPUS DEVELOPMENT</div>
                  <div className="text-sm text-stone-600">Designed according to CBSE infrastructure and safety requirements</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="bg-stone-900 text-white p-8 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold mb-4">Recommended CBSE School Facilities</h3>
                <ul className="space-y-2 text-sm text-stone-300">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Spacious Smart Classrooms</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Science & Computer Laboratories</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Mathematics Laboratory</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Library & Reading Centre</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> STEM / Innovation Lab</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Indoor & Outdoor Sports Facilities</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Multipurpose Activity Hall</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Principal & Administrative Offices</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Teacher Resource Centre</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Safe & Child-Friendly Washrooms</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> CCTV & Campus Security</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Medical / First-Aid Facility</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Parent Interaction Area</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Digital Smart-Class Infrastructure</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Adequate Playground & Green Spaces</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-stone-900 border-b border-stone-200 pb-2">Complete CBSE School Support</h3>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">School Planning & Setup</h4>
                  <p className="text-sm text-stone-600">Strategic support from concept development to campus planning.</p>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">CBSE Compliance Guidance</h4>
                  <p className="text-sm text-stone-600">Assistance with documentation, infrastructure planning and affiliation-related requirements.</p>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Curriculum & Academic Support</h4>
                  <p className="text-sm text-stone-600">CBSE-aligned curriculum planning, academic systems and learning frameworks.</p>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Teacher Training & NTT Programs</h4>
                  <p className="text-sm text-stone-600">Professional development through teacher training, NTT and ECCE programs.</p>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Website, CRM & Digital Marketing</h4>
                  <p className="text-sm text-stone-600">Dedicated support for school website development, admission CRM, SEO, social media marketing and digital marketing to strengthen your school's online presence and generate admissions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IB School Setup */}
      <section className="bg-[#FAF9F6] py-16 px-4 sm:px-8 border-b border-stone-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="text-[#E1007A] font-bold text-xs uppercase tracking-widest">FLAGSHIP INTERNATIONAL SCHOOL PARTNERSHIP MODEL</div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917]">IB School Setup & Partnership</h2>
            <p className="text-stone-600 max-w-3xl mx-auto">
              Establish a premium IB World School in India with strategic support for international curriculum development, school planning, academic systems, teacher development, infrastructure and digital transformation.
            </p>
          </div>
          <div className="flex justify-center mb-10">
            <SmartImage src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800" altContext={{page:'partnerships',section:'ib',type:'school'}} className="w-full max-w-4xl h-80 object-cover rounded-3xl shadow-lg" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-stone-900">Core IB School Focus</h3>
              <ul className="space-y-2 text-stone-700">
                <li>• International Baccalaureate (IB) Curriculum</li>
                <li>• Inquiry-Based Learning</li>
                <li>• Student-Centred Education</li>
                <li>• Experiential & Project-Based Learning</li>
                <li>• Global-Mindedness & International Education</li>
                <li>• Critical Thinking & Problem-Solving</li>
                <li>• Holistic Student Development</li>
              </ul>
              
              <h3 className="text-xl font-bold text-stone-900 mt-6 pt-4 border-t border-stone-100">Suitable for:</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Education entrepreneurs, investors, educational trusts, existing school owners and institutions planning to establish or transform into an international school.
              </p>
              
              <h3 className="text-xl font-bold text-stone-900 mt-6 pt-4 border-t border-stone-100">Financial & Infrastructure Specifications</h3>
              <div className="space-y-3">
                <div className="bg-white border border-stone-200 p-4 rounded-xl">
                  <div className="text-sm font-bold text-stone-900">ESTIMATED INVESTMENT</div>
                  <div className="text-lg text-[#E1007A] font-bold">₹5 Crore – ₹15 Crore+</div>
                  <div className="text-xs text-stone-500 mt-1">Investment varies based on location, land, campus scale, infrastructure, facilities and selected IB programme.</div>
                </div>
                <div className="bg-white border border-stone-200 p-4 rounded-xl">
                  <div className="text-sm font-bold text-stone-900">LAND REQUIREMENTS</div>
                  <div className="text-sm text-stone-600">Based on campus plan & applicable local regulations</div>
                </div>
                <div className="bg-white border border-stone-200 p-4 rounded-xl">
                  <div className="text-sm font-bold text-stone-900">CAMPUS DEVELOPMENT</div>
                  <div className="text-sm text-stone-600">Designed for international-standard learning environments and institutional requirements</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
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
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Teacher Resource & Planning Centre</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Child-Friendly Washrooms</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> CCTV & Campus Security</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Medical / First-Aid Facility</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Digital Learning Infrastructure</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#E1007A] shrink-0" /> Sustainable & Green Learning Spaces</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Degree College Setup */}
      <section className="bg-white py-16 px-4 sm:px-8 border-b border-stone-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="text-[#E1007A] font-bold text-xs uppercase tracking-widest">FLAGSHIP HIGHER EDUCATION PARTNERSHIP MODEL</div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917]">Degree College Setup & Consultancy</h2>
            <p className="text-stone-600 max-w-3xl mx-auto">
              Establish or transform a degree college in India with comprehensive support for higher education planning, university affiliation, academic development, infrastructure, compliance, faculty training, student admissions and digital transformation.
            </p>
          </div>
          <div className="flex justify-center mb-10">
            <SmartImage src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800" altContext={{page:'partnerships',section:'degree',type:'college'}} className="w-full max-w-4xl h-80 object-cover rounded-3xl shadow-lg" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-stone-900">Core Degree College Focus</h3>
              <ul className="space-y-2 text-stone-700">
                <li>• UG & PG Degree Programs</li>
                <li>• University Affiliation Support</li>
                <li>• Academic & Curriculum Planning</li>
                <li>• Higher Education Compliance</li>
                <li>• Industry-Oriented Programs</li>
                <li>• Student-Centric Learning</li>
                <li>• Career & Employability Development</li>
                <li>• Digital & Technology-Enabled Education</li>
              </ul>
              
              <h3 className="text-xl font-bold text-stone-900 mt-6 pt-4 border-t border-stone-100">Suitable for:</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Education entrepreneurs, investors, educational trusts, existing institutions and organizations planning to establish or expand a degree college or higher education institution.
              </p>
              
              <h3 className="text-xl font-bold text-stone-900 mt-6 pt-4 border-t border-stone-100">Financial & Infrastructure Specifications</h3>
              <div className="space-y-3">
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                  <div className="text-sm font-bold text-stone-900">ESTIMATED INVESTMENT</div>
                  <div className="text-lg text-[#E1007A] font-bold">₹5 Crore – ₹15 Crore+</div>
                  <div className="text-xs text-stone-500 mt-1">Investment varies based on location, land, campus size, infrastructure, courses offered and applicable regulatory requirements.</div>
                </div>
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                  <div className="text-sm font-bold text-stone-900">LAND & CAMPUS REQUIREMENTS</div>
                  <div className="text-sm text-stone-600">Based on university, regulatory and local requirements</div>
                </div>
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                  <div className="text-sm font-bold text-stone-900">CAMPUS DEVELOPMENT</div>
                  <div className="text-sm text-stone-600">Planned according to applicable higher education infrastructure and institutional standards</div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1C1917] text-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold mb-4">Recommended Degree College Facilities</h3>
              <ul className="space-y-3 text-sm text-stone-300">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Smart Classrooms</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Computer & Advanced Laboratories</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Central Library & Digital Library</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Seminar & Conference Hall</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Department Offices</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Faculty Development Centre</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Innovation & Entrepreneurship Centre</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Placement & Career Development Cell</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Student Activity & Clubs Centre</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Sports & Recreation Facilities</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Student Counselling & Wellness Centre</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Administrative & Admissions Office</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Digital Learning Infrastructure</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Campus Wi-Fi & Technology Systems</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Safe & Accessible Campus Facilities</li>
              </ul>
              
              <div className="mt-8 pt-6 border-t border-stone-800 text-center">
                <button
                  onClick={() => onOpenConsultation('investor')}
                  className="bg-[#FFD400] hover:bg-amber-400 text-stone-900 font-bold px-8 py-3.5 rounded-xl transition shadow-md w-full"
                >
                  Begin your partnership registration - Partner with us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

