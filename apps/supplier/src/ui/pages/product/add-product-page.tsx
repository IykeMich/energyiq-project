import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductWizard } from '@/ui/components/product/product-wizard';
import { ProductAddWizardPanel } from '@/ui/components/product/product-add-wizard-panel';

/** Full-page host for the product wizard: "Create New Product" (`/products/new`) and direct links to "Edit Product" (`/products/:id/edit`). */
export function AddProductPage() {
  const navigate = useNavigate();
  const { slug = '', id: productId } = useParams<{ slug: string; id?: string }>();
  const isEditMode = Boolean(productId);

  if (isEditMode) {
    return (
      <section className="flex flex-col gap-6">
        <header className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate(`/${slug}/products`)}
            aria-label="Back to products"
            className="tap-effect w-[31px] h-[31px] rounded-full bg-brand text-brand-foreground flex items-center justify-center transition-opacity hover:opacity-90"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-semibold text-foreground">Edit Product</h1>
        </header>

        <ProductWizard
          mode="edit"
          productId={productId}
          onCancel={() => navigate(`/${slug}/products`)}
          onGoHome={() => navigate(`/${slug}/dashboard`)}
          onViewProducts={() => navigate(`/${slug}/products`)}
        />
      </section>
    );
  }

  return <ProductAddWizardPanel onCancel={() => navigate(`/${slug}/products`)} />;
}
