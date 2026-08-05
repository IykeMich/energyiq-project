import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@energyiq/ui";
import {
  companySetupSchema,
  companySetupFormDefaultValues,
  type CompanySetupFormData,
  adminAccountSchema,
  adminAccountFormDefaultValues,
  type AdminAccountFormData,
} from "../../validation/auth/onboarding";
import { useAuth } from "../../hooks/use-auth";
import { useOnboardingDocuments } from "../../hooks/use-onboarding-documents";
import { OnboardingStepper } from "./onboarding-stepper";
import { RegisterCompanyStep } from "./register-company-step";
import { RegisterAdminAccountStep } from "./register-admin-account-step";
import { RegisterOtpStep } from "./register-otp-step";
import { RegisterDocumentStep } from "./register-document-step";

// Step labels shown under the stepper dots.
const stepLabels = ["Company Setup", "Account Setup", "OTP Verification", "Document Upload"];

// Eyebrow/heading/subtitle shown above the stepper for each step.
const stepHeadings: Record<number, { heading: string; subtitle: string }> = {
  1: {
    heading: "Company setup",
    subtitle: "Tell us about the business itself.",
  },
  2: {
    heading: "Administrator account",
    subtitle: "This person will be the primary admin for your organization.",
  },
  3: {
    heading: "OTP Verification",
    subtitle: "Enter the code we sent to confirm your email.",
  },
  4: {
    heading: "Documents Upload",
    subtitle: "Upload the following documents for kyc verification.",
  },
};

// A server field name of "email" is ambiguous between CompanyInfo.email and
// AccountInfo.email — mapped to the account step's field, per the same
// precedent documented for register-form's other flows.
const companyFieldMap: Partial<Record<string, keyof CompanySetupFormData>> = {
  name: "company_name",
  business_type: "business_type",
  registration_number: "registration_number",
};
const accountFieldMap: Partial<Record<string, keyof AdminAccountFormData>> = {
  email: "account_email",
  phone: "admin_phone",
  first_name: "first_name",
  last_name: "last_name",
  password: "password",
  confirm_password: "confirm_password",
  accepted_terms: "accepted_terms",
  accepted_privacy_policy: "accepted_privacy_policy",
};

