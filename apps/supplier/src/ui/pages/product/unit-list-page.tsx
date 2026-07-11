import { useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { ConfirmDialog, DataGrid, type ColDef } from '@energyiq/ui';
import type { product } from '@energyiq/domain';
import {
  useProductUnitsQuery,
  useCreateProductUnitMutation,
  useUpdateProductUnitMutation,
  useDeleteProductUnitMutation,
} from '@/hooks/use-product-units';
import { UnitFormModal } from '@/ui/components/product/unit-form-modal';

export function UnitListPage() {
  const unitsQuery = useProductUnitsQuery();
  const createUnit = useCreateProductUnitMutation();
  const updateUnit = useUpdateProductUnitMutation();
  const deleteUnit = useDeleteProductUnitMutation();

  const [editing, setEditing] = useState<product.ProductUnit | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<product.ProductUnit | null>(null);

  const rows = unitsQuery.data ?? [];
  const isEmpty = unitsQuery.isSuccess && rows.length === 0;

  const columnDefs = useMemo<ColDef<product.ProductUnit>[]>(
    () => [
      { field: 'unit_name', headerName: 'Unit Name', minWidth: 140 },
      { field: 'description', headerName: 'Description', minWidth: 220 },
      { field: 'type', headerName: 'Type', width: 120, flex: 0 },
      { field: 'short_code', headerName: 'Short Code', width: 130, flex: 0 },
      {
        headerName: 'Action',
        width: 110,
        flex: 0,
        sortable: false,
        filter: false,
        cellRenderer: (p: { data: product.ProductUnit }) => (
          <div className="flex items-center gap-4 h-full">
            <button
              type="button"
              onClick={() => setEditing(p.data)}
              aria-label={`Edit ${p.data.unit_name}`}
              className="tap-effect text-brand hover:opacity-80"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setDeleting(p.data)}
              aria-label={`Delete ${p.data.unit_name}`}
              className="tap-effect text-danger hover:opacity-80"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const handleSave = (data: product.ProductUnitUpsertRequest) => {
    if (editing?.id) {
      updateUnit.mutate({ id: editing.id, req: data }, { onSuccess: () => setEditing(null) });
    } else {
      createUnit.mutate(data, { onSuccess: () => setAdding(false) });
    }
  };

  const handleDeleteConfirmed = () => {
    if (!deleting?.id) return;
    deleteUnit.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-foreground">Product Units of Measure</h1>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="tap-effect h-[46px] px-6 rounded-full bg-brand text-brand-foreground font-semibold text-sm hover:opacity-90"
        >
          Add Unit
        </button>
      </header>

      {unitsQuery.isError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          Couldn't load units. Please try again.
        </div>
      )}

      {isEmpty ? (
        <div className="flex h-[300px] items-center justify-center rounded-[18px] bg-surface-card text-muted-foreground">
          No units yet. Add your first one to get started.
        </div>
      ) : (
        <DataGrid<product.ProductUnit>
          rowData={rows}
          columnDefs={columnDefs}
          rowHeight={56}
          loading={unitsQuery.isLoading}
          className="h-[600px] bg-surface-card rounded-[18px] overflow-hidden"
        />
      )}

      <UnitFormModal
        open={adding || editing !== null}
        onOpenChange={(o) => {
          if (!o) {
            setAdding(false);
            setEditing(null);
          }
        }}
        initial={editing}
        onSave={handleSave}
        saving={createUnit.isPending || updateUnit.isPending}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete Unit"
        message={
          <>
            Are you sure you want to delete <strong>'{deleting?.unit_name}'</strong> Unit?
          </>
        }
        confirmLabel="Delete"
        intent="danger"
        onConfirm={handleDeleteConfirmed}
      />
    </section>
  );
}
