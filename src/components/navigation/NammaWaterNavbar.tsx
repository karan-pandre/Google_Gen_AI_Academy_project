import React from 'react';
import {
  Droplets,
  Activity,
  Sparkles,
  Eye,
  Search,
  FileText,
  Building2,
  Scale,
  Compass,
  Contrast
} from 'lucide-react';
import { useNammaWaterStore } from '../../store/useNammaWaterStore';

export const NammaWaterNavbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    setCommandPaletteOpen,
    setAccessibilityModalOpen,
    highContrastMode
  } = useNammaWaterStore();

  return (
    <header className="bg-slate-950/95 backdrop-blur-xl text-white border-b border-slate-800 sticky top-0 z-40 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20 font-black">
              <Droplets className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider text-cyan-400">
                  NAMMA WATER
                </span>
                <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60 hidden sm:inline-block">
                  Civic AI • Bengaluru
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                Tanker Verification &amp; Price Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveView('landing')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'landing'
                  ? 'bg-cyan-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveView('inspect')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'inspect'
                  ? 'bg-cyan-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Check Tanker
            </button>

            <button
              onClick={() => setActiveView('pulse')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'pulse'
                  ? 'bg-cyan-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              City Pulse
            </button>

            <button
              onClick={() => setActiveView('map3d')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'map3d'
                  ? 'bg-cyan-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              3D Radar
            </button>

            <button
              onClick={() => setActiveView('grievance')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'grievance'
                  ? 'bg-cyan-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              BWSSB Grievance
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Quick Search */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 text-xs transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search zones &amp; rates</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">⌘K</kbd>
            </button>

            {/* Accessibility */}
            <button
              onClick={() => setAccessibilityModalOpen(true)}
              title="Accessibility Settings (Alt+A)"
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                highContrastMode
                  ? 'bg-cyan-400 text-slate-950 font-bold border-cyan-300'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="hidden xl:inline-block">Accessibility</span>
            </button>

            {/* Primary Action CTA */}
            <button
              onClick={() => setActiveView('inspect')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer transition-all shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xs:inline-block">Check Tanker</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
