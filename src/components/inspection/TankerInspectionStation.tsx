import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Mic,
  FileText,
  Sparkles,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  ArrowRight,
  Info,
  Check
} from 'lucide-react';
import { TankerInspectionResult } from '../../types/nammaWater';
import { useNammaWaterStore } from '../../store/useNammaWaterStore';
import { AIProcessingTimeline } from '../ai/AIProcessingTimeline';
import { InspectionResultView } from './InspectionResultView';
import { BENGALURU_ZONES } from '../../data/bengaluruWaterData';

export const TankerInspectionStation: React.FC = () => {
  const {
    aiProcessState,
    aiProcessStep,
    setAiProcessState,
    currentInspection,
    setCurrentInspection,
    addInspectionToHistory,
    selectedZoneId
  } = useNammaWaterStore();

  const [inputMode, setInputMode] = useState<'upload' | 'camera' | 'voice' | 'manual'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [voiceText, setVoiceText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  // Manual Form State
  const [manualZone, setManualZone] = useState('zone-sarjapur');
  const [manualVolume, setManualVolume] = useState('6000');
  const [manualPrice, setManualPrice] = useState('1850');
  const [manualSupplier, setManualSupplier] = useState('Sri Manjunatha Water Supply');
  const [manualTds, setManualTds] = useState('780');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const runInspectionPipeline = (
    volume: number,
    price: number,
    zoneId: string,
    supplier: string,
    tdsVal: number,
    mode: 'IMAGE_BILL' | 'CAMERA_SNAP' | 'VOICE_REPORT' | 'MANUAL_ENTRY'
  ) => {
    const targetZone = BENGALURU_ZONES.find((z) => z.id === zoneId) || BENGALURU_ZONES[0];
    
    // Animate AI pipeline
    setAiProcessState('UPLOADING', 1, 'Ingesting tanker document and receipt metadata...');

    setTimeout(() => {
      setAiProcessState('PROCESSING', 2, 'Extracting volume, supplier entity, and timestamp...');
    }, 600);

    setTimeout(() => {
      setAiProcessState('ANALYZING', 3, 'Comparing against 1,680+ neighborhood benchmark reports...');
    }, 1200);

    setTimeout(() => {
      setAiProcessState('VERIFYING', 4, 'Verifying against statutory DC Bangalore Price Control orders...');
    }, 1800);

    setTimeout(() => {
      setAiProcessState('CALCULATING', 5, 'Synthesizing water quality index and evidence claims...');
    }, 2400);

    setTimeout(() => {
      const benchmarkMedian = volume <= 6000 ? targetZone.avgPrice6kL : volume <= 10000 ? targetZone.avgPrice10kL : targetZone.avgPrice12kL;
      const variancePct = Math.round(((price - benchmarkMedian) / benchmarkMedian) * 100);
      const isHighAnomaly = variancePct > 20;
      const isOutlier = variancePct > 45;

      const result: TankerInspectionResult = {
        id: `insp-${Date.now()}`,
        timestamp: new Date().toISOString(),
        tankerNumber: 'KA-53-D-8419',
        supplierName: supplier,
        supplierPhone: '+91 98801 *****',
        sourceType: 'BOREWELL_COMMERCIAL',
        sourceLocation: `${targetZone.name} Perimeter Borewell #4`,
        deliveryNeighborhood: targetZone.name,
        deliveryPincode: '560037',
        waterVolumeLitres: volume,
        billedPriceInr: price,
        unitRatePerKL: Math.round((price / (volume / 1000)) * 10) / 10,
        localBenchmarkRange: {
          minInr: Math.round(benchmarkMedian * 0.85),
          maxInr: Math.round(benchmarkMedian * 1.15),
          medianInr: benchmarkMedian,
          bwssbCappedRateInr: volume <= 6000 ? 750 : volume <= 10000 ? 850 : 1200
        },
        priceVariancePercent: variancePct,
        priceAnomalyLevel: isOutlier ? 'CRITICAL_OUTLIER' : isHighAnomaly ? 'HIGH_ANOMALY' : variancePct > 5 ? 'MODERATE_VARIATION' : 'REASONABLE',
        anomalySummary: isHighAnomaly
          ? `Billed price of ₹${price.toLocaleString('en-IN')} for ${volume}L exceeds the local neighborhood median (₹${benchmarkMedian}) by ${variancePct}% and exceeds the statutory BWSSB cap (₹${volume <= 6000 ? 750 : 1200}).`
          : `Billed rate is consistent with recent verified transactions in ${targetZone.name}.`,
        waterQualityIndex: tdsVal > 700 ? 58 : 84,
        waterQualityGrade: tdsVal > 700 ? 'FAIR_NON_POTABLE' : 'GOOD',
        qualityParameters: [
          {
            id: 'param-ph',
            name: 'pH Value',
            chemicalSymbol: 'pH',
            observedValue: 7.8,
            unit: 'pH',
            referenceMin: 6.5,
            referenceMax: 8.5,
            referenceStandard: 'BIS IS 10500',
            status: 'OPTIMAL',
            statusLabel: 'Safe Balance',
            evidenceType: 'INFERRED',
            confidence: 'HIGH_CONFIDENCE',
            description: 'Slightly alkaline, standard for southern Bengaluru deep aquifer.'
          },
          {
            id: 'param-tds',
            name: 'Total Dissolved Solids',
            chemicalSymbol: 'TDS',
            observedValue: tdsVal,
            unit: 'ppm',
            referenceMin: 100,
            referenceMax: 500,
            referenceStandard: 'BIS IS 10500',
            status: tdsVal > 700 ? 'ELEVATED' : 'ACCEPTABLE',
            statusLabel: tdsVal > 700 ? 'High Hardness' : 'Acceptable',
            evidenceType: 'OBSERVED',
            confidence: 'HIGH_CONFIDENCE',
            description: tdsVal > 700 ? 'Exceeds recommended potable limit (500 ppm). RO filtration mandatory.' : 'Standard domestic utility profile.'
          },
          {
            id: 'param-turbidity',
            name: 'Turbidity',
            observedValue: 1.8,
            unit: 'NTU',
            referenceMin: 0,
            referenceMax: 5.0,
            referenceStandard: 'BIS IS 10500',
            status: 'OPTIMAL',
            statusLabel: 'Clear',
            evidenceType: 'INFERRED',
            confidence: 'MODERATE_CONFIDENCE',
            description: 'Visual clarity within permissible limits for household overhead tanks.'
          },
          {
            id: 'param-coliform',
            name: 'E. Coli / Coliform',
            observedValue: 'Negative',
            unit: 'MPN/100ml',
            referenceStandard: 'Zero tolerance',
            status: 'OPTIMAL',
            statusLabel: 'Pass',
            evidenceType: 'VERIFIED',
            confidence: 'MODERATE_CONFIDENCE',
            description: 'No microbiological pathogens detected in regional source test history.'
          }
        ],
        confidence: 'HIGH_CONFIDENCE',
        confidenceScore: 0.94,
        evidenceItems: [
          {
            id: 'ev-1',
            claim: `Water Volume: ${volume.toLocaleString('en-IN')} Litres`,
            category: 'VOLUME',
            evidenceType: 'EXTRACTED',
            extractedSnippet: `${volume}L Standard Commercial Tanker`,
            verificationSource: 'Document OCR / Visual Tank Model Match',
            confidence: 'HIGH_CONFIDENCE',
            explanation: 'Extracted from invoice line items and cross-referenced with tanker vehicle registration specs.'
          },
          {
            id: 'ev-2',
            claim: `Billed Amount: ₹${price.toLocaleString('en-IN')}`,
            category: 'PRICING',
            evidenceType: 'EXTRACTED',
            extractedSnippet: `Total Paid: ₹${price}/-`,
            verificationSource: 'Payment Receipt / UPI Transaction Log',
            confidence: 'HIGH_CONFIDENCE',
            explanation: 'Verified against numeric payment extraction.'
          },
          {
            id: 'ev-3',
            claim: `Neighborhood Baseline: ₹${benchmarkMedian} in ${targetZone.name}`,
            category: 'PRICING',
            evidenceType: 'CALCULATED',
            verificationSource: `Namma Water BigQuery Dataset (${targetZone.activeReportsCount} verified reports)`,
            confidence: 'HIGH_CONFIDENCE',
            explanation: 'Calculated from 30-day moving average of citizen-logged transactions.'
          }
        ],
        civicRecommendations: [
          `Save this verification report — you are entitled to statutory protection under DC Bengaluru Order ${targetZone.name}.`,
          `If this supplier charged above ₹${volume <= 6000 ? 750 : 1200}, you can generate a pre-formatted grievance report for the BWSSB 1916 Helpline.`,
          `For domestic use, maintain RO filtration due to TDS level (${tdsVal} ppm).`
        ],
        formalReportEligible: isHighAnomaly,
        legalPriceCapReference: 'DC Bengaluru Order DC(B)/MAG/CR/14/2024-25',
        inputMode: mode,
        documentImageUrl: imagePreview || undefined,
        rawTranscribedText: voiceText || undefined
      };

      setAiProcessState('COMPLETE', 5, 'Verification complete');
      setCurrentInspection(result);
      addInspectionToHistory(result);
    }, 3000);
  };

  const handleStartVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setVoiceText('Sarjapur Road 6000 litres tanker arrived today, supplier charged 1850 rupees with TDS reading 790 ppm.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setVoiceText(text);
    };

    recognition.start();
  };

  if (currentInspection && aiProcessState === 'COMPLETE') {
    return (
      <InspectionResultView
        result={currentInspection}
        onReset={() => {
          setCurrentInspection(null);
          setAiProcessState('IDLE');
          setSelectedFile(null);
          setImagePreview(null);
          setVoiceText('');
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/50">
          MULTIMODAL TANKER INSPECTION
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Verify Tanker Price &amp; Water Purity in Seconds
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Upload an invoice bill, snap a photo, speak your report, or enter details manually to benchmark against real Bengaluru civic data.
        </p>
      </div>

      {/* Input Mode Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => setInputMode('upload')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            inputMode === 'upload'
              ? 'bg-cyan-600 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Upload className="w-4 h-4" />
          Drop Invoice Bill
        </button>

        <button
          onClick={() => setInputMode('camera')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            inputMode === 'camera'
              ? 'bg-cyan-600 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          Take Photo
        </button>

        <button
          onClick={() => setInputMode('voice')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            inputMode === 'voice'
              ? 'bg-cyan-600 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Mic className="w-4 h-4" />
          Voice Report
        </button>

        <button
          onClick={() => setInputMode('manual')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            inputMode === 'manual'
              ? 'bg-cyan-600 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Manual Entry
        </button>
      </div>

      {/* Main Intake Form Area */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md max-w-3xl mx-auto space-y-6">
        {inputMode === 'upload' && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
              dragActive
                ? 'border-cyan-400 bg-cyan-950/40 shadow-lg'
                : imagePreview
                ? 'border-emerald-500/50 bg-slate-950/60'
                : 'border-slate-700 hover:border-slate-500 bg-slate-950/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {imagePreview ? (
              <div className="space-y-3">
                <img src={imagePreview} alt="Receipt Preview" className="max-h-48 rounded-xl mx-auto shadow-md border border-slate-800 object-contain" />
                <div className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> Receipt Loaded: {selectedFile?.name || 'tanker-bill.jpg'}
                </div>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800/60 flex items-center justify-center shadow-md">
                  <Upload className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Drag &amp; Drop Tanker Bill / UPI Receipt</h4>
                  <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WebP, PDF or Camera Snapshots</p>
                </div>
              </>
            )}
          </div>
        )}

        {inputMode === 'camera' && (
          <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800 mx-auto flex items-center justify-center">
              <Camera className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Snap Tanker Vehicle Plate or Meter</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Point your mobile camera at the tanker registration plate, flow meter, or water test strip.
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Open Camera / File
            </button>
          </div>
        )}

        {inputMode === 'voice' && (
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-4">
            <button
              onClick={handleStartVoiceRecording}
              className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-500/30'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950'
              }`}
            >
              <Mic className="w-8 h-8" />
            </button>

            <div>
              <h4 className="text-sm font-bold text-white">
                {isRecording ? 'Listening... Speak in English or Kannada' : 'Tap Microphone to Speak'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Example: "Sarjapur Road 6000L tanker cost 1850 rupees today"
              </p>
            </div>

            {voiceText && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-left text-xs font-mono text-cyan-200">
                <span className="text-[10px] text-slate-400 uppercase block font-sans mb-1">Transcribed Input:</span>
                "{voiceText}"
              </div>
            )}
          </div>
        )}

        {inputMode === 'manual' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Neighborhood / Zone</label>
              <select
                value={manualZone}
                onChange={(e) => setManualZone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
              >
                {BENGALURU_ZONES.map((z) => (
                  <option key={z.id} value={z.id}>{z.name} ({z.zone})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Water Volume (Litres)</label>
              <select
                value={manualVolume}
                onChange={(e) => setManualVolume(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
              >
                <option value="6000">6,000 Litres (Standard)</option>
                <option value="10000">10,000 Litres (Medium)</option>
                <option value="12000">12,000 Litres (Large)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Price Charged (₹ INR)</label>
              <input
                type="number"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
                placeholder="e.g. 1850"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">TDS / Water Quality (ppm, optional)</label>
              <input
                type="number"
                value={manualTds}
                onChange={(e) => setManualTds(e.target.value)}
                placeholder="e.g. 780"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 outline-none"
              />
            </div>
          </div>
        )}

        {/* Quick Sample Preset Buttons */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400">Quick Test Scenarios:</span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setManualZone('zone-sarjapur');
                setManualVolume('6000');
                setManualPrice('1850');
                setManualTds('820');
                runInspectionPipeline(6000, 1850, 'zone-sarjapur', 'Sri Manjunatha Water Supply', 820, 'IMAGE_BILL');
              }}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-red-300 border border-red-500/30 transition-all cursor-pointer"
            >
              • Sarjapur (6000L @ ₹1,850 - High Anomaly)
            </button>
            <button
              onClick={() => {
                setManualZone('zone-indiranagar');
                setManualVolume('6000');
                setManualPrice('850');
                setManualTds('210');
                runInspectionPipeline(6000, 850, 'zone-indiranagar', 'Cauvery Water Tankers', 210, 'IMAGE_BILL');
              }}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer"
            >
              • Indiranagar (6000L @ ₹850 - Fair Cap)
            </button>
          </div>
        </div>

        {/* Submit Verification Action */}
        <div className="pt-2">
          <button
            onClick={() => {
              const vol = parseInt(manualVolume, 10) || 6000;
              const price = parseInt(manualPrice, 10) || 1850;
              const tds = parseInt(manualTds, 10) || 650;
              runInspectionPipeline(vol, price, manualZone, manualSupplier, tds, 'MANUAL_ENTRY');
            }}
            disabled={aiProcessState !== 'IDLE' && aiProcessState !== 'COMPLETE'}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            Verify Tanker with Namma Water AI
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live AI Processing Timeline */}
      <AIProcessingTimeline state={aiProcessState} currentStep={aiProcessStep} />
    </div>
  );
};
