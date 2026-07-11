import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/use-auth';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../validation/auth/reset-password';

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const { resetPassword, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    clearError();
    const success = await resetPassword(data.email);
    if (success) navigate('/check-email', { state: { email: data.email } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-semibold text-white">Reset your Password</h1>

        <p className="mb-8 text-sm text-[#FFFFFF80]">
          We'll email you a link to reset your password
        </p>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="mb-2 block text-sm text-white">Email Address:</label>

          <input
            type="email"
            {...register('email')}
            placeholder="Enter email address"
            className="mb-2 h-14 w-full rounded-full bg-[#121212] px-6 text-white outline-none"
          />
          {errors.email && <p className="mb-6 text-xs text-red-500">{errors.email.message}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="tap-effect h-14 w-full rounded-full bg-[#FBC02D] font-semibold text-black hover:bg-[#FBC02D]/90 disabled:opacity-60"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
