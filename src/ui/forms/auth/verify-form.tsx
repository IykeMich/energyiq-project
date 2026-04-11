import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/ui/hooks/use-auth';
import { OtpField } from '@/ui/fields';
import { FormError } from '@/ui/components/feedback/form-error';
import { SubmitButton } from '@/ui/components/common/submit-button';

export function VerifyForm() {
  const navigate = useNavigate();
  const { complete, isLoading, error, clearError } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const isComplete = otp.every((d) => d !== '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;

    clearError();
    const success = await complete(otp.join(''));
    if (success) navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormError message={error} />

      <OtpField value={otp} onChange={setOtp} />

      <SubmitButton
        isLoading={isLoading}
        disabled={!isComplete}
        label="Verify & Activate"
        loadingLabel="Verifying..."
      />
    </form>
  );
}
