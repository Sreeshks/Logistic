import { z } from 'zod';

export const aboutSchema = z.object({
  page_title: z.string().min(1, 'Page title is required'),
  short_description: z.string().optional().nullable(),
  company_story: z.string().optional().nullable(),
  mission: z.string().optional().nullable(),
  vision: z.string().optional().nullable(),
  core_values: z.string().optional().nullable(),
  about_image: z.string().optional().nullable(),
});

export type AboutFormData = z.infer<typeof aboutSchema>;