export function RegisterForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const {
    initiate,
    complete,
    resendOtp,
    presignOnboardingDocument,
    createSupplierOnboardingDocument,
    error,
    fieldErrors,
    isLoading,
    slug,
    clearError,
  } = useAuth();

  const companyForm = useForm({
    resolver: zodResolver(companySetupSchema),
    mode: "onChange",
    defaultValues: companySetupFormDefaultValues,
  });
  const adminForm = useForm({
    resolver: zodResolver(adminAccountSchema),
    mode: "onChange",
    defaultValues: adminAccountFormDefaultValues,
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const [otpResent, setOtpResent] = useState(false);

  const documentUpload = useOnboardingDocuments({
    presignOnboardingDocument,
    createSupplierOnboardingDocument,
    clearError,
    onSuccess: () => navigate(`/${slug}/dashboard`),
  });

  const goToStep = (step: number) => setCurrentStep(step);

  // Routes EIQ-2000 per-field errors from `initiate` onto whichever form
  // owns that field, and jumps back to step 1 if a company field was hit.
  useEffect(() => {
    if (!fieldErrors?.length) return;

    let touchedCompany = false;
    fieldErrors.forEach(({ field, message }) => {
      const companyField = companyFieldMap[field];
      const accountField = accountFieldMap[field];
      if (companyField) {
        companyForm.setError(companyField, { type: "server", message });
        touchedCompany = true;
      } else if (accountField) {
        adminForm.setError(accountField, { type: "server", message });
      }
    });

    if (touchedCompany) goToStep(1);

    toast.error(error ?? "Please correct the highlighted fields", {
      description: fieldErrors.map((fieldError) => fieldError.message).join(" "),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldErrors]);

  const handleCompanyNext = async () => {
    const isValid = await companyForm.trigger();
    if (isValid) goToStep(2);
  };

  const handleCreateAccount = async () => {
    const isValid = await adminForm.trigger();
    if (!isValid) return;

    const company = companyForm.getValues();
    const account = adminForm.getValues();

    const result = await initiate({
      company: {
        name: company.company_name,
        business_type: company.business_type,
        registration_number: company.registration_number,
        email: company.company_email || undefined,
      },
      account: {
        first_name: account.first_name,
        last_name: account.last_name,
        email: account.account_email,
        phone: account.admin_phone,
        password: account.password,
        confirm_password: account.confirm_password,
        accepted_terms: account.accepted_terms,
        accepted_privacy_policy: account.accepted_privacy_policy,
      },
    });

    if (result.success) {
      goToStep(3);
    } else if (!result.isFieldValidationError) {
      toast.error("Registration failed", {
        description: error ?? "Please try again.",
      });
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const nextOtp = [...otp];
    nextOtp[index] = value.slice(-1);
    setOtp(nextOtp);
    setOtpError(false);
    if (value && index < 5) {
      (document.getElementById(`otp-${index + 1}`) as HTMLInputElement)?.focus();
    }
  };

  const handleOtpPaste = (pastedDigits: string) => {
    const nextOtp = Array(otp.length).fill("");
    pastedDigits.split("").forEach((digit, index) => {
      nextOtp[index] = digit;
    });
    setOtp(nextOtp);
    setOtpError(false);
    const nextIndex = Math.min(pastedDigits.length, otp.length - 1);
    (document.getElementById(`otp-${nextIndex}`) as HTMLInputElement)?.focus();
    if (pastedDigits.length === otp.length) handleOtpSubmit(pastedDigits);
  };

  const handleOtpSubmit = async (otpOverride?: string) => {
    const code = otpOverride ?? otp.join("");
    if (code.length !== 6) {
      setOtpError(true);
      return;
    }

    clearError();
    const success = await complete(code);
    if (success) {
      goToStep(4);
    } else {
      setOtpError(true);
    }
  };

  const handleResendOtp = async () => {
    clearError();
    const success = await resendOtp();
    if (success) {
      setOtpResent(true);
      toast.success("OTP resent", { description: "A new code has been sent to your email." });
    } else {
      toast.error("Failed to resend code", {
        description: error ?? "Please try again later.",
      });
    }
  };

  const { heading, subtitle } = stepHeadings[currentStep];

  return (
    <div className="w-full rounded-[26px] bg-[#6161611A] p-6 sm:p-10">
      <p className="text-base font-medium text-[#FBC02D] mb-2">
        ONBOARDING · Step {currentStep} of {stepLabels.length}
      </p>
      <h2 className="text-[28px] font-semibold text-[#FAFAFA] mb-1">{heading}</h2>
      <p className="text-lg font-medium text-[#FAFAFACC] mb-8">{subtitle}</p>

      <OnboardingStepper steps={stepLabels} currentStep={currentStep} />

      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        {currentStep === 1 && (
          <RegisterCompanyStep
            register={companyForm.register}
            control={companyForm.control}
            watch={companyForm.watch}
            errors={companyForm.formState.errors}
            onNext={handleCompanyNext}
          />
        )}

        {currentStep === 2 && (
          <RegisterAdminAccountStep
            register={adminForm.register}
            watch={adminForm.watch}
            setValue={adminForm.setValue}
            errors={adminForm.formState.errors}
            onNext={handleCreateAccount}
          />
        )}

        {currentStep === 3 && (
          <RegisterOtpStep
            otp={otp}
            otpError={otpError}
            otpResent={otpResent}
            accountEmail={adminForm.watch("account_email")}
            error={error}
            isLoading={isLoading}
            onOtpChange={handleOtpChange}
            onOtpPaste={handleOtpPaste}
            onResend={handleResendOtp}
            onSubmit={() => handleOtpSubmit()}
          />
        )}

        {currentStep === 4 && (
          <RegisterDocumentStep
            documents={documentUpload.documents}
            documentFields={documentUpload.documentFields}
            uploadedCount={documentUpload.uploadedCount}
            isUploading={documentUpload.isUploading}
            isLoading={isLoading}
            error={error}
            onFileChange={documentUpload.handleFileChange}
            onSubmit={documentUpload.handleDocumentSubmit}
          />
        )}
      </form>
    </div>
  );
}
