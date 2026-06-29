import { documents } from './documents-mock';
import { StatusBadge } from './document-status-badge';

interface Props {
  onViewDocument: (document: any) => void;
}

export function DocumentManagementCard({
  onViewDocument,
}: Props) {
  return (
    <div className="w-full"> <div className="mb-5"> <h1 className="text-[28px] font-semibold text-white">
Document Management </h1>


    <p className="mt-1 text-sm text-[#8A8A8A]">
      Compliance Centre
    </p>
  </div>

  <div className="relative rounded-[18px] border border-[#3A3A3A] bg-[#111111] p-4">
    <div className="absolute -top-2.5 left-3 bg-[#111111] px-2">
      <span className="text-[12px] font-medium text-white">
        KYC / IDENTITY
      </span>
    </div>

    <div className="absolute -top-2.25 right-3 bg-[#111111] px-2">
      <span className="text-[11px] text-[#727272]">
        {documents.length} Documents
      </span>
    </div>

    <div className="space-y-3">
      {documents.map((doc) => (
        <div
          key={doc.title}
          className="rounded-xl bg-[#191919] px-5 py-4"
        >
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[15px] text-white">
                  {doc.title}
                </h3>

                {doc.optional && (
                  <span className="text-[10px] uppercase text-[#707070]">
                    (OPTIONAL)
                  </span>
                )}

                <StatusBadge status={doc.status} />
              </div>

              <div className="mt-1 text-[11px] text-[#A5A5A5]">
                {doc.file}
              </div>

              <div className="mt-1 text-[10px] text-[#757575]">
                Uploaded {doc.uploaded}
                {doc.expiry &&
                  ` • Expired ${doc.expiry}`}
              </div>

              {doc.note && (
                <div className="mt-2 inline-flex rounded bg-[#421414] px-3 py-1 text-[10px] text-[#E45B5B]">
                  {doc.note}
                </div>
              )}
            </div>

            <button
              onClick={() =>
                onViewDocument(doc)
              }
              className={`h-8 rounded-full px-5 text-[11px] font-medium ${
                doc.status === 'approved' ||
                doc.status === 'pending'
                  ? 'bg-[#F4BE2A] text-black'
                  : 'border border-[#F4BE2A] text-[#F4BE2A]'
              }`}
            >
              {doc.status === 'rejected' ||
              doc.status === 'expiring'
                ? 'Re-Upload Document'
                : 'View Document'}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>


);
}
