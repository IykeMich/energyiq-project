import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { CircleChevronDown, SlidersHorizontal } from 'lucide-react';
import { cn } from '@energyiq/shared';
import { DropdownMenuContent, DropdownMenuItem } from '@energyiq/ui';

/**
 * Shared "Filter By:" bar shell + trigger/menu-item primitives, extracted from the
 * Product List filter bar so every table filter in the app shares one visual language.
 */
export function FilterBarContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'self-start inline-flex flex-wrap items-center gap-2 bg-[#6161611A] px-[19px] py-[9px] rounded-[15px]!',
        className,
      )}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-foreground mr-2">
        <span className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center">
          <SlidersHorizontal className="w-3.5 h-3.5 text-foreground" />
        </span>
        Filter By:
      </div>
      {children}
    </div>
  );
}

// `asChild` on DropdownMenuTrigger clones this element and merges its own onClick/onPointerDown/
// aria-*/ref props onto it — must forward them all to the underlying <button>, or the trigger never
// actually opens the dropdown.
export const FilterTrigger = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { label: string; isActive: boolean }
>(({ label, isActive, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'tap-effect h-7 px-3 rounded-[14px] text-xs font-normal flex items-center gap-1 transition-colors',
        isActive
          ? 'bg-brand text-brand-foreground hover:opacity-90'
          : 'border-[1.5px] border-[#616161B2] text-foreground hover:bg-foreground/10',
        className,
      )}
      {...props}
    >
      {label}
      <CircleChevronDown className={cn('w-3 h-3', isActive ? 'text-brand-foreground' : 'text-brand')} />
    </button>
  );
});
FilterTrigger.displayName = 'FilterTrigger';

export function FilterMenuItem({
  isSelected,
  children,
  onClick,
}: {
  isSelected: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className={cn(
        'rounded-none px-3 py-1.5 text-[10px] font-medium',
        isSelected
          ? 'bg-brand text-brand-foreground focus:bg-brand focus:text-brand-foreground'
          : 'text-[#FAFAFA] focus:bg-foreground/10 focus:text-foreground',
      )}
    >
      {children}
    </DropdownMenuItem>
  );
}

export const FILTER_MENU_CONTENT_CLASSNAME =
  'bg-[#212121] border-none rounded-[8px] p-0 shadow-lg overflow-hidden';

/** Pre-classed `DropdownMenuContent` for filter dropdowns — pass children (`FilterMenuItem`s). */
export function FilterMenuContent({ children }: { children: ReactNode }) {
  return (
    <DropdownMenuContent align="start" className={FILTER_MENU_CONTENT_CLASSNAME}>
      {children}
    </DropdownMenuContent>
  );
}
