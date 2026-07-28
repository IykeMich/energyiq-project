import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@energyiq/ui';
import type { ComplaintOption } from './complaints-mocks';

interface ComplaintOrderSelectProps {
  options: ComplaintOption[];
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

/**
 * Searchable order picker for the "Related Order" field. Filters client-side
 * (cmdk's built-in filter) since `/v1/distributor/order/list` has no `search` param.
 */
export function ComplaintOrderSelect({
  options,
  value,
  onChange,
  isLoading,
  placeholder = 'Select an order',
}: ComplaintOrderSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="tap-effect flex w-full items-center justify-between gap-2 rounded-full border border-[#FFFFFF33] bg-transparent px-5 py-3.5 text-left text-sm text-[#FAFAFA] focus:border-[#FBC02D] focus:outline-none"
      >
        <span className={selected ? undefined : 'text-[#FFFFFF80]'}>
          {selected ? selected.label : isLoading ? 'Loading orders…' : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-[#FBC02D]" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search orders…" />
          <CommandList>
            <CommandEmpty>{isLoading ? 'Loading…' : 'No orders found'}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={`${option.label} ${option.description ?? ''}`}
                  data-checked={option.value === value}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
