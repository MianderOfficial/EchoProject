import React from 'react';
import { SlideData } from '../../types/presentation';
import { EditableText } from '../EditableText';
import { EchoLogo } from '../EchoLogo';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

interface RoadmapSlideProps {
  slide: SlideData;
  onUpdate: (updated: SlideData) => void;
  theme?: string;
}

export const RoadmapSlide: React.FC<RoadmapSlideProps> = ({
  slide,
  onUpdate,
  theme,
}) => {
  const payload = slide.payload || {};
  const milestones = payload.milestones || [];
  const isLight = theme === 'light-acoustic';

  const updateMilestone = (index: number, field: string, val: any) => {
    const next = [...milestones];
    next[index] = { ...next[index], [field]: val };
    onUpdate({
      ...slide,
      payload: { ...slide.payload, milestones: next },
    });
  };

  const statusColors: Record<string, string> = {
    'Завершено': 'bg-emerald-950/80 text-emerald-300 border-emerald-700',
    'В работе': 'bg-cyan-950/80 text-cyan-300 border-cyan-700',
    'Запланировано': 'bg-slate-800 text-slate-300 border-slate-700',
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
              11 · График внедрения
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
              value={slide.subtitle || 'Календарный график ключевых контрольных точек проекта'}
              onSave={(v) => onUpdate({ ...slide, subtitle: v })}
            />
          </p>
        </div>

        <EchoLogo size={44} withRipples />
      </div>

      {/* 4 Roadmap Milestone Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-auto z-10">
        {milestones.map((m: any, idx: number) => (
          <div
            key={idx}
            className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-lg relative"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Фаза 0{idx + 1}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    statusColors[m.status] || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <EditableText
                    value={m.status}
                    onSave={(v) => updateMilestone(idx, 'status', v)}
                  />
                </span>
              </div>

              <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <EditableText
                  value={m.period}
                  onSave={(v) => updateMilestone(idx, 'period', v)}
                />
              </div>

              <h3 className="font-display font-bold text-sm text-white mb-3">
                <EditableText
                  value={m.phase}
                  onSave={(v) => updateMilestone(idx, 'phase', v)}
                />
              </h3>

              <div className="space-y-2">
                {m.items?.map((item: string, itemIdx: number) => (
                  <div key={itemIdx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Спринт {idx + 1}</span>
              <Clock className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/80 z-10">
        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400">
          <span>● Финальный дедлайн и защита перед комиссией: май 2026</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          КОМАНДА «ЭХО» · ТАЙМЛАЙН ПРОЕКТА
        </div>
      </div>
    </div>
  );
};
