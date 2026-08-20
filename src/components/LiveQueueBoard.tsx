import React, { useState } from 'react';
import {
  Users,
  Clock,
  MapPin,
  Volume2,
  Activity,
  Bed,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  TrendingUp,
  Building2,
  GraduationCap,
  MonitorPlay,
  Timer
} from 'lucide-react';
import { HospitalDepartment, HospitalLiveStats, TriageResult } from '../types';
import { AcademyProgressTracker } from './AcademyProgressTracker';

interface LiveQueueBoardProps {
  departments: HospitalDepartment[];
  stats: HospitalLiveStats;
  recentTokens: TriageResult[];
}

export const LiveQueueBoard: React.FC<LiveQueueBoardProps> = ({
  departments,
  stats,
  recentTokens
}) => {
  const [dashboardView, setDashboardView] = useState<'queue' | 'academy'>('queue');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [announcementText, setAnnouncementText] = useState<string | null>(null);

  const filteredDepts = selectedZone === 'ALL'
    ? departments
    : departments.filter(d => d.zone === selectedZone);

  const handleAnnounceToken = (dept: HospitalDepartment) => {
    const text = `Attention please: Token number ${dept.currentToken}, please proceed to ${dept.name}, ${dept.room}`;
    setAnnouncementText(text);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      u.pitch = 1.0;
      window.speechSynthesis.speak(u);
    }

    setTimeout(() => {
      setAnnouncementText(null);
    }, 6000);
  };

  return (
    <div id="live-queue-board-container" className="space-y-6">
      {/* Dashboard Sub-navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 bg-slate-200/80 backdrop-blur rounded-2xl border border-slate-300">
        <div className="flex items-center gap-1.5">
          <button
            id="subtab-hospital-queue"
            onClick={() => setDashboardView('queue')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              dashboardView === 'queue'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <MonitorPlay className="w-4 h-4 text-blue-600" />
            Hospital OPD &amp; Bed Monitor
          </button>

          <button
            id="subtab-academy-tracker"
            onClick={() => setDashboardView('academy')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              dashboardView === 'academy'
                ? 'bg-white text-indigo-950 shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            Academy Modules &amp; Ideathon Tracker
            <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200 animate-pulse">
              Live Deadline
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-600 px-3 font-medium hidden sm:block">
          {dashboardView === 'queue' ? 'Live Department Token Feeds' : 'Curriculum Milestones & Countdown'}
        </div>
      </div>

      {dashboardView === 'academy' ? (
        <AcademyProgressTracker />
      ) : (
        <>
          {/* Top Banner with Stats Bar */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                    LIVE OPD &amp; EMERGENCY MONITOR
                  </span>
                  <span className="text-xs text-slate-400">Public Display Kiosk</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Victoria &amp; Bowring Hospital Queue Status
                </h2>
                <p className="text-slate-300 text-xs mt-1">
                  Real-time department queue tokens, doctor rosters, and critical bed capacity across all medical blocks.
                </p>
              </div>

              {/* Real-time stats meters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Tokens Today</span>
                  <span className="text-xl font-bold text-white font-mono">{stats.queueSummary.totalTokensIssuedToday}</span>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-red-400 block">Emergency Triage</span>
                  <span className="text-xl font-bold text-red-400 font-mono">{stats.queueSummary.emergencyTriageCount}</span>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">ICU Beds Free</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono">
                    {stats.emergencyBeds.icuAvailable} / {stats.emergencyBeds.total}
                  </span>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">Jan Aushadhi Stock</span>
                  <span className="text-xl font-bold text-amber-400 font-mono">{stats.genericMedicineStockRatio}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* PA Announcement Bar */}
          {announcementText && (
            <div className="bg-blue-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center justify-between gap-3 animate-bounce">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Volume2 className="w-5 h-5 animate-pulse" />
                <span>PA System Announcement: {announcementText}</span>
              </div>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-mono">AUDIO BROADCAST</span>
            </div>
          )}

          {/* Filter Zone Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
              {['ALL', 'Red Zone', 'Yellow Zone', 'Green Zone', 'Blue Zone'].map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedZone === zone
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing {filteredDepts.length} active public OPD counters
            </div>
          </div>

          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepts.map((dept) => {
              const isEmergency = dept.code === 'EMG';
              return (
                <div
                  key={dept.id}
                  id={`dept-card-${dept.id}`}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-sm hover:shadow-md flex flex-col justify-between ${
                    isEmergency
                      ? 'border-red-300 ring-2 ring-red-500/10'
                      : 'border-slate-200'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          dept.zone === 'Red Zone' ? 'bg-red-100 text-red-800' :
                          dept.zone === 'Yellow Zone' ? 'bg-amber-100 text-amber-900' :
                          dept.zone === 'Green Zone' ? 'bg-emerald-100 text-emerald-900' :
                          'bg-blue-100 text-blue-900'
                        }`}>
                          {dept.zone}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1">{dept.name}</h3>
                        <p className="text-xs text-slate-500 font-serif">{dept.nameKannada}</p>
                      </div>

                      <button
                        onClick={() => handleAnnounceToken(dept)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-all"
                        title="Broadcast Audio Announcement"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Big Serving Token */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center my-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                        Now Calling Token
                      </span>
                      <div className="text-3xl font-black text-slate-900 font-mono my-1">
                        {dept.currentToken}
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        {dept.room}
                      </div>
                    </div>

                    {/* Doctor On Duty */}
                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium mb-3">
                      <Stethoscope className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="line-clamp-1">{dept.activeDoctor}</span>
                    </div>
                  </div>

                  {/* Footer Metrics */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Waiting: <strong className="text-slate-900">{dept.totalWaiting}</strong></span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Est: <strong className="text-slate-900">{dept.avgWaitMins}m</strong></span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      dept.status === 'Critical' ? 'bg-red-100 text-red-800' :
                      dept.status === 'Crowded' ? 'bg-orange-100 text-orange-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {dept.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Emergency Bed Capacity Overview Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Bed className="w-4 h-4 text-red-600" />
              Critical Care Bed Availability &amp; Life Support Units (Live)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-red-50/70 border border-red-200">
                <span className="text-xs font-bold text-red-900 block">Emergency ICU Beds</span>
                <div className="text-2xl font-black text-red-950 font-mono mt-1">
                  {stats.emergencyBeds.icuAvailable} <span className="text-xs font-normal text-red-700">Available</span>
                </div>
                <p className="text-[11px] text-red-700 mt-1">Ground Floor Red Bay</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                <span className="text-xs font-bold text-blue-900 block">Oxygen Pipeline Bays</span>
                <div className="text-2xl font-black text-blue-950 font-mono mt-1">
                  {stats.emergencyBeds.oxygenBaysFree} <span className="text-xs font-normal text-blue-700">Free</span>
                </div>
                <p className="text-[11px] text-blue-700 mt-1">Ward 4 &amp; 5 High Dependency</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200">
                <span className="text-xs font-bold text-purple-900 block">Active Ventilators</span>
                <div className="text-2xl font-black text-purple-950 font-mono mt-1">
                  {stats.emergencyBeds.ventilatorsAvailable} <span className="text-xs font-normal text-purple-700">Standby</span>
                </div>
                <p className="text-[11px] text-purple-700 mt-1">Trauma ICU 2nd Floor</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-900 block">Total Inpatient Occupancy</span>
                <div className="text-2xl font-black text-emerald-950 font-mono mt-1">
                  {Math.round((stats.emergencyBeds.occupied / stats.emergencyBeds.total) * 100)}%
                </div>
                <p className="text-[11px] text-emerald-700 mt-1">{stats.emergencyBeds.occupied} of {stats.emergencyBeds.total} Beds</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

