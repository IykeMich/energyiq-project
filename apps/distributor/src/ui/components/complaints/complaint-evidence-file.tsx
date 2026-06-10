import type { ComplaintEvidenceFile as ComplaintEvidenceFileData } from './complaints-mocks';

interface ComplaintEvidenceFileProps {
  file: ComplaintEvidenceFileData;
}

/** Gold-thumbnail file card shown in the detail sheet's "Evidence" grid. */
export function ComplaintEvidenceFile({ file }: ComplaintEvidenceFileProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#FFFFFF1A] p-3">
      <span className="h-12 w-12 shrink-0 rounded-xl bg-[#FBC02D]" aria-hidden="true" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-sm font-medium text-[#FAFAFA]">{file.name}</span>
        <span className="text-xs text-[#FFFFFFCC]">{file.size}</span>
      </div>
    </div>
  );
}
