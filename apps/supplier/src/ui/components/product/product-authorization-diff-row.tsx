import type { approval } from '@energyiq/domain';

export function ProductAuthorizationDiffRow({ change }: { change: approval.ReviewChange }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-[#616161B2] px-4 py-3">
      <div className="flex w-[350px] flex-col text-sm text-[#FAFAFA]">
        <span>{change.field}</span>
      </div>

      <div className="flex w-[233px] items-center gap-1.5 rounded-[10px] bg-[#6161611A] px-3 py-2">
        <span className="text-sm text-[#FAFAFA]">{change.current || '—'}</span>
      </div>

      <div className="flex w-[390px] items-center gap-1.5 rounded-[10px] bg-[#388E3C1A] px-3 py-2.5">
        <span className="text-sm text-[#388E3C]">{change.proposed || '—'}</span>
      </div>
    </div>
  );
}
