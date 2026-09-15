import React from 'react';
import { Sun, Sparkles, Waves } from 'lucide-react';

export const WhatToBring: React.FC = () => {
  const items = [
    {
      emoji: '🩱',
      title: 'Roupa de banho',
      desc: 'Para aproveitar ao máximo a piscina e o dia de sol!',
      bgColor: 'bg-[#FCE7F3]',
      borderColor: 'border-[#F472B6]/40',
      accentColor: 'text-[#BE185D]'
    },
    {
      emoji: '🏖️',
      title: 'Toalha',
      desc: 'Item essencial para o seu conforto durante a festa.',
      bgColor: 'bg-[#E0F2FE]',
      borderColor: 'border-[#7DD3FC]/40',
      accentColor: 'text-[#0284C7]'
    },
    {
      emoji: '☀️',
      title: 'Protetor solar',
      desc: 'Para curtir o dia com segurança e bem-estar.',
      bgColor: 'bg-[#FEF3C7]',
      borderColor: 'border-[#FBBF24]/40',
      accentColor: 'text-[#D97706]'
    }
  ];

  return (
    <section className="relative w-full py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Card Container */}
        <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-white border border-white shadow-xl shadow-pink-100/40 p-6 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-3">
              <Waves className="w-3.5 h-3.5 text-blue-500" />
              <span>Dicas para o seu dia</span>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#D81B60] italic tracking-tight">
              Não esqueça de levar!
            </h2>
            <p className="font-body text-xs sm:text-sm text-gray-500 max-w-md mx-auto mt-1">
              Como teremos área de piscina e lazer ao ar livre, prepare sua bolsa:
            </p>
          </div>

          {/* 3 Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-[24px] bg-gray-50/70 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group"
              >
                <div className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform select-none">
                  {item.emoji}
                </div>
                <h3 className="font-serif text-lg font-bold text-gray-800 mb-1">
                  {item.title}
                </h3>
                <p className="font-body text-xs text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Friendly Note */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="font-serif italic text-xs sm:text-sm text-blue-600 flex items-center justify-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Vista-se confortavelmente para um dia de muita alegria e descontração!</span>
              <Sparkles className="w-3.5 h-3.5 text-[#D81B60] shrink-0" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
