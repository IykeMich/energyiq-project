import { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Modal } from '@energyiq/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@energyiq/ui';

export interface SavedReportTemplate {
  name: string;
  description: string;
  metrics: string[];
  schedule: string;
}

interface SaveTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metrics: string[];
  defaultName?: string;
  defaultDescription?: string;
  onSave: (template: SavedReportTemplate) => void;
}

const SCHEDULE_OPTIONS = [
  { value: 'No Schedule', label: 'No Schedule' },
  { value: 'Hourly', label: 'Hourly' },
  { value: 'Daily', label: 'Daily' },
  { value: 'Weekly (Mon)', label: 'Weekly (Mon)' },
  { value: 'Monthly (1st)', label: 'Monthly (1st)' },
  { value: 'Quarterly', label: 'Quarterly' },
];

export function SaveTemplateModal({
  open,
  onOpenChange,
  metrics,
  defaultName = '',
  defaultDescription = '',
  onSave,
}: SaveTemplateModalProps) {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);
  const [schedule, setSchedule] = useState(SCHEDULE_OPTIONS[0].value);

  const handleSave = () => {
    onSave({
      name: name.trim() || 'Untitled Report',
      description: description.trim(),
      metrics,
      schedule,
    });
    setName('');
    setDescription('');
    setSchedule(SCHEDULE_OPTIONS[0].value);
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="sm" showClose={false}>
      <div className="flex flex-col gap-6">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Back"
              className="tap-effect flex h-8 w-8 items-center justify-center rounded-full bg-[#FBC02D] text-[#121212]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <h2 className="text-xl font-semibold text-[#FAFAFA]">Save Report Template</h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="tap-effect flex h-8 w-8 items-center justify-center rounded-full bg-[#FBC02D] text-[#121212]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#FAFAFA]">Template Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Monthly Sales Summary"
              className="h-11 rounded-xl border border-[#616161B2] bg-[#FFFFFF1A] px-4 text-sm text-[#FAFAFA] placeholder:text-[#9E9E9E] outline-none focus:border-[#FBC02D]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#FAFAFA]">Description (Optional):</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a short description..."
              rows={3}
              className="rounded-xl border border-[#616161B2] bg-[#FFFFFF1A] p-4 text-sm text-[#FAFAFA] placeholder:text-[#9E9E9E] outline-none focus:border-[#FBC02D] resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[#FAFAFA]">Saved Metrics</span>
            <div className="flex flex-wrap gap-2">
              {metrics.length > 0 ? (
                metrics.map((metric) => (
                  <span
                    key={metric}
                    className="rounded-full border border-[#FBC02D]/30 bg-[#FBC02D]/10 px-3 py-1 text-xs text-[#FBC02D]"
                  >
                    {metric}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#9E9E9E]">No metrics selected</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#FAFAFA]">Schedule Automation:</label>
            <Select value={schedule} onValueChange={(value) => value && setSchedule(value)}>
              <SelectTrigger className="h-11 rounded-xl border-[#616161B2] bg-[#FFFFFF1A] text-[#FAFAFA]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCHEDULE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="tap-effect h-11 rounded-full bg-[#FFFFFF1A] px-6 text-sm font-semibold text-[#FAFAFA]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="tap-effect h-11 rounded-full bg-[#FBC02D] px-8 text-sm font-semibold text-[#121212]"
          >
            Save Template
          </button>
        </div>
      </div>
    </Modal>
  );
}
