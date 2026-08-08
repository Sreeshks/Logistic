import { z } from 'zod';

export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  tagline: z.string().optional().nullable(),
  short_description: z.string().optional().nullable(),
  full_description: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  favicon: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email('Invalid email').or(z.literal('')).optional().nullable(),
  address: z.string().optional().nullable(),
  google_maps_url: z.string().optional().nullable(),
  working_hours: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  youtube: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
});

export type CompanyFormData = z.infer<typeof companySchema>;
