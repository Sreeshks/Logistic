export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
