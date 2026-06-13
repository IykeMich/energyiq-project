import { CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@energyiq/shared';
import type { ComplaintTimelineEntry } from './complaints-mocks';

interface ComplaintTimelineItemProps {
  entry: ComplaintTimelineEntry;
  /** Hides the connector line below the last entry. */
  isLast: boolean;
}

/** A single activity-timeline row: status icon + title/detail on the left, timestamp on the right. */
export function ComplaintTimelineItem({ entry, isLast }: ComplaintTimelineItemProps) {
  const isDone = entry.state === 'done';
  const Icon = isDone ? CheckCircle2 : Clock;
  const accent = isDone ? '#388E3C' : '#FB8C1C';

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <Icon className="h-4 w-4 shrink-0" style={{ color: accent }} aria-hidden="true" />
        {!isLast && <span className="mt-1 w-px flex-1 bg-[#FFFFFF33]" aria-hidden="true" />}
      </div>
      <div className={cn('flex flex-1 flex-col gap-1', !isLast && 'pb-5')}>
        <div className="flex items-start justify-between gap-4">
          <span className="text-sm font-medium text-[#FAFAFA]">{entry.title}</span>
          <span className="shrink-0 text-xs text-[#FFFFFFCC]">{entry.timestamp}</span>
        </div>
        <span className="text-xs text-[#FFFFFFCC]">{entry.detail}</span>
      </div>
    </div>
  );
}
