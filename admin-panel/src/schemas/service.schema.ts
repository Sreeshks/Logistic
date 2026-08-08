import { z } from 'zod';

export const serviceSchema = z.object({
  title: z.string().min(1, 'Service title is required'),
  slug: z.string().min(1, 'Slug is required'),
  short_description: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  display_order: z.coerce.number(),
  is_featured: z.boolean(),
  is_active: z.boolean(),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  og_title: z.string().optional().nullable(),
  og_description: z.string().optional().nullable(),
  og_image: z.string().optional().nullable(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
