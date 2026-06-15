import { StatusBadge } from './document-status-badge';

import { documents } from './documents-mock';

interface Props {
  onViewDocument: (document: any) => void;
}

export function DocumentManagementCard({
  onViewDocument,
}: Props) {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#121212] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-white font-medium">
            KYC / IDENTITY
          </h2>

          <div className="h-px w-48 bg-[#2A2A2A]" />
        </div>

        <span className="text-sm text-gray-400">
          {documents.length} Documents
        </span>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.title}
            className="flex items-center justify-between rounded-xl bg-[#181818] p-4"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-white">
                  {doc.title}
                </h3>

                {doc.optional && (
                  <span className="text-xs text-gray-500">
                    (OPTIONAL)
                  </span>
                )}

                <StatusBadge status={doc.status} />
              </div>

              <p className="text-xs text-gray-400">
                {doc.file}
              </p>

              <p className="text-xs text-gray-500">
                Uploaded: {doc.uploaded}
                {doc.expiry && (
                  <> • Expires: {doc.expiry}</>
                )}
              </p>

              {doc.note && (
                <div className="mt-2 inline-block rounded bg-red-500/20 px-3 py-1 text-xs text-red-400">
                  {doc.note}
                </div>
              )}
            </div>

            <button
  onClick={() => onViewDocument(doc)}
  className={`rounded-full px-5 py-2 text-xs font-medium ${
    doc.status === 'approved'
      ? 'bg-[#F4B400] text-black'
      : 'border border-[#F4B400] text-[#F4B400]'
  }`}
>
              {doc.status === 'approved'
                ? 'View Document'
                : 'Re-Upload Document'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}