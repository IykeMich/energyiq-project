import { ArrowUpRight } from 'lucide-react';
import { cn } from '@energyiq/shared';

interface SectionHeaderProps {
  title: string;
  actionLink?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function SectionHeader({ title, actionLink, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 bg-[#FBC02D] rounded" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {actionLink &&
        (actionLink.href ? (
          <a
            href={actionLink.href}
            className="text-sm text-[#FBC02D] hover:underline flex items-center gap-1 font-light"
          >
            {actionLink.label}
            <ArrowUpRight className="w-4 h-4" />
          </a>
        ) : (
          <button
            type="button"
            onClick={actionLink.onClick}
            className="text-sm text-[#FBC02D] hover:underline flex items-center gap-1 font-light"
          >
            {actionLink.label}
            <ArrowUpRight className="w-4 h-4" />
          </button>
        ))}
    </div>
  );
}
