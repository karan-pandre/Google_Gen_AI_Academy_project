import React from 'react';
import {
  Activity,
  FileText,
  Building2,
  MonitorPlay,
  MessageSquare,
  Stethoscope,
  Search,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Globe,
  Bell,
  Command,
  HeartPulse,
  Workflow,
  Mic,
  Eye,
  Contrast
} from 'lucide-react';
import { PRIMARY_NAVIGATION_ITEMS } from '../../lib/navigationConfig';
import { useNavigationStore } from '../../store/useNavigationStore';
import { NavigationItem } from '../../types/navigation';

interface UniversalDesktopNavbarProps {
  currentLanguage: 'kn' | 'hi' | 'en' | 'te' | 'ta';
  onLanguageChange: (lang: 'kn' | 'hi' | 'en' | 'te' | 'ta') => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const UniversalDesktopNavbar: React.FC<UniversalDesktopNavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  activeTab,
  onTabChange,
}) => {
  const {
    setCommandPaletteOpen,
    setMegaMenuOpen,
    isMegaMenuOpen,
    setAccessibilityModalOpen,
    highContrastMode
  } = useNavigationStore();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <HeartPulse className="w-4 h-4" />;
      case 'FileText': return <FileText className="w-4 h-4" />;
      case 'Building2': return <Building2 className="w-4 h-4" />;
      case 'Monitor': return <MonitorPlay className="w-4 h-4" />;
      case 'BarChart3': return <Stethoscope className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <header className="bg-slate-950/95 backdrop-blur-xl text-white border-b border-slate-800/80 sticky top-0 z-40 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier: Brand, Identity, Fast Search, Language & Status */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => onTabChange('voice')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 shrink-0">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-teal-400 uppercase tracking-wider">
                  JANAROGYA AI
                </span>
                <span className="px-2 py-0.2 text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  ABDM Verified
                </span>
                <span className="hidden xl:inline-block px-1.5 py-0.2 text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  SATS 2.0 Engine
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight line-clamp-1">
                Autonomous Public Hospital Navigator
              </h1>
            </div>
          </div>

          {/* Center-Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button (< md) */}
            <button
              id="nav-mobile-search-trigger"
              onClick={() => setCommandPaletteOpen(true)}
              aria-label="Open Command Palette Search"
              className="flex md:hidden p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-700/80 hover:bg-slate-800 cursor-pointer"
            >
              <Search className="w-4 h-4 text-teal-400" />
            </button>

            {/* Fast Global Command Bar Button (Cmd+K for desktop) */}
            <button
              id="nav-quick-search-trigger"
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs transition-all shadow-inner hover:border-slate-600 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-slate-400">Search triage, beds, schemes...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400 font-bold">
                ⌘K
              </kbd>
            </button>

            {/* Mega Menu Directory Button */}
            <button
              id="nav-mega-menu-trigger"
              onClick={() => setMegaMenuOpen(true)}
              title="Open full clinical services map"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs transition-all cursor-pointer"
            >
              <Workflow className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-300 text-[11px] font-semibold">Directory</span>
            </button>

            {/* Scheme Protection Tag */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300 text-[11px] font-medium">PM-JAY &amp; Arogya ₹5L Free</span>
            </div>

            {/* Accessibility Settings Trigger Button */}
            <button
              id="nav-accessibility-settings-trigger"
              onClick={() => setAccessibilityModalOpen(true)}
              title="Open Accessibility Settings (Alt+A): High Contrast, Font Size, Text-to-Speech"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                highContrastMode
                  ? 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-md'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline-block text-[11px] font-semibold">Accessibility</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-700/80">
              <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <select
                id="universal-desktop-language-select"
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer max-w-[90px] sm:max-w-none"
              >
                <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ</option>
                <option value="hi" className="bg-slate-900 text-white">हिंदी</option>
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="te" className="bg-slate-900 text-white">తెలుగు</option>
                <option value="ta" className="bg-slate-900 text-white">தமிழ்</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Smooth Sliding Tab List (Visible on Desktop / Tablet) */}
        <nav className="hidden md:flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-800/60 scrollbar-none relative">
          {/* Tab 1: Voice Kiosk */}
          <button
            id="desktop-nav-voice"
            onClick={() => onTabChange('voice')}
            className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'voice'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>
              {currentLanguage === 'kn' ? 'ಧ್ವನಿ ಕಿಯೋಸ್ಕ್ (Voice Triage)' : currentLanguage === 'hi' ? 'ध्वनि कियोस्क (Voice)' : 'Patient Voice Kiosk'}
            </span>
          </button>

          {/* Tab 2: Document Scanner */}
          <button
            id="desktop-nav-scanner"
            onClick={() => onTabChange('scanner')}
            className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>
              {currentLanguage === 'kn' ? 'ದಾಖಲೆ ಸ್ಕ್ಯಾನರ್ (Rx & ABHA)' : currentLanguage === 'hi' ? 'दस्तावेज़ स्कैनर (Rx & ABHA)' : 'Prescription & ABHA Vision'}
            </span>
          </button>

          {/* Tab 3: Live Queue */}
          <button
            id="desktop-nav-queue"
            onClick={() => onTabChange('queue')}
            className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MonitorPlay className="w-4 h-4" />
            <span>
              {currentLanguage === 'kn' ? 'ಲೈವ್ ಕ್ಯೂ & ಬೆಡ್ ಮಾನಿಟರ್' : 'Live OPD & Bed Monitor'}
            </span>
          </button>

          {/* Tab 4: Hospital Assistant */}
          <button
            id="desktop-nav-assistant"
            onClick={() => onTabChange('assistant')}
            className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'assistant'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>
              {currentLanguage === 'kn' ? 'ಜನಾರೋಗ್ಯ ಮಿತ್ರ (AI Concierge)' : 'JanArogya Mitra AI'}
            </span>
          </button>

          {/* Tab 5: Nurse Station */}
          <button
            id="desktop-nav-nurse"
            onClick={() => onTabChange('nurse')}
            className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'nurse'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>
              {currentLanguage === 'kn' ? 'ನರ್ಸ್ ಟ್ರಯೇಜ್ ಡೆಸ್ಕ್' : 'Nurse Triage Audit'}
            </span>
          </button>

          {/* Tab 6: Hospital Network & Auto-Dispatch */}
          <button
            id="desktop-nav-directory"
            onClick={() => onTabChange('directory')}
            className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-indigo-300 hover:text-white hover:bg-indigo-950/50'
            }`}
          >
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>
              {currentLanguage === 'kn' ? 'ಆಸ್ಪತ್ರೆ ಜಾಲ & ರವಾನೆ' : 'Hospital Network & Dispatch'}
            </span>
            <span className="px-1.5 py-0.2 text-[9px] font-black bg-emerald-400 text-slate-950 rounded-full">
              Voice/SMS/n8n
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
