import React, { useState, useEffect } from 'react';

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
  let desktopImages: string[] = [];
  if (Array.isArray(bannerImages)) {
    desktopImages = bannerImages.filter(Boolean);
  } else if (typeof bannerImages === 'string' && bannerImages.trim()) {
    desktopImages = bannerImages
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (defaultImage && !desktopImages.includes(defaultImage)) {
    desktopImages.unshift(defaultImage);
  }

  if (desktopImages.length === 0) {
    desktopImages = DEFAULT_SLIDES;
  }

  let mobileImages: string[] = [];
  if (Array.isArray(mobileBannerImages)) {
    mobileImages = mobileBannerImages.filter(Boolean);
  } else if (typeof mobileBannerImages === 'string' && mobileBannerImages.trim()) {
    mobileImages = mobileBannerImages
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (desktopImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % desktopImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [desktopImages.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
      {/* Slide Images */}
      {desktopImages.map((desktopImgUrl, index) => {
        const isActive = index === currentIndex;
        const mobileImgUrl = mobileImages[index] || mobileImages[0];
        return (
          <div
            key={desktopImgUrl + index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <picture className="block w-full h-full">
              {mobileImgUrl && <source media="(max-width: 639px)" srcSet={mobileImgUrl} />}
              <img
                src={desktopImgUrl}
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
