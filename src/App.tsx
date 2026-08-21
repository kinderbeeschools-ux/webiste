import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { StickyContactWidget } from './components/StickyContactWidget';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PartnershipsPage } from './pages/PartnershipsPage';
import { FwaPage } from './pages/FwaPage';
import { InvestorsPage } from './pages/InvestorsPage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailModal } from './pages/BlogDetailModal';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { SystemSettings, BlogPost, FAQItem } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  // Modals
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [consultationType, setConsultationType] = useState('franchise');
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('kips_admin_token'));
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Fetch initial settings, blogs, faqs
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));

    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => setBlogs(data))
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
          />
        )}
        {currentTab === 'about' && (
          <AboutPage onOpenConsultation={() => handleOpenConsultation('franchise')} />
        )}
        {currentTab === 'partnerships' && (
          <PartnershipsPage onOpenConsultation={handleOpenConsultation} />
        )}
        {currentTab === 'fwa' && (
          <FwaPage onOpenConsultation={handleOpenConsultation} />
        )}
        {currentTab === 'investors' && (
          <InvestorsPage onOpenConsultation={handleOpenConsultation} />
        )}
        {currentTab === 'blogs' && (
          <BlogPage blogs={blogs} onSelectBlog={blog => setSelectedBlog(blog)} />
        )}
        {currentTab === 'contact' && (
          <ContactPage settings={settings} />
        )}
        {currentTab === 'admin' && adminToken && (
          <AdminDashboard
            adminToken={adminToken}
            onLogout={handleLogoutAdmin}
            settings={settings}
            onUpdateSettings={newSets => setSettings(newSets)}
          />
        )}
        {currentTab === 'admin' && !adminToken && (
          <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-stone-200 text-center space-y-4">
            <h3 className="text-xl font-bold">Admin Authentication Required</h3>
            <p className="text-sm text-stone-600">Please sign in with your administrator password to access the control panel.</p>
            <button
              onClick={() => setAdminLoginOpen(true)}
              className="bg-[#E1007A] text-white px-6 py-3 rounded-xl text-sm font-medium"
            >
              Open Login Prompt
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

      {/* Modals */}
      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        defaultType={consultationType}
      />

      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <BlogDetailModal
        blog={selectedBlog}
        onClose={() => setSelectedBlog(null)}
      />

    </div>
  );
}

export default App;
