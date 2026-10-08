import React, { useState } from 'react';
import {
  FIVE_SLIDES_SPEECH,
  ALL_SEVEN_MEMBERS_SPEECH,
  SlideSpeechConfig,
  MemberProfileSpeech,
  SpeakerSpeech,
} from '../data/speechScript';
import {
  Mic,
  Users,
  Layers,
  Copy,
  Check,
  Printer,
  Clock,
  Sparkles,
  ChevronRight,
  User,
  GraduationCap,
  Award,
  X,
  Volume2,
  ZoomIn,
  ZoomOut,
  FileText,
} from 'lucide-react';

interface SpeechScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSlideIndex?: number;
  onSelectSlide?: (index: number) => void;
}

export const SpeechScriptModal: React.FC<SpeechScriptModalProps> = ({
  isOpen,
  onClose,
  activeSlideIndex = 0,
  onSelectSlide,
}) => {
  const [activeTab, setActiveTab] = useState<'by-slides' | 'by-members'>('by-slides');
  const [selectedSlideIdx, setSelectedSlideIdx] = useState<number>(
    activeSlideIndex >= 0 && activeSlideIndex < 5 ? activeSlideIndex : 0
  );
  const [selectedMemberId, setSelectedMemberId] = useState<string>('m1');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');

  if (!isOpen) return null;

  const currentSlideConfig =
    FIVE_SLIDES_SPEECH.find((s) => s.slideIndex === selectedSlideIdx) || FIVE_SLIDES_SPEECH[0];

  const currentMemberConfig =
    ALL_SEVEN_MEMBERS_SPEECH.find((m) => m.id === selectedMemberId) ||
    ALL_SEVEN_MEMBERS_SPEECH[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    let fullText = `РЕЧЬ КОМАНДЫ «ЭХО» НА ЗАЩИТЕ ПРОЕКТА «ЭХОКАМПУС» (5 СЛАЙДОВ)\n======================================================\n\n`;

    FIVE_SLIDES_SPEECH.forEach((slide) => {
      fullText += `${slide.slideTitle.toUpperCase()} (~${slide.estimatedTime})\n`;
      fullText += `Контекст: ${slide.themeContext}\n\n`;

      slide.speakers.forEach((speaker) => {
        fullText += `[${speaker.speakerNum}. ${speaker.name} (${speaker.faculty} — ${speaker.role})]\n`;
        fullText += `Роль Белбина: ${speaker.belbinRole} | Тайминг: ~${speaker.durationSec} сек\n`;
        fullText += `Ремарка: ${speaker.cueNote}\n`;
        fullText += `${speaker.speechText}\n\n`;
      });
      fullText += `------------------------------------------------------\n\n`;
    });

    navigator.clipboard.writeText(fullText);
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const getTextClass = () => {
    switch (fontSize) {
      case 'normal':
        return 'text-sm leading-relaxed';
      case 'xlarge':
        return 'text-lg md:text-xl leading-loose font-medium';
      case 'large':
      default:
        return 'text-base md:text-lg leading-relaxed';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-5xl w-full h-[92vh] max-h-[900px] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-600/70 flex items-center justify-center text-cyan-400 shadow-md">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-base md:text-lg text-white tracking-tight">
                  Сценарий защиты: Речь команды «Эхо»
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  5 слайдов · 7 спикеров
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Пошаговые реплики всех участников: факультеты, роли по Белбину и тайминги
              </p>
            </div>
          </div>

          {/* Action buttons & Close */}
          <div className="flex items-center gap-2">
            {/* Font size zoom */}
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs text-slate-300">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded transition-colors ${
                  fontSize === 'normal' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'hover:text-white'
                }`}
                title="Обычный шрифт"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded transition-colors ${
                  fontSize === 'large' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'hover:text-white'
                }`}
                title="Крупный шрифт (для чтения)"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 rounded transition-colors ${
                  fontSize === 'xlarge' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'hover:text-white'
                }`}
                title="Очень крупный (режим суфлера)"
              >
                A++
              </button>
            </div>

            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              title="Скопировать весь сценарий всех слайдов"
            >
              {copiedId === 'all' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Скопировано!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden md:inline">Копировать весь сценарий</span>
                  <span className="md:hidden">Копировать всё</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
              title="Распечатать шпаргалку к защите"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Печать</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector: By Slides vs By Members */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('by-slides')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'by-slides'
                  ? 'bg-gradient-to-r from-cyan-900/80 to-blue-900/80 text-cyan-200 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>По 5 слайдам (Хронология защиты)</span>
            </button>

            <button
              onClick={() => setActiveTab('by-members')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'by-members'
                  ? 'bg-gradient-to-r from-cyan-900/80 to-blue-900/80 text-cyan-200 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>По 7 участникам (Личные шпаргалки)</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Общий хронометраж выступления: ~6 мин</span>
          </div>
        </div>

        {/* Sub-selector Toolbar based on Tab */}
        {activeTab === 'by-slides' ? (
          <div className="px-5 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
            {FIVE_SLIDES_SPEECH.map((slide, idx) => (
              <button
                key={slide.slideId}
                onClick={() => setSelectedSlideIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-all ${
                  selectedSlideIdx === idx
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span className="font-mono text-[10px] opacity-80">0{idx + 1}</span>
                <span>{slide.shortTitle}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedSlideIdx === idx ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {slide.speakers.length} спикера
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-5 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            {ALL_SEVEN_MEMBERS_SPEECH.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedMemberId(member.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  selectedMemberId === member.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span className="font-mono text-[10px] opacity-80">№{member.num}</span>
                <span>{member.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75">({member.faculty})</span>
              </button>
            ))}
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/70">
          {activeTab === 'by-slides' ? (
            /* BY SLIDES VIEW */
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Slide Meta Banner */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[11px] font-bold border border-cyan-800">
                      Слайд {currentSlideConfig.slideIndex + 1} из 5
                    </span>
                    <h4 className="font-display font-bold text-base md:text-lg text-white">
                      {currentSlideConfig.slideTitle}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    {currentSlideConfig.themeContext}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{currentSlideConfig.estimatedTime}</span>
                  </div>

                  {onSelectSlide && (
                    <button
                      onClick={() => {
                        onSelectSlide(currentSlideConfig.slideIndex);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-medium border border-cyan-700/60 transition-colors flex items-center gap-1"
                      title="Перейти к этому слайду на холсте"
                    >
                      <span>К слайду</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Speaker Speech Cards */}
              <div className="space-y-4">
                {currentSlideConfig.speakers.map((speaker, sIdx) => {
                  const cardId = `slide_${currentSlideConfig.slideIndex}_speaker_${speaker.memberId}`;
                  const isCopied = copiedId === cardId;

                  return (
                    <div
                      key={speaker.memberId}
                      className="rounded-2xl p-5 bg-slate-900/95 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl relative overflow-hidden group"
                    >
                      {/* Top Accent Strip */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400"
                        style={{
                          opacity: 0.85,
                        }}
                      />

                      {/* Speaker Profile Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5 pb-3 border-b border-slate-800/80">
                        <div className="flex items-center gap-3">
                          {/* Avatar with number */}
                          <div
                            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${speaker.avatarHue} p-[2px] shadow-md flex items-center justify-center shrink-0 relative`}
                          >
                            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-display font-black text-cyan-300 text-sm">
                              {speaker.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </div>
                            <span className="absolute -bottom-1 -right-1 px-1 rounded bg-cyan-400 text-slate-950 text-[9px] font-mono font-black">
                              №{speaker.speakerNum}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-base text-white">
                                {speaker.name}
                              </span>
                              <span className="px-2 py-0.2 rounded-md bg-cyan-950 text-cyan-300 text-xs font-mono font-bold border border-cyan-800">
                                {speaker.faculty}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{speaker.role}</span>
                              <span className="text-slate-600">·</span>
                              <span className="text-cyan-400/90 font-mono text-[11px]">
                                {speaker.belbinRole}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Speaker timing & Copy button */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                            ⏱ ~{speaker.durationSec} сек
                          </span>
                          <button
                            onClick={() => handleCopy(speaker.speechText, cardId)}
                            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
                            title="Скопировать эту реплику"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Скопировано</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Копировать</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Cue / Director's note */}
                      <div className="mb-3 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-900/50 flex items-center gap-2 text-xs text-cyan-300">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>
                          <strong className="font-semibold text-cyan-200">Когда говорить:</strong>{' '}
                          {speaker.cueNote}
                        </span>
                      </div>

                      {/* Main Speech Text */}
                      <div
                        className={`p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 text-slate-100 ${getTextClass()}`}
                      >
                        {speaker.speechText}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* BY MEMBERS VIEW */
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Member Profile Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentMemberConfig.avatarHue} p-[2px] shadow-lg flex items-center justify-center shrink-0 relative`}
                  >
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-display font-black text-cyan-300 text-lg">
                      {currentMemberConfig.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <span className="absolute -bottom-1 -right-1 px-1.5 rounded bg-cyan-400 text-slate-950 text-[10px] font-mono font-black">
                      №{currentMemberConfig.num}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-black text-lg md:text-xl text-white">
                        {currentMemberConfig.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 font-mono text-xs font-bold border border-cyan-800">
                        {currentMemberConfig.faculty}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-medium mt-0.5">
                      {currentMemberConfig.role}
                    </div>
                    <div className="text-xs text-cyan-400/90 font-mono mt-0.5 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{currentMemberConfig.belbinRole}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1 shrink-0">
                  <span className="text-xs text-slate-400">Общее время речи:</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono font-bold text-sm text-cyan-300">
                    ⏱ ~{currentMemberConfig.totalDurationSec} сек ({currentMemberConfig.slides.length}{' '}
                    {currentMemberConfig.slides.length === 1
                      ? 'слайд'
                      : currentMemberConfig.slides.length < 5
                      ? 'слайда'
                      : 'слайдов'}
                    )
                  </span>
                </div>
              </div>

              {/* Delivery Advice */}
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200/90 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300">Совет по подаче и интонации:</strong>{' '}
                  {currentMemberConfig.deliveryAdvice}
                </div>
              </div>

              {/* Cues and Speeches for this Member across slides */}
              <div className="space-y-4">
                <h5 className="font-display font-bold text-sm text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Реплики участника на защите ({currentMemberConfig.slides.length}):</span>
                </h5>

                {currentMemberConfig.slides.map((s, idx) => {
                  const cardId = `member_${currentMemberConfig.id}_slide_${s.slideNum}`;
                  const isCopied = copiedId === cardId;

                  return (
                    <div
                      key={s.slideNum}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-md relative"
                    >
                      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-xs font-mono font-bold border border-cyan-800">
                            Слайд {s.slideNum}
                          </span>
                          <span className="font-display font-bold text-sm text-white">
                            {s.slideTitle}
                          </span>
                        </div>

                        <button
                          onClick={() => handleCopy(s.text, cardId)}
                          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
                          title="Скопировать эту реплику"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Скопировано</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Копировать</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="mb-2 text-xs text-slate-400">
                        <span className="text-cyan-400 font-medium">Контекст вступления:</span>{' '}
                        {s.cueNote}
                      </div>

                      <div
                        className={`p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 ${getTextClass()}`}
                      >
                        {s.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Footer Ribbon */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="text-slate-300">
              Все 7 участников команды «Эхо» обеспечены словом на первых 5 слайдах защиты
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-cyan-400">
            <span>ФБИ-63 · РЭФ · ФПМИ · ФГО · АВТФ · ФМА</span>
          </div>
        </div>
      </div>
    </div>
  );
};
