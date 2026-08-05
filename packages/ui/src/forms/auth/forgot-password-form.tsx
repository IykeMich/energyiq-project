import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@energyiq/shared';
import { useAuth } from '../../hooks/use-auth';
import {
  forgotPasswordSchema,
  forgotPasswordFormDefaultValues,
  type ForgotPasswordFormData,
} from '../../validation/auth/reset-password';

const inputBaseClass =
  'w-full h-[56px] rounded-full bg-[#6161611A] px-6 text-white placeholder:text-gray-500 ' +
  'focus:outline-none focus:ring-2 focus:ring-[#FBC02D]/40 transition-colors';

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const { resetPassword, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: forgotPasswordFormDefaultValues,
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    clearError();
    const success = await resetPassword(data.email);
    if (success) navigate('/check-email', { state: { email: data.email } });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6 px-2">
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-normal text-white">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
          className={cn(inputBaseClass, errors.email && 'ring-2 ring-red-500')}
          placeholder="Enter email address"
        />
        {errors.email && (
          <p className="text-red-500 text-xs ml-6">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="tap-effect w-full h-14 rounded-full bg-[#FBC02D] hover:bg-[#FBC02D]/90 text-[#121212] text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
