import React, { useState } from 'react';
import {
  FileText,
  Download,
  Send,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  Scale,
  Building2,
  Copy,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useNammaWaterStore } from '../../store/useNammaWaterStore';
import { BWSSB_STATUTORY_CAPS, BENGALURU_ZONES } from '../../data/bengaluruWaterData';
import { jsPDF } from 'jspdf';

export const CivicGrievanceReporter: React.FC = () => {
  const { currentInspection, selectedZone } = useNammaWaterStore();
  const [complaintName, setComplaintName] = useState('Citizen Beneficiary');
  const [complaintPhone, setComplaintPhone] = useState('+91 98800 00000');
  const [deliveryAddress, setDeliveryAddress] = useState(
    selectedZone ? `${selectedZone.name}, Bengaluru` : 'Sarjapur Road, Bengaluru'
  );
  const [tankerNumber, setTankerNumber] = useState(currentInspection?.tankerNumber || 'KA-53-D-8419');
  const [supplierName, setSupplierName] = useState(currentInspection?.supplierName || 'Sri Manjunatha Water Supply');
  const [billedAmount, setBilledAmount] = useState(currentInspection?.billedPriceInr ? String(currentInspection.billedPriceInr) : '1850');
  const [waterVolume, setWaterVolume] = useState(currentInspection?.waterVolumeLitres ? String(currentInspection.waterVolumeLitres) : '6000');
  const [copied, setCopied] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const statutoryCap = parseInt(waterVolume, 10) <= 6000 ? 750 : parseInt(waterVolume, 10) <= 10000 ? 850 : 1200;
  const excessAmount = Math.max(0, parseInt(billedAmount, 10) - statutoryCap);

  const grievanceText = `TO: Bangalore Water Supply and Sewerage Board (BWSSB) & Deputy Commissioner (Bengaluru Urban)
SUBJECT: Formal Grievance regarding Overcharging by Private Water Tanker Supplier under Section 4(1) of Karnataka Essential Commodities Act & Order ${BWSSB_STATUTORY_CAPS.dcOrderNumber}

1. COMPLAINANT DETAILS:
Name: ${complaintName}
Phone: ${complaintPhone}
Delivery Location: ${deliveryAddress}

2. TANKER TRANSACTION DETAILS:
Tanker Registration No: ${tankerNumber}
Supplier Name: ${supplierName}
Volume Supplied: ${waterVolume} Litres
Amount Billed/Paid: ₹${billedAmount}/-
Statutory Legal Cap (BWSSB Order): ₹${statutoryCap}/-
Excess Unlawful Surcharge: ₹${excessAmount}/-

3. STATUTORY GROUNDS:
As per the statutory order issued by the Special Deputy Commissioner, private water tankers operating in Bengaluru Urban cannot exceed ₹${statutoryCap} for ${waterVolume}L within municipal radius. The supplier has committed a price anomaly of ₹${excessAmount} in violation of price control mandates.

4. REQUESTED ACTION:
Immediate verification, statutory notice to supplier license, and enforcement of mandated refund.

Generated via Namma Water Civic AI Platform (https://nammawater.blr)`;

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('BANGALORE WATER SUPPLY & SEWERAGE BOARD (BWSSB)', 14, 18);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('FORMAL CIVIC GRIEVANCE & PRICE ANOMALY REPORT', 14, 25);
    doc.text(`Order Reference: ${BWSSB_STATUTORY_CAPS.dcOrderNumber}`, 14, 31);
    doc.line(14, 34, 196, 34);

    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(grievanceText, 180);
    doc.text(splitText, 14, 42);

    doc.save(`BWSSB_Grievance_${tankerNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(grievanceText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
          <Scale className="w-4 h-4" />
          <span>STATUTORY GRIEVANCE ENGINE • BWSSB &amp; DC BENGALURU</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          File a Statutory Tanker Price Cap Grievance
        </h2>
        <p className="text-xs text-slate-400">
          Under Bangalore District Commissioner Order <strong className="text-white">{BWSSB_STATUTORY_CAPS.dcOrderNumber}</strong>, private water tankers charging above ₹750/6000L or ₹1,200/12000L are subject to regulatory fines and license audits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Input Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            Transaction &amp; Supplier Parameters
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Your Full Name</label>
              <input
                type="text"
                value={complaintName}
                onChange={(e) => setComplaintName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Phone Number</label>
              <input
                type="text"
                value={complaintPhone}
                onChange={(e) => setComplaintPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Delivery Address &amp; Neighborhood</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Tanker Reg No.</label>
                <input
                  type="text"
                  value={tankerNumber}
                  onChange={(e) => setTankerNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Volume (L)</label>
                <select
                  value={waterVolume}
                  onChange={(e) => setWaterVolume(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  <option value="6000">6,000 L</option>
                  <option value="10000">10,000 L</option>
                  <option value="12000">12,000 L</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Billed Amount (₹)</label>
                <input
                  type="number"
                  value={billedAmount}
                  onChange={(e) => setBilledAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Legal Price Cap</label>
                <div className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 font-bold">
                  ₹{statutoryCap}
                </div>
              </div>
            </div>

            {excessAmount > 0 && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-300 flex items-center justify-between">
                <span>Unlawful Price Surcharge:</span>
                <strong className="font-mono text-sm text-red-200">₹{excessAmount.toLocaleString('en-IN')}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Right: Generated Notice & Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Statutory Notice Preview
              </h3>

              <button
                onClick={handleCopyText}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 cursor-pointer transition-all"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 max-h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {grievanceText}
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800">
            <button
              onClick={handleDownloadPdf}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              Download Official Grievance Document (PDF)
            </button>

            <a
              href="tel:1916"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center gap-2 border border-slate-700 transition-all text-center block"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              Call BWSSB 24x7 Helpline: 1916
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
