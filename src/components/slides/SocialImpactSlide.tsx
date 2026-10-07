import React from 'react';
import { SlideData } from '../../types/presentation';
import { EditableText } from '../EditableText';
import { EchoLogo } from '../EchoLogo';
import { TrendingUp, Award, Users, School } from 'lucide-react';

interface SocialImpactSlideProps {
  slide: SlideData;
  onUpdate: (updated: SlideData) => void;
  theme?: string;
}

export const SocialImpactSlide: React.FC<SocialImpactSlideProps> = ({
  slide,
  onUpdate,
  theme,
}) => {
  const payload = slide.payload || {};
  const impactCards = payload.impactCards || [];
  const isLight = theme === 'light-acoustic';

  const updateCard = (index: number, field: string, val: string) => {
    const next = [...impactCards];
    next[index] = { ...next[index], [field]: val };
    onUpdate({
      ...slide,
      payload: { ...slide.payload, impactCards: next },
    });
  };

  // Color styles corresponding to Page 10 of PDF (Cyan, Yellow/Amber, Orange-Amber, Deep Navy)
  const cardColorThemes = [
    {
      bg: 'from-[#48CAE4] to-[#259EB8]',
      text: 'text-slate-950',
      valueColor: 'text-slate-950',
      subText: 'text-slate-800',
      badge: 'bg-black/10 text-slate-950',
    },
    {
      bg: 'from-[#F59E0B] to-[#D97706]',
      text: 'text-slate-950',
      valueColor: 'text-slate-950',
      subText: 'text-slate-900',
      badge: 'bg-black/10 text-slate-950',
    },
    {
      bg: 'from-[#F97316] to-[#EA580C]',
      text: 'text-white',
      valueColor: 'text-white',
      subText: 'text-orange-100',
      badge: 'bg-black/20 text-white',
    },
    {
      bg: 'from-[#0A192F] to-[#050D18]',
      text: 'text-white',
      valueColor: 'text-cyan-400',
      subText: 'text-slate-300',
      badge: 'bg-cyan-950 border border-cyan-800 text-cyan-300',
    },
  ];

  const icons = [TrendingUp, Award, School, Users];

  return (
    <div className={`w-full h-full flex flex-col justify-between p-8 md:p-12 select-none relative overflow-hidden transition-colors ${
      isLight ? 'bg-white/80 backdrop-blur-sm text-slate-900' : 'bg-[#091524]/70 backdrop-blur-[2px] text-slate-100'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between z-10 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              10 · Измеримый результат
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
              value={slide.subtitle || 'Ожидаемые измеримые результаты внедрения для университета'}
              onSave={(v) => onUpdate({ ...slide, subtitle: v })}
            />
          </p>
        </div>

        <EchoLogo size={44} withRipples />
      </div>

      {/* 4 Stat Columns (mirrors Page 10 of PDF) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 my-auto z-10">
        {impactCards.map((card: any, idx: number) => {
          const themeStyle = cardColorThemes[idx % cardColorThemes.length];
          const IconComponent = icons[idx % icons.length];

          return (
            <div
              key={card.id || idx}
              className={`rounded-3xl p-6 bg-gradient-to-b ${themeStyle.bg} shadow-2xl flex flex-col justify-between min-h-[260px] md:min-h-[290px] border border-white/20 transition-all duration-300 hover:-translate-y-2 group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${themeStyle.badge}`}>
                    Показатель 0{idx + 1}
                  </span>
                  <IconComponent className={`w-5 h-5 ${themeStyle.valueColor}`} />
                </div>

                {/* Massive Number (like 45%, 25+, 5+, 100+ on page 10 of PDF) */}
                <div className={`font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight tabular-nums mb-3 ${themeStyle.valueColor} drop-shadow-sm`}>
                  <EditableText
                    value={card.value}
                    onSave={(v) => updateCard(idx, 'value', v)}
                  />
                </div>

                <h3 className={`font-display font-bold text-base md:text-lg mb-2 leading-tight ${themeStyle.text}`}>
                  <EditableText
                    value={card.title}
                    onSave={(v) => updateCard(idx, 'title', v)}
                  />
                </h3>
              </div>

              <p className={`text-xs md:text-sm leading-relaxed ${themeStyle.subText}`}>
                <EditableText
                  value={card.desc}
                  onSave={(v) => updateCard(idx, 'desc', v)}
                  multiline
                />
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/80 z-10">
        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400">
          <span>● Социально-экономический эффект подтвержден предпроектным опросом</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          КОМАНДА «ЭХО» · СОЦИАЛЬНАЯ ЗНАЧИМОСТЬ
        </div>
      </div>
    </div>
  );
};
