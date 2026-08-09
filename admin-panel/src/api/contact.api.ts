import { apiClient } from './client';
import { ApiResponse } from '../types/common';
import { ContactMessage, ContactStatus } from '../types/contact';

export interface ContactQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ContactStatus;
}

export const contactApi = {
  getMessages: async (params?: ContactQueryParams): Promise<ApiResponse<ContactMessage[]>> => {
    const res = await apiClient.get<ApiResponse<ContactMessage[]>>('/admin/contact', { params });
    return res.data;
  },

  getMessageById: async (id: number): Promise<ApiResponse<ContactMessage>> => {
    const res = await apiClient.get<ApiResponse<ContactMessage>>(`/admin/contact/${id}`);
    return res.data;
  },

  updateStatus: async (id: number, status: ContactStatus): Promise<ApiResponse<ContactMessage>> => {
    const res = await apiClient.patch<ApiResponse<ContactMessage>>(`/admin/contact/${id}/status`, { status });
    return res.data;
  },

  deleteMessage: async (id: number): Promise<ApiResponse> => {
    const res = await apiClient.delete<ApiResponse>(`/admin/contact/${id}`);
    return res.data;
  },
};
