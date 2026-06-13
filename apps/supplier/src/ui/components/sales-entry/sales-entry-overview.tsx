import { useCallback, useMemo, useState } from 'react';
import { ConfirmDialog, LoadingOverlay, toast } from '@energyiq/ui';
import { SalesEntryKpiCard } from './sales-entry-kpi-card';
import { SalesEntryFilterChips, type SalesFilterSelection } from './sales-entry-filter-chips';
import { SalesEntryReportCard } from './sales-entry-report-card';
import { SalesEntryTransactionDetail } from './sales-entry-transaction-detail';
import { SalesEntryConfigureExportModal } from './sales-entry-configure-export-modal';
import { SalesEntryExportProgress } from './sales-entry-export-progress';
import {
  EXPORT_PROGRESS_META,
  SALES_KPIS,
  SALES_MOCK,
  getSalesTransactionDetail,
} from './sales-entry-mocks';
import type { SalesRow, SalesTransactionDetail } from './sales-entry-mocks';

/**
 * Supplier Sales Entry page. The KPI strip and filter chips sit above a titled report
 * card; the filter chips narrow the table client-side for now. Swap `SALES_MOCK` and
 * `SALES_KPIS` for the generated query hooks once the endpoint lands.
 */
export function SalesEntryOverview() {
  const [filters, setFilters] = useState<SalesFilterSelection>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeDetail, setActiveDetail] = useState<SalesTransactionDetail | null>(null);
  const [confirmVoidOpen, setConfirmVoidOpen] = useState(false);
  const [isVoiding, setIsVoiding] = useState(false);
  const [configureOpen, setConfigureOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const setFilter = (filterId: string, option: string | null) => {
    setFilters((previous) => ({ ...previous, [filterId]: option }));
  };

  const filteredSales = useMemo(() => {
    const distributorFilter = filters.distributor;
    const productFilter = filters.products;
    const statusFilter = filters.status;
    return SALES_MOCK.filter((sale) => {
      const matchesDistributor = !distributorFilter || sale.distributor === distributorFilter;
      const matchesProduct = !productFilter || sale.product === productFilter;
      const matchesStatus = !statusFilter || sale.status === statusFilter;
      // NOTE: the From/To Date chips are presentational — their relative ranges don't map
      // to the static mock dates. TODO(orval): apply them once sales carry real timestamps.
      return matchesDistributor && matchesProduct && matchesStatus;
    });
  }, [filters]);

  const isEmpty = filteredSales.length === 0;

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(
    (checked: boolean) => {
      setSelectedIds(checked ? new Set(filteredSales.map((sale) => sale.id)) : new Set());
    },
    [filteredSales],
  );

  const openDetail = useCallback((sale: SalesRow) => {
    setActiveDetail(getSalesTransactionDetail(sale.id));
  }, []);

  // The Void button lives inside the detail modal; close it before confirming.
  const startVoid = () => {
    setActiveDetail(null);
    setConfirmVoidOpen(true);
  };

  const confirmVoid = () => {
    setConfirmVoidOpen(false);
    setIsVoiding(true);
    // TODO(orval): call the void-transaction mutation; this simulates the request.
    window.setTimeout(() => {
      setIsVoiding(false);
      toast.success('Transaction Voided', {
        description: 'The transaction is no longer active on the table.',
      });
      // TODO(orval): on mutation rejection →
      //   toast.error('Unable to void transaction', { description: 'Please try again in a moment.' });
    }, 1200);
  };

  const startExport = () => {
    setConfigureOpen(false);
    setIsExporting(true);
  };

  // The user aborts the in-progress export from the progress panel.
  const cancelExport = useCallback(() => {
    setIsExporting(false);
    toast.error('Export cancelled', {
      description: 'Your sales report export was stopped before it finished.',
    });
  }, []);

  const finishExport = useCallback(() => {
    setIsExporting(false);
    toast.success('Export ready', {
      description: 'Your sales report has been generated.',
    });
    // TODO(orval): on export-job failure →
    //   toast.error('Export failed', { description: 'We could not generate your report. Please try again.' });
  }, []);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-[#FAFAFA]">Sales Entry</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {SALES_KPIS.map((kpi) => (
          <SalesEntryKpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <SalesEntryFilterChips selection={filters} onChange={setFilter} />
        <button
          type="button"
          onClick={() => setConfigureOpen(true)}
          className="tap-effect h-[46px] rounded-full bg-[#FBC02D] px-6 text-sm font-semibold text-[#121212]"
        >
          Generate Report
        </button>
      </div>

      <SalesEntryReportCard
        isEmpty={isEmpty}
        sales={filteredSales}
        selectedIds={selectedIds}
        onToggleRow={toggleRow}
        onToggleAll={toggleAll}
        onSelect={openDetail}
      />

      <SalesEntryTransactionDetail
        open={activeDetail !== null}
        onOpenChange={(open) => !open && setActiveDetail(null)}
        detail={activeDetail}
        onVoid={startVoid}
      />

      <ConfirmDialog
        open={confirmVoidOpen}
        onOpenChange={setConfirmVoidOpen}
        title="Void Transaction"
        message={
          <>
            Are you sure you want to void this transaction?
            <br />
            The transaction will no longer be seen as active on the table.
          </>
        }
        confirmLabel="Confirm Void"
        intent="danger"
        onConfirm={confirmVoid}
      />

      {isVoiding && <LoadingOverlay message="Voiding transaction…" />}

      <SalesEntryConfigureExportModal
        open={configureOpen}
        onOpenChange={setConfigureOpen}
        onGenerate={startExport}
      />

      {isExporting && (
        <SalesEntryExportProgress
          meta={EXPORT_PROGRESS_META}
          onCancel={cancelExport}
          onComplete={finishExport}
        />
      )}
    </section>
  );
}
