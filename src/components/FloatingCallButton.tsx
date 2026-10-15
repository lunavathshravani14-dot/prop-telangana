'use client';

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingCallButton() {
  const phoneNumber = '+917013873126';
  const displayPhone = '+91 70138 73126';
  const whatsappUrl = `https://wa.me/917013873126?text=${encodeURIComponent(
    'Hello PropTelangana! I am interested in verified properties and open plots. Please share brochure and details.'
  )}`;

  return (
    <div className="fixed bottom-6 right-5 sm:right-8 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* WhatsApp Quick Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white p-3 sm:px-4 sm:py-2.5 rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105"
      >
        <MessageCircle className="w-5 h-5 fill-white shrink-0" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          WhatsApp
        </span>
      </a>

      {/* Direct Call Button */}
      <a
        href={`tel:${phoneNumber}`}
        aria-label={`Call Enquiry: ${displayPhone}`}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white p-3.5 sm:px-5 sm:py-3 rounded-full shadow-2xl hover:shadow-brand-500/40 transition-all duration-300 hover:scale-105 ring-4 ring-brand-500/20"
      >
        {/* Pulsing indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
        </span>

        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          <Phone className="w-5 h-5 animate-bounce" />
        </div>

        <div className="hidden sm:flex flex-col text-left pr-1">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-brand-100 leading-tight">
            Enquiry Hotline
          </span>
          <span className="text-xs font-extrabold tracking-tight">
            {displayPhone}
          </span>
        </div>
      </a>
    </div>
  );
}
