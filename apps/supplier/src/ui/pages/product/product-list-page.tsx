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
import { ProductSearchBar } from '@/ui/components/product/product-search-bar';
import { ProductCatalogStats } from '@/ui/components/product/product-catalog-stats';
import { ProductCategoryPill } from '@/ui/components/product/product-category-pill';
import { ProductStockBar } from '@/ui/components/product/product-stock-bar';
import { getProductStockMockPercentage } from '@/ui/components/product/product-catalog-mocks';
import { PageHeaderContent } from '@/ui/layouts/page-header';

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
  const [searchQuery, setSearchQuery] = useState('');

  const productsQuery = useProductsQuery({
    category_id: categoryId,
    status,
    search: searchQuery || undefined,
  });
  const statsProductsQuery = useProductsQuery({ limit: 100 });
  const categoriesQuery = useProductCategoriesQuery();
  const deleteProduct = useDeleteProductMutation();

  const products = productsQuery.data?.items ?? [];
  const statsProducts = statsProductsQuery.data?.items ?? [];
  const categories = categoriesQuery.data ?? [];
  const categoryById = useMemo(
    () => new Map(categories.filter((category) => category.id).map((category) => [category.id, category])),
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
        width: '150px',
        render: (_value, row) => {
          const category = row.category_id ? categoryById.get(row.category_id) : undefined;
          return (
            <ProductCategoryPill category={category?.name ?? 'Uncategorized'} subtitle={category?.description} />
          );
        },
      },
      {
        header: 'Total Stock',
        accessor: 'id',
        width: '170px',
        render: (_value, row) => (
          <ProductStockBar percentage={getProductStockMockPercentage(row.id ?? row.sku ?? '')} />
        ),
      },
      {
        header: 'Price',
        accessor: 'base_price',
        width: '140px',
        render: (_value, row) => {
          const value = Number(row.base_price ?? 0);
          const symbol = row.currency === 'USD' ? '$' : '₦';
          return `${symbol}${NGN.format(value)}/${row.unit ?? 'L'}`;
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
    [categoryById],
  );

  const handleDeleteConfirmed = () => {
    if (!pendingDelete?.id) return;
    deleteProduct.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) });
  };

  return (
    <section className="flex flex-col gap-6">
      <PageHeaderContent>
        <ProductSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </PageHeaderContent>

      <header className="flex items-center justify-between flex-wrap gap-3 mt-12 mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-foreground">Product Catalog</h1>
          <p className="text-sm text-[#FAFAFA]">
            Manage pricing, inventory rules and access across your PMS, AGO and DPK catalog
          </p>
        </div>
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

      <ProductCatalogStats products={statsProducts} isLoading={statsProductsQuery.isLoading} />

      {productsQuery.isError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          Couldn't load products. Please try again.
        </div>
      )}

      <ProductFilterBar
        categories={categories}
        selectedCategoryId={categoryId}
        onCategoryChange={setCategoryId}
        selectedStatus={status}
        onStatusChange={setStatus}
      />

      <DefaultTable<product.Product>
        columns={columns}
        data={products}
        itemsPerPage={20}
        entityLabel="Products"
        isLoading={productsQuery.isLoading}
        noDataMessage="No products yet. Add your first one to get started."
        getRowId={(row, index) => row.id ?? index}
        onRowClick={(row) => {
          setSelectedProduct(row);
          setSheetMode('view');
        }}
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
