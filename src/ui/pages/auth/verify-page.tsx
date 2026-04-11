import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/ui/hooks/use-auth';
import { VerifyForm } from '@/ui/forms/auth/verify-form';

export function VerifyPage() {
  const navigate = useNavigate();
  const { registrationToken, accountNumber } = useAuth();

  useEffect(() => {
    if (!registrationToken) navigate('/register');
  }, [registrationToken, navigate]);

  if (!registrationToken) return null;

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
      <p className="text-gray-500 mb-2">Enter the 6-digit code sent to your email</p>
      {accountNumber && (
        <p className="text-sm text-[#1E3A5F] font-medium mb-8">Account: {accountNumber}</p>
      )}

      <VerifyForm />

      <p className="text-center text-sm text-gray-500 mt-6">
        Didn't receive a code?{' '}
        <button className="text-[#1E3A5F] font-medium hover:underline">Resend</button>
      </p>
    </>
  );
}
