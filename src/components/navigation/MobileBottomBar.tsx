import React from 'react';
import {
  Mic,
  FileText,
  MonitorPlay,
  Building2,
  Menu,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { NAV_MOTION_TOKENS } from '../../lib/navigationTokens';

interface MobileBottomBarProps {
  currentLanguage: 'kn' | 'hi' | 'en' | 'te' | 'ta';
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  currentLanguage,
  activeTab,
  onTabChange
}) => {
  const { isMobileDrawerOpen, setMobileDrawerOpen } = useNavigationStore();

  const labels = {
    voice: currentLanguage === 'kn' ? 'ಧ್ವನಿ' : currentLanguage === 'hi' ? 'ध्वनि' : 'Voice',
    scanner: currentLanguage === 'kn' ? 'ಸ್ಕ್ಯಾನ್' : currentLanguage === 'hi' ? 'स्कैन' : 'Scan Rx',
    queue: currentLanguage === 'kn' ? 'ಕ್ಯೂ' : currentLanguage === 'hi' ? 'कतार' : 'Queue',
    hospitals: currentLanguage === 'kn' ? 'ಆಸ್ಪತ್ರೆ' : currentLanguage === 'hi' ? 'अस्पताल' : 'Hospitals',
    menu: currentLanguage === 'kn' ? 'ಮೆನು' : currentLanguage === 'hi' ? 'मेनू' : 'More'
  };

  return (
    <nav
      id="mobile-persistent-bottom-dock"
      aria-label="Mobile Navigation Dock"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 px-2 py-1 pb-[env(safe-area-inset-bottom,8px)] shadow-[0_-8px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto relative h-14">
        {/* Item 1: Prescription Scanner */}
        <button
          id="mobile-dock-tab-scanner"
          onClick={() => onTabChange('scanner')}
          aria-label={labels.scanner}
          aria-current={activeTab === 'scanner' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[48px] min-w-[48px] rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'scanner' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative p-1">
            <FileText className="w-5 h-5" />
            {activeTab === 'scanner' && (
              <motion.div
                layoutId="mobile-dock-active-pill"
                className="absolute inset-0 bg-teal-500/15 rounded-lg -z-10"
                transition={NAV_MOTION_TOKENS.spring.snappy}
              />
            )}
          </div>
          <span className="text-[10px] tracking-tight whitespace-nowrap">{labels.scanner}</span>
        </button>

        {/* Item 2: Live Queue Board */}
        <button
          id="mobile-dock-tab-queue"
          onClick={() => onTabChange('queue')}
          aria-label={labels.queue}
          aria-current={activeTab === 'queue' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[48px] min-w-[48px] rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'queue' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative p-1">
            <MonitorPlay className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
            {activeTab === 'queue' && (
              <motion.div
                layoutId="mobile-dock-active-pill"
                className="absolute inset-0 bg-teal-500/15 rounded-lg -z-10"
                transition={NAV_MOTION_TOKENS.spring.snappy}
              />
            )}
          </div>
          <span className="text-[10px] tracking-tight whitespace-nowrap">{labels.queue}</span>
        </button>

        {/* Center Primary Action: Voice Kiosk Trigger (Elevated FAB) */}
        <div className="flex items-center justify-center px-1 -mt-4">
          <button
            id="mobile-dock-fab-voice"
            onClick={() => onTabChange('voice')}
            aria-label="Start Voice Triage"
            className={`w-13 h-13 rounded-2xl flex flex-col items-center justify-center shadow-lg transition-all cursor-pointer active:scale-95 ${
              activeTab === 'voice'
                ? 'bg-gradient-to-tr from-teal-500 via-teal-600 to-emerald-500 text-white shadow-teal-500/40 ring-4 ring-slate-950 scale-105'
                : 'bg-gradient-to-tr from-teal-600 to-indigo-600 text-white shadow-teal-600/30 ring-3 ring-slate-950'
            }`}
          >
            <Mic className="w-6 h-6" />
            <span className="text-[9px] font-black tracking-wider uppercase mt-0.5">{labels.voice}</span>
          </button>
        </div>

        {/* Item 4: Hospital Network & Dispatch */}
        <button
          id="mobile-dock-tab-hospitals"
          onClick={() => onTabChange('directory')}
          aria-label={labels.hospitals}
          aria-current={activeTab === 'directory' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[48px] min-w-[48px] rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'directory' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative p-1">
            <Building2 className="w-5 h-5" />
            {activeTab === 'directory' && (
              <motion.div
                layoutId="mobile-dock-active-pill"
                className="absolute inset-0 bg-indigo-500/15 rounded-lg -z-10"
                transition={NAV_MOTION_TOKENS.spring.snappy}
              />
            )}
          </div>
          <span className="text-[10px] tracking-tight whitespace-nowrap">{labels.hospitals}</span>
        </button>

        {/* Item 5: Extended Menu Drawer Trigger */}
        <button
          id="mobile-dock-trigger-drawer"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open Full Navigation Menu"
          aria-expanded={isMobileDrawerOpen}
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[48px] min-w-[48px] rounded-xl transition-all cursor-pointer ${
            isMobileDrawerOpen ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="p-1">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight whitespace-nowrap">{labels.menu}</span>
        </button>
      </div>
    </nav>
  );
};
