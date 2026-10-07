import React from 'react';
import { SlideData } from '../../types/presentation';
import { EditableText } from '../EditableText';
import { EchoLogo } from '../EchoLogo';
import { ShieldCheck, Check, X, Layers, AlertCircle } from 'lucide-react';

interface AnalogsSlideProps {
  slide: SlideData;
  onUpdate: (updated: SlideData) => void;
  theme?: string;
}

export const AnalogsSlide: React.FC<AnalogsSlideProps> = ({
  slide,
  onUpdate,
  theme,
}) => {
  const payload = slide.payload || {};
  const ourProduct = payload.ourProduct || { points: [] };
  const analogs = payload.analogs || [];
  const isLight = theme === 'light-acoustic';

  const updateOurPoint = (idx: number, val: string) => {
    const nextPoints = [...ourProduct.points];
    nextPoints[idx] = val;
    onUpdate({
      ...slide,
      payload: {
        ...slide.payload,
        ourProduct: { ...ourProduct, points: nextPoints },
      },
    });
  };

  const updateAnalogPoint = (analogIdx: number, pointIdx: number, val: string) => {
    const nextAnalogs = [...analogs];
    const target = { ...nextAnalogs[analogIdx] };
    const nextPoints = [...target.points];
    nextPoints[pointIdx] = val;
    target.points = nextPoints;
    nextAnalogs[analogIdx] = target;

    onUpdate({
      ...slide,
      payload: { ...slide.payload, analogs: nextAnalogs },
    });
  };

  const updateAnalogTitle = (analogIdx: number, val: string) => {
    const nextAnalogs = [...analogs];
    nextAnalogs[analogIdx] = { ...nextAnalogs[analogIdx], title: val };
    onUpdate({
      ...slide,
      payload: { ...slide.payload, analogs: nextAnalogs },
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
              06 · Бенчмаркинг и конкурентный анализ
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
              value={slide.subtitle || 'Сравнение существующих альтернатив и ключевых преимуществ'}
              onSave={(v) => onUpdate({ ...slide, subtitle: v })}
            />
          </p>
        </div>

        <EchoLogo size={44} withRipples />
      </div>

      {/* Comparison Grid (mirrors Page 6 of PDF) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-auto z-10">
        {/* Column 1: Наш продукт (Our Solution - Highlighted) */}
        <div className="rounded-2xl p-5 bg-gradient-to-b from-[#0F4C81] to-[#0A2647] border-2 border-cyan-400/80 shadow-2xl relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-mono text-[10px] font-bold uppercase tracking-wider">
                Наш проект
              </span>
              <EchoLogo size={28} />
            </div>

            <h3 className="font-display font-black text-lg md:text-xl text-white tracking-tight mb-4">
              <EditableText
                value={ourProduct.title || 'Наше решение («Эхо»)'}
                onSave={(v) =>
                  onUpdate({
                    ...slide,
                    payload: {
                      ...payload,
                      ourProduct: { ...ourProduct, title: v },
                    },
                  })
                }
              />
            </h3>

            <div className="space-y-3">
              {ourProduct.points.map((pt: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-white">
                  <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="leading-snug">
                    <EditableText
                      value={pt}
                      onSave={(v) => updateOurPoint(idx, v)}
                      multiline
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-400/30 text-center">
            <span className="text-[11px] font-mono text-cyan-200">
              ✓ 100% готовность к интеграции
            </span>
          </div>
        </div>

        {/* Columns 2, 3, 4: Analogs 1, 2, 3 */}
        {analogs.map((analog: any, aIdx: number) => {
          const badgeColors = [
            'bg-sky-950/80 text-sky-300 border-sky-800',
            'bg-emerald-950/80 text-emerald-300 border-emerald-800',
            'bg-rose-950/80 text-rose-300 border-rose-800',
          ];

          return (
            <div
              key={analog.id || aIdx}
              className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                      badgeColors[aIdx % badgeColors.length]
                    }`}
                  >
                    Аналог 0{aIdx + 1}
                  </span>
                  <span className="w-3 h-3 rounded-full bg-slate-700" />
                </div>

                <h3 className="font-display font-bold text-sm md:text-base text-white tracking-tight mb-4 min-h-[44px]">
                  <EditableText
                    value={analog.title}
                    onSave={(v) => updateAnalogTitle(aIdx, v)}
                    multiline
                  />
                </h3>

                <div className="space-y-3">
                  {analog.points.map((pt: string, pIdx: number) => (
                    <div
                      key={pIdx}
                      className="flex items-start gap-2.5 text-xs text-slate-300"
                    >
                      <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-mono font-bold">
                          {pIdx + 1}
                        </span>
                      </div>
                      <span className="leading-snug">
                        <EditableText
                          value={pt}
                          onSave={(v) => updateAnalogPoint(aIdx, pIdx, v)}
                          multiline
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
                <span className="text-[11px] font-mono text-slate-500">
                  Ограничения альтернативы
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/80 z-10">
        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400">
          <span>● Ключевое отличие: баланс цены, простоты монтажа и долговечности для вуза</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          КОМАНДА «ЭХО» · СРАВНИТЕЛЬНЫЙ АНАЛИЗ
        </div>
      </div>
    </div>
  );
};
