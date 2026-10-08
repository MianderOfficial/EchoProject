import React, { useState, useRef } from 'react';
import { SlideData } from '../../types/presentation';
import { EditableText } from '../EditableText';
import { EchoLogo } from '../EchoLogo';
import {
  Crown,
  Plus,
  Trash2,
  Sparkles,
  Camera,
  X,
  Award,
  Layers,
  GraduationCap,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface TeamSlideProps {
  slide: SlideData;
  onUpdate: (updated: SlideData) => void;
  theme?: string;
}

export const TeamSlide: React.FC<TeamSlideProps> = ({ slide, onUpdate, theme }) => {
  const members = slide.payload?.members || [];
  const layoutMode =
    slide.payload?.layoutMode || (members.length === 7 ? 'lead-and-six' : 'staggered-3-4');
  const isLight = theme === 'light-acoustic';

  const [showBelbinModal, setShowBelbinModal] = useState(false);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const updateMember = (index: number, field: string, value: any) => {
    const next = [...members];
    next[index] = { ...next[index], [field]: value };
    onUpdate({
      ...slide,
      payload: { ...slide.payload, members: next },
    });
  };

  const setLayoutMode = (mode: string) => {
    onUpdate({
      ...slide,
      payload: { ...slide.payload, layoutMode: mode },
    });
  };

  const handlePhotoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateMember(index, 'photo', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    updateMember(index, 'photo', '');
  };

  const addMember = () => {
    if (members.length >= 10) return;
    const newMember = {
      id: `m_${Date.now()}`,
      name: 'Новый участник',
      faculty: 'ВУЗ',
      role: 'Специалист проекта',
      belbinRole: 'Реализатор / Рабочая пчёлка',
      bio: 'Зона ответственности и функциональные задачи в команде',
      colorScheme: 'cyan',
      avatarHue: 'from-cyan-600 to-blue-700',
    };
    onUpdate({
      ...slide,
      payload: { ...slide.payload, members: [...members, newMember] },
    });
  };

  const removeMember = (index: number) => {
    if (members.length <= 2) return;
    const next = members.filter((_: any, i: number) => i !== index);
    onUpdate({
      ...slide,
      payload: { ...slide.payload, members: next },
    });
  };

  const renderAvatar = (member: any, index: number, size: 'normal' | 'large' = 'normal') => {
    const initials = member.name
      ? member.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : 'ЭХ';

    const boxSize =
      size === 'large'
        ? 'w-16 h-16 md:w-20 md:h-20 text-xl md:text-2xl'
        : 'w-12 h-12 md:w-14 md:h-14 text-sm md:text-base';

    return (
      <div className="relative shrink-0 group/avatar">
        {/* Hidden file input for photo upload */}
        <input
          type="file"
          ref={(el) => {
            fileInputRefs.current[index] = el;
          }}
          onChange={(e) => handlePhotoUpload(index, e)}
          accept="image/*"
          className="hidden"
        />

        <div
          onClick={() => fileInputRefs.current[index]?.click()}
          className={`${boxSize} rounded-2xl bg-gradient-to-br ${
            member.avatarHue || 'from-cyan-600 to-blue-900'
          } p-[2px] shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 relative overflow-hidden`}
          title={`Нажмите, чтобы загрузить фото участника №${index + 1}`}
        >
          {member.photo ? (
            <div className="w-full h-full bg-slate-950 rounded-[14px] overflow-hidden relative">
              <img
                src={member.photo}
                alt={member.name}
                className="w-full h-full object-cover rounded-[14px]"
              />
              {/* Photo remove button on hover */}
              <button
                onClick={(e) => removePhoto(index, e)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-rose-600 text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                title="Удалить фото"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ) : (
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-25 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full border border-cyan-400 animate-ping opacity-30" />
              </div>
              <span className="font-display font-black text-cyan-300 tracking-wider">
                {initials}
              </span>
              {/* Upload photo hint overlay */}
              <div className="absolute inset-0 bg-cyan-950/80 backdrop-blur-xs flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                <Camera className="w-4 h-4 text-cyan-300 mb-0.5" />
                <span className="text-[8px] font-mono text-cyan-200">Фото №{index + 1}</span>
              </div>
            </div>
          )}
        </div>

        {/* Number Badge (1..7) */}
        <span
          className="absolute -bottom-1 -left-1 px-1.5 py-0.2 rounded-md bg-cyan-400 text-slate-950 text-[9px] font-mono font-black border border-slate-950 shadow-xs"
          title={`Номер в списке: ${index + 1}`}
        >
          №{index + 1}
        </span>

        {/* Online / Active Pulse indicator */}
        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
      </div>
    );
  };

  // 1. Separate Leader (1st member: Kuznetsov Daniil)
  const leadMember = members[0];
  const otherMembers = members.slice(1);

  return (
    <div
      className={`w-full h-full flex flex-col justify-between p-6 md:p-10 select-none relative overflow-hidden transition-colors ${
        isLight
          ? 'bg-white/80 backdrop-blur-sm text-slate-900'
          : 'bg-[#091524]/70 backdrop-blur-[2px] text-slate-100'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between z-10 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 flex items-center gap-1.5">
              <span>03 · Состав команды «Эхо» ({members.length} участников)</span>
            </span>
            <span className="w-8 h-[1px] bg-cyan-500/50" />
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl lg:text-4xl tracking-tight text-white">
            <EditableText
              value={slide.title}
              onSave={(v) => onUpdate({ ...slide, title: v })}
            />
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5 max-w-2xl">
            <EditableText
              value={
                slide.subtitle ||
                'Междисциплинарная группа разработки Telegram-платформы: синергия ролей по Белбину'
              }
              onSave={(v) => onUpdate({ ...slide, subtitle: v })}
            />
          </p>
        </div>

        {/* Right side controls: Belbin Matrix, Layout switcher & Add member */}
        <div className="flex items-center gap-2">
          {/* Belbin Matrix button */}
          <button
            onClick={() => setShowBelbinModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-300 text-xs font-medium transition-all shadow-sm"
            title="Посмотреть распределение ролей Белбина в команде"
          >
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Матрица Белбина</span>
          </button>

          {/* Layout mode switcher */}
          <div className="hidden sm:flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5 text-[11px] font-mono">
            <button
              onClick={() => setLayoutMode('lead-and-six')}
              className={`px-2 py-1 rounded transition-colors ${
                layoutMode === 'lead-and-six'
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Режим 1+6: Капитан в фокусе + 6 участников в симметричной сетке (Идеально для 7 человек)"
            >
              Лидер + 6
            </button>
            <button
              onClick={() => setLayoutMode('staggered-3-4')}
              className={`px-2 py-1 rounded transition-colors ${
                layoutMode === 'staggered-3-4'
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Режим 3+4: Симметричные ряды (3 сверху + 4 снизу)"
            >
              Ряды 3+4
            </button>
          </div>

          {members.length < 9 && (
            <button
              onClick={addMember}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium border border-cyan-500/40 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Добавить</span>
            </button>
          )}

          <EchoLogo size={38} withRipples />
        </div>
      </div>

      {/* BODY LAYOUTS */}

      {/* OPTION 1: "LEAD AND SIX" (1 + 6) — Premium layout for 7 participants */}
      {layoutMode === 'lead-and-six' && leadMember && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 my-auto z-10 items-stretch">
          {/* Left Column: Featured Team Leader Card (4 cols) */}
          <div className="md:col-span-4 rounded-2xl p-4.5 bg-gradient-to-b from-[#0F4C81] via-[#0B3A63] to-[#071F36] border-2 border-cyan-400/80 shadow-2xl relative flex flex-col justify-between group overflow-hidden">
            {/* Background ripple lines */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="50"
                  fill="none"
                  stroke="#48CAE4"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#48CAE4" strokeWidth="1.5" />
              </svg>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Crown className="w-3 h-3 fill-current" />
                  <span>Капитан команды</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-300/80">Фото №1</span>
              </div>

              {/* Large Avatar with photo upload */}
              <div className="flex items-center gap-3.5 mb-3">
                {renderAvatar(leadMember, 0, 'large')}
                <div className="min-w-0">
                  <div className="font-display font-black text-lg md:text-xl text-white tracking-tight leading-tight">
                    <EditableText
                      value={leadMember.name}
                      onSave={(v) => updateMember(0, 'name', v)}
                    />
                  </div>
                  <div className="text-xs font-bold text-cyan-300 mt-0.5">
                    <EditableText
                      value={leadMember.role}
                      onSave={(v) => updateMember(0, 'role', v)}
                    />
                  </div>
                  {/* Faculty & Belbin Role Badges */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-700 text-[10px] font-mono font-bold text-cyan-300 flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      <EditableText
                        value={leadMember.faculty || 'ФБИ-63'}
                        onSave={(v) => updateMember(0, 'faculty', v)}
                      />
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-950/90 border border-indigo-700 text-[10px] font-mono text-indigo-300 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <EditableText
                        value={leadMember.belbinRole || 'Вдохновитель (ВД: 16) · Руководитель (РК: 13)'}
                        onSave={(v) => updateMember(0, 'belbinRole', v)}
                      />
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-black/35 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-xs text-slate-200 leading-relaxed">
                <EditableText
                  value={
                    leadMember.bio ||
                    'Лидерство команды «Эхо», координация спринтов, связь со студенческим советом и защита проекта.'
                  }
                  onSave={(v) => updateMember(0, 'bio', v)}
                  multiline
                />
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-cyan-400/30 flex items-center justify-between text-[11px] font-mono text-cyan-200">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                Лидерство и стратегия
              </span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            </div>
          </div>

          {/* Right Column: 6 Specialists in a Clean 3x2 Grid (8 cols) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {otherMembers.map((member: any, idx: number) => {
              const realIdx = idx + 1;
              return (
                <div
                  key={member.id || realIdx}
                  className="group relative rounded-xl p-3 bg-slate-900/85 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-2.5">
                      {renderAvatar(member, realIdx, 'normal')}
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-bold text-xs sm:text-sm text-white tracking-tight leading-tight truncate">
                          <EditableText
                            value={member.name}
                            onSave={(v) => updateMember(realIdx, 'name', v)}
                          />
                        </div>
                        <div className="text-[11px] font-semibold text-cyan-400 tracking-wide mt-0.5 truncate">
                          <EditableText
                            value={member.role}
                            onSave={(v) => updateMember(realIdx, 'role', v)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Faculty and Belbin badges */}
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-[9px] font-mono font-bold text-cyan-300">
                        <EditableText
                          value={member.faculty || 'ВУЗ'}
                          onSave={(v) => updateMember(realIdx, 'faculty', v)}
                        />
                      </span>
                      <span
                        className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700/80 text-[9px] font-mono text-indigo-300 truncate max-w-[150px]"
                        title={member.belbinRole}
                      >
                        <EditableText
                          value={member.belbinRole || 'Роль Белбина'}
                          onSave={(v) => updateMember(realIdx, 'belbinRole', v)}
                        />
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug mt-2 line-clamp-2">
                    <EditableText
                      value={member.bio || 'Зона ответственности'}
                      onSave={(v) => updateMember(realIdx, 'bio', v)}
                    />
                  </p>

                  {members.length > 2 && (
                    <button
                      onClick={() => removeMember(realIdx)}
                      className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400 rounded transition-all"
                      title="Удалить участника"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* OPTION 2: "STAGGERED 3 + 4" (Row of 3 on top + Row of 4 on bottom, centered) */}
      {layoutMode === 'staggered-3-4' && (
        <div className="my-auto z-10 flex flex-col gap-3">
          {/* Top Row: 3 Members (Centered) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto w-full">
            {members.slice(0, 3).map((member: any, idx: number) => (
              <div
                key={member.id || idx}
                className="group relative rounded-xl p-3 bg-slate-900/85 border border-slate-800 hover:border-cyan-500/50 transition-all flex items-start gap-2.5 shadow-lg"
              >
                {renderAvatar(member, idx, 'normal')}
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-xs sm:text-sm text-white truncate">
                    <EditableText
                      value={member.name}
                      onSave={(v) => updateMember(idx, 'name', v)}
                    />
                  </div>
                  <div className="text-[11px] font-semibold text-cyan-400 truncate">
                    <EditableText
                      value={member.role}
                      onSave={(v) => updateMember(idx, 'role', v)}
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-800 text-[9px] font-mono text-cyan-300">
                      {member.faculty}
                    </span>
                    <span className="text-[9px] font-mono text-indigo-300 truncate max-w-[120px]">
                      {member.belbinRole}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight mt-1 line-clamp-1">
                    <EditableText
                      value={member.bio || 'Компетенции'}
                      onSave={(v) => updateMember(idx, 'bio', v)}
                    />
                  </p>
                </div>
                {members.length > 2 && (
                  <button
                    onClick={() => removeMember(idx)}
                    className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Row: 4 Members (Centered) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-5xl mx-auto w-full">
            {members.slice(3, 7).map((member: any, idx: number) => {
              const realIdx = idx + 3;
              return (
                <div
                  key={member.id || realIdx}
                  className="group relative rounded-xl p-3 bg-slate-900/85 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {renderAvatar(member, realIdx, 'normal')}
                    <div className="min-w-0">
                      <div className="font-display font-bold text-xs text-white truncate">
                        <EditableText
                          value={member.name}
                          onSave={(v) => updateMember(realIdx, 'name', v)}
                        />
                      </div>
                      <div className="text-[10px] font-semibold text-cyan-400 truncate">
                        <EditableText
                          value={member.role}
                          onSave={(v) => updateMember(realIdx, 'role', v)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 my-1">
                    <span className="px-1 py-0.2 rounded bg-cyan-950/80 border border-cyan-800 text-[8px] font-mono text-cyan-300">
                      {member.faculty}
                    </span>
                    <span className="text-[8px] font-mono text-indigo-300 truncate">
                      {member.belbinRole}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                    <EditableText
                      value={member.bio || 'Компетенции'}
                      onSave={(v) => updateMember(realIdx, 'bio', v)}
                    />
                  </p>
                  {members.length > 2 && (
                    <button
                      onClick={() => removeMember(realIdx)}
                      className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Info Ribbon */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2.5 border-t border-slate-800/80 z-10">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-mono text-[11px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>7 участников команды «Эхо» · Тесты Белбина & Факультеты</span>
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Кликните на аватар участника, чтобы загрузить фото
          </span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
            ФБИ-63 · РЭФ · ФПМИ · ФГО · АВТФ · ФМА
          </span>
        </div>
      </div>

      {/* BELBIN MATRIX MODAL */}
      {showBelbinModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowBelbinModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <h3 className="font-display font-black text-xl text-white">
                Матрица командных ролей по Белбину (Belbin Team Roles)
              </h3>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Методология Мередита Белбина определяет баланс поведенческих ролей для успешной реализации IT и акселерационных проектов. В команде «Эхо» представлены все ключевые кластеры:
            </p>

            <div className="space-y-3 mb-5">
              {/* Leader */}
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/80 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950 font-mono text-[10px]">
                      №1
                    </span>
                    <span>Даниил Кузнецов (ФБИ-63) — Капитан команды</span>
                  </div>
                  <div className="text-[11px] text-cyan-300 mt-1">
                    Роли Белбина: <span className="font-semibold">Вдохновитель (ВД: 16) · Руководитель (РК: 13)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Лидерство, фасилитация обсуждений, дипломатическая связь с администрацией вуза.
                  </p>
                </div>
              </div>

              {/* Vorfolomeev */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">
                      №2
                    </span>
                    <span>Артём Ворфоломеев (РЭФ)</span>
                  </div>
                  <div className="text-[11px] text-cyan-400 mt-1">
                    Роли Белбина: <span className="font-semibold">Руководитель (РК: 18) · Снабженец (СН: 13)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Поиск ресурсов, выстраивание связей между факультетами, организационная поддержка.
                  </p>
                </div>
              </div>

              {/* Kholodkov */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">
                      №3
                    </span>
                    <span>Илья Холодков (ФПМИ)</span>
                  </div>
                  <div className="text-[11px] text-cyan-400 mt-1">
                    Роли Белбина: <span className="font-semibold">Рабочая пчёлка (РП: 10) · Руководитель (РК: 10)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Исполнитель бэкенда: написание Telegram-бота на Python/Aiogram и проектирование архитектуры БД.
                  </p>
                </div>
              </div>

              {/* Kargapolov */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">
                      №4
                    </span>
                    <span>Александр Каргаполов (ФГО)</span>
                  </div>
                  <div className="text-[11px] text-cyan-400 mt-1">
                    Роли Белбина: <span className="font-semibold">Руководитель / Председатель (РК: 30) · Аналитик (АН: 11)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Стратегический координатор: контроль соблюдения регламентов, дедлайнов и структуры проекта.
                  </p>
                </div>
              </div>

              {/* Sherstobitov */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">
                      №5
                    </span>
                    <span>Андрей Шерстобитов (АВТФ)</span>
                  </div>
                  <div className="text-[11px] text-cyan-400 mt-1">
                    Роли Белбина: <span className="font-semibold">Мыслитель / Генератор идей (14) · Председатель (13)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Генерация архитектурных концепций, проектирование эргономики UI/UX Telegram WebApp.
                  </p>
                </div>
              </div>

              {/* Zhavoronko */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">
                      №6
                    </span>
                    <span>Артем Жаворонко (ФМА)</span>
                  </div>
                  <div className="text-[11px] text-cyan-400 mt-1">
                    Роли Белбина: <span className="font-semibold">Аналитик / Эксперт (АН: 19) · Вдохновитель (ВД: 11)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Критическая оценка гипотез, алгоритмы NLP-кластеризации идей студентов, подготовка метрик.
                  </p>
                </div>
              </div>

              {/* Naumenko */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">
                      №7
                    </span>
                    <span>Михаил Науменко (АВТФ)</span>
                  </div>
                  <div className="text-[11px] text-cyan-400 mt-1">
                    Роли Белбина: <span className="font-semibold">Рабочая пчёлка / Доводчик (РП: 12) · Снабженец (СН: 10)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Доведение задач до финала, QA-тестирование бота под нагрузкой, сопровождение пилота в корпусах.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-700/60 text-xs text-indigo-200 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <span className="font-bold text-white">Вывод для комиссии акселератора:</span>{' '}
                Команда обладает 100% ролевым балансом. Присутствуют генераторы идей, жесткие координаторы дедлайнов, исполнители разработки и контролёры качества.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
