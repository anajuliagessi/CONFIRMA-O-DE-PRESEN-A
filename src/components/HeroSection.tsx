import React from 'react';
import { Heart, Sparkles, Calendar, MapPin, ArrowDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const scrollToRSVP = () => {
    const el = document.getElementById('rsvp-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-8 pb-16 px-4 sm:px-6 overflow-hidden text-center bg-gradient-to-b from-white to-pink-50/50">
      <div className="relative z-10 max-w-2xl mx-auto px-2">
        {/* Delicate Subtitle / Monogram Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#FF4D8D]/30 text-[#E11D48] shadow-sm mb-6 animate-breeze-slow">
          <Sparkles className="w-4 h-4 text-[#FF5500]" />
          <span className="font-body text-xs sm:text-sm font-semibold tracking-widest uppercase bg-gradient-to-r from-[#FF007F] via-[#E11D48] to-[#FF5500] bg-clip-text text-transparent">
            Formatura • Ana Julia Gessi
          </span>
          <Heart className="w-3.5 h-3.5 fill-[#FF1493] text-[#FF1493]" />
        </div>

        {/* Main Title: Formeeeeiii! */}
        <div className="relative my-2 sm:my-4">
          <h1 className="font-script text-7xl sm:text-8xl md:text-9xl bg-gradient-to-r from-[#FF007F] via-[#E11D48] to-[#FF5500] bg-clip-text text-transparent leading-none select-none drop-shadow-sm">
            Formeeeeiii!
          </h1>
          {/* Vibrant Pink & Orange Watercolor Accent Glow */}
          <div className="w-48 sm:w-72 h-3 mx-auto bg-gradient-to-r from-[#FF1493] via-[#FF5500] to-[#FFB703] rounded-full opacity-80 blur-xs mt-1" />
        </div>

        {/* Opening Intro Text */}
        <p className="font-serif text-lg sm:text-2xl text-[#3A2D35] font-medium max-w-2xl mx-auto mt-4 leading-relaxed italic">
          “Depois de anos de dedicação, desafios e conquistas, chegou o momento de celebrar essa vitória!”
        </p>

        {/* Date Highlight Badge */}
        <div className="my-8 inline-block">
          <div className="bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-3xl soft-border shadow-lg shadow-pink-100/50">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
              <div className="flex items-center gap-2.5 text-[#E11D48]">
                <Calendar className="w-5 h-5 text-[#FF1493]" />
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-[#FF007F] to-[#FF5500] bg-clip-text text-transparent">
                  10 de Outubro
                </span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-gradient-to-b from-[#FF1493]/30 to-[#FF5500]/30" />
              <div className="flex items-center gap-1.5 text-[#EA580C] font-body text-xs sm:text-sm font-semibold uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#FF5500]" />
                <span>Chácara Marista • Sábado 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Heartfelt Quote Callout */}
        <p className="font-serif italic text-base sm:text-lg md:text-xl text-[#BE123C] max-w-md mx-auto mb-8 font-medium">
          “Uma conquista fica ainda mais especial quando compartilhada com quem amamos.”
        </p>

        {/* Primary CTA Button: CONFIRMAR PRESENÇA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="btn-hero-confirm"
            onClick={scrollToRSVP}
            className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#FF007F] via-[#E11D48] to-[#FF5500] hover:from-[#E11D48] hover:to-[#EA580C] text-white font-serif text-lg sm:text-xl font-bold shadow-lg shadow-[#FF1493]/30 hover:shadow-xl hover:shadow-[#FF5500]/40 transform active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>CONFIRMAR PRESENÇA</span>
            <Heart className="w-5 h-5 fill-white group-hover:scale-125 transition-transform" />
          </button>
        </div>

        {/* Subtle Scroll Hint */}
        <div className="mt-10 sm:mt-12 flex justify-center opacity-80 hover:opacity-100 transition-opacity">
          <button
            onClick={scrollToRSVP}
            className="flex flex-col items-center gap-1 text-xs text-[#705869] font-body font-medium hover:text-[#E11D48] transition-colors cursor-pointer"
          >
            <span>Role para ver os detalhes</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-[#FF5500]" />
          </button>
        </div>
      </div>
    </section>
  );
};
