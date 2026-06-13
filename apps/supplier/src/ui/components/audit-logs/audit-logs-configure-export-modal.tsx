import { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Modal } from '@energyiq/ui';
import { AuditLogsCheckbox } from './audit-logs-checkbox';
import { AuditLogsFormSelect } from './audit-logs-form-select';
import {
  EXPORT_COLUMN_OPTIONS,
  EXPORT_DATE_RANGES,
  EXPORT_EVENT_TOGGLES,
  EXPORT_FILE_FORMATS,
} from './audit-logs-mocks';
import type { AuditExportConfig } from './audit-logs-mocks';

interface AuditLogsConfigureExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (config: AuditExportConfig) => void;
}

/** All event toggles are on by default, matching the design. */
const ALL_EVENT_IDS = EXPORT_EVENT_TOGGLES.map((toggle) => toggle.id);

/**
 * "Configure Export" form modal for the audit log. Uses `Modal` as a chrome-less shell so
 * the header can carry a back arrow, subtitle and close button, then collects the date
 * range, event types, file format and columns before kicking off the export.
 */
export function AuditLogsConfigureExportModal({
  open,
  onOpenChange,
  onGenerate,
}: AuditLogsConfigureExportModalProps) {
  const [dateRange, setDateRange] = useState(EXPORT_DATE_RANGES[0].value);
  const [fileFormat, setFileFormat] = useState(EXPORT_FILE_FORMATS[0].value);
  const [columns, setColumns] = useState(EXPORT_COLUMN_OPTIONS[0].value);
  const [events, setEvents] = useState<Set<string>>(() => new Set(ALL_EVENT_IDS));

  const toggleEvent = (eventId: string) => {
    setEvents((previous) => {
      const next = new Set(previous);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  };

  const handleGenerate = () => {
    onGenerate({ dateRange, events: [...events], fileFormat, columns });
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
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-[#FAFAFA]">Configure Export</h2>
              <span className="text-xs text-[#9E9E9E]">
                Choose what to include in your audit log export.
              </span>
            </div>
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

        <AuditLogsFormSelect
          label="Date Range:"
          value={dateRange}
          onValueChange={setDateRange}
          options={EXPORT_DATE_RANGES}
        />

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-[#FAFAFA]">Events</span>
          <div className="flex flex-col gap-3">
            {EXPORT_EVENT_TOGGLES.map((toggle) => (
              <label key={toggle.id} className="flex items-center gap-3 text-sm text-[#FAFAFA]">
                <AuditLogsCheckbox
                  checked={events.has(toggle.id)}
                  onChange={() => toggleEvent(toggle.id)}
                  aria-label={toggle.label}
                />
                {toggle.label}
              </label>
            ))}
          </div>
        </div>

        <AuditLogsFormSelect
          label="File Format:"
          value={fileFormat}
          onValueChange={setFileFormat}
          options={EXPORT_FILE_FORMATS}
        />

        <AuditLogsFormSelect
          label="Include columns:"
          value={columns}
          onValueChange={setColumns}
          options={EXPORT_COLUMN_OPTIONS}
        />

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
            onClick={handleGenerate}
            className="tap-effect h-11 rounded-full bg-[#FBC02D] px-8 text-sm font-semibold text-[#121212]"
          >
            Generate Export
          </button>
        </div>
      </div>
    </Modal>
  );
}
