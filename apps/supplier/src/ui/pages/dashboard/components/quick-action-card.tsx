import type { ComponentType, SVGProps } from 'react';
import { cn } from '@energyiq/shared';

interface DashboardQuickActionCardProps {
  title: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  className?: string;
}

export function DashboardQuickActionCard({ title, Icon, onClick, className }: DashboardQuickActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'tap-effect bg-[#FFFFFF1A] rounded-lg py-4 px-4 gap-1 flex flex-col items-center justify-center text-white',
        className,
      )}
    >
      <Icon className="w-6 h-6" aria-hidden="true" />
      <p className="text-sm font-normal">{title}</p>
    </button>
  );
}
