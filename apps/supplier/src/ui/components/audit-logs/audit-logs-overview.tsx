import { useMemo, useState } from 'react';
import { toast } from '@energyiq/ui';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import { AuditLogsSearchBar } from './audit-logs-search-bar';
import { AuditLogsFilterChips, type AuditFilterSelection } from './audit-logs-filter-chips';
import { AuditLogsTable } from './audit-logs-table';
import { AuditLogsConfigureExportModal } from './audit-logs-configure-export-modal';
import { AuditLogsExportProgress } from './audit-logs-export-progress';
import { AuditLogsExportFileCard } from './audit-logs-export-file-card';
import {
  AUDIT_EXPORT_FILE,
  AUDIT_EXPORT_RECORD_TOTAL,
  AUDIT_LOGS_MOCK,
} from './audit-logs-mocks';

type ExportStage = 'idle' | 'configuring' | 'exporting' | 'ready' | 'downloaded';

/**
 * Supplier Audit Logs page. The header search bar and the filter chips narrow the table
 * client-side; the Export Log button drives a simulated configure → generate → download
 * flow. Swap `AUDIT_LOGS_MOCK` / `AUDIT_EXPORT_FILE` for the query hooks once the API lands.
 */
export function AuditLogsOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<AuditFilterSelection>({});
  const [exportStage, setExportStage] = useState<ExportStage>('idle');

  const setFilter = (filterId: string, option: string | null) => {
    setFilters((previous) => ({ ...previous, [filterId]: option }));
  };

  const filteredLogs = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const eventFilter = filters.event;
    const userFilter = filters.user;
    return AUDIT_LOGS_MOCK.filter((log) => {
      const matchesEvent = !eventFilter || log.action === eventFilter;
      const matchesUser = !userFilter || log.user === userFilter;
      const matchesQuery =
        normalizedQuery === '' ||
        log.user.toLowerCase().includes(normalizedQuery) ||
        log.action.toLowerCase().includes(normalizedQuery) ||
        log.description.toLowerCase().includes(normalizedQuery);
      // NOTE: the From/To Date chips are presentational — their relative ranges don't map
      // to the static mock timestamps. TODO(orval): apply them once the endpoint lands.
      return matchesEvent && matchesUser && matchesQuery;
    });
  }, [searchQuery, filters]);

  const completeExport = () => {
    setExportStage('ready');
    toast.success('Export Ready', {
      description: `${AUDIT_EXPORT_FILE.name} is ready to download.`,
    });
  };

  const cancelExport = () => {
    setExportStage('idle');
    toast.error('Export cancelled', {
      description: 'The audit log export was stopped before it finished.',
    });
  };

  const downloadExport = () => {
    setExportStage('downloaded');
    // TODO(orval): stream the generated file; this simulates the download + audit entry.
    toast.success(`${AUDIT_EXPORT_FILE.name} downloaded.`, {
      description: 'Saved to your downloads folder. This export has been recorded in the audit log.',
    });
  };

  const showExportCard = exportStage === 'ready' || exportStage === 'downloaded';

  return (
    <section className="flex flex-col gap-6">
      {/* The log search replaces the default title in the layout header (dynamic per page). */}
      <PageHeaderContent>
        <AuditLogsSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </PageHeaderContent>

      <h1 className="text-2xl font-semibold text-[#FAFAFA]">Audit Logs</h1>

      {showExportCard && (
        <AuditLogsExportFileCard
          file={AUDIT_EXPORT_FILE}
          status={exportStage === 'downloaded' ? 'downloaded' : 'ready'}
          onDownload={downloadExport}
          onDismiss={() => setExportStage('idle')}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <AuditLogsFilterChips selection={filters} onChange={setFilter} />
        <button
          type="button"
          onClick={() => setExportStage('configuring')}
          className="tap-effect h-[46px] rounded-full bg-[#FBC02D] px-6 text-sm font-semibold text-[#121212]"
        >
          Export Log
        </button>
      </div>

      <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
        <AuditLogsTable logs={filteredLogs} />
      </div>

      <AuditLogsConfigureExportModal
        open={exportStage === 'configuring'}
        // Closing the modal (back / X / cancel) aborts only while still configuring.
        onOpenChange={(open) => {
          if (!open) setExportStage((stage) => (stage === 'configuring' ? 'idle' : stage));
        }}
        onGenerate={() => setExportStage('exporting')}
      />

      {exportStage === 'exporting' && (
        <AuditLogsExportProgress
          recordTotal={AUDIT_EXPORT_RECORD_TOTAL}
          onCancel={cancelExport}
          onComplete={completeExport}
        />
      )}
    </section>
  );
}
