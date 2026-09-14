import React from 'react';
import { X, ShieldCheck, FileText, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';

export type PolicyType = 'privacy' | 'terms' | 'refund' | 'contact';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policyType: PolicyType;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, policyType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-stone-200 animate-slideUp"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div className="flex items-center gap-2.5">
            {policyType === 'privacy' && <ShieldCheck className="w-5 h-5 text-[#E1007A]" />}
            {policyType === 'terms' && <FileText className="w-5 h-5 text-[#E1007A]" />}
            {policyType === 'refund' && <RefreshCw className="w-5 h-5 text-[#E1007A]" />}
            {policyType === 'contact' && <Mail className="w-5 h-5 text-[#E1007A]" />}
            <h3 className="font-display font-bold text-stone-900 text-lg sm:text-xl">
              {policyType === 'privacy' && 'Privacy Policy'}
              {policyType === 'terms' && 'Terms and Conditions'}
              {policyType === 'refund' && 'Cancellation and Refund Policy'}
              {policyType === 'contact' && 'Contact Support & Office'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-sm text-stone-600 leading-relaxed">
          {policyType === 'privacy' && (
            <div className="space-y-4">
              <p className="text-stone-900 font-semibold">
                Effective Date: 1 January 2026 | Finnish-way Educare Pvt Ltd
              </p>
              <p>
                At <strong>Kinderbee International Preschool</strong> and the <strong>Kinderbee Integrated Partnership System (KIPS)</strong>, we are deeply committed to protecting the privacy of children, parents, educators, and prospective institutional partners.
              </p>
              <h4 className="font-bold text-stone-800 text-base">1. Information We Collect</h4>
              <p>
                We collect personal information such as name, email address, contact telephone number, city, and educational interest when voluntarily submitted through our admissions enquiry forms, consultation bookings, or newsletter subscriptions.
              </p>
              <h4 className="font-bold text-stone-800 text-base">2. How We Use Your Information</h4>
              <p>
                The information provided is strictly used to communicate with families regarding preschool programmes, schedule school visits, provide teacher-training materials, and evaluate preschool partnership applications. We do not sell, rent, or trade your personal data to third parties.
              </p>
              <h4 className="font-bold text-stone-800 text-base">3. Child Data Protection</h4>
              <p>
                Kinderbee strictly upholds the highest standards of child safety. Student records and classroom photographic documentation are retained exclusively for pedagogical portfolios with prior parental consent and are never shared for unauthorized commercial purposes.
              </p>
              <h4 className="font-bold text-stone-800 text-base">4. Contact Our Privacy Officer</h4>
              <p>
                For privacy inquiries or data update requests, please write to: <a href="mailto:kinderbeeschools@gmail.com" className="text-[#E1007A] font-semibold underline">kinderbeeschools@gmail.com</a>.
              </p>
            </div>
          )}

          {policyType === 'terms' && (
            <div className="space-y-4">
              <p className="text-stone-900 font-semibold">
                Effective Date: 1 January 2026 | Finnish-way Educare Pvt Ltd
              </p>
              <p>
                Welcome to the website of <strong>Kinderbee International Preschool</strong> and the <strong>Kinderbee Integrated Partnership System (KIPS)</strong>, operated by Finnish-way Educare Pvt Ltd. By browsing or submitting information through this portal, you agree to comply with the following terms:
              </p>
              <h4 className="font-bold text-stone-800 text-base">1. Institutional & Educational Intent</h4>
              <p>
                All informational materials, curriculum frameworks, and partnership overviews provided on this website are for general guidance. Formal admissions and partnership agreements are formalized through official physical or authenticated documentation.
              </p>
              <h4 className="font-bold text-stone-800 text-base">2. Intellectual Property & Trademarks</h4>
              <p>
                The brand name "Kinderbee", the KIPS logo and mascot, proprietary Nordic-inspired learning lesson plans, and pedagogical frameworks are the exclusive intellectual property of Finnish-way Educare Pvt Ltd.
              </p>
              <h4 className="font-bold text-stone-800 text-base">3. Zero-Royalty Partnership Structure</h4>
              <p>
                The zero-royalty partnership model applies in accordance with specific bilateral partnership agreements, ensuring institutional partners retain 100% of recurring student tuition fees subject to standard terms.
              </p>
            </div>
          )}

          {policyType === 'refund' && (
            <div className="space-y-4">
              <p className="text-stone-900 font-semibold">
                Effective Date: 1 January 2026 | Finnish-way Educare Pvt Ltd
              </p>
              <h4 className="font-bold text-stone-800 text-base">1. Preschool Admissions & Registration</h4>
              <p>
                Application and registration fees for preschool admissions are processed in accordance with the campus-specific academic calendar. Enrolment deposits may be refunded upon written request received at least 15 days prior to the commencement of the academic term.
              </p>
              <h4 className="font-bold text-stone-800 text-base">2. Teacher-Training Programmes</h4>
              <p>
                Enrolment fees for teacher-training diplomas and certification courses are refundable within 7 business days from registration, provided course materials or LMS access have not yet been accessed or dispatched.
              </p>
              <h4 className="font-bold text-stone-800 text-base">3. Institutional Advisory & Partnership Deposits</h4>
              <p>
                Consulting and project deposit refunds for institutional expansions or school setup are governed by the bilateral KIPS Memorandum of Understanding (MoU).
              </p>
              <p>
                For refund assistance, please contact us at <a href="mailto:kinderbeeschools@gmail.com" className="text-[#E1007A] font-semibold underline">kinderbeeschools@gmail.com</a> or call <strong>81223 44040</strong>.
              </p>
            </div>
          )}

          {policyType === 'contact' && (
            <div className="space-y-4">
              <h4 className="font-bold text-stone-800 text-base">Head Office & Support</h4>
              <p className="font-semibold text-stone-900">Kinderbee International Preschool</p>
              <div className="space-y-2 text-stone-700">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#E1007A] shrink-0 mt-0.5" />
                  <span>No. 1, Old UCO Bank Road, Opp. Vijay Bakery, Rajarajeshwari Layout, Ramamurthy Nagar, Bengaluru – 560016</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#E1007A] shrink-0" />
                  <a href="tel:8122344040" className="hover:underline font-semibold">81223 44040</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#E1007A] shrink-0" />
                  <a href="mailto:kinderbeeschools@gmail.com" className="hover:underline">kinderbeeschools@gmail.com</a>
                </div>
              </div>
              <div className="pt-2 text-xs text-stone-500">
                <strong>Opening Hours:</strong> 10am–5pm (Mon–Fri) | 10am–1pm (Sat)
              </div>
              <div className="pt-1">
                <a 
                  href="https://share.google/ciljJNjjxvWZUTcWi" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E1007A] hover:underline"
                >
                  <span>Open in Google Maps &rarr;</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
