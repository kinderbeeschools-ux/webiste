import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Building, Award, IndianRupee } from 'lucide-react';

interface PartnershipsPageProps {
  onOpenConsultation: (type?: string) => void;
}

export const PartnershipsPage: React.FC<PartnershipsPageProps> = ({ onOpenConsultation }) => {
  return (
    <div className="space-y-20 pb-20">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-stone-900 to-stone-950 text-white py-20 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E1007A_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#E1007A]/20 border border-[#E1007A]/40 text-pink-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#E1007A]" />
            <span>Strategic Association Portfolios</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight">
            Our Collaborative Education Models
          </h1>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto font-normal leading-relaxed">
            From high-profit Preschool Franchises to comprehensive CBSE School Setup and existing school upgrades, explore our zero-royalty partnership pathways.
          </p>
        </div>
      </section>

      {/* Model 1: Preschool Franchise */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block bg-pink-100 text-[#E1007A] font-bold text-xs uppercase px-3 py-1 rounded-full">
              Model 01 &bull; Preschool Franchise
            </div>
            <h2 className="text-3xl font-display font-extrabold text-[#1C1917]">
              KinderBee Premium Preschool Franchise
            </h2>
            <p className="text-stone-600 text-base leading-relaxed">
              Designed for entrepreneurs, educators, and property owners seeking a turnkey business in early childhood education. We provide the complete FinnishWay Academy curriculum, interior layout designs, teacher recruitment training, and launch marketing.
            </p>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <span className="text-xs text-stone-500 font-semibold block mb-1">Typical Investment</span>
                <span className="text-lg font-display font-bold text-[#1C1917]">₹15 Lakhs - ₹30 Lakhs</span>
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <span className="text-xs text-stone-500 font-semibold block mb-1">Space Requirement</span>
                <span className="text-lg font-display font-bold text-[#1C1917]">2,000 - 3,500 sq.ft</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-sm text-stone-700 font-medium">
              <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> 100% Zero Royalty Fee (Keep all tuition revenues)</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> Complete play-based bilingual curriculum & student kits</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> Teacher certification via FinnishWay Academy</li>
            </ul>
            <button
              onClick={() => onOpenConsultation('franchise')}
              className="bg-[#E1007A] hover:bg-pink-700 text-white font-medium px-8 py-3.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
            >
              <span>Apply for Preschool Franchise</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-100">
              <img
                src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800"
                alt="Preschool Classroom"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Model 2: CBSE / K-12 School Setup */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-100">
              <img
                src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800"
                alt="CBSE K-12 School Setup"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="inline-block bg-amber-100 text-amber-800 font-bold text-xs uppercase px-3 py-1 rounded-full">
              Model 02 &bull; CBSE / K-12 Setup
            </div>
            <h2 className="text-3xl font-display font-extrabold text-[#1C1917]">
              CBSE & K-12 Campus Development Consultancy
            </h2>
            <p className="text-stone-600 text-base leading-relaxed">
              Tailored for educational trusts, large landowners, and corporate investors looking to establish full-scale primary and secondary schools. We provide regulatory compliance guidance, architectural master planning, and NEP 2020 syllabi integration.
            </p>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <span className="text-xs text-stone-500 font-semibold block mb-1">Typical Investment</span>
                <span className="text-lg font-display font-bold text-[#1C1917]">₹1 Crore - ₹3 Crores</span>
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <span className="text-xs text-stone-500 font-semibold block mb-1">Land Requirement</span>
                <span className="text-lg font-display font-bold text-[#1C1917]">1+ Acre Campus</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-sm text-stone-700 font-medium">
              <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> End-to-end affiliation & compliance support</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> Smart classroom & laboratory infrastructure planning</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> Principal recruitment and faculty onboarding programs</li>
            </ul>
            <button
              onClick={() => onOpenConsultation('investor')}
              className="bg-[#E1007A] hover:bg-pink-700 text-white font-medium px-8 py-3.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
            >
              <span>Inquire About School Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Model 3: Existing School Rebranding */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block bg-pink-100 text-[#E1007A] font-bold text-xs uppercase px-3 py-1 rounded-full">
              Model 03 &bull; Rebranding & Upgrade
            </div>
            <h2 className="text-3xl font-display font-extrabold text-[#1C1917]">
              Existing School Rebranding & Academic Upgrade
            </h2>
            <p className="text-stone-600 text-base leading-relaxed">
              Running an independent preschool or kindergarten with stagnating enrollments? Upgrade your institution to the KinderBee standard, gain access to FinnishWay curricula, and boost local admissions overnight.
            </p>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <span className="text-xs text-stone-500 font-semibold block mb-1">Integration Fee</span>
                <span className="text-lg font-display font-bold text-[#1C1917]">Nominal One-time</span>
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <span className="text-xs text-stone-500 font-semibold block mb-1">Royalty Charges</span>
                <span className="text-lg font-display font-bold text-[#E1007A]">0% Forever</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-sm text-stone-700 font-medium">
              <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> Immediate brand makeover & marketing support</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#E1007A]" /> Complete staff retraining under Finnish Way Academy</li>
            </ul>
            <button
              onClick={() => onOpenConsultation('franchise')}
              className="bg-[#E1007A] hover:bg-pink-700 text-white font-medium px-8 py-3.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
            >
              <span>Explore School Upgrade</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-100">
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800"
                alt="School Upgrade"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
