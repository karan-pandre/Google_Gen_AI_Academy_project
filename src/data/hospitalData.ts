import { HospitalDepartment, HospitalLiveStats } from '../types';

export const INITIAL_DEPARTMENTS: HospitalDepartment[] = [
  {
    id: 'emg',
    name: 'Trauma & Emergency Care',
    nameKannada: 'ತುರ್ತು ಚಿಕಿತ್ಸಾ ವಿಭಾಗ',
    nameHindi: 'आपातकालीन चिकित्सा विभाग',
    code: 'EMG',
    activeDoctor: 'Dr. Anand Rao (Trauma Chief)',
    currentToken: 'EMG-108',
    totalWaiting: 3,
    avgWaitMins: 0,
    room: 'Room 001 - Ground Floor (Red Bay)',
    floor: 'Ground Floor, North Gate',
    zone: 'Red Zone',
    status: 'Critical'
  },
  {
    id: 'gen-med',
    name: 'General Medicine OPD',
    nameKannada: 'ಸಾಮಾನ್ಯ ವೈದ್ಯಕೀಯ ವಿಭಾಗ',
    nameHindi: 'सामान्य चिकित्सा ओपीडी',
    code: 'MED',
    activeDoctor: 'Dr. Meenakshi S. & Dr. Praveen K.',
    currentToken: 'MED-214',
    totalWaiting: 18,
    avgWaitMins: 15,
    room: 'Rooms 104-106, 1st Floor',
    floor: '1st Floor, Block A',
    zone: 'Green Zone',
    status: 'Crowded'
  },
  {
    id: 'cardio',
    name: 'Cardiology & Chest Clinic',
    nameKannada: 'ಹೃದ್ರೋಗ ವಿಭಾಗ',
    nameHindi: 'हृदय रोग विभाग',
    code: 'CARD',
    activeDoctor: 'Dr. Ramesh Babu (Senior Cardiologist)',
    currentToken: 'CARD-049',
    totalWaiting: 7,
    avgWaitMins: 20,
    room: 'Room 202, ECG & Echo Unit',
    floor: '2nd Floor, Cardiac Wing',
    zone: 'Yellow Zone',
    status: 'Active'
  },
  {
    id: 'ortho',
    name: 'Orthopedics & Fracture Clinic',
    nameKannada: 'ಮೂಳೆ ಮತ್ತು ಕೀಲು ರೋಗ ವಿಭಾಗ',
    nameHindi: 'हड्डी एवं जोड़ रोग विभाग',
    code: 'ORTH',
    activeDoctor: 'Dr. Shivakumar Gowda',
    currentToken: 'ORTH-088',
    totalWaiting: 12,
    avgWaitMins: 25,
    room: 'Room 112, Plaster Room Adjacent',
    floor: '1st Floor, Ortho Block',
    zone: 'Yellow Zone',
    status: 'Active'
  },
  {
    id: 'ped',
    name: 'Pediatrics & Child Health',
    nameKannada: 'ಮಕ್ಕಳ ಆರೋಗ್ಯ ವಿಭಾಗ',
    nameHindi: 'बाल रोग एवं शिशु स्वास्थ्य',
    code: 'PED',
    activeDoctor: 'Dr. Sowmya Narayanan',
    currentToken: 'PED-062',
    totalWaiting: 9,
    avgWaitMins: 12,
    room: 'Room 108, Child Friendly OPD',
    floor: '1st Floor, Maternal Wing',
    zone: 'Green Zone',
    status: 'Active'
  },
  {
    id: 'obgyn',
    name: 'Obstetrics & Gynecology (Maternity)',
    nameKannada: 'ಪ್ರಸೂತಿ ಮತ್ತು ಸ್ತ್ರೀರೋಗ ವಿಭಾಗ',
    nameHindi: 'प्रसूति एवं स्त्री रोग विभाग',
    code: 'OBG',
    activeDoctor: 'Dr. Deepa Hegde',
    currentToken: 'OBG-077',
    totalWaiting: 14,
    avgWaitMins: 18,
    room: 'Room 118, ANC & Ultrasound',
    floor: '1st Floor, Vanivilas Block',
    zone: 'Green Zone',
    status: 'Active'
  },
  {
    id: 'pulm',
    name: 'Pulmonology (Respiratory & TB)',
    nameKannada: 'ಶ್ವಾಸಕೋಶ ತಜ್ಞರ ವಿಭಾಗ',
    nameHindi: 'श्वसन एवं फेफड़ा रोग विभाग',
    code: 'PULM',
    activeDoctor: 'Dr. Harish Kumar',
    currentToken: 'PULM-035',
    totalWaiting: 6,
    avgWaitMins: 15,
    room: 'Room 210, Spirometry Lab',
    floor: '2nd Floor, Respiratory Block',
    zone: 'Yellow Zone',
    status: 'Active'
  },
  {
    id: 'ophth',
    name: 'Ophthalmology (Eye Clinic)',
    nameKannada: 'ನೇತ್ರ ಚಿಕಿತ್ಸಾ ವಿಭಾಗ',
    nameHindi: 'नेत्र रोग विभाग',
    code: 'EYE',
    activeDoctor: 'Dr. Vijaya Lakshmi',
    currentToken: 'EYE-051',
    totalWaiting: 8,
    avgWaitMins: 10,
    room: 'Room 302, Refraction Wing',
    floor: '3rd Floor, Eye Care Center',
    zone: 'Blue Zone',
    status: 'Active'
  },
  {
    id: 'jan-aushadhi',
    name: 'Pradhan Mantri Jan Aushadhi Generic Pharmacy',
    nameKannada: 'ಜನೌಷಧಿ ಕೇಂದ್ರ (ಉಚಿತ ಔಷಧ)',
    nameHindi: 'प्रधानमंत्री जन औषधि केंद्र',
    code: 'PHARM',
    activeDoctor: 'Pharmacist Basavaraj',
    currentToken: 'RX-340',
    totalWaiting: 22,
    avgWaitMins: 8,
    room: 'Counter 1 to 4, Pharmacy Block',
    floor: 'Ground Floor, Near Exit Gate',
    zone: 'Green Zone',
    status: 'Active'
  }
];

