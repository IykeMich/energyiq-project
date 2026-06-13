import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@energyiq/shared';

interface CreateOrderCardProps {
  title: string;
  subtitle: string;
  /** Gold badge icon shown beside the title. */
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}

/**
 * Shared panel chrome for the left-column sections (Order Information, Products,
 * Delivery Method): the dark rounded card, a gold icon badge + title + subtitle
 * header, and a divider above the section content.
 */
export function CreateOrderCard({
  title,
  subtitle,
  icon: Icon,
  children,
  className,
}: CreateOrderCardProps) {
  return (
    <section className={cn('flex flex-col gap-6 rounded-[18px] bg-[#6161611A] p-8', className)}>
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FBC02D] text-[#121212]">
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>
          <p className="text-sm text-[#FFFFFFCC]">{subtitle}</p>
        </header>
        <div className="h-px w-full bg-[#FFFFFF1A]" />
      </div>
      {children}
    </section>
  );
}
