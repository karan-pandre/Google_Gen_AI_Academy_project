import React from 'react';
import {
  HeartPulse,
  Mic,
  FileText,
  MonitorPlay,
  MessageSquare,
  Stethoscope,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Globe,
  Search,
  Command,
  Workflow,
  Sparkles,
  PhoneCall,
  Activity,
  Layers,
  Settings,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { NAV_MOTION_TOKENS } from '../../lib/navigationTokens';

interface NavigationSidebarProps {
  currentLanguage: 'kn' | 'hi' | 'en' | 'te' | 'ta';
  onLanguageChange: (lang: 'kn' | 'hi' | 'en' | 'te' | 'ta') => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentLanguage,
  onLanguageChange,
  activeTab,
  onTabChange
}) => {
  const {
    isSidebarCollapsed,
    toggleSidebar,
    setCommandPaletteOpen
  } = useNavigationStore();

  const navigationItems = [
    {
      id: 'voice',
      label: currentLanguage === 'kn' ? 'ಧ್ವನಿ ಕಿಯೋಸ್ಕ್' : currentLanguage === 'hi' ? 'ध्वनि कियोस्क' : 'Patient Voice Kiosk',
      shortLabel: 'Voice',
      icon: <Mic className="w-5 h-5 shrink-0" />,
      badge: null,
      category: 'Primary Care'
    },
    {
      id: 'scanner',
      label: currentLanguage === 'kn' ? 'ದಾಖಲೆ ಸ್ಕ್ಯಾನರ್' : currentLanguage === 'hi' ? 'दस्तावेज़ स्कैनर' : 'Prescription & ABHA Vision',
      shortLabel: 'Scan Rx',
      icon: <FileText className="w-5 h-5 shrink-0" />,
      badge: 'OCR',
      category: 'Primary Care'
    },
    {
      id: 'queue',
      label: currentLanguage === 'kn' ? 'ಲೈವ್ ಕ್ಯೂ & ಬೆಡ್' : 'Live OPD & Bed Monitor',
      shortLabel: 'Queue',
      icon: <MonitorPlay className="w-5 h-5 shrink-0" />,
      badge: 'Live',
      category: 'Casualty Telemetry'
    },
    {
      id: 'assistant',
      label: currentLanguage === 'kn' ? 'ಜನಾರೋಗ್ಯ ಮಿತ್ರ' : 'JanArogya Mitra AI',
      shortLabel: 'Assistant',
      icon: <MessageSquare className="w-5 h-5 shrink-0" />,
      badge: null,
      category: 'Casualty Telemetry'
    },
    {
      id: 'nurse',
      label: currentLanguage === 'kn' ? 'ನರ್ಸ್ ಸ್ಟೇಷನ್' : 'Nurse Triage Audit',
      shortLabel: 'Nurse',
      icon: <Stethoscope className="w-5 h-5 shrink-0" />,
      badge: 'Audit',
      category: 'Clinical Desk'
    },
    {
      id: 'directory',
      label: currentLanguage === 'kn' ? 'ಆಸ್ಪತ್ರೆ ಜಾಲ & ರವಾನೆ' : 'Hospital Network & Dispatch',
      shortLabel: 'Network',
      icon: <Building2 className="w-5 h-5 shrink-0" />,
      badge: 'n8n/Voice',
      category: 'Hospital Network'
    }
  ];

  return (
    <aside
      id="universal-desktop-sidebar"
      aria-label="Sidebar Navigation Rail"
      className={`hidden lg:flex flex-col bg-slate-950 text-white border-r border-slate-800/80 shrink-0 sticky top-0 h-screen transition-all duration-300 z-30 select-none ${
        isSidebarCollapsed ? 'w-[76px]' : 'w-[260px]'
      }`}
    >
      {/* Sidebar Header: Brand & Identity */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
        <div
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
          onClick={() => onTabChange('voice')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 shrink-0">
            <HeartPulse className="w-6 h-6" />
          </div>
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">
                  JANAROGYA AI
                </span>
                <span className="px-1.5 py-0.2 text-[8px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  ABDM
                </span>
              </div>
              <h2 className="text-xs font-bold text-slate-200 tracking-tight leading-none mt-0.5">
                Hospital Navigator
              </h2>
            </motion.div>
          )}
        </div>

        {/* Sidebar Collapse Toggle Button */}
        <button
          id="btn-toggle-sidebar-collapse"
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800 shrink-0"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Quick Search Spotlight Button */}
      <div className="p-3 border-b border-slate-800/60">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className={`w-full flex items-center rounded-xl bg-slate-900/90 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs transition-all shadow-inner hover:border-slate-700 cursor-pointer ${
            isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
          }`}
          title="Search (Cmd+K)"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Search className="w-4 h-4 text-teal-400 shrink-0" />
            {!isSidebarCollapsed && (
              <span className="text-slate-400 text-xs truncate">Search &amp; triage...</span>
            )}
          </div>
          {!isSidebarCollapsed && (
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400 font-bold">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* Main Navigation Item Rail */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={isSidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-xl transition-all cursor-pointer relative group text-left ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'} transition-colors`}>
                  {item.icon}
                </span>

                {!isSidebarCollapsed && (
                  <span className="text-xs font-semibold tracking-tight truncate">
                    {item.label}
                  </span>
                )}
              </div>

              {!isSidebarCollapsed && item.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badge === 'Live'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip on Collapsed Hover */}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer: Scheme Tag, Language & System Telemetry */}
      <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/60">
        {!isSidebarCollapsed ? (
          <>
            {/* Scheme Protection Tag */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>AB-PMJAY Protection</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                100% Cashless Emergency Care up to ₹5 Lakhs
              </p>
            </div>

            {/* Quick Language Dropdown */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Globe className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-[11px] font-medium">Language</span>
              </div>
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as any)}
                className="bg-transparent text-[11px] font-bold text-teal-300 focus:outline-none cursor-pointer"
              >
                <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ</option>
                <option value="hi" className="bg-slate-900 text-white">हिंदी</option>
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="te" className="bg-slate-900 text-white">తెలుగు</option>
                <option value="ta" className="bg-slate-900 text-white">தமிழ்</option>
              </select>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => toggleSidebar()}
              title="Expand for details & language"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <Globe className="w-4 h-4 text-teal-400" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
