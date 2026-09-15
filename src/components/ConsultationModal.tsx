import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  IndianRupee, 
  Baby, 
  GraduationCap, 
  Briefcase, 
  Calendar,
  CreditCard,
  Download,
  ArrowRight
} from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: string; // 'admission' | 'franchise' | 'ptt' | 'investor' | 'fwa_course'
  onNavigateToPayment?: (programme?: string, amount?: string) => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultType = 'admission',
  onNavigateToPayment
}) => {
  // Normalize default tab
  const getNormalizedType = (t: string) => {
    if (t === 'fwa_course' || t === 'ptt' || t === 'fwa' || t === 'teacher_training') return 'ptt';
    if (t === 'franchise' || t === 'partnerships') return 'franchise';
    if (t === 'investor' || t === 'investors') return 'investor';
    return 'admission';
  };

  const [activeTab, setActiveTab] = useState<'admission' | 'franchise' | 'ptt' | 'investor'>('admission');

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [message, setMessage] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  // 1. Preschool Admission Specific Fields
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [admissionProgram, setAdmissionProgram] = useState('Playgroup (1.5 - 2.5 yrs)');
  const [preferredVisitDate, setPreferredVisitDate] = useState('');

  // 2. Franchise Specific Fields
  const [propertySpace, setPropertySpace] = useState('2,000 - 3,500 sq ft');
  const [franchiseBudget, setFranchiseBudget] = useState('₹15 Lakhs - ₹25 Lakhs');
  const [franchiseModel, setFranchiseModel] = useState('Preschool Franchise (Zero Royalty)');

  // 3. PTT / Teacher Training Specific Fields
  const [qualification, setQualification] = useState('Graduate / Bachelor Degree');
  const [currentRole, setCurrentRole] = useState('Aspiring Preschool Teacher / Educator');
  const [preferredBatch, setPreferredBatch] = useState('Online Live Batch (Flexible Evening)');
  const [courseChoice, setCourseChoice] = useState('Advanced Diploma in ECCE (Special ₹4,999 Offer)');

  // 4. Investor Specific Fields
  const [organization, setOrganization] = useState('');
  const [investmentRange, setInvestmentRange] = useState('₹25 Lakhs - ₹50 Lakhs');
  const [strategicInterest, setStrategicInterest] = useState('Multi-City Preschool Chain Expansion');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [aiSummaryResult, setAiSummaryResult] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(getNormalizedType(defaultType));
      setSubmitted(false);
      setAgreedToPolicy(false);
    }
  }, [defaultType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToPolicy) {
      alert('Please review and agree to the Cancellation and No-Refund Policy, Terms, and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      let fieldsPayload: any = {
        name,
        email,
        phone,
        city,
        state,
        message,
        consultationCategory: activeTab
      };

      if (activeTab === 'admission') {
        fieldsPayload = {
          ...fieldsPayload,
          childName,
          childAge,
          programme: admissionProgram,
          preferredVisitDate
        };
      } else if (activeTab === 'franchise') {
        fieldsPayload = {
          ...fieldsPayload,
          propertySpace,
          budget: franchiseBudget,
          partnershipModel: franchiseModel
        };
      } else if (activeTab === 'ptt') {
        fieldsPayload = {
          ...fieldsPayload,
          qualification,
          currentRole,
          preferredBatch,
          courseOfInterest: courseChoice,
          budget: '₹4,999 (Special ECCE Course Fee)'
        };
      } else if (activeTab === 'investor') {
        fieldsPayload = {
          ...fieldsPayload,
          organization,
          budget: investmentRange,
          investmentInterest: strategicInterest
        };
      }

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab,
          fields: fieldsPayload
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
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
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl relative border border-stone-100 my-6 max-h-[92vh] flex flex-col justify-between">
        
        {/* Close Button */}
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
              <span className="text-xs font-mono font-bold bg-stone-100 text-stone-600 px-3 py-1 rounded-full">
                Ref No: {submittedId}
              </span>
              <h3 className="text-2xl font-display font-bold text-stone-900">Consultation Request Received!</h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Thank you, <span className="font-semibold text-stone-900">{name}</span>. Our central team has received your details and will connect with you shortly.
              </p>
            </div>

            {aiSummaryResult && (
              <div className="bg-pink-50 border border-pink-100 p-4 rounded-2xl text-left space-y-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#E1007A] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kinderbee Central Advisory Assessment</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {aiSummaryResult}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              {activeTab === 'ptt' && onNavigateToPayment ? (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToPayment('Advanced Diploma in Early Childhood Care & Education (ECCE)', '4999');
                  }}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Proceed to Fee Payment (₹4,999) &rarr;</span>
                </button>
              ) : activeTab === 'franchise' ? (
                <a
                  href="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Files/_FRANCHISE.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Kinderbee_Franchise_Brochure.pdf"
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
            
            {/* Modal Header */}
            <div className="mb-4 space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-[#E1007A]/10 text-[#E1007A] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Book a Free Consultation</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-stone-900">Connect with Kinderbee Advisors</h3>
              <p className="text-xs sm:text-sm text-stone-500">
                Select your area of interest to receive specialized assistance and customized information.
              </p>
            </div>

            {/* 4 Specialized Enquiry Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-stone-100 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => setActiveTab('admission')}
                className={`py-2 px-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'admission'
                    ? 'bg-white text-[#E1007A] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Baby className="w-3.5 h-3.5" />
                <span>1. Admission</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('franchise')}
                className={`py-2 px-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'franchise'
                    ? 'bg-white text-[#E1007A] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>2. Franchise</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ptt')}
                className={`py-2 px-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'ptt'
                    ? 'bg-white text-[#E1007A] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>3. PTT / Training</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('investor')}
                className={`py-2 px-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'investor'
                    ? 'bg-white text-[#E1007A] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>4. Investor</span>
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* TAB 1: PRESCHOOL ADMISSION */}
              {activeTab === 'admission' && (
                <div className="space-y-3.5 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Parent / Guardian Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Parent's Full Name"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Child's Name *</label>
                      <div className="relative">
                        <Baby className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                        <input
                          type="text"
                          required
                          value={childName}
                          onChange={e => setChildName(e.target.value)}
                          placeholder="Child's Full Name"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Child's Age / Date of Birth *</label>
                      <input
                        type="text"
                        required
                        value={childAge}
                        onChange={e => setChildAge(e.target.value)}
                        placeholder="e.g. 2.5 Years / 15 Oct 2023"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Programme of Interest *</label>
                      <select
                        value={admissionProgram}
                        onChange={e => setAdmissionProgram(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A] cursor-pointer"
                      >
                        <option value="Playgroup (1.5 - 2.5 yrs)">Playgroup (1.5 - 2.5 yrs)</option>
                        <option value="Nursery (2.5 - 3.5 yrs)">Nursery (2.5 - 3.5 yrs)</option>
                        <option value="LKG (3.5 - 4.5 yrs)">LKG (3.5 - 4.5 yrs)</option>
                        <option value="UKG (4.5 - 5.5 yrs)">UKG (4.5 - 5.5 yrs)</option>
                        <option value="Daycare & Extended Care (1.5 - 8 yrs)">Daycare & Extended Care (1.5 - 8 yrs)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Contact Phone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="parent@gmail.com"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">City / Preferred Campus *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={e => setCity(e.target.value)}
                          placeholder="e.g. Bangalore, Ramamurthy Nagar"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Preferred Campus Visit Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                        <input
                          type="date"
                          value={preferredVisitDate}
                          onChange={e => setPreferredVisitDate(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRESCHOOL FRANCHISE */}
              {activeTab === 'franchise' && (
                <div className="space-y-3.5 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Partner / Applicant Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Rajesh Sharma"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98234 56789"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="rajesh@gmail.com"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">City & State *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="e.g. Pune, Maharashtra"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Available Commercial Space</label>
                      <select
                        value={propertySpace}
                        onChange={e => setPropertySpace(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A] cursor-pointer"
                      >
                        <option value="1,500 - 2,500 sq ft">1,500 - 2,500 sq ft</option>
                        <option value="2,500 - 4,000 sq ft">2,500 - 4,000 sq ft</option>
                        <option value="4,000+ sq ft (Standalone Villa)">4,000+ sq ft (Standalone Villa)</option>
                        <option value="Looking for Property">Looking for Property</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Investment Capacity</label>
                      <select
                        value={franchiseBudget}
                        onChange={e => setFranchiseBudget(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A] cursor-pointer"
                      >
                        <option value="₹15 Lakhs - ₹25 Lakhs">₹15 Lakhs - ₹25 Lakhs</option>
                        <option value="₹25 Lakhs - ₹35 Lakhs">₹25 Lakhs - ₹35 Lakhs</option>
                        <option value="₹35 Lakhs - ₹60 Lakhs">₹35 Lakhs - ₹60 Lakhs</option>
                        <option value="₹1 Crore+ (K-12 School Setup)">₹1 Crore+ (K-12 School Setup)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PTT / TEACHER TRAINING (FINNISH-WAY ACADEMY) */}
              {activeTab === 'ptt' && (
                <div className="space-y-3.5 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Applicant / Educator Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Priya Nair"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98450 12345"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="priya@gmail.com"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">City / Location *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="e.g. Bangalore, Karnataka"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Highest Qualification</label>
                      <select
                        value={qualification}
                        onChange={e => setQualification(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A] cursor-pointer"
                      >
                        <option value="12th Standard / Higher Secondary">12th Standard / Higher Secondary</option>
                        <option value="Graduate / Bachelor Degree">Graduate / Bachelor Degree</option>
                        <option value="Post Graduate / Master Degree">Post Graduate / Master Degree</option>
                        <option value="B.Ed / D.Ed / Early NTT">B.Ed / D.Ed / Early NTT</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Preferred Batch Mode</label>
                      <select
                        value={preferredBatch}
                        onChange={e => setPreferredBatch(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A] cursor-pointer"
                      >
                        <option value="Online Live Batch (Flexible Evening)">Online Live Batch (Flexible Evening)</option>
                        <option value="Weekend Executive Batch">Weekend Executive Batch</option>
                        <option value="Self-Paced Hybrid with Mentorship">Self-Paced Hybrid with Mentorship</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: INVESTOR CONSULTATION */}
              {activeTab === 'investor' && (
                <div className="space-y-3.5 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Investor / Principal Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Vikramaditya Singhania"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Organization / Trust Name</label>
                      <input
                        type="text"
                        value={organization}
                        onChange={e => setOrganization(e.target.value)}
                        placeholder="e.g. Singhania Capital / Foundation"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 99000 11223"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="vikram@singhcapital.in"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Capital Horizon</label>
                      <select
                        value={investmentRange}
                        onChange={e => setInvestmentRange(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A] cursor-pointer"
                      >
                        <option value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs - ₹50 Lakhs</option>
                        <option value="₹50 Lakhs - ₹1 Crore">₹50 Lakhs - ₹1 Crore</option>
                        <option value="₹1 Crore - ₹3 Crores">₹1 Crore - ₹3 Crores</option>
                        <option value="₹3 Crores+ (Multi-Campus / K-12)">₹3 Crores+ (Multi-Campus / K-12)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Strategic Interest</label>
                      <select
                        value={strategicInterest}
                        onChange={e => setStrategicInterest(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A] cursor-pointer"
                      >
                        <option value="Multi-City Preschool Chain Expansion">Multi-City Preschool Chain Expansion</option>
                        <option value="K-12 Green-Field School Project">K-12 Green-Field School Project</option>
                        <option value="Finnish Pedagogical Tech & Franchise Cluster">Finnish Pedagogical Tech & Franchise Cluster</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Message Field (Common) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Specific Requirements / Questions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us any specific timeline, location preference, or questions..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                />
              </div>

              {/* Mandatory Policy Agreement Checkbox */}
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
                    <a
                      href="#cancellation-refund"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E1007A] underline font-semibold hover:text-pink-700"
                    >
                      Cancellation and No-Refund Policy
                    </a>
                    ,{' '}
                    <a
                      href="#terms-and-conditions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E1007A] underline font-semibold hover:text-pink-700"
                    >
                      Terms and Conditions
                    </a>
                    , and{' '}
                    <a
                      href="#privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E1007A] underline font-semibold hover:text-pink-700"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !agreedToPolicy}
                className="w-full bg-gradient-to-r from-[#E1007A] to-pink-600 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3 rounded-xl shadow-md transition duration-300 text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Processing & Submitting Request...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {activeTab === 'admission' && 'Submit Admission Enquiry'}
                      {activeTab === 'franchise' && 'Submit Franchise Enquiry'}
                      {activeTab === 'ptt' && 'Submit Teacher Training Enquiry'}
                      {activeTab === 'investor' && 'Submit Investor Consultation'}
                    </span>
                  </>
                )}
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
