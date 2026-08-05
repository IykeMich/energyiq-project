// TODO(orval): Replace every option list below with the generated query/enum
// once the Organization Details / Supplier Details onboarding endpoints ship.
// These steps aren't backed by a real API yet (see register-form.tsx), so the
// option values here are placeholders matching the .pen design's examples.

export const businessTypeOptions = [
  { value: "sole_proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "limited_liability_company", label: "Limited Liability Company" },
  { value: "public_limited_company", label: "Public Limited Company" },
  { value: "incorporated_trustees", label: "Incorporated Trustees" },
];

export const industryOptions = [
  { value: "oil_and_gas", label: "Oil & Gas" },
  { value: "gas", label: "Gas" },
  { value: "power_and_energy", label: "Power & Energy" },
  { value: "logistics", label: "Logistics" },
  { value: "manufacturing", label: "Manufacturing" },
];

export const countryOptions = [{ value: "nigeria", label: "Nigeria" }];

export const stateOptions = [
  { value: "lagos", label: "Lagos State" },
  { value: "abuja", label: "FCT - Abuja" },
  { value: "rivers", label: "Rivers State" },
  { value: "kano", label: "Kano State" },
  { value: "oyo", label: "Oyo State" },
];

export const productCategoryOptions = [
  { value: "petrol_pms", label: "Petrol (PMS)" },
  { value: "diesel_ago", label: "Diesel (AGO)" },
  { value: "kerosene_dpk", label: "Kerosene (DPK)" },
  { value: "crude_oil", label: "Crude Oil" },
  { value: "lubricant", label: "Lubricant" },
  { value: "lpg", label: "Liquefied Petroleum Gas (LPG)" },
];
