export const getImageUrl = (url?: string | null): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // If passed a comma-separated string of URLs, pick the first non-empty URL
  const target = trimmed.includes(',') ? trimmed.split(',').map((s) => s.trim()).find(Boolean) || '' : trimmed;
  if (!target) return '';

  if (
    target.startsWith('http://') ||
    target.startsWith('https://') ||
    target.startsWith('blob:') ||
    target.startsWith('data:')
  ) {
    return target;
  }

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const serverHost = apiBase.replace(/\/api\/v1\/?$/, '');
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
