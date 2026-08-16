import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Header } from './Header';
import { Footer } from './Footer';
import { CTASection } from './CTASection';
import { getCompanyInfo } from '../api/company.api';
import { FloatingContactWidget } from '../components/FloatingContactWidget';
import { getImageUrl } from '../utils/image';

export const RootLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Automatically scroll window to top whenever route pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const getInitialCompanyInfo = () => {
    try {
      const cached = localStorage.getItem('wsc_company_cache');
      if (cached) {
        return { success: true, message: 'Cached', data: JSON.parse(cached) };
      }
    } catch (e) {}
    return undefined;
  };

  const { data: response } = useQuery({
    queryKey: ['companyInfo'],
    queryFn: getCompanyInfo,
    initialData: getInitialCompanyInfo,
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });

  const companyInfo = response?.data;

  useEffect(() => {
    if (!companyInfo) return;

    // 1. Favicon patching
    const rawFavicon = companyInfo.favicon || (companyInfo as any).favicon_url;
    if (rawFavicon) {
      const fullFaviconUrl = getImageUrl(rawFavicon);
      let faviconLink = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.rel = 'shortcut icon';
        document.head.appendChild(faviconLink);
      }
      faviconLink.href = fullFaviconUrl;
    }

    // 2. Document Title patching
    const name = companyInfo.company_name || companyInfo.name;
    if (name) {
      document.title = companyInfo.tagline ? `${name} | ${companyInfo.tagline}` : name;
    }
  }, [companyInfo]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-primary selection:text-white">
      <Header companyInfo={companyInfo} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <CTASection />
      <Footer companyInfo={companyInfo} />
      <FloatingContactWidget companyInfo={companyInfo} />
    </div>
  );
};
