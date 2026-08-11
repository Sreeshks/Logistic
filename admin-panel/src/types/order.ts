export type OrderStatus =
  | 'PENDING'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: number;
  tracking_number: string;
  sender_name: string;
  recipient_name: string;
  origin: string;
  destination: string;
  service_type: string;
  status: OrderStatus;
  current_location?: string | null;
  estimated_delivery?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderCreateData {
  tracking_number: string;
  sender_name: string;
  recipient_name: string;
  origin?: string;
  destination: string;
  service_type?: string;
  status?: OrderStatus;
  current_location?: string;
  estimated_delivery?: string;
  notes?: string;
}

export interface OrderUpdateData {
  sender_name?: string;
  recipient_name?: string;
  origin?: string;
  destination?: string;
  service_type?: string;
  status?: OrderStatus;
  current_location?: string;
  estimated_delivery?: string;
  notes?: string;
}
