import { Avatar, AvatarFallback, AvatarImage } from '@energyiq/ui';
import { getInitials } from '@energyiq/shared';

interface AuditLogsUserCellProps {
  user: string;
  role?: string;
}

/**
 * Actor column: avatar + name + role on two lines. Automated "System" entries have no
 * avatar or role and render as plain text.
 */
export function AuditLogsUserCell({ user, role }: AuditLogsUserCellProps) {
  if (!role) {
    return <span className="text-sm text-[#9E9E9E]">{user}</span>;
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={undefined} alt={user} />
        <AvatarFallback className="bg-[#FBC02D] text-xs text-[#121212]">
          {getInitials(user)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-[#FAFAFA]">{user}</span>
        <span className="text-xs text-[#9E9E9E]">{role}</span>
      </div>
    </div>
  );
}
