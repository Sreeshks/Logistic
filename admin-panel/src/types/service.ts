export interface Service {
  id: number;
  title: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;

  meta_title?: string | null;
  meta_description?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;

  created_at: string;
  updated_at: string;
}
