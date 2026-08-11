import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, Truck, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import type { CompanyInfo } from '../types/api';

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
      <div className="bg-slate-900 text-slate-200 text-xs py-2 border-b border-slate-800 hidden md:block">
        <Container className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            {companyInfo?.phone && (
              <a href={`tel:${companyInfo.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold">{companyInfo.phone}</span>
              </a>
            )}
            {companyInfo?.email && (
              <a href={`mailto:${companyInfo.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>{companyInfo.email}</span>
              </a>
            )}
            {companyInfo?.address && (
              <span className="text-slate-300 flex items-center gap-1 hidden lg:flex">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{companyInfo.address}</span>
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary border border-primary/30">
              <ShieldCheck className="w-3 h-3 text-primary" />
              ISO 9001:2015 Accredited Cargo Hub
            </span>
          </div>
        </Container>
      </div>

      {/* Main Navbar - Light / White Theme */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 sm:py-3 border-b border-slate-200'
            : 'bg-white py-3.5 sm:py-4 border-b border-slate-200 shadow-sm'
        }`}
      >
        <Container className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            {companyInfo?.logo_url ? (
              <img src={companyInfo.logo_url} alt={companyInfo.company_name} className="h-9 sm:h-10 w-auto object-contain" />
            ) : (
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-lg glow-brand group-hover:scale-105 transition-transform shrink-0">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-black tracking-tight text-slate-900 uppercase leading-none">
                {companyInfo?.company_name || 'WHITE STAR CARGO'}
              </span>
              {companyInfo?.tagline && (
                <span className="text-[9px] sm:text-[10px] text-primary font-bold tracking-wider uppercase mt-0.5 line-clamp-1">
                  {companyInfo.tagline}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'text-white bg-primary shadow-md font-bold'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
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
              <Button variant="accent" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
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
