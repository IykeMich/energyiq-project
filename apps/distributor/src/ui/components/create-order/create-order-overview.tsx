import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { order } from '@energyiq/domain';
import { SuccessModal, toast } from '@energyiq/ui';
import {
  useCreateOrderMutation,
  useOrderQuery,
  useUpdateOrderMutation,
} from '@/hooks/use-orders';
import { PageHeaderContent } from '@/ui/layouts/page-header';
import { OrdersSearchBar } from '../orders/orders-search-bar';
import { CreateOrderInformationCard } from './create-order-information-card';
import { CreateOrderProductsCard, type CreateOrderLineItem } from './create-order-products-card';
import { CreateOrderDeliveryCard } from './create-order-delivery-card';
import { CreateOrderTradingBalanceCard } from './create-order-trading-balance-card';
import { CreateOrderStatusBanner } from './create-order-status-banner';
import { CreateOrderBindingNotice } from './create-order-binding-notice';
import { CreateOrderLoadingOverlay } from './create-order-loading-overlay';
import {
  CreateOrderSummaryCard,
  type CreateOrderSummaryData,
} from './create-order-summary-card';
import {
  DEFAULT_DELIVERY_CONTACT,
  DEFAULT_DELIVERY_DATE,
  DEFAULT_DELIVERY_METHOD_ID,
  DEFAULT_SUPPLIER_ID,
  DELIVERY_METHODS,
  GOLD_DISCOUNT_RATE,
  ORDER_REFERENCE,
  PRODUCT_CATALOG,
  SUBMITTED_ORDER_REFERENCE,
  // SUMMARY_PRODUCT_IDS,
  SUPPLIER_OPTIONS,
  type CreateOrderDeliveryContact as DeliveryContact,
} from './create-order-mocks';
import type { CreateOrderProductOption } from './create-order-mocks';

interface CreateOrderOverviewProps {
  /** 'create' starts blank; 'edit' seeds the form from the order being edited. */
  mode?: 'create' | 'edit';
  /** The order id from the route, used to load the edit fixture. */
  orderId?: string;
}

/** Which action opened the success modal — drives its copy. */
type SuccessKind = 'submitted' | 'draft';

interface SuccessContent {
  title: string;
  subtitle: ReactNode;
  highlight?: { label: string; value: string };
  primaryAction: { label: string; onClick: () => void };
  secondaryAction: { label: string; onClick: () => void };
}

/**
 * Shared order form used for both creating and editing an order. The left column
 * builds the order (info → products → delivery); the right column shows a
 * live-computed summary. In edit mode the form is seeded with the order's current
 * values and a "Pending" banner is shown. Everything is driven by local state for
 * now — swap the mocks/handlers for the generated hooks (see TODO(orval) markers
 * in create-order-mocks.ts) once the API lands.
 */
