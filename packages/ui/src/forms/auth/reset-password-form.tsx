import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/use-auth';
import {
  resetPasswordSchema,
  resetPasswordFormDefaultValues,
  type ResetPasswordFormData,
} from '../../validation/auth/reset-password';

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const { resetPasswordVerify, resetPasswordConfirm, isLoading, error, clearError } = useAuth();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: resetPasswordFormDefaultValues,
  });

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }
    resetPasswordVerify(token).then(setTokenValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    clearError();
    const success = await resetPasswordConfirm({ token, ...data });
    if (success) navigate('/login');
  };

  if (tokenValid === false) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="mb-2 text-3xl font-semibold text-white">Link expired</h1>
          <p className="mb-8 text-sm text-[#FFFFFF80]">
            This password reset link is invalid or has expired. Request a new one.
          </p>
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="tap-effect h-14 w-full rounded-full bg-[#FBC02D] font-semibold text-black hover:bg-[#FBC02D]/90"
          >
            Request new link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-semibold text-white">Set a New Password</h1>

        <p className="mb-8 text-sm text-[#FFFFFF80]">
          Your new password should be 12+ characters long.
        </p>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-white">New Password:</label>

            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                {...register('new_password')}
                className="h-14 w-full rounded-full bg-[#232323] px-6 text-white"
              />

              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="tap-effect absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showNew ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.new_password && (
              <p className="mt-2 text-xs text-red-500">{errors.new_password.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Confirm Password:</label>

            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                {...register('confirm_password')}
                className="h-14 w-full rounded-full bg-[#232323] px-6 text-white"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="tap-effect absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="mt-2 text-xs text-red-500">{errors.confirm_password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || tokenValid !== true}
            className="tap-effect h-14 w-full rounded-full bg-[#FBC02D] font-semibold text-black hover:bg-[#FBC02D]/90 disabled:opacity-60"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
