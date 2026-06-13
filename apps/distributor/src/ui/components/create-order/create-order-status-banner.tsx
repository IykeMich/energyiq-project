interface CreateOrderStatusBannerProps {
  /** The status word rendered in bold gold within the sentence, e.g. "Pending". */
  status: string;
}

/**
 * Outlined gold notice shown on the Edit Order page: edits are only allowed
 * while the order is still in its editable status.
 */
export function CreateOrderStatusBanner({ status }: CreateOrderStatusBannerProps) {
  return (
    <p className="rounded-full border border-[#FB8C1C] bg-[#FB8C1C33] px-5 py-3 text-sm text-[#FB8C1C]">
      This order can only be edited while its status is{' '}
      <span className="font-semibold text-[#FB8C1C]">{status}</span>. Once the supplier begins
      review, edits will be locked.
    </p>
  );
}
