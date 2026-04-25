import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@energyiq/ui';
import { VerifyForm } from '@energyiq/ui';

export function VerifyPage() {
  const navigate = useNavigate();
  const { registrationToken, accountNumber } = useAuth();

  useEffect(() => {
    if (!registrationToken) navigate('/register');
  }, [registrationToken, navigate]);

  if (!registrationToken) return null;

  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight mb-1">Verify your email</h2>
      <p className="text-sm text-muted-foreground mb-2">Enter the 6-digit code sent to your email</p>
      {accountNumber && (
        <p className="text-sm text-primary font-medium mb-8">Account: {accountNumber}</p>
      )}

      <VerifyForm />

      <p className="text-center text-sm text-muted-foreground mt-6">
        Didn't receive a code?{' '}
        <button className="text-primary font-medium hover:underline">Resend</button>
      </p>
    </>
  );
}
