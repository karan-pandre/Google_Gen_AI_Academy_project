// Namma Water - Civic AI Platform Types
// Bengaluru Water Pricing, Tanker Verification & Quality Intelligence

export type UrgencyOrAnomalyLevel = 'REASONABLE' | 'MODERATE_VARIATION' | 'HIGH_ANOMALY' | 'CRITICAL_OUTLIER';

export type EvidenceType = 'OBSERVED' | 'EXTRACTED' | 'CALCULATED' | 'VERIFIED' | 'INFERRED' | 'UNKNOWN';

export type ConfidenceLevel = 'HIGH_CONFIDENCE' | 'MODERATE_CONFIDENCE' | 'LOW_CONFIDENCE' | 'INSUFFICIENT_EVIDENCE';

export type AIProcessState =
  | 'IDLE'
  | 'LISTENING'
  | 'UPLOADING'
  | 'PROCESSING'
  | 'ANALYZING'
  | 'VERIFYING'
  | 'CALCULATING'
  | 'COMPLETE'
  | 'WARNING'
  | 'ERROR';

export interface WaterQualityParam {
  id: string;
  name: string;
  chemicalSymbol?: string;
  observedValue: number | string;
  unit: string;
  referenceMin?: number;
  referenceMax?: number;
  referenceStandard: string; // e.g. "BIS IS 10500:2012"
  status: 'OPTIMAL' | 'ACCEPTABLE' | 'REFERENCE_CHECK' | 'ELEVATED' | 'HAZARDOUS';
  statusLabel: string;
  evidenceType: EvidenceType;
  confidence: ConfidenceLevel;
  description: string;
}

export interface TankerInspectionEvidence {
  id: string;
  claim: string;
  category: 'PRICING' | 'VOLUME' | 'SUPPLIER' | 'SOURCE' | 'QUALITY' | 'LOCATION';
  evidenceType: EvidenceType;
  extractedSnippet?: string;
  verificationSource: string;
  confidence: ConfidenceLevel;
  explanation: string;
}

export interface TankerInspectionResult {
  id: string;
  timestamp: string;
  tankerNumber?: string;
  supplierName?: string;
  supplierPhone?: string;
  sourceType: 'BOREWELL_COMMERCIAL' | 'BWSSB_OFFICIAL' | 'PRIVATE_RO_PLANT' | 'QUARRY_SOURCE' | 'UNKNOWN';
  sourceLocation?: string;
  deliveryNeighborhood: string;
  deliveryPincode?: string;
  waterVolumeLitres: number;
  billedPriceInr: number;
  unitRatePerKL: number; // ₹ per 1,000 Litres
  
  // Benchmark comparison
  localBenchmarkRange: {
    minInr: number;
    maxInr: number;
    medianInr: number;
    bwssbCappedRateInr?: number;
  };
  priceVariancePercent: number; // e.g. +28% vs median
  priceAnomalyLevel: UrgencyOrAnomalyLevel;
  anomalySummary: string;
  
  // Water Quality
  waterQualityIndex: number; // 0-100 score
  waterQualityGrade: 'EXCELLENT' | 'GOOD' | 'FAIR_NON_POTABLE' | 'POOR_CONTAMINATED';
  qualityParameters: WaterQualityParam[];
  
  // Evidence & Trust
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0.0 to 1.0
  evidenceItems: TankerInspectionEvidence[];
  
  // Civic Recommendations & Action Steps
  civicRecommendations: string[];
  formalReportEligible: boolean;
  legalPriceCapReference: string;
  
  // Original Input Meta
  inputMode: 'IMAGE_BILL' | 'CAMERA_SNAP' | 'VOICE_REPORT' | 'MANUAL_ENTRY';
  documentImageUrl?: string;
  rawTranscribedText?: string;
}

export interface BengaluruZoneData {
  id: string;
  name: string;
  kannadaName: string;
  zone: 'East' | 'South' | 'North' | 'West' | 'Central';
  coordinates: {
    lat: number;
    lng: number;
    gridX: number; // 3D coordinates
    gridZ: number;
  };
  avgPrice6kL: number;
  avgPrice10kL: number;
  avgPrice12kL: number;
  historicalPriceDelta: number; // e.g. +14% vs last week
  activeReportsCount: number;
  highAnomalyCount: number;
  avgTdsPpm: number;
  avgPh: number;
  groundwaterStressLevel: 'MODERATE' | 'SEVERE' | 'CRITICAL' | 'ACUTE';
  bwssbCauveryPipelineCoveragePercent: number;
  topSuppliersActive: number;
  recentAlert?: string;
}

export interface CivicCommunityReport {
  id: string;
  neighborhood: string;
  tankerNumberMasked: string;
  volumeL: number;
  pricePaid: number;
  unitRateKL: number;
  anomalyLevel: UrgencyOrAnomalyLevel;
  waterQualityGrade: string;
  tdsPpm?: number;
  timestampAgo: string;
  verifiedByAi: boolean;
  verifiedByCommunityUpvotes: number;
  supplierMasked: string;
}

export interface NammaWaterCityStats {
  totalReportsLogged: number;
  activeInspectorsCount: number;
  citywideAvgTankerPrice6kL: number;
  citywideAvgTankerPrice10kL: number;
  citywideAvgTankerPrice12kL: number;
  priceAnomalyRatePercent: number;
  verifiedCitizenSavingsInr: number;
  monitoredZonesCount: number;
  highestPricedZone: string;
  mostFairPricedZone: string;
  todayReportsCount: number;
}
