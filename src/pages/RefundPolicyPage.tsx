import React, { useEffect } from 'react';
import { AlertTriangle, Mail, Phone, MapPin, ArrowLeft, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SystemSettings } from '../types';

interface RefundPolicyPageProps {
  setCurrentTab: (tab: string) => void;
  settings?: SystemSettings | null;
}

export const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ setCurrentTab, settings }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 sm:py-16">
      <SEOHead 
        title="Cancellation and No-Refund Policy | Kinderbee & Finnish-way Academy"
        description="Official Cancellation and No-Refund Policy for Kinderbee International Preschool, Finnish-way Academy, and the Kinderbee Integrated Partnership System (KIPS)."
        keywords="kinderbee refund policy, finnish-way academy fee policy, KIPS payment policy"
        settings={settings}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <button
            onClick={() => {
              setCurrentTab('home');
              window.scrollTo(0, 0);
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-[#E1007A] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Fee &amp; Payment Terms</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
            Cancellation and No-Refund Policy
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-500 pt-1 border-t border-stone-100">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#E1007A]" />
              <strong>Effective Date:</strong> 04.09.2026
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#E1007A]" />
              <strong>Last Updated:</strong> 04.09.2026
            </span>
          </div>

          <p className="text-sm sm:text-base text-stone-700 leading-relaxed pt-2">
            This Cancellation and No-Refund Policy applies to payments made to <strong>Finnishway Educare Private Limited</strong> for <strong>Kinderbee International Preschool</strong>, <strong>Finnish-way Academy</strong>, and the <strong>Kinderbee Integrated Partnership System (KIPS)</strong>.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-950 space-y-2">
            <h3 className="font-bold text-red-900 flex items-center gap-2 text-base">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              Important Notice: All Fees Are Non-Refundable
            </h3>
            <p className="leading-relaxed">
              <strong>All fees, once paid, are non-refundable, except when the relevant programme is cancelled by Finnish-way Academy or when a duplicate or excess payment has been verified.</strong>
            </p>
            <p className="text-xs text-red-800">
              By making a payment, the parent, guardian, applicant, learner or partner confirms that the relevant programme details, fee structure and this Policy have been reviewed and accepted.
            </p>
          </div>
        </div>

        {/* Policy Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8 text-stone-700 text-sm sm:text-base leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">1.</span> Kinderbee International Preschool Fees
            </h2>
            <p>
              All fees paid to Kinderbee International Preschool are strictly non-refundable under any circumstances once payment has been made.
            </p>
            <p className="font-medium text-stone-800">This applies to, but is not limited to:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-stone-600">
              <li>Application fees;</li>
              <li>Registration and admission fees;</li>
              <li>Seat-confirmation fees;</li>
              <li>Tuition fees;</li>
              <li>Term or annual fees;</li>
              <li>Books and learning-material charges;</li>
              <li>Uniform charges;</li>
              <li>Activity and event fees;</li>
              <li>Transport fees; and</li>
              <li>Any other fee or charge collected in connection with the child&rsquo;s admission or education.</li>
            </ul>
            <p className="font-medium text-stone-800 pt-2">No refund will be provided if a parent or guardian subsequently:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-stone-600">
              <li>Withdraws the child&rsquo;s admission;</li>
              <li>Chooses another school;</li>
              <li>Relocates to another place;</li>
              <li>Discontinues attendance;</li>
              <li>Does not use a particular service;</li>
              <li>Is absent for any period; or</li>
              <li>Changes their decision after making payment.</li>
            </ul>
            <p className="text-stone-800 italic bg-stone-50 p-3 rounded-xl border border-stone-200">
              Parents and guardians are therefore requested to confirm all admission details, fee particulars and personal circumstances before making payment.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">2.</span> Preschool Teacher-Training Programmes
            </h2>
            <p>
              All fees paid for preschool teacher-training programmes offered by Finnish-way Academy are strictly non-refundable once payment has been made.
            </p>
            <p className="font-medium text-stone-800">This applies to:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-stone-600">
              <li>Application and registration fees;</li>
              <li>Admission and enrolment fees;</li>
              <li>Course fees;</li>
              <li>Examination and certification fees;</li>
              <li>Learning materials and digital resources;</li>
              <li>Workshops and short-term programmes; and</li>
              <li>Any other programme-related charges.</li>
            </ul>
            <p className="font-medium text-stone-800 pt-2">No refund will be provided when a learner:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-stone-600">
              <li>Withdraws before or after the programme begins;</li>
              <li>Changes their decision after enrolment;</li>
              <li>Fails to attend classes;</li>
              <li>Discontinues the programme;</li>
              <li>Does not complete assignments or examinations;</li>
              <li>Does not access the learning platform or materials;</li>
              <li>Is unable to participate because of personal, professional, technical or medical circumstances; or</li>
              <li>Requests a change of batch, mode or schedule.</li>
            </ul>
            <p className="text-stone-800 italic bg-stone-50 p-3 rounded-xl border border-stone-200">
              Learners must therefore review the programme duration, delivery mode, eligibility, schedule, curriculum and fee structure before making payment.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">3.</span> Cancellation by Finnish-way Academy
            </h2>
            <p>
              If Finnish-way Academy cancels a teacher-training programme and does not offer a suitable alternative batch, the learner will be entitled to a refund of the amount paid for that cancelled programme.
            </p>
            <p className="font-medium text-stone-800">Where a programme is cancelled, the learner may choose:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-stone-600">
              <li>A refund of the eligible amount; or</li>
              <li>Transfer to another available programme or batch.</li>
            </ul>
            <p className="text-stone-600 text-sm">
              A change in faculty, timetable, venue, delivery mode or commencement date will not ordinarily be treated as programme cancellation, provided that the programme continues to be offered.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">4.</span> Duplicate, Excess or Failed Payments
            </h2>
            <p>
              A verified duplicate or excess payment will be returned after reconciliation of the transaction.
            </p>
            <p>
              If an amount is debited but is not reflected in our records, the payer should first check the transaction status with the relevant bank or UPI service provider and then contact us with the transaction reference number.
            </p>
            <p className="font-semibold text-stone-800">
              A pending transaction should not be repeated until its final status has been confirmed.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">5.</span> Transfers and Deferrals
            </h2>
            <p>
              Fees and admissions are not ordinarily transferable to another person, programme, batch or academic year.
            </p>
            <p>
              A request for transfer or deferment may be considered solely at the discretion of Kinderbee or Finnish-way Academy, subject to programme requirements and seat availability. Approval of such a request does not create a right to a refund.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">6.</span> Refund Procedure for Eligible Cases
            </h2>
            <p className="font-medium text-stone-800">Refund requests will be considered only in the following situations:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-stone-600">
              <li>A teacher-training programme is cancelled by Finnish-way Academy without a suitable alternative;</li>
              <li>The same payment has been made more than once;</li>
              <li>An excess amount has been paid; or</li>
              <li>A refund is required under an applicable law.</li>
            </ul>
            <p className="font-medium text-stone-800 pt-2">An eligible request must include:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-stone-600">
              <li>Name of the parent, applicant or learner;</li>
              <li>Admission, application or enrolment number;</li>
              <li>Programme or service name;</li>
              <li>Amount and date of payment;</li>
              <li>UPI transaction or reference number; and</li>
              <li>Reason for the request.</li>
            </ul>
            <p className="text-stone-800 bg-stone-50 p-3 rounded-xl border border-stone-200">
              Approved refunds will normally be processed within <strong>7–14 business days</strong> after verification. Wherever reasonably possible, the refund will be made to the original payment source.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">7.</span> School-Development and Partnership Services
            </h2>
            <p>
              Payments relating to KIPS school-development, consultancy or partnership services will be governed by the written agreement or proposal accepted by the parties.
            </p>
            <p>
              Unless the applicable agreement expressly states otherwise, payments made for consultations, documentation, designs, curriculum resources, professional services or work already commenced are non-refundable.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">8.</span> Statutory Rights
            </h2>
            <p>
              Nothing in this Policy excludes or limits any right or remedy that cannot lawfully be excluded under applicable Indian law.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 9 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">9.</span> Contact for Reconciliation or Refunds
            </h2>
            <p>
              For payment reconciliation or an eligible refund request, please contact:
            </p>

            <div className="bg-stone-50 rounded-2xl p-5 sm:p-6 border border-stone-200 space-y-3 text-sm">
              <div className="font-bold text-stone-900 text-base">Finnishway Educare Private Limited</div>
              <div className="text-stone-600">Kinderbee International Preschool</div>

              <div className="space-y-2 pt-2 border-t border-stone-200">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#E1007A] shrink-0 mt-0.5" />
                  <span>No. 1, Old UCO Bank Road, Opp. Vijay Bakery, Rajarajeshwari Layout, Ramamurthy Nagar, Bengaluru – 560016</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#E1007A] shrink-0" />
                  <a href="mailto:kinderbeeschools@gmail.com" className="text-[#E1007A] hover:underline font-medium">kinderbeeschools@gmail.com</a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#E1007A] shrink-0" />
                  <a href="tel:8122344040" className="text-stone-900 hover:text-[#E1007A] font-semibold">81223 44040</a>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Bottom Return Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setCurrentTab('home');
              window.scrollTo(0, 0);
            }}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>
        </div>

      </div>
    </div>
  );
};
