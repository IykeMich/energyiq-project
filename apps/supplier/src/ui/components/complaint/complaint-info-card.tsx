import type { ReactNode } from 'react';

export interface ComplaintInfoRow {
  label: string;
  value: ReactNode;
}

interface ComplaintInfoCardProps {
  title: string;
  rows: ComplaintInfoRow[];
  /** Optional extra content (e.g. tier badges) rendered above the rows. */
  header?: ReactNode;
}

/** Titled card listing label/value rows; reused for the distributor, summary and order cards. */
export function ComplaintInfoCard({ title, rows, header }: ComplaintInfoCardProps) {
  return (
    <section className="flex flex-col gap-4 rounded-[18px] border border-[#FFFFFF1F] bg-[#FFFFFF0A] p-6">
      <h3 className="text-base font-semibold text-[#FAFAFA]">{title}</h3>
      {header}
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
