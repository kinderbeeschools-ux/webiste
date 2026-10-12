// ₹99 one-to-one consultation: shared by the booking form, the server and the admin panel.

// Business UPI account (the same one the fee payment page uses)
export const UPI_ID = 'paytm.s1e1uzf@pty';
export const UPI_NAME = 'kinderbee international preschool';

export const CONSULT_FEE = 99;

export const CONSULT_CATEGORIES = [
  'Preschool Admissions',
  'Preschool Partnership / Franchise',
  'Teacher Training',
  'Other Enquiry',
] as const;

export const CONSULT_SLOTS = [
  '10:00 AM – 11:00 AM',
  '11:00 AM – 12:00 PM',
  '12:00 PM – 1:00 PM',
  '2:00 PM – 3:00 PM',
  '3:00 PM – 4:00 PM',
  '4:00 PM – 5:00 PM',
  '5:00 PM – 6:00 PM',
] as const;

// Bookable up to this many days ahead
export const CONSULT_MAX_DAYS = 60;

export type ConsultStatus =
  | 'pending_payment'
  | 'verification_pending'
  | 'paid'
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | 'payment_failed';

export const CONSULT_STATUS: Record<ConsultStatus, { label: string; color: string; note: string }> = {
  pending_payment: { label: 'Pending Payment', color: 'bg-amber-100 text-amber-800', note: 'Pay ₹99 by UPI and submit the 12-digit UTR to confirm your slot.' },
  verification_pending: { label: 'Payment Verification Pending', color: 'bg-sky-100 text-sky-800', note: 'We received your UTR. Our team checks it against the bank statement, usually within one working day.' },
  paid: { label: 'Paid', color: 'bg-emerald-100 text-emerald-800', note: 'Payment verified. Our team will call or WhatsApp you to confirm the consultation time.' },
  scheduled: { label: 'Consultation Scheduled', color: 'bg-indigo-100 text-indigo-800', note: 'Your consultation is scheduled. We will contact you at the confirmed time.' },
  completed: { label: 'Completed', color: 'bg-stone-200 text-stone-700', note: 'This consultation is complete. Thank you for speaking with Kinderbee.' },
  cancelled: { label: 'Cancelled', color: 'bg-stone-200 text-stone-600', note: 'This booking was cancelled. Contact us on WhatsApp if you have questions.' },
  payment_failed: { label: 'Payment Failed', color: 'bg-red-100 text-red-700', note: 'We could not match this payment. Please check the UTR and submit it again, or contact us on WhatsApp.' },
};

export interface Consultation {
  ref: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  category: string;
  preferredDate: string;
  timeSlot: string;
  requirement: string;
  amount: number;
  status: ConsultStatus;
  upiRef?: string;
  paymentId?: string;
  scheduledAt?: string;
  adminNotes?: string;
  createdAt: string;
}

export const upiLink = (ref: string) =>
  `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${CONSULT_FEE}&cu=INR&tn=${encodeURIComponent(`Consultation ${ref}`)}`;
