import React from 'react';
import { SlideData } from '../types/presentation';
import { Plus, Copy, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface ThumbnailStripProps {
  slides: SlideData[];
  currentIndex: number;
  onSelectSlide: (index: number) => void;
  onAddSlide: () => void;
  onDuplicateSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
  onMoveSlide: (from: number, to: number) => void;
}

export const ThumbnailStrip: React.FC<ThumbnailStripProps> = ({
  slides,
  currentIndex,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlide,
}) => {
  return (
    <div className="no-print h-24 bg-slate-950/90 border-t border-slate-800/80 px-4 py-2 flex items-center gap-3 overflow-x-auto z-30 select-none">
      {slides.map((s, idx) => {
        const isActive = idx === currentIndex;

        return (
          <div
            key={s.id || idx}
            onClick={() => onSelectSlide(idx)}
            className={`group relative shrink-0 w-32 h-18 rounded-lg cursor-pointer transition-all duration-200 border-2 overflow-hidden flex flex-col justify-between p-1.5 ${
              isActive
                ? 'border-cyan-400 bg-slate-900 shadow-lg shadow-cyan-950/50 scale-105'
                : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 opacity-70 hover:opacity-100'
            }`}
          >
            {/* Top row: Number & Type */}
            <div className="flex items-center justify-between text-[10px]">
              <span
                className={`font-mono font-bold ${
                  isActive ? 'text-cyan-400' : 'text-slate-400'
                }`}
              >
                {idx + 1}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 truncate max-w-[80px]">
                {s.type}
              </span>
            </div>

            {/* Slide title snippet */}
            <div className="text-[11px] font-semibold text-white truncate my-auto leading-tight">
              {s.title}
            </div>

            {/* Bottom mini indicator */}
            <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5 border-t border-slate-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
              <span className="font-mono text-[9px]">16:9</span>
            </div>

            {/* Actions on hover */}
            <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-slate-950/85 backdrop-blur-[2px] flex items-center justify-center gap-1.5 transition-opacity">
              {idx > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveSlide(idx, idx - 1);
                  }}
                  className="p-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded"
                  title="Переместить влево"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicateSlide(idx);
                }}
                className="p-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded"
                title="Дублировать слайд"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {slides.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSlide(idx);
                  }}
                  className="p-1 text-slate-300 hover:text-rose-400 hover:bg-slate-800 rounded"
                  title="Удалить слайд"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              {idx < slides.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveSlide(idx, idx + 1);
                  }}
                  className="p-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded"
                  title="Переместить вправо"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Add Slide Button */}
      <button
        onClick={onAddSlide}
        className="shrink-0 w-24 h-18 rounded-lg border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-900/40 hover:bg-cyan-950/20 text-slate-400 hover:text-cyan-300 flex flex-col items-center justify-center gap-1 transition-all"
        title="Добавить новый слайд"
      >
        <Plus className="w-5 h-5 text-cyan-400" />
        <span className="text-[10px] font-mono">Добавить</span>
      </button>
    </div>
  );
};
