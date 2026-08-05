import { useState } from 'react';
import { ProductAddHeader } from './product-add-header';
import { ProductVerticalStepper, type ProductWizardStep } from './product-vertical-stepper';
import { ProductBasicInfoCard, type ProductBasicInfoDraft } from './product-basic-info-card';
import { ProductPricingCard, type ProductPricingDraft } from './product-pricing-card';
import { ProductInventoryCard, type ProductInventoryDraft } from './product-inventory-card';
import { ProductComplianceCard, type ProductComplianceDraft } from './product-compliance-card';
import { ProductTradingRulesCard, type ProductTradingRulesDraft } from './product-trading-rules-card';
import { ProductAccessControlCard, type ProductAccessControlDraft } from './product-access-control-card';
import { ProductReviewCard } from './product-review-card';

const PRODUCT_WIZARD_STEPS: ProductWizardStep[] = [
  { title: 'Basic Information', subtitle: 'Name, SKU, Category' },
  { title: 'Pricing', subtitle: 'Base Price, Tier Discounts' },
  { title: 'Inventory', subtitle: 'Initial Stock, Reorder point, Max Stock' },
  { title: 'Compliance', subtitle: 'Certifications, regulatory codes' },
  { title: 'Trading Rules', subtitle: 'MOQ, max order, credit terms, return policy' },
  { title: 'Access Control', subtitle: 'Tier restrictions, distributor whitelist' },
  { title: 'Review & Publish', subtitle: 'Summary Review' },
];

// Verbatim per the .pen design. Steps 2, 3, and 4 share identical wording in the
// source file (copy-paste leftovers from duplicating earlier frames) — kept
// verbatim rather than silently "fixed", per the pixel-perfect requirement.
const STEP_SUBTITLES: Record<number, string> = {
  1: 'Step 1 of 7- Set your catalog listing for distributors',
  2: 'Step 2 of 7-Set your base price, then tune what each distributor tier pays.',
  3: 'Step 3 of 7-Set your base price, then tune what each distributor tier pays.',
  4: 'Step 4 of 7- Set your catalog listing for distributors',
  5: 'Step 5 of 7- Set your catalog listing for distributors',
  6: 'Step 6 of 7- Set your catalog listing for distributors',
  7: 'Step 7 of 7-Set your base price, then tune what each distributor tier pays.',
};

// All 7 steps are now built.
const HIGHEST_BUILT_STEP = 7;

const EMPTY_BASIC_INFO_DRAFT: ProductBasicInfoDraft = {
  name: '',
  sku: '',
  category: '',
  type: '',
  measuringUnit: '',
  description: '',
};

const EMPTY_PRICING_DRAFT: ProductPricingDraft = {
  basePrice: '',
  currency: '',
  tierDiscounts: { bronze: '', silver: '', gold: '' },
  promoEnabled: false,
  promoPrice: '',
  validFrom: '',
  validTo: '',
};

const EMPTY_INVENTORY_DRAFT: ProductInventoryDraft = {
  allocations: [],
  pendingWarehouseId: '',
  pendingQuantity: '',
  pendingStorageLocation: '',
};

const EMPTY_COMPLIANCE_DRAFT: ProductComplianceDraft = {
  certifications: [],
  expiryDate: '',
  referenceCode: '',
  safetyInformation: '',
};

const EMPTY_TRADING_RULES_DRAFT: ProductTradingRulesDraft = {
  creditTerms: '',
  moq: '',
  maxOrderQuantity: '',
  returnsAllowed: false,
  returnWindowDays: '',
  restockingFeePercent: '',
  eligibleReturnReasons: [],
  returnInstructions: '',
};

const EMPTY_ACCESS_CONTROL_DRAFT: ProductAccessControlDraft = {
  visibleTiers: [],
  geographicAvailability: [],
  restrictToSpecificDistributors: false,
  whitelistedDistributorIds: [],
};

interface ProductAddWizardPanelProps {
  onCancel: () => void;
}

