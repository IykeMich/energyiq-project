import { Search } from 'lucide-react';

interface TankSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function TankSearchBar({
  searchQuery,
  onSearchChange,
}: TankSearchBarProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[#2D2D2D] bg-[#1A1A1A] px-4 py-3">
      <Search size={18} className="text-[#FFFFFF80]" />

      <input
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search..."
        className="w-full bg-transparent text-white placeholder:text-[#FFFFFF80] focus:outline-none"
      />
    </div>
  );
}