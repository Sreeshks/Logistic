import { apiClient } from './client';
import { ApiResponse } from '../types/common';
import { CompanyInfo, CompanyUpdatePayload } from '../types/company';

export const companyApi = {
  getCompany: async (): Promise<ApiResponse<CompanyInfo>> => {
    const res = await apiClient.get<ApiResponse<CompanyInfo>>('/admin/company');
    return res.data;
  },

  updateCompany: async (payload: CompanyUpdatePayload): Promise<ApiResponse<CompanyInfo>> => {
    const res = await apiClient.put<ApiResponse<CompanyInfo>>('/admin/company', payload);
    return res.data;
  },
};
