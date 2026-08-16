import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, ArrowRight, MapPin } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import type { CompanyInfo } from '../types/api';
import { getImageUrl } from '../utils/image';

interface HeaderProps {
  companyInfo?: CompanyInfo | null;
}

export const Header: React.FC<HeaderProps> = ({ companyInfo }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="w-full z-50 sticky top-0 transition-all duration-300">
      {/* Top Header Utility Bar */}
      <div className="bg-[#0a1120] text-slate-300 text-xs py-2 border-b border-slate-800/80 hidden md:block">
        <Container className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            {companyInfo?.phone && (
              <a href={`tel:${companyInfo.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span className="font-bold text-white">{companyInfo.phone}</span>
              </a>
            )}
            {companyInfo?.email && (
              <a href={`mailto:${companyInfo.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>{companyInfo.email}</span>
              </a>
            )}
            {companyInfo?.address && (
              <span className="text-slate-300 flex items-center gap-1.5 hidden lg:flex">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{companyInfo.address}</span>
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {companyInfo?.working_hours && (
              <span className="text-slate-300 flex items-center gap-1.5 text-[11px] font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                <span>{companyInfo.working_hours}</span>
              </span>
            )}
            {companyInfo?.arabic_name && (
              <span className="text-amber-400 font-bold text-xs tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800/90 border border-slate-700/60 font-arabic">
                {companyInfo.arabic_name}
              </span>
            )}
          </div>
        </Container>
      </div>

      {/* Main Navbar - Light / White Theme */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 sm:py-3 border-b border-slate-200'
            : 'bg-white py-3 sm:py-3.5 border-b border-slate-200 shadow-sm'
        }`}
      >
        <Container className="flex items-center justify-between">
          {/* Logo & Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            {(companyInfo?.logo_url || companyInfo?.logo) ? (
              <img src={getImageUrl(companyInfo.logo_url || companyInfo.logo)} alt={companyInfo.company_name || companyInfo.name || 'Logo'} className="h-10 sm:h-12 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                </svg>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 uppercase leading-none">
                {companyInfo?.company_name || companyInfo?.name || 'White Star Cargo'}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                {companyInfo?.arabic_name && (
                  <span className="text-[10px] text-primary font-bold tracking-wide">
                    {companyInfo.arabic_name}
                  </span>
                )}
                {companyInfo?.arabic_name && companyInfo?.tagline && (
                  <span className="text-slate-300 text-[10px] hidden sm:inline">•</span>
                )}
                {companyInfo?.tagline && (
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold tracking-wider hidden sm:inline uppercase">
                    {companyInfo.tagline}
                  </span>
                )}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 text-sm font-bold transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-slate-700 hover:text-primary'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link to="/contact">
              <Button variant="accent" size="sm" className="px-5 py-2.5 rounded-full font-bold shadow-md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Get a Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-800 hover:text-slate-900 focus:outline-none rounded-xl bg-slate-100 border border-slate-200 active:scale-95 transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
          </button>
        </Container>
      </div>

      {/* Mobile Navigation Drawer with Backdrop */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 top-[60px] flex flex-col">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm -z-10" onClick={() => setMobileMenuOpen(false)} />

          {/* Drawer Body */}
          <div className="bg-white text-slate-900 border-b border-slate-200 shadow-2xl rounded-b-3xl max-h-[85vh] overflow-y-auto">
            <Container className="py-6 flex flex-col space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-3 text-base font-semibold rounded-2xl transition-colors ${
                      isActive ? 'bg-primary text-white font-bold shadow-md' : 'text-slate-800 hover:bg-slate-100 active:bg-slate-200'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Mobile Direct Action Buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                {companyInfo?.phone && (
                  <a
                    href={`tel:${companyInfo.phone}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-sm transition-colors"
                  >
                    <Phone className="w-4 h-4 text-primary" />
                    <span>Call Us: {companyInfo.phone}</span>
                  </a>
                )}

                <Link to="/contact" className="block w-full">
                  <Button variant="accent" size="md" className="w-full justify-center shadow-lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Get a Quote
                  </Button>
                </Link>
              </div>
            </Container>
          </div>
        </div>
      )}
    </header>
  );
};
