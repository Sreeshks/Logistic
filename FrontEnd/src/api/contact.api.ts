import { apiClient } from './client';
import type { ApiResponse, ContactSubmission } from '../types/api';

export const submitContactForm = async (payload: ContactSubmission): Promise<ApiResponse> => {
  return apiClient.post('/public/contact', payload);
};
