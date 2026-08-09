export interface AboutUs {
  id: number;
  page_title: string;
  short_description?: string | null;
  company_story?: string | null;
  mission?: string | null;
  vision?: string | null;
  core_values?: string | null;
  about_image?: string | null;
  created_at: string;
  updated_at: string;
}
