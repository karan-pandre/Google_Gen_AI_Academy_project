import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Code2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Droplets,
  HeartPulse,
  Compass,
  FileText,
  Sliders,
  Copy,
  Check,
  X,
  RefreshCw,
  Info,
  HelpCircle,
  Truck,
  Wind,
  SunMedium,
  Building,
  Vote,
  TreePine
} from 'lucide-react';
import { CivicAgentDefinition, AgentCategory, AgentStatus, AgentSubRoute, AgentMetric } from '../../types/agentRegistry';
import { useAgentRegistryStore } from '../../store/useAgentRegistryStore';
import { AVAILABLE_AGENT_ICONS, renderDynamicAgentIcon } from '../../lib/agentIconMap';

interface NewAgentSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgentCreated?: (agentId: string) => void;
}

// Preset Starter Templates
const STARTER_TEMPLATES: Array<{
  name: string;
  category: string;
  icon: string;
  color: string;
  data: Partial<CivicAgentDefinition>;
}> = [
  {
    name: 'BBMP Hasiru Swachhatha (Waste & Sanitation AI)',
    category: 'Environment & Waste',
    icon: 'Trash2',
    color: '#10b981', // emerald-500
    data: {
      id: 'hasiru-waste',
      name: 'Hasiru Swachhatha AI',
      shortName: 'Hasiru Waste',
      tagline: 'Autonomous Solid Waste Segregation & Blackspot Remediation',
      department: 'BBMP Solid Waste Management Special Cell & KSPCB',
      category: 'Environment & Waste',
      status: 'in-development',
      version: 'v1.0 Beta',
      releaseDate: 'Q3 2026',
      description:
        'AI-driven municipal waste tracking enabling citizens to report roadside garbage blackspots via camera vision, track daily door-to-door auto-tipper GPS arrivals, and earn green composting credits.',
      primaryColor: '#10b981',
      accentBg: 'from-emerald-950/80 via-slate-900 to-slate-950',
      borderColor: 'border-emerald-500/40 hover:border-emerald-400',
      textColor: 'text-emerald-400',
      iconName: 'Trash2',
      stats: [
        { label: 'Blackspots Cleared', value: '3,840', trend: '94% within 24 hrs' },
        { label: 'Auto-Tippers Live', value: '4,120 GPS', trend: 'Across 198 Wards' },
        { label: 'Waste Diverted', value: '420 Tons/day', trend: 'To Biomethanation' }
      ],
      highlights: [
        'Geotagged citizen blackspot vision scanner with automated BBMP Junior Health Inspector dispatch',
        'Real-time Auto-Tipper GPS tracking with 10-minute arrival push alerts',
        'Wet vs. Dry waste compliance scoring for apartment resident welfare associations (RWAs)'
      ],
      subRoutes: [
        {
          id: 'blackspot-scanner',
          name: 'Blackspot Vision Reporter',
          shortDesc: 'Photo snapshot AI classification with GPS & auto-ticket to Ward Health Inspector',
          iconName: 'Camera',
          badge: 'Vision AI'
        },
        {
          id: 'tipper-radar',
          name: 'Live Auto-Tipper GPS Map',
          shortDesc: 'Real-time municipal garbage collection vehicle ETA for your ward',
          iconName: 'Truck',
          badge: 'Live GPS'
        },
        {
          id: 'compost-credits',
          name: 'RWA Composting Credits',
          shortDesc: 'Track wet waste processing & claim BBMP property tax rebate certificates',
          iconName: 'Recycle'
        }
      ],
      complianceBadges: ['SWM Rules 2016', 'BBMP Ward Aligned', 'CPCB Certified', 'Swachh Bharat 2.0'],
      helpline: {
        number: '1533',
        label: 'BBMP Sahaya 24x7 Control Room'
      }
    }
  },
  {
    name: 'BESCOM Smart Solar & Energy Grid AI',
    category: 'Clean Energy',
    icon: 'SunMedium',
    color: '#8b5cf6', // violet-500
    data: {
      id: 'smart-energy',
      name: 'BESCOM Smart Solar & Grid AI',
      shortName: 'Smart Solar',
      tagline: 'Feeder Reliability, Outage Predictor & Rooftop Solar Subsidy Engine',
      department: 'BESCOM Karnataka & KREDL Renewable Energy',
      category: 'Clean Energy',
      status: 'beta',
      version: 'v1.2 Beta',
      releaseDate: 'Q3 2026',
      description:
        'Autonomous electrical grid transparency engine providing proactive feeder outage predictions, tariff slab dispute resolution, and PM Surya Ghar rooftop solar net-metering ROI calculation.',
      primaryColor: '#8b5cf6',
      accentBg: 'from-purple-950/80 via-slate-900 to-slate-950',
      borderColor: 'border-purple-500/40 hover:border-purple-400',
      textColor: 'text-purple-400',
      iconName: 'SunMedium',
      stats: [
        { label: 'Feeders Monitored', value: '1,840 Nodes', trend: '99.4% Grid Uptime' },
        { label: 'Solar Subsidies Approved', value: '₹14.8 Cr', trend: 'PM Surya Ghar' },
        { label: 'Outage Notice Lead', value: '3.5 Hours', trend: 'Proactive Alerting' }
      ],
      highlights: [
        'Proactive outage prediction based on feeder load thresholds and storm forecasts',
        'Satellite 3D shadow analysis for rooftop solar panel kilowatt potential',
        'Automated billing dispute filing for commercial vs residential tariff misclassifications'
      ],
      subRoutes: [
        {
          id: 'feeder-outage',
          name: 'Live Feeder Health & Outages',
          shortDesc: 'Transformer load telemetry and scheduled maintenance radar',
          iconName: 'Zap',
          badge: 'Real-time'
        },
        {
          id: 'solar-calc',
          name: 'PM Surya Ghar Calculator',
          shortDesc: 'Rooftop kilowatt estimate, net-metering returns & empaneled vendor quotes',
          iconName: 'SunMedium',
          badge: 'Govt Subsidy'
        },
        {
          id: 'bill-dispute',
          name: 'Tariff Dispute Auditor',
          shortDesc: 'Electricity bill OCR scanner to detect slab overcharges and fuel adjustment anomalies',
          iconName: 'FileText'
        }
      ],
      complianceBadges: ['KERC Tariff Verified', 'PM Surya Ghar Scheme', 'BESCOM 1912 API', 'BEE Star Rated'],
      helpline: {
        number: '1912',
        label: 'BESCOM 24x7 Power Helpline'
      }
    }
  },
  {
    name: 'Vayu Shuddhi (Air Quality & Dust Radar AI)',
    category: 'Environment & Waste',
    icon: 'Wind',
    color: '#0ea5e9', // sky-500
    data: {
      id: 'vayu-air',
      name: 'Vayu Shuddhi Air Quality AI',
      shortName: 'Vayu Air',
      tagline: 'Neighborhood PM2.5 Telemetry, Dust Violations & Health Advisories',
      department: 'KSPCB (Karnataka State Pollution Control Board)',
      category: 'Environment & Waste',
      status: 'planned',
      version: 'v0.8 Alpha',
      releaseDate: 'Q4 2026',
      description:
        'Continuous hyper-local particulate matter (PM2.5 / PM10) monitoring across 40+ continuous ambient stations with automated dust violation citations for uncontrolled construction sites.',
      primaryColor: '#0ea5e9',
      accentBg: 'from-sky-950/80 via-slate-900 to-slate-950',
      borderColor: 'border-sky-500/40 hover:border-sky-400',
      textColor: 'text-sky-400',
      iconName: 'Wind',
      stats: [
        { label: 'Sensors Online', value: '48 Stations', trend: '100% CPCB Grounded' },
        { label: 'Avg AQI Today', value: '74 Moderate', trend: 'BTM / Silk Board' },
        { label: 'Dust Notices Sent', value: '142 Sites', trend: 'Zero-mist violations' }
      ],
      highlights: [
        'Hyper-local AQI heatmap with asthma and vulnerable citizen health risk alerts',
        'Automated satellite + street sensor dust plume detection for construction sites',
        'School zone clean air corridors with dynamic heavy vehicle rerouting recommendations'
      ],
      subRoutes: [
        {
          id: 'aqi-map',
          name: 'Hyper-Local AQI Radar',
          shortDesc: 'Real-time PM2.5, PM10, NO2 & ozone levels across 48 continuous monitoring stations',
          iconName: 'Activity',
          badge: 'Live Sensors'
        },
        {
          id: 'dust-violations',
          name: 'Construction Dust Auditor',
          shortDesc: 'Report uncovered building debris & enforce National Clean Air Programme fines',
          iconName: 'Building',
          badge: 'Enforcement'
        }
      ],
      complianceBadges: ['CPCB Standards', 'NCAP Aligned', 'KSPCB Live Stream', 'WHO Air Guidelines'],
      helpline: {
        number: '080-25589112',
        label: 'KSPCB Air Quality Cell'
      }
    }
  },
  {
    name: 'JanSeva e-Khata & Property Tax AI',
    category: 'Smart Governance',
    icon: 'Building',
    color: '#f43f5e', // rose-500
    data: {
      id: 'bbmp-property-tax',
      name: 'JanSeva e-Khata & Tax AI',
      shortName: 'e-Khata AI',
      tagline: 'Autonomous Property Assessment, e-Khata Verification & Dispute Resolver',
      department: 'BBMP Revenue Department & e-Governance Karnataka',
      category: 'Smart Governance',
      status: 'planned',
      version: 'v0.9 Preview',
      releaseDate: 'Q4 2026',
      description:
        'Streamlines property tax SAS calculations, GPS-based e-Khata digitisation checks, PID verification, and title dispute risk assessments without middleman exploitation.',
      primaryColor: '#f43f5e',
      accentBg: 'from-rose-950/80 via-slate-900 to-slate-950',
      borderColor: 'border-rose-500/40 hover:border-rose-400',
      textColor: 'text-rose-400',
      iconName: 'Building',
      stats: [
        { label: 'e-Khatas Verified', value: '2.4M PID', trend: 'SAS 2026-27' },
        { label: 'Instant Tax Calc', value: '5 Secs', trend: 'With 5% early rebate' },
        { label: 'Dispute Guidance', value: '18,200+', trend: 'Resolutions issued' }
      ],
      highlights: [
        'PID & GIS property boundary instant lookup with zone-wise SAS unit value calculator',
        'A-Khata vs B-Khata transfer checklist with Aadhaar e-KYC guidance',
        'One-click official objection drafting for erroneous tax dimension assessments'
      ],
      subRoutes: [
        {
          id: 'tax-calculator',
          name: 'SAS Property Tax Estimator',
          shortDesc: 'Calculate self-assessment property tax with early-bird 5% rebate verification',
          iconName: 'FileText',
          badge: 'SAS 2026'
        },
        {
          id: 'ekhata-audit',
          name: 'e-Khata Title & GIS Verification',
          shortDesc: 'Check digitized e-Khata certificate validity & encumbrance records',
          iconName: 'ShieldCheck',
          badge: 'Official GIS'
        }
      ],
      complianceBadges: ['K-GIS Aligned', 'BBMP Act 2020', 'Seva Sindhu 2.0', 'e-Pauraseva Ready'],
      helpline: {
        number: '080-22660000',
        label: 'BBMP Revenue Helpline'
      }
    }
  }
];

