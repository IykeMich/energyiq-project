import { useCallback, useState } from 'react';
import { ConfigureExportModal, type ExportConfig } from './configure-export-modal';
import { ExportProgressModal } from './export-progress-modal';
import { ExportCompleteModal } from './export-complete-modal';

interface UseReportExportResult {
  openExport: () => void;
  exportModals: React.ReactNode;
}

export function useReportExport(reportName: string): UseReportExportResult {
  const [configureOpen, setConfigureOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [exportConfig, setExportConfig] = useState<ExportConfig | null>(null);

  const openExport = useCallback(() => {
    setConfigureOpen(true);
  }, []);

  const handleConfigureExport = (config: ExportConfig) => {
    setExportConfig(config);
    setConfigureOpen(false);
    setProgressOpen(true);
  };

  const handleExportComplete = () => {
    setProgressOpen(false);
    setCompleteOpen(true);
  };

  const extensionMap: Record<string, string> = {
    'PDF (.pdf)': 'pdf',
    'CSV (.csv)': 'csv',
    'Excel (.xlsx)': 'xlsx',
  };
  const fileName = `inventory_report_${new Date().toISOString().slice(0, 7).replace('-', '')}.${extensionMap[exportConfig?.fileFormat ?? 'PDF (.pdf)'] ?? 'pdf'}`;
  const dateRangeMap: Record<string, string> = {
    'Last 7 Days': 'May 31 - June 7, 2026',
    'Last 30 Days': 'Last 30 Days',
    'Last Quarter': 'Last Quarter',
    'Custom Range': 'Custom Range',
  };

  const exportModals = (
    <>
      <ConfigureExportModal
        open={configureOpen}
        onOpenChange={setConfigureOpen}
        reportName={reportName}
        onExport={handleConfigureExport}
      />
      <ExportProgressModal
        open={progressOpen}
        onOpenChange={setProgressOpen}
        reportName={reportName}
        onComplete={handleExportComplete}
      />
      <ExportCompleteModal
        open={completeOpen}
        onOpenChange={setCompleteOpen}
        reportName={reportName}
        fileName={fileName}
        fileSize="2.4 MB"
        dateRange={dateRangeMap[exportConfig?.dateRange ?? 'Last 7 Days']}
      />
    </>
  );

  return { openExport, exportModals };
}
