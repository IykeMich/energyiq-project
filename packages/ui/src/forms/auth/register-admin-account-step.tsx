import { useState, type ChangeEvent } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Eye, EyeOff, Check } from "lucide-react";
import type { AdminAccountFormData } from "../../validation/auth/onboarding";
import { usePasswordStrength } from "../../hooks/use-password-strength";
import { AuthInput } from "./auth-input";

interface RegisterAdminAccountStepProps {
  register: UseFormRegister<AdminAccountFormData>;
  watch: UseFormWatch<AdminAccountFormData>;
  setValue: UseFormSetValue<AdminAccountFormData>;
  errors: FieldErrors<AdminAccountFormData>;
  onNext: () => void;
}

export function RegisterAdminAccountStep({
  register,
  watch,
  setValue,
  errors,
  onNext,
}: RegisterAdminAccountStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");
  const { score, label, barColor, textColor } = usePasswordStrength(password);

  const [firstName, lastName, accountEmail, adminPhone, confirmPassword, acceptedTermsValue] = watch([
    "first_name",
    "last_name",
    "account_email",
    "admin_phone",
    "confirm_password",
    "accepted_terms",
  ]);
  const isFormDirty = Boolean(
    firstName?.trim() &&
      lastName?.trim() &&
      accountEmail?.trim() &&
      adminPhone?.trim() &&
      password?.trim() &&
      confirmPassword?.trim() &&
      acceptedTermsValue,
  );

  const acceptedTerms = watch("accepted_terms");
  const acceptedTermsField = register("accepted_terms");
  const handleAcceptedChange = (event: ChangeEvent<HTMLInputElement>) => {
    acceptedTermsField.onChange(event);
    setValue("accepted_privacy_policy", event.target.checked, {
      shouldValidate: true,
    });
  };
  const acceptedError = errors.accepted_terms ?? errors.accepted_privacy_policy;

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <AuthInput
          label="Admin Name:"
          placeholder="e.g.  Thomas Okeke"
          error={errors.first_name}
          {...register("first_name")}
        />
        <AuthInput
          label="Admin Name:"
          placeholder="e.g.  Thomas Okeke"
          error={errors.last_name}
          {...register("last_name")}
        />
      </div>

      <AuthInput
        label="Work Email:"
        type="email"
        placeholder="e.g. emekafuels.com"
        error={errors.account_email}
        {...register("account_email")}
      />

      <AuthInput
        label="Work Phone Number:"
        type="tel"
        placeholder="12323230999"
        error={errors.admin_phone}
        {...register("admin_phone")}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <AuthInput
            label="Password:"
            type={showPassword ? "text" : "password"}
            placeholder="12323230999"
            error={errors.password}
            {...register("password")}
            endAdornment={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="tap-effect absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <Eye className="w-6 h-6" />
                ) : (
                  <EyeOff className="w-6 h-6" />
                )}
              </button>
            }
          />

          <div className="flex gap-1 mt-1">
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-0.75 flex-1 rounded-full transition-colors ${
                  score > step ? barColor : "bg-[#2D2D2D]"
                }`}
              />
            ))}
          </div>
          {password && (
            <p className={`text-right text-[10px] mt-1 ${textColor}`}>{label}</p>
          )}
        </div>

        <AuthInput
          label="Confirm Password:"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="12323230999"
          error={errors.confirm_password}
          {...register("confirm_password")}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="tap-effect absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? (
                <Eye className="w-6 h-6" />
              ) : (
                <EyeOff className="w-6 h-6" />
              )}
            </button>
          }
        />
      </div>

      <div className="space-y-1 pl-4">
        <div className="flex items-center gap-2">
          <span className="relative inline-flex shrink-0">
            <input
              type="checkbox"
              aria-label="Accept Terms of Service and Privacy Policy"
              {...acceptedTermsField}
              onChange={handleAcceptedChange}
              className="tap-effect appearance-none w-[18px] h-[18px] rounded-[3px] border border-[#FBC02D] bg-transparent checked:bg-[#FBC02D] cursor-pointer"
            />
            {acceptedTerms && (
              <Check
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 m-auto size-3 text-[#121212]"
                strokeWidth={3}
              />
            )}
          </span>
          <p className="text-xs text-[#FAFAFA]">
            I agree to the Energy IQ{" "}
            <a href="#" className="text-[#0288D1] hover:underline">
              Terms of service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#0288D1] hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
        {acceptedError && (
          <p className="text-red-500 text-xs ml-6">{acceptedError.message}</p>
        )}
      </div>

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
