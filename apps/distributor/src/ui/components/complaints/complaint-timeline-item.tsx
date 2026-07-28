import { CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@energyiq/shared';
import type { AppDistributorComplaintTimelineItem } from '@energyiq/api/generated/schemas';

interface ComplaintTimelineItemProps {
  entry: AppDistributorComplaintTimelineItem;
  /** The most recent entry in the timeline; also hides the connector line below it. */
  isLast: boolean;
}

/** A single activity-timeline row: status icon + title/detail on the left, timestamp on the right. */
export function ComplaintTimelineItem({ entry, isLast }: ComplaintTimelineItemProps) {
  const Icon = isLast ? Clock : CheckCircle2;
  const accent = isLast ? '#FB8C1C' : '#388E3C';
  const detail = [entry.description, entry.actor_name].filter(Boolean).join(' — ');

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <Icon className="h-4 w-4 shrink-0" style={{ color: accent }} aria-hidden="true" />
        {!isLast && <span className="mt-1 w-px flex-1 bg-[#FFFFFF33]" aria-hidden="true" />}
      </div>
      <div className={cn('flex flex-1 flex-col gap-1', !isLast && 'pb-5')}>
        <div className="flex items-start justify-between gap-4">
          <span className="text-sm font-medium text-[#FAFAFA]">{entry.title}</span>
          <span className="shrink-0 text-xs text-[#FFFFFFCC]">{entry.activity_time_label}</span>
        </div>
        <span className="text-xs text-[#FFFFFFCC]">{detail}</span>
      </div>
    </div>
  );
}
