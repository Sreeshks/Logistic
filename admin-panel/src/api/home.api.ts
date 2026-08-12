import { apiClient } from './client';
import { ApiResponse } from '../types/common';
import { HomeHero, CompanyStatistic } from '../types/home';

export const homeApi = {
  getHero: async (): Promise<ApiResponse<HomeHero>> => {
    const res = await apiClient.get<ApiResponse<HomeHero>>('/admin/home');
    return res.data;
  },

  updateHero: async (payload: Partial<HomeHero>): Promise<ApiResponse<HomeHero>> => {
    const res = await apiClient.put<ApiResponse<HomeHero>>('/admin/home', payload);
    return res.data;
  },

  getStatistics: async (): Promise<ApiResponse<CompanyStatistic[]>> => {
    const res = await apiClient.get<ApiResponse<CompanyStatistic[]>>('/admin/home/statistics');
    return res.data;
  },

  createStatistic: async (payload: Partial<CompanyStatistic>): Promise<ApiResponse<CompanyStatistic>> => {
    const res = await apiClient.post<ApiResponse<CompanyStatistic>>('/admin/home/statistics', payload);
    return res.data;
  },

  updateStatistic: async (id: number, payload: Partial<CompanyStatistic>): Promise<ApiResponse<CompanyStatistic>> => {
    const res = await apiClient.put<ApiResponse<CompanyStatistic>>(`/admin/home/statistics/${id}`, payload);
    return res.data;
  },

  deleteStatistic: async (id: number): Promise<ApiResponse> => {
    const res = await apiClient.delete<ApiResponse>(`/admin/home/statistics/${id}`);
    return res.data;
  },
};
