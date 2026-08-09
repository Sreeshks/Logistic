import { apiClient } from './client';
import type { ApiResponse, GalleryItem } from '../types/api';

export const getPublicGallery = async (category?: string): Promise<ApiResponse<GalleryItem[]>> => {
  const params = category ? { category } : {};
  return apiClient.get('/public/gallery', { params });
};