export const INITIAL_HOSPITAL_STATS: HospitalLiveStats = {
  hospitalName: 'Victoria & Bowring Hospital Public Medical Complex',
  location: 'K.R. Market / Shivajinagar, Bengaluru, Karnataka',
  emergencyBeds: {
    total: 48,
    occupied: 39,
    icuAvailable: 4,
    oxygenBaysFree: 9,
    ventilatorsAvailable: 3
  },
  queueSummary: {
    totalTokensIssuedToday: 642,
    emergencyTriageCount: 38,
    opdConsultationsDone: 485,
    averageTriageSpeedSecs: 4.2
  },
  genericMedicineStockRatio: 96
};

// Preset voice queries in regional languages
export const SAMPLE_VOICE_PROMPTS = [
  {
    id: 'voice-kn-1',
    language: 'kn',
    label: 'Kannada: Sudden severe chest pain & breathing difficulty',
    spokenText: 'ನನಗೆ ಎದೆ ತುಂಬಾ ನೋವು ಬರ್ತಿದೆ, ಎಡಗೈ ನೊವ್ತಿದೆ ಮತ್ತೆ ಉಸಿರಾಟ ಕಷ್ಟ ಆಗ್ತಿದೆ. ಬೆವರು ಸುರಿತಿದೆ.',
    translatedText: 'Severe chest pain radiating to left arm with shortness of breath and profuse sweating.',
    urgencyHint: 'Level 1 - Immediate Emergency Cardiac'
  },
  {
    id: 'voice-kn-2',
    language: 'kn',
    label: 'Kannada: 3 days high fever, joint pain, child weak',
    spokenText: 'ನನ್ನ ಮಗುವಿಗೆ 3 ದಿನದಿಂದ ತುಂಬಾ ಜ್ವರ ಇದೆ, ಮೈಕೈ ನೋವು ಮತ್ತೆ ವಾಂತಿ ಮಾಡ್ತಿದ್ದಾನೆ. ಊಟ ಮಾಡ್ತಿಲ್ಲ.',
    translatedText: 'Child has high fever for 3 days, body ache, vomiting, refusing food.',
    urgencyHint: 'Level 3 - Urgent Pediatrics OPD'
  },
  {
    id: 'voice-hi-1',
    language: 'hi',
    label: 'Hindi: Severe abdominal pain & vomiting',
    spokenText: 'पेट में बहुत तेज दर्द है और सुबह से 4 बार उल्टी हुई है। चक्कर आ रहा है और खड़ा नहीं हुआ जा रहा।',
    translatedText: 'Acute severe abdominal pain with 4 episodes of vomiting since morning, dizziness, unable to stand.',
    urgencyHint: 'Level 2 - Emergent Acute Abdomen'
  },
  {
    id: 'voice-en-1',
    language: 'en',
    label: 'English / Kanglish: Broken wrist after slip in market',
    spokenText: 'Market alli slip aagi bidde, right wrist full ಊತ್ಕೊಂಡಿದೆ and extreme pain. Can not move fingers.',
    translatedText: 'Slipped in market, severe right wrist swelling and pain, inability to move fingers. Suspected fracture.',
    urgencyHint: 'Level 3 - Urgent Orthopedics & X-Ray'
  },
  {
    id: 'voice-hi-2',
    language: 'hi',
    label: 'Hindi: Routine BP & Diabetes medicine refill (ABHA)',
    spokenText: 'डायबिटीज और बीपी की दवाइयां खत्म हो गई हैं। आयुष्मान भारत कार्ड है, डॉक्टर का नया पर्चा चाहिए।',
    translatedText: 'Routine hypertension and diabetes medication refill needed under Ayushman Bharat scheme.',
    urgencyHint: 'Level 4 - Routine Medicine OPD / Jan Aushadhi'
  }
];

// Sample preset images generated via data URI / SVGs for instant 1-click testing
export const SAMPLE_DOCUMENT_PRESETS = [
  {
    id: 'rx-handwritten',
    name: 'Government Hospital Handwritten Rx Slip',
    type: 'PRESCRIPTION',
    description: 'Dr. S. K. Murthy (MD Med) prescription slip with Rx Metformin, Telmisartan, Paracetamol and CBC/FBS orders.',
    sampleDetails: {
      patientName: 'Mallikarjun Patil',
      age: '54',
      gender: 'Male',
      docType: 'PRESCRIPTION'
    }
  },
  {
    id: 'abha-pmjay',
    name: 'Ayushman Bharat ABHA Health Card (PM-JAY)',
    type: 'ABHA_CARD',
    description: 'Government National Health Authority ABHA ID Card with 14-digit Health ID and PM-JAY ₹5 Lakh benefit seal.',
    sampleDetails: {
      patientName: 'Sunita Devi',
      age: '42',
      gender: 'Female',
      abhaId: '91-4521-8890-3321',
      docType: 'ABHA_CARD'
    }
  },
  {
    id: 'lab-blood-report',
    name: 'Complete Blood Count (CBC) & HbA1c Lab Report',
    type: 'LAB_REPORT',
    description: 'Government Central Pathology Lab results showing Platelet count 45,000 (Critical Low) and Hb 8.4 g/dL.',
    sampleDetails: {
      patientName: 'Ramesh Kumar',
      age: '38',
      gender: 'Male',
      docType: 'LAB_REPORT'
    }
  }
];
