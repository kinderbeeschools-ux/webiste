import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { StickyContactWidget } from './components/StickyContactWidget';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PartnershipsPage } from './pages/PartnershipsPage';
import { FwaPage } from './pages/FwaPage';
import { ProgramsOverviewPage } from './pages/ProgramsOverviewPage';
import { InvestorsPage } from './pages/InvestorsPage';
import { BlogPage } from './pages/BlogPage';
import { SinglePostView } from './pages/SinglePostView';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { PaymentPage } from './pages/PaymentPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { WhatsAppButton } from './components/WhatsAppButton';
import { SystemSettings, BlogPost, FAQItem } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const hash = window.location.hash.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const isPathAdmin = pathname === '/admin' || pathname.endsWith('/admin');
    const isParamAdmin = params.get('tab') === 'admin' || params.get('admin') === 'true' || params.get('view') === 'admin';
    const isHashAdmin = hash === '#admin' || hash === '#/admin';

    if (isPathAdmin || isHashAdmin || isParamAdmin) {
      return 'admin';
    }

    if (hash === '#payments' || hash === '#/payments' || pathname === '/payments') {
      return 'payments';
    }

    // Default to last active tab if logged in as admin
    const token = localStorage.getItem('kips_admin_token');
    const savedTab = localStorage.getItem('kips_current_tab');
    if (token && savedTab) {
      return savedTab;
    }
    return savedTab || 'home';
  });
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  // Modals & Single Post Selection
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [consultationType, setConsultationType] = useState('franchise');
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('kips_admin_token'));
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  // Payment Pre-selection
  const [paymentProgramme, setPaymentProgramme] = useState('Advanced Diploma in Early Childhood Care & Education (ECCE)');
  const [paymentAmount, setPaymentAmount] = useState('4999');

  // Persist tab changes
  useEffect(() => {
    localStorage.setItem('kips_current_tab', currentTab);
  }, [currentTab]);

  useEffect(() => {
    // Check URL parameters, pathname and hash for direct admin routing
    const checkAdminRoute = () => {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const isPathAdmin = pathname === '/admin' || pathname.endsWith('/admin');
      const isParamAdmin = params.get('tab') === 'admin' || params.get('admin') === 'true' || params.get('view') === 'admin';
      const isHashAdmin = hash === '#admin' || hash === '#/admin';

      if (isPathAdmin || isHashAdmin || isParamAdmin) {
        const token = localStorage.getItem('kips_admin_token');
        if (token) {
          setCurrentTab('admin');
        } else {
          setAdminLoginOpen(true);
        }
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    return () => window.removeEventListener('hashchange', checkAdminRoute);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab, selectedBlog]);

  useEffect(() => {
    // Fetch initial settings, blogs, faqs
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));

    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        const params = new URLSearchParams(window.location.search);
        const blogIdParam = params.get('blogId');
        if (blogIdParam) {
          const found = data.find((b: BlogPost) => b.id === blogIdParam);
          if (found) {
            setSelectedBlog(found);
            setCurrentTab('blogs');
          }
        }
      })
      .catch(err => console.error(err));

    fetch('/api/faqs')
      .then(res => res.json())
      .then(data => setFaqs(data))
      .catch(err => console.error(err));
  }, []);

  const handleOpenConsultation = (type = 'franchise') => {
    setConsultationType(type);
    setConsultationOpen(true);
  };

  const handleNavigateToPayment = (
    programme = 'Advanced Diploma in Early Childhood Care & Education (ECCE)',
    amount = '4999'
  ) => {
    setPaymentProgramme(programme);
    setPaymentAmount(amount);
    setCurrentTab('payments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('kips_admin_token', token);
    setCurrentTab('admin');
  };

  const handleLogoutAdmin = () => {
    setAdminToken(null);
    localStorage.removeItem('kips_admin_token');
    setCurrentTab('home');
  };

  // If user is on Admin Tab and authenticated, display dedicated WordPress-style Admin Dashboard
  if (currentTab === 'admin' && adminToken) {
    return (
      <AdminDashboard
        adminToken={adminToken}
        onLogout={handleLogoutAdmin}
        onVisitSite={() => setCurrentTab('home')}
        settings={settings}
        onUpdateSettings={newSets => setSettings(newSets)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1917] flex flex-col selection:bg-[#E1007A]/20 selection:text-[#E1007A]">
      
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        settings={settings}
        onOpenAdminLogin={() => setAdminLoginOpen(true)}
        isAdminLoggedIn={!!adminToken}
        onLogoutAdmin={handleLogoutAdmin}
        onOpenConsultation={() => handleOpenConsultation('franchise')}
      />

      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            setCurrentTab={setCurrentTab}
            onOpenConsultation={handleOpenConsultation}
            blogs={blogs}
            faqs={faqs}
            onSelectBlog={blog => setSelectedBlog(blog)}
            settings={settings}
          />
        )}
        {currentTab === 'about' && (
          <AboutPage 
            setCurrentTab={setCurrentTab} 
            onOpenConsultation={handleOpenConsultation} 
            settings={settings} 
          />
        )}
        {(currentTab === 'franchise' || currentTab.startsWith('partnerships')) && (
          <PartnershipsPage 
            subTab={
              (currentTab === 'partnerships-cbse' || currentTab === 'partnerships-ib') ? 'cbse' :
              currentTab === 'partnerships-degree' ? 'degree' :
              'preschool'
            }
            onSelectSubTab={(sub) => setCurrentTab(`partnerships-${sub}`)}
            onOpenConsultation={handleOpenConsultation} 
            settings={settings} 
          />
        )}
        {currentTab === 'fwa' && (
          <FwaPage 
            onOpenConsultation={handleOpenConsultation} 
            onNavigateToPayment={handleNavigateToPayment}
            settings={settings} 
          />
        )}
        {(currentTab === 'programs' || currentTab === 'programs-overview') && (
          <ProgramsOverviewPage 
            onOpenConsultation={handleOpenConsultation} 
            settings={settings} 
            setCurrentTab={setCurrentTab} 
          />
        )}
        {currentTab === 'investors' && (
          <InvestorsPage onOpenConsultation={handleOpenConsultation} settings={settings} setCurrentTab={setCurrentTab} />
        )}
        {currentTab === 'blogs' && selectedBlog && (
          <SinglePostView
            blog={selectedBlog}
            allBlogs={blogs}
            onBack={() => setSelectedBlog(null)}
            onSelectBlog={(blog) => setSelectedBlog(blog)}
            settings={settings}
          />
        )}
        {currentTab === 'blogs' && !selectedBlog && (
          <BlogPage blogs={blogs} onSelectBlog={blog => setSelectedBlog(blog)} settings={settings} />
        )}
        {currentTab === 'contact' && (
          <ContactPage settings={settings} />
        )}
        {(currentTab === 'payments' || currentTab === 'pay-fees' || currentTab === 'fee-payment') && (
          <PaymentPage 
            onNavigate={setCurrentTab}
            preselectedProgramme={paymentProgramme}
            preselectedAmount={paymentAmount}
          />
        )}
        {currentTab === 'privacy-policy' && (
          <PrivacyPolicyPage setCurrentTab={setCurrentTab} settings={settings} />
        )}
        {(currentTab === 'terms-and-conditions' || currentTab === 'terms') && (
          <TermsPage setCurrentTab={setCurrentTab} settings={settings} />
        )}
        {(currentTab === 'cancellation-refund' || currentTab === 'refund-policy') && (
          <RefundPolicyPage setCurrentTab={setCurrentTab} settings={settings} />
        )}
        {currentTab === 'admin' && !adminToken && (
          <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-stone-200 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#E1007A]/10 text-[#E1007A] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Admin Authentication Required</h3>
            <p className="text-sm text-stone-600">Please sign in with your administrator credentials to access the WordPress Admin control panel.</p>
            <button
              onClick={() => setAdminLoginOpen(true)}
              className="bg-[#E1007A] hover:bg-[#c00068] text-white px-6 py-3 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              Sign In to WordPress Admin
            </button>
          </div>
        )}
      </main>

      <Footer
        settings={settings}
        setCurrentTab={setCurrentTab}
        onOpenConsultation={() => handleOpenConsultation('franchise')}
      />

      {/* Floating Sticky Actions (Call + WhatsApp + Live Advisory Desk) */}
      <StickyContactWidget
        settings={settings}
        onOpenConsultation={() => handleOpenConsultation('franchise')}
      />

      {/* Global Floating WhatsApp Quick Action */}
      <WhatsAppButton phoneNumber={settings?.phone || '81223 44040'} />

      {/* Modals */}
      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        defaultType={consultationType}
        onNavigateToPayment={handleNavigateToPayment}
      />

      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}

export default App;
