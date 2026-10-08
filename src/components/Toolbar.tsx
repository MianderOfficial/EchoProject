import React, { useRef } from 'react';
import { PresentationProject, ThemeMode } from '../types/presentation';
import { EchoLogo } from './EchoLogo';
import { soundEffects } from './SoundEffects';
import {
  Play,
  Presentation,
  Printer,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Upload,
  Waves,
  Palette,
  Sparkles,
  FolderArchive,
  Github,
  Mic,
  Layers,
} from 'lucide-react';

interface ToolbarProps {
  project: PresentationProject;
  theme: ThemeMode;
  onThemeChange: (newTheme: ThemeMode) => void;
  onStartPresentation: () => void;
  onStartPresenterMode: () => void;
  onPrintPdf: () => void;
  onResetProject: () => void;
  onExportJson: () => void;
  onImportJson: (data: PresentationProject) => void;
  onOpenExportModal: () => void;
  onOpenSpeechModal: () => void;
  isFiveSlidesMode: boolean;
  onToggleFiveSlidesMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  waveAnimEnabled: boolean;
  onToggleWaveAnim: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  project,
  theme,
  onThemeChange,
  onStartPresentation,
  onStartPresenterMode,
  onPrintPdf,
  onResetProject,
  onExportJson,
  onImportJson,
  onOpenExportModal,
  onOpenSpeechModal,
  isFiveSlidesMode,
  onToggleFiveSlidesMode,
  soundEnabled,
  onToggleSound,
  waveAnimEnabled,
  onToggleWaveAnim,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.slides && Array.isArray(parsed.slides)) {
          onImportJson(parsed);
        }
      } catch (err) {
        alert('Ошибка при чтении файла презентации.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="no-print h-14 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 md:px-6 flex items-center justify-between z-40 select-none">
      {/* Zone 1: Brand Wordmark & Project Name */}
      <div className="flex items-center gap-3 shrink-0">
        <EchoLogo size={34} withRipples />
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-sm tracking-wider text-white">
            ЭХО
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-xs text-slate-300 font-medium hidden sm:inline max-w-[200px] md:max-w-xs truncate">
            {project.title}
          </span>
        </div>
      </div>

      {/* Zone 2: Presentation & Theme Controls */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Theme selector */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => onThemeChange('dark-sonic')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              theme === 'dark-sonic'
                ? 'bg-cyan-950 text-cyan-300 font-medium shadow-sm border border-cyan-800'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Тема: Эхо Неон (Темная)"
          >
            Неон
          </button>
          <button
            onClick={() => onThemeChange('light-acoustic')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              theme === 'light-acoustic'
                ? 'bg-cyan-950 text-cyan-300 font-medium shadow-sm border border-cyan-800'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Тема: Светлая (для ярких проекторов)"
          >
            Светлая
          </button>
        </div>

        {/* 5-Slide Defense Filter Toggle */}
        <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={isFiveSlidesMode ? undefined : onToggleFiveSlidesMode}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
              isFiveSlidesMode
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Режим 5 слайдов защиты: Введение, Наша программа, Команда, Цель, Результат"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isFiveSlidesMode ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
            <span>5 слайдов</span>
          </button>
          <button
            onClick={!isFiveSlidesMode ? undefined : onToggleFiveSlidesMode}
            className={`px-2 py-1 rounded-md transition-all ${
              !isFiveSlidesMode
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Показать полную колоду: все 12 слайдов"
          >
            Все (12)
          </button>
        </div>

        {/* Waves animation toggle */}
        <button
          onClick={onToggleWaveAnim}
          className={`p-2 rounded-lg border transition-colors ${
            waveAnimEnabled
              ? 'bg-cyan-950/70 border-cyan-800 text-cyan-300'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          title={waveAnimEnabled ? 'Акустические волны включены' : 'Акустические волны отключены'}
        >
          <Waves className="w-4 h-4" />
        </button>

        {/* Audio feedback toggle */}
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-lg border transition-colors ${
            soundEnabled
              ? 'bg-cyan-950/70 border-cyan-800 text-cyan-300'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          title={soundEnabled ? 'Звук переходов включен' : 'Звук выключен'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Hidden File Input for JSON import */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />

        {/* Export / Import Menu */}
        <button
          onClick={onExportJson}
          className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
          title="Экспортировать JSON презентации"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>JSON</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
          title="Импортировать JSON"
        >
          <Upload className="w-3.5 h-3.5 text-slate-400" />
          <span>Загрузить</span>
        </button>

        <button
          onClick={onResetProject}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-700/60 text-xs text-slate-300 hover:text-rose-300 transition-colors"
          title="Сбросить все изменения к исходному шаблону"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Сброс</span>
        </button>

        {/* Export PDF Button */}
        <button
          onClick={onPrintPdf}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-white font-medium transition-colors"
          title="Печать в PDF (16:9 альбомный)"
        >
          <Printer className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">PDF / Печать</span>
        </button>

        {/* Download & GitHub Hub Button */}
        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-600/60 text-xs text-cyan-300 font-semibold transition-all shadow-sm"
          title="Скачать проект (.zip / .html) или опубликовать на GitHub"
        >
          <FolderArchive className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Скачать / GitHub</span>
          <span className="md:hidden">Скачать</span>
        </button>
      </div>

      {/* Zone 3: Primary Action - Fullscreen & Presenter Mode */}
      <div className="flex items-center gap-2">
        {/* Speech Script Button */}
        <button
          onClick={onOpenSpeechModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/80 hover:border-cyan-400 text-xs text-cyan-200 hover:text-white font-bold transition-all shadow-md shadow-cyan-950/60 hover:scale-105 active:scale-95 group"
          title="Открыть распределение речи всех 7 участников команды на 5 слайдов"
        >
          <Mic className="w-3.5 h-3.5 text-cyan-400 group-hover:animate-pulse" />
          <span className="hidden sm:inline">Речь команды (7 чел.)</span>
          <span className="sm:hidden">Речь</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
        </button>

        <button
          onClick={onStartPresenterMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950/80 border border-slate-800 hover:border-cyan-700 text-xs text-slate-200 transition-all font-medium"
          title="Режим спикера с таймером и заметками"
        >
          <Presentation className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Спикер</span>
        </button>

        <button
          onClick={onStartPresentation}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#0F4C81] to-[#38B6B6] hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-cyan-950/60 transition-all active:scale-95"
          title="Запустить показ на весь экран (клавиша F5)"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Показ</span>
        </button>
      </div>
    </header>
  );
};
