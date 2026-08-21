import React, { useState, useEffect } from 'react';
import {
  Droplets,
  HeartPulse,
  Sparkles,
  Activity,
  Compass,
  FileText,
  ShieldCheck,
  Building2,
  PhoneCall,
  MapPin,
  ExternalLink,
  Grid,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNammaWaterStore } from './store/useNammaWaterStore';
import { useNavigationStore } from './store/useNavigationStore';
import { useAgentRegistryStore } from './store/useAgentRegistryStore';
import { UnifiedAgentHeader } from './components/navigation/UnifiedAgentHeader';
import { CivicAgentHub } from './components/hub/CivicAgentHub';
import { NewAgentSetupModal } from './components/hub/NewAgentSetupModal';
import { CustomAgentWorkspace } from './components/custom/CustomAgentWorkspace';
import { NammaWaterLanding } from './components/landing/NammaWaterLanding';
import { TankerInspectionStation } from './components/inspection/TankerInspectionStation';
import { CommunityWaterPulse } from './components/pulse/CommunityWaterPulse';
import { BengaluruWaterCanvas3D } from './components/3d/BengaluruWaterCanvas3D';
import { CivicGrievanceReporter } from './components/report/CivicGrievanceReporter';
import { VoiceKiosk } from './components/VoiceKiosk';
import { DocumentScanner } from './components/DocumentScanner';
import { LiveQueueBoard } from './components/LiveQueueBoard';
import { HospitalAssistant } from './components/HospitalAssistant';
import { NurseStation } from './components/NurseStation';
import { HospitalFinderAndDispatch } from './components/HospitalFinderAndDispatch';
import { GlobalCommandPalette } from './components/navigation/GlobalCommandPalette';
import { AccessibilitySettingsModal } from './components/navigation/AccessibilitySettingsModal';
import { BENGALURU_ZONES } from './data/bengaluruWaterData';
import { INITIAL_DEPARTMENTS, INITIAL_HOSPITAL_STATS } from './data/hospitalData';
import { TriageResult, UrgencyLevel, DispatchNotification } from './types';

