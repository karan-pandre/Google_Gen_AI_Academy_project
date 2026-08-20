import React, { useState } from 'react';
import {
  Mic,
  FileText,
  MonitorPlay,
  MessageSquare,
  ShieldCheck,
  Building2,
  Stethoscope,
  HeartPulse,
  Share2,
  Printer,
  ChevronRight,
  Globe,
  Bell,
  Sparkles,
  Info,
  CheckCircle2,
  BedDouble,
  Pill,
  Smartphone
} from 'lucide-react';
import {
  HospitalDepartment,
  HospitalLiveStats,
  TriageResult,
  DispatchNotification,
  UrgencyLevel
} from './types';
import { INITIAL_DEPARTMENTS, INITIAL_HOSPITAL_STATS } from './data/hospitalData';
import { VoiceKiosk } from './components/VoiceKiosk';
import { DocumentScanner } from './components/DocumentScanner';
import { LiveQueueBoard } from './components/LiveQueueBoard';
import { HospitalAssistant } from './components/HospitalAssistant';
import { NurseStation } from './components/NurseStation';
import { HospitalFinderAndDispatch } from './components/HospitalFinderAndDispatch';
import { UniversalDesktopNavbar } from './components/navigation/UniversalDesktopNavbar';
import { MobileBottomBar } from './components/navigation/MobileBottomBar';
import { MobileNavigationDrawer } from './components/navigation/MobileNavigationDrawer';
import { MotionEngineProvider } from './components/navigation/MotionEngineProvider';
import { PageTransitionWrapper } from './components/navigation/PageTransitionWrapper';
import { GlobalCommandPalette } from './components/navigation/GlobalCommandPalette';
import { MegaMenuOverlay } from './components/navigation/MegaMenuOverlay';
import { NavigationBreadcrumbs } from './components/navigation/NavigationBreadcrumbs';
import { AccessibilitySettingsModal } from './components/navigation/AccessibilitySettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'voice' | 'scanner' | 'queue' | 'assistant' | 'nurse' | 'directory'>('voice');
  const [currentLanguage, setCurrentLanguage] = useState<'kn' | 'hi' | 'en' | 'te' | 'ta'>('kn');

  // URL Hash Synchronizer & Browser History Support
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validTabs: Array<'voice' | 'scanner' | 'queue' | 'assistant' | 'nurse' | 'directory'> = [
        'voice', 'scanner', 'queue', 'assistant', 'nurse', 'directory'
      ];
      if (validTabs.includes(hash as any)) {
        setActiveTab(hash as any);
      }
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (newTab: 'voice' | 'scanner' | 'queue' | 'assistant' | 'nurse' | 'directory') => {
    setActiveTab(newTab);
    if (window.location.hash !== `#${newTab}`) {
      window.history.replaceState(null, '', `#${newTab}`);
    }
  };

  // Global Numeric Jump Hotkeys (1-6) when not focused on an input
  React.useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable) {
        return;
      }

      if (e.key === '1') handleTabChange('voice');
      else if (e.key === '2') handleTabChange('scanner');
      else if (e.key === '3') handleTabChange('queue');
      else if (e.key === '4') handleTabChange('assistant');
      else if (e.key === '5') handleTabChange('nurse');
      else if (e.key === '6') handleTabChange('directory');
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, []);

  const [departments, setDepartments] = useState<HospitalDepartment[]>(INITIAL_DEPARTMENTS);
  const [hospitalStats, setHospitalStats] = useState<HospitalLiveStats>(INITIAL_HOSPITAL_STATS);
  const [tokens, setTokens] = useState<TriageResult[]>([
    {
      id: 'initial-1',
      urgencyLevel: 1,
      urgencyLabel: 'Level 1 - Immediate Resuscitation (Red)',
      urgencyColor: 'red',
      triageCategory: 'EMERGENCY',
      primaryDepartment: 'Trauma & Emergency Care',
      departmentCode: 'EMG',
      roomNumber: 'Room 001 - Ground Floor (Red Bay)',
      floorWing: 'Ground Floor, North Gate',
      tokenNumber: 'EMG-108',
      waitTimeEstimateMinutes: 0,
      extractedSymptoms: ['Acute severe retrosternal chest pain', 'Shortness of breath', 'Diaphoresis'],
      clinicalSummary: 'Patient presented with sudden onset squeezing chest pressure radiating to left shoulder. Emergency ECG and troponin initiated.',
      recommendedAction: 'Direct to Red Bay Bed 2 for immediate physician evaluation and 12-lead ECG stat.',
      nativeLanguageInstructions: 'ತುರ್ತು ಚಿಕಿತ್ಸೆ ಅಗತ್ಯವಿದೆ. ತಕ್ಷಣ ನೆಲಮಹಡಿಯ ತುರ್ತು ವಿಭಾಗದ ರೆಡ್ ಬೇ (ರೂಮ್ 001) ಗೆ ತೆರಳಿ.',
      warningSigns: ['Loss of consciousness', 'Severe cold sweats', 'Cyanosis'],
      testsRecommended: ['12-Lead ECG Stat', 'Troponin-T', 'Fingerprick RBS'],
      fastTrackEligible: true,
      abhaLinked: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      patientInfo: {
        name: 'Basavaraj Hiremath',
        age: '58',
        gender: 'Male',
        phone: '+91 98450 11223',
        abhaId: '91-3829-4411-9023',
        language: 'kn'
      }
    },
    {
      id: 'initial-2',
      urgencyLevel: 4,
      urgencyLabel: 'Level 4 - Routine OPD (Green)',
      urgencyColor: 'emerald',
      triageCategory: 'ROUTINE_OPD',
      primaryDepartment: 'General Medicine OPD',
      departmentCode: 'MED',
      roomNumber: 'Rooms 104-106, 1st Floor',
      floorWing: '1st Floor, Block A',
      tokenNumber: 'MED-214',
      waitTimeEstimateMinutes: 15,
      extractedSymptoms: ['Hypertension follow-up', 'Mild headache for 2 days'],
      clinicalSummary: 'Known hypertensive patient for routine monthly evaluation and Jan Aushadhi generic medication refill.',
      recommendedAction: 'Proceed to Room 104, 1st Floor. Check BP at triage counter.',
      nativeLanguageInstructions: 'ದಯವಿಟ್ಟು ಬ್ಲಾಕ್ ಎ, 1 ನೇ ಮಹಡಿಯ ಕೊಠಡಿ 104 ಕ್ಕೆ ತೆರಳಿ.',
      warningSigns: ['Sudden visual blurring', 'Chest pain'],
      testsRecommended: ['Blood Pressure Check', 'Fasting Blood Sugar'],
      fastTrackEligible: false,
      abhaLinked: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      patientInfo: {
        name: 'Sunita Devi',
        age: '42',
        gender: 'Female',
        phone: '+91 98765 43210',
        abhaId: '91-4521-8890-3321',
        language: 'kn'
      }
    }
  ]);

  const [notifications, setNotifications] = useState<DispatchNotification[]>([
    {
      id: 'notif-init-1',
      patientName: 'Basavaraj Hiremath',
      phone: '+91 98450 11223',
      channel: 'WhatsApp',
      tokenNumber: 'EMG-108',
      department: 'Trauma & Emergency Care',
      room: 'Room 001 (Red Bay)',
      messageText: '🚨 Victoria Hospital Emergency Token: EMG-108. Proceed immediately to Ground Floor Red Bay Room 001. ZERO WAIT TIME. Doctor informed.',
      timestamp: '08:45 AM',
      status: 'Read'
    },
    {
      id: 'notif-init-2',
      patientName: 'Sunita Devi',
      phone: '+91 98765 43210',
      channel: 'SMS',
      tokenNumber: 'MED-214',
      department: 'General Medicine OPD',
      room: 'Room 104, 1st Floor',
      messageText: '🏥 Victoria Hospital Token: MED-214. Dept: General Medicine, Room 104 (1st Floor). Est. wait: 15 mins. Track live queue: https://janarogya.gov.in/q/MED-214',
      timestamp: '08:30 AM',
      status: 'Delivered'
    }
  ]);

  const handleTokenGenerated = (newTriage: TriageResult) => {
    setTokens((prev) => [newTriage, ...prev]);

    // Update hospital live stats
    setHospitalStats((prev) => ({
      ...prev,
      queueSummary: {
        ...prev.queueSummary,
        totalTokensIssuedToday: prev.queueSummary.totalTokensIssuedToday + 1,
        emergencyTriageCount:
          newTriage.urgencyLevel <= 2
            ? prev.queueSummary.emergencyTriageCount + 1
            : prev.queueSummary.emergencyTriageCount
      }
    }));

    // Update department waiting count
    setDepartments((prev) =>
      prev.map((d) => {
        if (d.code === newTriage.departmentCode) {
          return {
            ...d,
            totalWaiting: d.totalWaiting + 1
          };
        }
        return d;
      })
    );
  };

  const handleSendNotification = async (triage: TriageResult, channel: 'WhatsApp' | 'SMS') => {
    const message =
      channel === 'WhatsApp'
        ? `🏥 *JanArogya AI - Victoria & Bowring Hospital*\n\n👤 Patient: *${triage.patientInfo.name}*\n🎫 Token Number: *${triage.tokenNumber}*\n🏢 Department: *${triage.primaryDepartment}*\n📍 Location: *${triage.roomNumber}* (${triage.floorWing})\n⏱️ Est. Wait: *${triage.waitTimeEstimateMinutes === 0 ? 'Immediate / Zero Wait' : triage.waitTimeEstimateMinutes + ' mins'}*\n\n🩺 Priority: ${triage.urgencyLabel}\n💊 *Jan Aushadhi Generic Pharmacy*: 100% Free for BPL/PM-JAY at Ground Floor Exit.\n\n🔗 Live Queue Tracker: https://janarogya.gov.in/q/${triage.tokenNumber}`
        : `Victoria Hospital Token: ${triage.tokenNumber}. Room: ${triage.roomNumber}. Est wait: ${triage.waitTimeEstimateMinutes}m. Track live queue: https://janarogya.gov.in/q/${triage.tokenNumber}`;

    const newNotif: DispatchNotification = {
      id: `notif-${Date.now()}`,
      patientName: triage.patientInfo.name,
      phone: triage.patientInfo.phone || '+91 98703 30830',
      channel,
      tokenNumber: triage.tokenNumber,
      department: triage.primaryDepartment,
      room: triage.roomNumber,
      messageText: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Delivered'
    };

    setNotifications((prev) => [newNotif, ...prev]);

    try {
      await fetch('/api/dispatch-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotif)
      });
    } catch (e) {
      console.warn('Dispatch log error:', e);
    }
  };

  const handleUpdateUrgency = (tokenId: string, newLevel: UrgencyLevel) => {
    setTokens((prev) =>
      prev.map((t) => {
        if (t.id === tokenId) {
          return {
            ...t,
            urgencyLevel: newLevel,
            urgencyLabel: `Level ${newLevel} - ${
              newLevel === 1
                ? 'Immediate Resuscitation (Red)'
                : newLevel === 2
                ? 'Emergent / Priority (Orange)'
                : newLevel === 3
                ? 'Urgent Evaluation (Yellow)'
                : 'Routine OPD (Green)'
            }`
          };
        }
        return t;
      })
    );
  };

  return (
    <MotionEngineProvider>
      <div id="janarogya-root-app" className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
        {/* Universal Advanced Desktop & Tablet Navbar */}
        <UniversalDesktopNavbar
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          activeTab={activeTab}
          onTabChange={(tabId) => handleTabChange(tabId as any)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 flex flex-col">
          {/* Dynamic Contextual Breadcrumbs */}
          <NavigationBreadcrumbs
            currentLanguage={currentLanguage}
            activeTab={activeTab}
            onTabChange={(tabId) => handleTabChange(tabId as any)}
          />

          <PageTransitionWrapper activeKey={activeTab}>
            {activeTab === 'voice' && (
              <VoiceKiosk
                currentLanguage={currentLanguage}
                onTokenGenerated={handleTokenGenerated}
                onSendNotification={handleSendNotification}
              />
            )}

            {activeTab === 'scanner' && (
              <DocumentScanner
                onTokenGeneratedFromDoc={handleTokenGenerated}
              />
            )}

            {activeTab === 'queue' && (
              <LiveQueueBoard
                departments={departments}
                stats={hospitalStats}
                recentTokens={tokens}
              />
            )}

            {activeTab === 'assistant' && (
              <HospitalAssistant
                notifications={notifications}
                currentLanguage={currentLanguage}
              />
            )}

            {activeTab === 'nurse' && (
              <NurseStation
                tokens={tokens}
                onUpdateUrgency={handleUpdateUrgency}
              />
            )}

            {activeTab === 'directory' && (
              <HospitalFinderAndDispatch
                currentLanguage={currentLanguage}
              />
            )}
          </PageTransitionWrapper>
        </main>

        {/* Persistent Mobile Bottom Navigation Dock (<= md) */}
        <MobileBottomBar
          currentLanguage={currentLanguage}
          activeTab={activeTab}
          onTabChange={(tabId) => handleTabChange(tabId as any)}
        />

        {/* Responsive Slide-Out Mobile Navigation Sheet / Drawer */}
        <MobileNavigationDrawer
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          activeTab={activeTab}
          onTabChange={(tabId) => handleTabChange(tabId as any)}
        />

        {/* Global Command Palette (⌘K Spotlight) */}
        <GlobalCommandPalette
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          activeTab={activeTab}
          onTabChange={(tabId) => handleTabChange(tabId as any)}
        />

        {/* Mega Menu Directory Overlay */}
        <MegaMenuOverlay
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          activeTab={activeTab}
          onTabChange={(tabId) => handleTabChange(tabId as any)}
        />

        {/* Global Accessibility Settings Modal */}
        <AccessibilitySettingsModal />

        {/* Global Public Hospital Footer */}
        <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-blue-400" />
              <div>
                <p className="font-bold text-slate-200">
                  Department of Health &amp; Family Welfare, Government of Karnataka
                </p>
                <p className="text-[11px] text-slate-500">
                  National Health Authority (NHA) • Ayushman Bharat Digital Mission (ABDM) Compliant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                Powered by Google Gemini 3.7 Flash
              </span>
              <span className="text-slate-600">|</span>
              <span>Emergency Ambulance: <strong className="text-white">108</strong></span>
              <span className="text-slate-600">|</span>
              <span>Blood Bank: <strong className="text-white">080-26701150</strong></span>
            </div>
          </div>
        </footer>
      </div>
    </MotionEngineProvider>
  );
}
