import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { OrganizationDetailsFormData } from "../../validation/auth/onboarding";
import { AuthInput } from "./auth-input";
import { AuthSelect } from "./auth-select";
import { businessTypeOptions, countryOptions, industryOptions, stateOptions } from "./register-onboarding-mocks";

interface RegisterOrganizationStepProps {
  register: UseFormRegister<OrganizationDetailsFormData>;
  control: Control<OrganizationDetailsFormData>;
  errors: FieldErrors<OrganizationDetailsFormData>;
  onNext: () => void;
}

export function RegisterOrganizationStep({
  register,
  control,
  errors,
  onNext,
}: RegisterOrganizationStepProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <AuthInput
          label="Registered Business Name:"
          placeholder="e.g.  NNPC Oil"
          error={errors.registered_business_name}
          {...register("registered_business_name")}
        />
        <AuthInput
          label="Trading Name:"
          placeholder="e.g. NNPC"
          error={errors.trading_name}
          {...register("trading_name")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AuthInput
          label="Business Registration Number:"
          placeholder="e.g. 1234567AD"
          error={errors.business_registration_number}
          {...register("business_registration_number")}
        />
        <AuthSelect
          control={control}
          name="business_type"
          label="Business Type:"
          placeholder="e.g. Partnership"
          options={businessTypeOptions}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AuthSelect
          control={control}
          name="industry"
          label="Industry:"
          placeholder="e.g. Gas"
          options={industryOptions}
        />
        <AuthInput
          label="Business Email:"
          type="email"
          placeholder="e.g. emekafuels.com"
          error={errors.business_email}
          {...register("business_email")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AuthInput
          label="Business Phone Number:"
          type="tel"
          placeholder="e.g. +234 8000 800 000"
          error={errors.business_phone_number}
          {...register("business_phone_number")}
        />
        <AuthInput
          label="Website"
          placeholder="www.example.com"
          error={errors.website}
          {...register("website")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AuthSelect
          control={control}
          name="country"
          label="Country:"
          placeholder="e.g. Nigeria"
          options={countryOptions}
        />
        <AuthSelect
          control={control}
          name="state"
          label="State:"
          placeholder="e.g. Lagos State"
          options={stateOptions}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AuthInput
          label="City:"
          placeholder="e.g. Ikeja"
          error={errors.city}
          {...register("city")}
        />
        <AuthInput
          label="Office Address:"
          placeholder="e.g. No 2 Alhaji Estate, Lagos"
          error={errors.office_address}
          {...register("office_address")}
        />
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <button
          type="button"
          onClick={onNext}
          className="tap-effect hover:opacity-90 w-full h-17.5 rounded-full bg-[#FBC02D] text-[#121212] text-base font-semibold"
        >
          Next
        </button>
      </div>
    </>
  );
}
