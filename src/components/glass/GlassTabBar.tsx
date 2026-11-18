"use client";

import React from 'react';
import { useBank } from '@/context/BankContext';

interface GlassTabBarProps<T extends string> {
  tabs: { id: T; label: string; count?: number; icon?: React.ReactNode }[];
  activeTab: T;
  onChange: (id: T) => void;
  className?: string;
}

export function GlassTabBar<T extends string>({
  tabs,
  activeTab,
  onChange,
  className = '',
}: GlassTabBarProps<T>) {
  const { playHaptic } = useBank();

  return (
    <div
      className={`flex items-center p-1 rounded-2xl bg-slate-100/80 dark:bg-white/[0.06] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 select-none overflow-x-auto ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              playHaptic('light');
              onChange(tab.id);
            }}
            className={`flex-1 min-w-[70px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-white dark:bg-[#0e273f] text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-white/15'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
