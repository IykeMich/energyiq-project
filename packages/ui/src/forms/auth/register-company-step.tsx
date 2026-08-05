import type { Control, FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { BusinessTypeLabels } from "@energyiq/domain/auth";
import type { CompanySetupFormData } from "../../validation/auth/onboarding";
import { AuthInput } from "./auth-input";
import { AuthSelect } from "./auth-select";

const businessTypeOptions = Object.entries(BusinessTypeLabels).map(
  ([value, label]) => ({ value, label }),
);

interface RegisterCompanyStepProps {
  register: UseFormRegister<CompanySetupFormData>;
  control: Control<CompanySetupFormData>;
  watch: UseFormWatch<CompanySetupFormData>;
  errors: FieldErrors<CompanySetupFormData>;
  onNext: () => void;
}

export function RegisterCompanyStep({
  register,
  control,
  watch,
  errors,
  onNext,
}: RegisterCompanyStepProps) {
  const [companyName, businessType, registrationNumber] = watch([
    "company_name",
    "business_type",
    "registration_number",
  ]);
  const isFormDirty = Boolean(
    companyName?.trim() && businessType?.trim() && registrationNumber?.trim(),
  );

  return (
    <>
      <AuthInput
        label="Company Name:"
        placeholder="e.g. NNPC Oil"
        error={errors.company_name}
        {...register("company_name")}
      />

      <AuthSelect
        control={control}
        name="business_type"
        label="Business Type:"
        placeholder="e.g. Private Limited Company"
        options={businessTypeOptions}
      />

      <AuthInput
        label="Business Registration Number:"
        placeholder="e.g. RC-123456"
        error={errors.registration_number}
        {...register("registration_number")}
      />

      <AuthInput
        label="Company Email (optional):"
        type="email"
        placeholder="e.g. admin@emekafuels.com"
        error={errors.company_email}
        {...register("company_email")}
      />

      <div className="flex flex-col gap-3 pt-4">
        <button
          type="button"
          onClick={onNext}
          disabled={!isFormDirty}
          className={`tap-effect hover:opacity-90 w-full h-17.5 rounded-full text-[#121212] text-base font-semibold disabled:hover:opacity-100 ${
            isFormDirty ? "bg-[#FBC02D]" : "bg-[#FBC02D33]"
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
}
