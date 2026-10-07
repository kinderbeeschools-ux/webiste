export interface EnquiryFields {
  name: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  budget?: string;
  partnershipModel?: string;
  courseOfInterest?: string;
  organization?: string;
  investmentInterest?: string;
  message?: string;
  [key: string]: any;
}

export interface Enquiry {
  id: string;
  type: string;
  fields: EnquiryFields;
  status: LeadStage;
  nextFollowUp?: string;
  followUpType?: string;
  lostReason?: string;
  touchCount?: number;
  notes: string;
  aiSummary?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  category: string;
  tags?: string[];
  status?: 'Published' | 'Draft' | 'Trash';
  excerpt: string;
  content: string;
  image: string;
  imageStoragePath?: string;
  author: string;
  date: string;
  readTime: string;
  views: number;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  section: string;
}

export interface SystemSettings {
  phone: string;
  email: string;
  officeAddress: string;
  whatsappNumber: string;
  facebookUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  workingHours: string;
  logoUrl?: string;
  logoText?: string;
  logoSubtext?: string;
  footerTagline?: string;
  footerCopyright?: string;
  popupEnabled?: boolean;
  popupDelay?: number;
  popupScrollTrigger?: boolean;
  popupScrollPercent?: number;
  popupTag?: string;
  popupTitle?: string;
  popupSubtitle?: string;
  popupImageUrl?: string;
  popupImageAlt?: string;
  // SEO & Headings Management
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  homeHeroH1?: string;
  homeHeroH2?: string;
  homeHeroSubtitle?: string;
  aboutHeroH1?: string;
  aboutHeroSubtitle?: string;
  franchiseHeroH1?: string;
  franchiseHeroSubtitle?: string;
  fwaHeroH1?: string;
  fwaHeroSubtitle?: string;
  investorsHeroH1?: string;
  investorsHeroSubtitle?: string;
  blogsHeroH1?: string;
  blogsHeroSubtitle?: string;
  contactHeroH1?: string;
  contactHeroSubtitle?: string;
  customHeaderScripts?: string;
  googleAnalyticsId?: string;
}

export interface PageConfig {
  id: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  badgeText: string;
  content1: string;
}

export interface PaymentRecord {
  id: string;
  applicantName: string;
  admissionNumber?: string;
  programme: string;
  amount: number | string;
  upiRefNumber: string;
  payerPhone: string;
  payerEmail: string;
  paymentDate?: string;
  verifiedAt?: string;
  notes?: string;
  status: 'pending_verification' | 'verified' | 'rejected';
  createdAt: string;
}


// CRM pipeline stage of an enquiry (stored in its `status`)
export type LeadStage = 'new' | 'contacted' | 'interested' | 'counselling' | 'visit' | 'application' | 'admission' | 'lost';

export interface LeadActivity {
  id: number;
  leadKey: string;
  enquiryId?: string;
  type: 'created' | 'stage' | 'follow_up' | 'note' | 'call' | 'whatsapp' | 'email' | 'payment';
  detail: string;
  createdAt: string;
}

// Enrolled child, created when a lead is admitted (id like KB-2026-00001)
export interface Student {
  id: string;
  childName: string;
  dob?: string;
  gender?: string;
  className?: string;
  branch?: string;
  academicYear?: string;
  admissionDate?: string;
  parentName: string;
  parentRelation?: string;
  parentPhone: string;
  parentEmail?: string;
  address?: string;
  emergencyContact?: string;
  medicalInfo?: string;
  previousSchool?: string;
  enquiryId?: string;
  createdAt: string;
}

// Investment / joint-venture opportunity listed on the Joint Ventures page (managed in the admin panel)
export interface OpportunityRow { label: string; value: string }
export interface Opportunity {
  id: string;
  title: string;
  location: string;
  category: string;          // e.g. "Land / Development"
  status: string;            // e.g. "Open for partnership"
  featured: boolean;
  published: boolean;
  order: number;
  headline: string;          // main statement on the detail view
  summary: string;           // short text for cards
  area?: string;
  investmentRequirement?: string;
  partnershipModel?: string;
  potential?: string;
  timeline?: string;
  overview: string[];        // paragraphs
  details: OpportunityRow[];
  detailsNote?: string;
  terms: OpportunityRow[];
  termsNote?: string;
  development: string[];     // paragraphs
  partnershipOptions: OpportunityRow[];
  images: { url: string; caption: string }[];
  mapUrl?: string;
  contactPhone?: string;
  documents?: string;
  eligibility?: string;
  disclaimer?: string;
}
