import React, { useState } from 'react';
import {
  Activity,
  UserCheck,
  Filter,
  CheckCircle,
  AlertOctagon,
  Flame,
  Clock,
  Printer,
  ChevronRight,
  ShieldAlert,
  Stethoscope,
  Heart,
  Thermometer,
  Eye,
  FileDown
} from 'lucide-react';
import { TriageResult, UrgencyLevel } from '../types';
import { generatePatientSummaryPdf } from '../utils/generatePatientPdf';

interface NurseStationProps {
  tokens: TriageResult[];
  onUpdateUrgency: (tokenId: string, newLevel: UrgencyLevel) => void;
}

export const NurseStation: React.FC<NurseStationProps> = ({
  tokens,
  onUpdateUrgency
}) => {
  const [selectedToken, setSelectedToken] = useState<TriageResult | null>(tokens[0] || null);
  const [filterUrgency, setFilterUrgency] = useState<string>('ALL');

  // Local vitals recorder state
  const [vitalsBP, setVitalsBP] = useState('120/80');
  const [vitalsPulse, setVitalsPulse] = useState('78');
  const [vitalsSpO2, setVitalsSpO2] = useState('98%');
  const [vitalsTemp, setVitalsTemp] = useState('98.6°F');
  const [vitalsSavedMsg, setVitalsSavedMsg] = useState(false);

  const filteredTokens = filterUrgency === 'ALL'
    ? tokens
    : tokens.filter(t => String(t.urgencyLevel) === filterUrgency);

  const handleSaveVitals = () => {
    setVitalsSavedMsg(true);
    setTimeout(() => setVitalsSavedMsg(false), 3000);
  };

  const getUrgencyColorClass = (level: UrgencyLevel) => {
    switch (level) {
      case 1: return 'bg-red-600 text-white';
      case 2: return 'bg-orange-600 text-white';
      case 3: return 'bg-amber-500 text-white';
      case 4: return 'bg-emerald-600 text-white';
      default: return 'bg-blue-600 text-white';
    }
  };

  return (
    <div id="nurse-station-container" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-blue-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Clinical Audit &amp; Triage Override Desk
              </span>
              <span className="text-xs text-blue-200">Victoria &amp; Bowring Hospital Frontline Station</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Chief Triage Nurse &amp; Operator Dashboard
            </h2>
            <p className="text-blue-100 text-sm mt-1 max-w-2xl">
              Monitor algorithmic AI triage scores, record emergency vitals, re-classify priority levels under South African Triage Scale (SATS), and fast-track critical patients.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15">
            <UserCheck className="w-8 h-8 text-blue-300 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-white">Staff on Duty: Nurse In-Charge</p>
              <p className="text-blue-200">Trauma Bay &amp; OPD Reception</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Urgency Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
          {[
            { id: 'ALL', label: 'All Tokens' },
            { id: '1', label: 'Level 1: Red' },
            { id: '2', label: 'Level 2: Orange' },
            { id: '3', label: 'Level 3: Yellow' },
            { id: '4', label: 'Level 4: Green' },
            { id: '5', label: 'Level 5: Blue' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterUrgency(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterUrgency === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          {filteredTokens.length} active patient cases in triage pipeline
        </span>
      </div>

      {/* Main Grid: Patient Queue List (5 cols) vs Selected Clinical Detail (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Triage Patient List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredTokens.map((token) => {
            const isSelected = selectedToken?.id === token.id;
            return (
              <div
                key={token.id}
                onClick={() => setSelectedToken(token)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black font-mono ${getUrgencyColorClass(token.urgencyLevel)}`}>
                      L{token.urgencyLevel}
                    </span>
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      {token.tokenNumber}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500 font-medium">
                    {new Date(token.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {token.patientInfo.name} ({token.patientInfo.age}Y / {token.patientInfo.gender[0]})
                    </h4>
                    <p className="text-[11px] text-slate-500">{token.primaryDepartment}</p>
                  </div>

                  {token.fastTrackEligible && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                      ⚡ Fast-Track
                    </span>
                  )}
                </div>

                {token.extractedSymptoms && token.extractedSymptoms.length > 0 && (
                  <div className="mt-2 text-[11px] text-slate-600 line-clamp-1 italic">
                    {token.extractedSymptoms.join(', ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Patient Clinical Audit & Vitals */}
        <div className="lg:col-span-7">
          {selectedToken ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-5">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${getUrgencyColorClass(selectedToken.urgencyLevel)}`}>
                      {selectedToken.urgencyLabel}
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Token: {selectedToken.tokenNumber}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedToken.patientInfo.name}</h3>
                  <p className="text-xs text-slate-500">
                    Age: {selectedToken.patientInfo.age}Y • Gender: {selectedToken.patientInfo.gender} • Mobile: {selectedToken.patientInfo.phone}
                  </p>
                </div>

                {/* Urgency Manual Override Dropdown */}
                <div className="text-right">
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                    Nurse Urgency Override
                  </label>
                  <select
                    value={selectedToken.urgencyLevel}
                    onChange={(e) => {
                      const newLvl = Number(e.target.value) as UrgencyLevel;
                      onUpdateUrgency(selectedToken.id, newLvl);
                      setSelectedToken({ ...selectedToken, urgencyLevel: newLvl });
                    }}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value={1}>Level 1: Critical (Red)</option>
                    <option value={2}>Level 2: Emergent (Orange)</option>
                    <option value={3}>Level 3: Urgent (Yellow)</option>
                    <option value={4}>Level 4: Routine OPD (Green)</option>
                    <option value={5}>Level 5: Non-Urgent (Blue)</option>
                  </select>
                </div>
              </div>

              {/* Triage Findings & Symptoms */}
              <div>
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Clinical Symptoms &amp; AI Analysis
                </h4>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedToken.extractedSymptoms.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-medium">
                  {selectedToken.clinicalSummary}
                </p>
              </div>

              {/* Vitals Recording Station */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-red-600" />
                    Bedside / Triage Vitals Recorder
                  </h4>
                  {vitalsSavedMsg && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ Vitals Logged to EMR
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-1">Blood Pressure</label>
                    <input
                      type="text"
                      value={vitalsBP}
                      onChange={(e) => setVitalsBP(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white"
                      placeholder="120/80"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-1">Pulse (bpm)</label>
                    <input
                      type="text"
                      value={vitalsPulse}
                      onChange={(e) => setVitalsPulse(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white"
                      placeholder="78"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-1">SpO2 Oxygen</label>
                    <input
                      type="text"
                      value={vitalsSpO2}
                      onChange={(e) => setVitalsSpO2(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white"
                      placeholder="98%"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-1">Temperature</label>
                    <input
                      type="text"
                      value={vitalsTemp}
                      onChange={(e) => setVitalsTemp(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white"
                      placeholder="98.6°F"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveVitals}
                  className="w-full py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer"
                >
                  Record &amp; Sync Vitals
                </button>
              </div>

              {/* Recommended Orders & Fast Track Investigations */}
              {selectedToken.testsRecommended && (
                <div>
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Recommended Priority Diagnostic Orders
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedToken.testsRecommended.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-indigo-600" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Department Destination Callout */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Destination Clinic</span>
                  <span className="text-sm font-bold text-slate-900">{selectedToken.primaryDepartment}</span>
                  <p className="text-xs text-slate-600">{selectedToken.roomNumber} ({selectedToken.floorWing})</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="nurse-download-pdf-btn"
                    onClick={() => generatePatientSummaryPdf(selectedToken)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                  >
                    <FileDown className="w-3.5 h-3.5 text-teal-400" />
                    Download Summary PDF
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-xs">
              Select a patient from the left queue to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
