import { formatNaira, TRADING_ACCOUNT } from './create-order-mocks';

/**
 * Highlighted trading-account card that sits above the Order Summary: a gold
 * border over a gold-tinted panel, the balance in large type, and the account
 * status pill.
 */
export function CreateOrderTradingBalanceCard() {
  return (
    <div className="flex flex-col gap-4 rounded-[23px] border border-[#FBC02D] bg-[#FBC02D1A] p-8">
      <span className="text-lg font-medium text-[#FAFAFA]">Trading Account Balance:</span>
      <div className="flex items-center justify-between gap-4">
        <span className="text-3xl font-bold text-white">{formatNaira(TRADING_ACCOUNT.balance)}</span>
        <span className="rounded-full bg-[#388E3C33] px-5 py-2 text-base font-medium text-[#388E3C]">
          {TRADING_ACCOUNT.status}
        </span>
      </div>
    </div>
  );
}
