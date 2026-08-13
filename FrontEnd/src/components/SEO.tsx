import React, { useEffect } from 'react';
import { getImageUrl } from '../utils/image';

interface SEOProps {
  title?: string | null;
  description?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  siteName?: string | null;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  canonicalUrl,
  siteName = 'Logistics & Freight Services',
}) => {
  useEffect(() => {
    const effectiveSiteName = siteName || 'Logistics & Freight Services';
    const effectiveTitle = title || effectiveSiteName;
    const finalTitle = effectiveTitle.includes(effectiveSiteName)
      ? effectiveTitle
      : `${effectiveTitle} | ${effectiveSiteName}`;

    // 1. Update Document Title
    document.title = finalTitle;

    // 2. Helper to set or create meta tag dynamically
    const setMetaTag = (selector: string, attrName: string, attrValue: string, contentValue: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // 3. Meta Description (Google Search Snippet)
    if (description) {
      setMetaTag('meta[name="description"]', 'name', 'description', description);
    }

    // 4. Open Graph Meta Tags (WhatsApp, Facebook, LinkedIn, iMessage preview)
    const finalOgTitle = ogTitle || title || effectiveSiteName;
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', finalOgTitle);

    if (ogDescription || description) {
      setMetaTag('meta[property="og:description"]', 'property', 'og:description', ogDescription || description || '');
    }

    if (ogImage) {
      setMetaTag('meta[property="og:image"]', 'property', 'og:image', getImageUrl(ogImage));
    }

    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', effectiveSiteName);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');

    // 5. Twitter / X Card Metadata
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', ogImage ? 'summary_large_image' : 'summary');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', finalOgTitle);
    if (ogDescription || description) {
      setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', ogDescription || description || '');
    }
    if (ogImage) {
      setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', getImageUrl(ogImage));
    }

    // 6. Canonical URL Tag
    if (canonicalUrl || window.location.href) {
      let linkElement = document.querySelector('link[rel="canonical"]');
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute('href', canonicalUrl || window.location.href);
    }
  }, [title, description, ogTitle, ogDescription, ogImage, canonicalUrl, siteName]);

  return null;
};
