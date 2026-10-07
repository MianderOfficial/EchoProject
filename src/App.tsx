import React, { useState, useEffect, useCallback } from 'react';
import { PresentationProject, SlideData, ThemeMode, SlideType } from './types/presentation';
import { initialProject } from './data/initialSlides';
import { Toolbar } from './components/Toolbar';
import { ThumbnailStrip } from './components/ThumbnailStrip';
import { SlideRenderer } from './components/SlideRenderer';
import { PresenterModal } from './components/PresenterModal';
import { PrintView } from './components/PrintView';
import { ExportModal } from './components/ExportModal';
import { soundEffects } from './components/SoundEffects';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
  Presentation,
  Edit3,
  Layers,
  HelpCircle,
  X,
  RotateCcw,
} from 'lucide-react';

const STORAGE_KEY = 'echo_presentation_project_v1';

export default function App() {
  // Load saved project or fall back to default template
  const [project, setProject] = useState<PresentationProject>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.slides && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
          // If previous cache had 6 members, migrate to 7
          const teamSlide = parsed.slides.find((s: any) => s.type === 'team');
          if (teamSlide && teamSlide.payload?.members?.length === 6) {
            teamSlide.payload.members.push({
              id: 'm7',
              name: 'Никита Смирнов',
              role: 'Координатор внедрения',
              colorScheme: 'teal',
              bio: 'Логистика комплектующих, монтаж и регламент эксплуатации',
              avatarHue: 'from-teal-600 to-emerald-900',
            });
            teamSlide.payload.layoutMode = 'lead-and-six';
          }
          return parsed;
        }
      }
    } catch {}
    return initialProject;
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isSpeakerMode, setIsSpeakerMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [waveAnimEnabled, setWaveAnimEnabled] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Sync sound setting
  useEffect(() => {
    soundEffects.enabled = soundEnabled;
  }, [soundEnabled]);

  // Persist project changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch {}
  }, [project]);

  // Keyboard navigation for main view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevSlide();
      } else if (e.key === 'F5') {
        e.preventDefault();
        setIsSpeakerMode(false);
        setIsPresentationOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, project.slides.length]);

  const triggerEchoPulse = (x?: number, y?: number) => {
    window.dispatchEvent(
      new CustomEvent('echo-pulse', {
        detail: {
          x: x ?? (typeof window !== 'undefined' ? window.innerWidth * 0.5 : 500),
          y: y ?? (typeof window !== 'undefined' ? window.innerHeight * 0.45 : 350),
        },
      })
    );
  };

  const handleNextSlide = useCallback(() => {
    if (currentSlideIndex < project.slides.length - 1) {
      const nextIdx = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIdx);
      soundEffects.playSlideChime(nextIdx);
      triggerEchoPulse();
    }
  }, [currentSlideIndex, project.slides.length]);

  const handlePrevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      const prevIdx = currentSlideIndex - 1;
      setCurrentSlideIndex(prevIdx);
      soundEffects.playSlideChime(prevIdx);
      triggerEchoPulse();
    }
  }, [currentSlideIndex]);

  const handleUpdateCurrentSlide = (updatedSlide: SlideData) => {
    const nextSlides = [...project.slides];
    nextSlides[currentSlideIndex] = updatedSlide;
    setProject({ ...project, slides: nextSlides });
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    soundEffects.playClick();
    setProject({ ...project, theme: newTheme });
  };

  const handleReset = () => {
    setShowResetModal(true);
  };

  const executeReset = () => {
    const freshProject = JSON.parse(JSON.stringify(initialProject));
    setProject(freshProject);
    setCurrentSlideIndex(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setShowResetModal(false);
    soundEffects.playSlideChime(0);
    triggerEchoPulse();
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `echo_presentation_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (imported: PresentationProject) => {
    setProject(imported);
    setCurrentSlideIndex(0);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleDuplicateSlide = (index: number) => {
    const target = project.slides[index];
    const duplicated: SlideData = {
      ...JSON.parse(JSON.stringify(target)),
      id: `slide_${Date.now()}`,
      title: `${target.title} (Копия)`,
    };
    const nextSlides = [...project.slides];
    nextSlides.splice(index + 1, 0, duplicated);
    setProject({ ...project, slides: nextSlides });
    setCurrentSlideIndex(index + 1);
  };

  const handleDeleteSlide = (index: number) => {
    if (project.slides.length <= 1) return;
    const nextSlides = project.slides.filter((_, i) => i !== index);
    setProject({ ...project, slides: nextSlides });
    if (currentSlideIndex >= nextSlides.length) {
      setCurrentSlideIndex(nextSlides.length - 1);
    }
  };

  const handleMoveSlide = (from: number, to: number) => {
    if (to < 0 || to >= project.slides.length) return;
    const nextSlides = [...project.slides];
    const [moved] = nextSlides.splice(from, 1);
    nextSlides.splice(to, 0, moved);
    setProject({ ...project, slides: nextSlides });
    setCurrentSlideIndex(to);
  };

  const handleAddNewSlide = (type: SlideType) => {
    const template = initialProject.slides.find((s) => s.type === type) || initialProject.slides[0];
    const newSlide: SlideData = {
      ...JSON.parse(JSON.stringify(template)),
      id: `slide_${Date.now()}`,
      title: `Новый слайд: ${template.title}`,
    };
    const nextSlides = [...project.slides, newSlide];
    setProject({ ...project, slides: nextSlides });
    setCurrentSlideIndex(nextSlides.length - 1);
    setShowAddModal(false);
  };

  const currentSlide = project.slides[currentSlideIndex] || project.slides[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden">
      {/* Top Navigation Toolbar */}
      <Toolbar
        project={project}
        theme={project.theme}
        onThemeChange={handleThemeChange}
        onStartPresentation={() => {
          setIsSpeakerMode(false);
          setIsPresentationOpen(true);
        }}
        onStartPresenterMode={() => {
          setIsSpeakerMode(true);
          setIsPresentationOpen(true);
        }}
        onPrintPdf={handlePrintPdf}
        onResetProject={handleReset}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onOpenExportModal={() => setShowExportModal(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        waveAnimEnabled={waveAnimEnabled}
        onToggleWaveAnim={() => setWaveAnimEnabled(!waveAnimEnabled)}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 relative">
        {/* Quick Helper Ribbon */}
        <div className="no-print w-full max-w-6xl mb-3 flex items-center justify-between text-xs text-slate-400 px-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-cyan-300">
              Слайд {currentSlideIndex + 1} / {project.slides.length}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 hidden sm:inline">
              Кликните по фону для эхо-волны или по тексту для правки
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerEchoPulse();
                soundEffects.playClick();
              }}
              className="px-2.5 py-1 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-700/80 text-cyan-300 flex items-center gap-1.5 transition-all text-xs font-mono hover:scale-105 active:scale-95 shadow-sm"
              title="Запустить акустический эхо-импульс"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
              <span>Эхо-импульс</span>
            </button>

            {project.slides.length < 12 && (
              <button
                onClick={() => setShowResetModal(true)}
                className="px-2.5 py-1 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-700/80 text-rose-300 flex items-center gap-1.5 transition-all text-xs font-mono hover:scale-105 active:scale-95 shadow-sm"
                title="Восстановить удаленные слайды (все 12 слайдов)"
              >
                <span>Восстановить 12 слайдов</span>
              </button>
            )}

            <button
              onClick={() => setShowHelpModal(true)}
              className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-900"
              title="Горячие клавиши и подсказки"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Подсказки</span>
            </button>
          </div>
        </div>

        {/* 16:9 Slide Frame Container */}
        <div className="w-full max-w-6xl aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative bg-slate-900 group transition-all duration-300">
          <SlideRenderer
            slide={currentSlide}
            onUpdateSlide={handleUpdateCurrentSlide}
            onNavigateToSlide={(id) => {
              const idx = project.slides.findIndex((s) => s.id === id);
              if (idx !== -1) setCurrentSlideIndex(idx);
            }}
            theme={project.theme}
            showWaveBackground={waveAnimEnabled}
          />

          {/* Quick Floating Navigation Buttons over slide */}
          <button
            onClick={handlePrevSlide}
            disabled={currentSlideIndex === 0}
            className={`no-print absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/80 hover:bg-cyan-950 text-white border border-slate-800 hover:border-cyan-500/50 shadow-lg transition-all duration-200 z-20 ${
              currentSlideIndex === 0
                ? 'opacity-0 pointer-events-none'
                : 'opacity-0 group-hover:opacity-100 hover:scale-110'
            }`}
            title="Предыдущий слайд (Стрелка влево)"
          >
            <ChevronLeft className="w-5 h-5 text-cyan-400" />
          </button>

          <button
            onClick={handleNextSlide}
            disabled={currentSlideIndex === project.slides.length - 1}
            className={`no-print absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/80 hover:bg-cyan-950 text-white border border-slate-800 hover:border-cyan-500/50 shadow-lg transition-all duration-200 z-20 ${
              currentSlideIndex === project.slides.length - 1
                ? 'opacity-0 pointer-events-none'
                : 'opacity-0 group-hover:opacity-100 hover:scale-110'
            }`}
            title="Следующий слайд (Стрелка вправо)"
          >
            <ChevronRight className="w-5 h-5 text-cyan-400" />
          </button>
        </div>
      </main>

      {/* Bottom Thumbnails Strip */}
      <ThumbnailStrip
        slides={project.slides}
        currentIndex={currentSlideIndex}
        onSelectSlide={(idx) => {
          setCurrentSlideIndex(idx);
          soundEffects.playSlideChime(idx);
          triggerEchoPulse();
        }}
        onAddSlide={() => setShowAddModal(true)}
        onDuplicateSlide={handleDuplicateSlide}
        onDeleteSlide={handleDeleteSlide}
        onMoveSlide={handleMoveSlide}
      />

      {/* Fullscreen & Presenter Mode Modal */}
      {isPresentationOpen && (
        <PresenterModal
          slides={project.slides}
          currentIndex={currentSlideIndex}
          onSelectSlide={setCurrentSlideIndex}
          onClose={() => setIsPresentationOpen(false)}
          onUpdateSlide={handleUpdateCurrentSlide}
          isSpeakerMode={isSpeakerMode}
          theme={project.theme}
        />
      )}

      {/* Add Slide Type Selector Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Выберите шаблон слайда
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Выберите структуру слайда в стиле команды «Эхо» с подготовленными акустическими ритмическими блоками:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[60vh] overflow-y-auto p-1">
              {[
                { type: 'title', label: 'Титульный слайд', desc: 'Название и брендинг' },
                { type: 'agenda', label: 'Содержание', desc: 'Волновой маршрут' },
                { type: 'team', label: 'Команда проекта', desc: 'Карточки участников' },
                { type: 'smart-goal', label: 'Цель SMART', desc: '5 волновых арок' },
                { type: 'audience', label: 'Аудитория', desc: 'Статистика и сегменты' },
                { type: 'analogs', label: 'Аналоги', desc: 'Бенчмаркинг' },
                { type: 'idea-collage', label: 'Концепт-коллаж', desc: '4 визуал-квадранта' },
                { type: 'idea-features', label: 'Преимущества', desc: '4 свойства + макет' },
                { type: 'idea-workflow', label: 'Сценарий', desc: '3-колоночный трек' },
                { type: 'social-impact', label: 'Соц. эффект', desc: '4 крупных метрики' },
                { type: 'roadmap', label: 'План внедрения', desc: '4 этапа и спринты' },
                { type: 'final', label: 'Финал & Q&A', desc: 'Контакты и спасибо' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => handleAddNewSlide(item.type as SlideType)}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 text-left transition-all group"
                >
                  <div className="font-display font-bold text-xs text-white group-hover:text-cyan-300">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts & Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>Управление презентацией</span>
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Следующий слайд</span>
                <span className="font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  Стрелка вправо / Space
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Предыдущий слайд</span>
                <span className="font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  Стрелка влево
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Полноэкранный показ</span>
                <span className="font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  F5 / Кнопка «Показ»
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Лазерная указка в показе</span>
                <span className="font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  Клавиша L
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Затемнение экрана</span>
                <span className="font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  Клавиша B
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Печать в PDF (16:9)</span>
                <span className="font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  Кнопка «PDF / Печать»
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 text-center">
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold border border-cyan-500/40 transition-colors"
              >
                Понятно
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export & GitHub Modal */}
      {showExportModal && (
        <ExportModal
          project={project}
          onClose={() => setShowExportModal(false)}
          onPrintPdf={handlePrintPdf}
        />
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center mb-4">
              <RotateCcw className="w-6 h-6 animate-spin-once" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              Сбросить к исходному шаблону?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Все слайды (включая удалённые) будут полностью восстановлены. Вы получите исходный набор из 12 слайдов команды «Эхо» с 7 участниками.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={executeReset}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-900/50 transition-colors"
              >
                Да, восстановить 12 слайдов
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Print View (rendered only when user prints / saves as PDF) */}
      <PrintView slides={project.slides} theme={project.theme} />
    </div>
  );
}
