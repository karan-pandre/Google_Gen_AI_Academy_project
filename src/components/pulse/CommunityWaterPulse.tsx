import React, { useState } from 'react';
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  Droplets,
  ThumbsUp,
  Filter,
  Search,
  CheckCircle2,
  ShieldCheck,
  Building2,
  ArrowUpRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useNammaWaterStore } from '../../store/useNammaWaterStore';
import { BENGALURU_ZONES, CITYWIDE_STATS } from '../../data/bengaluruWaterData';

export const CommunityWaterPulse: React.FC = () => {
  const { communityReports, upvoteCommunityReport, setActiveView, setSelectedZoneId } = useNammaWaterStore();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'ANOMALY' | 'SAFE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = communityReports.filter((r) => {
    if (selectedFilter === 'ANOMALY') {
      return r.anomalyLevel === 'HIGH_ANOMALY' || r.anomalyLevel === 'CRITICAL_OUTLIER';
    }
    if (selectedFilter === 'SAFE') {
      return r.anomalyLevel === 'REASONABLE';
    }
    if (searchQuery.trim()) {
      return r.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
             r.supplierMasked.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Live Citywide Metrics */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase">
                BENGALURU WATER PULSE • LIVE CIVIC RADAR
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Citywide Tanker Rates &amp; Groundwater Intelligence
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Aggregated from 1,684+ citizen reports, statutory BWSSB filings, and IoT telemetry across 8 zones.
            </p>
          </div>

          <button
            onClick={() => setActiveView('inspect')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 flex items-center gap-2 cursor-pointer shadow-md transition-all self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            Report Your Tanker
          </button>
        </div>

        {/* 4 Big Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Citywide Avg (6,000L)
            </span>
            <div className="text-2xl font-black font-mono text-white mt-1">
              ₹{CITYWIDE_STATS.citywideAvgTankerPrice6kL}
            </div>
            <span className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +14% vs BWSSB statutory cap
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Price Anomaly Rate
            </span>
            <div className="text-2xl font-black font-mono text-red-400 mt-1">
              {CITYWIDE_STATS.priceAnomalyRatePercent}%
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Of reports exceed statutory caps
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Verified Citizen Savings
            </span>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
              ₹{(CITYWIDE_STATS.verifiedCitizenSavingsInr / 100000).toFixed(1)}L
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Via rate negotiation &amp; caps
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Reports Logged Today
            </span>
            <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
              {CITYWIDE_STATS.todayReportsCount}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Across 8 monitored sectors
            </span>
          </div>
        </div>
      </div>

      {/* 2. Zone Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Bengaluru Zone Price &amp; Groundwater Stress Matrix</h3>
          </div>
          <span className="text-xs text-slate-400">8 Municipal Divisions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Neighborhood / Zone</th>
                <th className="py-2.5 px-3">Avg (6,000L)</th>
                <th className="py-2.5 px-3">Avg (10,000L)</th>
                <th className="py-2.5 px-3">Avg TDS (ppm)</th>
                <th className="py-2.5 px-3">Aquifer Stress</th>
                <th className="py-2.5 px-3">Cauvery Pipeline</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {BENGALURU_ZONES.map((zone) => (
                <tr key={zone.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{zone.name}</div>
                    <div className="text-[11px] text-slate-400">{zone.kannadaName}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    ₹{zone.avgPrice6kL}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-cyan-300">
                    ₹{zone.avgPrice10kL}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {zone.avgTdsPpm} ppm
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        zone.groundwaterStressLevel === 'CRITICAL' || zone.groundwaterStressLevel === 'ACUTE'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : zone.groundwaterStressLevel === 'SEVERE'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {zone.groundwaterStressLevel}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {zone.bwssbCauveryPipelineCoveragePercent}%
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedZoneId(zone.id);
                        setActiveView('map3d');
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 text-slate-300 transition-all cursor-pointer"
                    >
                      3D Radar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Community Reports Live Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Live Citizen Reports Feed</h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === 'ALL' ? 'bg-cyan-600 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Reports
            </button>
            <button
              onClick={() => setSelectedFilter('ANOMALY')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === 'ANOMALY' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              High Anomalies
            </button>
            <button
              onClick={() => setSelectedFilter('SAFE')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === 'SAFE' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fair Price
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-slate-700 transition-all shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{report.neighborhood}</span>
                  <span className="text-[10px] font-mono text-slate-500">• {report.timestampAgo}</span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    report.anomalyLevel === 'HIGH_ANOMALY' || report.anomalyLevel === 'CRITICAL_OUTLIER'
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {report.anomalyLevel.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-black font-mono text-white">
                    ₹{report.pricePaid}
                  </span>
                  <span className="text-xs text-slate-400 ml-1.5">
                    for {report.volumeL.toLocaleString('en-IN')}L (₹{report.unitRateKL}/kL)
                  </span>
                </div>
                <div className="text-xs font-mono text-cyan-400">
                  {report.waterQualityGrade}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80 text-slate-400">
                <span className="truncate max-w-[180px]">Supplier: {report.supplierMasked}</span>
                <button
                  onClick={() => upvoteCommunityReport(report.id)}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{report.verifiedByCommunityUpvotes} Verified</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
