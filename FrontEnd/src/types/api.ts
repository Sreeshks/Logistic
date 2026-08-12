export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error_code?: string;
}

export interface CompanyInfo {
  id: number;
  name?: string | null;
  company_name?: string | null;
  arabic_name?: string | null;
  business_type?: string | null;
  country?: string | null;
  logo?: string | null;
  logo_url?: string | null;
  favicon?: string | null;
  tagline?: string | null;
  description?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  working_hours?: string | null;
  facebook?: string | null;
  facebook_url?: string | null;
  instagram?: string | null;
  instagram_url?: string | null;
  linkedin?: string | null;
  linkedin_url?: string | null;
  youtube?: string | null;
  youtube_url?: string | null;
  twitter?: string | null;
  twitter_url?: string | null;
  google_maps_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  accent_color?: string | null;
  theme_mode?: string | null;
}

export interface HomeHero {
  id: number;
  title?: string;
  heading?: string;
  subtitle?: string | null;
  description?: string | null;
  button_text?: string | null;
  button_url?: string | null;
  primary_cta_text?: string | null;
  primary_cta_url?: string | null;
  secondary_button_text?: string | null;
  secondary_button_url?: string | null;
  secondary_cta_text?: string | null;
  secondary_cta_url?: string | null;
  background_image?: string | null;
  background_image_url?: string | null;
  banner_images?: string | null;
  mobile_banner_images?: string | null;
  highlights?: string | null;
}

export interface Statistic {
  id: number;
  label: string;
  value: string;
  icon?: string | null;
  display_order: number;
  is_active: boolean;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description?: string | null;
  full_description?: string | null;
  delivery_information?: string | null;
  category_name?: string | null;
  icon?: string | null;
  icon_name?: string | null;
  image?: string | null;
  image_url?: string | null;
  display_order?: number;
  is_featured: boolean;
  is_active: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
}

export interface GalleryItem {
  id: number;
  title: string;
  category?: string | null;
  image_url: string;
  description?: string | null;
  is_featured: boolean;
  is_active: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category?: string | null;
  tags?: string | null;
  featured_image_url?: string | null;
  author_name?: string | null;
  published_at?: string | null;
  is_featured: boolean;
  status: string;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface HomeData {
  hero?: HomeHero | null;
  statistics: Statistic[];
  featured_services: Service[];
  featured_gallery: GalleryItem[];
  featured_blogs: BlogPost[];
}

export interface AboutContent {
  id: number;
  title: string;
  subtitle?: string | null;
  story?: string | null;
  mission?: string | null;
  vision?: string | null;
  values?: string | null;
  years_experience?: number | null;
  image_url?: string | null;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category?: string | null;
  display_order: number;
  is_active: boolean;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
