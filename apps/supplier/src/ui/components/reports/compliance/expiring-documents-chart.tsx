import { EXPIRING_DOCUMENTS_MOCK } from './compliance-mocks';

export function ExpiringDocumentsChart() {
  return (
    <div className="flex flex-col gap-4">
      {EXPIRING_DOCUMENTS_MOCK.map((doc) => {
        const isExpired = doc.status === 'expired';
        const isExpiringSoon = doc.status === 'expiring-soon';
        const barColor = isExpired ? '#EF4444' : isExpiringSoon ? '#F57C00' : '#22C55E';
        const maxDays = 30;
        const width = isExpired ? 100 : Math.min((doc.daysRemaining / maxDays) * 100, 100);

        return (
          <div key={doc.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#FAFAFA]">
                {doc.distributor} ({doc.document})
              </span>
              <span
                className={`font-medium ${
                  isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-500' : 'text-emerald-500'
                }`}
              >
                {isExpired ? 'Expired' : `${doc.daysRemaining} Days`}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#6161611A]">
              <div
                className="h-full rounded-full"
                style={{ width: `${width}%`, backgroundColor: barColor }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
