import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Upload, FileText } from "lucide-react";
import type {
  DistributorDocumentType,
  DistributorOnboardingDocument,
  DistributorOnboardingSummary,
} from "@energyiq/domain/auth";

import { useAuth } from "../../hooks/use-auth";
import { toast } from "@energyiq/ui";
import { RegisterStepper } from "./register-stepper";
import {
  distributorSchema,
  distributorBusinessProfileSchema,
  distributorFormDefaultValues,
  distributorBusinessProfileFormDefaultValues,
  type DistributorFormData,
  type DistributorBusinessProfileFormData,
} from "../../validation/auth/register";

const steps = [
  "Create your account",
  "Verify your email",
  "Business Information",
  "Document Verification",
  "Submitted for review",
];

type UploadState = "idle" | "uploading" | "done" | "error";

interface DocumentUploadState {
  file: File | null;
  status: UploadState;
  error?: string;
  uploaded?: DistributorOnboardingDocument;
}

interface DistributorFormProps {
  /** 'invite' (default) verifies the ?token= invitation before showing the form.
   * 'resume' is for an already-authenticated distributor continuing onboarding —
   * it skips invitation verification and starts past account creation/OTP. */
  mode?: "invite" | "resume";
  initialStep?: number;
  resumeSummary?: DistributorOnboardingSummary;
}

