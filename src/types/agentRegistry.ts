export type AgentId = string;

export type AgentStatus = 'active' | 'beta' | 'in-development' | 'planned';

export type AgentCategory =
  | 'Healthcare & Clinical'
  | 'Civic Infrastructure'
  | 'Urban Mobility'
  | 'Clean Energy'
  | 'Public Welfare'
  | 'Environment & Waste'
  | 'Smart Governance'
  | 'Emergency & Safety';

export interface AgentSubRoute {
  id: string;
  name: string;
  shortDesc: string;
  iconName: string;
  badge?: string;
}

export interface AgentMetric {
  label: string;
  value: string;
  trend?: string;
  subtext?: string;
}

export interface CivicAgentDefinition {
  id: AgentId;
  name: string;
  shortName: string;
  tagline: string;
  department: string;
  category: AgentCategory;
  status: AgentStatus;
  version: string;
  releaseDate: string;
  description: string;
  primaryColor: string;
  accentBg: string;
  borderColor: string;
  textColor: string;
  iconName: string;
  stats: AgentMetric[];
  highlights: string[];
  subRoutes: AgentSubRoute[];
  complianceBadges: string[];
  helpline: {
    number: string;
    label: string;
  };
  isCustom?: boolean;
  systemPrompt?: string;
  createdAt?: string;
}
