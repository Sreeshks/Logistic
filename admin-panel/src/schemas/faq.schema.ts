import { z } from 'zod';

export const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.string().optional().nullable(),
  display_order: z.coerce.number(),
  is_active: z.boolean(),
});

export type FAQFormData = z.infer<typeof faqSchema>;
