import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/use-auth';
import { verifySchema, type VerifyFormData } from '../../validation/auth/verify';
import { OtpField } from '../../fields';
import { FormError } from '../../components/feedback/form-error';
import { Button } from '../../primitives/button';

export function VerifyForm() {
  const navigate = useNavigate();
  const { complete, isLoading, error, clearError } = useAuth();

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: { otp: '' },
  });

  const otpValue = form.watch('otp');
  const isComplete = otpValue.length === 6;

  const onSubmit = async (data: VerifyFormData) => {
    clearError();
    const success = await complete(data.otp);
    if (success) navigate('/dashboard');
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormError message={error} />

      <OtpField control={form.control} name="otp" />

      <Button type="submit" className="w-full" disabled={!isComplete || isLoading}>
        {isLoading ? 'Verifying...' : 'Verify & Activate'}
      </Button>
    </form>
  );
}
