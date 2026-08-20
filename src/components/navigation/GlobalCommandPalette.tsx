import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Mic,
  FileText,
  MonitorPlay,
  MessageSquare,
  Stethoscope,
  Building2,
  PhoneCall,
  Clock,
  ArrowRight,
  Sparkles,
  Command,
  X,
  CornerDownLeft,
  Activity,
  ShieldCheck,
  Zap,
  Globe,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { NAV_MOTION_TOKENS } from '../../lib/navigationTokens';

interface GlobalCommandPaletteProps {
  currentLanguage: 'kn' | 'hi' | 'en' | 'te' | 'ta';
  onLanguageChange: (lang: 'kn' | 'hi' | 'en' | 'te' | 'ta') => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Navigation' | 'Emergency' | 'Languages' | 'Clinical Actions' | 'Quick Tools';
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
  shortcut?: string;
  badge?: string;
}

export const GlobalCommandPalette: React.FC<GlobalCommandPaletteProps> = ({
  currentLanguage,
  onLanguageChange,
  activeTab,
  onTabChange
}) => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    isReducedMotion,
    setReducedMotion
  } = useNavigationStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global keydown listener for ⌘K / Ctrl+K and number keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K toggle
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
        return;
      }

      if (e.key === 'Escape' && isCommandPaletteOpen) {
        e.preventDefault();
        setCommandPaletteOpen(false);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  // Focus input on open
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Command Items Registry
  const commands: CommandItem[] = [
    // Clinical Tabs Navigation
    {
      id: 'nav-voice',
      title: currentLanguage === 'kn' ? 'ಧ್ವನಿ ಕಿಯೋಸ್ಕ್ (Voice Intake)' : 'Patient Voice Triage Kiosk',
      subtitle: 'Instant multilingual speech intake & emergency SATS scoring',
      category: 'Navigation',
      icon: <Mic className="w-4 h-4 text-teal-400" />,
      action: () => {
        onTabChange('voice');
        setCommandPaletteOpen(false);
      },
      keywords: ['voice', 'speak', 'audio', 'kiosk', 'sats', 'triage', 'dhavani', 'matanadu'],
      shortcut: '1'
    },
    {
      id: 'nav-scanner',
      title: currentLanguage === 'kn' ? 'ದಾಖಲೆ ಸ್ಕ್ಯಾನರ್ (Prescription & ABHA)' : 'Prescription & ABHA Vision OCR',
      subtitle: 'Doctor handwriting extraction & generic medicine matching',
      category: 'Navigation',
      icon: <FileText className="w-4 h-4 text-blue-400" />,
      action: () => {
        onTabChange('scanner');
        setCommandPaletteOpen(false);
      },
      keywords: ['scan', 'rx', 'prescription', 'abha', 'ocr', 'medicine', 'lab', 'report'],
      shortcut: '2'
    },
    {
      id: 'nav-queue',
      title: currentLanguage === 'kn' ? 'ಲೈವ್ ಕ್ಯೂ & ಬೆಡ್ ಮಾನಿಟರ್' : 'Live OPD & ICU Bed Monitor',
      subtitle: 'Real-time casualty queue load & hospital bed availability',
      category: 'Navigation',
      icon: <MonitorPlay className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onTabChange('queue');
        setCommandPaletteOpen(false);
      },
      keywords: ['queue', 'bed', 'icu', 'casualty', 'opd', 'live', 'telemetry', 'crowd'],
      shortcut: '3',
      badge: 'Live'
    },
    {
      id: 'nav-assistant',
      title: currentLanguage === 'kn' ? 'ಜನಾರೋಗ್ಯ ಮಿತ್ರ (AI Concierge)' : 'JanArogya Mitra AI Concierge',
      subtitle: 'Scheme guidance (PM-JAY, Arogya Karnataka) & patient navigator',
      category: 'Navigation',
      icon: <MessageSquare className="w-4 h-4 text-purple-400" />,
      action: () => {
        onTabChange('assistant');
        setCommandPaletteOpen(false);
      },
      keywords: ['mitra', 'assistant', 'chat', 'scheme', 'pmjay', 'ayushman', 'free', 'help'],
      shortcut: '4'
    },
    {
      id: 'nav-nurse',
      title: currentLanguage === 'kn' ? 'ನರ್ಸ್ ಸ್ಟೇಷನ್ (Triage Audit)' : 'Nurse Triage Audit Station',
      subtitle: 'Clinical vitals verification, manual score override & bed allocation',
      category: 'Navigation',
      icon: <Stethoscope className="w-4 h-4 text-amber-400" />,
      action: () => {
        onTabChange('nurse');
        setCommandPaletteOpen(false);
      },
      keywords: ['nurse', 'station', 'doctor', 'audit', 'triage', 'vitals', 'sp02', 'pulse'],
      shortcut: '5'
    },
    {
      id: 'nav-directory',
      title: currentLanguage === 'kn' ? 'ಆಸ್ಪತ್ರೆ ಜಾಲ & ರವಾನೆ' : 'Hospital Network & Auto-Dispatch',
      subtitle: 'Victoria, Bowring, AIIMS, WhatsApp/Email dispatch & n8n pipeline',
      category: 'Navigation',
      icon: <Building2 className="w-4 h-4 text-indigo-400" />,
      action: () => {
        onTabChange('directory');
        setCommandPaletteOpen(false);
      },
      keywords: ['hospital', 'directory', 'dispatch', 'victoria', 'bowring', 'n8n', 'ambulance', 'transfer'],
      shortcut: '6',
      badge: 'n8n/Voice'
    },

    // Emergency Contacts
    {
      id: 'call-108',
      title: 'Call 108 Emergency Ambulance',
      subtitle: 'Free 24/7 Government Emergency Medical Service',
      category: 'Emergency',
      icon: <PhoneCall className="w-4 h-4 text-red-400" />,
      action: () => {
        window.open('tel:108', '_self');
        setCommandPaletteOpen(false);
      },
      keywords: ['ambulance', '108', 'emergency', 'accident', 'sos', 'trauma'],
      badge: 'SOS'
    },
    {
      id: 'call-104',
      title: 'Call 104 Arogyavani Helpline',
      subtitle: 'Karnataka State Health Information & Medical Advice',
      category: 'Emergency',
      icon: <PhoneCall className="w-4 h-4 text-rose-400" />,
      action: () => {
        window.open('tel:104', '_self');
        setCommandPaletteOpen(false);
      },
      keywords: ['104', 'arogyavani', 'helpline', 'medical advice', 'doctor consultation']
    },

    // Languages Switcher
    {
      id: 'lang-kn',
      title: 'ಕನ್ನಡ (Kannada)',
      subtitle: 'Switch voice intake & user interface to Kannada',
      category: 'Languages',
      icon: <Globe className="w-4 h-4 text-teal-400" />,
      action: () => {
        onLanguageChange('kn');
        setCommandPaletteOpen(false);
      },
      keywords: ['kannada', 'kannadiga', 'bhasha', 'kn'],
      badge: currentLanguage === 'kn' ? 'Active' : undefined
    },
    {
      id: 'lang-hi',
      title: 'हिंदी (Hindi)',
      subtitle: 'Switch voice intake & user interface to Hindi',
      category: 'Languages',
      icon: <Globe className="w-4 h-4 text-teal-400" />,
      action: () => {
        onLanguageChange('hi');
        setCommandPaletteOpen(false);
      },
      keywords: ['hindi', 'bhasha', 'hi'],
      badge: currentLanguage === 'hi' ? 'Active' : undefined
    },
    {
      id: 'lang-en',
      title: 'English',
      subtitle: 'Switch voice intake & user interface to English',
      category: 'Languages',
      icon: <Globe className="w-4 h-4 text-teal-400" />,
      action: () => {
        onLanguageChange('en');
        setCommandPaletteOpen(false);
      },
      keywords: ['english', 'en'],
      badge: currentLanguage === 'en' ? 'Active' : undefined
    },
    {
      id: 'lang-te',
      title: 'తెలుగు (Telugu)',
      subtitle: 'Switch voice intake & user interface to Telugu',
      category: 'Languages',
      icon: <Globe className="w-4 h-4 text-teal-400" />,
      action: () => {
        onLanguageChange('te');
        setCommandPaletteOpen(false);
      },
      keywords: ['telugu', 'te'],
      badge: currentLanguage === 'te' ? 'Active' : undefined
    },
    {
      id: 'lang-ta',
      title: 'தமிழ் (Tamil)',
      subtitle: 'Switch voice intake & user interface to Tamil',
      category: 'Languages',
      icon: <Globe className="w-4 h-4 text-teal-400" />,
      action: () => {
        onLanguageChange('ta');
        setCommandPaletteOpen(false);
      },
      keywords: ['tamil', 'ta'],
      badge: currentLanguage === 'ta' ? 'Active' : undefined
    },

    // Quick Accessibility & Tools
    {
      id: 'open-accessibility-panel',
      title: 'Open Accessibility Settings Panel',
      subtitle: 'Adjust high contrast, font size scale (100%-130%), and screen reader TTS',
      category: 'Quick Tools',
      icon: <Sliders className="w-4 h-4 text-teal-400" />,
      action: () => {
        useNavigationStore.getState().setAccessibilityModalOpen(true);
        setCommandPaletteOpen(false);
      },
      keywords: ['accessibility', 'contrast', 'high contrast', 'font size', 'tts', 'text to speech', 'vision', 'a11y'],
      shortcut: 'Alt+A',
      badge: 'A11y'
    },
    {
      id: 'toggle-high-contrast',
      title: useNavigationStore.getState().highContrastMode ? 'Disable High-Contrast Mode' : 'Enable High-Contrast Mode',
      subtitle: 'Stark contrast borders and deep tones for vision accessibility',
      category: 'Quick Tools',
      icon: <Sliders className="w-4 h-4 text-amber-400" />,
      action: () => {
        const current = useNavigationStore.getState().highContrastMode;
        useNavigationStore.getState().setHighContrastMode(!current);
        setCommandPaletteOpen(false);
      },
      keywords: ['contrast', 'high contrast', 'dark contrast', 'vision', 'black and white'],
      badge: useNavigationStore.getState().highContrastMode ? 'Active' : undefined
    },
    {
      id: 'toggle-tts',
      title: useNavigationStore.getState().screenReaderTTS ? 'Disable Screen Label Voice TTS' : 'Enable Screen Label Voice TTS',
      subtitle: 'Voice narration for all screen labels, tokens, and rooms',
      category: 'Quick Tools',
      icon: <Sliders className="w-4 h-4 text-teal-400" />,
      action: () => {
        const current = useNavigationStore.getState().screenReaderTTS;
        useNavigationStore.getState().setScreenReaderTTS(!current);
        setCommandPaletteOpen(false);
      },
      keywords: ['tts', 'speech', 'voice', 'screen reader', 'narrator', 'speak', 'audio'],
      badge: useNavigationStore.getState().screenReaderTTS ? 'Active' : undefined
    },
    {
      id: 'toggle-reduced-motion',
      title: isReducedMotion ? 'Enable Fluid UI Animations' : 'Enable Reduced Motion Mode',
      subtitle: isReducedMotion ? 'Restore spring transitions & layout physics' : 'Disable physics animations for high performance',
      category: 'Quick Tools',
      icon: <Sliders className="w-4 h-4 text-sky-400" />,
      action: () => {
        setReducedMotion(!isReducedMotion);
        setCommandPaletteOpen(false);
      },
      keywords: ['motion', 'reduced motion', 'animation', 'performance', 'battery', 'accessibility'],
      badge: isReducedMotion ? 'Reduced On' : 'Standard'
    }
  ];

  // Filter commands by query
  const filteredCommands = query.trim() === ''
    ? commands
    : commands.filter((cmd) => {
        const q = query.toLowerCase();
        return (
          cmd.title.toLowerCase().includes(q) ||
          cmd.subtitle.toLowerCase().includes(q) ||
          cmd.keywords.some((kw) => kw.toLowerCase().includes(q))
        );
      });

  // Handle arrow key navigation and enter selection
  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredCommands[selectedIndex];
      if (selected) {
        addRecentSearch(selected.title);
        selected.action();
      }
    }
  };

  // Auto-scroll to selected index
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div
          id="global-command-palette-portal"
          role="dialog"
          aria-modal="true"
          aria-label="Universal Search & Command Palette"
          className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 pb-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md -z-10"
            aria-hidden="true"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={NAV_MOTION_TOKENS.spring.snappy}
            className="w-full max-w-2xl bg-slate-900 text-white rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
              <Search className="w-5 h-5 text-teal-400 shrink-0" />
              <input
                ref={inputRef}
                id="command-palette-input"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDownList}
                placeholder={
                  currentLanguage === 'kn'
                    ? 'ಹುಡುಕಿ: ಧ್ವನಿ, ಸ್ಕ್ಯಾನರ್, ಕ್ಯೂ, ಬೆಡ್, ಆಸ್ಪತ್ರೆ...'
                    : 'Search triage, doctor handwriting, live beds, hospitals, schemes...'
                }
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setSelectedIndex(0);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-400 font-bold shrink-0">
                ESC to close
              </kbd>
            </div>

            {/* Quick Filter Tag Suggestions (When no query) */}
            {query === '' && (
              <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
                <span className="text-slate-500 font-medium text-[11px] shrink-0">Suggestions:</span>
                {['Voice Kiosk', 'Prescription OCR', 'Live Beds', 'Victoria Hospital', '108 Ambulance', 'ಕನ್ನಡ'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setQuery(tag);
                      setSelectedIndex(0);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Results List */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1 scrollbar-thin max-h-[50vh]"
            >
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Activity className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-300">No matching hospital services found</p>
                  <p className="text-xs text-slate-500">Try searching for "Voice", "Bed", "Prescription", "108" or "Hospital"</p>
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={cmd.id}
                      data-index={idx}
                      onClick={() => {
                        addRecentSearch(cmd.title);
                        cmd.action();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-teal-600/90 text-white shadow-lg shadow-teal-500/20'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`p-2 rounded-xl shrink-0 ${
                            isSelected ? 'bg-teal-700 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {cmd.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold truncate">{cmd.title}</span>
                            {cmd.badge && (
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                                  isSelected
                                    ? 'bg-white/20 text-white'
                                    : cmd.badge === 'SOS'
                                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}
                              >
                                {cmd.badge}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-[11px] truncate mt-0.5 ${
                              isSelected ? 'text-teal-100' : 'text-slate-400'
                            }`}
                          >
                            {cmd.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {cmd.shortcut && (
                          <kbd
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              isSelected ? 'bg-teal-700/80 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {cmd.shortcut}
                          </kbd>
                        )}
                        <CornerDownLeft
                          className={`w-4 h-4 transition-transform ${
                            isSelected ? 'text-white translate-x-0.5' : 'text-slate-600'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Quick Keys */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">↓</kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">↵</kbd>
                  to select
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>NHA ABDM Verified System</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
