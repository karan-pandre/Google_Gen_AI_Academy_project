import { NavigationItem } from '../types/navigation';

export const PRIMARY_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'triage',
    label: 'AI Triage Desk',
    labelTranslation: {
      en: 'AI Triage Desk',
      kn: 'ಎಐ ಟ್ರಯೇಜ್ ಕಿಯೋಸ್ಕ್',
      hi: 'एआई ट्राइएज डेस्क',
      te: 'AI ట్రయేజ్ డెస్క్',
      ta: 'AI ட்ரையேஜ் மேசை'
    },
    path: '#triage',
    iconName: 'Activity',
    shortcut: '1',
    category: 'primary',
    description: 'Multilingual symptom assessment, speech parsing & emergency SATS scoring',
    children: [
      {
        id: 'voice-triage',
        label: 'Live Voice Intake',
        description: 'Instant speech-to-clinical transcription in 5 Indian languages',
        path: '#triage',
        iconName: 'Mic'
      },
      {
        id: 'vital-signs',
        label: 'Vitals & Urgency Grader',
        description: 'Automatic SpO2, pulse, and SATS color-coded level assignment',
        path: '#triage',
        iconName: 'HeartPulse'
      },
      {
        id: 'abha-fasttrack',
        label: 'ABHA Card & Queue Pass',
        description: 'Instant ABHA token generation with zero-wait fast-track slip',
        path: '#triage',
        iconName: 'QrCode'
      }
    ]
  },
  {
    id: 'documents',
    label: 'Document Intelligence',
    labelTranslation: {
      en: 'Doc Intelligence',
      kn: 'ದಾಖಲೆ ವಿಶ್ಲೇಷಣೆ',
      hi: 'दस्तावेज़ विश्लेषण',
      te: 'పత్ర విశ్లేషణ',
      ta: 'ஆவண பகுப்பாய்வு'
    },
    path: '#documents',
    iconName: 'FileText',
    shortcut: '2',
    category: 'primary',
    description: 'Optical OCR & Gemini extraction for prescriptions, lab tests & discharge summaries',
    children: [
      {
        id: 'rx-ocr',
        label: 'Prescription OCR',
        description: 'Doctor handwriting digitization with generic medicine substitution',
        path: '#documents',
        iconName: 'FileScan'
      },
      {
        id: 'lab-parser',
        label: 'Lab Report Analyzer',
        description: 'Automated abnormal range flags and plain-language patient explanations',
        path: '#documents',
        iconName: 'FlaskConical'
      }
    ]
  },
  {
    id: 'hospitals',
    label: 'Hospital Network & Dispatch',
    labelTranslation: {
      en: 'Hospital Network',
      kn: 'ಆಸ್ಪತ್ರೆ ಜಾಲ & ರವಾನೆ',
      hi: 'अस्पताल नेटवर्क',
      te: 'ఆసుపత్రి నెట్‌వర్క్',
      ta: 'மருத்துவமனை வலையமைப்பு'
    },
    path: '#hospitals',
    iconName: 'Building2',
    badge: '18+ Verified',
    badgeVariant: 'urgent',
    shortcut: '3',
    category: 'hospital',
    description: 'Real-time bed telemetry, nodal officer contacts, automated WhatsApp/Email dispatch & n8n pipeline',
    children: [
      {
        id: 'hospital-directory',
        label: 'State & District Directory',
        description: 'Apex AIIMS, BMCRI, Victoria & PM-JAY cashless hospital network',
        path: '#hospitals',
        iconName: 'MapPin'
      },
      {
        id: 'n8n-automation',
        label: 'n8n / Make.com Pipelines',
        description: 'Webhook architecture, routing rules & one-click JSON scenario export',
        path: '#hospitals',
        iconName: 'Workflow'
      },
      {
        id: 'patient-slips',
        label: 'Patient Slip Archive',
        description: 'Official downloadable A4 OPD passes and dispatch acknowledgments',
        path: '#hospitals',
        iconName: 'Receipt'
      }
    ]
  },
  {
    id: 'kiosk',
    label: 'Hospital Kiosk Station',
    labelTranslation: {
      en: 'Kiosk Station',
      kn: 'ಕಿಯೋಸ್ಕ್ ಮೋಡ್',
      hi: 'कियोस्क मोड',
      te: 'కియోస్క్ స్టేషన్',
      ta: 'கியோஸ்க் பயன்முறை'
    },
    path: '#kiosk',
    iconName: 'Monitor',
    shortcut: '4',
    category: 'tools',
    description: 'High-contrast large-touch interface designed for district hospital reception lobbies'
  },
  {
    id: 'analytics',
    label: 'Public Health Analytics',
    labelTranslation: {
      en: 'Epidemic Analytics',
      kn: 'ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ಅಂಕಿಅಂಶ',
      hi: 'सार्वजनिक स्वास्थ्य डेटा',
      te: 'పబ్లిక్ హెల్త్ డేటా',
      ta: 'பொது சுகாதார பகுப்பாய்வு'
    },
    path: '#analytics',
    iconName: 'BarChart3',
    shortcut: '5',
    category: 'admin',
    description: 'Real-time disease surveillance, SATS queue latency, and district triage load heatmaps'
  }
];

export const QUICK_ACTIONS_REGISTRY = [
  {
    id: 'new-voice-triage',
    title: 'Start Voice Triage (Speak Now)',
    subtitle: 'Kannada, Hindi, English, Telugu, Tamil',
    icon: 'Mic',
    targetTab: 'triage',
    shortcut: 'V',
    category: 'Actions'
  },
  {
    id: 'scan-prescription',
    title: 'Scan Prescription / Lab Report',
    subtitle: 'Upload photo or camera snapshot',
    icon: 'Camera',
    targetTab: 'documents',
    shortcut: 'S',
    category: 'Actions'
  },
  {
    id: 'find-emergency-icu',
    title: 'Find Emergency ICU / Apex Hospital',
    subtitle: 'Victoria, AIIMS, Bowring, KC General',
    icon: 'Building2',
    targetTab: 'hospitals',
    shortcut: 'H',
    category: 'Hospitals'
  },
  {
    id: 'view-n8n-pipeline',
    title: 'Open n8n / Make.com Dispatch Engine',
    subtitle: 'Webhook architecture & JSON blueprint export',
    icon: 'Workflow',
    targetTab: 'hospitals',
    shortcut: 'N',
    category: 'Integration'
  },
  {
    id: 'kiosk-mode',
    title: 'Switch to Fullscreen Kiosk Mode',
    subtitle: 'Optimized touch interface with voice prompt loops',
    icon: 'Monitor',
    targetTab: 'kiosk',
    shortcut: 'K',
    category: 'Modes'
  }
];
