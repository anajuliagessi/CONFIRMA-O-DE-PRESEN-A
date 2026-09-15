import React, { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const CountdownTimer: React.FC = () => {
  const targetDate = new Date('2026-10-10T09:00:00-03:00').getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPast: false };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="w-full max-w-xl mx-auto my-8 px-4">
      <div className="relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur-md soft-border shadow-lg shadow-pink-100/50 p-6 md:p-8 text-center">
        {/* Vibrant Watercolor Ambient Washes */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-36 h-36 rounded-full bg-gradient-to-bl from-[#FF5500]/45 to-[#FFA000]/30 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-gradient-to-tr from-[#FF007F]/45 to-[#FF2E93]/30 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-50 to-orange-50 border border-[#FF4D8D]/30 text-[#E11D48] text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
            <span className="bg-gradient-to-r from-[#FF007F] to-[#FF5500] bg-clip-text text-transparent font-bold">
              Contagem Regressiva
            </span>
            <Heart className="w-3.5 h-3.5 text-[#FF1493] fill-[#FF1493]" />
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
            Falta pouco para comemorarmos!
          </h3>
          <p className="font-body text-xs sm:text-sm text-[#705869] mb-6 italic">
            10 de Outubro de 2026 • Chácara Marista
          </p>

          {timeLeft.isPast ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-orange-50 text-[#E11D48] font-serif text-xl font-medium border border-[#FF4D8D]/30">
              🎉 O grande dia chegou! Vamos comemorar juntos! 🎉
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto">
              {/* Days */}
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/95 border border-pink-100 shadow-xs hover:border-[#FF1493]/50 transition-colors group">
                <span className="font-serif text-3xl sm:text-4xl font-bold bg-gradient-to-b from-[#FF007F] to-[#E11D48] bg-clip-text text-transparent leading-none mb-1">
                  {formatNumber(timeLeft.days)}
                </span>
                <span className="font-body text-[10px] uppercase tracking-widest text-[#8C7A87] font-bold">
                  Dias
                </span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/95 border border-pink-100 shadow-xs hover:border-[#FF5500]/50 transition-colors group">
                <span className="font-serif text-3xl sm:text-4xl font-bold bg-gradient-to-b from-[#E11D48] to-[#FF5500] bg-clip-text text-transparent leading-none mb-1">
                  {formatNumber(timeLeft.hours)}
                </span>
                <span className="font-body text-[10px] uppercase tracking-widest text-[#8C7A87] font-bold">
                  Horas
                </span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/95 border border-pink-100 shadow-xs hover:border-[#FF6B00]/50 transition-colors group">
                <span className="font-serif text-3xl sm:text-4xl font-bold bg-gradient-to-b from-[#FF5500] to-[#EA580C] bg-clip-text text-transparent leading-none mb-1">
                  {formatNumber(timeLeft.minutes)}
                </span>
                <span className="font-body text-[10px] uppercase tracking-widest text-[#8C7A87] font-bold">
                  Minutos
                </span>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/95 border border-pink-100 shadow-xs hover:border-[#FF1493]/50 transition-colors group">
                <span className="font-serif text-3xl sm:text-4xl font-bold bg-gradient-to-b from-[#FF007F] to-[#FF5500] bg-clip-text text-transparent leading-none mb-1">
                  {formatNumber(timeLeft.seconds)}
                </span>
                <span className="font-body text-[10px] uppercase tracking-widest text-[#8C7A87] font-bold">
                  Segundos
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
