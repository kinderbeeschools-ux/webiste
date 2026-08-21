import React from 'react';
import { Sparkles, CheckCircle2, Award, Users, Globe, Target } from 'lucide-react';

interface AboutPageProps {
  onOpenConsultation: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenConsultation }) => {
  return (
    <div className="space-y-20 pb-20">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-stone-900 to-stone-950 text-white py-20 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E1007A_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#E1007A]/20 border border-[#E1007A]/40 text-pink-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#E1007A]" />
            <span>Our Journey & Core Mission</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight">
            Empowering Educators & Entrepreneurs
          </h1>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto font-normal leading-relaxed">
            KinderBee is on a mission to democratize premium international education across India, eliminating royalty burdens and providing school owners with elite world-class tools.
          </p>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="text-[#E1007A] font-bold text-xs uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block">
            Nordic Roots & Indian Vision
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1C1917]">
            Bridging Finnish Educational Mastery with Indian Aspirations
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Founded by veteran educators and institutional strategists, KinderBee Integrated Partnership System (KIPS) recognized a major flaw in the Indian preschool franchise landscape: high recurring royalty fees (15%-25%) that stifled school profitability and compromised faculty investments.
          </p>
          <p className="text-stone-600 text-base leading-relaxed">
            By partnering with the FinnishWay Academy, we introduced a 100% Zero Royalty model coupled with active play-based curricula that completely comply with India's National Education Policy (NEP) 2020.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <div className="text-2xl font-display font-black text-[#E1007A]">100%</div>
              <div className="text-xs text-stone-600 font-semibold">Zero Franchise Royalties</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <div className="text-2xl font-display font-black text-amber-500">50+</div>
              <div className="text-xs text-stone-600 font-semibold">Campus Partners & Advisors</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-br from-[#E1007A] to-amber-500 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-xl bg-white">
            <img
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800"
              alt="KinderBee Classroom"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="bg-stone-100 py-20 px-4 sm:px-8 border-y border-stone-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-[#E1007A] font-bold text-xs uppercase tracking-widest bg-pink-100/60 px-3 py-1 rounded-full inline-block">
              Core Principles
            </div>
            <h2 className="text-3xl font-display font-extrabold text-[#1C1917]">
              The Four Pillars of KinderBee Partnership
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#E1007A] flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-display font-bold text-lg text-stone-900">Absolute Autonomy</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                You own your school, your brand presence, and your revenue. No corporate dictations or royalty deductions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-display font-bold text-lg text-stone-900">Nordic Pedagogy</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Joyful, inquiry-driven, and experiential learning modules designed for holistic early childhood brain development.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-display font-bold text-lg text-stone-900">Fiscal Resiliency</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Designed to achieve break-even within 18 to 24 months through optimized capital allocation and high parental retention.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                04
              </div>
              <h3 className="font-display font-bold text-lg text-stone-900">Continuous Audit</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Ongoing academic audits, faculty training workshops, and digital marketing support to ensure sustained institutional excellence.
              </p>
            </div>
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
