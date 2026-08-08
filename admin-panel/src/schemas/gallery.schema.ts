import { z } from 'zod';

export const gallerySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  image_url: z.string().min(1, 'Image is required'),
  category: z.string().optional().nullable(),
  display_order: z.coerce.number(),
  is_featured: z.boolean(),
  is_active: z.boolean(),
});

export type GalleryFormData = z.infer<typeof gallerySchema>;
