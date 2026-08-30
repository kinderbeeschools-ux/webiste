import React from 'react';
import { Phone, Mail, MapPin, Facebook, Linkedin, Instagram, ArrowRight, Heart } from 'lucide-react';
import { SystemSettings } from '../types';

interface FooterProps {
  settings: SystemSettings | null;
  setCurrentTab: (tab: string) => void;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, setCurrentTab, onOpenConsultation }) => {
  return (
    <footer className="bg-stone-900 text-stone-200 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
        
        {/* Col 1: About Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Logo.png" 
              alt="KinderBee Logo" 
              className="h-12 w-auto object-contain rounded-xl bg-white shadow-sm p-1" 
            />
          </div>
          <p className="text-sm text-stone-300 leading-relaxed">
            {settings?.footerTagline || "India's leading Zero Royalty educational franchise and school development ecosystem. Bringing Nordic play-based excellence and NEP 2020 compliance to forward-thinking entrepreneurs."}
          </p>
          <div className="flex items-center gap-3 pt-2">
            {settings?.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-[#E1007A] flex items-center justify-center text-stone-300 hover:text-white transition shadow-xs">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {settings?.linkedinUrl && (
              <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-[#E1007A] flex items-center justify-center text-stone-300 hover:text-white transition shadow-xs">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {settings?.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-[#E1007A] flex items-center justify-center text-stone-300 hover:text-white transition shadow-xs">
                <Instagram className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-white font-display font-bold text-base mb-4 tracking-wide">
            Partnership Pathways
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button onClick={() => setCurrentTab('partnerships')} className="hover:text-[#E1007A] transition flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-[#E1007A]" />
                Preschool Franchises (Zero Royalty)
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('partnerships')} className="hover:text-[#E1007A] transition flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-[#E1007A]" />
                CBSE & K-12 School Setup
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('fwa')} className="hover:text-[#E1007A] transition flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-[#E1007A]" />
                FinnishWay Academy Training
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('investors')} className="hover:text-[#E1007A] transition flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-[#E1007A]" />
                Investor ROI & Financial Models
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('blogs')} className="hover:text-[#E1007A] transition flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-[#E1007A]" />
                Educational Insights & Blogs
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Contact Details */}
        <div>
          <h4 className="text-white font-display font-bold text-base mb-4 tracking-wide">
            Headquarters & Support
          </h4>
          <ul className="space-y-3 text-sm text-stone-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#E1007A] shrink-0 mt-1" />
              <span>{settings?.officeAddress || 'Opp Vijay Bakery, Old UCO Bank road, Ramamurthy Nagar, Bangalore, 560016'}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#E1007A] shrink-0" />
              <a href={`tel:${settings?.phone || '+919901332233'}`} className="hover:text-white transition">{settings?.phone || 'Talk to an Expert'}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#E1007A] shrink-0" />
              <a href={`mailto:${settings?.email || 'kinderbeeschools@gmail.com'}`} className="hover:text-white transition">{settings?.email || 'kinderbeeschools@gmail.com'}</a>
            </li>
          </ul>
        </div>

        {/* Col 4: Newsletter / Call to Action */}
        <div className="space-y-4">
          <h4 className="text-white font-display font-bold text-base tracking-wide">
            Start Your Project
          </h4>
          <p className="text-sm text-stone-400">
            Speak with our school planning consultants to check your property feasibility and funding options.
          </p>
          <button
            onClick={onOpenConsultation}
            className="w-full bg-[#E1007A] hover:bg-pink-700 text-white font-medium py-3 rounded-xl transition duration-300 text-sm shadow-md flex items-center justify-center gap-2"
          >
            <span>Book Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-4">
        <div>
          &copy; {new Date().getFullYear()} Kinderbee Integrated Partnership System (KIPS) & FinnishWay Academy. All rights reserved.
        </div>
        <div className="flex items-center gap-3">
          <span>Powered by Nordic Educational Excellence & NEP 2020 Frameworks</span>
          <span>•</span>
          <button 
            onClick={() => setCurrentTab('admin')} 
            className="text-stone-500 hover:text-white transition underline cursor-pointer"
          >
            Admin Dashboard
          </button>
        </div>
      </div>
    </footer>
  );
};
