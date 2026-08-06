import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@energyiq/ui';
import { cn } from '@energyiq/shared';
import type { product as productDomain } from '@energyiq/domain';
import { useProductQuery, useUpdateProductStatusMutation } from '@/hooks/use-products';
import { ProductWizard } from './product-wizard';
import { ProductDetailsHeader } from './product-details-header';
import { ProductDetailsInfo } from './product-details-info';
import { ProductDetailsAttributes } from './product-details-attributes';
import { ProductDetailsVariants } from './product-details-variants';
import { PRODUCT_ATTRIBUTES_MOCK } from './product-catalog-mocks';

type SheetMode = 'view' | 'edit';

interface ProductDetailsSheetProps {
  product: productDomain.Product | null;
  /** Which mode the pane opens in — 'edit' when triggered from the table's pencil icon. */
  initialMode?: SheetMode;
  onOpenChange: (open: boolean) => void;
  /** Success modal's "Go to Home" action, from the edit wizard. */
  onGoHome: () => void;
}

/** Right slide-over: view mode shows a single product's full detail; edit mode hosts the full product wizard in place. */
export function ProductDetailsSheet({ product, initialMode = 'view', onOpenChange, onGoHome }: ProductDetailsSheetProps) {
  const [mode, setMode] = useState<SheetMode>(initialMode);

  // Reset to the requested mode whenever a (possibly new) product opens.
  useEffect(() => {
    if (product) setMode(initialMode);
  }, [product?.id, initialMode]);

  return (
    <Sheet open={product !== null} onOpenChange={onOpenChange}>
      {/* Tall frame: a fixed header over a scrolling body whose content cuts crisply
          behind solid top/bottom bands (never touching the edges). Wider in edit mode
          so the wizard's two-column fields have room to breathe. */}
      <SheetContent
        side="right"
        showClose={false}
        overlayClassName="bg-[#121212]/40"
        className={cn(
          'inset-y-3 mr-4 h-auto w-full gap-0 overflow-hidden rounded-[28px] border-l-0 bg-[#121212] p-0',
          mode === 'edit' ? 'sm:max-w-[760px]' : 'sm:max-w-[480px] lg:max-w-[560px]',
        )}
      >
        {product?.id && (
          <ProductDetailsBody
            key={product.id}
            productId={product.id}
            fallback={product}
            mode={mode}
            onEnterEdit={() => setMode('edit')}
            onExitEdit={() => setMode('view')}
            onClose={() => onOpenChange(false)}
            onGoHome={onGoHome}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

interface ProductDetailsBodyProps {
  productId: string;
  fallback: productDomain.Product;
  mode: SheetMode;
  onEnterEdit: () => void;
  onExitEdit: () => void;
  onClose: () => void;
  onGoHome: () => void;
}

/** Inner content, keyed by product id so any per-product state resets on selection. */
function ProductDetailsBody({ productId, fallback, mode, onEnterEdit, onExitEdit, onClose, onGoHome }: ProductDetailsBodyProps) {
  const productQuery = useProductQuery(productId);
  const updateStatus = useUpdateProductStatusMutation();

  // Show the row data instantly, then swap in the full record once it loads.
  const product = productQuery.data ?? fallback;

  const handleStatusChange = (status: productDomain.ProductStatusUpdateValue) => {
    updateStatus.mutate({ id: productId, status });
  };

  if (mode === 'edit') {
    return (
      <>
        <div className="shrink-0 flex items-center justify-between gap-4 px-8 pt-8 pb-4">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-5 w-1 rounded-full bg-[#FBC02D]" />
            <SheetTitle className="text-lg font-semibold text-[#FAFAFA]">Edit Product</SheetTitle>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product edit"
            className="tap-effect flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FBC02D] text-[#121212] transition-opacity hover:opacity-90"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="relative min-h-0 flex-1">
          <div className="h-full overflow-y-auto overscroll-contain px-8 py-6">
            <ProductWizard
              mode="edit"
              productId={productId}
              onCancel={onExitEdit}
              onGoHome={onGoHome}
              onViewProducts={onClose}
            />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-[#121212]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-[#121212]" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="shrink-0 px-8 pt-8 pb-4">
        <ProductDetailsHeader
          product={product}
          onClose={onClose}
          onEdit={onEnterEdit}
          onStatusChange={handleStatusChange}
          statusChanging={updateStatus.isPending}
        />
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="flex h-full flex-col gap-6 overflow-y-auto overscroll-contain px-8 py-6">
          <ProductDetailsInfo product={product} />
          <ProductDetailsAttributes attributes={PRODUCT_ATTRIBUTES_MOCK} onEdit={onEnterEdit} />
          <ProductDetailsVariants variants={product.variants ?? []} />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-[#121212]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-[#121212]" />
      </div>
    </>
  );
}
