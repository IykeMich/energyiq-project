import { z } from 'zod';

export const registerSchema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  company_email: z.string().email('Invalid email').optional().or(z.literal('')),
  business_type: z.string().min(1, 'Business type is required'),
  registration_number: z.string().min(1, 'Registration number is required'),
  account_name: z.string().min(2, 'Your name is required'),
  account_email: z.string().email('Invalid email address'),
  password: z.string().min(12, 'Password must be at least 12 characters'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
