import { useState } from 'react';
import type { Pump } from './types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pump: Pump | null;
}

type Tab = 'nozzles' | 'sales' | 'activity';

export function PumpDetailsModal({
  open,
  onOpenChange,
  pump,
}: Props) {
  const [activeTab, setActiveTab] =
    useState<Tab>('nozzles');

  if (!open || !pump) return null;

  const statusStyles = {
    active:
      'bg-[#0E2D18] text-[#22C55E]',
    inactive:
      'bg-[#33210A] text-[#F59E0B]',
    faulty:
      'bg-[#2D0E0E] text-[#EF4444]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full `max-w-[700px] overflow-hidden rounded-[28px] border border-[#2A2A2A] bg-[#121212] text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#262626] p-6">
          <div>
            <h2 className="text-xl font-semibold">
              {pump.name}
            </h2>

            <p className="mt-1 text-sm text-[#737373]">
              Product: {pump.product}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                statusStyles[pump.status]
              }`}
            >
              {pump.status}
            </span>

            <button
              type="button"
              onClick={() =>
                onOpenChange(false)
              }
              className="text-xl text-[#737373] hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
          <MetricCard
            title="Total Sales"
            value={`₦${pump.totalSales.toLocaleString()}`}
          />

          <MetricCard
            title="Volume Sold"
            value={`${pump.volumeSold}L`}
          />

          <MetricCard
            title="Nozzles"
            value={pump.nozzleCount}
          />

          <MetricCard
            title="Meter Reading"
            value={pump.meterReading}
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-[#262626] px-6">
          <div className="flex gap-6">
            <TabButton
              label="Nozzles"
              active={
                activeTab === 'nozzles'
              }
              onClick={() =>
                setActiveTab('nozzles')
              }
            />

            <TabButton
              label="Sales"
              active={
                activeTab === 'sales'
              }
              onClick={() =>
                setActiveTab('sales')
              }
            />

            <TabButton
              label="Activity"
              active={
                activeTab === 'activity'
              }
              onClick={() =>
                setActiveTab('activity')
              }
            />
          </div>
        </div>

        {/* Content */}
        <div className="`max-h-[400px] overflow-y-auto p-6">
          {activeTab === 'nozzles' && (
            <PumpNozzleList
              nozzleCount={
                pump.nozzleCount
              }
            />
          )}

          {activeTab === 'sales' && (
            <PumpSalesSummary
              pump={pump}
            />
          )}

          {activeTab === 'activity' && (
            <PumpActivity />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-[#262626] p-6">
          <button
            type="button"
            className="rounded-xl border border-[#303030] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#1A1A1A]"
          >
            Edit Settings
          </button>

          <button
            type="button"
            className="rounded-xl bg-[#D92D20] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#B42318]"
          >
            Deactivate Pump
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================
   Metric Card
===================== */

interface MetricCardProps {
  title: string;
  value: string | number;
}

function MetricCard({
  title,
  value,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-[#262626] bg-[#181818] p-4">
      <p className="text-xs text-[#737373]">
        {title}
      </p>

      <h3 className="mt-2 text-lg font-semibold">
        {value}
      </h3>
    </div>
  );
}

/* =====================
   Tab Button
===================== */

interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function TabButton({
  label,
  active,
  onClick,
}: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-1 pb-4 text-sm font-medium transition ${
        active
          ? 'border-[#FFB800] text-[#FFB800]'
          : 'border-transparent text-[#737373]'
      }`}
    >
      {label}
    </button>
  );
}

/* =====================
   Nozzles
===================== */

interface PumpNozzleListProps {
  nozzleCount: number;
}

function PumpNozzleList({
  nozzleCount,
}: PumpNozzleListProps) {
  return (
    <div className="space-y-4">
      {Array.from({
        length: nozzleCount,
      }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-2xl border border-[#262626] bg-[#181818] p-4"
        >
          <div>
            <h4 className="font-medium">
              Nozzle {index + 1}
            </h4>

            <p className="text-sm text-[#737373]">
              Connected and active
            </p>
          </div>

          <span className="rounded-full bg-[#0E2D18] px-3 py-1 text-xs text-[#22C55E]">
            Active
          </span>
        </div>
      ))}
    </div>
  );
}

/* =====================
   Sales
===================== */

interface PumpSalesSummaryProps {
  pump: Pump;
}

function PumpSalesSummary({
  pump,
}: PumpSalesSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#262626] bg-[#181818] p-5">
        <p className="text-sm text-[#737373]">
          Total Sales
        </p>

        <h3 className="mt-2 text-2xl font-semibold">
          ₦
          {pump.totalSales.toLocaleString()}
        </h3>
      </div>

      <div className="rounded-2xl border border-[#262626] bg-[#181818] p-5">
        <p className="text-sm text-[#737373]">
          Volume Sold
        </p>

        <h3 className="mt-2 text-2xl font-semibold">
          {pump.volumeSold}L
        </h3>
      </div>
    </div>
  );
}

/* =====================
   Activity
===================== */

function PumpActivity() {
  const activities = [
    'Pump activated',
    'Meter reading updated',
    'Nozzle calibration completed',
    'Sales recorded',
  ];

  return (
    <div className="space-y-4">
      {activities.map(
        (activity, index) => (
          <div
            key={index}
            className="rounded-2xl border border-[#262626] bg-[#181818] p-4"
          >
            <p className="font-medium">
              {activity}
            </p>

            <p className="mt-1 text-sm text-[#737373]">
              Today • 10:30 AM
            </p>
          </div>
        ),
      )}
    </div>
  );
}