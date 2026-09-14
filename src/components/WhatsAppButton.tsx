import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  phoneNumber = '918122344040' 
}) => {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const message = encodeURIComponent('Hello Kinderbee, I would like to enquire about Admissions / Franchise / Teacher Training.');
  const whatsappUrl = `https://wa.me/${cleanNumber || '918122344040'}?text=${message}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 print:hidden flex items-center group">
      {/* Tooltip on Desktop hover */}
      <span className="hidden sm:inline-block mr-2.5 px-3 py-1.5 bg-stone-900/90 text-white text-xs font-medium rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Chat with us on WhatsApp
      </span>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Kinderbee Admissions and Support"
        className="w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-white focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
      </a>
    </div>
  );
};
