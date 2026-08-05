import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@energyiq/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../primitives/select";

interface AuthSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
}

export function AuthSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select...",
  options,
  disabled,
  className,
  containerClassName,
}: AuthSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className={containerClassName}>
          <label htmlFor={name} className="block text-lg font-medium text-[#FAFAFA] mb-2">
            {label}
          </label>
          <Select
            value={field.value as string}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              className={cn(
                "w-full h-17.5 data-[size=default]:h-17.5 rounded-full bg-[#6161611A] px-8 text-lg font-medium text-white placeholder:text-[#616161B2] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FBC02D] data-placeholder:text-[#616161B2]",
                className,
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-[#181818] border border-[#2D2D2D] text-white">
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="focus:bg-[#FBC02D] focus:text-[#121212] data-[selected]:text-[#FBC02D]"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && (
            <p className="text-red-500 text-xs mt-1 ml-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}
