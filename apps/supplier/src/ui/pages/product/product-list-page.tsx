import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog, DataGrid, type ColDef } from '@energyiq/ui';
import { PRODUCTS_MOCK, formatStock, type Product } from './mocks';
import { ProductStatusBadge } from './components/product-status-badge';
import { ProductFilterBar } from './components/product-filter-bar';
import { ProductActionsCell } from './components/product-actions-cell';

const NGN = new Intl.NumberFormat('en-NG');

export function ProductListPage() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS_MOCK);

  const columnDefs = useMemo<ColDef<Product>[]>(
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
      { field: 'category', headerName: 'Category', width: 140, flex: 0 },
      { field: 'unit', headerName: 'Unit', width: 80, flex: 0 },
      {
        headerName: 'Total Stock',
        width: 130,
        flex: 0,
        valueGetter: (p) => (p.data ? formatStock(p.data) : ''),
      },
      {
        field: 'defaultPriceNGN',
        headerName: 'Default Price',
        width: 140,
        flex: 0,
        valueFormatter: (p) => (typeof p.value === 'number' ? `₦${NGN.format(p.value)}` : ''),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
        flex: 0,
        cellRenderer: (p: { value: Product['status'] }) => <ProductStatusBadge value={p.value} />,
      },
      {
        headerName: 'Action',
        width: 110,
        flex: 0,
        sortable: false,
        filter: false,
        cellRenderer: (p: { data: Product }) => (
          <ProductActionsCell
            product={p.data}
            onEdit={(prod) => navigate(`/${slug}/products/${prod.id}/edit`)}
            onDelete={(prod) => setPendingDelete(prod)}
          />
        ),
      },
    ],
    [navigate, slug],
  );

  const handleDeleteConfirmed = () => {
    if (!pendingDelete) return;
    setProducts((prev) => prev.filter((p) => p.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-foreground">Product Catalog</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/${slug}/products/assign-warehouse`)}
            className="h-[46px] px-6 rounded-full border border-brand text-brand font-semibold text-sm"
          >
            Assign to Warehouse
          </button>
          <button
            type="button"
            onClick={() => navigate(`/${slug}/products/new`)}
            className="h-[46px] px-6 rounded-full bg-brand text-brand-foreground font-semibold text-sm"
          >
            Add New Product
          </button>
        </div>
      </header>

      <ProductFilterBar />

      <DataGrid<Product>
        rowData={products}
        columnDefs={columnDefs}
        rowSelection="multiple"
        rowHeight={56}
        suppressRowClickSelection
        className="h-[640px] bg-surface-card rounded-[18px] overflow-hidden"
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
