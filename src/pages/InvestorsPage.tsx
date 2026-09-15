import React from 'react';
import { School, GraduationCap, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, TrendingUp, Building2 } from 'lucide-react';
import { SystemSettings } from '../types';
import { SEOHead } from '../components/SEOHead';

interface InvestorsPageProps {
  onOpenConsultation: (type?: string) => void;
  settings?: SystemSettings | null;
  setCurrentTab?: (tab: string) => void;
}

export const InvestorsPage: React.FC<InvestorsPageProps> = ({ onOpenConsultation, settings, setCurrentTab }) => {
  const handleNavigate = (tabId: string) => {
    if (setCurrentTab) {
      setCurrentTab(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onOpenConsultation('partner');
    }
  };

  return (
    <div className="space-y-16 pb-20 pt-8 bg-[#FAF9F6]">
      <SEOHead 
        title="Partner With Us | CBSE, IB & Degree College Setup Solutions"
        description="Partner with Kinderbee for End-to-End CBSE & IB School Establishment and Degree College Institution Consultancy."
        settings={settings}
      />

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-pink-100/70 border border-pink-200 text-[#E1007A] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-[#E1007A]" />
          <span>INSTITUTIONAL PARTNERSHIP ECOSYSTEM</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-stone-900 tracking-tight">
          Partner with <span className="text-[#E1007A]">Kinderbee</span>
        </h1>
        <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Comprehensive turnkey advisory, accreditation management, and campus establishment for visionary educational institutions.
        </p>
      </section>

      {/* 2 Institutional Setup Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Service 1: CBSE & IB School Setup */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-emerald-500/30 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[11px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider shadow-xs">
              K-12 Turnkey Establishment
            </div>

            <div className="space-y-5">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <School className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
                  End-to-End K-12 Establishment
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-3 leading-tight">
                  CBSE &amp; IB School Setup
                </h2>
              </div>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Complete institutional consulting for K-12 schools including CBSE affiliation documentation, IB authorization, master campus architecture, lab planning, and leadership recruitment.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>CBSE &amp; IB Board Affiliation &amp; NOC Filing</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Master Architectural Campus &amp; STEM Lab Blueprint</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Principal &amp; Senior Faculty Talent Acquisition</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleNavigate('partnerships-cbse')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-emerald-900/20"
            >
              <span>Explore CBSE &amp; IB Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Service 2: Degree College Setup */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-blue-500/30 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[11px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider shadow-xs">
              Higher Education
            </div>

            <div className="space-y-5">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
                  Higher Education Institution Consultancy
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-3 leading-tight">
                  Degree College Setup
                </h2>
              </div>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Strategic higher education institution consultancy covering university affiliation, UGC compliance, campus zoning, departmental faculty selection, and academic accreditations.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>University Affiliation &amp; State UGC Compliance</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>College Campus Infrastructure &amp; Library Planning</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Departmental Faculty Search &amp; NAAC Roadmap</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleNavigate('partnerships-degree')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-blue-900/20"
            >
              <span>Explore Degree College Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Explore All Solutions Overview Banner */}
        <div className="mt-8 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 text-[#FFD400] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Comparative Framework</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">Programs &amp; Solutions Matrix</h3>
            <p className="text-stone-300 text-sm max-w-xl">
              Compare requirements, affiliation timelines, and advisory scope across Preschool, K-12 CBSE/IB, and Degree College models.
            </p>
          </div>
          <button
            onClick={() => handleNavigate('programs')}
            className="shrink-0 bg-white hover:bg-stone-100 text-stone-900 font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>View Programs Overview</span>
            <ArrowRight className="w-4 h-4 text-[#E1007A]" />
          </button>
        </div>
      </section>

      {/* Why Institutional Leaders Partner With Us */}
      <section className="bg-white py-16 px-4 sm:px-8 border-y border-stone-200">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">
              Why Institutional Leaders Partner With Us
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              Decades of combined academic leadership, proven operational systems, and national brand trust
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-3 p-6 bg-stone-50 rounded-2xl border border-stone-200">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
              <h3 className="font-bold text-stone-900 text-base">Turnkey Delivery</h3>
              <p className="text-stone-600 text-xs leading-relaxed">End-to-end guidance from land acquisition to final admissions and launch.</p>
            </div>

            <div className="flex flex-col gap-3 p-6 bg-stone-50 rounded-2xl border border-stone-200">
              <ShieldCheck className="w-7 h-7 text-blue-600 shrink-0" />
              <h3 className="font-bold text-stone-900 text-base">Regulatory Approvals</h3>
              <p className="text-stone-600 text-xs leading-relaxed">Expert navigation through state board, CBSE, IB, UGC, and university compliances.</p>
            </div>

            <div className="flex flex-col gap-3 p-6 bg-stone-50 rounded-2xl border border-stone-200">
              <TrendingUp className="w-7 h-7 text-[#E1007A] shrink-0" />
              <h3 className="font-bold text-stone-900 text-base">Academic Audits</h3>
              <p className="text-stone-600 text-xs leading-relaxed">Curriculum benchmarking, faculty development, and admissions marketing campaigns.</p>
            </div>

            <div className="flex flex-col gap-3 p-6 bg-stone-50 rounded-2xl border border-stone-200">
              <Sparkles className="w-7 h-7 text-amber-500 shrink-0" />
              <h3 className="font-bold text-stone-900 text-base">Prestige &amp; ROI</h3>
              <p className="text-stone-600 text-xs leading-relaxed">Build landmark institutions that elevate community education standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-stone-900">
          Ready to establish your educational institution?
        </h2>
        <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
          Schedule a confidential strategic consultation with our institutional development advisory team today.
        </p>
        <button
          onClick={() => onOpenConsultation('partner_investor')}
          className="bg-gradient-to-r from-[#E1007A] to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-pink-900/30 transition text-sm sm:text-base flex items-center justify-center gap-2 mx-auto cursor-pointer"
        >
          <span>Speak with Institutional Advisor</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
