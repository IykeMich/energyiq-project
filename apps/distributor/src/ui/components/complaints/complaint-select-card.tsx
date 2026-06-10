import { Check } from 'lucide-react';
import { cn } from '@energyiq/shared';
import type { ComplaintOption } from './complaints-mocks';

interface ComplaintSelectCardProps {
  option: ComplaintOption;
  selected: boolean;
  onSelect: (value: string) => void;
}

/**
 * Selectable card used by the issue-type grid and the preferred-resolution picker.
 * Active state: gold border + gold-tinted fill + a gold check in the top-right.
 */
export function ComplaintSelectCard({ option, selected, onSelect }: ComplaintSelectCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      aria-pressed={selected}
      className={cn(
        'tap-effect relative flex flex-col items-start gap-1 rounded-2xl border px-5 py-4 text-left',
        selected ? 'border-[#FBC02D] bg-[#FBC02D1A]' : 'border-[#FFFFFF33] bg-transparent',
      )}
    >
      <span className="text-sm font-semibold text-[#FAFAFA]">{option.label}</span>
      {option.description && (
        <span className="text-xs text-[#FFFFFFCC]">{option.description}</span>
      )}
      {selected && (
        <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-md bg-[#FBC02D] text-[#121212]">
          <Check className="h-3 w-3" aria-hidden="true" />
        </span>
      )}
    </button>
  );
}
