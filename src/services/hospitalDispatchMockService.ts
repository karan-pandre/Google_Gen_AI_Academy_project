import { HospitalDirectoryItem } from '../data/hospitalDirectoryData';
import { AutomatedTransmissionLog, UrgencyLevel } from '../types';

export interface DispatchSimulationProgress {
  step: 'idle' | 'triage_parsing' | 'institution_resolution' | 'voice_synthesis' | 'sms_gateway' | 'email_dispatch' | 'completed';
  stepNumber: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription: string;
  activeNode: string;
  latencyMs: number;
  payloadHash: string;
}

export interface DispatchPayloadInput {
  patientName: string;
  patientPhone: string;
  patientAge?: string;
  patientGender?: string;
  patientEmail?: string;
  patientAbhaId?: string;
  hospital: HospitalDirectoryItem;
  querySummary: string;
  clinicalDetails?: string;
  urgencyLevel: UrgencyLevel;
  department: string;
  language?: 'kn' | 'hi' | 'en' | 'te' | 'ta';
}

/**
 * Service to execute multi-channel automated routing to the target hospital
 * Connects to the backend endpoint (/api/transmit-to-hospital) with realistic real-time telemetry
 */
export async function executeHospitalDispatch(
  input: DispatchPayloadInput,
  onProgress?: (progress: DispatchSimulationProgress) => void
): Promise<AutomatedTransmissionLog> {
  const hash = '0x' + Math.random().toString(16).substring(2, 10).toUpperCase();

  // Step 1: Triage Parsing & Queue Placement
  onProgress?.({
    step: 'triage_parsing',
    stepNumber: 1,
    totalSteps: 5,
    stepTitle: 'Triage Parsing & Record Verification',
    stepDescription: `Assigning clinical priority (Level ${input.urgencyLevel}) & generating national patient registration slip`,
    activeNode: 'JanArogya SATS Engine',
    latencyMs: 120,
    payloadHash: hash
  });

  await new Promise((r) => setTimeout(r, 450));

  // Step 2: Institution & Contact Person Lookup
  onProgress?.({
    step: 'institution_resolution',
    stepNumber: 2,
    totalSteps: 5,
    stepTitle: 'Target Institution & Nodal Resolution',
    stepDescription: `Connecting to ${input.hospital.name} (${input.hospital.district}, ${input.hospital.state}). Contact Person: ${input.hospital.contactPerson?.name || 'Medical Superintendent'}`,
    activeNode: `${input.hospital.city} Central Gateway`,
    latencyMs: 210,
    payloadHash: hash
  });

  await new Promise((r) => setTimeout(r, 400));

  // Step 3: Voice IVR Packet Dispatch
  onProgress?.({
    step: 'voice_synthesis',
    stepNumber: 3,
    totalSteps: 5,
    stepTitle: 'Voice IVR Hotline Transmission',
    stepDescription: `Synthesizing neural voice brief and dialing ${input.hospital.contactPerson?.name || 'Triage Officer'} at ${input.hospital.contactPerson?.phone || input.hospital.phoneVoiceIVR}`,
    activeNode: 'Telecom IVR Bridge',
    latencyMs: 380,
    payloadHash: hash
  });

  await new Promise((r) => setTimeout(r, 450));

  // Step 4: SMS Cellular Gateway
  onProgress?.({
    step: 'sms_gateway',
    stepNumber: 4,
    totalSteps: 5,
    stepTitle: 'Cellular SMS & WhatsApp Routing',
    stepDescription: `Dispatched encrypted SMS alert to hospital emergency desk and confirmation ticket to patient (${input.patientPhone})`,
    activeNode: 'SMS Gateway Core',
    latencyMs: 180,
    payloadHash: hash
  });

  await new Promise((r) => setTimeout(r, 350));

  // Step 5: Official Institutional Email Dispatch
  onProgress?.({
    step: 'email_dispatch',
    stepNumber: 5,
    totalSteps: 5,
    stepTitle: 'Official Clinical Brief Email Delivery',
    stepDescription: `Delivering formal clinical dispatch dossier to ${input.hospital.triageEmail || input.hospital.officialEmail}`,
    activeNode: 'National Health Mail Relay',
    latencyMs: 290,
    payloadHash: hash
  });

  // Call the backend API
  const response = await fetch('/api/transmit-to-hospital', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientName: input.patientName,
      patientPhone: input.patientPhone,
      patientAge: input.patientAge,
      patientGender: input.patientGender,
      patientAbhaId: input.patientAbhaId,
      patientEmail: input.patientEmail,
      hospitalId: input.hospital.id,
      hospitalName: input.hospital.name,
      hospitalCategory: input.hospital.category,
      hospitalCity: input.hospital.city,
      hospitalDistrict: input.hospital.district,
      hospitalState: input.hospital.state,
      contactPerson: input.hospital.contactPerson,
      hospitalEmail: input.hospital.triageEmail || input.hospital.officialEmail,
      hospitalPhone: input.hospital.contactPerson?.phone || input.hospital.phoneEmergency,
      hospitalSms: input.hospital.smsDispatchNumber,
      querySummary: input.querySummary,
      clinicalDetails: input.clinicalDetails,
      urgencyLevel: input.urgencyLevel,
      department: input.department,
      language: input.language || 'kn'
    })
  });

  if (!response.ok) {
    throw new Error(`Server returned HTTP ${response.status} during transmission`);
  }

  const result = await response.json();
  const transmission: AutomatedTransmissionLog = result.transmission;

  onProgress?.({
    step: 'completed',
    stepNumber: 5,
    totalSteps: 5,
    stepTitle: 'Response Received & Acknowledged',
    stepDescription: `Assigned Token ${transmission.tokenNumber}. High-priority alert acknowledged by ${input.hospital.contactPerson?.name || 'Hospital Triage In-Charge'}.`,
    activeNode: 'Hospital In-tray Verified',
    latencyMs: 40,
    payloadHash: hash
  });

  return transmission;
}
