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
  status: 'pending' | 'reviewed' | 'contacted' | 'closed';
  notes: string;
  aiSummary?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  views: number;
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
  popupEnabled?: boolean;
  popupDelay?: number;
  popupScrollTrigger?: boolean;
  popupScrollPercent?: number;
  popupTag?: string;
  popupTitle?: string;
  popupSubtitle?: string;
  popupImageUrl?: string;
  popupImageAlt?: string;
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
