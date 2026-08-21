import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  PhoneCall,
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Send,
  FileText,
  RotateCcw,
  Sliders,
  Share2,
  Layers,
  Database,
  Radio,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CivicAgentDefinition, AgentStatus } from '../../types/agentRegistry';
import { renderDynamicAgentIcon } from '../../lib/agentIconMap';
import { useAgentRegistryStore } from '../../store/useAgentRegistryStore';

interface CustomAgentWorkspaceProps {
  agent: CivicAgentDefinition;
  onReturnToHub: () => void;
  activeSubRouteId?: string;
  onSubRouteChange?: (subRouteId: string) => void;
}

export const CustomAgentWorkspace: React.FC<CustomAgentWorkspaceProps> = ({
  agent,
  onReturnToHub,
  activeSubRouteId,
  onSubRouteChange
}) => {
  const { updateAgentStatus } = useAgentRegistryStore();

  const currentRouteId = activeSubRouteId || agent.subRoutes[0]?.id || 'overview';
  const activeRoute = agent.subRoutes.find((r) => r.id === currentRouteId) || agent.subRoutes[0];

  const [simulatedQuery, setSimulatedQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationLog, setSimulationLog] = useState<Array<{ id: string; time: string; action: string; status: string; detail: string }>>([
    {
      id: 'LOG-01',
      time: new Date().toLocaleTimeString(),
      action: 'Agent Initialized',
      status: 'Ready',
      detail: `Autonomous pipeline loaded with ${agent.subRoutes.length} active civic modules under ${agent.department}.`
    }
  ]);

  const handleRunSimulation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!simulatedQuery.trim() && !activeRoute) return;

    const queryText = simulatedQuery.trim() || `Automated query for ${activeRoute?.name || 'civic service'}`;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setSimulationLog((prev) => [
        {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          time: new Date().toLocaleTimeString(),
          action: `${activeRoute?.name || 'Civic'} Verification`,
          status: 'Success (Verified)',
          detail: `Processed request "${queryText}". Grounded with ${agent.complianceBadges.join(', ')}.`
        },
        ...prev
      ]);
      setSimulatedQuery('');
    }, 900);
  };

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Active Production
          </span>
        );
      case 'beta':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Beta Workspace
          </span>
        );
      case 'in-development':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
            In Development
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 uppercase">
            Planned Roadmap
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToHub}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>AI Agents Hub</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <motion.span
                layoutId="active-workspace-badge"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-950 font-mono"
                style={{ backgroundColor: agent.primaryColor }}
              >
                {agent.shortName}
              </motion.span>
              <span className="text-xs text-slate-400 font-mono">{agent.department}</span>
            </div>
            <motion.h2
              layoutId="active-workspace-title"
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="text-2xl font-bold text-white tracking-tight mt-0.5"
            >
              {agent.name}
            </motion.h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge(agent.status)}

          {/* Quick status promoter for developers/testing */}
          <select
            value={agent.status}
            onChange={(e) => updateAgentStatus(agent.id, e.target.value as AgentStatus)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold focus:outline-none cursor-pointer"
            title="Toggle simulated environment status"
          >
            <option value="active">Status: Active</option>
            <option value="beta">Status: Beta</option>
            <option value="in-development">Status: In Dev</option>
            <option value="planned">Status: Planned</option>
          </select>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Helpline: <strong className="font-mono text-white">{agent.helpline.number}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Route Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {agent.subRoutes.map((route) => {
          const isActive = route.id === currentRouteId;
          return (
            <button
              key={route.id}
              onClick={() => onSubRouteChange && onSubRouteChange(route.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-slate-950 font-black shadow-lg'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
              style={{ backgroundColor: isActive ? agent.primaryColor : undefined }}
            >
              {renderDynamicAgentIcon(route.iconName, 'w-4 h-4')}
              <span>{route.name}</span>
              {route.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {route.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Workspace Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Module Station */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className={`rounded-3xl bg-gradient-to-b ${agent.accentBg} border ${agent.borderColor} p-6 sm:p-8 space-y-6 shadow-2xl`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-xl shrink-0"
                  style={{ backgroundColor: agent.primaryColor }}
                >
                  {renderDynamicAgentIcon(activeRoute?.iconName || agent.iconName, 'w-7 h-7')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 text-white border border-slate-800">
                      MODULE: {activeRoute?.id.toUpperCase()}
                    </span>
                    {activeRoute?.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {activeRoute.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                    {activeRoute?.name || agent.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">{activeRoute?.shortDesc}</p>
                </div>
              </div>
            </div>

            {/* Interactive Simulation & Test Terminal */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Execute Autonomous AI Action</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">Multimodal Pipeline</span>
              </div>

              <form onSubmit={handleRunSimulation} className="flex gap-2">
                <input
                  type="text"
                  value={simulatedQuery}
                  onChange={(e) => setSimulatedQuery(e.target.value)}
                  placeholder={`Enter citizen input for ${activeRoute?.name || 'civic intake'} (e.g. Ward 150 snapshot, meter ID, GPS report)...`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: agent.primaryColor }}
                >
                  {isProcessing ? (
                    <>
                      <Activity className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Run</span>
                    </>
                  )}
                </button>
              </form>

              {/* Sample test prompts */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-[11px] text-slate-500">Quick Test Prompts:</span>
                {[
                  'Scan photo snapshot at Indiranagar 100ft Rd',
                  'Verify compliance against 2026 statutory rules',
                  'Dispatch official SMS notice to ward inspector'
                ].map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSimulatedQuery(prompt);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-800 transition-all cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Pipeline Telemetry Log */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Live Execution Log
                </span>
                <button
                  onClick={() =>
                    setSimulationLog([
                      {
                        id: `LOG-${Date.now().toString().slice(-4)}`,
                        time: new Date().toLocaleTimeString(),
                        action: 'Log Cleared',
                        status: 'Idle',
                        detail: 'Telemetry stream reset.'
                      }
                    ])
                  }
                  className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Log</span>
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                {simulationLog.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{log.action}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                          {log.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{log.detail}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Metrics, Highlights & Compliance */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Telemetry Metrics
              </span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="space-y-3">
              {agent.stats.map((metric, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">{metric.label}</span>
                  <div className="text-lg font-black text-white mt-0.5" style={{ color: agent.primaryColor }}>
                    {metric.value}
                  </div>
                  {metric.trend && <span className="text-[10px] text-slate-500">{metric.trend}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Highlights & Mission */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Key Capabilities &amp; Highlights
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              {agent.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Statutory Governance &amp; Standards
            </span>
            <div className="flex flex-wrap gap-2">
              {agent.complianceBadges.map((badge, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
