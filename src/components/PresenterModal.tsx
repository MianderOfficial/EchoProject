import React, { useState, useEffect, useRef } from 'react';
import { SlideData } from '../types/presentation';
import { SlideRenderer } from './SlideRenderer';
import { soundEffects } from './SoundEffects';
import { FIVE_SLIDES_SPEECH } from '../data/speechScript';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Zap,
  FileText,
  Clock,
  Sparkles,
  Mic,
  Copy,
  Check,
} from 'lucide-react';

interface PresenterModalProps {
  slides: SlideData[];
  currentIndex: number;
  onSelectSlide: (idx: number) => void;
  onClose: () => void;
  onUpdateSlide: (updated: SlideData) => void;
  isSpeakerMode?: boolean;
  theme?: string;
}

export const PresenterModal: React.FC<PresenterModalProps> = ({
  slides,
  currentIndex,
  onSelectSlide,
  onClose,
  onUpdateSlide,
  isSpeakerMode = false,
  theme = 'dark-sonic',
}) => {
  // Presenter stopwatch state
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [laserActive, setLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: -100, y: -100 });
  const [isBlackout, setIsBlackout] = useState(false);
  const [panelTab, setPanelTab] = useState<'speech' | 'notes'>('speech');
  const [copiedSpeakerId, setCopiedSpeakerId] = useState<string | null>(null);
  const [showFloatingSpeech, setShowFloatingSpeech] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Stopwatch effect
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Format time mm:ss
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const triggerPulse = () => {
    window.dispatchEvent(
      new CustomEvent('echo-pulse', {
        detail: {
          x: window.innerWidth * 0.5,
          y: window.innerHeight * 0.45,
        },
      })
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentIndex < slides.length - 1) {
          const next = currentIndex + 1;
          onSelectSlide(next);
          soundEffects.playSlideChime(next);
          triggerPulse();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentIndex > 0) {
          const prev = currentIndex - 1;
          onSelectSlide(prev);
          soundEffects.playSlideChime(prev);
          triggerPulse();
        }
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key.toLowerCase() === 'l') {
        setLaserActive((prev) => !prev);
      } else if (e.key.toLowerCase() === 'b') {
        setIsBlackout((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, slides.length, onClose, onSelectSlide]);

  // Laser pointer mouse tracker
  const handleMouseMove = (e: React.MouseEvent) => {
    if (laserActive) {
      setLaserPos({ x: e.clientX, y: e.clientY });
    }
  };

  const currentSlide = slides[currentIndex];
  const nextSlide = currentIndex < slides.length - 1 ? slides[currentIndex + 1] : null;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const next = currentIndex + 1;
      onSelectSlide(next);
      soundEffects.playSlideChime(next);
      triggerPulse();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prev = currentIndex - 1;
      onSelectSlide(prev);
      soundEffects.playSlideChime(prev);
      triggerPulse();
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden select-none"
    >
      {/* Laser Pointer Dot */}
      {laserActive && (
        <div
          className="pointer-events-none fixed z-[999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{ left: laserPos.x, top: laserPos.y }}
        >
          <div className="w-5 h-5 rounded-full bg-cyan-400 blur-[2px] opacity-90 animate-pulse" />
          <div className="w-2.5 h-2.5 rounded-full bg-white absolute inset-0 m-auto shadow-lg shadow-cyan-400" />
        </div>
      )}

      {/* Top Floating Control Bar */}
      <div className="h-12 bg-slate-950/90 border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-300 z-50">
        <div className="flex items-center gap-4">
          <span className="font-display font-bold text-white tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            ЭХО · ПОКАЗ
          </span>

          <span className="text-slate-600">|</span>

          {/* Stopwatch */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 font-mono text-cyan-300">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-bold">{formatTime(seconds)}</span>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="text-slate-400 hover:text-white ml-1"
              title={isRunning ? 'Пауза' : 'Старт'}
            >
              {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <button
              onClick={() => setSeconds(0)}
              className="text-slate-400 hover:text-white"
              title="Сброс таймера"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Laser Pointer Button */}
          <button
            onClick={() => setLaserActive(!laserActive)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
              laserActive
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Лазерная указка (клавиша L)"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Указка (L)</span>
          </button>
        </div>

        {/* Center: Slide indicator */}
        <div className="font-mono text-xs text-slate-300">
          Слайд <span className="text-cyan-400 font-bold">{currentIndex + 1}</span> из{' '}
          <span>{slides.length}</span>
        </div>

        {/* Right: Close presentation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Выйти (Esc)</span>
          </button>
        </div>
      </div>

      {/* Main Slide Area */}
      {isBlackout ? (
        <div className="flex-1 flex items-center justify-center bg-black text-slate-600 font-mono text-sm">
          [Затемнение экрана · Нажмите B для возврата]
        </div>
      ) : isSpeakerMode ? (
        /* Presenter Dual View: Current Slide + Notes + Next Slide */
        <div className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden bg-slate-950">
          {/* Main Slide (Large, 8 cols) */}
          <div className="col-span-12 lg:col-span-8 flex items-center justify-center bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <div className="w-full h-full aspect-video max-h-[85vh]">
              <SlideRenderer
                slide={currentSlide}
                onUpdateSlide={onUpdateSlide}
                theme={theme}
                showWaveBackground={true}
              />
            </div>
          </div>

          {/* Right Column: Next Slide & Speaker Notes (4 cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
            {/* Next Slide Preview */}
            <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2">
                <span>СЛЕДУЮЩИЙ СЛАЙД ({currentIndex + 2}/{slides.length})</span>
                <span className="text-cyan-400 truncate max-w-[120px]">
                  {nextSlide ? nextSlide.title : 'Конец показа'}
                </span>
              </div>
              <div className="w-full aspect-video rounded-lg overflow-hidden border border-slate-800 bg-black relative">
                {nextSlide ? (
                  <div className="scale-75 origin-top-left w-[133.3%] h-[133.3%] pointer-events-none">
                    <SlideRenderer
                      slide={nextSlide}
                      onUpdateSlide={() => {}}
                      theme={theme}
                      showWaveBackground={false}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                    Завершение презентации
                  </div>
                )}
              </div>
            </div>

            {/* Speaker Notes & Speech Panel */}
            <div className="flex-1 bg-slate-900/90 rounded-xl p-3 md:p-4 border border-slate-800 flex flex-col overflow-hidden">
              {/* Tab Selector: Speech vs Notes */}
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setPanelTab('speech')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      panelTab === 'speech'
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Речь спикеров</span>
                  </button>
                  <button
                    onClick={() => setPanelTab('notes')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      panelTab === 'notes'
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Заметки</span>
                  </button>
                </div>

                {panelTab === 'speech' && (
                  <span className="text-[10px] font-mono text-cyan-400">
                    Слайд {currentIndex + 1} из {slides.length}
                  </span>
                )}
              </div>

              {panelTab === 'speech' ? (
                /* Speech script for current slide */
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {(() => {
                    const speechConfig = FIVE_SLIDES_SPEECH.find(
                      (s) => s.slideIndex === currentIndex || s.slideId === currentSlide.id
                    );

                    if (!speechConfig || speechConfig.speakers.length === 0) {
                      return (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500 text-xs">
                          <Mic className="w-8 h-8 text-slate-700 mb-2" />
                          <span>На этом слайде нет закрепленной речи в регламенте 5 слайдов.</span>
                          <span className="text-slate-600 text-[11px] mt-1">
                            Основная речь распределена по первым 5 слайдам защиты.
                          </span>
                        </div>
                      );
                    }

                    return (
                      <>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                          <span className="text-cyan-300 font-bold">{speechConfig.shortTitle}</span>
                          <span>⏱ ~{speechConfig.estimatedTime}</span>
                        </div>

                        {speechConfig.speakers.map((sp) => {
                          const isCopied = copiedSpeakerId === sp.memberId;
                          return (
                            <div
                              key={sp.memberId}
                              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-cyan-500/30 transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-7 h-7 rounded-lg bg-gradient-to-br ${sp.avatarHue} flex items-center justify-center font-display font-black text-cyan-300 text-xs shadow-sm`}
                                  >
                                    {sp.name
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-xs text-white">
                                        {sp.name}
                                      </span>
                                      <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono text-[9px] font-bold border border-cyan-800">
                                        {sp.faculty}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-400">
                                      {sp.role} · {sp.belbinRole}
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(sp.speechText);
                                    setCopiedSpeakerId(sp.memberId);
                                    setTimeout(() => setCopiedSpeakerId(null), 2000);
                                  }}
                                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                                  title="Скопировать речь спикера"
                                >
                                  {isCopied ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>

                              <div className="text-[10px] text-cyan-400/90 italic bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900/40">
                                <strong>Ремарка:</strong> {sp.cueNote}
                              </div>

                              <div className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/70 p-2.5 rounded-lg border border-slate-800/80">
                                {sp.speechText}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    );
                  })()}
                </div>
              ) : (
                /* Editable Notes */
                <textarea
                  value={currentSlide.notes || ''}
                  onChange={(e) =>
                    onUpdateSlide({ ...currentSlide, notes: e.target.value })
                  }
                  placeholder="Добавьте тезисы для защиты перед комиссией..."
                  className="flex-1 w-full bg-slate-950/70 text-slate-200 border border-slate-800 rounded-lg p-3 text-xs leading-relaxed resize-none focus:outline-none focus:border-cyan-500/50"
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Pure Fullscreen Presentation Mode */
        <div className="flex-1 flex items-center justify-center bg-black relative p-2 md:p-6 overflow-hidden">
          <div className="w-full max-w-7xl aspect-video rounded-xl overflow-hidden border border-slate-900 shadow-2xl relative">
            <SlideRenderer
              slide={currentSlide}
              onUpdateSlide={onUpdateSlide}
              theme={theme}
              showWaveBackground={true}
            />

            {/* Floating Speech Overlay in Fullscreen */}
            {showFloatingSpeech && (
              <div className="absolute bottom-4 left-4 right-4 max-w-2xl mx-auto p-4 rounded-2xl bg-slate-950/95 backdrop-blur-md border border-cyan-500/50 shadow-2xl z-30 max-h-56 overflow-y-auto animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="font-display font-bold text-xs text-white">
                      Подсказка спикера · Слайд {currentIndex + 1}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowFloatingSpeech(false)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {(() => {
                  const speechConfig = FIVE_SLIDES_SPEECH.find(
                    (s) => s.slideIndex === currentIndex || s.slideId === currentSlide.id
                  );
                  if (!speechConfig) {
                    return <p className="text-xs text-slate-400">{currentSlide.notes || 'Нет заметок'}</p>;
                  }
                  return (
                    <div className="space-y-2">
                      {speechConfig.speakers.map((sp) => (
                        <div key={sp.memberId} className="text-xs text-slate-200">
                          <strong className="text-cyan-300">
                            {sp.name} ({sp.faculty}):
                          </strong>{' '}
                          {sp.speechText}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Toggle speech hint button in Fullscreen mode */}
          <button
            onClick={() => setShowFloatingSpeech(!showFloatingSpeech)}
            className="absolute bottom-6 right-6 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-cyan-950 text-cyan-300 border border-slate-700 hover:border-cyan-500 text-xs font-medium flex items-center gap-1.5 transition-all shadow-lg z-20"
            title="Показать / скрыть подсказку речи спикера"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{showFloatingSpeech ? 'Скрыть речь' : 'Подсказка речи'}</span>
          </button>

          {/* Floating Next/Prev arrows on hover */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-950/70 hover:bg-cyan-950 text-white border border-slate-800 hover:border-cyan-500 transition-all ${
              currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-80 hover:opacity-100 hover:scale-110'
            }`}
            title="Предыдущий слайд (Стрелка влево)"
          >
            <ChevronLeft className="w-6 h-6 text-cyan-400" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === slides.length - 1}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-950/70 hover:bg-cyan-950 text-white border border-slate-800 hover:border-cyan-500 transition-all ${
              currentIndex === slides.length - 1
                ? 'opacity-20 cursor-not-allowed'
                : 'opacity-80 hover:opacity-100 hover:scale-110'
            }`}
            title="Следующий слайд (Пробел или Стрелка вправо)"
          >
            <ChevronRight className="w-6 h-6 text-cyan-400" />
          </button>
        </div>
      )}

      {/* Bottom Progress Wave Bar */}
      <div className="h-2 bg-slate-900 relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-400 transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / slides.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
