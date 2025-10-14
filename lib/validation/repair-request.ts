import { z } from 'zod';

// Check if email is optional
const isEmailOptional = process.env.NEXT_PUBLIC_CONTACT_EMAIL_OPTIONAL === 'true';

// Repair request form schema.
export const repairRequestFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: isEmailOptional
    ? z.string().email('Invalid email address').optional().or(z.literal(''))
    : z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number must be at least 6 characters'),
  state: z.string().min(1, 'State is required'),
  category: z.string().min(1, 'Category is required'),
  product: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

// Server action input schema (for form data from server actions)
export const repairRequestServerActionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: isEmailOptional
    ? z.string().email('Invalid email address').optional().or(z.literal(''))
    : z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number must be at least 6 characters'),
  state: z.string().min(1, 'State is required'),
  category: z.string().min(1, 'Category is required'),
  product: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

// Type exports
export type RepairRequestFormData = z.infer<typeof repairRequestFormSchema>;
export type RepairRequestServerActionData = z.infer<typeof repairRequestServerActionSchema>;

// Helper function to validate server action data
export const validateRepairRequestServerActionData = (data: unknown) => {
  return repairRequestServerActionSchema.safeParse(data);
};

// Helper function to validate repair request form data
export const validateRepairRequestFormData = (data: unknown) => {
  return repairRequestFormSchema.safeParse(data);
};
