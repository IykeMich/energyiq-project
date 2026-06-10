interface ComplaintTextFieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Display-only field (e.g. the related order, resolved from the selected order). */
  readOnly?: boolean;
}

/** Labeled pill text input shared across the wizard's Issue Type and Details steps. */
export function ComplaintTextField({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
}: ComplaintTextFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm text-[#FFFFFFCC]">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className="rounded-full border border-[#FFFFFF33] bg-transparent px-5 py-3.5 text-sm text-[#FAFAFA] placeholder:text-[#FFFFFF80] read-only:cursor-default focus:border-[#FBC02D] focus:outline-none"
      />
    </label>
  );
}
