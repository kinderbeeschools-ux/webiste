import React, { useState } from 'react';
import { Phone, ArrowRight, X } from 'lucide-react';
import { SystemSettings } from '../types';

interface StickyContactWidgetProps {
  settings: SystemSettings | null;
  onOpenConsultation: () => void;
}

export const StickyContactWidget: React.FC<StickyContactWidgetProps> = ({ settings, onOpenConsultation }) => {
  const [showPopup, setShowPopup] = useState(false);
  const phoneNumber = settings?.phone || '+91 99013 32233';
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=Hi%2C%20I%20am%20interested%20in%20KinderBee%20School%20%26%20Admission%20%2F%20Franchise%20Inquiry.`;

  return (
    <aside 
      aria-label="Quick Contact & Admissions" 
      className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3.5 pointer-events-auto select-none"
    >
      {/* Quick Interactive Info Bubble */}
      {showPopup && (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-pink-100 max-w-xs w-72 mb-1 animate-fadeIn text-left relative">
          <button 
            onClick={() => setShowPopup(false)}
            className="absolute top-2.5 right-2.5 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            aria-label="Close message"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E1007A]">Admissions Desk</span>
          </div>

          <p className="text-xs font-semibold text-stone-800 leading-snug mb-3">
            Admissions open for Playgroup, Nursery, LKG, UKG & Daycare.
          </p>

          <div className="space-y-2">
            <a 
              href={`tel:${phoneNumber}`}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#E1007A] text-xs font-bold transition"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span>Call {phoneNumber}</span>
              </div>
              <ArrowRight className="w-3 h-3" />
            </a>

            <button
              onClick={() => {
                setShowPopup(false);
                onOpenConsultation();
              }}
              className="w-full bg-gradient-to-r from-[#E1007A] to-pink-600 text-white text-xs font-bold py-2 rounded-xl text-center shadow-xs hover:opacity-95 transition"
            >
              Apply / Enquire Now
            </button>
          </div>
        </div>
      )}

      {/* ADMISSIONS OPEN Pill Button (Green Round Pill with Amber Dot and Arrow) */}
      <button
        onClick={onOpenConsultation}
        className="group flex items-center gap-2 bg-[#083E2A] hover:bg-[#063322] text-white px-4 py-2 rounded-full shadow-xl hover:shadow-2xl border border-emerald-600/50 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-98"
        title="Admissions Open - Click to Enquire"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800] shrink-0 animate-pulse"></span>
        <span className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase text-white whitespace-nowrap">
          ADMISSIONS OPEN
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-[#FFB800] group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Round Call Button (Sunset Pink-to-Orange Gradient with Soft Glow Ring) */}
      <a
        href={`tel:${phoneNumber}`}
        className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-[#E1007A] via-[#FA2668] to-[#FF7A00] hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-xl ring-4 ring-pink-500/25 hover:ring-pink-500/40 transition-all duration-300"
        title={`Call us at ${phoneNumber}`}
        aria-label={`Call ${phoneNumber}`}
      >
        <Phone className="w-5 h-5 fill-white stroke-none text-white transform -rotate-12" />
      </a>

      {/* Round WhatsApp Button (WhatsApp Green with Soft Glow Ring) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] hover:bg-[#20be5b] hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-xl ring-4 ring-emerald-500/25 hover:ring-emerald-500/40 transition-all duration-300"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>
    </aside>
  );
};
