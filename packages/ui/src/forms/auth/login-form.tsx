import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Eye, EyeOff } from 'lucide-react';
import { cn } from '@energyiq/shared';
import { useAuth } from '../../hooks/use-auth';
import { loginSchema, type LoginFormData } from '../../validation/auth/login';

const inputBaseClass =
  'w-full h-[56px] rounded-full bg-[#FFFFFF1A] px-6 text-white placeholder:text-gray-500 ' +
  'focus:outline-none focus:ring-2 focus:ring-[#FBC02D]/40 transition-colors';

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showMfa, setShowMfa] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', mfaCode: '', rememberMe: true },
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const result = await login({
      email: data.email.trim(),
      password: data.password.trim(),
      mfa_code: data.mfaCode?.trim() || undefined,
    });
    if (result.success) navigate(`/${result.slug}/dashboard`);
  };

  const isMfaError = error?.toLowerCase().includes('mfa') || error?.toLowerCase().includes('otp');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-normal text-white">
          Username/Email Address:
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
          className={cn(inputBaseClass, errors.email && 'ring-2 ring-red-500')}
        />
        {errors.email && (
          <p className="text-red-500 text-xs ml-6">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-normal text-white">
          Password:
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            {...register('password')}
            className={cn(inputBaseClass, 'pr-14', errors.password && 'ring-2 ring-red-500')}
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs ml-6">
            {errors.password.message === 'Password is required' ? 'Password is required' : 'Wrong Password'}
          </p>
        )}
      </div>

      {/* MFA Code */}
      {(showMfa || isMfaError) && (
        <div className="flex flex-col gap-2">
          <label htmlFor="mfaCode" className="text-sm font-normal text-white">
            MFA Code:
          </label>
          <input
            id="mfaCode"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="Enter 6-digit MFA code"
            {...register('mfaCode')}
            className={cn(inputBaseClass, errors.mfaCode && 'ring-2 ring-red-500')}
          />
          {errors.mfaCode && (
            <p className="text-red-500 text-xs ml-6">{errors.mfaCode.message}</p>
          )}
        </div>
      )}

      {!showMfa && !isMfaError && (
        <button
          type="button"
          onClick={() => setShowMfa(true)}
          className="self-start text-sm text-[#FBC02D] hover:underline"
        >
          Have an MFA code?
        </button>
      )}

      {/* Stay signed in / Forgot password */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-2">
        <label htmlFor="rememberMe" className="inline-flex items-center gap-2 cursor-pointer select-none">
          <span className="relative inline-flex">
            <input
              id="rememberMe"
              type="checkbox"
              {...register('rememberMe')}
              className="peer appearance-none w-4 h-4 rounded-lg bg-[#FBC02D] cursor-pointer"
            />
            {rememberMe && (
              <Check
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 m-auto size-3 text-[#121212]"
                strokeWidth={3}
              />
            )}
          </span>
          <span className="text-sm text-white">Stay signed in</span>
        </label>
       <Link
  to="/forgot-password"
  className="text-sm text-white hover:underline"
>
  Forgot password?
</Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="tap-effect w-full h-14 rounded-full bg-[#FBC02D] hover:bg-[#FBC02D]/90 text-[#121212] text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Signing in...' : 'Log In'}
      </button>

      {/* Sign up link */}
      <p className="text-center text-sm text-white">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-[#FBC02D] font-medium hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
