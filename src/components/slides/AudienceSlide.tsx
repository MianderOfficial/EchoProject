import React from 'react';
import { SlideData } from '../../types/presentation';
import { EditableText } from '../EditableText';
import { EchoLogo } from '../EchoLogo';
import { Users, BarChart3 } from 'lucide-react';

interface AudienceSlideProps {
  slide: SlideData;
  onUpdate: (updated: SlideData) => void;
  theme?: string;
}

export const AudienceSlide: React.FC<AudienceSlideProps> = ({
  slide,
  onUpdate,
  theme,
}) => {
  const stats = slide.payload?.stats || [];
  const isLight = theme === 'light-acoustic';

  const updateStat = (index: number, field: string, val: string) => {
    const next = [...stats];
    next[index] = { ...next[index], [field]: val };
    onUpdate({
      ...slide,
      payload: { ...slide.payload, stats: next },
    });
  };

  const leftStats = stats.slice(0, 3);
  const rightStats = stats.slice(3, 6);

  return (
    <div className={`w-full h-full flex flex-col justify-between p-8 md:p-12 select-none relative overflow-hidden transition-colors ${
      isLight ? 'bg-white/80 backdrop-blur-sm text-slate-900' : 'bg-[#091524]/70 backdrop-blur-[2px] text-slate-100'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between z-10 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              05 · Сегментация пользователей
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
              value={slide.subtitle || 'Данные опросов и портрет целевых пользователей проекта'}
              onSave={(v) => onUpdate({ ...slide, subtitle: v })}
            />
          </p>
        </div>

        <EchoLogo size={44} withRipples />
      </div>

      {/* Two Acoustic Columns (mirrors Page 5 of PDF layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto z-10">
        {/* Left Column: Cyan Acoustic Tone */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0F4C81]/40 to-[#0A2647]/50 border border-cyan-500/30 flex flex-col gap-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
            <span className="font-display font-bold text-sm text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Основная группа · Студенты</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400/80">ОХВАТ: 82%</span>
          </div>

          <div className="flex flex-col gap-5">
            {leftStats.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-5 group">
                <div className="w-28 shrink-0 flex items-baseline gap-1 font-display font-black text-3xl sm:text-4xl text-cyan-400 tracking-tight tabular-nums group-hover:scale-105 transition-transform">
                  <EditableText
                    value={item.value}
                    onSave={(v) => updateStat(idx, 'value', v)}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                    <EditableText
                      value={item.tag || 'Сегмент'}
                      onSave={(v) => updateStat(idx, 'tag', v)}
                    />
                  </div>
                  <p className="text-sm text-slate-200 leading-snug">
                    <EditableText
                      value={item.label}
                      onSave={(v) => updateStat(idx, 'label', v)}
                      multiline
                    />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Deep Navy / Ambient Tone */}
        <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 flex flex-col gap-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-display font-bold text-sm text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Дополнительные группы & Заинтересованность</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400/80">МЕТРИКИ</span>
          </div>

          <div className="flex flex-col gap-5">
            {rightStats.map((item: any, idx: number) => {
              const globalIdx = idx + 3;
              return (
                <div key={idx} className="flex items-center gap-5 group">
                  <div className="w-28 shrink-0 flex items-baseline gap-1 font-display font-black text-3xl sm:text-4xl text-white tracking-tight tabular-nums group-hover:scale-105 transition-transform">
                    <EditableText
                      value={item.value}
                      onSave={(v) => updateStat(globalIdx, 'value', v)}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-0.5">
                      <EditableText
                        value={item.tag || 'Параметр'}
                        onSave={(v) => updateStat(globalIdx, 'tag', v)}
                      />
                    </div>
                    <p className="text-sm text-slate-300 leading-snug">
                      <EditableText
                        value={item.label}
                        onSave={(v) => updateStat(globalIdx, 'label', v)}
                        multiline
                      />
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/80 z-10">
        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400">
          <span>● Репрезентативная выборка: студенты 1–4 курсов и преподавательский состав</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          КОМАНДА «ЭХО» · АУДИТОРИЯ И ИНСАЙТЫ
        </div>
      </div>
    </div>
  );
};
