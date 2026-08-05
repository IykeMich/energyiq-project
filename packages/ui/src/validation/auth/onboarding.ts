import { z } from "zod";
import { BusinessTypeLabels, type BusinessType } from "@energyiq/domain/auth";

// ── Step 1: Company Setup ───────────────────────────────────────

const businessTypeValues = Object.keys(BusinessTypeLabels) as [
  BusinessType,
  ...BusinessType[],
];

export const companySetupSchema = z.object({
  company_name: z.string().min(2, "Company name is required"),
  business_type: z.enum(businessTypeValues, {
    errorMap: () => ({ message: "Select a business type" }),
  }),
  registration_number: z.string().min(1, "Registration number is required"),
  company_email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

export type CompanySetupFormData = z.infer<typeof companySetupSchema>;

export const companySetupFormDefaultValues: CompanySetupFormData = {
  company_name: "",
  business_type: "" as CompanySetupFormData["business_type"],
  registration_number: "",
  company_email: "",
};

// ── Step 2: Administrator Account ──────────────────────────────

export const adminAccountSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    account_email: z.string().email("Invalid email address"),
    admin_phone: z.string().min(7, "Phone number is required"),
    password: z.string().min(12, "Password must be at least 12 characters"),
    confirm_password: z.string().min(1, "Confirm password is required"),
    accepted_terms: z.boolean().refine((value) => value === true, {
      message: "You must accept the terms and privacy policy",
    }),
    accepted_privacy_policy: z.boolean().refine((value) => value === true, {
      message: "You must accept the privacy policy",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type AdminAccountFormData = z.infer<typeof adminAccountSchema>;

export const adminAccountFormDefaultValues: AdminAccountFormData = {
  first_name: "",
  last_name: "",
  account_email: "",
  admin_phone: "",
  password: "",
  confirm_password: "",
  accepted_terms: false,
  accepted_privacy_policy: false,
};

