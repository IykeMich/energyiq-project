import { Upload, FileCheck } from "lucide-react";
import type { RegistrationDocumentKey } from "../../hooks/use-registration-documents";

interface DocumentFieldConfig {
  key: RegistrationDocumentKey;
  label: string;
  description: string;
  hint?: string;
  required: boolean;
  documentType: string;
}

interface RegisterDocumentStepProps {
  documents: Record<RegistrationDocumentKey, File | null>;
  documentFields: DocumentFieldConfig[];
  uploadedCount: number;
  isUploading: boolean;
  isLoading: boolean;
  error: string | null;
  onFileChange: (key: RegistrationDocumentKey, file: File | null) => void;
  onSubmit: () => void;
}

export function RegisterDocumentStep({
  documents,
  documentFields,
  uploadedCount,
  isUploading,
  isLoading,
  error,
  onFileChange,
  onSubmit,
}: RegisterDocumentStepProps) {
  const hasRequiredDocuments = documentFields
    .filter((field) => field.required)
    .every((field) => documents[field.key]);

  return (
    <div className="py-6 md:py-12 md:bg-[#6161611A] md:rounded-[50px] md:px-12">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>
            {uploadedCount} of {documentFields.length} documents uploaded
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#2D2D2D] rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${(uploadedCount / documentFields.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Document cards */}
      <div className="space-y-4">
        {documentFields.map(({ key, label, description, hint, required }) => (
          <div
            key={key}
            className="border border-dashed border-[#2D2D2D] rounded-xl p-5 bg-[#111111]"
          >
            {/* Header */}
            <div className="mb-1">
              <h3 className="text-sm font-medium text-white">
                {label}{" "}
                <span
                  className={`text-[10px] uppercase tracking-wider ml-1 ${
                    required ? "text-[#FBC02D]" : "text-gray-500"
                  }`}
                >
                  {required ? "REQUIRED" : "OPTIONAL"}
                </span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
              {hint && <p className="text-[10px] text-[#FBC02D] mt-0.5">{hint}</p>}
            </div>

            {/* Upload area or file row */}
            {!documents[key] ? (
              <label className="mt-4 flex flex-col items-center justify-center w-full h-28 rounded-lg border border-dashed border-[#2D2D2D] bg-[#0a0a0a] cursor-pointer hover:border-[#FBC02D] transition-colors">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => onFileChange(key, e.target.files?.[0] ?? null)}
                />
                <Upload size={24} className="text-gray-500 mb-2" />
                <span className="text-xs text-gray-400">
                  Click to upload or drag and drop
                </span>
                <span className="text-[10px] text-gray-600 mt-1">
                  PDF, JPG, PNG, Max 10MB
                </span>
              </label>
            ) : (
              <div className="mt-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0a] border border-[#1D1D1D]">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileCheck size={18} className="text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-300 truncate">
                      {documents[key]?.name}
                    </span>
                  </div>
                  <label className="tap-effect text-xs text-[#FBC02D] hover:underline cursor-pointer shrink-0 ml-3">
                    Replace
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => onFileChange(key, e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
                <p className="text-xs text-[#388E3C] mt-2">Uploaded. Awaiting review</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 pt-8">
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isUploading || isLoading || !hasRequiredDocuments}
          className="tap-effect hover:opacity-90 w-full h-17.5 rounded-full bg-[#FBC02D] text-[#121212] text-base font-semibold disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Next"}
        </button>
      </div>
    </div>
  );
}
