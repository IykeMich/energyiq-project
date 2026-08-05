import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@energyiq/ui";
import {
  adminAccountSchema,
  adminAccountFormDefaultValues,
  organizationDetailsSchema,
  organizationDetailsFormDefaultValues,
  supplierDetailsSchema,
  supplierDetailsFormDefaultValues,
} from "../../validation/auth/onboarding";
import { registrationDocumentFields, type RegistrationDocumentKey } from "../../hooks/use-registration-documents";
import { OnboardingStepper } from "./onboarding-stepper";
import { RegisterAdminAccountStep } from "./register-admin-account-step";
import { RegisterOtpStep } from "./register-otp-step";
import { RegisterOrganizationStep } from "./register-organization-step";
import { RegisterSupplierDetailsStep } from "./register-supplier-details-step";
import { RegisterDocumentStep } from "./register-document-step";
import { RegisterReviewStep } from "./register-review-step";

// Step labels shown under the stepper dots.
const stepLabels = [
  "Administrator Account",
  "OTP Verification",
  "Organization Details",
  "Role-Specific Information",
  "Document Upload",
  "Review & Submit",
];

// Eyebrow/heading/subtitle shown above the stepper for each step.
const stepHeadings: Record<number, { heading: string; subtitle: string }> = {
  1: {
    heading: "Administrator account",
    subtitle: "This person will be the primary admin for your organization.",
  },
  2: {
    heading: "OTP Verification",
    subtitle: "This person will be the primary admin for your organization.",
  },
  3: {
    heading: "Organization Details",
    subtitle: "Tell us about the business itself.",
  },
  4: {
    heading: "Supplier details",
    subtitle: "A few details specific to suppliers on the platform.",
  },
  5: {
    heading: "Documents Upload",
    subtitle: "Upload the following documents for kyc verification.",
  },
  6: {
    heading: "Review & Submit",
    subtitle: "Check everything before submitting your application for review.",
  },
};

// TODO(orval): The backend's `initiate`/`complete` thunks expect company info
// bundled with account info in a single call, and `complete(otp)` reads the
// registration token that only exists after `initiate` succeeds. This design
// collects Organization Details *after* OTP verification, so steps 1, 2 and 4
// (and the document upload in step 5) can't call real endpoints yet — every
// step here is local client-side state until the backend supports this order.
export function RegisterForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const adminForm = useForm({
    resolver: zodResolver(adminAccountSchema),
    mode: "onChange",
    defaultValues: adminAccountFormDefaultValues,
  });
  const organizationForm = useForm({
    resolver: zodResolver(organizationDetailsSchema),
    mode: "onChange",
    defaultValues: organizationDetailsFormDefaultValues,
  });
  const supplierForm = useForm({
    resolver: zodResolver(supplierDetailsSchema),
    mode: "onChange",
    defaultValues: supplierDetailsFormDefaultValues,
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const [otpResent, setOtpResent] = useState(false);

  const [documents, setDocuments] = useState<Record<RegistrationDocumentKey, File | null>>({
    cac: null,
    tax: null,
    directorId: null,
    utilityBill: null,
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const goToStep = (step: number) => setCurrentStep(step);

  const handleAdminAccountNext = async () => {
    const isValid = await adminForm.trigger();
    if (isValid) goToStep(2);
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

  // TODO(orval): call the real `complete(otpCode)` thunk once `initiate` runs
  // earlier in the flow and a registration token is available. For now any
  // fully-entered 6-digit code advances the flow.
  const handleOtpSubmit = (otpOverride?: string) => {
    const code = otpOverride ?? otp.join("");
    if (code.length !== 6) {
      setOtpError(true);
      return;
    }
    goToStep(3);
  };

  const handleResendOtp = () => {
    setOtpResent(true);
    toast.success("OTP resent", { description: "A new code has been sent to your email." });
  };

  const handleOrganizationNext = async () => {
    const isValid = await organizationForm.trigger();
    if (isValid) goToStep(4);
  };

  const handleToggleCategory = (category: string) => {
    const current = supplierForm.getValues("product_categories");
    const next = current.includes(category)
      ? current.filter((selected) => selected !== category)
      : [...current, category];
    supplierForm.setValue("product_categories", next, { shouldValidate: true });
  };

  const handleSupplierDetailsNext = async () => {
    const isValid = await supplierForm.trigger();
    if (isValid) goToStep(5);
  };

  const handleDocumentFileChange = (key: RegistrationDocumentKey, file: File | null) => {
    setDocuments((prev) => ({ ...prev, [key]: file }));
  };

  const hasRequiredDocuments = registrationDocumentFields
    .filter((field) => field.required)
    .every((field) => documents[field.key]);
  const uploadedDocumentCount = Object.values(documents).filter(Boolean).length;

  // TODO(orval): once a registration token exists, upload each selected file
  // via presignRegistrationDocument/createRegistrationDocument here instead
  // of just advancing the step.
  const handleDocumentsNext = () => {
    if (!hasRequiredDocuments) {
      toast.error("Missing required documents", {
        description: "Please upload all required KYC documents.",
      });
      return;
    }
    goToStep(6);
  };

  const handleCancelSubmission = () => navigate("/login");

  // TODO(orval): call the real "submit supplier onboarding for review"
  // endpoint once it exists; this currently only simulates success.
  const handleSubmitApplication = async () => {
    setIsSubmittingReview(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmittingReview(false);
    toast.success("Application submitted", {
      description: "Your organization is now pending review.",
    });
    navigate("/login");
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
          <RegisterAdminAccountStep
            register={adminForm.register}
            watch={adminForm.watch}
            setValue={adminForm.setValue}
            errors={adminForm.formState.errors}
            onNext={handleAdminAccountNext}
          />
        )}

        {currentStep === 2 && (
          <RegisterOtpStep
            otp={otp}
            otpError={otpError}
            otpResent={otpResent}
            accountEmail={adminForm.watch("account_email")}
            error={null}
            isLoading={false}
            onOtpChange={handleOtpChange}
            onOtpPaste={handleOtpPaste}
            onResend={handleResendOtp}
            onSubmit={() => handleOtpSubmit()}
          />
        )}

        {currentStep === 3 && (
          <RegisterOrganizationStep
            register={organizationForm.register}
            control={organizationForm.control}
            errors={organizationForm.formState.errors}
            onNext={handleOrganizationNext}
          />
        )}

        {currentStep === 4 && (
          <RegisterSupplierDetailsStep
            register={supplierForm.register}
            control={supplierForm.control}
            watch={supplierForm.watch}
            errors={supplierForm.formState.errors}
            onToggleCategory={handleToggleCategory}
            onNext={handleSupplierDetailsNext}
          />
        )}

        {currentStep === 5 && (
          <RegisterDocumentStep
            documents={documents}
            documentFields={registrationDocumentFields}
            uploadedCount={uploadedDocumentCount}
            isUploading={false}
            isLoading={false}
            error={null}
            onFileChange={handleDocumentFileChange}
            onSubmit={handleDocumentsNext}
          />
        )}

        {currentStep === 6 && (
          <RegisterReviewStep
            adminData={adminForm.getValues()}
            organizationData={organizationForm.getValues()}
            supplierData={supplierForm.getValues()}
            uploadedDocumentCount={uploadedDocumentCount}
            totalDocumentCount={registrationDocumentFields.length}
            isLoading={isSubmittingReview}
            onCancel={handleCancelSubmission}
            onSubmit={handleSubmitApplication}
          />
        )}
      </form>
    </div>
  );
}
