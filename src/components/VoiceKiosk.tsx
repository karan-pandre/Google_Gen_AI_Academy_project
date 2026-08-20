import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  AlertTriangle,
  Clock,
  MapPin,
  Send,
  Sparkles,
  User,
  ShieldCheck,
  Printer,
  Share2,
  CheckCircle2,
  Activity,
  ArrowRight,
  Flame,
  Stethoscope,
  Download,
  FileDown
} from 'lucide-react';
import { PatientInfo, TriageResult } from '../types';
import { SAMPLE_VOICE_PROMPTS } from '../data/hospitalData';
import { generatePatientSummaryPdf } from '../utils/generatePatientPdf';

interface VoiceKioskProps {
  currentLanguage: 'kn' | 'hi' | 'en' | 'te' | 'ta';
  onTokenGenerated: (triage: TriageResult) => void;
  onSendNotification: (triage: TriageResult, channel: 'WhatsApp' | 'SMS') => void;
}

export const VoiceKiosk: React.FC<VoiceKioskProps> = ({
  currentLanguage,
  onTokenGenerated,
  onSendNotification
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  // Patient Demographic Form State
  const [patientName, setPatientName] = useState('Karan');
  const [age, setAge] = useState('48');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('+91 98703 30830');
  const [abhaId, setAbhaId] = useState('91-4521-8890-3321');
  const [isVulnerable, setIsVulnerable] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Web Speech API Initialization
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLanguage === 'kn' ? 'kn-IN' : currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setSpeechTranscript(currentText);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event:', event);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentLanguage]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setSpeechTranscript('');
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = currentLanguage === 'kn' ? 'kn-IN' : currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
          recognitionRef.current.start();
          setIsRecording(true);
        } else {
          // Fallback if browser does not support Web Speech API
          const defaultSample = SAMPLE_VOICE_PROMPTS.find(p => p.language === currentLanguage) || SAMPLE_VOICE_PROMPTS[0];
          setSpeechTranscript(defaultSample.spokenText);
        }
      } catch (err) {
        console.warn('Recognition start error:', err);
        const defaultSample = SAMPLE_VOICE_PROMPTS.find(p => p.language === currentLanguage) || SAMPLE_VOICE_PROMPTS[0];
        setSpeechTranscript(defaultSample.spokenText);
      }
    }
  };

  const handleSelectSamplePrompt = (sample: typeof SAMPLE_VOICE_PROMPTS[0]) => {
    setSpeechTranscript(sample.spokenText);
    runTriageProcess(sample.spokenText);
  };

  const runTriageProcess = async (inputText?: string) => {
    const textToAnalyze = inputText || speechTranscript;
    if (!textToAnalyze.trim()) return;

    setIsProcessing(true);
    setDispatchSuccess(null);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputSpeechOrText: textToAnalyze,
          language: currentLanguage,
          patientName: patientName || 'Walk-in Patient',
          age: age || '45',
          gender,
          phone: phone || '+91 98703 30830',
          abhaId: abhaId || '',
          isVulnerable
        })
      });

      if (!response.ok) {
        throw new Error('Failed to compute triage');
      }

      const result: TriageResult = await response.json();
      setTriageResult(result);
      onTokenGenerated(result);

      // Auto speak native instruction if audio supported
      speakText(result.nativeLanguageInstructions || result.recommendedAction);
    } catch (err) {
      console.error('Triage error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getUrgencyBadge = (level: number) => {
    switch (level) {
      case 1:
        return {
          bg: 'bg-red-600 text-white border-red-700',
          badge: 'LEVEL 1: CRITICAL / RESUSCITATION',
          desc: 'Immediate Physician Attention Required (< 0 mins)'
        };
      case 2:
        return {
          bg: 'bg-orange-600 text-white border-orange-700',
          badge: 'LEVEL 2: EMERGENT / VERY HIGH PRIORITY',
          desc: 'Immediate Attention within 10-15 mins'
        };
      case 3:
        return {
          bg: 'bg-amber-500 text-white border-amber-600',
          badge: 'LEVEL 3: URGENT EVALUATION',
          desc: 'Assessment within 30 mins'
        };
      case 4:
        return {
          bg: 'bg-emerald-600 text-white border-emerald-700',
          badge: 'LEVEL 4: STANDARD OPD CONSULTATION',
          desc: 'Routine clinic queue'
        };
      default:
        return {
          bg: 'bg-blue-600 text-white border-blue-700',
          badge: 'LEVEL 5: NON-URGENT / REFILL',
          desc: 'Fast-track pharmacy or documentation'
        };
    }
  };

  return (
    <div id="voice-kiosk-container" className="space-y-6">
      {/* Top Welcome / Guidance Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-blue-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                AI Kiosk Active
              </span>
              <span className="text-xs text-blue-200 font-medium">Victoria & Bowring Hospital Public Complex</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              {currentLanguage === 'kn' ? 'ಧ್ವನಿ ಮೂಲಕ ರೋಗಿ ನೋಂದಣಿ & ತುರ್ತು ವರ್ಗೀಕರಣ' : currentLanguage === 'hi' ? 'ध्वनि रोगी पंजीकरण एवं आपातकालीन ट्राइएज' : 'Multilingual Voice Triage & Token Kiosk'}
            </h2>
            <p className="text-blue-100 text-sm mt-1 max-w-2xl">
              {currentLanguage === 'kn'
                ? 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಅಥವಾ ರೋಗಲಕ್ಷಣಗಳನ್ನು ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ. AI ತಕ್ಷಣ ಸರಿಯಾದ ವೈದ್ಯರ ವಿಭಾಗ ಮತ್ತು ಟೋಕನ್ ನೀಡುತ್ತದೆ.'
                : currentLanguage === 'hi'
                ? 'अपनी बीमारी या समस्या अपनी भाषा में बोलकर बताएं। एआई तुरंत सही विभाग व टोकन नंबर जारी करेगा।'
                : 'Speak symptoms naturally in Kannada, Hindi, or English. Gemini AI classifies urgency, assigns doctor room, and issues your queue token instantly.'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-white">ABHA & PM-JAY Integrated</p>
              <p className="text-blue-200">₹0 Paperless Government Triage</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Voice Input & Patient Demographics (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Patient Quick Profile Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Patient Details &amp; Ayushman ID
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Patient Name</label>
                <input
                  id="patient-name-input"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  placeholder="e.g. Karan"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Age &amp; Gender</label>
                <div className="flex gap-2">
                  <input
                    id="patient-age-input"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-20 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="Age"
                  />
                  <select
                    id="patient-gender-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="flex-1 px-2 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Mobile (WhatsApp/SMS)</label>
                <input
                  id="patient-phone-input"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  placeholder="+91 98703 30830"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600 block mb-1">ABHA Health ID (Ayushman Bharat)</label>
                <input
                  id="patient-abha-input"
                  type="text"
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-blue-900 font-medium"
                  placeholder="91-4521-8890-3321"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    id="patient-vulnerable-toggle"
                    type="checkbox"
                    checked={isVulnerable}
                    onChange={(e) => setIsVulnerable(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                    Fast-Track Priority (Infant / Pregnant / Senior 65+)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Big Voice Interaction Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Mic className="w-5 h-5 text-blue-600" />
                {currentLanguage === 'kn' ? 'ರೋಗಲಕ್ಷಣಗಳನ್ನು ಮಾತನಾಡಿ' : currentLanguage === 'hi' ? 'अपनी तकलीफ बोलें' : 'Speak Symptoms or Type'}
              </h3>
              <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                Audio: Kannada / Hindi / English / Kanglish
              </span>
            </div>

            {/* Central Mic Button */}
            <div className="flex flex-col items-center justify-center py-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <button
                id="mic-record-button"
                onClick={toggleRecording}
                className={`relative group w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                  isRecording
                    ? 'bg-red-600 text-white ring-8 ring-red-200 scale-105 animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 ring-4 ring-blue-100'
                }`}
                title={isRecording ? 'Click to Stop Recording' : 'Click to Speak Symptoms'}
              >
                {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                {isRecording && (
                  <span className="absolute -bottom-8 whitespace-nowrap text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    Listening live...
                  </span>
                )}
              </button>

              <p className="text-xs font-semibold text-slate-600 mt-6 text-center max-w-sm">
                {isRecording
                  ? 'Speak now in your natural language. Click mic again when finished.'
                  : 'Tap microphone and speak your symptoms, or select one of the real-world samples below.'}
              </p>
            </div>

            {/* Transcript Textarea */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                <span>Spoken Transcript / Symptom Input:</span>
                {speechTranscript && (
                  <button
                    onClick={() => setSpeechTranscript('')}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>
              <textarea
                id="speech-transcript-textarea"
                rows={3}
                value={speechTranscript}
                onChange={(e) => setSpeechTranscript(e.target.value)}
                placeholder="Spoken symptoms appear here (e.g. 'ಎದೆ ತುಂಬಾ ನೋವು ಬರ್ತಿದೆ, ಉಸಿರಾಟ ಕಷ್ಟ ಆಗ್ತಿದೆ' or 'Severe stomach pain and vomiting since morning')..."
                className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 bg-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Gemini 3.7 Flash Clinical Triage
              </div>

              <button
                id="process-triage-button"
                onClick={() => runTriageProcess()}
                disabled={isProcessing || !speechTranscript.trim()}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    Analyzing Triage Urgency...
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-4 h-4" />
                    Generate Triage Token
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Quick 1-Click Regional Presets */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                1-Click Sample Clinical Scenarios (Try Instantly):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SAMPLE_VOICE_PROMPTS.map((sample) => (
                  <button
                    key={sample.id}
                    id={`sample-prompt-${sample.id}`}
                    onClick={() => handleSelectSamplePrompt(sample)}
                    className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-xs group cursor-pointer"
                  >
                    <div className="font-semibold text-slate-800 group-hover:text-blue-800 flex items-center justify-between">
                      <span>{sample.label.split(':')[0]}</span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {sample.urgencyHint.split('-')[0]}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 line-clamp-1 italic font-serif text-[11px]">
                      "{sample.spokenText}"
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Generated Triage Result & Live Token Ticket (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {triageResult ? (
            <div id="triage-ticket-card" className="bg-white rounded-2xl border-2 border-slate-300 shadow-xl overflow-hidden">
              {/* Header with Urgency Code */}
              {(() => {
                const badge = getUrgencyBadge(triageResult.urgencyLevel);
                return (
                  <div className={`p-4 border-b ${badge.bg}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/20 text-white">
                        {badge.badge}
                      </span>
                      <div className="flex items-center gap-1">
                        {isSpeaking ? (
                          <button
                            onClick={stopSpeaking}
                            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white"
                            title="Mute Audio"
                          >
                            <VolumeX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => speakText(triageResult.nativeLanguageInstructions || triageResult.recommendedAction)}
                            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white"
                            title="Play Native Voice Guidance"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-white/90 font-medium mt-1">{badge.desc}</p>
                  </div>
                );
              })()}

              {/* Big Token Number Callout */}
              <div className="p-6 bg-slate-50 text-center border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Hospital Routing Token
                </span>
                <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight my-2 font-mono">
                  {triageResult.tokenNumber}
                </div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-800 bg-blue-100/80 px-3 py-1 rounded-full border border-blue-200">
                  <Clock className="w-3.5 h-3.5" />
                  Estimated Wait: {triageResult.waitTimeEstimateMinutes === 0 ? 'IMMEDIATE / ZERO WAIT' : `~${triageResult.waitTimeEstimateMinutes} Minutes`}
                </div>
              </div>

              {/* Department & Room Routing Info */}
              <div className="p-5 space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50/70 rounded-xl border border-blue-100">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-blue-900 uppercase">Assigned Department</span>
                    <h4 className="text-base font-bold text-slate-900">{triageResult.primaryDepartment}</h4>
                    <p className="text-xs font-medium text-slate-600 mt-0.5">{triageResult.roomNumber}</p>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Floor: {triageResult.floorWing}</p>
                  </div>
                </div>

                {/* Patient Native Language Audio / Text Instructions */}
                {triageResult.nativeLanguageInstructions && (
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                        ರೋಗಿಗೆ ಸೂಚನೆ / Patient Instructions (Native)
                      </span>
                    </div>
                    <p className="text-sm font-medium text-amber-950 font-serif leading-relaxed">
                      "{triageResult.nativeLanguageInstructions}"
                    </p>
                  </div>
                )}

                {/* Extracted Symptoms & Doctor Triage Note */}
                <div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Extracted Clinical Findings
                  </span>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {triageResult.extractedSymptoms.map((sym, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        {sym}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {triageResult.clinicalSummary}
                  </p>
                </div>

                {/* Recommended Immediate Investigations */}
                {triageResult.testsRecommended && triageResult.testsRecommended.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      Fast-Track Diagnostic Orders
                    </span>
                    <ul className="text-xs text-slate-700 space-y-1">
                      {triageResult.testsRecommended.map((test, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {test}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Patient Identification Card Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Patient: <strong className="text-slate-800">{triageResult.patientInfo.name} ({triageResult.patientInfo.age}Y/{triageResult.patientInfo.gender[0]})</strong></span>
                  <span>ABHA: <strong className="text-blue-700 font-mono">{triageResult.patientInfo.abhaId ? '✓ Linked' : 'Walk-in'}</strong></span>
                </div>

                {/* PDF Download and WhatsApp / SMS Dispatch Actions */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    id="download-patient-summary-pdf-btn"
                    onClick={() => {
                      generatePatientSummaryPdf(triageResult);
                      setDispatchSuccess('Official Patient Triage Summary PDF generated and downloaded!');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-800"
                  >
                    <FileDown className="w-4 h-4 text-teal-400" />
                    <span>Download Patient Summary (PDF)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="send-whatsapp-button"
                      onClick={() => {
                        onSendNotification(triageResult, 'WhatsApp');
                        setDispatchSuccess('WhatsApp ticket dispatched with live queue tracking link!');
                      }}
                      className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Send WhatsApp
                    </button>
                    <button
                      id="send-sms-button"
                      onClick={() => {
                        onSendNotification(triageResult, 'SMS');
                        setDispatchSuccess('SMS Token alert dispatched to registered mobile!');
                      }}
                      className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send SMS Token
                    </button>
                  </div>

                  {dispatchSuccess && (
                    <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200 text-center animate-fade-in">
                      ✓ {dispatchSuccess}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                <Stethoscope className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Token Ticket Preview</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Record your symptoms or tap one of the sample cases. Your structured triage code, doctor room, and token slip will appear here.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-400">
                <Flame className="w-4 h-4 text-orange-500" />
                Powered by Gemini 3.7 Multimodal Vision &amp; Voice
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
