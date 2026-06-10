import { X } from 'lucide-react';

interface ComplaintCloseButtonProps {
  onClick: () => void;
}

/** Gold filled circular close button used by the detail sheet and the wizard header. */
export function ComplaintCloseButton({ onClick }: ComplaintCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className="tap-effect flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FBC02D] text-[#121212]"
    >
      <X className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
