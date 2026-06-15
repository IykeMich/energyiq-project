import {
  TANKS_MOCK,
} from './tank-mock';
import { TankLevelCard } from './tank-level-card';

interface Props {
  onVarianceClick: () => void;
}

export function TankLevelList({
  onVarianceClick,
}: Props) {
  return (
    <div className="space-y-4">
      {TANKS_MOCK.map((tank) => (
        <TankLevelCard
          key={tank.id}
          tank={tank}
          onVarianceClick={
            onVarianceClick
          }
        />
      ))}
    </div>
  );
}