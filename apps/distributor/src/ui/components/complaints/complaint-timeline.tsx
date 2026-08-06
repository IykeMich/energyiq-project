import type { DistributorComplaintTimelineItem as AppDistributorComplaintTimelineItem } from '@energyiq/api/generated/schemas';
import { ComplaintTimelineItem } from './complaint-timeline-item';

interface ComplaintTimelineProps {
  entries: AppDistributorComplaintTimelineItem[];
}

/** "Activity Timeline" list in the complaint detail sheet. */
export function ComplaintTimeline({ entries }: ComplaintTimelineProps) {
  return (
    <div className="flex flex-col">
      {entries.map((entry, index) => (
        <ComplaintTimelineItem
          key={`${entry.event_code}-${entry.activity_time}`}
          entry={entry}
          isLast={index === entries.length - 1}
        />
      ))}
    </div>
  );
}
