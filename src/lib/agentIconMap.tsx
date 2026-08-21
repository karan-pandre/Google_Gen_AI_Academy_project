import React from 'react';
import {
  HeartPulse,
  Droplets,
  Car,
  Zap,
  ShieldCheck,
  Trash2,
  Recycle,
  SunMedium,
  Wind,
  Bus,
  Activity,
  Building2,
  Building,
  Flame,
  Compass,
  Scale,
  Cpu,
  Sparkles,
  Layers,
  FileText,
  Mic,
  MonitorPlay,
  MessageSquare,
  Stethoscope,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Code2,
  Grid,
  Trees,
  CloudRain,
  MapPin,
  Camera,
  Boxes,
  Truck,
  Eye,
  Radio,
  Vote,
  Database
} from 'lucide-react';

export const AVAILABLE_AGENT_ICONS = [
  { name: 'HeartPulse', label: 'Heart & Medical', icon: HeartPulse },
  { name: 'Droplets', label: 'Water & Liquid', icon: Droplets },
  { name: 'Trash2', label: 'Waste Management', icon: Trash2 },
  { name: 'Recycle', label: 'Recycling & Circular', icon: Recycle },
  { name: 'Zap', label: 'Energy & Electricity', icon: Zap },
  { name: 'SunMedium', label: 'Solar & Clean Energy', icon: SunMedium },
  { name: 'Wind', label: 'Air Quality & Wind', icon: Wind },
  { name: 'Car', label: 'Traffic & Vehicles', icon: Car },
  { name: 'Bus', label: 'Public Transit & BMTC', icon: Bus },
  { name: 'Truck', label: 'Civic Sanitation Fleet', icon: Truck },
  { name: 'Building2', label: 'Hospital & Infrastructure', icon: Building2 },
  { name: 'Building', label: 'Municipal / BBMP Office', icon: Building },
  { name: 'ShieldCheck', label: 'Public Welfare & Scheme', icon: ShieldCheck },
  { name: 'Trees', label: 'Parks & Urban Forestry', icon: Trees },
  { name: 'CloudRain', label: 'Stormwater & Monsoon', icon: CloudRain },
  { name: 'Cpu', label: 'Smart Grid AI', icon: Cpu },
  { name: 'Scale', label: 'Legal & Grievance', icon: Scale },
  { name: 'Vote', label: 'Civic Voting & Petitions', icon: Vote },
  { name: 'Activity', label: 'Real-time Radar', icon: Activity },
  { name: 'Sparkles', label: 'AI Intelligence', icon: Sparkles }
];

export const renderDynamicAgentIcon = (iconName: string, className = 'w-6 h-6') => {
  switch (iconName) {
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'Trash2':
      return <Trash2 className={className} />;
    case 'Recycle':
      return <Recycle className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'SunMedium':
      return <SunMedium className={className} />;
    case 'Wind':
      return <Wind className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Bus':
      return <Bus className={className} />;
    case 'Truck':
      return <Truck className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'Building':
      return <Building className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Trees':
      return <Trees className={className} />;
    case 'CloudRain':
      return <CloudRain className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Scale':
      return <Scale className={className} />;
    case 'Vote':
      return <Vote className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Mic':
      return <Mic className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'MonitorPlay':
      return <MonitorPlay className={className} />;
    case 'MessageSquare':
      return <MessageSquare className={className} />;
    case 'Stethoscope':
      return <Stethoscope className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'MapPin':
      return <MapPin className={className} />;
    case 'Camera':
      return <Camera className={className} />;
    case 'Boxes':
      return <Boxes className={className} />;
    case 'Eye':
      return <Eye className={className} />;
    case 'Radio':
      return <Radio className={className} />;
    case 'Database':
      return <Database className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};
