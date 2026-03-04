import React from 'react';

interface AdUnitProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
  label?: string;
}

export function AdUnit({ slot, format = 'auto', className = '', label = 'Advertisement' }: AdUnitProps) {
  const getFormatClasses = () => {
    switch (format) {
      case 'horizontal':
        return 'h-24 md:h-32 w-full';
      case 'vertical':
        return 'h-[600px] w-full';
      case 'rectangle':
        return 'h-64 w-full';
      default:
        return 'min-h-[100px] w-full';
    }
  };

  return (
    <div className={`my-8 flex flex-col items-center ${className}`}>
      <span className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2 font-semibold">{label}</span>
      <div className={`bg-zinc-50 border border-dashed border-zinc-200 rounded-lg flex items-center justify-center overflow-hidden relative group transition-colors hover:bg-zinc-100/50 ${getFormatClasses()}`}>
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="text-zinc-300 font-mono text-xs flex flex-col items-center space-y-1">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-200 flex items-center justify-center mb-1">
            <span className="text-zinc-400 font-bold">$</span>
          </div>
          <span>AdSense Unit</span>
          {slot && <span className="opacity-50 text-[10px]">Slot: {slot}</span>}
        </div>
        {/* In a real app, you would insert the AdSense script here */}
        {/* <ins className="adsbygoogle" ... /> */}
      </div>
    </div>
  );
}
