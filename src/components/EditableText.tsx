import React, { useState, useEffect, useRef } from 'react';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  isTitle?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  multiline = false,
  className = '',
  placeholder = 'Введите текст...',
  isTitle = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentVal, setCurrentVal] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setCurrentVal(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if ('select' in inputRef.current) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (currentVal.trim() !== value) {
      onSave(currentVal.trim() || placeholder);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setCurrentVal(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={currentVal}
          onChange={(e) => setCurrentVal(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          rows={3}
          className={`w-full bg-slate-900/90 text-white border-2 border-cyan-400 rounded-lg p-2 outline-none resize-none shadow-lg ring-2 ring-cyan-500/20 ${className}`}
        />
      );
    }
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={currentVal}
        onChange={(e) => setCurrentVal(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full bg-slate-900/90 text-white border-2 border-cyan-400 rounded px-2 py-0.5 outline-none shadow-lg ring-2 ring-cyan-500/20 ${className}`}
      />
    );
  }

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      title="Нажмите, чтобы изменить текст"
      className={`group relative cursor-text hover:outline-dashed hover:outline-1 hover:outline-cyan-400/60 rounded px-0.5 transition-colors ${className}`}
    >
      {currentVal || <span className="opacity-40 italic">{placeholder}</span>}
      <span className="opacity-0 group-hover:opacity-100 absolute -top-4 right-0 text-[10px] bg-cyan-600/90 text-white px-1 py-0.2 rounded font-sans tracking-tight pointer-events-none transition-opacity">
        edit
      </span>
    </span>
  );
};
