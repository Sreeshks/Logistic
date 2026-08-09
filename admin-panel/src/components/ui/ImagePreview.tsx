import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImagePreviewProps {
  src?: string | null;
  alt?: string;
  className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt = 'Preview', className = 'w-10 h-10' }) => {
  const getImageUrl = (url?: string | null) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    const serverHost = baseUrl.replace('/api/v1', '');
    return `${serverHost}${url}`;
  };

  if (!src) {
    return (
      <div className={`bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200 ${className}`}>
        <ImageIcon className="w-4 h-4" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shrink-0 ${className}`}>
      <img src={getImageUrl(src)} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};
