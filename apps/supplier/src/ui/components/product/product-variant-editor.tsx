import { Plus, Trash2 } from 'lucide-react';
import type { ProductVariantDraft } from '@/ui/pages/product/mocks';
import { TextField } from './wizard-fields';

interface ProductVariantEditorProps {
  variants: ProductVariantDraft[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, patch: Partial<ProductVariantDraft>) => void;
}

/**
 * Variant table shown on the Basic Information tab when the product type is
 * "Product with Variant". Each row captures the variant name, its display
 * name and a cost/selling price pair grouped under "Variant Price".
 */
export function ProductVariantEditor({ variants, onAdd, onRemove, onChange }: ProductVariantEditorProps) {
  return (
    <div className="border-t border-dashed border-border-subtle pt-5 flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onAdd}
          className="tap-effect flex items-center gap-1 text-sm font-semibold text-brand transition-opacity hover:opacity-80"
        >
          <Plus className="w-4 h-4" /> Add Variant
        </button>
      </div>

      <div className="grid grid-cols-[1fr_1fr_1.3fr_auto] gap-x-6 gap-y-4 items-start">
        {/* Header row */}
        <span className="text-sm text-foreground">Variant Name:</span>
        <span className="text-sm text-foreground border-l border-border-subtle pl-6">
          Variant Display Name:
        </span>
        <div className="border-l border-border-subtle pl-6">
          <p className="text-sm text-foreground mb-3">Variant Price:</p>
          <div className="grid grid-cols-2 gap-3">
            <span className="text-xs text-muted-foreground">Cost Price</span>
            <span className="text-xs text-muted-foreground">Selling Price</span>
          </div>
        </div>
        <span aria-hidden />

        {/* Empty state */}
        {variants.length === 0 && (
          <p className="col-span-4 text-sm text-muted-foreground">
            No variants yet. Use “Add Variant” to create one.
          </p>
        )}

        {/* Variant rows */}
        {variants.map((variant) => (
          <Row
            key={variant.id}
            variant={variant}
            onRemove={() => onRemove(variant.id)}
            onChange={(patch) => onChange(variant.id, patch)}
          />
        ))}
      </div>
    </div>
  );
}

interface RowProps {
  variant: ProductVariantDraft;
  onRemove: () => void;
  onChange: (patch: Partial<ProductVariantDraft>) => void;
}

function Row({ variant, onRemove, onChange }: RowProps) {
  return (
    <>
      <TextField
        value={variant.name}
        onChange={(value) => onChange({ name: value })}
        placeholder="e.g. Lubricant X1"
      />
      <div className="border-l border-border-subtle pl-6">
        <TextField
          value={variant.displayName}
          onChange={(value) => onChange({ displayName: value })}
          placeholder="e.g. LUB-X1"
        />
      </div>
      <div className="border-l border-border-subtle pl-6 grid grid-cols-2 gap-3">
        <TextField
          type="number"
          value={variant.costPrice}
          onChange={(value) => onChange({ costPrice: value })}
          placeholder="0.00"
        />
        <TextField
          type="number"
          value={variant.sellingPrice}
          onChange={(value) => onChange({ sellingPrice: value })}
          placeholder="0.00"
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove variant"
        className="tap-effect w-7 h-7 mt-3 rounded-full bg-brand/20 text-brand flex items-center justify-center transition-colors hover:bg-brand/30"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </>
  );
}
