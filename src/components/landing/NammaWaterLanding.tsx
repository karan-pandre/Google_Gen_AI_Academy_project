import React from 'react';
import {
  Droplets,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowRight,
  Sparkles,
  MapPin,
  FileCheck,
  Scale,
  Building2,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { useNammaWaterStore } from '../../store/useNammaWaterStore';
import { BengaluruWaterCanvas3D } from '../3d/BengaluruWaterCanvas3D';
import { CITYWIDE_STATS, BENGALURU_ZONES } from '../../data/bengaluruWaterData';

export const NammaWaterLanding: React.FC = () => {
  const { setActiveView, setSelectedZoneId } = useNammaWaterStore();

  return (
    <div className="space-y-12 pb-8 animate-fade-in">
      {/* 1. Cinematic Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900 via-[#060b13] to-[#060b13] p-6 sm:p-10 lg:p-14 shadow-2xl">
        <div className="max-w-3xl space-y-6 relative z-10">
          {/* Civic Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>CIVIC AI INTELLIGENCE PLATFORM • BENGALURU</span>
          </div>

          {/* Main Display Headline */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
              NAMMA WATER
            </h1>
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              Know what you're paying for. Verify. Compare. Report.
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Bengaluru's civic AI network for private water tanker price verification, water quality scoring, and statutory price cap enforcement. Powered by verified citizen intelligence and official BWSSB benchmarks.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              id="hero-cta-check-tanker"
              onClick={() => setActiveView('inspect')}
              className="px-6 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              Check My Tanker
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-cta-explore-bengaluru"
              onClick={() => setActiveView('map3d')}
              className="px-6 py-3.5 rounded-2xl text-sm font-bold bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md transition-all"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              Explore Bengaluru 3D
            </button>

            <button
              id="hero-cta-view-pulse"
              onClick={() => setActiveView('pulse')}
              className="px-5 py-3.5 rounded-2xl text-sm font-bold bg-slate-900/40 hover:bg-slate-800/60 text-slate-300 border border-slate-800 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              Live City Pulse
            </button>
          </div>
        </div>

        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Real-Time Live Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Citywide Avg (6kL)</span>
          <div className="text-2xl font-black font-mono text-white mt-1">₹{CITYWIDE_STATS.citywideAvgTankerPrice6kL}</div>
          <span className="text-[11px] text-amber-400 mt-0.5 block font-medium">Statutory Cap: ₹750</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Verified Reports Logged</span>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-1">{CITYWIDE_STATS.totalReportsLogged}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block font-medium">Across 8 municipal sectors</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Citizen Rate Savings</span>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">₹{(CITYWIDE_STATS.verifiedCitizenSavingsInr / 100000).toFixed(1)}L</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block font-medium">Prevented price gouging</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">High Stress Zones</span>
          <div className="text-2xl font-black font-mono text-red-400 mt-1">4 of 8</div>
          <span className="text-[11px] text-red-300 mt-0.5 block font-medium">Sarjapur, Whitefield, Bellandur</span>
        </div>
      </div>

      {/* 3. Embedded 3D Bengaluru Water Grid Preview */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Interactive 3D Bengaluru Water Artery Radar
            </h2>
            <p className="text-xs text-slate-400">
              Select any zone node to inspect local borehole stress, tanker supply price, and Cauvery pipeline coverage.
            </p>
          </div>

          <button
            onClick={() => setActiveView('map3d')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            Expand Fullscreen Radar <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <BengaluruWaterCanvas3D compact={true} />
      </div>

      {/* 4. Core Pillars of Namma Water */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Price Transparency &amp; Anomaly Detection</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instantly benchmark your billed tanker rate against 1,680+ neighborhood transactions and the official DC Bangalore statutory price control order.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center mb-3">
            <Droplets className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Water Quality &amp; Purity Scoring</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Scientific evaluation of pH, Total Dissolved Solids (TDS), and microbial risks against BIS IS 10500:2012 drinking water standards.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center mb-3">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Statutory Grievance Generation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            One-click generation of pre-formatted legal notice documents for the BWSSB 1916 Helpline and Karnataka Consumer Protection Forums.
          </p>
        </div>
      </div>
    </div>
  );
};
