import { Search } from 'lucide-react';

interface TeamPermissionsSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

/** Top-of-page employee search pill. */
export function TeamPermissionsSearchBar({
  searchQuery,
  onSearchChange,
}: TeamPermissionsSearchBarProps) {
  return (
    <div className="flex w-full items-center gap-3 rounded-full bg-[#6161611A] px-5 py-4 lg:max-w-[350px]">
      <Search className="h-5 w-5 shrink-0 text-[#FFFFFFCC]" aria-hidden="true" />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search employee, email, ....."
        className="w-full bg-transparent text-base text-[#FAFAFA] placeholder:text-[#FFFFFFCC] focus:outline-none"
      />
    </div>
  );
}
