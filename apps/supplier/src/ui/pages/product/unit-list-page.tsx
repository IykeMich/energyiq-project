import { useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@energyiq/ui';
import type { product } from '@energyiq/domain';
import {
  useProductUnitsQuery,
  useCreateProductUnitMutation,
  useUpdateProductUnitMutation,
  useDeleteProductUnitMutation,
} from '@/hooks/use-product-units';
import { DefaultTable, type Column } from '@/ui/components/table/default-table';
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

  const columns = useMemo<Column<product.ProductUnit>[]>(
    () => [
      { header: 'Unit Name', accessor: 'unit_name', sortable: true },
      { header: 'Description', accessor: 'description' },
      { header: 'Type', accessor: 'type', width: '120px' },
      { header: 'Short Code', accessor: 'short_code', width: '130px' },
      {
        header: 'Action',
        accessor: 'id',
        width: '110px',
        render: (_value, row) => (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setEditing(row)}
              aria-label={`Edit ${row.unit_name}`}
              className="tap-effect text-brand hover:opacity-80"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setDeleting(row)}
              aria-label={`Delete ${row.unit_name}`}
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

      <DefaultTable<product.ProductUnit>
        columns={columns}
        data={rows}
        isLoading={unitsQuery.isLoading}
        noDataMessage="No units yet. Add your first one to get started."
        getRowId={(row, index) => row.id ?? index}
      />

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
