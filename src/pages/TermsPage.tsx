import React, { useEffect } from 'react';
import { FileText, Mail, Phone, MapPin, ArrowLeft, Calendar, Clock, AlertCircle } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SystemSettings } from '../types';

interface TermsPageProps {
  setCurrentTab: (tab: string) => void;
  settings?: SystemSettings | null;
}

export const TermsPage: React.FC<TermsPageProps> = ({ setCurrentTab, settings }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 sm:py-16">
      <SEOHead 
        title="Terms and Conditions | Kinderbee International Preschool & KIPS"
        description="Official Terms and Conditions governing your use of www.kinderbeeschools.com, operated by Finnishway Educare Private Limited under the Kinderbee and KIPS brands."
        keywords="kinderbee terms and conditions, KIPS terms, finnishway educare legal"
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
          <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-100 text-[#E1007A] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
            <FileText className="w-4 h-4 text-[#E1007A]" />
            <span>Official Terms</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
            Terms and Conditions
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-500 pt-1 border-t border-stone-100">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#E1007A]" />
              <strong>Effective Date:</strong> 04.09.2026
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#E1007A]" />
              <strong>Last Updated:</strong> 14 September 2026
            </span>
          </div>

          <p className="text-sm sm:text-base text-stone-700 leading-relaxed pt-2">
            These Terms and Conditions govern your use of <a href="https://www.kinderbeeschools.com" className="text-[#E1007A] underline font-medium" target="_blank" rel="noopener noreferrer">www.kinderbeeschools.com</a>, operated by <strong>Finnishway Educare Private Limited</strong> under the Kinderbee and KIPS brands.
          </p>
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p>
              By accessing or using this website, you agree to these Terms. If you do not agree, please discontinue its use.
            </p>
          </div>
        </div>

        {/* Policy Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8 text-stone-700 text-sm sm:text-base leading-relaxed">
          
          {/* 1 */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">1.</span> Website Purpose
            </h2>
            <p>
              This website provides information about Kinderbee preschool education, teacher-training programmes, school-development services and partnership opportunities.
            </p>
            <p>
              Website content is intended for general information. An enquiry or application does not by itself guarantee admission, enrolment, certification, appointment or acceptance as a partner.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* 2 */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">2.</span> Accuracy of Information
            </h2>
            <p>
              We make reasonable efforts to keep information accurate and current. Programme content, schedules, fees, availability, delivery modes and other details may be revised when reasonably necessary.
            </p>
            <p>
              Material changes affecting an enrolled applicant will be communicated through the available contact details.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* 3 */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">3.</span> Admissions, Courses and Partnerships
            </h2>
            <p>
              Admission, course enrolment and partnership applications may be subject to eligibility requirements, document verification, fee payment and acceptance of additional programme-specific terms.
            </p>
            <p>
              Preschool admissions are subject to age requirements, seat availability and completion of the prescribed admission process.
            </p>
            <p>
              Partnership information on the website is introductory and does not constitute a binding commercial offer. A partnership becomes effective only after due diligence and execution of a written agreement by authorised representatives.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* 4 */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">4.</span> Fees, Payments and Refunds
            </h2>
            <p>
              Applicable fees and payment schedules will be communicated before enrolment or confirmation.
            </p>
            <p>
              Where online payments are available, transactions may be processed by an independent payment-service provider. Users are responsible for providing accurate billing information.
            </p>
            <p>
              Cancellations, refunds and transfers will be governed by the policy communicated for the relevant programme or service. A separate{' '}
              <button
                onClick={() => {
                  setCurrentTab('cancellation-refund');
                  window.scrollTo(0, 0);
                }}
                className="text-[#E1007A] underline font-semibold hover:text-pink-700 inline cursor-pointer"
              >
                Cancellation and No-Refund Policy
              </button>{' '}
              should be reviewed before payment.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* 5 */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">5.</span> User Responsibilities
            </h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-stone-600">
              <li>Provide accurate and current information;</li>
              <li>Use the website only for lawful purposes;</li>
              <li>Refrain from attempting unauthorised access to the website or its systems;</li>
              <li>Refrain from uploading harmful code or interfering with website operation; and</li>
              <li>Avoid copying or using protected content without permission.</li>
            </ul>
            <p className="text-stone-800 font-medium">
              Parents and lawful guardians are responsible for information submitted about children.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* 6 */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">6.</span> Intellectual Property
            </h2>
            <p>
              Unless otherwise stated, the website&rsquo;s text, graphics, logos, curriculum descriptions, photographs, videos, designs, downloadable resources and other original content belong to Finnishway Educare Private Limited or are used with permission.
            </p>
            <p>
              No content may be copied, reproduced, modified, republished, distributed or commercially exploited without prior written permission, except where permitted by law.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* 7 */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">7.</span> Photographs and Media
            </h2>
            <p>
              Photographs or videos of children will be used only with appropriate parental or guardian consent.
            </p>
            <p>
              Website visitors must not download, reproduce, circulate or misuse photographs or videos of children appearing on the website.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* 8 */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">8.</span> Third-Party Links and Services
            </h2>
            <p>
              Links to external websites are provided for convenience. We do not control or endorse all third-party content and are not responsible for external websites, services, availability or privacy practices.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* 9 */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">9.</span> Disclaimer
            </h2>
            <p>
              We aim to provide reliable educational information, but we do not guarantee that every page will always be error-free, uninterrupted or continuously available.
            </p>
            <p>
              General educational content on the website should not be treated as personalised professional, legal, financial or medical advice.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* 10 */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">10.</span> Limitation of Liability
            </h2>
            <p>
              To the extent permitted by applicable law, Finnishway Educare Private Limited will not be liable for indirect or consequential loss arising solely from website use, temporary unavailability, unauthorised third-party activity or reliance on general website information.
            </p>
            <p>
              Nothing in these Terms excludes rights or remedies that cannot lawfully be excluded under applicable consumer-protection law.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* 11 */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">11.</span> Privacy
            </h2>
            <p>
              Personal information submitted through the website will be handled in accordance with our{' '}
              <button
                onClick={() => {
                  setCurrentTab('privacy-policy');
                  window.scrollTo(0, 0);
                }}
                className="text-[#E1007A] underline font-semibold hover:text-pink-700 inline cursor-pointer"
              >
                Privacy Policy
              </button>.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* 12 */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">12.</span> Changes to These Terms
            </h2>
            <p>
              We may update these Terms to reflect changes in our services or legal obligations. Updated Terms will be published on this page with the revised date.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* 13 */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">13.</span> Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of India. Subject to applicable consumer-protection requirements, disputes will fall under the jurisdiction of the competent courts in Bengaluru, Karnataka.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* 14 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">14.</span> Contact Us
            </h2>
            <p>
              For questions concerning these Terms, please contact:
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
