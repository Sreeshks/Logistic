import React from 'react';
import { Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Header } from './Header';
import { Footer } from './Footer';
import { CTASection } from './CTASection';
import { getCompanyInfo } from '../api/company.api';

export const RootLayout: React.FC = () => {
  const { data: response } = useQuery({
    queryKey: ['companyInfo'],
    queryFn: getCompanyInfo,
    staleTime: 1000 * 60 * 30, // cache for 30 minutes
  });

  const companyInfo = response?.data;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
      <Header companyInfo={companyInfo} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <CTASection />
      <Footer companyInfo={companyInfo} />
    </div>
  );
};
