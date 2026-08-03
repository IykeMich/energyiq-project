import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Upload, FileCheck } from 'lucide-react';

import { useAuth } from '../../hooks/use-auth';
import { toast } from '@energyiq/ui';
import { BusinessTypeLabels, type BusinessType } from '@energyiq/domain/auth';
import {
  registerSchema,
  type RegisterFormData,
} from '../../validation/auth/register';

const steps = [
  'Company Information',
  'Account Setup',
  'OTP Verification',
  'Document Upload',
];

const inputClass =
  'w-full h-14 rounded-full bg-[#111111] border border-[#1D1D1D] px-6 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FBC02D]';

export function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [documents, setDocuments] = useState({
    cac: null as File | null,
    tax: null as File | null,
    directorId: null as File | null,
    utilityBill: null as File | null,
  });
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();
  const { isLoading, error, clearError, initiate, complete, resendOtp: resendOtpAction, slug } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const [otpResent, setOtpResent] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      company_name: '',
      company_email: '',
      business_type: '',
      registration_number: '',
      first_name: '',
      last_name: '',
      account_email: '',
      admin_phone: '',
      password: '',
      confirm_password: '',
      accepted_terms: false,
      accepted_privacy_policy: false,
    },
  });

  const password = watch('password');
  const accountEmail = watch('account_email');

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));

  const handleStep1Next = async () => {
    const valid = await trigger([
      'company_name',
      'company_email',
      'business_type',
      'registration_number',
    ]);
    if (valid) nextStep();
  };

  const onStep2Submit = handleSubmit(async (data) => {
    clearError();
    const success = await initiate({
      company: {
        name: data.company_name,
        email: data.company_email || undefined,
        business_type: data.business_type as BusinessType,
        registration_number: data.registration_number,
      },
      account: {
        first_name: data.first_name,
        last_name: data.last_name,
        name: `${data.first_name} ${data.last_name}`.trim(),
        email: data.account_email,
        phone: data.admin_phone,
        password: data.password,
        confirm_password: data.confirm_password,
        accepted_terms: data.accepted_terms,
        accepted_privacy_policy: data.accepted_privacy_policy,
      },
    });
    if (success) {
      toast.success('Account created', {
        description: 'Complete OTP verification to finish registration.',
      });
      nextStep();
    } else {
      toast.error('Failed to create account', {
        description: error ?? 'Please check your details.',
      });
    }
  });

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError(false);
    if (value && index < 5) {
      (document.getElementById(`otp-${index + 1}`) as HTMLInputElement)?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setOtpError(true);
      return;
    }
    clearError();
    const success = await complete(code);
    if (success) {
      toast.success('Email verified', { description: 'Welcome to EnergyIQ.' });
      nextStep(); // ➡️ Step 4: Document Upload
    } else {
      setOtpError(true);
      toast.error('Invalid OTP', { description: error ?? 'Please try again.' });
    }
  };

  const handleResendOtp = async () => {
    clearError();
    const success = await resendOtpAction();
    if (success) {
      setOtpResent(true);
      toast.success('OTP resent', { description: 'A new code has been sent to your email.' });
    } else {
      toast.error('Failed to resend OTP', { description: error ?? 'Please try again later.' });
    }
  };

  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  const handleFileChange = (key: keyof typeof documents, file: File | null) => {
    setDocuments((prev) => ({ ...prev, [key]: file }));
  };

  const handleDocumentSubmit = async () => {
    // Only CAC, Tax, and Director ID are required. Utility Bill is optional.
    if (!documents.cac || !documents.tax || !documents.directorId) {
      toast.error('Missing required documents', {
        description: 'Please upload all required KYC documents.',
      });
      return;
    }

    setIsUploading(true);
    clearError();

    try {
      // TODO: Replace with your actual KYC upload API
      const formData = new FormData();
      formData.append('cac', documents.cac);
      formData.append('tax', documents.tax);
      formData.append('director_id', documents.directorId);
      if (documents.utilityBill) formData.append('utility_bill', documents.utilityBill);
      // await api.post('/auth/kyc-upload', formData);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setAccountCreated(true);
      toast.success('Registration complete', {
        description: 'Your KYC documents have been submitted.',
      });
    } catch (err) {
      toast.error('Upload failed', { description: 'Please try again later.' });
    } finally {
      setIsUploading(false);
    }
  };

  const uploadedCount = Object.values(documents).filter(Boolean).length;

  const documentFields: {
    key: keyof typeof documents;
    label: string;
    description: string;
    hint?: string;
    required: boolean;
  }[] = [
    {
      key: 'cac',
      label: 'CAC Certificate',
      description: 'Certificate of Incorporation',
      required: true,
    },
    {
      key: 'tax',
      label: 'Tax Clearance Certificate',
      description: 'Current TCC from FIRS',
      required: true,
    },
    {
      key: 'directorId',
      label: "Director's Government ID",
      description: "NIN slip, passport, driver's license",
      hint: 'Both sides required',
      required: true,
    },
    {
      key: 'utilityBill',
      label: 'Utility Bill',
      description: 'Not older than 3 months',
      required: false,
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-sm text-gray-400 mt-2">
          Enter your company details to get started with real-time insights.
        </p>
      </div>

      {/* Stepper with numbers */}
      <div className="flex justify-between items-center mb-10 relative">
        <div className="absolute top-2.5 left-0 w-full h-[1px] bg-[#2D2D2D]" />
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep >= stepNumber;
          const isCurrent = currentStep === stepNumber;
          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                  isActive
                    ? 'bg-[#FBC02D] border-[#FBC02D] text-black'
                    : 'bg-black border-gray-500 text-gray-500'
                } ${isCurrent ? 'ring-2 ring-[#FBC02D] ring-offset-2 ring-offset-black' : ''}`}
              >
                {stepNumber}
              </div>
              <span
                className={`text-[10px] mt-2 whitespace-nowrap ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        {/* STEP 1 — Company Information */}
        {currentStep === 1 && (
          <>
            <div>
              <label className="block text-sm text-white mb-2">Company Name:</label>
              <input
                {...register('company_name')}
                placeholder="e.g Emeka Fuels"
                className={inputClass}
              />
              {errors.company_name && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.company_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-white mb-2">Company Email Address:</label>
              <input
                type="email"
                {...register('company_email')}
                placeholder="e.g emeka@fuels.com"
                className={inputClass}
              />
              {errors.company_email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.company_email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-white mb-2">Business Type:</label>
              <select {...register('business_type')} className={`${inputClass} appearance-none`}>
                <option value="">Select a business type</option>
                {Object.entries(BusinessTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.business_type && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.business_type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-white mb-2">Registration Number (CAC)</label>
              <input
                {...register('registration_number')}
                placeholder="RC-12345678"
                className={inputClass}
              />
              {errors.registration_number && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.registration_number.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4">
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
              <button
                type="button"
                onClick={handleStep1Next}
                disabled={isLoading}
                className="tap-effect w-full h-14 rounded-full bg-[#FBC02D] text-black font-semibold disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* STEP 2 — Account Setup */}
        {currentStep === 2 && (
          <>
            <h2 className="text-lg font-semibold text-white">Account Owner</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white mb-2">First Name</label>
                <input {...register('first_name')} placeholder="Thomas" className={inputClass} />
                {errors.first_name && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.first_name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-white mb-2">Last Name</label>
                <input {...register('last_name')} placeholder="Okeke" className={inputClass} />
                {errors.last_name && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-white mb-2">Work Email</label>
              <input
                type="email"
                {...register('account_email')}
                placeholder="admin@company.com"
                className={inputClass}
              />
              {errors.account_email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.account_email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-white mb-2">Phone Number</label>
              <input
                type="tel"
                {...register('admin_phone')}
                placeholder="08012345678"
                className={inputClass}
              />
              {errors.admin_phone && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.admin_phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-white mb-2">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className={`${inputClass} pr-14`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>
              )}

              <div className="flex gap-1 mt-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      strength > i ? strengthColors[strength - 1] : 'bg-[#2D2D2D]'
                    }`}
                  />
                ))}
              </div>
              {password && (
                <p
                  className={`text-right text-[10px] mt-1 ${
                    strengthColors[strength - 1].replace('bg-', 'text-')
                  }`}
                >
                  {strengthLabels[strength - 1]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-white mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  {...register('confirm_password')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  className={`${inputClass} pr-14`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('accepted_terms')}
                  className="accent-[#FBC02D] mt-1"
                />
                <p className="text-xs text-gray-400">
                  I agree to the EnergyIQ{' '}
                  <span className="text-[#FBC02D]">Terms of Service</span>
                </p>
              </label>
              {errors.accepted_terms && (
                <p className="text-red-500 text-xs -mt-2 ml-6">{errors.accepted_terms.message}</p>
              )}

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('accepted_privacy_policy')}
                  className="accent-[#FBC02D] mt-1"
                />
                <p className="text-xs text-gray-400">
                  I have read and accept the EnergyIQ{' '}
                  <span className="text-[#FBC02D]">Privacy Policy</span>
                </p>
              </label>
              {errors.accepted_privacy_policy && (
                <p className="text-red-500 text-xs -mt-2 ml-6">
                  {errors.accepted_privacy_policy.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4">
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
              <button
                type="button"
                onClick={onStep2Submit}
                disabled={isLoading}
                className="tap-effect w-full h-14 rounded-full bg-[#FBC02D] text-black font-semibold disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </>
        )}

        {/* STEP 3 — OTP Verification */}
        {currentStep === 3 && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center mb-6">
              <Lock size={28} className="text-green-500" strokeWidth={2} />
            </div>

            <h2 className="text-2xl font-semibold text-white">OTP Verification</h2>
            <p className="text-sm text-gray-400 mt-3 mb-8">
              We sent a 6-digit code to
              <br />
              <span className="text-white">{accountEmail || 'admin@company.com'}</span>
            </p>

            <div className="flex justify-center gap-3 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  maxLength={1}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className={`w-12 h-12 rounded-lg bg-[#111111] border text-center text-white text-lg font-semibold focus:outline-none focus:border-[#FBC02D] ${
                    otpError ? 'border-red-500' : 'border-[#2D2D2D]'
                  }`}
                />
              ))}
            </div>

            {otpError && <p className="text-red-500 text-xs mb-4">{error ?? 'Invalid code'}</p>}
            {otpResent && !otpError && (
              <p className="text-xs text-gray-400 mb-4">A new code has been sent.</p>
            )}

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              className="tap-effect text-xs text-gray-400 hover:text-[#FBC02D] mb-8 disabled:opacity-50"
            >
              Didn&apos;t receive code? Resend
            </button>

            <button
              type="button"
              onClick={handleOtpSubmit}
              disabled={isLoading}
              className="tap-effect w-full h-14 rounded-full bg-[#FBC02D] text-black font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </div>
        )}

        {/* STEP 4 — Document Upload (KYC) — Styled like screenshot */}
        {currentStep === 4 && !accountCreated && (
          <div className="py-2">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>
                  {uploadedCount} of {documentFields.length} documents uploaded
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#2D2D2D] rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${(uploadedCount / documentFields.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Document cards */}
            <div className="space-y-4">
              {documentFields.map(({ key, label, description, hint, required }) => (
                <div
                  key={key}
                  className="border border-dashed border-[#2D2D2D] rounded-xl p-5 bg-[#111111]"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        {label}{' '}
                        <span
                          className={`text-[10px] uppercase tracking-wider ml-1 ${
                            required ? 'text-[#FBC02D]' : 'text-gray-500'
                          }`}
                        >
                          {required ? 'REQUIRED' : 'OPTIONAL'}
                        </span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                      {hint && <p className="text-[10px] text-gray-600 mt-0.5">{hint}</p>}
                    </div>
                    {documents[key] && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20 whitespace-nowrap">
                        Uploaded - Awaiting review
                      </span>
                    )}
                  </div>

                  {/* Upload area or file row */}
                  {!documents[key] ? (
                    <label className="mt-4 flex flex-col items-center justify-center w-full h-28 rounded-lg border border-dashed border-[#2D2D2D] bg-[#0a0a0a] cursor-pointer hover:border-[#FBC02D] transition-colors">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(key, e.target.files?.[0] ?? null)}
                      />
                      <Upload size={24} className="text-gray-500 mb-2" />
                      <span className="text-xs text-gray-400">Click to upload or drag and drop</span>
                      <span className="text-[10px] text-gray-600 mt-1">
                        PDF, JPG, PNG, Max 10MB
                      </span>
                    </label>
                  ) : (
                    <div className="mt-4 flex items-center justify-between p-3 rounded-lg bg-[#0a0a0a] border border-[#1D1D1D]">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileCheck size={18} className="text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-300 truncate">
                          {documents[key]?.name}
                        </span>
                      </div>
                      <label className="text-xs text-[#FBC02D] hover:underline cursor-pointer shrink-0 ml-3">
                        Replace
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(key, e.target.files?.[0] ?? null)}
                        />
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-8">
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
              <button
                type="button"
                onClick={handleDocumentSubmit}
                disabled={isUploading || isLoading}
                className="tap-effect w-full h-14 rounded-full bg-[#FBC02D] text-black font-semibold disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Create account'}
              </button>
            </div>
          </div>
        )}

        {/* Success Screen — shown ONLY after Document Upload */}
        {currentStep === 4 && accountCreated && (
          <div className="flex flex-col items-center text-center py-10">
            <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center mb-8">
              <span className="text-green-500 text-3xl font-bold">✓</span>
            </div>
            <h2 className="text-3xl font-semibold text-white mb-4">
              Account Created Successfully
            </h2>
            <p className="text-gray-400 mb-10">
              Your account is ready. You can now sign in to your dashboard.
            </p>
            <button
              type="button"
              onClick={() => navigate(slug ? `/${slug}/dashboard` : '/login')}
              className="w-full h-14 rounded-full bg-[#FBC02D] text-black font-semibold"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </form>
    </div>
  );
}