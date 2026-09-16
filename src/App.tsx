import React, { useState } from 'react';
import { Heart, Sparkles, Calendar, MapPin, Shield, CheckCircle } from 'lucide-react';
import { HeroSection } from './components/HeroSection';
import { CountdownTimer } from './components/CountdownTimer';
import { RSVPForm } from './components/RSVPForm';
import { EventInfo } from './components/EventInfo';
import { WhatToBring } from './components/WhatToBring';
import { LocationSection } from './components/LocationSection';
import { FooterSection } from './components/FooterSection';
import { OrganizerModal } from './components/OrganizerModal';
import { RSVP } from './types';

export default function App() {
  const [isOrganizerOpen, setIsOrganizerOpen] = useState(false);
  const [lastSubmittedRSVP, setLastSubmittedRSVP] = useState<RSVP | null>(null);

  const scrollToRSVP = () => {
    const el = document.getElementById('rsvp-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F7] text-[#2D2328] relative selection:bg-[#FF1493]/20 selection:text-[#FF1493] overflow-x-hidden">
      
      {/* Soft Watercolor Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-pink-100/40 via-orange-50/30 to-white/20 blur-[120px] pointer-events-none" />
      
      {/* Top Floating Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-[#FFF9F7]/85 backdrop-blur-md border-b border-[#FF2A85]/15 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Logo / Monogram */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF1493] via-[#E11D48] to-[#FF6B00] text-white flex items-center justify-center font-serif font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              AJ
            </div>
            <div>
              <span className="font-serif font-bold text-[#D81B60] text-sm sm:text-base tracking-tight block leading-tight">
                Formatura Ana Julia
              </span>
              <span className="font-body text-[10px] text-[#8C7A87] block leading-none">
                10 de Outubro • Chácara Marista
              </span>
            </div>
          </a>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsOrganizerOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FFE4E6] to-[#FFEDD5] hover:from-[#FECDD3] hover:to-[#FED7AA] text-[#BE123C] text-xs font-semibold transition-colors cursor-pointer border border-[#FFCCD5]"
              title="Painel de controle para a anfitriã"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Painel</span>
            </button>

            <button
              onClick={scrollToRSVP}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[#FF1493] via-[#E11D48] to-[#FF5500] hover:from-[#E11D48] hover:to-[#EA580C] text-white font-serif text-xs sm:text-sm font-bold shadow-md shadow-[#FF1493]/25 active:scale-95 transition-all cursor-pointer"
            >
              <span>CONFIRMAR</span>
              <Heart className="w-3.5 h-3.5 fill-white" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Opening Section */}
        <HeroSection />

        {/* 2. RSVP Interactive Form (Core Functionality) */}
        <RSVPForm onRSVPSubmitted={(rsvp) => setLastSubmittedRSVP(rsvp)} />

        {/* 3. Countdown Timer */}
        <CountdownTimer />

        {/* 4. Informações da Festa */}
        <EventInfo />

        {/* 5. Não esqueça de levar! */}
        <WhatToBring />

        {/* 6. Localização */}
        <LocationSection />
      </main>

      {/* 7. Rodapé */}
      <FooterSection onOpenOrganizer={() => setIsOrganizerOpen(true)} />

      {/* Organizer Dashboard Modal */}
      <OrganizerModal
        isOpen={isOrganizerOpen}
        onClose={() => setIsOrganizerOpen(false)}
      />

    </div>
  );
}
