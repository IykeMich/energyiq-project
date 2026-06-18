import type { Pump } from './types';
import { PumpCard } from './pump-card';

interface Props {
  pumps: Pump[];
}

export function PumpCardsGrid({
  pumps,
}: Props) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {pumps.map((pump) => (
        <PumpCard
          key={pump.id}
          pump={pump}
        />
      ))}
    </div>
  );
}