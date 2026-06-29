import { Search } from 'lucide-react';

interface ExpensesSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ExpensesSearchBar({
  searchQuery,
  onSearchChange,
}: ExpensesSearchBarProps) {
  return (
    <div className="flex w-full items-center gap-3 rounded-full bg-[#6161611A] px-5 py-4 `lg:max-w-[350px]">
      <Search
        className="h-5 w-5 text-[#FFFFFFCC]"
      />

      <input
        type="search"
        value={searchQuery}
        onChange={(e) =>
          onSearchChange(e.target.value)
        }
        placeholder="Search expenses..."
        className="w-full bg-transparent text-[#FAFAFA] placeholder:text-[#FFFFFF80] focus:outline-none"
      />
    </div>
  );
}