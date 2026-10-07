import React from 'react';
import { SlideData } from '../../types/presentation';
import { EditableText } from '../EditableText';
import { EchoLogo } from '../EchoLogo';
import { Target, CheckCircle2 } from 'lucide-react';

interface SmartGoalSlideProps {
  slide: SlideData;
  onUpdate: (updated: SlideData) => void;
  theme?: string;
}

export const SmartGoalSlide: React.FC<SmartGoalSlideProps> = ({
  slide,
  onUpdate,
  theme,
}) => {
  const payload = slide.payload || {};
  const pillars = payload.pillars || [];
  const isLight = theme === 'light-acoustic';

  const updatePillar = (index: number, field: string, val: string) => {
    const next = [...pillars];
    next[index] = { ...next[index], [field]: val };
    onUpdate({
      ...slide,
      payload: { ...slide.payload, pillars: next },
    });
  };

  const updateStatement = (val: string) => {
    onUpdate({
      ...slide,
      payload: { ...slide.payload, mainStatement: val },
    });
  };

  return (
    <div className={`w-full h-full flex flex-col justify-between p-8 md:p-12 select-none relative overflow-hidden transition-colors ${
      isLight ? 'bg-white/80 backdrop-blur-sm text-slate-900' : 'bg-[#091524]/70 backdrop-blur-[2px] text-slate-100'
    }`}>
      {/* Top Header & Main Goal Statement Box */}
      <div className="z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
                04 · Методология SMART
              </span>
              <span className="w-8 h-[1px] bg-cyan-500/50" />
            </div>
            <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-white flex items-center gap-3">
              <EditableText
                value={slide.title}
                onSave={(v) => onUpdate({ ...slide, title: v })}
              />
            </h2>
          </div>
          <EchoLogo size={44} withRipples />
        </div>

        {/* Highlighted Goal Statement Box */}
        <div className="rounded-xl p-4 md:p-5 bg-gradient-to-r from-cyan-950/50 via-slate-900/80 to-blue-950/40 border border-cyan-500/30 shadow-lg">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>Генеральная цель проекта:</span>
          </div>
          <p className="text-white text-sm md:text-base font-medium leading-relaxed">
            <EditableText
              value={payload.mainStatement || 'Сформулируйте ключевую цель вашего проекта...'}
              onSave={updateStatement}
              multiline
            />
          </p>
        </div>
      </div>

      {/* 5 SMART Columns styled as Acoustic Wave Arches (mirrors Page 4 of PDF) */}
      <div className="grid grid-cols-5 gap-3 md:gap-4 my-auto pt-6 z-10">
        {pillars.map((p: any, idx: number) => {
          // Acoustic color themes for SMART columns
          const columnGradients = [
            'from-[#0F4C81] to-[#0A2E4E]', // S - Deep Prussian Navy
            'from-[#0B3A63] to-[#091E36]', // M - Midnight Acoustic
            'from-[#1A7C9B] to-[#0D4D63]', // A - Overlap Cyan-Navy
            'from-[#2CA5A5] to-[#146666]', // R - Rhythmic Aqua
            'from-[#38B6B6] to-[#1A7A7A]', // T - Vibrant Cyan
          ];

          return (
            <div
              key={idx}
              className="flex flex-col rounded-t-[40px] rounded-b-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1 shadow-lg overflow-hidden"
            >
              {/* Arch Top Header with Large SMART Letter */}
              <div
                className={`w-full pt-6 pb-4 flex flex-col items-center justify-center bg-gradient-to-b ${
                  columnGradients[idx % columnGradients.length]
                } text-white border-b border-white/10`}
              >
                <span className="font-display font-black text-4xl md:text-5xl text-white tracking-wider drop-shadow-md">
                  {p.letter}
                </span>
                <span className="text-[11px] font-mono tracking-wider text-cyan-200 uppercase mt-0.5">
                  {p.nameEn}
                </span>
                <span className="text-xs font-semibold text-white/90">
                  <EditableText
                    value={p.nameRu}
                    onSave={(v) => updatePillar(idx, 'nameRu', v)}
                  />
                </span>
              </div>

              {/* Description Body */}
              <div className="p-3 md:p-4 flex-1 flex flex-col justify-between text-center bg-slate-950/60">
                <p className="text-xs text-slate-300 leading-relaxed">
                  <EditableText
                    value={p.description}
                    onSave={(v) => updatePillar(idx, 'description', v)}
                    multiline
                  />
                </p>

                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-center">
                  <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>Критерий {idx + 1}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/80 z-10">
        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400">
          <span>● Стандарт SMART: конкретность, измеримость, достижимость, значимость, дедлайн</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          КОМАНДА «ЭХО» · АНАЛИТИКА ЦЕЛЕЙ
        </div>
      </div>
    </div>
  );
};
