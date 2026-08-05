import { z } from "zod";

// ── Step 1: Administrator Account ──────────────────────────────

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

// ── Step 3: Organization Details ───────────────────────────────

export const organizationDetailsSchema = z.object({
  registered_business_name: z.string().min(2, "Registered business name is required"),
  trading_name: z.string().min(1, "Trading name is required"),
  business_registration_number: z.string().min(1, "Business registration number is required"),
  business_type: z.string().min(1, "Business type is required"),
  industry: z.string().min(1, "Industry is required"),
  business_email: z.string().email("Invalid email address"),
  business_phone_number: z.string().min(7, "Business phone number is required"),
  website: z.string().optional().or(z.literal("")),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  office_address: z.string().min(2, "Office address is required"),
});

export type OrganizationDetailsFormData = z.infer<typeof organizationDetailsSchema>;

export const organizationDetailsFormDefaultValues: OrganizationDetailsFormData = {
  registered_business_name: "",
  trading_name: "",
  business_registration_number: "",
  business_type: "",
  industry: "",
  business_email: "",
  business_phone_number: "",
  website: "",
  country: "",
  state: "",
  city: "",
  office_address: "",
};

// ── Step 4: Role-Specific Information (Supplier details) ───────

export const orderApprovalPreferenceOptions = [
  { value: "manual", label: "Manual Approval" },
  { value: "automatic", label: "Automatic Approval" },
] as const;

export const supplierDetailsSchema = z.object({
  product_categories: z.array(z.string()).min(1, "Select at least one product category"),
  warehouse_locations: z.string().min(1, "Warehouse locations are required"),
  delivery_coverage: z.string().min(1, "Delivery coverage is required"),
  minimum_order_requirement: z.string().min(1, "Minimum order requirement is required"),
  settlement_information: z.string().min(1, "Settlement information is required"),
  tax_information: z.string().min(1, "Tax information is required"),
  return_policy: z.string().min(1, "Return policy is required"),
  order_approval_preference: z.enum(["manual", "automatic"]),
});

export type SupplierDetailsFormData = z.infer<typeof supplierDetailsSchema>;

export const supplierDetailsFormDefaultValues: SupplierDetailsFormData = {
  product_categories: [],
  warehouse_locations: "",
  delivery_coverage: "",
  minimum_order_requirement: "",
  settlement_information: "",
  tax_information: "",
  return_policy: "",
  order_approval_preference: "manual",
};
