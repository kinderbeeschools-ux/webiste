import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, ExternalLink, Facebook, Linkedin, Instagram, ArrowRight, ShieldCheck } from 'lucide-react';
import { SystemSettings } from '../types';
import { PolicyModal, PolicyType } from './PolicyModal';

interface FooterProps {
  settings: SystemSettings | null;
  setCurrentTab: (tab: string) => void;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, setCurrentTab, onOpenConsultation }) => {
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);

  const phone = settings?.phone || '81223 44040';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const email = settings?.email || 'kinderbeeschools@gmail.com';
  const officeAddress = settings?.officeAddress || 'No. 1, Old UCO Bank Road, Opp. Vijay Bakery, Rajarajeshwari Layout, Ramamurthy Nagar, Bengaluru – 560016';
  const mapsUrl = settings?.mapsUrl || 'https://share.google/ciljJNjjxvWZUTcWi';

  return (
    <>
      <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
            
            {/* Col 1: KIPS Logo & Mascot Brand Profile (Span 4) */}
            <div className="lg:col-span-4 space-y-5">
              {/* KIPS Brand Logo with Mascot */}
              <div 
                onClick={() => { setCurrentTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="cursor-pointer inline-flex items-center gap-3 bg-white p-2.5 sm:p-3 rounded-2xl shadow-md border border-stone-100 hover:opacity-95 transition"
              >
                <img 
                  src={settings?.logoUrl || "https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Logo.png"} 
                  alt="KIPS - Kinderbee Integrated Partnership System Mascot Logo" 
                  className="h-12 sm:h-14 w-auto object-contain contrast-[1.08] brightness-[1.02]"
                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                />
                <div className="border-l border-stone-300 pl-3">
                  <div className="font-display font-black text-stone-900 text-sm tracking-tight leading-tight">
                    KIPS
                  </div>
                  <div className="text-[10px] font-bold text-[#E1007A] uppercase tracking-wider">
                    Partnership System
                  </div>
                </div>
              </div>

              <p className="text-sm text-stone-300 leading-relaxed max-w-sm">
                The <strong>Kinderbee Integrated Partnership System (KIPS)</strong> empowers visionary educators and entrepreneurs with a <strong>zero-royalty partnership model</strong>, Nordic-inspired play-based curriculum, and <strong>360-degree institutional support</strong> aligned with the principles of NEP 2020.
              </p>

              {/* Social Media Icons */}
              <div className="flex items-center gap-3 pt-1">
                <a 
                  href={settings?.facebookUrl || "https://facebook.com/kinderbee"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Kinderbee on Facebook"
                  className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-[#E1007A] flex items-center justify-center text-stone-300 hover:text-white transition shadow-xs"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href={settings?.linkedinUrl || "https://linkedin.com/company/kinderbee-education"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Kinderbee on LinkedIn"
                  className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-[#E1007A] flex items-center justify-center text-stone-300 hover:text-white transition shadow-xs"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href={settings?.instagramUrl || "https://instagram.com/kinderbee"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Kinderbee on Instagram"
                  className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-[#E1007A] flex items-center justify-center text-stone-300 hover:text-white transition shadow-xs"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Col 2: Quick Links (Span 3) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-white font-display font-bold text-base tracking-wide flex items-center gap-2">
                <span>Quick Links</span>
              </h4>
              <ul className="space-y-2.5 text-sm text-stone-300">
                <li>
                  <button 
                    onClick={() => { setCurrentTab('home'); window.scrollTo({ top: 500, behavior: 'smooth' }); }} 
                    className="hover:text-[#E1007A] transition flex items-center gap-2 cursor-pointer text-left"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#E1007A] shrink-0" />
                    <span>Preschool Programmes</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setCurrentTab('fwa'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="hover:text-[#E1007A] transition flex items-center gap-2 cursor-pointer text-left"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#E1007A] shrink-0" />
                    <span>Teacher-Training Programmes</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setCurrentTab('partnerships'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="hover:text-[#E1007A] transition flex items-center gap-2 cursor-pointer text-left"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#E1007A] shrink-0" />
                    <span>Preschool Partnership</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setCurrentTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="hover:text-[#E1007A] transition flex items-center gap-2 cursor-pointer text-left"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#E1007A] shrink-0" />
                    <span>About Us & Our Story</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setCurrentTab('blogs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="hover:text-[#E1007A] transition flex items-center gap-2 cursor-pointer text-left"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#E1007A] shrink-0" />
                    <span>Latest Blogs & Activities</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setCurrentTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="hover:text-[#E1007A] transition flex items-center gap-2 cursor-pointer text-left"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#E1007A] shrink-0" />
                    <span>Contact Us</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Head Office & Support (Span 5) */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-white font-display font-bold text-base tracking-wide">
                Head Office &amp; Support
              </h4>
              <div className="text-white font-semibold text-sm">
                Kinderbee International Preschool
              </div>
              
              <ul className="space-y-3 text-sm text-stone-300">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#E1007A] shrink-0 mt-1" />
                  <span className="leading-relaxed">{officeAddress}</span>
                </li>

                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#E1007A] shrink-0" />
                  <a 
                    href={`tel:${cleanPhone}`} 
                    className="hover:text-white transition font-medium text-stone-200"
                  >
                    {phone}
                  </a>
                </li>

                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#E1007A] shrink-0" />
                  <a 
                    href={`mailto:${email}`} 
                    className="hover:text-white transition font-medium text-stone-200"
                  >
                    {email}
                  </a>
                </li>

                <li className="flex items-center gap-3 text-xs text-stone-400">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Opening hours – 10am-5pm (Mon-Fri) 10am-1pm (Sat)</span>
                </li>

                <li className="pt-1">
                  <a 
                    href={mapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-[#FFD400] transition"
                  >
                    <span>View Location on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Legal Links Bar */}
          <div className="pt-8 pb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-stone-400 font-medium">
            <button 
              onClick={() => { setCurrentTab('payments'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="hover:text-white transition cursor-pointer text-[#FFD400] font-semibold"
            >
              Fee Payment
            </button>
            <span className="text-stone-600">•</span>
            <button 
              onClick={() => { setCurrentTab('privacy-policy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="hover:text-white transition cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-stone-600">•</span>
            <button 
              onClick={() => { setCurrentTab('terms-and-conditions'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="hover:text-white transition cursor-pointer"
            >
              Terms and Conditions
            </button>
            <span className="text-stone-600">•</span>
            <button 
              onClick={() => { setCurrentTab('cancellation-refund'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="hover:text-white transition cursor-pointer"
            >
              Cancellation and No-Refund Policy
            </button>
            <span className="text-stone-600">•</span>
            <button 
              onClick={() => { setCurrentTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="hover:text-white transition cursor-pointer"
            >
              Contact Us
            </button>
          </div>

          {/* Copyright Notice */}
          <div className="text-center text-xs text-stone-400 pt-2 leading-relaxed max-w-2xl mx-auto">
            &copy; 2026 Finnishway Educare Private Limited. All rights reserved. Kinderbee International Preschool, Finnish-way Academy, and KIPS are operating brands of Finnishway Educare Private Limited.
          </div>

        </div>
      </footer>

      {/* Policy Modal */}
      {activePolicy && (
        <PolicyModal 
          isOpen={!!activePolicy} 
          onClose={() => setActivePolicy(null)} 
          policyType={activePolicy} 
        />
      )}
    </>
  );
};