/** Composed "Add New Product" page content: header, step list, and the active step's form card. */
export function ProductAddWizardPanel({ onCancel }: ProductAddWizardPanelProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [basicInfoDraft, setBasicInfoDraft] = useState<ProductBasicInfoDraft>(EMPTY_BASIC_INFO_DRAFT);
  const [pricingDraft, setPricingDraft] = useState<ProductPricingDraft>(EMPTY_PRICING_DRAFT);
  const [inventoryDraft, setInventoryDraft] = useState<ProductInventoryDraft>(EMPTY_INVENTORY_DRAFT);
  const [complianceDraft, setComplianceDraft] = useState<ProductComplianceDraft>(EMPTY_COMPLIANCE_DRAFT);
  const [tradingRulesDraft, setTradingRulesDraft] = useState<ProductTradingRulesDraft>(EMPTY_TRADING_RULES_DRAFT);
  const [accessControlDraft, setAccessControlDraft] = useState<ProductAccessControlDraft>(EMPTY_ACCESS_CONTROL_DRAFT);

  const updateBasicInfoDraft = (patch: Partial<ProductBasicInfoDraft>) =>
    setBasicInfoDraft((prev) => ({ ...prev, ...patch }));

  const updatePricingDraft = (patch: Partial<ProductPricingDraft>) =>
    setPricingDraft((prev) => ({ ...prev, ...patch }));

  const updateInventoryDraft = (patch: Partial<ProductInventoryDraft>) =>
    setInventoryDraft((prev) => ({ ...prev, ...patch }));

  const updateComplianceDraft = (patch: Partial<ProductComplianceDraft>) =>
    setComplianceDraft((prev) => ({ ...prev, ...patch }));

  const updateTradingRulesDraft = (patch: Partial<ProductTradingRulesDraft>) =>
    setTradingRulesDraft((prev) => ({ ...prev, ...patch }));

  const updateAccessControlDraft = (patch: Partial<ProductAccessControlDraft>) =>
    setAccessControlDraft((prev) => ({ ...prev, ...patch }));

  // TODO: wire to a real save-draft mutation once the backend endpoint lands.
  const handleSaveDraft = () => {};

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
    } else {
      onCancel();
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <ProductAddHeader
        currentStep={currentStep}
        totalSteps={PRODUCT_WIZARD_STEPS.length}
        subtitle={STEP_SUBTITLES[currentStep]}
        onBack={handleBack}
        onSaveDraft={handleSaveDraft}
      />

      <div className="flex min-w-0 flex-col md:flex-row md:items-start gap-4">
        <ProductVerticalStepper steps={PRODUCT_WIZARD_STEPS} currentStep={currentStep} />
        {currentStep === 1 && (
          <ProductBasicInfoCard
            draft={basicInfoDraft}
            onChange={updateBasicInfoDraft}
            onCancel={onCancel}
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && (
          <ProductPricingCard
            draft={pricingDraft}
            onChange={updatePricingDraft}
            onCancel={onCancel}
            onNext={() => setCurrentStep(3)}
          />
        )}
        {currentStep === 3 && (
          <ProductInventoryCard
            draft={inventoryDraft}
            onChange={updateInventoryDraft}
            onCancel={onCancel}
            onNext={() => setCurrentStep(4)}
          />
        )}
        {currentStep === 4 && (
          <ProductComplianceCard
            draft={complianceDraft}
            onChange={updateComplianceDraft}
            onCancel={onCancel}
            onNext={() => setCurrentStep(5)}
          />
        )}
        {currentStep === 5 && (
          <ProductTradingRulesCard
            draft={tradingRulesDraft}
            onChange={updateTradingRulesDraft}
            onCancel={onCancel}
            onNext={() => setCurrentStep(6)}
          />
        )}
        {currentStep === 6 && (
          <ProductAccessControlCard
            draft={accessControlDraft}
            onChange={updateAccessControlDraft}
            onCancel={onCancel}
            onNext={() => setCurrentStep(HIGHEST_BUILT_STEP)}
          />
        )}
        {currentStep === 7 && (
          <ProductReviewCard
            basicInfo={basicInfoDraft}
            pricing={pricingDraft}
            inventory={inventoryDraft}
            compliance={complianceDraft}
            tradingRules={tradingRulesDraft}
            accessControl={accessControlDraft}
            onEditStep={setCurrentStep}
            onCancel={onCancel}
            onSubmitted={onCancel}
          />
        )}
      </div>
    </section>
  );
}
