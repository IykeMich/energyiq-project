const tabs = [
  'All',
  'PMS',
  'AGO',
  'DPK',
];

export function PumpFilterTabs() {
  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          className="rounded-xl border border-[#2A2A2A] bg-[#1B1B1B] px-4 py-2 text-sm text-[#A3A3A3] transition hover:border-[#FFB800] hover:text-[#FFB800]"
        >
          {tab}
        </button>
      ))}
    </div>
  );
}