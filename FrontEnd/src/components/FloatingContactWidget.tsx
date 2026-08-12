import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import type { CompanyInfo } from '../types/api';

interface FloatingContactWidgetProps {
  companyInfo?: CompanyInfo | null;
}

export const FloatingContactWidget: React.FC<FloatingContactWidgetProps> = ({ companyInfo }) => {
  const rawWhatsapp = companyInfo?.whatsapp || companyInfo?.phone || '';
  const cleanWhatsappNumber = rawWhatsapp.replace(/[^0-9]/g, '');
  
  const rawPhone = companyInfo?.phone || companyInfo?.whatsapp || '';
  const cleanPhoneNumber = rawPhone.trim();

  if (!cleanWhatsappNumber && !cleanPhoneNumber) {
    return null;
  }

  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    'Hello! I would like to inquire about your cargo and logistics services.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end pointer-events-none">
      {/* Floating Phone Call Button */}
      {cleanPhoneNumber && (
        <a
          href={`tel:${cleanPhoneNumber}`}
          className="pointer-events-auto group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 active:scale-95"
          title={`Call Us: ${cleanPhoneNumber}`}
          aria-label="Call Customer Support"
        >
          <Phone className="w-6 h-6 animate-bounce stroke-[2.2]" />
          <span className="absolute right-16 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Call: {cleanPhoneNumber}
          </span>
        </a>
      )}

      {/* Floating WhatsApp Button */}
      {cleanWhatsappNumber && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 active:scale-95"
          title="Chat on WhatsApp"
          aria-label="Contact via WhatsApp"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping pointer-events-none" />
          <MessageCircle className="w-7 h-7 relative z-10 fill-current" />
          <span className="absolute right-16 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat on WhatsApp
          </span>
        </a>
      )}
    </div>
  );
};
