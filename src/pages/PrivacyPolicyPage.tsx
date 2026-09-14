import React, { useEffect } from 'react';
import { ShieldCheck, Mail, Phone, MapPin, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SystemSettings } from '../types';

interface PrivacyPolicyPageProps {
  setCurrentTab: (tab: string) => void;
  settings?: SystemSettings | null;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ setCurrentTab, settings }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 sm:py-16">
      <SEOHead 
        title="Privacy Policy | Kinderbee International Preschool & KIPS"
        description="Official Privacy Policy for Kinderbee International Preschool and the Kinderbee Integrated Partnership System (KIPS), operated by Finnishway Educare Private Limited."
        keywords="kinderbee privacy policy, KIPS privacy policy, finnishway educare data policy"
        settings={settings}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
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

        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-100 text-[#E1007A] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-[#E1007A]" />
            <span>Legal Document</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
            Privacy Policy
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
            Kinderbee International Preschool and the Kinderbee Integrated Partnership System (KIPS), operated by <strong>Finnishway Educare Private Limited</strong> (&ldquo;Kinderbee,&rdquo; &ldquo;KIPS,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), respect your privacy and are committed to protecting the personal information shared with us through <a href="https://www.kinderbeeschools.com" className="text-[#E1007A] underline font-medium" target="_blank" rel="noopener noreferrer">www.kinderbeeschools.com</a>.
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8 text-stone-700 text-sm sm:text-base leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">1.</span> Information We Collect
            </h2>
            <p>Depending on how you use our website, we may collect:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-stone-600">
              <li>Your name, telephone number, email address and location;</li>
              <li>Information submitted through admission, partnership, course-enquiry or contact forms;</li>
              <li>Parent or guardian details and limited information relating to a child when required for an admission enquiry;</li>
              <li>Course registration, payment and transaction information;</li>
              <li>Communications sent to us through email, telephone, WhatsApp or website forms; and</li>
              <li>Technical information such as browser type, device information, IP address and website usage data collected through essential cookies or analytics tools.</li>
            </ul>
            <p className="text-stone-800 font-medium">We request only the information reasonably necessary for the stated purpose.</p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">2.</span> How We Use Your Information
            </h2>
            <p>We may use your information to:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-stone-600">
              <li>Respond to enquiries and provide requested information;</li>
              <li>Process admission, teacher-training or partnership applications;</li>
              <li>Communicate programme schedules, fees, events and service updates;</li>
              <li>Provide academic, administrative and customer support;</li>
              <li>Process payments and maintain legally required records;</li>
              <li>Improve our website, programmes and services;</li>
              <li>Protect the security of our systems; and</li>
              <li>Comply with applicable legal and regulatory requirements.</li>
            </ul>
            <p className="text-stone-800 font-medium">
              Promotional messages will be sent only where consent has been obtained or where otherwise permitted by law. You may opt out at any time.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">3.</span> Children&rsquo;s Privacy
            </h2>
            <p>
              Our website is intended primarily for parents, guardians, educators and educational entrepreneurs. A child should not independently submit personal information through this website.
            </p>
            <p>
              When information about a child is required, it must be provided by, or with the verifiable consent of, the child&rsquo;s parent or lawful guardian. We do not knowingly use children&rsquo;s personal information for targeted advertising, behavioural monitoring or profiling.
            </p>
            <p>
              Photographs, videos, testimonials or learning records identifying children will be published only after obtaining appropriate consent from a parent or lawful guardian.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">4.</span> Consent and Your Choices
            </h2>
            <p>
              Where processing is based on consent, you may withdraw that consent by contacting us. Withdrawal will not affect processing already lawfully completed, but it may affect our ability to provide a requested service.
            </p>
            <p>
              Consent for promotional communication and consent for publishing a child&rsquo;s photograph or video will be obtained separately from admission consent.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">5.</span> Sharing of Information
            </h2>
            <p className="font-semibold text-stone-800">
              We do not sell or rent personal information.
            </p>
            <p>
              Information may be shared only with authorised staff, service providers, payment processors, technology providers, professional advisers or government authorities when necessary for the purposes described in this Policy or required by law.
            </p>
            <p>
              Service providers are expected to use the information only for the authorised purpose and to maintain appropriate confidentiality and security.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">6.</span> Data Retention and Security
            </h2>
            <p>
              We retain personal information only for as long as reasonably necessary to fulfil the purpose for which it was collected or to meet legal, accounting, academic and regulatory obligations.
            </p>
            <p>
              We use reasonable administrative, technical and organisational safeguards to protect information from unauthorised access, misuse, alteration, disclosure or loss. However, no internet-based system can be guaranteed to be completely secure.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">7.</span> Cookies and Analytics
            </h2>
            <p>
              Our website may use essential cookies and limited analytics technologies to support functionality, understand website performance and improve user experience.
            </p>
            <p>
              Where legally required, non-essential cookies will be used only after consent. You may control cookies through your browser settings or the cookie-consent options displayed on the website.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">8.</span> Your Rights
            </h2>
            <p>Subject to applicable law, you may request:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-stone-600">
              <li>Access to information about your personal data;</li>
              <li>Correction, completion or updating of inaccurate information;</li>
              <li>Erasure of information that is no longer required;</li>
              <li>Withdrawal of consent;</li>
              <li>Information about how your data has been used or shared; and</li>
              <li>Review of a privacy-related grievance.</li>
            </ul>
            <p className="text-stone-800 font-medium">We may need to verify your identity before acting on a request.</p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">9.</span> Third-Party Links
            </h2>
            <p>
              Our website may contain links to third-party websites or services. Their privacy practices are governed by their respective policies, and we are not responsible for their content or data-handling practices.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">10.</span> Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy to reflect changes in our services, technology or legal obligations. The revised version will be published on this page with an updated date.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 11 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 flex items-center gap-2">
              <span className="text-[#E1007A]">11.</span> Contact and Grievances
            </h2>
            <p>
              For privacy questions, consent withdrawal or data-related requests, please contact:
            </p>

            <div className="bg-stone-50 rounded-2xl p-5 sm:p-6 border border-stone-200 space-y-3 text-sm">
              <div className="font-bold text-stone-900 text-base">Privacy and Grievance Contact</div>
              <div className="text-stone-800 font-semibold">Finnishway Educare Private Limited</div>
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

        {/* Bottom Back Button */}
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
