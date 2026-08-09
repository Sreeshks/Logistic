import { apiClient } from './client';
import type { ApiResponse, Service } from '../types/api';

export const getPublicServices = async (search?: string): Promise<ApiResponse<Service[]>> => {
  const params = search ? { search } : {};
  return apiClient.get('/public/services', { params });
};

export const getServiceBySlug = async (slug: string): Promise<ApiResponse<Service>> => {
  return apiClient.get(`/public/services/${slug}`);
};
