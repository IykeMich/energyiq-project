import { cn } from '@energyiq/shared';
import type { ComplaintTimelineEvent } from '@/ui/pages/complaint/mocks';

interface ComplaintTimelineProps {
  events: ComplaintTimelineEvent[];
}

/** Marker dot for a timeline row: a gold ring when highlighted, a muted filled dot otherwise. */
function TimelineMarker({ highlight }: { highlight: boolean }) {
  if (highlight) {
    return (
      <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#FBC02D]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#FBC02D]" />
      </span>
    );
  }
  return <span className="h-3 w-3 rounded-full bg-[#616161]" />;
}

/** Vertical activity timeline rendered under the SLA banner on the Timeline tab. */
export function ComplaintTimeline({ events }: ComplaintTimelineProps) {
  return (
    <ol className="flex flex-1 flex-col">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        return (
          <li key={`${event.timestamp}-${index}`} className="flex gap-4">
            <div className="flex flex-col items-center pt-1">
              <TimelineMarker highlight={event.highlight} />
              {!isLast && <div className="min-h-[40px] w-px flex-1 bg-[#616161B2]" />}
            </div>
            <div className={cn('flex flex-col gap-1 pb-6', isLast && 'pb-0')}>
              <p className="text-xs text-[#FAFAFA]">{event.timestamp}</p>
              <p className="text-sm text-[#FAFAFA]">{event.title}</p>
              {event.quote && <p className="text-xs text-[#FFFFFF99]">{event.quote}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
