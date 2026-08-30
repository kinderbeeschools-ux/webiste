import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SmartImage } from '../components/SmartImage';
import { SystemSettings } from '../types';

interface FwaPageProps {
  onOpenConsultation: (type?: string) => void;
  settings?: SystemSettings | null;
}

export const FwaPage: React.FC<FwaPageProps> = ({ onOpenConsultation, settings }) => {
  return (
    <div className="space-y-20 pb-20 bg-[#FAF9F6]">
      <SEOHead 
        title="Academics & Programs"
        description="Explore Kinderbee's Toddler, Pre-K, Kindergarten programs and NTT Teacher Training Certification."
        keywords="preschool programs, toddler, pre-k, kindergarten, NTT teacher training, early childhood education"
        settings={settings}
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#200213] via-[#12010B] to-[#1F0214] text-white py-16 px-4 sm:px-8 border-b border-pink-950/40">
        {/* Glow & Atmospheric Brand Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#E1007A_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-15"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,0,122,0.28),transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,212,0,0.14),transparent_50%)]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-stone-900/80 border border-[#E1007A]/50 text-pink-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD400]" />
              <span>THE KINDERBEE APPROACH</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
              Learning Through Play. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] via-pink-300 to-[#E1007A]">Growing Through Joy.</span>
            </h1>
            <p className="text-base sm:text-lg text-pink-100/80 max-w-2xl font-normal leading-relaxed">
              Every child is unique. Our holistic approach blends active inquiry, creativity, and foundational academics to build confident, lifelong learners.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onOpenConsultation('admissions')}
                className="bg-[#E1007A] hover:bg-pink-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-pink-900/30 hover:scale-[1.02] transition duration-300 text-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Enroll Now &rarr;</span>
              </button>
              <button
                onClick={() => { document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/25 transition duration-300 text-sm flex items-center gap-2 backdrop-blur-md cursor-pointer"
              >
                <span>Learn More</span>
              </button>
            </div>
          </div>

          <div className="lg:w-1/2 relative flex justify-center">
            <SmartImage 
              src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Kinderbeeschools%20(3).jpeg" 
              altContext={{ page: 'academics', section: 'hero', type: 'kids learning' }} 
              className="w-full max-w-md h-80 sm:h-96 object-cover rounded-3xl shadow-2xl border-4 border-white/20" 
            />
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section id="programs" className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-extrabold text-[#1C1917]">Our Programs</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Toddler Program */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col sm:flex-row">
            <div className="sm:w-2/5 shrink-0">
              <SmartImage src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Kinderbeeschools%20(3).jpeg" altContext={{page:'academics',section:'toddler',type:'toddlers playing'}} className="w-full h-full min-h-[250px] object-cover" />
            </div>
            <div className="p-8 sm:w-3/5 space-y-4">
              <div className="text-[#E1007A] font-bold text-xs uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block">1.5 - 2.5 Years</div>
              <h3 className="text-2xl font-display font-extrabold text-[#1C1917]">Toddler Program</h3>
              <ul className="space-y-2 text-stone-600 text-sm">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#E1007A] mt-1.5 shrink-0"></span> Sensory Exploration & Play</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#E1007A] mt-1.5 shrink-0"></span> Basic Motor Skill Development</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#E1007A] mt-1.5 shrink-0"></span> Emotional & Social Comfort</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#E1007A] mt-1.5 shrink-0"></span> Language & Communication Basics</li>
              </ul>
            </div>
          </div>
          
          {/* Pre-K Program */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col sm:flex-row">
            <div className="sm:w-2/5 shrink-0">
              <SmartImage src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600" altContext={{page:'academics',section:'pre-k',type:'kids in classroom'}} className="w-full h-full min-h-[250px] object-cover" />
            </div>
            <div className="p-8 sm:w-3/5 space-y-4">
              <div className="text-amber-600 font-bold text-xs uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full inline-block">2.5 - 3.5 Years</div>
              <h3 className="text-2xl font-display font-extrabold text-[#1C1917]">Pre-K Program</h3>
              <ul className="space-y-2 text-stone-600 text-sm">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span> Early Phonics & Numeracy</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span> Fine & Gross Motor Control</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span> Social Cooperation Skills</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span> Creative Arts & Expression</li>
              </ul>
            </div>
          </div>
          
          {/* Kindergarten */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col sm:flex-row">
            <div className="sm:w-2/5 shrink-0">
              <SmartImage src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600" altContext={{page:'academics',section:'kindergarten',type:'kids learning'}} className="w-full h-full min-h-[250px] object-cover" />
            </div>
            <div className="p-8 sm:w-3/5 space-y-4">
              <div className="text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full inline-block">3.5 - 5.5 Years</div>
              <h3 className="text-2xl font-display font-extrabold text-[#1C1917]">Kindergarten</h3>
              <ul className="space-y-2 text-stone-600 text-sm">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span> School Readiness & Advanced Literacy</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span> Mathematics & Problem Solving</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span> Critical Thinking & Independence</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span> Environmental & Cultural Awareness</li>
              </ul>
            </div>
          </div>
          
          {/* Teacher Training (NTT) */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col sm:flex-row">
            <div className="sm:w-2/5 shrink-0">
              <SmartImage src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600" altContext={{page:'academics',section:'ntt',type:'teacher training'}} className="w-full h-full min-h-[250px] object-cover" />
            </div>
            <div className="p-8 sm:w-3/5 space-y-4">
              <div className="text-purple-600 font-bold text-xs uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full inline-block">Professional Certification</div>
              <h3 className="text-2xl font-display font-extrabold text-[#1C1917]">Teacher Training (NTT)</h3>
              <ul className="space-y-2 text-stone-600 text-sm">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span> Early Childhood Pedagogy Mastery</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span> Play-Based & Experiential Learning</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span> Child Psychology & Behavior Management</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span> NEP 2020 Aligned Curriculum Strategies</li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onOpenConsultation('fwa_course')}
                  className="text-purple-600 font-bold text-sm flex items-center gap-1 hover:text-purple-800 transition"
                >
                  Join NTT Program <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </section>

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
