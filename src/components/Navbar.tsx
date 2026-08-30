import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, MessageSquare } from 'lucide-react';
import { SystemSettings } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  settings: SystemSettings | null;
  onOpenAdminLogin: () => void;
  isAdminLoggedIn: boolean;
  onLogoutAdmin: () => void;
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  settings,
  onOpenAdminLogin,
  isAdminLoggedIn,
  onLogoutAdmin,
  onOpenConsultation
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { 
      id: 'partnerships', 
      label: 'Franchise',
      dropdown: [
        { id: 'partnerships#preschool', label: 'Franchise Preschool' },
        { id: 'partnerships#cbse', label: 'CBSE School setup' },
        { id: 'partnerships#ib', label: 'IB School setup' },
        { id: 'partnerships#degree', label: 'Degree College setup' }
      ]
    },
    { 
      id: 'fwa', 
      label: 'Academic',
      dropdown: [
        { id: 'fwa#programs', label: 'Toddler program (1.5-2.5 yr)' },
        { id: 'fwa#programs', label: 'Pre k program(2.5-3.5yr)' },
        { id: 'fwa#programs', label: 'Kindergarten (3.5-5.5 yr)' },
        { id: 'fwa#programs', label: 'Teacher training' }
      ]
    },
    { id: 'investors', label: 'Partner with us' },
    { id: 'blogs', label: 'Blog' },
    { id: 'contact', label: 'Contact Us' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div 
            onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
            className="cursor-pointer flex items-center gap-3 group shrink-0"
          >
            <div className="h-11 w-auto sm:h-13 rounded-xl overflow-hidden group-hover:scale-102 transition duration-300 flex items-center">
              <img 
                src={settings?.logoUrl || "https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Logo.png"} 
                alt={settings?.logoText || "Kinderbee Logo"} 
                className="h-full w-auto object-contain max-h-12"
              />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 ml-auto mr-4 whitespace-nowrap relative">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              
              if (link.dropdown) {
                return (
                  <div key={link.id} className="relative group cursor-pointer">
                    <button
                      onClick={() => setCurrentTab(link.id)}
                      className={`px-3.5 py-2 rounded-xl text-base font-semibold transition duration-200 whitespace-nowrap flex items-center gap-1 ${
                        isActive
                          ? 'bg-[#E1007A]/10 text-[#E1007A]'
                          : 'text-stone-700 hover:text-[#E1007A] hover:bg-stone-100'
                      }`}
                    >
                      {link.label}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-stone-200 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                      {link.dropdown.map((sub, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setCurrentTab(link.id);
                            setTimeout(() => {
                              const el = document.getElementById(sub.id.split('#')[1]);
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                          }}
                          className="px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-[#E1007A] hover:bg-pink-50 transition cursor-pointer border-b border-stone-100 last:border-none"
                        >
                          {sub.label}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`px-3.5 py-2 rounded-xl text-base font-semibold transition duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#E1007A]/10 text-[#E1007A]'
                      : 'text-stone-700 hover:text-[#E1007A] hover:bg-stone-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Button & Admin Controls */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {isAdminLoggedIn && (
              <div className="flex items-center gap-2 mr-1">
                <button 
                  onClick={() => setCurrentTab('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${currentTab === 'admin' ? 'bg-[#E1007A] text-white' : 'bg-pink-50 text-[#E1007A] hover:bg-pink-100'}`}
                >
                  Admin Panel
                </button>
                <button 
                  onClick={onLogoutAdmin}
                  className="text-stone-500 hover:text-stone-800 text-xs underline cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
            <button
              onClick={onOpenConsultation}
              className="bg-gradient-to-r from-[#E1007A] to-pink-600 hover:from-pink-700 hover:to-pink-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-base flex items-center gap-2 cursor-pointer"
            >
              <span>Talk to an Expert</span>
            </button>
          </div>

          {/* Mobile & Tablet Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2.5 rounded-xl text-stone-800 bg-stone-100/90 hover:bg-stone-200 active:scale-95 transition shrink-0 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 text-stone-800" />
          </button>
        </div>
      </header>

      {/* Portal-Mounted Mobile Side Drawer Menu (Smooth Left-to-Right Slide-in) */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="lg:hidden fixed inset-0 z-[999999] flex isolate">
          {/* Dim Backdrop (Click anywhere to close) */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Left-to-Right Drawer Container (80% Viewable Width, Proportional & Fully Responsive) */}
          <div 
            className="relative w-[80vw] max-w-[280px] bg-white h-[100dvh] shadow-2xl flex flex-col justify-between z-10 animate-slideRight border-r border-stone-200 select-none overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-3.5 flex items-center justify-between border-b border-stone-100 shrink-0 bg-white">
              <div 
                onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
                className="cursor-pointer flex items-center gap-2"
              >
                <img 
                  src="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Logo.png" 
                  alt="KinderBee Logo" 
                  className="h-8 w-auto object-contain"
                />
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Area (Links + Action Buttons) */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 space-y-1 scroll-smooth bg-white">
              {navLinks.map((link) => {
                const isActive = currentTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setCurrentTab(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[13px] sm:text-sm font-semibold transition-all duration-150 text-left cursor-pointer ${
                      isActive
                        ? 'bg-pink-50 text-[#E1007A] font-bold'
                        : 'text-stone-700 hover:text-[#E1007A] hover:bg-stone-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E1007A] shrink-0"></span>
                    )}
                  </button>
                );
              })}

              {/* Extra spacing inside scrollable area to prevent cut off */}
              <div className="pt-4 pb-2 space-y-2 border-t border-stone-100 mt-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenConsultation();
                  }}
                  className="w-full border border-stone-200 hover:border-pink-200 bg-white hover:bg-pink-50/50 text-stone-800 text-xs font-semibold py-2.5 px-3 rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#E1007A]" />
                  <span>Talk to an Expert</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenConsultation();
                  }}
                  className="w-full bg-gradient-to-r from-[#E1007A] via-[#E1007A] to-orange-400 hover:opacity-95 text-white font-bold py-2.5 px-3 rounded-lg shadow-sm text-xs text-center transition cursor-pointer"
                >
                  Partner With Us
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
