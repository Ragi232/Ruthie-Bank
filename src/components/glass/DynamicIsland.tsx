"use client";

import React from 'react';
import { useBank } from '@/context/BankContext';
import { CheckCircle2, ShieldCheck, Sparkles, AlertCircle, X } from 'lucide-react';

export const DynamicIsland: React.FC = () => {
  const { dynamicIsland, dismissDynamicIsland } = useBank();

  if (!dynamicIsland.active) return null;

  const getIcon = () => {
    switch (dynamicIsland.type) {
      case 'success':
        return <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />;
      case 'security':
        return <ShieldCheck size={16} className="text-amber-400 shrink-0" />;
      case 'ai':
        return <Sparkles size={16} className="text-teal-300 animate-spin shrink-0" />;
      default:
        return <AlertCircle size={16} className="text-emerald-400 shrink-0" />;
    }
  };

  return (
    <aside aria-label="Dynamic Island Notification" className="fixed top-3 left-1/2 -translate-x-1/2 z-50 max-w-[92vw] w-auto">
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-950/90 text-white backdrop-blur-3xl border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 shrink-0">
          {getIcon()}
        </div>
        <div className="min-w-0 pr-1">
          <p className="text-xs font-semibold leading-tight text-white truncate">
            {dynamicIsland.title}
          </p>
          {dynamicIsland.subtitle && (
            <p className="text-[11px] leading-tight text-slate-300 truncate mt-0.5">
              {dynamicIsland.subtitle}
            </p>
          )}
        </div>
        <button
          onClick={dismissDynamicIsland}
          className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-white/10 ml-1 transition-colors"
          aria-label="Dismiss notification"
        >
          <X size={13} />
        </button>
      </div>
    </aside>
  );
};
