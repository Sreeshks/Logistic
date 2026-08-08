import { apiClient } from './client';
import { ApiResponse } from '../types/common';
import { DashboardData } from '../types/dashboard';

export const dashboardApi = {
  getSummary: async (): Promise<ApiResponse<DashboardData>> => {
    const res = await apiClient.get<ApiResponse<DashboardData>>('/admin/dashboard');
    return res.data;
  },
};
