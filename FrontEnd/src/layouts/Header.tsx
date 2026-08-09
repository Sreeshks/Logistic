import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, Truck, ArrowRight } from 'lucide-react';
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

  // Close mobile menu on route change
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
    <header className="w-full z-50 sticky top-0 bg-white transition-all duration-300">
      {/* Top Header Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 border-b border-slate-800 hidden md:block">
        <Container className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            {companyInfo?.phone && (
              <a href={`tel:${companyInfo.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-orange-500" />
                <span>{companyInfo.phone}</span>
              </a>
            )}
            {companyInfo?.email && (
              <a href={`mailto:${companyInfo.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-orange-500" />
                <span>{companyInfo.email}</span>
              </a>
            )}
            {companyInfo?.working_hours && (
              <span className="text-slate-400 hidden lg:inline-block">
                Hours: {companyInfo.working_hours}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4 font-medium text-slate-400">
            <span>Global Freight & Logistics Services</span>
          </div>
        </Container>
      </div>

      {/* Main Navbar */}
      <div className={`transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white py-4 border-b border-slate-100'}`}>
        <Container className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            {companyInfo?.logo_url ? (
              <img src={companyInfo.logo_url} alt={companyInfo.company_name} className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center text-orange-500 shadow-md group-hover:scale-105 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 uppercase">
                {companyInfo?.company_name || 'Logistics Pro'}
              </span>
              {companyInfo?.tagline && (
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase -mt-1">
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
                  `px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                    isActive
                      ? 'text-orange-600 bg-orange-50 font-bold'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Button */}
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
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 focus:outline-none rounded-md"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </Container>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 text-white border-t border-slate-800 animate-in slide-in-from-top duration-200">
          <Container className="py-6 flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2.5 text-base font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-orange-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-slate-800">
              <Link to="/contact" className="block w-full">
                <Button variant="accent" size="md" className="w-full justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Get a Quote
                </Button>
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
};
