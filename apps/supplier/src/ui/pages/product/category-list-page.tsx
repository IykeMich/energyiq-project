import { useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { ConfirmDialog, DataGrid, type ColDef } from '@energyiq/ui';
import type { product } from '@energyiq/domain';
import {
  useProductCategoriesQuery,
  useCreateProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} from '@/hooks/use-product-categories';
import { ProductStatusBadge } from '@/ui/components/product/product-status-badge';
import { CategoryFormModal } from '@/ui/components/product/category-form-modal';

export function CategoryListPage() {
  const categoriesQuery = useProductCategoriesQuery();
  const createCategory = useCreateProductCategoryMutation();
  const updateCategory = useUpdateProductCategoryMutation();
  const deleteCategory = useDeleteProductCategoryMutation();

  const [editing, setEditing] = useState<product.ProductCategory | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<product.ProductCategory | null>(null);

  const rows = categoriesQuery.data ?? [];
  const isEmpty = categoriesQuery.isSuccess && rows.length === 0;

  const columnDefs = useMemo<ColDef<product.ProductCategory>[]>(
    () => [
      { field: 'name', headerName: 'Category', minWidth: 160 },
      { field: 'description', headerName: 'Description', minWidth: 220 },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
        flex: 0,
        cellRenderer: (p: { value: product.CategoryStatus }) => <ProductStatusBadge value={p.value} />,
      },
      {
        headerName: 'Action',
        width: 110,
        flex: 0,
        sortable: false,
        filter: false,
        cellRenderer: (p: { data: product.ProductCategory }) => (
          <div className="flex items-center gap-4 h-full">
            <button
              type="button"
              onClick={() => setEditing(p.data)}
              aria-label={`Edit ${p.data.name}`}
              className="tap-effect text-brand hover:opacity-80"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setDeleting(p.data)}
              aria-label={`Delete ${p.data.name}`}
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

  const handleSave = (data: product.ProductCategoryUpsertRequest) => {
    if (editing?.id) {
      updateCategory.mutate(
        { id: editing.id, req: data },
        { onSuccess: () => setEditing(null) },
      );
    } else {
      createCategory.mutate(data, { onSuccess: () => setAdding(false) });
    }
  };

  const handleDeleteConfirmed = () => {
    if (!deleting?.id) return;
    deleteCategory.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-foreground">Product Category</h1>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="tap-effect h-[46px] px-6 rounded-full bg-brand text-brand-foreground font-semibold text-sm hover:opacity-90"
        >
          Add Category
        </button>
      </header>

      {categoriesQuery.isError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          Couldn't load categories. Please try again.
        </div>
      )}

      {isEmpty ? (
        <div className="flex h-[300px] items-center justify-center rounded-[18px] bg-surface-card text-muted-foreground">
          No categories yet. Add your first one to get started.
        </div>
      ) : (
        <DataGrid<product.ProductCategory>
          rowData={rows}
          columnDefs={columnDefs}
          rowHeight={56}
          loading={categoriesQuery.isLoading}
          className="h-[600px] bg-surface-card rounded-[18px] overflow-hidden"
        />
      )}

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
        saving={createCategory.isPending || updateCategory.isPending}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete Category"
        message={
          <>
            Are you sure you want to delete <strong>'{deleting?.name}'</strong> Category?
          </>
        }
        confirmLabel="Delete"
        intent="danger"
        onConfirm={handleDeleteConfirmed}
      />
    </section>
  );
}
