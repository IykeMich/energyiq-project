import { z } from 'zod';

export const companyProfileSchema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  registration_number: z.string().min(1, 'RC number is required'),
  tax_identification_number: z.string().min(1, 'TIN is required'),
  business_type: z.string().min(1, 'Business type is required'),
  primary_email: z.string().email('Invalid email address'),
  phone_number: z.string().min(1, 'Phone number is required'),
  business_address: z.string().min(1, 'Business address is required'),
});

export type CompanyProfileFormData = z.infer<typeof companyProfileSchema>;
