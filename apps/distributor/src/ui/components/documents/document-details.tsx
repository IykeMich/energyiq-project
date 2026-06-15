


interface Document {
  title: string;
  file: string;
}

interface Props {
  document: Document;
  onBack: () => void;
}

export function DocumentDetails({
  document,
  onBack,
}: Props) {
  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-yellow-400"
      >
        ← Back
      </button>

      <div>
        <h1 className="text-2xl font-semibold text-white">
          {document.title}
        </h1>

        <div className="mt-2 flex items-center gap-3">
          <span className="text-gray-400">
            Regulatory • Required document
          </span>

          <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
            Approved
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Main Card */}
        <div className="rounded-3xl bg-[#161616] p-6">
          PDF Preview Card Here

          Document Details Table Here
        </div>

        {/* Activity Card */}
        <div className="rounded-3xl border border-[#2A2A2A] p-5">
          Activity Timeline
        </div>
      </div>
    </div>
  );
}