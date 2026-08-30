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

