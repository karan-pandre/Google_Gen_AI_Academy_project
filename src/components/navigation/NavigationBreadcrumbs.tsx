import React from 'react';
import {
  ChevronRight,
  Home,
  Mic,
  FileText,
  MonitorPlay,
  MessageSquare,
  Stethoscope,
  Building2,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  Sliders
} from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';

interface NavigationBreadcrumbsProps {
  currentLanguage: 'kn' | 'hi' | 'en' | 'te' | 'ta';
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const NavigationBreadcrumbs: React.FC<NavigationBreadcrumbsProps> = ({
  currentLanguage,
  activeTab,
  onTabChange
}) => {
  const { isReducedMotion, setReducedMotion, setCommandPaletteOpen } = useNavigationStore();

  const getBreadcrumbData = () => {
    switch (activeTab) {
      case 'voice':
        return {
          section: currentLanguage === 'kn' ? 'ತುರ್ತು ಚಿಕಿತ್ಸೆ ಮತ್ತು ಟ್ರಯೇಜ್' : 'Emergency & Clinical Triage',
          page: currentLanguage === 'kn' ? 'ಧ್ವನಿ ಕಿಯೋಸ್ಕ್ (Voice Intake)' : 'Patient Voice Intake Kiosk',
          icon: <Mic className="w-3.5 h-3.5 text-teal-500" />,
          status: 'Active Intake'
        };
      case 'scanner':
        return {
          section: currentLanguage === 'kn' ? 'ದಾಖಲೆ ವಿಶ್ಲೇಷಣೆ' : 'Document Intelligence',
          page: currentLanguage === 'kn' ? 'ದಾಖಲೆ ಸ್ಕ್ಯಾನರ್ (Prescription & ABHA)' : 'Prescription & ABHA Vision OCR',
          icon: <FileText className="w-3.5 h-3.5 text-blue-500" />,
          status: 'Vision OCR Ready'
        };
      case 'queue':
        return {
          section: currentLanguage === 'kn' ? 'ಆಸ್ಪತ್ರೆ ಸ್ಥಿತಿ' : 'Hospital Telemetry',
          page: currentLanguage === 'kn' ? 'ಲೈವ್ ಕ್ಯೂ & ಬೆಡ್ ಮಾನಿಟರ್' : 'Live OPD & Bed Telemetry',
          icon: <MonitorPlay className="w-3.5 h-3.5 text-emerald-500" />,
          status: 'Live Realtime'
        };
      case 'assistant':
        return {
          section: currentLanguage === 'kn' ? 'ರೋಗಿ ಸಹಾಯಕ' : 'Patient Services',
          page: currentLanguage === 'kn' ? 'ಜನಾರೋಗ್ಯ ಮಿತ್ರ (AI Concierge)' : 'JanArogya Mitra AI Concierge',
          icon: <MessageSquare className="w-3.5 h-3.5 text-purple-500" />,
          status: 'Scheme Calculator'
        };
      case 'nurse':
        return {
          section: currentLanguage === 'kn' ? 'ವೈದ್ಯಕೀಯ ಮೇಲ್ವಿಚಾರಣೆ' : 'Clinical Verification',
          page: currentLanguage === 'kn' ? 'ನರ್ಸ್ ಸ್ಟೇಷನ್ (Triage Audit)' : 'Nurse Triage Audit Desk',
          icon: <Stethoscope className="w-3.5 h-3.5 text-amber-500" />,
          status: 'Audit Console'
        };
      case 'directory':
        return {
          section: currentLanguage === 'kn' ? 'ರಾಜ್ಯ ಆಸ್ಪತ್ರೆ ಜಾಲ' : 'State Health Network',
          page: currentLanguage === 'kn' ? 'ಆಸ್ಪತ್ರೆ ಜಾಲ & ರವಾನೆ' : 'Hospital Network & Auto-Dispatch',
          icon: <Building2 className="w-3.5 h-3.5 text-indigo-500" />,
          status: 'n8n & Voice Active'
        };
      default:
        return {
          section: 'Public Health Complex',
          page: 'Hospital Navigator',
          icon: <Home className="w-3.5 h-3.5 text-teal-500" />,
          status: 'Ready'
        };
    }
  };

  const crumb = getBreadcrumbData();

  return (
    <nav
      id="navigation-breadcrumbs-bar"
      aria-label="Breadcrumb"
      className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl px-4 py-2.5 mb-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
    >
      {/* Breadcrumb Trail */}
      <ol className="flex items-center gap-1.5 flex-wrap text-slate-500 font-medium">
        <li className="flex items-center gap-1.5">
          <button
            onClick={() => onTabChange('voice')}
            className="hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>JanArogya</span>
          </button>
        </li>

        <li className="flex items-center gap-1.5 text-slate-400">
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600">{crumb.section}</span>
        </li>

        <li className="flex items-center gap-1.5 text-slate-400">
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="flex items-center gap-1.5 font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
            {crumb.icon}
            <span>{crumb.page}</span>
          </span>
        </li>
      </ol>

      {/* Right Telemetry Badges & Quick Toggles */}
      <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto text-[11px]">
        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{crumb.status}</span>
        </div>

        {/* Reduced Motion Toggle Button */}
        <button
          onClick={() => setReducedMotion(!isReducedMotion)}
          title={isReducedMotion ? 'Enable standard animations' : 'Enable reduced motion mode'}
          className={`px-2 py-0.5 rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${
            isReducedMotion
              ? 'bg-sky-50 text-sky-700 border-sky-300 font-bold'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3 h-3 text-slate-500" />
          <span>{isReducedMotion ? 'Motion: Off' : 'Motion: Smooth'}</span>
        </button>
      </div>
    </nav>
  );
};
