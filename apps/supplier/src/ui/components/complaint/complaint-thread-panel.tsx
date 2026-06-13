import { useState } from 'react';
import { ComplaintDetailTabs, type ComplaintTab } from './complaint-detail-tabs';
import { ComplaintSlaBanner } from './complaint-sla-banner';
import { ComplaintThreadMessage } from './complaint-thread-message';
import { ComplaintQuickResponse } from './complaint-quick-response';
import { ComplaintTimeline } from './complaint-timeline';
import { ComplaintDocuments } from './complaint-documents';
import type {
  ComplaintDocument,
  ComplaintThreadMessage as ThreadMessage,
  ComplaintTimelineEvent,
} from '@/ui/pages/complaint/mocks';

interface ComplaintThreadPanelProps {
  slaBanner: string;
  thread: ThreadMessage[];
  timeline: ComplaintTimelineEvent[];
  documents: ComplaintDocument[];
  onSendResponse: (message: string) => void;
}

/** Left column of the details view: the tabbed conversation with the distributor. */
export function ComplaintThreadPanel({
  slaBanner,
  thread,
  timeline,
  documents,
  onSendResponse,
}: ComplaintThreadPanelProps) {
  const [activeTab, setActiveTab] = useState<ComplaintTab>('threads');

  return (
    <section className="flex min-h-[560px] flex-col gap-5 rounded-[28px] bg-[#6161611A] p-7">
      <ComplaintDetailTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* The SLA banner stays pinned across every tab. */}
      <ComplaintSlaBanner message={slaBanner} />

      {activeTab === 'threads' && (
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-1 flex-col gap-6">
            {thread.map((message, index) => (
              <ComplaintThreadMessage key={`${message.author}-${index}`} message={message} />
            ))}
          </div>
          <ComplaintQuickResponse onSend={onSendResponse} />
        </div>
      )}

      {activeTab === 'timeline' && <ComplaintTimeline events={timeline} />}
      {activeTab === 'documents' && <ComplaintDocuments documents={documents} />}
    </section>
  );
}
