import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, Sun, Moon } from 'lucide-react';

export const EventInfo: React.FC = () => {
  return (
    <section id="informacoes" className="relative w-full py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>Programação Especial</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#D81B60] italic tracking-tight mb-2">
            Informações da Festa
          </h2>
          <p className="font-body text-sm sm:text-base text-gray-500 max-w-md mx-auto">
            Confira todos os detalhes do nosso dia especial.
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Data */}
          <div className="relative overflow-hidden rounded-[28px] bg-white border border-white shadow-xl shadow-pink-100/40 hover:shadow-2xl transition-all p-8 text-center group hover:-translate-y-1">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-pink-50 text-[#D81B60] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7 text-[#D81B60]" />
            </div>
            <span className="font-body text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Data do Evento
            </span>
            <h3 className="font-serif text-2xl font-bold text-gray-800 mb-1">
              10 de Outubro
            </h3>
            <p className="font-body text-xs text-gray-500">
              Sábado • 2026
            </p>
          </div>

          {/* Card 2: Horários */}
          <div className="relative overflow-hidden rounded-[28px] bg-white border border-white shadow-xl shadow-blue-100/40 hover:shadow-2xl transition-all p-8 text-center group hover:-translate-y-1">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7 text-blue-500" />
            </div>
            <span className="font-body text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Horários
            </span>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 font-serif text-lg font-bold text-blue-600">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Início: 09h da manhã</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 font-serif text-base font-semibold text-gray-500">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Encerramento: 19h</span>
              </div>
            </div>
          </div>

          {/* Card 3: Local */}
          <div className="relative overflow-hidden rounded-[28px] bg-white border border-white shadow-xl shadow-amber-100/40 hover:shadow-2xl transition-all p-8 text-center group hover:-translate-y-1">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="w-7 h-7 text-amber-500" />
            </div>
            <span className="font-body text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Localização
            </span>
            <h3 className="font-serif text-2xl font-bold text-gray-800 mb-1">
              Chácara Marista
            </h3>
            <p className="font-body text-xs text-gray-500">
              Espaço amplo, piscina e área verde
            </p>
          </div>
        </div>

        {/* Ambient Message */}
        <div className="mt-8 p-4 rounded-2xl bg-pink-50/60 border border-pink-100 text-center max-w-xl mx-auto">
          <p className="font-serif italic text-sm sm:text-base text-[#D81B60] flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D81B60]" />
            <span>Um dia inteiro preparado com muito carinho para celebrarmos juntos!</span>
            <Sparkles className="w-4 h-4 text-[#D81B60]" />
          </p>
        </div>
      </div>
    </section>
  );
};
