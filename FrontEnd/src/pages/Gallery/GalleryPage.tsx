import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';

import { Container } from '../../components/ui/Container';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { getPublicGallery } from '../../api/gallery.api';

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['publicGallery', selectedCategory],
    queryFn: () => getPublicGallery(selectedCategory === 'all' ? undefined : selectedCategory),
  });

  const galleryItems = response?.data || [];

  const categories = ['all', 'air', 'ocean', 'road', 'warehouse', 'projects'];

  return (
    <div className="py-12 space-y-12">
      <Container>
        <Breadcrumb items={[{ label: 'Gallery' }]} />

        <SectionTitle
          badge="Fleet & Operations"
          title="Logistics Project Showcase"
          subtitle="Explore images of our international cargo vessels, freight aircraft, logistics hubs, and heavy transport projects."
        />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all capitalize ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Failed to Load Gallery"
            message="Could not fetch gallery items from the backend."
            onRetry={refetch}
          />
        ) : galleryItems.length === 0 ? (
          <EmptyState
            title="No Gallery Images"
            message={`No images found in category "${selectedCategory}".`}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item.image_url)}
                className="group relative h-72 rounded-xl overflow-hidden cursor-pointer bg-slate-900 shadow-sm hover:shadow-xl transition-all"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  {item.category && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-slate-900/80 px-2 py-0.5 rounded mb-1 inline-block">
                      {item.category}
                    </span>
                  )}
                  <h4 className="text-base font-bold leading-snug">{item.title}</h4>
                  {item.description && (
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white p-2 hover:bg-slate-800 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Expanded view"
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
            />
          </div>
        )}
      </Container>
    </div>
  );
};
