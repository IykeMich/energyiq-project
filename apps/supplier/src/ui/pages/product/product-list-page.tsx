import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog, DataGrid, type ColDef } from '@energyiq/ui';
import type { product } from '@energyiq/domain';
import { useProductsQuery, useDeleteProductMutation } from '@/hooks/use-products';
import { ProductStatusBadge } from '@/ui/components/product/product-status-badge';
import { ProductFilterBar } from '@/ui/components/product/product-filter-bar';
import { ProductActionsCell } from '@/ui/components/product/product-actions-cell';
import { AssignWarehouseWizardModal } from '@/ui/components/product/assign-warehouse-wizard-modal';
import { ProductDetailsSheet } from '@/ui/components/product/product-details-sheet';

const NGN = new Intl.NumberFormat('en-NG');

export function ProductListPage() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const [pendingDelete, setPendingDelete] = useState<product.Product | null>(null);
  const [assignWarehouseOpen, setAssignWarehouseOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<product.Product | null>(null);
  const [sheetMode, setSheetMode] = useState<'view' | 'edit'>('view');

  const productsQuery = useProductsQuery();
  const deleteProduct = useDeleteProductMutation();

  const products = productsQuery.data?.items ?? [];
  const isEmpty = productsQuery.isSuccess && products.length === 0;

  const columnDefs = useMemo<ColDef<product.Product>[]>(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 48,
        flex: 0,
        sortable: false,
        filter: false,
        resizable: false,
      },
      { field: 'name', headerName: 'Product', minWidth: 160 },
      { field: 'sku', headerName: 'SKU', width: 120, flex: 0 },
      { field: 'unit', headerName: 'Unit', width: 80, flex: 0 },
      {
        headerName: 'Default Price',
        width: 140,
        flex: 0,
        valueGetter: (p) => {
          const value = Number(p.data?.base_price ?? 0);
          const symbol = p.data?.currency === 'USD' ? '$' : '₦';
          return `${symbol}${NGN.format(value)}`;
        },
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
        flex: 0,
        cellRenderer: (p: { value?: string }) => <ProductStatusBadge value={p.value ?? 'draft'} />,
      },
      {
        headerName: 'Action',
        width: 110,
        flex: 0,
        sortable: false,
        filter: false,
        cellRenderer: (p: { data: product.Product }) => (
          <ProductActionsCell
            product={p.data}
            onEdit={(prod) => {
              setSelectedProduct(prod);
              setSheetMode('edit');
            }}
            onDelete={(prod) => setPendingDelete(prod)}
          />
        ),
        // Clicking the edit/delete icons must not also trigger onRowClicked
        // (which opens the details sheet) — see onRowClicked below.
        cellRendererParams: { suppressMouseEventHandling: () => true },
      },
    ],
    [],
  );

  const handleDeleteConfirmed = () => {
    if (!pendingDelete?.id) return;
    deleteProduct.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) });
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
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

      <ProductFilterBar />

      {productsQuery.isError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          Couldn't load products. Please try again.
        </div>
      )}

      {isEmpty ? (
        <div className="flex h-[300px] items-center justify-center rounded-[18px] bg-surface-card text-muted-foreground">
          No products yet. Add your first one to get started.
        </div>
      ) : (
        <DataGrid<product.Product>
          rowData={products}
          columnDefs={columnDefs}
          rowSelection="multiple"
          rowHeight={56}
          loading={productsQuery.isLoading}
          suppressRowClickSelection
          onRowClicked={(event) => {
            if (event.isEventHandlingSuppressed) return;
            setSelectedProduct(event.data ?? null);
            setSheetMode('view');
          }}
          className="h-[640px] bg-surface-card rounded-[18px] overflow-hidden cursor-pointer"
        />
      )}

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
