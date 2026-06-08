import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';

import { useAuth } from '../../hooks/use-auth';
import {
  distributorSchema,
  type DistributorFormData,
} from '../../validation/auth/register';

import { Upload, FileText } from 'lucide-react';

const steps = [
  'Account Setup',
  'OTP verification',
  'Business Profile',
  'Document Upload',
  'Assurance Payment',
  'Activation',
];

export function DistributorForm() {
  const navigate = useNavigate();
  const { isLoading, error, clearError } = useAuth();
  const [showIntro, setShowIntro] = useState(true);

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [businessProfile, setBusinessProfile] = useState({
  businessName: '',
  cacNumber: '',
  tin: '',
  address: '',
  city: '',
  state: '',
  contactPerson: '',
  operationalRegions: '',
});
const [documentErrors, setDocumentErrors] = useState<
  Record<string, string>
>({});

const [documents, setDocuments] = useState({
  cac: null as File | null,
  tax: null as File | null,
  directorId: null as File | null,
  registration: null as File | null,
  utility: null as File | null,
});

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<DistributorFormData>({
    resolver: zodResolver(distributorSchema),
    mode: 'onChange',
    defaultValues: {
      account_name: '',
      account_email: '',
      password: '',
      confirm_password: '',
    },
  });

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
];

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep((p) => p + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((p) => p - 1);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };
  const handleFileUpload = (
  e: React.ChangeEvent<HTMLInputElement>,
  key: keyof typeof documents
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    setDocumentErrors((prev) => ({
      ...prev,
      [key]: 'File must not exceed 10MB',
    }));

    return;
  }

  setDocumentErrors((prev) => ({
    ...prev,
    [key]: '',
  }));

  setDocuments((prev) => ({
    ...prev,
    [key]: file,
  }));
};

  const onSubmit = async (data: DistributorFormData) => {
    clearError();

    // if (currentStep === 1) {
    //   try {
    //     await initiate({
    //       accountNumber
    //     });

    //     setCurrentStep(2);
    //   } catch (err) {
    //     console.error(err);
    //   }

    //   return;
    // }

    if (currentStep === 6) {
      navigate('/dashboard');
      return;
    }

    nextStep();
  };

 return (
  <div className="min-h-screen bg-[#0f0f0f] text-white">
    {showIntro ? (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-[#2a2a2a] bg-[#161616] p-8 text-center">

          {/* Logo */}
          <div className="-mx-8 -mt-8 h-16 bg-yellow-400 rounded-t-3xl mb-8" />

          <h2 className="text-lg font-semibold">
            Join TotalEnergies Nig on EnergyIQ
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
              <div
                key={item}
                className="flex items-center gap-3 text-sm"
              >
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
            className="w-full mt-10 h-12 rounded-full bg-yellow-400 text-black font-semibold"
          >
            Get Started
          </button>

          <p className="text-xs text-gray-500 mt-4">
            It only takes a few minutes
          </p>
        </div>
      </div>
    ) : (
      <>
      

      {/* Stepper */}
      <div className="flex justify-between max-w-3xl mx-auto mt-10 mb-12 px-4 relative">
        <div className="absolute top-2 left-8 right-8 h-[2px] bg-[#333]" />

        {steps.map((step, index) => {
          const active = currentStep >= index + 1;
          const done = currentStep > index + 1;

          return (
            <div key={step} className="flex flex-col items-center z-10 flex-1">
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  done
                    ? 'bg-[#FBC02D] border-[#FBC02D]'
                    : active
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

      {/* Form */}
      <div className="max-w-2xl mx-auto bg-[#161616] p-10 rounded-3xl border border-[#262626]">
        <h2 className="text-xl font-semibold mb-6">
          {steps[currentStep - 1]}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

         {/* STEP 1 */}
{currentStep === 1 && (
  <>
    <div>
      <label className="block text-sm text-gray-300 mb-2">
        Full Name
      </label>

      <input
        {...register('account_name')}
        placeholder="Enter your full name"
        className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600 text-white"
      />
    </div>

    <div>
      <label className="block text-sm text-gray-300 mb-2">
        Email Address
      </label>

      <input
        {...register('account_email')}
        type="email"
        placeholder="Enter your email address"
        className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600 text-white"
      />
    </div>

    <div>
      <label className="block text-sm text-gray-300 mb-2">
        Password
      </label>

      <div className="relative">
        <input
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className="w-full h-14 px-6 pr-14 rounded-full bg-transparent border border-gray-600 text-white"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-5 top-1/2 -translate-y-1/2"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>

    <div>
      <label className="block text-sm text-gray-300 mb-2">
        Confirm Password
      </label>

      <div className="relative">
        <input
          {...register('confirm_password')}
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          className="w-full h-14 px-6 pr-14 rounded-full bg-transparent border border-gray-600 text-white"
        />

        <button
          type="button"
          onClick={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
          className="absolute right-5 top-1/2 -translate-y-1/2"
        >
          {showConfirmPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>

    <label className="flex gap-2 text-xs text-gray-400">
      <input
        type="checkbox"
        checked={agreeTerms}
        onChange={(e) => setAgreeTerms(e.target.checked)}
      />
      I confirm the information provided is accurate and that I am
      authorized to create this account on behalf of my business
    </label>
  </>
)}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-6">

              <div className="text-center">
                <h2 className="text-3xl font-bold">
                  Verify Your Email
                </h2>

                <p className="text-sm text-gray-400 mt-2">
                  We'll send a 6-digit verification code to your phone number.
                </p>
              </div>

              <div>
                <label className="block text-sm mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600 text-white"
                />
              </div>

              {!codeSent ? (
                <button
                  type="button"
                  onClick={() => setCodeSent(true)}
                  className="w-full h-14 rounded-full bg-[#4A4A4A] text-white font-semibold"
                >
                  Send Code
                </button>
              ) : (
                <div className="flex justify-center gap-3">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      value={d}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                      maxLength={1}
                      className="w-12 h-14 text-center bg-transparent border border-gray-600 rounded-xl text-white"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
  <div className="space-y-4">
    <p className="text-sm text-gray-400">
      Tell us about your business. This information is for KYC verification.
    </p>

    <input
      placeholder="Business Name"
      className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600"
      value={businessProfile.businessName}
      onChange={(e) =>
        setBusinessProfile({
          ...businessProfile,
          businessName: e.target.value,
        })
      }
    />

    <input
      placeholder="CAC Registration Number"
      className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600"
      value={businessProfile.cacNumber}
      onChange={(e) =>
        setBusinessProfile({
          ...businessProfile,
          cacNumber: e.target.value,
        })
      }
    />

    <input
      placeholder="Tax Identification Number (TIN)"
      className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600"
      value={businessProfile.tin}
      onChange={(e) =>
        setBusinessProfile({
          ...businessProfile,
          tin: e.target.value,
        })
      }
    />

    <input
      placeholder="Business Address"
      className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600"
      value={businessProfile.address}
      onChange={(e) =>
        setBusinessProfile({
          ...businessProfile,
          address: e.target.value,
        })
      }
    />

    <div className="grid grid-cols-2 gap-4">
      <input
        placeholder="City"
        className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600"
      />

      <input
        placeholder="State"
        className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600"
      />
    </div>

    <input
      placeholder="Primary Contact Person"
      className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600"
    />

    <input
      placeholder="Operational Regions"
      className="w-full h-14 px-6 rounded-full bg-transparent border border-gray-600"
    />
  </div>
)}

{currentStep === 4 && (
  <div className="space-y-5">

    <div>
      <h3 className="text-xl font-semibold">
        Upload Documents
      </h3>

      <p className="text-sm text-gray-400 mt-1">
        Upload the following documents for KYC verification.
      </p>
    </div>

    {documentRequirements.map((doc) => {
      const file =
        documents[doc.key as keyof typeof documents];

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
                    doc.required
                      ? 'text-yellow-400'
                      : 'text-gray-500'
                  }`}
                >
                  {doc.required
                    ? 'REQUIRED'
                    : 'OPTIONAL'}
                </span>
              </h4>

              <p className="text-xs text-gray-400 mt-1">
                {doc.description}
              </p>
            </div>

            {file ? (
              <span className="px-3 py-1 rounded-full text-xs bg-green-900/40 text-green-400">
                Uploaded, Awaiting review
              </span>
            ) : doc.required ? (
              <span className="px-3 py-1 rounded-full text-xs bg-red-900/40 text-red-400">
                Not Uploaded
              </span>
            ) : null}
          </div>

          {!file ? (
            <label className="block cursor-pointer border border-dashed border-gray-500 rounded-xl p-10 text-center hover:border-yellow-400 transition">
              <Upload
                className="mx-auto mb-4 text-gray-400"
                size={28}
              />

              <div>
                <span className="text-yellow-400">
                  Click to upload
                </span>

                <span className="text-gray-300">
                  {' '}
                  or drag and drop
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                PDF, JPG, PNG · Max 10MB
              </p>

              <input
                type="file"
                hidden
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  handleFileUpload(
                    e,
                    doc.key as keyof typeof documents
                  )
                }
              />
            </label>
          ) : (
            <div className="bg-[#222] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={18} />

                <span className="text-sm">
                  {file.name}
                </span>
              </div>

              <label className="cursor-pointer text-yellow-400 text-sm">
                Replace

                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileUpload(
                      e,
                      doc.key as keyof typeof documents
                    )
                  }
                />
              </label>
            </div>
          )}

          {documentErrors[doc.key] && (
            <p className="text-red-500 text-xs mt-2">
              {documentErrors[doc.key]}
            </p>
          )}
        </div>
      );
    })}
  </div>
)}

{currentStep === 5 && (
  <div className="space-y-3">
    <div className="p-4 rounded-xl border border-green-600 bg-green-600/10">
      ✓ Account Created
    </div>

    <div className="p-4 rounded-xl border border-green-600 bg-green-600/10">
      ✓ Phone Verified
    </div>

    <div className="p-4 rounded-xl border border-green-600 bg-green-600/10">
      ✓ Business Profile Completed
    </div>

    <div className="p-4 rounded-xl border border-green-600 bg-green-600/10">
      ✓ Documents Uploaded
    </div>

    <div className="p-4 rounded-xl border border-orange-500 bg-orange-500/10">
      Compliance Review In Progress
    </div>

    <div className="p-4 rounded-xl border border-yellow-500 bg-yellow-500/10 text-sm">
      Compliance review typically takes 24–72 hours.
    </div>
  </div>
)}

{currentStep === 6 && (
  <div className="text-center py-10">
    <div className="w-16 h-16 mx-auto rounded-full bg-yellow-400 text-black flex items-center justify-center text-2xl">
      ✓
    </div>

    <h2 className="text-2xl font-bold mt-5">
      You're Live!
    </h2>

    <p className="text-gray-400 mt-2">
      Welcome to EnergyIQ Distributor Network.
      Your trading account is active.
    </p>

    <button
      type="button"
      onClick={() => navigate('/dashboard')}
      className="w-full mt-8 h-12 rounded-full bg-yellow-400 text-black font-semibold"
    >
      View Dashboard
    </button>
  </div>
)}

          {/* Navigation */}
          <div className="flex gap-4 pt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="w-full h-12 border border-yellow-400 text-yellow-400 rounded-full"
              >
                Back
              </button>
            )}

            <button
              type={currentStep === 1 ? 'submit' : 'button'}
              onClick={() => {
  // STEP 2 VALIDATION
  if (currentStep === 2) {
    const filled = otp.every((d) => d !== '');

    if (!codeSent || !filled) {
      return;
    }
  }

  // STEP 4 DOCUMENT VALIDATION
  if (currentStep === 4) {
    const requiredFiles = [
      'cac',
      'tax',
      'directorId',
      'registration',
    ];

    const missing = requiredFiles.filter(
      (key) =>
        !documents[key as keyof typeof documents]
    );

    if (missing.length > 0) {
      setDocumentErrors({
        cac: !documents.cac
          ? 'CAC Certificate is required'
          : '',
        tax: !documents.tax
          ? 'Tax Clearance Certificate is required'
          : '',
        directorId: !documents.directorId
          ? "Director's ID is required"
          : '',
        registration: !documents.registration
          ? 'Business Registration Certificate is required'
          : '',
      });

      return;
    }
  }

  // STEP 6 COMPLETE
  if (currentStep === 6) {
    navigate('/dashboard');
    return;
  }

  nextStep();
}}
              disabled={isLoading || (currentStep === 1 && !agreeTerms)}
              className="w-full h-12 rounded-full bg-yellow-400 text-black font-semibold disabled:opacity-40"
            >
              {currentStep === 5
  ? 'Activate Account'
  : currentStep === 4
  ? 'Create Account'
  : currentStep === 6
  ? 'Finish'
  : 'Continue'}
            </button>
          </div>

        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </>
  )}
</div>
);
}