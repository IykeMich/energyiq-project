import type { ReactNode } from 'react';

export interface SalesInfoRow {
  label: string;
  value: ReactNode;
}

interface SalesEntryInfoCardProps {
  /** Small section label shown at the top of the card (e.g. "Distributor"). */
  title: string;
  /** Optional block rendered above the rows, followed by a divider (e.g. an identity row). */
  header?: ReactNode;
  rows: SalesInfoRow[];
}

/**
 * Titled card listing label/value rows; shared by the Distributor and Transaction
 * summary sections of the Transaction Detail modal.
 */
export function SalesEntryInfoCard({ title, header, rows }: SalesEntryInfoCardProps) {
  return (
    <section className="flex flex-col gap-4 rounded-[18px] border border-[#FFFFFF1F] bg-[#FFFFFF0A] p-6">
      <h3 className="text-sm font-normal text-[#9E9E9E]">{title}</h3>
      {header && (
        <>
          {header}
          <div className="border-t border-[#FFFFFF1F]" />
        </>
      )}
      <dl className="flex flex-col gap-3 text-sm text-[#FAFAFA]">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <dt className="text-[#FFFFFFCC]">{row.label}</dt>
            <dd className="text-right font-semibold">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
