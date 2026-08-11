import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

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
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
      {/* Slide Images */}
      {images.map((imgUrl, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={imgUrl + index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={imgUrl}
              alt={`Logistics Banner Slide ${index + 1}`}
              className={`w-full h-full object-cover object-center ${
                isActive ? 'animate-kenburns' : ''
              }`}
            />
            {/* Dark Gradient Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          </div>
        );
      })}

      {/* Grid Overlay Texture */}
      <div className="absolute inset-0 z-10 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* Slider Controls Overlay */}
      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-12 lg:right-12 z-20 flex items-center gap-2 sm:gap-4 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 sm:p-2.5 shadow-2xl scale-95 sm:scale-100">
          {/* Slide Progress Counter */}
          <div className="px-3 py-1 flex items-center gap-2 border-r border-slate-700 text-xs font-mono font-bold text-white">
            <span className="text-primary">0{currentIndex + 1}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">0{images.length}</span>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 px-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-6 bg-primary shadow-lg'
                    : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          {/* Prev / Play / Next Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause Auto-Play' : 'Start Auto-Play'}
              className="p-2 text-primary hover:brightness-125 hover:bg-slate-800 rounded-xl transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
