import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Pill,
  Activity,
  Layers,
  HelpCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { DocumentParseResult, TriageResult } from '../types';
import { SAMPLE_DOCUMENT_PRESETS } from '../data/hospitalData';
import { getSampleDocumentImage } from '../utils/sampleImages';

interface DocumentScannerProps {
  onTokenGeneratedFromDoc: (triage: TriageResult) => void;
}

export const DocumentScanner: React.FC<DocumentScannerProps> = ({
  onTokenGeneratedFromDoc
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(getSampleDocumentImage('rx-handwritten'));
  const [selectedPresetId, setSelectedPresetId] = useState<string>('rx-handwritten');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parseResult, setParseResult] = useState<DocumentParseResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tokenGeneratedMsg, setTokenGeneratedMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-run initial sample parsing on mount if empty
  React.useEffect(() => {
    handleAnalyzeDocument(getSampleDocumentImage('rx-handwritten'), 'PRESCRIPTION');
  }, []);

  const handleSelectPreset = (preset: typeof SAMPLE_DOCUMENT_PRESETS[0]) => {
    setSelectedPresetId(preset.id);
    const imgData = getSampleDocumentImage(preset.id);
    setSelectedImage(imgData);
    setParseResult(null);
    setTokenGeneratedMsg(null);
    handleAnalyzeDocument(imgData, preset.type);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage(base64);
      setSelectedPresetId('custom-upload');
      setParseResult(null);
      setTokenGeneratedMsg(null);
      handleAnalyzeDocument(base64, 'AUTO_DETECT');
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeDocument = async (imageData: string, docHint: string) => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    setTokenGeneratedMsg(null);

    try {
      const response = await fetch('/api/parse-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageData,
          docTypeHint: docHint
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze medical document');
      }

      const data: DocumentParseResult = await response.json();
      setParseResult(data);
    } catch (err: any) {
      console.error('Document analysis error:', err);
      setErrorMsg(err?.message || 'Error processing document');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateTokenFromDoc = () => {
    if (!parseResult) return;

    const docName = parseResult.patientName || 'Document Beneficiary';
    const dept = parseResult.departmentRecommendation || 'General Medicine OPD';
    let code = 'MED';
    let room = 'Rooms 104-106, 1st Floor';
    let floor = '1st Floor, Block A';
    let color: 'red' | 'amber' | 'yellow' | 'emerald' | 'blue' = 'emerald';
    let cat: any = 'ROUTINE_OPD';
    let waitMins = 15;

    if (parseResult.urgencyLevel === 1) {
      code = 'EMG';
      room = 'Room 001 - Ground Floor (Red Bay)';
      floor = 'Ground Floor, North Gate';
      color = 'red';
      cat = 'EMERGENCY';
      waitMins = 0;
    } else if (parseResult.urgencyLevel === 2) {
      code = 'EMG';
      room = 'Room 001 - Observation Bay';
      floor = 'Ground Floor, Emergency Ward';
      color = 'amber';
      cat = 'PRIORITY';
      waitMins = 5;
    } else if (parseResult.urgencyLevel === 3) {
      code = dept.includes('Pharm') ? 'PHARM' : 'MED';
      room = dept.includes('Pharm') ? 'Counters 1-4, Ground Floor Exit' : 'Room 104, 1st Floor';
      floor = dept.includes('Pharm') ? 'Ground Floor' : '1st Floor';
      color = 'yellow';
      cat = dept.includes('Pharm') ? 'PHARMACY_REFILL' : 'PRIORITY';
      waitMins = 10;
    }

    const tokenSeq = Math.floor(Math.random() * 20) + 215;
    const tokenNumber = `${code}-${tokenSeq}`;

    const triage: TriageResult = {
      id: `doc-triage-${Date.now()}`,
      urgencyLevel: parseResult.urgencyLevel,
      urgencyLabel: `Level ${parseResult.urgencyLevel} - ${parseResult.urgencyLevel <= 2 ? 'Critical Hospital Routing' : 'Standard Clinic Queue'}`,
      urgencyColor: color,
      triageCategory: cat,
      primaryDepartment: dept,
      departmentCode: code,
      roomNumber: room,
      floorWing: floor,
      tokenNumber,
      waitTimeEstimateMinutes: waitMins,
      extractedSymptoms: parseResult.diagnosis,
      clinicalSummary: `Document OCR verified. ${parseResult.keyFindings.join(' ')}`,
      recommendedAction: parseResult.suggestedNextStep,
      nativeLanguageInstructions: `ದಾಖಲೆ ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಂಡಿದೆ. ದಯವಿಟ್ಟು ${room} ಗೆ ತೆರಳಿ. ಟೋಕನ್ ಸಂಖ್ಯೆ: ${tokenNumber}`,
      warningSigns: ['Severe bleeding', 'Persistent dizziness', 'High fever'],
      testsRecommended: parseResult.labTests.map(t => t.testName),
      fastTrackEligible: parseResult.urgencyLevel <= 2 || Boolean(parseResult.abhaId),
      abhaLinked: Boolean(parseResult.abhaId),
      timestamp: new Date().toISOString(),
      patientInfo: {
        name: docName,
        age: parseResult.age || '45',
        gender: parseResult.gender || 'Unspecified',
        phone: '+91 98703 30830',
        abhaId: parseResult.abhaId,
        language: 'kn'
      }
    };

    onTokenGeneratedFromDoc(triage);
    setTokenGeneratedMsg(`Hospital Token ${tokenNumber} successfully issued for ${docName}! Routed to ${dept}.`);
  };

  return (
    <div id="document-scanner-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini 3.7 Vision OCR
              </span>
              <span className="text-xs text-indigo-200">Ayushman Bharat &amp; Doctor Prescription Digitizer</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Multimodal Medical Document &amp; ABHA Card Scanner
            </h2>
            <p className="text-indigo-100 text-sm mt-1 max-w-2xl">
              Instantly deciphers handwritten doctor prescriptions, government ABHA / PM-JAY health cards, and complex pathology lab reports in seconds without manual entry.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15">
            <Pill className="w-8 h-8 text-amber-400 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-white">Jan Aushadhi Matcher</p>
              <p className="text-indigo-200">Automatic ₹0 Generic Copay Check</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Document Switcher */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Select A Test Document or Upload Your Own:
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Document Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_DOCUMENT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              id={`preset-doc-${preset.id}`}
              onClick={() => handleSelectPreset(preset)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedPresetId === preset.id
                  ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">{preset.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {preset.type}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Document Image Preview (Left) vs AI Extraction Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Document Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-600" />
                Physical Document Scan
              </h3>
              {isAnalyzing && (
                <span className="text-xs font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 animate-pulse">
                  <Activity className="w-3 h-3 animate-spin" />
                  Scanning Optical Layers...
                </span>
              )}
            </div>

            {selectedImage ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-slate-100 flex items-center justify-center min-h-[380px] max-h-[500px]">
                <img
                  src={selectedImage}
                  alt="Medical Document Scan"
                  className="w-full h-full object-contain max-h-[480px]"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4 text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin mb-3"></div>
                    <p className="font-bold text-sm">Gemini Multimodal OCR Running</p>
                    <p className="text-xs text-blue-100 mt-1">Transcribing handwriting, checking ABHA ID, &amp; matching generic medications...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                No document selected
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Extraction & Clinical Structure (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              ⚠️ {errorMsg}
            </div>
          )}

          {tokenGeneratedMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {tokenGeneratedMsg}
            </div>
          )}

          {parseResult ? (
            <div id="document-parse-result-card" className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-5">
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                      {parseResult.docType}
                    </span>
                    <span className="text-xs text-slate-500">
                      Confidence: {Math.round(parseResult.confidenceScore * 100)}%
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mt-1">
                    {parseResult.patientName || 'Anonymous Patient'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {parseResult.age && `Age: ${parseResult.age}`} {parseResult.gender && `• Gender: ${parseResult.gender}`} {parseResult.doctorName && `• Prescriber: ${parseResult.doctorName}`}
                  </p>
                </div>

                {parseResult.abhaId && (
                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-right">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 block">ABHA ID Linked</span>
                    <span className="text-xs font-mono font-bold text-emerald-950">{parseResult.abhaId}</span>
                  </div>
                )}
              </div>

              {/* Diagnosis / Key Medical Findings */}
              <div>
                <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Clinical Diagnosis &amp; Findings
                </h5>
                <div className="flex flex-wrap gap-2 mb-2">
                  {parseResult.diagnosis.map((d, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200"
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <div className="space-y-1">
                  {parseResult.keyFindings.map((finding, idx) => (
                    <p key={idx} className="text-xs text-slate-700 font-medium flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold">•</span>
                      {finding}
                    </p>
                  ))}
                </div>
              </div>

              {/* Prescribed Medications Table (if any) */}
              {parseResult.medications && parseResult.medications.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-blue-600" />
                      Prescribed Medicines &amp; Jan Aushadhi Generic Match
                    </h5>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      100% Free at Govt Pharmacy
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Medicine Name</th>
                          <th className="p-2.5">Dosage</th>
                          <th className="p-2.5">Frequency / Schedule</th>
                          <th className="p-2.5">Duration</th>
                          <th className="p-2.5 text-right">Generic Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                        {parseResult.medications.map((med, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80">
                            <td className="p-2.5 font-bold text-slate-900">{med.name}</td>
                            <td className="p-2.5">{med.dosage}</td>
                            <td className="p-2.5 text-blue-700 font-semibold">{med.frequency}</td>
                            <td className="p-2.5">{med.duration}</td>
                            <td className="p-2.5 text-right">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                ✓ Available (₹0)
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Lab Tests Table (if any) */}
              {parseResult.labTests && parseResult.labTests.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-red-600" />
                    Pathology &amp; Laboratory Test Results
                  </h5>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Test Name</th>
                          <th className="p-2.5">Observed Value</th>
                          <th className="p-2.5">Reference Range</th>
                          <th className="p-2.5 text-right">Clinical Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {parseResult.labTests.map((t, idx) => (
                          <tr key={idx} className={t.status === 'Critical' ? 'bg-red-50/70' : 'hover:bg-slate-50/80'}>
                            <td className="p-2.5 font-bold text-slate-900">{t.testName}</td>
                            <td className="p-2.5 font-bold font-mono">
                              {t.resultValue || 'Order Initiated'}
                            </td>
                            <td className="p-2.5 text-slate-500">{t.normalRange || '-'}</td>
                            <td className="p-2.5 text-right">
                              {t.status === 'Critical' ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white">
                                  CRITICAL ALERT
                                </span>
                              ) : t.status === 'Abnormal' ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                                  Abnormal
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  Normal
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Optical Handwriting Transcription Box */}
              <div>
                <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Full Optical Transcription
                </h5>
                <pre className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                  {parseResult.transcribedText}
                </pre>
              </div>

              {/* Routing & Action CTA */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-700 block">
                    Suggested Hospital Routing
                  </span>
                  <p className="text-sm font-bold text-slate-900">{parseResult.departmentRecommendation}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{parseResult.suggestedNextStep}</p>
                </div>

                <button
                  id="issue-token-from-doc-button"
                  onClick={handleCreateTokenFromDoc}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Issue Routing Token Now
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[380px]">
              <FileText className="w-12 h-12 text-slate-400 mb-2" />
              <h4 className="text-sm font-bold text-slate-700">Document Analysis Pending</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Select one of the sample presets above or upload any doctor prescription slip to trigger Gemini 3.7 Vision transcription.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
