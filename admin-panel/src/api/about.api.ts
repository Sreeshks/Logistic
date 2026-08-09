import { apiClient } from './client';
import { ApiResponse } from '../types/common';
import { AboutUs } from '../types/about';

export const aboutApi = {
  getAbout: async (): Promise<ApiResponse<AboutUs>> => {
    const res = await apiClient.get<ApiResponse<AboutUs>>('/admin/about');
    return res.data;
  },

  updateAbout: async (payload: Partial<AboutUs>): Promise<ApiResponse<AboutUs>> => {
    const res = await apiClient.put<ApiResponse<AboutUs>>('/admin/about', payload);
    return res.data;
  },
};
