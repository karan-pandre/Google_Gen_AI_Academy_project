import React, { useState, useMemo } from 'react';
import {
  HeartPulse,
  Droplets,
  Car,
  Zap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Search,
  Activity,
  Layers,
  FileText,
  Mic,
  MonitorPlay,
  MessageSquare,
  Stethoscope,
  Building2,
  Compass,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Code2,
  Cpu,
  ChevronRight,
  Info,
  BadgeAlert,
  PlusCircle,
  Plus,
  Trash2,
  Recycle,
  SunMedium,
  Wind,
  Filter,
  X,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CivicAgentDefinition } from '../../types/agentRegistry';
import { useAgentRegistryStore } from '../../store/useAgentRegistryStore';
import { renderDynamicAgentIcon } from '../../lib/agentIconMap';
import { NewAgentSetupModal } from './NewAgentSetupModal';

interface CivicAgentHubProps {
  onSelectAgent: (agentId: string, subRouteId?: string) => void;
  onOpenCommandPalette: () => void;
  onOpenNewAgentSetup?: () => void;
}

export const CivicAgentHub: React.FC<CivicAgentHubProps> = ({
  onSelectAgent,
  onOpenCommandPalette,
  onOpenNewAgentSetup
}) => {
  const { agents, removeAgent } = useAgentRegistryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'active' | 'beta' | 'roadmap'>('all');
  const [activeModalAgent, setActiveModalAgent] = useState<CivicAgentDefinition | null>(null);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [isNewAgentModalOpen, setIsNewAgentModalOpen] = useState(false);

  // Extract unique categories dynamically from all registered agents
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    agents.forEach((a) => {
      if (a.category) categories.add(a.category);
    });
    return Array.from(categories);
  }, [agents]);

  // Comprehensive multi-attribute agent filter (keywords, category, status)
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      // 1. Status Filter
      if (selectedStatusFilter === 'active' && agent.status !== 'active') return false;
      if (selectedStatusFilter === 'beta' && agent.status !== 'beta') return false;
      if (selectedStatusFilter === 'roadmap' && (agent.status === 'active' || agent.status === 'beta')) return false;

      // 2. Category Filter
      if (selectedCategory !== 'all' && agent.category !== selectedCategory) {
        return false;
      }

      // 3. Search Query (Keywords, Title, ShortName, Department, Subroutes, Highlights, Badges)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = agent.name.toLowerCase().includes(q);
        const matchesShortName = agent.shortName.toLowerCase().includes(q);
        const matchesDept = agent.department.toLowerCase().includes(q);
        const matchesDesc = agent.description.toLowerCase().includes(q);
        const matchesTagline = (agent.tagline || '').toLowerCase().includes(q);
        const matchesCategory = agent.category.toLowerCase().includes(q);
        const matchesStatus = agent.status.toLowerCase().includes(q);
        const matchesHighlights = agent.highlights.some((h) => h.toLowerCase().includes(q));
        const matchesBadges = agent.complianceBadges.some((b) => b.toLowerCase().includes(q));
        const matchesSubroutes = agent.subRoutes.some(
          (r) => r.name.toLowerCase().includes(q) || r.shortDesc.toLowerCase().includes(q)
        );

        if (
          !matchesName &&
          !matchesShortName &&
          !matchesDept &&
          !matchesDesc &&
          !matchesTagline &&
          !matchesCategory &&
          !matchesStatus &&
          !matchesHighlights &&
          !matchesBadges &&
          !matchesSubroutes
        ) {
          return false;
        }
      }

      return true;
    });
  }, [agents, searchQuery, selectedCategory, selectedStatusFilter]);

  const activeCount = agents.filter((a) => a.status === 'active' || a.status === 'beta').length;
  const roadmapCount = agents.filter((a) => a.status !== 'active' && a.status !== 'beta').length;

  const handleCreateAgentTrigger = () => {
    if (onOpenNewAgentSetup) {
      onOpenNewAgentSetup();
    } else {
      setIsNewAgentModalOpen(true);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatusFilter('all');
  };

  const quickKeywords = [
    { label: 'Hospital SATS Triage', query: 'triage' },
    { label: 'Water Tanker Caps', query: 'tanker' },
    { label: 'Solid Waste Radar', query: 'waste' },
    { label: 'Smart Power Grid', query: 'bescom' },
    { label: 'Air Quality (AQI)', query: 'air quality' },
    { label: 'e-Khata Property Tax', query: 'tax' }
  ];

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedStatusFilter !== 'all';

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border border-slate-800/90 p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-500/10 via-cyan-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-black bg-cyan-950/90 text-cyan-300 border border-cyan-700/60 shadow-sm">
              GOVERNMENT OF KARNATAKA &amp; CIVIC AI LABS
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800/90 text-slate-300 border border-slate-700">
              Unified Agent Gateway v2.4
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {activeCount} Active Autonomous Agents
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Namma Bengaluru <br />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                Civic &amp; Healthcare AI Suite
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              Empowering citizens with radical civic transparency, hospital navigation, and automated municipal oversight. Launch an active agent below or configure a new civic intelligence engine.
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectAgent('janarogya', 'voice')}
              className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm transition-all shadow-lg shadow-teal-600/30 flex items-center gap-2.5 cursor-pointer hover:scale-[1.02]"
            >
              <HeartPulse className="w-4 h-4" />
              <span>Launch JanArogya AI (Healthcare)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectAgent('namma-water', 'inspect')}
              className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-sm transition-all shadow-lg shadow-cyan-600/30 flex items-center gap-2.5 cursor-pointer hover:scale-[1.02]"
            >
              <Droplets className="w-4 h-4" />
              <span>Launch Namma Water AI (Tankers)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleCreateAgentTrigger}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2.5 cursor-pointer hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Agent Setup (Form)</span>
            </button>

            <button
              onClick={onOpenCommandPalette}
              className="px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm border border-slate-700/80 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Search All Tools (<kbd className="font-mono text-xs">⌘K</kbd>)</span>
            </button>
          </div>
        </div>

        {/* Global Live Telemetry Grid */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Triaged Hospital Patients
            </span>
            <div className="text-xl sm:text-2xl font-black text-teal-400 mt-1">14,820+</div>
            <span className="text-[10px] text-slate-500">Across 12 Bengaluru public hospitals</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Water Invoices Verified
            </span>
            <div className="text-xl sm:text-2xl font-black text-cyan-400 mt-1">6,290+</div>
            <span className="text-[10px] text-slate-500">8 BBMP Zones checked against statutory caps</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Citizen Water Savings
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">₹48.2 Lakhs</div>
            <span className="text-[10px] text-slate-500">Recovered from price-gouging violations</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Agent Registry Network
            </span>
            <div className="text-xl sm:text-2xl font-black text-indigo-400 mt-1">{agents.length} Registered</div>
            <span className="text-[10px] text-slate-500">Extensible Open Civic Registry</span>
          </div>
        </div>
      </section>

      {/* DEDICATED AGENT SEARCH & FILTER BAR */}
      <section className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-cyan-400" />
            </div>
            <input
              id="civic-hub-agent-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Auto-filter by keywords, department, health, water, waste, power, or compliance..."
              className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                title="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Segmented Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 shrink-0 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedStatusFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Statuses ({agents.length})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('active')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedStatusFilter === 'active'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Active</span>
            </button>
            <button
              onClick={() => setSelectedStatusFilter('beta')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedStatusFilter === 'beta'
                  ? 'bg-amber-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Beta</span>
            </button>
            <button
              onClick={() => setSelectedStatusFilter('roadmap')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedStatusFilter === 'roadmap'
                  ? 'bg-purple-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Roadmap ({roadmapCount})
            </button>
          </div>

          {/* Quick Action Setup button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCreateAgentTrigger}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 text-xs font-bold cursor-pointer transition-all shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Agent Setup</span>
            </button>

            <button
              onClick={() => setShowDeveloperModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold cursor-pointer transition-all"
              title="View Dynamic Agent Registry Architecture"
            >
              <Code2 className="w-3.5 h-3.5 text-teal-400" />
              <span>SDK Spec</span>
            </button>
          </div>
        </div>

        {/* Category Pills & Quick Tag Suggesters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              <span>Category:</span>
            </span>

            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Categories
            </button>

            {availableCategories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 border border-cyan-400 font-black shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Quick Keywords Chips */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-400">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-2.5 h-2.5 text-slate-500" />
              <span>Popular:</span>
            </span>
            {quickKeywords.map((kw) => (
              <button
                key={kw.query}
                onClick={() => setSearchQuery(kw.query)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                  searchQuery.toLowerCase() === kw.query.toLowerCase()
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                {kw.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Summary & Reset Bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between gap-3 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">
                Showing {filteredAgents.length} of {agents.length} agents
              </span>
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px]">
                  &ldquo;{searchQuery}&rdquo;
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 text-[11px]">
                  Category: {selectedCategory}
                </span>
              )}
              {selectedStatusFilter !== 'all' && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 text-[11px] uppercase">
                  Status: {selectedStatusFilter}
                </span>
              )}
            </div>

            <button
              onClick={handleClearFilters}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </section>

      {/* Featured Primary Active Agents (JanArogya AI & Namma Water AI) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CARD 1: JanArogya AI */}
        {filteredAgents.some((a) => a.id === 'janarogya') && (
          <div className="group relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-teal-500/30 hover:border-teal-400 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 shrink-0">
                    <HeartPulse className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">
                        ACTIVE PRODUCTION
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">v2.4 LTS</span>
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight mt-1">
                      JanArogya AI
                    </h3>
                    <p className="text-xs text-teal-400 font-semibold">
                      Autonomous Public Hospital Navigator &amp; SATS 2.0 Triage
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-[10px] font-bold text-slate-400">ABDM &amp; PM-JAY</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">100% Cashless</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Multilingual AI triage, prescription &amp; ABHA vision OCR, real-time OPD queue telemetry, nurse audit station, and emergency bed dispatch network.
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Triaged</span>
                  <span className="text-sm font-black text-teal-400">14,820+</span>
                  <span className="text-[9px] text-slate-500 block">SATS 2.0 Protocol</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">ICU Beds</span>
                  <span className="text-sm font-black text-cyan-400">48 Live</span>
                  <span className="text-[9px] text-slate-500 block">12 Major Hospitals</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Languages</span>
                  <span className="text-sm font-black text-indigo-400">5 Indic</span>
                  <span className="text-[9px] text-slate-500 block">KN, HI, EN, TE, TA</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Queue Time</span>
                  <span className="text-sm font-black text-emerald-400">-64%</span>
                  <span className="text-[9px] text-slate-500 block">From 110m to 38m</span>
                </div>
              </div>

              {/* Quick Sub-module launch buttons */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Access Modules:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => onSelectAgent('janarogya', 'voice')}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-teal-950/50 border border-slate-800 hover:border-teal-500/50 text-left transition-all group/btn flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Mic className="w-4 h-4 text-teal-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-200 group-hover/btn:text-white truncate">
                        Patient Voice Kiosk
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover/btn:text-teal-400 shrink-0" />
                  </button>

                  <button
                    onClick={() => onSelectAgent('janarogya', 'scanner')}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-teal-950/50 border border-slate-800 hover:border-teal-500/50 text-left transition-all group/btn flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-200 group-hover/btn:text-white truncate">
                        Rx &amp; ABHA OCR
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover/btn:text-teal-400 shrink-0" />
                  </button>

                  <button
                    onClick={() => onSelectAgent('janarogya', 'queue')}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-teal-950/50 border border-slate-800 hover:border-teal-500/50 text-left transition-all group/btn flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <MonitorPlay className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-200 group-hover/btn:text-white truncate">
                        OPD &amp; Bed Telemetry
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover/btn:text-teal-400 shrink-0" />
                  </button>
                </div>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                <span>Govt Helpline: <strong>104 / 108</strong></span>
              </div>

              <button
                onClick={() => onSelectAgent('janarogya', 'voice')}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow-md shadow-teal-600/30 flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <span>Open JanArogya Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* CARD 2: Namma Water AI */}
        {filteredAgents.some((a) => a.id === 'namma-water') && (
          <div className="group relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 hover:border-cyan-400 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25 shrink-0 font-black">
                    <Droplets className="w-8 h-8 text-slate-950 font-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wide">
                        ACTIVE PRODUCTION
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">v2.1 BWSSB</span>
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight mt-1">
                      Namma Water AI
                    </h3>
                    <p className="text-xs text-cyan-400 font-semibold">
                      Private Tanker Price Intelligence &amp; Aquifer Radar
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-[10px] font-bold text-slate-400">Statutory Cap</span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">₹1,000 / 12kL</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Autonomous tanker receipt OCR audit, distance-band statutory cap calculator, dynamic groundwater aquifer radar, and one-click BWSSB grievance generator.
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Invoices</span>
                  <span className="text-sm font-black text-cyan-400">6,290+</span>
                  <span className="text-[9px] text-slate-500 block">8 BBMP Zones</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Saved</span>
                  <span className="text-sm font-black text-emerald-400">₹48.2L</span>
                  <span className="text-[9px] text-slate-500 block">Gouging Recovered</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Grievances</span>
                  <span className="text-sm font-black text-indigo-400">1,410</span>
                  <span className="text-[9px] text-slate-500 block">BWSSB Form Filed</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Borewell Depth</span>
                  <span className="text-sm font-black text-purple-400">1,240 ft</span>
                  <span className="text-[9px] text-slate-500 block">East / Mahadevapura</span>
                </div>
              </div>

              {/* Quick Sub-module launch buttons */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Access Modules:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => onSelectAgent('namma-water', 'inspect')}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group/btn flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-200 group-hover/btn:text-white truncate">
                        Tanker Bill Auditor
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover/btn:text-cyan-400 shrink-0" />
                  </button>

                  <button
                    onClick={() => onSelectAgent('namma-water', 'map3d')}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group/btn flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-200 group-hover/btn:text-white truncate">
                        3D Aquifer Radar
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover/btn:text-cyan-400 shrink-0" />
                  </button>

                  <button
                    onClick={() => onSelectAgent('namma-water', 'grievance')}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group/btn flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-200 group-hover/btn:text-white truncate">
                        BWSSB Statutory Notice
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover/btn:text-cyan-400 shrink-0" />
                  </button>
                </div>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                <span>BWSSB Helpline: <strong>1916</strong></span>
              </div>

              <button
                onClick={() => onSelectAgent('namma-water', 'inspect')}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-600/30 flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <span>Open Namma Water Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* NEW AGENT SETUP MODULE CARD BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/40 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center text-indigo-300 shrink-0 shadow-lg shadow-indigo-500/20">
            <PlusCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                NEW AGENT SETUP MODULE
              </span>
              <span className="text-xs font-mono text-slate-400">Easy Extensibility</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Configure New Future Civic Agents
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Define custom civic agents (e.g. <strong>Waste Management &amp; Sanitation</strong>, <strong>BESCOM Smart Energy Grid</strong>, <strong>Air Quality Radar</strong>, or <strong>e-Khata Tax AI</strong>) with placeholder statuses, custom sub-routes, telemetry metrics, and statutory compliance.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateAgentTrigger}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-teal-400 hover:opacity-95 text-slate-950 font-black text-xs transition-all shadow-xl shadow-indigo-500/25 flex items-center gap-2.5 shrink-0 cursor-pointer hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Agent Setup Form</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Upcoming Civic AI Agents & Extensible Roadmap Grid */}
      <section className="space-y-6 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800/60">
              EXTENSIBLE CIVIC ARCHITECTURE
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-2">
              Registered Civic Agents &amp; Roadmap
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Easily plug in future civic infrastructure engines across transport, clean energy, waste management, and state welfare.
            </p>
          </div>

          <button
            onClick={handleCreateAgentTrigger}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
          >
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            <span>Configure Agent</span>
          </button>
        </div>

        {/* Empty Search Result State */}
        {filteredAgents.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
              <Search className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No Civic Agents Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No registered agents matched your search query &ldquo;{searchQuery}&rdquo;. Try adjusting keywords or category filters.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white cursor-pointer"
              >
                Clear Search &amp; Filters
              </button>
              <button
                onClick={handleCreateAgentTrigger}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Configure Agent &ldquo;{searchQuery || 'New'}&rdquo;</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Custom & Roadmap Agents */}
            {filteredAgents
              .filter((a) => a.id !== 'janarogya' && a.id !== 'namma-water')
              .map((agent) => (
                <div
                  key={agent.id}
                  className={`rounded-2xl bg-slate-900/80 border ${agent.borderColor} p-6 flex flex-col justify-between space-y-4 hover:bg-slate-900 transition-all group`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className="p-2.5 rounded-xl flex items-center justify-center text-white shadow-md"
                        style={{ backgroundColor: agent.primaryColor }}
                      >
                        {renderDynamicAgentIcon(agent.iconName, 'w-5 h-5')}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            agent.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : agent.status === 'beta'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {agent.status.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{agent.releaseDate}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">{agent.name}</h3>
                      <span className="text-xs text-slate-400 font-mono block">{agent.department}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{agent.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    {/* Sub-modules count */}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{agent.subRoutes.length} Modules</span>
                      <span className="font-mono text-[11px] text-slate-400">{agent.version}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveModalAgent(agent)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <span>Blueprint</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onSelectAgent(agent.id, agent.subRoutes[0]?.id)}
                        className="px-3 py-1.5 rounded-xl text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer hover:opacity-90 shadow-sm"
                        style={{ backgroundColor: agent.primaryColor }}
                      >
                        <span>Launch</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {agent.isCustom && (
                        <button
                          onClick={() => removeAgent(agent.id)}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 cursor-pointer"
                          title="Remove custom agent"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            {/* Interactive "Add New Agent" Card */}
            <div
              onClick={handleCreateAgentTrigger}
              className="rounded-2xl border-2 border-dashed border-slate-800 hover:border-indigo-500 bg-slate-900/40 hover:bg-slate-900/80 p-6 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer transition-all group min-h-[260px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/70 border border-indigo-700/50 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-md">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Configure New Agent
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Plug in Waste Management, Energy Grid, Air Quality, or Smart Governance modules with our extensible form.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                Launch Agent Setup Form
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Extensible Architecture & Agent Registration Banner */}
      <section className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Pluggable Open Civic AI Agent Framework
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
              New civic intelligence modules (BESCOM power tariffs, BMTC feeder schedules, BBMP property taxes, Hasiru waste radar) are registered with standardized schemas across the unified header and command palette.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateAgentTrigger}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Setup New Agent</span>
          </button>

          <button
            onClick={() => setShowDeveloperModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-teal-400" />
            <span>Architecture Spec</span>
          </button>
        </div>
      </section>

      {/* Agent Detail Blueprint Modal */}
      {activeModalAgent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="p-3 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: activeModalAgent.primaryColor }}
                >
                  {renderDynamicAgentIcon(activeModalAgent.iconName, 'w-6 h-6')}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-800 text-slate-300">
                      {activeModalAgent.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{activeModalAgent.version}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-0.5">{activeModalAgent.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">{activeModalAgent.department}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveModalAgent(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <p className="leading-relaxed">{activeModalAgent.description}</p>

              <div>
                <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-[11px]">Key Highlights:</h4>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  {activeModalAgent.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-[11px]">Configured Modules:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModalAgent.subRoutes.map((r) => (
                    <div key={r.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                      {renderDynamicAgentIcon(r.iconName, 'w-3.5 h-3.5 text-cyan-400')}
                      <span className="text-xs font-semibold text-slate-200 truncate">{r.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Target Integration:</span>
                <span className="font-bold text-white font-mono">{activeModalAgent.releaseDate}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between gap-3">
              <button
                onClick={() => {
                  const targetId = activeModalAgent.id;
                  setActiveModalAgent(null);
                  onSelectAgent(targetId);
                }}
                className="px-4 py-2 rounded-xl text-slate-950 font-black text-xs cursor-pointer hover:opacity-90 flex items-center gap-1.5"
                style={{ backgroundColor: activeModalAgent.primaryColor }}
              >
                <span>Launch Agent Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveModalAgent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Developer Architecture Modal */}
      {showDeveloperModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700">
                  DEVELOPER ARCHITECTURE
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Pluggable Civic AI Agent Registry
                </h3>
                <p className="text-xs text-slate-400">
                  How new autonomous agents (waste management, solar grid, air radar, transport) are added to the unified suite.
                </p>
              </div>
              <button
                onClick={() => setShowDeveloperModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2 overflow-x-auto">
                <div className="text-teal-400 font-bold">// 1. Register with dynamic subRoutes &amp; telemetry</div>
                <pre>{`useAgentRegistryStore.getState().registerAgent({
  id: 'hasiru-waste',
  name: 'Hasiru Swachhatha AI',
  department: 'BBMP Solid Waste Management',
  status: 'beta',
  subRoutes: [
    { id: 'blackspot-scanner', name: 'Blackspot Vision Reporter', iconName: 'Camera' },
    { id: 'tipper-radar', name: 'Live Auto-Tipper GPS Map', iconName: 'Truck' }
  ]
});`}</pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  Automatic Platform Integrations:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-teal-400 block">Unified Command Bar</span>
                    <span className="text-slate-400">Instant search across all sub-modules via ⌘K</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-cyan-400 block">Dynamic Sub-Nav Header</span>
                    <span className="text-slate-400">Automatically renders tabs mapped from registry</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-indigo-400 block">Interactive Workspace</span>
                    <span className="text-slate-400">Simulated AI query execution &amp; telemetry logging</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-emerald-400 block">Smooth Motion Routing</span>
                    <span className="text-slate-400">framer-motion view transitions across agents</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between gap-3">
              <button
                onClick={() => {
                  setShowDeveloperModal(false);
                  setIsNewAgentModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
              >
                Open Setup Form
              </button>

              <button
                onClick={() => setShowDeveloperModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Agent Setup Modal */}
      <NewAgentSetupModal
        isOpen={isNewAgentModalOpen}
        onClose={() => setIsNewAgentModalOpen(false)}
        onAgentCreated={(createdId) => {
          setIsNewAgentModalOpen(false);
          onSelectAgent(createdId);
        }}
      />
    </div>
  );
};
