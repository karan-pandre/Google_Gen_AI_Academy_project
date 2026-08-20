import { jsPDF } from 'jspdf';
import { TriageResult } from '../types';

export const generatePatientSummaryPdf = (triage: TriageResult) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('GOVERNMENT OF KARNATAKA - HEALTH & FAMILY WELFARE', margin, 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('Victoria & Bowring Hospital Autonomous Complex • ABDM & NHA Compliant', margin, 16);
  doc.text('JanArogya AI Autonomous Smart Triage & Clinical Routing System', margin, 22);

  // Document Type Header Box
  let yPos = 35;
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('PATIENT TRIAGE SUMMARY & ROUTING SLIP', margin + 4, yPos + 8);

  const issueDate = new Date(triage.timestamp || Date.now()).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Generated: ${issueDate} IST`, pageWidth - margin - 4, yPos + 8, { align: 'right' });

  // Urgency & Token Callout Box
  yPos += 16;
  const isEmergency = triage.urgencyLevel <= 2;
  const tokenBgColor = isEmergency ? [254, 242, 242] : [240, 253, 250]; // red-50 or teal-50
  const tokenBorderColor = isEmergency ? [239, 68, 68] : [13, 148, 136]; // red-500 or teal-600
  
  doc.setFillColor(tokenBgColor[0], tokenBgColor[1], tokenBgColor[2]);
  doc.setDrawColor(tokenBorderColor[0], tokenBorderColor[1], tokenBorderColor[2]);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, yPos, contentWidth, 36, 3, 3, 'FD');

  // Token Number Left Box
  doc.setTextColor(isEmergency ? 185 : 15, isEmergency ? 28 : 118, isEmergency ? 28 : 110);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('ROUTING TOKEN NUMBER', margin + 6, yPos + 8);

  doc.setFontSize(22);
  doc.text(triage.tokenNumber, margin + 6, yPos + 18);

  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Est. Wait: ${triage.waitTimeEstimateMinutes === 0 ? 'IMMEDIATE / ZERO WAIT' : `~${triage.waitTimeEstimateMinutes} Mins`}`, margin + 6, yPos + 26);
  doc.text(`Urgency: Level ${triage.urgencyLevel} - ${triage.urgencyLabel || (isEmergency ? 'EMERGENCY' : 'ROUTINE')}`, margin + 6, yPos + 32);

  // Department & Room Right Box
  const colRightX = margin + 85;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('ASSIGNED CLINICAL DESK', colRightX, yPos + 8);

  doc.setFontSize(11);
  doc.setTextColor(13, 148, 136);
  doc.text(triage.primaryDepartment, colRightX, yPos + 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Room: ${triage.roomNumber}`, colRightX, yPos + 22);
  doc.text(`Wing/Floor: ${triage.floorWing}`, colRightX, yPos + 28);
  doc.text(`Triage ID: ${triage.id}`, colRightX, yPos + 33);

  // Section: Patient Demographics
  yPos += 42;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('1. PATIENT IDENTIFICATION & DEMOGRAPHICS', margin, yPos);

  yPos += 4;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, yPos, contentWidth, 20, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Patient Name:', margin + 4, yPos + 6);
  doc.text('Age / Gender:', margin + 4, yPos + 12);
  doc.text('Phone Number:', margin + 4, yPos + 17);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(triage.patientInfo?.name || 'Walk-in Beneficiary', margin + 30, yPos + 6);
  doc.text(`${triage.patientInfo?.age || '--'} Years / ${triage.patientInfo?.gender || '--'}`, margin + 30, yPos + 12);
  doc.text(triage.patientInfo?.phone || '+91 Not Recorded', margin + 30, yPos + 17);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('ABHA Health ID:', margin + 95, yPos + 6);
  doc.text('Priority Category:', margin + 95, yPos + 12);
  doc.text('Cashless Scheme:', margin + 95, yPos + 17);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text(triage.patientInfo?.abhaId || 'ABDM Pending Registration', margin + 125, yPos + 6);
  doc.setTextColor(15, 23, 42);
  doc.text(triage.fastTrackEligible ? 'Fast-Track (Verified)' : 'Standard Queue', margin + 125, yPos + 12);
  doc.setTextColor(2, 132, 199);
  doc.text('Ayushman Bharat / PM-JAY Eligible', margin + 125, yPos + 17);

  // Section: Clinical Symptoms & Findings
  yPos += 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('2. CHIEF COMPLAINTS & CLINICAL FINDINGS', margin, yPos);

  yPos += 4;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, yPos, contentWidth, 24, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Reported Symptoms:', margin + 4, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const symptomsText = triage.extractedSymptoms && triage.extractedSymptoms.length > 0
    ? triage.extractedSymptoms.join(', ')
    : 'General medical consultation requested';
  doc.text(symptomsText, margin + 40, yPos + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Triage Summary:', margin + 4, yPos + 12);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const splitSummary = doc.splitTextToSize(triage.clinicalSummary || 'Patient evaluated via speech/vision intake.', contentWidth - 44);
  doc.text(splitSummary, margin + 40, yPos + 12);

  // Section: Recommended Investigations & Action Plan
  yPos += 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('3. FAST-TRACK DIAGNOSTIC ORDERS & ACTION PLAN', margin, yPos);

  yPos += 4;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, yPos, contentWidth, 22, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Recommended Tests:', margin + 4, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const tests = triage.testsRecommended && triage.testsRecommended.length > 0
    ? triage.testsRecommended.join(' • ')
    : 'Baseline clinical assessment (Vitals, BP, SpO2)';
  doc.text(tests, margin + 40, yPos + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Next Action:', margin + 4, yPos + 12);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const nextStep = doc.splitTextToSize(triage.recommendedAction || 'Proceed to room counter and present token when called.', contentWidth - 44);
  doc.text(nextStep, margin + 40, yPos + 12);

  // Section: Patient Native Guidance Box
  yPos += 28;
  if (triage.nativeLanguageInstructions) {
    doc.setFillColor(254, 243, 199); // amber-100
    doc.setDrawColor(245, 158, 11);
    doc.roundedRect(margin, yPos, contentWidth, 16, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(146, 64, 14); // amber-800
    doc.text('PATIENT REGIONAL GUIDANCE NOTE:', margin + 4, yPos + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 53, 15);
    const nativeInst = doc.splitTextToSize(triage.nativeLanguageInstructions, contentWidth - 8);
    doc.text(nativeInst, margin + 4, yPos + 10);
    yPos += 20;
  }

  // Footer Emergency & Verification Box
  yPos = Math.max(yPos + 4, 250);
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, yPos, contentWidth, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('EMERGENCY & PUBLIC HEALTH CONTACTS', margin + 4, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text('24x7 Emergency Ambulance: 108  |  Arogyavani Medical Advice: 104  |  Blood Bank: 080-26701150', margin + 4, yPos + 12);
  doc.text('This is a computer-generated digital clinical triage slip under ABDM guidelines. No physical signature required.', margin + 4, yPos + 18);

  // Trigger download
  const safeToken = triage.tokenNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`JanArogya_Patient_Summary_${safeToken}.pdf`);
};
