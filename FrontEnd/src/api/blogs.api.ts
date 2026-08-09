import { apiClient } from './client';
import type { ApiResponse, BlogPost } from '../types/api';

export const getPublicBlogs = async (params?: { category?: string; tag?: string; search?: string }): Promise<ApiResponse<BlogPost[]>> => {
  return apiClient.get('/public/blogs', { params });
};

export const getBlogBySlug = async (slug: string): Promise<ApiResponse<BlogPost>> => {
  return apiClient.get(`/public/blogs/${slug}`);
};
