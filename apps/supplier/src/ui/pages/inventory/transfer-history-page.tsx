import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useStockTransfersQuery,
  useWarehousesQuery,
} from '@/hooks/use-warehouses';
import { toTransferRecordViewModel } from './mocks';
import type { TransferRecord } from './mocks';
import {
  TransferHistoryFilterBar,
  type TransferStatusFilter,
} from '@/ui/components/warehouse/transfer-history-filter-bar';
import { TransferHistoryTable } from '@/ui/components/warehouse/transfer-history-table';
import { TransferDetailModal } from '@/ui/components/warehouse/transfer-detail-modal';

export function TransferHistoryPage() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const { data: transfersResult, isLoading, error } = useStockTransfersQuery();
  const { data: warehousesResult } = useWarehousesQuery();

  const [selected, setSelected] = useState<TransferRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<TransferStatusFilter>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const warehouses = useMemo(() => warehousesResult?.items ?? [], [warehousesResult]);

  const rows = useMemo<TransferRecord[]>(
    () => (transfersResult?.items ?? []).map((transfer) => toTransferRecordViewModel(transfer, warehouses)),
    [transfersResult, warehouses],
  );

  const visibleRows = useMemo(
    () =>
      rows.filter((row) => {
        const statusOk = statusFilter === 'all' || row.status === statusFilter;
        const fromOk = !fromDate || row.dateValue >= fromDate;
        const toOk = !toDate || row.dateValue <= toDate;
        return statusOk && fromOk && toOk;
      }),
    [rows, statusFilter, fromDate, toDate],
  );

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={() => navigate(`/${slug}/inventory`)}
          aria-label="Back to inventory"
          className="w-[31px] h-[31px] rounded-full bg-brand text-brand-foreground flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Transfer History</h1>
          <p className="text-sm text-foreground/70 mt-1">
            Track and manage all inventory movements across warehouses
          </p>
        </div>
      </header>

      <TransferHistoryFilterBar
        status={statusFilter}
        fromDate={fromDate}
        toDate={toDate}
        onStatusChange={setStatusFilter}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center rounded-[18px] bg-surface-card">
          <p className="text-muted-foreground">Loading transfer history…</p>
        </div>
      ) : error ? (
        <div className="flex h-[400px] items-center justify-center rounded-[18px] bg-surface-card">
          <p className="text-danger">Failed to load transfer history. Please try again.</p>
        </div>
      ) : (
        <TransferHistoryTable rows={visibleRows} onView={setSelected} />
      )}

      <TransferDetailModal
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
        record={selected}
      />
    </section>
  );
}
