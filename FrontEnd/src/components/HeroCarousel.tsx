import React, { useState, useEffect } from 'react';

interface HeroCarouselProps {
  bannerImages?: string | string[] | null;
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
  defaultImage,
}) => {
  let images: string[] = [];

  if (Array.isArray(bannerImages)) {
    images = bannerImages.filter(Boolean);
  } else if (typeof bannerImages === 'string' && bannerImages.trim()) {
    images = bannerImages
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (defaultImage && !images.includes(defaultImage)) {
    images.unshift(defaultImage);
  }

  if (images.length === 0) {
    images = DEFAULT_SLIDES;
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
      {/* Slide Images */}
      {images.map((imgUrl, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={imgUrl + index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
          >
            <img
              src={imgUrl}
              alt={`Logistics Banner Slide ${index + 1}`}
              className={`w-full h-full object-cover object-center ${isActive ? 'animate-kenburns' : ''
                }`}
            />
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
