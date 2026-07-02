import { DOCUMENT_STATUS_MOCK } from './compliance-mocks';
import { ReportStatusBadge } from '../report-status-badge';

export function DocumentStatusList() {
  return (
    <div className="flex flex-col gap-4">
      {DOCUMENT_STATUS_MOCK.map((doc) => (
        <div
          key={doc.type}
          className="flex items-center justify-between gap-4 rounded-2xl border border-[#616161B2] bg-[#FFFFFF1A] p-4"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#FAFAFA]">{doc.type}</span>
            <span className="text-xs text-[#9E9E9E]">{doc.category}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <ReportStatusBadge status={doc.status} />
            {doc.note && <span className="text-xs text-[#9E9E9E]">{doc.note}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
