import React from 'react';
import {
  HeartPulse,
  Droplets,
  Layers,
  Sparkles,
  Search,
  Globe,
  Eye,
  ArrowLeft,
  ChevronDown,
  Activity,
  FileText,
  Mic,
  MonitorPlay,
  MessageSquare,
  Stethoscope,
  Building2,
  Compass,
  PhoneCall,
  ShieldCheck,
  Grid,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useAgentRegistryStore } from '../../store/useAgentRegistryStore';
import { renderDynamicAgentIcon } from '../../lib/agentIconMap';

export interface UnifiedAgentHeaderProps {
  activeAgent: string;
  onSelectAgent: (agentId: string, subTab?: string) => void;
  janarogyaTab: string;
  onJanarogyaTabChange: (tab: string) => void;
  nammaWaterTab: string;
  onNammaWaterTabChange: (tab: string) => void;
  customTab?: string;
  onCustomTabChange?: (tab: string) => void;
  currentLanguage: 'kn' | 'hi' | 'en' | 'te' | 'ta';
  onLanguageChange: (lang: 'kn' | 'hi' | 'en' | 'te' | 'ta') => void;
  onOpenNewAgentSetup?: () => void;
}

export const UnifiedAgentHeader: React.FC<UnifiedAgentHeaderProps> = ({
  activeAgent,
  onSelectAgent,
  janarogyaTab,
  onJanarogyaTabChange,
  nammaWaterTab,
  onNammaWaterTabChange,
  customTab,
  onCustomTabChange,
  currentLanguage,
  onLanguageChange,
  onOpenNewAgentSetup
}) => {
  const { setCommandPaletteOpen, setAccessibilityModalOpen, highContrastMode } = useNavigationStore();
  const { agents } = useAgentRegistryStore();

  // Find active agent definition dynamically from the registry
  const activeAgentDef = agents.find((a) => a.id === activeAgent);

  // Active sub-tab resolution
  const getActiveSubTab = (): string => {
    if (activeAgent === 'janarogya') return janarogyaTab;
    if (activeAgent === 'namma-water') return nammaWaterTab;
    return customTab || activeAgentDef?.subRoutes[0]?.id || '';
  };

  const handleSubTabClick = (subRouteId: string) => {
    if (activeAgent === 'janarogya') {
      onJanarogyaTabChange(subRouteId);
    } else if (activeAgent === 'namma-water') {
      onNammaWaterTabChange(subRouteId);
    } else if (onCustomTabChange) {
      onCustomTabChange(subRouteId);
    }
  };

  // Primary active & beta agents for quick switcher
  const quickSwitchAgents = agents.filter(
    (a) => a.status === 'active' || a.status === 'beta' || a.isCustom
  );

  return (
    <header className="bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 shadow-xl select-none">
      {/* Top Tier: Master Brand, Dynamic Agent Switcher, Search, Language, Accessibility */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          {/* Brand & Agent Selector with Shared Layout Animation */}
          <div className="flex items-center gap-3">
            {activeAgent !== 'hub' ? (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => onSelectAgent('hub')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all cursor-pointer shadow-sm group"
                title="Return to Civic AI Agents Hub"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Hub</span>
              </motion.button>
            ) : null}

            {/* Logo and Dynamic Agent Branding */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => onSelectAgent('hub')}
            >
              <motion.div
                layoutId="unified-header-agent-icon-box"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0 font-black"
                style={{
                  backgroundColor: activeAgentDef ? activeAgentDef.primaryColor : '#6366f1'
                }}
              >
                {activeAgentDef ? (
                  renderDynamicAgentIcon(activeAgentDef.iconName, 'w-5 h-5 text-white')
                ) : (
                  <Grid className="w-5 h-5 text-white" />
                )}
              </motion.div>

              <div>
                <div className="flex items-center gap-1.5">
                  <motion.span
                    layoutId="unified-header-agent-badge"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    className="text-[11px] font-black uppercase tracking-wider"
                    style={{
                      color: activeAgentDef ? activeAgentDef.primaryColor : '#818cf8'
                    }}
                  >
                    {activeAgentDef ? activeAgentDef.shortName.toUpperCase() : 'CIVIC AI LABS'}
                  </motion.span>
                  <span className="hidden md:inline-block px-2 py-0.2 text-[9px] font-extrabold bg-slate-800 text-slate-300 border border-slate-700 rounded-full">
                    {activeAgentDef ? activeAgentDef.version : 'Bengaluru Suite'}
                  </span>
                </div>

                <motion.h1
                  layoutId="unified-header-agent-title"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="text-xs sm:text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-cyan-300 transition-colors"
                >
                  {activeAgentDef ? activeAgentDef.tagline || activeAgentDef.name : 'Autonomous Civic & Healthcare Agents Hub'}
                </motion.h1>
              </div>
            </div>
          </div>

          {/* Center: Dynamic Agent Switcher (with smooth sliding active indicator) */}
          <div className="hidden lg:flex items-center p-1 rounded-2xl bg-slate-900/90 border border-slate-800/90 text-xs font-bold max-w-xl overflow-x-auto scrollbar-none relative">
            <button
              onClick={() => onSelectAgent('hub')}
              className={`relative px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 z-10 ${
                activeAgent === 'hub'
                  ? 'text-white font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeAgent === 'hub' && (
                <motion.div
                  layoutId="unified-active-agent-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute inset-0 bg-indigo-600 rounded-xl shadow-md -z-10"
                />
              )}
              <Grid className="w-3.5 h-3.5" />
              <span>Agents Hub</span>
            </button>

            {quickSwitchAgents.map((agent) => {
              const isActive = activeAgent === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => onSelectAgent(agent.id)}
                  className={`relative px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 z-10 ${
                    isActive ? 'text-white font-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="unified-active-agent-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-xl shadow-md -z-10"
                      style={{ backgroundColor: agent.primaryColor }}
                    />
                  )}
                  {renderDynamicAgentIcon(agent.iconName, 'w-3.5 h-3.5')}
                  <span>{agent.shortName}</span>
                </button>
              );
            })}

            {onOpenNewAgentSetup && (
              <button
                onClick={onOpenNewAgentSetup}
                className="px-2 py-1.5 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-slate-800 text-xs font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer ml-1"
                title="Configure New Civic Agent"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="text-[11px]">New Agent</span>
              </button>
            )}
          </div>

          {/* Right Actions: Search, Setup, Accessibility, Language */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* New Agent Setup CTA button */}
            {onOpenNewAgentSetup && (
              <button
                onClick={onOpenNewAgentSetup}
                className="hidden sm:flex lg:hidden items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Agent</span>
              </button>
            )}

            {/* Global Search Bar trigger (Cmd+K) */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700/80 text-xs font-semibold transition-all cursor-pointer shadow-inner"
              title="Search all agents and tools (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden md:inline text-slate-400">Search tools...</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400 font-bold">
                ⌘K
              </kbd>
            </button>

            {/* Accessibility Button */}
            <button
              onClick={() => setAccessibilityModalOpen(true)}
              title="Accessibility Settings"
              className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                highContrastMode
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                  : 'bg-slate-900 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1.5 rounded-xl border border-slate-700/80">
              <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ</option>
                <option value="hi" className="bg-slate-900 text-white">हिंदी</option>
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="te" className="bg-slate-900 text-white">తెలుగు</option>
                <option value="ta" className="bg-slate-900 text-white">தமிழ்</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tier: Dynamic Navigation Tabs dynamically rendered from AgentRegistry with animated sliding active pill */}
      {activeAgentDef && activeAgentDef.subRoutes && activeAgentDef.subRoutes.length > 0 && (
        <div className="bg-slate-950/90 border-t border-slate-850">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none relative">
              {activeAgentDef.subRoutes.map((subRoute) => {
                const isCurrentTab = getActiveSubTab() === subRoute.id;
                return (
                  <button
                    key={subRoute.id}
                    onClick={() => handleSubTabClick(subRoute.id)}
                    className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer z-10 ${
                      isCurrentTab
                        ? 'text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {isCurrentTab && (
                      <motion.div
                        layoutId="unified-header-subnav-active-pill"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        className="absolute inset-0 rounded-xl shadow-md -z-10"
                        style={{ backgroundColor: activeAgentDef.primaryColor }}
                      />
                    )}
                    {renderDynamicAgentIcon(subRoute.iconName, 'w-3.5 h-3.5')}
                    <span>{subRoute.name}</span>
                    {subRoute.badge && (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                          isCurrentTab ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {subRoute.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
