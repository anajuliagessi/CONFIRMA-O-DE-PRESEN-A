import React from 'react';
export {
  WatercolorSplash,
  WatercolorSideLeft as FloralSideLeft,
  WatercolorSideRight as FloralSideRight,
  WatercolorTopBanner as FloralHeaderGarland,
  WatercolorFooterWash as FloralFooterSpray,
  WatercolorSplatter
} from './WatercolorElements';

// Retained for backward-compatibility without rendering floral images
export const FloralCorner: React.FC<{
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ className = '', position = 'top-right' }) => {
  return (
    <div className={`pointer-events-none select-none absolute z-0 w-28 h-28 ${className}`}>
      <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FF1493]/35 via-[#FF6B00]/30 to-transparent blur-xl" />
    </div>
  );
};
