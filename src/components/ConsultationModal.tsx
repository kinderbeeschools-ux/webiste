import React, { useState, useEffect } from 'react';
import { BROCHURE_URL } from './BrochureDownload';
import { COURSE_FEES, ECCE } from '../data/courses';
import { X, Send, CheckCircle2, Sparkles, Building2, Baby, GraduationCap, Briefcase, CreditCard, Download, School, Landmark } from 'lucide-react';
import { categoryInfo, type EnquiryCategory } from '../data/enquiry';
import { trackLead } from '../utils/analytics';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: string; // 'admission' | 'franchise' | 'ntt' | 'cbse' | 'degree' | 'investor' (older aliases accepted)
  onNavigateToPayment?: (programme?: string, amount?: string) => void;
}

type Tab = Exclude<EnquiryCategory, 'other'>;
type FieldDef = { key: string; label: string; required?: boolean; type?: 'text' | 'tel' | 'email' | 'date'; options?: string[]; placeholder?: string };

const TIMELINES = ['Within 6 months', '6 – 12 months', '1 – 2 years', 'Just exploring'];

// One form per line of business. `program` is the main interest and shows as "Programme" in the CRM.
const FORMS: Record<Tab, { icon: React.ElementType; submit: string; fields: FieldDef[] }> = {
  admission: {
    icon: Baby,
    submit: 'Submit Admission Enquiry',
    fields: [
      { key: 'name', label: 'Parent / Guardian name', required: true, placeholder: "Parent's full name" },
      { key: 'childName', label: "Child's name", required: true, placeholder: "Child's full name" },
      { key: 'childAge', label: "Child's age / date of birth", required: true, placeholder: 'e.g. 2.5 years / 15 Oct 2023' },
      { key: 'program', label: 'Class of interest', required: true, options: ['Playgroup (1.5 - 2.5 yrs)', 'Nursery (2.5 - 3.5 yrs)', 'LKG (3.5 - 4.5 yrs)', 'UKG (4.5 - 5.5 yrs)', 'Daycare & Extended Care (1.5 - 8 yrs)'] },
      { key: 'phone', label: 'Mobile number', required: true, type: 'tel', placeholder: '+91 98765 43210' },
      { key: 'email', label: 'Email address', required: true, type: 'email', placeholder: 'parent@gmail.com' },
      { key: 'city', label: 'City / preferred campus', required: true, placeholder: 'e.g. Bangalore, Ramamurthy Nagar' },
      { key: 'preferredVisitDate', label: 'Preferred campus visit date', type: 'date' },
    ],
  },
  franchise: {
    icon: Building2,
    submit: 'Submit Franchise Enquiry',
    fields: [
      { key: 'name', label: 'Applicant name', required: true, placeholder: 'e.g. Rajesh Sharma' },
      { key: 'phone', label: 'Mobile number', required: true, type: 'tel', placeholder: '+91 98234 56789' },
      { key: 'email', label: 'Email address', required: true, type: 'email', placeholder: 'rajesh@gmail.com' },
      { key: 'city', label: 'City & state', required: true, placeholder: 'e.g. Pune, Maharashtra' },
      { key: 'program', label: 'Franchise model', required: true, options: ['Preschool Franchise (Zero Royalty)', 'Preschool + Daycare Franchise', 'Convert my existing preschool'] },
      { key: 'propertySpace', label: 'Available space', options: ['1,500 - 2,500 sq ft', '2,500 - 4,000 sq ft', '4,000+ sq ft (Standalone Villa)', 'Looking for Property'] },
      { key: 'budget', label: 'Investment capacity', options: ['₹15 Lakhs - ₹25 Lakhs', '₹25 Lakhs - ₹35 Lakhs', '₹35 Lakhs - ₹60 Lakhs', '₹60 Lakhs+'] },
      { key: 'timeline', label: 'When do you plan to start?', options: TIMELINES },
    ],
  },
  ntt: {
    icon: GraduationCap,
    submit: 'Submit Teacher Training Enquiry',
    fields: [
      { key: 'name', label: 'Applicant name', required: true, placeholder: 'e.g. Priya Nair' },
      { key: 'phone', label: 'Mobile number', required: true, type: 'tel', placeholder: '+91 98450 12345' },
      { key: 'email', label: 'Email address', required: true, type: 'email', placeholder: 'priya@gmail.com' },
      { key: 'city', label: 'City / location', required: true, placeholder: 'e.g. Bangalore, Karnataka' },
      { key: 'program', label: 'Course of interest', required: true, options: ['Advanced Diploma in Early Childhood Care & Education', 'Diploma in Play school Teacher Training', 'Certificate in Nordic inspired Preschool Teaching', 'Foundational Stage Curriculum Design', 'Not sure yet, please advise'] },
      { key: 'qualification', label: 'Highest qualification', options: ['12th Standard / Higher Secondary', 'Graduate / Bachelor Degree', 'Post Graduate / Master Degree', 'B.Ed / D.Ed / Early NTT'] },
      { key: 'preferredBatch', label: 'Preferred batch mode', options: ['Online Live Batch (Flexible Evening)', 'Weekend Executive Batch', 'Self-Paced Hybrid with Mentorship'] },
    ],
  },
  cbse: {
    icon: School,
    submit: 'Submit School Setup Enquiry',
    fields: [
      { key: 'name', label: 'Your name', required: true, placeholder: 'e.g. Suresh Reddy' },
      { key: 'organization', label: 'Trust / organisation', placeholder: 'e.g. Sri Vidya Educational Trust' },
      { key: 'phone', label: 'Mobile number', required: true, type: 'tel', placeholder: '+91 99000 11223' },
      { key: 'email', label: 'Email address', required: true, type: 'email', placeholder: 'trust@gmail.com' },
      { key: 'city', label: 'Proposed location (city & state)', required: true, placeholder: 'e.g. Hosur, Tamil Nadu' },
      { key: 'program', label: 'Board', required: true, options: ['CBSE School Setup', 'IB School Setup', 'CBSE + IB School Setup', 'Upgrade / affiliate an existing school'] },
      { key: 'grades', label: 'Grades planned', options: ['Up to Grade 5', 'Up to Grade 8', 'Up to Grade 10', 'Up to Grade 12'] },
      { key: 'landStatus', label: 'Land / campus', options: ['Own land', 'Leased land / building', 'Existing school campus', 'Looking for land'] },
      { key: 'timeline', label: 'Planned start', options: TIMELINES },
    ],
  },
  degree: {
    icon: Landmark,
    submit: 'Submit Degree College Enquiry',
    fields: [
      { key: 'name', label: 'Your name', required: true, placeholder: 'e.g. Dr. Anitha Rao' },
      { key: 'organization', label: 'Trust / organisation', placeholder: 'e.g. Rao Educational Society' },
      { key: 'phone', label: 'Mobile number', required: true, type: 'tel', placeholder: '+91 99000 11223' },
      { key: 'email', label: 'Email address', required: true, type: 'email', placeholder: 'society@gmail.com' },
      { key: 'city', label: 'Proposed location (city & state)', required: true, placeholder: 'e.g. Mysuru, Karnataka' },
      { key: 'program', label: 'Courses planned', required: true, options: ['Arts & Science', 'Commerce & Management', 'Engineering & Technology', 'Nursing & Allied Health', 'Education (B.Ed)', 'Not decided yet'] },
      { key: 'landStatus', label: 'Land / campus', options: ['Own land', 'Leased campus', 'Existing institution', 'Looking for land'] },
      { key: 'timeline', label: 'Planned start', options: TIMELINES },
    ],
  },
  investor: {
    icon: Briefcase,
    submit: 'Submit Investor Enquiry',
    fields: [
      { key: 'name', label: 'Investor / principal name', required: true, placeholder: 'e.g. Vikram Singh' },
      { key: 'organization', label: 'Organisation / trust', placeholder: 'e.g. Singh Capital' },
      { key: 'phone', label: 'Mobile number', required: true, type: 'tel', placeholder: '+91 99000 11223' },
      { key: 'email', label: 'Email address', required: true, type: 'email', placeholder: 'vikram@example.com' },
      { key: 'city', label: 'City', required: true, placeholder: 'e.g. Bangalore' },
      { key: 'budget', label: 'Capital horizon', options: ['₹25 Lakhs - ₹50 Lakhs', '₹50 Lakhs - ₹1 Crore', '₹1 Crore - ₹3 Crores', '₹3 Crores+ (Multi-Campus / K-12)'] },
      { key: 'program', label: 'Strategic interest', required: true, options: ['Multi-City Preschool Chain Expansion', 'K-12 Green-Field School Project', 'Finnish Pedagogical Tech & Franchise Cluster'] },
    ],
  },
};

