import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, IndianRupee, TrendingUp, Calculator, ShieldCheck } from 'lucide-react';

interface InvestorsPageProps {
  onOpenConsultation: (type?: string) => void;
}

export const InvestorsPage: React.FC<InvestorsPageProps> = ({ onOpenConsultation }) => {
  // Interactive ROI Calculator State
  const [investmentLakhs, setInvestmentLakhs] = useState(25);
  const [studentCapacity, setStudentCapacity] = useState(60);
  const [monthlyFeePerStudent, setMonthlyFeePerStudent] = useState(5000);

  // Calculations
  const grossMonthlyRevenue = studentCapacity * monthlyFeePerStudent;
  const annualGrossRevenue = grossMonthlyRevenue * 12;
  const estimatedMonthlyExpenses = grossMonthlyRevenue * 0.35; // 35% expenses (rent, staff, utilities)
  const netMonthlyProfit = grossMonthlyRevenue - estimatedMonthlyExpenses;
  const annualNetProfit = netMonthlyProfit * 12;
  const roiMonths = Math.round((investmentLakhs * 100000) / netMonthlyProfit);

  return (
    <div className="space-y-20 pb-20">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-stone-900 to-stone-950 text-white py-20 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E1007A_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#E1007A]/20 border border-[#E1007A]/40 text-pink-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#E1007A]" />
            <span>Capital Appreciation & Enterprise Growth</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight">
            High ROI Educational Investment Hub
          </h1>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Invest in one of India's most resilient and expanding sectors. Benefit from rapid capital recovery, zero recurring royalties, and complete operational guidance.
          </p>
        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          <div className="lg:col-span-6 p-8 sm:p-12 space-y-8 bg-stone-50/70 border-r border-stone-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#E1007A] font-bold text-xs uppercase tracking-wider">
                <Calculator className="w-4 h-4" />
                <span>Interactive Financial Modeling</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-stone-900">Estimate Your Franchise ROI</h3>
              <p className="text-xs text-stone-600">
                Adjust the sliders below to calculate projected revenues and payback timelines under the 100% Zero Royalty model.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">Initial Investment Capital</label>
                  <span className="font-display font-bold text-[#E1007A] text-base">₹{investmentLakhs} Lakhs</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="50"
                  step="5"
                  value={investmentLakhs}
                  onChange={e => setInvestmentLakhs(Number(e.target.value))}
                  className="w-full accent-[#E1007A]"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>₹15 Lakhs (Compact)</span>
                  <span>₹50 Lakhs (Flagship)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">Enrolled Students Target</label>
                  <span className="font-display font-bold text-[#E1007A] text-base">{studentCapacity} Students</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="150"
                  step="10"
                  value={studentCapacity}
                  onChange={e => setStudentCapacity(Number(e.target.value))}
                  className="w-full accent-[#E1007A]"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>30 Students</span>
                  <span>150 Students</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">Average Monthly Fee per Student</label>
                  <span className="font-display font-bold text-[#E1007A] text-base">₹{monthlyFeePerStudent.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="12000"
                  step="500"
                  value={monthlyFeePerStudent}
                  onChange={e => setMonthlyFeePerStudent(Number(e.target.value))}
                  className="w-full accent-[#E1007A]"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>₹3,000/mo</span>
                  <span>₹12,000/mo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-8 bg-stone-900 text-white">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Projected Financial Performance</span>
              </div>
              <h3 className="text-2xl font-display font-bold">Zero Royalty Profit Retention</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700">
                  <span className="text-xs text-stone-400 block mb-1">Annual Gross Revenue</span>
                  <span className="text-xl sm:text-2xl font-display font-black text-white">₹{(annualGrossRevenue / 100000).toFixed(1)} Lakhs</span>
                </div>

                <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700">
                  <span className="text-xs text-stone-400 block mb-1">Estimated Annual Net Profit</span>
                  <span className="text-xl sm:text-2xl font-display font-black text-emerald-400">₹{(annualNetProfit / 100000).toFixed(1)} Lakhs</span>
                </div>
              </div>

              <div className="bg-[#E1007A]/20 border border-[#E1007A]/40 p-5 rounded-2xl space-y-1">
                <span className="text-xs text-pink-300 font-semibold uppercase tracking-wider">Estimated Capital Break-Even Period</span>
                <div className="text-3xl font-display font-black text-white">{roiMonths} Months</div>
                <p className="text-[11px] text-stone-300">
                  Because KinderBee takes 0% ongoing royalties, your break-even is achieved 30% faster than standard educational franchises.
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenConsultation('investor')}
              className="w-full bg-[#E1007A] hover:bg-pink-700 text-white font-medium py-4 rounded-xl transition shadow-lg text-sm flex items-center justify-center gap-2"
            >
              <span>Download Detailed Investment Dossier</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
