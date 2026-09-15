import React from 'react';
import { MapPin, Navigation, ExternalLink, Compass } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const mapAddress = "Chácara Marista";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapAddress)}`;
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(mapAddress)}`;

  return (
    <section id="localizacao" className="relative w-full py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>Local do Evento</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#D81B60] italic tracking-tight mb-2">
            Nos encontramos lá?
          </h2>

          <p className="font-body text-sm sm:text-base text-gray-500 max-w-md mx-auto">
            A festa acontecerá na aconchegante <strong>Chácara Marista</strong>.
          </p>
        </div>

        {/* Location Display Card */}
        <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-white border border-pink-100 shadow-xl shadow-pink-100/40 p-6 sm:p-10 text-center">
          
          <div className="w-16 h-16 mx-auto rounded-full bg-pink-50 text-[#D81B60] flex items-center justify-center text-2xl shadow-sm mb-4">
            <MapPin className="w-8 h-8 text-[#D81B60]" />
          </div>

          <h3 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Chácara Marista
          </h3>
          
          <p className="font-body text-sm sm:text-base text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
            Um refúgio com área verde, piscina, ampla estrutura para recepção e muito espaço para comemorarmos juntos.
          </p>

          {/* Primary Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              id="btn-location-gmaps"
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-serif text-base font-bold shadow-lg shadow-pink-200 hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>COMO CHEGAR 📍</span>
            </a>

            <a
              id="btn-location-waze"
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-pink-200 text-[#E11D48] hover:bg-pink-50 font-serif text-base font-bold shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Abrir no Waze</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
