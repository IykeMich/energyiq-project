import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Upload, FileText } from 'lucide-react';

import { useAuth } from '../../hooks/use-auth';
import {
  distributorSchema,
  distributorBusinessProfileSchema,
  type DistributorFormData,
  type DistributorBusinessProfileFormData,
} from '../../validation/auth/register';

const steps = [
  'Account Setup',
  'OTP verification',
  'Business Profile',
  'Document Upload',
  'Assurance Payment',
  'Activation',
];

const documentRequirements = [
  {
    key: 'cac',
    title: 'CAC Certificate',
    description: 'Certificate of Incorporation',
    required: true,
  },
  {
    key: 'tax',
    title: 'Tax Clearance Certificate',
    description: 'Current TCC from FIRS',
    required: true,
  },
  {
    key: 'directorId',
    title: "Director's Government ID",
    description: "NIN slip, passport, driver's license",
    required: true,
  },
  {
    key: 'registration',
    title: 'Business Registration Certificate',
    description: 'Not older than 3 months',
    required: true,
  },
  {
    key: 'utility',
    title: 'Utility Bill',
    description: 'Not older than 3 months',
    required: false,
  },
] as const;

type DocumentKey = (typeof documentRequirements)[number]['key'];

export function DistributorForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invitationToken = searchParams.get('token') ?? '';

  const {
    isLoading,
    error,
    clearError,
    registrationToken,
    invitation,
    distributorRegister,
    distributorVerifyOtp,
    distributorResendOtp,
    saveDistributorBusinessProfile,
    activateDistributor,
    verifyInvitation,
  } = useAuth();

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpResent, setOtpResent] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const [documentErrors, setDocumentErrors] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<Record<DocumentKey, File | null>>({
    cac: null,
    tax: null,
    directorId: null,
    registration: null,
    utility: null,
  });

  const accountForm = useForm<DistributorFormData>({
    resolver: zodResolver(distributorSchema),
    mode: 'onChange',
    defaultValues: { full_name: '', email: '', phone: '', password: '', confirm_password: '' },
  });

  const businessProfileForm = useForm<DistributorBusinessProfileFormData>({
    resolver: zodResolver(distributorBusinessProfileSchema),
    mode: 'onChange',
    defaultValues: {
      business_name: '',
      address_line: '',
      city: '',
      state: '',
      contact_person: '',
      operational_regions: '',
    },
  });

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep((step) => step + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((step) => step - 1);
  };

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, key: DocumentKey) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setDocumentErrors((prev) => ({ ...prev, [key]: 'File must not exceed 10MB' }));
      return;
    }

    setDocumentErrors((prev) => ({ ...prev, [key]: '' }));
    setDocuments((prev) => ({ ...prev, [key]: file }));
  };

  const handleAccountSubmit = accountForm.handleSubmit(async (data) => {
    clearError();
    const success = await distributorRegister({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      confirm_password: data.confirm_password,
      invitation_token: invitationToken,
    });
    if (success) nextStep();
  });

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setOtpError(true);
      return;
    }

    clearError();
    const success = await distributorVerifyOtp(code);
    if (success) {
      setOtpVerified(true);
      setOtpError(false);
      nextStep();
    } else {
      setOtpError(true);
      setOtpVerified(false);
    }
  };

  const handleResendOtp = async () => {
    clearError();
    const success = await distributorResendOtp();
    if (success) {
      setOtpResent(true);
      setCountdown(30);
    }
  };

  const handleBusinessProfileSubmit = businessProfileForm.handleSubmit(async (data) => {
    clearError();
    const success = await saveDistributorBusinessProfile({
      business_name: data.business_name,
      address: { line: data.address_line, city: data.city, state: data.state },
      meta: { contact_person: data.contact_person, operational_regions: data.operational_regions },
    });
    if (success) nextStep();
  });

  const handleDocumentsContinue = () => {
    const requiredKeys = documentRequirements.filter((doc) => doc.required).map((doc) => doc.key);
    const missing = requiredKeys.filter((key) => !documents[key]);

    if (missing.length > 0) {
      const nextErrors: Record<string, string> = {};
      documentRequirements.forEach((doc) => {
        if (doc.required && !documents[doc.key]) {
          nextErrors[doc.key] = `${doc.title} is required`;
        }
      });
      setDocumentErrors(nextErrors);
      return;
    }

    // NOTE: the backend has no file-hosting/presign endpoint for onboarding
    // documents (unlike product images, which have v1/product/images/presign).
    // Until one exists, selected files are validated locally but not uploaded
    // or persisted server-side — createDistributorOnboardingDocument needs a
    // real file_url, which we cannot produce yet.
    nextStep();
  };

  const handleActivate = async () => {
    clearError();
    const success = await activateDistributor();
    if (success) navigate('/login');
  };

  useEffect(() => {
    if (otpVerified || countdown === 0) return;
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, otpVerified]);

  useEffect(() => {
    if (currentStep === 2 && !registrationToken) {
      // Guard against landing on OTP step without a registration in flight.
      setCurrentStep(1);
    }
  }, [currentStep, registrationToken]);

  useEffect(() => {
    if (!invitationToken) {
      setTokenValid(false);
      return;
    }
    verifyInvitation(invitationToken).then(setTokenValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitationToken]);

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-[#2a2a2a] bg-[#161616] p-8 text-center">
          <h2 className="text-lg font-semibold">Invitation link invalid</h2>
          <p className="text-sm text-gray-400 mt-2">
            This distributor invitation link is invalid or has expired. Contact the supplier who
            invited you for a new link.
          </p>
        </div>
      </div>
    );
  }

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 text-white text-sm text-gray-400">
        Verifying invitation...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {showIntro ? (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl border border-[#2a2a2a] bg-[#161616] p-8 text-center">
            <div className="-mx-8 -mt-8 h-16 bg-yellow-400 rounded-t-3xl mb-8" />

            <h2 className="text-lg font-semibold">
              Join {invitation?.supplier_name ?? 'your supplier'} on EnergyIQ
            </h2>

            <p className="text-sm text-gray-400 mt-2 mb-8">
              You've been invited to become a certified distributor
            </p>

            <div className="space-y-4 text-left max-w-xs mx-auto">
              {[
                'Create your account',
                'Business Information',
                'Document Verification',
                'Payment Setup',
                'Activate account',
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      index === 0
                        ? 'bg-yellow-400 text-black'
                        : 'border border-gray-600 text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowIntro(false)}
              className="tap-effect w-full mt-10 h-12 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-400/90"
            >
              Get Started
            </button>

            <p className="text-xs text-gray-500 mt-4">It only takes a few minutes</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stepper */}
          <div className="flex justify-between max-w-3xl mx-auto mt-10 mb-12 px-4 relative">
            <div className="absolute top-2 left-8 right-8 h-0.5 bg-[#333]" />

            {steps.map((step, index) => {
              const active = currentStep >= index + 1;
              const done = currentStep > index + 1;

              return (
                <div key={step} className="flex flex-col items-center z-10 flex-1">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      done || active
                        ? 'bg-[#FBC02D] border-[#FBC02D]'
                        : 'border-gray-600 bg-[#121212]'
                    }`}
                  />
                  <span className={`text-[10px] mt-2 ${active ? 'text-white' : 'text-gray-500'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

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
                  <label className="block text-sm text-gray-300 mb-2">Full Name</label>
                  <input
                    {...accountForm.register('full_name')}
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
                  <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                  <input
                    {...accountForm.register('email')}
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600 text-white"
                  />
                  {accountForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-2">
                      {accountForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Phone Number</label>
                  <input
                    {...accountForm.register('phone')}
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
                  <label className="block text-sm text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <input
                      {...accountForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
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
                  <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      {...accountForm.register('confirm_password')}
                      type={showConfirmPassword ? 'text' : 'password'}
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
                    checked={agreeTerms}
                    onChange={(event) => setAgreeTerms(event.target.checked)}
                  />
                  I confirm the information provided is accurate and that I am authorized to
                  create this account on behalf of my business
                </label>

                <button
                  type="submit"
                  disabled={isLoading || !agreeTerms}
                  className="tap-effect w-full h-12 rounded-full bg-yellow-400 text-black font-semibold disabled:opacity-40 hover:bg-yellow-400/90"
                >
                  {isLoading ? 'Creating account...' : 'Continue'}
                </button>
              </form>
            )}

            {/* STEP 2 — OTP verification */}
            {currentStep === 2 && (
              <div className="max-w-md mx-auto text-center">
                <h2 className="text-2xl font-semibold mb-2">Verify your email</h2>
                <p className="text-sm text-gray-400 mb-10">
                  We sent a 6-digit code to your email. Enter it below.
                </p>

                <div className="flex justify-center gap-3 mb-5">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      maxLength={1}
                      onChange={(event) => handleOtpChange(event.target.value, index)}
                      className={`w-12 h-12 text-center rounded-lg bg-transparent border text-white transition ${
                        otpVerified
                          ? 'border-green-500'
                          : otpError
                            ? 'border-red-500'
                            : 'border-[#404040]'
                      }`}
                    />
                  ))}
                </div>

                {otpError && <p className="text-red-500 text-sm mb-4">Invalid code</p>}

                {!otpError && (
                  <p className={`text-sm mb-6 ${otpVerified ? 'text-gray-400' : 'text-gray-500'}`}>
                    {otpResent && countdown === 30
                      ? 'A new code has been sent'
                      : `Resend code in 0:${countdown.toString().padStart(2, '0')}`}
                  </p>
                )}

                <button
                  type="button"
                  className="tap-effect w-full h-12 rounded-full bg-[#FBC02D] text-black font-semibold disabled:opacity-40 hover:bg-[#FBC02D]/90"
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
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
                  Tell us about your business. This information is for KYC verification.
                </p>

                <div>
                  <input
                    {...businessProfileForm.register('business_name')}
                    placeholder="Business Name"
                    className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600"
                  />
                  {businessProfileForm.formState.errors.business_name && (
                    <p className="text-red-500 text-xs mt-2">
                      {businessProfileForm.formState.errors.business_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    {...businessProfileForm.register('address_line')}
                    placeholder="Business Address"
                    className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600"
                  />
                  {businessProfileForm.formState.errors.address_line && (
                    <p className="text-red-500 text-xs mt-2">
                      {businessProfileForm.formState.errors.address_line.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      {...businessProfileForm.register('city')}
                      placeholder="City"
                      className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600"
                    />
                    {businessProfileForm.formState.errors.city && (
                      <p className="text-red-500 text-xs mt-2">
                        {businessProfileForm.formState.errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      {...businessProfileForm.register('state')}
                      placeholder="State"
                      className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600"
                    />
                    {businessProfileForm.formState.errors.state && (
                      <p className="text-red-500 text-xs mt-2">
                        {businessProfileForm.formState.errors.state.message}
                      </p>
                    )}
                  </div>
                </div>

                <input
                  {...businessProfileForm.register('contact_person')}
                  placeholder="Primary Contact Person"
                  className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600"
                />

                <input
                  {...businessProfileForm.register('operational_regions')}
                  placeholder="Operational Regions"
                  className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="tap-effect w-full h-12 rounded-full bg-yellow-400 text-black font-semibold disabled:opacity-40 hover:bg-yellow-400/90"
                >
                  {isLoading ? 'Saving...' : 'Continue'}
                </button>
              </form>
            )}

            {/* STEP 4 — Document Upload */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-semibold">Upload Documents</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Upload the following documents for KYC verification.
                  </p>
                </div>

                {documentRequirements.map((doc) => {
                  const file = documents[doc.key];

                  return (
                    <div
                      key={doc.key}
                      className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-5"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium">
                            {doc.title}
                            <span
                              className={`ml-1 text-xs ${
                                doc.required ? 'text-yellow-400' : 'text-gray-500'
                              }`}
                            >
                              {doc.required ? 'REQUIRED' : 'OPTIONAL'}
                            </span>
                          </h4>
                          <p className="text-xs text-gray-400 mt-1">{doc.description}</p>
                        </div>

                        {file ? (
                          <span className="px-3 py-1 rounded-full text-xs bg-green-900/40 text-green-400">
                            Selected
                          </span>
                        ) : doc.required ? (
                          <span className="px-3 py-1 rounded-full text-xs bg-red-900/40 text-red-400">
                            Not Uploaded
                          </span>
                        ) : null}
                      </div>

                      {!file ? (
                        <label className="tap-effect block cursor-pointer border border-dashed border-gray-500 rounded-xl p-10 text-center hover:border-yellow-400 transition">
                          <Upload className="mx-auto mb-4 text-gray-400" size={28} />
                          <div>
                            <span className="text-yellow-400">Click to upload</span>
                            <span className="text-gray-300"> or drag and drop</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG · Max 10MB</p>
                          <input
                            type="file"
                            hidden
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(event) => handleFileUpload(event, doc.key)}
                          />
                        </label>
                      ) : (
                        <div className="bg-[#222] rounded-xl p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText size={18} />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <label className="tap-effect cursor-pointer text-yellow-400 text-sm">
                            Replace
                            <input
                              type="file"
                              hidden
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(event) => handleFileUpload(event, doc.key)}
                            />
                          </label>
                        </div>
                      )}

                      {documentErrors[doc.key] && (
                        <p className="text-red-500 text-xs mt-2">{documentErrors[doc.key]}</p>
                      )}
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={handleDocumentsContinue}
                  className="tap-effect w-full h-12 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-400/90"
                >
                  Continue
                </button>
              </div>
            )}

            {/* STEP 5 — Assurance Payment (informational summary) */}
            {currentStep === 5 && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-green-600 bg-green-600/10">
                  ✓ Account Created
                </div>
                <div className="p-4 rounded-xl border border-green-600 bg-green-600/10">
                  ✓ Email Verified
                </div>
                <div className="p-4 rounded-xl border border-green-600 bg-green-600/10">
                  ✓ Business Profile Completed
                </div>
                <div className="p-4 rounded-xl border border-green-600 bg-green-600/10">
                  ✓ Documents Selected
                </div>
                <div className="p-4 rounded-xl border border-orange-500 bg-orange-500/10">
                  Compliance Review In Progress
                </div>
                <div className="p-4 rounded-xl border border-yellow-500 bg-yellow-500/10 text-sm">
                  Compliance review typically takes 24–72 hours.
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="tap-effect w-full h-12 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-400/90"
                >
                  Continue
                </button>
              </div>
            )}

            {/* STEP 6 — Activation */}
            {currentStep === 6 && (
              <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto rounded-full bg-yellow-400 text-black flex items-center justify-center text-2xl">
                  ✓
                </div>

                <h2 className="text-2xl font-bold mt-5">You're Almost There!</h2>
                <p className="text-gray-400 mt-2">
                  Activate your account to join the EnergyIQ Distributor Network.
                </p>

                <button
                  type="button"
                  onClick={handleActivate}
                  disabled={isLoading}
                  className="tap-effect w-full mt-8 h-12 rounded-full bg-yellow-400 text-black font-semibold disabled:opacity-40 hover:bg-yellow-400/90"
                >
                  {isLoading ? 'Activating...' : 'Activate Account'}
                </button>
              </div>
            )}

            {currentStep > 1 && currentStep < 6 && (
              <button
                type="button"
                onClick={prevStep}
                className="tap-effect w-full h-12 mt-4 border border-yellow-400 text-yellow-400 rounded-full hover:bg-yellow-400/10"
              >
                Back
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
