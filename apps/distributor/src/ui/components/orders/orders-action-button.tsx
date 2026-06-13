import type { LucideIcon } from 'lucide-react';

interface OrdersActionButtonProps {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
}

/** Gold pill action button shared by "New Order" and "Invite Distributor". */
export function OrdersActionButton({ label, icon: Icon, onClick }: OrdersActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="tap-effect inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#FBC02D] px-6 py-3 text-base font-semibold text-[#121212]"
    >
      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
      {label}
    </button>
  );
}
