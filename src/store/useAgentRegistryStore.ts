import { create } from 'zustand';
import { CivicAgentDefinition, AgentStatus } from '../types/agentRegistry';
import { CIVIC_AGENTS_REGISTRY } from '../data/agentRegistryData';

interface AgentRegistryState {
  agents: CivicAgentDefinition[];
  activeCustomSubRoutes: Record<string, string>; // agentId -> active subRouteId
  registerAgent: (agent: CivicAgentDefinition) => void;
  updateAgentStatus: (agentId: string, status: AgentStatus) => void;
  removeAgent: (agentId: string) => void;
  resetToDefaults: () => void;
  setActiveCustomSubRoute: (agentId: string, subRouteId: string) => void;
  getAgentById: (agentId: string) => CivicAgentDefinition | undefined;
}

const STORAGE_KEY = 'namma_civic_registered_agents_v2';

const loadInitialAgents = (): CivicAgentDefinition[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as CivicAgentDefinition[];
      // Merge with default list to ensure built-ins are always present and up-to-date
      const builtInIds = new Set(CIVIC_AGENTS_REGISTRY.map((a) => a.id));
      const customAgents = parsed.filter((a) => !builtInIds.has(a.id));
      return [...CIVIC_AGENTS_REGISTRY, ...customAgents];
    }
  } catch (err) {
    console.error('Failed to load agents from storage:', err);
  }
  return CIVIC_AGENTS_REGISTRY;
};

const saveCustomAgents = (agents: CivicAgentDefinition[]) => {
  try {
    const builtInIds = new Set(CIVIC_AGENTS_REGISTRY.map((a) => a.id));
    const customOnly = agents.filter((a) => !builtInIds.has(a.id) || a.isCustom);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customOnly));
  } catch (err) {
    console.error('Failed to save custom agents to storage:', err);
  }
};

export const useAgentRegistryStore = create<AgentRegistryState>((set, get) => ({
  agents: loadInitialAgents(),
  activeCustomSubRoutes: {},

  registerAgent: (newAgent: CivicAgentDefinition) => {
    set((state) => {
      const existsIndex = state.agents.findIndex((a) => a.id === newAgent.id);
      let updated: CivicAgentDefinition[];
      if (existsIndex >= 0) {
        updated = state.agents.map((a, idx) => (idx === existsIndex ? newAgent : a));
      } else {
        updated = [...state.agents, newAgent];
      }
      saveCustomAgents(updated);
      return {
        agents: updated,
        activeCustomSubRoutes: {
          ...state.activeCustomSubRoutes,
          [newAgent.id]: newAgent.subRoutes[0]?.id || 'overview'
        }
      };
    });
  },

  updateAgentStatus: (agentId: string, status: AgentStatus) => {
    set((state) => {
      const updated = state.agents.map((a) => (a.id === agentId ? { ...a, status } : a));
      saveCustomAgents(updated);
      return { agents: updated };
    });
  },

  removeAgent: (agentId: string) => {
    set((state) => {
      const updated = state.agents.filter((a) => a.id !== agentId);
      saveCustomAgents(updated);
      return { agents: updated };
    });
  },

  resetToDefaults: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error(err);
    }
    set({ agents: CIVIC_AGENTS_REGISTRY });
  },

  setActiveCustomSubRoute: (agentId: string, subRouteId: string) => {
    set((state) => ({
      activeCustomSubRoutes: {
        ...state.activeCustomSubRoutes,
        [agentId]: subRouteId
      }
    }));
  },

  getAgentById: (agentId: string) => {
    return get().agents.find((a) => a.id === agentId);
  }
}));
