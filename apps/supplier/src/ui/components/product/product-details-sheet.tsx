import { Sheet, SheetContent } from '@energyiq/ui';
import { buildProductDetail, type Product } from '@/ui/pages/product/mocks';
import { ProductDetailsHeader } from './product-details-header';
import { ProductDetailsInfo } from './product-details-info';
import { ProductDetailsAttributes } from './product-details-attributes';
import { ProductDetailsVariants } from './product-details-variants';

interface ProductDetailsSheetProps {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (product: Product) => void;
}

/** Right slide-over showing a single product's full detail (info, attributes, variants). */
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
        {product && (
          <ProductDetailsBody
            key={product.id}
            product={product}
            onClose={() => onOpenChange(false)}
            onEdit={() => onEdit(product)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

interface ProductDetailsBodyProps {
  product: Product;
  onClose: () => void;
  onEdit: () => void;
}

/** Inner content, keyed by product id so any per-product state resets on selection. */
function ProductDetailsBody({ product, onClose, onEdit }: ProductDetailsBodyProps) {
  // TODO(orval): replace with getProductDetail(product.id) (enabled when the sheet opens).
  const detail = buildProductDetail(product);

  const handlePause = () => {
    // TODO(orval): replace with pauseProduct(product.id) status toggle.
  };

  return (
    <>
      <div className="shrink-0 px-8 pt-8 pb-4">
        <ProductDetailsHeader
          product={product}
          onClose={onClose}
          onEdit={onEdit}
          onPause={handlePause}
        />
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="flex h-full flex-col gap-6 overflow-y-auto overscroll-contain px-8 py-6">
          <ProductDetailsInfo product={product} detail={detail} />
          <ProductDetailsAttributes attributes={detail.attributes} />
          <ProductDetailsVariants variants={detail.variants} />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-[#121212]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-[#121212]" />
      </div>
    </>
  );
}
