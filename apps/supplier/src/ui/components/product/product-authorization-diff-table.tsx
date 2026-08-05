import type { approval } from '@energyiq/domain';
import { ProductAuthorizationDiffRow } from './product-authorization-diff-row';

export function ProductAuthorizationDiffTable({ changes }: { changes: approval.ReviewChange[] }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[18px] bg-[#6161611A]">
      <div className="flex items-center justify-between gap-4 bg-[#FBC02D1A] px-4 py-3">
        <span className="w-[350px] text-base font-semibold text-[#FAFAFA]">Field</span>
        <span className="w-[233px] text-base font-semibold text-[#FAFAFA]">Current</span>
        <span className="w-[390px] text-base font-semibold text-[#FAFAFA]">Proposed</span>
      </div>

      {changes.map((change, index) => (
        <ProductAuthorizationDiffRow key={change.field ?? index} change={change} />
      ))}
    </div>
  );
}
