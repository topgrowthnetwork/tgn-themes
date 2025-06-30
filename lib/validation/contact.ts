import { z } from 'zod';

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number must be at least 6 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

// Server action input schema (for form data from server actions)
export const contactServerActionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number must be at least 6 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

// Type exports
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ContactServerActionData = z.infer<typeof contactServerActionSchema>;

// Helper function to validate server action data
export const validateContactServerActionData = (data: unknown) => {
  return contactServerActionSchema.safeParse(data);
};

// Helper function to validate contact form data
export const validateContactFormData = (data: unknown) => {
  return contactFormSchema.safeParse(data);
};
