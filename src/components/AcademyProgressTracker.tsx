import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  Trophy,
  Flame,
  ChevronRight,
  ChevronDown,
  Target,
  FileCheck2,
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Code2,
  Check,
  Send,
  Timer
} from 'lucide-react';
import { AcademyModule } from '../types';

const INITIAL_ACADEMY_MODULES: AcademyModule[] = [
  {
    id: 'mod-1',
    moduleNumber: 1,
    title: 'Multimodal Vision & Prescription Digitization',
    category: 'Computer Vision & Healthcare AI',
    durationMinutes: 45,
    progressPercent: 100,
    status: 'Completed',
    xpPoints: 250,
    skills: ['Gemini 3.7 Flash Vision', 'Optical Handwriting Decoding', 'ABHA & Lab Critical Values'],
    checklistItems: [
      { id: 'c1-1', text: 'Prescription handwriting transcription pipeline', completed: true },
      { id: 'c1-2', text: 'ABHA 14-digit universal health account extractor', completed: true },
      { id: 'c1-3', text: 'Pathology lab panic value detection (Platelets, NS1)', completed: true }
    ]
  },
  {
    id: 'mod-2',
    moduleNumber: 2,
    title: 'Multilingual Voice Triage & SATS Clinical Scoring',
    category: 'Natural Language & Speech AI',
    durationMinutes: 60,
    progressPercent: 100,
    status: 'Completed',
    xpPoints: 300,
    skills: ['South African Triage Scale (SATS)', 'Kannada / Hindi Speech Synthesis', 'Urgency Color Categorization'],
    checklistItems: [
      { id: 'c2-1', text: 'Real-time Web Speech API multilingual recognition', completed: true },
      { id: 'c2-2', text: 'Clinical SATS level 1-5 triage algorithm', completed: true },
      { id: 'c2-3', text: 'Department token number generation & routing', completed: true }
    ]
  },
  {
    id: 'mod-3',
    moduleNumber: 3,
    title: 'Full-Stack Hospital Architecture & Real-Time Queue',
    category: 'System Design & State Management',
    durationMinutes: 50,
    progressPercent: 85,
    status: 'In Progress',
    xpPoints: 250,
    skills: ['Express & Vite Full-Stack', 'Live PA System Audio Broadcast', 'WhatsApp & SMS Alert Dispatch'],
    checklistItems: [
      { id: 'c3-1', text: 'Live OPD department queue boards & audio PA calling', completed: true },
      { id: 'c3-2', text: 'ICU bed & oxygen bay capacity live monitor', completed: true },
      { id: 'c3-3', text: 'Automated WhatsApp simulated notification dispatch', completed: true },
      { id: 'c3-4', text: 'Audit logging for Nurse Station review', completed: false }
    ]
  },
  {
    id: 'mod-4',
    moduleNumber: 4,
    title: 'Ideathon Capstone: JanArogya AI Public Health Solution',
    category: 'Production Deployment & Capstone',
    durationMinutes: 90,
    progressPercent: 60,
    status: 'In Progress',
    xpPoints: 400,
    skills: ['Cloud Run Containerization', 'Gemini API Key Security', 'ABDM Standards Compliance'],
    submissionDeadline: '2026-08-22T18:00:00',
    checklistItems: [
      { id: 'c4-1', text: 'End-to-end user testing on mobile & desktop views', completed: true },
      { id: 'c4-2', text: 'Transient error resilience & offline clinical fallback', completed: true },
      { id: 'c4-3', text: 'Record 3-minute video walkthrough for jury evaluation', completed: false },
      { id: 'c4-4', text: 'Submit GitHub repository link to Ideathon portal', completed: false }
    ]
  }
];

