import { apiClient } from './client';
import { ApiResponse } from '../types/common';
import { GalleryItem } from '../types/gallery';

export interface GalleryQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  is_featured?: boolean;
  is_active?: boolean;
}

export const galleryApi = {
  getGallery: async (params?: GalleryQueryParams): Promise<ApiResponse<GalleryItem[]>> => {
    const res = await apiClient.get<ApiResponse<GalleryItem[]>>('/admin/gallery', { params });
    return res.data;
  },

  getGalleryItemById: async (id: number): Promise<ApiResponse<GalleryItem>> => {
    const res = await apiClient.get<ApiResponse<GalleryItem>>(`/admin/gallery/${id}`);
    return res.data;
  },

  createGalleryItem: async (payload: Partial<GalleryItem>): Promise<ApiResponse<GalleryItem>> => {
    const res = await apiClient.post<ApiResponse<GalleryItem>>('/admin/gallery', payload);
    return res.data;
  },

  updateGalleryItem: async (id: number, payload: Partial<GalleryItem>): Promise<ApiResponse<GalleryItem>> => {
    const res = await apiClient.put<ApiResponse<GalleryItem>>(`/admin/gallery/${id}`, payload);
    return res.data;
  },

  deleteGalleryItem: async (id: number): Promise<ApiResponse> => {
    const res = await apiClient.delete<ApiResponse>(`/admin/gallery/${id}`);
    return res.data;
  },
};
