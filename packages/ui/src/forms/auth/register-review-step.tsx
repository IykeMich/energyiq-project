import { AlertCircle } from "lucide-react";
import type { AdminAccountFormData, OrganizationDetailsFormData, SupplierDetailsFormData } from "../../validation/auth/onboarding";
import { businessTypeOptions, industryOptions, productCategoryOptions } from "./register-onboarding-mocks";

interface RegisterReviewStepProps {
  adminData: AdminAccountFormData;
  organizationData: OrganizationDetailsFormData;
  supplierData: SupplierDetailsFormData;
  uploadedDocumentCount: number;
  totalDocumentCount: number;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-[#FAFAFA]">{label}</p>
      <p className="text-lg text-[#FAFAFA] mt-1">{value || "—"}</p>
    </div>
  );
}

// Bordered card matching the .pen design's review sections: rounded outer
// border, a header strip separated by a divider, and a vertical divider
// splitting the two field columns.
function ReviewSection({ title, fields }: { title: string; fields: Array<{ label: string; value: string }> }) {
  return (
    <section className="rounded-[17px] border border-[#616161B2] overflow-hidden">
      <div className="px-8 py-5 border-b border-[#616161B2]">
        <h3 className="text-xl font-semibold text-[#FAFAFA]">{title}</h3>
      </div>
      <div className="relative grid grid-cols-2 gap-x-8 gap-y-6 px-8 py-6">
        <div className="absolute inset-y-6 left-1/2 w-px bg-[#616161B2]" aria-hidden="true" />
        {fields.map((field) => (
          <ReviewField key={field.label} label={field.label} value={field.value} />
        ))}
      </div>
    </section>
  );
}

function optionLabel(options: Array<{ value: string; label: string }>, value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function RegisterReviewStep({
  adminData,
  organizationData,
  supplierData,
  uploadedDocumentCount,
  totalDocumentCount,
  isLoading,
  onCancel,
  onSubmit,
}: RegisterReviewStepProps) {
  const productCategoryLabels = supplierData.product_categories
    .map((category) => optionLabel(productCategoryOptions, category))
    .join(", ");

  return (
    <div className="space-y-6">
      <ReviewSection
        title="Administrator"
        fields={[
          { label: "Name:", value: `${adminData.first_name} ${adminData.last_name}`.trim() },
          { label: "Work Email:", value: adminData.account_email },
          { label: "Work Phone Number:", value: adminData.admin_phone },
          { label: "Account Type:", value: "Supplier" },
        ]}
      />

      <ReviewSection
        title="Organization"
        fields={[
          { label: "Name:", value: organizationData.registered_business_name },
          { label: "Organization Email:", value: organizationData.business_email },
          {
            label: "Business Registration Number:",
            value: organizationData.business_registration_number,
          },
          { label: "Business Type:", value: optionLabel(businessTypeOptions, organizationData.business_type) },
          { label: "Industry:", value: optionLabel(industryOptions, organizationData.industry) },
          { label: "Location:", value: organizationData.city },
        ]}
      />

      <ReviewSection
        title="Role-Specific Information"
        fields={[
          { label: "Product Categories:", value: productCategoryLabels },
          { label: "Warehouse Location:", value: supplierData.warehouse_locations },
          { label: "Delivery Coverage:", value: supplierData.delivery_coverage },
          { label: "Settlement Information:", value: supplierData.settlement_information },
          { label: "Minimum Order Requirement", value: supplierData.minimum_order_requirement },
          { label: "Return Policy:", value: supplierData.return_policy },
        ]}
      />

      <ReviewSection
        title="Uploaded Documents"
        fields={[
          {
            label: "Documents Uploaded:",
            value: `${uploadedDocumentCount} of ${totalDocumentCount} uploaded`,
          },
        ]}
      />

      <div className="flex items-center gap-2 rounded-lg bg-[#FB8C1C1A] px-3.5 py-2.5">
        <AlertCircle size={20} className="text-[#FB8C1C] shrink-0" />
        <p className="text-xs text-[#FB8C1C]">
          Submitting sets your organization status to pending_review and sends this application to
          the authorization queue for compliance and KYC review.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="tap-effect hover:bg-white/5 flex-1 h-17.5 rounded-full border-2 border-[#616161B2] text-[#FAFAFA] text-base font-semibold"
        >
          Cancel Submission
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="tap-effect hover:opacity-90 flex-1 h-17.5 rounded-full bg-[#FBC02D] text-[#121212] text-base font-semibold disabled:opacity-50"
        >
          {isLoading ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </div>
  );
}
