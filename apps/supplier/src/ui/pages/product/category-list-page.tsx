import { useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@energyiq/ui';
import type { product } from '@energyiq/domain';
import {
  useProductCategoriesQuery,
  useCreateProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} from '@/hooks/use-product-categories';
import { DefaultTable, type Column } from '@/ui/components/table/default-table';
import { ProductStatusBadge } from '@/ui/components/product/product-status-badge';
import { CategoryFormModal } from '@/ui/components/product/category-form-modal';
import { CATEGORY_PRODUCT_COUNTS, CATEGORY_PRODUCT_COUNT_FALLBACK } from '@/ui/components/product/category-mocks';

export function CategoryListPage() {
  const categoriesQuery = useProductCategoriesQuery();
  const createCategory = useCreateProductCategoryMutation();
  const updateCategory = useUpdateProductCategoryMutation();
  const deleteCategory = useDeleteProductCategoryMutation();

  const [editing, setEditing] = useState<product.ProductCategory | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<product.ProductCategory | null>(null);

  const rows = categoriesQuery.data ?? [];

  const columns = useMemo<Column<product.ProductCategory>[]>(
    () => [
      { header: 'Category', accessor: 'name', sortable: true },
      { header: 'Description', accessor: 'description' },
      {
        header: 'No of Products',
        accessor: 'name',
        width: '160px',
        render: (value) => (value && CATEGORY_PRODUCT_COUNTS[String(value)]) ?? CATEGORY_PRODUCT_COUNT_FALLBACK,
      },
      {
        header: 'Status',
        accessor: 'status',
        width: '130px',
        render: (value) => <ProductStatusBadge value={String(value ?? 'active')} />,
      },
      {
        header: 'Action',
        accessor: 'id',
        width: '110px',
        render: (_value, row) => (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setEditing(row)}
              aria-label={`Edit ${row.name}`}
              className="tap-effect text-brand hover:opacity-80"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setDeleting(row)}
              aria-label={`Delete ${row.name}`}
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
      <header className="flex items-center justify-between flex-wrap gap-3 mt-8 mb-6">
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

      <DefaultTable<product.ProductCategory>
        columns={columns}
        data={rows}
        isLoading={categoriesQuery.isLoading}
        noDataMessage="No categories yet. Add your first one to get started."
        getRowId={(row, index) => row.id ?? index}
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
