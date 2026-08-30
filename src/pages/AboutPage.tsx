import React from 'react';
import { Sparkles, CheckCircle2, Award, Users, Globe, Target } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SmartImage } from '../components/SmartImage';
import { SystemSettings } from '../types';

interface AboutPageProps {
  onOpenConsultation: () => void;
  settings?: SystemSettings | null;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenConsultation, settings }) => {
  return (
    <div className="space-y-20 pb-20">
      {/* Dynamic SEO Meta via React Helmet */}
      <SEOHead 
        title="About Us & Finnish Educational Heritage"
        description="Learn how KinderBee and FinnishWay Academy are transforming Indian preschool education through zero-royalty partnership models, faculty training, and active play curricula."
        keywords="about kinderbee, finnish education heritage, zero royalty preschool founders, NEP 2020 compliance"
        settings={settings}
      />
      
      
      {/* Story & Philosophy */}
      <section id="story" className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="text-[#E1007A] font-bold text-xs uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block">
            OUR JOURNEY & CORE MISSION
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917]">
            Nurturing Young Minds. Shaping Bright Futures.
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Kinderbee Preschool is committed to delivering high-quality early childhood education through play-based learning, innovative teaching practices, and a child-centric approach. We empower children, educators, and preschool entrepreneurs to build a strong foundation for lifelong learning.
          </p>
          <p className="text-stone-600 text-base leading-relaxed">
            With a commitment to early childhood education, Kinderbee Preschool creates nurturing, engaging and future-ready learning environments where children can learn, explore and grow. Our approach combines play-based learning, child-centric teaching, Finnish-inspired education and NEP 2020-aligned practices to give every child a strong foundation for lifelong learning.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <div className="text-2xl font-display font-black text-[#E1007A]">0%</div>
              <div className="text-xs text-stone-600 font-semibold uppercase tracking-wider">ROYALTY FEES</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <div className="text-2xl font-display font-black text-amber-500">30+</div>
              <div className="text-xs text-stone-600 font-semibold uppercase tracking-wider">YEARS OF LEGACY</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-br from-[#E1007A] to-amber-500 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-xl bg-white">
            <SmartImage
              src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Kinderbeeschools%20(2).jpeg"
              altContext={{ page: 'about', section: 'Interactive Finnish Early Learning Classroom', type: 'classroom' }}
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* What Makes Kinderbee Different */}
      <section className="bg-stone-50 py-20 px-4 sm:px-8 border-y border-stone-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-display font-extrabold text-[#1C1917]">
              What Makes Kinderbee Preschool Different?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-stone-900 mb-1">Play-Based Learning</h4>
                <p className="text-stone-600 text-sm">Engaging activities that develop creativity, curiosity and confidence.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-stone-900 mb-1">Finnish-Inspired Curriculum</h4>
                <p className="text-stone-600 text-sm">Modern early learning practices focused on holistic child development.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-stone-900 mb-1">Expert Teacher Training</h4>
                <p className="text-stone-600 text-sm">Professional preschool teacher training and NTT programs that empower educators with effective teaching methodologies.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-stone-900 mb-1">Holistic Development</h4>
                <p className="text-stone-600 text-sm">Supporting children's cognitive, social, emotional, physical and language development.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-stone-900 mb-1">Safe & Nurturing Environment</h4>
                <p className="text-stone-600 text-sm">Creating a welcoming preschool environment where every child feels valued and encouraged.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center items-center gap-4 sm:gap-8 font-bold text-stone-700 text-sm">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> NEP 2020 Aligned</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> Finnish-Inspired Learning</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> Child-Centric Education</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
        <div className="text-center mb-12">
          <div className="text-[#E1007A] font-bold text-xs uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block mb-3">
            Voices of Success
          </div>
          <h2 className="text-3xl font-display font-extrabold text-[#1C1917]">
            Testimonials
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm relative">
            <div className="text-6xl text-pink-100 font-serif absolute top-4 left-6">"</div>
            <p className="text-stone-700 leading-relaxed relative z-10 italic mb-6">
              I always wanted to start a preschool, but I didn't know where to begin. Kinderbee gave me more than a franchise model—it gave me a roadmap, a support system and the confidence to build something meaningful for children.
            </p>
            <div className="font-bold text-[#1C1917]">— Meera Krishnan</div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm relative">
            <div className="text-6xl text-pink-100 font-serif absolute top-4 left-6">"</div>
            <p className="text-stone-700 leading-relaxed relative z-10 italic mb-6">
              Kinderbee helped us understand that a preschool is not just a building—it is a child's first learning world. Their approach helped us create a space where children can explore, learn and grow happily.
            </p>
            <div className="font-bold text-[#1C1917]">— Divya Narayanan</div>
            <div className="text-xs text-stone-500 font-semibold">Kinderbee Franchise Partner | Madurai</div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm relative">
            <div className="text-6xl text-pink-100 font-serif absolute top-4 left-6">"</div>
            <p className="text-stone-700 leading-relaxed relative z-10 italic mb-6">
              The NTT program helped me understand that teaching young children is not simply about lessons—it is about patience, creativity and understanding every child. I now feel ready to step into a classroom with confidence.
            </p>
            <div className="font-bold text-[#1C1917]">— Ananya Suresh</div>
            <div className="text-xs text-stone-500 font-semibold">NTT Graduate | Madurai</div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm relative">
            <div className="text-6xl text-pink-100 font-serif absolute top-4 left-6">"</div>
            <p className="text-stone-700 leading-relaxed relative z-10 italic mb-6">
              The program taught me that every child learns differently. The training helped me become more patient, creative and intentional in the way I approach teaching.
            </p>
            <div className="font-bold text-[#1C1917]">— Sneha Mathew</div>
            <div className="text-xs text-stone-500 font-semibold">NTT Graduate | Kochi</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 text-center bg-gradient-to-br from-stone-900 to-stone-950 text-white p-12 sm:p-16 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E1007A_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold">Ready to Join the KinderBee Network?</h2>
          <p className="text-stone-300 text-base max-w-xl mx-auto">
            Schedule a confidential project scoping call with our central advisory team today.
          </p>
          <button
            onClick={onOpenConsultation}
            className="bg-[#E1007A] hover:bg-pink-700 text-white font-medium px-8 py-4 rounded-2xl shadow-lg transition duration-300 text-base"
          >
            Book Consultation Call
          </button>
        </div>
      </section>

    </div>
  );
};
