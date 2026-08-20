import { create } from 'zustand';
import { NavigationBreadcrumb, NavigationContextMode, NavigationDisplayMode, ContextualAction } from '../types/navigation';

interface NavigationStore {
  activeTab: string;
  activeContext: NavigationContextMode;
  displayMode: NavigationDisplayMode;
  isSidebarCollapsed: boolean;
  isMobileDrawerOpen: boolean;
  isCommandPaletteOpen: boolean;
  isMegaMenuOpen: boolean;
  megaMenuCategory: string | null;
  searchQuery: string;
  recentSearches: string[];
  breadcrumbs: NavigationBreadcrumb[];
  contextualActions: ContextualAction[];
  scrollDirection: 'up' | 'down' | 'idle';
  isScrolledPastHero: boolean;
  isReducedMotion: boolean;
  isAccessibilityModalOpen: boolean;
  highContrastMode: boolean;
  fontSizeScale: 'normal' | 'large' | 'extra-large';
  screenReaderTTS: boolean;

  // Actions
  setActiveTab: (tab: string) => void;
  setActiveContext: (context: NavigationContextMode) => void;
  setDisplayMode: (mode: NavigationDisplayMode) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileDrawerOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setMegaMenuOpen: (open: boolean, category?: string | null) => void;
  setSearchQuery: (query: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setBreadcrumbs: (breadcrumbs: NavigationBreadcrumb[]) => void;
  setContextualActions: (actions: ContextualAction[]) => void;
  setScrollState: (direction: 'up' | 'down' | 'idle', isPastHero: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setAccessibilityModalOpen: (open: boolean) => void;
  setHighContrastMode: (enabled: boolean) => void;
  setFontSizeScale: (scale: 'normal' | 'large' | 'extra-large') => void;
  setScreenReaderTTS: (enabled: boolean) => void;
  speakLabel: (text: string) => void;
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  activeTab: 'triage',
  activeContext: 'global',
  displayMode: 'standard',
  isSidebarCollapsed: false,
  isMobileDrawerOpen: false,
  isCommandPaletteOpen: false,
  isMegaMenuOpen: false,
  megaMenuCategory: null,
  searchQuery: '',
  recentSearches: ['Victoria Hospital', 'Emergency Cardiology', 'Prescription OCR', 'n8n Webhook'],
  breadcrumbs: [
    { id: 'home', label: 'JanArogya AI', path: '#triage' },
    { id: 'active', label: 'AI Triage Desk', path: '#triage', isActive: true }
  ],
  contextualActions: [],
  scrollDirection: 'idle',
  isScrolledPastHero: false,
  isReducedMotion: false,
  isAccessibilityModalOpen: false,
  highContrastMode: false,
  fontSizeScale: 'normal',
  screenReaderTTS: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveContext: (context) => set({ activeContext: context }),
  setDisplayMode: (mode) => set({ displayMode: mode }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  setMobileDrawerOpen: (open) => set({ isMobileDrawerOpen: open }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setMegaMenuOpen: (open, category = null) => set({ isMegaMenuOpen: open, megaMenuCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  addRecentSearch: (query) =>
    set((state) => {
      const filtered = state.recentSearches.filter((s) => s.toLowerCase() !== query.toLowerCase());
      return { recentSearches: [query, ...filtered].slice(0, 8) };
    }),
  clearRecentSearches: () => set({ recentSearches: [] }),
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
  setContextualActions: (actions) => set({ contextualActions: actions }),
  setScrollState: (direction, isPastHero) => set({ scrollDirection: direction, isScrolledPastHero: isPastHero }),
  setReducedMotion: (reduced) => set({ isReducedMotion: reduced }),
  setAccessibilityModalOpen: (open) => set({ isAccessibilityModalOpen: open }),
  setHighContrastMode: (enabled) => set({ highContrastMode: enabled }),
  setFontSizeScale: (scale) => set({ fontSizeScale: scale }),
  setScreenReaderTTS: (enabled) => set({ screenReaderTTS: enabled }),
  speakLabel: (text: string) => {
    if (get().screenReaderTTS && 'speechSynthesis' in window && text && text.trim()) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }
}));
