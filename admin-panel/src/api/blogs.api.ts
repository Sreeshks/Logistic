import { apiClient } from './client';
import { ApiResponse } from '../types/common';
import { Blog, BlogStatus } from '../types/blog';

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  status?: BlogStatus;
  is_featured?: boolean;
}

export const blogsApi = {
  getBlogs: async (params?: BlogQueryParams): Promise<ApiResponse<Blog[]>> => {
    const res = await apiClient.get<ApiResponse<Blog[]>>('/admin/blogs', { params });
    return res.data;
  },

  getBlogById: async (id: number): Promise<ApiResponse<Blog>> => {
    const res = await apiClient.get<ApiResponse<Blog>>(`/admin/blogs/${id}`);
    return res.data;
  },

  createBlog: async (payload: Partial<Blog>): Promise<ApiResponse<Blog>> => {
    const res = await apiClient.post<ApiResponse<Blog>>('/admin/blogs', payload);
    return res.data;
  },

  updateBlog: async (id: number, payload: Partial<Blog>): Promise<ApiResponse<Blog>> => {
    const res = await apiClient.put<ApiResponse<Blog>>(`/admin/blogs/${id}`, payload);
    return res.data;
  },

  deleteBlog: async (id: number): Promise<ApiResponse> => {
    const res = await apiClient.delete<ApiResponse>(`/admin/blogs/${id}`);
    return res.data;
  },
};
