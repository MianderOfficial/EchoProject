import React, { useState } from 'react';
import { SlideData } from '../../types/presentation';
import { EditableText } from '../EditableText';
import { EchoLogo } from '../EchoLogo';
import { UserCheck, BarChart3, AlertCircle, Target, MessageSquare } from 'lucide-react';

interface AudienceSlideProps {
  slide: SlideData;
  onUpdate: (updated: SlideData) => void;
  theme?: string;
}

const DEFAULT_PERSONAS = [
  {
    id: 'p1',
    tabLabel: 'Студент-автор',
    name: 'Алексей, 20 лет · 2 курс (АВТФ / ФПМИ)',
    segment: 'Основной сегмент ЦА (Ядро активности — 65%)',
    quote: '«Вижу, что в 304-й аудитории не работают розетки и душно, но не пойду же я ради этого писать бумажное заявление в деканат»',
    pains: 'Боится бюрократии, не знает кто отвечает за аудитории и расписание, уверен что одиночную жалобу проигнорируют.',
    goals: 'Подать идею в боте VK или MAX за 30 секунд, увидеть поддержку однокурсников в опросе канала и получить ответ от деканата.',
    channels: 'Сидит в беседах группы в VK и учебном чате в мессенджере MAX ежедневно.',
  },
  {
    id: 'p2',
    tabLabel: 'Голосующий в канале',
    name: 'Мария, 19 лет · 1–3 курс (ФБИ / ФГО)',
    segment: 'Массовый сегмент верификации (Опросы в канале — 80%)',
    quote: '«Сама редко пишу длинные предложения, но в канале с опросами с радостью проголосую за нормальные идеи и против глупостей»',
    pains: 'Раздражает спам в студенческих чатах и нереалистичные требования отдельных студентов.',
    goals: 'В 1 клик голосовать в опросах канала «ЭхоМост» (За / Против), фильтруя действительно нужные факультету инициативы.',
    channels: 'Читает новостные каналы факультета в VK и MAX между парами.',
  },
  {
    id: 'p3',
    tabLabel: 'Представитель деканата',
    name: 'Замдекана по учебной и ВР · 35–50 лет',
    segment: 'Вторая сторона моста «ЭхоМост» (Получатель сводки)',
    quote: '«Мы готовы помогать студентам, но не можем разбирать 200 эмоциональных сообщений и выполнять каждую единичную прихоть»',
    pains: 'Информационный шум, дублирующиеся жалобы, отсутствие понимания — это проблема одного человека или всего потока.',
    goals: 'Получать от команды «ЭхоМост» только проверенные опросом инициативы (50+ голосов ЗА) с готовой статистикой.',
    channels: 'Официальное сообщество деканата в VK, рабочий контур в мессенджере MAX.',
  },
];

