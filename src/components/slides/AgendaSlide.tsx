import React from 'react';
import { SlideData } from '../../types/presentation';
import { EditableText } from '../EditableText';
import { EchoLogo } from '../EchoLogo';
import { Users, Target, UserCheck, Lightbulb, TrendingUp } from 'lucide-react';

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
    <div className={`w-full h-full flex flex-col justify-between p-8 md:p-14 select-none relative overflow-hidden transition-colors ${
      isLight ? 'bg-white/80 backdrop-blur-sm text-slate-900' : 'bg-[#091524]/70 backdrop-blur-[2px] text-slate-100'
    }`}>
      {/* Header bar */}
      <div className="flex items-start justify-between z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              02 · Маршрут презентации
            </span>
            <span className="w-8 h-[1px] bg-cyan-500/50" />
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-white drop-shadow-sm">
            <EditableText
              value={slide.title}
              onSave={(v) => onUpdate({ ...slide, title: v })}
            />
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            <EditableText
              value={slide.subtitle || 'Ключевые этапы презентации проекта'}
              onSave={(v) => onUpdate({ ...slide, subtitle: v })}
            />
          </p>
        </div>

        <EchoLogo size={46} withRipples />
      </div>

      {/* Rhythmic Soundwave Agenda Track (Alternating Above / Below like Page 2 of PDF) */}
      <div className="relative my-auto py-12 z-10">
        {/* Central horizontal acoustic wave / connector bar */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-2 rounded-full overflow-hidden flex items-center bg-cyan-950/70 border border-cyan-800/40">
          <div className="w-full h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-400 opacity-80" />
        </div>

        {/* Decorative sound wave frequencies underneath */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none opacity-20">
          <svg className="w-full h-16" viewBox="0 0 1000 60" preserveAspectRatio="none">
            <path
              d="M0,30 Q100,5 200,30 T400,30 T600,30 T800,30 T1000,30"
              fill="none"
              stroke="#38B6B6"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* 5 Rhythmic checkpoints */}
        <div className="grid grid-cols-5 gap-3 sm:gap-4 relative">
          {steps.map((step: any, idx: number) => {
            const isTop = idx % 2 === 0;
            const IconComponent = icons[idx % icons.length];

            return (
              <div
                key={idx}
                onClick={() => step.targetSlideId && onNavigateToSlide?.(step.targetSlideId)}
                className={`flex flex-col items-center group cursor-pointer transition-all duration-300 hover:-translate-y-1`}
              >
                {/* If top node */}
                {isTop && (
                  <div className="flex flex-col items-center mb-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-lg group-hover:border-cyan-400 group-hover:scale-110 transition-all duration-300">
                      <IconComponent className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="font-display font-bold text-sm md:text-base text-white mt-2 group-hover:text-cyan-300 transition-colors">
                      <EditableText
                        value={step.title}
                        onSave={(v) => updateStep(idx, 'title', v)}
                      />
                    </h3>
                    <p className="text-xs text-slate-400 max-w-[140px] mt-1 leading-snug">
                      <EditableText
                        value={step.desc}
                        onSave={(v) => updateStep(idx, 'desc', v)}
                      />
                    </p>
                  </div>
                )}

                {/* Central Connector Pin on the Timeline */}
                <div className="relative z-20 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-md group-hover:ring-4 group-hover:ring-cyan-500/30 transition-all">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 mt-1">
                    {step.number || `0${idx + 1}`}
                  </span>
                </div>

                {/* If bottom node */}
                {!isTop && (
                  <div className="flex flex-col items-center mt-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-lg group-hover:border-cyan-400 group-hover:scale-110 transition-all duration-300">
                      <IconComponent className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="font-display font-bold text-sm md:text-base text-white mt-2 group-hover:text-cyan-300 transition-colors">
                      <EditableText
                        value={step.title}
                        onSave={(v) => updateStep(idx, 'title', v)}
                      />
                    </h3>
                    <p className="text-xs text-slate-400 max-w-[140px] mt-1 leading-snug">
                      <EditableText
                        value={step.desc}
                        onSave={(v) => updateStep(idx, 'desc', v)}
                      />
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer hint */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/80 z-10">
        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400">
          <span>● Нажмите на раздел для быстрого перехода</span>
        </div>
        <div className="text-slate-500 text-[11px]">
          Команда «Эхо» · Структурный план проекта
        </div>
      </div>
    </div>
  );
};