const PRESET_COLOR_PALETTES = [
  { name: 'Emerald Waste', color: '#10b981', textColor: 'text-emerald-400', borderColor: 'border-emerald-500/40 hover:border-emerald-400', accentBg: 'from-emerald-950/80 via-slate-900 to-slate-950' },
  { name: 'Violet Energy', color: '#8b5cf6', textColor: 'text-purple-400', borderColor: 'border-purple-500/40 hover:border-purple-400', accentBg: 'from-purple-950/80 via-slate-900 to-slate-950' },
  { name: 'Sky Clean Air', color: '#0ea5e9', textColor: 'text-sky-400', borderColor: 'border-sky-500/40 hover:border-sky-400', accentBg: 'from-sky-950/80 via-slate-900 to-slate-950' },
  { name: 'Rose Welfare', color: '#f43f5e', textColor: 'text-rose-400', borderColor: 'border-rose-500/40 hover:border-rose-400', accentBg: 'from-rose-950/80 via-slate-900 to-slate-950' },
  { name: 'Amber Transit', color: '#f59e0b', textColor: 'text-amber-400', borderColor: 'border-amber-500/40 hover:border-amber-400', accentBg: 'from-amber-950/80 via-slate-900 to-slate-950' },
  { name: 'Cyan Water', color: '#06b6d4', textColor: 'text-cyan-400', borderColor: 'border-cyan-500/40 hover:border-cyan-400', accentBg: 'from-cyan-950/80 via-slate-900 to-slate-950' },
  { name: 'Teal Clinical', color: '#0d9488', textColor: 'text-teal-400', borderColor: 'border-teal-500/40 hover:border-teal-400', accentBg: 'from-teal-950/80 via-slate-900 to-slate-950' },
  { name: 'Indigo Smart City', color: '#6366f1', textColor: 'text-indigo-400', borderColor: 'border-indigo-500/40 hover:border-indigo-400', accentBg: 'from-indigo-950/80 via-slate-900 to-slate-950' }
];

