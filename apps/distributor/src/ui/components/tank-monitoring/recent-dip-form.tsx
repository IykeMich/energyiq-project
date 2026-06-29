import { useState } from 'react';

export function RecentDipForm() {
  const [tank, setTank] =
    useState('');
  const [litres, setLitres] =
    useState('');

  return (
    <div className="rounded-[18px] border border-[#2A2A2A] p-5">
      <h3 className="mb-4 text-white">
        Recent Today's Dip
      </h3>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          value={tank}
          onChange={(e) =>
            setTank(e.target.value)
          }
          placeholder="Select tank"
          className="flex-1 rounded-full bg-[#121212] px-4 py-3 text-white"
        />

        <input
          value={litres}
          onChange={(e) =>
            setLitres(e.target.value)
          }
          placeholder="Litres"
          className="w-30 rounded-full bg-[#121212] px-4 py-3 text-white"
        />

        <button className="rounded-full bg-[#FBC02D] px-6 py-3 font-medium text-black">
          Save
        </button>
      </div>
    </div>
  );
}