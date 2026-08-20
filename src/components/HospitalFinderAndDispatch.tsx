import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  MapPin,
  PhoneCall,
  Mail,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Send,
  Radio,
  Volume2,
  ShieldCheck,
  BedDouble,
  Activity,
  HeartPulse,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  ArrowRight,
  Stethoscope,
  Receipt,
  Download,
  Copy,
  Printer,
  FileCheck2,
  Share2,
  UserCheck,
  PhoneForwarded
} from 'lucide-react';
import {
  COMPREHENSIVE_HOSPITAL_DIRECTORY,
  ALL_INDIAN_STATES,
  getDistrictsForState,
  HospitalDirectoryItem
} from '../data/hospitalDirectoryData';
import { AutomatedTransmissionLog, UrgencyLevel } from '../types';
import { HospitalStatusConfirmation } from './HospitalStatusConfirmation';
import { executeHospitalDispatch, DispatchSimulationProgress } from '../services/hospitalDispatchMockService';
import { AutomationPipelineVisualizer } from './AutomationPipelineVisualizer';

interface HospitalFinderProps {
  currentLanguage: 'kn' | 'hi' | 'en' | 'te' | 'ta';
  onHospitalSelect?: (hospital: HospitalDirectoryItem) => void;
  selectedHospitalId?: string;
}

