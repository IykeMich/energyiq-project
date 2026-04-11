interface SubmitButtonProps {
  isLoading: boolean;
  label: string;
  loadingLabel: string;
  disabled?: boolean;
}

export function SubmitButton({ isLoading, label, loadingLabel, disabled }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className="w-full bg-[#1E3A5F] text-white py-3 rounded-lg font-medium hover:bg-[#162d4a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? loadingLabel : label}
    </button>
  );
}
