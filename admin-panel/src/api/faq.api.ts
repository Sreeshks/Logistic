import { apiClient } from './client';
import { ApiResponse } from '../types/common';
import { FAQ } from '../types/faq';

export interface FAQQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  is_active?: boolean;
}

export const faqApi = {
  getFAQs: async (params?: FAQQueryParams): Promise<ApiResponse<FAQ[]>> => {
    const res = await apiClient.get<ApiResponse<FAQ[]>>('/admin/faqs', { params });
    return res.data;
  },

  createFAQ: async (payload: Partial<FAQ>): Promise<ApiResponse<FAQ>> => {
    const res = await apiClient.post<ApiResponse<FAQ>>('/admin/faqs', payload);
    return res.data;
  },

  updateFAQ: async (id: number, payload: Partial<FAQ>): Promise<ApiResponse<FAQ>> => {
    const res = await apiClient.put<ApiResponse<FAQ>>(`/admin/faqs/${id}`, payload);
    return res.data;
  },

  deleteFAQ: async (id: number): Promise<ApiResponse> => {
    const res = await apiClient.delete<ApiResponse>(`/admin/faqs/${id}`);
    return res.data;
  },
};