export function HospitalFinderAndDispatch({
  currentLanguage,
  onHospitalSelect,
  selectedHospitalId
}: HospitalFinderProps) {
  // Directory Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Districts');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Selected hospital for dispatch
  const [selectedHospital, setSelectedHospital] = useState<HospitalDirectoryItem>(
    COMPREHENSIVE_HOSPITAL_DIRECTORY.find((h) => h.id === selectedHospitalId) || COMPREHENSIVE_HOSPITAL_DIRECTORY[0]
  );

  // Manual query submission form state
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAbha, setPatientAbha] = useState('');
  const [queryDescription, setQueryDescription] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>(3);
  const [selectedDepartment, setSelectedDepartment] = useState('General Medicine');

  // Automated Transmission execution & Status Confirmation state
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [dispatchProgress, setDispatchProgress] = useState<DispatchSimulationProgress | null>(null);
  const [recentTransmissions, setRecentTransmissions] = useState<AutomatedTransmissionLog[]>([]);
  const [latestConfirmedTransmission, setLatestConfirmedTransmission] = useState<AutomatedTransmissionLog | null>(null);
  const [activeTab, setActiveTab] = useState<'directory' | 'transmit' | 'response_status' | 'my_records' | 'live_logs' | 'n8n_pipeline'>('directory');
  const [copiedReceiptId, setCopiedReceiptId] = useState<string | null>(null);
  const [selectedRecordForModal, setSelectedRecordForModal] = useState<AutomatedTransmissionLog | null>(null);

  // Load existing transmission history on mount
  useEffect(() => {
    fetchTransmissions();
  }, []);

  // When state changes, reset district filter
  useEffect(() => {
    setSelectedDistrict('All Districts');
  }, [selectedState]);

  const fetchTransmissions = async () => {
    try {
      const res = await fetch('/api/transmissions');
      const data = await res.json();
      if (data.transmissions && data.transmissions.length > 0) {
        setRecentTransmissions(data.transmissions);
      }
    } catch (e) {
      console.warn('Failed to load transmission logs from server');
    }
  };

  // Available districts based on selected state
  const availableDistricts = useMemo(() => {
    return getDistrictsForState(selectedState);
  }, [selectedState]);

  // Filtered hospital catalog
  const filteredHospitals = useMemo(() => {
    return COMPREHENSIVE_HOSPITAL_DIRECTORY.filter((h) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (h.nameRegional && h.nameRegional.includes(searchQuery)) ||
        h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (h.contactPerson && h.contactPerson.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        h.availableSpecialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesState = selectedState === 'All States' || h.state === selectedState;
      const matchesDistrict = selectedDistrict === 'All Districts' || h.district === selectedDistrict;
      const matchesCategory = selectedCategory === 'All' || h.category === selectedCategory;

      return matchesSearch && matchesState && matchesDistrict && matchesCategory;
    });
  }, [searchQuery, selectedState, selectedDistrict, selectedCategory]);

  const handleSelectHospital = (h: HospitalDirectoryItem) => {
    setSelectedHospital(h);
    if (onHospitalSelect) {
      onHospitalSelect(h);
    }
  };

  const handleStartDispatchForHospital = (h: HospitalDirectoryItem) => {
    setSelectedHospital(h);
    setActiveTab('transmit');
  };

  // Execute Multi-Channel Patient Query Dispatch
  const handleDispatchPatientQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryDescription.trim()) {
      alert('Please describe your medical query or symptoms.');
      return;
    }

    setIsTransmitting(true);

    try {
      const transmission = await executeHospitalDispatch(
        {
          patientName: patientName.trim() || 'Citizen Walk-in',
          patientPhone: patientPhone.trim() || '+91 98765 43210',
          patientAge: patientAge.trim() || '32',
          patientGender,
          patientEmail: patientEmail.trim(),
          patientAbhaId: patientAbha.trim(),
          hospital: selectedHospital,
          querySummary: queryDescription,
          clinicalDetails: queryDescription,
          urgencyLevel,
          department: selectedDepartment,
          language: currentLanguage
        },
        (progress) => {
          setDispatchProgress(progress);
        }
      );

      // Add to recent list
      setRecentTransmissions((prev) => [transmission, ...prev]);
      setLatestConfirmedTransmission(transmission);
      
      // Transition to Response Status view
      setActiveTab('response_status');
    } catch (err: any) {
      console.error('Error dispatching query to hospital:', err);
      alert('Failed to transmit query. Please check connectivity.');
    } finally {
      setIsTransmitting(false);
      setDispatchProgress(null);
    }
  };

  const handlePrintSlip = (transmission: AutomatedTransmissionLog) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please allow pop-ups to print the registration slip.');
      return;
    }

    const urgencyText =
      transmission.urgencyLevel === 1
        ? 'LEVEL 1 - RED (RESUSCITATION)'
        : transmission.urgencyLevel === 2
        ? 'LEVEL 2 - ORANGE (EMERGENT)'
        : transmission.urgencyLevel === 3
        ? 'LEVEL 3 - YELLOW (URGENT)'
        : 'LEVEL 4 - GREEN (ROUTINE)';

    const slipHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>JanArogya Patient Slip - ${transmission.tokenNumber}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              padding: 30px;
              color: #1e293b;
              max-width: 780px;
              margin: 0 auto;
            }
            .header {
              border-bottom: 2px solid #0f766e;
              padding-bottom: 15px;
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              color: #0f766e;
            }
            .sub-logo {
              font-size: 12px;
              color: #64748b;
            }
            .token-box {
              background: #f0fdfa;
              border: 2px solid #0f766e;
              border-radius: 8px;
              padding: 12px 20px;
              text-align: center;
            }
            .token-title {
              font-size: 11px;
              text-transform: uppercase;
              color: #0f766e;
              font-weight: 700;
            }
            .token-num {
              font-size: 26px;
              font-weight: 900;
              color: #0f766e;
              font-family: monospace;
            }
            .section-title {
              font-size: 13px;
              font-weight: 700;
              text-transform: uppercase;
              color: #0f766e;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 4px;
              margin-top: 18px;
              margin-bottom: 10px;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              font-size: 13px;
            }
            .field label {
              display: block;
              font-size: 11px;
              color: #64748b;
              text-transform: uppercase;
            }
            .field span {
              font-weight: 600;
              color: #0f172a;
            }
            .contact-card {
              background: #f8fafc;
              border: 1px solid #cbd5e1;
              padding: 12px;
              border-radius: 8px;
              margin-top: 10px;
              font-size: 13px;
            }
            .alert-box {
              background: #f8fafc;
              border-left: 4px solid #0f766e;
              padding: 10px 14px;
              margin-top: 14px;
              font-size: 12px;
            }
            .footer {
              margin-top: 30px;
              border-top: 1px solid #e2e8f0;
              padding-top: 10px;
              font-size: 11px;
              color: #64748b;
              text-align: center;
            }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">JanArogya AI • Official Patient Slip</div>
              <div class="sub-logo">National Public Health & Emergency Hospital Dispatch Gateway</div>
            </div>
            <div class="token-box">
              <div class="token-title">Assigned Token</div>
              <div class="token-num">${transmission.tokenNumber}</div>
            </div>
          </div>

          <div class="grid">
            <div class="field">
              <label>Transmission / Registration ID</label>
              <span>${transmission.id}</span>
            </div>
            <div class="field">
              <label>Date & Timestamp</label>
              <span>${transmission.date} • ${transmission.timestamp}</span>
            </div>
          </div>

          <div class="section-title">Target Hospital Facility & Contact Person</div>
          <div class="contact-card">
            <div style="font-weight: 700; font-size: 15px; color: #0f766e;">${transmission.hospitalName} (${transmission.hospitalCategory})</div>
            <div style="color: #475569; font-size: 12px; margin-top: 2px;">${transmission.hospitalCity}, ${transmission.hospitalDistrict ? transmission.hospitalDistrict + ', ' : ''}${transmission.hospitalState}</div>
            <div style="margin-top: 8px; font-weight: 600; color: #1e293b;">
              Designated Nodal Officer: ${transmission.contactPerson?.name || 'Medical Superintendent'} (${transmission.contactPerson?.designation || 'Emergency Triage Head'})
            </div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
              Direct Nodal Phone: ${transmission.contactPerson?.phone || transmission.channels.voiceCall.targetNumber} | Emergency Desk: ${transmission.channels.voiceCall.targetNumber}
            </div>
          </div>

          <div class="section-title">Patient Demographics & Clinical Triage Record</div>
          <div class="grid">
            <div class="field">
              <label>Patient Full Name</label>
              <span>${transmission.patientName}</span>
            </div>
            <div class="field">
              <label>Age / Gender</label>
              <span>${transmission.patientAge || '32'} yrs / ${transmission.patientGender || 'Unspecified'}</span>
            </div>
            <div class="field">
              <label>Contact Phone</label>
              <span>${transmission.patientPhone}</span>
            </div>
            <div class="field">
              <label>ABHA ID</label>
              <span>${transmission.patientAbhaId || 'Not Linked (Self-declared at Kiosk)'}</span>
            </div>
            <div class="field">
              <label>Required Department</label>
              <span>${transmission.department}</span>
            </div>
            <div class="field">
              <label>Triage Priority Level</label>
              <span style="color: #b91c1c;">${urgencyText}</span>
            </div>
          </div>

          <div class="alert-box">
            <strong>Chief Complaint / Query Submitted:</strong><br/>
            ${transmission.querySummary}
          </div>

          <div class="section-title">Multi-Channel Automated Dispatch Verification</div>
          <div style="font-size: 12px; line-height: 1.6; color: #334155;">
            • <strong>Voice IVR Dispatch:</strong> Delivered to Nodal Officer (${transmission.channels.voiceCall.targetNumber}) - Audio Synthesized (${transmission.channels.voiceCall.durationSecs}s)<br/>
            • <strong>Cellular SMS Gateway:</strong> Dispatched to ${transmission.channels.smsDispatch.targetNumber} and Patient Receipt sent to ${transmission.patientPhone}<br/>
            • <strong>Official Email:</strong> Transmitted to ${transmission.channels.emailDispatch.targetEmail}
          </div>

          <div class="footer">
            This is a computer-generated official JanArogya medical triage confirmation slip. Please present this at the hospital registration counter or casualty triage desk.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(slipHtml);
    printWindow.document.close();
  };

  const handleCopyReceipt = (record: AutomatedTransmissionLog) => {
    const text = `🏥 JanArogya Hospital Query Slip:
Token: ${record.tokenNumber}
Hospital: ${record.hospitalName}
Attn: ${record.contactPerson?.name || 'Medical Superintendent'}
Ref ID: ${record.id}
Dept: ${record.department}
Patient: ${record.patientName} (${record.patientPhone})
Urgency: Level ${record.urgencyLevel}
Date: ${record.date} at ${record.timestamp}`;

    navigator.clipboard.writeText(text);
    setCopiedReceiptId(record.id);
    setTimeout(() => setCopiedReceiptId(null), 2000);
  };

  return (
    <div id="hospital-finder-dispatch-container" className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            id="tab-btn-directory"
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'directory'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Global Hospital Directory
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20 text-current ml-1">
              {filteredHospitals.length}
            </span>
          </button>

          <button
            id="tab-btn-transmit"
            onClick={() => setActiveTab('transmit')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'transmit'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Send className="w-4 h-4" />
            Dispatch Patient Query
          </button>

          {latestConfirmedTransmission && (
            <button
              id="tab-btn-response-status"
              onClick={() => setActiveTab('response_status')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'response_status'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Response Received
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </button>
          )}

          <button
            id="tab-btn-my-records"
            onClick={() => setActiveTab('my_records')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'my_records'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-4 h-4" />
            Patient Slips & Records
            {recentTransmissions.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 ml-1">
                {recentTransmissions.length}
              </span>
            )}
          </button>

          <button
            id="tab-btn-live-logs"
            onClick={() => setActiveTab('live_logs')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'live_logs'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Radio className="w-4 h-4" />
            Live Routing Architecture
          </button>

          <button
            id="tab-btn-n8n-pipeline"
            onClick={() => setActiveTab('n8n_pipeline')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'n8n_pipeline'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            n8n / Make.com Automation
          </button>
        </div>

        {/* Selected target quick preview */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-600 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
          <span className="font-medium text-slate-500">Target Hospital:</span>
          <span className="font-bold text-teal-800 truncate max-w-[220px]">{selectedHospital.name}</span>
          <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-semibold">
            {selectedHospital.category}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: GLOBAL HOSPITAL DIRECTORY WITH STATE, DISTRICT & TYPE FILTERING */}
      {/* ========================================================================= */}
      {activeTab === 'directory' && (
        <div id="global-hospital-directory-view" className="space-y-6">
          {/* Header & Filter Controls Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-teal-700" />
                  Global Hospital Directory & Nodal Triage Stations
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Search and select any government, private, autonomous (AIIMS), or charitable hospital across Indian states and districts.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 self-start md:self-auto">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Verified Nodal Directory • Live Telemetry
              </div>
            </div>

            {/* Filter Controls: State, District, Category, and Text Search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {/* State Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  State / Territory
                </label>
                <div className="relative">
                  <select
                    id="filter-select-state"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    {ALL_INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* District Filter (Dynamic) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  District / Zone
                </label>
                <div className="relative">
                  <select
                    id="filter-select-district"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    {availableDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* Category Filter (Gov / Private / AIIMS / Trust) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Institution Type
                </label>
                <div className="relative">
                  <select
                    id="filter-select-category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="All">All Types (Gov, Private, AIIMS)</option>
                    <option value="Government">Government Public Hospital</option>
                    <option value="Private">Private Super-Specialty</option>
                    <option value="Autonomous / AIIMS">Autonomous / AIIMS Apex</option>
                    <option value="Trust / Charitable">Trust / Charitable Hospital</option>
                  </select>
                  <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* Text Search */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Search Hospital / Doctor
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    id="filter-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Victoria, KEM, Dr. Manjunath..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hospitals Catalog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHospitals.map((hospital) => {
              const isSelected = selectedHospital.id === hospital.id;

              return (
                <div
                  key={hospital.id}
                  id={`hospital-card-${hospital.id}`}
                  className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between space-y-4 hover:shadow-md ${
                    isSelected ? 'border-teal-600 ring-2 ring-teal-500/20 shadow-sm' : 'border-slate-200'
                  }`}
                >
                  {/* Top: Category & Location Tags */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          hospital.category === 'Government'
                            ? 'bg-blue-100 text-blue-800'
                            : hospital.category === 'Private'
                            ? 'bg-purple-100 text-purple-800'
                            : hospital.category === 'Autonomous / AIIMS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {hospital.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {hospital.district}, {hospital.state}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-teal-700 transition-colors">
                      {hospital.name}
                    </h3>
                    {hospital.nameRegional && (
                      <p className="text-xs text-slate-500 font-medium">{hospital.nameRegional}</p>
                    )}
                  </div>

                  {/* Designated Contact Person Card */}
                  {hospital.contactPerson && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                        <span className="flex items-center gap-1 text-teal-700">
                          <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                          Nodal Contact Person
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                          Active
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs">{hospital.contactPerson.name}</div>
                      <div className="text-slate-600 text-[11px] truncate">{hospital.contactPerson.designation}</div>
                      <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>📞 {hospital.contactPerson.phone}</span>
                        <span className="truncate max-w-[120px]">✉️ {hospital.contactPerson.email}</span>
                      </div>
                    </div>
                  )}

                  {/* Hospital Telemetry Indicators */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center text-xs">
                    <div className="bg-slate-50/80 p-2 rounded-lg">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Beds</span>
                      <span className="font-bold text-slate-800">{hospital.totalBeds}</span>
                    </div>
                    <div className="bg-emerald-50/80 p-2 rounded-lg">
                      <span className="text-emerald-600 text-[10px] uppercase font-bold block">ICU Available</span>
                      <span className="font-bold text-emerald-800">{hospital.icuBedsAvailable}</span>
                    </div>
                    <div className="bg-teal-50/80 p-2 rounded-lg">
                      <span className="text-teal-600 text-[10px] uppercase font-bold block">PM-JAY</span>
                      <span className="font-bold text-teal-800">Cashless</span>
                    </div>
                  </div>

                  {/* Specialties Pills */}
                  <div className="flex flex-wrap gap-1">
                    {hospital.availableSpecialties.slice(0, 3).map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                    {hospital.availableSpecialties.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px]">
                        +{hospital.availableSpecialties.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      id={`btn-select-hospital-${hospital.id}`}
                      onClick={() => handleSelectHospital(hospital)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-teal-50 text-teal-800 border border-teal-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> : null}
                      {isSelected ? 'Selected' : 'Select Target'}
                    </button>

                    <button
                      id={`btn-dispatch-to-${hospital.id}`}
                      onClick={() => handleStartDispatchForHospital(hospital)}
                      className="py-2 px-3 rounded-xl text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white transition-all flex items-center gap-1 shadow-sm active:scale-95"
                    >
                      <span>Transmit Query</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredHospitals.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No hospitals matched your filter criteria</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try selecting "All States" or "All Districts", or searching for broader terms like "Government" or "General Medicine".
              </p>
              <button
                onClick={() => {
                  setSelectedState('All States');
                  setSelectedDistrict('All Districts');
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MANUAL / VOICE PATIENT QUERY DISPATCH FORM */}
      {/* ========================================================================= */}
      {activeTab === 'transmit' && (
        <div id="dispatch-query-form-view" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Left Side (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-teal-700" />
                Submit Patient Details & Trigger Multi-Channel Dispatch
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter the patient demographic and medical query. Once submitted, our AI agent automatically routes voice calls, SMS tickets, and clinical emails to the selected hospital's contact person.
              </p>
            </div>

            <form onSubmit={handleDispatchPatientQuery} className="space-y-4">
              {/* Patient Basic Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Phone Number (SMS/Voice Receipt) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Age & Gender
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="Age"
                      className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white"
                    />
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Patient Email (Optional Digital Slip)
                  </label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="patient@email.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* ABHA ID (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ABHA Health ID (Ayushman Bharat Digital Health ID)
                </label>
                <input
                  type="text"
                  value={patientAbha}
                  onChange={(e) => setPatientAbha(e.target.value)}
                  placeholder="e.g. 91-4567-8901-2345 or ramesh@abdm"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-teal-600 focus:bg-white"
                />
              </div>

              {/* Department & Urgency Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Clinical Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  >
                    <option value="General Medicine">General Medicine OPD</option>
                    <option value="Emergency & Trauma">Emergency & Trauma Bay</option>
                    <option value="Cardiology">Cardiology & Chest Pain</option>
                    <option value="Pediatrics">Pediatrics & Neonatal Care</option>
                    <option value="Obstetrics & Gynecology">Obstetrics & Maternity</option>
                    <option value="Orthopedics">Orthopedics & Fractures</option>
                    <option value="Neurology">Neurology & Stroke Unit</option>
                    <option value="Pulmonology">Pulmonology & Respiratory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    SATS Triage Priority Level
                  </label>
                  <select
                    value={urgencyLevel}
                    onChange={(e) => setUrgencyLevel(Number(e.target.value) as UrgencyLevel)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-teal-600 focus:bg-white"
                  >
                    <option value={1}>Level 1 - Resuscitation (Red) - Immediate</option>
                    <option value={2}>Level 2 - Emergent (Orange) - &lt; 10 Mins</option>
                    <option value={3}>Level 3 - Urgent (Yellow) - &lt; 30 Mins</option>
                    <option value={4}>Level 4 - Routine / Standard (Green) - &lt; 60 Mins</option>
                  </select>
                </div>
              </div>

              {/* Chief Query / Symptoms Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Symptoms Description / Patient Query *
                </label>
                <textarea
                  required
                  rows={4}
                  value={queryDescription}
                  onChange={(e) => setQueryDescription(e.target.value)}
                  placeholder="Describe the medical concern, symptom duration, pain level, or doctor consultation request..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isTransmitting}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all ${
                    isTransmitting
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-700 to-emerald-800 hover:from-teal-800 hover:to-emerald-900 active:scale-98'
                  }`}
                >
                  {isTransmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{dispatchProgress ? dispatchProgress.stepTitle : 'Executing Multi-Channel Dispatch...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Dispatch Query & Generate Patient Record Slip</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Target Institution & Real-Time Routing Preview Right Side (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Target Hospital Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Target Dispatch Facility
                </span>
                <button
                  onClick={() => setActiveTab('directory')}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 underline"
                >
                  Change Hospital
                </button>
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 mb-2 inline-block">
                  {selectedHospital.category}
                </span>
                <h3 className="font-bold text-slate-900 text-base leading-tight">{selectedHospital.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedHospital.city}, {selectedHospital.district}, {selectedHospital.state}
                </p>
              </div>

              {/* Target Contact Person Preview */}
              {selectedHospital.contactPerson && (
                <div className="p-4 bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-600/30 border border-teal-400/40 flex items-center justify-center font-bold text-teal-200 text-base">
                      <UserCheck className="w-5 h-5 text-teal-300" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">
                        Assigned Contact Person
                      </span>
                      <h4 className="font-bold text-sm text-white">{selectedHospital.contactPerson.name}</h4>
                      <p className="text-xs text-teal-200 truncate">{selectedHospital.contactPerson.designation}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-700/60 text-xs space-y-1 font-mono text-slate-300">
                    <div>📞 Hotline: {selectedHospital.contactPerson.phone}</div>
                    <div className="truncate">✉️ Email: {selectedHospital.contactPerson.email}</div>
                  </div>
                </div>
              )}

              {/* Real-time Channels Badge */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                <span className="font-bold text-slate-700 block">Automated Dispatch Channels Active:</span>
                <div className="space-y-1.5 text-slate-600">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    <span><strong>Voice IVR:</strong> Neural text-to-speech dialer to duty superintendent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span><strong>SMS Ticket:</strong> Direct gateway alert to doctor on duty & patient receipt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-purple-600" />
                    <span><strong>Hospital Email:</strong> Official clinical referral dossier to triage desk</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Progress Bar if Transmitting */}
            {isTransmitting && dispatchProgress && (
              <div className="bg-white rounded-2xl border border-teal-200 shadow-lg p-5 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold text-teal-900">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-teal-600 animate-pulse" />
                    Step {dispatchProgress.stepNumber} of {dispatchProgress.totalSteps}: {dispatchProgress.stepTitle}
                  </span>
                  <span className="font-mono text-teal-700">{dispatchProgress.latencyMs}ms</span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(dispatchProgress.stepNumber / dispatchProgress.totalSteps) * 100}%` }}
                  />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{dispatchProgress.stepDescription}</p>

                <div className="text-[10px] font-mono text-slate-400 flex justify-between pt-1 border-t border-slate-100">
                  <span>Node: {dispatchProgress.activeNode}</span>
                  <span>Packet: {dispatchProgress.payloadHash}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STATUS CONFIRMATION & RESPONSE RECEIVED PANEL */}
      {/* ========================================================================= */}
      {activeTab === 'response_status' && latestConfirmedTransmission && (
        <HospitalStatusConfirmation
          transmission={latestConfirmedTransmission}
          onPrintSlip={handlePrintSlip}
          onNewSubmission={() => setActiveTab('transmit')}
          onViewDirectory={() => setActiveTab('directory')}
          currentLanguage={currentLanguage}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PATIENT SLIPS & HISTORICAL RECORDS */}
      {/* ========================================================================= */}
      {activeTab === 'my_records' && (
        <div id="patient-records-history-view" className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-teal-700" />
                Patient Registration Slips & Transmission History
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Access, print, and share your generated hospital inquiry slips and multi-channel dispatch receipts.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('transmit')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-teal-800 self-start sm:self-auto"
            >
              <Send className="w-3.5 h-3.5" />
              New Inquiry
            </button>
          </div>

          {recentTransmissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentTransmissions.map((record) => (
                <div
                  key={record.id}
                  id={`record-card-${record.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-teal-500 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-lg font-black text-teal-700 bg-teal-50 px-3 py-1 rounded-lg border border-teal-100">
                        {record.tokenNumber}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Delivered
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{record.hospitalName}</h3>
                      <p className="text-xs text-slate-500">
                        {record.hospitalCity}, {record.hospitalDistrict ? `${record.hospitalDistrict}, ` : ''}{record.hospitalState} • {record.department}
                      </p>
                    </div>

                    {record.contactPerson && (
                      <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-0.5 text-slate-700">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Person</span>
                        <div className="font-semibold text-slate-900">{record.contactPerson.name}</div>
                        <div className="text-[11px] text-slate-500">{record.contactPerson.designation}</div>
                      </div>
                    )}

                    <div className="text-xs text-slate-700 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-600 block mb-0.5">Patient Query:</span>
                      <p className="italic line-clamp-2">"{record.querySummary}"</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Ref: {record.id}</span>
                      <span>{record.date} • {record.timestamp}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyReceipt(record)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      {copiedReceiptId === record.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedReceiptId === record.id ? 'Copied' : 'Copy'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setLatestConfirmedTransmission(record);
                          setActiveTab('response_status');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 text-xs font-semibold transition-colors"
                      >
                        View Status Panel
                      </button>
                      <button
                        onClick={() => handlePrintSlip(record)}
                        className="px-3 py-1.5 rounded-lg bg-teal-700 text-white hover:bg-teal-800 text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Print Slip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No patient transmission slips generated yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Submit an inquiry or consultation request to any hospital in the directory to generate an official registration slip.
              </p>
              <button
                onClick={() => setActiveTab('transmit')}
                className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold shadow-sm"
              >
                Create First Inquiry
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: LIVE ROUTING ARCHITECTURE TELEMETRY */}
      {/* ========================================================================= */}
      {activeTab === 'live_logs' && (
        <div id="live-routing-architecture-view" className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-5 h-5 text-teal-700" />
              Multi-Channel Automated Dispatch Architecture
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Demonstrates how patient queries (Voice, SMS, and Email) are dynamically routed through the SATS Triage Engine directly to the designated contact person and emergency desks of public and private medical institutions.
            </p>
          </div>

          {/* Architecture Visualizer Diagram */}
          <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-6 border border-slate-800">
            <div className="text-xs font-mono text-teal-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              National Dispatch Pipeline Telemetry
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1 */}
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
                <div className="text-[10px] font-bold uppercase text-teal-400">Node 1 • Input Capture</div>
                <h4 className="font-bold text-sm">Patient Voice / Form</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Captures patient speech or text in Kannada, Hindi, or English. Normalizes symptoms & generates ABHA health records.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
                <div className="text-[10px] font-bold uppercase text-teal-400">Node 2 • SATS Triage</div>
                <h4 className="font-bold text-sm">Priority & OPD Slot</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Evaluates urgency level (Red, Orange, Yellow, Green), assigns department (Cardiology, Trauma, Medicine) and queues token.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
                <div className="text-[10px] font-bold uppercase text-teal-400">Node 3 • Multi-Gateways</div>
                <h4 className="font-bold text-sm">Voice / SMS / Email</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Converts query to IVR audio synthesizer call, dispatches cellular SMS alerts, and generates formal clinical referral emails.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
                <div className="text-[10px] font-bold uppercase text-teal-400">Node 4 • Contact Person</div>
                <h4 className="font-bold text-sm">Hospital Nodal Desk</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Delivered directly to designated Medical Superintendent, Triage In-charge terminal, and patient phone confirmation receipt.
                </p>
              </div>
            </div>

            {/* Live Transmission Log Telemetry Table */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-sm font-bold text-teal-200 mb-3">Live Institutional Dispatch Log</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono text-slate-300">
                  <thead className="text-[11px] text-slate-400 border-b border-slate-800 uppercase">
                    <tr>
                      <th className="py-2">Txn ID</th>
                      <th className="py-2">Token</th>
                      <th className="py-2">Target Facility</th>
                      <th className="py-2">Contact Person</th>
                      <th className="py-2">Voice IVR</th>
                      <th className="py-2">SMS Gateway</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {recentTransmissions.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 text-teal-300">{log.id}</td>
                        <td className="py-2.5 font-bold text-white">{log.tokenNumber}</td>
                        <td className="py-2.5 text-slate-200">{log.hospitalName}</td>
                        <td className="py-2.5 text-slate-300">{log.contactPerson?.name || 'Medical Superintendent'}</td>
                        <td className="py-2.5 text-emerald-400">{log.channels.voiceCall.status}</td>
                        <td className="py-2.5 text-blue-400">{log.channels.smsDispatch.status}</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 text-[10px] font-semibold">
                            Acknowledged
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: N8N & MAKE.COM AUTOMATION PIPELINE BLUEPRINT & TESTBED */}
      {/* ========================================================================= */}
      {activeTab === 'n8n_pipeline' && (
        <AutomationPipelineVisualizer
          currentLanguage={currentLanguage}
          sampleTransmission={latestConfirmedTransmission || recentTransmissions[0] || null}
        />
      )}
    </div>
  );
}
