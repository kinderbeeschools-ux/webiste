import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  ShieldCheck, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertTriangle, 
  HelpCircle, 
  Phone, 
  Mail, 
  Receipt, 
  CheckCircle2, 
  Download, 
  Printer, 
  ArrowRight, 
  FileText, 
  Smartphone, 
  Lock, 
  Building2, 
  User, 
  IndianRupee,
  RefreshCw
} from 'lucide-react';
import { PaymentRecord } from '../types';

interface PaymentPageProps {
  onNavigate: (tab: string) => void;
  preselectedProgramme?: string;
  preselectedAmount?: string | number;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ 
  onNavigate,
  preselectedProgramme,
  preselectedAmount
}) => {
  // Payer details for QR generation & form
  const [applicantName, setApplicantName] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [programme, setProgramme] = useState(preselectedProgramme || 'Advanced Diploma in Early Childhood Care & Education (ECCE)');
  const [amount, setAmount] = useState<string>(preselectedAmount ? String(preselectedAmount) : '4999');
  const [customAmount, setCustomAmount] = useState('');
  
  // Submission Form State
  const [upiRefNumber, setUpiRefNumber] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  // Status & UI State
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPayment, setSubmittedPayment] = useState<PaymentRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'pay' | 'confirm'>('pay');

  const beneficiaryName = 'kinderbee international preschool';
  const upiId = 'paytm.s1e1uzf@pty';

  // Available fee preset programs
  const programmeOptions = [
    { label: 'Teacher Training: Advanced Diploma in ECCE (Offer ₹4,999)', value: 'Advanced Diploma in Early Childhood Care & Education (ECCE)', defaultAmount: '4999' },
    { label: 'Preschool Admission: Playgroup (1.5 - 2.5 yrs)', value: 'Preschool Admission: Playgroup', defaultAmount: '15000' },
    { label: 'Preschool Admission: Nursery (2.5 - 3.5 yrs)', value: 'Preschool Admission: Nursery', defaultAmount: '18000' },
    { label: 'Preschool Admission: LKG (3.5 - 4.5 yrs)', value: 'Preschool Admission: LKG', defaultAmount: '20000' },
    { label: 'Preschool Admission: UKG (4.5 - 5.5 yrs)', value: 'Preschool Admission: UKG', defaultAmount: '22000' },
    { label: 'Daycare & Extended Care Fee', value: 'Daycare & Extended Care Fee', defaultAmount: '6000' },
    { label: 'KIPS Preschool Franchise Setup Commitment', value: 'KIPS Preschool Franchise Setup', defaultAmount: '50000' },
    { label: 'Academic Curriculum Kits & Books', value: 'Academic Kits & Materials', defaultAmount: '3500' },
    { label: 'Other Specified Fee Category', value: 'Other Academic Fee', defaultAmount: '' }
  ];

  // Effective amount
  const effectiveAmount = customAmount ? customAmount : amount;

  // Generate UPI URI
  const transactionNote = applicantName 
    ? `${applicantName.slice(0, 15)} ${admissionNumber ? '-' + admissionNumber.slice(0, 8) : ''}`.trim()
    : 'Fee Payment';

  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(beneficiaryName)}&am=${effectiveAmount || ''}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  // Generate dynamic QR Code
  useEffect(() => {
    QRCode.toDataURL(upiUri, {
      width: 320,
      margin: 2,
      color: {
        dark: '#002E6E', // Paytm Navy Blue tone
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
    .then(url => {
      setQrDataUrl(url);
    })
    .catch(err => {
      console.error('QR code generation error:', err);
    });
  }, [upiUri]);

  // Handle program change
  const handleProgrammeChange = (val: string) => {
    setProgramme(val);
    const found = programmeOptions.find(p => p.value === val);
    if (found && found.defaultAmount) {
      setAmount(found.defaultAmount);
      setCustomAmount('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUPI(true);
    setTimeout(() => setCopiedUPI(false), 2500);
  };

  const handlePaymentSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToPolicy) {
      alert('Please review and confirm acceptance of the Cancellation and No-Refund Policy.');
      return;
    }
    if (!upiRefNumber || upiRefNumber.trim().length < 6) {
      alert('Please enter a valid 12-digit UPI Transaction ID / UTR number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName,
          admissionNumber,
          programme,
          amount: effectiveAmount,
          upiRefNumber,
          payerPhone,
          payerEmail,
          paymentDate,
          notes
        })
      });

      const data = await res.json();
      if (data.success && data.paymentRecord) {
        setSubmittedPayment(data.paymentRecord);
      } else {
        alert(data.error || 'Failed to record payment reference. Please contact support.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while recording payment submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Breadcrumb & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-200/60 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official 256-Bit Encrypted Fee Gateway</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-stone-900 tracking-tight">
              Secure Fee Payment
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-1 max-w-2xl">
              Pay via any UPI application (Paytm, Google Pay, PhonePe, BHIM, Cred) directly to our institutional account.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pay')}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition cursor-pointer ${
                activeTab === 'pay' 
                  ? 'bg-[#E1007A] text-white shadow-xs' 
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              1. Scan & Pay UPI
            </button>
            <button
              onClick={() => setActiveTab('confirm')}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition cursor-pointer ${
                activeTab === 'confirm' 
                  ? 'bg-[#E1007A] text-white shadow-xs' 
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              2. Submit Reference
            </button>
          </div>
        </div>

        {/* Advisory Banner */}
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900 space-y-1">
            <p className="font-bold">Important Guidance Before Making Payment</p>
            <p className="text-amber-800 leading-relaxed">
              Please confirm your admission, programme and payable amount with the Kinderbee admissions or academic team before making a payment. Always retain your 12-digit UPI Transaction ID / UTR to submit through the confirmation form below.
            </p>
          </div>
        </div>

        {/* SUCCESS / ACKNOWLEDGEMENT SLIP VIEW */}
        {submittedPayment ? (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-10 space-y-8 animate-fadeIn print:shadow-none print:border-none print:p-0">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">
                Payment Reference Recorded Successfully
              </h2>
              <p className="text-sm text-stone-600 max-w-lg mx-auto">
                Your payment transaction reference has been logged into the Kinderbee Central Verification Registry.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-4 max-w-xl mx-auto text-sm">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="text-stone-500 font-medium">Reference ID:</span>
                <span className="font-mono font-bold text-[#E1007A] text-base">{submittedPayment.id}</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="text-stone-500 font-medium">Applicant / Learner:</span>
                <span className="font-bold text-stone-800">{submittedPayment.applicantName}</span>
              </div>
              {submittedPayment.admissionNumber && (
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <span className="text-stone-500 font-medium">Admission No:</span>
                  <span className="font-medium text-stone-800">{submittedPayment.admissionNumber}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="text-stone-500 font-medium">Programme:</span>
                <span className="font-medium text-stone-800 text-right max-w-xs">{submittedPayment.programme}</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="text-stone-500 font-medium">Payable Amount:</span>
                <span className="font-bold text-emerald-700 text-lg">₹{Number(submittedPayment.amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="text-stone-500 font-medium">UPI Ref / UTR No:</span>
                <span className="font-mono font-semibold text-stone-900">{submittedPayment.upiRefNumber}</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="text-stone-500 font-medium">Payer Phone:</span>
                <span className="font-medium text-stone-800">{submittedPayment.payerPhone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Verification Status:</span>
                <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span>Pending Bank Reconciliation (24-48 hrs)</span>
                </span>
              </div>
            </div>

            {/* Note & Policy Reminder */}
            <div className="bg-pink-50/60 border border-pink-100 rounded-xl p-4 text-xs text-stone-700 space-y-1.5 max-w-xl mx-auto">
              <p className="font-bold text-[#E1007A]">Verification & Official Receipt Notice:</p>
              <p>
                An official tax invoice/receipt will be generated and dispatched via email or WhatsApp after our accounts desk matches the transaction reference with the banking ledger within 24 to 48 business hours.
              </p>
              <p className="text-stone-500">
                All fees, once paid, are non-refundable as per our{' '}
                <button 
                  onClick={() => onNavigate('cancellation-refund')} 
                  className="text-[#E1007A] underline font-semibold cursor-pointer"
                >
                  Cancellation and No-Refund Policy
                </button>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 print:hidden">
              <button
                onClick={handlePrintReceipt}
                className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold px-6 py-3 rounded-xl text-sm transition shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Acknowledgement</span>
              </button>
              <button
                onClick={() => {
                  setSubmittedPayment(null);
                  setActiveTab('pay');
                  setUpiRefNumber('');
                }}
                className="inline-flex items-center gap-2 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold px-6 py-3 rounded-xl text-sm transition cursor-pointer"
              >
                <span>Make Another Payment</span>
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="inline-flex items-center gap-2 bg-[#E1007A] hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition cursor-pointer"
              >
                <span>Return to Home &rarr;</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: PAYTM QR CODE & UPI BOX */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Mandatory Prominent Notice Directly Above QR */}
              <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-xs text-rose-900 shadow-xs">
                <div className="flex items-center gap-1.5 font-bold text-rose-700 mb-1">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>MANDATORY FEE DISCLOSURE</span>
                </div>
                <p className="font-semibold leading-relaxed">
                  Important: All fees, once paid, are non-refundable. Please verify the programme, applicant details, payable amount and beneficiary name before completing payment.
                </p>
              </div>

              {/* Paytm UPI QR Container */}
              <div className="bg-white rounded-3xl border-2 border-sky-600/30 shadow-xl overflow-hidden p-6 sm:p-7 space-y-5 text-center relative">
                
                {/* Paytm Top Brand Bar */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-xl tracking-tight text-[#002E6E]">Pay<span className="text-[#00BAF2]">tm</span></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200">
                      Verified UPI Merchant
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-stone-500 font-semibold">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Direct Bank QR</span>
                  </div>
                </div>

                {/* Amount Display */}
                <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200/80">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Payable Amount</span>
                  <div className="text-3xl font-display font-extrabold text-stone-900 flex items-center justify-center gap-1 mt-0.5">
                    <span className="text-stone-500 text-2xl font-normal">₹</span>
                    <span>{effectiveAmount ? Number(effectiveAmount).toLocaleString('en-IN') : '0'}</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block truncate mt-0.5">
                    {programme}
                  </span>
                </div>

                {/* Generated QR Image with QR Code Frame */}
                <div className="relative inline-block mx-auto p-3 bg-white rounded-2xl border-2 border-stone-200 shadow-inner group">
                  {qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt="Paytm UPI QR Code for Kinderbee International Preschool" 
                      className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto"
                    />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center text-stone-400">
                      <QrCode className="w-12 h-12 animate-pulse" />
                    </div>
                  )}
                  
                  {/* Subtle Center Logo Stamp */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 bg-white/95 rounded-full p-1 shadow-md border border-stone-200 flex items-center justify-center">
                      <span className="text-[9px] font-black text-[#E1007A]">KB</span>
                    </div>
                  </div>
                </div>

                {/* Beneficiary Details */}
                <div className="space-y-2 text-left bg-stone-50/80 rounded-2xl p-4 border border-stone-200 text-xs">
                  <div>
                    <span className="text-stone-400 font-medium block text-[10px] uppercase">Beneficiary Name</span>
                    <span className="font-bold text-stone-900 text-sm">{beneficiaryName}</span>
                  </div>
                  
                  <div className="pt-2 border-t border-stone-200/70 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-stone-400 font-medium block text-[10px] uppercase">UPI ID</span>
                      <span className="font-mono font-bold text-stone-900 text-sm select-all">{upiId}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(upiId)}
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-medium text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-2xs"
                    >
                      {copiedUPI ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-500" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Mobile Direct Pay UPI App Button */}
                <div className="pt-1">
                  <a
                    href={upiUri}
                    className="w-full bg-gradient-to-r from-[#002E6E] via-[#0055A5] to-[#00BAF2] hover:opacity-95 text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Pay by Any UPI App (Mobile)</span>
                  </a>
                  <p className="text-[11px] text-stone-500 mt-2">
                    Tap above if browsing on a mobile device to launch Google Pay, PhonePe, Paytm, or BHIM directly.
                  </p>
                </div>

                {/* Supported App Badges */}
                <div className="border-t border-stone-100 pt-3">
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-2">
                    Compatible with all UPI Applications
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-stone-600">
                    <span className="px-2.5 py-1 bg-stone-100 rounded-md">Paytm</span>
                    <span className="px-2.5 py-1 bg-stone-100 rounded-md">Google Pay</span>
                    <span className="px-2.5 py-1 bg-stone-100 rounded-md">PhonePe</span>
                    <span className="px-2.5 py-1 bg-stone-100 rounded-md">BHIM UPI</span>
                    <span className="px-2.5 py-1 bg-stone-100 rounded-md">Cred</span>
                    <span className="px-2.5 py-1 bg-stone-100 rounded-md">Any NetBanking</span>
                  </div>
                </div>
              </div>

              {/* Instructions Box */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3 text-xs text-stone-700">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#E1007A]" />
                  <span>Important Payment Instructions</span>
                </h3>
                <p className="text-stone-600">Before completing the payment, please:</p>
                <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed text-stone-700">
                  <li>Confirm the beneficiary name displayed in your UPI application is <strong>kinderbee international preschool</strong>.</li>
                  <li>Enter only the exact amount communicated in your fee confirmation or invoice.</li>
                  <li>Mention the applicant’s name or admission number in the payment note/remarks, where available.</li>
                  <li>Retain the 12-digit UPI transaction reference / UTR number for immediate submission.</li>
                </ol>
                <div className="border-t border-stone-100 pt-3 text-[11px] text-stone-500 space-y-1">
                  <p className="text-rose-600 font-semibold">Security Warning: Never share your UPI PIN, OTP or banking passwords with anyone.</p>
                  <p>
                    By proceeding with payment, you confirm that you have reviewed the applicable fee details and our{' '}
                    <button 
                      onClick={() => onNavigate('cancellation-refund')} 
                      className="text-[#E1007A] underline font-semibold cursor-pointer"
                    >
                      Cancellation and Refund Policy
                    </button>.
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: FEE DETAILS & TRANSACTION REFERENCE SUBMISSION */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* STEP 1: Customizer / Fee Details */}
              <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-pink-100 text-[#E1007A] flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">Fee & Applicant Details</h2>
                      <p className="text-xs text-stone-500">Configure your specific programme and amount to generate the exact QR code.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Applicant / Child / Learner Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#E1007A] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Application or Admission Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={admissionNumber}
                      onChange={(e) => setAdmissionNumber(e.target.value)}
                      placeholder="e.g. KB-2026-0842"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#E1007A] focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Programme or Fee Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={programme}
                      onChange={(e) => handleProgrammeChange(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#E1007A] focus:border-transparent outline-none bg-white cursor-pointer"
                    >
                      {programmeOptions.map((opt, i) => (
                        <option key={i} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <label className="block text-xs font-semibold text-stone-700">
                      Payable Amount (₹) <span className="text-rose-500">*</span>
                    </label>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      {['4999', '6000', '15000', '18000', '25000', '50000'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => { setAmount(preset); setCustomAmount(''); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            amount === preset && !customAmount
                              ? 'bg-[#E1007A] text-white'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          ₹{Number(preset).toLocaleString('en-IN')}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => { setCustomAmount(amount); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          customAmount ? 'bg-[#E1007A] text-white' : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        Custom Amount
                      </button>
                    </div>

                    <div className="relative">
                      <IndianRupee className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="number"
                        min="1"
                        required
                        value={customAmount || amount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setAmount(e.target.value);
                        }}
                        placeholder="Enter payable amount in INR"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:ring-2 focus:ring-[#E1007A] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2: Transaction-Reference Submission Form */}
              <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">Payment Confirmation & UTR Submission</h2>
                      <p className="text-xs text-stone-500">
                        After completing the UPI transfer, enter your 12-digit transaction ID to receive an official acknowledgement.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmission} className="space-y-4">
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        12-Digit UPI Transaction ID / UTR / Reference No. <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={upiRefNumber}
                        onChange={(e) => setUpiRefNumber(e.target.value.trim())}
                        placeholder="e.g. 425689123456 (from your Google Pay/PhonePe/Paytm screen)"
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm font-mono font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
                      />
                      <span className="text-[11px] text-stone-500 mt-1 block">
                        Found under "UPI transaction ID", "UTR" or "Bank Reference Number" in your payment app.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Payer Mobile Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                          <input
                            type="tel"
                            required
                            value={payerPhone}
                            onChange={(e) => setPayerPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#E1007A] focus:border-transparent outline-none bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Payer Email Address (For Receipt)
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                          <input
                            type="email"
                            value={payerEmail}
                            onChange={(e) => setPayerEmail(e.target.value)}
                            placeholder="parent@gmail.com"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#E1007A] focus:border-transparent outline-none bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Date of Payment
                        </label>
                        <input
                          type="date"
                          value={paymentDate}
                          onChange={(e) => setPaymentDate(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#E1007A] focus:border-transparent outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Additional Remarks / Payment Note
                        </label>
                        <input
                          type="text"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="e.g. Paid via PhonePe / Admission batch"
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#E1007A] focus:border-transparent outline-none bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mandatory Cancellation & No-Refund Agreement Checkbox */}
                  <div className="bg-pink-50/60 border border-pink-100 rounded-xl p-3.5 space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        required
                        checked={agreedToPolicy}
                        onChange={(e) => setAgreedToPolicy(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-stone-300 text-[#E1007A] focus:ring-[#E1007A] cursor-pointer"
                      />
                      <span className="text-xs text-stone-700 leading-relaxed font-medium">
                        I confirm that the applicant details, programme and payable amount of <strong className="text-stone-900">₹{Number(effectiveAmount || 0).toLocaleString('en-IN')}</strong> are correct. I have reviewed and agree to the{' '}
                        <button
                          type="button"
                          onClick={() => onNavigate('cancellation-refund')}
                          className="text-[#E1007A] underline font-bold hover:text-pink-800"
                        >
                          Cancellation and No-Refund Policy
                        </button>,{' '}
                        <button
                          type="button"
                          onClick={() => onNavigate('terms-conditions')}
                          className="text-[#E1007A] underline font-bold hover:text-pink-800"
                        >
                          Terms and Conditions
                        </button>, and{' '}
                        <button
                          type="button"
                          onClick={() => onNavigate('privacy-policy')}
                          className="text-[#E1007A] underline font-bold hover:text-pink-800"
                        >
                          Privacy Policy
                        </button>.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !agreedToPolicy || !upiRefNumber}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying & Recording Reference...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Payment Confirmation Reference</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Payment Assistance Contacts & Help */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                  <HelpCircle className="w-4 h-4 text-[#E1007A]" />
                  <span>Need Assistance with your Fee Payment?</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                    <div className="w-9 h-9 rounded-lg bg-pink-50 text-[#E1007A] flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-semibold">Payment Helpline</span>
                      <a href="tel:+918122344040" className="font-bold text-stone-900 hover:text-[#E1007A]">
                        81223 44040 / 99013 32233
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                    <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-semibold">Accounts Desk Email</span>
                      <a href="mailto:kinderbeeschools@gmail.com" className="font-bold text-stone-900 hover:text-[#E1007A] truncate block max-w-[180px]">
                        kinderbeeschools@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Support hours: Monday to Saturday (9:30 AM to 5:30 PM IST). In case of UPI timeout or debited amount without instant confirmation, transactions are reconciled within 24 business hours.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
