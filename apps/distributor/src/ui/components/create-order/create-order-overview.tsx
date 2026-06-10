import { useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SuccessModal } from '@energyiq/ui';
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
  SUMMARY_PRODUCT_IDS,
  SUPPLIER_OPTIONS,
  getEditOrder,
  type CreateOrderDeliveryContact as DeliveryContact,
} from './create-order-mocks';

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

  // Seed the form from the order being edited (null for the blank create flow).
  const seed = useMemo(
    () => (isEditMode ? getEditOrder(orderId ?? '') : null),
    [isEditMode, orderId],
  );
  const orderReference = seed?.orderReference ?? ORDER_REFERENCE;

  // TODO(orval): wire this search to the global order search once the API lands.
  const [searchQuery, setSearchQuery] = useState('');
  const [supplierId, setSupplierId] = useState(seed?.supplierId ?? DEFAULT_SUPPLIER_ID);
  const [deliveryDate, setDeliveryDate] = useState(seed?.deliveryDate ?? DEFAULT_DELIVERY_DATE);
  const [lineItems, setLineItems] = useState<CreateOrderLineItem[]>(seed?.lineItems ?? []);
  const [deliveryMethodId, setDeliveryMethodId] = useState(
    seed?.deliveryMethodId ?? DEFAULT_DELIVERY_METHOD_ID,
  );
  const [contact, setContact] = useState<DeliveryContact>(seed?.contact ?? DEFAULT_DELIVERY_CONTACT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successKind, setSuccessKind] = useState<SuccessKind | null>(null);

  const goToOrders = () => navigate(`/${slug}/orders`);
  const goToHome = () => navigate(`/${slug}/dashboard`);

  const addProduct = (productId: string) => {
    const product = PRODUCT_CATALOG.find((candidate) => candidate.id === productId);
    if (!product || lineItems.some((item) => item.productId === productId)) return;
    setLineItems((items) => [...items, { productId, quantity: product.moq }]);
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
    // Per-product subtotal + quantity lookups keyed by product id.
    const subtotalByProduct = new Map<string, number>();
    const quantityByProduct = new Map<string, number>();
    let subtotal = 0;
    let discount = 0;

    for (const item of lineItems) {
      const product = PRODUCT_CATALOG.find((candidate) => candidate.id === item.productId);
      if (!product) continue;
      const lineTotal = product.unitPrice * item.quantity;
      subtotalByProduct.set(item.productId, lineTotal);
      quantityByProduct.set(item.productId, item.quantity);
      subtotal += lineTotal;
      if (product.goldDiscount) discount += lineTotal * GOLD_DISCOUNT_RATE;
    }

    const deliveryFee = DELIVERY_METHODS.find((method) => method.id === deliveryMethodId)?.fee ?? 0;
    const total = subtotal - discount + deliveryFee;

    const fuelLineItems = SUMMARY_PRODUCT_IDS.map((productId) => {
      const product = PRODUCT_CATALOG.find((candidate) => candidate.id === productId);
      const quantity = quantityByProduct.get(productId) ?? 0;
      const shortLabel = product?.shortLabel ?? productId;
      // Show "PMS × 5,000L" once the product is on the order, else just "PMS".
      const label =
        quantity > 0
          ? `${shortLabel} × ${quantity.toLocaleString()}${product?.unitAbbrev ?? ''}`
          : shortLabel;
      return { label, amount: subtotalByProduct.get(productId) ?? 0 };
    });

    return {
      lineItems: fuelLineItems,
      subtotal,
      discount,
      deliveryFee,
      total,
      // TODO(orval): the backend will return the true outstanding balance for the order.
      balance: total,
    };
  }, [lineItems, deliveryMethodId]);

  const handleSubmit = () => {
    if (isEmpty) return;
    setIsSubmitting(true);
    // TODO(orval): replace the timeout with the create/update mutation; drive the
    // overlay from its pending state and open the modal on success.
    window.setTimeout(() => {
      setIsSubmitting(false);
      setSuccessKind('submitted');
    }, 1200);
  };

  const handleSaveDraft = () => {
    // TODO(orval): replace with the save-draft mutation once the API lands.
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
            highlight: { label: 'Order Reference:', value: SUBMITTED_ORDER_REFERENCE },
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
              bindingNoticeInline={!isEditMode}
            />
            {isEditMode && <CreateOrderBindingNotice variant="card" />}
          </div>
        </div>
      </section>

      {isSubmitting && <CreateOrderLoadingOverlay />}

      <SuccessModal
        open={successKind !== null}
        onOpenChange={(open) => !open && setSuccessKind(null)}
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
