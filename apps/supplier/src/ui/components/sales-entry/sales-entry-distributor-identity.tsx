import { Avatar, AvatarFallback, AvatarImage } from '@energyiq/ui';
import { getInitials } from '@energyiq/shared';

interface SalesEntryDistributorIdentityProps {
  name: string;
  /** e.g. "Enugu · Gold tier". */
  location: string;
  onViewProfile: () => void;
}

/** Avatar + name + location/tier, with a "View Distributor Profile" action on the right. */
export function SalesEntryDistributorIdentity({
  name,
  location,
  onViewProfile,
}: SalesEntryDistributorIdentityProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={undefined} alt={name} />
          <AvatarFallback className="bg-[#FBC02D] text-xs text-[#121212]">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#FAFAFA]">{name}</span>
          <span className="text-xs text-[#9E9E9E]">{location}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onViewProfile}
        className="tap-effect h-9 rounded-full bg-[#FBC02D] px-4 text-xs font-semibold text-[#121212]"
      >
        View Distributor Profile
      </button>
    </div>
  );
}
