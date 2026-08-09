import { apiClient } from './client';
import type { ApiResponse, CompanyInfo } from '../types/api';

export const getCompanyInfo = async (): Promise<ApiResponse<CompanyInfo>> => {
  return apiClient.get('/public/company');
};
