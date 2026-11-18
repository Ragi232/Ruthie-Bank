"use client";

import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { GlassBalanceCard } from '@/components/glass/GlassBalanceCard';
import { GlassTransactionItem } from '@/components/glass/GlassTransactionItem';
import { GlassChart } from '@/components/glass/GlassChart';
import { GlassNotification } from '@/components/glass/GlassNotification';
import { GlassAvatar } from '@/components/glass/GlassAvatar';
import { GlassProgressRing } from '@/components/glass/GlassProgressRing';
import {
  Bell,
  ArrowUpRight,
  Plus,
  ArrowDownLeft,
  Smartphone,
  Wifi,
  Zap,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CircleHelp,
  ArrowLeftRight,
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const {
    user,
    transactions,
    savingsGoals,
    userInvestments,
    setCurrentScreen,
    notifications,
    showDynamicIsland,
    playHaptic,
  } = useBank();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // 10 Quick Actions per specification
  const quickActions = [
    {
      label: 'Add Money',
      icon: Plus,
      color: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20',
      action: () => {
        showDynamicIsland('Add Money', `Fund your account via transfer to ${user.accountNumber}`, 'success');
      },
    },
    {
      label: 'Transfer',
      icon: ArrowUpRight,
      color: 'text-teal-500 bg-teal-500/10 dark:bg-teal-500/20',
      action: () => setCurrentScreen('transfers'),
    },
    {
      label: 'Withdraw',
      icon: ArrowDownLeft,
      color: 'text-blue-500 bg-blue-500/10 dark:bg-blue-500/20',
      action: () => {
        showDynamicIsland('ATM / Cash Out', 'Scan Ruthie QR code at any partner ATM', 'success');
      },
    },
    {
      label: 'Airtime',
      icon: Smartphone,
      color: 'text-amber-500 bg-amber-500/10 dark:bg-amber-500/20',
      action: () => setCurrentScreen('bills'),
    },
    {
      label: 'Data Bundle',
      icon: Wifi,
      color: 'text-yellow-500 bg-yellow-500/10 dark:bg-yellow-500/20',
      action: () => setCurrentScreen('bills'),
    },
    {
      label: 'Pay Bills',
      icon: Zap,
      color: 'text-orange-500 bg-orange-500/10 dark:bg-orange-500/20',
      action: () => setCurrentScreen('bills'),
    },
    {
      label: 'Savings',
      icon: PiggyBank,
      color: 'text-emerald-600 bg-emerald-600/10 dark:bg-emerald-600/20',
      action: () => setCurrentScreen('savings'),
    },
    {
      label: 'Invest',
      icon: TrendingUp,
      color: 'text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20',
      action: () => setCurrentScreen('investments'),
    },
    {
      label: 'Loans',
      icon: CreditCard,
      color: 'text-rose-500 bg-rose-500/10 dark:bg-rose-500/20',
      action: () => setCurrentScreen('loans'),
    },
    {
      label: 'Bookings',
      icon: Compass,
      color: 'text-purple-500 bg-purple-500/10 dark:bg-purple-500/20',
      action: () => setCurrentScreen('bookings'),
    },
  ];

  // Calculate live portfolio summary
  const totalSaved = savingsGoals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalInvestedNGN = userInvestments.reduce((acc, inv) => {
    return acc + (inv.currency === 'NGN' ? inv.currentValue : inv.currentValue * 1540.5);
  }, 0);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-24 md:pb-12">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between gap-4 pt-1 pb-3 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playHaptic('light');
              setCurrentScreen('profile');
            }}
            className="md:hidden"
          >
            <GlassAvatar name={`${user.firstName} ${user.lastName}`} size="md" tier={user.tier} />
          </button>
          <div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Tuesday, 18 November 2026
            </p>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Good morning, {user.firstName}</span>
              <span className="text-emerald-500 text-base">✦</span>
            </h1>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playHaptic('light');
              showDynamicIsland('Priority Support', 'Ruthie Concierge 24/7 is standing by', 'success');
            }}
            aria-label="Ruthie Help and Concierge"
            className="hidden sm:flex items-center justify-center p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <CircleHelp size={19} />
          </button>

          <button
            onClick={() => {
              playHaptic('light');
              setNotificationOpen(true);
            }}
            aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
            className="relative flex items-center justify-center p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={14} />
            <span>Tier 3 Verified</span>
          </div>
        </div>
      </header>

      {/* Hero Balance Card & Ruthie AI Assistant Banner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassBalanceCard />
        </div>

        {/* Ruthie AI Assistant Shortcut Card */}
        <div className="relative rounded-[32px] p-6 bg-gradient-to-br from-[#063f33]/40 via-[#072439]/60 to-[#031320]/80 backdrop-blur-3xl border border-emerald-400/30 shadow-[0_16px_40px_rgba(5,150,105,0.2)] flex flex-col justify-between overflow-hidden">
          <div className="pointer-events-none absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-emerald-400/15 blur-2xl" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Sparkles size={16} className="text-emerald-300 animate-spin" />
                Ruthie AI Companion
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-400/30">
                ACTIVE
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2 leading-snug">
              &quot;You have ₦150,000 surplus liquidity this month. Sweep to Vault for 18.5% APY?&quot;
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your discretionary spending is down 11%. Compounding this surplus earns ₦27,750 extra passive yield.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={() => {
                playHaptic('medium');
                setCurrentScreen('ai');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs shadow-lg hover:brightness-105 transition-all active:scale-95 cursor-pointer"
            >
              <span>Ask Ruthie AI</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS RESPONSIVE GRID (10 Actions) */}
      <section aria-labelledby="quick-actions-heading" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 id="quick-actions-heading" className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Quick Actions
          </h2>
          <span className="text-xs text-slate-400">10 services</span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => {
                  playHaptic('light');
                  action.action();
                }}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-white/70 dark:bg-white/[0.04] hover:bg-white/95 dark:hover:bg-white/[0.09] border border-slate-200/80 dark:border-white/10 backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 group cursor-pointer shadow-sm"
              >
                <div
                  className={`flex items-center justify-center w-11 h-11 rounded-2xl ${action.color} border border-white/10 group-hover:scale-105 transition-transform duration-200`}
                >
                  <Icon size={20} />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 text-center truncate max-w-full">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Live FX Rates Ticker Card */}
      <section aria-labelledby="fx-ticker-heading" className="rounded-3xl p-4 bg-white/60 dark:bg-[#071726]/60 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <ArrowLeftRight size={15} className="text-emerald-500" />
            <h2 id="fx-ticker-heading" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Live Exchange Rates (Institutional Mid-Market)
            </h2>
          </div>
          <button
            onClick={() => setCurrentScreen('wallets')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Swap Currencies →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { pair: 'USD / NGN', rate: '₦1,540.50', change: '+0.8%', flag: '🇺🇸' },
            { pair: 'GBP / NGN', rate: '₦1,985.20', change: '+0.4%', flag: '🇬🇧' },
            { pair: 'EUR / NGN', rate: '₦1,675.80', change: '-0.2%', flag: '🇪🇺' },
            { pair: 'CAD / NGN', rate: '₦1,120.40', change: '+0.5%', flag: '🇨🇦' },
          ].map((r) => (
            <div
              key={r.pair}
              className="p-3 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{r.flag}</span>
                <div>
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                    {r.pair}
                  </p>
                  <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 leading-tight">
                    {r.rate}
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  r.change.startsWith('+')
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-500'
                }`}
              >
                {r.change}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Split: Recent Activity & Growth Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Activity (2 cols) */}
        <section aria-labelledby="recent-activity-heading" className="lg:col-span-2 rounded-3xl p-6 bg-white/70 dark:bg-[#071726]/75 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="recent-activity-heading" className="text-base font-bold text-slate-900 dark:text-white">
                Recent Activity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audited real-time ledger entries
              </p>
            </div>
            <button
              onClick={() => {
                playHaptic('light');
                setCurrentScreen('history');
              }}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>All Transactions</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {transactions.slice(0, 5).map((tx) => (
              <GlassTransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        </section>

        {/* Right Column: Savings & Spending Summary (1 col) */}
        <div className="space-y-6">
          {/* Savings Summary Widget */}
          <section aria-labelledby="savings-vault-heading" className="rounded-3xl p-6 bg-white/70 dark:bg-[#071726]/75 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PiggyBank size={18} className="text-emerald-500" />
                <h2 id="savings-vault-heading" className="text-sm font-bold text-slate-900 dark:text-white">
                  Ruthie Vault & Savings
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                18.5% APY
              </span>
            </div>

            <div className="flex items-center gap-4">
              <GlassProgressRing progress={65} size={88} strokeWidth={8} color="#10b981" label="Target" />
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                  Total Accumulated
                </p>
                <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  ₦{totalSaved.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  +₦50,128.40 interest accrued
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('savings')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-semibold text-slate-800 dark:text-white transition-colors"
            >
              View Savings Goals →
            </button>
          </section>

          {/* Investment Portfolio Preview */}
          <section aria-labelledby="investments-heading" className="rounded-3xl p-6 bg-white/70 dark:bg-[#071726]/75 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-500" />
                <h2 id="investments-heading" className="text-sm font-bold text-slate-900 dark:text-white">
                  Investments
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400">
                +14.8% YTD
              </span>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                Active Positions
              </p>
              <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                ₦{totalInvestedNGN.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Includes FRN Eurobond ($2,746.25) & Sovereign Treasury Fund
              </p>
            </div>

            <button
              onClick={() => setCurrentScreen('investments')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-semibold text-slate-800 dark:text-white transition-colors"
            >
              Explore Products →
            </button>
          </section>

          {/* Spending Analysis Card */}
          <section aria-labelledby="weekly-cashflow-heading" className="rounded-3xl p-6 bg-white/70 dark:bg-[#071726]/75 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
            <h2 id="weekly-cashflow-heading" className="text-sm font-bold text-slate-900 dark:text-white">
              Weekly Cash Flow
            </h2>
            <GlassChart />
          </section>
        </div>
      </div>

      {/* Notifications Drawer Modal */}
      <GlassNotification isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />
    </div>
  );
};
