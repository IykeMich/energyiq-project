import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog } from '@energyiq/ui';
import type { product } from '@energyiq/domain';
import { useProductsQuery, useDeleteProductMutation } from '@/hooks/use-products';
import { useProductCategoriesQuery } from '@/hooks/use-product-categories';
import { DefaultTable, type Column } from '@/ui/components/table/default-table';
import { TableCheckbox } from '@/ui/components/table/table-checkbox';
import { ProductStatusBadge } from '@/ui/components/product/product-status-badge';
import { ProductFilterBar } from '@/ui/components/product/product-filter-bar';
import { ProductActionsCell } from '@/ui/components/product/product-actions-cell';
import { AssignWarehouseWizardModal } from '@/ui/components/product/assign-warehouse-wizard-modal';
import { ProductDetailsSheet } from '@/ui/components/product/product-details-sheet';
import { PRODUCT_STOCK_MOCK_QUANTITY } from '@/ui/components/product/product-catalog-mocks';

const NGN = new Intl.NumberFormat('en-NG');

export function ProductListPage() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const [pendingDelete, setPendingDelete] = useState<product.Product | null>(null);
  const [assignWarehouseOpen, setAssignWarehouseOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<product.Product | null>(null);
  const [sheetMode, setSheetMode] = useState<'view' | 'edit'>('view');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<product.ProductStatus | undefined>(undefined);

  const productsQuery = useProductsQuery({ category_id: categoryId, status });
  const categoriesQuery = useProductCategoriesQuery();
  const deleteProduct = useDeleteProductMutation();

  const products = productsQuery.data?.items ?? [];
  const categories = categoriesQuery.data ?? [];
  const categoryNameById = useMemo(
    () =>
      new Map(categories.filter((category) => category.id).map((category) => [category.id, category.name])),
    [categories],
  );

  const columns = useMemo<Column<product.Product>[]>(
    () => [
      {
        header: '',
        accessor: 'id',
        width: '48px',
        // Decorative only — no bulk action consumes selection yet.
        renderHeader: () => (
          <TableCheckbox checked={false} onChange={() => {}} aria-label="Select all products" />
        ),
        render: (_value, row) => (
          <TableCheckbox checked={false} onChange={() => {}} aria-label={`Select ${row.name}`} />
        ),
      },
      { header: 'Product', accessor: 'name', sortable: true },
      { header: 'SKU', accessor: 'sku', width: '120px' },
      {
        header: 'Category',
        accessor: 'category_id',
        width: '130px',
        render: (_value, row) =>
          (row.category_id && categoryNameById.get(row.category_id)) || 'Uncategorized',
      },
      { header: 'Unit', accessor: 'unit', width: '80px' },
      {
        header: 'Total Stock',
        accessor: 'id',
        width: '130px',
        render: (_value, row) => `${PRODUCT_STOCK_MOCK_QUANTITY.toLocaleString()}${row.unit ?? ''}`,
      },
      {
        header: 'Default Price',
        accessor: 'base_price',
        width: '140px',
        render: (_value, row) => {
          const value = Number(row.base_price ?? 0);
          const symbol = row.currency === 'USD' ? '$' : '₦';
          return `${symbol}${NGN.format(value)}`;
        },
      },
      {
        header: 'Status',
        accessor: 'status',
        width: '130px',
        render: (value) => <ProductStatusBadge value={String(value ?? 'draft')} />,
      },
      {
        header: 'Action',
        accessor: 'id',
        width: '110px',
        render: (_value, row) => (
          <ProductActionsCell
            product={row}
            onEdit={(prod) => {
              setSelectedProduct(prod);
              setSheetMode('edit');
            }}
            onDelete={(prod) => setPendingDelete(prod)}
          />
        ),
      },
    ],
    [categoryNameById],
  );

  const handleDeleteConfirmed = () => {
    if (!pendingDelete?.id) return;
    deleteProduct.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) });
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between flex-wrap gap-3 mt-12 mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Product Catalog</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAssignWarehouseOpen(true)}
            className="tap-effect h-[46px] px-6 rounded-full border border-brand text-brand font-semibold text-sm hover:bg-brand/10"
          >
            Assign to Warehouse
          </button>
          <button
            type="button"
            onClick={() => navigate(`/${slug}/products/new`)}
            className="tap-effect h-[46px] px-6 rounded-full bg-brand text-brand-foreground font-semibold text-sm hover:opacity-90"
          >
            Add New Product
          </button>
        </div>
      </header>

      {productsQuery.isError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          Couldn't load products. Please try again.
        </div>
      )}

      <DefaultTable<product.Product>
        columns={columns}
        data={products}
        isLoading={productsQuery.isLoading}
        noDataMessage="No products yet. Add your first one to get started."
        getRowId={(row, index) => row.id ?? index}
        onRowClick={(row) => {
          setSelectedProduct(row);
          setSheetMode('view');
        }}
        header={
          <ProductFilterBar
            categories={categories}
            selectedCategoryId={categoryId}
            onCategoryChange={setCategoryId}
            selectedStatus={status}
            onStatusChange={setStatus}
          />
        }
      />

      <ProductDetailsSheet
        product={selectedProduct}
        initialMode={sheetMode}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
        onGoHome={() => navigate(`/${slug}/dashboard`)}
      />

      <AssignWarehouseWizardModal
        open={assignWarehouseOpen}
        onOpenChange={setAssignWarehouseOpen}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title="Delete Product"
        message={
          <>
            Are you sure you want to delete <strong>{pendingDelete?.name}</strong>? This action
            cannot be undone.
          </>
        }
        confirmLabel="Delete"
        intent="danger"
        onConfirm={handleDeleteConfirmed}
      />
    </section>
  );
}
