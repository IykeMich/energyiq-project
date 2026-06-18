import { useState } from 'react';

import { PageHeaderContent } from '@/ui/layouts/page-header';
import { PumpSearchBar } from './pump-search-bar';
import { BRANCHES } from './pump-mocks';
import { MapPin } from 'lucide-react';

export function PumpOverview() {
  const [searchQuery, setSearchQuery] =
    useState('');

  const filteredBranches =
    BRANCHES.filter((branch) =>
      branch.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );

  return (
    <section className="flex flex-col gap-6 pb-6">
      <PageHeaderContent>
        <PumpSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </PageHeaderContent>

      <div>
        <h1 className="text-2xl font-semibold text-white">
          Pumps & Meters
        </h1>

        <p className="mt-1 text-sm text-[#8B8B8B]">
          Monitor and manage all branches.
        </p>
      </div>

      <div className="rounded-[28px] border border-[#232323] bg-[#0F0F0F] p-6">
        {/* Stats */}
       <div className="grid grid-cols-4 gap-4">
          <StatCard
            title="Total Pumps"
            value="24"
          />

          <StatCard
            title="Active Pumps"
            value="21"
          />

          <StatCard
            title="Pumps in Maintenance"
            value="2"
          />

          <StatCard
            title="Faulty Pumps"
            value="1"
            danger
          />
        </div>

    {/* Branches */}
<div className="mt-8 rounded-3xl border border-[#2A2A2A] bg-[#141414]">
  <div className="border-b border-[#2A2A2A] p-4">
    <h2 className="text-sm font-medium text-white">
      All Branches
    </h2>
  </div>

  <div className="divide-y divide-[#2A2A2A]">
    {filteredBranches.map((branch) => {
      const badgeColor =
        branch.status === 'good'
          ? 'bg-green-500/20 text-green-400'
          : branch.status === 'warning'
          ? 'bg-yellow-500/20 text-yellow-400'
          : 'bg-red-500/20 text-red-400';

      const progressColor =
        branch.status === 'good'
          ? 'bg-green-500'
          : branch.status === 'warning'
          ? 'bg-yellow-500'
          : 'bg-red-500';

      const label =
        branch.status === 'good'
          ? 'Good'
          : branch.status === 'warning'
          ? 'Missing'
          : 'Needs Refill';

      return (
        <div
          key={branch.id}
          className="p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-white">
                {branch.name}
              </h3>

              <div className="mt-1 flex items-center gap-1 text-xs text-[#8B8B8B]">
                <MapPin size={12} />
                <span>{branch.location}</span>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${badgeColor}`}
            >
              {label}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-[#8B8B8B]">
                Revenue
              </p>

              <p className="mt-1 text-sm font-medium text-white">
                {branch.revenue}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#8B8B8B]">
                Dispensed
              </p>

              <p className="mt-1 text-sm font-medium text-white">
                {branch.dispensed}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#8B8B8B]">
                Pumps Active
              </p>

              <p className="mt-1 text-sm font-medium text-white">
                {branch.pumps}
              </p>
            </div>
          </div>

          <div className="mt-4 h-1.5 w-full rounded-full bg-[#252525]">
            <div
              className={`h-full rounded-full ${progressColor} ${
                branch.status === 'good'
                  ? 'w-full'
                  : branch.status === 'warning'
                  ? 'w-1/2'
                  : 'w-1/3'
              }`}
            />
          </div>
        </div>
      );
    })}
  </div>
</div>
        {/* Flags */}
        <div className="mt-8 rounded-3xl border border-[#2A2A2A] bg-[#141414]">
          <div className="border-b border-[#2A2A2A] p-4">
            <h2 className="text-sm font-medium text-white">
              Flags Across Branches
            </h2>
          </div>

          <div className="divide-y divide-[#2A2A2A]">
            <FlagRow
              text="New Haven - Pump 1 — meter variance"
              status="Needs Refill"
              color="red"
            />

            <FlagRow
              text="Nsukka - Pump 3 — closing reading"
              status="Missing"
              color="yellow"
            />

            <FlagRow
              text="Nsukka - Pump 2 — closing reading"
              status="Missing"
              color="yellow"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  title,
  value,
  danger,
}: {
  title: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-[#181818] p-4">
      <p className="text-xs text-[#8B8B8B]">
        {title}
      </p>

      <h3
        className={`mt-2 text-2xl font-semibold ${
          danger
            ? 'text-red-500'
            : 'text-white'
        }`}
      >
        {value}
      </h3>
    </div>
  );
}

function FlagRow({
  text,
  status,
  color,
}: {
  text: string;
  status: string;
  color: 'red' | 'yellow';
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <span className="text-sm text-[#D1D1D1]">
        {text}
      </span>

      <span
        className={`rounded px-2 py-1 text-xs ${
          color === 'red'
            ? 'bg-red-500/20 text-red-400'
            : 'bg-yellow-500/20 text-yellow-400'
        }`}
      >
        {status}
      </span>
    </div>
  );
}