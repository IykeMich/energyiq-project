import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@energyiq/ui';
import type { Tank } from '../mocks';

interface RecordDipFormProps {
  tanks: Tank[];
  onSave: (data: { tankId: string; litres: number }) => void;
}

export function RecordDipForm({ tanks, onSave }: RecordDipFormProps) {
  const [tankId, setTankId] = useState<string>('');
  const [litres, setLitres] = useState<string>('');

  const canSave = tankId !== '' && Number(litres) > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ tankId, litres: Number(litres) });
  };

  return (
    <div className="bg-surface-card border border-border-strong rounded-[28px] p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-foreground">Record Today’s Dip</h3>
          <p className="text-sm text-foreground font-normal">
            Enter current stock levels from physical dip stick readings
          </p>
        </div>
        <span className="rounded-[14px] px-2.5 py-1 text-xs font-medium text-warning bg-warning/20 whitespace-nowrap">
          Manual Entry
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_auto] gap-4 items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-foreground">Tank:</label>
          <Select value={tankId} onValueChange={(v) => setTankId(v ?? '')}>
            <SelectTrigger className="bg-surface-card border-border-strong h-[46px] rounded-[28px] text-foreground px-5">
              <SelectValue placeholder="Select a tank" />
            </SelectTrigger>
            <SelectContent>
              {tanks.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-foreground">Litres:</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={litres}
            onChange={(e) => setLitres(e.target.value)}
            placeholder="0"
            className="bg-surface-card border border-border-strong h-[46px] rounded-[28px] px-5 text-foreground placeholder:text-muted-foreground outline-none focus:border-brand"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="h-[46px] rounded-[24px] bg-brand text-brand-foreground font-medium px-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </div>
  );
}
