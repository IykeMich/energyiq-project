import { useState } from 'react';
import {
  Upload,
  X,
  FileText,
} from 'lucide-react';

interface Props {
  document: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function DocumentUploadModal({
  document,
  onClose,
  onSuccess,
}: Props) {
  const [file, setFile] =
    useState<File | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-180 rounded-[32px] bg-[#080808] p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl text-white">
              Document Upload
            </h2>

            <p className="text-sm text-gray-500">
              {document.title}
            </p>
          </div>

          <button onClick={onClose}>
            <X className="text-[#F4B400]" />
          </button>
        </div>

        <div className="mb-6 rounded-xl bg-[#F4B400]/10 p-3 text-xs text-[#F4B400]">
          Upload a copy of your latest document.
        </div>

        {!file ? (
          <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#444] bg-[#111]">
            <Upload className="mb-3 text-[#F4B400]" />

            <p className="text-white">
              Click to upload
            </p>

            <input
              type="file"
              hidden
              onChange={(e) =>
                setFile(
                  e.target.files?.[0] || null
                )
              }
            />
          </label>
        ) : (
          <div className="flex items-center justify-between rounded-2xl bg-[#111] p-4">
            <div className="flex items-center gap-3">
              <FileText
                className="text-[#F4B400]"
              />

              <div>
                <p className="text-white">
                  {file.name}
                </p>

                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(
                    2
                  )}{' '}
                  MB
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                setFile(null)
              }
              className="rounded-full bg-red-500/20 px-4 py-2 text-xs text-red-400"
            >
              Remove
            </button>
          </div>
        )}

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-full bg-[#2A2A2A] px-8 py-3 text-white"
          >
            Back
          </button>

          <button
            disabled={!file}
            onClick={onSuccess}
            className="rounded-full bg-[#F4B400] px-8 py-3 font-medium text-black"
          >
            Submit for review
          </button>
        </div>
      </div>
    </div>
  );
}