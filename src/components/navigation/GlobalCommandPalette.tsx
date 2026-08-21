import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Mic,
  FileText,
  MonitorPlay,
  MessageSquare,
  Stethoscope,
  Building2,
  PhoneCall,
  Clock,
  ArrowRight,
  Sparkles,
  Command,
  X,
  CornerDownLeft,
  Activity,
  ShieldCheck,
  Zap,
  Globe,
  Sliders,
  Droplets,
  Layers,
  Compass,
  Grid,
  HeartPulse,
  PlusCircle,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useAgentRegistryStore } from '../../store/useAgentRegistryStore';
import { renderDynamicAgentIcon } from '../../lib/agentIconMap';
import { NAV_MOTION_TOKENS } from '../../lib/navigationTokens';

interface GlobalCommandPaletteProps {
  currentLanguage: 'kn' | 'hi' | 'en' | 'te' | 'ta';
  onLanguageChange: (lang: 'kn' | 'hi' | 'en' | 'te' | 'ta') => void;
  onNavigate: (agent: string, subTab?: string) => void;
  onOpenNewAgentSetup?: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
  shortcut?: string;
  badge?: string;
}

export const GlobalCommandPalette: React.FC<GlobalCommandPaletteProps> = ({
  currentLanguage,
  onLanguageChange,
  onNavigate,
  onOpenNewAgentSetup
}) => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    recentSearches,
    addRecentSearch,
    clearRecentSearches
  } = useNavigationStore();

  const { agents } = useAgentRegistryStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global keydown listener for ⌘K / Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
        return;
      }

      if (e.key === 'Escape' && isCommandPaletteOpen) {
        e.preventDefault();
        setCommandPaletteOpen(false);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  // Focus input on open
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Build command items list dynamically
  const baseCommands: CommandItem[] = [
    // Top-Level Hub
    {
      id: 'agent-hub',
      title: 'Civic & Healthcare AI Agents Hub',
      subtitle: 'Central portal with all autonomous agents, metrics & roadmaps',
      category: 'AI Agents',
      icon: <Grid className="w-4 h-4 text-indigo-400" />,
      action: () => {
        onNavigate('hub');
        setCommandPaletteOpen(false);
      },
      keywords: ['hub', 'home', 'portal', 'dashboard', 'suite', 'agents', 'all'],
      shortcut: 'H',
      badge: 'Hub'
    },

    // New Agent Setup
    {
      id: 'cmd-new-agent',
      title: 'Configure New Civic AI Agent (Form)',
      subtitle: 'Setup Waste Management, Energy Grid, Air Quality, or Smart Governance modules',
      category: 'AI Agents',
      icon: <PlusCircle className="w-4 h-4 text-indigo-400" />,
      action: () => {
        setCommandPaletteOpen(false);
        if (onOpenNewAgentSetup) {
          onOpenNewAgentSetup();
        } else {
          onNavigate('hub');
        }
      },
      keywords: ['new', 'add agent', 'setup', 'create', 'extensible', 'waste', 'energy', 'form'],
      badge: 'Setup'
    }
  ];

  // Dynamically add all agents from registry
  const agentCommands: CommandItem[] = agents.map((agent) => ({
    id: `agent-${agent.id}`,
    title: `${agent.name} Workspace`,
    subtitle: agent.tagline || agent.description,
    category: 'AI Agents',
    icon: renderDynamicAgentIcon(agent.iconName, 'w-4 h-4 text-cyan-400'),
    action: () => {
      onNavigate(agent.id, agent.subRoutes[0]?.id);
      setCommandPaletteOpen(false);
    },
    keywords: [agent.id, agent.name, agent.shortName, agent.department, agent.category, ...agent.highlights],
    shortcut: agent.id === 'janarogya' ? 'J' : agent.id === 'namma-water' ? 'W' : undefined,
    badge: agent.status === 'active' ? 'Active' : agent.status === 'beta' ? 'Beta' : 'Roadmap'
  }));

  // Dynamically add all sub-routes across all agents
  const subRouteCommands: CommandItem[] = [];
  agents.forEach((agent) => {
    agent.subRoutes.forEach((route, idx) => {
      subRouteCommands.push({
        id: `route-${agent.id}-${route.id}`,
        title: `${agent.shortName} › ${route.name}`,
        subtitle: route.shortDesc,
        category: `${agent.shortName} Modules`,
        icon: renderDynamicAgentIcon(route.iconName, 'w-4 h-4 text-teal-400'),
        action: () => {
          onNavigate(agent.id, route.id);
          setCommandPaletteOpen(false);
        },
        keywords: [agent.id, agent.name, route.id, route.name, route.shortDesc],
        shortcut: agent.id === 'janarogya' && idx < 6 ? `${idx + 1}` : undefined,
        badge: route.badge || agent.shortName
      });
    });
  });

  // Emergency & Settings
  const utilityCommands: CommandItem[] = [
    {
      id: 'call-108',
      title: 'Call 108 Emergency Medical Ambulance',
      subtitle: 'Free 24/7 Government Emergency Medical Service',
      category: 'Emergency & Helplines',
      icon: <PhoneCall className="w-4 h-4 text-red-400" />,
      action: () => {
        window.open('tel:108', '_self');
        setCommandPaletteOpen(false);
      },
      keywords: ['ambulance', '108', 'emergency', 'accident', 'sos', 'trauma'],
      badge: 'SOS'
    },
    {
      id: 'call-1916',
      title: 'Call BWSSB 1916 Water Helpline',
      subtitle: '24x7 Water Supply, Tanker Complaints & Pipeline Leaks',
      category: 'Emergency & Helplines',
      icon: <PhoneCall className="w-4 h-4 text-cyan-400" />,
      action: () => {
        window.open('tel:1916', '_self');
        setCommandPaletteOpen(false);
      },
      keywords: ['bwssb', '1916', 'water helpline', 'tanker complaint', 'water supply']
    },
    {
      id: 'call-104',
      title: 'Call 104 Arogyavani Helpline',
      subtitle: 'Karnataka State Health Information & Medical Advice',
      category: 'Emergency & Helplines',
      icon: <PhoneCall className="w-4 h-4 text-rose-400" />,
      action: () => {
        window.open('tel:104', '_self');
        setCommandPaletteOpen(false);
      },
      keywords: ['104', 'arogyavani', 'helpline', 'medical advice', 'doctor consultation']
    },
    {
      id: 'lang-kn',
      title: 'ಕನ್ನಡ (Kannada)',
      subtitle: 'Switch voice intake & user interface to Kannada',
      category: 'Languages',
      icon: <Globe className="w-4 h-4 text-teal-400" />,
      action: () => {
        onLanguageChange('kn');
        setCommandPaletteOpen(false);
      },
      keywords: ['kannada', 'kannadiga', 'bhasha', 'kn'],
      badge: currentLanguage === 'kn' ? 'Active' : undefined
    },
    {
      id: 'lang-hi',
      title: 'हिंदी (Hindi)',
      subtitle: 'Switch voice intake & user interface to Hindi',
      category: 'Languages',
      icon: <Globe className="w-4 h-4 text-teal-400" />,
      action: () => {
        onLanguageChange('hi');
        setCommandPaletteOpen(false);
      },
      keywords: ['hindi', 'bhasha', 'hi'],
      badge: currentLanguage === 'hi' ? 'Active' : undefined
    },
    {
      id: 'lang-en',
      title: 'English',
      subtitle: 'Switch voice intake & user interface to English',
      category: 'Languages',
      icon: <Globe className="w-4 h-4 text-teal-400" />,
      action: () => {
        onLanguageChange('en');
        setCommandPaletteOpen(false);
      },
      keywords: ['english', 'en'],
      badge: currentLanguage === 'en' ? 'Active' : undefined
    },
    {
      id: 'open-accessibility-panel',
      title: 'Open Accessibility Settings Panel',
      subtitle: 'Adjust high contrast, font size scale (100%-130%), and screen reader TTS',
      category: 'Accessibility & Settings',
      icon: <Sliders className="w-4 h-4 text-teal-400" />,
      action: () => {
        useNavigationStore.getState().setAccessibilityModalOpen(true);
        setCommandPaletteOpen(false);
      },
      keywords: ['accessibility', 'contrast', 'high contrast', 'font size', 'tts', 'text to speech', 'vision', 'a11y'],
      shortcut: 'Alt+A',
      badge: 'A11y'
    }
  ];

  const commands = [...baseCommands, ...agentCommands, ...subRouteCommands, ...utilityCommands];

  // Filter commands by query
  const filteredCommands =
    query.trim() === ''
      ? commands
      : commands.filter((cmd) => {
          const q = query.toLowerCase();
          return (
            cmd.title.toLowerCase().includes(q) ||
            cmd.subtitle.toLowerCase().includes(q) ||
            cmd.category.toLowerCase().includes(q) ||
            cmd.keywords.some((kw) => kw.toLowerCase().includes(q))
          );
        });

  // Handle arrow key navigation and enter selection
  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredCommands[selectedIndex];
      if (selected) {
        addRecentSearch(selected.title);
        selected.action();
      }
    }
  };

  // Auto-scroll to selected index
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div
          id="global-command-palette-portal"
          role="dialog"
          aria-modal="true"
          aria-label="Universal Civic Search & Command Palette"
          className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 pb-4 select-none"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md -z-10"
            aria-hidden="true"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={NAV_MOTION_TOKENS.spring.snappy}
            className="w-full max-w-2xl bg-slate-900 text-white rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
              <Search className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                ref={inputRef}
                id="command-palette-input"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDownList}
                placeholder="Type a civic agent, hospital tool, tanker checker, or helpline..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                autoComplete="off"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-md text-slate-500 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
            >
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <p className="text-sm font-semibold text-slate-300">No results found for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-slate-500">
                    Try searching for &quot;triage&quot;, &quot;tanker&quot;, &quot;waste&quot;, &quot;solar&quot;, or &quot;108&quot;.
                  </p>
                </div>
              ) : (
                filteredCommands.map((cmd, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={cmd.id}
                      data-index={index}
                      onClick={() => {
                        addRecentSearch(cmd.title);
                        cmd.action();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                          : 'text-slate-300 hover:bg-slate-850 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            isSelected ? 'bg-slate-700 text-white' : 'bg-slate-950 text-slate-400'
                          }`}
                        >
                          {cmd.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold truncate text-white">{cmd.title}</span>
                            {cmd.badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-950 text-cyan-400 border border-slate-700 font-mono">
                                {cmd.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{cmd.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {cmd.shortcut && (
                          <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
                            {cmd.shortcut}
                          </kbd>
                        )}
                        <CornerDownLeft className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Bar */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px]">
                    ↑↓
                  </kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px]">
                    ↵
                  </kbd>
                  <span>Select</span>
                </span>
              </div>
              <span className="hidden sm:inline text-slate-400">
                Extensible Civic Suite • {agents.length} Registered Agents
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
