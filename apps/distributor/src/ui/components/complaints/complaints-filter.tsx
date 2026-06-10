import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@energyiq/ui';
import { COMPLAINT_STATUS_FILTERS, type ComplaintStatus } from './complaints-mocks';

interface ComplaintsFilterProps {
  status: ComplaintStatus | 'All';
  onStatusChange: (status: ComplaintStatus | 'All') => void;
}

/** "Filter By:" label followed by the Status dropdown chip. */
export function ComplaintsFilter({ status, onStatusChange }: ComplaintsFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#616161B2]">
        <SlidersHorizontal className="h-3.5 w-3.5 text-white" aria-hidden="true" />
      </span>
      <span className="text-xs text-white">Filter By:</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="tap-effect flex items-center gap-1 rounded-[14px] border-[1.5px] border-[#616161B2] px-3 py-1 text-xs text-white"
          >
            {status === 'All' ? 'Status' : status}
            <ChevronDown className="h-3.5 w-3.5 text-[#FBC02D]" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[160px]">
          {COMPLAINT_STATUS_FILTERS.map((option) => (
            <DropdownMenuItem
              key={option}
              onSelect={() => onStatusChange(option)}
              className={option === status ? 'text-[#FBC02D]' : undefined}
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
