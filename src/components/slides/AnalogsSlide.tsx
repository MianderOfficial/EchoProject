import React from 'react';
import { SlideData } from '../../types/presentation';
import { EditableText } from '../EditableText';
import { EchoLogo } from '../EchoLogo';
import { Check, Compass } from 'lucide-react';

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
  const marketPosition =
    payload.marketPosition ||
    'Наше место на рынке: единственный внутривузовский сервис в легальном контуре РФ (VK и MAX), который объединяет быстроту мессенджера, верификацию через открытые опросы в канале и прямую маршрутизацию в деканат.';
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
              06 · Анализ рынка и конкурентное позиционирование
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
                'Сравнение существующих каналов обратной связи в вузах РФ и ниша проекта «ЭхоМост»'
              }
              onSave={(v) => onUpdate({ ...slide, subtitle: v })}
            />
          </p>
        </div>

        <EchoLogo size={42} withRipples />
      </div>

      {/* Market Positioning Banner */}
      <div className="z-10 my-2 p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center gap-3">
        <Compass className="w-5 h-5 text-cyan-400 shrink-0" />
        <div className="text-xs text-slate-200 leading-snug">
          <EditableText
            value={marketPosition}
            onSave={(v) =>
              onUpdate({
                ...slide,
                payload: { ...payload, marketPosition: v },
              })
            }
            multiline
          />
        </div>
      </div>

      {/* Comparison Grid (4 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 my-auto z-10">
        {/* Column 1: Наш продукт («ЭхоМост» VK & MAX) */}
        <div className="rounded-2xl p-4 bg-gradient-to-b from-[#0F4C81] to-[#0A2647] border-2 border-cyan-400/80 shadow-xl relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-cyan-300">
                НАША НИША · VK & MAX
              </span>
              <EchoLogo size={24} />
            </div>

            <h3 className="font-display font-black text-base md:text-lg text-white tracking-tight mb-3">
              <EditableText
                value={ourProduct.title || '«ЭхоМост» (Бот + Канал опросов)'}
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

            <div className="space-y-2.5">
              {ourProduct.points.map((pt: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-white">
                  <div className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
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

          <div className="mt-3 pt-2 border-t border-cyan-400/30 text-center">
            <span className="text-[11px] font-mono text-cyan-200">
              Прямой мост: Студенты → Опрос → Деканат
            </span>
          </div>
        </div>

        {/* Columns 2, 3, 4: Market Alternatives */}
        {analogs.map((analog: any, aIdx: number) => (
          <div
            key={analog.id || aIdx}
            className="rounded-2xl p-4 bg-slate-900/85 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2 text-[11px] font-mono text-slate-400">
                <span>Сегмент рынка 0{aIdx + 1}</span>
                <span className="text-amber-400/90">{analog.tag}</span>
              </div>

              <h3 className="font-display font-bold text-sm md:text-base text-white tracking-tight mb-3 min-h-[40px]">
                <EditableText
                  value={analog.title}
                  onSave={(v) => updateAnalogTitle(aIdx, v)}
                  multiline
                />
              </h3>

              <div className="space-y-2.5">
                {analog.points.map((pt: string, pIdx: number) => (
                  <div
                    key={pIdx}
                    className="flex items-start gap-2 text-xs text-slate-300"
                  >
                    <span className="font-mono font-bold text-[11px] text-slate-500 shrink-0 mt-0.5">
                      0{pIdx + 1}.
                    </span>
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

            <div className="mt-3 pt-2 border-t border-slate-800/80 text-center">
              <span className="text-[11px] font-mono text-slate-500">
                Нет фильтрации опросами в канале
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80 z-10">
        <div className="font-mono text-[11px] text-cyan-400">
          Конкурентное преимущество: 100% соответствие требованиям РФ (VK и мессенджер MAX) + защита деканата от спама за счет опросов
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          КОМАНДА «ЭХО» · АНАЛИЗ РЫНКА
        </div>
      </div>
    </div>
  );
};
