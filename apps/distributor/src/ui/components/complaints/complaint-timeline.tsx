import { ComplaintTimelineItem } from './complaint-timeline-item';
import type { ComplaintTimelineEntry } from './complaints-mocks';

interface ComplaintTimelineProps {
  entries: ComplaintTimelineEntry[];
}

/** "Activity Timeline" list in the complaint detail sheet. */
export function ComplaintTimeline({ entries }: ComplaintTimelineProps) {
  return (
    <div className="flex flex-col">
      {entries.map((entry, index) => (
        <ComplaintTimelineItem
          key={`${entry.title}-${entry.timestamp}`}
          entry={entry}
          isLast={index === entries.length - 1}
        />
      ))}
    </div>
  );
}
