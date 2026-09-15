import React from 'react';

/**
 * Modern, vibrant watercolor elements in Pink and Orange / Coral.
 * Features organic fluid bleeding, painterly stains, splatters, and soft gradient washes.
 */

interface WatercolorProps {
  className?: string;
  intensity?: 'soft' | 'medium' | 'vibrant';
}

export const WatercolorSplash: React.FC<{
  className?: string;
  color?: 'pink' | 'orange' | 'sunset' | 'coral';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({
  className = '',
  color = 'sunset',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-48 h-48',
    md: 'w-80 h-80',
    lg: 'w-[500px] h-[500px]',
    xl: 'w-[750px] h-[750px]'
  }[size];

  return (
    <div className={`pointer-events-none select-none absolute -z-10 overflow-visible ${sizeClasses} ${className}`}>
      {color === 'pink' && (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-gradient-to-tr from-[#FF1493]/60 via-[#FF2E93]/50 to-[#FF69B4]/30 blur-3xl transform -rotate-12 animate-breeze" />
          <div className="absolute inset-4 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-[#E11D48]/40 blur-2xl transform rotate-45" />
        </div>
      )}

      {color === 'orange' && (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-[50%_50%_40%_60%/60%_40%_60%_40%] bg-gradient-to-bl from-[#FF6B00]/60 via-[#FF8533]/50 to-[#FFA500]/40 blur-3xl transform rotate-12 animate-breeze-reverse" />
          <div className="absolute inset-4 rounded-[40%_60%_50%_50%/50%_60%_40%_60%] bg-[#F97316]/50 blur-2xl transform -rotate-30" />
        </div>
      )}

      {color === 'sunset' && (
        <div className="relative w-full h-full">
          {/* Main Pink Stain */}
          <div className="absolute top-0 left-0 w-4/5 h-4/5 rounded-[45%_55%_63%_37%/37%_43%_57%_63%] bg-gradient-to-br from-[#FF1493]/70 via-[#EC4899]/60 to-[#FF4580]/40 blur-3xl transform -rotate-6 animate-breeze" />
          {/* Main Vibrant Orange Stain */}
          <div className="absolute bottom-0 right-0 w-4/5 h-4/5 rounded-[58%_42%_47%_53%/53%_58%_42%_47%] bg-gradient-to-tl from-[#FF5E00]/70 via-[#FF7824]/60 to-[#FF9E42]/40 blur-3xl transform rotate-12 animate-breeze-reverse" />
          {/* Golden Coral Core Blend */}
          <div className="absolute inset-1/4 rounded-full bg-gradient-to-r from-[#FF2E93]/50 via-[#FF6B00]/60 to-[#FFAE00]/40 blur-2xl mix-blend-multiply" />
        </div>
      )}

      {color === 'coral' && (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-[55%_45%_50%_50%/45%_55%_50%_50%] bg-gradient-to-r from-[#FF3366]/65 via-[#FF6036]/60 to-[#FF9900]/45 blur-3xl transform rotate-6 animate-breeze-slow" />
          <div className="absolute inset-3 rounded-[40%_60%_45%_55%/60%_40%_55%_45%] bg-[#FF4081]/40 blur-2xl" />
        </div>
      )}
    </div>
  );
};

/**
 * Lateral Artistic Watercolor Bleed (Left Side)
 * Replaces floral bouquets with pure vibrant pink & orange watercolor washes.
 */
export const WatercolorSideLeft: React.FC<WatercolorProps> = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none select-none absolute left-0 top-0 z-0 overflow-visible ${className}`}>
      <div className="relative w-[180px] sm:w-[280px] md:w-[360px] h-[400px] sm:h-[520px]">
        {/* Deep vibrant pink wash */}
        <div 
          className="absolute -left-12 top-6 w-full h-[70%] rounded-[30%_70%_70%_30%/30%_30%_70%_70%] bg-gradient-to-r from-[#FF007F]/65 via-[#FF2A85]/50 to-transparent blur-3xl transform -rotate-12 animate-breeze origin-top-left"
        />
        {/* Vibrant Orange & Coral bleeding into pink */}
        <div 
          className="absolute -left-8 top-36 w-[85%] h-[60%] rounded-[50%_50%_30%_70%/60%_40%_60%_40%] bg-gradient-to-tr from-[#FF5500]/70 via-[#FF7A00]/55 to-[#FFB703]/25 blur-2xl transform rotate-6 animate-breeze-slow origin-left"
        />
        {/* Luminous magenta core accent */}
        <div 
          className="absolute left-2 top-20 w-32 sm:w-44 h-32 sm:h-44 rounded-full bg-[#E11D48]/45 blur-xl mix-blend-multiply"
        />
        {/* Abstract Painterly SVG Splashes in Pink & Orange */}
        <svg 
          viewBox="0 0 200 300" 
          className="absolute left-0 top-10 w-36 sm:w-56 h-auto opacity-70 filter drop-shadow-sm"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M-20,20 Q60,10 80,70 Q100,130 50,180 Q0,230 -20,200 Z" 
            fill="url(#pinkOrangeGradLeft)" 
            opacity="0.85"
          />
          <path 
            d="M-10,90 Q70,90 90,140 Q110,190 60,250 Q10,310 -10,270 Z" 
            fill="url(#orangeGoldGradLeft)" 
            opacity="0.65"
          />
          <circle cx="85" cy="45" r="4" fill="#FF1493" opacity="0.75" />
          <circle cx="105" cy="95" r="5" fill="#FF6B00" opacity="0.7" />
          <circle cx="70" cy="210" r="3.5" fill="#FF2A85" opacity="0.6" />
          <circle cx="95" cy="180" r="3" fill="#FFA500" opacity="0.8" />
          <defs>
            <linearGradient id="pinkOrangeGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF1493" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#FF5E00" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFA000" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="orangeGoldGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#FF1493" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FF80BF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

/**
 * Lateral Artistic Watercolor Bleed (Right Side)
 * Replaces floral bouquets with pure vibrant orange & pink watercolor washes.
 */
export const WatercolorSideRight: React.FC<WatercolorProps> = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none select-none absolute right-0 top-0 z-0 overflow-visible ${className}`}>
      <div className="relative w-[180px] sm:w-[280px] md:w-[360px] h-[400px] sm:h-[520px]">
        {/* Deep vibrant orange wash */}
        <div 
          className="absolute -right-12 top-6 w-full h-[70%] rounded-[70%_30%_30%_70%/70%_70%_30%_30%] bg-gradient-to-l from-[#FF5500]/70 via-[#FF7700]/55 to-transparent blur-3xl transform rotate-12 animate-breeze-reverse origin-top-right"
        />
        {/* Vibrant Pink & Magenta bleeding into orange */}
        <div 
          className="absolute -right-8 top-36 w-[85%] h-[60%] rounded-[30%_70%_70%_30%/40%_60%_40%_60%] bg-gradient-to-tl from-[#FF007F]/65 via-[#FF2E93]/50 to-[#FFA500]/20 blur-2xl transform -rotate-6 animate-breeze-slow origin-right"
        />
        {/* Luminous coral core accent */}
        <div 
          className="absolute right-2 top-20 w-32 sm:w-44 h-32 sm:h-44 rounded-full bg-[#FF6B00]/45 blur-xl mix-blend-multiply"
        />
        {/* Abstract Painterly SVG Splashes in Orange & Pink */}
        <svg 
          viewBox="0 0 200 300" 
          className="absolute right-0 top-10 w-36 sm:w-56 h-auto opacity-70 filter drop-shadow-sm transform scale-x-[-1]" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M-20,20 Q60,10 80,70 Q100,130 50,180 Q0,230 -20,200 Z" 
            fill="url(#orangePinkGradRight)" 
            opacity="0.85"
          />
          <path 
            d="M-10,90 Q70,90 90,140 Q110,190 60,250 Q10,310 -10,270 Z" 
            fill="url(#pinkGoldGradRight)" 
            opacity="0.65"
          />
          <circle cx="85" cy="45" r="4" fill="#FF5E00" opacity="0.75" />
          <circle cx="105" cy="95" r="5" fill="#FF1493" opacity="0.7" />
          <circle cx="70" cy="210" r="3.5" fill="#FF7A00" opacity="0.6" />
          <circle cx="95" cy="180" r="3" fill="#FF2A85" opacity="0.8" />
          <defs>
            <linearGradient id="orangePinkGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF5500" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#FF1493" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#FFC107" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="pinkGoldGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF007F" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#FF7700" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#FFD54F" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

/**
 * Top Artistic Watercolor Banner Bleed
 */
export const WatercolorTopBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full pointer-events-none select-none overflow-hidden relative ${className}`}>
      <div className="max-w-4xl mx-auto h-24 sm:h-32 relative">
        <div className="absolute left-1/4 top-0 w-1/2 h-full rounded-full bg-gradient-to-r from-[#FF1493]/40 via-[#FF6B00]/45 to-[#FFA000]/30 blur-2xl" />
        <div className="absolute left-1/3 top-2 w-1/3 h-16 rounded-full bg-[#FF2E93]/35 blur-xl" />
      </div>
    </div>
  );
};

/**
 * Subtle decorative watercolor splatter dots
 */
export const WatercolorSplatter: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex gap-3 opacity-60 ${className}`}>
      <span className="w-2.5 h-2.5 rounded-full bg-[#FF1493] blur-[1px]" />
      <span className="w-3.5 h-3.5 rounded-full bg-[#FF6B00] blur-[1px]" />
      <span className="w-2 h-2 rounded-full bg-[#FFA000] blur-[1px]" />
      <span className="w-3 h-3 rounded-full bg-[#FF2E93] blur-[1px]" />
    </div>
  );
};

/**
 * Bottom Artistic Watercolor Footer Bleed
 * Replaces floral footer spray with a rich vibrant pink & orange watercolor wash.
 */
export const WatercolorFooterWash: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full flex justify-center items-center pointer-events-none select-none overflow-hidden ${className}`}>
      <div className="relative max-w-3xl w-full h-28 sm:h-36 px-4 flex items-center justify-center">
        <WatercolorSplatter className="absolute" />
      </div>
    </div>
  );
};
