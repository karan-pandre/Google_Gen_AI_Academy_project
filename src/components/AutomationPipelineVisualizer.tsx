import React, { useState } from 'react';
import {
  Workflow,
  Share2,
  Copy,
  CheckCircle2,
  Send,
  Radio,
  FileCode,
  ShieldCheck,
  AlertTriangle,
  Server,
  Mail,
  MessageSquare,
  PhoneCall,
  Play,
  ArrowRight,
  Code2,
  Download,
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AutomatedTransmissionLog, UrgencyLevel } from '../types';

interface AutomationPipelineVisualizerProps {
  currentLanguage: 'kn' | 'hi' | 'en' | 'te' | 'ta';
  sampleTransmission?: AutomatedTransmissionLog | null;
}

export function AutomationPipelineVisualizer({
  currentLanguage,
  sampleTransmission
}: AutomationPipelineVisualizerProps) {
  const [activePlatform, setActivePlatform] = useState<'n8n' | 'make'>('n8n');
  const [activeTab, setActiveTab] = useState<'diagram' | 'workflow_logic' | 'json_export' | 'test_runner'>('diagram');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSimulatingExecution, setIsSimulatingExecution] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<Array<{ step: string; status: 'pending' | 'success' | 'running'; detail: string; timestamp: string }>>([]);

  // Test payload state
  const [testPatientName, setTestPatientName] = useState('Ramesh Kumar');
  const [testUrgencyLevel, setTestUrgencyLevel] = useState<UrgencyLevel>(1);
  const [testDepartment, setTestDepartment] = useState('Cardiology & Emergency Bay');
  const [testComplaint, setTestComplaint] = useState('Sudden onset severe chest pressure radiating to left arm, sweating, SpO2 89%');
  const [testNodalName, setTestNodalName] = useState('Dr. B. R. Manjunath, MD');
  const [testNodalPhone, setTestNodalPhone] = useState('+91 94808 01001');
  const [testNodalEmail, setTestNodalEmail] = useState('cmo.victoria@karnataka.gov.in');

  // n8n JSON Export Definition
  const n8nWorkflowJSON = JSON.stringify({
    name: "JanArogya AI - Emergency Hospital Dispatch Pipeline",
    nodes: [
      {
        parameters: {
          httpMethod: "POST",
          path: "triage-alert",
          responseMode: "onReceived",
          options: {}
        },
        name: "1. Webhook Ingress",
        type: "n8n-nodes-base.webhook",
        typeVersion: 1,
        position: [200, 300]
      },
      {
        parameters: {
          conditions: {
            number: [
              {
                value1: "={{ $json.body.triageData.urgencyLevel }}",
                operation: "smallerEqual",
                value2: 2
              }
            ]
          }
        },
        name: "2. SATS Urgency Switch (Level <= 2?)",
        type: "n8n-nodes-base.if",
        typeVersion: 1,
        position: [440, 300]
      },
      {
        parameters: {
          requestMethod: "POST",
          url: "https://graph.facebook.com/v19.0/PHONE_NUMBER_ID/messages",
          authentication: "genericCredentialType",
          genericAuthType: "httpHeaderAuth",
          jsonParameters: true,
          options: {},
          bodyParametersJson: "={\n  \"messaging_product\": \"whatsapp\",\n  \"to\": \"{{ $json.body.triageData.targetFacility.nodalOfficer.phone }}\",\n  \"type\": \"template\",\n  \"template\": {\n    \"name\": \"hospital_triage_alert_v2\",\n    \"language\": { \"code\": \"en\" },\n    \"components\": [\n      {\n        \"type\": \"body\",\n        \"parameters\": [\n          { \"type\": \"text\", \"text\": \"{{ $json.body.triageData.targetFacility.nodalOfficer.name }}\" },\n          { \"type\": \"text\", \"text\": \"{{ $json.body.triageData.urgencyCategory }}\" },\n          { \"type\": \"text\", \"text\": \"{{ $json.body.triageData.tokenNumber }}\" },\n          { \"type\": \"text\", \"text\": \"{{ $json.body.triageData.departmentRequired }}\" },\n          { \"type\": \"text\", \"text\": \"{{ $json.body.triageData.chiefComplaint }}\" }\n        ]\n      }\n    ]\n  }\n}"
        },
        name: "3a. WhatsApp Cloud API Alert",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 3,
        position: [720, 180]
      },
      {
        parameters: {
          fromEmail: "alerts@janarogya.gov.in",
          toEmail: "={{ $json.body.triageData.targetFacility.nodalOfficer.email }}",
          subject: "=🚨 [AI TRIAGE DISPATCH] {{ $json.body.triageData.urgencyCategory }} - Token #{{ $json.body.triageData.tokenNumber }}",
          html: "=<div style='font-family:Arial,sans-serif;max-width:600px;border:1px solid #e2e8f0;border-radius:8px;padding:20px;'><h2 style='color:#0f766e;'>JanArogya AI Emergency Triage Dispatch</h2><div style='background:#fef2f2;border-left:4px solid #ef4444;padding:12px;margin:15px 0;'><strong>Urgency:</strong> {{ $json.body.triageData.urgencyCategory }}<br/><strong>Token:</strong> {{ $json.body.triageData.tokenNumber }}</div><p><strong>Patient:</strong> {{ $json.body.triageData.patient.name }} ({{ $json.body.triageData.patient.age }}y, {{ $json.body.triageData.patient.gender }})</p><p><strong>Required Dept:</strong> {{ $json.body.triageData.departmentRequired }}</p><p><strong>Clinical Summary:</strong> {{ $json.body.triageData.chiefComplaint }}</p><p><strong>AI Recommendation:</strong> {{ $json.body.triageData.aiClinicalNotes }}</p><hr/><p style='font-size:12px;color:#64748b;'>Auto-generated by Gemini Health Triage Service</p></div>"
        },
        name: "3b. Clinical Email Dispatch Node",
        type: "n8n-nodes-base.emailSend",
        typeVersion: 2,
        position: [720, 360]
      },
      {
        parameters: {
          requestMethod: "POST",
          url: "https://api.twilio.com/2010-04-01/Accounts/ACxxx/Calls.json",
          options: {},
          bodyParametersJson: "={\n  \"To\": \"{{ $json.body.triageData.targetFacility.nodalOfficer.phone }}\",\n  \"From\": \"+918026709901\",\n  \"Twiml\": \"<Response><Say voice='Polly.Aditi'>Emergency alert for {{ $json.body.triageData.targetFacility.nodalOfficer.name }}. Triage Level 1 Patient {{ $json.body.triageData.patient.name }} assigned to {{ $json.body.triageData.departmentRequired }}.</Say></Response>\"\n}"
        },
        name: "3c. IVR Voice Callout (Level 1 Red)",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 3,
        position: [720, 520]
      }
    ],
    connections: {
      "1. Webhook Ingress": {
        main: [[{ node: "2. SATS Urgency Switch (Level <= 2?)", type: "main", index: 0 }]]
      },
      "2. SATS Urgency Switch (Level <= 2?)": {
        main: [
          [
            { node: "3a. WhatsApp Cloud API Alert", type: "main", index: 0 },
            { node: "3b. Clinical Email Dispatch Node", type: "main", index: 0 },
            { node: "3c. IVR Voice Callout (Level 1 Red)", type: "main", index: 0 }
          ],
          [
            { node: "3b. Clinical Email Dispatch Node", type: "main", index: 0 }
          ]
        ]
      }
    }
  }, null, 2);

  // Make.com Blueprint JSON Export Definition
  const makeBlueprintJSON = JSON.stringify({
    name: "JanArogya Gemini Triage to WhatsApp & Email Router",
    flow: [
      {
        id: 1,
        module: "gateway:CustomWebhook",
        metadata: {
          name: "Webhook Ingress (Gemini Triage Trigger)"
        }
      },
      {
        id: 2,
        module: "router:Router",
        routes: [
          {
            name: "High Priority (Level 1 & 2)",
            filter: "1.triageData.urgencyLevel <= 2",
            modules: [
              {
                id: 3,
                module: "whatsapp-business-cloud:SendMessage",
                parameters: {
                  to: "{{1.triageData.targetFacility.nodalOfficer.phone}}",
                  template: "hospital_triage_alert_v2"
                }
              },
              {
                id: 4,
                module: "email:SendEmail",
                parameters: {
                  to: "{{1.triageData.targetFacility.nodalOfficer.email}}",
                  subject: "🚨 [URGENT AI TRIAGE LEVEL {{1.triageData.urgencyLevel}}] - Token #{{1.triageData.tokenNumber}}"
                }
              }
            ]
          },
          {
            name: "Standard OPD Queue (Level 3, 4, 5)",
            filter: "1.triageData.urgencyLevel > 2",
            modules: [
              {
                id: 5,
                module: "email:SendEmail",
                parameters: {
                  to: "{{1.triageData.targetFacility.nodalOfficer.email}}",
                  subject: "📋 [OPD ROUTINE DISPATCH] Token #{{1.triageData.tokenNumber}}"
                }
              }
            ]
          }
        ]
      }
    ]
  }, null, 2);

  const handleCopyJSON = () => {
    const code = activePlatform === 'n8n' ? n8nWorkflowJSON : makeBlueprintJSON;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadJSON = () => {
    const code = activePlatform === 'n8n' ? n8nWorkflowJSON : makeBlueprintJSON;
    const filename = activePlatform === 'n8n' ? 'janarogya-n8n-workflow.json' : 'janarogya-make-blueprint.json';
    const blob = new Blob([code], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const runLiveSimulation = async () => {
    setIsSimulatingExecution(true);
    setExecutionLogs([]);

    const steps = [
      {
        step: '1. Ingress Webhook Trigger',
        detail: `HMAC SHA-256 Verified. Payload unpacked from Gemini Engine. Event ID: evt_${Math.random().toString(36).substring(2, 9)}`,
        delay: 500
      },
      {
        step: '2. Nodal Officer Resolution',
        detail: `Resolved Contact: ${testNodalName} | Phone: ${testNodalPhone} | Inbox: ${testNodalEmail}`,
        delay: 600
      },
      {
        step: '3. Urgency Rule Engine',
        detail: `Urgency Level evaluated: Level ${testUrgencyLevel} (${testUrgencyLevel <= 2 ? 'CRITICAL ESCALATION PATH' : 'STANDARD OPD ROUTE'})`,
        delay: 500
      },
      {
        step: '4. WhatsApp Cloud API Dispatch',
        detail: `Template 'hospital_triage_alert_v2' sent to ${testNodalPhone} (Message ID: wamid.HBgL...9801) - Delivered`,
        delay: 700
      },
      {
        step: '5. Institutional Email Notification',
        detail: `Sent HTML Clinical Dossier to ${testNodalEmail} (SMTP 250 OK - Queued)`,
        delay: 600
      }
    ];

    if (testUrgencyLevel === 1) {
      steps.push({
        step: '6. Outbound IVR Neural Voice Alert',
        detail: `Synthesized emergency call placed to ${testNodalPhone} (Twilio Call SID: CA489... Completed 18s)`,
        delay: 800
      });
    }

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, steps[i].delay));
      setExecutionLogs((prev) => [
        ...prev,
        {
          step: steps[i].step,
          status: 'success',
          detail: steps[i].detail,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }
      ]);
    }

    setIsSimulatingExecution(false);
  };

  return (
    <div id="automation-workflow-architecture-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <Workflow className="w-3.5 h-3.5 text-indigo-400" />
                Integration Architecture
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                n8n &amp; Make.com Compatible
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Hospital Admin Notification Automation Engine
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Automated workflow pipeline triggering real-time WhatsApp interactive templates, emergency email dossiers, and automated IVR voice alerts to hospital superintendents when Gemini AI generates a triage token.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Platform Selector Switch */}
            <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center">
              <button
                id="btn-switch-n8n"
                onClick={() => setActivePlatform('n8n')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activePlatform === 'n8n'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                n8n Workflow
              </button>
              <button
                id="btn-switch-make"
                onClick={() => setActivePlatform('make')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activePlatform === 'make'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Make.com (Integromat)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('diagram')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'diagram'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-400" />
          Technical Architecture Diagram
        </button>
        <button
          onClick={() => setActiveTab('workflow_logic')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'workflow_logic'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Workflow className="w-4 h-4 text-indigo-400" />
          Step-by-Step Logic &amp; Routing Rules
        </button>
        <button
          onClick={() => setActiveTab('json_export')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'json_export'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCode className="w-4 h-4 text-indigo-400" />
          JSON Workflow Blueprint Export
        </button>
        <button
          onClick={() => setActiveTab('test_runner')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'test_runner'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
          }`}
        >
          <Play className="w-4 h-4 text-emerald-400" />
          Live Test Dispatch Runner
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. ARCHITECTURE DIAGRAM TAB */}
      {/* ========================================================================= */}
      {activeTab === 'diagram' && (
        <div id="architecture-diagram-view" className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-600" />
              End-to-End System Integration Flow
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When a citizen or kiosk captures audio or symptoms, the Gemini API extracts the SATS urgency score and emits a signed webhook event. The {activePlatform.toUpperCase()} engine intercepts the payload, resolves on-duty staff, and orchestrates multi-channel notifications.
            </p>

            {/* Visual Node Diagram */}
            <div className="bg-slate-950 rounded-2xl p-6 text-white border border-slate-800 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Node 1: Gemini Engine */}
                <div className="bg-slate-900 border border-indigo-500/40 rounded-xl p-4 space-y-2 relative shadow-lg">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <h4 className="font-bold text-sm text-white">Gemini Triage Engine</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Processes audio / symptoms, outputs structured SATS score (Level 1-5), chief complaint, and assigned OPD token.
                  </p>
                  <div className="pt-2 text-[10px] text-indigo-300 font-mono">
                    POST /webhook/triage-alert
                  </div>
                </div>

                {/* Node 2: Webhook Ingress & Auth */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-2 relative shadow-lg">
                  <div className="w-8 h-8 rounded-lg bg-teal-600/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h4 className="font-bold text-sm text-white">{activePlatform.toUpperCase()} Ingress Node</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Validates HMAC SHA-256 signature, sanitizes patient demographics, and prevents duplicate deliveries via cache key.
                  </p>
                  <div className="pt-2 text-[10px] text-teal-300 font-mono">
                    HMAC Verified (200 OK)
                  </div>
                </div>

                {/* Node 3: Urgency Router */}
                <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-4 space-y-2 relative shadow-lg">
                  <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <h4 className="font-bold text-sm text-white">Urgency Filter &amp; Router</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Evaluates urgency grade. Red/Orange (Level 1-2) triggers emergency escalation. Green/Yellow routes to standard OPD queue.
                  </p>
                  <div className="pt-2 text-[10px] text-amber-300 font-mono">
                    Branch: Critical vs Routine
                  </div>
                </div>

                {/* Node 4: Multi-Channel Dispatch */}
                <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-4 space-y-2 relative shadow-lg">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                    04
                  </div>
                  <h4 className="font-bold text-sm text-white">Multi-Channel Delivery</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Simultaneous WhatsApp template, HTML email dossier, and IVR emergency phone broadcast to the Medical Superintendent.
                  </p>
                  <div className="pt-2 text-[10px] text-emerald-300 font-mono">
                    WhatsApp + Email + IVR
                  </div>
                </div>
              </div>

              {/* Delivery Nodes Preview */}
              <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-emerald-200">WhatsApp Cloud API</div>
                    <div className="text-[11px] text-slate-400">Interactive quick-reply buttons with 1-click ICU prep</div>
                  </div>
                </div>
                <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <div className="font-bold text-blue-200">Institutional Email (SES/SendGrid)</div>
                    <div className="text-[11px] text-slate-400">Detailed clinical dossier with ABHA token verification</div>
                  </div>
                </div>
                <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl flex items-center gap-3">
                  <PhoneCall className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <div className="font-bold text-red-200">Outbound Voice Alert (Level 1)</div>
                    <div className="text-[11px] text-slate-400">Automated IVR callout to Duty Superintendent</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. WORKFLOW LOGIC & RULES TAB */}
      {/* ========================================================================= */}
      {activeTab === 'workflow_logic' && (
        <div id="workflow-logic-view" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Logic Step 1 & 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-slate-900 text-sm">Ingress Contract &amp; Security Validation</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The automation receiver validates incoming webhooks against the platform’s shared secret using HMAC SHA-256 header signatures. It immediately responds with HTTP 200 to satisfy timeout requirements while asynchronously executing downstream nodes.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800">
                <div><strong>Header:</strong> X-JanArogya-Signature: sha256=...</div>
                <div><strong>Auth:</strong> Bearer &lt;INTEGRATION_TOKEN&gt;</div>
                <div><strong>Deduplication:</strong> transmissionId</div>
              </div>
            </div>

            {/* Logic Step 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-slate-900 text-sm">SATS Urgency Routing Switch</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The decision matrix segregates patients based on clinical risk:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-900">
                  <strong>🔴 Level 1 (Red) &amp; 🟠 Level 2 (Orange):</strong> Immediate emergency dispatch across WhatsApp + Email + Outbound Neural IVR Phone Call within 3 seconds.
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <strong>🟡 Level 3 (Yellow) &amp; 🟢 Level 4/5 (Green):</strong> Standard OPD routing to departmental dashboard &amp; summary email within 15 seconds.
                </div>
              </div>
            </div>

            {/* Logic Step 4: WhatsApp Template Spec */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="font-bold text-slate-900 text-sm">Meta WhatsApp Cloud API Specification</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Uses the pre-approved institutional template <code>hospital_triage_alert_v2</code> with dynamic variables for Doctor Name, Urgency Badge, Token ID, and Patient Summary.
              </p>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                <div className="font-bold text-emerald-900">Interactive Action Buttons:</div>
                <div className="text-emerald-800 text-[11px]">• [Acknowledge &amp; Ready] - Calls back webhook with Doctor ID</div>
                <div className="text-emerald-800 text-[11px]">• [Direct Bed Reservation] - Pings casualty nursing desk</div>
                <div className="text-emerald-800 text-[11px]">• [View Full Dossier] - Deep link to verified clinical record</div>
              </div>
            </div>

            {/* Logic Step 5: Two-Way Acknowledgment */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h3 className="font-bold text-slate-900 text-sm">Two-Way Acknowledgment Loop</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                When the Medical Superintendent clicks "Acknowledge" on WhatsApp or opens the email link, a return webhook updates the central queue status from <code>DISPATCHED</code> to <code>ACKNOWLEDGED</code> and dispatches a confirmation SMS back to the patient.
              </p>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 font-mono text-[11px]">
                PUT /api/triage/acknowledge &#123; tokenId, doctorId, status: "ACKNOWLEDGED" &#125;
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. JSON EXPORT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'json_export' && (
        <div id="json-export-view" className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-indigo-600" />
                  {activePlatform === 'n8n' ? 'n8n Workflow JSON Export' : 'Make.com Scenario Blueprint'}
                </h3>
                <p className="text-xs text-slate-500">
                  Ready to copy and paste directly into your {activePlatform.toUpperCase()} canvas.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJSON}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied!' : 'Copy Blueprint'}
                </button>
                <button
                  onClick={handleDownloadJSON}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download JSON
                </button>
              </div>
            </div>

            <div className="relative">
              <pre className="bg-slate-950 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96 border border-slate-800 scrollbar-thin">
                {activePlatform === 'n8n' ? n8nWorkflowJSON : makeBlueprintJSON}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. LIVE TEST RUNNER TAB */}
      {/* ========================================================================= */}
      {activeTab === 'test_runner' && (
        <div id="live-test-runner-view" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Test Form Controls */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Simulate Triage Webhook Trigger
              </h3>
              <p className="text-xs text-slate-500">
                Trigger a simulated payload as generated by the Gemini Triage API to test the routing logic and notification execution.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={testPatientName}
                    onChange={(e) => setTestPatientName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">SATS Urgency Level</label>
                  <select
                    value={testUrgencyLevel}
                    onChange={(e) => setTestUrgencyLevel(Number(e.target.value) as UrgencyLevel)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value={1}>🔴 Level 1 - Immediate Resuscitation (Red)</option>
                    <option value={2}>🟠 Level 2 - Emergent / Priority (Orange)</option>
                    <option value={3}>🟡 Level 3 - Urgent Evaluation (Yellow)</option>
                    <option value={4}>🟢 Level 4 - Routine OPD (Green)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Chief Complaint</label>
                  <textarea
                    rows={2}
                    value={testComplaint}
                    onChange={(e) => setTestComplaint(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <div className="font-bold text-slate-700">Target Hospital Admin / Contact</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500">Phone</label>
                      <input
                        type="text"
                        value={testNodalPhone}
                        onChange={(e) => setTestNodalPhone(e.target.value)}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Email</label>
                      <input
                        type="text"
                        value={testNodalEmail}
                        onChange={(e) => setTestNodalEmail(e.target.value)}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={runLiveSimulation}
                  disabled={isSimulatingExecution}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  {isSimulatingExecution ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      Executing Pipeline Nodes...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-emerald-400" />
                      Run Pipeline Simulation
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Live Execution Stream */}
            <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 text-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isSimulatingExecution ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                  <h4 className="font-bold text-sm font-mono text-slate-200">Execution Console</h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  Engine: {activePlatform.toUpperCase()} Live Testbed
                </span>
              </div>

              {executionLogs.length > 0 ? (
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2 scrollbar-thin">
                  {executionLogs.map((log, index) => (
                    <div key={index} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          {log.step}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-mono leading-relaxed pl-5">
                        {log.detail}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <Radio className="w-8 h-8 mx-auto text-slate-700" />
                  <p className="text-xs">Click "Run Pipeline Simulation" to watch real-time node routing execution.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