export default function App() {
  // Master Active Agent State: 'hub' | 'janarogya' | 'namma-water' | custom-agent-id
  const [activeAgent, setActiveAgent] = useState<string>('hub');
  const [isNewAgentSetupOpen, setIsNewAgentSetupOpen] = useState(false);

  // JanArogya Sub-Tab State
  const [janarogyaTab, setJanarogyaTab] = useState<string>('voice');
  const [currentLanguage, setCurrentLanguage] = useState<'kn' | 'hi' | 'en' | 'te' | 'ta'>('kn');
  const [hospitalDepartments, setHospitalDepartments] = useState(INITIAL_DEPARTMENTS);
  const [hospitalStats, setHospitalStats] = useState(INITIAL_HOSPITAL_STATS);
  const [triageTokens, setTriageTokens] = useState<TriageResult[]>([
    {
      id: 'TOK-9821',
      tokenNumber: 'EMG-109',
      patientInfo: {
        name: 'Karan Pandre',
        age: '48',
        gender: 'Male',
        phone: '+91 98703 30830',
        abhaId: '91-4521-8890-3321',
        language: 'kn'
      },
      urgencyLevel: 1,
      urgencyLabel: 'Level 1 - Immediate Resuscitation',
      urgencyColor: 'red',
      triageCategory: 'EMERGENCY',
      primaryDepartment: 'Trauma & Emergency Care',
      departmentCode: 'EMG',
      roomNumber: 'Room 001',
      floorWing: 'Ground Floor, North Gate (Red Bay)',
      waitTimeEstimateMinutes: 0,
      extractedSymptoms: ['Severe Chest Pressure', 'Left Arm Radiating Pain', 'Profuse Sweating'],
      clinicalSummary: 'Sudden retrosternal crushing pain with shortness of breath for 45 mins. Suspected Acute Coronary Syndrome.',
      recommendedAction: 'Immediate triage in resuscitation bay. 12-lead ECG and Troponin panel stat.',
      nativeLanguageInstructions: 'ತಕ್ಷಣ ತುರ್ತು ಚಿಕಿತ್ಸಾ ಕೊಠಡಿ 001 ಕ್ಕೆ ತೆರಳಿ. ಇಸಿಜಿ ತಪಾಸಣೆ ಮಾಡಲಾಗುತ್ತದೆ.',
      warningSigns: ['Hypotension', 'Syncope'],
      testsRecommended: ['12-Lead ECG', 'Serum Troponin-I', 'Chest X-Ray Portable'],
      fastTrackEligible: true,
      abhaLinked: true,
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 'TOK-9820',
      tokenNumber: 'MED-215',
      patientInfo: {
        name: 'Sunita Gowda',
        age: '38',
        gender: 'Female',
        phone: '+91 98450 12345',
        abhaId: '91-3312-9901-4456',
        language: 'kn'
      },
      urgencyLevel: 3,
      urgencyLabel: 'Level 3 - Urgent OPD (<30m)',
      urgencyColor: 'yellow',
      triageCategory: 'PRIORITY',
      primaryDepartment: 'General Medicine OPD',
      departmentCode: 'MED',
      roomNumber: 'Room 104',
      floorWing: '1st Floor, Block A',
      waitTimeEstimateMinutes: 15,
      extractedSymptoms: ['High Fever (102.4°F)', 'Severe Bodyache', 'Chills'],
      clinicalSummary: '3 days intermittent fever with shivering, headache, and loss of appetite.',
      recommendedAction: 'General medicine physician consult for acute febrile illness evaluation.',
      nativeLanguageInstructions: 'ಮೊದಲ ಮಹಡಿಯ ಕೊಠಡಿ 104 ರಲ್ಲಿ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.',
      warningSigns: ['Dehydration'],
      testsRecommended: ['Complete Blood Count (CBC)', 'Malaria Smear', 'Dengue NS1 Antigen'],
      fastTrackEligible: false,
      abhaLinked: true,
      timestamp: new Date(Date.now() - 15 * 60000).toLocaleTimeString()
    }
  ]);
  const [dispatchNotifications, setDispatchNotifications] = useState<DispatchNotification[]>([
    {
      id: 'DISP-001',
      patientName: 'Karan Pandre',
      phone: '+91 98703 30830',
      channel: 'WhatsApp',
      tokenNumber: 'EMG-109',
      department: 'Trauma & Emergency Care',
      room: 'Room 001',
      messageText: 'JanArogya Token EMG-109 issued for Trauma Care (Room 001). Cashless PM-JAY verified.',
      timestamp: new Date().toLocaleTimeString(),
      status: 'Delivered'
    }
  ]);

  // Namma Water Store
  const {
    activeView: nammaWaterTab,
    setActiveView: setNammaWaterTab,
    selectedZone,
    setSelectedZoneId,
    setCommandPaletteOpen,
    setAccessibilityModalOpen,
    highContrastMode,
    fontSizeScale
  } = useNammaWaterStore();

  // Agent Registry Store
  const { agents, activeCustomSubRoutes, setActiveCustomSubRoute } = useAgentRegistryStore();

  // Current custom subroute state
  const customSubRoute = activeCustomSubRoutes[activeAgent] || '';

  // Handlers for JanArogya
  const handleTokenGenerated = (newTriage: TriageResult) => {
    setTriageTokens((prev) => [newTriage, ...prev]);
    setHospitalDepartments((prev) =>
      prev.map((dept) =>
        dept.name.includes(newTriage.primaryDepartment.split(' ')[0])
          ? { ...dept, totalWaiting: dept.totalWaiting + 1, currentToken: newTriage.tokenNumber }
          : dept
      )
    );
  };

  const handleSendNotification = (triage: TriageResult, channel: 'WhatsApp' | 'SMS') => {
    const newNotif: DispatchNotification = {
      id: `DISP-${Date.now()}`,
      patientName: triage.patientInfo.name,
      phone: triage.patientInfo.phone,
      channel,
      tokenNumber: triage.tokenNumber,
      department: triage.primaryDepartment,
      room: triage.roomNumber,
      messageText: `JanArogya Token ${triage.tokenNumber} issued for ${triage.primaryDepartment} (${triage.roomNumber}).`,
      timestamp: new Date().toLocaleTimeString(),
      status: 'Sent'
    };
    setDispatchNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateUrgency = (tokenId: string, newLevel: UrgencyLevel) => {
    setTriageTokens((prev) =>
      prev.map((t) => (t.id === tokenId ? { ...t, urgencyLevel: newLevel } : t))
    );
  };

  // Direct Unified Navigation Router
  const handleNavigate = (agentId: string, subTab?: string) => {
    setActiveAgent(agentId);
    if (agentId === 'janarogya' && subTab) {
      setJanarogyaTab(subTab);
    } else if (agentId === 'namma-water' && subTab) {
      setNammaWaterTab(subTab as any);
    } else if (subTab) {
      setActiveCustomSubRoute(agentId, subTab);
    }
  };

  // Keyboard Shortcuts (H for Hub, J for JanArogya, W for Namma Water, Cmd+K for Command Bar, Alt+A for Accessibility)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setAccessibilityModalOpen(true);
        return;
      }

      if (e.key.toLowerCase() === 'h') {
        setActiveAgent('hub');
      } else if (e.key.toLowerCase() === 'j') {
        setActiveAgent('janarogya');
      } else if (e.key.toLowerCase() === 'w') {
        setActiveAgent('namma-water');
      }

      // Contextual Sub-tab numbers 1-6
      if (activeAgent === 'janarogya') {
        if (e.key === '1') setJanarogyaTab('voice');
        else if (e.key === '2') setJanarogyaTab('scanner');
        else if (e.key === '3') setJanarogyaTab('queue');
        else if (e.key === '4') setJanarogyaTab('assistant');
        else if (e.key === '5') setJanarogyaTab('nurse');
        else if (e.key === '6') setJanarogyaTab('directory');
      } else if (activeAgent === 'namma-water') {
        if (e.key === '1') setNammaWaterTab('landing');
        else if (e.key === '2') setNammaWaterTab('inspect');
        else if (e.key === '3') setNammaWaterTab('pulse');
        else if (e.key === '4') setNammaWaterTab('map3d');
        else if (e.key === '5') setNammaWaterTab('grievance');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeAgent, setCommandPaletteOpen, setAccessibilityModalOpen, setNammaWaterTab]);

  const fontScaleClass =
    fontSizeScale === 'large'
      ? 'text-[1.08rem]'
      : fontSizeScale === 'extra-large'
      ? 'text-[1.18rem]'
      : 'text-base';

  // Find active custom agent definition if not hub/janarogya/namma-water
  const currentCustomAgent =
    activeAgent !== 'hub' && activeAgent !== 'janarogya' && activeAgent !== 'namma-water'
      ? agents.find((a) => a.id === activeAgent)
      : null;

  return (
    <div
      className={`min-h-screen bg-[#040810] text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950 ${fontScaleClass} ${
        highContrastMode ? 'high-contrast-mode' : ''
      }`}
    >
      {/* Universal Top Header with Agent Switcher and Contextual Tabs */}
      <UnifiedAgentHeader
        activeAgent={activeAgent}
        onSelectAgent={(agentId, subTab) => handleNavigate(agentId, subTab)}
        janarogyaTab={janarogyaTab}
        onJanarogyaTabChange={setJanarogyaTab}
        nammaWaterTab={nammaWaterTab}
        onNammaWaterTabChange={setNammaWaterTab}
        customTab={customSubRoute}
        onCustomTabChange={(subId) => setActiveCustomSubRoute(activeAgent, subId)}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onOpenNewAgentSetup={() => setIsNewAgentSetupOpen(true)}
      />

      {/* Main Workspace with Smooth Framer-Motion Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {/* VIEW 1: CENTRAL HUB / GATEWAY */}
          {activeAgent === 'hub' && (
            <motion.div
              key="hub"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <CivicAgentHub
                onSelectAgent={handleNavigate}
                onOpenCommandPalette={() => setCommandPaletteOpen(true)}
                onOpenNewAgentSetup={() => setIsNewAgentSetupOpen(true)}
              />
            </motion.div>
          )}

          {/* VIEW 2: JANAROGYA AI WORKSPACE */}
          {activeAgent === 'janarogya' && (
            <motion.div
              key="janarogya"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="space-y-8 animate-fade-in"
            >
              {/* Agent Header Breadcrumb */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveAgent('hub')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    <span>AI Agents Hub</span>
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <motion.span
                        layoutId="active-workspace-badge"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-950 text-teal-300 border border-teal-700/60 uppercase"
                      >
                        JANAROGYA AI
                      </motion.span>
                      <span className="text-xs text-slate-400 font-mono">Karnataka Health &amp; ABDM</span>
                    </div>
                    <motion.h2
                      layoutId="active-workspace-title"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      className="text-2xl font-bold text-white tracking-tight mt-0.5"
                    >
                      Autonomous Public Hospital Navigator &amp; SATS Triage
                    </motion.h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-slate-300 font-bold">12 Hospitals Live</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                    <span>Emergency: <strong className="text-teal-400 font-mono">104 / 108</strong></span>
                  </div>
                </div>
              </div>

              {/* Sub-Views for JanArogya */}
              {janarogyaTab === 'voice' && (
                <VoiceKiosk
                  currentLanguage={currentLanguage}
                  onTokenGenerated={handleTokenGenerated}
                  onSendNotification={handleSendNotification}
                />
              )}

              {janarogyaTab === 'scanner' && (
                <DocumentScanner onTokenGeneratedFromDoc={handleTokenGenerated} />
              )}

              {janarogyaTab === 'queue' && (
                <LiveQueueBoard
                  departments={hospitalDepartments}
                  stats={hospitalStats}
                  recentTokens={triageTokens}
                />
              )}

              {janarogyaTab === 'assistant' && (
                <HospitalAssistant
                  notifications={dispatchNotifications}
                  currentLanguage={currentLanguage}
                />
              )}

              {janarogyaTab === 'nurse' && (
                <NurseStation
                  tokens={triageTokens}
                  onUpdateUrgency={handleUpdateUrgency}
                />
              )}

              {janarogyaTab === 'directory' && (
                <HospitalFinderAndDispatch currentLanguage={currentLanguage} />
              )}
            </motion.div>
          )}

          {/* VIEW 3: NAMMA WATER AI WORKSPACE */}
          {activeAgent === 'namma-water' && (
            <motion.div
              key="namma-water"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="space-y-8 animate-fade-in"
            >
              {/* Agent Header Breadcrumb */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveAgent('hub')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    <span>AI Agents Hub</span>
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <motion.span
                        layoutId="active-workspace-badge"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-950 text-cyan-300 border border-cyan-700/60 uppercase"
                      >
                        NAMMA WATER AI
                      </motion.span>
                      <span className="text-xs text-slate-400 font-mono">BWSSB &amp; DC Order Enforced</span>
                    </div>
                    <motion.h2
                      layoutId="active-workspace-title"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      className="text-2xl font-bold text-white tracking-tight mt-0.5"
                    >
                      Bengaluru Groundwater &amp; Tanker Price Intelligence
                    </motion.h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-slate-300 font-bold">8 BBMP Zones</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                    <span>Helpline: <strong className="text-cyan-400 font-mono">1916</strong></span>
                  </div>
                </div>
              </div>

              {/* Sub-Views for Namma Water */}
              {nammaWaterTab === 'landing' && <NammaWaterLanding />}

              {nammaWaterTab === 'inspect' && <TankerInspectionStation />}

              {nammaWaterTab === 'pulse' && <CommunityWaterPulse />}

              {nammaWaterTab === 'map3d' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                        SPATIAL CIVIC RADAR
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                        Bengaluru 3D Water &amp; Tanker Grid
                      </h2>
                      <p className="text-xs text-slate-400">
                        Real-time visualization of Cauvery network flow, borehole aquifer stress, and private tanker pricing across all 8 zones.
                      </p>
                    </div>

                    {/* Zone Filter Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {BENGALURU_ZONES.map((z) => (
                        <button
                          key={z.id}
                          onClick={() => setSelectedZoneId(z.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selectedZone?.id === z.id
                              ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {z.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <BengaluruWaterCanvas3D compact={false} />
                </div>
              )}

              {nammaWaterTab === 'grievance' && <CivicGrievanceReporter />}
            </motion.div>
          )}

          {/* VIEW 4: CUSTOM CONFIGURED OR ROADMAP AGENT WORKSPACE */}
          {currentCustomAgent && (
            <motion.div
              key={currentCustomAgent.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <CustomAgentWorkspace
                agent={currentCustomAgent}
                onReturnToHub={() => setActiveAgent('hub')}
                activeSubRouteId={customSubRoute}
                onSubRouteChange={(subId) => setActiveCustomSubRoute(currentCustomAgent.id, subId)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Modals & Palettes */}
      <GlobalCommandPalette
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onNavigate={handleNavigate}
        onOpenNewAgentSetup={() => setIsNewAgentSetupOpen(true)}
      />
      <AccessibilitySettingsModal />

      {/* New Agent Setup Modal */}
      <NewAgentSetupModal
        isOpen={isNewAgentSetupOpen}
        onClose={() => setIsNewAgentSetupOpen(false)}
        onAgentCreated={(createdId) => {
          setIsNewAgentSetupOpen(false);
          handleNavigate(createdId);
        }}
      />

      {/* Unified Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-500 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-teal-400" />
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="font-bold text-slate-300">NAMMA BENGALURU CIVIC AI SUITE</span>
            <span>• JanArogya, Namma Water &amp; Open Civic Registry</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] flex-wrap justify-center">
            <span>Health Helpline: <strong className="text-teal-400 font-mono">104 / 108</strong></span>
            <span>•</span>
            <span>BWSSB Water: <strong className="text-cyan-400 font-mono">1916</strong></span>
            <span>•</span>
            <span>BESCOM Power: <strong className="text-purple-400 font-mono">1912</strong></span>
            <span>•</span>
            <span>Sanitation Helpline: <strong className="text-emerald-400 font-mono">1533</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
