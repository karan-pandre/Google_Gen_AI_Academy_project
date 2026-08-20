import React, { useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Building2,
  UserCheck,
  PhoneCall,
  Mail,
  MessageSquare,
  Printer,
  Copy,
  Volume2,
  VolumeX,
  Share2,
  ArrowRight,
  Clock,
  MapPin,
  Stethoscope,
  Activity,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Radio,
  FileCheck2
} from 'lucide-react';
import { AutomatedTransmissionLog, UrgencyLevel } from '../types';

interface HospitalStatusConfirmationProps {
  transmission: AutomatedTransmissionLog;
  onPrintSlip: (transmission: AutomatedTransmissionLog) => void;
  onNewSubmission: () => void;
  onViewDirectory: () => void;
  currentLanguage: 'kn' | 'hi' | 'en' | 'te' | 'ta';
}

export function HospitalStatusConfirmation({
  transmission,
  onPrintSlip,
  onNewSubmission,
  onViewDirectory,
  currentLanguage
}: HospitalStatusConfirmationProps) {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeChannelTab, setActiveChannelTab] = useState<'all' | 'voice' | 'sms' | 'email'>('all');

  const urgencyConfig: Record<UrgencyLevel, { label: string; color: string; badge: string; border: string }> = {
    1: { label: 'Level 1 - Resuscitation (Red)', color: 'text-red-700 bg-red-50 border-red-200', badge: 'bg-red-600 text-white', border: 'border-red-500' },
    2: { label: 'Level 2 - Emergent (Orange)', color: 'text-amber-800 bg-amber-50 border-amber-200', badge: 'bg-amber-600 text-white', border: 'border-amber-500' },
    3: { label: 'Level 3 - Urgent (Yellow)', color: 'text-yellow-800 bg-yellow-50 border-yellow-200', badge: 'bg-yellow-600 text-white', border: 'border-yellow-500' },
    4: { label: 'Level 4 - Routine / Standard (Green)', color: 'text-emerald-800 bg-emerald-50 border-emerald-200', badge: 'bg-emerald-600 text-white', border: 'border-emerald-500' },
    5: { label: 'Level 5 - Non-urgent (Blue)', color: 'text-blue-800 bg-blue-50 border-blue-200', badge: 'bg-blue-600 text-white', border: 'border-blue-500' }
  };

  const currentUrgency = urgencyConfig[transmission.urgencyLevel] || urgencyConfig[3];

  const handleCopySummary = () => {
    const text = `🏥 JanArogya AI - Official Patient Registration & Transmission Record
=====================================================
Ref ID: ${transmission.id}
Assigned Token: ${transmission.tokenNumber}
Status: RESPONSE RECEIVED & NOTIFICATION DELIVERED
Target Facility: ${transmission.hospitalName} (${transmission.hospitalCategory})
Location: ${transmission.hospitalCity}, ${transmission.hospitalDistrict ? transmission.hospitalDistrict + ', ' : ''}${transmission.hospitalState}
Target Contact Person: ${transmission.contactPerson?.name || 'Medical Superintendent'} (${transmission.contactPerson?.designation || 'Triage Nodal Officer'})
Nodal Phone: ${transmission.contactPerson?.phone || transmission.channels.voiceCall.targetNumber}

PATIENT DETAILS:
- Name: ${transmission.patientName} (${transmission.patientAge || '30'} yrs / ${transmission.patientGender || 'Unspecified'})
- Contact Phone: ${transmission.patientPhone}
- ABHA ID: ${transmission.patientAbhaId || 'Not linked'}
- Department: ${transmission.department}
- Triage Priority: ${currentUrgency.label}
- Query / Symptoms: ${transmission.querySummary}
- Slot Window: ${transmission.appointmentSlot}

AUTOMATED CHANNELS:
• Voice IVR Alert: Delivered to ${transmission.contactPerson?.name} (${transmission.channels.voiceCall.targetNumber})
• SMS Gateway: Delivered to Doctor & Patient (${transmission.patientPhone})
• Institutional Email: Transmitted to ${transmission.channels.emailDispatch.targetEmail}
=====================================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePlayVoice = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }

      const text = transmission.patientReceipt?.voiceCallToPatient?.audioText ||
        `Namaskara ${transmission.patientName}. Your medical inquiry has been received and verified. Token number is ${transmission.tokenNumber}. Automatic alert sent to ${transmission.contactPerson?.name || 'the Hospital Medical Superintendent'} at ${transmission.hospitalName}.`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div id="hospital-status-confirmation-root" className="space-y-6 animate-fadeIn">
      {/* Top Banner: Response Received & Acknowledged */}
      <div id="status-confirmation-header-banner" className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-700/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Response Received & Verified by Hospital
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-300 shrink-0" />
              Patient Query Registered & Transmitted
            </h2>
            <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
              The patient inquiry record has been saved to the centralized health queue. An automatic high-priority multi-channel notification (Voice Call, SMS Alert & Clinical Brief Email) has been delivered to the target institution's contact person.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-print-response-slip"
              onClick={() => onPrintSlip(transmission)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 font-semibold rounded-xl text-sm shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4 text-emerald-800" />
              Print / Save Slip
            </button>
            <button
              id="btn-copy-record-summary"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700/60 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm border border-emerald-500/40 transition-all active:scale-95"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Receipt!' : 'Copy Summary'}
            </button>
          </div>
        </div>

        {/* Quick Meta Strip */}
        <div className="mt-6 pt-4 border-t border-emerald-700/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-emerald-300 block">Registration Ref ID</span>
            <span className="font-mono font-bold text-white text-sm">{transmission.id}</span>
          </div>
          <div>
            <span className="text-emerald-300 block">Assigned Queue Token</span>
            <span className="font-mono font-bold text-emerald-200 text-sm">{transmission.tokenNumber}</span>
          </div>
          <div>
            <span className="text-emerald-300 block">Transmission Timestamp</span>
            <span className="font-medium text-white">{transmission.date} • {transmission.timestamp}</span>
          </div>
          <div>
            <span className="text-emerald-300 block">Dispatch Status</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              All 3 Channels Delivered
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard: Patient Record on Left, Hospital Contact Person Notification on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Official Patient Record (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Patient Registration Slip */}
          <div id="patient-record-card" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Patient Medical Record & Queue Pass</h3>
                  <p className="text-xs text-slate-500">Official proof of consultation inquiry & triage queue placement</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${currentUrgency.badge}`}>
                {currentUrgency.label.split(' - ')[0]}
              </span>
            </div>

            {/* Token & Primary Info Highlight */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
              <div className="sm:border-r border-slate-200 sm:pr-4">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block">Assigned OPD Token</span>
                <span className="text-2xl font-black text-teal-700 font-mono tracking-tight">{transmission.tokenNumber}</span>
              </div>
              <div className="sm:border-r border-slate-200 sm:pr-4">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block">Clinical Department</span>
                <span className="text-base font-bold text-slate-900">{transmission.department}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block">Estimated Slot Window</span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md inline-block mt-1">
                  15-30 Mins Walk-in Priority
                </span>
              </div>
            </div>

            {/* Demographic Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">Patient Full Name</span>
                <span className="font-semibold text-slate-900">{transmission.patientName}</span>
              </div>
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">Age & Gender</span>
                <span className="font-semibold text-slate-900">{transmission.patientAge || '32'} Yrs • {transmission.patientGender || 'Unspecified'}</span>
              </div>
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">Contact Phone</span>
                <span className="font-semibold text-slate-900 font-mono">{transmission.patientPhone}</span>
              </div>
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">Patient Email</span>
                <span className="font-medium text-slate-800 text-xs truncate block">{transmission.patientEmail || 'Not Provided (Kiosk)'}</span>
              </div>
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">ABHA Health ID</span>
                <span className="font-medium text-teal-800 text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  {transmission.patientAbhaId || 'Self-registered at desk'}
                </span>
              </div>
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">Cashless Scheme</span>
                <span className="font-medium text-emerald-800 text-xs flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Ayushman Bharat PM-JAY
                </span>
              </div>
            </div>

            {/* Query Summary & Clinical Notes */}
            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 space-y-2">
              <span className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-teal-700" />
                Submitted Symptoms & Clinical Query
              </span>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                "{transmission.querySummary}"
              </p>
            </div>

            {/* Audio Readout Bar */}
            <div className="flex items-center justify-between p-3 bg-slate-100/80 rounded-xl border border-slate-200 text-xs text-slate-700">
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-teal-700" />
                Audio notification delivered to patient mobile
              </span>
              <button
                onClick={handlePlayVoice}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 text-white hover:bg-teal-800 font-medium transition-colors"
              >
                {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                {isPlayingAudio ? 'Stop Audio' : 'Play Voice Slip'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Hospital Contact Person Notification Confirmation (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Target Hospital & Contact Person Notification Panel */}
          <div id="hospital-contact-notification-panel" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Automatic Dispatch Verified
              </div>
              <h3 className="font-bold text-slate-900 text-base">Hospital Contact Person Alert</h3>
              <p className="text-xs text-slate-500">Live confirmation that emergency alert reached the nodal station</p>
            </div>

            {/* Target Institution Info */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Target Institution</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">{transmission.hospitalName}</h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  {transmission.hospitalCategory}
                </span>
              </div>
              <p className="text-xs text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {transmission.hospitalCity}, {transmission.hospitalDistrict ? `${transmission.hospitalDistrict}, ` : ''}{transmission.hospitalState}
              </p>
            </div>

            {/* Contact Person Details Card */}
            <div id="contact-person-badge-card" className="p-4 bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-xl shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-teal-600/30 border border-teal-400/40 flex items-center justify-center font-bold text-teal-200 text-lg shrink-0">
                  <UserCheck className="w-6 h-6 text-teal-300" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {transmission.contactPerson?.dutyStatus || 'Active On-Duty Emergency Desk'}
                  </div>
                  <h4 className="font-bold text-white text-base leading-tight">
                    {transmission.contactPerson?.name || 'Dr. B. R. Manjunath, MD'}
                  </h4>
                  <p className="text-xs text-teal-200 font-medium mt-0.5">
                    {transmission.contactPerson?.designation || 'Medical Superintendent & Emergency Chief'}
                  </p>
                </div>
              </div>

              {/* Direct Channels */}
              <div className="pt-3 border-t border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                    Direct Triage Line:
                  </span>
                  <span className="font-mono font-semibold text-white">
                    {transmission.contactPerson?.phone || transmission.channels.voiceCall.targetNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-teal-400" />
                    Official Nodal Inbox:
                  </span>
                  <span className="font-mono text-teal-200 text-[11px] truncate max-w-[180px]">
                    {transmission.contactPerson?.email || transmission.channels.emailDispatch.targetEmail}
                  </span>
                </div>
              </div>
            </div>

            {/* Notification Delivery Confirmation Status */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Notification Transmission Acknowledged
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Automatic high-priority dispatch packets were successfully received by <strong>{transmission.contactPerson?.name || 'the on-duty medical coordinator'}</strong>. Clinical brief is queued in hospital triage terminal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Channel Telemetry Logs (Voice, SMS, Email details) */}
      <div id="multi-channel-telemetry-section" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Radio className="w-5 h-5 text-teal-700" />
              Multi-Channel Dispatch Telemetry & Live Receipts
            </h3>
            <p className="text-xs text-slate-500">Live packets sent to Voice IVR, Cellular SMS Gateway, and Official Hospital Email</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveChannelTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeChannelTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All (3)
            </button>
            <button
              onClick={() => setActiveChannelTab('voice')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeChannelTab === 'voice' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Voice Call
            </button>
            <button
              onClick={() => setActiveChannelTab('sms')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeChannelTab === 'sms' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              SMS
            </button>
            <button
              onClick={() => setActiveChannelTab('email')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeChannelTab === 'email' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Email
            </button>
          </div>
        </div>

        {/* 3 Telemetry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Voice IVR Call */}
          {(activeChannelTab === 'all' || activeChannelTab === 'voice') && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  Voice IVR Hotline
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {transmission.channels.voiceCall.status}
                </span>
              </div>
              <div className="text-xs space-y-1 text-slate-600">
                <div><span className="font-semibold text-slate-700">Dialed:</span> <span className="font-mono">{transmission.channels.voiceCall.targetNumber}</span></div>
                <div><span className="font-semibold text-slate-700">Call Duration:</span> {transmission.channels.voiceCall.durationSecs}s Synthesized</div>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 font-mono italic max-h-24 overflow-y-auto leading-relaxed">
                "{transmission.channels.voiceCall.ivrSynthesizedText}"
              </div>
            </div>
          )}

          {/* SMS Gateway */}
          {(activeChannelTab === 'all' || activeChannelTab === 'sms') && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Cellular SMS Gateway
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  {transmission.channels.smsDispatch.status}
                </span>
              </div>
              <div className="text-xs space-y-1 text-slate-600">
                <div><span className="font-semibold text-slate-700">Dispatched To:</span> <span className="font-mono">{transmission.channels.smsDispatch.targetNumber}</span></div>
                <div><span className="font-semibold text-slate-700">Patient Receipt:</span> <span className="font-mono text-emerald-700">{transmission.patientPhone}</span></div>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 font-mono italic max-h-24 overflow-y-auto leading-relaxed">
                "{transmission.channels.smsDispatch.body}"
              </div>
            </div>
          )}

          {/* Official Email */}
          {(activeChannelTab === 'all' || activeChannelTab === 'email') && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-purple-600" />
                  Official Hospital Email
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                  {transmission.channels.emailDispatch.status}
                </span>
              </div>
              <div className="text-xs space-y-1 text-slate-600">
                <div className="truncate"><span className="font-semibold text-slate-700">Inbox:</span> <span className="font-mono text-xs">{transmission.channels.emailDispatch.targetEmail}</span></div>
                <div className="truncate"><span className="font-semibold text-slate-700">Subject:</span> {transmission.channels.emailDispatch.subject}</div>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-700 font-mono whitespace-pre-line max-h-24 overflow-y-auto leading-tight">
                {transmission.channels.emailDispatch.clinicalBrief.slice(0, 180)}...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav / Next Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <button
          onClick={onViewDirectory}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <Building2 className="w-4 h-4 text-slate-500" />
          Back to Global Hospital Directory
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onNewSubmission}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl text-sm shadow-sm transition-all"
          >
            Submit Another Patient Query
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
