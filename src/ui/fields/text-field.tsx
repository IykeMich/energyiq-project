import type { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '@/lib/cn';

interface TextFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
  optional?: boolean;
  className?: string;
}

export function TextField({ label, registration, error, placeholder, optional, className }: TextFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {optional && <span className="text-gray-400 ml-1">(optional)</span>}
      </label>
      <input
        {...registration}
        type="text"
        placeholder={placeholder}
        className={cn(
          'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]',
          error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300',
        )}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
