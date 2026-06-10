import type {
  OrderDistributorInfo,
  OrderPaymentBreakdown,
  OrderShippingInfo,
} from '@/ui/pages/order/mocks';

const NGN = new Intl.NumberFormat('en-NG');

interface OrderDistributorCardProps {
  distributor: OrderDistributorInfo;
  shipping: OrderShippingInfo;
  payment: OrderPaymentBreakdown;
  actions: React.ReactNode;
}

export function OrderDistributorCard({
  distributor,
  shipping,
  payment,
  actions,
}: OrderDistributorCardProps) {
  return (
    <section className="bg-surface-card rounded-[28px] p-7 flex flex-col gap-8">
      <Section title="Distributor Details:">
        <Row label="Name:" value={distributor.name} />
        <Row label="Email Address:" value={distributor.email} />
        <Row label="Phone Number:" value={distributor.phone} />
        <Row label="Order Note:" value={distributor.orderNote} />
      </Section>

      <Section title="Shipping Information:">
        <Row label="Email Address:" value={shipping.email} />
        <Row label="Phone Number:" value={shipping.phone} />
      </Section>

      <Section title="Payment Details:">
        <Row label="Subtotal:" value={`₦${NGN.format(payment.subtotal)}`} />
        <Row label="Discount:" value={`₦${NGN.format(payment.discount)}`} />
        <Row label="Shipping Fee:" value={`₦${NGN.format(payment.shipping)}`} />
        <Row label="Tax:" value={`₦${NGN.format(payment.tax)}`} />
        <div className="border-t border-dotted border-border-strong mt-2 pt-3">
          <Row
            label={<span className="font-semibold">Total:</span>}
            value={<span className="font-bold text-foreground">₦{NGN.format(payment.total)}</span>}
          />
        </div>
      </Section>

      <div className="flex flex-col gap-3">{actions}</div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-foreground mb-4">{title}</h3>
      <dl className="flex flex-col gap-3 text-sm text-foreground">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-foreground">{label}</dt>
      <dd className="font-semibold text-right">{value}</dd>
    </div>
  );
}
