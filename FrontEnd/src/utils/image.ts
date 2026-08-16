const DEFAULT_API_BASE = 'https://logistic-16v2.onrender.com/api/v1';

export const getImageUrl = (url?: string | null): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Extract first URL if a comma-separated string is passed
  const target = trimmed.includes(',') ? trimmed.split(',').map((s) => s.trim()).find(Boolean) || '' : trimmed;
  if (!target) return '';

  // Return full absolute URLs (Supabase Storage, Unsplash, Blob, Data URLs) as-is
  if (
    target.startsWith('http://') ||
    target.startsWith('https://') ||
    target.startsWith('blob:') ||
    target.startsWith('data:')
  ) {
    return target;
  }

  // Resolve relative backend upload paths (e.g. /uploads/filename.png)
  const envApiBase = import.meta.env.VITE_API_BASE_URL;
  let serverHost = '';

  if (envApiBase) {
    serverHost = envApiBase.replace(/\/api\/v1\/?$/, '');
  } else if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    serverHost = 'http://localhost:8000';
  } else {
    serverHost = DEFAULT_API_BASE.replace(/\/api\/v1\/?$/, '');
  }

  const cleanPath = target.startsWith('/') ? target : `/${target}`;
  return `${serverHost}${cleanPath}`;
};

export const getImageUrls = (url?: string | string[] | null): string[] => {
  if (!url) return [];
  let rawList: string[] = [];
  if (Array.isArray(url)) {
    rawList = url.filter(Boolean);
  } else if (typeof url === 'string' && url.trim()) {
    rawList = url.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return rawList.map((item) => getImageUrl(item)).filter(Boolean);
};

export const isVideoUrl = (url?: string | null): boolean => {
  if (!url) return false;
  const clean = url.split('?')[0].toLowerCase().trim();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.ogg') ||
    clean.endsWith('.m4v')
  );
};
