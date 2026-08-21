import React from 'react';
import { CheckCircle2, Loader2, Sparkles, ShieldCheck, Database, Search, FileText } from 'lucide-react';
import { AIProcessState } from '../../types/nammaWater';

interface AIProcessingTimelineProps {
  state: AIProcessState;
  currentStep: number;
}

const STEPS = [
  { id: 1, label: 'Document & Image Ingestion', desc: 'OCR & vision parsing of tanker invoice/meter' },
  { id: 2, label: 'Entity & Volume Extraction', desc: 'Tanker number, supplier name, volume in Litres' },
  { id: 3, label: 'Civic Price Benchmark Check', desc: 'Comparing against 1,680+ verified neighborhood reports' },
  { id: 4, label: 'BWSSB Statutory Cap Compliance', desc: 'Evaluating against DC Bangalore Price Control Order' },
  { id: 5, label: 'Water Quality & Evidence Synthesis', desc: 'pH, TDS, microbiological risk assessment' }
];

export const AIProcessingTimeline: React.FC<AIProcessingTimelineProps> = ({ state, currentStep }) => {
  if (state === 'IDLE') return null;

  return (
    <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl space-y-4 animate-fade-in text-white">
      {/* Top Header with Glowing AI Orb */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Civic AI Intelligence Engine
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                {state}
              </span>
            </h4>
            <p className="text-xs text-slate-400">Synthesizing multimodal tanker data &amp; statutory rules</p>
          </div>
        </div>

        <div className="text-xs font-mono text-cyan-400">
          Step {Math.min(currentStep, STEPS.length)} of {STEPS.length}
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-2.5">
        {STEPS.map((step) => {
          const isDone = currentStep > step.id || state === 'COMPLETE';
          const isCurrent = currentStep === step.id && state !== 'COMPLETE';
          const isPending = currentStep < step.id && state !== 'COMPLETE';

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                isCurrent
                  ? 'bg-cyan-950/40 border-cyan-500/50 shadow-inner'
                  : isDone
                  ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                  : 'bg-slate-950/20 border-slate-900 text-slate-600'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono">
                    {step.id}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isCurrent ? 'text-cyan-300' : isDone ? 'text-white' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-mono text-cyan-400 animate-pulse">Analyzing...</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
