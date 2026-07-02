import { PAYMENT_DELAY_TIME_MOCK, PAYMENT_SUCCESS_BREAKDOWN_MOCK } from './trading-analytics-mocks';

export function TradingPaymentPerformance() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h4 className="text-sm font-medium text-white mb-4">Payment Delay Time</h4>
        <div className="space-y-4">
          {PAYMENT_DELAY_TIME_MOCK.map((item) => (
            <div key={item.bucket}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-white">{item.bucket}</span>
                <span className="text-sm text-white">{item.percentage}%</span>
              </div>
              <div className="h-2 bg-[#6161611A] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-white mb-4">Payment Success Breakdown</h4>
        <div className="space-y-4">
          {PAYMENT_SUCCESS_BREAKDOWN_MOCK.map((item) => (
            <div key={item.method} className="bg-[#FFFFFF1A] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{item.method}</span>
                <span className="text-sm text-[#FFFFFFCC]">Usage: {item.usage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#FFFFFFCC]">Success Rate</span>
                <span className="text-lg font-bold text-success">{item.success_rate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
