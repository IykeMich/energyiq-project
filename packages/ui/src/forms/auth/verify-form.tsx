import { useRef, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@energyiq/shared';
import { useAuth } from '../../hooks/use-auth';
import { verifySchema, type VerifyFormData } from '../../validation/auth/verify';

const OTP_LENGTH = 6;
const cellClass =
  'h-14 w-12 sm:w-14 rounded-2xl bg-[#FFFFFF1A] text-center text-2xl font-semibold text-white ' +
  'focus:outline-none focus:ring-2 focus:ring-[#FBC02D]/60 transition-colors';

interface OtpInputProps {
  value: string;
  onChange: (next: string) => void;
  hasError?: boolean;
}

function OtpInput({ value, onChange, hasError }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? '');

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join('').replace(/[^0-9]/g, ''));
  };

  const handleChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.replace(/\D/g, '');
    if (!raw) {
      setDigit(index, '');
      return;
    }
    // If the user pasted/typed more than one digit, spread them across cells.
    const chars = raw.split('').slice(0, OTP_LENGTH - index);
    const next = digits.slice();
    chars.forEach((ch, offset) => {
      next[index + offset] = ch;
    });
    onChange(next.join(''));
    const nextFocus = Math.min(index + chars.length, OTP_LENGTH - 1);
    refs.current[nextFocus]?.focus();
  };

  const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    onChange(pasted.padEnd(value.length, '').slice(0, OTP_LENGTH));
    const lastIndex = Math.min(pasted.length, OTP_LENGTH) - 1;
    refs.current[lastIndex]?.focus();
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={OTP_LENGTH}
          value={digit}
          onChange={handleChange(index)}
          onKeyDown={handleKeyDown(index)}
          onPaste={handlePaste}
          className={cn(cellClass, hasError && 'ring-2 ring-red-500')}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}

export function VerifyForm() {
  const navigate = useNavigate();
  const { complete, isLoading, error, clearError } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: { otp: '' },
  });

  const otpValue = watch('otp');
  const isComplete = otpValue.length === OTP_LENGTH;

  const onSubmit = async (data: VerifyFormData) => {
    clearError();
    const success = await complete(data.otp);
    if (success) navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-8">
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Controller
          control={control}
          name="otp"
          render={({ field }) => (
            <OtpInput value={field.value} onChange={field.onChange} hasError={!!errors.otp} />
          )}
        />
        {errors.otp && <p className="text-red-500 text-xs">{errors.otp.message}</p>}
      </div>

      <button
        type="submit"
        disabled={!isComplete || isLoading}
        className="w-full h-14 rounded-full bg-[#FBC02D] hover:bg-[#FBC02D]/90 text-[#121212] text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Verifying...' : 'Verify & Activate'}
      </button>
    </form>
  );
}
