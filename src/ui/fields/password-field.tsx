import { useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '@/lib/cn';

interface PasswordFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
  className?: string;
}

export function PasswordField({ label, registration, error, placeholder, className }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          {...registration}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          className={cn(
            'w-full border rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]',
            error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300',
          )}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs hover:text-gray-600"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
