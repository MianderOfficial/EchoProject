import React, { useState } from 'react';
import { PresentationProject } from '../types/presentation';
import { createProjectZip } from '../utils/projectZip';
import { generateStandaloneHtml } from '../utils/exportStandaloneHtml';
import {
  X,
  Download,
  Github,
  Globe,
  FileCode,
  Printer,
  Copy,
  Check,
  FolderArchive,
  ExternalLink,
} from 'lucide-react';

interface ExportModalProps {
  project: PresentationProject;
  onClose: () => void;
  onPrintPdf: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  project,
  onClose,
  onPrintPdf,
}) => {
  const [isZipping, setIsZipping] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedGit, setCopiedGit] = useState(false);

  // The live hosted preview link
  const liveUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-s3np4juqvegn3d4wri2qrh-256317734362.europe-west2.run.app';

  // 1. Download project ZIP
  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zipBlob = await createProjectZip(project);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `echo_presentation_project_${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Ошибка при создании архива');
    } finally {
      setIsZipping(false);
    }
  };

  // 2. Download Full Standalone HTML (100% complete React app with all animations)
  const handleDownloadHtml = async () => {
    try {
      const res = await fetch('/full_app_bundle.html');
      if (res.ok) {
        const fullHtml = await res.text();
        const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `index.html`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }
    } catch (e) {
      console.error(e);
    }

    // fallback
    const htmlContent = generateStandaloneHtml(project);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `index.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyLiveLink = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const gitCommands = `# Быстрая публикация на GitHub:
git init
git add .
git commit -m "Initial commit: Презентация команды Эхо"
git branch -M main
git remote add origin https://github.com/<ВАШ_АККАУНТ>/echo-presentation.git
git push -u origin main`;

  const copyGitCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedGit(true);
    setTimeout(() => setCopiedGit(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg md:text-xl text-white">
                Экспорт, скачивание и GitHub
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Это полноценное веб-приложение на React + TypeScript. Вот способы его использования:
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* Section 1: Ready-to-use Direct Links & Files */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Download Standalone HTML */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase mb-1">
                  <FileCode className="w-4 h-4" />
                  <span>Автономный .HTML файл</span>
                </div>
                <h3 className="font-display font-bold text-sm text-white mb-1">
                  Работает без интернета
                </h3>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Один файл с презентацией. Можно скинуть на флешку и открыть в любом браузере на паре.
                </p>
              </div>
              <button
                onClick={handleDownloadHtml}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Скачать .HTML</span>
              </button>
            </div>

            {/* Download Project ZIP */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase mb-1">
                  <FolderArchive className="w-4 h-4" />
                  <span>Архив проекта (.ZIP)</span>
                </div>
                <h3 className="font-display font-bold text-sm text-white mb-1">
                  Для GitHub и разработчиков
                </h3>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Полный архив с исходным кодом, package.json, инструкцией README и структурой файлов.
                </p>
              </div>
              <button
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isZipping ? 'Упаковка архива...' : 'Скачать ZIP'}</span>
              </button>
            </div>
          </div>

          {/* Section 2: Online Link & PDF */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Прямая ссылка (уже работает онлайн!):</span>
              </div>
              <button
                onClick={copyLiveLink}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Скопировано!' : 'Копировать ссылку'}</span>
              </button>
            </div>
            <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300/90 truncate">
              {liveUrl}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onPrintPdf();
                }}
                className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Распечатать или сохранить в PDF (16:9)</span>
              </button>
            </div>
          </div>

          {/* Section 3: Step-by-Step GitHub Instructions */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Github className="w-4 h-4 text-white" />
                <span>Как опубликовать на GitHub (3 простых шага):</span>
              </div>
              <button
                onClick={copyGitCommands}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedGit ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedGit ? 'Скопировано' : 'Скопировать git команды'}</span>
              </button>
            </div>

            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                <span className="font-semibold text-white">Скачайте ZIP-архив</span> кнопкой выше и распакуйте папку на компьютере.
              </li>
              <li>
                Зайдите на <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center gap-0.5">github.com/new <ExternalLink className="w-3 h-3" /></a> и создайте новый публичный репозиторий (например, <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">echo-presentation</code>).
              </li>
              <li>
                Перетащите распакованные файлы в созданный репозиторий через браузер (<span className="text-cyan-300 font-mono">Upload files</span>) или выполните команды через Git в терминале.
              </li>
            </ol>

            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
              <pre>{gitCommands}</pre>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              💡 Чтобы сделать сайт доступным по бесплатной ссылке в интернете, в репозитории откройте <strong>Settings → Pages</strong> и включите GitHub Pages!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end shrink-0 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors shadow-lg shadow-cyan-500/20"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
