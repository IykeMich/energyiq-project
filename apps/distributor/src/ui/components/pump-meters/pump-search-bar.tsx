import { Search } from 'lucide-react';

interface Props {
  searchQuery: string;
  onSearchChange: (
    value: string,
  ) => void;
}

export function PumpSearchBar({
  searchQuery,
  onSearchChange,
}: Props) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" />

      <input
        value={searchQuery}
        onChange={(e) =>
          onSearchChange(
            e.target.value,
          )
        }
        placeholder="Search pumps..."
        className="h-11 w-full rounded-xl border border-[#2A2A2A] bg-[#161616] pl-10 pr-4 text-sm text-white placeholder:text-[#737373] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
      />
    </div>
  );
}