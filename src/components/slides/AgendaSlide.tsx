import React from 'react';
import { SlideData } from '../../types/presentation';
import { EditableText } from '../EditableText';
import { EchoLogo } from '../EchoLogo';
import { Users, Target, UserCheck, Lightbulb, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

interface AgendaSlideProps {
  slide: SlideData;
  onUpdate: (updated: SlideData) => void;
  onNavigateToSlide?: (slideId: string) => void;
  theme?: string;
}

export const AgendaSlide: React.FC<AgendaSlideProps> = ({
  slide,
  onUpdate,
  onNavigateToSlide,
  theme,
}) => {
  const steps = slide.payload?.steps || [];
  const isLight = theme === 'light-acoustic';

  const icons = [Users, Target, UserCheck, Lightbulb, TrendingUp];

  const updateStep = (index: number, field: 'title' | 'desc', val: string) => {
    const nextSteps = [...steps];
    nextSteps[index] = { ...nextSteps[index], [field]: val };
    onUpdate({
      ...slide,
      payload: { ...slide.payload, steps: nextSteps },
    });
  };

  return (
    <div
      className={`w-full h-full flex flex-col justify-between p-7 md:p-11 select-none relative overflow-hidden transition-colors ${
        isLight
          ? 'bg-white/80 backdrop-blur-sm text-slate-900'
          : 'bg-[#091524]/70 backdrop-blur-[2px] text-slate-100'
      }`}
    >
      {/* Header bar */}
      <div className="flex items-start justify-between z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              02 · Маршрут презентации
            </span>
            <span className="w-8 h-[1px] bg-cyan-500/50" />
          </div>
          <h2 className="font-display font-black text-2xl md:text-4xl lg:text-5xl tracking-tight text-white drop-shadow-sm">
            <EditableText
              value={slide.title}
              onSave={(v) => onUpdate({ ...slide, title: v })}
            />
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5 max-w-xl">
            <EditableText
              value={slide.subtitle || 'Ключевые этапы презентации проекта сервиса «ЭхоКампус»'}
              onSave={(v) => onUpdate({ ...slide, subtitle: v })}
            />
          </p>
        </div>

        <EchoLogo size={42} withRipples />
      </div>

      {/* Rhythmic Soundwave Agenda Timeline (3 distinct rows to completely avoid any line overlap) */}
      <div className="relative my-auto z-10 w-full max-w-5xl mx-auto flex flex-col justify-center">
        {/* ROW 1: TOP CARDS (Items 0, 2, 4 — purely above the timeline) */}
        <div className="grid grid-cols-5 gap-2.5 sm:gap-4 mb-2">
          {steps.map((step: any, idx: number) => {
            const isTop = idx % 2 === 0;
            const IconComponent = icons[idx % icons.length];

            if (!isTop) {
              // Empty spacer to keep grid alignment
              return <div key={idx} className="h-28 md:h-32 pointer-events-none" />;
            }

            return (
              <div
                key={idx}
                onClick={() => step.targetSlideId && onNavigateToSlide?.(step.targetSlideId)}
                className="h-28 md:h-32 flex flex-col justify-end items-center text-center cursor-pointer group transition-all duration-300"
              >
                <div className="w-full p-2.5 md:p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-400/70 hover:shadow-lg hover:shadow-cyan-950/40 transition-all flex flex-col items-center justify-between h-full backdrop-blur-sm group-hover:-translate-y-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-sm shrink-0">
                      <IconComponent className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">
                      {step.number || `0${idx + 1}`}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xs md:text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1 leading-tight mt-1">
                    <EditableText
                      value={step.title}
                      onSave={(v) => updateStep(idx, 'title', v)}
                    />
                  </h3>

                  <p className="text-[10px] md:text-[11px] text-slate-300 leading-snug line-clamp-2 mt-0.5">
                    <EditableText
                      value={step.desc}
                      onSave={(v) => updateStep(idx, 'desc', v)}
                    />
                  </p>

                  <ChevronDown className="w-3 h-3 text-cyan-400/70 mt-0.5 animate-bounce" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ROW 2: CENTRAL TIMELINE BAR & PINS (Isolated in its own row) */}
        <div className="relative py-3 flex items-center">
          {/* Horizontal Track Line */}
          <div className="absolute left-6 right-6 h-2 rounded-full overflow-hidden bg-cyan-950/80 border border-cyan-800/60 shadow-sm">
            <div className="w-full h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-400 opacity-90 shadow-inner" />
          </div>

          {/* Decorative acoustic ripples along the bar */}
          <div className="absolute left-4 right-4 h-6 pointer-events-none opacity-30">
            <svg className="w-full h-full" viewBox="0 0 1000 30" preserveAspectRatio="none">
              <path
                d="M0,15 Q125,0 250,15 T500,15 T750,15 T1000,15"
                fill="none"
                stroke="#38B6B6"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* 5 Sequence Nodes Grid */}
          <div className="grid grid-cols-5 gap-2.5 sm:gap-4 w-full relative z-20">
            {steps.map((step: any, idx: number) => {
              const isTop = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  onClick={() => step.targetSlideId && onNavigateToSlide?.(step.targetSlideId)}
                  className="flex flex-col items-center justify-center cursor-pointer group"
                >
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:ring-4 group-hover:ring-cyan-500/40 transition-all duration-300 relative">
                    <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm shadow-cyan-300" />
                    {/* Concentric subtle echo ripple */}
                    <span className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-25 pointer-events-none" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-cyan-300 mt-1 drop-shadow-sm">
                    {step.number || `0${idx + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 3: BOTTOM CARDS (Items 1, 3 — purely below the timeline) */}
        <div className="grid grid-cols-5 gap-2.5 sm:gap-4 mt-2">
          {steps.map((step: any, idx: number) => {
            const isBottom = idx % 2 !== 0;
            const IconComponent = icons[idx % icons.length];

            if (!isBottom) {
              // Empty spacer to keep grid alignment
              return <div key={idx} className="h-28 md:h-32 pointer-events-none" />;
            }

            return (
              <div
                key={idx}
                onClick={() => step.targetSlideId && onNavigateToSlide?.(step.targetSlideId)}
                className="h-28 md:h-32 flex flex-col justify-start items-center text-center cursor-pointer group transition-all duration-300"
              >
                <div className="w-full p-2.5 md:p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-400/70 hover:shadow-lg hover:shadow-cyan-950/40 transition-all flex flex-col items-center justify-between h-full backdrop-blur-sm group-hover:translate-y-1">
                  <ChevronUp className="w-3 h-3 text-cyan-400/70 mb-0.5 animate-bounce" />

                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-sm shrink-0">
                      <IconComponent className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">
                      {step.number || `0${idx + 1}`}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xs md:text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1 leading-tight mt-1">
                    <EditableText
                      value={step.title}
                      onSave={(v) => updateStep(idx, 'title', v)}
                    />
                  </h3>

                  <p className="text-[10px] md:text-[11px] text-slate-300 leading-snug line-clamp-2 mt-0.5">
                    <EditableText
                      value={step.desc}
                      onSave={(v) => updateStep(idx, 'desc', v)}
                    />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer hint */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80 z-10">
        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>● Нажмите на карточку любого шага для мгновенного перехода к слайду</span>
        </div>
        <div className="text-slate-500 text-[11px] font-mono">
          КОМАНДА «ЭХО» · СТРУКТУРНЫЙ МАРШРУТ
        </div>
      </div>
    </div>
  );
};
