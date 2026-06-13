import type { EmployeeStat } from './team-permissions-mocks';

/** Single KPI card in the Employee Management strip: a label and a large value. */
export function TeamPermissionsStatCard({ title, value }: EmployeeStat) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-[#FFFFFF1A] p-5">
      <h4 className="text-sm font-medium text-gray-300">{title}</h4>
      <span className="text-3xl font-bold text-white">{value}</span>
    </div>
  );
}
