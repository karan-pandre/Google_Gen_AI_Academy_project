// Utility to generate realistic SVG data URIs for sample document testing

export function getSampleDocumentImage(presetId: string): string {
  if (presetId === 'rx-handwritten') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="650" height="850" viewBox="0 0 650 850" fill="none">
      <rect width="650" height="850" fill="#FCFAF2" stroke="#D1D5DB" stroke-width="2" rx="8"/>
      <!-- Header -->
      <rect x="20" y="20" width="610" height="110" fill="#1E3A8A" rx="6"/>
      <text x="325" y="55" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF" text-anchor="middle">GOVERNMENT VICTORIA &amp; BOWRING HOSPITAL</text>
      <text x="325" y="80" font-family="Arial, sans-serif" font-size="13" fill="#93C5FD" text-anchor="middle">Fort Road, Bengaluru - 560002 | Autonomous Public Medical Institution</text>
      <text x="325" y="105" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FDE047" text-anchor="middle">DEPARTMENT OF GENERAL MEDICINE &amp; CARDIOMETABOLIC CLINIC</text>
      
      <!-- Doctor details -->
      <text x="35" y="155" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#1F2937">Dr. S. K. Murthy, MD (Gen Med), FICP</text>
      <text x="35" y="172" font-family="Arial, sans-serif" font-size="11" fill="#4B5563">Senior Consultant Physician | Reg. No: KMC-44892</text>
      <text x="480" y="155" font-family="Arial, sans-serif" font-size="12" fill="#374151">Date: 20-Aug-2026</text>
      <text x="480" y="172" font-family="Arial, sans-serif" font-size="12" fill="#374151">OPD No: MED-8841</text>
      
      <line x1="30" y1="185" x2="620" y2="185" stroke="#9CA3AF" stroke-width="1.5" stroke-dasharray="4 4"/>
      
      <!-- Patient details -->
      <text x="35" y="210" font-family="Arial, sans-serif" font-size="13" fill="#1F2937"><tspan font-weight="bold">Patient:</tspan> Mallikarjun Patil (M/54Y)</text>
      <text x="380" y="210" font-family="Arial, sans-serif" font-size="13" fill="#1F2937"><tspan font-weight="bold">ABHA ID:</tspan> 91-8844-3321-7712</text>
      <text x="35" y="235" font-family="Arial, sans-serif" font-size="12" fill="#374151"><tspan font-weight="bold">Vitals:</tspan> BP: 154/96 mmHg | Pulse: 84 bpm | RBS: 236 mg/dL | SpO2: 98%</text>
      
      <line x1="30" y1="250" x2="620" y2="250" stroke="#CBD5E1" stroke-width="1"/>
      
      <!-- Rx Symbol -->
      <text x="35" y="300" font-family="Georgia, serif" font-size="34" font-weight="bold" fill="#1E3A8A">℞</text>
      
      <!-- Handwriting Simulation Rx 1 -->
      <text x="80" y="305" font-family="'Brush Script MT', 'Caveat', cursive, sans-serif" font-size="22" fill="#1E1B4B">Tab. Metformin 500mg SR</text>
      <text x="90" y="330" font-family="'Brush Script MT', 'Caveat', cursive, sans-serif" font-size="18" fill="#312E81">1 - 0 - 1 (After food / ಊಟದ ನಂತರ) x 30 days</text>
      
      <!-- Rx 2 -->
      <text x="80" y="375" font-family="'Brush Script MT', 'Caveat', cursive, sans-serif" font-size="22" fill="#1E1B4B">Tab. Telmisartan 40mg</text>
      <text x="90" y="400" font-family="'Brush Script MT', 'Caveat', cursive, sans-serif" font-size="18" fill="#312E81">1 - 0 - 0 (Morning empty stomach) x 30 days</text>
      
      <!-- Rx 3 -->
      <text x="80" y="445" font-family="'Brush Script MT', 'Caveat', cursive, sans-serif" font-size="22" fill="#1E1B4B">Tab. Paracetamol 650mg (SOS)</text>
      <text x="90" y="470" font-family="'Brush Script MT', 'Caveat', cursive, sans-serif" font-size="18" fill="#312E81">If severe headache or body ache</text>
      
      <!-- Clinical Notes & Tests -->
      <rect x="35" y="510" width="580" height="150" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1.5" rx="6"/>
      <text x="50" y="535" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#1E40AF">INVESTIGATIONS &amp; DIAGNOSTIC ORDERS:</text>
      <text x="50" y="565" font-family="Arial, sans-serif" font-size="13" fill="#1E293B">1. HbA1c (Glycated Hemoglobin) - Fasting</text>
      <text x="50" y="590" font-family="Arial, sans-serif" font-size="13" fill="#1E293B">2. Serum Creatinine &amp; Lipid Profile</text>
      <text x="50" y="615" font-family="Arial, sans-serif" font-size="13" fill="#1E293B">3. 12-Lead ECG in Room 202</text>
      <text x="50" y="640" font-family="Arial, sans-serif" font-size="12" font-style="italic" fill="#DC2626">Urgent: Review with ECG in Cardiac Wing if chest heaviness occurs.</text>
      
      <!-- Seal and Signature -->
      <circle cx="150" cy="740" r="45" fill="none" stroke="#2563EB" stroke-width="2" stroke-dasharray="3 3"/>
      <text x="150" y="735" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#2563EB" text-anchor="middle">GOVT HOSPITAL</text>
      <text x="150" y="748" font-family="Arial, sans-serif" font-size="8" fill="#2563EB" text-anchor="middle">GEN MED OPD</text>
      <text x="150" y="760" font-family="Arial, sans-serif" font-size="8" fill="#2563EB" text-anchor="middle">BENGALURU</text>
      
      <!-- Doctor Sig -->
      <path d="M 450 740 Q 470 710 500 735 T 540 730 T 570 750" stroke="#1E1B4B" stroke-width="2.5" fill="none"/>
      <text x="510" y="770" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#374151" text-anchor="middle">Dr. S. K. Murthy</text>
      <text x="510" y="785" font-family="Arial, sans-serif" font-size="10" fill="#6B7280" text-anchor="middle">Authorized Medical Officer</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  if (presetId === 'abha-pmjay') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="650" height="420" viewBox="0 0 650 420" fill="none">
      <rect width="650" height="420" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="2" rx="16"/>
      <!-- Indian tricolor accent top bar -->
      <rect x="0" y="0" width="650" height="12" fill="#FF9933" rx="4"/>
      <rect x="0" y="12" width="650" height="6" fill="#FFFFFF"/>
      <rect x="0" y="18" width="650" height="6" fill="#138808"/>
      
      <!-- Header with National Emblem style & Ayushman Bharat -->
      <rect x="30" y="38" width="590" height="65" fill="#F8FAFC" rx="8" stroke="#E2E8F0"/>
      <circle cx="65" cy="70" r="22" fill="#1E3A8A"/>
      <text x="65" y="75" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">PM-JAY</text>
      <text x="105" y="62" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0F172A">NATIONAL HEALTH AUTHORITY</text>
      <text x="105" y="82" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#059669">Ayushman Bharat Health Account (ABHA)</text>
      <text x="490" y="75" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#DC2626">₹5,00,000 COVER</text>
      
      <!-- Photo Box -->
      <rect x="40" y="125" width="120" height="150" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.5" rx="6"/>
      <circle cx="100" cy="180" r="32" fill="#94A3B8"/>
      <path d="M 60 260 C 60 220, 140 220, 140 260 Z" fill="#64748B"/>
      
      <!-- Patient Information -->
      <text x="180" y="150" font-family="Arial, sans-serif" font-size="12" fill="#64748B">Beneficiary Name / ಫಲಾನುಭವಿಯ ಹೆಸರು</text>
      <text x="180" y="175" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#0F172A">Sunita Devi / ಸುನೀತಾ ದೇವಿ</text>
      
      <text x="180" y="205" font-family="Arial, sans-serif" font-size="12" fill="#64748B">ABHA Number (14 Digits):</text>
      <rect x="180" y="215" width="270" height="34" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" rx="6"/>
      <text x="195" y="238" font-family="Courier, monospace" font-size="18" font-weight="bold" fill="#92400E">91-4521-8890-3321</text>
      
      <text x="180" y="275" font-family="Arial, sans-serif" font-size="13" fill="#334155"><tspan font-weight="bold">YOB / Age:</tspan> 1984 (42 Yrs)  |  <tspan font-weight="bold">Gender:</tspan> Female</text>
      <text x="180" y="295" font-family="Arial, sans-serif" font-size="13" fill="#334155"><tspan font-weight="bold">State:</tspan> Karnataka (District: Bengaluru Urban)</text>
      <text x="180" y="315" font-family="Arial, sans-serif" font-size="13" fill="#334155"><tspan font-weight="bold">ABHA Address:</tspan> sunitadevi84@abdm</text>
      
      <!-- QR Code representation -->
      <rect x="480" y="125" width="130" height="130" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" rx="4"/>
      <!-- QR Pattern blocks -->
      <rect x="490" y="135" width="30" height="30" fill="#0F172A"/>
      <rect x="495" y="140" width="20" height="20" fill="#FFFFFF"/>
      <rect x="500" y="145" width="10" height="10" fill="#0F172A"/>
      
      <rect x="570" y="135" width="30" height="30" fill="#0F172A"/>
      <rect x="575" y="140" width="20" height="20" fill="#FFFFFF"/>
      <rect x="580" y="145" width="10" height="10" fill="#0F172A"/>
      
      <rect x="490" y="215" width="30" height="30" fill="#0F172A"/>
      <rect x="495" y="220" width="20" height="20" fill="#FFFFFF"/>
      <rect x="500" y="225" width="10" height="10" fill="#0F172A"/>
      
      <circle cx="545" cy="190" r="14" fill="#059669"/>
      <text x="545" y="195" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">✓</text>
      <text x="545" y="270" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#059669" text-anchor="middle">ABDM VERIFIED</text>
      
      <!-- Bottom Footer -->
      <rect x="0" y="380" width="650" height="40" fill="#1E3A8A" rx="0 0 16 16"/>
      <text x="325" y="405" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">GOVERNMENT OF INDIA - MINISTRY OF HEALTH &amp; FAMILY WELFARE</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // Lab Blood Report
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="650" height="750" viewBox="0 0 650 750" fill="none">
    <rect width="650" height="750" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="2" rx="8"/>
    <!-- Header -->
    <rect x="20" y="20" width="610" height="85" fill="#065F46" rx="6"/>
    <text x="325" y="50" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF" text-anchor="middle">CENTRAL DIAGNOSTIC &amp; PATHOLOGY LABORATORY</text>
    <text x="325" y="70" font-family="Arial, sans-serif" font-size="12" fill="#A7F3D0" text-anchor="middle">VICTORIA HOSPITAL CAMPUS, GOVT. OF KARNATAKA</text>
    <text x="325" y="90" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#FDE047" text-anchor="middle">NABL ACCREDITED PUBLIC HEALTH LAB (MC-2941)</text>
    
    <!-- Patient Info -->
    <rect x="25" y="115" width="600" height="70" fill="#F8FAFC" stroke="#E2E8F0" rx="4"/>
    <text x="40" y="135" font-family="Arial, sans-serif" font-size="12" fill="#334155"><tspan font-weight="bold">Patient:</tspan> Ramesh Kumar (M/38 Yrs)</text>
    <text x="360" y="135" font-family="Arial, sans-serif" font-size="12" fill="#334155"><tspan font-weight="bold">Ref. Doctor:</tspan> Dr. Meenakshi S.</text>
    <text x="40" y="160" font-family="Arial, sans-serif" font-size="12" fill="#334155"><tspan font-weight="bold">Sample ID:</tspan> LAB-88219-BLD</text>
    <text x="360" y="160" font-family="Arial, sans-serif" font-size="12" fill="#334155"><tspan font-weight="bold">Date &amp; Time:</tspan> 20-Aug-2026, 09:15 AM</text>
    
    <!-- Report Table Header -->
    <rect x="25" y="195" width="600" height="30" fill="#1E293B"/>
    <text x="40" y="215" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">TEST DESCRIPTION</text>
    <text x="280" y="215" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">OBSERVED VALUE</text>
    <text x="430" y="215" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">REFERENCE RANGE</text>
    <text x="560" y="215" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">STATUS</text>
    
    <!-- Test Row 1: Platelets (CRITICAL) -->
    <rect x="25" y="230" width="600" height="40" fill="#FEF2F2"/>
    <text x="40" y="255" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#991B1B">Platelet Count (Thrombocytes)</text>
    <text x="280" y="255" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#DC2626">45,000 / μL</text>
    <text x="430" y="255" font-family="Arial, sans-serif" font-size="12" fill="#4B5563">150,000 - 450,000</text>
    <text x="560" y="255" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#DC2626">CRITICAL LOW</text>
    
    <!-- Test Row 2: Hemoglobin -->
    <rect x="25" y="275" width="600" height="35" fill="#FFFBEB"/>
    <text x="40" y="298" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#1F2937">Hemoglobin (Hb)</text>
    <text x="280" y="298" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#D97706">8.4 g/dL</text>
    <text x="430" y="298" font-family="Arial, sans-serif" font-size="12" fill="#4B5563">13.5 - 17.5 g/dL</text>
    <text x="560" y="298" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#D97706">LOW (Anemia)</text>
    
    <!-- Test Row 3: Total Leucocyte Count -->
    <rect x="25" y="315" width="600" height="35" fill="#FFFFFF"/>
    <text x="40" y="338" font-family="Arial, sans-serif" font-size="12" fill="#1F2937">Total Leucocyte Count (TLC)</text>
    <text x="280" y="338" font-family="Arial, sans-serif" font-size="13" fill="#1F2937">12,400 / μL</text>
    <text x="430" y="338" font-family="Arial, sans-serif" font-size="12" fill="#4B5563">4,000 - 11,000</text>
    <text x="560" y="338" font-family="Arial, sans-serif" font-size="12" fill="#4B5563">MILD ELEVATED</text>
    
    <!-- Test Row 4: Dengue NS1 Antigen -->
    <rect x="25" y="355" width="600" height="40" fill="#FEF2F2"/>
    <text x="40" y="380" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#991B1B">Dengue NS1 Rapid Antigen</text>
    <text x="280" y="380" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#DC2626">POSITIVE (+)</text>
    <text x="430" y="380" font-family="Arial, sans-serif" font-size="12" fill="#4B5563">Negative</text>
    <text x="560" y="380" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#DC2626">REACTIVE</text>
    
    <!-- Critical Alert Box -->
    <rect x="25" y="415" width="600" height="110" fill="#FEE2E2" stroke="#EF4444" stroke-width="2" rx="6"/>
    <text x="40" y="440" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#B91C1C">CRITICAL PANIC VALUE ALERT - IMMEDIATE ATTENTION REQUIRED</text>
    <text x="40" y="465" font-family="Arial, sans-serif" font-size="12" fill="#7F1D1D">• Severe thrombocytopenia (&lt;50,000/μL) with positive Dengue NS1 antigen indicates high risk of bleeding.</text>
    <text x="40" y="488" font-family="Arial, sans-serif" font-size="12" fill="#7F1D1D">• Immediate Emergency admission / Day Care monitoring and platelet reserve crossmatch recommended.</text>
    <text x="40" y="510" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#991B1B">• Routed to: Emergency Red Zone Bay / Infectious Medicine Dept.</text>
    
    <!-- Signatures -->
    <line x1="25" y1="650" x2="625" y2="650" stroke="#CBD5E1" stroke-width="1"/>
    <text x="120" y="680" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#1F2937" text-anchor="middle">Lab Technician</text>
    <text x="120" y="695" font-family="Arial, sans-serif" font-size="10" fill="#6B7280" text-anchor="middle">N. Shivalingappa, DMLT</text>
    
    <text x="500" y="680" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#1F2937" text-anchor="middle">Dr. Anupama Shenoy, MD</text>
    <text x="500" y="695" font-family="Arial, sans-serif" font-size="10" fill="#6B7280" text-anchor="middle">Chief Pathologist &amp; Medical Officer</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
