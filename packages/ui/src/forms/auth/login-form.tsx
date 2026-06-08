import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, tempBypassLogin } from '@energyiq/store';
import { cn } from '@energyiq/shared';
import { loginSchema, type LoginFormData } from '../../validation/auth/login';

const inputBaseClass =
  'w-full h-[56px] rounded-full bg-[#FFFFFF1A] px-6 text-white placeholder:text-gray-500 ' +
  'focus:outline-none focus:ring-2 focus:ring-[#FBC02D]/40 transition-colors';

export function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: true },
  });

  const rememberMe = watch('rememberMe');

  // TEMP: auth endpoint bypassed — fake a logged-in state, then navigate to
  // /dashboard. The commented `onSubmit` below restores the real flow.
  const onSubmit = () => {
    dispatch(tempBypassLogin());
    navigate('/dashboard');
  };
  // const onSubmit = async (data: LoginFormData) => {
  //   const success = await login({ email: data.email, password: data.password });
  //   if (success) navigate('/dashboard');
  // };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
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

      {/* Stay signed in / Forgot password */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-2">
        <label htmlFor="rememberMe" className="inline-flex items-center gap-2 cursor-pointer select-none">
          <span className="relative inline-flex">
            <input
              id="rememberMe"
              type="checkbox"
              {...register('rememberMe')}
              className="peer appearance-none w-4 h-4 rounded-[4px] bg-[#FBC02D] cursor-pointer"
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
        <a href="#" className="text-sm text-white hover:underline">
          Forgot password?
        </a>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full h-14 rounded-full bg-[#FBC02D] hover:bg-[#FBC02D]/90 text-[#121212] text-sm font-semibold transition-colors"
      >
        Log In
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
