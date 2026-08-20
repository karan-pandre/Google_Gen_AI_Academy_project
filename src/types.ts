export type UrgencyLevel = 1 | 2 | 3 | 4 | 5;

export type TriageCategory = 'EMERGENCY' | 'PRIORITY' | 'ROUTINE_OPD' | 'PHARMACY_REFILL' | 'DIAGNOSTICS';

export interface PatientInfo {
  name: string;
  age: string;
  gender: string;
  phone: string;
  abhaId?: string;
  language: 'kn' | 'hi' | 'en' | 'te' | 'ta';
  isVulnerable?: boolean; // Pregnant, senior citizen, infant
}

export interface TriageResult {
  id: string;
  urgencyLevel: UrgencyLevel; // 1: Red (Immediate Resuscitation), 2: Orange (Emergent <15m), 3: Yellow (Urgent <30m), 4: Green (Standard OPD), 5: Blue (Non-urgent)
  urgencyLabel: string;
  urgencyColor: 'red' | 'amber' | 'yellow' | 'emerald' | 'blue';
  triageCategory: TriageCategory;
  primaryDepartment: string;
  departmentCode: string;
  roomNumber: string;
  floorWing: string;
  tokenNumber: string;
  waitTimeEstimateMinutes: number;
  extractedSymptoms: string[];
  clinicalSummary: string;
  recommendedAction: string;
  nativeLanguageInstructions: string;
  originalLanguageInput?: string;
  warningSigns: string[];
  testsRecommended: string[];
  fastTrackEligible: boolean;
  abhaLinked: boolean;
  timestamp: string;
  patientInfo: PatientInfo;
}

export interface MedicationItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  isGenericAvailable?: boolean;
}

export interface LabTestItem {
  testName: string;
  resultValue?: string;
  normalRange?: string;
  status?: 'Normal' | 'Abnormal' | 'Critical';
}

export interface DocumentParseResult {
  docType: 'PRESCRIPTION' | 'ABHA_CARD' | 'LAB_REPORT' | 'DISCHARGE_SUMMARY' | 'UNKNOWN';
  patientName?: string;
  age?: string;
  gender?: string;
  abhaId?: string;
  doctorName?: string;
  hospitalName?: string;
  date?: string;
  transcribedText: string;
  diagnosis: string[];
  medications: MedicationItem[];
  labTests: LabTestItem[];
  keyFindings: string[];
  suggestedNextStep: string;
  urgencyLevel: UrgencyLevel;
  departmentRecommendation: string;
  confidenceScore: number;
}

export interface HospitalDepartment {
  id: string;
  name: string;
  nameKannada: string;
  nameHindi: string;
  code: string;
  activeDoctor: string;
  currentToken: string;
  totalWaiting: number;
  avgWaitMins: number;
  room: string;
  floor: string;
  zone: 'Red Zone' | 'Yellow Zone' | 'Green Zone' | 'Blue Zone';
  status: 'Active' | 'Crowded' | 'Critical' | 'Closed';
}

export interface HospitalLiveStats {
  hospitalName: string;
  location: string;
  emergencyBeds: {
    total: number;
    occupied: number;
    icuAvailable: number;
    oxygenBaysFree: number;
    ventilatorsAvailable: number;
  };
  queueSummary: {
    totalTokensIssuedToday: number;
    emergencyTriageCount: number;
    opdConsultationsDone: number;
    averageTriageSpeedSecs: number;
  };
  genericMedicineStockRatio: number; // e.g. 94%
}

export interface DispatchNotification {
  id: string;
  patientName: string;
  phone: string;
  channel: 'WhatsApp' | 'SMS';
  tokenNumber: string;
  department: string;
  room: string;
  messageText: string;
  timestamp: string;
  status: 'Sent' | 'Delivered' | 'Read';
}

export interface HospitalContactPerson {
  name: string;
  designation: string;
  phone: string;
  email: string;
  dutyStatus?: string;
  department?: string;
}

export interface AutomatedTransmissionLog {
  id: string;
  tokenNumber: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge?: string;
  patientGender?: string;
  patientAbhaId?: string;
  hospitalId: string;
  hospitalName: string;
  hospitalCategory: string;
  hospitalCity: string;
  hospitalDistrict?: string;
  hospitalState: string;
  contactPerson?: HospitalContactPerson;
  querySummary: string;
  urgencyLevel: UrgencyLevel;
  department: string;
  timestamp: string;
  date: string;
  appointmentSlot: string;
  channels: {
    voiceCall: {
      status: 'Connecting' | 'Dialed' | 'Audio Delivered' | 'Acknowledged';
      targetNumber: string;
      ivrSynthesizedText: string;
      durationSecs: number;
      timestamp: string;
    };
    smsDispatch: {
      status: 'Sent' | 'Delivered' | 'Pending';
      targetNumber: string;
      body: string;
      timestamp: string;
    };
    emailDispatch: {
      status: 'Dispatched' | 'Delivered' | 'Pending';
      targetEmail: string;
      subject: string;
      clinicalBrief: string;
      timestamp: string;
    };
  };
  patientReceipt?: {
    confirmationStatus: string;
    smsDeliveredToPatient: {
      status: string;
      targetPhone: string;
      body: string;
      timestamp: string;
    };
    emailDeliveredToPatient: {
      status: string;
      targetEmail: string;
      subject: string;
      body: string;
      timestamp: string;
    };
    voiceCallToPatient: {
      status: string;
      targetPhone: string;
      audioText: string;
      timestamp: string;
    };
  };
}

export interface AcademyModule {
  id: string;
  moduleNumber: number;
  title: string;
  category: string;
  durationMinutes: number;
  progressPercent: number;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  xpPoints: number;
  skills: string[];
  submissionDeadline?: string;
  checklistItems: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}

