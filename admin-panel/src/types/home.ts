export interface HomeHero {
  id: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  button_text?: string | null;
  button_url?: string | null;
  secondary_button_text?: string | null;
  secondary_button_url?: string | null;
  background_image?: string | null;
  banner_images?: string | null;
  mobile_banner_images?: string | null;
  highlights?: string | null;
  show_tracking?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyStatistic {
  id: number;
  label: string;
  value: string;
  icon?: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
