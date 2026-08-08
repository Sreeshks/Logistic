import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string().min(1, 'Blog title is required'),
  slug: z.string().min(1, 'Slug is required'),
  short_description: z.string().optional().nullable(),
  content: z.string().min(1, 'Blog content is required'),
  featured_image: z.string().optional().nullable(),
  author: z.string(),
  category: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  is_featured: z.boolean(),
  published_at: z.string().optional().nullable(),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  og_title: z.string().optional().nullable(),
  og_description: z.string().optional().nullable(),
  og_image: z.string().optional().nullable(),
});

export type BlogFormData = z.infer<typeof blogSchema>;
