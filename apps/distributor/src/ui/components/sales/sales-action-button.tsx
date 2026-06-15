import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function SalesActionButton({
  label,
  icon: Icon,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        tap-effect
        inline-flex
        items-center
        gap-2
        rounded-full
        bg-[#FBC02D]
        px-4
        py-3
        text-sm
        font-medium
        text-black
      "
    >
      <Icon className="h-4 w-4" />

      {label}
    </button>
  );
}