import { z } from 'zod';

export const homeHeroSchema = z.object({
  title: z.string().min(1, 'Heading is required'),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  button_text: z.string().optional().nullable(),
  button_url: z.string().optional().nullable(),
  secondary_button_text: z.string().optional().nullable(),
  secondary_button_url: z.string().optional().nullable(),
  background_image: z.string().optional().nullable(),
  banner_images: z.string().optional().nullable(),
  highlights: z.string().optional().nullable(),
});

export type HomeHeroFormData = z.infer<typeof homeHeroSchema>;

export const companyStatisticSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
  icon: z.string().optional().nullable(),
  display_order: z.coerce.number(),
  is_active: z.boolean(),
});

export type CompanyStatisticFormData = z.infer<typeof companyStatisticSchema>;
