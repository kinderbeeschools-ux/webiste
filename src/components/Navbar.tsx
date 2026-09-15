import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, ChevronDown, MessageSquare, ArrowRight, CreditCard, QrCode } from 'lucide-react';
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
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(true);

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
    { id: 'franchise', label: 'Franchise' },
    { id: 'fwa', label: 'Teacher Training', fullLabel: 'NTT Teacher Training' },
    { 
      id: 'investors', 
      label: 'Partner with us',
      dropdown: [
        { id: 'partnerships-cbse', label: 'CBSE & IB School Setup', desc: 'End-to-end K-12 school establishment' },
        { id: 'partnerships-degree', label: 'Degree College Setup', desc: 'Higher education institution consultancy' },
        { id: 'programs', label: 'Programs & Solutions Overview', desc: 'All institutional academic pathways' }
      ]
    },
    { id: 'blogs', label: 'Blog' },
    { id: 'contact', label: 'Contact Us' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs">
        {/* Main Navbar Container: Full responsive max-w with flexible item scaling */}
        <div className="max-w-[1440px] w-full mx-auto px-3 sm:px-4 lg:px-4 xl:px-8 h-20 flex items-center justify-between gap-1.5 sm:gap-3 xl:gap-4 min-w-0">
          
          {/* Brand Logo - Aligned left and vertically centered */}
          <div 
            onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
            className="cursor-pointer flex items-center gap-2 group shrink-0"
          >
            <div className="h-10 sm:h-11 lg:h-11 xl:h-13 w-auto flex items-center group-hover:scale-102 transition duration-300">
              <img 
                src={settings?.logoUrl || "https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Logo.png"} 
                alt={settings?.logoText || "Kinderbee Logo"} 
                className="h-full w-auto max-h-10 sm:max-h-11 lg:max-h-11 xl:max-h-13 object-contain contrast-[1.08] brightness-[1.02] filter drop-shadow-xs transition duration-300"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
            </div>
          </div>

          {/* Desktop Nav Links - Centered between Logo & CTA with balanced spacing and adaptive typography */}
          <nav className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1 2xl:gap-2 flex-1 px-1 xl:px-2 whitespace-nowrap min-w-0">
            {navLinks.map((link) => {
              const isActive = 
                currentTab === link.id || 
                (link.id === 'franchise' && (currentTab === 'franchise' || currentTab === 'partnerships' || currentTab === 'partnerships-preschool')) ||
                (link.dropdown && link.dropdown.some(sub => sub.id === currentTab)) ||
                (link.id === 'investors' && (currentTab === 'investors' || currentTab === 'partnerships-cbse' || currentTab === 'partnerships-degree' || currentTab === 'programs'));

              if (link.dropdown) {
                return (
                  <div key={link.id} className="relative group inline-flex items-center h-9 xl:h-10 shrink-0">
                    <button
                      onClick={() => setCurrentTab(link.id)}
                      className={`h-9 xl:h-10 px-2 xl:px-2.5 2xl:px-3.5 inline-flex items-center justify-center gap-1 xl:gap-1.5 rounded-xl text-xs xl:text-[13.5px] 2xl:text-[15px] font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-[#E1007A]/10 text-[#E1007A] font-bold'
                          : 'text-stone-700 hover:text-[#E1007A] hover:bg-stone-100/80'
                      }`}
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span>{link.label}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-current transition-transform duration-200 group-hover:rotate-180 opacity-70 group-hover:opacity-100 shrink-0 mt-0.5" />
                    </button>

                    {/* Dropdown Menu - Top padding bridge ensures hover never flickers or drops */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 pointer-events-none group-hover:pointer-events-auto">
                      <div className="bg-white border border-stone-200/90 shadow-xl rounded-2xl p-2 overflow-hidden ring-1 ring-black/5">
                        {link.dropdown.map((sub, i) => {
                          const isSubActive = currentTab === sub.id;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setCurrentTab(sub.id);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer flex flex-col gap-0.5 ${
                                isSubActive 
                                  ? 'bg-pink-50 text-[#E1007A] font-bold' 
                                  : 'text-stone-700 hover:text-[#E1007A] hover:bg-pink-50/60'
                              }`}
                            >
                              <span className="text-sm font-semibold flex items-center justify-between">
                                <span>{sub.label}</span>
                                {isSubActive && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#E1007A] shrink-0" />
                                )}
                              </span>
                              {sub.desc && (
                                <span className={`text-[11px] font-normal ${isSubActive ? 'text-[#E1007A]/80' : 'text-stone-400'}`}>
                                  {sub.desc}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`h-9 xl:h-10 px-2 xl:px-2.5 2xl:px-3.5 inline-flex items-center justify-center rounded-xl text-xs xl:text-[13.5px] 2xl:text-[15px] font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#E1007A]/10 text-[#E1007A] font-bold'
                      : link.id === 'payments'
                      ? 'text-stone-800 hover:text-[#E1007A] hover:bg-amber-50/80 font-bold'
                      : 'text-stone-700 hover:text-[#E1007A] hover:bg-stone-100/80'
                  }`}
                >
                  {link.id === 'payments' ? (
                    <span className="inline-flex items-center gap-1 text-[#E1007A] font-bold">
                      <CreditCard className="w-3.5 h-3.5 shrink-0 hidden 2xl:inline-block" />
                      <span>{link.label}</span>
                    </span>
                  ) : (
                    link.label
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Button - Aligned right and vertically leveled with nav (h-9 / h-10) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            <button
              onClick={onOpenConsultation}
              className="h-9 xl:h-10 px-3 xl:px-4 2xl:px-5 inline-flex items-center justify-center gap-1.5 xl:gap-2 rounded-xl bg-gradient-to-r from-[#E1007A] to-pink-600 hover:from-[#c8006d] hover:to-pink-700 text-white font-bold text-xs xl:text-sm shadow-sm hover:shadow-md transition duration-200 cursor-pointer whitespace-nowrap"
            >
              <span>Speak to an Advisor</span>
              <ArrowRight className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0" />
            </button>
          </div>

          {/* Mobile & Tablet Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-xl text-stone-800 bg-stone-100 hover:bg-stone-200 active:scale-95 transition shrink-0 cursor-pointer"
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

          {/* Left-to-Right Drawer Container */}
          <div 
            className="relative w-[85vw] max-w-[320px] bg-white h-[100dvh] shadow-2xl flex flex-col justify-between z-10 animate-slideRight border-r border-stone-200 select-none overflow-hidden"
          >
            {/* Drawer Header with Perfect Alignment */}
            <div className="h-18 px-4 flex items-center justify-between border-b border-stone-100 shrink-0 bg-white">
              <div 
                onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
                className="cursor-pointer flex items-center"
              >
                <img 
                  src={settings?.logoUrl || "https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Logo.png"} 
                  alt="Kinderbee Logo" 
                  className="h-9 sm:h-10 w-auto object-contain contrast-[1.06] brightness-[1.02]"
                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                />
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="h-9 w-9 inline-flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Nav Items */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 space-y-1.5 scroll-smooth bg-white">
              {navLinks.map((link) => {
                const isActive = 
                  currentTab === link.id || 
                  (link.id === 'franchise' && (currentTab === 'franchise' || currentTab === 'partnerships' || currentTab === 'partnerships-preschool')) ||
                  (link.dropdown && link.dropdown.some(d => d.id === currentTab)) ||
                  (link.id === 'investors' && (currentTab === 'investors' || currentTab === 'partnerships-cbse' || currentTab === 'partnerships-degree' || currentTab === 'programs'));
                
                if (link.dropdown) {
                  return (
                    <div key={link.id} className="rounded-xl border border-stone-100/90 overflow-hidden bg-stone-50/50">
                      <div 
                        onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                        className={`w-full h-11 px-3.5 flex items-center justify-between rounded-xl text-sm font-semibold transition cursor-pointer ${
                          isActive ? 'text-[#E1007A] font-bold bg-pink-50/70' : 'text-stone-700 hover:bg-stone-100/80'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{link.label}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${mobileDropdownOpen ? 'rotate-180 text-[#E1007A]' : ''}`} />
                      </div>

                      {mobileDropdownOpen && (
                        <div className="px-2 pb-2 pt-1 space-y-1 bg-white/70 border-t border-stone-100">
                          {link.dropdown.map((sub) => {
                            const isSubActive = currentTab === sub.id;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => {
                                  setCurrentTab(sub.id);
                                  setMobileMenuOpen(false);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition text-left cursor-pointer ${
                                  isSubActive
                                    ? 'bg-pink-50 text-[#E1007A] font-bold'
                                    : 'text-stone-600 hover:text-[#E1007A] hover:bg-stone-50'
                                }`}
                              >
                                <span>{sub.label}</span>
                                {isSubActive && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#E1007A] shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setCurrentTab(link.id);
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full h-11 px-3.5 inline-flex items-center justify-between rounded-xl text-sm font-semibold transition text-left cursor-pointer ${
                      isActive
                        ? 'bg-pink-50 text-[#E1007A] font-bold shadow-2xs'
                        : 'text-stone-700 hover:text-[#E1007A] hover:bg-stone-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E1007A] shrink-0" />
                    )}
                  </button>
                );
              })}

              {/* Drawer Bottom Action Buttons */}
              <div className="pt-4 pb-2 space-y-2 border-t border-stone-100 mt-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenConsultation();
                  }}
                  className="w-full h-10 border border-stone-200 hover:border-pink-200 bg-white hover:bg-pink-50/50 text-stone-800 text-xs font-bold px-3 rounded-xl shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#E1007A]" />
                  <span>Speak to an Advisor</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentTab('investors');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full h-10 bg-gradient-to-r from-[#E1007A] to-pink-600 hover:opacity-95 text-white font-bold px-3 rounded-xl shadow-xs text-xs text-center flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span>Partner With Us</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
