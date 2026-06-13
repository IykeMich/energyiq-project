import { Avatar, AvatarFallback, AvatarImage } from '@energyiq/ui';
import { getInitials } from '@energyiq/shared';
import { cn } from '@energyiq/shared';
import type { ComplaintThreadMessage as ThreadMessage } from '@/ui/pages/complaint/mocks';

interface ComplaintThreadMessageProps {
  message: ThreadMessage;
}

/** A single conversation entry — distributor messages sit left, supplier replies right. */
export function ComplaintThreadMessage({ message }: ComplaintThreadMessageProps) {
  const isSupplier = message.author === 'supplier';
  const trailingMeta = [...message.meta, message.timestamp].join(' . ');

  return (
    <div className={cn('flex flex-col gap-1.5', isSupplier ? 'items-end' : 'items-start')}>
      <div className={cn('flex items-center gap-2', isSupplier && 'flex-row-reverse')}>
        <Avatar className="h-6 w-6">
          <AvatarImage src={undefined} alt={message.name} />
          <AvatarFallback className="bg-[#FBC02D] text-[10px] text-[#121212]">
            {getInitials(message.name)}
          </AvatarFallback>
        </Avatar>
        <p className="text-xs text-[#FFFFFFCC]">
          <span className="font-semibold text-[#FAFAFA]">{message.name}</span> . {trailingMeta}
        </p>
      </div>
      <p
        className={cn(
          'max-w-[80%] rounded-2xl border px-4 py-3 text-xs leading-relaxed text-[#FAFAFA]',
          isSupplier
            ? 'border-[#FBC02D] bg-[#FBC02D14]'
            : 'border-[#616161B2] bg-transparent',
        )}
      >
        {message.body}
      </p>
    </div>
  );
}
