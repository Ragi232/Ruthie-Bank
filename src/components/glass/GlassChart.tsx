"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';

export const GlassChart: React.FC = () => {
  const { playHaptic } = useBank();
  const [activeDay, setActiveDay] = useState<number | null>(4); // Default to Friday

  const chartData = [
    { day: 'Mon', in: 140, out: 45 },
    { day: 'Tue', in: 85, out: 120 },
    { day: 'Wed', in: 210, out: 65 },
    { day: 'Thu', in: 95, out: 80 },
    { day: 'Fri', in: 340, out: 110 },
    { day: 'Sat', in: 120, out: 95 },
    { day: 'Sun', in: 180, out: 40 },
  ];

  const maxVal = 350;

  return (
    <div className="w-full space-y-4">
      {/* Legend & Summary */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Inflow (₦1,170k)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Outflow (₦555k)</span>
          </div>
        </div>

        {activeDay !== null && (
          <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            {chartData[activeDay].day}: +₦{chartData[activeDay].in}k / −₦{chartData[activeDay].out}k
          </p>
        )}
      </div>

      {/* Bar Chart Area */}
      <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-1 border-b border-slate-200/80 dark:border-white/10">
        {chartData.map((d, i) => {
          const inHeight = (d.in / maxVal) * 100;
          const outHeight = (d.out / maxVal) * 100;
          const isSelected = activeDay === i;

          return (
            <div
              key={d.day}
              onClick={() => {
                playHaptic('light');
                setActiveDay(i);
              }}
              className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group"
            >
              {/* Bars container */}
              <div className="w-full flex items-end justify-center gap-1 h-32">
                {/* Inflow bar */}
                <div
                  style={{ height: `${inHeight}%` }}
                  className={`w-3 sm:w-4 rounded-t-lg transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                      : 'bg-emerald-500/60 dark:bg-emerald-500/40 group-hover:bg-emerald-400'
                  }`}
                />
                {/* Outflow bar */}
                <div
                  style={{ height: `${outHeight}%` }}
                  className={`w-3 sm:w-4 rounded-t-lg transition-all duration-300 ${
                    isSelected
                      ? 'bg-slate-400 dark:bg-slate-500'
                      : 'bg-slate-200 dark:bg-slate-700/60 group-hover:bg-slate-400/80'
                  }`}
                />
              </div>

              {/* Day Label */}
              <span
                className={`text-[10px] font-semibold transition-colors ${
                  isSelected
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                }`}
              >
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
