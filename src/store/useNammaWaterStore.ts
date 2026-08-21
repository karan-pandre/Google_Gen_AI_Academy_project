import { create } from 'zustand';
import {
  AIProcessState,
  BengaluruZoneData,
  CivicCommunityReport,
  NammaWaterCityStats,
  TankerInspectionResult
} from '../types/nammaWater';
import { BENGALURU_ZONES, CITYWIDE_STATS, SAMPLE_RECENT_COMMUNITY_REPORTS } from '../data/bengaluruWaterData';

interface NammaWaterState {
  activeView: 'landing' | 'inspect' | 'pulse' | 'map3d' | 'grievance';
  selectedZoneId: string;
  selectedZone: BengaluruZoneData | null;
  aiProcessState: AIProcessState;
  aiProcessStep: number;
  aiProcessMessage: string;
  
  // Active Inspection & History
  currentInspection: TankerInspectionResult | null;
  inspectionHistory: TankerInspectionResult[];
  
  // Community reports
  communityReports: CivicCommunityReport[];
  cityStats: NammaWaterCityStats;
  
  // 3D Canvas camera & interaction
  spatialFocusZoneId: string | null;
  is3dPaused: boolean;
  graphicsQuality: 'high' | 'medium' | 'low';
  
  // Accessibility & UI
  isCommandPaletteOpen: boolean;
  isAccessibilityModalOpen: boolean;
  highContrastMode: boolean;
  fontSizeScale: 'normal' | 'large' | 'extra-large';
  screenReaderTTS: boolean;
  isReducedMotion: boolean;

  // Actions
  setActiveView: (view: 'landing' | 'inspect' | 'pulse' | 'map3d' | 'grievance') => void;
  setSelectedZoneId: (zoneId: string) => void;
  setSpatialFocusZoneId: (zoneId: string | null) => void;
  setAiProcessState: (state: AIProcessState, step?: number, message?: string) => void;
  setCurrentInspection: (inspection: TankerInspectionResult | null) => void;
  addInspectionToHistory: (inspection: TankerInspectionResult) => void;
  addCommunityReport: (report: CivicCommunityReport) => void;
  upvoteCommunityReport: (reportId: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setAccessibilityModalOpen: (open: boolean) => void;
  setHighContrastMode: (enabled: boolean) => void;
  setFontSizeScale: (scale: 'normal' | 'large' | 'extra-large') => void;
  setScreenReaderTTS: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  speakText: (text: string) => void;
}

export const useNammaWaterStore = create<NammaWaterState>((set, get) => ({
  activeView: 'landing',
  selectedZoneId: 'zone-sarjapur',
  selectedZone: BENGALURU_ZONES.find((z) => z.id === 'zone-sarjapur') || BENGALURU_ZONES[0],
  aiProcessState: 'IDLE',
  aiProcessStep: 0,
  aiProcessMessage: 'Ready for tanker inspection',
  
  currentInspection: null,
  inspectionHistory: [],
  communityReports: SAMPLE_RECENT_COMMUNITY_REPORTS,
  cityStats: CITYWIDE_STATS,
  
  spatialFocusZoneId: 'zone-sarjapur',
  is3dPaused: false,
  graphicsQuality: 'high',
  
  isCommandPaletteOpen: false,
  isAccessibilityModalOpen: false,
  highContrastMode: false,
  fontSizeScale: 'normal',
  screenReaderTTS: false,
  isReducedMotion: false,

  setActiveView: (view) => set({ activeView: view }),
  
  setSelectedZoneId: (zoneId) => {
    const zone = BENGALURU_ZONES.find((z) => z.id === zoneId) || null;
    set({ selectedZoneId: zoneId, selectedZone: zone, spatialFocusZoneId: zoneId });
  },

  setSpatialFocusZoneId: (zoneId) => set({ spatialFocusZoneId: zoneId }),

  setAiProcessState: (state, step = 0, message = '') => {
    set({ aiProcessState: state, aiProcessStep: step, aiProcessMessage: message });
  },

  setCurrentInspection: (inspection) => set({ currentInspection: inspection }),

  addInspectionToHistory: (inspection) => {
    set((state) => ({
      inspectionHistory: [inspection, ...state.inspectionHistory].slice(0, 20),
      currentInspection: inspection
    }));
  },

  addCommunityReport: (report) => {
    set((state) => ({
      communityReports: [report, ...state.communityReports],
      cityStats: {
        ...state.cityStats,
        totalReportsLogged: state.cityStats.totalReportsLogged + 1,
        todayReportsCount: state.cityStats.todayReportsCount + 1
      }
    }));
  },

  upvoteCommunityReport: (reportId) => {
    set((state) => ({
      communityReports: state.communityReports.map((r) =>
        r.id === reportId ? { ...r, verifiedByCommunityUpvotes: r.verifiedByCommunityUpvotes + 1 } : r
      )
    }));
  },

  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setAccessibilityModalOpen: (open) => set({ isAccessibilityModalOpen: open }),
  setHighContrastMode: (enabled) => set({ highContrastMode: enabled }),
  setFontSizeScale: (scale) => set({ fontSizeScale: scale }),
  setScreenReaderTTS: (enabled) => set({ screenReaderTTS: enabled }),
  setReducedMotion: (enabled) => set({ isReducedMotion: enabled }),

  speakText: (text: string) => {
    if (get().screenReaderTTS && typeof window !== 'undefined' && 'speechSynthesis' in window && text?.trim()) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }
}));
