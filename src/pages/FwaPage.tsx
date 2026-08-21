import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Award, BookOpen, Users } from 'lucide-react';

interface FwaPageProps {
  onOpenConsultation: (type?: string) => void;
}

export const FwaPage: React.FC<FwaPageProps> = ({ onOpenConsultation }) => {
  return (
    <div className="space-y-20 pb-20">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-stone-900 to-stone-950 text-white py-20 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E1007A_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#E1007A]/20 border border-[#E1007A]/40 text-pink-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#E1007A]" />
            <span>Acclaimed Pedagogical Certifications</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight">
            FinnishWay Academy Teacher Training
          </h1>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Unlock globally acclaimed pedagogical expertise. Empower your teaching staff with active, play-based learning frameworks certified by Finnish childhood education experts.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="text-[#E1007A] font-bold text-xs uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block">
            Global Educator Standards
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917]">
            Transforming Early Childhood Educators into Facilitators of Curiosity
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Traditional preschools rely on rote memorization and passive listening. FinnishWay Academy (FWA) trains educators in active inquiry, emotional self-regulation, cooperative play, and experiential mathematics.
          </p>
          <ul className="space-y-3 text-sm text-stone-700 font-medium">
            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> Globally recognized diploma & continuing professional development (CPD)</li>
            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> NEP 2020 aligned pedagogical toolkits for Indian classrooms</li>
            <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> Practical portfolio assessments & live mentor feedback</li>
          </ul>
          <button
            onClick={() => onOpenConsultation('fwa_course')}
            className="bg-[#E1007A] hover:bg-pink-700 text-white font-medium px-8 py-3.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
          >
            <span>Enroll Staff or Register for Course</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-br from-[#E1007A] to-amber-500 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-xl bg-white">
            <img
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800"
              alt="Teacher Training"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Course Modules */}
      <section className="bg-stone-100 py-20 px-4 sm:px-8 border-y border-stone-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-[#E1007A] font-bold text-xs uppercase tracking-widest bg-pink-100/60 px-3 py-1 rounded-full inline-block">
              Curriculum Modules
            </div>
            <h2 className="text-3xl font-display font-extrabold text-[#1C1917]">
              What Educators Master at FWA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#E1007A] flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-display font-bold text-xl text-stone-900">Play-Based Cognition</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Structuring play scenarios that stimulate logic, spatial reasoning, and collaborative problem-solving without stress.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-display font-bold text-xl text-stone-900">Emotional Well-Being</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Developing empathetic communication, conflict resolution, and stress management routines for young learners.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-display font-bold text-xl text-stone-900">NEP 2020 Alignment</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Seamlessly blending the Finnish framework with India's national foundational stage learning standards.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
