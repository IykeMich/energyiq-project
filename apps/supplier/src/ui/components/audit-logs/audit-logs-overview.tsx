import { useMemo, useState } from 'react';
import { toast } from '@energyiq/ui';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import { useAuditLogsQuery } from '@/hooks/use-audit-logs';
import { AuditLogsSearchBar } from './audit-logs-search-bar';
import { AuditLogsFilterChips, type AuditFilterSelection } from './audit-logs-filter-chips';
import { AuditLogsTable } from './audit-logs-table';
import { AuditLogsConfigureExportModal } from './audit-logs-configure-export-modal';
import { AuditLogsExportProgress } from './audit-logs-export-progress';
import { AuditLogsExportFileCard } from './audit-logs-export-file-card';
import { toAuditLogRow, toFilterOptions } from './audit-logs-mapper';
import {
  AUDIT_EXPORT_FILE,
  AUDIT_EXPORT_RECORD_TOTAL,
  EXPORT_COLUMN_OPTIONS,
  EXPORT_DATE_RANGES,
  EXPORT_EVENT_TOGGLES,
  EXPORT_FILE_FORMATS,
} from './audit-logs-mocks';
import type { AuditFilterOption } from './audit-logs-mocks';

type ExportStage = 'idle' | 'configuring' | 'exporting' | 'ready' | 'downloaded';

function useAuditFilterConfig(filters?: {
  event_options?: AuditFilterOption[];
  status_options?: AuditFilterOption[];
  user_options?: AuditFilterOption[];
}) {
  return useMemo(
    () => [
      {
        id: 'event',
        label: 'All Events',
        options: toFilterOptions(filters?.event_options, [
          'Login',
          'Login Attempt',
          'Report Export',
          'Alert Trigger',
          'Dashboard Access',
          'User Management',
          'Data Change',
          'Data Access',
          'Permission Change',
        ]),
      },
      {
        id: 'status',
        label: 'All Status',
        options: toFilterOptions(filters?.status_options, ['Success', 'Auto', 'Failed']),
      },
      {
        id: 'user',
        label: 'All Users',
        options: toFilterOptions(filters?.user_options, [
          'Andrew Franklin',
          'Admin User',
          'MaryJane James',
          'System',
        ]),
      },
    ],
    [filters],
  );
}

/**
 * Supplier Audit Logs page. Wires the table, filters, and pagination to the
 * real `GET /v1/audit/list` endpoint. The Export Log flow remains presentational
 * until a dedicated export POST endpoint lands.
 */
export function AuditLogsOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<AuditFilterSelection>({});
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [exportStage, setExportStage] = useState<ExportStage>('idle');

  const { data, isLoading } = useAuditLogsQuery({
    search: searchQuery.trim() || undefined,
    event: filters.event || undefined,
    status: filters.status || undefined,
    user_id: filters.user || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    limit: 100,
  });

  const filterConfig = useAuditFilterConfig(data?.filters);
  const logs = useMemo(() => (data?.table?.rows ?? []).map(toAuditLogRow), [data]);
  const exportActionLabel = data?.export_action_label ?? 'Export Log';
  const exportOptions = data?.export;

  const setFilter = (filterId: string, option: string | null) => {
    setFilters((previous) => ({ ...previous, [filterId]: option }));
  };

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
    // TODO: stream the generated file; this simulates the download + audit entry.
    toast.success(`${AUDIT_EXPORT_FILE.name} downloaded.`, {
      description: 'Saved to your downloads folder. This export has been recorded in the audit log.',
    });
  };

  const showExportCard = exportStage === 'ready' || exportStage === 'downloaded';

  return (
    <section className="flex flex-col gap-6">
      {/* The log search replaces the default title in the layout header (dynamic per page). */}
      <PageHeaderContent>
        <AuditLogsSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder={data?.search_placeholder}
        />
      </PageHeaderContent>

      <h1 className="text-2xl font-semibold text-[#FAFAFA]">{data?.title ?? 'Audit Logs'}</h1>

      {showExportCard && (
        <AuditLogsExportFileCard
          file={AUDIT_EXPORT_FILE}
          status={exportStage === 'downloaded' ? 'downloaded' : 'ready'}
          onDownload={downloadExport}
          onDismiss={() => setExportStage('idle')}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <AuditLogsFilterChips filters={filterConfig} selection={filters} onChange={setFilter} />

          <input
            type="date"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
            className="rounded-[14px] border-[1.5px] border-[#616161B2] bg-transparent px-3 py-1 text-xs text-white placeholder:text-[#FFFFFF80] focus:border-[#FBC02D] focus:outline-none"
            placeholder="From Date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(event) => setDateTo(event.target.value)}
            className="rounded-[14px] border-[1.5px] border-[#616161B2] bg-transparent px-3 py-1 text-xs text-white placeholder:text-[#FFFFFF80] focus:border-[#FBC02D] focus:outline-none"
            placeholder="To Date"
          />
        </div>

        <button
          type="button"
          onClick={() => setExportStage('configuring')}
          className="tap-effect h-[46px] rounded-full bg-[#FBC02D] px-6 text-sm font-semibold text-[#121212]"
        >
          {exportActionLabel}
        </button>
      </div>

      <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
        <AuditLogsTable logs={logs} isLoading={isLoading} />
        {data?.pagination?.summary && (
          <p className="text-xs text-[#FFFFFFCC]">{data.pagination.summary}</p>
        )}
      </div>

      <AuditLogsConfigureExportModal
        open={exportStage === 'configuring'}
        // Closing the modal (back / X / cancel) aborts only while still configuring.
        onOpenChange={(open) => {
          if (!open) setExportStage((stage) => (stage === 'configuring' ? 'idle' : stage));
        }}
        onGenerate={() => setExportStage('exporting')}
        dateRangeOptions={exportOptions?.default_date_range ? [{ value: exportOptions.default_date_range, label: exportOptions.default_date_range }] : EXPORT_DATE_RANGES}
        eventToggleOptions={EXPORT_EVENT_TOGGLES}
        fileFormatOptions={exportOptions?.file_format_options ?? EXPORT_FILE_FORMATS}
        columnOptions={exportOptions?.column_options ?? EXPORT_COLUMN_OPTIONS}
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
