import React from 'react';
import { SlideData } from '../../types/presentation';
import { EditableText } from '../EditableText';
import { EchoLogo } from '../EchoLogo';
import { Crown, Plus, Trash2, LayoutGrid, Users, Sparkles } from 'lucide-react';

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

  const updateMember = (index: number, field: string, value: string) => {
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

  const addMember = () => {
    if (members.length >= 10) return;
    const newMember = {
      id: `m_${Date.now()}`,
      name: 'Новый участник',
      role: 'Специалист проекта',
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

  const renderAvatar = (member: any, size: 'normal' | 'large' = 'normal') => {
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
      <div className="relative shrink-0">
        <div
          className={`${boxSize} rounded-2xl bg-gradient-to-br ${
            member.avatarHue || 'from-cyan-600 to-blue-900'
          } p-[2px] shadow-lg flex items-center justify-center`}
        >
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-25 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full border border-cyan-400 animate-ping opacity-30" />
            </div>
            <span className="font-display font-black text-cyan-300 tracking-wider">
              {initials}
            </span>
          </div>
        </div>
        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-slate-950" />
      </div>
    );
  };

  // 1. Separate Leader (1st member) from the rest for 'lead-and-six' mode
  const leadMember = members[0];
  const otherMembers = members.slice(1);

  return (
    <div
      className={`w-full h-full flex flex-col justify-between p-7 md:p-11 select-none relative overflow-hidden transition-colors ${
        isLight ? 'bg-white/80 backdrop-blur-sm text-slate-900' : 'bg-[#091524]/70 backdrop-blur-[2px] text-slate-100'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between z-10 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              03 · Состав команды ({members.length} человек)
            </span>
            <span className="w-8 h-[1px] bg-cyan-500/50" />
          </div>
          <h2 className="font-display font-black text-2xl md:text-4xl lg:text-5xl tracking-tight text-white">
            <EditableText
              value={slide.title}
              onSave={(v) => onUpdate({ ...slide, title: v })}
            />
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5 max-w-xl">
            <EditableText
              value={slide.subtitle || 'Команда «Эхо» — синергия инженерного подхода и дизайна'}
              onSave={(v) => onUpdate({ ...slide, subtitle: v })}
            />
          </p>
        </div>

        {/* Right side controls: Layout switcher & Add member */}
        <div className="flex items-center gap-2">
          {/* Layout mode switcher */}
          <div className="hidden sm:flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5 text-[11px] font-mono">
            <button
              onClick={() => setLayoutMode('lead-and-six')}
              className={`px-2 py-1 rounded transition-colors ${
                layoutMode === 'lead-and-six'
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Режим 1+6: Руководитель в фокусе + 6 участников в сетке (Идеально для 7 человек)"
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

          <EchoLogo size={42} withRipples />
        </div>
      </div>

      {/* BODY LAYOUTS */}

      {/* OPTION 1: "LEAD AND SIX" (1 + 6) — The absolute gold standard for 7 participants */}
      {layoutMode === 'lead-and-six' && leadMember && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-auto z-10 items-stretch">
          {/* Left Column: Featured Team Leader Card (4 cols) */}
          <div className="md:col-span-4 rounded-2xl p-5 bg-gradient-to-b from-[#0F4C81] via-[#0B3A63] to-[#071F36] border-2 border-cyan-400/80 shadow-2xl relative flex flex-col justify-between group overflow-hidden">
            {/* Background ripple lines */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="50" fill="none" stroke="#48CAE4" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#48CAE4" strokeWidth="1.5" />
              </svg>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Crown className="w-3 h-3 fill-current" />
                  <span>Капитан команды</span>
                </span>
                <EchoLogo size={26} />
              </div>

              {/* Large Avatar */}
              <div className="flex items-center gap-4 mb-4">
                {renderAvatar(leadMember, 'large')}
                <div className="min-w-0">
                  <div className="font-display font-black text-lg md:text-xl text-white tracking-tight leading-tight">
                    <EditableText
                      value={leadMember.name}
                      onSave={(v) => updateMember(0, 'name', v)}
                    />
                  </div>
                  <div className="text-xs font-bold text-cyan-300 mt-1">
                    <EditableText
                      value={leadMember.role}
                      onSave={(v) => updateMember(0, 'role', v)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-xs text-slate-200 leading-relaxed">
                <EditableText
                  value={leadMember.bio || 'Координация команды, соблюдение дедлайнов и защита перед комиссией'}
                  onSave={(v) => updateMember(0, 'bio', v)}
                  multiline
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-cyan-400/30 flex items-center justify-between text-[11px] font-mono text-cyan-200">
              <span>● Лидерство и стратегия</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            </div>
          </div>

          {/* Right Column: 6 Specialists in a Clean 3x2 Grid (8 cols) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-3.5">
            {otherMembers.map((member: any, idx: number) => {
              const realIdx = idx + 1;
              return (
                <div
                  key={member.id || realIdx}
                  className="group relative rounded-xl p-3.5 bg-slate-900/85 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/40 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    {renderAvatar(member, 'normal')}
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-xs sm:text-sm text-white tracking-tight truncate">
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
        <div className="my-auto z-10 flex flex-col gap-3 md:gap-4">
          {/* Top Row: 3 Members (Centered) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto w-full">
            {members.slice(0, 3).map((member: any, idx: number) => (
              <div
                key={member.id || idx}
                className="group relative rounded-xl p-3.5 bg-slate-900/85 border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center gap-3 shadow-lg"
              >
                {renderAvatar(member, 'normal')}
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
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto w-full">
            {members.slice(3, 7).map((member: any, idx: number) => {
              const realIdx = idx + 3;
              return (
                <div
                  key={member.id || realIdx}
                  className="group relative rounded-xl p-3 bg-slate-900/85 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-lg"
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    {renderAvatar(member, 'normal')}
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

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80 z-10">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-mono text-[11px]">
            ● {members.length} участников команды «Эхо»
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Баланс инженерных, дизайнерских и управленческих ролей
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          КОМАНДА «ЭХО» · ВУЗ 2026
        </div>
      </div>
    </div>
  );
};
