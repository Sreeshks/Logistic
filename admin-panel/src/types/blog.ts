export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Blog {
  id: number;
  title: string;
  slug: string;
  short_description?: string | null;
  content: string;
  featured_image?: string | null;
  author: string;
  category?: string | null;
  tags?: string | null;
  status: BlogStatus;
  is_featured: boolean;
  published_at?: string | null;

  meta_title?: string | null;
  meta_description?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;

  created_at: string;
  updated_at: string;
}