export const NewAgentSetupModal: React.FC<NewAgentSetupModalProps> = ({
  isOpen,
  onClose,
  onAgentCreated
}) => {
  const { registerAgent } = useAgentRegistryStore();

  const [activeTab, setActiveTab] = useState<'form' | 'routes' | 'metrics' | 'code'>('form');
  const [copiedCode, setCopiedCode] = useState(false);
  const [successRegisteredId, setSuccessRegisteredId] = useState<string | null>(null);

  // Form State
  const [id, setId] = useState('hasiru-waste');
  const [name, setName] = useState('Hasiru Swachhatha AI');
  const [shortName, setShortName] = useState('Hasiru Waste');
  const [tagline, setTagline] = useState('Autonomous Municipal Waste Segregation & Blackspot Remediation');
  const [department, setDepartment] = useState('BBMP Solid Waste Management Cell & KSPCB');
  const [category, setCategory] = useState<AgentCategory>('Environment & Waste');
  const [status, setStatus] = useState<AgentStatus>('beta');
  const [version, setVersion] = useState('v1.0 Beta');
  const [releaseDate, setReleaseDate] = useState('Live Beta (Q3 2026)');
  const [description, setDescription] = useState(
    'AI-driven municipal waste tracking enabling citizens to report roadside garbage blackspots via camera vision, track daily door-to-door auto-tipper GPS arrivals, and earn green composting credits.'
  );
  const [primaryColor, setPrimaryColor] = useState('#10b981');
  const [textColor, setTextColor] = useState('text-emerald-400');
  const [borderColor, setBorderColor] = useState('border-emerald-500/40 hover:border-emerald-400');
  const [accentBg, setAccentBg] = useState('from-emerald-950/80 via-slate-900 to-slate-950');
  const [iconName, setIconName] = useState('Trash2');
  const [helplineNumber, setHelplineNumber] = useState('1533');
  const [helplineLabel, setHelplineLabel] = useState('BBMP Sahaya Waste & Sanitation Control Room');

  // Sub-routes list
  const [subRoutes, setSubRoutes] = useState<AgentSubRoute[]>([
    {
      id: 'blackspot-scanner',
      name: 'Blackspot Vision Reporter',
      shortDesc: 'Photo snapshot AI classification with GPS & auto-ticket to Ward Health Inspector',
      iconName: 'Camera',
      badge: 'Vision AI'
    },
    {
      id: 'tipper-radar',
      name: 'Live Auto-Tipper GPS Map',
      shortDesc: 'Real-time municipal garbage collection vehicle ETA for your ward',
      iconName: 'Truck',
      badge: 'Live GPS'
    },
    {
      id: 'compost-credits',
      name: 'RWA Composting Credits',
      shortDesc: 'Track wet waste processing & claim BBMP property tax rebate certificates',
      iconName: 'Recycle'
    }
  ]);

  // Metrics list
  const [stats, setStats] = useState<AgentMetric[]>([
    { label: 'Blackspots Cleared', value: '3,840', trend: '94% within 24 hrs' },
    { label: 'Auto-Tippers Live', value: '4,120 GPS', trend: 'Across 198 Wards' },
    { label: 'Waste Diverted', value: '420 Tons/day', trend: 'To Biomethanation' }
  ]);

  // Highlights list
  const [highlights, setHighlights] = useState<string[]>([
    'Geotagged citizen blackspot vision scanner with automated BBMP Junior Health Inspector dispatch',
    'Real-time Auto-Tipper GPS tracking with 10-minute arrival push alerts',
    'Wet vs. Dry waste compliance scoring for apartment resident welfare associations (RWAs)'
  ]);

  // Compliance Badges
  const [complianceBadges, setComplianceBadges] = useState<string[]>([
    'SWM Rules 2016',
    'BBMP Ward Aligned',
    'CPCB Certified',
    'Swachh Bharat 2.0'
  ]);
  const [newBadgeText, setNewBadgeText] = useState('');

  // Handle Starter Template Selection
  const handleApplyTemplate = (template: typeof STARTER_TEMPLATES[0]) => {
    const d = template.data;
    if (d.id) setId(d.id);
    if (d.name) setName(d.name);
    if (d.shortName) setShortName(d.shortName);
    if (d.tagline) setTagline(d.tagline);
    if (d.department) setDepartment(d.department);
    if (d.category) setCategory(d.category);
    if (d.status) setStatus(d.status);
    if (d.version) setVersion(d.version);
    if (d.releaseDate) setReleaseDate(d.releaseDate);
    if (d.description) setDescription(d.description);
    if (d.primaryColor) setPrimaryColor(d.primaryColor);
    if (d.textColor) setTextColor(d.textColor);
    if (d.borderColor) setBorderColor(d.borderColor);
    if (d.accentBg) setAccentBg(d.accentBg);
    if (d.iconName) setIconName(d.iconName);
    if (d.helpline) {
      setHelplineNumber(d.helpline.number);
      setHelplineLabel(d.helpline.label);
    }
    if (d.subRoutes) setSubRoutes(d.subRoutes);
    if (d.stats) setStats(d.stats);
    if (d.highlights) setHighlights(d.highlights);
    if (d.complianceBadges) setComplianceBadges(d.complianceBadges);
  };

  const handleApplyPalette = (palette: typeof PRESET_COLOR_PALETTES[0]) => {
    setPrimaryColor(palette.color);
    setTextColor(palette.textColor);
    setBorderColor(palette.borderColor);
    setAccentBg(palette.accentBg);
  };

  // Add/remove subroute
  const handleAddSubRoute = () => {
    const newId = `module-${Date.now().toString().slice(-4)}`;
    setSubRoutes([
      ...subRoutes,
      {
        id: newId,
        name: 'New Civic Intelligence Module',
        shortDesc: 'Automated civic verification and analytics workflow',
        iconName: 'Sparkles',
        badge: 'New'
      }
    ]);
  };

  const handleUpdateSubRoute = (index: number, field: keyof AgentSubRoute, value: string) => {
    setSubRoutes((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  const handleRemoveSubRoute = (index: number) => {
    setSubRoutes((prev) => prev.filter((_, i) => i !== index));
  };

  // Add/remove metric
  const handleAddMetric = () => {
    setStats([...stats, { label: 'New Metric', value: '1,000+', trend: 'Live Telemetry' }]);
  };

  const handleUpdateMetric = (index: number, field: keyof AgentMetric, value: string) => {
    setStats((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleRemoveMetric = (index: number) => {
    setStats((prev) => prev.filter((_, i) => i !== index));
  };

  // Badges
  const handleAddBadge = () => {
    if (newBadgeText.trim() && !complianceBadges.includes(newBadgeText.trim())) {
      setComplianceBadges([...complianceBadges, newBadgeText.trim()]);
      setNewBadgeText('');
    }
  };

  const handleRemoveBadge = (badgeToRemove: string) => {
    setComplianceBadges(complianceBadges.filter((b) => b !== badgeToRemove));
  };

  // Generate constructed Agent Object
  const constructedAgent: CivicAgentDefinition = {
    id: id.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
    name: name.trim() || 'Custom Civic AI Agent',
    shortName: shortName.trim() || name.split(' ')[0] || 'Custom AI',
    tagline: tagline.trim() || 'Autonomous Public Intelligence Engine',
    department: department.trim() || 'Government of Karnataka / BBMP',
    category,
    status,
    version: version.trim() || 'v1.0',
    releaseDate: releaseDate.trim() || 'Live in Suite',
    description: description.trim(),
    primaryColor,
    accentBg,
    borderColor,
    textColor,
    iconName,
    stats,
    highlights,
    subRoutes,
    complianceBadges,
    helpline: {
      number: helplineNumber || '1912 / 104',
      label: helplineLabel || 'Citizen Grievance Helpline'
    },
    isCustom: true,
    createdAt: new Date().toISOString()
  };

  // Generate Code Output
  const generatedTsCode = `// Registered in Namma Bengaluru Civic Suite
export const ${constructedAgent.id.replace(/-/g, '_').toUpperCase()}_AGENT: CivicAgentDefinition = ${JSON.stringify(
    constructedAgent,
    null,
    2
  )};`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedTsCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Register Agent to Active Suite
  const handleRegisterAndDeploy = () => {
    registerAgent(constructedAgent);
    setSuccessRegisteredId(constructedAgent.id);
    if (onAgentCreated) {
      onAgentCreated(constructedAgent.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
    >
      <div className="bg-slate-900 text-slate-100 border border-slate-700/80 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-indigo-950 text-indigo-300 border border-indigo-700/60 uppercase">
                  OPEN AGENT REGISTRY SDK
                </span>
                <span className="text-xs text-slate-400 font-mono">Pluggable Extensible Suite</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                Configure &amp; Register New Civic AI Agent
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Starter Templates Bar */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950/50 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-slate-400 font-bold text-[11px] shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Quick Presets:
          </span>
          {STARTER_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.name}
              onClick={() => handleApplyTemplate(tmpl)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer hover:border-slate-500"
            >
              {renderDynamicAgentIcon(tmpl.icon, 'w-3.5 h-3.5')}
              <span>{tmpl.name.split(' (')[0]}</span>
            </button>
          ))}
        </div>

        {/* Tabs Bar */}
        <div className="px-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'form'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Identity &amp; Branding
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'routes'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>2. Sub-Modules ({subRoutes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'metrics'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Telemetry &amp; Compliance
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'code'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Blueprint Spec</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Instant Hot-Plug Ready</span>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
          {/* TAB 1: FORM & BRANDING */}
          {activeTab === 'form' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-5">
                {/* Agent Name & ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Agent Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Hasiru Swachhatha AI"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Agent Unique Slug ID</label>
                    <input
                      type="text"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      placeholder="e.g. hasiru-waste"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Short Name & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Short Header Name</label>
                    <input
                      type="text"
                      value={shortName}
                      onChange={(e) => setShortName(e.target.value)}
                      placeholder="e.g. Hasiru Waste"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Tagline / Subtitle</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Autonomous Solid Waste Segregation & Blackspot Remediation"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Department & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Department / Statutory Authority</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. BBMP Solid Waste Management / KSPCB"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Civic Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as AgentCategory)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Environment & Waste">Environment &amp; Waste</option>
                      <option value="Clean Energy">Clean Energy</option>
                      <option value="Urban Mobility">Urban Mobility</option>
                      <option value="Civic Infrastructure">Civic Infrastructure</option>
                      <option value="Healthcare & Clinical">Healthcare &amp; Clinical</option>
                      <option value="Public Welfare">Public Welfare</option>
                      <option value="Smart Governance">Smart Governance</option>
                      <option value="Emergency & Safety">Emergency &amp; Safety</option>
                    </select>
                  </div>
                </div>

                {/* Status, Version, Release Date */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Current Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as AgentStatus)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="active">🟢 Active (Live in Suite)</option>
                      <option value="beta">🟡 Beta Preview</option>
                      <option value="in-development">🟠 In Development</option>
                      <option value="planned">⚪ Planned Roadmap</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Version Tag</label>
                    <input
                      type="text"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="e.g. v1.0 Beta"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Release Horizon</label>
                    <input
                      type="text"
                      value={releaseDate}
                      onChange={(e) => setReleaseDate(e.target.value)}
                      placeholder="e.g. Q3 2026 or Active"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Mission Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe how this agent automates civic workflows..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Palette and Icon Choice */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-slate-300 block">Theme Color Palette</label>
                  <div className="flex flex-wrap items-center gap-2">
                    {PRESET_COLOR_PALETTES.map((pal) => (
                      <button
                        key={pal.name}
                        onClick={() => handleApplyPalette(pal)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                          primaryColor === pal.color
                            ? 'bg-slate-800 text-white border-white shadow-md'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pal.color }} />
                        <span>{pal.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Icon Grid */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-300 block">Agent Icon</label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-36 overflow-y-auto p-2 rounded-2xl bg-slate-950 border border-slate-800 scrollbar-thin">
                    {AVAILABLE_AGENT_ICONS.map((ic) => (
                      <button
                        key={ic.name}
                        onClick={() => setIconName(ic.name)}
                        className={`p-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
                          iconName === ic.name
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-white'
                        }`}
                      >
                        <ic.icon className="w-4 h-4" />
                        <span className="truncate max-w-[60px]">{ic.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* LIVE PREVIEW CARD */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Live Hub Card Preview
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                    Real-time
                  </span>
                </div>

                {/* Card representation */}
                <div
                  className={`rounded-3xl bg-gradient-to-b ${accentBg} border ${borderColor} p-5 space-y-4 shadow-xl transition-all`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {renderDynamicAgentIcon(iconName, 'w-6 h-6')}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : status === 'beta'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {status.toUpperCase()}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">{version}</span>
                        </div>
                        <h4 className="text-lg font-black text-white mt-0.5">{name}</h4>
                        <span className={`text-xs font-semibold ${textColor}`}>{tagline}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {description || 'Configure description in the form...'}
                  </p>

                  {/* Sample Stats Preview */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px]">
                    {stats.slice(0, 2).map((st, i) => (
                      <div key={i}>
                        <span className="text-slate-400 text-[10px] block">{st.label}</span>
                        <span className="font-bold text-white" style={{ color: primaryColor }}>
                          {st.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Modules count */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>{subRoutes.length} Interactive Modules</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      <span>Ready</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Header preview representation */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Header Sub-Nav Preview
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {subRoutes.map((r, i) => (
                      <div
                        key={r.id}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 whitespace-nowrap ${
                          i === 0 ? 'text-slate-950 font-black' : 'bg-slate-900 text-slate-400'
                        }`}
                        style={{ backgroundColor: i === 0 ? primaryColor : undefined }}
                      >
                        {renderDynamicAgentIcon(r.iconName, 'w-3 h-3')}
                        <span>{r.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUB-ROUTES / MODULES */}
          {activeTab === 'routes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Interactive Sub-Modules &amp; Routes</h3>
                  <p className="text-xs text-slate-400">
                    Define the sub-tools and workflows that will appear in the top sub-nav bar and command palette.
                  </p>
                </div>

                <button
                  onClick={handleAddSubRoute}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Sub-Module</span>
                </button>
              </div>

              <div className="space-y-3">
                {subRoutes.map((route, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 shrink-0">
                        {renderDynamicAgentIcon(route.iconName, 'w-4 h-4')}
                      </div>

                      <div className="space-y-1 flex-1 sm:w-64">
                        <input
                          type="text"
                          value={route.name}
                          onChange={(e) => handleUpdateSubRoute(idx, 'name', e.target.value)}
                          placeholder="Module Name"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          value={route.shortDesc}
                          onChange={(e) => handleUpdateSubRoute(idx, 'shortDesc', e.target.value)}
                          placeholder="Short description..."
                          className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <select
                        value={route.iconName}
                        onChange={(e) => handleUpdateSubRoute(idx, 'iconName', e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold focus:outline-none cursor-pointer"
                      >
                        {AVAILABLE_AGENT_ICONS.map((ic) => (
                          <option key={ic.name} value={ic.name}>
                            {ic.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={route.badge || ''}
                        onChange={(e) => handleUpdateSubRoute(idx, 'badge', e.target.value)}
                        placeholder="Badge (e.g. AI)"
                        className="w-24 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono focus:outline-none"
                      />

                      <button
                        onClick={() => handleRemoveSubRoute(idx)}
                        disabled={subRoutes.length <= 1}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 transition-all disabled:opacity-30 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TELEMETRY & COMPLIANCE */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* Telemetry Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Live Telemetry &amp; Public Metrics</h3>
                    <p className="text-xs text-slate-400">Cards shown in the Hub overview</p>
                  </div>
                  <button
                    onClick={handleAddMetric}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Metric</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {stats.map((metric, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Metric #{idx + 1}</span>
                        <button
                          onClick={() => handleRemoveMetric(idx)}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={metric.label}
                        onChange={(e) => handleUpdateMetric(idx, 'label', e.target.value)}
                        placeholder="Label"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-bold focus:outline-none"
                      />
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => handleUpdateMetric(idx, 'value', e.target.value)}
                        placeholder="Value (e.g. 14,820+)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-black focus:outline-none"
                      />
                      <input
                        type="text"
                        value={metric.trend || ''}
                        onChange={(e) => handleUpdateMetric(idx, 'trend', e.target.value)}
                        placeholder="Trend subtitle..."
                        className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[10px] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance Badges */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-white">Statutory Compliance &amp; Standards Badges</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {complianceBadges.map((badge) => (
                    <span
                      key={badge}
                      className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{badge}</span>
                      <button
                        onClick={() => handleRemoveBadge(badge)}
                        className="text-slate-500 hover:text-rose-400 cursor-pointer ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 max-w-md">
                  <input
                    type="text"
                    value={newBadgeText}
                    onChange={(e) => setNewBadgeText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddBadge()}
                    placeholder="Add standard (e.g. SWM Rules 2016)"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleAddBadge}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Add Badge
                  </button>
                </div>
              </div>

              {/* Helpline Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Helpline / SOS Number</label>
                  <input
                    type="text"
                    value={helplineNumber}
                    onChange={(e) => setHelplineNumber(e.target.value)}
                    placeholder="e.g. 1533 / 1912"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Helpline Label / Department</label>
                  <input
                    type="text"
                    value={helplineLabel}
                    onChange={(e) => setHelplineLabel(e.target.value)}
                    placeholder="e.g. 24x7 Municipal Control Room"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BLUEPRINT & CODE GENERATOR */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Generated Agent Blueprint (TypeScript)</h3>
                  <p className="text-xs text-slate-400">
                    Copy or export this definition directly into your civic repository.
                  </p>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Blueprint</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 max-h-80 overflow-y-auto scrollbar-thin">
                <pre>{generatedTsCode}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Extensible schema automatically registered across Hub, Header, and Command Palette</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer w-full sm:w-auto"
            >
              Cancel
            </button>

            <button
              onClick={handleRegisterAndDeploy}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 hover:opacity-95 text-white text-xs font-black transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>Register &amp; Launch in Suite</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
