import { useEffect, useState } from 'react';
import { CalendarPlus, Clock } from 'lucide-react';
import { Modal } from '@energyiq/ui';

interface ScheduleActivationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (data: { date: string; time: string }) => void;
}

export function ScheduleActivationModal({
  open,
  onOpenChange,
  onSchedule,
}: ScheduleActivationModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (open) {
      setDate('');
      setTime('');
    }
  }, [open]);

  const canSchedule = date.trim().length > 0 && time.trim().length > 0;

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Schedule Activation" size="lg">
      <p className="text-sm text-foreground mb-5">
        Set the date and time when this product will become available to distributors
      </p>

      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm text-foreground">Activation Date:</label>
        <div className="relative">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-surface-card border border-border-strong h-[52px] rounded-full px-5 pr-12 w-full text-foreground placeholder:text-muted-foreground outline-none focus:border-brand"
          />
          <CalendarPlus className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <label className="text-sm text-foreground">Activation Time:</label>
        <div className="relative">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-surface-card border border-border-strong h-[52px] rounded-full px-5 pr-12 w-full text-foreground placeholder:text-muted-foreground outline-none focus:border-brand"
          />
          <Clock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => canSchedule && onSchedule({ date, time })}
          disabled={!canSchedule}
          className="h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold px-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Schedule Activation
        </button>
      </div>
    </Modal>
  );
}
