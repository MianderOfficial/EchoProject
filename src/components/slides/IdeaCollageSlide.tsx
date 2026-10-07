import React from 'react';
import { SlideData } from '../../types/presentation';
import { EditableText } from '../EditableText';
import { EchoLogo } from '../EchoLogo';
import { Lightbulb, Image as ImageIcon, Sparkles } from 'lucide-react';

interface IdeaCollageSlideProps {
  slide: SlideData;
  onUpdate: (updated: SlideData) => void;
  theme?: string;
}

export const IdeaCollageSlide: React.FC<IdeaCollageSlideProps> = ({
  slide,
  onUpdate,
  theme,
}) => {
  const payload = slide.payload || {};
  const items = payload.items || [];
  const isLight = theme === 'light-acoustic';

  const updateItem = (index: number, field: string, val: string) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: val };
    onUpdate({
      ...slide,
      payload: { ...slide.payload, items: next },
    });
  };

  // 4 Quadrants styling matching Page 7 of the PDF (Yellow/Amber, Cyan, Deep Navy, Teal)
  const quadrantStyles = [
    {
      bg: 'from-amber-600/90 to-amber-800/90',
      border: 'border-amber-400/40',
      badge: 'bg-amber-400 text-slate-950',
      wave: '#F59E0B',
    },
    {
      bg: 'from-[#0F4C81] to-[#0A2E4E]',
      border: 'border-blue-400/40',
      badge: 'bg-blue-400 text-slate-950',
      wave: '#38B6B6',
    },
    {
      bg: 'from-[#1A7C9B] to-[#0C4A5E]',
      border: 'border-cyan-400/40',
      badge: 'bg-cyan-400 text-slate-950',
      wave: '#48CAE4',
    },
    {
      bg: 'from-[#0A192F] to-[#06101E]',
      border: 'border-slate-700',
      badge: 'bg-slate-300 text-slate-950',
      wave: '#94A3B8',
    },
  ];

  return (
    <div className={`w-full h-full flex flex-col justify-between p-8 md:p-12 select-none relative overflow-hidden transition-colors ${
      isLight ? 'bg-white/80 backdrop-blur-sm text-slate-900' : 'bg-[#091524]/70 backdrop-blur-[2px] text-slate-100'
    }`}>
      {/* Top Header & Intro text */}
      <div className="flex items-start justify-between z-10 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              07 · Визуальная концепция
            </span>
            <span className="w-8 h-[1px] bg-cyan-500/50" />
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-white flex items-center gap-3">
            <EditableText
              value={slide.title}
              onSave={(v) => onUpdate({ ...slide, title: v })}
            />
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            <EditableText
              value={
                payload.intro ||
                'Здесь можно показать любую визуализацию вашей идеи: эскизы, мудборды, мокапы, чертежи, 3D-модели...'
              }
              onSave={(v) =>
                onUpdate({
                  ...slide,
                  payload: { ...slide.payload, intro: v },
                })
              }
              multiline
            />
          </p>
        </div>

        <EchoLogo size={44} withRipples />
      </div>

      {/* 4 Quadrants Showcase Grid (mirrors Page 7 of PDF) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-auto z-10">
        {items.map((item: any, idx: number) => {
          const style = quadrantStyles[idx % quadrantStyles.length];

          return (
            <div
              key={item.id || idx}
              className={`rounded-2xl p-5 bg-gradient-to-br ${style.bg} border ${style.border} shadow-xl flex flex-col justify-between min-h-[220px] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}
            >
              {/* Background abstract acoustic vectors & ripples */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r={30 + idx * 20} fill="none" stroke={style.wave} strokeWidth="1.5" strokeDasharray="3 4" />
                  <circle cx="100" cy="100" r={50 + idx * 25} fill="none" stroke={style.wave} strokeWidth="1" />
                </svg>
              </div>

              {/* Card top */}
              <div className="relative z-10 flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${style.badge}`}>
                  Визуал 0{idx + 1}
                </span>
                <ImageIcon className="w-4 h-4 text-white/80" />
              </div>

              {/* Card center icon graphic */}
              <div className="relative z-10 my-3 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-xl bg-black/20 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/80">
                  [Изображение идеи]
                </span>
              </div>

              {/* Card bottom info */}
              <div className="relative z-10 bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <h3 className="font-display font-bold text-xs md:text-sm text-white mb-1 leading-snug">
                  <EditableText
                    value={item.title}
                    onSave={(v) => updateItem(idx, 'title', v)}
                  />
                </h3>
                <p className="text-[11px] text-white/80 leading-tight">
                  <EditableText
                    value={item.desc}
                    onSave={(v) => updateItem(idx, 'desc', v)}
                    multiline
                  />
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/80 z-10">
        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400">
          <span>● Кликните на любой заголовок или описание для редактирования</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          КОМАНДА «ЭХО» · КОНЦЕПТ-КОЛЛАЖ
        </div>
      </div>
    </div>
  );
};
