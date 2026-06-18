import type { Pump } from './types';
import { PumpStatCard } from './pump-stat-card';

interface Props {
  pumps: Pump[];
}

export function PumpStatsTracker({
  pumps,
}: Props) {
  const active =
    pumps.filter(
      (pump) => pump.status === 'active',
    ).length;

  const inactive =
    pumps.filter(
      (pump) =>
        pump.status === 'inactive',
    ).length;

  const faulty =
    pumps.filter(
      (pump) => pump.status === 'faulty',
    ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <PumpStatCard
        title="Total Pumps"
        value={pumps.length}
      />

      <PumpStatCard
        title="Active Pumps"
        value={active}
      />

      <PumpStatCard
        title="Inactive Pumps"
        value={inactive}
      />

      <PumpStatCard
        title="Faulty Pumps"
        value={faulty}
      />
    </div>
  );
}