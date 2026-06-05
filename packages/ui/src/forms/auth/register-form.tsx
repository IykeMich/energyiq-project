import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';

import { useAuth } from '../../hooks/use-auth';
import {
  registerSchema,
  type RegisterFormData,
} from '../../validation/auth/register';
import { UploadCloud } from 'lucide-react';
const steps = [
  'Company Information',
  'Account Setup',
  'Document Upload',
  'OTP Verification',
];

export function RegisterForm() {
  const navigate = useNavigate();

  const { initiate, isLoading, error, clearError } = useAuth();
const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [documents, setDocuments] = useState({
  cac: null as File | null,
  tax: null as File | null,
  directorId: null as File | null,
  utilityBill: null as File | null,
});

const handleOtpChange = (
  value: string,
  index: number
) => {
  if (!/^\d*$/.test(value)) return;

  const newOtp = [...otp];
  newOtp[index] = value.slice(-1);
  setOtp(newOtp);

  if (value && index < 5) {
    (
      document.getElementById(
        `otp-${index + 1}`
      ) as HTMLInputElement
    )?.focus();
  }
};

const resendOtp = () => {
  console.log('Resend OTP');
};

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const password = watch('password');

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const uploadedCount = Object.values(documents).filter(Boolean).length;

const progress = (uploadedCount / 4) * 100;

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (currentStep !== 4) return;

    clearError();

    const success = await initiate({
      company: {
        name: data.company_name,
        email: data.company_email || undefined,
        business_type: data.business_type,
        registration_number: data.registration_number,
      },
      account: {
        name: data.account_name,
        email: data.account_email,
        password: data.password,
      },
    });

    if (success) {
      navigate('/verify');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}

      <div className="mb-8">
        {/* <h1 className="text-3xl font-semibold text-white">
          Create your Account
        </h1> */}

        <p className="text-sm text-gray-400 mt-2">
          Enter your company details to get started with real-time insights.
        </p>
      </div>

      {/* Stepper */}

      <div className="flex justify-between items-center mb-10 relative">
        <div className="absolute top-2.5 left-0 w-full h-[1px] bg-[#2D2D2D]" />

        {steps.map((step, index) => {
          const active = currentStep >= index + 1;

          return (
            <div
              key={step}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`w-5 h-5 rounded-full border ${
                  active
                    ? 'bg-[#FBC02D] border-[#FBC02D]'
                    : 'bg-black border-gray-500'
                }`}
              />

              <span
                className={`text-[10px] mt-2 whitespace-nowrap ${
                  active ? 'text-white' : 'text-gray-500'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* STEP 1 */}

        {currentStep === 1 && (
          <>
            <div>
              <label className="block text-sm text-white mb-2">
                Company Name:
              </label>

              <input
                {...register('company_name')}
                placeholder="e.g Emeka Fuels"
                className="w-full h-14 rounded-full bg-[#111111] border border-[#1D1D1D] px-6 text-white placeholder:text-gray-500"
              />

              {errors.company_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.company_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-white mb-2">
                Company Email Address:
              </label>

              <input
                type="email"
                {...register('company_email')}
                placeholder="e.g emeka@fuels.com"
                className="w-full h-14 rounded-full bg-[#111111] border border-[#1D1D1D] px-6 text-white placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm text-white mb-2">
                Business Type:
              </label>

              <select
                {...register('business_type')}
                className="w-full h-14 rounded-full bg-[#111111] border border-[#1D1D1D] px-6 text-white"
              >
                <option value="">Select a business type</option>
                <option value="LPG Distribution">
                  LPG Distribution
                </option>
                <option value="Retail Station">
                  Retail Station
                </option>
                <option value="Logistics">
                  Logistics
                </option>
                <option value="Energy Services">
                  Energy Services
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-white mb-2">
                Registration Number (CAC)
              </label>

              <input
                {...register('registration_number')}
                placeholder="RC-12345678"
                className="w-full h-14 rounded-full bg-[#111111] border border-[#1D1D1D] px-6 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) =>
                  setAgreeTerms(e.target.checked)
                }
                className="accent-[#FBC02D] mt-1"
              />

              <p className="text-xs text-gray-400">
                I agree to the EnergyIQ Terms of Service
                and Privacy Policy
              </p>
            </div>
          </>
        )}

        {/* STEP 2 */}

        {currentStep === 2 && (
          <>
            <div>
              <label className="block text-sm text-white mb-2">
                Admin Name
              </label>

              <input
                {...register('account_name')}
                placeholder="Thomas Okaka"
                className="w-full h-14 rounded-full bg-[#111111] border border-[#1D1D1D] px-6 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-white mb-2">
                Admin Email
              </label>

              <input
                type="email"
                {...register('account_email')}
                placeholder="admin@company.com"
                className="w-full h-14 rounded-full bg-[#111111] border border-[#1D1D1D] px-6 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-white mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full h-14 rounded-full bg-[#111111] border border-[#1D1D1D] px-6 pr-14 text-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex gap-1 mt-3">
                <div className="h-1 flex-1 rounded-full bg-green-500" />
                <div className="h-1 flex-1 rounded-full bg-green-500" />
                <div className="h-1 flex-1 rounded-full bg-green-500" />
                <div className="h-1 flex-1 rounded-full bg-green-500" />
              </div>

              <p className="text-right text-[10px] text-green-500 mt-1">
                {password ? 'Strong' : ''}
              </p>
            </div>

            <div>
              <label className="block text-sm text-white mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  className="w-full h-14 rounded-full bg-[#111111] border border-[#1D1D1D] px-6 pr-14 text-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* STEP 3 */}

       {currentStep === 3 && (
  <div className="bg-[#0D0D0D] border border-[#1D1D1D] rounded-[24px] p-6">
    <div className="mb-6">
      <div className="h-full bg-[#FBC02D] rounded-full"
     style={{ width: `${progress}%` }}
/>
      <p className="text-xs text-gray-400">
  {uploadedCount} of 4 documents uploaded
</p>

      <div className="w-full h-1 bg-[#1F1F1F] rounded-full mt-3">
        <div className="h-full w-0 bg-[#FBC02D] rounded-full" />
      </div>
    </div>

    {/* CAC */}
    <div className="border border-dashed border-[#4A4A4A] rounded-xl p-5 mb-4">
      <h4 className="text-white text-sm font-medium">
        CAC Certificate
        <span className="text-[#FBC02D] ml-1">
          required
        </span>
      </h4>

      <p className="text-xs text-gray-400 mt-1">
        Certificate of Incorporation
      </p>

      <label className="mt-4 flex justify-center cursor-pointer">
        <div className="w-[220px] h-[90px] bg-[#181818] rounded-lg flex flex-col items-center justify-center">
          <p className="text-[#FBC02D] text-xs font-medium">
            Click to upload
          </p>

          <p className="text-gray-400 text-xs">
            or drag and drop
          </p>

          <p className="text-[10px] text-gray-500 mt-1">
            PDF, JPG, PNG (Max 10MB)
          </p>
        </div>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
        />
      </label>
    </div>

    {/* Tax Clearance */}
    <div className="border border-dashed border-[#4A4A4A] rounded-xl p-5 mb-4">
      <h4 className="text-white text-sm font-medium">
        Tax Clearance Certificate
        <span className="text-[#FBC02D] ml-1">
          required
        </span>
      </h4>

      <p className="text-xs text-gray-400 mt-1">
        Current TCC from FIRS
      </p>

      <label className="mt-4 flex justify-center cursor-pointer">
        <div className="w-[220px] h-[90px] bg-[#181818] rounded-lg flex flex-col items-center justify-center">
          <p className="text-[#FBC02D] text-xs font-medium">
            Click to upload
          </p>

          <p className="text-gray-400 text-xs">
            or drag and drop
          </p>

          <p className="text-[10px] text-gray-500 mt-1">
            PDF, JPG, PNG (Max 10MB)
          </p>
        </div>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
        />
      </label>
    </div>

    {/* Directors */}
    <div className="border border-dashed border-[#4A4A4A] rounded-xl p-5 mb-4">
      <h4 className="text-white text-sm font-medium">
        Director's Government ID
        <span className="text-[#FBC02D] ml-1">
          required
        </span>
      </h4>

      <p className="text-xs text-gray-400 mt-1">
        NIN slip, Passport, Driver's License
      </p>

      <p className="text-[#FBC02D] text-xs mt-1">
        Both sides required
      </p>

      <label className="mt-4 flex justify-center cursor-pointer">
        <div className="w-[220px] h-[90px] bg-[#181818] rounded-lg flex flex-col items-center justify-center">
          <p className="text-[#FBC02D] text-xs font-medium">
            Click to upload
          </p>

          <p className="text-gray-400 text-xs">
            or drag and drop
          </p>

          <p className="text-[10px] text-gray-500 mt-1">
            PDF, JPG, PNG (Max 10MB)
          </p>
        </div>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
        />
      </label>
    </div>

    {/* Utility Bill */}
    <div className="border border-dashed border-[#4A4A4A] rounded-xl p-5">
      <h4 className="text-white text-sm font-medium">
        Utility Bill
      </h4>

      <p className="text-xs text-gray-400 mt-1">
        Not older than 3 months
      </p>

      <label className="mt-4 flex justify-center cursor-pointer">
        <div className="w-[220px] h-[90px] bg-[#181818] rounded-lg flex flex-col items-center justify-center">
          <p className="text-[#FBC02D] text-xs font-medium">
            Click to upload
          </p>

          <p className="text-gray-400 text-xs">
            or drag and drop
          </p>

          <p className="text-[10px] text-gray-500 mt-1">
            PDF, JPG, PNG (Max 10MB)
          </p>
        </div>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
        />
      </label>
    </div>
  </div>
)}

 {/* STEP 4 */}
{currentStep === 4 && (
  <div className="flex flex-col items-center text-center py-6">
    {/* Success Circle */}
    <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center mb-6">
      <span className="text-green-500 text-xl font-bold">✓</span>
    </div>

    {/* Title */}
    <h2 className="text-2xl font-semibold text-white">
      OTP Verification
    </h2>

    {/* Description */}
    <p className="text-sm text-gray-400 mt-3 mb-8 max-w-md">
      We sent a 6-digit code to
      <br />
      <span className="text-white">
        {watch('account_email') || 'admin@company.com'}
      </span>
    </p>

    {/* OTP Inputs */}
    <div className="flex justify-center gap-2 mb-5">
      {otp.map((digit, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          value={digit}
          maxLength={1}
          onChange={(e) =>
            handleOtpChange(e.target.value, index)
          }
          className="w-12 h-12 rounded-lg bg-[#111111] border border-red-500 text-center text-white text-lg font-semibold focus:outline-none focus:border-[#FBC02D]"
        />
      ))}
    </div>

    {/* Resend */}
    <button
      type="button"
      onClick={resendOtp}
      className="text-xs text-gray-400 hover:text-[#FBC02D] transition"
    >
      Didn't receive code? Resend code
    </button>
  </div>
)}

         {/* Buttons */}
{currentStep < 4 ? (
  <div className="flex gap-4 pt-4">
    {currentStep > 1 && (
      <button
        type="button"
        onClick={prevStep}
        className="w-full h-14 rounded-full border border-[#FBC02D] text-[#FBC02D]"
      >
        Back
      </button>
    )}

    <button
      type="button"
      onClick={nextStep}
      disabled={currentStep === 1 && !agreeTerms}
      className="w-full h-14 rounded-full bg-[#FBC02D] text-black font-semibold disabled:opacity-50"
    >
      Next
    </button>
  </div>
) : (
  <button
    type="submit"
    disabled={isLoading}
    className="w-full h-14 rounded-full bg-[#FBC02D] text-black font-semibold mt-6"
  >
    {isLoading ? 'Verifying...' : 'Submit'}
  </button>
)}

</form>
    </div>
  );
}