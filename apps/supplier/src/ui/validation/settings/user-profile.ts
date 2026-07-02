import { z } from 'zod';

export const userProfileSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(1, 'Phone number is required'),
  role: z.string().min(1, 'Role is required'),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string().min(8, 'Confirm password is required'),
});

export const changePasswordFormSchema = changePasswordSchema.refine(
  (data) => data.new_password === data.confirm_password,
  {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  },
);

export type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;

export const userProfilePageSchema = userProfileSchema
  .merge(changePasswordSchema)
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type UserProfilePageFormData = z.infer<typeof userProfilePageSchema>;
