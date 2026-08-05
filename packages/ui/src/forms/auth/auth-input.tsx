import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import type { FieldError } from "react-hook-form";
import { cn } from "@energyiq/shared";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  containerClassName?: string;
  endAdornment?: ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    { label, error, className, containerClassName, endAdornment, id, name, ...rest },
    ref,
  ) => {
    const inputId = id ?? name;
    return (
      <div className={containerClassName}>
        <label htmlFor={inputId} className="block text-lg font-medium text-[#FAFAFA] mb-2">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            name={name}
            className={cn(
              "w-full h-17.5 rounded-full bg-[#6161611A] px-8 text-lg font-medium text-white placeholder:text-[#616161B2] placeholder:italic focus:outline-none focus:ring-1 focus:ring-[#FBC02D]",
              endAdornment && "pr-14",
              className,
            )}
            {...rest}
          />
          {endAdornment}
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-1 ml-1">{error.message}</p>
        )}
      </div>
    );
  },
);
AuthInput.displayName = "AuthInput";
