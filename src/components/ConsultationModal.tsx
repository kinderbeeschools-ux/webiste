import React, { useState } from 'react';
import { X, Send, CheckCircle2, Sparkles, Building2, User, Phone, Mail, MapPin, IndianRupee } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose, defaultType = 'franchise' }) => {
  const [type, setType] = useState(defaultType);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [budget, setBudget] = useState('₹15 Lakhs - ₹25 Lakhs');
  const [partnershipModel, setPartnershipModel] = useState('Preschool Franchise (Zero Royalty)');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiSummaryResult, setAiSummaryResult] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          fields: {
            name,
            email,
            phone,
            city,
            state,
            budget,
            partnershipModel,
            message
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setAiSummaryResult(data.aiSummary || 'Enquiry successfully indexed and analyzed.');
      } else {
        alert(data.error || 'Failed to submit enquiry.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while submitting enquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-100 my-8">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-display font-bold text-stone-900">Enquiry Received Successfully!</h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Thank you, <span className="font-semibold text-stone-900">{name}</span>. Our central advisory team has received your details and will call you within 24 hours.
              </p>
            </div>

            {aiSummaryResult && (
              <div className="bg-pink-50 border border-pink-100 p-4 rounded-2xl text-left space-y-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#E1007A] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Strategic Lead Assessment</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {aiSummaryResult}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <a
                href="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Files/_FRANCHISE.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="KinderBee_Franchise_Brochure.pdf"
                className="w-full sm:w-auto bg-[#E1007A] hover:bg-pink-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Download Franchise Brochure PDF &rarr;</span>
              </a>
              <button
                onClick={() => { setSubmitted(false); onClose(); }}
                className="w-full sm:w-auto bg-[#1C1917] hover:bg-stone-800 text-white font-medium px-6 py-3 rounded-xl text-sm transition cursor-pointer"
              >
                Close & Return to Portal
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-[#E1007A]/10 text-[#E1007A] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Royalty Partnership Portal</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-stone-900">Book Partnership Consultation</h3>
              <p className="text-sm text-stone-500">
                Fill in your project expectations. Our team will prepare a customized feasibility blueprint for your city.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Suresh Mehra"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98234 56789"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="suresh@gmail.com"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">City / Region *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. Pune, Maharashtra"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Partnership Model</label>
                  <select
                    value={partnershipModel}
                    onChange={e => setPartnershipModel(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                  >
                    <option value="Preschool Franchise (Zero Royalty)">Preschool Franchise (Zero Royalty)</option>
                    <option value="CBSE / K-12 School Setup">CBSE / K-12 School Setup</option>
                    <option value="FinnishWay Academy Teacher Training">FinnishWay Academy Teacher Training</option>
                    <option value="Existing School Rebranding & Upgrade">Existing School Rebranding & Upgrade</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Estimated Investment Budget</label>
                  <select
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                  >
                    <option value="₹15 Lakhs - ₹25 Lakhs">₹15 Lakhs - ₹25 Lakhs</option>
                    <option value="₹25 Lakhs - ₹35 Lakhs">₹25 Lakhs - ₹35 Lakhs</option>
                    <option value="₹35 Lakhs - ₹75 Lakhs">₹35 Lakhs - ₹75 Lakhs</option>
                    <option value="₹1 Crore - ₹2 Crores (K-12 School)">₹1 Crore - ₹2 Crores (K-12 School)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Project Details / Property Info (Optional)</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us about your property size, existing school, or specific questions..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#E1007A] to-pink-600 hover:from-pink-700 hover:to-pink-800 text-white font-medium py-3 rounded-xl shadow-md transition duration-300 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Analyzing & Submitting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Partnership Enquiry</span>
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
