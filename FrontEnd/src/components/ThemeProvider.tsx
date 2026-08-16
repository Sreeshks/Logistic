import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCompanyInfo } from '../api/company.api';

function hexToRgb(hex: string) {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  if (cleanHex.length !== 6) return null;
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function adjustBrightness(hex: string, percent: number) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const adjust = (c: number) => Math.min(255, Math.max(0, Math.round(c + (c * percent) / 100)));
  const r = adjust(rgb.r).toString(16).padStart(2, '0');
  const g = adjust(rgb.g).toString(16).padStart(2, '0');
  const b = adjust(rgb.b).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: response } = useQuery({
    queryKey: ['companyInfo'],
    queryFn: getCompanyInfo,
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const company = response?.data;
    if (company) {
      const root = document.documentElement;

      const themeCache: Record<string, string> = {};

      if (company.primary_color) {
        const hover = adjustBrightness(company.primary_color, -12);
        root.style.setProperty('--primary-color', company.primary_color);
        root.style.setProperty('--primary-hover', hover);
        themeCache.primary_color = company.primary_color;
        themeCache.primary_hover = hover;

        const rgb = hexToRgb(company.primary_color);
        if (rgb) {
          const rgbStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
          root.style.setProperty('--primary-rgb', rgbStr);
          themeCache.primary_rgb = rgbStr;
        }
      }

      if (company.secondary_color) {
        root.style.setProperty('--secondary-color', company.secondary_color);
        themeCache.secondary_color = company.secondary_color;
        const rgb = hexToRgb(company.secondary_color);
        if (rgb) {
          const rgbStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
          root.style.setProperty('--secondary-rgb', rgbStr);
          themeCache.secondary_rgb = rgbStr;
        }
      }

      if (company.accent_color) {
        root.style.setProperty('--accent-color', company.accent_color);
        themeCache.accent_color = company.accent_color;
        const rgb = hexToRgb(company.accent_color);
        if (rgb) {
          const rgbStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
          root.style.setProperty('--accent-rgb', rgbStr);
          themeCache.accent_rgb = rgbStr;
        }
      }

      if (company.theme_mode === 'dark') {
        root.setAttribute('data-theme', 'dark');
        root.classList.add('dark');
        themeCache.theme_mode = 'dark';
      } else {
        root.setAttribute('data-theme', 'light');
        root.classList.remove('dark');
        themeCache.theme_mode = 'light';
      }

      try {
        localStorage.setItem('wsc_theme_cache', JSON.stringify(themeCache));
        localStorage.setItem('wsc_company_cache', JSON.stringify(company));
      } catch (e) {}
    }
  }, [response]);

  return <>{children}</>;
};

