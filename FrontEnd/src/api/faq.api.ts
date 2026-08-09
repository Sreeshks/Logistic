import { apiClient } from './client';
import type { ApiResponse, FAQItem } from '../types/api';

export const getPublicFAQs = async (): Promise<ApiResponse<FAQItem[]>> => {
  return apiClient.get('/public/faqs');
};
