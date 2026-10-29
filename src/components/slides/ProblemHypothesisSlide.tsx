import React from 'react';
import { SlideData } from '../../types/presentation';
import { EditableText } from '../EditableText';
import { EchoLogo } from '../EchoLogo';
import { AlertTriangle, FlaskConical, Vote, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';

interface ProblemHypothesisSlideProps {
  slide: SlideData;
  onUpdate: (updated: SlideData) => void;
  theme?: string;
}

export const ProblemHypothesisSlide: React.FC<ProblemHypothesisSlideProps> = ({
  slide,
  onUpdate,
  theme,
}) => {
  const payload = slide.payload || {};
  const problems = payload.problems || [];
  const hypothesis = payload.hypothesis || {
    ifPart: '',
    thenPart: '',
    becausePart: '',
    metric: '',
  };
  const pollFilterSteps = payload.pollFilterSteps || [];
  const isLight = theme === 'light-acoustic';

  const updateProblem = (idx: number, field: string, val: string) => {
    const next = [...problems];
    next[idx] = { ...next[idx], [field]: val };
    onUpdate({
      ...slide,
      payload: { ...payload, problems: next },
    });
  };

  const updateHypothesis = (field: string, val: string) => {
    onUpdate({
      ...slide,
      payload: {
        ...payload,
        hypothesis: { ...hypothesis, [field]: val },
      },
    });
  };

  const updateFilterStep = (idx: number, field: string, val: string) => {
    const next = [...pollFilterSteps];
    next[idx] = { ...next[idx], [field]: val };
    onUpdate({
      ...slide,
      payload: { ...payload, pollFilterSteps: next },
    });
  };

  return (
    <div
      className={`w-full h-full flex flex-col justify-between p-7 md:p-10 select-none relative overflow-hidden transition-colors ${
        isLight
          ? 'bg-white/85 backdrop-blur-sm text-slate-900'
          : 'bg-[#091524]/75 backdrop-blur-[2px] text-slate-100'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono tracking-wider text-cyan-400">
              04 · Проблемные интервью и проверка гипотез
            </span>
          </div>
          <h2 className="font-display font-black text-2xl md:text-4xl tracking-tight text-white">
            <EditableText
              value={slide.title}
              onSave={(v) => onUpdate({ ...slide, title: v })}
            />
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5 max-w-2xl">
            <EditableText
              value={
                slide.subtitle ||
                'Двусторонняя боль студентов и деканата · Фильтрация инициатив через опросы в канале VK и MAX'
              }
              onSave={(v) => onUpdate({ ...slide, subtitle: v })}
            />
          </p>
        </div>

        <EchoLogo size={42} withRipples />
      </div>

      {/* Main Two-Column Grid: Problem vs Hypothesis + Poll Filter */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-auto z-10">
        {/* Left Column (5 cols): Решаемая проблема */}
        <div className="md:col-span-5 rounded-2xl p-5 bg-slate-900/85 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 font-display font-bold text-sm text-amber-400">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Решаемая проблема (Боли сторон)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                5 ИНТЕРВЬЮ
              </span>
            </div>

            <div className="space-y-3">
              {problems.map((prob: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-cyan-300">
                      <EditableText
                        value={prob.side}
                        onSave={(v) => updateProblem(idx, 'side', v)}
                      />
                    </span>
                    <span className="text-[11px] font-mono text-amber-400/90 tabular-nums">
                      <EditableText
                        value={prob.stat}
                        onSave={(v) => updateProblem(idx, 'stat', v)}
                      />
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <EditableText
                      value={prob.desc}
                      onSave={(v) => updateProblem(idx, 'desc', v)}
                      multiline
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
            <strong className="text-white">Главный вывод интервью:</strong> Деканат не может выполнять все одиночные просьбы подряд — нужен предварительный фильтр большинства.
          </div>
        </div>

        {/* Right Column (7 cols): Проверяемая гипотеза + Канал опросов */}
        <div className="md:col-span-7 flex flex-col gap-4">
          {/* Top card: Проверяемая гипотеза */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-[#0F4C81]/50 to-[#0A2647]/70 border border-cyan-500/35 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
              <div className="flex items-center gap-2 font-display font-bold text-sm text-cyan-300">
                <FlaskConical className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Проверяемая гипотеза проекта «ЭхоМост»</span>
              </div>
              <span className="text-[11px] font-mono text-cyan-300 tabular-nums">
                ЦИКЛ HADI
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/75 border border-slate-800">
                <div className="text-[11px] font-mono font-bold text-cyan-400 mb-1">
                  1. ЕСЛИ МЫ...
                </div>
                <p className="text-slate-200 leading-snug">
                  <EditableText
                    value={hypothesis.ifPart}
                    onSave={(v) => updateHypothesis('ifPart', v)}
                    multiline
                  />
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/75 border border-slate-800">
                <div className="text-[11px] font-mono font-bold text-amber-400 mb-1">
                  2. ТО СТУДЕНТЫ И ДЕКАНАТ...
                </div>
                <p className="text-slate-200 leading-snug">
                  <EditableText
                    value={hypothesis.thenPart}
                    onSave={(v) => updateHypothesis('thenPart', v)}
                    multiline
                  />
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/75 border border-slate-800">
                <div className="text-[11px] font-mono font-bold text-emerald-400 mb-1">
                  3. ПОТОМУ ЧТО...
                </div>
                <p className="text-slate-200 leading-snug">
                  <EditableText
                    value={hypothesis.becausePart}
                    onSave={(v) => updateHypothesis('becausePart', v)}
                    multiline
                  />
                </p>
              </div>
            </div>
          </div>

          {/* Bottom card: Механика фильтрации через Канал опросов */}
          <div className="rounded-2xl p-4 bg-slate-900/90 border border-slate-800 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-display font-bold text-white">
                <Vote className="w-4 h-4 text-cyan-400" />
                <span>Как работает фильтр «Бот → Канал с опросами → Деканат» (VK и MAX):</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">
                Защита от спама и капризов
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {pollFilterSteps.map((step: any, sIdx: number) => (
                <div
                  key={sIdx}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-1">
                    <span>
                      <EditableText
                        value={step.step}
                        onSave={(v) => updateFilterStep(sIdx, 'step', v)}
                      />
                    </span>
                    {sIdx < 2 ? (
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-white mb-0.5">
                    <EditableText
                      value={step.title}
                      onSave={(v) => updateFilterStep(sIdx, 'title', v)}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    <EditableText
                      value={step.desc}
                      onSave={(v) => updateFilterStep(sIdx, 'desc', v)}
                      multiline
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80 z-10">
        <div className="font-mono text-[11px] text-cyan-400">
          Критерий валидации гипотезы: конверсия в голосование в канале ≥ 60% · порог прохождения идеи в деканат ≥ 50 голосов «За»
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          КОМАНДА «ЭХО» · ЭХОМОСТ (VK & MAX)
        </div>
      </div>
    </div>
  );
};
