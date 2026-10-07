import React from 'react';
import { SlideData } from '../../types/presentation';
import { EditableText } from '../EditableText';
import { EchoLogo } from '../EchoLogo';
import { MessageSquare, Send, Mail, MapPin, QrCode } from 'lucide-react';

interface FinalSlideProps {
  slide: SlideData;
  onUpdate: (updated: SlideData) => void;
  theme?: string;
}

export const FinalSlide: React.FC<FinalSlideProps> = ({ slide, onUpdate, theme }) => {
  const payload = slide.payload || {};
  const contacts = payload.contacts || [];
  const isLight = theme === 'light-acoustic';

  const updateContact = (index: number, field: string, val: string) => {
    const next = [...contacts];
    next[index] = { ...next[index], [field]: val };
    onUpdate({
      ...slide,
      payload: { ...slide.payload, contacts: next },
    });
  };

  const contactIcons = [Send, Mail, MapPin];

  return (
    <div className={`w-full h-full flex flex-col justify-between p-8 md:p-14 select-none relative overflow-hidden transition-colors ${
      isLight ? 'bg-white/80 backdrop-blur-sm text-slate-900' : 'bg-[#091524]/70 backdrop-blur-[2px] text-slate-100'
    }`}>
      {/* Background acoustic circles echoing the team logo */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 800 600">
          <circle cx="250" cy="300" r="180" fill="#0F4C81" opacity="0.4" />
          <circle cx="450" cy="300" r="180" fill="#38B6B6" opacity="0.3" />
          <circle cx="350" cy="300" r="280" fill="none" stroke="#48CAE4" strokeWidth="1" strokeDasharray="5 7" />
        </svg>
      </div>

      {/* Top Header */}
      <div className="flex items-start justify-between z-10">
        <div className="flex items-center gap-3">
          <EchoLogo size={48} withRipples />
          <div>
            <div className="font-display text-sm font-bold tracking-wider text-cyan-300">
              КОМАНДА «ЭХО»
            </div>
            <div className="text-[11px] text-slate-400">
              Университетский проектный трек 2026
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Секция вопросов и ответов (Q&A)</span>
        </div>
      </div>

      {/* Center Hero Block */}
      <div className="my-auto text-center max-w-2xl mx-auto z-10 py-6">
        <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.1] mb-4 drop-shadow-md">
          <EditableText
            value={slide.title}
            onSave={(v) => onUpdate({ ...slide, title: v })}
          />
        </h2>

        <p className="text-base md:text-lg text-cyan-300 font-medium mb-6">
          <EditableText
            value={slide.subtitle || 'Готовы ответить на ваши вопросы и обсудить предложения'}
            onSave={(v) => onUpdate({ ...slide, subtitle: v })}
          />
        </p>

        <p className="text-xs md:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed bg-slate-900/60 backdrop-blur-sm p-4 rounded-xl border border-slate-800">
          <EditableText
            value={payload.slogan || 'Создаем акустический, световой и визуальный комфорт университетской среды.'}
            onSave={(v) =>
              onUpdate({
                ...slide,
                payload: { ...slide.payload, slogan: v },
              })
            }
            multiline
          />
        </p>
      </div>

      {/* Bottom Contact Cards & QR Slot */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 z-10">
        {/* Contact slots */}
        {contacts.map((c: any, idx: number) => {
          const IconComp = contactIcons[idx % contactIcons.length];
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
                <IconComp className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                  <EditableText
                    value={c.label}
                    onSave={(v) => updateContact(idx, 'label', v)}
                  />
                </div>
                <div className="text-xs font-semibold text-white truncate">
                  <EditableText
                    value={c.value}
                    onSave={(v) => updateContact(idx, 'value', v)}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* Presentation QR placeholder */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-400 text-slate-950 flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-cyan-300 tracking-wider">
              Материалы проекта
            </div>
            <div className="text-xs font-bold text-white">
              Презентация и смета
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
