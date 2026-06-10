import { Pencil } from 'lucide-react';

interface ProductDetailsEditHeadingProps {
  title: string;
  onEdit?: () => void;
}

/** Section heading with a trailing edit pencil (used by Attributes and Variants). */
export function ProductDetailsEditHeading({ title, onEdit }: ProductDetailsEditHeadingProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-[#FFFFFFCC]">{title}</p>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${title.toLowerCase()}`}
        className="tap-effect text-[#FBC02D] hover:opacity-80"
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
