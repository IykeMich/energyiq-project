import { Sheet, SheetContent, SheetTitle } from '@energyiq/ui';
import { ComplaintsStatusBadge } from './complaints-status-badge';
import { ComplaintCloseButton } from './complaint-close-button';
import { ComplaintDetailRow } from './complaint-detail-row';
import { ComplaintEvidenceFile } from './complaint-evidence-file';
import { ComplaintTimeline } from './complaint-timeline';
import type { ComplaintDetail } from './complaints-mocks';

interface ComplaintDetailSheetProps {
  complaint: ComplaintDetail | null;
  onOpenChange: (open: boolean) => void;
}

/** Right slide-in panel showing a single complaint's full detail. */
export function ComplaintDetailSheet({ complaint, onOpenChange }: ComplaintDetailSheetProps) {
  return (
    <Sheet open={complaint !== null} onOpenChange={onOpenChange}>
      {/* Tall frame holding a fixed header and a scrolling body whose content
          cuts crisply behind solid top/bottom bands (never touching the edges). */}
      <SheetContent
        side="right"
        showClose={false}
        overlayClassName="bg-[#121212]/40"
        className="inset-y-3 mr-4 h-auto w-full gap-0 overflow-hidden rounded-[28px] border-l-0 bg-[#121212] p-0 sm:max-w-[560px]"
      >
        {complaint && (
          <>
            {/* Fixed header */}
            <div className="shrink-0 px-8 pt-8 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-1 rounded-full bg-[#FBC02D]" aria-hidden="true" />
                  <SheetTitle className="text-2xl font-bold text-[#FAFAFA]">
                    {complaint.id}
                  </SheetTitle>
                  <ComplaintsStatusBadge status={complaint.status} />
                </div>
                <ComplaintCloseButton onClick={() => onOpenChange(false)} />
              </div>
              <h2 className="mt-4 text-xl font-bold text-[#FAFAFA]">{complaint.title}</h2>
            </div>

            {/* Scrolling body — solid bands cover the top/bottom so content cuts
                crisply behind them, leaving a clean gap at each edge. */}
            <div className="relative min-h-0 flex-1">
              <div className="h-full overflow-y-auto overscroll-contain px-8 py-6">
                <section className="flex flex-col gap-4">
                  <p className="text-sm text-[#FFFFFFCC]">Complaint Details:</p>
                  <div className="flex flex-col gap-4 px-3">
                    <ComplaintDetailRow label="Order Ref:" value={complaint.orderRef} />
                    <ComplaintDetailRow label="Product:" value={complaint.product} />
                    <ComplaintDetailRow label="Date Raised:" value={complaint.dateRaised} />
                    <ComplaintDetailRow label="Quantity Affected:" value={complaint.quantityAffected} />
                    <ComplaintDetailRow label="Estimated Amount:" value={complaint.estimatedAmount} />
                    <ComplaintDetailRow label="Supplier:" value={complaint.supplier} />
                  </div>
                </section>

                <hr className="my-6 border-[#FFFFFF1A]" />

                <section className="flex flex-col gap-3">
                  <p className="text-sm text-[#FFFFFFCC]">Description:</p>
                  <p className="rounded-2xl bg-[#FBC02D1A] px-5 py-4 text-sm leading-relaxed text-[#FBC02D]">
                    {complaint.description}
                  </p>
                </section>

                <hr className="my-6 border-[#FFFFFF1A]" />

                <section className="flex flex-col gap-3">
                  <p className="text-sm text-[#FFFFFFCC]">Evidence ({complaint.evidence.length} Files):</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {complaint.evidence.map((file) => (
                      <ComplaintEvidenceFile key={file.name} file={file} />
                    ))}
                  </div>
                </section>

                <section className="mt-8 flex flex-col gap-4">
                  <p className="text-sm text-[#FFFFFFCC]">Activity Timeline:</p>
                  <ComplaintTimeline entries={complaint.timeline} />
                </section>
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-[#121212]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-[#121212]"
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
