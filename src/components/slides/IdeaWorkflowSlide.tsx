import React from 'react';
import { SlideData } from '../../types/presentation';
import { EditableText } from '../EditableText';
import { EchoLogo } from '../EchoLogo';
import { ArrowDown, CheckCircle2 } from 'lucide-react';

interface IdeaWorkflowSlideProps {
  slide: SlideData;
  onUpdate: (updated: SlideData) => void;
  theme?: string;
}

export const IdeaWorkflowSlide: React.FC<IdeaWorkflowSlideProps> = ({
  slide,
  onUpdate,
  theme,
}) => {
  const payload = slide.payload || {};
  const steps = payload.steps || [];
  const isLight = theme === 'light-acoustic';

  const updateStep = (index: number, field: string, val: string) => {
    const next = [...steps];
    next[index] = { ...next[index], [field]: val };
    onUpdate({
      ...slide,
      payload: { ...slide.payload, steps: next },
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
              09 · Технологический сценарий
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
              value={slide.subtitle || 'Последовательность шагов реализации проекта'}
              onSave={(v) => onUpdate({ ...slide, subtitle: v })}
            />
          </p>
        </div>

        <EchoLogo size={44} withRipples />
      </div>

      {/* Tri-Split Layout (mirrors Page 9 of PDF: Cyan Wing / Dark Center Spine / Amber Wing) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-auto z-10 items-stretch">
        {/* Left Wing: Cyan Acoustic Block */}
        <div className="hidden md:flex md:col-span-3 rounded-2xl p-5 bg-gradient-to-br from-[#0F4C81]/80 to-[#1A7C9B]/70 border border-cyan-400/40 flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-400 text-slate-950 uppercase">
              Стадия: Замеры
            </span>
          </div>

          <div className="text-center my-auto py-6">
            <div className="w-12 h-12 rounded-xl bg-slate-950/40 border border-cyan-300/40 mx-auto flex items-center justify-center mb-2">
              <span className="font-display font-black text-white text-lg">01-02</span>
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              Инженерная фаза
            </div>
            <p className="text-[11px] text-cyan-100/90 leading-tight">
              Точные расчеты и лазерные замеры аудиторий
            </p>
          </div>

          <div className="text-center text-[10px] font-mono text-cyan-200">
            [Изображение идеи / Чертеж]
          </div>
        </div>

        {/* Central Spine: 4 Steps (The Core Column from Page 9) */}
        <div className="md:col-span-6 rounded-2xl p-5 bg-slate-900/90 border border-cyan-500/30 flex flex-col justify-between shadow-2xl space-y-3">
          {steps.map((st: any, idx: number) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors group"
            >
              <div className="font-display font-black text-2xl md:text-3xl text-cyan-400 shrink-0 w-8 text-center tabular-nums group-hover:scale-110 transition-transform">
                {st.num || idx + 1}
              </div>

              <div className="flex-1">
                <h3 className="font-display font-bold text-xs md:text-sm text-white mb-0.5">
                  <EditableText
                    value={st.title}
                    onSave={(v) => updateStep(idx, 'title', v)}
                  />
                </h3>
                <p className="text-xs text-slate-300 leading-snug">
                  <EditableText
                    value={st.desc}
                    onSave={(v) => updateStep(idx, 'desc', v)}
                    multiline
                  />
                </p>
              </div>

              <CheckCircle2 className="w-4 h-4 text-cyan-500/40 shrink-0 mt-1" />
            </div>
          ))}
        </div>

        {/* Right Wing: Amber Harmonic Block */}
        <div className="hidden md:flex md:col-span-3 rounded-2xl p-5 bg-gradient-to-br from-amber-600/80 to-amber-800/80 border border-amber-400/40 flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-300 text-slate-950 uppercase">
              Стадия: Монтаж
            </span>
          </div>

          <div className="text-center my-auto py-6">
            <div className="w-12 h-12 rounded-xl bg-slate-950/40 border border-amber-300/40 mx-auto flex items-center justify-center mb-2">
              <span className="font-display font-black text-white text-lg">03-04</span>
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              Фаза внедрения
            </div>
            <p className="text-[11px] text-amber-100 leading-tight">
              Сборка, установка и проверка в аудитории
            </p>
          </div>

          <div className="text-center text-[10px] font-mono text-amber-200">
            [Изображение идеи / Прототип]
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/80 z-10">
        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400">
          <span>● Полный цикл от технического задания до акта приемки</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          КОМАНДА «ЭХО» · ДОРОЖНАЯ КАРТА ПРОЦЕССА
        </div>
      </div>
    </div>
  );
};
