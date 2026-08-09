import { apiClient } from './client';
import type { ApiResponse, AboutContent } from '../types/api';

export const getAboutContent = async (): Promise<ApiResponse<AboutContent>> => {
  return apiClient.get('/public/about');
};
