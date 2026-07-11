import { Sheet, SheetContent } from '@energyiq/ui';
import type { product as productDomain } from '@energyiq/domain';
import { useProductQuery, useUpdateProductStatusMutation } from '@/hooks/use-products';
import { ProductDetailsHeader } from './product-details-header';
import { ProductDetailsInfo } from './product-details-info';
import { ProductDetailsVariants } from './product-details-variants';

interface ProductDetailsSheetProps {
  product: productDomain.Product | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (product: productDomain.Product) => void;
}

/** Right slide-over showing a single product's full detail (info and variants). */
export function ProductDetailsSheet({ product, onOpenChange, onEdit }: ProductDetailsSheetProps) {
  return (
    <Sheet open={product !== null} onOpenChange={onOpenChange}>
      {/* Tall frame: a fixed header over a scrolling body whose content cuts crisply
          behind solid top/bottom bands (never touching the edges). */}
      <SheetContent
        side="right"
        showClose={false}
        overlayClassName="bg-[#121212]/40"
        className="inset-y-3 mr-4 h-auto w-full gap-0 overflow-hidden rounded-[28px] border-l-0 bg-[#121212] p-0 sm:max-w-[480px]"
      >
        {product?.id && (
          <ProductDetailsBody
            key={product.id}
            productId={product.id}
            fallback={product}
            onClose={() => onOpenChange(false)}
            onEdit={() => onEdit(product)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

interface ProductDetailsBodyProps {
  productId: string;
  fallback: productDomain.Product;
  onClose: () => void;
  onEdit: () => void;
}

/** Inner content, keyed by product id so any per-product state resets on selection. */
function ProductDetailsBody({ productId, fallback, onClose, onEdit }: ProductDetailsBodyProps) {
  const productQuery = useProductQuery(productId);
  const updateStatus = useUpdateProductStatusMutation();

  // Show the row data instantly, then swap in the full record once it loads.
  const product = productQuery.data ?? fallback;

  const handlePause = () => {
    updateStatus.mutate({ id: productId, status: 'paused' });
  };

  return (
    <>
      <div className="shrink-0 px-8 pt-8 pb-4">
        <ProductDetailsHeader
          product={product}
          onClose={onClose}
          onEdit={onEdit}
          onPause={handlePause}
          pausing={updateStatus.isPending}
        />
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="flex h-full flex-col gap-6 overflow-y-auto overscroll-contain px-8 py-6">
          <ProductDetailsInfo product={product} />
          <ProductDetailsVariants variants={product.product_variants ?? []} />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-[#121212]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-[#121212]" />
      </div>
    </>
  );
}
