"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import {
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  PiggyBank,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { DynamicIslandType } from '@/types';

export const DynamicIsland: React.FC = () => {
  const { dynamicIsland, dismissDynamicIsland, playHaptic, setCurrentScreen } = useBank();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!dynamicIsland.active) {
    return (
      <aside aria-label="Ruthie Island" className="fixed top-[max(0.75rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-[60] max-w-[calc(100vw-1rem)]">
        {!isExpanded ? (
          <button type="button" onClick={() => { playHaptic('light'); setIsExpanded(true); }} className="ruthie-island-shell flex max-w-full items-center gap-2 rounded-full px-4 py-2.5 text-white transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400" aria-expanded="false" aria-label="Expand Ruthie Island">
            <span className="ruthie-island-indicator h-2 w-2 rounded-full bg-emerald-300" />
            <span className="text-xs font-semibold">Ruthie Bank</span>
            <span className="text-[10px] text-slate-300">Sandbox</span>
          </button>
        ) : (
          <div className="ruthie-island-shell w-[min(92vw,360px)] rounded-3xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-semibold">Ruthie Island</p><p className="mt-1 text-xs text-slate-300">Sandbox preview · no live banking services</p></div>
              <button type="button" onClick={() => setIsExpanded(false)} className="rounded-full p-2 text-slate-300 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400" aria-label="Collapse Ruthie Island"><ChevronUp size={16} /></button>
            </div>
          </div>
        )}
      </aside>
    );
  }

  // Whether island is currently in expanded mode (either from state or locally expanded)
  const expanded = dynamicIsland.expanded !== undefined ? dynamicIsland.expanded : isExpanded;

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    playHaptic('light');
    setIsExpanded((prev) => !prev);
  };

  const getIcon = (type: DynamicIslandType) => {
    switch (type) {
      case 'incoming':
        return <ArrowDownLeft size={16} className="text-emerald-400 shrink-0" />;
      case 'outgoing':
        return <ArrowUpRight size={16} className="text-sky-400 shrink-0" />;
      case 'status':
        return <Clock size={16} className="text-teal-300 animate-spin shrink-0" />;
      case 'security':
        return <ShieldAlert size={16} className="text-rose-400 shrink-0 animate-pulse" />;
      case 'savings':
        return <PiggyBank size={16} className="text-emerald-400 shrink-0" />;
      case 'investment':
        return <TrendingUp size={16} className="text-indigo-400 shrink-0" />;
      case 'ai':
        return <Sparkles size={16} className="text-amber-300 animate-pulse shrink-0" />;
      case 'success':
      default:
        return <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />;
    }
  };

  const getBadgeText = (type: DynamicIslandType) => {
    switch (type) {
      case 'incoming':
        return 'INCOMING PAYMENT';
      case 'outgoing':
        return 'OUTGOING TRANSFER';
      case 'status':
        return 'SETTLEMENT IN PROGRESS';
      case 'security':
        return 'SECURITY ALERT';
      case 'savings':
        return 'RUTHIE VAULT';
      case 'investment':
        return 'SECURITIES DESK';
      case 'ai':
        return 'RUTHIE AI INTELLIGENCE';
      case 'success':
      default:
        return 'LEDGER VERIFIED';
    }
  };

  const getAccentColor = (type: DynamicIslandType) => {
    switch (type) {
      case 'incoming':
        return 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30';
      case 'outgoing':
        return 'from-sky-500/20 to-blue-500/10 border-sky-500/30';
      case 'status':
        return 'from-teal-500/20 to-emerald-500/10 border-teal-500/30';
      case 'security':
        return 'from-rose-500/20 to-amber-500/10 border-rose-500/30';
      case 'savings':
        return 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30';
      case 'investment':
        return 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30';
      case 'ai':
        return 'from-amber-500/20 to-emerald-500/10 border-amber-500/30';
      case 'success':
      default:
        return 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30';
    }
  };

  return (
    <aside
      aria-label="Ruthie Island Contextual Notification"
      className="fixed top-[max(0.75rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-[60] max-w-[calc(100vw-1rem)] w-auto select-none"
    >
      {!expanded ? (
        /* COMPACT MODE CAPSULE */
        <div
          onClick={() => {
            playHaptic('light');
            setIsExpanded(true);
          }}
          className={`ruthie-island-shell group flex max-w-[calc(100vw-1rem)] items-center gap-3 px-4 py-2.5 rounded-full text-white ${getAccentColor(
            dynamicIsland.type
          )} shadow-[0_20px_45px_rgba(0,0,0,0.7)] cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-in fade-in slide-in-from-top-4`}
        >
          {/* Status Indicator Icon */}
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white/10 shrink-0 overflow-hidden border border-white/15">
            {getIcon(dynamicIsland.type)}
            <span className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping" />
          </div>

          {/* Label & Details */}
          <div className="min-w-0 pr-1 max-w-[220px] sm:max-w-[280px]">
            <p className="text-xs font-bold leading-tight text-white truncate flex items-center gap-1.5">
              <span>{dynamicIsland.title}</span>
              {dynamicIsland.amount && (
                <span className="text-emerald-400 font-mono font-extrabold">{dynamicIsland.amount}</span>
              )}
            </p>
            {dynamicIsland.subtitle && (
              <p className="text-[11px] leading-tight text-slate-300 truncate mt-0.5">
                {dynamicIsland.subtitle}
              </p>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 ml-1 pl-1 border-l border-white/10">
            <button
              onClick={toggleExpand}
              className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              title="Expand Details"
              aria-label="Expand Island Details"
            >
              <ChevronDown size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playHaptic('light');
                dismissDynamicIsland();
              }}
              className="p-1 text-slate-400 hover:text-rose-400 rounded-full hover:bg-white/10 transition-colors"
              title="Dismiss"
              aria-label="Dismiss Island Notification"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      ) : (
        /* EXPANDED INTERACTIVE MODE */
        <div
          className={`ruthie-island-shell w-[min(94vw,420px)] max-h-[85vh] overflow-y-auto rounded-3xl p-5 text-white ${getAccentColor(
            dynamicIsland.type
          )} shadow-[0_28px_60px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-200 space-y-4`}
        >
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/10 border border-white/15">
                {getIcon(dynamicIsland.type)}
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                {getBadgeText(dynamicIsland.type)}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  playHaptic('light');
                  setIsExpanded(false);
                }}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Collapse"
                aria-label="Collapse Island"
              >
                <ChevronUp size={15} />
              </button>
              <button
                onClick={() => {
                  playHaptic('light');
                  dismissDynamicIsland();
                }}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Dismiss"
                aria-label="Dismiss notification"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Main Body */}
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-bold text-white tracking-tight">{dynamicIsland.title}</h3>
              {dynamicIsland.amount && (
                <span className="text-lg font-black font-mono text-emerald-400">
                  {dynamicIsland.amount}
                </span>
              )}
            </div>
            {dynamicIsland.subtitle && (
              <p className="text-xs text-slate-300 leading-relaxed">{dynamicIsland.subtitle}</p>
            )}
          </div>

          {/* Progress / Settlement Lifecycle Bar */}
          {dynamicIsland.type === 'status' && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>Clearing & Verification</span>
                <span className="font-mono text-emerald-400">{dynamicIsland.progress || 80}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  style={{ width: `${dynamicIsland.progress || 80}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                />
              </div>
              <div className="grid grid-cols-3 text-[9px] text-slate-400 text-center pt-0.5">
                <span className="text-emerald-400 font-semibold">1. Initiated ✓</span>
                <span className="text-emerald-400 font-semibold">2. Cleared ✓</span>
                <span className="text-slate-300 font-medium">3. Finalizing</span>
              </div>
            </div>
          )}

          {/* Reference Meta if present */}
          {dynamicIsland.reference && (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-[11px]">
              <span className="text-slate-400">Audit Reference</span>
              <span className="font-mono font-semibold text-white">{dynamicIsland.reference}</span>
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            {dynamicIsland.secondaryAction ? (
              <button
                onClick={() => {
                  playHaptic('light');
                  dynamicIsland.secondaryAction?.action();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 transition-colors"
              >
                {dynamicIsland.secondaryAction.label}
              </button>
            ) : (
              <button
                onClick={() => {
                  playHaptic('light');
                  dismissDynamicIsland();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-300 transition-colors"
              >
                Dismiss
              </button>
            )}

            {dynamicIsland.primaryAction ? (
              <button
                onClick={() => {
                  playHaptic('medium');
                  dynamicIsland.primaryAction?.action();
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <span>{dynamicIsland.primaryAction.label}</span>
                <ArrowRight size={13} />
              </button>
            ) : dynamicIsland.type === 'ai' ? (
              <button
                onClick={() => {
                  playHaptic('medium');
                  dismissDynamicIsland();
                  setCurrentScreen('ai');
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-500 text-slate-950 text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <span>Open Ruthie AI</span>
                <Sparkles size={13} />
              </button>
            ) : dynamicIsland.type === 'savings' ? (
              <button
                onClick={() => {
                  playHaptic('medium');
                  dismissDynamicIsland();
                  setCurrentScreen('savings');
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <span>View Vault</span>
                <PiggyBank size={13} />
              </button>
            ) : dynamicIsland.type === 'investment' ? (
              <button
                onClick={() => {
                  playHaptic('medium');
                  dismissDynamicIsland();
                  setCurrentScreen('investments');
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <span>Portfolio</span>
                <TrendingUp size={13} />
              </button>
            ) : (
              <button
                onClick={() => {
                  playHaptic('light');
                  dismissDynamicIsland();
                  setCurrentScreen('history');
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <span>View Ledger</span>
                <ExternalLink size={13} />
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
