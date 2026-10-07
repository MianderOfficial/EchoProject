import React from 'react';
import { SlideData } from '../types/presentation';
import { SlideRenderer } from './SlideRenderer';

interface PrintViewProps {
  slides: SlideData[];
  theme: string;
}

export const PrintView: React.FC<PrintViewProps> = ({ slides, theme }) => {
  return (
    <div className="hidden print:block w-full">
      {slides.map((slide, idx) => (
        <div
          key={slide.id || idx}
          className="print-slide-page relative w-[100vw] h-[100vh] overflow-hidden page-break-after-always bg-slate-950 text-white"
        >
          <SlideRenderer
            slide={slide}
            onUpdateSlide={() => {}}
            theme={theme}
            showWaveBackground={true}
          />
        </div>
      ))}
    </div>
  );
};
