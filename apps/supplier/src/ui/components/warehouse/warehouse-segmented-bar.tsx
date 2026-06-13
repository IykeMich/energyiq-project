import type { StockSegment } from '@/ui/pages/inventory/mocks';

/** Bar/legend colours per segment, in order (PMS green → AGO amber → LPG red). */
const SEGMENT_COLORS = ['bg-success', 'bg-warning', 'bg-danger'];

interface WarehouseSegmentedBarProps {
  segments: StockSegment[];
}

/** Multi-segment stock bar with a colour-keyed legend (e.g. PMS / AGO / LPG). */
export function WarehouseSegmentedBar({ segments }: WarehouseSegmentedBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        {segments.map((segment, index) => (
          <div
            key={segment.label}
            className={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
            style={{ width: `${segment.percent}%` }}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {segments.map((segment, index) => (
          <div key={segment.label} className="flex items-center gap-2">
            <span className={`h-3.5 w-1 rounded-full ${SEGMENT_COLORS[index % SEGMENT_COLORS.length]}`} />
            <span className="text-sm text-muted-foreground">
              {segment.label}: <span className="font-semibold text-foreground">{segment.percent}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