export const AudienceSlide: React.FC<AudienceSlideProps> = ({
  slide,
  onUpdate,
  theme,
}) => {
  const payload = slide.payload || {};
  const stats = payload.stats || [];
  const personas = payload.personas || DEFAULT_PERSONAS;
  const [activePersonaIdx, setActivePersonaIdx] = useState(0);
  const isLight = theme === 'light-acoustic';

  const currentPersona = personas[activePersonaIdx] || personas[0];

  const updateStat = (index: number, field: string, val: string) => {
    const next = [...stats];
    next[index] = { ...next[index], [field]: val };
    onUpdate({
      ...slide,
      payload: { ...payload, stats: next },
    });
  };

  const updatePersona = (index: number, field: string, val: string) => {
    const next = [...personas];
    next[index] = { ...next[index], [field]: val };
    onUpdate({
      ...slide,
      payload: { ...payload, personas: next },
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
              05 · Метод Персон и результаты анкетирования
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
                'Описание целевого сегмента (Метод Персон) и результаты опроса студентов'
              }
              onSave={(v) => onUpdate({ ...slide, subtitle: v })}
            />
          </p>
        </div>

        <EchoLogo size={42} withRipples />
      </div>

      {/* Two-Column Grid: Left = Persona Card (Метод Персон), Right = Survey Results */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-auto z-10">
        {/* Left Column (6 cols): Метод Персон */}
        <div className="md:col-span-6 rounded-2xl p-5 bg-gradient-to-br from-[#0F4C81]/45 to-[#0A2647]/65 border border-cyan-500/35 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-cyan-500/20">
              <div className="flex items-center gap-2 font-display font-bold text-sm text-cyan-300">
                <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Портрет ЦА (Метод Персон)</span>
              </div>

              {/* Interactive Segmented Persona Selector */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950/80 border border-slate-800">
                {personas.map((p: any, idx: number) => (
                  <button
                    key={p.id || idx}
                    onClick={() => setActivePersonaIdx(idx)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                      activePersonaIdx === idx
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.tabLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Persona Header & Quote */}
            <div className="mb-3">
              <div className="text-xs font-mono text-cyan-400 mb-0.5">
                <EditableText
                  value={currentPersona.segment}
                  onSave={(v) => updatePersona(activePersonaIdx, 'segment', v)}
                />
              </div>
              <h3 className="font-display font-bold text-base md:text-lg text-white">
                <EditableText
                  value={currentPersona.name}
                  onSave={(v) => updatePersona(activePersonaIdx, 'name', v)}
                />
              </h3>
              <div className="mt-1.5 p-2.5 rounded-xl bg-slate-950/75 border border-slate-800 text-xs italic text-slate-200 leading-snug">
                <EditableText
                  value={currentPersona.quote}
                  onSave={(v) => updatePersona(activePersonaIdx, 'quote', v)}
                  multiline
                />
              </div>
            </div>

            {/* Pains, Goals, Channels */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="font-bold text-amber-400">Боли и барьеры: </span>
                <span className="text-slate-300">
                  <EditableText
                    value={currentPersona.pains}
                    onSave={(v) => updatePersona(activePersonaIdx, 'pains', v)}
                    multiline
                  />
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="font-bold text-emerald-400">Ожидания от «ЭхоМост»: </span>
                <span className="text-slate-300">
                  <EditableText
                    value={currentPersona.goals}
                    onSave={(v) => updatePersona(activePersonaIdx, 'goals', v)}
                    multiline
                  />
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="font-bold text-cyan-300">Цифровая среда (VK / MAX): </span>
                <span className="text-slate-300">
                  <EditableText
                    value={currentPersona.channels}
                    onSave={(v) => updatePersona(activePersonaIdx, 'channels', v)}
                    multiline
                  />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Результаты опроса */}
        <div className="md:col-span-6 rounded-2xl p-5 bg-slate-900/85 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 font-display font-bold text-sm text-white">
                <BarChart3 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Результаты опроса и проблемных интервью</span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 tabular-nums">
                N = 112 СТУДЕНТОВ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stats.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/75 border border-slate-800/90 flex flex-col justify-between"
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-display font-black text-2xl text-cyan-400 tabular-nums">
                      <EditableText
                        value={item.value}
                        onSave={(v) => updateStat(idx, 'value', v)}
                      />
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      <EditableText
                        value={item.tag || 'Опрос'}
                        onSave={(v) => updateStat(idx, 'tag', v)}
                      />
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">
                    <EditableText
                      value={item.label}
                      onSave={(v) => updateStat(idx, 'label', v)}
                      multiline
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Формат: онлайн-анкетирование в VK/MAX + 5 глубинных интервью</span>
            <span className="font-mono text-cyan-400">ФАКУЛЬТЕТЫ: ФБИ, РЭФ, ФПМИ, ФГО, АВТФ, ФМА</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80 z-10">
        <div className="font-mono text-[11px] text-cyan-400">
          Вывод исследования: 86% студентов поддерживают идею фильтрации инициатив через открытые опросы в канале перед отправкой в деканат
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          КОМАНДА «ЭХО» · МЕТОД ПЕРСОН И ОПРОС
        </div>
      </div>
    </div>
  );
};
