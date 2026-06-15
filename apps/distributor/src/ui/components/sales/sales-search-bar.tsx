import { Search } from 'lucide-react';

interface SalesSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function SalesSearchBar({
  searchQuery,
  onSearchChange,
}: SalesSearchBarProps) {
  return (
    <div className="flex w-full items-center gap-3 rounded-full bg-[#6161611A] px-5 py-4 lg:max-w-[350px]">
      <Search
        className="h-5 w-5 shrink-0 text-[#FFFFFFCC]"
        aria-hidden="true"
      />

      <input
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search Complaint ID..."
        className="w-full bg-transparent text-base text-[#FAFAFA] placeholder:text-[#FFFFFFCC] focus:outline-none"
      />
    </div>
  );
}