import { useState, useCallback, useRef, useEffect } from 'react';
import { type FieldValues, type Path, type Control, Controller } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '../primitives/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '../primitives/command';
import { Label } from '../primitives/label';
import { Badge } from '../primitives/badge';
import { cn } from '@energyiq/shared';

// ════════════════════════════════════════════════════════════════
// SearchableSelect — built on shadcn Command + Popover.
// Supports: API search, infinite scroll, single/multi select.
// ════════════════════════════════════════════════════════════════

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SearchableSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;

  // Static options (used when no fetchOptions provided)
  options?: SelectOption[];

  // API search — called on search input change
  fetchOptions?: (query: string, page: number) => Promise<{
    options: SelectOption[];
    hasMore: boolean;
  }>;

  // Multi-select
  multiple?: boolean;

  // Debounce for API search (ms)
  debounce?: number;
}

export function SearchableSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found',
  disabled,
  className,
  options: staticOptions,
  fetchOptions,
  multiple = false,
  debounce = 300,
}: SearchableSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [dynamicOptions, setDynamicOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  const options = fetchOptions ? dynamicOptions : (staticOptions ?? []);

  // Debounced API search
  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (!fetchOptions) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setPage(1);
      try {
        const result = await fetchOptions(value, 1);
        setDynamicOptions(result.options);
        setHasMore(result.hasMore);
      } finally {
        setIsLoading(false);
      }
    }, debounce);
  }, [fetchOptions, debounce]);

  // Infinite scroll — load more
  const loadMore = useCallback(async () => {
    if (!fetchOptions || !hasMore || isLoading) return;

    setIsLoading(true);
    const nextPage = page + 1;
    try {
      const result = await fetchOptions(query, nextPage);
      setDynamicOptions((prev) => [...prev, ...result.options]);
      setHasMore(result.hasMore);
      setPage(nextPage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchOptions, hasMore, isLoading, page, query]);

  // Scroll detection for infinite scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight - scrollTop - clientHeight < 50) {
        loadMore();
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  // Initial load for API-driven selects
  useEffect(() => {
    if (fetchOptions && open && dynamicOptions.length === 0) {
      handleSearch('');
    }
  }, [fetchOptions, open, dynamicOptions.length, handleSearch]);

  const getLabel = (value: string) => {
    return options.find((o) => o.value === value)?.label ?? value;
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const selectedValues: string[] = multiple
          ? (Array.isArray(field.value) ? field.value : [])
          : (field.value ? [field.value] : []);

        const toggleValue = (value: string) => {
          if (multiple) {
            const current = Array.isArray(field.value) ? field.value as string[] : [];
            const next = current.includes(value)
              ? current.filter((v: string) => v !== value)
              : [...current, value];
            field.onChange(next);
          } else {
            field.onChange(value);
            setOpen(false);
          }
        };

        return (
          <div className={cn('space-y-2', className)}>
            <Label htmlFor={name}>{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                disabled={disabled}
                className={cn(
                  'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none',
                  !field.value && 'text-muted-foreground',
                  error && 'border-destructive',
                )}
              >
                {multiple && selectedValues.length > 0 ? (
                  <div className="flex gap-1 flex-wrap">
                    {selectedValues.slice(0, 3).map((v) => (
                      <Badge key={v} variant="secondary" className="text-xs">
                        {getLabel(v)}
                      </Badge>
                    ))}
                    {selectedValues.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{selectedValues.length - 3}
                      </Badge>
                    )}
                  </div>
                ) : field.value ? (
                  getLabel(field.value as string)
                ) : (
                  placeholder
                )}
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command shouldFilter={!fetchOptions}>
                  <CommandInput
                    placeholder={searchPlaceholder}
                    value={query}
                    onValueChange={handleSearch}
                  />
                  <CommandList>
                    <CommandEmpty>{isLoading ? 'Loading...' : emptyMessage}</CommandEmpty>
                    <CommandGroup>
                      <div ref={scrollRef} className="max-h-60 overflow-y-auto">
                        {options.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => toggleValue(option.value)}
                          >
                            <span className={cn(
                              selectedValues.includes(option.value) && 'font-medium',
                            )}>
                              {option.label}
                            </span>
                            {option.description && (
                              <span className="text-muted-foreground text-xs ml-2">
                                {option.description}
                              </span>
                            )}
                          </CommandItem>
                        ))}
                        {isLoading && (
                          <div className="py-2 text-center text-xs text-muted-foreground">
                            Loading more...
                          </div>
                        )}
                      </div>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {error && <p className="text-destructive text-xs">{error.message}</p>}
          </div>
        );
      }}
    />
  );
}
