import React, { useEffect } from 'react';
import {
  Eye,
  Type,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  RotateCcw,
  X,
  Sliders,
  Shield,
  Contrast,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';

export const AccessibilitySettingsModal: React.FC = () => {
  const {
    isAccessibilityModalOpen,
    setAccessibilityModalOpen,
    highContrastMode,
    setHighContrastMode,
    fontSizeScale,
    setFontSizeScale,
    screenReaderTTS,
    setScreenReaderTTS,
    isReducedMotion,
    setReducedMotion,
    speakLabel
  } = useNavigationStore();

  // Keyboard shortcut Alt+A to toggle modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setAccessibilityModalOpen(!isAccessibilityModalOpen);
      }
      if (e.key === 'Escape' && isAccessibilityModalOpen) {
        setAccessibilityModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAccessibilityModalOpen, setAccessibilityModalOpen]);

  // Apply high contrast and font scaling to root document element
  useEffect(() => {
    const root = document.documentElement;
    if (highContrastMode) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    root.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-xl');
    if (fontSizeScale === 'large') {
      root.classList.add('font-scale-large');
    } else if (fontSizeScale === 'extra-large') {
      root.classList.add('font-scale-xl');
    } else {
      root.classList.add('font-scale-normal');
    }

    if (isReducedMotion) {
      root.classList.add('motion-reduce');
    } else {
      root.classList.remove('motion-reduce');
    }
  }, [highContrastMode, fontSizeScale, isReducedMotion]);

  if (!isAccessibilityModalOpen) return null;

  const handleTestTTS = () => {
    speakLabel('Accessibility text to speech is active. Hovering or focusing screen controls will read labels aloud.');
  };

  const handleResetDefaults = () => {
    setHighContrastMode(false);
    setFontSizeScale('normal');
    setScreenReaderTTS(false);
    setReducedMotion(false);
    speakLabel('Accessibility settings reset to default.');
  };

  return (
    <div
      id="accessibility-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
      onClick={() => setAccessibilityModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-settings-title"
    >
      <div
        id="accessibility-settings-card"
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 id="accessibility-settings-title" className="text-base font-bold text-white flex items-center gap-2">
                Accessibility Settings
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">Alt + A</span>
              </h2>
              <p className="text-xs text-slate-300">Customize visual contrast, typography size, and screen narrator</p>
            </div>
          </div>

          <button
            id="close-accessibility-modal-btn"
            onClick={() => setAccessibilityModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-all"
            aria-label="Close accessibility settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* High Contrast Mode */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Contrast className="w-4 h-4 text-slate-800" />
                <span className="text-sm font-bold text-slate-900">High-Contrast Display Mode</span>
              </div>
              <p className="text-xs text-slate-500">
                Enhances text contrast with deep borders, pure solid tones, and bold visual markers for low-vision users.
              </p>
            </div>

            <button
              id="toggle-high-contrast-btn"
              onClick={() => {
                const next = !highContrastMode;
                setHighContrastMode(next);
                speakLabel(`High contrast mode ${next ? 'enabled' : 'disabled'}`);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                highContrastMode ? 'bg-teal-600' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={highContrastMode}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  highContrastMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Font Size Scaling */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-slate-800" />
                <span className="text-sm font-bold text-slate-900">Font Size Scale</span>
              </div>
              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {fontSizeScale === 'normal' ? '100% Standard' : fontSizeScale === 'large' ? '115% Large' : '130% Extra Large'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Increases all UI typography, clinical badges, and queue numbers across the entire hospital system.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'normal', label: 'Default', size: '100%' },
                { id: 'large', label: 'Large (A+)', size: '115%' },
                { id: 'extra-large', label: 'X-Large (A++)', size: '130%' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  id={`font-scale-${opt.id}`}
                  onClick={() => {
                    setFontSizeScale(opt.id as any);
                    speakLabel(`Font size set to ${opt.label}`);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    fontSizeScale === opt.id
                      ? 'bg-teal-600 text-white border-teal-700 shadow-sm ring-2 ring-teal-500/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">{opt.size}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text-To-Speech Narrator for Screen Labels */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-slate-800" />
                <span className="text-sm font-bold text-slate-900">Screen Label Text-to-Speech (TTS)</span>
              </div>
              <p className="text-xs text-slate-500">
                Uses browser speech synthesis to read aloud active buttons, tokens, department rooms, and instructions.
              </p>
              {screenReaderTTS && (
                <button
                  onClick={handleTestTTS}
                  className="mt-2 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 inline-flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Test Voice Assistant
                </button>
              )}
            </div>

            <button
              id="toggle-tts-btn"
              onClick={() => {
                const next = !screenReaderTTS;
                setScreenReaderTTS(next);
                if (next) {
                  speakLabel('Screen reader text to speech enabled.');
                }
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                screenReaderTTS ? 'bg-teal-600' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={screenReaderTTS}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  screenReaderTTS ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-slate-800" />
                <span className="text-sm font-bold text-slate-900">Reduce Interface Motion</span>
              </div>
              <p className="text-xs text-slate-500">
                Disables animated pulses, floating banners, and rapid transitions to prevent vestibular discomfort.
              </p>
            </div>

            <button
              id="toggle-reduced-motion-btn"
              onClick={() => {
                const next = !isReducedMotion;
                setReducedMotion(next);
                speakLabel(`Reduced motion ${next ? 'enabled' : 'disabled'}`);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isReducedMotion ? 'bg-teal-600' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={isReducedMotion}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isReducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            id="reset-accessibility-btn"
            onClick={handleResetDefaults}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Default
          </button>

          <button
            id="save-accessibility-btn"
            onClick={() => setAccessibilityModalOpen(false)}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
          >
            <Check className="w-3.5 h-3.5 text-teal-400" />
            Apply &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
