import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog, LoadingOverlay, toast } from '@energyiq/ui';
import type { warehouse } from '@energyiq/domain';
import {
  STOCK_COMPOSITION,
  buildWarehouseSummary,
  toWarehouseViewModel,
  type Warehouse,
} from './mocks';
import {
  useWarehousesQuery,
  useWarehouseStatsQuery,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
} from '@/hooks/use-warehouses';
import { WarehouseInventorySummary } from '@/ui/components/warehouse/warehouse-inventory-summary';
import {
  WarehouseFilterBar,
  type WarehouseStatusFilter,
} from '@/ui/components/warehouse/warehouse-filter-bar';
import { WarehouseListTable } from '@/ui/components/warehouse/warehouse-list-table';
import { EditWarehouseModal } from '@/ui/components/warehouse/edit-warehouse-modal';
import { ToolbarActionButton } from '@/ui/components/product/wizard-fields';

export function WarehouseInventoryPage() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();

  const { data: listResult, isLoading, error } = useWarehousesQuery();
  const { data: stats } = useWarehouseStatsQuery();
  const updateMutation = useUpdateWarehouseMutation();
  const deleteMutation = useDeleteWarehouseMutation();
  

  const [statusFilter, setStatusFilter] = useState<WarehouseStatusFilter>('all');
  const [editing, setEditing] = useState<Warehouse | null>(null);
  const [deleting, setDeleting] = useState<Warehouse | null>(null);
  console.log(editing);

  const rows = useMemo<Warehouse[]>(() => {
    return (listResult?.items ?? []).map(toWarehouseViewModel);
  }, [listResult]);

  const summary = useMemo(
    () => buildWarehouseSummary(rows, stats?.total_warehouses),
    [rows, stats],
  );

  const visibleRows = useMemo(
    () => rows.filter((row) => statusFilter === 'all' || row.status === statusFilter),
    [rows, statusFilter],
  );

  const handleSave = (req: warehouse.WarehouseUpdateRequest) => {
    if (!editing?.id) return;
    updateMutation.mutate(
      { id: editing.id, req },
      {
        onSuccess: () => {
          setEditing(null);
          toast.success('Warehouse Updated Successfully', {
            description: `${req.warehouse_name} has been updated. The changes are now reflected across your inventory.`,
          });
        },
        onError: () => {
          toast.error('Update Failed', {
            description: `${req.warehouse_name} was not updated due to a connection problem. Try again later.`,
          });
        },
      },
    );
  };

  const handleDeleteConfirmed = () => {
    if (!deleting?.id) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        setDeleting(null);
        toast.success('Warehouse Removed', {
          description: `${deleting.name} has been removed.`,
        });
      },
      onError: () => {
        setDeleting(null);
        toast.error('Removal Failed', {
          description: `${deleting.name} was not removed due to a connection problem. Try again later.`,
        });
      },
    });
  };

  const isProcessing = updateMutation.isPending || deleteMutation.isPending;

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-foreground">Warehouse Inventory</h1>

      <WarehouseInventorySummary
        totalWarehouses={summary.totalWarehouses}
        composition={STOCK_COMPOSITION}
      />

      <div className="flex items-center justify-between gap-3 flex-wrap mt-4">
        <WarehouseFilterBar status={statusFilter} onStatusChange={setStatusFilter} />
        <div className="flex items-center gap-3">
          <ToolbarActionButton variant="outline" onClick={() => navigate(`/${slug}/inventory/transfer`)}>
            Transfer Stock
          </ToolbarActionButton>
          <ToolbarActionButton variant="filled" onClick={() => navigate(`/${slug}/inventory/create-warehouse`)}>
            Create Warehouse
          </ToolbarActionButton>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-100 items-center justify-center rounded-[18px] bg-surface-card">
          <p className="text-muted-foreground">Loading warehouses…</p>
        </div>
      ) : error ? (
        <div className="flex h-100 items-center justify-center rounded-[18px] bg-surface-card">
          <p className="text-danger">Failed to load warehouses. Please try again.</p>
        </div>
      ) : (
        <WarehouseListTable
          rows={visibleRows}
          onEdit={setEditing}
          onDelete={setDeleting}
          onTransferHistory={() => navigate(`/${slug}/inventory/transfer-history`)}
        />
      )}

      <EditWarehouseModal
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        warehouse={editing}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Remove Warehouse"
        message={<>Are you sure you want to delete {deleting?.name}?</>}
        confirmLabel="Confirm"
        onConfirm={handleDeleteConfirmed}
      />

      {isProcessing && <LoadingOverlay message="Updating warehouse…" />}
    </section>
  );
}
