import React from 'react';
import { Heart, Sparkles, Lock } from 'lucide-react';
import { FloralFooterSpray, WatercolorSplash } from './WatercolorFlorals';

interface FooterSectionProps {
  onOpenOrganizer: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onOpenOrganizer }) => {
  return (
    <footer className="relative w-full pt-12 pb-16 px-4 text-center overflow-hidden bg-gradient-to-b from-transparent to-pink-50/40">
      
      {/* Background watercolor touch */}
      <WatercolorSplash className="bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 opacity-30" color="multi" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        
        {/* Heart icon accent */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-50 border border-pink-100 text-[#D81B60] shadow-xs animate-breeze">
          <Heart className="w-6 h-6 fill-[#D81B60] text-[#D81B60]" />
        </div>

        {/* Phrases from prompt */}
        <div className="space-y-3">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
            “Uma conquista minha. Um momento nosso.”
          </h2>
          
          <p className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#D81B60] leading-tight">
            Te espero para comemorar comigo! 💗
          </p>
        </div>

        {/* Bottom Floral Watercolor Spray (Inspired by bottom of invitation) */}
        <div className="pt-4 pb-2">
          <FloralFooterSpray className="mx-auto" />
        </div>

        {/* Graduation Signature */}
        <div className="pt-2 text-xs text-gray-500 font-body space-y-2">
          <p className="font-semibold text-gray-700">
            Formatura Ana Julia Gessi • 10 de Outubro de 2026
          </p>
          
          {/* Discreet Organizer Access Button */}
          <div className="pt-4">
            <button
              id="btn-open-organizer-footer"
              type="button"
              onClick={onOpenOrganizer}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-[11px] font-semibold text-gray-700 hover:text-[#D81B60] shadow-xs transition-all cursor-pointer"
            >
              <Lock className="w-3 h-3 text-[#D81B60]" />
              <span>Painel da Organizadora (Lista de Convidados)</span>
              <Sparkles className="w-3 h-3 text-[#D81B60]" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
