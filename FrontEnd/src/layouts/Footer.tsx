import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Phone, Mail, MapPin, Clock, Globe, MessageCircle } from 'lucide-react';
import { Container } from '../components/ui/Container';
import type { CompanyInfo } from '../types/api';

interface FooterProps {
  companyInfo?: CompanyInfo | null;
}

export const Footer: React.FC<FooterProps> = ({ companyInfo }) => {
  const currentYear = new Date().getFullYear();
  const rawWhatsapp = companyInfo?.whatsapp || '';
  const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              {companyInfo?.logo_url ? (
                <img src={companyInfo.logo_url} alt={companyInfo.company_name} className="h-9 w-auto object-contain" />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white">
                  <Truck className="w-5 h-5" />
                </div>
              )}
              <span className="text-xl font-extrabold text-white tracking-wider uppercase">
                {companyInfo?.company_name || 'Logistics Pro'}
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              {companyInfo?.description || 'Providing seamless global freight forwarding, warehousing, and supply chain solutions tailored for modern business growth.'}
            </p>
            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {companyInfo?.facebook_url && (
                <a
                  href={companyInfo.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  title="Facebook"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {companyInfo?.instagram_url && (
                <a
                  href={companyInfo.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-pink-600 hover:text-white transition-all shadow-sm"
                  title="Instagram"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {companyInfo?.linkedin_url && (
                <a
                  href={companyInfo.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-700 hover:text-white transition-all shadow-sm"
                  title="LinkedIn"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {companyInfo?.youtube_url && (
                <a
                  href={companyInfo.youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                  title="YouTube"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {companyInfo?.twitter_url && (
                <a
                  href={companyInfo.twitter_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-sky-500 hover:text-white transition-all shadow-sm"
                  title="Twitter / X"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white text-base font-bold uppercase tracking-wider mb-4 border-l-2 border-primary pl-2">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Our Services</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Project Gallery</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">News & Blog</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Help & FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Column 3: Logistics Services */}
          <div>
            <h4 className="text-white text-base font-bold uppercase tracking-wider mb-4 border-l-2 border-primary pl-2">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/services" className="hover:text-white transition-colors">Air Freight Forwarding</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Ocean Freight & Shipping</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Land Transport & Trucking</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Warehousing & Storage</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Customs Clearance</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Supply Chain Management</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-white text-base font-bold uppercase tracking-wider mb-4 border-l-2 border-primary pl-2">
              Contact Info
            </h4>
            <ul className="space-y-3 text-sm">
              {companyInfo?.address && (
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-slate-300">{companyInfo.address}</span>
                </li>
              )}
              {companyInfo?.phone && (
                <li className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a href={`tel:${companyInfo.phone}`} className="hover:text-white transition-colors text-slate-300">
                    {companyInfo.phone}
                  </a>
                </li>
              )}
              {cleanWhatsapp && (
                <li className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0 fill-current" />
                  <a
                    href={`https://wa.me/${cleanWhatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors text-slate-300 font-medium"
                  >
                    WhatsApp: {companyInfo?.whatsapp || companyInfo?.phone}
                  </a>
                </li>
              )}
              {companyInfo?.email && (
                <li className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <a href={`mailto:${companyInfo.email}`} className="hover:text-white transition-colors text-slate-300">
                    {companyInfo.email}
                  </a>
                </li>
              )}
              {companyInfo?.working_hours && (
                <li className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-slate-400">{companyInfo.working_hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} {companyInfo?.company_name || 'Logistics Company'}. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
