import { LucideIcon } from 'lucide-react';

export type NavigationDisplayMode = 
  | 'standard' 
  | 'floating' 
  | 'sidebar_expanded' 
  | 'sidebar_collapsed' 
  | 'contextual' 
  | 'mobile_dock';

export type NavigationContextMode = 
  | 'global' 
  | 'triage_inquiry' 
  | 'hospital_dispatch' 
  | 'records_archive' 
  | 'analytics' 
  | 'settings';

export interface NavigationItem {
  id: string;
  label: string;
  labelTranslation?: Record<'kn' | 'hi' | 'en' | 'te' | 'ta', string>;
  path: string;
  iconName: string;
  badge?: string | number;
  badgeVariant?: 'default' | 'urgent' | 'success' | 'amber';
  shortcut?: string;
  description?: string;
  isExternal?: boolean;
  category?: 'primary' | 'tools' | 'hospital' | 'admin';
  children?: NavigationSubItem[];
}

export interface NavigationSubItem {
  id: string;
  label: string;
  description?: string;
  path: string;
  iconName?: string;
  badge?: string;
}

export interface NavigationBreadcrumb {
  id: string;
  label: string;
  path: string;
  iconName?: string;
  isActive?: boolean;
}

export interface ContextualAction {
  id: string;
  label: string;
  iconName: string;
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface NavigationState {
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
}
