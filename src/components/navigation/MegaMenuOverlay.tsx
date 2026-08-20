import React, { useEffect } from 'react';
import {
  X,
  Mic,
  FileText,
  MonitorPlay,
  MessageSquare,
  Stethoscope,
  Building2,
  PhoneCall,
  ShieldCheck,
  Zap,
  Globe,
  Sparkles,
  ArrowRight,
  HeartPulse,
  Receipt,
  Workflow,
  ChevronRight,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { NAV_MOTION_TOKENS } from '../../lib/navigationTokens';

interface MegaMenuOverlayProps {
  currentLanguage: 'kn' | 'hi' | 'en' | 'te' | 'ta';
  onLanguageChange: (lang: 'kn' | 'hi' | 'en' | 'te' | 'ta') => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const MegaMenuOverlay: React.FC<MegaMenuOverlayProps> = ({
  currentLanguage,
  onLanguageChange,
  activeTab,
  onTabChange
}) => {
  const { isMegaMenuOpen, setMegaMenuOpen } = useNavigationStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMegaMenuOpen) {
        setMegaMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMegaMenuOpen, setMegaMenuOpen]);

  const handleSelect = (tabId: string) => {
    onTabChange(tabId);
    setMegaMenuOpen(false);
  };

  const sections = [
    {
      title: 'Triage & Clinical Intake',
      description: 'AI-assisted voice intake and emergency categorization',
      items: [
        {
          id: 'voice',
          title: 'Patient Voice Kiosk',
          desc: '5-language speech recognition with automatic SATS scoring',
          icon: <Mic className="w-4 h-4 text-teal-400" />
        },
        {
          id: 'scanner',
          title: 'Prescription & ABHA Vision',
          desc: 'Handwritten Rx parsing and instant ABHA queue token',
          icon: <FileText className="w-4 h-4 text-teal-400" />
        }
      ]
    },
    {
      title: 'Casualty Telemetry & Monitoring',
      description: 'Live occupancy, wait times, and bed availability',
      items: [
        {
          id: 'queue',
          title: 'Live OPD & Bed Monitor',
          desc: 'Real-time casualty queue load & ICU/HDU bed telemetry',
          icon: <MonitorPlay className="w-4 h-4 text-emerald-400" />,
          badge: 'Live'
        },
        {
          id: 'nurse',
          title: 'Nurse Station & Triage Audit',
          desc: 'Vitals review, clinical overrides & bed assignment',
          icon: <Stethoscope className="w-4 h-4 text-emerald-400" />
        }
      ]
    },
    {
      title: 'Health Schemes & Hospital Dispatch',
      description: 'Government cashless benefits & multi-hospital routing',
      items: [
        {
          id: 'assistant',
          title: 'JanArogya Mitra AI Concierge',
          desc: 'PM-JAY eligibility checker and multilingual patient guidance',
          icon: <MessageSquare className="w-4 h-4 text-indigo-400" />
        },
        {
          id: 'directory',
          title: 'Hospital Network & Auto-Dispatch',
          desc: 'Nodal doctor alerting via WhatsApp/Email & n8n webhook',
          icon: <Building2 className="w-4 h-4 text-indigo-400" />,
          badge: 'n8n/Voice'
        }
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isMegaMenuOpen && (
        <div
          id="mega-menu-overlay-portal"
          role="dialog"
          aria-modal="true"
          aria-label="Comprehensive Hospital Navigation Mega Menu"
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setMegaMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm -z-10"
            aria-hidden="true"
          />

          {/* Mega Menu Container */}
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={NAV_MOTION_TOKENS.spring.gentle}
            className="w-full max-w-5xl bg-slate-900 text-white rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white">
                    JanArogya AI Clinical Services Directory
                  </h2>
                  <p className="text-xs text-slate-400">
                    Comprehensive Autonomous Health System Map &amp; Direct Desks
                  </p>
                </div>
              </div>
              <button
                id="btn-close-mega-menu"
                onClick={() => setMegaMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close mega menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of Sections */}
            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <div>
                    <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                      {section.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{section.description}</p>
                  </div>

                  <div className="space-y-2">
                    {section.items.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                            isActive
                              ? 'bg-teal-600/90 border-teal-500 text-white shadow-md'
                              : 'bg-slate-800/60 hover:bg-slate-800 border-slate-800/80 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
                              {item.icon}
                              <span>{item.title}</span>
                            </div>
                            {item.badge && (
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                                  isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-[11px] mt-1 line-clamp-2 ${
                              isActive ? 'text-teal-100' : 'text-slate-400 group-hover:text-slate-300'
                            }`}
                          >
                            {item.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Banner */}
            <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Ayushman Bharat Digital Mission (ABDM) Compliant Architecture</span>
              </div>
              <div className="flex items-center gap-3 font-semibold">
                <a href="tel:108" className="text-red-400 hover:text-red-300 flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5" /> 108 Ambulance
                </a>
                <span className="text-slate-600">|</span>
                <a href="tel:104" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  104 Arogyavani
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
