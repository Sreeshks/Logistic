import { apiClient } from './client';
import { ApiResponse } from '../types/common';
import { AdminUser, LoginResponseData } from '../types/auth';

export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<LoginResponseData>> => {
    const res = await apiClient.post<ApiResponse<LoginResponseData>>('/auth/login', { email, password });
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<AdminUser>> => {
    const res = await apiClient.get<ApiResponse<AdminUser>>('/auth/me');
    return res.data;
  },

  changePassword: async (current_password: string, new_password: string): Promise<ApiResponse> => {
    const res = await apiClient.post<ApiResponse>('/auth/change-password', {
      current_password,
      new_password,
    });
    return res.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const res = await apiClient.post<ApiResponse>('/auth/logout');
    return res.data;
  },
};
