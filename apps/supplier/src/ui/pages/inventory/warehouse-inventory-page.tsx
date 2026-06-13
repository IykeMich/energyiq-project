import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog, LoadingOverlay, SuccessModal } from '@energyiq/ui';
import {
  STOCK_COMPOSITION,
  WAREHOUSES_MOCK,
  buildWarehouseSummary,
  mockWarehouseAction,
  type Warehouse,
} from './mocks';
import { WarehouseInventorySummary } from '@/ui/components/warehouse/warehouse-inventory-summary';
import {
  WarehouseFilterBar,
  type WarehouseStatusFilter,
} from '@/ui/components/warehouse/warehouse-filter-bar';
import { WarehouseListTable } from '@/ui/components/warehouse/warehouse-list-table';
import { EditWarehouseModal } from '@/ui/components/warehouse/edit-warehouse-modal';

export function WarehouseInventoryPage() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  // TODO(orval): replace with the generated list-warehouses query.
  const [rows, setRows] = useState<Warehouse[]>(WAREHOUSES_MOCK);
  const summary = buildWarehouseSummary(rows);

  const [statusFilter, setStatusFilter] = useState<WarehouseStatusFilter>('all');
  const visibleRows = rows.filter((row) => statusFilter === 'all' || row.status === statusFilter);

  const [editing, setEditing] = useState<Warehouse | null>(null);
  const [deleting, setDeleting] = useState<Warehouse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [savedName, setSavedName] = useState('');

  const handleSave = async () => {
    setSavedName(editing?.name ?? '');
    setEditing(null);
    setIsProcessing(true);
    await mockWarehouseAction();
    setIsProcessing(false);
    setSuccessOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (!deleting) return;
    setRows((prev) => prev.filter((warehouse) => warehouse.id !== deleting.id));
    setDeleting(null);
  };

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-foreground">Warehouse Inventory</h1>

      <WarehouseInventorySummary
        totalWarehouses={summary.totalWarehouses}
        composition={STOCK_COMPOSITION}
      />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <WarehouseFilterBar status={statusFilter} onStatusChange={setStatusFilter} />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/${slug}/inventory/transfer`)}
            className="h-[46px] px-6 rounded-full border border-brand text-brand font-semibold text-sm"
          >
            Transfer Stock
          </button>
          <button
            type="button"
            onClick={() => navigate(`/${slug}/inventory/create-warehouse`)}
            className="h-[46px] px-6 rounded-full bg-brand text-brand-foreground font-semibold text-sm"
          >
            Create Warehouse
          </button>
        </div>
      </div>

      <WarehouseListTable
        rows={visibleRows}
        onEdit={setEditing}
        onDelete={setDeleting}
        onTransferHistory={() => navigate(`/${slug}/inventory/transfer-history`)}
      />

      <EditWarehouseModal
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        warehouse={editing}
        onSave={handleSave}
      />

      <SuccessModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        tone="brand"
        title="Warehouse Updated Successfully"
        subtitle={
          <>
            <span className="text-brand font-semibold">{savedName || 'The warehouse'}</span> has been
            updated. The changes are now reflected across your inventory.
          </>
        }
        primaryAction={{ label: 'Done', onClick: () => setSuccessOpen(false) }}
        buttonLayout="stack"
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Remove Warehouse"
        message={<>Are you sure you want to delete {deleting?.name}?</>}
        confirmLabel="Confirm"
        onConfirm={handleDeleteConfirmed}
      />

      {isProcessing && <LoadingOverlay message="Updating warehouse..." />}
    </section>
  );
}
