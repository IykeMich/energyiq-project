import { z } from 'zod';

export const verifySchema = z.object({
  otp: z.array(z.string()).length(6).refine(
    (digits) => digits.every((d) => /^\d$/.test(d)),
    { message: 'All 6 digits are required' },
  ),
});

export type VerifyFormData = z.infer<typeof verifySchema>;
