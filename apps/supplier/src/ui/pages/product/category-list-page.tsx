import { useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { ConfirmDialog, DataGrid, type ColDef } from '@energyiq/ui';
import { CATEGORIES_DATA, type ProductCategoryRow } from './mocks';
import { ProductStatusBadge } from './components/product-status-badge';
import { CategoryFormModal } from './components/category-form-modal';

export function CategoryListPage() {
  const [rows, setRows] = useState<ProductCategoryRow[]>(CATEGORIES_DATA);
  const [editing, setEditing] = useState<ProductCategoryRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<ProductCategoryRow | null>(null);

  const columnDefs = useMemo<ColDef<ProductCategoryRow>[]>(
    () => [
      { field: 'name', headerName: 'Category', minWidth: 160 },
      { field: 'description', headerName: 'Description', minWidth: 220 },
      { field: 'numberOfProducts', headerName: 'No of Products', width: 150, flex: 0, type: 'numericColumn' },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
        flex: 0,
        cellRenderer: (p: { value: ProductCategoryRow['status'] }) => (
          <ProductStatusBadge value={p.value} />
        ),
      },
      {
        headerName: 'Action',
        width: 110,
        flex: 0,
        sortable: false,
        filter: false,
        cellRenderer: (p: { data: ProductCategoryRow }) => (
          <div className="flex items-center gap-4 h-full">
            <button
              type="button"
              onClick={() => setEditing(p.data)}
              aria-label={`Edit ${p.data.name}`}
              className="text-brand hover:opacity-80"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setDeleting(p.data)}
              aria-label={`Delete ${p.data.name}`}
              className="text-danger hover:opacity-80"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const handleSave = (data: Omit<ProductCategoryRow, 'id'>) => {
    if (editing) {
      setRows((prev) => prev.map((r) => (r.id === editing.id ? { ...editing, ...data } : r)));
      setEditing(null);
    } else {
      setRows((prev) => [...prev, { id: `cat-${Date.now()}`, ...data }]);
      setAdding(false);
    }
  };

  const handleDeleteConfirmed = () => {
    if (!deleting) return;
    setRows((prev) => prev.filter((r) => r.id !== deleting.id));
    setDeleting(null);
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-foreground">Product Category</h1>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="h-[46px] px-6 rounded-full bg-brand text-brand-foreground font-semibold text-sm"
        >
          Add Category
        </button>
      </header>

      <DataGrid<ProductCategoryRow>
        rowData={rows}
        columnDefs={columnDefs}
        rowHeight={56}
        className="h-[600px] bg-surface-card rounded-[18px] overflow-hidden"
      />

      <CategoryFormModal
        open={adding || editing !== null}
        onOpenChange={(o) => {
          if (!o) {
            setAdding(false);
            setEditing(null);
          }
        }}
        initial={editing}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(o) => !o && setDeleting(null)}
        title={`Delete Category`}
        message={
          <>
            Are you sure you want to delete <strong>‘{deleting?.name}’</strong> Category?
          </>
        }
        confirmLabel="Delete"
        intent="danger"
        onConfirm={handleDeleteConfirmed}
      />
    </section>
  );
}
