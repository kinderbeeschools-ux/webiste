import React from 'react';
import { Settings2, Handshake, BookOpen, CheckCircle2 } from 'lucide-react';
import { SystemSettings } from '../types';
import { SEOHead } from '../components/SEOHead';

interface InvestorsPageProps {
  onOpenConsultation: (type?: string) => void;
  settings?: SystemSettings | null;
  setCurrentTab: (tab: string) => void;
}

export const InvestorsPage: React.FC<InvestorsPageProps> = ({ onOpenConsultation, settings, setCurrentTab }) => {
  return (
    <div className="space-y-12 pb-16">
      <SEOHead 
        settings={settings}
      />
      
      {/* Header Banner */}
      <section className="bg-stone-900 text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
            Partner with us
          </h1>
          <p className="text-xl text-stone-300 font-medium">
            Invest in Education. Build the Future.
          </p>
          <p className="text-stone-400 max-w-2xl mx-auto">
            Join Kinderbee's growing education ecosystem.
            Kinderbee is India's most trusted education and school development partner...
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold text-stone-900">What We Offer</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Settings2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Comprehensive School Setup</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-pink-50 text-[#E1007A] rounded-full flex items-center justify-center mx-auto">
              <Handshake className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Zero Royalty Franchise</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">NTT Teacher Training</h3>
          </div>
        </div>
      </section>

      {/* Why Partner With Us? */}
      <section className="bg-stone-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-stone-900 text-center mb-10">Why Partner With Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-stone-100">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <span className="font-semibold text-stone-800">Scalable business models</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-stone-100">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <span className="font-semibold text-stone-800">Transparent operations</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-stone-100">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <span className="font-semibold text-stone-800">Continuous support</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-stone-100">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <span className="font-semibold text-stone-800">High ROI potential</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl font-display font-bold text-stone-900">Partner with KinderBee today</h2>
        <button
          onClick={() => setCurrentTab('contact')}
          className="bg-[#E1007A] hover:bg-pink-700 text-white font-semibold px-8 py-4 rounded-xl shadow-md transition text-sm flex items-center justify-center gap-2 mx-auto"
        >
          <span>Partner with us &rarr;</span>
        </button>
      </section>
    </div>
  );
};
