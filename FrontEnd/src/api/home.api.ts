import { apiClient } from './client';
import type { ApiResponse, HomeData } from '../types/api';

export const getHomeData = async (): Promise<ApiResponse<HomeData>> => {
  return apiClient.get('/public/home');
};
