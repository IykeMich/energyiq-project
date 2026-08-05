import { Controller, type Control, type FieldErrors, type UseFormRegister, type UseFormWatch } from "react-hook-form";
import { Check } from "lucide-react";
import { cn } from "@energyiq/shared";
import type { SupplierDetailsFormData } from "../../validation/auth/onboarding";
import { orderApprovalPreferenceOptions } from "../../validation/auth/onboarding";
import { AuthInput } from "./auth-input";
import { productCategoryOptions } from "./register-onboarding-mocks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../primitives/select";

interface RegisterSupplierDetailsStepProps {
  register: UseFormRegister<SupplierDetailsFormData>;
  control: Control<SupplierDetailsFormData>;
  watch: UseFormWatch<SupplierDetailsFormData>;
  errors: FieldErrors<SupplierDetailsFormData>;
  onToggleCategory: (category: string) => void;
  onNext: () => void;
}

export function RegisterSupplierDetailsStep({
  register,
  control,
  watch,
  errors,
  onToggleCategory,
  onNext,
}: RegisterSupplierDetailsStepProps) {
  const selectedCategories = watch("product_categories");

  return (
    <>
      <div>
        <p className="block text-base text-[#FAFAFA] mb-2">Product Categories *:</p>
        <div className="flex flex-wrap gap-2">
          {productCategoryOptions.map(({ value, label }) => {
            const isSelected = selectedCategories.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => onToggleCategory(value)}
                aria-pressed={isSelected}
                className={cn(
                  "tap-effect hover:opacity-90 flex items-center gap-1.25 rounded-full px-4 py-2.25 text-xs font-semibold transition-colors",
                  isSelected
                    ? "bg-[#FBC02D] text-[#121212]"
                    : "bg-transparent text-[#FAFAFA] font-normal border border-[#616161B2]",
                )}
              >
                {isSelected && <Check size={15} strokeWidth={1.5} />}
                {label}
              </button>
            );
          })}
        </div>
        {errors.product_categories && (
          <p className="text-red-500 text-xs mt-1 ml-1">{errors.product_categories.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AuthInput
          label="Warehouse Locations:"
          placeholder="e.g. Lagos, Abuja"
          error={errors.warehouse_locations}
          {...register("warehouse_locations")}
        />
        <AuthInput
          label="Delivery Coverage:"
          placeholder="e.g. South-East"
          error={errors.delivery_coverage}
          {...register("delivery_coverage")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AuthInput
          label="Minimum Order Requirements:"
          placeholder="e.g. 50,000"
          error={errors.minimum_order_requirement}
          {...register("minimum_order_requirement")}
        />
        <AuthInput
          label="Settlement Information:"
          placeholder="Bank + Account Number"
          error={errors.settlement_information}
          {...register("settlement_information")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AuthInput
          label="Tax Information:"
          placeholder="TIN"
          error={errors.tax_information}
          {...register("tax_information")}
        />

        <Controller
          control={control}
          name="order_approval_preference"
          render={({ field }) => (
            <div>
              <label htmlFor={field.name} className="block text-sm font-medium text-[#FAFAFA] mb-0.5">
                Order approval preference
              </label>
              <p className="text-xs text-[#9E9E9E] mb-2">
                How new orders from distributors are processed
              </p>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id={field.name}
                  className="w-full h-17.5 data-[size=default]:h-17.5 rounded-full bg-[#6161611A] px-8 text-lg font-medium text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FBC02D]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#181818] border border-[#2D2D2D] text-white">
                  {orderApprovalPreferenceOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="focus:bg-[#FBC02D] focus:text-[#121212] data-[selected]:text-[#FBC02D]"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>

      <AuthInput
        label="Return Policy:"
        placeholder="e.g. 7-Day window"
        error={errors.return_policy}
        {...register("return_policy")}
      />

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
