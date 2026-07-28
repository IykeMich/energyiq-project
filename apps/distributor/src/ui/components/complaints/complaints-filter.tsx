import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@energyiq/ui';
import type { AppDistributorComplaintFilterOption } from '@energyiq/api/generated/schemas';
import { ALL_STATUSES } from './complaints-mocks';

interface ComplaintsFilterProps {
  status: string | typeof ALL_STATUSES;
  onStatusChange: (status: string | typeof ALL_STATUSES) => void;
  /** `distributor_complaint_status_filter_options` from the dashboard endpoint. */
  options: AppDistributorComplaintFilterOption[];
}

/** "Filter By:" label followed by the Status dropdown chip. */
export function ComplaintsFilter({ status, onStatusChange, options }: ComplaintsFilterProps) {
  const selectedLabel =
    status === ALL_STATUSES
      ? 'Status'
      : (options.find((option) => option.value === status)?.label ?? status);

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
            {selectedLabel}
            <ChevronDown className="h-3.5 w-3.5 text-[#FBC02D]" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[160px]">
          <DropdownMenuItem
            onSelect={() => onStatusChange(ALL_STATUSES)}
            className={status === ALL_STATUSES ? 'text-[#FBC02D]' : undefined}
          >
            All
          </DropdownMenuItem>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => onStatusChange(option.value ?? ALL_STATUSES)}
              className={option.value === status ? 'text-[#FBC02D]' : undefined}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