export const AcademyProgressTracker: React.FC = () => {
  const [modules, setModules] = useState<AcademyModule[]>(INITIAL_ACADEMY_MODULES);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>('mod-4');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Time left calculation for Ideathon deadline (Target: 2 days, 14 hours from current session)
  const [ideathonTimeLeft, setIdeathonTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 2, hours: 9, minutes: 35, seconds: 27, isPast: false });

  // Time left calculation for Tomorrow's Live Workshop (Target: Tomorrow 10:00 AM)
  const [workshopTimeLeft, setWorkshopTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 18, minutes: 30, seconds: 0 });

  useEffect(() => {
    // Set target deadline: 2 days 9 hours from now
    const targetIdeathon = Date.now() + (2 * 24 * 60 * 60 + 9 * 60 * 60 + 35 * 60 + 27) * 1000;
    const targetWorkshop = Date.now() + (18 * 60 * 60 + 30 * 60) * 1000;

    const timer = setInterval(() => {
      const now = Date.now();

      // Ideathon calculation
      const diffIdeathon = targetIdeathon - now;
      if (diffIdeathon <= 0) {
        setIdeathonTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
      } else {
        const days = Math.floor(diffIdeathon / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffIdeathon % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffIdeathon % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffIdeathon % (1000 * 60)) / 1000);
        setIdeathonTimeLeft({ days, hours, minutes, seconds, isPast: false });
      }

      // Workshop calculation
      const diffWorkshop = targetWorkshop - now;
      if (diffWorkshop > 0) {
        const hours = Math.floor(diffWorkshop / (1000 * 60 * 60));
        const minutes = Math.floor((diffWorkshop % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffWorkshop % (1000 * 60)) / 1000);
        setWorkshopTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleChecklistItem = (modId: string, checkId: string) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== modId) return mod;
        const newChecks = mod.checklistItems.map((c) =>
          c.id === checkId ? { ...c, completed: !c.completed } : c
        );
        const completedCount = newChecks.filter((c) => c.completed).length;
        const progressPercent = Math.round((completedCount / newChecks.length) * 100);
        const status =
          progressPercent === 100
            ? 'Completed'
            : progressPercent > 0
            ? 'In Progress'
            : 'Upcoming';

        return {
          ...mod,
          checklistItems: newChecks,
          progressPercent,
          status
        };
      })
    );
  };

  const totalXP = modules
    .filter((m) => m.status === 'Completed')
    .reduce((sum, m) => sum + m.xpPoints, 0);

  const overallProgress = Math.round(
    modules.reduce((sum, m) => sum + m.progressPercent, 0) / modules.length
  );

  const completedModulesCount = modules.filter((m) => m.status === 'Completed').length;

  const handleSubmitIdeathon = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      setTimeout(() => setSubmissionSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div id="academy-progress-tracker" className="space-y-6">
      {/* Top Countdown & Deadline Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Ideathon Main Countdown Card (7 Cols) */}
        <div className="md:col-span-7 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-800/60 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                <Timer className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                IDEATHON 2026 SUBMISSION DEADLINE
              </span>
              <span className="text-[11px] text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                Final Window
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Public Health AI Track Capstone
            </h3>
            <p className="text-xs text-indigo-200 mt-1">
              Submit your JanArogya AI repository, demo walkthrough, and live container deployment before the countdown expires.
            </p>

            {/* Big Ticking Digits */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 my-5">
              <div className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-3 text-center">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                  {String(ideathonTimeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-indigo-300">Days</span>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-3 text-center">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                  {String(ideathonTimeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-indigo-300">Hours</span>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-3 text-center">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                  {String(ideathonTimeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-indigo-300">Minutes</span>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-3 text-center">
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono block">
                  {String(ideathonTimeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-amber-300">Seconds</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Jury Weightage: <strong className="text-white">Gemini 3.7 + ABDM Fit (40%)</strong></span>
            </div>

            <button
              id="btn-trigger-ideathon-submit"
              onClick={handleSubmitIdeathon}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  Verifying Submission...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Verify &amp; Submit Capstone
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Workshop Session Countdown & Academy Summary (5 Cols) */}
        <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-blue-600" />
                Live Workshop Tomorrow
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">10:00 AM IST</span>
            </div>

            <h4 className="text-base font-bold text-slate-900">
              Hands-on Building &amp; Live Masterclass Session
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Join the live masterclass with Google Cloud architects to build, test, and deploy public healthcare AI models.
            </p>

            {/* Workshop Ticker */}
            <div className="my-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-around text-center">
              <div>
                <span className="text-xl font-black text-slate-900 font-mono">
                  {String(workshopTimeLeft.hours).padStart(2, '0')}h
                </span>
                <span className="text-[10px] text-slate-400 block font-semibold">Remaining</span>
              </div>
              <span className="text-slate-300 font-bold">:</span>
              <div>
                <span className="text-xl font-black text-slate-900 font-mono">
                  {String(workshopTimeLeft.minutes).padStart(2, '0')}m
                </span>
                <span className="text-[10px] text-slate-400 block font-semibold">Minutes</span>
              </div>
              <span className="text-slate-300 font-bold">:</span>
              <div>
                <span className="text-xl font-black text-blue-600 font-mono">
                  {String(workshopTimeLeft.seconds).padStart(2, '0')}s
                </span>
                <span className="text-[10px] text-blue-500 block font-semibold">Seconds</span>
              </div>
            </div>
          </div>

          {/* Academy Overall Progress */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Academy Completion
              </span>
              <span className="text-indigo-600 font-mono">{overallProgress}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
              <span>{completedModulesCount} of {modules.length} Modules Mastered</span>
              <span className="font-bold text-amber-600 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                {totalXP} XP Earned
              </span>
            </div>
          </div>
        </div>
      </div>

      {submissionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between shadow-sm animate-bounce">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Capstone Verification Successful! All 4 required criteria verified ready for Ideathon jury evaluation.</span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-950 font-mono text-[11px] font-bold">
            SUBMISSION VERIFIED
          </span>
        </div>
      )}

      {/* Academy Learning Modules List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Academy Coursework &amp; Solution Milestones
              </h3>
              <p className="text-xs text-slate-500">
                Interactive curriculum progress tracking for JanArogya AI implementation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Status: On Track
            </span>
          </div>
        </div>

        {/* Modules Accordion Cards */}
        <div className="space-y-3">
          {modules.map((mod) => {
            const isExpanded = expandedModuleId === mod.id;
            const isCompleted = mod.status === 'Completed';

            return (
              <div
                key={mod.id}
                id={`academy-module-card-${mod.id}`}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isCompleted
                    ? 'bg-slate-50/60 border-slate-200'
                    : 'bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-500/10'
                }`}
              >
                {/* Module Header Bar */}
                <div
                  onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-sm shrink-0 shadow-sm ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 text-white'
                    }`}>
                      {isCompleted ? <Check className="w-5 h-5" /> : `0${mod.moduleNumber}`}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Module {mod.moduleNumber} • {mod.category}
                        </span>
                        <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {mod.status}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate mt-0.5">
                        {mod.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden sm:block text-right">
                      <div className="text-xs font-mono font-bold text-slate-900">
                        {mod.progressPercent}%
                      </div>
                      <div className="text-[10px] text-amber-600 font-semibold">
                        +{mod.xpPoints} XP
                      </div>
                    </div>

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Progress mini bar */}
                <div className="w-full h-1 bg-slate-200">
                  <div
                    className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                    style={{ width: `${mod.progressPercent}%` }}
                  ></div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-white border-t border-slate-100 space-y-4">
                    {/* Skills Covered Tags */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Key Competencies &amp; API Features Mastered:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {mod.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-900 border border-indigo-100 flex items-center gap-1"
                          >
                            <Code2 className="w-3 h-3 text-indigo-600" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Checklist Items */}
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Deliverables Checklist (Click to update):
                      </span>
                      <div className="space-y-2">
                        {mod.checklistItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => toggleChecklistItem(mod.id, item.id)}
                            className={`p-2.5 rounded-xl border text-xs flex items-center gap-3 cursor-pointer transition-all ${
                              item.completed
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-medium'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                              item.completed
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}>
                              {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <span className={item.completed ? 'line-through text-slate-500' : ''}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
