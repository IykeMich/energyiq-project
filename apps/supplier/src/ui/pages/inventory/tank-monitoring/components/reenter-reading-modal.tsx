import { useEffect, useState } from 'react';
import { Modal, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@energyiq/ui';
import type { Tank } from '../mocks';

interface ReenterReadingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tanks: Tank[];
  defaultTankId?: string;
  onSave: (data: { tankId: string; litres: number }) => void;
}

export function ReenterReadingModal({
  open,
  onOpenChange,
  tanks,
  defaultTankId,
  onSave,
}: ReenterReadingModalProps) {
  const [tankId, setTankId] = useState<string>(defaultTankId ?? '');
  const [litres, setLitres] = useState<string>('');

  useEffect(() => {
    if (open) {
      setTankId(defaultTankId ?? '');
      setLitres('');
    }
  }, [open, defaultTankId]);

  const canSave = tankId !== '' && Number(litres) > 0;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Re-enter reading"
      onBack={() => onOpenChange(false)}
      size="lg"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-[#FAFAFA]">Tank:</label>
          <Select value={tankId} onValueChange={(v) => setTankId(v ?? '')}>
            <SelectTrigger className="bg-[#6161611A] border-[#9E9E9E] h-[52px] rounded-[12px] text-[#FAFAFA] px-5">
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

        <div className="flex flex-col gap-2">
          <label className="text-sm text-[#FAFAFA]">Litres:</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={litres}
            onChange={(e) => setLitres(e.target.value)}
            placeholder="Enter new reading"
            className="bg-[#6161611A] border border-[#9E9E9E] h-[52px] rounded-[12px] px-5 text-[#FAFAFA] placeholder:text-[#9E9E9E] outline-none focus:border-[#FBC02D]"
          />
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={() => canSave && onSave({ tankId, litres: Number(litres) })}
            disabled={!canSave}
            className="h-[53px] rounded-[28px] bg-[#FBC02D] text-[#121212] font-semibold px-12 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
