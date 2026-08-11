import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCompanyInfo } from '../api/company.api';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: response } = useQuery({
    queryKey: ['companyInfo'],
    queryFn: getCompanyInfo,
  });

  useEffect(() => {
    const company = response?.data;
    if (company) {
      const root = document.documentElement;
      if (company.primary_color) {
        root.style.setProperty('--primary-color', company.primary_color);
      }
      if (company.secondary_color) {
        root.style.setProperty('--secondary-color', company.secondary_color);
      }
      if (company.accent_color) {
        root.style.setProperty('--accent-color', company.accent_color);
      }
      if (company.theme_mode) {
        root.setAttribute('data-theme', company.theme_mode);
      }
    }
  }, [response]);

  return <>{children}</>;
};
