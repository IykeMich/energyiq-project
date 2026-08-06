import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout, useAuth, VerifyForm } from '@energyiq/ui';

export function VerifyPage() {
  const navigate = useNavigate();
  const { registrationToken, accountNumber, resendOtp, isLoading } = useAuth();
  const [otpResent, setOtpResent] = useState(false);

  useEffect(() => {
    if (!registrationToken) navigate('/register');
  }, [registrationToken, navigate]);

  if (!registrationToken) return null;

  const handleResend = async () => {
    const { success } = await resendOtp();
    if (success) setOtpResent(true);
  };

  return (
    <AuthLayout title="Verify your email" subtitle="Enter the 6-digit code sent to your email">
      {accountNumber && (
        <p className="text-sm text-[#FBC02D] font-medium mb-8">Account: {accountNumber}</p>
      )}

      <VerifyForm />

      <p className="text-center text-sm text-gray-400 mt-6">
        {otpResent ? (
          'A new code has been sent to your email.'
        ) : (
          <>
            Didn&apos;t receive a code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className="tap-effect text-[#FBC02D] font-medium hover:underline disabled:opacity-60"
            >
              Resend
            </button>
          </>
        )}
      </p>
    </AuthLayout>
  );
}
