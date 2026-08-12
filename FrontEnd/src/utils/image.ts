export const getImageUrl = (url?: string | null): string => {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  const serverHost = apiBase.replace(/\/api\/v1\/?$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${serverHost}${cleanPath}`;
};