// The five lines of business always shown; Investor only when opened from an investor button
const MAIN_TABS: Tab[] = ['admission', 'franchise', 'ntt', 'cbse', 'degree'];

const normalise = (t: string): Tab => {
  if (['fwa_course', 'ptt', 'fwa', 'teacher_training', 'ntt'].includes(t)) return 'ntt';
  if (['franchise', 'partnerships', 'preschool', 'partner'].includes(t)) return 'franchise';
  if (['cbse', 'ib'].includes(t)) return 'cbse';
  if (t === 'degree') return 'degree';
  if (['investor', 'investors', 'partner_investor'].includes(t)) return 'investor';
  return 'admission';
};

const inputCls = 'w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]';

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose, defaultType = 'admission', onNavigateToPayment }) => {
  const [activeTab, setActiveTab] = useState<Tab>('admission');
  // Shared across tabs, so name / phone / email / city carry over when switching
  const [values, setValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [aiSummaryResult, setAiSummaryResult] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(normalise(defaultType));
      if (defaultType === 'daycare') setValues(v => ({ ...v, program: 'Daycare & Extended Care (1.5 - 8 yrs)' }));
      setSubmitted(false);
      setAgreedToPolicy(false);
    }
  }, [defaultType, isOpen]);

  if (!isOpen) return null;

  const form = FORMS[activeTab];
  const tabs = activeTab === 'investor' ? [...MAIN_TABS, 'investor' as Tab] : MAIN_TABS;
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setValues(v => ({ ...v, [k]: e.target.value }));

  const switchTab = (t: Tab) => {
    // `program` options differ per form; don't carry a choice into a form where it isn't valid
    setValues(v => (FORMS[t].fields.find(f => f.key === 'program')?.options?.includes(v.program) ? v : { ...v, program: '' }));
    setActiveTab(t);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToPolicy) {
      alert('Please review and agree to the Cancellation and No-Refund Policy, Terms, and Privacy Policy.');
      return;
    }
    setLoading(true);
    try {
      const fields: Record<string, string> = { message, consultationCategory: activeTab };
      form.fields.forEach(f => { if (values[f.key]?.trim()) fields[f.key] = values[f.key].trim(); });
      // Older CRM / email views read these keys
      if (activeTab === 'ntt') fields.courseOfInterest = fields.program;
      else fields.partnershipModel = fields.program;

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeTab, fields }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        trackLead(activeTab, 'Consultation form', { program: fields.program });
        setSubmittedId(data.enquiryId || `ENQ-${Date.now().toString().slice(-6)}`);
        setAiSummaryResult(data.aiSummary || 'Consultation request indexed and routed to our central academic desk.');
      } else {
        alert(data.error || 'Failed to submit consultation request.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while submitting enquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div role="dialog" aria-modal="true" aria-labelledby="enq-title" className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl relative border border-stone-100 my-6 max-h-[92vh] flex flex-col justify-between">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-6 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold bg-stone-100 text-stone-600 px-3 py-1 rounded-full">Ref No: {submittedId}</span>
              <h3 className="text-2xl font-display font-bold text-stone-900">{categoryInfo(activeTab).label} enquiry received!</h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Thank you, <span className="font-semibold text-stone-900">{values.name}</span>. Our team has received your details and will connect with you shortly.
              </p>
            </div>

            {aiSummaryResult && (
              <div className="bg-pink-50 border border-pink-100 p-4 rounded-2xl text-left space-y-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#E1007A] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kinderbee Central Advisory Assessment</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">{aiSummaryResult}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              {activeTab === 'ntt' && onNavigateToPayment ? (
                <button
                  onClick={() => { onClose(); onNavigateToPayment(ECCE, String(COURSE_FEES[ECCE])); }}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Proceed to Fee Payment (₹4,999) &rarr;</span>
                </button>
              ) : activeTab === 'franchise' ? (
                <a
                  href={BROCHURE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Kinderbee-Franchise-Brochure-2026.pdf"
                  className="w-full sm:w-auto bg-[#E1007A] hover:bg-pink-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Franchise Brochure PDF</span>
                </a>
              ) : null}
              <button
                onClick={() => { setSubmitted(false); onClose(); }}
                className="w-full sm:w-auto bg-[#1C1917] hover:bg-stone-800 text-white font-medium px-6 py-3 rounded-xl text-sm transition cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto pr-1">
            <div className="mb-4 space-y-1 pr-10">
              <div className="inline-flex items-center gap-1.5 bg-[#E1007A]/10 text-[#E1007A] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Book a Free Consultation</span>
              </div>
              <h3 id="enq-title" className="text-2xl font-display font-bold text-stone-900">Connect with Kinderbee Advisors</h3>
              <p className="text-xs sm:text-sm text-stone-500">What would you like to enquire about?</p>
            </div>

            {/* One tab per line of business: 3 + 2 on phones, a single row on larger screens */}
            <div role="tablist" aria-label="Enquiry type" className={`grid grid-cols-3 ${tabs.length > 5 ? 'sm:grid-cols-6' : 'sm:grid-cols-5'} gap-1.5 p-1 bg-stone-100 rounded-2xl mb-5`}>
              {tabs.map(t => {
                const Icon = FORMS[t].icon;
                const on = activeTab === t;
                return (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => switchTab(t)}
                    className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center leading-tight ${on ? 'bg-white text-[#E1007A] shadow-xs' : 'text-stone-600 hover:text-stone-900'}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{categoryInfo(t).short}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div key={activeTab} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-fadeIn">
                {form.fields.map(f => (
                  <div key={f.key}>
                    <label htmlFor={`enq-${f.key}`} className="block text-xs font-bold text-stone-700 mb-1">{f.label}{f.required ? ' *' : ''}</label>
                    {f.options ? (
                      <select id={`enq-${f.key}`} required={f.required} value={values[f.key] || ''} onChange={set(f.key)} className={`${inputCls} cursor-pointer`}>
                        <option value="">Select…</option>
                        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        id={`enq-${f.key}`}
                        type={f.type || 'text'}
                        required={f.required}
                        value={values[f.key] || ''}
                        onChange={set(f.key)}
                        placeholder={f.placeholder}
                        autoComplete={f.key === 'name' ? 'name' : f.key === 'phone' ? 'tel' : f.key === 'email' ? 'email' : undefined}
                        className={inputCls}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label htmlFor="enq-message" className="block text-xs font-bold text-stone-700 mb-1">Specific requirements / questions (optional)</label>
                <textarea
                  id="enq-message"
                  rows={2}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us any specific timeline, location preference, or questions..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToPolicy}
                    onChange={e => setAgreedToPolicy(e.target.checked)}
                    required
                    className="mt-0.5 w-4 h-4 rounded text-[#E1007A] focus:ring-[#E1007A] border-stone-300 accent-[#E1007A] cursor-pointer"
                  />
                  <span>
                    I have reviewed the fee details and agree to the{' '}
                    <a href="#cancellation-refund" target="_blank" rel="noopener noreferrer" className="text-[#E1007A] underline font-semibold hover:text-pink-700">Cancellation and No-Refund Policy</a>,{' '}
                    <a href="#terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-[#E1007A] underline font-semibold hover:text-pink-700">Terms and Conditions</a>, and{' '}
                    <a href="#privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#E1007A] underline font-semibold hover:text-pink-700">Privacy Policy</a>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !agreedToPolicy}
                className="w-full bg-gradient-to-r from-[#E1007A] to-pink-600 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3 rounded-xl shadow-md transition duration-300 text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? <span>Processing & Submitting Request...</span> : (<><Send className="w-4 h-4" /><span>{form.submit}</span></>)}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