export function DistributorForm({
  mode = "invite",
  initialStep,
  resumeSummary,
}: DistributorFormProps = {}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invitationToken = searchParams.get("token") ?? "";

  const {
    isLoading,
    error,
    clearError,
    distributorRegister,
    distributorVerifyOtp,
    distributorResendOtp,
    saveDistributorBusinessProfile,
    listDocumentTypes,
    presignDistributorDocument,
    createDistributorOnboardingDocument,
    submitDistributorOnboarding,
    verifyInvitation,
    invitation,
  } = useAuth();

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [currentStep, setCurrentStep] = useState(initialStep ?? 1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const [otpResent, setOtpResent] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const [documentTypes, setDocumentTypes] = useState<DistributorDocumentType[]>(
    [],
  );
  const [documents, setDocuments] = useState<
    Record<string, DocumentUploadState>
  >(() => {
    const initial: Record<string, DocumentUploadState> = {};
    if (mode === "resume") {
      resumeSummary?.documents?.forEach((doc) => {
        if (doc.document_type) {
          initial[doc.document_type] = {
            file: null,
            status: "done",
            uploaded: doc,
          };
        }
      });
    }
    return initial;
  });

  const [regionInput, setRegionInput] = useState("");

  const accountForm = useForm<DistributorFormData>({
    resolver: zodResolver(distributorSchema),
    mode: "onChange",
    defaultValues: distributorFormDefaultValues,
  });

  const businessProfileForm = useForm<DistributorBusinessProfileFormData>({
    resolver: zodResolver(distributorBusinessProfileSchema),
    mode: "onChange",
    defaultValues: distributorBusinessProfileFormDefaultValues,
  });

  const operationalRegions =
    businessProfileForm.watch("operational_regions") || [];

  const addRegion = () => {
    const value = regionInput.trim().replace(/,+$/, "");
    if (!value) return;
    const current = businessProfileForm.getValues("operational_regions") || [];
    if (!current.includes(value)) {
      businessProfileForm.setValue("operational_regions", [...current, value], {
        shouldValidate: true,
      });
    }
    setRegionInput("");
  };

  const removeRegion = (region: string) => {
    const current = businessProfileForm.getValues("operational_regions") || [];
    businessProfileForm.setValue(
      "operational_regions",
      current.filter((r) => r !== region),
      { shouldValidate: true },
    );
  };

  const nextStep = () =>
    setCurrentStep((step) => Math.min(step + 1, steps.length));

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const nextOtp = [...otp];
    nextOtp[index] = value.slice(-1);
    setOtp(nextOtp);
    setOtpError(false);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: string,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setDocuments((prev) => ({
      ...prev,
      [documentType]: { file, status: "idle" },
    }));
  };

  const handleAccountSubmit = accountForm.handleSubmit(async (data) => {
    clearError();
    const success = await distributorRegister({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || "",
      password: data.password,
      confirm_password: data.confirm_password,
      invitation_token: invitationToken,
    });
    if (success) {
      setAccountEmail(data.email);
      setAccountPassword(data.password);
      nextStep();
    }
  });

  const handleOtpPaste = (pastedDigits: string) => {
    const nextOtp = Array(otp.length).fill("");
    pastedDigits.split("").forEach((digit, index) => {
      nextOtp[index] = digit;
    });
    setOtp(nextOtp);
    setOtpError(false);

    const nextIndex = Math.min(pastedDigits.length, otp.length - 1);
    document.getElementById(`otp-${nextIndex}`)?.focus();

    if (pastedDigits.length === otp.length) {
      handleVerifyOtp(pastedDigits);
    }
  };

  const handleVerifyOtp = async (otpOverride?: string) => {
    const code = otpOverride ?? otp.join("");
    if (code.length !== 6) {
      setOtpError(true);
      return;
    }

    clearError();
    const success = await distributorVerifyOtp({
      email: accountEmail,
      otp_code: code,
    });
    if (success) {
      setOtpError(false);
      nextStep();
    } else {
      setOtpError(true);
    }
  };

  const handleResendOtp = async () => {
    clearError();
    const result = await distributorResendOtp({
      email: accountEmail,
      password: accountPassword,
    });
    if (result) {
      setOtpResent(true);
      setCountdown(result.otp_resend_after_seconds ?? 30);
    }
  };

  const handleBusinessProfileSubmit = businessProfileForm.handleSubmit(
    async (data) => {
      clearError();
      const success = await saveDistributorBusinessProfile({
        registered_business_name: data.registered_business_name,
        cac_number: data.cac_number,
        tin: data.tin,
        business_address: data.business_address,
        business_phone_number: data.business_phone_number,
        country: data.country,
        state: data.state,
        city: data.city,
        operational_regions: data.operational_regions || [],
        primary_contact_person: data.primary_contact_person,
      });
      if (success) nextStep();
    },
  );

  const uploadFileToPresign = async (
    documentType: string,
    file: File,
  ): Promise<DistributorOnboardingDocument | null> => {
    const presign = await presignDistributorDocument({
      file_name: file.name,
      content_type: file.type || "application/octet-stream",
    });
    if (!presign) return null;

    const uploadResponse = await fetch(presign.upload_url, {
      method: presign.method,
      body: file,
      headers: presign.headers,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    return createDistributorOnboardingDocument({
      document_type: documentType,
      file_name: file.name,
      file_size: file.size,
      file_url: presign.public_url,
      mime_type: file.type || "application/octet-stream",
    });
  };

  const handleDocumentsContinue = async () => {
    clearError();
    const requiredTypes = documentTypes
      .filter((dt) => dt.required)
      .map((dt) => dt.document_type);
    const missing = requiredTypes.filter(
      (type) => !documents[type]?.file && documents[type]?.status !== "done",
    );
    if (missing.length > 0) {
      const nextErrors: Record<string, DocumentUploadState> = {};
      missing.forEach((type) => {
        nextErrors[type] = {
          file: null,
          status: "error",
          error: "This document is required",
        };
      });
      setDocuments((prev) => ({ ...prev, ...nextErrors }));
      return;
    }

    let hasError = false;
    const updated: Record<string, DocumentUploadState> = {};

    await Promise.all(
      Object.entries(documents).map(async ([documentType, state]) => {
        if (!state.file || state.status === "done") return;

        setDocuments((prev) => ({
          ...prev,
          [documentType]: { ...state, status: "uploading" },
        }));

        try {
          const uploaded = await uploadFileToPresign(documentType, state.file);
          if (uploaded) {
            updated[documentType] = {
              file: state.file,
              status: "done",
              uploaded,
            };
          } else {
            updated[documentType] = {
              file: state.file,
              status: "error",
              error: "Upload failed",
            };
            hasError = true;
          }
        } catch (err) {
          updated[documentType] = {
            file: state.file,
            status: "error",
            error: err instanceof Error ? err.message : "Upload failed",
          };
          hasError = true;
        }
      }),
    );

    setDocuments((prev) => ({ ...prev, ...updated }));
    if (hasError) {
      toast.error("Document upload failed", {
        description: "Some files could not be uploaded. Please try again.",
      });
      return;
    }

    const result = await submitDistributorOnboarding();
    if (result) nextStep();
  };

  useEffect(() => {
    if (otpResent || countdown === 0) return;
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, otpResent]);

  useEffect(() => {
    if (mode === "resume") return;
    if (!invitationToken) {
      setTokenValid(false);
      return;
    }
    verifyInvitation(invitationToken).then(setTokenValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, invitationToken]);

  useEffect(() => {
    if (invitation?.email) {
      accountForm.setValue("email", invitation.email, {
        shouldValidate: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitation]);

  useEffect(() => {
    if (mode !== "resume" || !resumeSummary?.distributor) return;
    const distributor = resumeSummary.distributor;
    businessProfileForm.reset({
      ...businessProfileForm.getValues(),
      registered_business_name: distributor.name ?? "",
      tin: distributor.tax_id ?? "",
      business_phone_number: distributor.phone ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, resumeSummary]);

  useEffect(() => {
    if (currentStep === 4) {
      listDocumentTypes().then((types) => {
        if (types) {
          setDocumentTypes(
            types.filter(
              (type) =>
                type.audience === "distributor" || type.audience === "both",
            ),
          );
        }
      });
    }
  }, [currentStep, listDocumentTypes]);

  const uploadDisabled = useMemo(
    () =>
      isLoading ||
      Object.values(documents).some((d) => d.status === "uploading"),
    [isLoading, documents],
  );

  if (mode === "invite" && tokenValid === false) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-[#2a2a2a] bg-[#161616] p-8 text-center">
          <h2 className="text-lg font-semibold">Invitation link invalid</h2>
          <p className="text-sm text-gray-400 mt-2">
            This distributor invitation link is invalid or has expired. Contact
            the supplier who invited you for a new link.
          </p>
        </div>
      </div>
    );
  }

  if (mode === "invite" && tokenValid === null) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 text-white text-sm text-gray-400">
        Verifying invitation...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <RegisterStepper
        steps={steps}
        currentStep={currentStep}
        className="max-w-3xl mx-auto mt-10 mb-12 px-4"
      />

      <div className="max-w-2xl mx-auto bg-[#161616] p-10 rounded-3xl border border-[#262626]">
        <h2 className="text-xl font-semibold mb-6">{steps[currentStep - 1]}</h2>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* STEP 1 — Account Setup */}
        {currentStep === 1 && (
          <form onSubmit={handleAccountSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Full Name
              </label>
              <input
                {...accountForm.register("full_name")}
                placeholder="Enter your full name"
                className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600 text-white"
              />
              {accountForm.formState.errors.full_name && (
                <p className="text-red-500 text-xs mt-2">
                  {accountForm.formState.errors.full_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Work Email
              </label>
              <input
                {...accountForm.register("email")}
                type="email"
                placeholder="Enter your work email"
                className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600 text-white"
              />
              {accountForm.formState.errors.email && (
                <p className="text-red-500 text-xs mt-2">
                  {accountForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                {...accountForm.register("phone")}
                type="tel"
                placeholder="Enter your phone number"
                className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600 text-white"
              />
              {accountForm.formState.errors.phone && (
                <p className="text-red-500 text-xs mt-2">
                  {accountForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...accountForm.register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full h-14 px-6 pr-14 rounded-full bg-transparent border border-gray-600 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="tap-effect absolute right-5 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {accountForm.formState.errors.password && (
                <p className="text-red-500 text-xs mt-2">
                  {accountForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...accountForm.register("confirm_password")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full h-14 px-6 pr-14 rounded-full bg-transparent border border-gray-600 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="tap-effect absolute right-5 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {accountForm.formState.errors.confirm_password && (
                <p className="text-red-500 text-xs mt-2">
                  {accountForm.formState.errors.confirm_password.message}
                </p>
              )}
            </div>

            <label className="flex gap-2 text-xs text-gray-400">
              <input
                type="checkbox"
                {...accountForm.register("agree_terms")}
                className="accent-[#FBC02D] mt-1"
              />
              I confirm the information provided is accurate and that I am
              authorized to create this account on behalf of my business.
            </label>
            {accountForm.formState.errors.agree_terms && (
              <p className="text-red-500 text-xs -mt-2 ml-6">
                {accountForm.formState.errors.agree_terms.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="tap-effect w-full h-12 rounded-full bg-yellow-400 text-black font-semibold disabled:opacity-40 hover:bg-yellow-400/90"
            >
              {isLoading ? "Creating account..." : "Continue"}
            </button>
          </form>
        )}

        {/* STEP 2 — OTP verification */}
        {currentStep === 2 && (
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-2">Verify your email</h2>
            <p className="text-sm text-gray-400 mb-10">
              We sent a 6-digit code to{" "}
              <span className="text-white">{accountEmail}</span>. Enter it
              below.
            </p>

            <div className="flex justify-center gap-3 mb-5">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  maxLength={1}
                  onChange={(event) =>
                    handleOtpChange(event.target.value, index)
                  }
                  onPaste={(event) => {
                    event.preventDefault();
                    const pastedDigits = event.clipboardData
                      .getData("text")
                      .replace(/\D/g, "")
                      .slice(0, otp.length);
                    if (pastedDigits) handleOtpPaste(pastedDigits);
                  }}
                  inputMode="numeric"
                  className={`w-12 h-12 text-center rounded-lg bg-transparent border text-white transition ${
                    otpError ? "border-red-500" : "border-[#404040]"
                  }`}
                />
              ))}
            </div>

            {otpError && (
              <p className="text-red-500 text-sm mb-4">Invalid code</p>
            )}

            <p className="text-sm mb-6 text-gray-500">
              {otpResent
                ? "A new code has been sent"
                : `Resend code in 0:${countdown.toString().padStart(2, "0")}`}
            </p>

            <button
              type="button"
              className="tap-effect w-full h-12 rounded-full bg-[#FBC02D] text-black font-semibold disabled:opacity-40 hover:bg-[#FBC02D]/90"
              onClick={() => handleVerifyOtp()}
              disabled={isLoading || !otp.every((digit) => digit.trim().length > 0)}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={countdown > 0 || isLoading}
              className="tap-effect mt-4 text-sm text-yellow-400 disabled:opacity-40"
            >
              Resend code
            </button>
          </div>
        )}

        {/* STEP 3 — Business Profile */}
        {currentStep === 3 && (
          <form onSubmit={handleBusinessProfileSubmit} className="space-y-4">
            <p className="text-sm text-gray-400">
              Tell us about your business. This information is for KYC
              verification.
            </p>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Registered Business Name
              </label>
              <input
                {...businessProfileForm.register("registered_business_name")}
                placeholder="ABC Fuels Ltd"
                className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600 text-white"
              />
              {businessProfileForm.formState.errors
                .registered_business_name && (
                <p className="text-red-500 text-xs mt-2">
                  {
                    businessProfileForm.formState.errors
                      .registered_business_name.message
                  }
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  CAC Number
                </label>
                <input
                  {...businessProfileForm.register("cac_number")}
                  placeholder="RC-123456"
                  className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600 text-white"
                />
                {businessProfileForm.formState.errors.cac_number && (
                  <p className="text-red-500 text-xs mt-2">
                    {businessProfileForm.formState.errors.cac_number.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">TIN</label>
                <input
                  {...businessProfileForm.register("tin")}
                  placeholder="12345678-0001"
                  className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600 text-white"
                />
                {businessProfileForm.formState.errors.tin && (
                  <p className="text-red-500 text-xs mt-2">
                    {businessProfileForm.formState.errors.tin.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Business Address
              </label>
              <input
                {...businessProfileForm.register("business_address")}
                placeholder="23 Ikorodu Street"
                className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600 text-white"
              />
              {businessProfileForm.formState.errors.business_address && (
                <p className="text-red-500 text-xs mt-2">
                  {
                    businessProfileForm.formState.errors.business_address
                      .message
                  }
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">City</label>
                <input
                  {...businessProfileForm.register("city")}
                  placeholder="Port Harcourt"
                  className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600 text-white"
                />
                {businessProfileForm.formState.errors.city && (
                  <p className="text-red-500 text-xs mt-2">
                    {businessProfileForm.formState.errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  State
                </label>
                <input
                  {...businessProfileForm.register("state")}
                  placeholder="Rivers"
                  className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600 text-white"
                />
                {businessProfileForm.formState.errors.state && (
                  <p className="text-red-500 text-xs mt-2">
                    {businessProfileForm.formState.errors.state.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Country
                </label>
                <input
                  {...businessProfileForm.register("country")}
                  placeholder="Nigeria"
                  className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600 text-white"
                />
                {businessProfileForm.formState.errors.country && (
                  <p className="text-red-500 text-xs mt-2">
                    {businessProfileForm.formState.errors.country.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Business Phone Number
                </label>
                <input
                  {...businessProfileForm.register("business_phone_number")}
                  type="tel"
                  placeholder="08012345678"
                  className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600 text-white"
                />
                {businessProfileForm.formState.errors.business_phone_number && (
                  <p className="text-red-500 text-xs mt-2">
                    {
                      businessProfileForm.formState.errors.business_phone_number
                        .message
                    }
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Primary Contact Person
              </label>
              <input
                {...businessProfileForm.register("primary_contact_person")}
                placeholder="Anselm Mgbufor"
                className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600 text-white"
              />
              {businessProfileForm.formState.errors.primary_contact_person && (
                <p className="text-red-500 text-xs mt-2">
                  {
                    businessProfileForm.formState.errors.primary_contact_person
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Operational Regions
              </label>
              <div className="min-h-[56px] w-full rounded-full bg-transparent border border-gray-600 px-4 py-2 flex items-center flex-wrap gap-2">
                {operationalRegions.map((region) => (
                  <span
                    key={region}
                    className="bg-[#FBC02D] text-black text-xs px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {region}
                    <button
                      type="button"
                      onClick={() => removeRegion(region)}
                      className="font-bold leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  value={regionInput}
                  onChange={(event) => setRegionInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === ",") {
                      event.preventDefault();
                      addRegion();
                    }
                  }}
                  placeholder="Select regions you operate in"
                  className="flex-1 bg-transparent h-10 outline-none text-white text-sm min-w-35"
                />
              </div>
              {businessProfileForm.formState.errors.operational_regions && (
                <p className="text-red-500 text-xs mt-2">
                  {
                    businessProfileForm.formState.errors.operational_regions
                      .message
                  }
                </p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                Press Enter or comma to add a region
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="tap-effect w-full h-12 rounded-full bg-yellow-400 text-black font-semibold disabled:opacity-40 hover:bg-yellow-400/90"
            >
              {isLoading ? "Saving..." : "Continue"}
            </button>
          </form>
        )}

        {/* STEP 4 — Document Upload */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-semibold">Upload Documents</h3>
              <p className="text-sm text-gray-400 mt-1">
                Upload the required KYC documents. Optional documents may be
                skipped.
              </p>
            </div>

            {documentTypes.length === 0 && !isLoading && (
              <p className="text-sm text-gray-400">
                No document requirements available.
              </p>
            )}

            {documentTypes.map((doc) => {
              const state = documents[doc.document_type] || {
                file: null,
                status: "idle",
              };

              return (
                <div
                  key={doc.document_type}
                  className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-5"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">
                        {doc.document_name}
                        <span
                          className={`ml-1 text-xs ${
                            doc.required ? "text-yellow-400" : "text-gray-500"
                          }`}
                        >
                          {doc.required ? "REQUIRED" : "OPTIONAL"}
                        </span>
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Accepted: {doc.allowed_file_types.join(", ")} · Max{" "}
                        {doc.max_file_size_mb}MB
                      </p>
                    </div>

                    {state.status === "done" ? (
                      <span className="px-3 py-1 rounded-full text-xs bg-green-900/40 text-green-400">
                        Uploaded
                      </span>
                    ) : state.status === "uploading" ? (
                      <span className="px-3 py-1 rounded-full text-xs bg-yellow-900/40 text-yellow-400">
                        Uploading
                      </span>
                    ) : doc.required ? (
                      <span className="px-3 py-1 rounded-full text-xs bg-red-900/40 text-red-400">
                        Not Uploaded
                      </span>
                    ) : null}
                  </div>

                  {!state.file || state.status === "error" ? (
                    <label className="tap-effect block cursor-pointer border border-dashed border-gray-500 rounded-xl p-10 text-center hover:border-yellow-400 transition">
                      <Upload
                        className="mx-auto mb-4 text-gray-400"
                        size={28}
                      />
                      <div>
                        <span className="text-yellow-400">Click to upload</span>
                        <span className="text-gray-300"> or drag and drop</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {doc.allowed_file_types.join(", ")} · Max{" "}
                        {doc.max_file_size_mb}MB
                      </p>
                      <input
                        type="file"
                        hidden
                        accept={doc.allowed_file_types.join(",")}
                        onChange={(event) =>
                          handleFileUpload(event, doc.document_type)
                        }
                      />
                    </label>
                  ) : (
                    <div className="bg-[#222] rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText size={18} />
                        <span className="text-sm">{state.file.name}</span>
                      </div>
                      <label className="tap-effect cursor-pointer text-yellow-400 text-sm">
                        Replace
                        <input
                          type="file"
                          hidden
                          accept={doc.allowed_file_types.join(",")}
                          onChange={(event) =>
                            handleFileUpload(event, doc.document_type)
                          }
                        />
                      </label>
                    </div>
                  )}

                  {state.error && (
                    <p className="text-red-500 text-xs mt-2">{state.error}</p>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={handleDocumentsContinue}
              disabled={uploadDisabled}
              className="tap-effect w-full h-12 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-400/90 disabled:opacity-40"
            >
              {isLoading ||
              Object.values(documents).some((d) => d.status === "uploading")
                ? "Uploading..."
                : "Submit for Review"}
            </button>
          </div>
        )}

        {/* STEP 5 — Review Pending */}
        {currentStep === 5 && (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center text-2xl text-green-400">
              ✓
            </div>

            <h2 className="text-2xl font-bold mt-5">Submission Received</h2>
            <p className="text-gray-400 mt-2">
              Your account is under review. You will receive an email once the
              supplier approves your enrollment.
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="tap-effect w-full mt-8 h-12 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-400/90"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
