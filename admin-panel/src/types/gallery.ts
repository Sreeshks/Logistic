export interface GalleryItem {
  id: number;
  title: string;
  description?: string | null;
  image_url: string;
  category?: string | null;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
