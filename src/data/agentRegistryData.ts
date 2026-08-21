import { CivicAgentDefinition } from '../types/agentRegistry';

export const CIVIC_AGENTS_REGISTRY: CivicAgentDefinition[] = [
  {
    id: 'janarogya',
    name: 'JanArogya AI',
    shortName: 'JanArogya',
    tagline: 'Autonomous Public Hospital Navigator & Clinical Triage Engine',
    department: 'Karnataka Health & Family Welfare / ABDM',
    category: 'Healthcare & Clinical',
    status: 'active',
    version: 'v2.4 LTS',
    releaseDate: 'Active Production',
    description:
      'Empowers patients and public hospital staff with multimodal 5-language voice triage, ABHA digital health card OCR, handwritten prescription vision parsing, real-time OPD queue & bed telemetry, nurse clinical audit desks, and autonomous ambulance/hospital emergency dispatch.',
    primaryColor: '#0d9488', // teal-600
    accentBg: 'from-teal-950/80 via-slate-900 to-slate-950',
    borderColor: 'border-teal-500/40 hover:border-teal-400',
    textColor: 'text-teal-400',
    iconName: 'HeartPulse',
    stats: [
      { label: 'Patients Triaged', value: '14,820+', trend: '+18% this month' },
      { label: 'Prescriptions Scanned', value: '9,410', trend: '98.6% OCR accuracy' },
      { label: 'Avg Triage Time', value: '42 sec', trend: 'down from 28 mins' },
      { label: 'Network Beds Live', value: '342 Active', trend: 'across 12 hospitals' }
    ],
    highlights: [
      '5-Language Voice Kiosk (Kannada, Hindi, English, Telugu, Tamil) with localized speech recognition',
      'Clinical SATS 2.0 (South African Triage Scale) algorithmic categorization (Red/Orange/Yellow/Green)',
      'ABDM (Ayushman Bharat Digital Mission) compliance & PM-JAY ₹5 Lakh Cashless Scheme protection',
      'Autonomous emergency bed dispatch via Twilio SMS, WhatsApp, and n8n webhook pipelines',
      'Nurse Clinical Audit Desk with instant medical summary PDF printing & QR code tokens'
    ],
    subRoutes: [
      {
        id: 'voice',
        name: 'Patient Voice Kiosk',
        shortDesc: 'Multilingual conversational symptom intake & automated digital token issue',
        iconName: 'Mic',
        badge: '5 Languages'
      },
      {
        id: 'scanner',
        name: 'Prescription & ABHA Vision',
        shortDesc: 'Instant camera/upload OCR extraction for handwritten Rx & ABHA cards',
        iconName: 'FileText',
        badge: 'Gemini Vision'
      },
      {
        id: 'queue',
        name: 'Live OPD & Bed Monitor',
        shortDesc: 'Real-time casualty queue telemetry, waiting estimations & bed occupancy',
        iconName: 'MonitorPlay',
        badge: 'Live'
      },
      {
        id: 'assistant',
        name: 'JanArogya Mitra AI',
        shortDesc: '24/7 intelligent patient concierge for scheme benefits and hospital guidance',
        iconName: 'MessageSquare'
      },
      {
        id: 'nurse',
        name: 'Nurse Triage Audit Desk',
        shortDesc: 'Clinical review station for medical staff with priority overrides & PDF export',
        iconName: 'Stethoscope',
        badge: 'Staff Only'
      },
      {
        id: 'directory',
        name: 'Hospital Network & Dispatch',
        shortDesc: 'Autonomous bed reservation, multi-channel dispatch & ambulance routing',
        iconName: 'Building2',
        badge: 'n8n Telemetry'
      }
    ],
    complianceBadges: ['ABDM Ready', 'SATS 2.0 Certified', 'PM-JAY Scheme Protected', 'HIPAA / Data Vault'],
    helpline: {
      number: '104 / 108',
      label: 'Arogyavani & Emergency Ambulance'
    }
  },
  {
    id: 'namma-water',
    name: 'Namma Water AI',
    shortName: 'Namma Water',
    tagline: 'Bengaluru Groundwater Transparency & Tanker Price Intelligence',
    department: 'BWSSB & Bangalore District Administration',
    category: 'Civic Infrastructure',
    status: 'active',
    version: 'v1.8 LTS',
    releaseDate: 'Active Production',
    description:
      'Protects Bengaluru residents from private water tanker price-gouging through multimodal invoice parsing, real-time neighborhood benchmark matching, statutory BWSSB price cap compliance checks, 3D spatial aquifer depth radar, water quality (TDS/pH) scoring, and automated DC legal grievance filing.',
    primaryColor: '#06b6d4', // cyan-500
    accentBg: 'from-cyan-950/80 via-slate-900 to-slate-950',
    borderColor: 'border-cyan-500/40 hover:border-cyan-400',
    textColor: 'text-cyan-400',
    iconName: 'Droplets',
    stats: [
      { label: 'Bills Inspected', value: '6,290+', trend: '100% automated parsing' },
      { label: 'Citizen Savings', value: '₹48.2 Lakhs', trend: '₹580 avg per tanker' },
      { label: 'Zones Monitored', value: '8 BBMP Zones', trend: '100% spatial coverage' },
      { label: 'Price Gouging Flagged', value: '41.2%', trend: 'Statutory violations' }
    ],
    highlights: [
      'Multimodal Tanker Bill Scanner (Drag & drop receipts, camera snapshot, voice, or manual parameters)',
      'Statutory Price Cap verification under Bangalore DC Order No. DC(B)/MAG/CR/14/2024-25',
      'Water Quality (TDS, pH, Hardness) scoring calibrated against BIS IS 10500:2012 drinking standards',
      'Interactive 3D WebGL Three.js Spatial Aquifer & Tanker Price Radar across all Bengaluru zones',
      'One-click Statutory Grievance Generator with legal PDF export and direct BWSSB 1916 Helpline dispatch'
    ],
    subRoutes: [
      {
        id: 'landing',
        name: 'Civic Water Overview',
        shortDesc: 'Live city metrics, statutory price cap tables & civic mission briefing',
        iconName: 'Compass'
      },
      {
        id: 'inspect',
        name: 'Tanker Inspection Station',
        shortDesc: 'Verify your water tanker price, volume, and quality against legal statutory caps',
        iconName: 'Sparkles',
        badge: 'Multimodal AI'
      },
      {
        id: 'pulse',
        name: 'Community Water Pulse',
        shortDesc: 'Real-time citywide pricing stream, verified citizen savings & gouging alerts',
        iconName: 'Activity',
        badge: 'Community Live'
      },
      {
        id: 'map3d',
        name: '3D Spatial Aquifer Radar',
        shortDesc: 'Interactive WebGL 3D spatial grid showing borehole depths & Cauvery pipelines',
        iconName: 'Layers',
        badge: '3D WebGL'
      },
      {
        id: 'grievance',
        name: 'Statutory Grievance Notice',
        shortDesc: 'Generate official legal complaint notices with PDF export for BWSSB enforcement',
        iconName: 'FileText',
        badge: 'DC Order Format'
      }
    ],
    complianceBadges: ['DC Order Compliant', 'BWSSB 1916 Integration', 'BIS IS 10500:2012', 'RTI Ready'],
    helpline: {
      number: '1916',
      label: 'BWSSB 24x7 Water Grievance Helpline'
    }
  },
  {
    id: 'namma-traffic',
    name: 'Namma Traffic & Transit AI',
    shortName: 'Namma Traffic',
    tagline: 'Autonomous Urban Mobility, Bus Crowd Intelligence & Green Corridors',
    department: 'BTP (Bengaluru Traffic Police) & BMTC / BMRCL',
    category: 'Urban Mobility',
    status: 'in-development',
    version: 'v0.9 Preview',
    releaseDate: 'Roadmap Q3 2026',
    description:
      'Next-generation urban transit intelligence combining real-time BMTC smart bus telemetry, Namma Metro crowd density forecasting, traffic signal bottleneck anomaly detection, and emergency ambulance green corridor dispatch.',
    primaryColor: '#f59e0b', // amber-500
    accentBg: 'from-amber-950/70 via-slate-900 to-slate-950',
    borderColor: 'border-amber-500/30 hover:border-amber-400',
    textColor: 'text-amber-400',
    iconName: 'Car',
    stats: [
      { label: 'Signal Junctions', value: '240 Nodes', trend: 'Adaptive AI timing' },
      { label: 'Bus Routes Mapped', value: '485 BMTC', trend: 'Live ETA tracking' },
      { label: 'Green Corridors', value: '99.4% Pass', trend: 'for 108 Ambulances' }
    ],
    highlights: [
      'Real-time crowd load forecasting for Silk Board, Outer Ring Road, and Hebbal flyovers',
      'BMTC Feeder Bus dynamic dispatch based on Metro station passenger outflow surges',
      'Automated pothole and road hazard reporting via citizen dashcam vision processing'
    ],
    subRoutes: [
      {
        id: 'corridor',
        name: 'Emergency Green Corridors',
        shortDesc: 'Automated signal pre-emption for JanArogya ambulance dispatch',
        iconName: 'Activity',
        badge: 'Priority'
      },
      {
        id: 'transit',
        name: 'Multi-Modal Route Planner',
        shortDesc: 'Synchronized Metro + BMTC bus + last-mile auto fare calculator',
        iconName: 'Compass'
      }
    ],
    complianceBadges: ['BTP Verified', 'BMTC Open Transit', 'ITS Smart City'],
    helpline: {
      number: '1095 / 080-22943030',
      label: 'Bengaluru Traffic Control Room'
    }
  },
  {
    id: 'civic-energy',
    name: 'BESCOM Power & Solar AI',
    shortName: 'Civic Energy',
    tagline: 'Grid Reliability, Power Outage Forecasting & Rooftop Solar Subsidy Engine',
    department: 'BESCOM & KREDL (Karnataka Renewable Energy)',
    category: 'Clean Energy',
    status: 'planned',
    version: 'v0.5 Blueprint',
    releaseDate: 'Roadmap Q4 2026',
    description:
      'Autonomous electrical grid transparency engine providing proactive feeder outage predictions, tariff slab overcharge dispute resolution, and PM Surya Ghar Muft Bijli Yojana rooftop solar return-on-investment calculations.',
    primaryColor: '#8b5cf6', // violet-500
    accentBg: 'from-purple-950/70 via-slate-900 to-slate-950',
    borderColor: 'border-purple-500/30 hover:border-purple-400',
    textColor: 'text-purple-400',
    iconName: 'Zap',
    stats: [
      { label: 'Feeders Tracked', value: '1,840', trend: 'BESCOM Bengaluru' },
      { label: 'Solar ROI Calc', value: 'Instant', trend: 'PM Surya Ghar scheme' }
    ],
    highlights: [
      'Proactive WhatsApp notifications 3 hours before scheduled maintenance shutdowns',
      'AI dispute generator for erroneous commercial-rate billing on residential connections',
      'Satellite rooftop solar potential calculator with 3D shadow analysis'
    ],
    subRoutes: [
      {
        id: 'outage',
        name: 'Live Feeder Status',
        shortDesc: 'Real-time transformer & feeder power restoration timeline',
        iconName: 'Zap'
      },
      {
        id: 'solar',
        name: 'PM Surya Ghar Estimator',
        shortDesc: 'Subsidy deduction, net-metering ROI & certified vendor directory',
        iconName: 'Sparkles'
      }
    ],
    complianceBadges: ['KERC Tariff Compliant', 'PM Surya Ghar Scheme', 'BESCOM 1912'],
    helpline: {
      number: '1912',
      label: 'BESCOM 24x7 Power Outage Helpline'
    }
  },
  {
    id: 'janseva-welfare',
    name: 'JanSeva Welfare & Schemes AI',
    shortName: 'JanSeva AI',
    tagline: 'Unified Karnataka Citizen Welfare, Seva Sindhu & Khata Assistance',
    department: 'Department of e-Governance & BBMP Revenue',
    category: 'Public Welfare',
    status: 'planned',
    version: 'v0.4 Blueprint',
    releaseDate: 'Roadmap 2027',
    description:
      'Conversational welfare counselor matching families to Gruha Lakshmi, Yuva Nidhi, Anna Bhagya, and BBMP e-Khata verification services without bureaucratic intermediaries.',
    primaryColor: '#ec4899', // pink-500
    accentBg: 'from-pink-950/70 via-slate-900 to-slate-950',
    borderColor: 'border-pink-500/30 hover:border-pink-400',
    textColor: 'text-pink-400',
    iconName: 'ShieldCheck',
    stats: [
      { label: 'Schemes Indexed', value: '180+ Programs', trend: 'Karnataka & Central' },
      { label: 'Eligibility Check', value: '< 15 secs', trend: 'Voice & Aadhaar' }
    ],
    highlights: [
      'One-stop eligibility scanner using family ration card category and pincode',
      'BBMP e-Khata dispute resolution assistant with document verification checklist'
    ],
    subRoutes: [
      {
        id: 'schemes',
        name: 'Scheme Finder',
        shortDesc: 'Voice-guided welfare eligibility and required document checklist',
        iconName: 'ShieldCheck'
      }
    ],
    complianceBadges: ['Seva Sindhu 2.0', 'K-GIS Aligned', 'Aadhaar e-KYC'],
    helpline: {
      number: '1902',
      label: 'Chief Minister Public Grievance Helpline'
    }
  }
];
