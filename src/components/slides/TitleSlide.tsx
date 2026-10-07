import React from 'react';
import { SlideData } from '../../types/presentation';
import { EditableText } from '../EditableText';
import { EchoLogo } from '../EchoLogo';
import { Radio, Sparkles } from 'lucide-react';

interface SlideProps {
  slide: SlideData;
  onUpdate: (updated: SlideData) => void;
  theme?: string;
}

export const TitleSlide: React.FC<SlideProps> = ({ slide, onUpdate, theme }) => {
  const payload = slide.payload || {};

  const handleUpdate = (field: string, val: string) => {
    onUpdate({
      ...slide,
      payload: {
        ...slide.payload,
        [field]: val,
      },
    });
  };

  const isLight = theme === 'light-acoustic';

  return (
    <div className="relative w-full h-full flex flex-col md:flex-row overflow-hidden select-none bg-transparent">
      {/* Left zone: Deep Navy Acoustic Field (mimics Page 1 of PDF) */}
      <div className={`w-full md:w-[52%] h-full flex flex-col justify-between p-8 md:p-14 z-10 transition-colors ${
        isLight ? 'bg-white/80 backdrop-blur-md text-slate-900' : 'bg-[#091524]/75 backdrop-blur-sm text-white border-r border-cyan-900/40'
      }`}>
        {/* Top: Team Echo Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EchoLogo size={42} withRipples />
            <div>
              <div className="font-display text-sm font-bold tracking-wider text-cyan-300">
                КОМАНДА «ЭХО»
              </div>
              <div className="text-[11px] text-slate-400">
                <EditableText
                  value={payload.university || 'Университетский акселератор проектов'}
                  onSave={(v) => handleUpdate('university', v)}
                />
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-cyan-400/80 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-800/40">
              <EditableText
                value={payload.year || '2026'}
                onSave={(v) => handleUpdate('year', v)}
              />
            </span>
          </div>
        </div>

        {/* Center: Main Project Title & Type */}
        <div className="my-auto py-8">
          <div className="text-cyan-400 text-sm md:text-base font-semibold tracking-wide uppercase mb-3 flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <EditableText
              value={slide.subtitle || 'Тип проекта: Социальный студенческий проект'}
              onSave={(v) => onUpdate({ ...slide, subtitle: v })}
            />
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] mb-6 drop-shadow-sm">
            <EditableText
              value={slide.title}
              onSave={(v) => onUpdate({ ...slide, title: v })}
              multiline
            />
          </h1>

          <p className="text-slate-300 text-sm md:text-base max-w-lg leading-relaxed">
            <EditableText
              value={payload.leadQuote || 'Создаем гармоничный акустический и визуальный комфорт в пространстве учебных аудиторий'}
              onSave={(v) => handleUpdate('leadQuote', v)}
              multiline
            />
          </p>
        </div>

        {/* Bottom: Rhythmic sound spectrum lines */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            <span className="font-mono text-cyan-300/90 text-xs">RESONANCE_FREQ: 432Hz</span>
          </div>

          <div className="flex items-center gap-1">
            {[18, 32, 24, 45, 20, 38, 50, 28, 14, 40, 22, 16].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-cyan-500/70 rounded-full transition-all duration-300"
                style={{ height: `${h * 0.4}px` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right zone: Abstract Visual Carrier & Soundwave Art (mimics "Изображение идеи") */}
      <div className={`w-full md:w-[48%] h-full relative flex items-center justify-center p-8 overflow-hidden ${
        isLight ? 'bg-slate-100/40' : 'bg-slate-950/20 backdrop-blur-[2px]'
      }`}>
        {/* Abstract Rhythmic Waves Background */}
        <div className="absolute inset-0 opacity-40">
          <svg className="w-full h-full" viewBox="0 0 600 600" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0F4C81" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#38B6B6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#48CAE4" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <circle cx="300" cy="300" r="140" fill="none" stroke="#38B6B6" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
            <circle cx="300" cy="300" r="210" fill="none" stroke="#0F4C81" strokeWidth="1.5" opacity="0.5" />
            <circle cx="300" cy="300" r="280" fill="none" stroke="#48CAE4" strokeWidth="1" opacity="0.3" />
            <path
              d="M0,300 C150,200 350,400 600,280 L600,600 L0,600 Z"
              fill="url(#wave-grad-1)"
            />
          </svg>
        </div>

        {/* Central Graphic Composition: Overlapping Echo Harmonic Spheres */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
          <div className="relative mb-6">
            <div className="w-48 h-48 sm:w-56 sm:h-56 relative flex items-center justify-center">
              {/* Pulsing acoustic rings */}
              <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-pulse-glow" />
              <div className="absolute -inset-4 rounded-full border border-cyan-500/15" />
              <div className="absolute -inset-8 rounded-full border border-cyan-400/10" />

              {/* Iconic Echo Venn composition */}
              <div className="relative flex items-center justify-center drop-shadow-2xl">
                <EchoLogo size={130} />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-xl px-5 py-3 shadow-xl">
            <div className="text-cyan-300 font-display text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Изображение / Концепция идеи</span>
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              Абстрактная гармония звуковых волн, естественного света и модульной архитектуры
            </p>
          </div>

          {/* Quick interactive acoustic pill */}
          <div className="mt-4 flex items-center gap-2 text-[11px] text-cyan-400/80 font-mono">
            <span>● 5 ключевых разделов</span>
            <span>·</span>
            <span>SMART-цель</span>
            <span>·</span>
            <span>Соц. эффект</span>
          </div>
        </div>
      </div>
    </div>
  );
};
