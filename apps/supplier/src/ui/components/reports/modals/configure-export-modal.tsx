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

export interface ExportConfig {
  fileFormat: string;
  dateRange: string;
  includeCharts: boolean;
  includeKpiSummary: boolean;
  emailWhenReady: boolean;
}

interface ConfigureExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportName: string;
  onExport: (config: ExportConfig) => void;
}

const FILE_FORMATS = [
  { value: 'PDF (.pdf)', label: 'PDF (.pdf)' },
  { value: 'CSV (.csv)', label: 'CSV (.csv)' },
  { value: 'Excel (.xlsx)', label: 'Excel (.xlsx)' },
];

const DATE_RANGES = [
  { value: 'Last 7 Days', label: 'Last 7 Days' },
  { value: 'Last 30 Days', label: 'Last 30 Days' },
  { value: 'Last Quarter', label: 'Last Quarter' },
  { value: 'Custom Range', label: 'Custom Range' },
];

export function ConfigureExportModal({
  open,
  onOpenChange,
  reportName,
  onExport,
}: ConfigureExportModalProps) {
  const [fileFormat, setFileFormat] = useState(FILE_FORMATS[0].value);
  const [dateRange, setDateRange] = useState(DATE_RANGES[0].value);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeKpiSummary, setIncludeKpiSummary] = useState(true);
  const [emailWhenReady, setEmailWhenReady] = useState(false);

  const handleExport = () => {
    onExport({
      fileFormat,
      dateRange,
      includeCharts,
      includeKpiSummary,
      emailWhenReady,
    });
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
                Customize your {reportName.toLowerCase()} export.
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

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#FAFAFA]">File Format:</label>
            <Select value={fileFormat} onValueChange={(value) => value && setFileFormat(value)}>
              <SelectTrigger className="h-11 rounded-xl border-[#616161B2] bg-[#FFFFFF1A] text-[#FAFAFA]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FILE_FORMATS.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#FAFAFA]">Date Range:</label>
            <Select value={dateRange} onValueChange={(value) => value && setDateRange(value)}>
              <SelectTrigger className="h-11 rounded-xl border-[#616161B2] bg-[#FFFFFF1A] text-[#FAFAFA]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-[#FAFAFA]">Columns to include:</span>
            <label className="flex items-center gap-3 text-sm text-[#FAFAFA]">
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="h-4 w-4 accent-[#FBC02D]"
              />
              Include charts and visualization
            </label>
            <label className="flex items-center gap-3 text-sm text-[#FAFAFA]">
              <input
                type="checkbox"
                checked={includeKpiSummary}
                onChange={(e) => setIncludeKpiSummary(e.target.checked)}
                className="h-4 w-4 accent-[#FBC02D]"
              />
              Include KPI Summary
            </label>
            <label className="flex items-center gap-3 text-sm text-[#FAFAFA]">
              <input
                type="checkbox"
                checked={emailWhenReady}
                onChange={(e) => setEmailWhenReady(e.target.checked)}
                className="h-4 w-4 accent-[#FBC02D]"
              />
              Email when ready
            </label>
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
            onClick={handleExport}
            className="tap-effect h-11 rounded-full bg-[#FBC02D] px-8 text-sm font-semibold text-[#121212]"
          >
            Export Now
          </button>
        </div>
      </div>
    </Modal>
  );
}
