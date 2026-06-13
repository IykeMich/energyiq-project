import { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Modal } from '@energyiq/ui';
import { SalesEntryCheckbox } from './sales-entry-checkbox';
import { SalesEntryFormSelect } from './sales-entry-form-select';
import {
  EXPORT_COLUMNS,
  EXPORT_FORMATS,
  EXPORT_GROUP_BY,
} from './sales-entry-mocks';
import type { SalesExportConfig } from './sales-entry-mocks';

interface SalesEntryConfigureExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (config: SalesExportConfig) => void;
}

/** All export columns are selected by default, matching the design. */
const ALL_COLUMN_IDS = EXPORT_COLUMNS.map((column) => column.id);

/**
 * "Configure Export" form modal. Uses `Modal` as a chrome-less shell so the header can
 * carry a back arrow, subtitle and a close button, then collects the file format, the
 * columns to include and the grouping before kicking off the export.
 */
export function SalesEntryConfigureExportModal({
  open,
  onOpenChange,
  onGenerate,
}: SalesEntryConfigureExportModalProps) {
  const [format, setFormat] = useState(EXPORT_FORMATS[0].value);
  const [groupBy, setGroupBy] = useState(EXPORT_GROUP_BY[0].value);
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(
    () => new Set(ALL_COLUMN_IDS),
  );

  const toggleColumn = (columnId: string) => {
    setSelectedColumns((previous) => {
      const next = new Set(previous);
      if (next.has(columnId)) {
        next.delete(columnId);
      } else {
        next.add(columnId);
      }
      return next;
    });
  };

  const handleGenerate = () => {
    onGenerate({ format, columns: [...selectedColumns], groupBy });
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
              <span className="text-xs text-[#9E9E9E]">Customise your sales report export.</span>
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

        <SalesEntryFormSelect
          label="File Format:"
          value={format}
          onValueChange={setFormat}
          options={EXPORT_FORMATS}
        />

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-[#FAFAFA]">Columns to include:</span>
          <div className="flex flex-col gap-3">
            {EXPORT_COLUMNS.map((column) => (
              <label key={column.id} className="flex items-center gap-3 text-sm text-[#FAFAFA]">
                <SalesEntryCheckbox
                  checked={selectedColumns.has(column.id)}
                  onChange={() => toggleColumn(column.id)}
                  aria-label={column.label}
                />
                {column.label}
              </label>
            ))}
          </div>
        </div>

        <SalesEntryFormSelect
          label="Group by:"
          value={groupBy}
          onValueChange={setGroupBy}
          options={EXPORT_GROUP_BY}
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
