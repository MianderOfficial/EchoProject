import React from 'react';
import { SlideData } from '../../types/presentation';
import { EditableText } from '../EditableText';
import { EchoLogo } from '../EchoLogo';
import { Sparkles, Layers } from 'lucide-react';

interface IdeaFeaturesSlideProps {
  slide: SlideData;
  onUpdate: (updated: SlideData) => void;
  theme?: string;
}

export const IdeaFeaturesSlide: React.FC<IdeaFeaturesSlideProps> = ({
  slide,
  onUpdate,
  theme,
}) => {
  const payload = slide.payload || {};
  const features = payload.features || [];
  const isLight = theme === 'light-acoustic';

  const updateFeature = (index: number, field: string, val: string) => {
    const next = [...features];
    next[index] = { ...next[index], [field]: val };
    onUpdate({
      ...slide,
      payload: { ...slide.payload, features: next },
    });
  };

  return (
    <div className={`w-full h-full flex flex-col justify-between p-8 md:p-12 select-none relative overflow-hidden transition-colors ${
      isLight ? 'bg-white/80 backdrop-blur-sm text-slate-900' : 'bg-[#091524]/70 backdrop-blur-[2px] text-slate-100'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between z-10 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              08 · Ключевые преимущества
            </span>
            <span className="w-8 h-[1px] bg-cyan-500/50" />
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-white flex items-center gap-3">
            <EditableText
              value={slide.title}
              onSave={(v) => onUpdate({ ...slide, title: v })}
            />
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            <EditableText
              value={slide.subtitle || 'Четыре опорных фактора эффективности решения'}
              onSave={(v) => onUpdate({ ...slide, subtitle: v })}
            />
          </p>
        </div>

        <EchoLogo size={44} withRipples />
      </div>

      {/* Main Split Body (mirrors Page 8 of PDF) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto z-10 items-stretch">
        {/* Left Side: Visual Focus Showcase Area (Golden-Amber & Ocean Blue gradient) */}
        <div className="md:col-span-5 rounded-2xl p-6 bg-gradient-to-br from-amber-500/20 via-cyan-900/30 to-[#0F4C81]/50 border border-cyan-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          {/* Decorative sound-wave lines */}
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <svg className="w-full h-full" viewBox="0 0 300 300">
              <path d="M0,150 Q75,50 150,150 T300,150" fill="none" stroke="#F59E0B" strokeWidth="2" />
              <path d="M0,170 Q75,90 150,170 T300,170" fill="none" stroke="#38B6B6" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded bg-amber-400/90 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider">
              Визуализация решения
            </span>
            <EchoLogo size={28} />
          </div>

          <div className="my-auto py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-950/80 border border-cyan-400/50 flex items-center justify-center mb-3 shadow-xl group-hover:scale-110 transition-transform">
              <Sparkles className="w-8 h-8 text-cyan-300 animate-pulse" />
            </div>
            <div className="font-display font-black text-xl text-white mb-1">
              Эргономика и эстетика
            </div>
            <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
              Модульная конструкция, гармонично вписывающаяся в интерьер аудиторий вуза
            </p>
          </div>

          <div className="bg-slate-950/70 backdrop-blur-sm rounded-xl p-3 border border-slate-800 text-center">
            <span className="text-[11px] font-mono text-cyan-300">
              ● Прототип 1.0 проверен в учебных залах
            </span>
          </div>
        </div>

        {/* Right Side: 4 Numbered Feature Blocks in 2x2 Grid */}
        <div className="md:col-span-7 grid grid-cols-2 gap-4">
          {features.map((feat: any, idx: number) => (
            <div
              key={idx}
              className="rounded-2xl p-4 md:p-5 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between shadow-lg group hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-black text-3xl md:text-4xl text-cyan-400 tabular-nums group-hover:text-amber-400 transition-colors">
                    {feat.num || idx + 1}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400/40" />
                </div>

                <h3 className="font-display font-bold text-sm text-white mb-1 leading-snug">
                  <EditableText
                    value={feat.title}
                    onSave={(v) => updateFeature(idx, 'title', v)}
                    multiline
                  />
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <EditableText
                    value={feat.desc}
                    onSave={(v) => updateFeature(idx, 'desc', v)}
                    multiline
                  />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/80 z-10">
        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400">
          <span>● Комплексный синергетический эффект всех 4 факторов</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          КОМАНДА «ЭХО» · АРХИТЕКТУРА РЕШЕНИЯ
        </div>
      </div>
    </div>
  );
};
