
import { useState } from 'react';
import { AlertCircle, ChevronDown, Plus } from 'lucide-react';

import { VarianceAlertModal } from './variance-alert-modal';
import { AddTankModal } from './add-tank-modal';

const tanks = [
  {
    name: 'Main Depot A',
    description:
      'Tank A (ULP), Premium Motor Spirit (PMS) | 25,000L | Automotive Gas Oil (AGO) 10,000L',
    status: '80% Adequate',
    statusColor: 'text-green-400',
    progressColor: 'bg-green-500',
    progress: 80,
    stock: '50,000 L',
    coverage: '8.2 days',
    reorder: '6 days',
  },
  {
    name: 'Main Depot',
    description:
      'Independence Layout, Premium Motor Spirit (PMS) 30,000L Cap, Automotive Gas Oil (AGO) 20,000L Cap',
    status: '80% Adequate',
    statusColor: 'text-green-400',
    progressColor: 'bg-green-500',
    progress: 80,
    stock: '24,420 L',
    coverage: '8.2 days',
    reorder: '6 days',
  },
  {
    name: 'Nsukka Station',
    description:
      'Nsukka, Automotive Gas Oil (AGO) 20,000L Cap',
    status: '5% Critical',
    statusColor: 'text-red-500',
    progressColor: 'bg-orange-500',
    progress: 55,
    stock: '10,250 L',
    coverage: '4.8 days',
    reorder: '6 days',
  },
  {
    name: 'New Haven',
    description:
      'YJ Dual Purpose Kerosene 10,000 L Cap',
    status: '2% Critical',
    statusColor: 'text-red-500',
    progressColor: 'bg-red-600',
    progress: 18,
    stock: '2,400 L',
    coverage: '1.2 days',
    reorder: '5 days',
  },
];

export function TankMonitoringOverview() {
  const [varianceOpen, setVarianceOpen] = useState(false);
  const [addTankOpen, setAddTankOpen] = useState(false);

  return (
    <section className="min-h-screen bg-[#0B0D10] p-3 text-white">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-[#F4B52A]" />
            <h1 className="text-[18px] font-medium">
              Tank Monitoring
            </h1>
          </div>

          <button
            onClick={() => setAddTankOpen(true)}
            className="flex h-8 items-center gap-1 rounded-full bg-[#F4B52A] px-4 text-[11px] font-medium text-black"
          >
            <Plus size={12} />
            Add Tank
          </button>
        </div>

        {/* Alert */}
        <div className="mb-3 flex h-8 items-center rounded-md bg-[#5A0C0C] px-3 text-[11px] text-red-200">
          <AlertCircle size={12} className="mr-2" />
          Variance Alert: Main Depot (Tank A) - expected 25,000 L actual
          24,420 L (-580L)

          <button
            className="ml-2 underline"
            onClick={() => setVarianceOpen(true)}
          >
            View
          </button>
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-4 gap-3">
          {[
            {
              label: 'Total tanks:',
              value: '4',
              footer: '4 Products',
            },
            {
              label: 'Alerts:',
              value: '2',
              footer: 'Needs attention',
              valueColor: 'text-red-500',
              footerColor: 'text-green-500',
            },
            {
              label: 'Last Dip:',
              value: 'Today',
              footer: 'Last 7:05am',
            },
            {
              label: 'Avg Days left:',
              value: '13',
              footer: '',
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl bg-[#262626] px-4 py-3"
            >
              <p className="text-[10px] text-zinc-400">
                {card.label}
              </p>

              <div
                className={`mt-2 text-[22px] font-medium ${
                  card.valueColor ?? 'text-white'
                }`}
              >
                {card.value}
              </div>

              <p
                className={`mt-1 text-[9px] ${
                  card.footerColor ?? 'text-zinc-500'
                }`}
              >
                {card.footer}
              </p>
            </div>
          ))}
        </div>

        {/* Tank Levels */}
        <div className="rounded-[18px] border border-[#323232] bg-[#171717] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[12px] font-medium">
              Tank Levels
            </h2>

            <button className="text-[10px] text-[#F4B52A] underline">
              Dip Reading History
            </button>
          </div>

          <div className="space-y-4">
            {tanks.map((tank) => (
              <div
                key={tank.name}
                className="rounded-[16px] border border-[#444] p-4"
              >
                <div className="mb-1 flex justify-between">
                  <h3 className="text-[12px] font-medium">
                    {tank.name}
                  </h3>

                  <span
                    className={`text-[10px] ${tank.statusColor}`}
                  >
                    {tank.status}
                  </span>
                </div>

                <p className="mb-3 text-[9px] text-zinc-500">
                  {tank.description}
                </p>

                <div className="mb-3 h-[3px] w-full rounded-full bg-[#333]">
                  <div
                    className={`h-[3px] rounded-full ${tank.progressColor}`}
                    style={{
                      width: `${tank.progress}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[9px]">
                  <div>
                    <span className="text-zinc-500">
                      Stock:
                    </span>{' '}
                    {tank.stock}
                  </div>

                  <div>
                    Coverage: {tank.coverage}
                  </div>

                  <div>
                    Reorder: {tank.reorder}
                  </div>
                </div>

                <button className="mt-3 rounded bg-[#F4B52A] px-2 py-1 text-[9px] font-medium text-black">
                  Order Refill
                </button>
              </div>
            ))}
          </div>

          {/* Dip Form */}
          <div className="mt-5 border-t border-[#323232] pt-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-[12px] font-medium">
                  Record Today's Dip
                </h3>

                <p className="mt-1 text-[10px] text-zinc-500">
                  Enter current stock levels from physical dip
                  stick readings
                </p>
              </div>

              <span className="rounded bg-[#5C4712] px-2 py-1 text-[9px] text-[#F4B52A]">
                Manual Entry
              </span>
            </div>

            <div className="grid grid-cols-[1fr_120px_90px] gap-3">
              <button className="flex h-10 items-center justify-between rounded-full border border-[#444] px-4 text-[10px] text-zinc-500">
                Select a tank
                <ChevronDown size={12} />
              </button>

              <div className="flex h-10 items-center rounded-full border border-[#444] px-4">
                <input
                  className="w-full bg-transparent text-[10px] outline-none"
                  placeholder="0"
                />
              </div>

              <button className="rounded-full bg-[#F4B52A] text-[10px] font-medium text-black">
                Save
              </button>
            </div>
          </div>
        </div>

        <VarianceAlertModal
          open={varianceOpen}
          onOpenChange={setVarianceOpen}
        />

        <AddTankModal
          open={addTankOpen}
          onOpenChange={setAddTankOpen}
        />
      </div>
    </section>
  );
}

