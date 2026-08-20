import React, { useEffect } from 'react';
import {
  X,
  Mic,
  FileText,
  MonitorPlay,
  MessageSquare,
  Stethoscope,
  Building2,
  Workflow,
  ShieldCheck,
  Globe,
  PhoneCall,
  Search,
  ChevronRight,
  ExternalLink,
  HeartPulse,
  Receipt,
  Sparkles,
  Command
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { NAV_MOTION_TOKENS } from '../../lib/navigationTokens';

interface MobileNavigationDrawerProps {
  currentLanguage: 'kn' | 'hi' | 'en' | 'te' | 'ta';
  onLanguageChange: (lang: 'kn' | 'hi' | 'en' | 'te' | 'ta') => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({
  currentLanguage,
  onLanguageChange,
  activeTab,
  onTabChange
}) => {
  const {
    isMobileDrawerOpen,
    setMobileDrawerOpen,
    setCommandPaletteOpen
  } = useNavigationStore();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileDrawerOpen, setMobileDrawerOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileDrawerOpen]);

  const handleSelectTab = (tabId: string) => {
    onTabChange(tabId);
    setMobileDrawerOpen(false);
  };

  const navGroups = [
    {
      title: currentLanguage === 'kn' ? 'ಮುಖ್ಯ ಸೇವೆಗಳು' : 'Core Clinical Services',
      items: [
        {
          id: 'voice',
          label: currentLanguage === 'kn' ? 'ಧ್ವನಿ ಕಿಯೋಸ್ಕ್ (Voice Intake)' : 'Patient Voice Intake',
          desc: 'Speech transcription in 5 Indian languages with instant SATS scoring',
          icon: <Mic className="w-5 h-5 text-teal-400" />
        },
        {
          id: 'scanner',
          label: currentLanguage === 'kn' ? 'ದಾಖಲೆ ಸ್ಕ್ಯಾನರ್ (Prescription & ABHA)' : 'Prescription & ABHA Scanner',
          desc: 'OCR handwriting parser and generic medicine substitution',
          icon: <FileText className="w-5 h-5 text-teal-400" />
        },
        {
          id: 'queue',
          label: currentLanguage === 'kn' ? 'ಲೈವ್ ಕ್ಯೂ & ಬೆಡ್ ಮಾನಿಟರ್' : 'Live OPD & Bed Telemetry',
          desc: 'Real-time casualty queue load and hospital bed tracker',
          icon: <MonitorPlay className="w-5 h-5 text-teal-400" />,
          badge: 'Live'
        },
        {
          id: 'assistant',
          label: currentLanguage === 'kn' ? 'ಜನಾರೋಗ್ಯ ಮಿತ್ರ (AI Concierge)' : 'JanArogya Mitra AI',
          desc: 'Scheme eligibility calculator and multilingual patient navigator',
          icon: <MessageSquare className="w-5 h-5 text-teal-400" />
        },
        {
          id: 'nurse',
          label: currentLanguage === 'kn' ? 'ನರ್ಸ್ ಸ್ಟೇಷನ್ (Triage Audit)' : 'Nurse Triage Audit Station',
          desc: 'SATS score review and casualty bed allocation console',
          icon: <Stethoscope className="w-5 h-5 text-teal-400" />
        },
        {
          id: 'directory',
          label: currentLanguage === 'kn' ? 'ಆಸ್ಪತ್ರೆ ಜಾಲ & ರವಾನೆ' : 'Hospital Network & Dispatch',
          desc: 'Direct WhatsApp/Email nodal notification & n8n pipeline',
          icon: <Building2 className="w-5 h-5 text-indigo-400" />,
          badge: 'n8n/Voice'
        }
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isMobileDrawerOpen && (
        <div id="mobile-drawer-portal" className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm -z-10"
            aria-hidden="true"
          />

          {/* Slide-Up Bottom Sheet / Drawer */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={NAV_MOTION_TOKENS.spring.drawer}
            className="bg-slate-900 text-white rounded-t-3xl border-t border-slate-700/80 max-h-[88vh] flex flex-col shadow-2xl overflow-hidden pb-[env(safe-area-inset-bottom,16px)]"
          >
            {/* Grab Handle */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
            </div>

            {/* Drawer Header */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white leading-tight">JanArogya Navigation</h2>
                  <p className="text-[11px] text-slate-400">Autonomous Public Health Engine</p>
                </div>
              </div>

              <button
                id="btn-close-mobile-drawer"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Search Bar */}
            <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setTimeout(() => setCommandPaletteOpen(true), 150);
                }}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-300 text-xs flex items-center justify-between hover:bg-slate-800 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-teal-400" />
                  <span>Search hospitals, triage, schemes...</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  <Command className="w-3 h-3" /> K
                </div>
              </button>
            </div>

            {/* Scrollable Navigation List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
              {navGroups.map((group, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    {group.title}
                  </div>
                  <div className="space-y-1.5">
                    {group.items.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectTab(item.id)}
                          className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer text-left ${
                            isActive
                              ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/25'
                              : 'bg-slate-800/60 hover:bg-slate-800 text-slate-200 border border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div className={`p-2 rounded-xl ${isActive ? 'bg-teal-700/80 text-white' : 'bg-slate-900 text-slate-300'}`}>
                              {item.icon}
                            </div>
                            <div>
                              <div className="text-xs font-bold leading-tight flex items-center gap-2">
                                {item.label}
                                {item.badge && (
                                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-300'
                                  }`}>
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <div className={`text-[11px] line-clamp-1 mt-0.5 ${isActive ? 'text-teal-100' : 'text-slate-400'}`}>
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Language Selection in Drawer */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Globe className="w-4 h-4 text-teal-400" />
                  <span>Choose Voice &amp; Display Language</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                  {[
                    { id: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                    { id: 'hi', label: 'हिंदी (Hindi)' },
                    { id: 'en', label: 'English' },
                    { id: 'te', label: 'తెలుగు (Telugu)' },
                    { id: 'ta', label: 'தமிழ் (Tamil)' },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => onLanguageChange(lang.id as any)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        currentLanguage === lang.id
                          ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emergency Helplines & Fast-Dial */}
              <div className="p-3.5 rounded-2xl bg-red-950/30 border border-red-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-red-300">
                  <span className="flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4 text-red-400" />
                    Emergency Helpline
                  </span>
                  <span className="text-[10px] font-mono text-red-400 bg-red-900/30 px-2 py-0.5 rounded">Toll-Free 24/7</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href="tel:108"
                    className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-center flex items-center justify-center gap-1 shadow"
                  >
                    108 Ambulance
                  </a>
                  <a
                    href="tel:104"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-300 font-bold text-center flex items-center justify-center gap-1 border border-red-900/40"
                  >
                    104 Arogyavani
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
