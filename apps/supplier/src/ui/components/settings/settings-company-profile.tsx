import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import { Button, InputField, SelectField, TextareaField } from '@energyiq/ui';
import {
  companyProfileSchema,
  type CompanyProfileFormData,
} from '@/ui/validation/settings/company-profile';
import {
  COMPANY_PROFILE_MOCK,
  BUSINESS_TYPES_MOCK,
  COMPLIANCE_DOCUMENTS_MOCK,
  type ComplianceDocumentMock,
} from './settings-mocks';

interface SettingsCompanyProfileProps {
  onSwitchToUser: () => void;
}

export function SettingsCompanyProfile({ onSwitchToUser }: SettingsCompanyProfileProps) {
  const { control, handleSubmit } = useForm<CompanyProfileFormData>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      company_name: COMPANY_PROFILE_MOCK.company_name,
      registration_number: COMPANY_PROFILE_MOCK.registration_number,
      tax_identification_number: COMPANY_PROFILE_MOCK.tax_identification_number,
      business_type: COMPANY_PROFILE_MOCK.business_type,
      primary_email: COMPANY_PROFILE_MOCK.primary_email,
      phone_number: COMPANY_PROFILE_MOCK.phone_number,
      business_address: COMPANY_PROFILE_MOCK.business_address,
    },
  });

  const onSubmit = (data: CompanyProfileFormData) => {
    // TODO(orval): wire PATCH company profile endpoint once it lands.
    // eslint-disable-next-line no-console
    console.log('Save company profile', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Company Profile</h2>
          <p className="text-sm text-[#FFFFFFCC] mt-1">
            Business information, brand assets & verification.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onSwitchToUser}
            className="border-[#FBC02D] text-[#FBC02D] bg-transparent hover:bg-[#FBC02D]/10"
          >
            Go to User Profile
          </Button>
          <Button
            type="submit"
            className="bg-[#FBC02D] text-[#121212] hover:bg-[#FBC02D]/90"
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="bg-[#6161611A] rounded-[18px] p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-8">
            <section>
              <h3 className="text-base font-medium text-white mb-4">Basic Information</h3>
              <div className="bg-[#FFFFFF1A] rounded-2xl p-5 flex items-start gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-[#FBC02D] flex items-center justify-center text-[#121212] text-xl font-bold">
                    {COMPANY_PROFILE_MOCK.logo_initials}
                  </div>
                  <button
                    type="button"
                    className="text-xs text-[#FBC02D] hover:underline flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    Upload New Logo
                  </button>
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-base font-medium text-white">
                    {COMPANY_PROFILE_MOCK.company_name}
                  </p>
                  <p className="text-sm text-[#FFFFFFCC]">
                    {COMPANY_PROFILE_MOCK.registration_number} • CAC Verified
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {COMPANY_PROFILE_MOCK.badges.map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-[#FBC02D] text-[#FBC02D]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-base font-medium text-white mb-4">Business Information</h3>
              <div className="space-y-4">
                <InputField
                  control={control}
                  name="company_name"
                  label="Company Name:"
                  placeholder="Enter company name"
                />
                <InputField
                  control={control}
                  name="registration_number"
                  label="RC Number:"
                  placeholder="Enter RC number"
                />
                <InputField
                  control={control}
                  name="tax_identification_number"
                  label="Tax Identification Number:"
                  placeholder="Enter TIN"
                />
                <SelectField
                  control={control}
                  name="business_type"
                  label="Business Type:"
                  placeholder="Select business type"
                  options={BUSINESS_TYPES_MOCK.map((type) => ({ value: type, label: type }))}
                />
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            <section>
              <h3 className="text-base font-medium text-white mb-4">Contact & Information</h3>
              <div className="space-y-4">
                <InputField
                  control={control}
                  name="primary_email"
                  label="Primary Email:"
                  type="email"
                  placeholder="Enter primary email"
                />
                <InputField
                  control={control}
                  name="phone_number"
                  label="Phone Number:"
                  type="tel"
                  placeholder="Enter phone number"
                />
                <TextareaField
                  control={control}
                  name="business_address"
                  label="Business Address:"
                  placeholder="Enter business address"
                  rows={3}
                />
              </div>
            </section>

            <section>
              <h3 className="text-base font-medium text-white mb-4">Compliance & Documents</h3>
              <div className="bg-[#FFFFFF1A] rounded-2xl p-5 space-y-4">
                {COMPLIANCE_DOCUMENTS_MOCK.map((document) => (
                  <ComplianceDocumentRow key={document.id} document={document} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </form>
  );
}

function ComplianceDocumentRow({ document }: { document: ComplianceDocumentMock }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-white">{document.name}</p>
        {document.expiry_date && (
          <p className="text-xs text-[#FFFFFFCC] mt-0.5">{document.expiry_date}</p>
        )}
      </div>
      {document.status === 'verified' ? (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
          Verified
        </span>
      ) : (
        <Button
          type="button"
          size="sm"
          className="bg-[#FBC02D] text-[#121212] hover:bg-[#FBC02D]/90"
        >
          Upload
        </Button>
      )}
    </div>
  );
}
