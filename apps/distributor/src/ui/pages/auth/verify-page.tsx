import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout, useAuth, VerifyForm } from '@energyiq/ui';

export function VerifyPage() {
  const navigate = useNavigate();
  const { registrationToken, accountNumber } = useAuth();

  useEffect(() => {
    if (!registrationToken) navigate('/register');
  }, [registrationToken, navigate]);

  if (!registrationToken) return null;

  return (
    <AuthLayout title="Verify your email" subtitle="Enter the 6-digit code sent to your email">
      {accountNumber && (
        <p className="text-sm text-[#FBC02D] font-medium mb-8">Account: {accountNumber}</p>
      )}

      <VerifyForm />

      <p className="text-center text-sm text-gray-400 mt-6">
        Didn&apos;t receive a code?{' '}
        <button type="button" className="text-[#FBC02D] font-medium hover:underline">
          Resend
        </button>
      </p>
    </AuthLayout>
  );
}
