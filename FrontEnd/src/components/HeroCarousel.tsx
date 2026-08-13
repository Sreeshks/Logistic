import React, { useState, useEffect } from 'react';
import { getImageUrl, getImageUrls } from '../utils/image';

interface HeroCarouselProps {
  bannerImages?: string | string[] | null;
  mobileBannerImages?: string | string[] | null;
  defaultImage?: string | null;
  heading?: string;
  subtitle?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
}

const DEFAULT_SLIDES = [
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=2000',
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  bannerImages,
  mobileBannerImages,
  defaultImage,
}) => {
  // 1. Process Desktop Banner Images
  let parsedDesktop: string[] = getImageUrls(bannerImages);
  if (defaultImage && !parsedDesktop.includes(getImageUrl(defaultImage))) {
    parsedDesktop.unshift(getImageUrl(defaultImage));
  }
  if (parsedDesktop.length === 0) {
    parsedDesktop = DEFAULT_SLIDES;
  }

  // 2. Process Mobile Banner Images
  const parsedMobile: string[] = getImageUrls(mobileBannerImages);

  // 3. Build total slides array to support different desktop vs mobile slide counts
  const slideCount = Math.max(parsedDesktop.length, parsedMobile.length);
  const slides = Array.from({ length: slideCount }, (_, index) => {
    const desktopUrl = parsedDesktop[index] || parsedDesktop[0] || DEFAULT_SLIDES[0];
    const mobileUrl = parsedMobile[index] || parsedMobile[0] || undefined;
    return { desktopUrl, mobileUrl };
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
      {/* Slide Images */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.desktopUrl + index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <picture className="block w-full h-full">
              {slide.mobileUrl && <source media="(max-width: 639px)" srcSet={slide.mobileUrl} />}
              <img
                src={slide.desktopUrl}
                alt={`Logistics Banner Slide ${index + 1}`}
                className={`w-full h-full object-cover object-center ${isActive ? 'animate-kenburns' : ''}`}
              />
            </picture>

            {/* Balanced Gradient Overlay for proper background image visibility & text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-slate-950/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/35 to-transparent" />
          </div>
        );
      })}

      {/* Grid Overlay Texture */}
      <div className="absolute inset-0 z-10 bg-grid-pattern opacity-20 pointer-events-none" />
    </div>
  );
};
