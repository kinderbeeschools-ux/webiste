import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  HelpCircle, 
  LogOut, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Edit, 
  Plus, 
  X, 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Search,
  Globe,
  Image as ImageIcon,
  Tag,
  Code,
  Layers,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  ExternalLink,
  Eye,
  MessageSquare,
  Wrench,
  Palette,
  Check,
  AlertCircle,
  Clock,
  User,
  FolderOpen,
  ArrowUpRight,
  RefreshCw,
  Sliders,
  PanelLeftClose,
  PanelLeft,
  Home,
  ShoppingBag,
  CreditCard,
  TrendingUp,
  Megaphone,
  Boxes,
  Zap,
  Puzzle,
  Archive,
  RotateCcw,
  Sparkle
} from 'lucide-react';
import { Enquiry, BlogPost, FAQItem, SystemSettings } from '../types';
import { GutenbergEditor } from '../components/admin/GutenbergEditor';
import { WpCategoriesTab, CategoryItem } from '../components/admin/WpCategoriesTab';
import { WpTagsTab, TagItem } from '../components/admin/WpTagsTab';
import { WpFullPostView } from '../components/WpFullPostView';

interface AdminDashboardProps {
  adminToken: string;
  onLogout: () => void;
  onVisitSite?: () => void;
  settings: SystemSettings | null;
  onUpdateSettings: (newSettings: SystemSettings) => void;
}

type WpMenuTab = 
  | 'dashboard' 
  | 'sitekit'
  | 'stats'
  | 'astra'
  | 'elementor'
  | 'jetpack'
  | 'posts' 
  | 'categories' 
  | 'tags' 
  | 'media' 
  | 'pages' 
  | 'comments'
  | 'bulkdelete'
  | 'woocommerce'
  | 'products'
  | 'payments'
  | 'analytics'
  | 'marketing'
  | 'wpforms'
  | 'uae'
  | 'appearance' 
  | 'plugins'
  | 'users'
  | 'tools'
  | 'enquiries' 
  | 'faqs' 
  | 'settings';


