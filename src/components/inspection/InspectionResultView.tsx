import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Droplets,
  FileText,
  Download,
  Share2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertTriangle,
  Scale,
  RefreshCw,
  Award
} from 'lucide-react';
import { TankerInspectionResult } from '../../types/nammaWater';
import { useNammaWaterStore } from '../../store/useNammaWaterStore';

export const InspectionResultView: React.FC<{ result: TankerInspectionResult; onReset: () => void }> = ({
  result,
  onReset
}) => {
  const [showEvidenceDrawer, setShowEvidenceDrawer] = useState(false);
  const { setActiveView } = useNammaWaterStore();

  const isHighAnomaly = result.priceAnomalyLevel === 'HIGH_ANOMALY' || result.priceAnomalyLevel === 'CRITICAL_OUTLIER';
  const isReasonable = result.priceAnomalyLevel === 'REASONABLE';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Top Verdict Banner */}
      <div
        className={`p-6 rounded-2xl border backdrop-blur-md shadow-xl ${
          isHighAnomaly
            ? 'bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border-red-500/40 text-white'
            : isReasonable
            ? 'bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border-emerald-500/40 text-white'
            : 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border-amber-500/40 text-white'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                  isHighAnomaly
                    ? 'bg-red-500 text-slate-950 shadow-md'
                    : isReasonable
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-amber-400 text-slate-950 shadow-md'
                }`}
              >
                {isHighAnomaly ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                {result.priceAnomalyLevel.replace('_', ' ')}
              </span>

              <span className="text-xs font-mono text-slate-400">
                Confidence: <strong className="text-cyan-300">{result.confidence.replace('_', ' ')}</strong> ({Math.round(result.confidenceScore * 100)}%)
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
              Tanker Verification Complete
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              {result.anomalySummary}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('grievance')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <FileText className="w-4 h-4" />
              File BWSSB Grievance
            </button>
            <button
              onClick={onReset}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              New Scan
            </button>
          </div>
        </div>
      </div>

      {/* 2. Price Intelligence Card & Benchmark Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Observed Price */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Observed Billed Price
          </span>
          <div className="text-3xl font-black font-mono text-white mt-1">
            ₹{result.billedPriceInr.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Volume: <strong className="text-cyan-400">{result.waterVolumeLitres.toLocaleString('en-IN')} Litres</strong>
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400">
            Effective Rate: <strong className="text-white">₹{result.unitRatePerKL.toFixed(1)} / kL</strong> (1,000L)
          </div>
        </div>

        {/* Local Neighborhood Benchmark */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Local Neighborhood Benchmark
          </span>
          <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
            ₹{result.localBenchmarkRange.minInr} – ₹{result.localBenchmarkRange.maxInr}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Median in {result.deliveryNeighborhood}: <strong className="text-white">₹{result.localBenchmarkRange.medianInr}</strong>
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400">
            Variance: <span className={result.priceVariancePercent > 0 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
              {result.priceVariancePercent > 0 ? `+${result.priceVariancePercent}%` : `${result.priceVariancePercent}%`} vs median
            </span>
          </div>
        </div>

        {/* BWSSB Statutory Cap */}
        <div className="bg-slate-900 border border-cyan-900/50 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              BWSSB Legal Price Cap
            </span>
            <Scale className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            ₹{result.localBenchmarkRange.bwssbCappedRateInr || 750}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Order: {result.legalPriceCapReference}
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-amber-300">
            {result.billedPriceInr > (result.localBenchmarkRange.bwssbCappedRateInr || 750) ? (
              <span>₹{(result.billedPriceInr - (result.localBenchmarkRange.bwssbCappedRateInr || 750)).toLocaleString('en-IN')} over statutory cap</span>
            ) : (
              <span className="text-emerald-400">Compliant with statutory order</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Water Quality Scientific Scorecard */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Droplets className="w-5 h-5 text-cyan-400" />
            <div>
              <h4 className="text-base font-bold text-white">Water Quality Parameter Index</h4>
              <p className="text-xs text-slate-400">Benchmarked against Bureau of Indian Standards (BIS IS 10500:2012)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Overall Grade:</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
              {result.waterQualityGrade}
            </span>
          </div>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {result.qualityParameters.map((param) => (
            <div key={param.id} className="bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">{param.name}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    param.status === 'OPTIMAL' || param.status === 'ACCEPTABLE'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : param.status === 'REFERENCE_CHECK'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-red-950 text-red-300 border border-red-800'
                  }`}
                >
                  {param.statusLabel}
                </span>
              </div>

              <div className="text-xl font-bold font-mono text-white">
                {param.observedValue} <span className="text-xs font-normal text-slate-400">{param.unit}</span>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-1">{param.description}</p>
              <div className="text-[10px] font-mono text-slate-500">Ref: {param.referenceStandard}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Evidence Explorer: "Why did Namma Water say this?" */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <button
          onClick={() => setShowEvidenceDrawer(!showEvidenceDrawer)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-sm font-bold text-white block">
                Evidence Explorer: Why did Namma Water conclude this?
              </span>
              <span className="text-xs text-slate-400">
                Inspect underlying extractions, OCR snippets, and mathematical benchmark models
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <span>{showEvidenceDrawer ? 'Hide Evidence' : 'Expand Evidence'}</span>
            {showEvidenceDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showEvidenceDrawer && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-3 animate-fade-in">
            {result.evidenceItems.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300">{item.claim}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                    {item.evidenceType}
                  </span>
                </div>

                {item.extractedSnippet && (
                  <div className="p-2 rounded bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800">
                    Extracted: "{item.extractedSnippet}"
                  </div>
                )}

                <p className="text-slate-400 text-[11px]">{item.explanation}</p>
                <div className="text-[10px] text-slate-500 font-mono">Source: {item.verificationSource}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Civic Next Steps & Action Steps */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Recommended Civic Action Steps
        </h4>
        <ul className="space-y-2 text-xs text-slate-300">
          {result.civicRecommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