export function CreateOrderOverview({ mode = 'create', orderId }: CreateOrderOverviewProps) {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const isEditMode = mode === 'edit';
  const {
    data: existingOrder,
    isLoading: isLoadingOrder,
  } = useOrderQuery(orderId ?? '', { enabled: isEditMode && Boolean(orderId) });
  const orderReference = existingOrder?.order_number ?? orderId ?? ORDER_REFERENCE;

  // TODO(orval): wire this search to the global order search once the API lands.
  const [searchQuery, setSearchQuery] = useState('');
  const [supplierId, setSupplierId] = useState(DEFAULT_SUPPLIER_ID);
  const [deliveryDate, setDeliveryDate] = useState(DEFAULT_DELIVERY_DATE);
  const [lineItems, setLineItems] = useState<CreateOrderLineItem[]>([]);
  const [deliveryMethodId, setDeliveryMethodId] = useState(DEFAULT_DELIVERY_METHOD_ID);
  const [contact, setContact] = useState<DeliveryContact>(DEFAULT_DELIVERY_CONTACT);
  const [successKind, setSuccessKind] = useState<SuccessKind | null>(null);
  const [successOrder, setSuccessOrder] = useState<order.Order | null>(null);

  // Seed the edit form from the order being edited once it loads.
  useEffect(() => {
    if (!existingOrder) return;
    setLineItems(toLineItems(existingOrder.items));
  }, [existingOrder]);

  const createMutation = useCreateOrderMutation();
  const updateMutation = useUpdateOrderMutation();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const closeSuccess = () => {
    setSuccessKind(null);
    setSuccessOrder(null);
  };

  const goToOrders = () => navigate(`/${slug}/orders`);
  const goToHome = () => navigate(`/${slug}/dashboard`);

 const addProduct = (product: CreateOrderProductOption) => {
  if (lineItems.some((item) => item.productId === product.id)) {
    return;
  }

  setLineItems((items) => [
    ...items,
    {
      productId: product.id,
      name: product.name,
      unit: product.unit,
      unitPrice: product.unitPrice,
      quantity: 1,
    },
  ]);
};

  const changeQuantity = (productId: string, quantity: number) => {
    setLineItems((items) =>
      items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    );
  };

  const removeProduct = (productId: string) => {
    setLineItems((items) => items.filter((item) => item.productId !== productId));
  };

  const isEmpty = lineItems.length === 0;

const summary = useMemo<CreateOrderSummaryData>(() => {
  let subtotal = 0;
  let discount = 0;

  const lineItemsSummary = lineItems.map((item) => {
    const lineTotal = item.unitPrice * item.quantity;

    subtotal += lineTotal;

    // If every product gets the Gold discount
    discount += lineTotal * GOLD_DISCOUNT_RATE;

    return {
      label: `${item.name} × ${item.quantity}${item.unit}`,
      amount: lineTotal,
    };
  });

  const deliveryFee =
    DELIVERY_METHODS.find((method) => method.id === deliveryMethodId)?.fee ?? 0;

  const total = subtotal - discount + deliveryFee;

  return {
    lineItems: lineItemsSummary,
    subtotal,
    discount,
    deliveryFee,
    total,
    // TODO(orval): Replace with backend balance when available.
    balance: total,
  };
}, [lineItems, deliveryMethodId]);

  const buildOrderItems = () =>
    lineItems.map((item) => ({ product_id: item.productId, quantity: item.quantity }));

  const handleSubmit = () => {
    if (isEmpty) return;

    if (isEditMode && orderId) {
      updateMutation.mutate(
        {
          id: orderId,
          req: { items: buildOrderItems(), reason: 'Order modified by distributor' },
        },
        {
          onSuccess: (data) => {
            setSuccessOrder(data);
            setSuccessKind('submitted');
          },
          onError: (error: Error) => {
            toast.error('Update failed', { description: error.message });
          },
        },
      );
      return;
    }

    createMutation.mutate(
      {
        items: buildOrderItems(),
        notes: `Delivery method: ${deliveryMethodId}. Contact: ${contact.contactPerson}, ${contact.email}, ${contact.address}`,
      },
      {
        onSuccess: (data) => {
          setSuccessOrder(data);
          setSuccessKind('submitted');
        },
        onError: (error: Error) => {
          toast.error('Create failed', { description: error.message });
        },
      },
    );
  };

  const handleSaveDraft = () => {
    // Draft persistence is not supported by the current order API.
    toast.info('Draft saved locally', {
      description: 'Draft orders are not persisted to the backend yet.',
    });
    setSuccessKind('draft');
  };

  const supplierName =
    SUPPLIER_OPTIONS.find((supplier) => supplier.id === supplierId)?.name ?? 'the supplier';

  const successContent: SuccessContent =
    successKind === 'submitted'
      ? isEditMode
        ? {
            title: 'Changes Saved',
            subtitle: (
              <>
                Your changes to order{' '}
                <span className="font-medium text-brand">{orderReference}</span> have been saved.
                The supplier will see the updated order.
              </>
            ),
            highlight: { label: 'Order Reference:', value: orderReference },
            primaryAction: { label: 'View Order', onClick: goToOrders },
            secondaryAction: { label: 'Go to Home', onClick: goToHome },
          }
        : {
            title: 'Order Submitted Successfully!',
            subtitle: (
              <>
                Your purchase order has been sent to{' '}
                <span className="font-medium text-brand">{supplierName}</span>. You&apos;ll receive
                a confirmation once reviewed.
              </>
            ),
            highlight: {
              label: 'Order Reference:',
              value:
                successOrder?.order_number ??
                createMutation.data?.order_number ??
                SUBMITTED_ORDER_REFERENCE,
            },
            primaryAction: { label: 'Track Order', onClick: goToOrders },
            secondaryAction: { label: 'Go to Home', onClick: goToHome },
          }
      : {
          title: 'Draft Saved',
          subtitle: 'Your order has been saved as a draft. You can finish it anytime from Orders.',
          primaryAction: { label: 'Back to Orders', onClick: goToOrders },
          secondaryAction: { label: 'Go to Home', onClick: goToHome },
        };

  return (
    <>
      <PageHeaderContent>
        <OrdersSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </PageHeaderContent>

      <section className="flex flex-col gap-6">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={goToOrders}
            aria-label="Back to orders"
            className="tap-effect flex h-9 w-9 items-center justify-center rounded-full border border-[#FFFFFF33] text-[#FAFAFA]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <h1 className="text-2xl font-semibold text-[#FAFAFA]">
            {isEditMode ? 'Edit Order' : 'Create New Order'}
          </h1>
        </header>

        <div className="flex ">
        {isEditMode && <CreateOrderStatusBanner status="Pending" />}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.65fr_1fr]">
          {/* Left column: build the order. */}
          <div className="flex flex-col gap-6">
            <CreateOrderInformationCard
              supplierId={supplierId}
              onSupplierChange={setSupplierId}
              deliveryDate={deliveryDate}
              onDeliveryDateChange={setDeliveryDate}
              orderReference={isEditMode ? orderReference : undefined}
            />
            <CreateOrderProductsCard
              lineItems={lineItems}
              onQuantityChange={changeQuantity}
              onRemove={removeProduct}
              onAdd={addProduct}
            />
            <CreateOrderDeliveryCard
              selectedMethodId={deliveryMethodId}
              onMethodChange={setDeliveryMethodId}
              contact={contact}
              onContactChange={setContact}
            />
          </div>

          {/* Right column: highlighted trading balance above the live summary. */}
          <div className="flex flex-col gap-6">
            <CreateOrderTradingBalanceCard />
            <CreateOrderSummaryCard
              summary={summary}
              isEmpty={isEmpty}
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSubmit}
              submitLabel={isEditMode ? 'Save Changes' : 'Create New Order'}
              // isSubmitting={isSubmitting}
              bindingNoticeInline={!isEditMode}
            />
            {isEditMode && <CreateOrderBindingNotice variant="card" />}
          </div>
        </div>
      </section>

      {(isSubmitting || (isEditMode && isLoadingOrder)) && <CreateOrderLoadingOverlay />}

      <SuccessModal
        open={successKind !== null}
        onOpenChange={(open) => !open && closeSuccess()}
        tone="brand"
        buttonLayout="stack"
        title={successContent.title}
        subtitle={successContent.subtitle}
        highlight={successContent.highlight}
        primaryAction={successContent.primaryAction}
        secondaryAction={successContent.secondaryAction}
      />
    </>
  );
}

function toLineItems(items?: order.Order['items']): CreateOrderLineItem[] {
  if (!items) return [];

  if (Array.isArray(items)) {
    return items
      .map((item) => {
        const record = item as Record<string, unknown>;

        const productId = (record.product_id as string) ?? '';
        const quantity = Number(record.quantity ?? 0);

        if (!productId || Number.isNaN(quantity)) return null;

        const product = PRODUCT_CATALOG.find(
          (product) => product.id === productId,
        );

        return {
          productId,
          name: product?.name ?? 'Unknown Product',
          unit: product?.unit ?? '',
          unitPrice: product?.unitPrice ?? 0,
          quantity,
        };
      })
      .filter((item): item is CreateOrderLineItem => item !== null);
  }

  return Object.entries(items).map(([productId, quantity]) => {
    const product = PRODUCT_CATALOG.find(
      (product) => product.id === productId,
    );

    return {
      productId,
      name: product?.name ?? 'Unknown Product',
      unit: product?.unit ?? '',
      unitPrice: product?.unitPrice ?? 0,
      quantity: Number(quantity) || 0,
    };
  });
}
