import { z } from 'zod';

export const notificationChannelSchema = z.object({
  email: z.boolean(),
  sms: z.boolean(),
  in_app: z.boolean(),
});

export const notificationPreferencesSchema = z.object({
  new_order_placement: notificationChannelSchema,
  payment_alerts: notificationChannelSchema,
  dispute_issues: notificationChannelSchema,
  kyc_document_expiring: notificationChannelSchema,
  tier_change: notificationChannelSchema,
  low_inventory_alert: notificationChannelSchema,
  channels: notificationChannelSchema,
  digest_frequency: z.object({
    transaction_summary: z.string().min(1, 'Required'),
    kyc_compliance_alerts: z.string().min(1, 'Required'),
    analytic_report: z.string().min(1, 'Required'),
  }),
});

export type NotificationPreferencesFormData = z.infer<typeof notificationPreferencesSchema>;
