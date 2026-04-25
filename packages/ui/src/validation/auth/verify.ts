import { z } from 'zod';

export const verifySchema = z.object({
  otp: z.string().length(6, 'All 6 digits are required').regex(/^\d+$/, 'Must be digits only'),
});

export type VerifyFormData = z.infer<typeof verifySchema>;
