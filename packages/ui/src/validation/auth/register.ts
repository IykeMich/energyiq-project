import { z } from "zod";

export const distributorSchema = z
  .object({
    full_name: z.string().min(2, "Full name is required"),

    email: z.string().email("Invalid email address"),

    phone: z
      .string()
      .min(7, "Phone number is required")
      .optional()
      .or(z.literal("")),

    password: z.string().min(12, "Password must be at least 12 characters"),

    confirm_password: z.string().min(1, "Confirm password is required"),

    agree_terms: z.boolean().refine((value) => value === true, {
      message: "You must confirm the information is accurate",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type DistributorFormData = z.infer<typeof distributorSchema>;

export const distributorFormDefaultValues: DistributorFormData = {
  full_name: "",
  email: "",
  phone: "",
  password: "",
  confirm_password: "",
  agree_terms: false,
};

export const distributorBusinessProfileSchema = z.object({
  registered_business_name: z.string().min(2, "Business name is required"),
  cac_number: z.string().min(1, "CAC number is required"),
  tin: z.string().min(1, "TIN is required"),
  business_address: z.string().min(2, "Business address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  business_phone_number: z.string().min(7, "Business phone number is required"),
  primary_contact_person: z
    .string()
    .min(1, "Primary contact person is required"),
  operational_regions: z
    .array(z.string())
    .min(1, "At least one operational region is required"),
});

export type DistributorBusinessProfileFormData = z.infer<
  typeof distributorBusinessProfileSchema
>;

export const distributorBusinessProfileFormDefaultValues: DistributorBusinessProfileFormData = {
  registered_business_name: "",
  cac_number: "",
  tin: "",
  business_address: "",
  city: "",
  state: "",
  country: "",
  business_phone_number: "",
  primary_contact_person: "",
  operational_regions: [],
};
