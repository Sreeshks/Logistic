import { apiClient } from './client';
import type { ApiResponse } from '../types/common';
import type { OrderItem, OrderCreateData, OrderUpdateData, OrderStatus } from '../types/order';

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
}

export const ordersApi = {
  getOrders: async (params?: OrderQueryParams): Promise<ApiResponse<OrderItem[]>> => {
    const res = await apiClient.get<ApiResponse<OrderItem[]>>('/admin/orders', { params });
    return res.data;
  },

  getOrderById: async (id: number): Promise<ApiResponse<OrderItem>> => {
    const res = await apiClient.get<ApiResponse<OrderItem>>(`/admin/orders/${id}`);
    return res.data;
  },

  createOrder: async (data: OrderCreateData): Promise<ApiResponse<OrderItem>> => {
    const res = await apiClient.post<ApiResponse<OrderItem>>('/admin/orders', data);
    return res.data;
  },

  updateOrder: async (id: number, data: OrderUpdateData): Promise<ApiResponse<OrderItem>> => {
    const res = await apiClient.put<ApiResponse<OrderItem>>(`/admin/orders/${id}`, data);
    return res.data;
  },

  updateOrderStatus: async (
    id: number,
    status: OrderStatus,
    current_location?: string,
    notes?: string
  ): Promise<ApiResponse<OrderItem>> => {
    const res = await apiClient.patch<ApiResponse<OrderItem>>(`/admin/orders/${id}/status`, {
      status,
      current_location,
      notes,
    });
    return res.data;
  },

  deleteOrder: async (id: number): Promise<ApiResponse> => {
    const res = await apiClient.delete<ApiResponse>(`/admin/orders/${id}`);
    return res.data;
  },
};