export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  adminToken, 
  onLogout,
  onVisitSite,
  settings: initialSettings, 
  onUpdateSettings 
}) => {
  const [activeTab, setActiveTab] = useState<WpMenuTab>(() => {
    const saved = localStorage.getItem('kips_admin_active_tab') as WpMenuTab;
    return saved || 'posts';
  });

  useEffect(() => {
    localStorage.setItem('kips_admin_active_tab', activeTab);
  }, [activeTab]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Users and Roles State
  interface WPUser {
    username: string;
    name: string;
    email: string;
    role: 'Administrator' | 'Editor' | 'Author' | 'Contributor';
  }

  const [users, setUsers] = useState<WPUser[]>(() => {
    const saved = localStorage.getItem('kips_wp_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        username: 'kinderbee_admin',
        name: 'KinderBee Schools Admin',
        email: 'kinderbeeschools@gmail.com',
        role: 'Administrator'
      },
      {
        username: 'admin',
        name: 'KinderBee Corporate Admin',
        email: 'info@kinderbee.in',
        role: 'Administrator'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('kips_wp_users', JSON.stringify(users));
  }, [users]);

  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Administrator' | 'Editor' | 'Author' | 'Contributor'>('Administrator');

  const [activePostCategoryFilter, setActivePostCategoryFilter] = useState('All');
  const [activePostStatusFilter, setActivePostStatusFilter] = useState<'All' | 'Published' | 'Draft' | 'Trash'>('All');
  const [activePostDateFilter, setActivePostDateFilter] = useState('All');
  const [postSearchTerm, setPostSearchTerm] = useState('');
  
  // Selection and Bulk Actions State
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [bulkActionTop, setBulkActionTop] = useState('');
  const [bulkActionBottom, setBulkActionBottom] = useState('');
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [bulkEditCategory, setBulkEditCategory] = useState('');
  const [bulkEditAuthor, setBulkEditAuthor] = useState('');
  const [bulkEditStatus, setBulkEditStatus] = useState('');
  const [bulkEditTags, setBulkEditTags] = useState('');
  
  // Inline Quick Edit State
  const [quickEditingPostId, setQuickEditingPostId] = useState<string | null>(null);
  const [quickEditForm, setQuickEditForm] = useState<{
    id: string;
    title: string;
    slug: string;
    date: string;
    author: string;
    category: string;
    tags: string;
    status: 'Published' | 'Draft';
  }>({
    id: '',
    title: '',
    slug: '',
    date: '',
    author: '',
    category: '',
    tags: '',
    status: 'Published'
  });

  // Admin Notification Banner
  const [adminNotice, setAdminNotice] = useState<{
    type: 'success' | 'info' | 'error';
    message: string;
    undoAction?: () => void;
  } | null>(null);

  // Full Page Blog View Modal State
  const [viewingFullPost, setViewingFullPost] = useState<BlogPost | null>(null);

  // Quick Draft State
  const [quickDraftTitle, setQuickDraftTitle] = useState('');
  const [quickDraftContent, setQuickDraftContent] = useState('');
  const [quickDraftSuccess, setQuickDraftSuccess] = useState(false);

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  
  // Initial 13 authentic posts matching WordPress screenshot #1
  const initialDefaultBlogs: BlogPost[] = [
    {
      id: 'wp_post_1',
      title: 'Understanding METAR and TAF Reports for Student Pilots',
      slug: 'understanding-metar-and-taf-reports-for-student-pilots',
      category: 'Pedagogy & Curriculum',
      author: 'Verita2023',
      date: '2026-08-30',
      status: 'Draft',
      tags: ['METAR', 'TAF', 'Student Pilots'],
      views: 42,
      readTime: '5 min read',
      excerpt: 'Comprehensive meteorological decoding guide for student pilots and foundational aviation trainees.',
      content: '## Understanding METAR and TAF Reports\n\nMeteorological Aerodrome Reports (METAR) and Terminal Aerodrome Forecasts (TAF) are essential tools for flight planning and foundational aviation curriculum.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'wp_post_2',
      title: 'Life After CPL: What Pilots Do While Waiting',
      slug: 'life-after-cpl-what-pilots-do-while-waiting',
      category: 'Franchise & Business',
      author: 'Verita2023',
      date: '2026-08-29',
      status: 'Published',
      tags: ['CPL', 'Aviation Career'],
      views: 312,
      readTime: '6 min read',
      excerpt: 'Navigating transition periods, flight instructor ratings, and commercial interview preparations.',
      content: '## Life After CPL\n\nSecuring a Commercial Pilot License is a major milestone. Here is what pilots do while building command hours.',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'wp_post_3',
      title: 'How DGCA Flying Hour Requirements Work for a CPL',
      slug: 'how-dgca-flying-hour-requirements-work-for-a-cpl',
      category: 'Policy & NEP 2020',
      author: 'Verita2023',
      date: '2026-08-29',
      status: 'Published',
      tags: ['DGCA', 'Requirements'],
      views: 520,
      readTime: '7 min read',
      excerpt: 'Detailed breakdown of the 200 flying hours required by DGCA including solo, cross-country, and night flying.',
      content: '## DGCA Flying Hour Requirements\n\nUnderstanding the regulatory framework and flight log compliance in India.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'wp_post_4',
      title: 'RTR(A) License Explained for Indian CPL Students',
      slug: 'rtra-license-explained-for-indian-cpl-students',
      category: 'Pedagogy & Curriculum',
      author: 'Verita2023',
      date: '2026-08-29',
      status: 'Published',
      tags: ['RTR(A)', 'Radio Telephony'],
      views: 290,
      readTime: '4 min read',
      excerpt: 'Everything you need to know about passing the WPC RTR(A) examination on the first attempt.',
      content: '## Radio Telephony Restricted License\n\nAviation communication protocols, standard terminology, and DGCA requirements.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'wp_post_5',
      title: 'How Airlines in India Recruit New Commercial Pilots',
      slug: 'how-airlines-in-india-recruit-new-commercial-pilots',
      category: 'Franchise & Business',
      author: 'Verita2023',
      date: '2026-08-29',
      status: 'Published',
      tags: ['Airlines', 'Recruitment'],
      views: 640,
      readTime: '5 min read',
      excerpt: 'From psychometric tests and simulator checks to technical interviews with IndiGo, Air India, and Akasa.',
      content: '## Commercial Airline Pilot Recruitment in India\n\nInsights into cadet programs, type ratings, and direct entry captain tests.',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'wp_post_6',
      title: 'Fitness and Diet Tips for Student Pilots in Training',
      slug: 'fitness-and-diet-tips-for-student-pilots-in-training',
      category: 'Early Childhood Development',
      author: 'Verita2023',
      date: '2026-08-29',
      status: 'Published',
      tags: ['Fitness', 'Diet', 'Health'],
      views: 180,
      readTime: '4 min read',
      excerpt: 'Maintaining Class 1 medical standards, circadian rhythm optimization, and nutrition during flight academy.',
      content: '## Physical and Mental Fitness for Aviators\n\nStaying sharp in high-G environments and long flight schedules.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'wp_post_7',
      title: 'What DGCA Exams Look Like and How to Prepare',
      slug: 'what-dgca-exams-look-like-and-how-to-prepare',
      category: 'Policy & NEP 2020',
      author: 'Verita2023',
      date: '2026-08-29',
      status: 'Published',
      tags: ['Exams', 'Navigation', 'Meteorology'],
      views: 410,
      readTime: '6 min read',
      excerpt: 'Air Navigation, Aviation Meteorology, Air Regulations, Technical General and Specific exam strategies.',
      content: '## Preparing for DGCA Written Examinations\n\nSyllabus analysis and recommended study routines.',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'wp_post_8',
      title: "A Student Pilot's Guide to Logbook and DGCA Documentation",
      slug: 'a-student-pilots-guide-to-logbook-and-dgca-documentation',
      category: 'Pedagogy & Curriculum',
      author: 'Verita2023',
      date: '2026-08-29',
      status: 'Published',
      tags: ['Logbook', 'Documentation'],
      views: 230,
      readTime: '4 min read',
      excerpt: 'Accurate flight entry formats, cross-country entries, and eGCA portal synchronization.',
      content: '## Logbook Maintenance\n\nMaintaining error-free flight logs for seamless license issuance.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'wp_post_9',
      title: 'What Makes Chennai a Good Location for Flight Training',
      slug: 'what-makes-chennai-a-good-location-for-flight-training',
      category: 'Franchise & Business',
      author: 'Verita2023',
      date: '2026-08-29',
      status: 'Published',
      tags: ['Chennai', 'Flight Training'],
      views: 380,
      readTime: '5 min read',
      excerpt: 'Airspace diversity, coastal weather conditions, and proximity to major international airports.',
      content: '## Flight Academy Location Analysis\n\nWhy Southern coastal airspace provides optimal flying weather year-round.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'wp_post_10',
      title: 'Understanding METAR and TAF Reports for Student Pilots (Archive)',
      slug: 'understanding-metar-and-taf-reports-for-student-pilots-published',
      category: 'Pedagogy & Curriculum',
      author: 'Verita2023',
      date: '2026-08-29',
      status: 'Published',
      tags: ['METAR', 'Weather'],
      views: 890,
      readTime: '5 min read',
      excerpt: 'Essential aviation weather decoding for cross-country and instrument flight planning.',
      content: '## METAR and TAF Reports Guide\n\nMastering surface observations and aerodrome forecasts.',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'wp_post_11',
      title: 'Female Pilots in India: Breaking a Male-Dominated Cockpit',
      slug: 'female-pilots-in-india-breaking-a-male-dominated-cockpit',
      category: 'Franchise & Business',
      author: 'Verita2023',
      date: '2026-08-29',
      status: 'Published',
      tags: ['Women in Aviation', 'Leadership'],
      views: 750,
      readTime: '5 min read',
      excerpt: 'India leads the world with 15% female commercial pilots, double the global average.',
      content: '## Women Aviators in India\n\nCelebrating milestone achievements and empowering the next generation of aviators.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'wp_post_12',
      title: 'How Simulator Training Complements Real Flight Hours',
      slug: 'how-simulator-training-complements-real-flight-hours',
      category: 'Pedagogy & Curriculum',
      author: 'Verita2023',
      date: '2026-08-29',
      status: 'Published',
      tags: ['Simulator', 'Flight Hours'],
      views: 310,
      readTime: '4 min read',
      excerpt: 'Maximizing emergency procedures, glass cockpit familiarization, and instrument rating skills.',
      content: '## Advanced Synthetic Flight Training Devices\n\nBridging classroom theory and live cockpit decision-making.',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'wp_post_13',
      title: 'What Is a Type Rating and When Do Pilots Need One',
      slug: 'what-is-a-type-rating-and-when-do-pilots-need-one',
      category: 'Early Childhood Development',
      author: 'Verita2023',
      date: '2026-08-29',
      status: 'Published',
      tags: ['Type Rating', 'A320', 'B737'],
      views: 460,
      readTime: '5 min read',
      excerpt: 'Airbus A320 vs Boeing 737 type ratings, self-sponsored vs airline sponsored options.',
      content: '## Commercial Aircraft Type Rating Overview\n\nTransitioning from multi-engine piston aircraft to modern transport turbofans.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    return initialDefaultBlogs.map(b => b.author === 'Verita2023' ? { ...b, author: 'KinderBee' } : b);
  });
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  
  const [settingsForm, setSettingsForm] = useState<SystemSettings>(initialSettings || {
    phone: '', 
    email: '', 
    officeAddress: '', 
    whatsappNumber: '', 
    facebookUrl: '', 
    linkedinUrl: '', 
    instagramUrl: '', 
    workingHours: '',
    logoUrl: '',
    logoText: '',
    logoSubtext: '',
    footerTagline: '',
    footerCopyright: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    homeHeroH1: '',
    homeHeroH2: '',
    homeHeroSubtitle: '',
    aboutHeroH1: '',
    aboutHeroSubtitle: '',
    franchiseHeroH1: '',
    franchiseHeroSubtitle: '',
    fwaHeroH1: '',
    fwaHeroSubtitle: '',
    investorsHeroH1: '',
    investorsHeroSubtitle: '',
    blogsHeroH1: '',
    blogsHeroSubtitle: '',
    contactHeroH1: '',
    contactHeroSubtitle: '',
    customHeaderScripts: '',
    googleAnalyticsId: ''
  });

  const [settingsSaved, setSettingsSaved] = useState(false);

  // AI Email Draft Modal State
  const [selectedEnquiryForEmail, setSelectedEnquiryForEmail] = useState<Enquiry | null>(null);
  const [emailDraftText, setEmailDraftText] = useState('');
  const [emailDraftLoading, setEmailDraftLoading] = useState(false);

  // Blog CRUD state
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [currentBlogForm, setCurrentBlogForm] = useState<Partial<BlogPost>>({});

  // FAQ CRUD state
  const [isEditingFaq, setIsEditingFaq] = useState(false);
  const [currentFaqForm, setCurrentFaqForm] = useState<Partial<FAQItem>>({});

  // Media upload modal / library helper
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [mediaList, setMediaList] = useState<string[]>([
    'https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Logo.png',
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800'
  ]);

  // Categories & Tags State
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem('kb_categories_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing categories:', e);
      }
    }
    return [
      {
        id: 'cat_1',
        name: 'Pedagogy & Curriculum',
        slug: 'pedagogy-curriculum',
        parent: 'None',
        description: 'Nordic early learning, STEAM discovery, and experiential child development methodology.',
        count: 4,
        metaTitle: 'Preschool Pedagogy & Curriculum - KinderBee',
        metaDesc: 'Explore play-based curriculum insights, Nordic teaching methods, and experiential tools.',
        index: true
      },
      {
        id: 'cat_2',
        name: 'Franchise & Business',
        slug: 'franchise-business',
        parent: 'None',
        description: 'Zero royalty franchise model, ROI projections, capex breakdowns, and entrepreneur guides.',
        count: 5,
        metaTitle: 'Preschool Franchise & Business Models - KinderBee',
        metaDesc: 'Comprehensive guide to launching a zero royalty preschool in India.',
        index: true
      },
      {
        id: 'cat_3',
        name: 'Policy & NEP 2020',
        slug: 'policy-nep-2020',
        parent: 'None',
        description: 'Government compliance, ECCE framework alignment, and NEP 2020 pedagogical integration.',
        count: 3,
        metaTitle: 'NEP 2020 ECCE Policy Framework - KinderBee',
        metaDesc: 'How to align early childhood centers with National Education Policy 2020 standards.',
        index: true
      },
      {
        id: 'cat_4',
        name: 'Early Childhood Development',
        slug: 'early-childhood-development',
        parent: 'None',
        description: 'Cognitive growth, sensory milestones, and emotional resilience in the first 2,000 days.',
        count: 3,
        metaTitle: 'Early Childhood Cognitive Growth - KinderBee',
        metaDesc: 'Research-backed insights on child neuroscience and sensory development.',
        index: true
      }
    ];
  });

  const [tagsList, setTagsList] = useState<TagItem[]>(() => {
    const saved = localStorage.getItem('kb_tags_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing tags:', e);
      }
    }
    return [
      {
        id: 'tag_1',
        name: 'Zero Royalty',
        slug: 'zero-royalty',
        description: '100% revenue retention franchise model for educational entrepreneurs.',
        count: 6,
        metaTitle: 'Zero Royalty Preschool Partnership - KinderBee',
        index: true
      },
      {
        id: 'tag_2',
        name: 'NEP 2020',
        slug: 'nep-2020',
        description: 'Foundational stage learning aligned with National Education Policy.',
        count: 5,
        metaTitle: 'NEP 2020 Aligned Preschools',
        index: true
      },
      {
        id: 'tag_3',
        name: 'Nordic Pedagogy',
        slug: 'nordic-pedagogy',
        description: 'Finnish-inspired outdoor and experiential learning philosophy.',
        count: 4,
        metaTitle: 'Finnish Way & Nordic Pedagogy',
        index: true
      },
      {
        id: 'tag_4',
        name: 'Teacher Training',
        slug: 'teacher-training',
        description: 'FinnishWay Academy teacher certifications and ongoing competence programs.',
        count: 3,
        metaTitle: 'Certified Preschool Educator Training',
        index: true
      },
      {
        id: 'tag_5',
        name: 'ROI & Capex',
        slug: 'roi-capex',
        description: 'Financial feasibility, breakeven analysis, and operational cost management.',
        count: 4,
        metaTitle: 'Preschool Business Financial Projections',
        index: true
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('kb_categories_list', JSON.stringify(categoriesList));
  }, [categoriesList]);

  useEffect(() => {
    localStorage.setItem('kb_tags_list', JSON.stringify(tagsList));
  }, [tagsList]);

  const headers = { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' };

  const fetchData = async () => {
    try {
      const [enqRes, blogRes, faqRes, analyticsRes, settingsRes] = await Promise.all([
        fetch('/api/enquiries', { headers }),
        fetch('/api/blogs'),
        fetch('/api/faqs'),
        fetch('/api/analytics', { headers }),
        fetch('/api/settings')
      ]);

      if (enqRes.ok) setEnquiries(await enqRes.json());
      if (blogRes.ok) setBlogs(await blogRes.json());
      if (faqRes.ok) setFaqs(await faqRes.json());
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
      if (settingsRes.ok) {
        const s = await settingsRes.json();
        setSettingsForm(prev => ({ ...prev, ...s }));
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Enquiry Status or Notes
  const handleUpdateEnquiry = async (id: string, updates: { status?: string; notes?: string }) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries(enquiries.map(e => e.id === id ? data.enquiry : e));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE', headers });
      if (res.ok) {
        setEnquiries(enquiries.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Generate AI Email Reply
  const handleGenerateAiEmail = async (enquiry: Enquiry) => {
    setSelectedEnquiryForEmail(enquiry);
    setEmailDraftLoading(true);
    setEmailDraftText('');
    try {
      const res = await fetch('/api/ai/suggest-reply', {
        method: 'POST',
        headers,
        body: JSON.stringify({ enquiryId: enquiry.id })
      });
      const data = await res.json();
      if (data.draft) {
        setEmailDraftText(data.draft);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEmailDraftLoading(false);
    }
  };

  // Save Settings & SEO
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers,
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (data.success) {
        onUpdateSettings(data.settings);
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  // Save Blog Post (Daily Posting & SEO Rich)
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentBlogForm.id && blogs.some(b => b.id === currentBlogForm.id) ? 'PUT' : 'POST';
    const url = method === 'PUT' ? `/api/blogs/${currentBlogForm.id}` : '/api/blogs';

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          ...currentBlogForm,
          views: currentBlogForm.views || 0,
          date: currentBlogForm.date || new Date().toISOString().split('T')[0],
          readTime: currentBlogForm.readTime || '5 min read'
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        setIsEditingBlog(false);
        setCurrentBlogForm({});
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quick Draft Save
  const handleQuickDraftSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDraftTitle.trim()) return;

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: quickDraftTitle,
          excerpt: quickDraftContent.slice(0, 140) || 'Quick draft article created from WordPress Admin Dashboard.',
          content: quickDraftContent || quickDraftTitle,
          category: 'Pedagogy & Curriculum',
          author: 'Admin Editorial Desk',
          date: new Date().toISOString().split('T')[0],
          readTime: '4 min read',
          views: 1,
          image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800'
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        setQuickDraftTitle('');
        setQuickDraftContent('');
        setQuickDraftSuccess(true);
        setTimeout(() => setQuickDraftSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE', headers });
      if (res.ok) {
        setBlogs(blogs.filter(b => b.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save FAQ
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentFaqForm.id && faqs.some(f => f.id === currentFaqForm.id) ? 'PUT' : 'POST';
    const url = method === 'PUT' ? `/api/faqs/${currentFaqForm.id}` : '/api/faqs';

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(currentFaqForm)
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        setIsEditingFaq(false);
        setCurrentFaqForm({});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Delete this FAQ item?')) return;
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE', headers });
      if (res.ok) {
        setFaqs(faqs.filter(f => f.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered blogs for posts view
  const filteredBlogs = blogs.filter(b => {
    // Status filter
    let matchStatus = true;
    if (activePostStatusFilter === 'All') {
      matchStatus = b.status !== 'Trash';
    } else if (activePostStatusFilter === 'Published') {
      matchStatus = b.status !== 'Draft' && b.status !== 'Trash';
    } else if (activePostStatusFilter === 'Draft') {
      matchStatus = b.status === 'Draft';
    } else if (activePostStatusFilter === 'Trash') {
      matchStatus = b.status === 'Trash';
    }

    // Category filter
    const matchCat = activePostCategoryFilter === 'All' || b.category === activePostCategoryFilter;

    // Date filter
    const matchDate = activePostDateFilter === 'All' || (b.date && b.date.startsWith(activePostDateFilter));

    // Search filter
    const matchSearch = !postSearchTerm || 
      b.title.toLowerCase().includes(postSearchTerm.toLowerCase()) || 
      (b.author && b.author.toLowerCase().includes(postSearchTerm.toLowerCase())) ||
      (b.tags && b.tags.some(t => t.toLowerCase().includes(postSearchTerm.toLowerCase())));

    return matchStatus && matchCat && matchDate && matchSearch;
  });

  const isAllSelected = filteredBlogs.length > 0 && selectedPostIds.length === filteredBlogs.length;
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(filteredBlogs.map(b => b.id));
    }
  };

  const toggleSelectPost = (id: string) => {
    if (selectedPostIds.includes(id)) {
      setSelectedPostIds(selectedPostIds.filter(item => item !== id));
    } else {
      setSelectedPostIds([...selectedPostIds, id]);
    }
  };

  const handleApplyBulkAction = (action: string) => {
    if (!action || action === 'Bulk actions') return;
    if (selectedPostIds.length === 0) {
      alert('Please select one or more posts first using the checkboxes.');
      return;
    }

    if (action === 'trash' || action === 'Move to Trash') {
      const count = selectedPostIds.length;
      const trashedIds = [...selectedPostIds];

      // Sync to backend
      Promise.all(trashedIds.map(id => 
        fetch(`/api/blogs/${id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ status: 'Trash' })
        })
      )).then(() => {
        fetchData();
      }).catch(err => console.error('Bulk trash error:', err));

      setBlogs(blogs.map(b => trashedIds.includes(b.id) ? { ...b, status: 'Trash' } : b));
      setSelectedPostIds([]);
      setAdminNotice({
        type: 'success',
        message: `${count} post${count > 1 ? 's' : ''} moved to the Trash.`,
        undoAction: () => {
          Promise.all(trashedIds.map(id => 
            fetch(`/api/blogs/${id}`, {
              method: 'PUT',
              headers,
              body: JSON.stringify({ status: 'Published' })
            })
          )).then(() => {
            fetchData();
          }).catch(err => console.error('Bulk untrash error:', err));

          setBlogs(blogs.map(b => trashedIds.includes(b.id) ? { ...b, status: 'Published' } : b));
          setAdminNotice(null);
        }
      });
    } else if (action === 'edit' || action === 'Bulk edit' || action === 'Edit') {
      setIsBulkEditing(true);
    } else if (action === 'restore' || action === 'Restore') {
      const count = selectedPostIds.length;
      const restoreIds = [...selectedPostIds];

      // Sync to backend
      Promise.all(restoreIds.map(id => 
        fetch(`/api/blogs/${id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ status: 'Published' })
        })
      )).then(() => {
        fetchData();
      }).catch(err => console.error('Bulk restore error:', err));

      setBlogs(blogs.map(b => restoreIds.includes(b.id) ? { ...b, status: 'Published' } : b));
      setSelectedPostIds([]);
      setAdminNotice({
        type: 'success',
        message: `${count} post${count > 1 ? 's' : ''} restored from the Trash.`
      });
    } else if (action === 'delete' || action === 'Delete permanently') {
      if (!confirm(`Permanently delete ${selectedPostIds.length} item(s)? This cannot be undone.`)) return;
      const count = selectedPostIds.length;
      const deleteIds = [...selectedPostIds];

      // Sync to backend
      Promise.all(deleteIds.map(id => 
        fetch(`/api/blogs/${id}`, {
          method: 'DELETE',
          headers
        })
      )).then(() => {
        fetchData();
      }).catch(err => console.error('Bulk delete error:', err));

      setBlogs(blogs.filter(b => !deleteIds.includes(b.id)));
      setSelectedPostIds([]);
      setAdminNotice({
        type: 'success',
        message: `${count} post${count > 1 ? 's' : ''} permanently deleted.`
      });
    }
  };

  const handleSaveBulkEdit = () => {
    if (selectedPostIds.length === 0) {
      setIsBulkEditing(false);
      return;
    }
    const count = selectedPostIds.length;
    const updatedBlogs = blogs.map(b => {
      if (!selectedPostIds.includes(b.id)) return b;
      const updated = { ...b };
      if (bulkEditCategory) updated.category = bulkEditCategory;
      if (bulkEditAuthor) updated.author = bulkEditAuthor;
      if (bulkEditStatus && (bulkEditStatus === 'Published' || bulkEditStatus === 'Draft')) {
        updated.status = bulkEditStatus as 'Published' | 'Draft';
      }
      if (bulkEditTags) {
        const newTags = bulkEditTags.split(',').map(t => t.trim()).filter(Boolean);
        updated.tags = Array.from(new Set([...(updated.tags || []), ...newTags]));
      }
      return updated;
    });

    // Save to server in parallel
    Promise.all(selectedPostIds.map(id => {
      const blogToSave = updatedBlogs.find(ub => ub.id === id);
      if (!blogToSave) return Promise.resolve();
      return fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          category: blogToSave.category,
          author: blogToSave.author,
          status: blogToSave.status,
          tags: blogToSave.tags
        })
      });
    })).then(() => {
      fetchData();
    }).catch(err => console.error('Bulk edit save error:', err));

    setBlogs(updatedBlogs);
    setIsBulkEditing(false);
    setSelectedPostIds([]);
    setAdminNotice({
      type: 'success',
      message: `${count} post${count > 1 ? 's' : ''} updated in bulk.`
    });
  };

  const handleStartQuickEdit = (b: BlogPost) => {
    setQuickEditingPostId(b.id);
    setQuickEditForm({
      id: b.id,
      title: b.title,
      slug: b.slug || b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      date: b.date || new Date().toISOString().split('T')[0],
      author: b.author || 'KinderBee',
      category: b.category || 'Pedagogy & Curriculum',
      tags: b.tags ? b.tags.join(', ') : '',
      status: (b.status as any) === 'Draft' ? 'Draft' : 'Published'
    });
  };

  const handleSaveQuickEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEditingPostId) return;

    const quickEditTagsArray = quickEditForm.tags ? quickEditForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const originalPost = blogs.find(b => b.id === quickEditingPostId);
    
    const updatedBlog = {
      ...originalPost,
      title: quickEditForm.title,
      slug: quickEditForm.slug,
      date: quickEditForm.date,
      author: quickEditForm.author,
      category: quickEditForm.category,
      status: quickEditForm.status,
      tags: quickEditTagsArray
    };

    try {
      const res = await fetch(`/api/blogs/${quickEditingPostId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedBlog)
      });
      if (res.ok) {
        fetchData();
        setQuickEditingPostId(null);
        setAdminNotice({
          type: 'success',
          message: 'Post updated successfully.'
        });
      }
    } catch (err) {
      console.error('Quick edit error:', err);
    }
  };

  const handleTrashSinglePost = async (id: string) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: 'Trash' })
      });
      if (res.ok) {
        setBlogs(blogs.map(b => b.id === id ? { ...b, status: 'Trash' } : b));
        setAdminNotice({
          type: 'success',
          message: '1 post moved to the Trash.',
          undoAction: async () => {
            await fetch(`/api/blogs/${id}`, {
              method: 'PUT',
              headers,
              body: JSON.stringify({ status: 'Published' })
            });
            fetchData();
            setAdminNotice(null);
          }
        });
      }
    } catch (err) {
      console.error('Trash post error:', err);
    }
  };

  const handleRestoreSinglePost = async (id: string) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: 'Published' })
      });
      if (res.ok) {
        setBlogs(blogs.map(b => b.id === id ? { ...b, status: 'Published' } : b));
        setAdminNotice({
          type: 'success',
          message: '1 post restored from the Trash.'
        });
      }
    } catch (err) {
      console.error('Restore post error:', err);
    }
  };

  const handlePermanentDeleteSinglePost = async (id: string) => {
    if (!confirm('Permanently delete this post? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        setBlogs(blogs.filter(b => b.id !== id));
        setAdminNotice({
          type: 'success',
          message: '1 post permanently deleted.'
        });
      }
    } catch (err) {
      console.error('Delete post error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#2c3338] flex flex-col font-sans antialiased selection:bg-[#2271b1] selection:text-white">
      
      {/* 1. Authentic WordPress Top Admin Bar */}
      <header className="bg-[#1d2327] text-[#c3c4c7] h-9 px-3 flex items-center justify-between text-[13px] font-normal select-none z-50 border-b border-[#2c3338] shrink-0 sticky top-0">
        <div className="flex items-center gap-4">
          {/* WordPress / Brand Logo Icon */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1.5 text-white font-bold hover:text-[#72aee6] transition cursor-pointer"
          >
            <span className="w-5 h-5 rounded-full bg-[#2271b1] text-white flex items-center justify-center text-[10px] font-black shadow-xs">W</span>
            <span className="hidden sm:inline font-semibold">KinderBee WP Admin</span>
          </div>

          {/* Visit Site Button */}
          <button
            onClick={() => onVisitSite ? onVisitSite() : window.location.href = '/'}
            className="flex items-center gap-1 hover:text-[#72aee6] text-[#c3c4c7] transition cursor-pointer px-1.5 py-0.5 rounded hover:bg-[#2c3338]"
            title="Switch back to live website"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Visit Site</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
          </button>

          {/* Enquiries / Comments Indicator */}
          <button 
            onClick={() => setActiveTab('enquiries')}
            className="hidden md:flex items-center gap-1.5 hover:text-[#72aee6] text-[#c3c4c7] transition cursor-pointer px-1.5 py-0.5 rounded hover:bg-[#2c3338]"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="bg-[#2271b1] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {enquiries.filter(e => e.status === 'New').length || 0}
            </span>
            <span className="hidden lg:inline">Leads</span>
          </button>

          {/* Quick "+ New" Menu */}
          <button
            onClick={() => {
              setCurrentBlogForm({});
              setIsEditingBlog(true);
              setActiveTab('posts');
            }}
            className="hidden sm:flex items-center gap-1 hover:text-[#72aee6] text-[#c3c4c7] transition cursor-pointer px-1.5 py-0.5 rounded hover:bg-[#2c3338]"
          >
            <Plus className="w-3.5 h-3.5 text-[#72aee6]" />
            <span>New Post</span>
          </button>
        </div>

        {/* Right side: Howdy, Admin & Logout */}
        <div className="flex items-center gap-3 text-[12px]">
          <div className="flex items-center gap-2">
            <span>Howdy, <strong className="text-white font-semibold">Admin</strong></span>
            <div className="w-6 h-6 rounded-full bg-[#2271b1] text-white flex items-center justify-center text-xs font-bold border border-white/20">
              A
            </div>
          </div>

          <button
            onClick={onLogout}
            className="text-[#f0f0f1] hover:text-[#e1007a] hover:bg-[#2c3338] px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1 border border-stone-600/50"
          >
            <LogOut className="w-3 h-3" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* 2. Main Admin Workspace with WordPress Sidebar and Canvas */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Dark WordPress Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-14' : 'w-44'} bg-[#1d2327] text-[#c3c4c7] flex flex-col justify-between transition-all duration-200 shrink-0 z-40 border-r border-[#2c3338] select-none overflow-y-auto`}>
          <div className="py-2">
            
            {/* Nav Menu Items */}
            <nav className="space-y-0.5 text-[13px] font-normal">

              {/* Posts (Blog) */}
              <div>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`w-full flex items-center justify-between px-3 py-2 transition text-left cursor-pointer ${
                    activeTab === 'posts' || activeTab === 'categories' || activeTab === 'tags'
                      ? 'bg-[#2271b1] text-white font-semibold'
                      : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                  }`}
                  title="Posts"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Posts</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="bg-[#121619] text-[#c3c4c7] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {blogs.length}
                    </span>
                  )}
                </button>

                {/* Sub-menu for Posts (All Posts, Categories, Tags) */}
                {!sidebarCollapsed && (
                  <div className="bg-[#15191c] py-1 text-xs space-y-0.5">
                    <button
                      onClick={() => setActiveTab('posts')}
                      className={`w-full text-left pl-8 pr-3 py-1.5 transition cursor-pointer ${
                        activeTab === 'posts' ? 'text-white font-bold' : 'text-[#a7aaad] hover:text-[#72aee6]'
                      }`}
                    >
                      All Posts
                    </button>
                    <button
                      onClick={() => {
                        setCurrentBlogForm({});
                        setIsEditingBlog(true);
                      }}
                      className="w-full text-left pl-8 pr-3 py-1.5 text-[#a7aaad] hover:text-[#72aee6] transition cursor-pointer"
                    >
                      Add New Post
                    </button>
                    <button
                      onClick={() => setActiveTab('categories')}
                      className={`w-full text-left pl-8 pr-3 py-1.5 transition cursor-pointer ${
                        activeTab === 'categories' ? 'text-white font-bold' : 'text-[#a7aaad] hover:text-[#72aee6]'
                      }`}
                    >
                      Categories
                    </button>
                    <button
                      onClick={() => setActiveTab('tags')}
                      className={`w-full text-left pl-8 pr-3 py-1.5 transition cursor-pointer ${
                        activeTab === 'tags' ? 'text-white font-bold' : 'text-[#a7aaad] hover:text-[#72aee6]'
                      }`}
                    >
                      Tags
                    </button>
                  </div>
                )}
              </div>

              {/* Pages */}
              <button
                onClick={() => setActiveTab('pages')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 transition text-left cursor-pointer ${
                  activeTab === 'pages'
                    ? 'bg-[#2271b1] text-white font-semibold'
                    : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
                title="Pages"
              >
                <Layers className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Pages</span>}
              </button>

              {/* Forms / Enquiries */}
              <button
                onClick={() => setActiveTab('enquiries')}
                className={`w-full flex items-center justify-between px-3 py-2 transition text-left cursor-pointer ${
                  activeTab === 'enquiries'
                    ? 'bg-[#2271b1] text-white font-semibold'
                    : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
                title="Forms & Enquiries"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && <span>Forms</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="bg-[#d63638] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {enquiries.length}
                  </span>
                )}
              </button>

              {/* Users */}
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 transition text-left cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-[#2271b1] text-white font-semibold'
                    : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
                title="Users"
              >
                <User className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Users</span>}
              </button>

              {/* Settings */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 transition text-left cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#2271b1] text-white font-semibold'
                    : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
                title="Settings"
              >
                <Settings className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Settings</span>}
              </button>

            </nav>
          </div>

          {/* Bottom Collapse Menu Button */}
          <div className="border-t border-[#2c3338] p-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[#a7aaad] hover:text-[#72aee6] hover:bg-[#2c3338] rounded transition cursor-pointer"
              title="Collapse Menu"
            >
              {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              {!sidebarCollapsed && <span>Collapse menu</span>}
            </button>
          </div>
        </aside>

        {/* 3. Main WordPress Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4">
          
          {/* Top Admin Notice Banner (WordPress Notice bar) */}
          {adminNotice && (
            <div className={`p-3 border-l-4 rounded-xs text-xs font-medium flex items-center justify-between shadow-2xs ${
              adminNotice.type === 'success' ? 'bg-white border-emerald-500 text-stone-800' :
              adminNotice.type === 'error' ? 'bg-white border-rose-500 text-stone-800' :
              'bg-white border-[#2271b1] text-stone-800'
            }`}>
              <div className="flex items-center gap-2">
                {adminNotice.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                <span>{adminNotice.message}</span>
                {adminNotice.undoAction && (
                  <button
                    onClick={adminNotice.undoAction}
                    className="text-[#2271b1] hover:underline font-bold ml-2 cursor-pointer"
                  >
                    Undo
                  </button>
                )}
              </div>
              <button onClick={() => setAdminNotice(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Top Page Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-[#c3c4c7]/40">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#1d2327] tracking-tight">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'sitekit' && 'Site Kit by Google'}
                {activeTab === 'stats' && 'Jetpack Stats & Traffic'}
                {activeTab === 'astra' && 'Astra Theme Dashboard'}
                {activeTab === 'elementor' && 'Elementor Website Builder'}
                {activeTab === 'jetpack' && 'Jetpack Security & Performance'}
                {activeTab === 'posts' && 'Posts'}
                {activeTab === 'categories' && 'Categories'}
                {activeTab === 'tags' && 'Tags'}
                {activeTab === 'media' && 'Media Library'}
                {activeTab === 'pages' && 'Pages'}
                {activeTab === 'comments' && 'Comments'}
                {activeTab === 'bulkdelete' && 'WP Bulk Delete'}
                {activeTab === 'woocommerce' && 'WooCommerce Dashboard'}
                {activeTab === 'products' && 'Products'}
                {activeTab === 'payments' && 'Payment Gateways'}
                {activeTab === 'analytics' && 'WooCommerce Analytics'}
                {activeTab === 'marketing' && 'Marketing & Coupons'}
                {activeTab === 'wpforms' && 'WPForms Form Builder'}
                {activeTab === 'uae' && 'Ultimate Addons for Elementor'}
                {activeTab === 'appearance' && 'Appearance & Themes'}
                {activeTab === 'plugins' && 'Installed Plugins'}
                {activeTab === 'users' && 'Users & Roles'}
                {activeTab === 'tools' && 'Tools & Data'}
                {activeTab === 'enquiries' && 'Leads & Enquiries'}
                {activeTab === 'faqs' && 'Frequently Asked Questions'}
                {activeTab === 'settings' && 'General Settings'}
              </h1>

              {activeTab === 'posts' && (
                <button
                  onClick={() => {
                    setCurrentBlogForm({});
                    setIsEditingBlog(true);
                  }}
                  className="border border-[#2271b1] text-[#2271b1] hover:bg-[#2271b1] hover:text-white px-2.5 py-0.5 rounded text-xs font-semibold transition cursor-pointer"
                >
                  Add Post
                </button>
              )}

              {activeTab === 'faqs' && (
                <button
                  onClick={() => {
                    setCurrentFaqForm({});
                    setIsEditingFaq(true);
                  }}
                  className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-2.5 py-1 rounded transition cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New FAQ</span>
                </button>
              )}
            </div>

            {/* Screen Options & Help */}
            <div className="flex items-center gap-2 text-[11px] text-stone-500">
              <button className="hover:text-[#2271b1] border border-stone-300 bg-white px-2 py-0.5 rounded shadow-2xs cursor-pointer">
                Screen Options ▾
              </button>
              <button className="hover:text-[#2271b1] border border-stone-300 bg-white px-2 py-0.5 rounded shadow-2xs cursor-pointer">
                Help ▾
              </button>
            </div>
          </div>

          {/* -------------------- TAB 1: WORDPRESS DASHBOARD -------------------- */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* WordPress Welcome Notice Banner */}
              <div className="bg-white border border-[#c3c4c7] p-5 shadow-xs rounded-sm space-y-2">
                <h2 className="text-lg font-semibold text-[#1d2327]">
                  Welcome to KinderBee WordPress-Style Administration!
                </h2>
                <p className="text-xs text-[#50575e] leading-relaxed">
                  We’ve assembled some links to get you started managing your Zero-Royalty preschool franchise website, daily pedagogical research blogs, lead capture pipeline, and global SEO meta tags.
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs">
                  <button 
                    onClick={() => setActiveTab('posts')}
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold px-3 py-1.5 rounded transition cursor-pointer"
                  >
                    Write a Daily Blog Post
                  </button>
                  <button 
                    onClick={() => setActiveTab('appearance')}
                    className="border border-[#2271b1] text-[#2271b1] hover:bg-[#f0f6fc] font-semibold px-3 py-1.5 rounded transition cursor-pointer"
                  >
                    Customize Site Appearance
                  </button>
                  <button 
                    onClick={() => onVisitSite ? onVisitSite() : window.location.href = '/'}
                    className="text-[#2271b1] hover:underline font-semibold"
                  >
                    View Live Site &rarr;
                  </button>
                </div>
              </div>

              {/* 2-Column WordPress Dashboard Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: At a Glance + Activity */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* At a Glance Widget */}
                  <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm overflow-hidden">
                    <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-2.5 flex items-center justify-between">
                      <h3 className="font-bold text-xs text-[#1d2327] uppercase tracking-wide">At a Glance</h3>
                      <span className="text-[11px] text-stone-400">WP Core</span>
                    </div>
                    <div className="p-4 space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4 pb-3 border-b border-stone-100">
                        <button 
                          onClick={() => setActiveTab('posts')}
                          className="flex items-center gap-2 text-stone-700 hover:text-[#2271b1] text-left cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-[#2271b1]" />
                          <span><strong>{blogs.length}</strong> Posts Published</span>
                        </button>
                        <button 
                          onClick={() => setActiveTab('pages')}
                          className="flex items-center gap-2 text-stone-700 hover:text-[#2271b1] text-left cursor-pointer"
                        >
                          <Layers className="w-4 h-4 text-[#2271b1]" />
                          <span><strong>7</strong> Active Main Pages</span>
                        </button>
                        <button 
                          onClick={() => setActiveTab('enquiries')}
                          className="flex items-center gap-2 text-stone-700 hover:text-[#2271b1] text-left cursor-pointer"
                        >
                          <Users className="w-4 h-4 text-[#d63638]" />
                          <span><strong>{enquiries.length}</strong> Partner Leads</span>
                        </button>
                        <button 
                          onClick={() => setActiveTab('faqs')}
                          className="flex items-center gap-2 text-stone-700 hover:text-[#2271b1] text-left cursor-pointer"
                        >
                          <HelpCircle className="w-4 h-4 text-[#2271b1]" />
                          <span><strong>{faqs.length}</strong> FAQs Configured</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        Running <strong>KinderBee 2026 Theme</strong> with FinnishWay Nordic Pedagogy Framework & Zero Royalty Architecture.
                      </p>
                    </div>
                  </div>

                  {/* Activity Widget */}
                  <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm overflow-hidden">
                    <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-2.5 flex items-center justify-between">
                      <h3 className="font-bold text-xs text-[#1d2327] uppercase tracking-wide">Activity</h3>
                      <span className="text-[11px] text-stone-400">Recently Published</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="text-xs text-stone-500 font-semibold">Recently Published Posts:</div>
                      <div className="space-y-2">
                        {blogs.slice(0, 4).map(b => (
                          <div key={b.id} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 last:border-0">
                            <span className="font-medium text-[#2271b1] hover:underline cursor-pointer truncate max-w-[280px]" onClick={() => { setCurrentBlogForm(b); setIsEditingBlog(true); setActiveTab('posts'); }}>
                              {b.title}
                            </span>
                            <span className="text-[11px] text-stone-400 shrink-0">{b.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Quick Draft & KPI Analytics */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Quick Draft Widget */}
                  <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm overflow-hidden">
                    <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-2.5 flex items-center justify-between">
                      <h3 className="font-bold text-xs text-[#1d2327] uppercase tracking-wide">Quick Draft</h3>
                      <span className="text-[11px] text-stone-400">Fast Publish</span>
                    </div>
                    <form onSubmit={handleQuickDraftSave} className="p-4 space-y-3 text-xs">
                      {quickDraftSuccess && (
                        <div className="p-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold">
                          Draft published successfully to Blog archives!
                        </div>
                      )}
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">Title</label>
                        <input
                          type="text"
                          value={quickDraftTitle}
                          onChange={(e) => setQuickDraftTitle(e.target.value)}
                          placeholder="What's the article about?"
                          className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">What's on your mind?</label>
                        <textarea
                          rows={4}
                          value={quickDraftContent}
                          onChange={(e) => setQuickDraftContent(e.target.value)}
                          placeholder="Write quick draft synopsis or key talking points..."
                          className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold px-4 py-1.5 rounded transition cursor-pointer text-xs shadow-xs"
                      >
                        Save Draft
                      </button>
                    </form>
                  </div>

                  {/* WordPress Events & Pipeline Analytics */}
                  <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm overflow-hidden">
                    <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-2.5 flex items-center justify-between">
                      <h3 className="font-bold text-xs text-[#1d2327] uppercase tracking-wide">Performance & Pipeline</h3>
                      <button onClick={fetchData} className="text-[#2271b1] hover:underline text-[11px] flex items-center gap-1 cursor-pointer">
                        <RefreshCw className="w-3 h-3" /> Refresh
                      </button>
                    </div>
                    <div className="p-4 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                          <div className="text-[11px] text-stone-500">Total Page Views</div>
                          <div className="text-xl font-bold text-[#1d2327]">{analytics?.totalPageViews || '14,820'}</div>
                        </div>
                        <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                          <div className="text-[11px] text-stone-500">Pipeline Inquiries</div>
                          <div className="text-xl font-bold text-[#d63638]">{enquiries.length}</div>
                        </div>
                      </div>
                      <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                        <div className="text-[11px] text-stone-500">Estimated Pipeline Investment</div>
                        <div className="text-xl font-bold text-emerald-700">₹{analytics?.estimatedPipelineValue || '1.85 Cr'}</div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* -------------------- TAB 2: WORDPRESS POSTS (PERFECT SCREENSHOT #1 & #2 MATCH) -------------------- */}
          {activeTab === 'posts' && (
            <div className="space-y-3 font-sans text-xs">
              
              {/* Status Tabs: All (13) | Published (12) | Draft (1) | Trash (0) */}
              <div className="flex items-center gap-2 text-xs border-b border-stone-200 pb-2 text-stone-600">
                <button
                  onClick={() => { setActivePostStatusFilter('All'); setSelectedPostIds([]); }}
                  className={`hover:text-[#2271b1] cursor-pointer ${
                    activePostStatusFilter === 'All' ? 'font-bold text-[#1d2327]' : 'text-[#2271b1]'
                  }`}
                >
                  All <span className="text-stone-500">({blogs.filter(b => b.status !== 'Trash').length})</span>
                </button>
                <span className="text-stone-300">|</span>
                <button
                  onClick={() => { setActivePostStatusFilter('Published'); setSelectedPostIds([]); }}
                  className={`hover:text-[#2271b1] cursor-pointer ${
                    activePostStatusFilter === 'Published' ? 'font-bold text-[#1d2327]' : 'text-[#2271b1]'
                  }`}
                >
                  Published <span className="text-stone-500">({blogs.filter(b => b.status !== 'Draft' && b.status !== 'Trash').length})</span>
                </button>
                <span className="text-stone-300">|</span>
                <button
                  onClick={() => { setActivePostStatusFilter('Draft'); setSelectedPostIds([]); }}
                  className={`hover:text-[#2271b1] cursor-pointer ${
                    activePostStatusFilter === 'Draft' ? 'font-bold text-[#1d2327]' : 'text-[#2271b1]'
                  }`}
                >
                  Draft <span className="text-stone-500">({blogs.filter(b => b.status === 'Draft').length})</span>
                </button>
                <span className="text-stone-300">|</span>
                <button
                  onClick={() => { setActivePostStatusFilter('Trash'); setSelectedPostIds([]); }}
                  className={`hover:text-[#2271b1] cursor-pointer ${
                    activePostStatusFilter === 'Trash' ? 'font-bold text-[#1d2327]' : 'text-[#2271b1]'
                  }`}
                >
                  Trash <span className="text-stone-500">({blogs.filter(b => b.status === 'Trash').length})</span>
                </button>
              </div>

              {/* Action Bar: Bulk actions, All dates, All Categories, Filter & Search */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 pt-1">
                
                {/* Left Bulk actions & Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <select 
                    value={bulkActionTop}
                    onChange={(e) => setBulkActionTop(e.target.value)}
                    className="bg-white border border-[#8c8f94] text-xs px-2 py-1 rounded text-[#2c3338] outline-none"
                  >
                    <option value="">Bulk actions</option>
                    {activePostStatusFilter === 'Trash' ? (
                      <>
                        <option value="restore">Restore</option>
                        <option value="delete">Delete permanently</option>
                      </>
                    ) : (
                      <>
                        <option value="edit">Edit</option>
                        <option value="trash">Move to Trash</option>
                      </>
                    )}
                  </select>
                  <button 
                    onClick={() => handleApplyBulkAction(bulkActionTop)}
                    className="bg-white hover:bg-stone-50 border border-[#8c8f94] text-[#2c3338] text-xs px-2.5 py-1 rounded cursor-pointer active:scale-95 transition"
                  >
                    Apply
                  </button>

                  <select 
                    value={activePostDateFilter}
                    onChange={(e) => setActivePostDateFilter(e.target.value)}
                    className="bg-white border border-[#8c8f94] text-xs px-2 py-1 rounded text-[#2c3338] outline-none"
                  >
                    <option value="All">All dates</option>
                    <option value="2026-08">August 2026</option>
                    <option value="2026-07">July 2026</option>
                    <option value="2026-06">June 2026</option>
                  </select>

                  <select
                    value={activePostCategoryFilter}
                    onChange={(e) => setActivePostCategoryFilter(e.target.value)}
                    className="bg-white border border-[#8c8f94] text-xs px-2 py-1 rounded text-[#2c3338] outline-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="Pedagogy & Curriculum">Pedagogy & Curriculum</option>
                    <option value="Franchise & Business">Franchise & Business</option>
                    <option value="Policy & NEP 2020">Policy & NEP 2020</option>
                    <option value="Early Childhood Development">Early Childhood Development</option>
                  </select>

                  <button className="bg-white hover:bg-stone-50 border border-[#8c8f94] text-[#2c3338] text-xs px-2.5 py-1 rounded cursor-pointer">
                    Filter
                  </button>
                </div>

                {/* Right Search Posts box & Items counter */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={postSearchTerm}
                      onChange={(e) => setPostSearchTerm(e.target.value)}
                      placeholder="Search title, author, tag..."
                      className="bg-white border border-[#8c8f94] text-xs px-2 py-1 rounded-l text-[#2c3338] outline-none focus:border-[#2271b1] w-40 sm:w-56"
                    />
                    <button className="bg-white hover:bg-stone-50 border border-l-0 border-[#8c8f94] text-[#2271b1] text-xs px-2.5 py-1 rounded-r font-medium cursor-pointer">
                      Search Posts
                    </button>
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium whitespace-nowrap">
                    {filteredBlogs.length} items
                  </span>
                </div>

              </div>

              {/* WordPress Bulk Edit Tray (When Bulk Edit is active) */}
              {isBulkEditing && (
                <div className="bg-[#f6f7f7] border border-[#c3c4c7] p-4 rounded space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-xs text-[#1d2327] uppercase">Bulk Edit ({selectedPostIds.length} posts selected)</span>
                    <button onClick={() => setIsBulkEditing(false)} className="text-stone-400 hover:text-stone-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 pb-2">
                    {blogs.filter(b => selectedPostIds.includes(b.id)).map(b => (
                      <span key={b.id} className="inline-flex items-center gap-1 bg-white border border-stone-300 px-2 py-0.5 rounded text-[11px]">
                        <span className="truncate max-w-[160px]">{b.title}</span>
                        <button 
                          onClick={() => toggleSelectPost(b.id)}
                          className="text-stone-400 hover:text-rose-600 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Category</label>
                      <select
                        value={bulkEditCategory}
                        onChange={(e) => setBulkEditCategory(e.target.value)}
                        className="w-full bg-white border border-[#8c8f94] rounded px-2 py-1 text-xs"
                      >
                        <option value="">— No Change —</option>
                        <option value="Pedagogy & Curriculum">Pedagogy & Curriculum</option>
                        <option value="Franchise & Business">Franchise & Business</option>
                        <option value="Policy & NEP 2020">Policy & NEP 2020</option>
                        <option value="Early Childhood Development">Early Childhood Development</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Author</label>
                      <input
                        type="text"
                        placeholder="Author name..."
                        value={bulkEditAuthor}
                        onChange={(e) => setBulkEditAuthor(e.target.value)}
                        className="w-full bg-white border border-[#8c8f94] rounded px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Status</label>
                      <select
                        value={bulkEditStatus}
                        onChange={(e) => setBulkEditStatus(e.target.value)}
                        className="w-full bg-white border border-[#8c8f94] rounded px-2 py-1 text-xs"
                      >
                        <option value="">— No Change —</option>
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Add Tags (comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Montessori, Admissions"
                        value={bulkEditTags}
                        onChange={(e) => setBulkEditTags(e.target.value)}
                        className="w-full bg-white border border-[#8c8f94] rounded px-2 py-1 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setIsBulkEditing(false)}
                      className="px-3 py-1 bg-white border border-stone-300 rounded text-xs text-stone-700 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveBulkEdit}
                      className="px-4 py-1 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-semibold"
                    >
                      Update
                    </button>
                  </div>
                </div>
              )}

              {/* Authentic WordPress Posts Table (Screenshot #1 Match) */}
              <div className="bg-white border border-[#c3c4c7] shadow-2xs rounded-xs overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#1d2327]">
                      <th className="p-2.5 w-7 text-center">
                        <input 
                          type="checkbox" 
                          checked={isAllSelected}
                          onChange={toggleSelectAll}
                          className="rounded border-[#8c8f94] text-[#2271b1] cursor-pointer"
                        />
                      </th>
                      <th className="p-2.5 font-bold cursor-pointer hover:text-[#2271b1]">Title ⬍</th>
                      <th className="p-2.5 font-bold">Author</th>
                      <th className="p-2.5 font-bold">Categories</th>
                      <th className="p-2.5 font-bold">Tags</th>
                      <th className="p-2.5 font-bold text-center" title="SEO Score">
                        <div className="flex justify-center"><div className="w-4 h-4 rounded bg-emerald-600 text-white font-black text-[9px] flex items-center justify-center">Y</div></div>
                      </th>
                      <th className="p-2.5 font-bold cursor-pointer hover:text-[#2271b1]">Date ⬍</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f1]">
                    {filteredBlogs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-stone-500 font-medium">
                          No posts found matching the selected status or filters.
                        </td>
                      </tr>
                    ) : (
                      filteredBlogs.map((b) => {
                        const isSelected = selectedPostIds.includes(b.id);
                        const isQuickEditingThis = quickEditingPostId === b.id;

                        if (isQuickEditingThis) {
                          return (
                            <tr key={`quick_edit_${b.id}`} className="bg-[#f6f7f7]">
                              <td colSpan={7} className="p-4 border-y-2 border-[#2271b1]">
                                <form onSubmit={handleSaveQuickEdit} className="space-y-3">
                                  <div className="font-bold text-xs text-[#1d2327] uppercase">Quick Edit</div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <div>
                                        <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Title</label>
                                        <input
                                          type="text"
                                          required
                                          value={quickEditForm.title}
                                          onChange={(e) => setQuickEditForm({ ...quickEditForm, title: e.target.value })}
                                          className="w-full bg-white border border-[#8c8f94] rounded px-2.5 py-1 text-xs outline-none focus:border-[#2271b1]"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Slug</label>
                                        <input
                                          type="text"
                                          value={quickEditForm.slug}
                                          onChange={(e) => setQuickEditForm({ ...quickEditForm, slug: e.target.value })}
                                          className="w-full bg-white border border-[#8c8f94] rounded px-2.5 py-1 text-xs outline-none focus:border-[#2271b1]"
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Date</label>
                                          <input
                                            type="date"
                                            value={quickEditForm.date}
                                            onChange={(e) => setQuickEditForm({ ...quickEditForm, date: e.target.value })}
                                            className="w-full bg-white border border-[#8c8f94] rounded px-2.5 py-1 text-xs"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Author</label>
                                          <input
                                            type="text"
                                            value={quickEditForm.author}
                                            onChange={(e) => setQuickEditForm({ ...quickEditForm, author: e.target.value })}
                                            className="w-full bg-white border border-[#8c8f94] rounded px-2.5 py-1 text-xs"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <div>
                                        <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Categories</label>
                                        <select
                                          value={quickEditForm.category}
                                          onChange={(e) => setQuickEditForm({ ...quickEditForm, category: e.target.value })}
                                          className="w-full bg-white border border-[#8c8f94] rounded px-2.5 py-1 text-xs"
                                        >
                                          <option value="Pedagogy & Curriculum">Pedagogy & Curriculum</option>
                                          <option value="Franchise & Business">Franchise & Business</option>
                                          <option value="Policy & NEP 2020">Policy & NEP 2020</option>
                                          <option value="Early Childhood Development">Early Childhood Development</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Tags (comma separated)</label>
                                        <input
                                          type="text"
                                          value={quickEditForm.tags}
                                          onChange={(e) => setQuickEditForm({ ...quickEditForm, tags: e.target.value })}
                                          className="w-full bg-white border border-[#8c8f94] rounded px-2.5 py-1 text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Status</label>
                                        <select
                                          value={quickEditForm.status}
                                          onChange={(e) => setQuickEditForm({ ...quickEditForm, status: e.target.value as any })}
                                          className="w-full bg-white border border-[#8c8f94] rounded px-2.5 py-1 text-xs"
                                        >
                                          <option value="Published">Published</option>
                                          <option value="Draft">Draft</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                                    <button
                                      type="button"
                                      onClick={() => setQuickEditingPostId(null)}
                                      className="px-3 py-1 bg-white border border-stone-300 rounded text-xs text-stone-700 hover:bg-stone-50 cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="submit"
                                      className="px-4 py-1 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-semibold cursor-pointer"
                                    >
                                      Update
                                    </button>
                                  </div>
                                </form>
                              </td>
                            </tr>
                          );
                        }

                        return (
                          <tr 
                            key={b.id} 
                            className={`transition group ${isSelected ? 'bg-[#f0f6fc]' : 'hover:bg-[#f6f7f7]'}`}
                          >
                            <td className="p-2.5 text-center">
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={() => toggleSelectPost(b.id)}
                                className="rounded border-[#8c8f94] text-[#2271b1] cursor-pointer"
                              />
                            </td>
                            <td className="p-2.5 font-semibold text-[#2271b1] max-w-md">
                              <div className="space-y-1">
                                <span 
                                  className="hover:underline cursor-pointer text-[13px] text-[#2271b1] font-bold"
                                  onClick={() => {
                                    setCurrentBlogForm(b);
                                    setIsEditingBlog(true);
                                  }}
                                >
                                  {b.title} {b.status === 'Draft' && <span className="text-stone-500 font-normal"> — Draft</span>}
                                  {b.status === 'Trash' && <span className="text-rose-500 font-normal"> — Trash</span>}
                                </span>

                                {/* Row Action Hover Links (Screenshot #1 Match) */}
                                <div className="flex items-center gap-1 text-[11px] text-[#2271b1] opacity-0 group-hover:opacity-100 transition duration-150 font-normal">
                                  {b.status === 'Trash' ? (
                                    <>
                                      <button 
                                        onClick={() => handleRestoreSinglePost(b.id)}
                                        className="hover:underline text-[#2271b1] cursor-pointer font-medium"
                                      >
                                        Restore
                                      </button>
                                      <span className="text-stone-300">|</span>
                                      <button 
                                        onClick={() => handlePermanentDeleteSinglePost(b.id)}
                                        className="hover:underline text-[#a00] cursor-pointer font-medium"
                                      >
                                        Delete Permanently
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button 
                                        onClick={() => { setCurrentBlogForm(b); setIsEditingBlog(true); }}
                                        className="hover:underline text-[#2271b1] cursor-pointer font-medium"
                                      >
                                        Edit
                                      </button>
                                      <span className="text-stone-300">|</span>
                                      <button 
                                        onClick={() => handleStartQuickEdit(b)}
                                        className="hover:underline text-[#2271b1] cursor-pointer font-medium"
                                      >
                                        Quick Edit
                                      </button>
                                      <span className="text-stone-300">|</span>
                                      <button 
                                        onClick={() => handleTrashSinglePost(b.id)}
                                        className="hover:underline text-[#a00] cursor-pointer font-medium"
                                      >
                                        Trash
                                      </button>
                                      <span className="text-stone-300">|</span>
                                      <button 
                                        onClick={() => {
                                          window.open(window.location.origin + '/?blogId=' + b.id, '_blank');
                                        }}
                                        className="hover:underline text-[#2271b1] cursor-pointer font-bold flex items-center gap-0.5"
                                        title="View WordPress Full Page Blog"
                                      >
                                        <span>View</span>
                                      </button>
                                      <span className="text-stone-300">|</span>
                                      <button 
                                        onClick={async () => {
                                          const duplicatePayload = {
                                            title: `${b.title} (Copy)`,
                                            category: b.category,
                                            excerpt: b.excerpt,
                                            content: b.content,
                                            image: b.image,
                                            author: b.author,
                                            readTime: b.readTime,
                                            views: 1,
                                            status: b.status,
                                            tags: b.tags,
                                            slug: `${b.slug || 'post'}-copy-${Date.now()}`
                                          };
                                          try {
                                            const res = await fetch('/api/blogs', {
                                              method: 'POST',
                                              headers,
                                              body: JSON.stringify(duplicatePayload)
                                            });
                                            const data = await res.json();
                                            if (data.success) {
                                              fetchData();
                                              setAdminNotice({
                                                type: 'success',
                                                message: `Post duplicated successfully.`
                                              });
                                            }
                                          } catch (err) {
                                            console.error('Duplicate post error:', err);
                                          }
                                        }}
                                        className="hover:underline text-[#2271b1] cursor-pointer"
                                      >
                                        Duplicate This
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-2.5 text-[#2271b1] hover:underline cursor-pointer font-medium">{b.author || 'KinderBee'}</td>
                            <td className="p-2.5 text-stone-700">
                              <span className="text-stone-700">{b.category || 'Pedagogy & Curriculum'}</span>
                            </td>
                            <td className="p-2.5 text-stone-500">
                              {b.tags && b.tags.length > 0 ? b.tags.join(', ') : '—'}
                            </td>
                            <td className="p-2.5 text-center">
                              <div className="flex justify-center" title={b.metaTitle && b.metaDescription ? "SEO: Good" : "SEO: Needs improvement"}>
                                <div className={`w-3 h-3 rounded-full ${b.metaTitle && b.metaDescription ? 'bg-emerald-500' : 'bg-amber-500'} shadow-sm border border-stone-200`}></div>
                              </div>
                            </td>
                            <td className="p-2.5 text-stone-600 text-[11px] leading-tight">
                              <div className="font-semibold text-stone-700">{b.status === 'Draft' ? 'Last Modified' : 'Published'}</div>
                              <div className="text-stone-500">{b.date} at 3:21 pm</div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#f6f7f7] border-t border-[#c3c4c7] text-[#1d2327]">
                      <th className="p-2.5 w-7 text-center">
                        <input 
                          type="checkbox" 
                          checked={isAllSelected}
                          onChange={toggleSelectAll}
                          className="rounded border-[#8c8f94] text-[#2271b1] cursor-pointer"
                        />
                      </th>
                      <th className="p-2.5 font-bold">Title</th>
                      <th className="p-2.5 font-bold">Author</th>
                      <th className="p-2.5 font-bold">Categories</th>
                      <th className="p-2.5 font-bold">Tags</th>
                      <th className="p-2.5 font-bold text-center" title="SEO Score">
                        <div className="flex justify-center"><div className="w-4 h-4 rounded bg-emerald-600 text-white font-black text-[9px] flex items-center justify-center">Y</div></div>
                      </th>
                      <th className="p-2.5 font-bold">Date</th>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Bottom bulk actions & Pagination */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <select 
                    value={bulkActionBottom}
                    onChange={(e) => setBulkActionBottom(e.target.value)}
                    className="bg-white border border-[#8c8f94] text-xs px-2 py-1 rounded text-[#2c3338] outline-none"
                  >
                    <option value="">Bulk actions</option>
                    {activePostStatusFilter === 'Trash' ? (
                      <>
                        <option value="restore">Restore</option>
                        <option value="delete">Delete permanently</option>
                      </>
                    ) : (
                      <>
                        <option value="edit">Edit</option>
                        <option value="trash">Move to Trash</option>
                      </>
                    )}
                  </select>
                  <button 
                    onClick={() => handleApplyBulkAction(bulkActionBottom)}
                    className="bg-white hover:bg-stone-50 border border-[#8c8f94] text-[#2c3338] text-xs px-2.5 py-1 rounded cursor-pointer active:scale-95 transition"
                  >
                    Apply
                  </button>
                </div>
                <div className="text-stone-500 text-[11px]">
                  {filteredBlogs.length} items
                </div>
              </div>

            </div>
          )}

          {/* -------------------- TAB: CATEGORIES -------------------- */}
          {activeTab === 'categories' && (
            <WpCategoriesTab
              blogs={blogs}
              categories={categoriesList}
              onAddCategory={(newCat) => {
                setCategoriesList([newCat, ...categoriesList]);
              }}
              onDeleteCategory={(id) => {
                setCategoriesList(categoriesList.filter(c => c.id !== id));
              }}
            />
          )}

          {/* -------------------- TAB: TAGS -------------------- */}
          {activeTab === 'tags' && (
            <WpTagsTab
              blogs={blogs}
              tags={tagsList}
              onAddTag={(newTag) => {
                setTagsList([newTag, ...tagsList]);
              }}
              onDeleteTag={(id) => {
                setTagsList(tagsList.filter(t => t.id !== id));
              }}
            />
          )}

          {/* -------------------- TAB 3: MEDIA LIBRARY -------------------- */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div className="bg-white border border-[#c3c4c7] p-4 rounded-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h3 className="font-bold text-sm text-[#1d2327]">Media Library Assets & CDN URLs</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Paste image URL to register in library..."
                      value={newMediaUrl}
                      onChange={(e) => setNewMediaUrl(e.target.value)}
                      className="bg-white border border-[#8c8f94] text-xs px-3 py-1.5 rounded w-64 outline-none focus:border-[#2271b1]"
                    />
                    <button
                      onClick={() => {
                        if (newMediaUrl.trim()) {
                          setMediaList([newMediaUrl, ...mediaList]);
                          setNewMediaUrl('');
                        }
                      }}
                      className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer"
                    >
                      Add Media
                    </button>
                  </div>
                </div>

                {/* Media Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {mediaList.map((url, idx) => (
                    <div key={idx} className="bg-stone-100 border border-stone-200 rounded p-1 space-y-1 group">
                      <div className="h-28 overflow-hidden rounded bg-stone-900 flex items-center justify-center">
                        <img src={url} alt={`Media asset ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      </div>
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] text-stone-500 truncate max-w-[90px]">{url.split('/').pop()}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(url);
                            alert('Media URL copied to clipboard!');
                          }}
                          className="text-[10px] text-[#2271b1] hover:underline font-bold"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB 4: PAGES & SEO HEADINGS -------------------- */}
          {activeTab === 'pages' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* Global Meta Card */}
                <div className="bg-white border border-[#c3c4c7] p-5 shadow-xs rounded-sm space-y-4">
                  <h3 className="font-bold text-sm text-[#1d2327] uppercase tracking-wide border-b pb-2">
                    Global On-Page SEO Meta Tags
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Global Meta Title</label>
                      <input
                        type="text"
                        value={settingsForm.metaTitle}
                        onChange={(e) => setSettingsForm({ ...settingsForm, metaTitle: e.target.value })}
                        className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Target Keywords (Comma Separated)</label>
                      <input
                        type="text"
                        value={settingsForm.metaKeywords}
                        onChange={(e) => setSettingsForm({ ...settingsForm, metaKeywords: e.target.value })}
                        className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">Global Meta Description</label>
                      <textarea
                        rows={2}
                        value={settingsForm.metaDescription}
                        onChange={(e) => setSettingsForm({ ...settingsForm, metaDescription: e.target.value })}
                        className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                      />
                    </div>
                  </div>
                </div>

                {/* Page Specific Headings Cards */}
                <div className="bg-white border border-[#c3c4c7] p-5 shadow-xs rounded-sm space-y-4">
                  <h3 className="font-bold text-sm text-[#1d2327] uppercase tracking-wide border-b pb-2">
                    Main Pages H1 & Subtitle Headings Manager
                  </h3>

                  <div className="space-y-4 text-xs">
                    {/* Home Page */}
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded space-y-2">
                      <div className="font-bold text-[#2271b1]">1. Home Page (Hero & Subtitle)</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Home Hero H1"
                          value={settingsForm.homeHeroH1}
                          onChange={(e) => setSettingsForm({ ...settingsForm, homeHeroH1: e.target.value })}
                          className="bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Home Hero Subtitle"
                          value={settingsForm.homeHeroSubtitle}
                          onChange={(e) => setSettingsForm({ ...settingsForm, homeHeroSubtitle: e.target.value })}
                          className="bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs"
                        />
                      </div>
                    </div>

                    {/* Franchise Page */}
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded space-y-2">
                      <div className="font-bold text-[#2271b1]">2. Franchise / Partnerships Page</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Franchise Hero H1"
                          value={settingsForm.franchiseHeroH1}
                          onChange={(e) => setSettingsForm({ ...settingsForm, franchiseHeroH1: e.target.value })}
                          className="bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Franchise Hero Subtitle"
                          value={settingsForm.franchiseHeroSubtitle}
                          onChange={(e) => setSettingsForm({ ...settingsForm, franchiseHeroSubtitle: e.target.value })}
                          className="bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs"
                        />
                      </div>
                    </div>

                    {/* FWA Page */}
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded space-y-2">
                      <div className="font-bold text-[#2271b1]">3. FinnishWay Academy (FWA) Page</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="FWA Hero H1"
                          value={settingsForm.fwaHeroH1}
                          onChange={(e) => setSettingsForm({ ...settingsForm, fwaHeroH1: e.target.value })}
                          className="bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="FWA Hero Subtitle"
                          value={settingsForm.fwaHeroSubtitle}
                          onChange={(e) => setSettingsForm({ ...settingsForm, fwaHeroSubtitle: e.target.value })}
                          className="bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-5 py-2 rounded transition cursor-pointer shadow-xs"
                  >
                    Save SEO & Page Headings
                  </button>
                  {settingsSaved && <span className="text-emerald-700 text-xs font-bold">✓ Changes successfully saved!</span>}
                </div>

              </form>
            </div>
          )}

          {/* -------------------- TAB 5: APPEARANCE & BRANDING -------------------- */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveSettings} className="bg-white border border-[#c3c4c7] p-5 shadow-xs rounded-sm space-y-4">
                <h3 className="font-bold text-sm text-[#1d2327] uppercase tracking-wide border-b pb-2">
                  Theme Customization: Header Logo & Footer Bio
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Logo Image URL</label>
                    <input
                      type="text"
                      value={settingsForm.logoUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                      className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Brand Name / Title</label>
                    <input
                      type="text"
                      value={settingsForm.logoText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, logoText: e.target.value })}
                      className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">Footer Tagline & Bio Description</label>
                    <textarea
                      rows={2}
                      value={settingsForm.footerTagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, footerTagline: e.target.value })}
                      className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Footer Copyright Text</label>
                    <input
                      type="text"
                      value={settingsForm.footerCopyright}
                      onChange={(e) => setSettingsForm({ ...settingsForm, footerCopyright: e.target.value })}
                      className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-5 py-2 rounded transition cursor-pointer shadow-xs"
                  >
                    Save Appearance Customizer
                  </button>
                  {settingsSaved && <span className="text-emerald-700 text-xs font-bold">✓ Saved!</span>}
                </div>
              </form>
            </div>
          )}

          {/* -------------------- TAB 6: ENQUIRIES CRM -------------------- */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4">
              <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#1d2327] font-semibold">
                      <th className="p-3">Lead Contact</th>
                      <th className="p-3">Type & City</th>
                      <th className="p-3">Investment Budget</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {enquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-[#f6f7f7] transition">
                        <td className="p-3 font-semibold text-[#1d2327]">
                          <div>{enq.name}</div>
                          <div className="text-stone-500 font-normal text-[11px]">{enq.email} • {enq.phone}</div>
                        </td>
                        <td className="p-3 text-stone-700">
                          <span className="font-semibold">{enq.type}</span>
                          <div className="text-[11px] text-stone-500">{enq.city || 'Not specified'}</div>
                        </td>
                        <td className="p-3 font-mono text-emerald-700 font-semibold">{enq.budget || 'Standard'}</td>
                        <td className="p-3">
                          <select
                            value={enq.status}
                            onChange={(e) => handleUpdateEnquiry(enq.id, { status: e.target.value })}
                            className="bg-stone-50 border border-stone-200 text-[11px] font-bold rounded px-2 py-0.5"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Converted">Converted</option>
                            <option value="Dropped">Dropped</option>
                          </select>
                        </td>
                        <td className="p-3 text-stone-500 text-[11px]">{enq.createdAt ? enq.createdAt.split('T')[0] : 'Today'}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleGenerateAiEmail(enq)}
                            className="bg-pink-50 text-[#e1007a] hover:bg-pink-100 font-bold px-2 py-1 rounded text-[11px] transition cursor-pointer"
                          >
                            AI Email Reply
                          </button>
                          <button
                            onClick={() => handleDeleteEnquiry(enq.id)}
                            className="text-[#d63638] hover:underline font-semibold text-[11px]"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* -------------------- TAB 7: FAQS -------------------- */}
          {activeTab === 'faqs' && (
            <div className="space-y-4">
              <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm p-4 space-y-3">
                {faqs.map(f => (
                  <div key={f.id} className="p-3 bg-stone-50 border border-stone-200 rounded flex items-start justify-between gap-4">
                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-[#1d2327]">{f.question}</div>
                      <div className="text-stone-600 text-[11px]">{f.answer}</div>
                      <span className="inline-block bg-stone-200 text-stone-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                        {f.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setCurrentFaqForm(f);
                          setIsEditingFaq(true);
                        }}
                        className="text-[#2271b1] hover:underline font-bold text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(f.id)}
                        className="text-[#d63638] hover:underline font-bold text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* -------------------- TAB: SITE KIT BY GOOGLE -------------------- */}
          {activeTab === 'sitekit' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white border border-[#c3c4c7] p-5 rounded-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#f5ba41]" />
                    <h3 className="font-bold text-base text-[#1d2327]">Google Site Kit Dashboard</h3>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded">All Services Connected</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded">
                    <div className="text-stone-500 font-semibold">Search Console Clicks</div>
                    <div className="text-2xl font-bold text-[#1d2327] mt-1">8,420</div>
                    <div className="text-emerald-600 text-[11px] font-semibold mt-1">↑ 18.4% vs last 28 days</div>
                  </div>
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded">
                    <div className="text-stone-500 font-semibold">Search Impressions</div>
                    <div className="text-2xl font-bold text-[#1d2327] mt-1">94.2K</div>
                    <div className="text-emerald-600 text-[11px] font-semibold mt-1">↑ 12.1% vs last 28 days</div>
                  </div>
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded">
                    <div className="text-stone-500 font-semibold">PageSpeed Mobile</div>
                    <div className="text-2xl font-bold text-emerald-600 mt-1">96 / 100</div>
                    <div className="text-stone-500 text-[11px] mt-1">Core Web Vitals Passed</div>
                  </div>
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded">
                    <div className="text-stone-500 font-semibold">PageSpeed Desktop</div>
                    <div className="text-2xl font-bold text-emerald-600 mt-1">99 / 100</div>
                    <div className="text-stone-500 text-[11px] mt-1">Fast server response time</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB: JETPACK STATS -------------------- */}
          {activeTab === 'stats' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white border border-[#c3c4c7] p-5 rounded-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#2271b1]" />
                    <h3 className="font-bold text-base text-[#1d2327]">Jetpack Traffic & Visitor Insights</h3>
                  </div>
                  <span className="text-stone-500">Last 7 Days</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded">
                    <div className="text-stone-500 font-semibold">Daily Unique Visitors</div>
                    <div className="text-2xl font-bold text-[#2271b1] mt-1">1,240</div>
                  </div>
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded">
                    <div className="text-stone-500 font-semibold">Total Post Views</div>
                    <div className="text-2xl font-bold text-[#1d2327] mt-1">4,810</div>
                  </div>
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded">
                    <div className="text-stone-500 font-semibold">Top Referrer</div>
                    <div className="text-2xl font-bold text-emerald-600 mt-1">Google Organic</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB: ASTRA THEME -------------------- */}
          {activeTab === 'astra' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white border border-[#c3c4c7] p-5 rounded-xs space-y-4">
                <div className="flex items-center gap-2 border-b pb-3">
                  <Sparkle className="w-5 h-5 text-[#a068f5]" />
                  <h3 className="font-bold text-base text-[#1d2327]">Astra Theme Options & Typography</h3>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  KinderBee Preschool uses Astra Pro Core Framework customized for early childhood education institutions with Nordic minimalist typography, custom color palettes, and mobile performance optimizations.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 border border-stone-200 rounded flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-800">Header & Navigation Builder</div>
                      <div className="text-stone-500 text-[11px]">Sticky logo, admission hotline & CTAs</div>
                    </div>
                    <span className="text-emerald-700 font-bold">Active</span>
                  </div>
                  <div className="p-3 border border-stone-200 rounded flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-800">Blog Layout & Single Post Hero</div>
                      <div className="text-stone-500 text-[11px]">Feature image header with author badge</div>
                    </div>
                    <span className="text-emerald-700 font-bold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB: ELEMENTOR -------------------- */}
          {activeTab === 'elementor' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white border border-[#c3c4c7] p-5 rounded-xs space-y-4">
                <div className="flex items-center gap-2 border-b pb-3">
                  <Code className="w-5 h-5 text-[#92003b]" />
                  <h3 className="font-bold text-base text-[#1d2327]">Elementor Website Builder</h3>
                </div>
                <p className="text-stone-600">
                  Global typography, design system colors, and reusable template blocks used across KinderBee landing pages.
                </p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveTab('posts')}
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold px-3 py-1.5 rounded cursor-pointer"
                  >
                    Open Post Builder
                  </button>
                  <button 
                    onClick={() => onVisitSite ? onVisitSite() : window.location.href = '/'}
                    className="border border-[#2271b1] text-[#2271b1] hover:bg-[#f0f6fc] font-semibold px-3 py-1.5 rounded cursor-pointer"
                  >
                    Edit Homepage with Elementor
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB: JETPACK -------------------- */}
          {activeTab === 'jetpack' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white border border-[#c3c4c7] p-5 rounded-xs space-y-4">
                <div className="flex items-center gap-2 border-b pb-3">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-base text-[#1d2327]">Jetpack Security & CDN Accelerator</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded">
                    <span className="font-medium text-stone-700">Image CDN & Global Edge Caching</span>
                    <span className="text-emerald-700 font-bold">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded">
                    <span className="font-medium text-stone-700">Automated Brute Force Attack Protection</span>
                    <span className="text-emerald-700 font-bold">Active (0 threats)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded">
                    <span className="font-medium text-stone-700">Site Downtime Monitor</span>
                    <span className="text-emerald-700 font-bold">100% Uptime</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB: COMMENTS -------------------- */}
          {activeTab === 'comments' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white border border-[#c3c4c7] p-5 rounded-xs space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-bold text-base text-[#1d2327]">Comments Management</h3>
                  <span className="text-stone-500">0 Pending Moderation</span>
                </div>
                <p className="text-stone-500 italic py-4 text-center">
                  No blog comments currently awaiting moderation.
                </p>
              </div>
            </div>
          )}

          {/* -------------------- TAB: WP BULK DELETE -------------------- */}
          {activeTab === 'bulkdelete' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white border border-[#c3c4c7] p-5 rounded-xs space-y-4">
                <div className="flex items-center gap-2 border-b pb-3">
                  <Trash2 className="w-5 h-5 text-rose-500" />
                  <h3 className="font-bold text-base text-[#1d2327]">WP Bulk Delete Utility</h3>
                </div>
                <p className="text-stone-600">
                  Quickly batch delete posts by category, status, or date range, including automated Supabase Storage media cleanup.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const trashPosts = blogs.filter(b => b.status === 'Trash');
                      if (trashPosts.length === 0) {
                        alert('No posts currently in Trash.');
                        return;
                      }
                      if (confirm(`Empty Trash permanently (${trashPosts.length} posts)?`)) {
                        setBlogs(blogs.filter(b => b.status !== 'Trash'));
                        setAdminNotice({
                          type: 'success',
                          message: `Emptied trash (${trashPosts.length} posts deleted).`
                        });
                      }
                    }}
                    className="bg-[#d63638] hover:bg-[#b32d2e] text-white font-semibold px-4 py-2 rounded transition cursor-pointer"
                  >
                    Empty All Trash ({blogs.filter(b => b.status === 'Trash').length})
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB: WOOCOMMERCE -------------------- */}
          {activeTab === 'woocommerce' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white border border-[#c3c4c7] p-5 rounded-xs space-y-4">
                <div className="flex items-center gap-2 border-b pb-3">
                  <ShoppingBag className="w-5 h-5 text-[#96588a]" />
                  <h3 className="font-bold text-base text-[#1d2327]">WooCommerce Franchise Prospectus & Kits</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                    <div className="text-stone-500">Gross Prospectus Revenue</div>
                    <div className="text-xl font-bold text-stone-900 mt-1">₹45,000</div>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                    <div className="text-stone-500">Orders this Month</div>
                    <div className="text-xl font-bold text-stone-900 mt-1">18 Franchise Starter Kits</div>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                    <div className="text-stone-500">Active Gateways</div>
                    <div className="text-xl font-bold text-emerald-700 mt-1">Razorpay & UPI</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB: PRODUCTS -------------------- */}
          {activeTab === 'products' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white border border-[#c3c4c7] p-5 rounded-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-base text-[#1d2327]">Franchise Merchandise & Curriculum Kits</h3>
                  <button className="bg-[#2271b1] text-white px-3 py-1 rounded font-semibold cursor-pointer">
                    Add Product
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-800">KinderBee Nordic Montessori Play Kit (Ages 2-4)</div>
                      <div className="text-stone-500 text-[11px]">SKU: KB-MONT-01 • In Stock (150 units)</div>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">₹14,999</span>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-800">Comprehensive Franchise Onboarding & Staff Training Manual</div>
                      <div className="text-stone-500 text-[11px]">SKU: KB-TRAIN-DOC • Digital Download</div>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">₹2,500</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB: PAYMENTS -------------------- */}
          {activeTab === 'payments' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white border border-[#c3c4c7] p-5 rounded-xs space-y-4">
                <div className="flex items-center gap-2 border-b pb-3">
                  <CreditCard className="w-5 h-5 text-[#2271b1]" />
                  <h3 className="font-bold text-base text-[#1d2327]">Payment Gateways & Settlement</h3>
                </div>
                <div className="space-y-2">
                  <div className="p-3 border border-stone-200 rounded flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-800">Razorpay India (UPI, Cards, NetBanking)</div>
                      <div className="text-stone-500 text-[11px]">Instant settlement • 0% franchise royalty lock</div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB: ANALYTICS -------------------- */}
          {activeTab === 'analytics' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white border border-[#c3c4c7] p-5 rounded-xs space-y-4">
                <div className="flex items-center gap-2 border-b pb-3">
                  <TrendingUp className="w-5 h-5 text-[#2271b1]" />
                  <h3 className="font-bold text-base text-[#1d2327]">E-Commerce & Lead Analytics</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                    <div className="text-stone-500">Lead Conversion Rate</div>
                    <div className="text-2xl font-bold text-emerald-700 mt-1">14.8%</div>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                    <div className="text-stone-500">Average Order Value</div>
                    <div className="text-2xl font-bold text-[#1d2327] mt-1">₹8,750</div>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                    <div className="text-stone-500">Top Acquisition City</div>
                    <div className="text-2xl font-bold text-[#2271b1] mt-1">Bengaluru</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB: MARKETING -------------------- */}
          {activeTab === 'marketing' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white border border-[#c3c4c7] p-5 rounded-xs space-y-4">
                <div className="flex items-center gap-2 border-b pb-3">
                  <Megaphone className="w-5 h-5 text-[#2271b1]" />
                  <h3 className="font-bold text-base text-[#1d2327]">Marketing & Discount Campaigns</h3>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-800">EARLYBIRD2026 Promo Code</div>
                    <div className="text-stone-500 text-[11px]">₹50,000 waiver on setup kit for first 5 Tier-2 city partners</div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB: WPFORMS -------------------- */}
          {activeTab === 'wpforms' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white border border-[#c3c4c7] p-5 rounded-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-base text-[#1d2327]">WPForms Lead Forms</h3>
                  </div>
                  <button 
                    onClick={() => setActiveTab('enquiries')}
                    className="bg-[#2271b1] text-white px-3 py-1 rounded font-semibold cursor-pointer"
                  >
                    View Submissions ({enquiries.length})
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-800">Franchise Inquiry & Eligibility Form</div>
                      <div className="text-stone-500 text-[11px]">Shortcode: <code>[wpforms id="franchise_inquiry"]</code></div>
                    </div>
                    <span className="font-semibold text-stone-600">{enquiries.length} entries</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB: UAE (Ultimate Addons for Elementor) -------------------- */}
          {activeTab === 'uae' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white border border-[#c3c4c7] p-5 rounded-xs space-y-4">
                <div className="flex items-center gap-2 border-b pb-3">
                  <Sparkles className="w-5 h-5 text-cyan-500" />
                  <h3 className="font-bold text-base text-[#1d2327]">Ultimate Addons for Elementor (UAE)</h3>
                </div>
                <p className="text-stone-600">
                  Nordic curriculum timeline widgets, franchise ROI calculator sliders, and interactive curriculum comparison matrices.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-2.5 bg-stone-50 border border-stone-200 rounded text-center font-semibold text-stone-700">
                    ROI Calculator
                  </div>
                  <div className="p-2.5 bg-stone-50 border border-stone-200 rounded text-center font-semibold text-stone-700">
                    Infographic Timeline
                  </div>
                  <div className="p-2.5 bg-stone-50 border border-stone-200 rounded text-center font-semibold text-stone-700">
                    Interactive Grid
                  </div>
                  <div className="p-2.5 bg-stone-50 border border-stone-200 rounded text-center font-semibold text-stone-700">
                    Pedagogy Showcase
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB: PLUGINS -------------------- */}
          {activeTab === 'plugins' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white border border-[#c3c4c7] p-5 rounded-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-base text-[#1d2327]">Installed Plugins</h3>
                  <button className="bg-[#2271b1] text-white px-3 py-1 rounded font-semibold cursor-pointer">
                    Add New Plugin
                  </button>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Google Site Kit', desc: 'Google Search Console, Analytics 4 & PageSpeed Insights', v: '1.120.0', active: true },
                    { name: 'Astra Pro', desc: 'Premium responsive design modules & header layout engine', v: '4.6.1', active: true },
                    { name: 'Elementor Pro', desc: 'Drag-and-drop live page visual editing framework', v: '3.20.0', active: true },
                    { name: 'Jetpack by Automattic', desc: 'Global image CDN, brute force protection & stats', v: '13.2.0', active: true },
                    { name: 'WP Bulk Delete', desc: 'Fast post and storage cleanup utility', v: '1.2.3', active: true },
                    { name: 'WPForms Pro', desc: 'Interactive lead capture and applicant qualification forms', v: '1.8.7', active: true },
                    { name: 'Ultimate Addons for Elementor', desc: 'Curriculum comparison tables & ROI sliders', v: '1.36.4', active: true },
                  ].map((plugin, idx) => (
                    <div key={idx} className="p-3 bg-stone-50 border border-stone-200 rounded flex items-center justify-between">
                      <div>
                        <div className="font-bold text-stone-800">{plugin.name} <span className="font-normal text-stone-400 text-[10px]">v{plugin.v}</span></div>
                        <div className="text-stone-500 text-[11px]">{plugin.desc}</div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB: USERS -------------------- */}
          {activeTab === 'users' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white border border-[#c3c4c7] p-5 rounded-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-base text-[#1d2327]">Users & Roles</h3>
                  <button 
                    onClick={() => {
                      setNewUsername('');
                      setNewFullName('');
                      setNewEmail('');
                      setNewRole('Administrator');
                      setShowAddUserModal(true);
                    }}
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white px-3 py-1.5 rounded font-semibold cursor-pointer transition-colors"
                  >
                    Add New User
                  </button>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-100 text-[#1d2327]">
                      <th className="p-2.5 font-bold">Username</th>
                      <th className="p-2.5 font-bold">Name</th>
                      <th className="p-2.5 font-bold">Email</th>
                      <th className="p-2.5 font-bold">Role</th>
                      <th className="p-2.5 font-bold">Posts</th>
                      <th className="p-2.5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {users.map((u) => {
                      // Dynamically count posts for each user/author
                      const postsCount = blogs.filter(b => 
                        b.author && (
                          b.author.toLowerCase() === u.username.toLowerCase() || 
                          b.author.toLowerCase() === u.name.toLowerCase() ||
                          (u.username === 'kinderbee_admin' && b.author === 'KinderBee')
                        )
                      ).length;

                      return (
                        <tr key={u.username} className="hover:bg-stone-50">
                          <td className="p-2.5 font-bold text-[#2271b1]">{u.username}</td>
                          <td className="p-2.5 text-stone-800">{u.name}</td>
                          <td className="p-2.5 text-stone-500">{u.email}</td>
                          <td className="p-2.5">
                            <select
                              value={u.role}
                              onChange={(e) => {
                                const updatedRole = e.target.value as any;
                                setUsers(users.map(user => user.username === u.username ? { ...user, role: updatedRole } : user));
                              }}
                              className="bg-white border border-[#8c8f94] rounded px-1.5 py-0.5 text-xs text-stone-700"
                            >
                              <option value="Administrator">Administrator</option>
                              <option value="Editor">Editor</option>
                              <option value="Author">Author</option>
                              <option value="Contributor">Contributor</option>
                            </select>
                          </td>
                          <td className="p-2.5 font-bold text-stone-800">{postsCount}</td>
                          <td className="p-2.5 text-right">
                            {u.username !== 'admin' && u.username !== 'kinderbee_admin' ? (
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to remove user "${u.username}"?`)) {
                                    setUsers(users.filter(user => user.username !== u.username));
                                  }
                                }}
                                className="text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                              >
                                Delete
                              </button>
                            ) : (
                              <span className="text-stone-400 italic">System Default</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Add User Modal */}
              {showAddUserModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl border border-stone-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
                    <div className="bg-stone-100 border-b p-4 flex items-center justify-between">
                      <h4 className="text-base font-bold text-[#1d2327]">Add New User</h4>
                      <button 
                        onClick={() => setShowAddUserModal(false)}
                        className="text-stone-400 hover:text-stone-600 text-lg font-bold"
                      >
                        &times;
                      </button>
                    </div>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!newUsername.trim() || !newFullName.trim() || !newEmail.trim()) {
                        alert('All fields are required');
                        return;
                      }
                      const cleanUsername = newUsername.trim().toLowerCase().replace(/\s+/g, '_');
                      if (users.some(user => user.username === cleanUsername)) {
                        alert('Username already exists');
                        return;
                      }
                      const newUser: WPUser = {
                        username: cleanUsername,
                        name: newFullName.trim(),
                        email: newEmail.trim(),
                        role: newRole
                      };
                      setUsers([...users, newUser]);
                      setShowAddUserModal(false);
                    }} className="p-5 space-y-4 text-xs text-stone-700">
                      <div className="space-y-1">
                        <label className="block font-semibold">Username (required, unique)</label>
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="e.g. janesmith"
                          className="w-full border border-stone-300 rounded p-2 focus:ring-1 focus:ring-[#2271b1] focus:outline-hidden"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-semibold">Full Name</label>
                        <input
                          type="text"
                          value={newFullName}
                          onChange={(e) => setNewFullName(e.target.value)}
                          placeholder="e.g. Jane Smith"
                          className="w-full border border-stone-300 rounded p-2 focus:ring-1 focus:ring-[#2271b1] focus:outline-hidden"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-semibold">Email address</label>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="e.g. jane@kinderbee.in"
                          className="w-full border border-stone-300 rounded p-2 focus:ring-1 focus:ring-[#2271b1] focus:outline-hidden"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-semibold">Role</label>
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value as any)}
                          className="w-full border border-stone-300 rounded p-2 bg-white focus:ring-1 focus:ring-[#2271b1] focus:outline-hidden"
                        >
                          <option value="Administrator">Administrator</option>
                          <option value="Editor">Editor</option>
                          <option value="Author">Author</option>
                          <option value="Contributor">Contributor</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-2 pt-2 border-t">
                        <button
                          type="button"
                          onClick={() => setShowAddUserModal(false)}
                          className="border border-stone-300 rounded px-4 py-2 hover:bg-stone-50 font-semibold text-stone-600 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-[#2271b1] hover:bg-[#135e96] text-white rounded px-4 py-2 font-semibold cursor-pointer"
                        >
                          Add User
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -------------------- TAB: TOOLS -------------------- */}
          {activeTab === 'tools' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-white border border-[#c3c4c7] p-5 rounded-xs space-y-4">
                <div className="flex items-center gap-2 border-b pb-3">
                  <Wrench className="w-5 h-5 text-[#2271b1]" />
                  <h3 className="font-bold text-base text-[#1d2327]">Available Tools</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                    <div className="font-bold text-stone-800">Export Content (XML)</div>
                    <p className="text-stone-500 text-[11px] mt-1">Download backup of all posts, media references and FAQs.</p>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                    <div className="font-bold text-stone-800">Site Health</div>
                    <p className="text-stone-500 text-[11px] mt-1">Check security, performance and server health metrics.</p>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                    <div className="font-bold text-stone-800">Database Optimizer</div>
                    <p className="text-stone-500 text-[11px] mt-1">Purge revision logs and optimize SQL tables.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB 8: GENERAL SETTINGS -------------------- */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveSettings} className="bg-white border border-[#c3c4c7] p-5 shadow-xs rounded-sm space-y-4">
                <h3 className="font-bold text-sm text-[#1d2327] uppercase tracking-wide border-b pb-2">
                  General Contact Details & Analytics
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Corporate Phone</label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Official Email Address</label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">WhatsApp Hotline Number</label>
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Google Analytics Tracking ID</label>
                    <input
                      type="text"
                      placeholder="G-XXXXXXXXXX"
                      value={settingsForm.googleAnalyticsId}
                      onChange={(e) => setSettingsForm({ ...settingsForm, googleAnalyticsId: e.target.value })}
                      className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">Corporate Office Address</label>
                    <input
                      type="text"
                      value={settingsForm.officeAddress}
                      onChange={(e) => setSettingsForm({ ...settingsForm, officeAddress: e.target.value })}
                      className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-5 py-2 rounded transition cursor-pointer shadow-xs"
                  >
                    Save General Settings
                  </button>
                  {settingsSaved && <span className="text-emerald-700 text-xs font-bold">✓ Saved!</span>}
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* ----------------- GUTENBERG BLOCK EDITOR MODAL ----------------- */}
      {isEditingBlog && (
        <GutenbergEditor
          initialPost={currentBlogForm}
          adminToken={adminToken}
          onSave={async (postPayload) => {
            const isExisting = postPayload.id && blogs.some(b => b.id === postPayload.id);
            const method = isExisting ? 'PUT' : 'POST';
            const url = method === 'PUT' ? `/api/blogs/${postPayload.id}` : '/api/blogs';
            
            // Optimistic local update
            const fullPostObj: BlogPost = {
              id: postPayload.id || `wp_post_${Date.now()}`,
              title: postPayload.title || 'Untitled',
              slug: postPayload.slug || 'untitled',
              excerpt: postPayload.excerpt || '',
              content: postPayload.content || '',
              category: postPayload.category || 'Pedagogy & Curriculum',
              tags: postPayload.tags || [],
              author: postPayload.author || 'KinderBee',
              date: postPayload.date || new Date().toISOString().split('T')[0],
              status: postPayload.status || 'Published',
              views: postPayload.views || 0,
              readTime: postPayload.readTime || '5 min read',
              image: postPayload.image || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
              imageStoragePath: postPayload.imageStoragePath || ''
            };

            setBlogs(prev => {
              if (isExisting) {
                return prev.map(b => b.id === postPayload.id ? fullPostObj : b);
              }
              return [fullPostObj, ...prev];
            });

            setCurrentBlogForm(fullPostObj);

            try {
              const res = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(postPayload)
              });
              const data = await res.json();
              if (data.success) {
                fetchData();
              }
            } catch (err) {
              console.error('Error saving Gutenberg post to server:', err);
            }
          }}
          onClose={() => {
            setIsEditingBlog(false);
            setCurrentBlogForm({});
            setActiveTab('dashboard');
          }}
        />
      )}

      {/* ----------------- WORDPRESS FULL PAGE BLOG VIEW MODAL ----------------- */}
      {viewingFullPost && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
          <WpFullPostView
            post={viewingFullPost}
            onBack={() => setViewingFullPost(null)}
            onEditInGutenberg={() => {
              const target = viewingFullPost;
              setViewingFullPost(null);
              setCurrentBlogForm(target);
              setIsEditingBlog(true);
            }}
          />
        </div>
      )}

      {/* ----------------- MODAL: EDIT / CREATE FAQ ----------------- */}
      {isEditingFaq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-[#c3c4c7] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-[#1d2327]">
                {currentFaqForm.id ? 'Edit FAQ Item' : 'Add FAQ Item'}
              </h3>
              <button onClick={() => setIsEditingFaq(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={currentFaqForm.question || ''}
                  onChange={(e) => setCurrentFaqForm({ ...currentFaqForm, question: e.target.value })}
                  className="w-full bg-white border border-[#8c8f94] rounded px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category</label>
                <select
                  value={currentFaqForm.category || 'HOME'}
                  onChange={(e) => setCurrentFaqForm({ ...currentFaqForm, category: e.target.value })}
                  className="w-full bg-white border border-[#8c8f94] rounded px-3 py-2 text-xs"
                >
                  <option value="HOME">HOME</option>
                  <option value="FRANCHISE">FRANCHISE</option>
                  <option value="FWA">FWA</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Answer</label>
                <textarea
                  rows={4}
                  required
                  value={currentFaqForm.answer || ''}
                  onChange={(e) => setCurrentFaqForm({ ...currentFaqForm, answer: e.target.value })}
                  className="w-full bg-white border border-[#8c8f94] rounded px-3 py-2 text-xs"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditingFaq(false)}
                  className="px-4 py-2 border border-stone-300 rounded text-xs font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2271b1] hover:bg-[#135e96] text-white px-5 py-2 rounded text-xs font-semibold"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: AI EMAIL DRAFT ----------------- */}
      {selectedEnquiryForEmail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-[#c3c4c7] shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#e1007a]" />
                <h3 className="font-bold text-base text-[#1d2327]">
                  AI Intelligent Response Draft
                </h3>
              </div>
              <button onClick={() => setSelectedEnquiryForEmail(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                <strong>Recipient:</strong> {selectedEnquiryForEmail.name} ({selectedEnquiryForEmail.email})
                <div><strong>Inquiry:</strong> {selectedEnquiryForEmail.type} - {selectedEnquiryForEmail.city}</div>
              </div>

              {emailDraftLoading ? (
                <div className="py-8 text-center text-stone-500 font-semibold flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#e1007a]" />
                  <span>Drafting tailored advisory response with Gemini...</span>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Generated Response Draft</label>
                  <textarea
                    rows={8}
                    value={emailDraftText}
                    onChange={(e) => setEmailDraftText(e.target.value)}
                    className="w-full bg-white border border-[#8c8f94] rounded px-3 py-2 text-xs font-mono"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => setSelectedEnquiryForEmail(null)}
                className="px-4 py-2 border border-stone-300 rounded text-xs font-semibold text-stone-700 hover:bg-stone-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(emailDraftText);
                  alert('Email draft copied to clipboard!');
                }}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white px-5 py-2 rounded text-xs font-semibold"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
