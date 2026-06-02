import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@energyiq/shared';
import { useAuth } from '../../hooks/use-auth';
import { registerSchema, type RegisterFormData } from '../../validation/auth/register';

const inputBaseClass =
  'w-full h-[56px] rounded-full bg-[#FFFFFF1A] px-6 text-white placeholder:text-gray-500 ' +
  'focus:outline-none focus:ring-2 focus:ring-[#FBC02D]/40 transition-colors';

interface DarkFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email';
  optional?: boolean;
  errorMessage?: string;
  inputProps: UseFormRegisterReturn;
}

function DarkField({
  id,
  label,
  placeholder,
  type = 'text',
  optional,
  errorMessage,
  inputProps,
}: DarkFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-normal text-white">
        {label}
        {optional && <span className="text-gray-500 ml-1 text-xs">(optional)</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...inputProps}
        className={cn(inputBaseClass, errorMessage && 'ring-2 ring-red-500')}
      />
      {errorMessage && <p className="text-red-500 text-xs ml-6">{errorMessage}</p>}
    </div>
  );
}

export function RegisterForm() {
  const navigate = useNavigate();
  const { initiate, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      company_name: '',
      company_email: '',
      business_type: '',
      registration_number: '',
      account_name: '',
      account_email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    const success = await initiate({
      company: {
        name: data.company_name,
        email: data.company_email || undefined,
        business_type: data.business_type,
        registration_number: data.registration_number,
      },
      account: {
        name: data.account_name,
        email: data.account_email,
        password: data.password,
      },
    });

    if (success) navigate('/verify');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-8">
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold text-white mb-2">Company Information</legend>

        <DarkField
          id="company_name"
          label="Company Name"
          placeholder="MegaEnergy Ltd"
          inputProps={register('company_name')}
          errorMessage={errors.company_name?.message}
        />
        <DarkField
          id="company_email"
          label="Company Email"
          type="email"
          optional
          placeholder="info@megaenergy.com"
          inputProps={register('company_email')}
          errorMessage={errors.company_email?.message}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DarkField
            id="business_type"
            label="Business Type"
            placeholder="LPG Distribution"
            inputProps={register('business_type')}
            errorMessage={errors.business_type?.message}
          />
          <DarkField
            id="registration_number"
            label="Registration No."
            placeholder="RC123456"
            inputProps={register('registration_number')}
            errorMessage={errors.registration_number?.message}
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold text-white mb-2">Account Owner</legend>

        <DarkField
          id="account_name"
          label="Your Name"
          placeholder="Chioma Okonkwo"
          inputProps={register('account_name')}
          errorMessage={errors.account_name?.message}
        />
        <DarkField
          id="account_email"
          label="Email"
          type="email"
          placeholder="chioma@megaenergy.com"
          inputProps={register('account_email')}
          errorMessage={errors.account_email?.message}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-normal text-white">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 12 characters"
              autoComplete="new-password"
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
            <p className="text-red-500 text-xs ml-6">{errors.password.message}</p>
          )}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 rounded-full bg-[#FBC02D] hover:bg-[#FBC02D]/90 text-[#121212] text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
