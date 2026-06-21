import { useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';

import { PageHeaderContent } from '@/ui/layouts/page-header';
import { PumpSearchBar } from './pump-search-bar';
import { BRANCHES } from './pump-mocks';
import { useNavigate, useParams } from 'react-router-dom';

export function PumpOverview() {
  const [searchQuery, setSearchQuery] =
    useState('');

    const navigate = useNavigate();
    const { slug } = useParams();

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

      <div className="rounded-[28px] border border-[#232323] bg-[#0F0F0F] p-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            title="Total Pumps:"
            value="12"
            footer="Registered Pumps"
          />

          <StatCard
            title="Active Pumps:"
            value="10"
            footer="Currently Active"
            footerColor="text-green-500"
          />

          <StatCard
            title="Pumps in maintenance:"
            value="-"
          />

          <StatCard
            title="Faulty Pumps:"
            value="2"
            footer="Needs Attention"
            footerColor="text-red-500"
          />
        </div>

        {/* All Branches */}
        <div className="mt-6">
          <h2 className="mb-4 text-sm font-medium text-white">
            All Branches
          </h2>

          <div className="space-y-3">
            {filteredBranches.map((branch) => {
              const badgeClass =
                branch.status === 'good'
                  ? 'bg-green-500/15 text-green-400'
                  : branch.status === 'warning'
                  ? 'bg-yellow-500/15 text-yellow-400'
                  : 'bg-red-500/15 text-red-400';

              const progressClass =
                branch.status === 'good'
                  ? 'bg-green-500'
                  : branch.status === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-red-500';

              const progressWidth =
                branch.status === 'good'
                  ? 'w-full'
                  : branch.status === 'warning'
                  ? 'w-[72%]'
                  : 'w-[32%]';

              const statusLabel =
                branch.status === 'good'
                  ? 'Good'
                  : branch.status === 'warning'
                  ? '2 readings are missing'
                  : 'Needs Refill';

              return (
                <div key={branch.id}
                 onClick={() =>
                navigate( `/${slug}/pump-meters/${branch.id}`,
                 )
  }
  className="cursor-pointer rounded-[20px] border border-[#3A3A3A] bg-[#111111] px-4 py-4 transition hover:border-[#F5B91E]"
>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {branch.name}
                      </h3>

                      <div className="mt-1 flex items-center gap-1 text-xs text-[#9C9C9C]">
                        <MapPin size={12} />
                        {branch.location}
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-medium ${badgeClass}`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <p className="mt-5 text-xs text-[#C8C8C8]">
                    Total Revenue:{' '}
                    <span className="text-white">
                      {branch.revenue}
                    </span>

                    {'  '}·{'  '}

                    Dispensed:{' '}
                    <span className="text-white">
                      {branch.dispensed}
                    </span>

                    {'  '}·{'  '}

                    Pumps:{' '}
                    <span className="text-white">
                      {branch.pumps}
                    </span>
                  </p>

                  <div className="mt-3 h-[4px] w-full rounded-full bg-[#2A2A2A]">
                    <div
                      className={`h-full rounded-full ${progressClass} ${progressWidth}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flags */}
        <div className="mt-5 rounded-[20px] border border-[#2A2A2A] bg-[#111111]">
          <div className="flex items-center gap-2 border-b border-[#2A2A2A] p-4">
            <AlertCircle
              size={16}
              className="text-yellow-500"
            />

            <h2 className="text-sm font-medium text-white">
              Flags across branches
            </h2>
          </div>

          <div>
            <FlagRow
              text="New Haven · Pump 1 — meter vs. tank"
              status="Needs Refill"
              color="red"
            />

            <FlagRow
              text="Nsukka · Pump 3 — closing reading"
              status="Missing"
              color="yellow"
            />

            <FlagRow
              text="Nsukka · Pump 2 — closing reading"
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
  footer,
  footerColor = 'text-[#777777]',
}: {
  title: string;
  value: string;
  footer?: string;
  footerColor?: string;
}) {
  return (
    <div className="rounded-2xl bg-[#1B1B1B] p-4">
      <p className="text-xs text-[#A0A0A0]">
        {title}
      </p>

      <h3 className="mt-3 text-3xl font-semibold text-white">
        {value}
      </h3>

      {footer && (
        <p
          className={`mt-4 text-right text-[10px] ${footerColor}`}
        >
          {footer}
        </p>
      )}
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
    <div className="flex items-center justify-between border-b border-[#252525] px-4 py-3 last:border-b-0">
      <span className="text-xs text-[#CFCFCF]">
        {text}
      </span>

      <span
        className={`rounded-full px-3 py-1 text-[11px] font-medium ${
          color === 'red'
            ? 'bg-red-500/15 text-red-400'
            : 'bg-yellow-500/15 text-yellow-400'
        }`}
      >
        {status}
      </span>
    </div>
  );
}