import { z } from 'zod';

export const registerSchema = z
  .object({
    company_name: z
      .string()
      .min(2, 'Company name is required'),

    company_email: z
      .string()
      .email('Invalid email')
      .optional()
      .or(z.literal('')),

    business_type: z
      .string()
      .min(1, 'Business type is required'),

    registration_number: z
      .string()
      .min(1, 'Registration number is required'),

    first_name: z
      .string()
      .min(1, 'First name is required'),

    last_name: z
      .string()
      .min(1, 'Last name is required'),

    account_email: z
      .string()
      .email('Invalid email address'),

    admin_phone: z
      .string()
      .min(7, 'Phone number is required'),

    password: z
      .string()
      .min(12, 'Password must be at least 12 characters'),

    confirm_password: z
      .string()
      .min(1, 'Confirm password is required'),

    accepted_terms: z
      .boolean()
      .refine((value) => value === true, {
        message: 'You must accept the terms and privacy policy',
      }),

    accepted_privacy_policy: z
      .boolean()
      .refine((value) => value === true, {
        message: 'You must accept the privacy policy',
      }),
  })
  .refine(
    (data) => data.password === data.confirm_password,
    {
      message: 'Passwords do not match',
      path: ['confirm_password'],
    }
  );

export type RegisterFormData = z.infer<typeof registerSchema>;

export const distributorSchema = z
  .object({
    full_name: z.string().min(2, 'Full name is required'),

    email: z.string().email('Invalid email address'),

    phone: z.string().min(7, 'Phone number is required').optional().or(z.literal('')),

    password: z.string().min(12, 'Password must be at least 12 characters'),

    confirm_password: z.string().min(1, 'Confirm password is required'),

    agree_terms: z
      .boolean()
      .refine((value) => value === true, {
        message: 'You must confirm the information is accurate',
      }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type DistributorFormData = z.infer<typeof distributorSchema>;

export const distributorBusinessProfileSchema = z.object({
  registered_business_name: z.string().min(2, 'Business name is required'),
  cac_number: z.string().min(1, 'CAC number is required'),
  tin: z.string().min(1, 'TIN is required'),
  business_address: z.string().min(2, 'Business address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  business_phone: z.string().min(7, 'Business phone number is required'),
  primary_contact_person: z.string().min(1, 'Primary contact person is required'),
  operational_regions: z.array(z.string()).min(1, 'At least one operational region is required'),
});

export type DistributorBusinessProfileFormData = z.infer<typeof distributorBusinessProfileSchema>;
