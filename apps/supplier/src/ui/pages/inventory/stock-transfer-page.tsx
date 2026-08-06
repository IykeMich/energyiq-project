import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingOverlay, SuccessModal } from '@energyiq/ui';
import {
  useWarehousesQuery,
  useCreateStockTransferMutation,
} from '@/hooks/use-warehouses';
import { toWarehouseViewModel } from './mocks';
import {
  WarehouseStockTransfer,
  type StockTransferPayload,
} from '@/ui/components/warehouse/warehouse-stock-transfer';
import { ConfirmTransferModal } from '@/ui/components/warehouse/confirm-transfer-modal';

export function StockTransferPage() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const { data: warehousesResult } = useWarehousesQuery();
  const createTransferMutation = useCreateStockTransferMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [payload, setPayload] = useState<StockTransferPayload | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const backToInventory = () => navigate(`/${slug}/inventory`);

  const warehouses = useMemo(
    () => (warehousesResult ?? []).map(toWarehouseViewModel),
    [warehousesResult],
  );

  const handleReview = (next: StockTransferPayload) => {
    setPayload(next);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!payload) return;
    setConfirmOpen(false);
    createTransferMutation.mutate(
      {
        product_id: payload.productId,
        from_warehouse_id: payload.fromId,
        to_warehouse_id: payload.toId,
        quantity: Number.parseFloat(payload.quantity) || 0,
        notes: payload.notes,
      },
      {
        onSuccess: () => setSuccessOpen(true),
      },
    );
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={backToInventory}
          aria-label="Back to inventory"
          className="w-[31px] h-[31px] rounded-full bg-brand text-brand-foreground flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Stock Transfer</h1>
          <p className="text-sm text-foreground/70 mt-1">
            Move stock between warehouses with automatic inventory adjustments.
          </p>
        </div>
      </header>

      <WarehouseStockTransfer
        key={resetKey}
        warehouses={warehouses}
        onCancel={backToInventory}
        onReview={handleReview}
      />

      <ConfirmTransferModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        payload={payload}
        onBack={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />

      <SuccessModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        tone="brand"
        buttonLayout="row"
        title="Transfer initiated"
        subtitle="Stock transfer logged and inventory updated for both warehouses."
        primaryAction={{ label: 'Done', onClick: backToInventory }}
        secondaryAction={{
          label: 'New Transfer',
          onClick: () => {
            setSuccessOpen(false);
            setPayload(null);
            setResetKey((key) => key + 1);
          },
        }}
      />

      {createTransferMutation.isPending && <LoadingOverlay message="Processing Transfer..." />}
    </section>
  );
}
