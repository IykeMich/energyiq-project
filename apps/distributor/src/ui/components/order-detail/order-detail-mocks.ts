import { Check, RefreshCcw, Boxes, Home, type LucideIcon } from 'lucide-react';

// TODO(orval): replace this module with the generated order-detail query hook once the API lands.

/** Full-opacity hue for a status pill; the background reuses it at low opacity. */
export interface OrderDetailBadge {
  label: string;
  color: string;
}

export interface OrderLineItem {
  name: string;
  unitPrice: string;
  amount: string;
  confirmed?: boolean;
}

export interface OrderTimelineStep {
  label: string;
  detail: string;
  done: boolean;
  Icon: LucideIcon;
}

export interface OrderDetailRowData {
  label: string;
  value: string;
}

export interface OrderDetailData {
  orderId: string;
  status: OrderDetailBadge;
  info: {
    orderId: string;
    purchaseDate: string;
    paymentStatus: OrderDetailBadge;
    amount: string;
    paymentMethod: string;
    deliveryStatus: OrderDetailBadge;
    estimatedDeliveryDate: string;
  };
  items: OrderLineItem[];
  timeline: OrderTimelineStep[];
  supplier: OrderDetailRowData[];
  payment: OrderDetailRowData[];
  total: OrderDetailRowData;
  help: { supportEmail: string; emergencyLine: string };
}

const SUCCESS = '#388E3C';
const WARNING = '#FB8C1C';

const ORDER_DETAIL_MOCK: OrderDetailData = {
  orderId: 'ORD-003',
  status: { label: 'Awaiting Approval', color: SUCCESS },
  info: {
    orderId: 'ORD-003',
    purchaseDate: '20 Nov 2025 | 09:45',
    paymentStatus: { label: 'Paid', color: SUCCESS },
    amount: '₦1,150,000',
    paymentMethod: 'Card',
    deliveryStatus: { label: 'Pending', color: WARNING },
    estimatedDeliveryDate: 'N/A',
  },
  items: [
    { name: 'Diesel (AGO) – 10,000 Litres', unitPrice: '₦730', amount: '₦2,000,000' },
    { name: 'Fuel (PMS) – 1,500 Litres', unitPrice: '₦630', amount: '₦100,000' },
    {
      name: 'Lubricant Oil (20L Kegs) – 10 Units',
      unitPrice: '₦5,000',
      amount: '₦50,000',
      confirmed: true,
    },
  ],
  timeline: [
    {
      label: 'Order submitted by distributor',
      detail: '29th Nov 2025; 10:23 AM',
      done: true,
      Icon: Check,
    },
    { label: 'Supplier approval', detail: 'Pending', done: false, Icon: Check },
    { label: 'Payment Verification', detail: 'Pending', done: false, Icon: RefreshCcw },
    { label: 'Dispatch', detail: 'Pending', done: false, Icon: Boxes },
    { label: 'Delivery', detail: 'Pending', done: false, Icon: Home },
  ],
  supplier: [
    { label: 'Name:', value: 'TotalEnergy Depot' },
    { label: 'Email Address:', value: 'totalenergy12@yahoo.com' },
    { label: 'Phone Number:', value: '(+234) 70 8974 6721' },
    { label: 'Order Note:', value: 'N/A' },
    { label: 'Depot Location:', value: 'Lagos Main Depot' },
  ],
  payment: [
    { label: 'Subtotal:', value: '₦2,150,000' },
    { label: 'Discount:', value: '₦0' },
    { label: 'Shipping Fee:', value: '₦1,000' },
    { label: 'Tax:', value: '₦0' },
  ],
  total: { label: 'Total:', value: '₦2,151,000' },
  help: { supportEmail: 'support@premiumpetro.ng', emergencyLine: '+2348001234567' },
};

/** Returns the (single) mock order detail, stamped with the requested id. */
export function getOrderDetail(id: string): OrderDetailData {
  return {
    ...ORDER_DETAIL_MOCK,
    orderId: id,
    info: { ...ORDER_DETAIL_MOCK.info, orderId: id },
  };
}
