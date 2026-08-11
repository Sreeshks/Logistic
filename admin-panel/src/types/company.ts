export interface CompanyInfo {
  id: number;
  name: string;
  logo?: string | null;
  favicon?: string | null;
  tagline?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  google_maps_url?: string | null;
  working_hours?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  twitter?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  accent_color?: string | null;
  theme_mode?: string | null;
  created_at: string;
  updated_at: string;
}

export type CompanyUpdatePayload = Partial<Omit<CompanyInfo, 'id' | 'created_at' | 'updated_at'>>;
