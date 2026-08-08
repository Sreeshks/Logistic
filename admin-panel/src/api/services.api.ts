import { apiClient } from './client';
import { ApiResponse } from '../types/common';
import { Service } from '../types/service';

export interface ServiceQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  is_featured?: boolean;
  is_active?: boolean;
}

export const servicesApi = {
  getServices: async (params?: ServiceQueryParams): Promise<ApiResponse<Service[]>> => {
    const res = await apiClient.get<ApiResponse<Service[]>>('/admin/services', { params });
    return res.data;
  },

  getServiceById: async (id: number): Promise<ApiResponse<Service>> => {
    const res = await apiClient.get<ApiResponse<Service>>(`/admin/services/${id}`);
    return res.data;
  },

  createService: async (payload: Partial<Service>): Promise<ApiResponse<Service>> => {
    const res = await apiClient.post<ApiResponse<Service>>('/admin/services', payload);
    return res.data;
  },

  updateService: async (id: number, payload: Partial<Service>): Promise<ApiResponse<Service>> => {
    const res = await apiClient.put<ApiResponse<Service>>(`/admin/services/${id}`, payload);
    return res.data;
  },

  deleteService: async (id: number): Promise<ApiResponse> => {
    const res = await apiClient.delete<ApiResponse>(`/admin/services/${id}`);
    return res.data;
  },
};
